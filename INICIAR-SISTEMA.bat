@echo off
start "" /B node "%~dp0server.js"
timeout /t 1 /nobreak > nul
start "" "http://127.0.0.1:3030"
