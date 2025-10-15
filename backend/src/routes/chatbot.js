const express = require('express');
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');
const ChatSession = require('../models/ChatSession');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @route   POST /api/chatbot/session
// @desc    Create a new chat session
// @access  Private
router.post('/session', authenticate, async (req, res) => {
  try {
    // Check for existing active session
    let session = await ChatSession.findOne({
      user: req.user._id,
      isActive: true
    });

    if (!session) {
      session = new ChatSession({
        user: req.user._id,
        context: {
          userProfile: {
            role: req.user.role,
            interests: req.user.profile?.interests || [],
            expertise: req.user.profile?.expertise || [],
            major: req.user.profile?.major,
            company: req.user.profile?.company,
            graduationYear: req.user.profile?.graduationYear,
            location: req.user.profile?.location
          }
        }
      });
      await session.save();
    }

    res.json({
      success: true,
      data: {
        sessionId: session.sessionId
      }
    });

  } catch (error) {
    logger.error('Create chat session error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_SESSION_ERROR',
        message: 'Error creating chat session'
      }
    });
  }
});

// @route   POST /api/chatbot/chat
// @desc    Send message to chatbot
// @access  Private
router.post('/chat', 
  authenticate,
  [
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters'),
    body('sessionId')
      .notEmpty()
      .withMessage('Session ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors.array()
          }
        });
      }

      const { message, sessionId, userProfile } = req.body;
      const startTime = Date.now();

      // Find chat session
      const session = await ChatSession.findOne({
        sessionId,
        user: req.user._id,
        isActive: true
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Chat session not found'
          }
        });
      }

      // Add user message to session
      session.addMessage('user', message);

      // Prepare context for AI
      const systemPrompt = `You are an AI assistant for ALUMNET, an alumni engagement platform. 
      Help users with:
      - Finding alumni connections based on interests, skills, or career goals
      - Career advice and mentorship opportunities
      - Job search and networking
      - Platform navigation and features
      
      User Profile:
      - Role: ${req.user.role}
      - Interests: ${req.user.profile?.interests?.join(', ') || 'Not specified'}
      - Major: ${req.user.profile?.major || 'Not specified'}
      - Location: ${req.user.profile?.location || 'Not specified'}
      
      Be helpful, concise, and professional. If asked to find alumni, suggest specific search criteria.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...session.messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      try {
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7
        });

        const aiResponse = completion.choices[0].message.content;
        const responseTime = Date.now() - startTime;

        // Analyze intent (simplified)
        let intent = 'general_question';
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('alumni') || lowerMessage.includes('connect')) {
          intent = 'find_alumni';
        } else if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
          intent = 'job_search';
        } else if (lowerMessage.includes('event') || lowerMessage.includes('networking')) {
          intent = 'networking';
        }

        // Find suggested alumni based on intent
        let suggestedAlumni = [];
        if (intent === 'find_alumni' || intent === 'job_search') {
          suggestedAlumni = await findRelevantAlumni(req.user, message);
        }

        // Add AI response to session
        const assistantMessage = session.addMessage('assistant', aiResponse, {
          intent,
          confidence: 0.8,
          responseTime,
          suggestedAlumni: suggestedAlumni.map(a => a._id),
          actionTaken: suggestedAlumni.length > 0 ? 'Found relevant alumni' : null
        });

        await session.save();

        res.json({
          success: true,
          data: {
            message: aiResponse,
            suggestedAlumni,
            actionTaken: assistantMessage.metadata.actionTaken,
            sessionId: session.sessionId
          }
        });

      } catch (openaiError) {
        logger.error('OpenAI API error:', openaiError);
        
        // Fallback response
        const fallbackResponse = "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support if the issue persists.";
        
        session.addMessage('assistant', fallbackResponse, {
          intent: 'error',
          responseTime: Date.now() - startTime
        });
        await session.save();

        res.json({
          success: true,
          data: {
            message: fallbackResponse,
            suggestedAlumni: [],
            sessionId: session.sessionId
          }
        });
      }

    } catch (error) {
      logger.error('Chat error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'CHAT_ERROR',
          message: 'Error processing chat message'
        }
      });
    }
  }
);

// @route   GET /api/chatbot/suggestions
// @desc    Get AI-powered alumni suggestions
// @access  Private
router.get('/suggestions', authenticate, async (req, res) => {
  try {
    const suggestions = await findRelevantAlumni(req.user, req.query.query || '');
    
    res.json({
      success: true,
      data: {
        suggestions
      }
    });

  } catch (error) {
    logger.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_SUGGESTIONS_ERROR',
        message: 'Error getting alumni suggestions'
      }
    });
  }
});

// Helper function to find relevant alumni
async function findRelevantAlumni(user, query = '') {
  try {
    let matchQuery = {
      role: 'alumni',
      isActive: true,
      'privacy.profileVisible': true
    };

    // Build matching criteria based on user profile and query
    const matchCriteria = [];

    // Match by interests/expertise
    if (user.profile?.interests?.length > 0) {
      matchCriteria.push({
        'profile.expertise': { $in: user.profile.interests }
      });
    }

    // Match by major
    if (user.profile?.major) {
      matchCriteria.push({
        'profile.major': user.profile.major
      });
    }

    // Match by query keywords
    if (query) {
      const queryRegex = new RegExp(query, 'i');
      matchCriteria.push({
        $or: [
          { 'profile.company': queryRegex },
          { 'profile.position': queryRegex },
          { 'profile.expertise': { $in: [queryRegex] } }
        ]
      });
    }

    if (matchCriteria.length > 0) {
      matchQuery.$or = matchCriteria;
    }

    const alumni = await User.find(matchQuery)
      .limit(5)
      .select('profile githubData')
      .lean();

    // Add match score (simplified)
    return alumni.map(person => ({
      ...person,
      matchScore: Math.floor(Math.random() * 30) + 70 // Simplified scoring
    }));

  } catch (error) {
    logger.error('Find relevant alumni error:', error);
    return [];
  }
}

module.exports = router;