const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Event title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Event description cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['networking', 'workshop', 'seminar', 'social', 'career-fair', 'webinar'],
    required: [true, 'Event type is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > this.date;
      },
      message: 'End date must be after start date'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      required: [true, 'Location type is required']
    },
    address: {
      type: String,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    meetingLink: {
      type: String,
      match: [/^https?:\/\/.*$/, 'Please enter a valid meeting link']
    },
    venue: {
      type: String,
      maxlength: [100, 'Venue cannot exceed 100 characters']
    }
  },
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1'],
    max: [10000, 'Capacity cannot exceed 10000']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event organizer is required']
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled', 'no-show'],
      default: 'registered'
    },
    checkInTime: Date,
    feedback: {
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
  waitlist: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value <= this.date;
      },
      message: 'Registration deadline must be before event date'
    }
  },
  price: {
    amount: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
    }
  },
  agenda: [{
    time: String,
    title: {
      type: String,
      maxlength: [100, 'Agenda item title cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [300, 'Agenda item description cannot exceed 300 characters']
    },
    speaker: {
      type: String,
      maxlength: [100, 'Speaker name cannot exceed 100 characters']
    }
  }],
  speakers: [{
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Speaker name cannot exceed 100 characters']
    },
    title: {
      type: String,
      maxlength: [100, 'Speaker title cannot exceed 100 characters']
    },
    bio: {
      type: String,
      maxlength: [500, 'Speaker bio cannot exceed 500 characters']
    },
    avatar: String,
    linkedIn: String,
    twitter: String
  }],
  requirements: [{
    type: String,
    maxlength: [200, 'Requirement cannot exceed 200 characters']
  }],
  materials: [{
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Material name cannot exceed 100 characters']
    },
    url: {
      type: String,
      required: true,
      match: [/^https?:\/\/.*$/, 'Please enter a valid URL']
    },
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'presentation'],
      default: 'document'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ organizer: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ isPublic: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ tags: 1 });

// Virtual for registration count
eventSchema.virtual('registrationCount').get(function() {
  return this.attendees.length;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.capacity) return null;
  return Math.max(0, this.capacity - this.attendees.length);
});

// Virtual for is full
eventSchema.virtual('isFull').get(function() {
  if (!this.capacity) return false;
  return this.attendees.length >= this.capacity;
});

// Virtual for is past
eventSchema.virtual('isPast').get(function() {
  return this.date < new Date();
});

// Virtual for registration status
eventSchema.virtual('registrationOpen').get(function() {
  const now = new Date();
  if (this.registrationDeadline && now > this.registrationDeadline) return false;
  if (this.isPast) return false;
  return true;
});

// Pre-save middleware to validate location requirements
eventSchema.pre('save', function(next) {
  if (this.location.type === 'offline' || this.location.type === 'hybrid') {
    if (!this.location.address && !this.location.venue) {
      return next(new Error('Address or venue is required for offline/hybrid events'));
    }
  }
  
  if (this.location.type === 'online' || this.location.type === 'hybrid') {
    if (!this.location.meetingLink) {
      return next(new Error('Meeting link is required for online/hybrid events'));
    }
  }
  
  next();
});

// Method to check if user is registered
eventSchema.methods.isUserRegistered = function(userId) {
  return this.attendees.some(attendee => attendee.user.toString() === userId.toString());
};

// Method to check if user is on waitlist
eventSchema.methods.isUserOnWaitlist = function(userId) {
  return this.waitlist.some(item => item.user.toString() === userId.toString());
};

// Method to register user
eventSchema.methods.registerUser = function(userId) {
  if (this.isUserRegistered(userId)) {
    throw new Error('User is already registered for this event');
  }
  
  if (!this.registrationOpen) {
    throw new Error('Registration is closed for this event');
  }
  
  if (this.isFull) {
    // Add to waitlist
    this.waitlist.push({ user: userId });
    return { status: 'waitlisted' };
  } else {
    // Register directly
    this.attendees.push({ user: userId });
    return { status: 'registered' };
  }
};

// Method to unregister user
eventSchema.methods.unregisterUser = function(userId) {
  const attendeeIndex = this.attendees.findIndex(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (attendeeIndex === -1) {
    throw new Error('User is not registered for this event');
  }
  
  this.attendees.splice(attendeeIndex, 1);
  
  // Move someone from waitlist if there's space
  if (this.waitlist.length > 0 && this.capacity && this.attendees.length < this.capacity) {
    const nextUser = this.waitlist.shift();
    this.attendees.push({ user: nextUser.user });
    return { status: 'unregistered', promotedFromWaitlist: nextUser.user };
  }
  
  return { status: 'unregistered' };
};

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function(filters = {}) {
  const query = {
    isActive: true,
    date: { $gt: new Date() }
  };
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.isPublic !== undefined) {
    query.isPublic = filters.isPublic;
  }
  
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  
  return this.find(query).sort({ date: 1 });
};

// Method to increment views
eventSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to update average rating
eventSchema.methods.updateAverageRating = function() {
  const ratings = this.attendees
    .filter(attendee => attendee.feedback && attendee.feedback.rating)
    .map(attendee => attendee.feedback.rating);
  
  if (ratings.length > 0) {
    this.averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    this.totalRatings = ratings.length;
  } else {
    this.averageRating = 0;
    this.totalRatings = 0;
  }
  
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);