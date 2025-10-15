const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'alumni'],
    required: [true, 'Role is required']
  },
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    phone: {
      type: String,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    linkedIn: {
      type: String,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please enter a valid LinkedIn URL']
    },
    github: {
      type: String,
      match: [/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, 'Please enter a valid GitHub username']
    },
    // Common fields
    graduationYear: {
      type: Number,
      min: [1950, 'Graduation year must be after 1950'],
      max: [2030, 'Graduation year must be before 2030']
    },
    major: {
      type: String,
      maxlength: [100, 'Major cannot exceed 100 characters']
    },
    university: {
      type: String,
      maxlength: [100, 'University cannot exceed 100 characters']
    },
    // Student-specific fields
    interests: [{
      type: String,
      maxlength: [50, 'Interest cannot exceed 50 characters']
    }],
    // Alumni-specific fields
    company: {
      type: String,
      maxlength: [100, 'Company cannot exceed 100 characters']
    },
    position: {
      type: String,
      maxlength: [100, 'Position cannot exceed 100 characters']
    },
    expertise: [{
      type: String,
      maxlength: [50, 'Expertise cannot exceed 50 characters']
    }],
    mentoring: {
      type: Boolean,
      default: false
    }
  },
  privacy: {
    profileVisible: {
      type: Boolean,
      default: true
    },
    contactVisible: {
      type: Boolean,
      default: true
    },
    githubVisible: {
      type: Boolean,
      default: true
    }
  },
  githubData: {
    username: String,
    repositories: [{
      id: Number,
      name: String,
      description: String,
      url: String,
      language: String,
      stars: { type: Number, default: 0 },
      forks: { type: Number, default: 0 },
      size: { type: Number, default: 0 },
      topics: [String],
      lastUpdated: Date,
      createdAt: Date
    }],
    lastSync: Date,
    totalStars: { type: Number, default: 0 },
    totalRepos: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });
userSchema.index({ 'profile.company': 1 });
userSchema.index({ 'profile.expertise': 1 });
userSchema.index({ 'profile.interests': 1 });
userSchema.index({ 'githubData.username': 1 });

// Virtual for full name
userSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  
  // Apply privacy settings
  if (!this.privacy.contactVisible) {
    delete user.email;
    delete user.profile.phone;
  }
  
  if (!this.privacy.githubVisible) {
    delete user.githubData;
  }
  
  return user;
};

// Static method to find alumni
userSchema.statics.findAlumni = function(filters = {}) {
  const query = { role: 'alumni', isActive: true };
  
  if (filters.mentoring) {
    query['profile.mentoring'] = true;
  }
  
  if (filters.company) {
    query['profile.company'] = new RegExp(filters.company, 'i');
  }
  
  if (filters.expertise) {
    query['profile.expertise'] = { $in: [new RegExp(filters.expertise, 'i')] };
  }
  
  return this.find(query);
};

// Static method to find students
userSchema.statics.findStudents = function(filters = {}) {
  const query = { role: 'student', isActive: true };
  
  if (filters.interests) {
    query['profile.interests'] = { $in: [new RegExp(filters.interests, 'i')] };
  }
  
  if (filters.graduationYear) {
    query['profile.graduationYear'] = filters.graduationYear;
  }
  
  return this.find(query);
};

module.exports = mongoose.model('User', userSchema);