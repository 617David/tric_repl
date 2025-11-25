@echo off
REM Trip Expense Splitter Launcher for Windows
REM This opens the app in your default web browser

echo Starting Trip Expense Splitter...
start "" "%~dp0index.html"
echo.
echo Trip Expense Splitter has been opened in your default browser.
echo You can close this window.
timeout /t 2 /nobreak >nul
exit
