import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'

// Add CSS animations to document head
const addAnimations = () => {
  if (document.getElementById('alumnet-animations')) return;

  const style = document.createElement('style');
  style.id = 'alumnet-animations';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(120deg); }
      66% { transform: translateY(-10px) rotate(240deg); }
    }
    
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
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    .fade-in-up {
      animation: fadeInUp 0.6s ease-out;
    }
    
    .slide-in-right {
      animation: slideInRight 0.6s ease-out;
    }
    
    .pulse-animation {
      animation: pulse 2s ease-in-out infinite;
    }
    
    .shimmer-effect {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }
    
    /* Hover effects */
    .hover-lift:hover {
      transform: translateY(-5px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .hover-glow:hover {
      box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
      transition: all 0.3s ease;
    }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #5a6fd8, #6a4190);
    }
    
    /* Selection styling */
    ::selection {
      background: rgba(102, 126, 234, 0.3);
      color: white;
    }
    
    /* Loading spinner animation */
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Focus styles */
    *:focus {
      outline: none;
    }
    
    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Body reset */
    body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    
    /* Modern Feature Cards Grid - 3x2 Layout */
    .features-grid-2x3 {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 2rem;
      width: 100%;
      max-width: 1400px;
      margin: 3rem auto 0;
    }
    
    @media (max-width: 1200px) {
      .features-grid-2x3 {
        max-width: 1000px;
        gap: 1.5rem;
      }
    }
    
    @media (max-width: 768px) {
      .features-grid-2x3 {
        max-width: 600px;
        gap: 1.5rem;
      }
      
      /* Stack content vertically on mobile */
      .features-grid-2x3 > div {
        flex-direction: column !important;
        min-height: auto !important;
      }
      
      .features-grid-2x3 > div > div:first-child {
        flex: none !important;
        height: 200px !important;
        width: 100% !important;
      }
    }
    
    @media (max-width: 480px) {
      .features-grid-2x3 {
        gap: 1rem;
        margin: 2rem auto 0;
        max-width: 100%;
        padding: 0 1rem;
      }
    }
  `;
  document.head.appendChild(style);
};

// Initialize animations when component loads
if (typeof window !== 'undefined') {
  addAnimations();
}

// Simple API functions
const API_BASE = 'http://localhost:3001/api'

const api = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return response.json()
  },
  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  },
  getJobs: async (token) => {
    const response = await fetch(`${API_BASE}/jobs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },
  getEvents: async (token) => {
    const response = await fetch(`${API_BASE}/events`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },
  getPosts: async (token) => {
    const response = await fetch(`${API_BASE}/community/posts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },
  chatbot: async (message, token) => {
    const response = await fetch(`${API_BASE}/chatbot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    })
    return response.json()
  },
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return response.json()
  },
  resetPassword: async (token, password) => {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    })
    return response.json()
  }
}

// Auth Context
const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token')
      if (savedToken) {
        try {
          const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          })
          const result = await response.json()
          if (result.success) {
            setUser(result.data.user)
            setToken(savedToken)
          } else {
            localStorage.removeItem('token')
            setToken(null)
          }
        } catch (error) {
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const result = await api.login(email, password)
      if (result.success) {
        setUser(result.data.user)
        setToken(result.data.token)
        localStorage.setItem('token', result.data.token)
        return { success: true }
      }
      return { success: false, error: result.error?.message || 'Login failed' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const register = async (userData) => {
    try {
      const result = await api.register(userData)
      if (result.success) {
        setUser(result.data.user)
        setToken(result.data.token)
        localStorage.setItem('token', result.data.token)
        return { success: true }
      }
      return { success: false, error: result.error?.message || 'Registration failed' }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
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

const useAuth = () => React.useContext(AuthContext)

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(30px)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return children
}

// Validation Helpers
const isValidEmail = (email) => {
  // Basic email pattern; server will re-validate with stricter rules
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isStrongPassword = (password) => {
  // At least 6 chars, one uppercase, one lowercase, one number (matches backend policy)
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)
}

// Modern Professional Design System
const styles = {
  // Global container with transparent background for animated dots
  container: {
    minHeight: '100vh',
    width: '100%',
    padding: '0',
    margin: '0',
    fontFamily: "'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: 'transparent',
    position: 'relative',
    overflow: 'hidden'
  },

  // Transparent header
  header: {
    background: 'transparent',
    borderBottom: 'none',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    transition: 'all 0.3s ease'
  },

  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100vw',
    padding: '1rem 2rem',
    height: '80px',
    boxSizing: 'border-box'
  },

  navLinks: {
    display: 'flex',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },

  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
    padding: '12px 20px',
    borderRadius: '25px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.25)',
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    }
  },

  // Modern button with multiple variants
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    transform: 'translateY(0)',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)'
    },
    ':active': {
      transform: 'translateY(-1px)'
    }
  },

  // Hero section with transparent background for animated dots only
  heroSection: {
    minHeight: '100vh',
    width: '100%',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    background: 'transparent'
  },

  // Content sections with modern spacing
  pageSection: {
    width: '100%',
    minHeight: 'calc(100vh - 80px)',
    padding: '4rem 3rem',
    background: `
      linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%),
      radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)
    `,
    position: 'relative'
  },

  // Authentication section with glassmorphism
  authSection: {
    minHeight: '100vh',
    width: '100%',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },

  // Modern content box with advanced glassmorphism
  contentBox: {
    width: '100%',
    maxWidth: '500px',
    padding: '3rem',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(30px)',
    borderRadius: '30px',
    boxShadow: `
      0 25px 50px rgba(31, 38, 135, 0.37),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1)
    `,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden'
  },

  // Modern form styling
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%'
  },

  // Advanced input styling
  input: {
    padding: '20px 24px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    width: '100%',
    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
    ':focus': {
      border: '2px solid rgba(102, 126, 234, 0.5)',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1), inset 0 2px 10px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)'
    }
  },

  // Advanced grid system - 2x3 layout (2 columns, 3 rows)
  modernGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '2rem',
    width: '100%',
    maxWidth: '1000px',
    margin: '3rem auto 0',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'repeat(6, 1fr)'
    }
  },

  // Modern card with hover effects
  modernCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '25px',
    padding: '2.5rem',
    boxShadow: `
      0 20px 40px rgba(31, 38, 135, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.5)
    `,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-10px) scale(1.02)',
      boxShadow: '0 30px 60px rgba(31, 38, 135, 0.3)',
      background: 'rgba(255, 255, 255, 0.95)'
    }
  },

  // Feature card for landing page
  featureCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '25px',
    padding: '3rem',
    boxShadow: '0 25px 50px rgba(31, 38, 135, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '250px',
    ':hover': {
      transform: 'translateY(-15px)',
      boxShadow: '0 35px 70px rgba(31, 38, 135, 0.3)'
    }
  },

  // Role selection cards
  roleCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(30px)',
    borderRadius: '25px',
    padding: '3rem 2rem',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-5px) scale(1.05)',
      background: 'rgba(255, 255, 255, 0.25)',
      border: '2px solid rgba(255, 255, 255, 0.4)'
    }
  },

  // Animated background elements
  backgroundElement: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    animation: 'float 6s ease-in-out infinite'
  },

  // Success/Error message styling
  messageBox: {
    padding: '1.5rem',
    borderRadius: '20px',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontWeight: '500'
  },

  successMessage: {
    background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.9) 0%, rgba(56, 161, 105, 0.9) 100%)',
    color: 'white'
  },

  errorMessage: {
    background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.9) 0%, rgba(229, 62, 62, 0.9) 100%)',
    color: 'white'
  },

  // Dashboard specific styles
  dashboardCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '25px',
    padding: '2.5rem',
    boxShadow: '0 20px 40px rgba(31, 38, 135, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 25px 50px rgba(31, 38, 135, 0.2)'
    }
  },

  fullGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto'
  },

  jobCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 15px 35px rgba(31, 38, 135, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(31, 38, 135, 0.2)'
    }
  },

  communityCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 15px 35px rgba(31, 38, 135, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    marginBottom: '2rem'
  },

  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 15px 35px rgba(31, 38, 135, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    maxWidth: '500px',
    width: '100%',
    margin: '0 auto'
  }
}

