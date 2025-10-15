const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const { generateToken, authenticate, sensitiveOperationLimit } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .isIn(['student', 'alumni'])
    .withMessage('Role must be either student or alumni'),
  body('profile.firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('profile.lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check for validation errors
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

    const { email, password, role, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      role,
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        ...profile
      }
    });

    // Generate email verification token
    user.emailVerificationToken = crypto.randomBytes(32).toString('hex');

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;

    logger.info(`New user registered: ${email} (${role})`);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: userResponse
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: 'Error creating user account'
      }
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, sensitiveOperationLimit(), async (req, res) => {
  try {
    // Check for validation errors
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

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Your account has been deactivated'
        }
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      data: {
        token,
        user: userResponse
      },
      message: 'Login successful'
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Error during login'
      }
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_USER_ERROR',
        message: 'Error fetching user data'
      }
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', authenticate, async (req, res) => {
  try {
    // Generate new token
    const token = generateToken(req.user._id);

    res.json({
      success: true,
      data: {
        token
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TOKEN_REFRESH_ERROR',
        message: 'Error refreshing token'
      }
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticate, async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can log the event and potentially blacklist the token
    
    logger.info(`User logged out: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_ERROR',
        message: 'Error during logout'
      }
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', forgotPasswordValidation, sensitiveOperationLimit(), async (req, res) => {
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

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // TODO: Send email with reset link
    // const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    
    logger.info(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: 'Password reset link sent to email',
      // In development, return the token
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FORGOT_PASSWORD_ERROR',
        message: 'Error processing password reset request'
      }
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', resetPasswordValidation, sensitiveOperationLimit(), async (req, res) => {
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

    const { token, password } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired reset token'
        }
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    logger.info(`Password reset completed for: ${user.email}`);

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'RESET_PASSWORD_ERROR',
        message: 'Error resetting password'
      }
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TOKEN_REQUIRED',
          message: 'Verification token is required'
        }
      });
    }

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid verification token'
        }
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    logger.info(`Email verified for: ${user.email}`);

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_VERIFICATION_ERROR',
        message: 'Error verifying email'
      }
    });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Private
router.post('/resend-verification', authenticate, sensitiveOperationLimit(), async (req, res) => {
  try {
    const user = req.user;

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_VERIFIED',
          message: 'Email is already verified'
        }
      });
    }

    // Generate new verification token
    user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
    await user.save();

    // TODO: Send verification email

    logger.info(`Verification email resent to: ${user.email}`);

    res.json({
      success: true,
      message: 'Verification email sent',
      // In development, return the token
      ...(process.env.NODE_ENV === 'development' && { 
        verificationToken: user.emailVerificationToken 
      })
    });

  } catch (error) {
    logger.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'RESEND_VERIFICATION_ERROR',
        message: 'Error resending verification email'
      }
    });
  }
});

module.exports = router;