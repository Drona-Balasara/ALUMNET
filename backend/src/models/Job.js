const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Job description cannot exceed 5000 characters']
  },
  requirements: [{
    type: String,
    maxlength: [200, 'Requirement cannot exceed 200 characters']
  }],
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
    required: [true, 'Job type is required']
  },
  workMode: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'onsite'
  },
  salary: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  skills: [{
    type: String,
    maxlength: [50, 'Skill cannot exceed 50 characters']
  }],
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    default: 'entry'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Job poster is required']
  },
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected'],
      default: 'pending'
    },
    coverLetter: {
      type: String,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
    },
    resume: {
      type: String // URL to resume file
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  benefits: [{
    type: String,
    maxlength: [100, 'Benefit cannot exceed 100 characters']
  }],
  applicationDeadline: Date,
  contactEmail: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  externalUrl: {
    type: String,
    match: [/^https?:\/\/.*$/, 'Please enter a valid URL']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ expiresAt: 1 });

// Virtual for application count
jobSchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Virtual for days remaining
jobSchema.virtual('daysRemaining').get(function() {
  if (!this.expiresAt) return null;
  const now = new Date();
  const diffTime = this.expiresAt - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Pre-save middleware to validate salary range
jobSchema.pre('save', function(next) {
  if (this.salary.min && this.salary.max && this.salary.min > this.salary.max) {
    return next(new Error('Minimum salary cannot be greater than maximum salary'));
  }
  next();
});

// Method to check if user has applied
jobSchema.methods.hasUserApplied = function(userId) {
  return this.applications.some(app => app.applicant.toString() === userId.toString());
};

// Method to get application by user
jobSchema.methods.getApplicationByUser = function(userId) {
  return this.applications.find(app => app.applicant.toString() === userId.toString());
};

// Static method to find active jobs
jobSchema.statics.findActive = function(filters = {}) {
  const query = { 
    isActive: true,
    expiresAt: { $gt: new Date() }
  };
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.location) {
    query.location = new RegExp(filters.location, 'i');
  }
  
  if (filters.skills && filters.skills.length > 0) {
    query.skills = { $in: filters.skills.map(skill => new RegExp(skill, 'i')) };
  }
  
  if (filters.experienceLevel) {
    query.experienceLevel = filters.experienceLevel;
  }
  
  if (filters.workMode) {
    query.workMode = filters.workMode;
  }
  
  if (filters.salaryMin) {
    query['salary.min'] = { $gte: filters.salaryMin };
  }
  
  if (filters.salaryMax) {
    query['salary.max'] = { $lte: filters.salaryMax };
  }
  
  return this.find(query);
};

// Static method to get jobs by company
jobSchema.statics.findByCompany = function(company) {
  return this.find({ 
    company: new RegExp(company, 'i'),
    isActive: true,
    expiresAt: { $gt: new Date() }
  });
};

// Method to increment views
jobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Job', jobSchema);