const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Job = require('../models/Job');
const { authenticate, authorize, checkOwnership, optionalAuth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Validation rules
const jobValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Job title is required and must be less than 100 characters'),
  body('company')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name is required and must be less than 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Job description must be between 10 and 5000 characters'),
  body('type')
    .isIn(['full-time', 'part-time', 'internship', 'contract', 'freelance'])
    .withMessage('Invalid job type'),
  body('workMode')
    .optional()
    .isIn(['remote', 'onsite', 'hybrid'])
    .withMessage('Invalid work mode'),
  body('experienceLevel')
    .optional()
    .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  body('salary.min')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number'),
  body('salary.max')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array')
];

// @route   GET /api/jobs
// @desc    Get all active jobs with filters
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['full-time', 'part-time', 'internship', 'contract', 'freelance']),
  query('workMode').optional().isIn(['remote', 'onsite', 'hybrid']),
  query('experienceLevel').optional().isIn(['entry', 'mid', 'senior', 'lead', 'executive']),
  query('sort').optional().isIn(['recent', 'salary', 'company', 'title'])
], optionalAuth, async (req, res) => {
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
    const skip = (page - 1) * limit;

    // Build query
    let query = {
      isActive: true,
      expiresAt: { $gt: new Date() }
    };

    // Apply filters
    if (req.query.type) query.type = req.query.type;
    if (req.query.workMode) query.workMode = req.query.workMode;
    if (req.query.experienceLevel) query.experienceLevel = req.query.experienceLevel;
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }
    if (req.query.company) {
      query.company = { $regex: req.query.company, $options: 'i' };
    }
    if (req.query.skills) {
      const skills = Array.isArray(req.query.skills) ? req.query.skills : [req.query.skills];
      query.skills = { $in: skills.map(skill => new RegExp(skill, 'i')) };
    }
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Salary range filters
    if (req.query.salaryMin) {
      query['salary.min'] = { $gte: parseInt(req.query.salaryMin) };
    }
    if (req.query.salaryMax) {
      query['salary.max'] = { $lte: parseInt(req.query.salaryMax) };
    }

    // Build sort
    let sortQuery = {};
    switch (req.query.sort) {
      case 'salary':
        sortQuery = { 'salary.max': -1, 'salary.min': -1 };
        break;
      case 'company':
        sortQuery = { company: 1 };
        break;
      case 'title':
        sortQuery = { title: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('postedBy', 'profile.firstName profile.lastName profile.company profile.position')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Job.countDocuments(query)
    ]);

    // Add application status for authenticated users
    const jobsWithStatus = jobs.map(job => {
      const jobObj = job.toObject();
      if (req.user) {
        jobObj.hasApplied = job.hasUserApplied(req.user._id);
        jobObj.userApplication = job.getApplicationByUser(req.user._id);
      }
      return jobObj;
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        jobs: jobsWithStatus,
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
    logger.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_JOBS_ERROR',
        message: 'Error fetching jobs'
      }
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'profile.firstName profile.lastName profile.company profile.position profile.avatar')
      .populate('applications.applicant', 'profile.firstName profile.lastName profile.avatar');

    if (!job || !job.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found'
        }
      });
    }

    // Increment views
    await job.incrementViews();

    const jobObj = job.toObject();
    
    // Add application status for authenticated users
    if (req.user) {
      jobObj.hasApplied = job.hasUserApplied(req.user._id);
      jobObj.userApplication = job.getApplicationByUser(req.user._id);
    }

    // Hide applicant details unless user is the job poster
    if (!req.user || req.user._id.toString() !== job.postedBy._id.toString()) {
      jobObj.applications = jobObj.applications.map(app => ({
        ...app,
        applicant: {
          _id: app.applicant._id,
          // Hide personal details
        },
        coverLetter: undefined,
        resume: undefined
      }));
    }

    res.json({
      success: true,
      data: {
        job: jobObj
      }
    });

  } catch (error) {
    logger.error('Get job error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_JOB_ERROR',
        message: 'Error fetching job'
      }
    });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Alumni only)
