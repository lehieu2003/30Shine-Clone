@echo off
title MySQL Status Checker for Hair Cut App

echo ===============================================
echo    MYSQL STATUS CHECKER - HAIR CUT APP
echo ===============================================
echo.

:: Check MySQL80 service status
echo Checking MySQL service status...
sc query MySQL80 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MySQL80 service found
    for /f "tokens=4" %%i in ('sc query MySQL80 ^| find "STATE"') do set STATE=%%i
    echo Service State: !STATE!
    
    if "!STATE!"=="RUNNING" (
        echo ✅ MySQL is running!
        echo.
        echo Testing connection on port 3306...
        netstat -an | find ":3306" >nul
        if !errorlevel! equ 0 (
            echo ✅ Port 3306 is listening
            echo.
            echo 🎉 MySQL is ready for fake data!
            echo Next steps:
            echo 1. Create database: mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS haircut;"
            echo 2. Run fake data: npm run seed
        ) else (
            echo ❌ Port 3306 is not listening
        )
    ) else (
        echo ❌ MySQL service is not running
        echo.
        echo To start MySQL, run as Administrator:
        echo net start MySQL80
        echo.
        echo Or use Services.msc to start the service manually
    )
) else (
    echo ❌ MySQL80 service not found
    echo Please install MySQL Server first
)

echo.
echo ===============================================
pause
