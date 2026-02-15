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

:: First, create a zip of the current folder
set ZIP_NAME=Project_SDSG.zip
if exist "%ZIP_NAME%" del "%ZIP_NAME%"
echo Creating ZIP archive...
:: Adjust path if 7z.exe is not in PATH
7z a -tzip "%ZIP_NAME%" ".\*"
if errorlevel 1 (
    echo ZIP creation failed!
    pause
    exit /b 1
)

:: Then, convert the zip to 7z
set SEVENZ_NAME=Project_SDSG.7z
if exist "%SEVENZ_NAME%" del "%SEVENZ_NAME%"
echo Converting ZIP to 7Z...
7z a -t7z "%SEVENZ_NAME%" "%ZIP_NAME%"
if errorlevel 1 (
    echo 7Z conversion failed!
    pause
    exit /b 1
)

echo Build complete!
pause