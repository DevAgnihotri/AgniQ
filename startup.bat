@echo off
echo ========================================
echo    QUANTUM EXPERIENCE STARTUP SCRIPT
echo ========================================
echo.

echo [1/5] Killing all Node.js processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 2 >nul

echo [2/5] Killing all Python processes...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im pythonw.exe >nul 2>&1
timeout /t 2 >nul

echo [3/5] Freeing up common ports (3000-3005, 8000-8005)...
for /l %%i in (3000,1,3005) do (
    netstat -ano | findstr :%%i >nul 2>&1
    if not errorlevel 1 (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%i') do (
            taskkill /f /pid %%a >nul 2>&1
        )
    )
)

for /l %%i in (8000,1,8005) do (
    netstat -ano | findstr :%%i >nul 2>&1
    if not errorlevel 1 (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%i') do (
            taskkill /f /pid %%a >nul 2>&1
        )
    )
)

echo [4/5] Compiling TypeScript...
call npx tsc
if errorlevel 1 (
    echo ERROR: TypeScript compilation failed!
    pause
    exit /b 1
)

echo [5/5] Starting server on port 3001...
echo.
echo ========================================
echo  SERVER STARTING ON http://localhost:3001
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npx http-server -p 3001 -c-1 --cors

pause
