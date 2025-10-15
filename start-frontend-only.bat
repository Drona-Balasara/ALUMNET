@echo off
echo ========================================
echo    🎓 ALUMNET Frontend Demo
echo ========================================
echo.

echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Installation failed!
    pause
    exit /b 1
)

echo.
echo 🚀 Starting ALUMNET Frontend...
echo.

start "ALUMNET Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    🎉 ALUMNET Frontend is ready!
echo ========================================
echo.
echo 🌐 Open this link: http://localhost:5173
echo.
echo 📋 What you can see:
echo    ✅ Beautiful landing page
echo    ✅ Login/Register pages (UI only)
echo    ✅ All components and design
echo    ✅ Fully responsive
echo.
echo 💡 Note: Login will show "backend required" message
echo    This is normal for frontend-only demo
echo.
echo 🔗 Click here: http://localhost:5173
echo.
start http://localhost:5173
echo.
pause