@echo off
:: Set console color to light green
color a

:: Print the title
echo [--------------------------]
echo [ BUILDING PROJECT SDSG----]
echo [-----BY: MAHDIISDUMB------]
echo [--------------------------]
echo.

:: Run the Node build
echo Running Node build...
node REL
if errorlevel 1 (
    echo Node build failed!
    pause
    exit /b 1
)

:: Compress output with 7-Zip
set OUTPUT_DIR=dist
set ZIP_NAME=Project_SDSG.7z

if not exist "%OUTPUT_DIR%" (
    echo Output directory "%OUTPUT_DIR%" not found!
    pause
    exit /b 1
)

echo Compressing build into %ZIP_NAME%...
:: Adjust path if 7z.exe is not in PATH
7z a -t7z "%ZIP_NAME%" "%OUTPUT_DIR%\*"
if errorlevel 1 (
    echo Compression failed!
    pause
    exit /b 1
)

echo Build complete!
pause