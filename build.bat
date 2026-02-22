@echo off
color a
echo [--------------------------]
echo [ BUILDING PROJECT SDSG----]
echo [-----BY: MAHDIISDUMB------]
echo [--------------------------]
echo Running Compiler...
node REL
if errorlevel 1 (
    echo Node build failed!
    pause
    exit /b 1
)
echo Splitting Compiled version into an archive folder
node SETUP
echo Split complete!
pause