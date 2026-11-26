@echo off
title HUG Desktop IDE - Launcher
chcp 65001 >nul
echo ========================================================
echo   INICIANDO HUG DESKTOP IDE (MOTOR WINDOWS)
echo   Sistema de Arquivos D: + Automacao de Navegador Chrome
echo ========================================================
echo.

cd /d "D:\Desenvolvimento\Projetos\multiplex-ia"

REM Verifica se o servidor local na porta 3000 esta ativo
netstat -ano | findstr ":3000 " >nul
if %errorlevel% neq 0 (
    echo [1/2] Iniciando servidor local HUG na porta 3000...
    start /b npx vite dev --port 3000
    timeout /t 3 /nobreak >nul
) else (
    echo [1/2] Servidor local HUG ja esta ativo na porta 3000.
)

echo [2/2] Abrindo janela nativa HUG Desktop...
npx electron electron/main.cjs

echo.
echo Janela finalizada.
