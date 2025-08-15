@echo off
echo ========================================
echo    QUANTUM EXPERIENCE CLEANUP SCRIPT
echo ========================================
echo.

echo Killing all Node.js processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1

echo Killing all Python processes...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im pythonw.exe >nul 2>&1

echo Freeing up ports 3000-3010 and 8000-8010...
for /l %%i in (3000,1,3010) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%i 2^>nul') do (
        taskkill /f /pid %%a >nul 2>&1
    )
)

for /l %%i in (8000,1,8010) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%i 2^>nul') do (
        taskkill /f /pid %%a >nul 2>&1
    )
)

echo.
echo ========================================
echo    ALL PROCESSES AND PORTS CLEANED
echo ========================================
echo.

pause
