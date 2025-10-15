# ALUMNET Platform - Troubleshooting Guide

## Issues Fixed ✅

### 1. Port Configuration Mismatch
- **Problem**: Backend .env had PORT=8080 but startup script expected 3001
- **Fix**: Updated backend/.env to use PORT=3001
- **Fix**: Updated frontend .env files to point to http://localhost:3001/api

### 2. Frontend Entry Point Error
- **Problem**: main.jsx was importing App-simple.jsx instead of App.jsx
- **Fix**: Updated import to use the full-featured App.jsx

### 3. Import Inconsistency
- **Problem**: Student dashboard imported useAuth from hooks instead of contexts
- **Fix**: Updated import to use AuthContext

## Common Issues & Solutions

### Backend Won't Start
1. **Check Node.js version**: Requires Node.js >= 18.0.0
2. **Install dependencies**: Run `npm install` in backend folder
3. **Check port availability**: Make sure port 3001 is not in use
4. **Environment variables**: Ensure backend/.env exists with correct values

### Frontend Won't Start
1. **Install dependencies**: Run `npm install` in frontend folder
2. **Check port availability**: Make sure port 5173 is not in use
3. **Clear cache**: Delete node_modules and package-lock.json, then reinstall

### API Connection Issues
1. **Backend not running**: Start backend first using start-backend.bat
2. **CORS errors**: Backend is configured for localhost:5173
3. **Wrong API URL**: Frontend should point to http://localhost:3001/api

### Login/Register Not Working
1. **Backend connection**: Check if backend is running on port 3001
2. **Demo accounts**: Use student@alumnet.com/student123 or alumni@alumnet.com/alumni123
3. **Network errors**: Check browser console for API errors

## Quick Health Check

Run this command to check if both servers are working:
```bash
node health-check.js
```

## Startup Commands

### Full Platform (Recommended)
```bash
start-alumnet.bat
```

### Individual Services
```bash
# Backend only
start-backend.bat

# Frontend only
start-frontend.bat
```

## Port Configuration

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Demo Accounts

- **Student**: student@alumnet.com / student123
- **Alumni**: alumni@alumnet.com / alumni123

## Development Notes

- Uses mock database (no MongoDB required)
- All features work offline
- Hot reload enabled for development
- CORS configured for localhost development

## Security Notes

- Development dependencies have some vulnerabilities (esbuild/vite)
- These don't affect production builds
- Run `npm audit fix --force` only if needed (may cause breaking changes)