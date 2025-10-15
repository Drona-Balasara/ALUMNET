const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/alumnet';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await createIndexes();
    
    return conn;
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const User = require('../models/User');
    const Job = require('../models/Job');
    const Event = require('../models/Event');
    const Post = require('../models/Post');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ 'profile.github': 1 });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ 'profile.graduationYear': 1 });
    await User.collection.createIndex({ 'profile.university': 1 });

    // Job indexes
    await Job.collection.createIndex({ title: 'text', description: 'text', company: 'text' });
    await Job.collection.createIndex({ postedBy: 1 });
    await Job.collection.createIndex({ createdAt: -1 });
    await Job.collection.createIndex({ location: 1 });
    await Job.collection.createIndex({ type: 1 });
    await Job.collection.createIndex({ skills: 1 });

    // Event indexes
    await Event.collection.createIndex({ title: 'text', description: 'text' });
    await Event.collection.createIndex({ organizer: 1 });
    await Event.collection.createIndex({ date: 1 });
    await Event.collection.createIndex({ type: 1 });
    await Event.collection.createIndex({ 'location.type': 1 });

    // Post indexes
    await Post.collection.createIndex({ title: 'text', content: 'text' });
    await Post.collection.createIndex({ author: 1 });
    await Post.collection.createIndex({ createdAt: -1 });
    await Post.collection.createIndex({ category: 1 });
    await Post.collection.createIndex({ tags: 1 });

    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error('Error creating indexes:', error);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

module.exports = { connectDB, disconnectDB };