router.post('/', authenticate, authorize('alumni'), jobValidation, async (req, res) => {
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

    const jobData = {
      ...req.body,
      postedBy: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    await job.populate('postedBy', 'profile.firstName profile.lastName profile.company profile.position');

    logger.info(`New job posted: ${job.title} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: {
        job
      },
      message: 'Job posted successfully'
    });

  } catch (error) {
    logger.error('Create job error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_JOB_ERROR',
        message: 'Error creating job posting'
      }
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job posting
// @access  Private (Job owner only)
router.put('/:id', 
  authenticate, 
  checkOwnership(Job, 'id', 'postedBy'),
  jobValidation,
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

      const job = req.resource;
      
      // Update job fields
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined && key !== 'postedBy') {
          job[key] = req.body[key];
        }
      });

      await job.save();
      await job.populate('postedBy', 'profile.firstName profile.lastName profile.company profile.position');

      logger.info(`Job updated: ${job.title} by ${req.user.email}`);

      res.json({
        success: true,
        data: {
          job
        },
        message: 'Job updated successfully'
      });

    } catch (error) {
      logger.error('Update job error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_JOB_ERROR',
          message: 'Error updating job'
        }
      });
    }
  }
);

// @route   DELETE /api/jobs/:id
// @desc    Delete job posting
// @access  Private (Job owner only)
router.delete('/:id', 
  authenticate, 
  checkOwnership(Job, 'id', 'postedBy'),
  async (req, res) => {
    try {
      const job = req.resource;
      
      // Soft delete by setting isActive to false
      job.isActive = false;
      await job.save();

      logger.info(`Job deleted: ${job.title} by ${req.user.email}`);

      res.json({
        success: true,
        message: 'Job deleted successfully'
      });

    } catch (error) {
      logger.error('Delete job error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_JOB_ERROR',
          message: 'Error deleting job'
        }
      });
    }
  }
);

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private
router.post('/:id/apply', 
  authenticate,
  [
    body('coverLetter')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('Cover letter cannot exceed 2000 characters'),
    body('resume')
      .optional()
      .isURL()
      .withMessage('Resume must be a valid URL')
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

      const job = await Job.findById(req.params.id);
      
      if (!job || !job.isActive) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'JOB_NOT_FOUND',
            message: 'Job not found'
          }
        });
      }

      // Check if job has expired
      if (job.expiresAt && job.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'JOB_EXPIRED',
            message: 'This job posting has expired'
          }
        });
      }

      // Check if application deadline has passed
      if (job.applicationDeadline && job.applicationDeadline < new Date()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'APPLICATION_DEADLINE_PASSED',
            message: 'Application deadline has passed'
          }
        });
      }

      // Check if user has already applied
      if (job.hasUserApplied(req.user._id)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_APPLIED',
            message: 'You have already applied for this job'
          }
        });
      }

      // Check if user is the job poster
      if (job.postedBy.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CANNOT_APPLY_OWN_JOB',
            message: 'You cannot apply for your own job posting'
          }
        });
      }

      // Add application
      const application = {
        applicant: req.user._id,
        coverLetter: req.body.coverLetter,
        resume: req.body.resume,
        appliedAt: new Date(),
        status: 'pending'
      };

      job.applications.push(application);
      await job.save();

      logger.info(`Job application submitted: ${job.title} by ${req.user.email}`);

      res.status(201).json({
        success: true,
        data: {
          application: {
            _id: application._id,
            appliedAt: application.appliedAt,
            status: application.status
          }
        },
        message: 'Application submitted successfully'
      });

    } catch (error) {
      logger.error('Apply for job error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'APPLY_JOB_ERROR',
          message: 'Error submitting job application'
        }
      });
    }
  }
);

// @route   PUT /api/jobs/:id/applications/:applicationId
// @desc    Update application status
// @access  Private (Job owner only)
router.put('/:id/applications/:applicationId',
  authenticate,
  checkOwnership(Job, 'id', 'postedBy'),
  [
    body('status')
      .isIn(['pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected'])
      .withMessage('Invalid application status'),
    body('notes')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters')
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

      const job = req.resource;
      const application = job.applications.id(req.params.applicationId);

      if (!application) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'APPLICATION_NOT_FOUND',
            message: 'Application not found'
          }
        });
      }

      // Update application
      application.status = req.body.status;
      if (req.body.notes) {
        application.notes = req.body.notes;
      }

      await job.save();

      logger.info(`Application status updated: ${application.status} for job ${job.title}`);

      res.json({
        success: true,
        data: {
          application
        },
        message: 'Application status updated successfully'
      });

    } catch (error) {
      logger.error('Update application status error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_APPLICATION_ERROR',
          message: 'Error updating application status'
        }
      });
    }
  }
);

// @route   GET /api/jobs/my/posted
// @desc    Get jobs posted by current user
// @access  Private (Alumni only)
router.get('/my/posted', authenticate, authorize('alumni'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find({ postedBy: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('applications.applicant', 'profile.firstName profile.lastName profile.avatar'),
      Job.countDocuments({ postedBy: req.user._id })
    ]);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    logger.error('Get my posted jobs error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_MY_JOBS_ERROR',
        message: 'Error fetching your job postings'
      }
    });
  }
});

// @route   GET /api/jobs/my/applications
// @desc    Get jobs applied by current user
// @access  Private
router.get('/my/applications', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({
      'applications.applicant': req.user._id,
      isActive: true
    })
    .populate('postedBy', 'profile.firstName profile.lastName profile.company')
    .sort({ 'applications.appliedAt': -1 })
    .skip(skip)
    .limit(limit);

    // Filter to show only user's applications
    const jobsWithUserApplications = jobs.map(job => {
      const jobObj = job.toObject();
      jobObj.userApplication = job.getApplicationByUser(req.user._id);
      delete jobObj.applications; // Remove all applications for privacy
      return jobObj;
    });

    res.json({
      success: true,
      data: {
        jobs: jobsWithUserApplications
      }
    });

  } catch (error) {
    logger.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_MY_APPLICATIONS_ERROR',
        message: 'Error fetching your job applications'
      }
    });
  }
});

module.exports = router;