// Header Component
const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" className="hover-lift" style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: 'white',
          textDecoration: 'none',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          letterSpacing: '-1px',
          transition: 'all 0.3s ease',
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
        }}>
          🎓 ALUMNET
        </Link>

        {user ? (
          <div style={styles.navLinks}>
            <Link to="/dashboard" className="hover-lift" style={styles.navLink}>
              📊 Dashboard
            </Link>
            <Link to="/jobs" className="hover-lift" style={styles.navLink}>
              💼 Jobs
            </Link>
            {user.role === 'alumni' && (
              <Link to="/events" className="hover-lift" style={styles.navLink}>
                📅 Events
              </Link>
            )}
            <Link to="/community" className="hover-lift" style={styles.navLink}>
              💬 Community
            </Link>
            <Link to="/chatbot" className="hover-lift" style={styles.navLink}>
              🤖 AI Chat
            </Link>
            <button
              onClick={logout}
              className="hover-lift"
              style={{
                ...styles.button,
                padding: '10px 20px',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '25px'
              }}
            >
              🚪 Logout
            </button>

            {/* User Info Badge */}
            <div style={{
              background: user.role === 'alumni' ?
                'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' :
                'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              <span>{user.role === 'alumni' ? '👩‍💼' : '👨‍🎓'}</span>
              <span>{user.name}</span>
            </div>
          </div>
        ) : (
          <div style={styles.navLinks}>
            <Link to="/auth" className="hover-lift hover-glow" style={{
              ...styles.navLink,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              padding: '12px 24px',
              fontWeight: '600'
            }}>
              🔐 Login / Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

// Full Screen Authentication Page
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState('student')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    university: '',
    graduationYear: '',
    company: '',
    position: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({
      email: '',
      password: '',
      name: '',
      university: '',
      graduationYear: '',
      company: '',
      position: ''
    })
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Common field checks
    if (!isValidEmail(formData.email)) {
      setLoading(false)
      setError('Please enter a valid email address')
      return
    }

    if (isLogin) {
      if (!formData.password) {
        setLoading(false)
        setError('Password is required')
        return
      }

      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error)
      }
    } else {
      // Register validation
      if (!isStrongPassword(formData.password)) {
        setLoading(false)
        setError('Password must be 6+ chars with uppercase, lowercase, and number')
        return
      }

      if (!formData.name?.trim()) {
        setLoading(false)
        setError('Full Name is required')
        return
      }

      if (!formData.university?.trim()) {
        setLoading(false)
        setError('University is required')
        return
      }

      if (!formData.graduationYear) {
        setLoading(false)
        setError('Graduation Year is required')
        return
      }

      if (selectedRole === 'alumni') {
        if (!formData.company?.trim() || !formData.position?.trim()) {
          setLoading(false)
          setError('Company and Position are required for alumni')
          return
        }
      }

      const userData = {
        ...formData,
        role: selectedRole
      }
      const result = await register(userData)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error)
      }
    }
    setLoading(false)
  }

  const resetToStart = () => {
    setIsLogin(true)
    setSelectedRole('student')
    setShowForgotPassword(false)
    setShowResetPassword(false)
    setResetToken('')
    setError('')
    setSuccess('')
    setFormData({
      email: '',
      password: '',
      name: '',
      university: '',
      graduationYear: '',
      company: '',
      position: ''
    })
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!isValidEmail(formData.email)) {
      setLoading(false)
      setError('Please enter a valid email address')
      return
    }

    try {
      const result = await api.forgotPassword(formData.email)
      if (result.success) {
        setSuccess('Password reset instructions sent to your email!')
        // In development, show the reset token
        if (result.resetToken) {
          setResetToken(result.resetToken)
          setShowResetPassword(true)
          setShowForgotPassword(false)
        }
      } else {
        setError(result.error?.message || 'Failed to send reset email')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!isStrongPassword(formData.password)) {
      setLoading(false)
      setError('Password must be 6+ chars with uppercase, lowercase, and number')
      return
    }

    try {
      const result = await api.resetPassword(resetToken, formData.password)
      if (result.success) {
        setSuccess('Password reset successful! You can now login with your new password.')
        setTimeout(() => {
          resetToStart()
        }, 2000)
      } else {
        setError(result.error?.message || 'Failed to reset password')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Full Screen Login/Register Form */}
      {!showForgotPassword && !showResetPassword && (
        <div style={{
          width: '100%',
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* ALUMNET Logo */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800',
              letterSpacing: '-2px',
              textShadow: '0 2px 10px rgba(102, 126, 234, 0.3)'
            }}>
              🎓 ALUMNET
            </h1>
          </div>

          {/* Role Selection - Oval Buttons (only for registration) */}
          {!isLogin && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginBottom: '2rem'
            }}>
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  border: selectedRole === 'student' ? '2px solid #667eea' : '2px solid #e2e8f0',
                  background: selectedRole === 'student' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.2)',
                  color: selectedRole === 'student' ? 'white' : '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedRole === 'student' ? '0 4px 15px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('alumni')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  border: selectedRole === 'alumni' ? '2px solid #48bb78' : '2px solid #e2e8f0',
                  background: selectedRole === 'alumni' ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : 'rgba(255, 255, 255, 0.2)',
                  color: selectedRole === 'alumni' ? 'white' : '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedRole === 'alumni' ? '0 4px 15px rgba(72, 187, 120, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                👩‍💼 Alumni
              </button>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.9) 0%, rgba(229, 62, 62, 0.9) 100%)',
              color: 'white',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.9) 0%, rgba(56, 161, 105, 0.9) 100%)',
              color: 'white',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {success}
            </div>
          )}


          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    padding: '1rem 1.5rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                  onBlur={(e) => e.target.style.border = '2px solid #e2e8f0'}
                  required
                />

                <input
                  type="text"
                  name="university"
                  placeholder="University"
                  value={formData.university}
                  onChange={handleInputChange}
                  style={{
                    padding: '1rem 1.5rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                  onBlur={(e) => e.target.style.border = '2px solid #e2e8f0'}
                  required
                />

                <input
                  type="number"
                  name="graduationYear"
                  placeholder="Graduation Year"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  style={{
                    padding: '1rem 1.5rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                  onBlur={(e) => e.target.style.border = '2px solid #e2e8f0'}
                  required
                />

                {selectedRole === 'alumni' && (
                  <>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company"
                      value={formData.company}
                      onChange={handleInputChange}
                      style={{
                        padding: '1rem 1.5rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                      onBlur={(e) => e.target.style.border = '2px solid #e2e8f0'}
                      required
                    />
                    <input
                      type="text"
                      name="position"
                      placeholder="Position"
                      value={formData.position}
                      onChange={handleInputChange}
                      style={{
                        padding: '1rem 1.5rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                      onBlur={(e) => e.target.style.border = '2px solid #e2e8f0'}
                      required
                    />
                  </>
                )}
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                padding: '1rem 1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white',
                transition: 'all 0.3s ease',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.border = '2px solid #667eea'}
              onBlur={(e) => e.target.style.border = '2px solid #e2e8f0'}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                padding: '1rem 1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white',
                transition: 'all 0.3s ease',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.border = '2px solid #667eea'}
              onBlur={(e) => e.target.style.border = '2px solid #e2e8f0'}
              required
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                width: '100%'
              }}
            >
              {loading ? 'Please wait...' : (isLogin ? '🔐 Sign In' : '✨ Create Account')}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={toggleAuthMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '1rem',
                textDecoration: 'underline',
                fontWeight: '500'
              }}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Forgot Password */}
          {isLogin && (
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textDecoration: 'underline'
                }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Demo Accounts */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#2d3748', fontSize: '0.9rem' }}>🎯 Demo Accounts</h4>
            <div style={{ fontSize: '0.8rem', color: '#4a5568' }}>
              <p><strong>Student:</strong> student@alumnet.com / student123</p>
              <p><strong>Alumni:</strong> alumni@alumnet.com / alumni123</p>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Form */}
      {showForgotPassword && (
        <div style={{ width: '100%', maxWidth: '800px' }}>
          {/* Header Section */}
          <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: selectedRole === 'student' ?
                'linear-gradient(135deg, rgba(66, 153, 225, 0.9) 0%, rgba(49, 130, 206, 0.9) 100%)' :
                'linear-gradient(135deg, rgba(72, 187, 120, 0.9) 0%, rgba(56, 161, 105, 0.9) 100%)',
              color: 'white',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <span>{selectedRole === 'student' ? '👨‍🎓' : '👩‍💼'}</span>
              <span>{selectedRole === 'student' ? 'Student' : 'Alumni'} Selected</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1rem',
              color: 'white',
              fontWeight: '800',
              textShadow: '0 0 30px rgba(255,255,255,0.5)',
              letterSpacing: '-1px'
            }}>
              Perfect Choice! 🎉
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.2rem',
              fontWeight: '300',
              lineHeight: '1.5'
            }}>
              Do you already have an account or need to create one?
            </p>
          </div>

          {/* Modern Action Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Login Card */}
            <div className="hover-lift fade-in-up" onClick={() => handleAuthModeSelect('login')} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '0',
              boxShadow: '0 20px 40px rgba(31, 38, 135, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              minHeight: '120px',
              cursor: 'pointer',
              animationDelay: '0.1s'
            }}>
              {/* Icon Section */}
              <div style={{
                flex: '0 0 120px',
                height: '120px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: 'white'
              }}>
                🔑
              </div>

              {/* Content Section */}
              <div style={{
                flex: '1',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '4px',
                    height: '30px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '2px',
                    marginRight: '1rem'
                  }}></div>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0'
                  }}>
                    Sign In
                  </h3>
                </div>

                <p style={{
                  fontSize: '1.1rem',
                  color: '#64748b',
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  I already have an account and want to access my dashboard
                </p>
              </div>
            </div>

            {/* Register Card */}
            <div className="hover-lift fade-in-up" onClick={() => handleAuthModeSelect('register')} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '0',
              boxShadow: '0 20px 40px rgba(31, 38, 135, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'center',
              minHeight: '120px',
              cursor: 'pointer',
              animationDelay: '0.2s'
            }}>
              {/* Icon Section */}
              <div style={{
                flex: '0 0 120px',
                height: '120px',
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                color: 'white'
              }}>
                ✨
              </div>

              {/* Content Section */}
              <div style={{
                flex: '1',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '4px',
                    height: '30px',
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    borderRadius: '2px',
                    marginRight: '1rem'
                  }}></div>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0'
                  }}>
                    Create Account
                  </h3>
                </div>

                <p style={{
                  fontSize: '1.1rem',
                  color: '#64748b',
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  I'm new to ALUMNET and want to create a new account
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={resetToStart}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              ← Change Role
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Form */}
      {showResetPassword && (
        <div className="fade-in-up" style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated Background Elements */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
                radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 80% 70%, rgba(240, 147, 251, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 40% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
              `,
            animation: 'gradientShift 20s ease infinite',
            pointerEvents: 'none'
          }}></div>

          {/* Main Content Container */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(30px)',
            borderRadius: '30px',
            padding: 'clamp(2rem, 5vw, 4rem)',
            boxShadow: `
              0 25px 50px rgba(31, 38, 135, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1)
            `,
            border: '2px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '800px',
            width: '100%',
            zIndex: 2,
            margin: '0 auto'
          }}>

          <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
            {/* Role & Mode Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: selectedRole === 'student' ?
                'linear-gradient(135deg, rgba(66, 153, 225, 0.9) 0%, rgba(49, 130, 206, 0.9) 100%)' :
                'linear-gradient(135deg, rgba(72, 187, 120, 0.9) 0%, rgba(56, 161, 105, 0.9) 100%)',
              color: 'white',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '2rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <span>{selectedRole === 'student' ? '👨‍🎓' : '👩‍💼'}</span>
              <span>{selectedRole === 'student' ? 'Student' : 'Alumni'}</span>
              <div style={{
                width: '4px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '50%'
              }}></div>
              <span>{authMode === 'login' ? 'Login' : 'Register'}</span>
            </div>

            {/* Main Title */}
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1rem',
              color: 'white',
              fontWeight: '800',
              textShadow: '0 0 30px rgba(255,255,255,0.5)',
              letterSpacing: '-1px'
            }}>
              {authMode === 'login' ? 'Welcome Back! 👋' : 'Join ALUMNET! 🚀'}
            </h2>

            {/* Subtitle */}
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              fontWeight: '300',
              lineHeight: '1.5'
            }}>
              {authMode === 'login' ?
                'Sign in to access your professional network' :
                'Create your account and start building connections'
              }
            </p>
          </div>

          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
              color: '#c53030',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid #fca5a5'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Modern Form */}
          <form onSubmit={handleSubmit} style={{
            display: 'grid',
            gridTemplateColumns: authMode === 'register' ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr',
            gap: '1.5rem',
            width: '100%',
            position: 'relative',
            zIndex: 2,
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {authMode === 'register' && (
              <div className="slide-in-right" style={{ animationDelay: '0.1s' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="👤 Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    padding: '1.2rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid rgba(102, 126, 234, 0.6)'
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1), inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)'
                    e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                    e.target.style.transform = 'translateY(0)'
                  }}
                  required
                />
              </div>
            )}

            <div className="slide-in-right" style={{ animationDelay: authMode === 'register' ? '0.2s' : '0.1s' }}>
              <input
                type="email"
                name="email"
                placeholder="✉️ Email Address"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '20px',
                  padding: '1.2rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.border = '2px solid rgba(102, 126, 234, 0.6)'
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1), inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)'
                  e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                  e.target.style.transform = 'translateY(0)'
                }}
                required
              />
            </div>

            <div className="slide-in-right" style={{ animationDelay: authMode === 'register' ? '0.3s' : '0.2s' }}>
              <input
                type="password"
                name="password"
                placeholder="🔒 Password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '20px',
                  padding: '1.2rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.border = '2px solid rgba(102, 126, 234, 0.6)'
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1), inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)'
                  e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                  e.target.style.transform = 'translateY(0)'
                }}
                required
              />
            </div>

            {authMode === 'register' && (
              <>
                <div className="slide-in-right" style={{ animationDelay: '0.4s' }}>
                  <input
                    type="text"
                    name="university"
                    placeholder="🏫 University Name"
                    value={formData.university}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '20px',
                      padding: '1.2rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '2px solid rgba(102, 126, 234, 0.6)'
                      e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1), inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                      e.target.style.transform = 'translateY(-2px)'
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)'
                      e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                      e.target.style.transform = 'translateY(0)'
                    }}
                    required
                  />
                </div>

                <div className="slide-in-right" style={{ animationDelay: '0.5s' }}>
                  <input
                    type="number"
                    name="graduationYear"
                    placeholder="📅 Graduation Year"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '20px',
                      padding: '1.2rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '2px solid rgba(102, 126, 234, 0.6)'
                      e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1), inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                      e.target.style.transform = 'translateY(-2px)'
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)'
                      e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                      e.target.style.transform = 'translateY(0)'
                    }}
                    required
                  />
                </div>

                {selectedRole === 'alumni' && (
                  <>
                    <div className="slide-in-right" style={{ animationDelay: '0.6s' }}>
                      <input
                        type="text"
                        name="company"
                        placeholder="🏢 Current Company"
                        value={formData.company}
                        onChange={handleInputChange}
                        style={{
                          ...styles.input,
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '20px',
                          padding: '1.2rem 1.5rem',
                          fontSize: '1rem',
                          fontWeight: '500',
                          boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid rgba(102, 126, 234, 0.6)'
                          e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1), inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                          e.target.style.transform = 'translateY(-2px)'
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)'
                          e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                          e.target.style.transform = 'translateY(0)'
                        }}
                        required
                      />
                    </div>

                    <div className="slide-in-right" style={{ animationDelay: '0.7s' }}>
                      <input
                        type="text"
                        name="position"
                        placeholder="💼 Current Position"
                        value={formData.position}
                        onChange={handleInputChange}
                        style={{
                          ...styles.input,
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '20px',
                          padding: '1.2rem 1.5rem',
                          fontSize: '1rem',
                          fontWeight: '500',
                          boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '2px solid rgba(102, 126, 234, 0.6)'
                          e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1), inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                          e.target.style.transform = 'translateY(-2px)'
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)'
                          e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1)'
                          e.target.style.transform = 'translateY(0)'
                        }}
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Modern Submit Button */}
            <div className="slide-in-right" style={{ 
              animationDelay: authMode === 'register' && selectedRole === 'alumni' ? '0.8s' : authMode === 'register' ? '0.6s' : '0.3s',
              gridColumn: '1 / -1'
            }}>
              <button
                type="submit"
                className="hover-lift hover-glow"
                style={{
                  width: '100%',
                  padding: '1.2rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  background: authMode === 'login' ?
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                    'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: authMode === 'login' ?
                    '0 15px 35px rgba(102, 126, 234, 0.4)' :
                    '0 15px 35px rgba(72, 187, 120, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: loading ? 0.7 : 1,
                  transform: loading ? 'scale(0.98)' : 'scale(1)'
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-3px) scale(1.02)'
                    e.target.style.boxShadow = authMode === 'login' ?
                      '0 20px 40px rgba(102, 126, 234, 0.6)' :
                      '0 20px 40px rgba(72, 187, 120, 0.6)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0) scale(1)'
                    e.target.style.boxShadow = authMode === 'login' ?
                      '0 15px 35px rgba(102, 126, 234, 0.4)' :
                      '0 15px 35px rgba(72, 187, 120, 0.4)'
                  }
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div className="shimmer-effect" style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>{authMode === 'login' ? 'Signing in...' : 'Creating Account...'}</span>
                  </div>
                ) : (
                  <span>{authMode === 'login' ? '🚀 Sign In' : '✨ Create Account'}</span>
                )}
              </button>
            </div>
          </form>

          {/* Navigation Buttons */}
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 2
          }}>
            <button
              onClick={() => setAuthMode('')}
              className="hover-lift"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              ← Back
            </button>
            <button
              onClick={resetToStart}
              className="hover-lift"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Change Role
            </button>
          </div>

          {/* Forgot Password Link */}
          {authMode === 'login' && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem', position: 'relative', zIndex: 2 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowForgotPassword(true)
                }}
                className="hover-lift"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                🔐 Forgot Password?
              </button>
            </div>
          )}

          {authMode === 'login' && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 25px rgba(31, 38, 135, 0.1)',
              position: 'relative',
              zIndex: 2
            }}>
              <h4 style={{ 
                marginBottom: '1rem', 
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                🎯 Demo Accounts Available
              </h4>
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                lineHeight: '1.6'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    background: 'rgba(66, 153, 225, 0.2)',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(66, 153, 225, 0.3)'
                  }}>
                    <strong>👨‍🎓 Student:</strong> student@alumnet.com / Student123
                  </div>
                  <div style={{
                    background: 'rgba(72, 187, 120, 0.2)',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(72, 187, 120, 0.3)'
                  }}>
                    <strong>👩‍💼 Alumni:</strong> alumni@alumnet.com / Alumni123
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Forgot Password Form */}
      {showForgotPassword && (
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              color: '#2d3748',
              fontWeight: '700'
            }}>
              🔐 Forgot Password
            </h2>
            <p style={{ color: '#4a5568', fontSize: '16px' }}>
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
              color: '#c53030',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid #fca5a5'
            }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)',
              color: '#2f855a',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid #68d391'
            }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleForgotPassword} style={styles.form}>
            <input
              type="email"
              name="email"
              placeholder="✉️ Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              required
            />

            <button
              type="submit"
              style={{
                ...styles.button,
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
              disabled={loading}
            >
              {loading ? '🔄 Sending...' : '📧 Send Reset Link'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => setShowForgotPassword(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Form */}
      {showResetPassword && (
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              color: '#2d3748',
              fontWeight: '700'
            }}>
              🔑 Reset Password
            </h2>
            <p style={{ color: '#4a5568', fontSize: '16px' }}>
              Enter your new password below
            </p>
          </div>

          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
              color: '#c53030',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid #fca5a5'
            }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)',
              color: '#2f855a',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid #68d391'
            }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleResetPassword} style={styles.form}>
            <input
              type="password"
              name="password"
              placeholder="🔒 Enter new password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
              required
              minLength="6"
            />

            <div style={{
              fontSize: '12px',
              color: '#4a5568',
              marginBottom: '1rem',
              padding: '0.5rem',
              background: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '8px'
            }}>
              Password must be at least 6 characters with uppercase, lowercase, and number
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
              }}
              disabled={loading}
            >
              {loading ? '🔄 Resetting...' : '🔑 Reset Password'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => {
                setShowResetPassword(false)
                setShowForgotPassword(false)
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Landing Page
const Landing = () => {
  useEffect(() => {
    // Add floating background elements
    const createFloatingElements = () => {
      const container = document.querySelector('.hero-container');
      if (!container) return;

      for (let i = 0; i < 6; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.cssText = `
          position: absolute;
          width: ${Math.random() * 100 + 50}px;
          height: ${Math.random() * 100 + 50}px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          animation: float ${Math.random() * 3 + 4}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
          pointer-events: none;
        `;
        container.appendChild(element);
      }
    };

    setTimeout(createFloatingElements, 100);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section with Modern Design */}
      <div className="hero-container" style={{
        ...styles.heroSection,
        position: 'relative',
        overflow: 'hidden'
      }}>

        <div className="fade-in-up" style={{
          textAlign: 'center',
          zIndex: 2,
          position: 'relative',
          maxWidth: '800px',
          padding: '0 2rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            marginBottom: '2rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
            letterSpacing: '-2px'
          }}>
            🎓 ALUMNET
          </h1>

          <p style={{
            fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
            marginBottom: '3rem',
            color: '#64748b',
            fontWeight: '300',
            letterSpacing: '1px'
          }}>
            Connect. Network. <span style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '600'
            }}>Grow.</span>
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth" className="hover-lift hover-glow" style={{
              ...styles.button,
              textDecoration: 'none',
              fontSize: '1.2rem',
              padding: '1.2rem 3rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
              fontWeight: '600',
              color: 'white'
            }}>
              🚀 Get Started
            </Link>

            <button className="hover-lift" style={{
              ...styles.button,
              background: 'transparent',
              border: '2px solid #667eea',
              color: '#667eea',
              fontSize: '1.2rem',
              padding: '1.2rem 3rem',
              fontWeight: '600',
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.2)'
            }}>
              📖 Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.pageSection}>
        <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            letterSpacing: '-1px'
          }}>
            Platform Features
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Discover powerful tools designed to connect students and alumni in meaningful ways
          </p>
        </div>

        <div className="features-grid-2x3">
          {[
            {
              icon: '👥',
              title: 'Alumni Network',
              subtitle: 'Connect with professionals from your university',
              description: 'Build meaningful professional relationships with alumni who share your educational background. Access mentorship opportunities, career guidance, and industry insights from experienced professionals.',
              tags: ['Networking', 'Mentorship', 'Career Growth', 'Professional'],
              imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=faces',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            {
              icon: '💼',
              title: 'Job Board',
              subtitle: 'Exclusive opportunities from alumni employers',
              description: 'Discover job postings shared directly by alumni working at top companies. Get insider access to positions that may not be publicly advertised and receive referrals from your network.',
              tags: ['Exclusive Jobs', 'Referrals', 'Career Opportunities', 'Alumni Posted'],
              imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop&crop=center',
              gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            },
            {
              icon: '📚',
              title: 'Events & Workshops',
              subtitle: 'Join networking events and skill-building sessions',
              description: 'Participate in career fairs, industry workshops, and networking meetups organized by your alumni community. Stay updated with the latest trends and expand your professional circle.',
              tags: ['Networking Events', 'Workshops', 'Career Fairs', 'Skill Building'],
              imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop&crop=center',
              gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            },
            {
              icon: '💬',
              title: 'Community Forum',
              subtitle: 'Share experiences and get advice from peers',
              description: 'Engage in meaningful discussions with fellow students and alumni. Share your experiences, ask questions, and get valuable advice from those who have walked similar paths.',
              tags: ['Discussion', 'Peer Support', 'Knowledge Sharing', 'Q&A'],
              imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop&crop=faces',
              gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
            },
            {
              icon: '🤖',
              title: 'AI Career Assistant',
              subtitle: 'Personalized guidance powered by artificial intelligence',
              description: 'Get instant career advice, resume feedback, and interview preparation tips from our intelligent AI assistant. Available 24/7 to help you navigate your professional journey.',
              tags: ['AI Powered', '24/7 Support', 'Career Guidance', 'Personalized'],
              imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center',
              gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            },
            {
              icon: '🔒',
              title: 'Secure Platform',
              subtitle: 'Enterprise-grade security for your data',
              description: 'Your personal information and professional data are protected with advanced encryption and security measures. We prioritize your privacy and maintain the highest security standards.',
              tags: ['Data Protection', 'Privacy First', 'Encrypted', 'Secure'],
              imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&crop=center',
              gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            }
          ].map((feature, index) => (
            <div key={index} className="hover-lift" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '0',
              boxShadow: '0 20px 40px rgba(31, 38, 135, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              animationDelay: `${index * 0.1}s`,
              display: 'flex',
              flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
              alignItems: 'center',
              minHeight: '280px'
            }}>
              {/* Image Section */}
              <div style={{
                flex: '0 0 45%',
                height: '280px',
                backgroundImage: `url(${feature.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }}>
                  {feature.icon}
                </div>
              </div>

              {/* Content Section */}
              <div style={{
                flex: '1',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '4px',
                    height: '24px',
                    background: feature.gradient,
                    borderRadius: '2px',
                    marginRight: '12px'
                  }}></div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0'
                  }}>
                    {feature.title}
                  </h3>
                </div>

                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  {feature.subtitle}
                </p>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#64748b',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  {feature.description}
                </p>

                {/* Feature Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {feature.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Accounts Section */}
        <div className="fade-in-up" style={{
          ...styles.contentBox,
          marginTop: '5rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '2px solid rgba(102, 126, 234, 0.2)',
          maxWidth: '600px',
          margin: '5rem auto 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎯</div>
          <h3 style={{
            fontSize: '2.2rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            Try Demo Accounts
          </h3>
          <div style={{
            fontSize: '1.2rem',
            color: '#475569',
            lineHeight: '2',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '2rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ margin: '0.5rem 0' }}>
              <strong style={{ color: '#3b82f6' }}>👨‍🎓 Student:</strong> student@alumnet.com / student123
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong style={{ color: '#10b981' }}>👩‍💼 Alumni:</strong> alumni@alumnet.com / alumni123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Dashboard with Sidebar Layout
const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'transparent',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Welcome Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '800'
        }}>
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          fontWeight: '400'
        }}>
          Here's what's happening with your network today
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem',
        maxWidth: '1200px',
        margin: '0 auto 3rem'
      }}>
        {/* Connections Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem'
          }}>
            👥
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
            {user?.role === 'alumni' ? '156' : '89'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            {user?.role === 'alumni' ? 'Students Connected' : 'Alumni Connections'}
          </p>
        </div>

        {/* Jobs Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem'
          }}>
            💼
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
            {user?.role === 'alumni' ? '12' : '24'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            {user?.role === 'alumni' ? 'Jobs Posted' : 'Job Applications'}
          </p>
        </div>

        {/* Events Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem'
          }}>
            📅
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
            {user?.role === 'alumni' ? '8' : '15'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            {user?.role === 'alumni' ? 'Events Hosted' : 'Events Attended'}
          </p>
        </div>

        {/* Messages Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem'
          }}>
            💬
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' }}>
            {user?.role === 'alumni' ? '43' : '28'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            Unread Messages
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Quick Actions
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Browse Jobs */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                fontSize: '1.2rem'
              }}>
                💼
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                {user?.role === 'alumni' ? 'Post a Job' : 'Browse Jobs'}
              </h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
              {user?.role === 'alumni' 
                ? 'Share job opportunities with students and help them grow their careers'
                : 'Discover exciting job opportunities posted by alumni in your field'
              }
            </p>
          </div>

          {/* Network */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                fontSize: '1.2rem'
              }}>
                🤝
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                Expand Network
              </h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
              Connect with {user?.role === 'alumni' ? 'students and fellow alumni' : 'alumni and peers'} to build meaningful professional relationships
            </p>
          </div>

          {/* Community */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                fontSize: '1.2rem'
              }}>
                💬
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                Join Discussions
              </h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
              Participate in community discussions, share insights, and learn from others' experiences
            </p>
          </div>
        </div>
      </div>
    </div>
  )


      {/* Main Content Area */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {user?.role === 'student' ? (
            <>
              <div style={{
                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>12</div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Job Applications</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤝</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>28</div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Alumni Connections</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>15</div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Community Posts</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>5</div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Events Attended</div>
              </div>
            </>
          ) : (
            <>
              <div style={{
                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💼</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>8</div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Jobs Posted</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>45</div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Students Mentored</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>6</div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Events Organized</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>156</div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Applications Received</div>
              </div>
            </>
          )}
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          
          {/* Left Column - Recent Activity & Quick Actions */}
          <div>
            {/* Recent Activity */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📈 Recent Activity
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {user?.role === 'student' ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                      <div style={{ fontSize: '1.5rem' }}>📄</div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>Applied to Frontend Developer at Google</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>2 hours ago</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f0fff4', borderRadius: '10px' }}>
                      <div style={{ fontSize: '1.5rem' }}>🤝</div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>Connected with Sarah Johnson (Alumni)</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>5 hours ago</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#fefce8', borderRadius: '10px' }}>
                      <div style={{ fontSize: '1.5rem' }}>💬</div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>Posted in Career Guidance community</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>1 day ago</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f3e8ff', borderRadius: '10px' }}>
                      <div style={{ fontSize: '1.5rem' }}>🤖</div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>Got AI resume feedback</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>2 days ago</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                      <div style={{ fontSize: '1.5rem' }}>💼</div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>Posted Senior React Developer position</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>3 hours ago</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f0fff4', borderRadius: '10px' }}>
                      <div style={{ fontSize: '1.5rem' }}>📅</div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>Created Tech Career Fair event</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>6 hours ago</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#fefce8', borderRadius: '10px' }}>
                      <div style={{ fontSize: '1.5rem' }}>👤</div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>Reviewed 5 new job applications</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>1 day ago</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f3e8ff', borderRadius: '10px' }}>
                      <div style={{ fontSize: '1.5rem' }}>💬</div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>Shared career tips in community</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>2 days ago</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🚀 Quick Actions
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <Link to="/jobs" className="hover-lift" style={{
                  ...styles.button,
                  textDecoration: 'none',
                  textAlign: 'center',
                  padding: '1.5rem',
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{ fontSize: '2rem' }}>💼</div>
                  <div>Browse Jobs</div>
                </Link>
                <Link to="/community" className="hover-lift" style={{
                  ...styles.button,
                  textDecoration: 'none',
                  textAlign: 'center',
                  padding: '1.5rem',
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{ fontSize: '2rem' }}>💬</div>
                  <div>Community</div>
                </Link>
                <Link to="/chatbot" className="hover-lift" style={{
                  ...styles.button,
                  textDecoration: 'none',
                  textAlign: 'center',
                  padding: '1.5rem',
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{ fontSize: '2rem' }}>🤖</div>
                  <div>AI Assistant</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Recommendations */}
          <div>
            {/* Profile Summary */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                👤 Profile Summary
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Name</div>
                  <div style={{ color: '#64748b' }}>{user?.profile?.firstName} {user?.profile?.lastName}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>University</div>
                  <div style={{ color: '#64748b' }}>{user?.profile?.university || 'Not specified'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Graduation Year</div>
                  <div style={{ color: '#64748b' }}>{user?.profile?.graduationYear || 'Not specified'}</div>
                </div>
                {user?.role === 'alumni' && (
                  <>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Company</div>
                      <div style={{ color: '#64748b' }}>{user?.profile?.company || 'Not specified'}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Position</div>
                      <div style={{ color: '#64748b' }}>{user?.profile?.position || 'Not specified'}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                💡 Recommendations
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {user?.role === 'student' ? (
                  <>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #4299e1' }}>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Complete Your Profile</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Add your skills and interests to get better job matches</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '10px', borderLeft: '4px solid #48bb78' }}>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Connect with Alumni</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Reach out to alumni in your field for mentorship</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#fefce8', borderRadius: '10px', borderLeft: '4px solid #eab308' }}>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Attend Events</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Join upcoming career fairs and networking events</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #4299e1' }}>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Post a Job</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Help students by posting open positions at your company</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '10px', borderLeft: '4px solid #48bb78' }}>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Mentor Students</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Share your experience and guide the next generation</div>
                    </div>
                    <div style={{ padding: '1rem', background: '#fefce8', borderRadius: '10px', borderLeft: '4px solid #eab308' }}>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>Organize Events</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Create networking events and workshops</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Jobs Page
const Jobs = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'transparent',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '2rem',
        textAlign: 'center',
        color: '#1e293b'
      }}>
        Jobs Page
      </h1>
    </div>
  )
}

// Events Page - Alumni Only
const Events = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'transparent',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '2rem',
        textAlign: 'center',
        color: '#1e293b'
      }}>
        Events Page
      </h1>
    </div>
  )
}

// Community Page
const Community = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'transparent',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '2rem',
        textAlign: 'center',
        color: '#1e293b'
      }}>
        Community Page
      </h1>
    </div>
  )
}

// Chatbot Page
const Chatbot = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'transparent',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '2rem',
        textAlign: 'center',
        color: '#1e293b'
      }}>
        AI Chatbot
      </h1>
    </div>
  )
}

