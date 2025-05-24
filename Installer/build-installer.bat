@echo off
echo Building executable with pkg...

:: 빌드 대상: 64비트 Windows용
:: pkg .. --targets node18-win-x64 --output ../dist-exe/jrxviewer.exe

echo Creating installer with NSIS...
call "C:\Program Files (x86)\NSIS\makensis.exe" -V4 "%~dp0installer.nsi"
pause
