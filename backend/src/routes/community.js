const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { authenticate, checkOwnership, optionalAuth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/community/posts
// @desc    Get community posts
// @access  Public
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = { isActive: true };
    
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    let sortQuery = {};
    switch (req.query.sort) {
      case 'popular':
        sortQuery = { likes: -1, views: -1 };
        break;
      case 'trending':
        sortQuery = { lastActivity: -1 };
        break;
      default:
        sortQuery = { isPinned: -1, createdAt: -1 };
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'profile.firstName profile.lastName profile.avatar role')
        .populate('comments.author', 'profile.firstName profile.lastName profile.avatar role')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    logger.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_POSTS_ERROR',
        message: 'Error fetching posts'
      }
    });
  }
});

// @route   POST /api/community/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', authenticate, async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.user._id
    };

    const post = new Post(postData);
    await post.save();

    await post.populate('author', 'profile.firstName profile.lastName profile.avatar role');

    logger.info(`New post created: ${post.title} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: { post },
      message: 'Post created successfully'
    });

  } catch (error) {
    logger.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_POST_ERROR',
        message: 'Error creating post'
      }
    });
  }
});

// @route   POST /api/community/posts/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/posts/:id/like', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'POST_NOT_FOUND',
          message: 'Post not found'
        }
      });
    }

    const result = post.toggleLike(req.user._id);
    await post.save();

    res.json({
      success: true,
      data: {
        action: result.action,
        likeCount: result.likeCount
      }
    });

  } catch (error) {
    logger.error('Toggle post like error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TOGGLE_LIKE_ERROR',
        message: 'Error toggling like'
      }
    });
  }
});

// @route   POST /api/community/posts/:id/comments
// @desc    Add comment to a post
// @access  Private
router.post('/posts/:id/comments', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post || !post.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'POST_NOT_FOUND',
          message: 'Post not found'
        }
      });
    }

    const comment = post.addComment(req.user._id, req.body.content);
    await post.save();

    await post.populate('comments.author', 'profile.firstName profile.lastName profile.avatar role');

    res.status(201).json({
      success: true,
      data: { comment },
      message: 'Comment added successfully'
    });

  } catch (error) {
    logger.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_COMMENT_ERROR',
        message: 'Error adding comment'
      }
    });
  }
});

// @route   GET /api/community/categories
// @desc    Get forum categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { value: 'all', label: 'All Posts', count: 0 },
      { value: 'general', label: 'General Discussion', count: 0 },
      { value: 'career', label: 'Career Advice', count: 0 },
      { value: 'technical', label: 'Technical Help', count: 0 },
      { value: 'networking', label: 'Networking', count: 0 }
    ];

    // Get post counts for each category
    const counts = await Post.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(item => {
      countMap[item._id] = item.count;
    });

    categories.forEach(category => {
      if (category.value === 'all') {
        category.count = Object.values(countMap).reduce((sum, count) => sum + count, 0);
      } else {
        category.count = countMap[category.value] || 0;
      }
    });

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_CATEGORIES_ERROR',
        message: 'Error fetching categories'
      }
    });
  }
});

module.exports = router;