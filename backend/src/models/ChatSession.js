const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required for chat session']
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  messages: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [5000, 'Message content cannot exceed 5000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      suggestedAlumni: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      actionTaken: {
        type: String,
        maxlength: [200, 'Action description cannot exceed 200 characters']
      },
      intent: {
        type: String,
        enum: [
          'greeting',
          'find_alumni',
          'career_advice',
          'job_search',
          'networking',
          'events',
          'general_question',
          'goodbye'
        ]
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1
      },
      entities: [{
        type: {
          type: String,
          enum: ['skill', 'company', 'location', 'industry', 'role']
        },
        value: String,
        confidence: {
          type: Number,
          min: 0,
          max: 1
        }
      }],
      responseTime: {
        type: Number // in milliseconds
      }
    },
    feedback: {
      helpful: {
        type: Boolean
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: [500, 'Feedback comment cannot exceed 500 characters']
      }
    }
  }],
  context: {
    userProfile: {
      role: String,
      interests: [String],
      expertise: [String],
      major: String,
      company: String,
      graduationYear: Number,
      location: String
    },
    preferences: {
      preferredIndustries: [String],
      careerGoals: [String],
      networkingInterests: [String],
      mentorshipNeeds: [String]
    },
    conversationHistory: {
      totalMessages: {
        type: Number,
        default: 0
      },
      topIntents: [{
        intent: String,
        count: Number
      }],
      lastTopics: [String],
      frequentQuestions: [String]
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    sessionDuration: {
      type: Number,
      default: 0 // in minutes
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  endedAt: Date,
  endReason: {
    type: String,
    enum: ['user_ended', 'timeout', 'system_ended', 'error']
  },
  analytics: {
    totalInteractions: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    },
    userSatisfactionScore: {
      type: Number,
      min: 0,
      max: 5
    },
    resolvedQueries: {
      type: Number,
      default: 0
    },
    escalatedToHuman: {
      type: Boolean,
      default: false
    }
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
chatSessionSchema.index({ user: 1 });
chatSessionSchema.index({ sessionId: 1 });
chatSessionSchema.index({ isActive: 1 });
chatSessionSchema.index({ createdAt: -1 });
chatSessionSchema.index({ 'context.lastActivity': -1 });

// Virtual for message count
chatSessionSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Virtual for session duration in minutes
chatSessionSchema.virtual('durationMinutes').get(function() {
  if (this.endedAt) {
    return Math.floor((this.endedAt - this.createdAt) / (1000 * 60));
  }
  return Math.floor((new Date() - this.createdAt) / (1000 * 60));
});

// Virtual for last message
chatSessionSchema.virtual('lastMessage').get(function() {
  return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
});

// Pre-save middleware to update analytics
chatSessionSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.analytics.totalInteractions = this.messages.filter(m => m.role === 'user').length;
    this.context.conversationHistory.totalMessages = this.messages.length;
    this.context.lastActivity = new Date();
    
    // Calculate average response time
    const assistantMessages = this.messages.filter(m => m.role === 'assistant' && m.metadata.responseTime);
    if (assistantMessages.length > 0) {
      const totalResponseTime = assistantMessages.reduce((sum, msg) => sum + msg.metadata.responseTime, 0);
      this.analytics.averageResponseTime = totalResponseTime / assistantMessages.length;
    }
    
    // Update top intents
    const intents = this.messages
      .filter(m => m.metadata && m.metadata.intent)
      .map(m => m.metadata.intent);
    
    const intentCounts = {};
    intents.forEach(intent => {
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });
    
    this.context.conversationHistory.topIntents = Object.entries(intentCounts)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
  
  next();
});

// Method to add message
chatSessionSchema.methods.addMessage = function(role, content, metadata = {}) {
  const message = {
    role,
    content: content.trim(),
    timestamp: new Date(),
    metadata
  };
  
  this.messages.push(message);
  this.context.lastActivity = new Date();
  
  return message;
};

// Method to end session
chatSessionSchema.methods.endSession = function(reason = 'user_ended') {
  this.isActive = false;
  this.endedAt = new Date();
  this.endReason = reason;
  this.context.sessionDuration = this.durationMinutes;
  
  return this.save();
};

// Method to get conversation summary
chatSessionSchema.methods.getConversationSummary = function() {
  const userMessages = this.messages.filter(m => m.role === 'user');
  const assistantMessages = this.messages.filter(m => m.role === 'assistant');
  
  return {
    totalMessages: this.messages.length,
    userMessages: userMessages.length,
    assistantMessages: assistantMessages.length,
    duration: this.durationMinutes,
    topIntents: this.context.conversationHistory.topIntents,
    startTime: this.createdAt,
    endTime: this.endedAt || new Date(),
    isActive: this.isActive
  };
};

// Method to update user satisfaction
chatSessionSchema.methods.updateSatisfaction = function(rating, feedback) {
  this.analytics.userSatisfactionScore = rating;
  
  if (feedback) {
    // Add feedback to the last assistant message
    const lastAssistantMessage = [...this.messages]
      .reverse()
      .find(m => m.role === 'assistant');
    
    if (lastAssistantMessage) {
      lastAssistantMessage.feedback = {
        helpful: rating >= 3,
        rating,
        comment: feedback
      };
    }
  }
  
  return this.save();
};

// Static method to find active sessions
chatSessionSchema.statics.findActiveSessions = function(userId) {
  return this.find({
    user: userId,
    isActive: true
  }).sort({ 'context.lastActivity': -1 });
};

// Static method to get user chat history
chatSessionSchema.statics.getUserHistory = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('sessionId createdAt endedAt messageCount analytics.userSatisfactionScore');
};

// Static method to get analytics for a user
chatSessionSchema.statics.getUserAnalytics = function(userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$user',
        totalSessions: { $sum: 1 },
        totalMessages: { $sum: '$analytics.totalInteractions' },
        averageSatisfaction: { $avg: '$analytics.userSatisfactionScore' },
        totalDuration: { $sum: '$context.sessionDuration' },
        activeSessions: {
          $sum: { $cond: ['$isActive', 1, 0] }
        }
      }
    }
  ]);
};

// Method to check if session should timeout
chatSessionSchema.methods.shouldTimeout = function(timeoutMinutes = 30) {
  if (!this.isActive) return false;
  
  const now = new Date();
  const lastActivity = this.context.lastActivity || this.createdAt;
  const diffMinutes = (now - lastActivity) / (1000 * 60);
  
  return diffMinutes > timeoutMinutes;
};

// Static method to cleanup inactive sessions
chatSessionSchema.statics.cleanupInactiveSessions = function(timeoutMinutes = 30) {
  const cutoffTime = new Date(Date.now() - timeoutMinutes * 60 * 1000);
  
  return this.updateMany(
    {
      isActive: true,
      'context.lastActivity': { $lt: cutoffTime }
    },
    {
      $set: {
        isActive: false,
        endedAt: new Date(),
        endReason: 'timeout'
      }
    }
  );
};

module.exports = mongoose.model('ChatSession', chatSessionSchema);