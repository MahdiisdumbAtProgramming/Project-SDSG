@echo off
color a
echo [--------------------------]
echo [ BUILDING PROJECT SDSG----]
echo [-----BY: MAHDIISDUMB------]
echo [--------------------------]
echo Running Node build...
node REL
if errorlevel 1 (
    echo Node build failed!
    pause
    exit /b 1
)
set ZIP_NAME=Project_SDSG.zip
if not exist "%ZIP_NAME%" (
    echo Zip file not found! REL should have made it.
    pause
    exit /b 1
)
set PART_SIZE=103809024
set /a INDEX=0
echo Splitting "%ZIP_NAME%" into 99 MB parts...
powershell -command ^
"$infile='%ZIP_NAME%'; $size=%PART_SIZE%; $i=0; $fs = [IO.File]::OpenRead($infile); try { while ($fs.Position -lt $fs.Length) { $buf = New-Object byte[] ([Math]::Min($size, $fs.Length - $fs.Position)); $fs.Read($buf, 0, $buf.Length) | Out-Null; $partName = ('%ZIP_NAME%.part{0:000}' -f $i); [IO.File]::WriteAllBytes($partName, $buf); $i++ } } finally { $fs.Close() }"
echo Split complete!
pause