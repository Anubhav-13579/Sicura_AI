@echo off
title Sicura AI Suite Launcher
echo =========================================================================
echo               Sicura AI - Premium Suite Auto Launcher
echo =========================================================================
echo.
echo Launching local development environment...
echo.

echo [1/2] Starting Python FastAPI Backend on Port 8000...
start cmd /k "title Sicura Backend Server && cd backend && uvicorn main:app --reload --port 8000"

echo.
echo [2/2] Starting Vite Frontend Server on Port 5173...
start cmd /k "title Sicura Frontend Server && npm run dev"

echo.
echo =========================================================================
echo  Success: Both servers have been launched in separate terminal windows!
echo  Please KEEP those two terminal windows open while testing the app.
echo =========================================================================
echo.
pause
