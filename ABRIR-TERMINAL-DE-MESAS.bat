@echo off
chcp 65001 > nul
set "RESTOCK_CORES=1"
set "NO_COLOR="
set "TERM=xterm"
node "%~dp0terminal\mesas.js"
pause
