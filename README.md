# 🎓 ALUMNET - Alumni Network Platform

A modern, full-featured alumni networking platform built with React. Connect with alumni, discover job opportunities, attend events, and grow your professional network.

![ALUMNET Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=ALUMNET+Alumni+Network)

## ✨ Features

### 🏠 **Dashboard**
- Personalized welcome with user stats
- Quick overview of jobs, events, messages, and community activity
- Recent activity tracking
- Interactive navigation sidebar

### 💼 **Job Opportunities**
- Browse exclusive job postings from alumni
- Detailed job descriptions with requirements
- Quick apply functionality
- Filter by category, salary, and location
- Alumni referral system

### 📅 **Events & Workshops**
- Comprehensive event listings
- Registration management
- Virtual and in-person events
- Networking opportunities
- Career fairs and workshops

### 👥 **Community Discussions**
- Active discussion forums
- Trending topics and hashtags
- Post creation and engagement
- Alumni expertise sharing
- Career advice and tips

### 💬 **Messaging System**
- Real-time messaging interface
- Connect with alumni professionals
- Online status indicators
- Conversation management

### 📄 **Resume Builder**
- Interactive resume creation
- Live preview functionality
- Professional templates
- LinkedIn import capability
- PDF export feature

### 🤖 **AI Career Assistant**
- 24/7 career guidance
- Interview preparation
- Resume feedback
- Salary negotiation tips
- Personalized career advice

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/alumnet.git
   cd alumnet
   ```

2. **Install dependencies**
   ```bash
   # For the main project
   npm install
   
   # For the frontend
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   # From the frontend directory
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 📁 Project Structure

```
alumnet/
├── frontend/
│   ├── src/
│   │   ├── App-clean.jsx      # Main application component
│   │   ├── App-complete.jsx   # Alternative implementation
│   │   ├── main.jsx          # Application entry point
│   │   └── index.css         # Global styles
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── package.json
```

## 🌐 Deployment

### Deploy to Netlify

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `cd frontend && npm run build`
   - Set publish directory: `frontend/dist`
   - Deploy!

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

### Environment Variables

Create a `.env` file in the frontend directory for any environment-specific configurations:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=ALUMNET
```

## 🛠️ Built With

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Modern CSS** - Styling with glass morphism effects
- **Responsive Design** - Mobile-first approach

## 🎨 Design Features

- **Glass Morphism UI** - Modern, translucent design elements
- **Animated Background** - Dynamic floating dots animation
- **Responsive Layout** - Works on all device sizes
- **Intuitive Navigation** - Clean sidebar and main content layout
- **Professional Styling** - Corporate-friendly color scheme

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Structure

- **Components**: Functional React components with hooks
- **Styling**: Inline styles with CSS-in-JS approach
- **State Management**: React Context API for authentication
- **Routing**: React Router for navigation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern SaaS platforms
- Icons and emojis for enhanced user experience
- Alumni networking best practices
- Modern web development standards

## 📞 Support

For support, email support@alumnet.com or join our community discussions.

---

**Made with ❤️ for connecting alumni and students worldwide**