@echo off
echo ========================================================
echo        Starting Waste2Worth Platform
echo ========================================================
echo.
echo Starting Backend Server on http://localhost:5000 ...
start "Waste2Worth Backend" cmd /k "cd server && node index.js"

echo Starting Frontend UI on http://localhost:5173 ...
start "Waste2Worth Frontend" cmd /k "cd client && npm run dev"

echo.
echo Both services are booting up!
echo Visit: http://localhost:5173
echo ========================================================
pause
