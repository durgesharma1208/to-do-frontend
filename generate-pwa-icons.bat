@echo off
REM PWA Icon Generator Script for Windows
REM Converts SVG logo to PNG icons required for PWA installation

setlocal enabledelayedexpansion

echo.
echo ===================================
echo PWA Icon Generator (Windows)
echo ===================================
echo.

REM Check if ImageMagick is installed
where magick >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ImageMagick not found!
    echo.
    echo Install ImageMagick:
    echo   Download from: https://imagemagick.org/script/download.php#windows
    echo   Or use: winget install ImageMagick.ImageMagick
    echo   Or use: choco install imagemagick
    echo.
    pause
    exit /b 1
)

echo [OK] ImageMagick found

REM Change to frontend directory
cd /d "%~dp0frontend" || exit /b 1
echo [OK] Changed to frontend directory

REM Check if logo.svg exists
if not exist "public\logo.svg" (
    echo [ERROR] public\logo.svg not found!
    pause
    exit /b 1
)

echo [OK] Found public\logo.svg
echo.

REM Generate 192x192 icon
echo Generating 192x192 icon...
magick convert -background white -size 192x192 public\logo.svg public\pwa-192x192.png
if %ERRORLEVEL% EQU 0 (
    echo [OK] Created public\pwa-192x192.png
) else (
    echo [ERROR] Failed to create 192x192 icon
    pause
    exit /b 1
)

REM Generate 512x512 icon
echo Generating 512x512 icon...
magick convert -background white -size 512x512 public\logo.svg public\pwa-512x512.png
if %ERRORLEVEL% EQU 0 (
    echo [OK] Created public\pwa-512x512.png
) else (
    echo [ERROR] Failed to create 512x512 icon
    pause
    exit /b 1
)

REM Verify icons were created
echo.
echo Verifying icons...
echo.

if exist "public\pwa-192x192.png" (
    for %%A in ("public\pwa-192x192.png") do set size=%%~zA
    echo [OK] pwa-192x192.png created
) else (
    echo [ERROR] pwa-192x192.png not created
    pause
    exit /b 1
)

if exist "public\pwa-512x512.png" (
    for %%A in ("public\pwa-512x512.png") do set size=%%~zA
    echo [OK] pwa-512x512.png created
) else (
    echo [ERROR] pwa-512x512.png not created
    pause
    exit /b 1
)

echo.
echo ===================================
echo [OK] PWA Icons Generated Successfully!
echo ===================================
echo.
echo Next steps:
echo   1. npm run build
echo   2. npm run preview
echo   3. Visit http://localhost:4173 on Android Chrome
echo   4. Install the app!
echo.
pause
