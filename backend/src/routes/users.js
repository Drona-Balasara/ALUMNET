const express = require('express');
const { body, validationResult, query } = require('express-validator');
const axios = require('axios');
const User = require('../models/User');
const { authenticate, authorize, checkOwnership } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public (with privacy controls)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Check privacy settings
    if (!user.privacy.profileVisible) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PROFILE_PRIVATE',
          message: 'This profile is private'
        }
      });
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_USER_ERROR',
        message: 'Error fetching user profile'
      }
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (own profile only)
router.put('/:id', 
  authenticate,
  checkOwnership(User, 'id', '_id'),
  [
    body('profile.firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('profile.lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('profile.bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('profile.location')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Location cannot exceed 100 characters'),
    body('profile.phone')
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Please enter a valid phone number'),
    body('profile.linkedIn')
      .optional()
      .matches(/^https?:\/\/(www\.)?linkedin\.com\/.*$/)
      .withMessage('Please enter a valid LinkedIn URL'),
    body('profile.github')
      .optional()
      .matches(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/)
      .withMessage('Please enter a valid GitHub username')
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

      const { profile, privacy } = req.body;
      const user = req.resource; // From checkOwnership middleware

      // Update profile fields
      if (profile) {
        Object.keys(profile).forEach(key => {
          if (profile[key] !== undefined) {
            user.profile[key] = profile[key];
          }
        });
      }

      // Update privacy settings
      if (privacy) {
        Object.keys(privacy).forEach(key => {
          if (privacy[key] !== undefined) {
            user.privacy[key] = privacy[key];
          }
        });
      }

      await user.save();

      logger.info(`User profile updated: ${user.email}`);

      res.json({
        success: true,
        data: {
          user: user.getPublicProfile()
        },
        message: 'Profile updated successfully'
      });

    } catch (error) {
      logger.error('Update user profile error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_USER_ERROR',
          message: 'Error updating user profile'
        }
      });
    }
  }
);

// @route   GET /api/users/alumni
// @desc    Get alumni list with filters
// @access  Public
router.get('/alumni', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort').optional().isIn(['recent', 'name', 'graduation_year', 'github_activity']),
  query('filter').optional().isIn(['all', 'mentoring', 'recent_grad', 'github_active', 'hiring'])
], async (req, res) => {
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || 'recent';
    const filter = req.query.filter || 'all';
    const search = req.query.search;

    const skip = (page - 1) * limit;

    // Build query
    let query = { 
      role: 'alumni', 
      isActive: true,
      'privacy.profileVisible': true
    };

    // Apply filters
    if (filter === 'mentoring') {
      query['profile.mentoring'] = true;
    } else if (filter === 'recent_grad') {
      const currentYear = new Date().getFullYear();
      query['profile.graduationYear'] = { $gte: currentYear - 2 };
    } else if (filter === 'github_active') {
      query['githubData.repositories.0'] = { $exists: true };
    }

    // Apply search
    if (search) {
      query.$or = [
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } },
        { 'profile.company': { $regex: search, $options: 'i' } },
        { 'profile.position': { $regex: search, $options: 'i' } },
        { 'profile.expertise': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    let sortQuery = {};
    switch (sort) {
      case 'name':
        sortQuery = { 'profile.firstName': 1, 'profile.lastName': 1 };
        break;
      case 'graduation_year':
        sortQuery = { 'profile.graduationYear': -1 };
        break;
      case 'github_activity':
        sortQuery = { 'githubData.totalStars': -1, 'githubData.totalRepos': -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const [alumni, total] = await Promise.all([
      User.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .select('-password -emailVerificationToken -passwordResetToken'),
      User.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        alumni: alumni.map(user => user.getPublicProfile()),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    logger.error('Get alumni list error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_ALUMNI_ERROR',
        message: 'Error fetching alumni list'
      }
    });
  }
});

// @route   GET /api/users/alumni/featured
// @desc    Get featured alumni
// @access  Public
router.get('/alumni/featured', async (req, res) => {
  try {
    // For now, return alumni with most GitHub activity or those available for mentoring
    const featuredAlumni = await User.find({
      role: 'alumni',
      isActive: true,
      'privacy.profileVisible': true,
      $or: [
        { 'profile.mentoring': true },
        { 'githubData.totalStars': { $gte: 10 } }
      ]
    })
    .sort({ 'githubData.totalStars': -1, 'profile.mentoring': -1 })
    .limit(6)
    .select('-password -emailVerificationToken -passwordResetToken');

    res.json({
      success: true,
      data: {
        alumni: featuredAlumni.map(user => user.getPublicProfile())
      }
    });

  } catch (error) {
    logger.error('Get featured alumni error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_FEATURED_ALUMNI_ERROR',
        message: 'Error fetching featured alumni'
      }
    });
  }
});

