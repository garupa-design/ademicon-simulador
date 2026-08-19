@echo off
setlocal
cd /d "%~dp0"

if not exist "index.html" goto :naopasta
if not exist "servidor.js" goto :semservidor

where node >nul 2>nul
if errorlevel 1 goto :semnode

node servidor.js %1
pause
goto :eof

:naopasta
echo ERRO: rode este arquivo de dentro da pasta ademicon-simulador.
pause
goto :eof

:semservidor
echo ERRO: servidor.js nao esta nesta pasta.
pause
goto :eof

:semnode
echo ERRO: o Node.js nao foi encontrado no PATH.
echo Instale em https://nodejs.org e tente de novo.
pause