const CommunityOld = () => {
      description: 'Join our backend team to build scalable and robust server-side applications using modern technologies.',
      postedBy: 'John Smith',
      applicants: 18,
      posted: '1 week ago'
    },
    {
      _id: '3',
      title: 'Product Manager Intern',
      company: 'Amazon',
      location: 'Mumbai, India',
      type: 'Internship',
      salary: '₹50,000/month',
      description: 'Great opportunity for students to learn product management in a fast-paced environment.',
      postedBy: 'Emily Davis',
      applicants: 45,
      posted: '3 days ago'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const { user } = useAuth()

  // Simplified for now - just show sample data
  useEffect(() => {
    setLoading(false)
  }, [])

  const handleAddJob = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3001/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newJob)
      })
      const result = await response.json()
      if (result.success) {
        setJobs([result.job, ...jobs])
        setNewJob({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '' })
        setShowAddForm(false)
        alert('Job posted successfully!')
      }
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      background: 'transparent',
      padding: '2rem'
    }}>
      <h1>Old Community Component</h1>
    </div>
  )
}

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

// Main App Component with Auth Redirect
const AppContent = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user && (window.location.pathname === '/' || window.location.pathname === '/auth')) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  return (
    <>
      {/* Global Animated Background Dots - Full Page Coverage */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Generate animated dots */}
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              borderRadius: '50%',
              background: [
                'rgba(255, 107, 107, 0.6)',  // Red/Pink
                'rgba(54, 162, 235, 0.6)',   // Blue
                'rgba(255, 193, 7, 0.6)',    // Yellow/Orange
                'rgba(75, 192, 192, 0.6)',   // Teal
                'rgba(153, 102, 255, 0.6)',  // Purple
                'rgba(255, 159, 64, 0.6)'    // Orange
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
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              marginBottom: '1rem',
              fontWeight: '800',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              💼 Job Opportunities
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
              {user?.role === 'alumni' ?
                'Manage job postings and help students find their dream careers' :
                'Discover exclusive opportunities posted by alumni from your network'
              }
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            maxWidth: '800px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="🔍 Search jobs, companies, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: '1',
                padding: '1rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                minWidth: '300px'
              }}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '1rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                minWidth: '150px'
              }}
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            {user?.role === 'alumni' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="hover-lift"
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '25px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {showAddForm ? '❌ Cancel' : '➕ Post Job'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💼</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>{filteredJobs.length}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Available Jobs</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>3</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Top Companies</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>3</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Cities</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>86</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Applicants</div>
          </div>
        </div>

      {/* Add Job Form - Only for Alumni */}
      {user?.role === 'alumni' && showAddForm && (
        <div className="fade-in-up" style={{
          ...styles.modernCard,
          marginBottom: '3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2rem', marginRight: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.8rem', color: '#1e293b', margin: 0 }}>Post New Job Opportunity</h3>
          </div>
          <form onSubmit={handleAddJob} style={styles.form}>
            <input
              type="text"
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Company"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              style={styles.input}
              required
            />
            <select
              value={newJob.type}
              onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
              style={styles.input}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <input
              type="text"
              placeholder="Salary (e.g., ₹8-12 LPA)"
              value={newJob.salary}
              onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Job Description"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              required
            />
            <button type="submit" style={styles.button}>Post Job</button>
          </form>
        </div>
      )}

        {/* Job Listings */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredJobs.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              background: 'white',
              padding: '3rem',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
              <h3 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>No jobs found</h3>
              <p style={{ color: '#64748b' }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new opportunities!'}
              </p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job._id} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease'
              }} className="hover-lift">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2d3748', marginBottom: '0.5rem' }}>
                      {job.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#4299e1' }}>{job.company}</span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ color: '#64748b' }}>{job.location}</span>
                    </div>
                  </div>
                  <span style={{
                    background: job.type === 'Full-time' ? '#e6fffa' : 
                               job.type === 'Internship' ? '#fef7e0' : '#f0f9ff',
                    color: job.type === 'Full-time' ? '#047857' : 
                           job.type === 'Internship' ? '#92400e' : '#1e40af',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {job.type}
                  </span>
                </div>

                <p style={{ color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {job.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>💰 {job.salary}</span>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>👥 {job.applicants} applicants</span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{job.posted}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Posted by {job.postedBy}
                  </span>
                  {user?.role === 'student' ? (
                    <button className="hover-lift" style={{
                      ...styles.button,
                      background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.9rem'
                    }}>
                      Apply Now
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        ...styles.button,
                        background: '#fbbf24',
                        color: '#000',
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem'
                      }}>
                        Edit
                      </button>
                      <button style={{
                        ...styles.button,
                        background: '#ef4444',
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem'
                      }}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Events Page - Alumni Only
const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setEvents([])
    setLoading(false)
  }, [])



  // Only Alumni can access this page
  if (user?.role !== 'alumni') {
    return (
      <div style={styles.pageSection}>
        <div style={{
          ...styles.modernCard,
          textAlign: 'center',
          maxWidth: '600px',
          margin: '4rem auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🚫</div>
          <h2 style={{
            fontSize: '2rem',
            color: '#1e293b',
            marginBottom: '1rem',
            fontWeight: '700'
          }}>
            Access Restricted
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1rem' }}>
            Only Alumni can access the Events section.
          </p>
          <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2rem' }}>
            Students can participate in events through community announcements.
          </p>
          <Link to="/dashboard" className="hover-lift" style={{
            ...styles.button,
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }



  return (
    <div style={styles.pageSection}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '800',
          letterSpacing: '-1px'
        }}>
          📅 Event Management
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          Organize networking events, workshops, and career fairs for students
        </p>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="hover-lift"
          style={{
            ...styles.button,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            fontSize: '1.1rem',
            padding: '1rem 2rem'
          }}
        >
          {showAddForm ? '❌ Cancel' : '➕ Create New Event'}
        </button>
      </div>



      {events.length === 0 ? (
        <div style={styles.card}>
          <p>No events scheduled at the moment. Create the first event!</p>
        </div>
      ) : (
        events.map(event => (
          <div key={event._id} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p>{event.description}</p>
              </div>
              <div style={{ marginLeft: '20px' }}>
                <span style={{
                  background: '#e8f5e8',
                  color: '#2e7d32',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  Your Event
                </span>
              </div>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button style={{ ...styles.button, background: '#ffc107', color: '#000' }}>
                Edit Event
              </button>
              <button style={{ ...styles.button, background: '#dc3545' }}>
                Cancel Event
              </button>
              <button style={{ ...styles.button, background: '#6c757d' }}>
                View Registrations (12)
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// Community Page
const Community = () => {
  const [posts, setPosts] = useState([
    {
      _id: '1',
      title: 'Tips for Landing Your First Job',
      author: 'Sarah Johnson (Alumni)',
      category: 'Career Advice',
      content: 'After working in tech for 5 years, here are my top tips for new graduates: 1) Build a strong portfolio, 2) Network actively, 3) Practice coding interviews, 4) Don\'t be afraid to apply to positions slightly above your level.',
      likes: 24,
      comments: 8,
      timeAgo: '2 hours ago',
      tags: ['Career', 'Tips', 'Job Search']
    },
    {
      _id: '2',
      title: 'Looking for Study Group - Data Structures',
      author: 'Mike Chen (Student)',
      category: 'Study Groups',
      content: 'Hey everyone! I\'m looking for people to form a study group for Data Structures and Algorithms. We can meet virtually twice a week. Anyone interested?',
      likes: 12,
      comments: 15,
      timeAgo: '5 hours ago',
      tags: ['Study Group', 'DSA', 'Learning']
    },
    {
      _id: '3',
      title: 'Internship Experience at Google',
      author: 'Alex Kumar (Alumni)',
      category: 'Experience Sharing',
      content: 'Just completed my summer internship at Google! Happy to share my experience and answer any questions about the application process, interview prep, or what it\'s like working there.',
      likes: 45,
      comments: 23,
      timeAgo: '1 day ago',
      tags: ['Internship', 'Google', 'Experience']
    }
  ])
  const [loading, setLoading] = useState(false)
  const [newPost, setNewPost] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Simplified for now - just show sample data
  useEffect(() => {
    setLoading(false)
  }, [])

  const filteredPosts = selectedCategory === 'all' ? posts : 
    posts.filter(post => post.category.toLowerCase().includes(selectedCategory.toLowerCase()))

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 80px)',
      background: `
        linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%),
        radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)
      `,
      padding: '0'
    }}>
      {/* Top Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        color: 'white',
        padding: '3rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              marginBottom: '1rem',
              fontWeight: '800',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              💬 Community Forum
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
              Connect, share experiences, and get advice from fellow students and alumni
            </p>
          </div>

          {/* Category Filter */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {['all', 'career', 'study', 'experience', 'networking'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  background: selectedCategory === category ? 
                    'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize'
                }}
              >
                {category === 'all' ? 'All Posts' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>{filteredPosts.length}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Active Posts</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>150+</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Community Members</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❤️</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>81</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Likes</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💭</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>46</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Comments</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          
          {/* Left Column - Posts */}
          <div>
            {/* Create Post Section */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ✍️ Share Your Thoughts
              </h3>
              <textarea
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '15px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  marginBottom: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              <button className="hover-lift" style={{
                ...styles.button,
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                padding: '0.75rem 1.5rem'
              }}>
                📝 Create Post
              </button>
            </div>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💭</div>
                <h3 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>No posts found</h3>
                <p style={{ color: '#64748b' }}>Be the first to start a discussion!</p>
              </div>
            ) : (
              filteredPosts.map((post, index) => (
                <div key={post._id} style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  marginBottom: '2rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease'
                }} className="hover-lift">
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginRight: '1rem',
                      flexShrink: 0
                    }}>
                      {post.author.includes('Alumni') ? '👩‍💼' : '👨‍🎓'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        color: '#2d3748',
                        marginBottom: '0.5rem'
                      }}>
                        {post.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: '#4299e1' }}>{post.author}</span>
                        <span style={{ color: '#64748b' }}>•</span>
                        <span style={{
                          background: '#f0f9ff',
                          color: '#1e40af',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          {post.category}
                        </span>
                        <span style={{ color: '#64748b' }}>•</span>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <p style={{
                    color: '#4a5568',
                    lineHeight: '1.6',
                    marginBottom: '1rem',
                    fontSize: '1rem'
                  }}>
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="hover-lift" style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}>
                      👍 {post.likes}
                    </button>
                    <button className="hover-lift" style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}>
                      💬 {post.comments}
                    </button>
                    <button className="hover-lift" style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}>
                      🔗 Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Trending Topics */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔥 Trending Topics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['#CareerTips', '#JobSearch', '#Networking', '#StudyGroup', '#Internships'].map((topic, index) => (
                  <div key={index} style={{
                    padding: '0.75rem',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }} className="hover-lift">
                    <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>{topic}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{Math.floor(Math.random() * 50) + 10} posts</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Members */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                👥 Active Members
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'Sarah Johnson', role: 'Alumni', company: 'Google' },
                  { name: 'Mike Chen', role: 'Student', year: '2024' },
                  { name: 'Alex Kumar', role: 'Alumni', company: 'Microsoft' },
                  { name: 'Priya Sharma', role: 'Student', year: '2025' }
                ].map((member, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: '#f8fafc',
                    borderRadius: '10px'
                  }}>
                    <div style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      background: member.role === 'Alumni' ? 
                        'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' :
                        'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      color: 'white'
                    }}>
                      {member.role === 'Alumni' ? '👩‍💼' : '👨‍🎓'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '0.9rem' }}>{member.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {member.role === 'Alumni' ? member.company : `Class of ${member.year}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



// Chatbot Page
const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Hello! I\'m your AI career assistant. I can help you with resume feedback, interview preparation, career advice, and job search strategies. What would you like to discuss today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { token, user } = useAuth()

  const quickQuestions = [
    "Help me improve my resume",
    "How to prepare for interviews?",
    "What skills should I learn?",
    "How to network effectively?",
    "Career change advice",
    "Salary negotiation tips"
  ]

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return

    const userMessage = { 
      type: 'user', 
      text: messageText,
      timestamp: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response for demo
    setTimeout(() => {
      const responses = {
        "help me improve my resume": "Here are key tips for improving your resume:\n\n1. **Tailor to each job** - Customize your resume for each application\n2. **Use action verbs** - Start bullet points with strong action words\n3. **Quantify achievements** - Include numbers and metrics where possible\n4. **Keep it concise** - Aim for 1-2 pages maximum\n5. **Include relevant keywords** - Use terms from the job description\n\nWould you like me to review a specific section of your resume?",
        
        "how to prepare for interviews": "Great question! Here's a comprehensive interview preparation guide:\n\n**Before the Interview:**\n• Research the company and role thoroughly\n• Practice common interview questions\n• Prepare STAR method examples\n• Plan your outfit and route\n\n**During the Interview:**\n• Arrive 10-15 minutes early\n• Maintain good eye contact and posture\n• Ask thoughtful questions about the role\n• Show enthusiasm and genuine interest\n\n**After the Interview:**\n• Send a thank-you email within 24 hours\n• Follow up appropriately\n\nWhat specific aspect would you like to dive deeper into?",
        
        "default": `That's a great question about "${messageText}"! As your AI career assistant, I'd recommend:\n\n• **Research thoroughly** - Understanding your specific situation is key\n• **Network with professionals** - Connect with alumni in your field\n• **Practice and prepare** - Consistent effort leads to better outcomes\n• **Stay updated** - Keep learning about industry trends\n\nFor more personalized advice, could you share more details about your current situation or specific goals?`
      }

      const responseKey = messageText.toLowerCase()
      const botResponse = responses[responseKey] || responses["default"]

      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: botResponse,
        timestamp: new Date().toLocaleTimeString()
      }])
      setLoading(false)
    }, 1500)
  }

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 80px)',
      background: `
        linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%),
        radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)
      `,
      padding: '0'
    }}>
      {/* Top Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        color: 'white',
        padding: '3rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: '1rem',
            fontWeight: '800',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            🤖 AI Career Assistant
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Get personalized career advice, resume feedback, and networking tips available 24/7
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>{messages.length}</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Messages</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>24/7</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Available</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>Instant</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Responses</div>
          </div>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d3748' }}>Expert</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Career Advice</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          
          {/* Left Column - Chat Interface */}
          <div>
            {/* Chat Messages */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '0',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              height: '600px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Chat Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e2e8f0',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    🤖
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>AI Career Assistant</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Online • Ready to help</div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {messages.map((message, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '1rem 1.25rem',
                      borderRadius: message.type === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                      background: message.type === 'user' ? 
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                        '#f8fafc',
                      color: message.type === 'user' ? 'white' : '#2d3748',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        fontSize: '1rem', 
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {message.text}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        opacity: 0.7,
                        marginTop: '0.5rem'
                      }}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '20px 20px 20px 5px',
                      background: '#f8fafc',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#fa709a',
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#fa709a',
                        animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#fa709a',
                        animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                      }}></div>
                      <span style={{ marginLeft: '0.5rem' }}>AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div style={{
                padding: '1rem',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me about careers, networking, or job search..."
                    style={{
                      flex: 1,
                      padding: '1rem 1.25rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    style={{
                      padding: '1rem 1.5rem',
                      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading || !input.trim() ? 0.6 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? '⏳' : '🚀'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Tips */}
          <div>
            {/* Quick Questions */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                💡 Quick Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    style={{
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      color: '#4a5568'
                    }}
                    className="hover-lift"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Capabilities */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: '#2d3748',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎯 I Can Help With
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: '📄', title: 'Resume Review', desc: 'Get feedback on your resume structure and content' },
                  { icon: '💼', title: 'Interview Prep', desc: 'Practice questions and preparation strategies' },
                  { icon: '🎓', title: 'Skill Development', desc: 'Learn what skills to focus on for your career' },
                  { icon: '🤝', title: 'Networking Tips', desc: 'Build professional relationships effectively' },
                  { icon: '💰', title: 'Salary Advice', desc: 'Negotiation strategies and market insights' },
                  { icon: '🚀', title: 'Career Planning', desc: 'Long-term career strategy and goal setting' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: '#f8fafc',
                    borderRadius: '10px'
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



// Main App Component
// Main App Component with Auth Redirect
const AppContent = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user && (window.location.pathname === '/' || window.location.pathname === '/auth')) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  return (
    <>
      {/* Global Animated Background Dots - Full Page Coverage */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Generate animated dots */}
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              borderRadius: '50%',
              background: [
                'rgba(255, 107, 107, 0.6)',  // Red/Pink
                'rgba(54, 162, 235, 0.6)',   // Blue
                'rgba(255, 193, 7, 0.6)',    // Yellow/Orange
                'rgba(75, 192, 192, 0.6)',   // Teal
                'rgba(153, 102, 255, 0.6)',  // Purple
                'rgba(255, 159, 64, 0.6)'    // Orange
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
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/jobs" element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        } />
        <Route path="/chatbot" element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <div style={styles.container}>
            <div style={styles.card}>
              <h1>Page Not Found</h1>
              <Link to="/" style={styles.button}>Go Home</Link>
            </div>
          </div>
        } />
      </Routes>
    </>
  )
}

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