// @route   GET /api/users/:id/repos
// @desc    Get user's GitHub repositories
// @access  Public (if privacy allows)
router.get('/:id/repos', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    if (!user.privacy.githubVisible) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'GITHUB_PRIVATE',
          message: 'GitHub repositories are private'
        }
      });
    }

    const sort = req.query.sort || 'updated';
    let repositories = user.githubData.repositories || [];

    // Sort repositories
    switch (sort) {
      case 'stars':
        repositories.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        break;
      case 'created':
        repositories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'name':
        repositories.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        repositories.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }

    res.json({
      success: true,
      data: {
        repositories,
        lastSync: user.githubData.lastSync,
        totalRepos: user.githubData.totalRepos,
        totalStars: user.githubData.totalStars
      }
    });

  } catch (error) {
    logger.error('Get user repositories error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_REPOS_ERROR',
        message: 'Error fetching repositories'
      }
    });
  }
});

// @route   POST /api/users/:id/repos/sync
// @desc    Sync user's GitHub repositories
// @access  Private (own profile only)
router.post('/:id/repos/sync',
  authenticate,
  checkOwnership(User, 'id', '_id'),
  async (req, res) => {
    try {
      const user = req.resource;

      if (!user.profile.github) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_GITHUB_USERNAME',
            message: 'GitHub username not set in profile'
          }
        });
      }

      // Fetch repositories from GitHub API
      try {
        const response = await axios.get(`https://api.github.com/users/${user.profile.github}/repos`, {
          params: {
            sort: 'updated',
            per_page: 100
          },
          headers: {
            'User-Agent': 'ALUMNET-Platform'
          }
        });

        const repos = response.data.map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          size: repo.size,
          topics: repo.topics || [],
          lastUpdated: repo.updated_at,
          createdAt: repo.created_at
        }));

        // Update user's GitHub data
        user.githubData = {
          username: user.profile.github,
          repositories: repos,
          lastSync: new Date(),
          totalStars: repos.reduce((sum, repo) => sum + repo.stars, 0),
          totalRepos: repos.length
        };

        await user.save();

        logger.info(`GitHub repositories synced for user: ${user.email}`);

        res.json({
          success: true,
          data: {
            repositories: repos,
            totalRepos: repos.length,
            totalStars: user.githubData.totalStars,
            lastSync: user.githubData.lastSync
          },
          message: 'Repositories synced successfully'
        });

      } catch (githubError) {
        logger.error('GitHub API error:', githubError);
        
        if (githubError.response?.status === 404) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'GITHUB_USER_NOT_FOUND',
              message: 'GitHub user not found'
            }
          });
        }

        return res.status(500).json({
          success: false,
          error: {
            code: 'GITHUB_API_ERROR',
            message: 'Error fetching data from GitHub'
          }
        });
      }

    } catch (error) {
      logger.error('Sync repositories error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SYNC_REPOS_ERROR',
          message: 'Error syncing repositories'
        }
      });
    }
  }
);

// @route   POST /api/users/github/connect
// @desc    Connect GitHub account
// @access  Private
router.post('/github/connect',
  authenticate,
  [
    body('username')
      .matches(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/)
      .withMessage('Please enter a valid GitHub username')
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

      const { username } = req.body;
      const user = req.user;

      // Verify GitHub username exists
      try {
        await axios.get(`https://api.github.com/users/${username}`, {
          headers: {
            'User-Agent': 'ALUMNET-Platform'
          }
        });
      } catch (githubError) {
        if (githubError.response?.status === 404) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'GITHUB_USER_NOT_FOUND',
              message: 'GitHub user not found'
            }
          });
        }
        throw githubError;
      }

      // Update user profile
      user.profile.github = username;
      await user.save();

      logger.info(`GitHub account connected for user: ${user.email}`);

      res.json({
        success: true,
        message: 'GitHub account connected successfully'
      });

    } catch (error) {
      logger.error('Connect GitHub error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'CONNECT_GITHUB_ERROR',
          message: 'Error connecting GitHub account'
        }
      });
    }
  }
);

// @route   GET /api/users/search
// @desc    Search users
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('type').optional().isIn(['all', 'alumni', 'students']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
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

    const { q, type = 'all', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      isActive: true,
      'privacy.profileVisible': true,
      $or: [
        { 'profile.firstName': { $regex: q, $options: 'i' } },
        { 'profile.lastName': { $regex: q, $options: 'i' } },
        { 'profile.company': { $regex: q, $options: 'i' } },
        { 'profile.position': { $regex: q, $options: 'i' } },
        { 'profile.expertise': { $in: [new RegExp(q, 'i')] } },
        { 'profile.interests': { $in: [new RegExp(q, 'i')] } }
      ]
    };

    if (type !== 'all') {
      query.role = type === 'alumni' ? 'alumni' : 'student';
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password -emailVerificationToken -passwordResetToken'),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        users: users.map(user => user.getPublicProfile()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SEARCH_USERS_ERROR',
        message: 'Error searching users'
      }
    });
  }
});

module.exports = router;