@echo off
echo ========================================
echo    QUANTUM EXPERIENCE AUTO-PORT SCRIPT
echo ========================================
echo.

echo [1/4] Killing all Node.js and Python processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im pythonw.exe >nul 2>&1
timeout /t 3 >nul

echo [2/4] Compiling TypeScript...
call npx tsc
if errorlevel 1 (
    echo ERROR: TypeScript compilation failed!
    pause
    exit /b 1
)

echo [3/4] Finding available port...
set PORT=3001

:CHECK_PORT
netstat -ano | findstr :%PORT% >nul 2>&1
if not errorlevel 1 (
    set /a PORT+=1
    if %PORT% GTR 3010 (
        echo ERROR: No available ports found between 3001-3010
        pause
        exit /b 1
    )
    goto CHECK_PORT
)

echo [4/4] Starting server on port %PORT%...
echo.
echo ========================================
echo  SERVER STARTING ON http://localhost:%PORT%
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npx http-server -p %PORT% -c-1 --cors

pause
