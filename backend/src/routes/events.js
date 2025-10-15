const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const { authenticate, authorize, checkOwnership, optionalAuth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all upcoming events
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {
      isActive: true,
      isPublic: true,
      date: { $gt: new Date() }
    };

    if (req.query.type) {
      query.type = req.query.type;
    }

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('organizer', 'profile.firstName profile.lastName profile.company')
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(query)
    ]);

    const eventsWithStatus = events.map(event => {
      const eventObj = event.toObject();
      if (req.user) {
        eventObj.isRegistered = event.isUserRegistered(req.user._id);
        eventObj.isOnWaitlist = event.isUserOnWaitlist(req.user._id);
      }
      return eventObj;
    });

    res.json({
      success: true,
      data: {
        events: eventsWithStatus,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    logger.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_EVENTS_ERROR',
        message: 'Error fetching events'
      }
    });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Alumni only)
router.post('/', authenticate, authorize('alumni'), async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user._id
    };

    const event = new Event(eventData);
    await event.save();

    await event.populate('organizer', 'profile.firstName profile.lastName profile.company');

    logger.info(`New event created: ${event.title} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: { event },
      message: 'Event created successfully'
    });

  } catch (error) {
    logger.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_EVENT_ERROR',
        message: 'Error creating event'
      }
    });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found'
        }
      });
    }

    const result = event.registerUser(req.user._id);
    await event.save();

    res.json({
      success: true,
      data: { status: result.status },
      message: result.status === 'registered' ? 'Registered successfully' : 'Added to waitlist'
    });

  } catch (error) {
    logger.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EVENT_REGISTRATION_ERROR',
        message: error.message || 'Error registering for event'
      }
    });
  }
});

// @route   DELETE /api/events/:id/register
// @desc    Unregister from an event
// @access  Private
router.delete('/:id/register', authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found'
        }
      });
    }

    const result = event.unregisterUser(req.user._id);
    await event.save();

    res.json({
      success: true,
      message: 'Unregistered successfully'
    });

  } catch (error) {
    logger.error('Event unregistration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EVENT_UNREGISTRATION_ERROR',
        message: error.message || 'Error unregistering from event'
      }
    });
  }
});

module.exports = router;