@echo off
echo ========================================
echo    🎓 ALUMNET Backend (Demo Server)
echo ========================================
echo.

echo 📦 Installing dependencies...
cd backend
call npm install

echo.
echo 🚀 Starting backend server...
node src/index.js

pause