// Mock database for demo purposes - no MongoDB required
class MockDatabase {
  constructor() {
    this.users = [
      {
        _id: '1',
        name: 'John Doe',
        email: 'student@alumnet.com',
        password: '$2b$10$U.wCjE7hPxYgiIZkK3N9V.MMeqlluu/mbyu4nniXgyUW7uuaFnRiS', // password: student123
        role: 'student',
        university: 'Tech University',
        graduationYear: 2024,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'alumni@alumnet.com',
        password: '$2b$10$P39a4jEvDntV8lOW4uTgAOWboUnv7jt9h/AuRylocmuChoVfw8nZO', // password: alumni123
        role: 'alumni',
        university: 'Tech University',
        graduationYear: 2020,
        company: 'Tech Corp',
        position: 'Senior Developer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    this.jobs = [
      {
        _id: '1',
        title: 'Frontend Developer',
        company: 'Tech Startup',
        location: 'Remote',
        type: 'Full-time',
        salary: '₹8-12 LPA',
        description: 'Looking for a skilled React developer...',
        requirements: ['React', 'JavaScript', 'CSS'],
        postedBy: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    this.events = [
      {
        _id: '1',
        title: 'Tech Career Fair 2025',
        description: 'Annual career fair with top tech companies',
        date: new Date('2025-03-15'),
        location: 'Tech University Campus',
        organizer: '2',
        attendees: ['1'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    this.posts = [
      {
        _id: '1',
        title: 'Tips for Landing Your First Tech Job',
        content: 'Here are some valuable tips from my experience...',
        author: '2',
        category: 'Career Advice',
        likes: 15,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // User methods
  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.find(user => user._id === id);
  }

  createUser(userData) {
    const newUser = {
      _id: (this.users.length + 1).toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Job methods
  getAllJobs() {
    return this.jobs;
  }

  createJob(jobData) {
    const newJob = {
      _id: (this.jobs.length + 1).toString(),
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.jobs.push(newJob);
    return newJob;
  }

  // Event methods
  getAllEvents() {
    return this.events;
  }

  createEvent(eventData) {
    const newEvent = {
      _id: (this.events.length + 1).toString(),
      ...eventData,
      attendees: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.events.push(newEvent);
    return newEvent;
  }

  // Post methods
  getAllPosts() {
    return this.posts;
  }

  createPost(postData) {
    const newPost = {
      _id: (this.posts.length + 1).toString(),
      ...postData,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.posts.push(newPost);
    return newPost;
  }
}

// Export singleton instance
const mockDB = new MockDatabase();
module.exports = mockDB;