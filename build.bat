@echo off
color a

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

:: Create a zip of the current folder
set ZIP_NAME=Project_SDSG.zip
if exist "%ZIP_NAME%" del "%ZIP_NAME%"
powershell -command "Add-Type -AssemblyName 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::CreateFromDirectory('.', '%ZIP_NAME%')"

:: Split the zip into 50 MB chunks
set PART_SIZE=52428800
set /a INDEX=1

echo Splitting zip into 50 MB parts...

:split_loop
if not exist "%ZIP_NAME%" (
    echo Zip file not found!
    pause
    exit /b 1
)

fsutil file createnew temp.bin %PART_SIZE% 2>nul
for /f "skip=0 delims=" %%A in ('certutil -encodehex "%ZIP_NAME%" temp.txt 0x40000000 ^| find /v ":"') do (
    rem nothing here, certutil will generate temp.txt
)

:: simpler approach: use powershell for proper splitting
powershell -command ^
"$infile='%ZIP_NAME%'; $size=%PART_SIZE%; $i=0; [IO.File]::OpenRead($infile) | % { $buf = New-Object byte[] $size; while ($r = $_.Read($buf,0,$size)) { Set-Content -Encoding Byte ('%ZIP_NAME%.part'+$i) $buf[0..($r-1)]; $i++ } }"

echo Split complete!
pause