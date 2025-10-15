import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'

// Auth Context
const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setUser({ name: 'Test User', role: 'student' })
    setToken('test-token')
    return { success: true }
  }

  const register = async (userData) => {
    setUser({ name: userData.name, role: userData.role })
    setToken('test-token')
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => React.useContext(AuthContext);

// Components
const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <header style={{
      background: 'transparent',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '1rem 2rem'
    }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '2rem', fontWeight: '800', color: '#667eea', textDecoration: 'none' }}>
          🎓 ALUMNET
        </Link>
        {user && (
          <button onClick={logout} style={{ padding: '0.5rem 1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px' }}>
            Logout
          </button>
        )}
      </nav>
    </header>
  )
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')

  const sidebarItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'jobs', icon: '💼', label: 'Jobs', count: 156 },
    { id: 'events', icon: '📅', label: 'Events', count: 8 },
    { id: 'community', icon: '👥', label: 'Community', count: 23 },
    { id: 'messages', icon: '💬', label: 'Messages', count: 12 },
    { id: 'resume', icon: '📄', label: 'Resume Builder' },
    { id: 'chatbot', icon: '🤖', label: 'AI Assistant' }
  ]

  return (
    <div style={{
      display: 'flex',
      minHeight: 'calc(100vh - 80px)',
      background: 'transparent'
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '280px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '2rem 0',
        position: 'sticky',
        top: '80px',
        height: 'calc(100vh - 80px)',
        overflowY: 'auto'
      }}>
        {/* User Profile Section */}
        <div style={{
          padding: '0 1.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem',
            color: 'white'
          }}>
            {user?.role === 'alumni' ? '👩‍💼' : '👨‍🎓'}
          </div>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 0.5rem'
          }}>
            {user?.name || 'Test User'}
          </h3>
          <p style={{
            fontSize: '0.9rem',
            color: '#64748b',
            margin: '0 0 0.5rem'
          }}>
            {user?.role === 'alumni' ? 'Alumni' : 'Student'}
          </p>
          <p style={{
            fontSize: '0.8rem',
            color: '#94a3b8',
            margin: 0
          }}>
            MIT University • 2024
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1rem',
            padding: '0.5rem',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '8px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#667eea' }}>156</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Connections</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#667eea' }}>85%</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Profile</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '0 1rem', marginBottom: '2rem' }}>
          {sidebarItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.8rem 1rem',
                margin: '0.2rem 0',
                borderRadius: '12px',
                background: activeSection === item.id ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                color: activeSection === item.id ? '#667eea' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: activeSection === item.id ? '600' : '500'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.count && (
                <span style={{
                  background: activeSection === item.id ? '#667eea' : '#e2e8f0',
                  color: activeSection === item.id ? 'white' : '#64748b',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Recent Activity Section */}
        <div style={{ padding: '0 1.5rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 1rem',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '0.5rem'
          }}>
            Recent Activity
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[
              { icon: '💼', text: 'Applied to Google SWE', time: '2h ago', color: '#48bb78' },
              { icon: '👥', text: 'New connection: Sarah Chen', time: '4h ago', color: '#667eea' },
              { icon: '📅', text: 'Registered for Tech Talk', time: '1d ago', color: '#f093fb' },
              { icon: '💬', text: 'Message from Mike Johnson', time: '2d ago', color: '#4299e1' }
            ].map((activity, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.5rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.5)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: activity.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: '500' }}>
                    {activity.text}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto'
      }}>
        {activeSection === 'dashboard' && (
          <>
            {/* Welcome Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 0.5rem'
              }}>
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#64748b',
                margin: 0
              }}>
                Here's what's happening with your network today
              </p>
            </div>

        {/* Top Stats Bar */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'New Jobs', count: 24, color: '#48bb78', trend: '+5 today' },
            { label: 'Upcoming Events', count: 3, color: '#f093fb', trend: 'This week' },
            { label: 'Unread Messages', count: 12, color: '#4299e1', trend: '2 urgent' },
            { label: 'Profile Views', count: 47, color: '#ed8936', trend: '+12 this week' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              padding: '1.2rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              flex: '1',
              minWidth: '200px'
            }}>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: stat.color,
                margin: '0 0 0.3rem'
              }}>
                {stat.count}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#1e293b',
                fontWeight: '600',
                margin: '0 0 0.2rem'
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#64748b'
              }}>
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

            {/* Feature Sections List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Jobs Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    💼 Job Opportunities
                  </h3>
                  <button 
                    onClick={() => setActiveSection('jobs')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    View All →
                  </button>
                </div>
                <p style={{ color: '#64748b', margin: '0 0 1rem', fontSize: '0.95rem' }}>
                  156 available jobs • 5 jobs match your profile • 12 new this week
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    { title: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$180k - $250k', posted: '2 days ago' },
                    { title: 'Product Manager', company: 'Microsoft', location: 'Seattle, WA', salary: '$160k - $220k', posted: '1 day ago' },
                    { title: 'Data Scientist', company: 'Meta', location: 'Menlo Park, CA', salary: '$170k - $240k', posted: '3 hours ago' }
                  ].map((job, i) => (
                    <div key={i} style={{
                      background: 'rgba(72, 187, 120, 0.05)',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(72, 187, 120, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.3rem' }}>
                          {job.title}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.2rem' }}>
                          {job.company} • {job.location}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#48bb78', fontWeight: '500' }}>
                          {job.salary} • Posted {job.posted}
                        </div>
                      </div>
                      <button style={{
                        background: '#48bb78',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Quick Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Events Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    📅 Events & Workshops
                  </h3>
                  <button 
                    onClick={() => setActiveSection('events')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    View All →
                  </button>
                </div>
                <p style={{ color: '#64748b', margin: '0 0 1rem', fontSize: '0.95rem' }}>
                  8 upcoming events • 2 events you're attending • Next: Career Fair Tomorrow
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    { title: 'Tech Career Fair 2024', date: 'Dec 15, 2024', time: '10:00 AM - 4:00 PM', location: 'MIT Campus', attendees: '250+ attending' },
                    { title: 'AI in Industry Workshop', date: 'Dec 18, 2024', time: '2:00 PM - 5:00 PM', location: 'Virtual Event', attendees: '120+ attending' },
                    { title: 'Alumni Networking Night', date: 'Dec 20, 2024', time: '6:00 PM - 9:00 PM', location: 'Downtown Hotel', attendees: '80+ attending' }
                  ].map((event, i) => (
                    <div key={i} style={{
                      background: 'rgba(240, 147, 251, 0.05)',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(240, 147, 251, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.3rem' }}>
                          {event.title}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.2rem' }}>
                          {event.date} • {event.time}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#f093fb', fontWeight: '500' }}>
                          {event.location} • {event.attendees}
                        </div>
                      </div>
                      <button style={{
                        background: '#f093fb',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Register
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    👥 Community Discussions
                  </h3>
                  <button 
                    onClick={() => setActiveSection('community')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    View All →
                  </button>
                </div>
                <p style={{ color: '#64748b', margin: '0 0 1rem', fontSize: '0.95rem' }}>
                  23 new posts today • 156 active discussions • Trending: #CareerAdvice
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    { title: 'How to negotiate salary as a new grad?', author: 'Sarah Chen', replies: 24, likes: 45, time: '2 hours ago', tag: '#CareerAdvice' },
                    { title: 'Best resources for learning React in 2024', author: 'Mike Johnson', replies: 18, likes: 32, time: '4 hours ago', tag: '#TechTrends' },
                    { title: 'Networking tips for introverted professionals', author: 'Lisa Wang', replies: 31, likes: 67, time: '6 hours ago', tag: '#NetworkingTips' }
                  ].map((post, i) => (
                    <div key={i} style={{
                      background: 'rgba(102, 126, 234, 0.05)',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.3rem' }}>
                          {post.title}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.2rem' }}>
                          by {post.author} • {post.time}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#667eea', fontWeight: '500' }}>
                          {post.replies} replies • {post.likes} likes • {post.tag}
                        </div>
                      </div>
                      <button style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Join Discussion
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    💬 Recent Messages
                  </h3>
                  <button 
                    onClick={() => setActiveSection('messages')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#667eea',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    View All →
                  </button>
                </div>
                <p style={{ color: '#64748b', margin: '0 0 1rem', fontSize: '0.95rem' }}>
                  12 unread messages • 5 alumni online now • Last message: 2 minutes ago
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    { name: 'Sarah Chen', company: 'Google', message: 'Thanks for connecting! Would love to chat about...', time: '2 min ago', unread: true },
                    { name: 'Mike Johnson', company: 'Microsoft', message: 'Hey! I saw your profile and thought you might be...', time: '1 hour ago', unread: true },
                    { name: 'Lisa Wang', company: 'Meta', message: 'Great meeting you at the networking event yesterday...', time: '2 hours ago', unread: false }
                  ].map((message, i) => (
                    <div key={i} style={{
                      background: 'rgba(66, 153, 225, 0.05)',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(66, 153, 225, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                            {message.name}
                          </div>
                          {message.unread && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#4299e1'
                            }}></div>
                          )}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.2rem' }}>
                          {message.company} • {message.time}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#4299e1', fontWeight: '400' }}>
                          {message.message}
                        </div>
                      </div>
                      <button style={{
                        background: '#4299e1',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Reply
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

        {/* Jobs Page */}
        {activeSection === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
                  💼 Job Opportunities
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', margin: 0 }}>
                  156 available jobs • 12 new this week • 5 match your profile
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option>All Categories</option>
                  <option>Software Engineering</option>
                  <option>Product Management</option>
                  <option>Data Science</option>
                </select>
                <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option>Sort by: Latest</option>
                  <option>Sort by: Salary</option>
                  <option>Sort by: Company</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { 
                  title: 'Senior Software Engineer', 
                  company: 'Google', 
                  location: 'Mountain View, CA', 
                  salary: '$180k - $250k', 
                  posted: '2 days ago',
                  type: 'Full-time',
                  description: 'Join our team to build next-generation cloud infrastructure. Work with cutting-edge technologies and collaborate with world-class engineers.',
                  requirements: ['5+ years experience', 'Python/Java expertise', 'Cloud platforms', 'System design'],
                  postedBy: 'Sarah Chen (Alumni)'
                },
                { 
                  title: 'Product Manager', 
                  company: 'Microsoft', 
                  location: 'Seattle, WA', 
                  salary: '$160k - $220k', 
                  posted: '1 day ago',
                  type: 'Full-time',
                  description: 'Lead product strategy for Microsoft Teams. Drive innovation and collaborate with engineering teams to deliver exceptional user experiences.',
                  requirements: ['3+ years PM experience', 'Technical background', 'Data-driven mindset', 'Leadership skills'],
                  postedBy: 'Mike Johnson (Alumni)'
                },
                { 
                  title: 'Data Scientist', 
                  company: 'Meta', 
                  location: 'Menlo Park, CA', 
                  salary: '$170k - $240k', 
                  posted: '3 hours ago',
                  type: 'Full-time',
                  description: 'Apply machine learning to improve user engagement across Facebook and Instagram. Work with massive datasets and cutting-edge ML models.',
                  requirements: ['PhD/Masters in ML', 'Python/R expertise', 'Deep learning', 'Statistics background'],
                  postedBy: 'Lisa Wang (Alumni)'
                },
                { 
                  title: 'Frontend Developer', 
                  company: 'Netflix', 
                  location: 'Los Gatos, CA', 
                  salary: '$140k - $190k', 
                  posted: '1 week ago',
                  type: 'Full-time',
                  description: 'Build beautiful and performant user interfaces for Netflix streaming platform. Work with React, TypeScript, and modern web technologies.',
                  requirements: ['React expertise', 'TypeScript', 'Performance optimization', '3+ years experience'],
                  postedBy: 'David Kim (Alumni)'
                },
                { 
                  title: 'DevOps Engineer', 
                  company: 'Amazon', 
                  location: 'Austin, TX', 
                  salary: '$130k - $180k', 
                  posted: '4 days ago',
                  type: 'Full-time',
                  description: 'Manage and scale AWS infrastructure for high-traffic applications. Implement CI/CD pipelines and ensure system reliability.',
                  requirements: ['AWS certification', 'Kubernetes', 'Docker', 'Infrastructure as Code'],
                  postedBy: 'Jennifer Liu (Alumni)'
                }
              ].map((job, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.5rem' }}>
                        {job.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#48bb78', fontWeight: '600' }}>{job.company}</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{job.location}</span>
                        <span style={{ fontSize: '0.9rem', color: '#667eea', fontWeight: '500' }}>{job.type}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#f093fb', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {job.salary}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        Posted {job.posted} by {job.postedBy}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Quick Apply
                      </button>
                      <button style={{
                        background: 'transparent',
                        color: '#667eea',
                        border: '1px solid #667eea',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Save Job
                      </button>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {job.description}
                  </p>
                  
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                      Requirements:
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {job.requirements.map((req, j) => (
                        <span key={j} style={{
                          background: 'rgba(102, 126, 234, 0.1)',
                          color: '#667eea',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Page */}
        {activeSection === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
                  📅 Events & Workshops
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', margin: 0 }}>
                  8 upcoming events • 2 events you're attending • Next event tomorrow
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option>All Events</option>
                  <option>Networking</option>
                  <option>Workshops</option>
                  <option>Career Fairs</option>
                </select>
                <button style={{
                  background: '#f093fb',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Create Event
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  title: 'Tech Career Fair 2024',
                  date: 'December 15, 2024',
                  time: '10:00 AM - 4:00 PM',
                  location: 'MIT Campus - Johnson Athletic Center',
                  type: 'Career Fair',
                  attendees: 250,
                  registered: true,
                  description: 'Meet with top tech companies including Google, Microsoft, Meta, and more. Bring your resume and network with recruiters.',
                  organizer: 'MIT Alumni Association',
                  companies: ['Google', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Amazon']
                },
                {
                  title: 'AI in Industry Workshop',
                  date: 'December 18, 2024',
                  time: '2:00 PM - 5:00 PM',
                  location: 'Virtual Event (Zoom)',
                  type: 'Workshop',
                  attendees: 120,
                  registered: false,
                  description: 'Learn about the latest AI trends and how they\'re being applied in various industries. Hands-on coding session included.',
                  organizer: 'Sarah Chen (Google)',
                  topics: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision']
                },
                {
                  title: 'Alumni Networking Night',
                  date: 'December 20, 2024',
                  time: '6:00 PM - 9:00 PM',
                  location: 'Downtown Hotel - Grand Ballroom',
                  type: 'Networking',
                  attendees: 80,
                  registered: true,
                  description: 'Casual networking event with alumni from various industries. Food, drinks, and great conversations guaranteed!',
                  organizer: 'Alumni Relations Office',
                  industries: ['Tech', 'Finance', 'Healthcare', 'Consulting']
                },
                {
                  title: 'Resume & Interview Workshop',
                  date: 'December 22, 2024',
                  time: '1:00 PM - 4:00 PM',
                  location: 'MIT Campus - Room 32-123',
                  type: 'Workshop',
                  attendees: 45,
                  registered: false,
                  description: 'Get your resume reviewed by industry professionals and practice interview skills with mock interviews.',
                  organizer: 'Career Services',
                  benefits: ['Resume Review', 'Mock Interviews', 'Career Advice', 'Networking']
                },
                {
                  title: 'Startup Pitch Competition',
                  date: 'December 25, 2024',
                  time: '3:00 PM - 7:00 PM',
                  location: 'Innovation Lab - Building 32',
                  type: 'Competition',
                  attendees: 60,
                  registered: false,
                  description: 'Present your startup idea to a panel of investors and alumni entrepreneurs. $10k prize for the winner!',
                  organizer: 'Entrepreneurship Club',
                  prizes: ['$10,000 First Prize', '$5,000 Second Prize', '$2,500 Third Prize']
                },
                {
                  title: 'Women in Tech Panel',
                  date: 'December 28, 2024',
                  time: '5:00 PM - 7:00 PM',
                  location: 'Virtual Event (Teams)',
                  type: 'Panel Discussion',
                  attendees: 95,
                  registered: false,
                  description: 'Inspiring panel discussion with successful women leaders in technology sharing their career journeys.',
                  organizer: 'Women in Tech Society',
                  panelists: ['Lisa Wang (Meta)', 'Jennifer Liu (Amazon)', 'Maria Garcia (Tesla)']
                }
              ].map((event, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  position: 'relative'
                }}>
                  {event.registered && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#48bb78',
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.7rem',
                      fontWeight: '600'
                    }}>
                      Registered
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      background: 'rgba(240, 147, 251, 0.1)',
                      color: '#f093fb',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'inline-block',
                      marginBottom: '0.8rem'
                    }}>
                      {event.type}
                    </div>
                    
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.8rem' }}>
                      {event.title}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem' }}>📅</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{event.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem' }}>⏰</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{event.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem' }}>📍</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{event.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem' }}>👥</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{event.attendees} attending</span>
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {event.description}
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      Organized by {event.organizer}
                    </div>
                    
                    {event.companies && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        {event.companies.slice(0, 3).map((company, j) => (
                          <span key={j} style={{
                            background: 'rgba(72, 187, 120, 0.1)',
                            color: '#48bb78',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: '500'
                          }}>
                            {company}
                          </span>
                        ))}
                        {event.companies.length > 3 && (
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            +{event.companies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    {event.topics && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {event.topics.map((topic, j) => (
                          <span key={j} style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: '500'
                          }}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{
                      background: event.registered ? '#94a3b8' : '#f093fb',
                      color: 'white',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 1
                    }}>
                      {event.registered ? 'Registered' : 'Register Now'}
                    </button>
                    <button style={{
                      background: 'transparent',
                      color: '#f093fb',
                      border: '1px solid #f093fb',
                      padding: '0.6rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Page */}
        {activeSection === 'community' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
                  👥 Community Discussions
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', margin: 0 }}>
                  156 active discussions • 23 new posts today • 1.2k members online
                </p>
              </div>
              <button style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Create Post
              </button>
            </div>

            {/* Trending Topics */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.8rem' }}>
                🔥 Trending Topics
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['#CareerAdvice', '#TechTrends', '#NetworkingTips', '#JobSearch', '#StartupLife', '#RemoteWork'].map((tag, i) => (
                  <span key={i} style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Discussion Posts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  id: 1,
                  title: 'How to negotiate salary as a new grad?',
                  author: 'Sarah Chen',
                  authorRole: 'Software Engineer at Google',
                  content: 'I just got my first job offer and I\'m not sure how to approach salary negotiation. Any tips from experienced professionals? The offer seems fair but I want to make sure I\'m not leaving money on the table.',
                  tags: ['#CareerAdvice', '#Salary', '#NewGrad'],
                  replies: 24,
                  likes: 45,
                  time: '2 hours ago',
                  pinned: true
                },
                {
                  id: 2,
                  title: 'Best resources for learning React in 2024',
                  author: 'Mike Johnson',
                  authorRole: 'Senior Developer at Microsoft',
                  content: 'I\'m looking to upskill in React for a potential role change. What are the best courses, books, or projects you\'d recommend? I have a solid JavaScript foundation but new to React.',
                  tags: ['#TechTrends', '#React', '#Learning'],
                  replies: 18,
                  likes: 32,
                  time: '4 hours ago',
                  pinned: false
                },
                {
                  id: 3,
                  title: 'Networking tips for introverted professionals',
                  author: 'Lisa Wang',
                  authorRole: 'Product Manager at Meta',
                  content: 'As an introvert, I find networking events overwhelming. How do you build meaningful professional relationships without feeling drained? Looking for practical strategies that have worked for others.',
                  tags: ['#NetworkingTips', '#CareerAdvice', '#Professional'],
                  replies: 31,
                  likes: 67,
                  time: '6 hours ago',
                  pinned: false
                },
                {
                  id: 4,
                  title: 'Remote work vs office: What\'s your preference?',
                  author: 'David Kim',
                  authorRole: 'UX Designer at Netflix',
                  content: 'My company is asking us to return to office 3 days a week. I\'ve been fully remote for 2 years and love the flexibility. How do you balance productivity and collaboration preferences?',
                  tags: ['#RemoteWork', '#WorkLife', '#Productivity'],
                  replies: 42,
                  likes: 28,
                  time: '8 hours ago',
                  pinned: false
                },
                {
                  id: 5,
                  title: 'Transitioning from engineering to product management',
                  author: 'Jennifer Liu',
                  authorRole: 'Software Engineer at Amazon',
                  content: 'I\'ve been an engineer for 5 years and interested in moving to PM. What skills should I develop? Any recommended courses or ways to gain PM experience while still in an engineering role?',
                  tags: ['#CareerChange', '#ProductManagement', '#Engineering'],
                  replies: 19,
                  likes: 38,
                  time: '1 day ago',
                  pinned: false
                }
              ].map((post, i) => (
                <div key={post.id} style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  position: 'relative'
                }}>
                  {post.pinned && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#f093fb',
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.7rem',
                      fontWeight: '600'
                    }}>
                      📌 Pinned
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                        {post.author}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {post.authorRole} • {post.time}
                      </div>
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.8rem' }}>
                    {post.title}
                  </h3>
                  
                  <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.6' }}>
                    {post.content}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {post.tags.map((tag, j) => (
                      <span key={j} style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        👍 {post.likes} likes
                      </button>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        💬 {post.replies} replies
                      </button>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}>
                        🔗 Share
                      </button>
                    </div>
                    <button style={{
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Join Discussion
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Page */}
        {activeSection === 'messages' && (
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
              💬 Messages
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#64748b', margin: '0 0 2rem' }}>
              12 unread messages • 5 alumni online now
            </p>

            <div style={{ display: 'flex', gap: '1rem', height: '600px' }}>
              {/* Conversations List */}
              <div style={{
                width: '350px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '1rem',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    Conversations
                  </h3>
                  <button style={{
                    background: '#4299e1',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}>
                    New Chat
                  </button>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Search conversations..."
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { name: 'Sarah Chen', company: 'Google', message: 'Thanks for connecting! Would love to chat about...', time: '2 min', unread: 2, online: true },
                    { name: 'Mike Johnson', company: 'Microsoft', message: 'Hey! I saw your profile and thought you might be...', time: '1h', unread: 1, online: true },
                    { name: 'Lisa Wang', company: 'Meta', message: 'Great meeting you at the networking event yesterday...', time: '2h', unread: 0, online: false },
                    { name: 'David Kim', company: 'Netflix', message: 'I have some feedback on your portfolio if you\'re...', time: '1d', unread: 0, online: true },
                    { name: 'Jennifer Liu', company: 'Amazon', message: 'The job opening I mentioned is now live. Here\'s...', time: '2d', unread: 3, online: false }
                  ].map((conv, i) => (
                    <div key={i} style={{
                      padding: '0.8rem',
                      borderRadius: '8px',
                      background: i === 0 ? 'rgba(66, 153, 225, 0.1)' : 'transparent',
                      cursor: 'pointer',
                      border: i === 0 ? '1px solid rgba(66, 153, 225, 0.2)' : '1px solid transparent'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>
                            {conv.name}
                          </div>
                          {conv.online && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#48bb78'
                            }}></div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{conv.time}</span>
                          {conv.unread > 0 && (
                            <div style={{
                              background: '#4299e1',
                              color: 'white',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}>
                              {conv.unread}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>
                        {conv.company}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {conv.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Chat Header */}
                <div style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                      Sarah Chen
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Software Engineer at Google • Online
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>📞</button>
                    <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>📹</button>
                    <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>ℹ️</button>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { sender: 'Sarah Chen', message: 'Hi! Thanks for connecting with me on ALUMNET. I saw that you\'re also interested in software engineering.', time: '10:30 AM', isMe: false },
                    { sender: 'You', message: 'Hi Sarah! Yes, I\'m really passionate about software development. I saw your profile and your work at Google looks amazing!', time: '10:32 AM', isMe: true },
                    { sender: 'Sarah Chen', message: 'Thank you! I\'d love to chat more about your career goals. Are you looking for any specific opportunities right now?', time: '10:35 AM', isMe: false },
                    { sender: 'You', message: 'Actually yes! I\'m particularly interested in backend development and cloud technologies. Any advice for someone trying to break into that field?', time: '10:38 AM', isMe: true },
                    { sender: 'Sarah Chen', message: 'Absolutely! I\'d recommend focusing on learning AWS or GCP, and getting comfortable with containerization. Would you like to hop on a quick call sometime this week?', time: '2 min ago', isMe: false }
                  ].map((msg, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: msg.isMe ? 'flex-end' : 'flex-start'
                    }}>
                      <div style={{
                        maxWidth: '70%',
                        padding: '0.8rem 1rem',
                        borderRadius: '16px',
                        background: msg.isMe ? '#4299e1' : '#f1f5f9',
                        color: msg.isMe ? 'white' : '#1e293b'
                      }}>
                        <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          {msg.message}
                        </div>
                        <div style={{
                          fontSize: '0.7rem',
                          opacity: 0.7,
                          textAlign: 'right'
                        }}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div style={{
                  padding: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>📎</button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button style={{
                    background: '#4299e1',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Builder Page */}
        {activeSection === 'resume' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
                  📄 Resume Builder
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#64748b', margin: 0 }}>
                  Create a professional resume that stands out
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{
                  background: 'transparent',
                  color: '#667eea',
                  border: '1px solid #667eea',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Import from LinkedIn
                </button>
                <button style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Download PDF
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
              {/* Resume Form */}
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>
                  Personal Information
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="text"
                      placeholder="First Name"
                      defaultValue="John"
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      defaultValue="Doe"
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  
                  <input
                    type="email"
                    placeholder="Email"
                    defaultValue="john.doe@email.com"
                    style={{
                      padding: '0.8rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  />
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="tel"
                      placeholder="Phone"
                      defaultValue="+1 (555) 123-4567"
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      defaultValue="San Francisco, CA"
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  
                  <textarea
                    placeholder="Professional Summary"
                    defaultValue="Passionate software engineer with 3+ years of experience in full-stack development. Skilled in React, Node.js, and cloud technologies."
                    style={{
                      padding: '0.8rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: '2rem 0 1rem' }}>
                  Experience
                </h3>
                
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Job Title"
                      defaultValue="Software Engineer"
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      defaultValue="Tech Startup Inc."
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Start Date"
                      defaultValue="Jan 2022"
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      defaultValue="Present"
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  <textarea
                    placeholder="Job Description"
                    defaultValue="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software&#10;• Improved application performance by 40% through code optimization"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <button style={{
                  background: 'transparent',
                  color: '#667eea',
                  border: '1px dashed #667eea',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  + Add Another Experience
                </button>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: '2rem 0 1rem' }}>
                  Skills
                </h3>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'].map((skill, i) => (
                    <span key={i} style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      {skill}
                      <button style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer' }}>×</button>
                    </span>
                  ))}
                </div>
                
                <input
                  type="text"
                  placeholder="Add a skill and press Enter"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Resume Preview */}
              <div style={{
                width: '400px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                height: 'fit-content'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                  Resume Preview
                </h3>
                
                <div style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  fontSize: '0.8rem',
                  lineHeight: '1.4'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.3rem' }}>
                      John Doe
                    </h2>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      john.doe@email.com • +1 (555) 123-4567 • San Francisco, CA
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                      Professional Summary
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                      Passionate software engineer with 3+ years of experience in full-stack development. Skilled in React, Node.js, and cloud technologies.
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                      Experience
                    </h3>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.8rem' }}>Software Engineer</strong>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Jan 2022 - Present</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem' }}>
                        Tech Startup Inc.
                      </div>
                      <ul style={{ fontSize: '0.7rem', color: '#64748b', margin: 0, paddingLeft: '1rem' }}>
                        <li>Developed and maintained web applications using React and Node.js</li>
                        <li>Collaborated with cross-functional teams to deliver high-quality software</li>
                        <li>Improved application performance by 40% through code optimization</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                      Skills
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      JavaScript, React, Node.js, Python, AWS, Docker
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Page */}
        {activeSection === 'chatbot' && (
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
              🤖 AI Career Assistant
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#64748b', margin: '0 0 2rem' }}>
              Get instant help with career questions, resume tips, and networking advice
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Quick Actions Sidebar */}
              <div style={{
                width: '280px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '1.5rem',
                height: 'fit-content'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                  Quick Actions
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[
                    { icon: '📝', title: 'Resume Review', desc: 'Get feedback on your resume' },
                    { icon: '💼', title: 'Job Search Tips', desc: 'Find the right opportunities' },
                    { icon: '🎯', title: 'Interview Prep', desc: 'Practice common questions' },
                    { icon: '💰', title: 'Salary Negotiation', desc: 'Learn negotiation strategies' },
                    { icon: '🌐', title: 'Networking Advice', desc: 'Build professional connections' },
                    { icon: '🚀', title: 'Career Planning', desc: 'Plan your career path' }
                  ].map((action, i) => (
                    <button key={i} style={{
                      background: 'rgba(102, 126, 234, 0.05)',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>
                          {action.title}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', paddingLeft: '2rem' }}>
                        {action.desc}
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(240, 147, 251, 0.1)', borderRadius: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.5rem' }}>
                    💡 Pro Tip
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
                    Be specific with your questions! Instead of "How do I get a job?", try "What skills should I learn for a frontend developer role at a startup?"
                  </p>
                </div>
              </div>

              {/* Chat Interface */}
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '600px'
              }}>
                {/* Chat Header */}
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    🤖
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                      ALUMNET AI Assistant
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Online • Ready to help with your career questions
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Welcome Message */}
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '1rem',
                      borderRadius: '16px',
                      background: '#f1f5f9',
                      color: '#1e293b'
                    }}>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        👋 Hello! I'm your AI Career Assistant. I'm here to help you with:
                      </div>
                      <ul style={{ fontSize: '0.8rem', margin: '0.5rem 0', paddingLeft: '1rem', color: '#64748b' }}>
                        <li>Resume and cover letter feedback</li>
                        <li>Interview preparation and practice</li>
                        <li>Job search strategies</li>
                        <li>Career planning and advice</li>
                        <li>Networking tips</li>
                        <li>Salary negotiation guidance</li>
                      </ul>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        What would you like to know about today?
                      </div>
                    </div>
                  </div>

                  {/* Sample Conversation */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: '0.8rem 1rem',
                      borderRadius: '16px',
                      background: '#667eea',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        I'm preparing for a software engineering interview at Google. Can you help me with some common questions?
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '1rem',
                      borderRadius: '16px',
                      background: '#f1f5f9',
                      color: '#1e293b'
                    }}>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                        🎯 Great! Google interviews typically focus on these areas:
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.8rem' }}>
                        <strong>Technical Questions:</strong>
                        <br />• Data structures and algorithms
                        <br />• System design (for senior roles)
                        <br />• Coding problems on a whiteboard/computer
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.8rem' }}>
                        <strong>Behavioral Questions:</strong>
                        <br />• "Tell me about a time you faced a challenge"
                        <br />• "How do you handle disagreements with teammates?"
                        <br />• "Why do you want to work at Google?"
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#667eea', fontWeight: '500' }}>
                        Would you like me to give you some practice questions for any specific area?
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: '0.8rem 1rem',
                      borderRadius: '16px',
                      background: '#667eea',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '0.9rem' }}>
                        Yes! Can you give me some algorithm practice questions?
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '1rem',
                      borderRadius: '16px',
                      background: '#f1f5f9',
                      color: '#1e293b'
                    }}>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                        🧠 Here are some common algorithm questions Google asks:
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                        <strong>1. Two Sum Problem:</strong> Given an array and a target, find two numbers that add up to the target.
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                        <strong>2. Reverse Linked List:</strong> Reverse a singly linked list iteratively and recursively.
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.8rem' }}>
                        <strong>3. Binary Tree Traversal:</strong> Implement inorder, preorder, and postorder traversals.
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#667eea', fontWeight: '500' }}>
                        Want me to walk through the solution for any of these?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div style={{
                  padding: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    placeholder="Ask me anything about your career..."
                    style={{
                      flex: 1,
                      padding: '0.8rem 1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.2rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
};

// Auth Page
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    role: 'student',
    universityName: '',
    graduationYear: '',
    currentCompany: '',
    currentPosition: ''
  })
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = isLogin ? 
      await login(formData.email, formData.password) :
      await register(formData)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Authentication failed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'transparent'
    }}>
      {/* ALUMNET Logo */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '800',
          margin: 0
        }}>
          🎓 ALUMNET
        </h1>
      </div>

      {/* Auth Form */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          color: '#1e293b',
          marginBottom: '0.5rem',
          fontWeight: '600'
        }}>
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
        
        <p style={{
          color: '#64748b',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>
          {isLogin ? 'Welcome back! Please enter your details.' : 'Join the ALUMNET community today.'}
        </p>

        {/* Role Selection Buttons */}
        {!isLogin && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            justifyContent: 'center'
          }}>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'student'})}
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '50px',
                border: formData.role === 'student' ? '2px solid #667eea' : '2px solid #e2e8f0',
                background: formData.role === 'student' ? '#667eea' : 'transparent',
                color: formData.role === 'student' ? 'white' : '#64748b',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              👨‍🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'alumni'})}
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '50px',
                border: formData.role === 'alumni' ? '2px solid #667eea' : '2px solid #e2e8f0',
                background: formData.role === 'alumni' ? '#667eea' : 'transparent',
                color: formData.role === 'alumni' ? 'white' : '#64748b',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              👩‍💼 Alumni
            </button>
          </div>
        )}
        
        {error && (
          <div style={{
            background: 'rgba(254, 226, 226, 0.9)',
            color: '#c53030',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="👤 Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  padding: '1.2rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />

              <input
                type="email"
                placeholder="📧 Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  padding: '1.2rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />

              <input
                type="password"
                placeholder="🔒 Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  padding: '1.2rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />

              <input
                type="text"
                placeholder="🏛️ University Name"
                value={formData.universityName}
                onChange={(e) => setFormData({...formData, universityName: e.target.value})}
                style={{
                  padding: '1.2rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />

              {formData.role === 'alumni' && (
                <>
                  <input
                    type="text"
                    placeholder="🎓 Graduation Year"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                    style={{
                      padding: '1.2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />

                  <input
                    type="text"
                    placeholder="🏢 Current Company"
                    value={formData.currentCompany}
                    onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                    style={{
                      padding: '1.2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />

                  <input
                    type="text"
                    placeholder="💼 Current Position"
                    value={formData.currentPosition}
                    onChange={(e) => setFormData({...formData, currentPosition: e.target.value})}
                    style={{
                      padding: '1.2rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    required
                  />
                </>
              )}

              {formData.role === 'student' && (
                <input
                  type="text"
                  placeholder="🎓 Current Year/Semester"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                  style={{
                    padding: '1.2rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  required
                />
              )}
            </>
          )}

          {/* Login Form Fields */}
          {isLogin && (
            <>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  padding: '1.2rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />
              
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  padding: '1.2rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </>
          )}
          
          <button type="submit" style={{
            padding: '1.2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <span style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
};

// Landing Page
const Landing = () => (
  <div style={{
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem'
  }}>
    {/* Hero Section */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '60vh',
      marginBottom: '4rem'
    }}>
      <h1 style={{
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: '800'
      }}>
        🎓 ALUMNET
      </h1>
      
      <p style={{ fontSize: '1.5rem', marginBottom: '3rem', color: '#64748b', maxWidth: '600px' }}>
        Connect with alumni, discover opportunities, and grow your professional network. 
        <span style={{ color: '#f093fb', fontWeight: '600' }}> Your career journey starts here.</span>
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/auth" style={{
          padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: '600',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          transition: 'transform 0.3s ease'
        }}>
          🚀 Get Started
        </Link>
        
        <button style={{
          padding: '1rem 2rem',
          background: 'transparent',
          color: '#667eea',
          border: '2px solid #667eea',
          borderRadius: '50px',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}>
          📖 Learn More
        </button>
      </div>
    </div>

    {/* Features Section */}
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{
        fontSize: '2.5rem',
        textAlign: 'center',
        marginBottom: '3rem',
        color: '#1e293b',
        fontWeight: '700'
      }}>
        Why Choose ALUMNET?
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
        
        {/* Alumni Network Feature */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          minHeight: '280px'
        }}>
          <div style={{
            flex: '1',
            backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minWidth: '300px'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(102, 126, 234, 0.1)',
              backdropFilter: 'blur(1px)'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '50px',
              height: '50px',
              background: '#667eea',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              zIndex: 2
            }}>
              👥
            </div>
          </div>
          <div style={{ flex: '1', padding: '2rem' }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              borderLeft: '4px solid #667eea',
              paddingLeft: '1rem'
            }}>
              Alumni Network
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Build meaningful professional relationships with alumni who share your educational background. Access mentorship opportunities, career guidance, and industry insights from experienced professionals.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Networking', 'Mentorship', 'Career Growth', 'Professional'].map(tag => (
                <span key={tag} style={{
                  background: '#667eea20',
                  color: '#667eea',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Job Board Feature */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          minHeight: '280px',
          flexDirection: 'row-reverse'
        }}>
          <div style={{
            flex: '1',
            backgroundImage: 'url(https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minWidth: '300px'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(72, 187, 120, 0.1)',
              backdropFilter: 'blur(1px)'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '50px',
              height: '50px',
              background: '#48bb78',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              zIndex: 2
            }}>
              💼
            </div>
          </div>
          <div style={{ flex: '1', padding: '2rem' }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              borderLeft: '4px solid #48bb78',
              paddingLeft: '1rem'
            }}>
              Job Board
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Discover job postings shared directly by alumni working at top companies. Get insider access to positions that may not be publicly advertised and receive referrals from your network.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Exclusive Jobs', 'Referrals', 'Career Opportunities', 'Alumni Posted'].map(tag => (
                <span key={tag} style={{
                  background: '#48bb7820',
                  color: '#48bb78',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Events & Workshops Feature */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          minHeight: '280px'
        }}>
          <div style={{
            flex: '1',
            backgroundImage: 'url(https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minWidth: '300px'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(240, 147, 251, 0.1)',
              backdropFilter: 'blur(1px)'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '50px',
              height: '50px',
              background: '#f093fb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              zIndex: 2
            }}>
              📅
            </div>
          </div>
          <div style={{ flex: '1', padding: '2rem' }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              borderLeft: '4px solid #f093fb',
              paddingLeft: '1rem'
            }}>
              Events & Workshops
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Participate in career fairs, industry workshops, and networking meetups organized by your alumni community. Stay updated with the latest trends and expand your professional circle.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Networking Events', 'Workshops', 'Career Fairs', 'Skill Building'].map(tag => (
                <span key={tag} style={{
                  background: '#f093fb20',
                  color: '#f093fb',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Assistant Feature */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          minHeight: '280px',
          flexDirection: 'row-reverse'
        }}>
          <div style={{
            flex: '1',
            backgroundImage: 'url(https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minWidth: '300px'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(66, 153, 225, 0.1)',
              backdropFilter: 'blur(1px)'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '50px',
              height: '50px',
              background: '#4299e1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              zIndex: 2
            }}>
              🤖
            </div>
          </div>
          <div style={{ flex: '1', padding: '2rem' }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              borderLeft: '4px solid #4299e1',
              paddingLeft: '1rem'
            }}>
              AI Career Assistant
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              Get instant help with career questions, resume tips, and networking advice from our intelligent AI chatbot. Available 24/7 to support your professional growth journey.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['AI Support', 'Career Advice', 'Resume Tips', '24/7 Available'].map(tag => (
                <span key={tag} style={{
                  background: '#4299e120',
                  color: '#4299e1',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Call to Action */}
      <div style={{
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <h3 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '1rem'
        }}>
          Ready to Transform Your Career?
        </h3>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Join thousands of students and alumni who are already building their future through ALUMNET.
        </p>
        <Link to="/auth" style={{
          display: 'inline-block',
          padding: '1.2rem 3rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: '600',
          fontSize: '1.1rem',
          boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
          transition: 'transform 0.3s ease'
        }}>
          🎯 Start Networking Today
        </Link>
      </div>
    </div>
  </div>
);

// Simple placeholder pages
const Jobs = () => (
  <div style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#1e293b' }}>Jobs Page</h1>
  </div>
);

const Events = () => (
  <div style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#1e293b' }}>Events Page</h1>
  </div>
);

const Community = () => (
  <div style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#1e293b' }}>Community Page</h1>
  </div>
);

const Chatbot = () => (
  <div style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#1e293b' }}>AI Chatbot</h1>
  </div>
);

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])

  if (!user) return null
  return children
};

// Main App Component
const AppContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && (window.location.pathname === '/' || window.location.pathname === '/auth')) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  return (
    <>
      {/* Global Animated Background Dots */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              borderRadius: '50%',
              background: [
                'rgba(255, 107, 107, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 193, 7, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
              ][Math.floor(Math.random() * 6)],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatingDots ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
            }}
          />
        ))}
      </div>
      
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
      </Routes>
    </>
  )
};

// CSS Animation
const style = document.createElement('style')
style.textContent = `
  @keyframes floatingDots {
    0%, 100% { 
      transform: translateY(0px) translateX(0px) scale(1);
      opacity: 0.6;
    }
    25% { 
      transform: translateY(-30px) translateX(20px) scale(1.1);
      opacity: 0.8;
    }
    50% { 
      transform: translateY(-15px) translateX(-15px) scale(0.9);
      opacity: 0.4;
    }
    75% { 
      transform: translateY(-40px) translateX(10px) scale(1.2);
      opacity: 0.7;
    }
  }
`
document.head.appendChild(style);

// Main App
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App