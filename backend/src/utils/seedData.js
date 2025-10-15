const User = require('../models/User');
const Job = require('../models/Job');
const Event = require('../models/Event');
const Post = require('../models/Post');
const logger = require('./logger');

const seedUsers = async () => {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      logger.info('Users already exist, skipping seed');
      return;
    }

    const users = [
      // Demo Student Account
      {
        email: 'student@alumnet.com',
        password: 'Student123',
        role: 'student',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Computer Science student passionate about technology and innovation.',
          location: 'Mumbai, India',
          graduationYear: 2024,
          major: 'Computer Science',
          university: 'Tech University',
          interests: ['JavaScript', 'React', 'Web Development', 'AI/ML']
        },
        emailVerified: true
      },
      // Demo Alumni Account
      {
        email: 'alumni@alumnet.com',
        password: 'Alumni123',
        role: 'alumni',
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          bio: 'Senior Software Engineer with 5 years of experience in full-stack development.',
          location: 'Bangalore, India',
          phone: '+91-9876543210',
          linkedIn: 'https://linkedin.com/in/janesmith',
          github: 'janesmith',
          graduationYear: 2020,
          major: 'Computer Science',
          university: 'Tech University',
          company: 'Tech Corp',
          position: 'Senior Developer',
          expertise: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
          mentoring: true
        },
        emailVerified: true
      }
    ];

    await User.insertMany(users);
    logger.info(`Seeded ${users.length} users`);
  } catch (error) {
    logger.error('Error seeding users:', error);
  }
};

const seedJobs = async () => {
  try {
    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
      logger.info('Jobs already exist, skipping seed');
      return;
    }

    const alumni = await User.find({ role: 'alumni' }).limit(2);
    if (alumni.length === 0) {
      logger.warn('No alumni found, skipping job seeding');
      return;
    }

    const jobs = [
      {
        title: 'Frontend Developer',
        company: 'Google',
        description: 'We are looking for a talented Frontend Developer to join our team.',
        requirements: [
          '3+ years of experience with React',
          'Strong knowledge of JavaScript, HTML, CSS',
          'Experience with state management'
        ],
        location: 'San Francisco, CA',
        type: 'full-time',
        workMode: 'hybrid',
        salaryRange: { min: 120000, max: 180000 },
        postedBy: alumni[0]._id,
        skills: ['React', 'JavaScript', 'CSS', 'HTML']
      }
    ];

    await Job.insertMany(jobs);
    logger.info(`Seeded ${jobs.length} jobs`);
  } catch (error) {
    logger.error('Error seeding jobs:', error);
  }
};

const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');
    await seedUsers();
    await seedJobs();
    logger.info('Database seeding completed');
  } catch (error) {
    logger.error('Database seeding failed:', error);
  }
};

module.exports = { seedDatabase, seedUsers, seedJobs };