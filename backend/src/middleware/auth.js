const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT token middleware
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (if using cookie-based auth)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Access denied. No token provided.'
        }
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Token is valid but user not found'
          }
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'USER_INACTIVE',
            message: 'User account is inactive'
          }
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Add user to request object
      req.user = user;
      next();
    } catch (tokenError) {
      logger.error('Token verification error:', tokenError);
      
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Token has expired'
          }
        });
      }
      
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token'
        }
      });
    }
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication error'
      }
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Please authenticate first'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Access denied. Required roles: ${roles.join(', ')}`
        }
      });
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Silently fail for optional auth
        logger.debug('Optional auth failed:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next(); // Continue without authentication
  }
};

// Check if user owns resource
const checkOwnership = (resourceModel, resourceIdParam = 'id', userField = 'author') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resource not found'
          }
        });
      }

      // Check if user owns the resource
      const resourceUserId = resource[userField]?.toString() || resource[userField];
      const currentUserId = req.user._id.toString();

      if (resourceUserId !== currentUserId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'NOT_AUTHORIZED',
            message: 'You can only access your own resources'
          }
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      logger.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'OWNERSHIP_CHECK_ERROR',
          message: 'Error checking resource ownership'
        }
      });
    }
  };
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    if (attempts.has(key)) {
      const userAttempts = attempts.get(key).filter(time => time > windowStart);
      attempts.set(key, userAttempts);
    }

    const currentAttempts = attempts.get(key) || [];

    if (currentAttempts.length >= max) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many attempts. Please try again later.',
          retryAfter: Math.ceil((currentAttempts[0] + windowMs - now) / 1000)
        }
      });
    }

    // Add current attempt
    currentAttempts.push(now);
    attempts.set(key, currentAttempts);

    next();
  };
};

// Validate user profile completeness
const requireCompleteProfile = (requiredFields = []) => {
  return (req, res, next) => {
    const user = req.user;
    const missingFields = [];

    // Check basic required fields
    const defaultRequired = ['profile.firstName', 'profile.lastName'];
    const allRequired = [...defaultRequired, ...requiredFields];

    allRequired.forEach(field => {
      const fieldParts = field.split('.');
      let value = user;
      
      for (const part of fieldParts) {
        value = value?.[part];
      }
      
      if (!value || (Array.isArray(value) && value.length === 0)) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INCOMPLETE_PROFILE',
          message: 'Please complete your profile before accessing this feature',
          missingFields
        }
      });
    }

    next();
  };
};

// Check email verification status
const requireEmailVerification = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email address to access this feature'
      }
    });
  }
  next();
};

module.exports = {
  generateToken,
  authenticate,
  authorize,
  optionalAuth,
  checkOwnership,
  sensitiveOperationLimit,
  requireCompleteProfile,
  requireEmailVerification
};