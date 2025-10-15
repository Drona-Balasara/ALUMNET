const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Post title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [5000, 'Post content cannot exceed 5000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post author is required']
  },
  category: {
    type: String,
    enum: ['general', 'career', 'technical', 'networking', 'announcements'],
    required: [true, 'Post category is required'],
    default: 'general'
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  comments: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    replies: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: [true, 'Reply content is required'],
        maxlength: [1000, 'Reply cannot exceed 1000 characters']
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }]
    }]
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  attachments: [{
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Attachment name cannot exceed 100 characters']
    },
    url: {
      type: String,
      required: true,
      match: [/^https?:\/\/.*$/, 'Please enter a valid URL']
    },
    type: {
      type: String,
      enum: ['image', 'document', 'video', 'link'],
      default: 'document'
    },
    size: Number // in bytes
  }],
  moderationFlags: [{
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'harassment', 'misinformation', 'other'],
      required: true
    },
    description: {
      type: String,
      maxlength: [500, 'Flag description cannot exceed 500 characters']
    },
    flaggedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ lastActivity: -1 });
postSchema.index({ isPinned: -1, createdAt: -1 });
postSchema.index({ isActive: 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for total replies count
postSchema.virtual('totalRepliesCount').get(function() {
  return this.comments.reduce((total, comment) => total + comment.replies.length, 0);
});

// Virtual for engagement score (likes + comments + views)
postSchema.virtual('engagementScore').get(function() {
  return this.likes.length + this.comments.length + Math.floor(this.views / 10);
});

// Pre-save middleware to update lastActivity
postSchema.pre('save', function(next) {
  if (this.isModified('comments') || this.isModified('likes')) {
    this.lastActivity = new Date();
  }
  next();
});

// Method to check if user has liked the post
postSchema.methods.hasUserLiked = function(userId) {
  return this.likes.some(like => like.toString() === userId.toString());
};

// Method to toggle like
postSchema.methods.toggleLike = function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likes.findIndex(like => like.toString() === userIdStr);
  
  if (likeIndex === -1) {
    this.likes.push(userId);
    return { action: 'liked', likeCount: this.likes.length };
  } else {
    this.likes.splice(likeIndex, 1);
    return { action: 'unliked', likeCount: this.likes.length };
  }
};

// Method to add comment
postSchema.methods.addComment = function(userId, content) {
  const comment = {
    author: userId,
    content: content.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: [],
    replies: []
  };
  
  this.comments.push(comment);
  this.lastActivity = new Date();
  
  return comment;
};

// Method to add reply to comment
postSchema.methods.addReply = function(commentId, userId, content) {
  const comment = this.comments.id(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  const reply = {
    author: userId,
    content: content.trim(),
    createdAt: new Date(),
    likes: []
  };
  
  comment.replies.push(reply);
  this.lastActivity = new Date();
  
  return reply;
};

// Method to toggle comment like
postSchema.methods.toggleCommentLike = function(commentId, userId) {
  const comment = this.comments.id(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  const userIdStr = userId.toString();
  const likeIndex = comment.likes.findIndex(like => like.toString() === userIdStr);
  
  if (likeIndex === -1) {
    comment.likes.push(userId);
    return { action: 'liked', likeCount: comment.likes.length };
  } else {
    comment.likes.splice(likeIndex, 1);
    return { action: 'unliked', likeCount: comment.likes.length };
  }
};

// Method to increment views
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Static method to find posts by category
postSchema.statics.findByCategory = function(category, options = {}) {
  const query = { 
    category,
    isActive: true
  };
  
  let mongoQuery = this.find(query);
  
  // Sorting
  if (options.sort === 'popular') {
    mongoQuery = mongoQuery.sort({ likes: -1, views: -1 });
  } else if (options.sort === 'trending') {
    mongoQuery = mongoQuery.sort({ lastActivity: -1 });
  } else {
    mongoQuery = mongoQuery.sort({ isPinned: -1, createdAt: -1 });
  }
  
  // Pagination
  if (options.page && options.limit) {
    const skip = (options.page - 1) * options.limit;
    mongoQuery = mongoQuery.skip(skip).limit(options.limit);
  }
  
  return mongoQuery;
};

// Static method to search posts
postSchema.statics.searchPosts = function(searchTerm, options = {}) {
  const query = {
    $text: { $search: searchTerm },
    isActive: true
  };
  
  if (options.category) {
    query.category = options.category;
  }
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

// Static method to get trending posts
postSchema.statics.getTrending = function(days = 7, limit = 10) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);
  
  return this.find({
    createdAt: { $gte: dateThreshold },
    isActive: true
  })
  .sort({ lastActivity: -1, likes: -1 })
  .limit(limit);
};

// Method to flag post for moderation
postSchema.methods.flagForModeration = function(userId, reason, description) {
  const flag = {
    flaggedBy: userId,
    reason,
    description,
    flaggedAt: new Date(),
    status: 'pending'
  };
  
  this.moderationFlags.push(flag);
  return flag;
};

module.exports = mongoose.model('Post', postSchema);