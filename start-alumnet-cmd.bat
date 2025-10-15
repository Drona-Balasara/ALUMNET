@echo off
echo ========================================
echo    🎓 ALUMNET Platform Startup Script
echo ========================================
echo.

echo 📦 Installing dependencies...
echo.

echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed!
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed!
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🚀 Starting ALUMNET Platform...
echo.

echo Starting backend server on port 3001...
start "ALUMNET Backend" cmd /k "cd backend && node src/index-demo.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend server on port 5173...
start "ALUMNET Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    🎉 ALUMNET Platform is starting!
echo ========================================
echo.
echo 🌐 Frontend URL: http://localhost:5173
echo 🔧 Backend API:  http://localhost:3001
echo.
echo 📋 Demo Accounts (ready to use):
echo    Student: student@alumnet.com / student123
echo    Alumni:  alumni@alumnet.com / alumni123
echo.
echo 💡 Tips:
echo    - Use demo accounts or create new ones
echo    - All features work without MongoDB
echo    - Close terminal windows to stop servers
echo.
echo 🔗 Click here to open: http://localhost:5173
echo.
pause