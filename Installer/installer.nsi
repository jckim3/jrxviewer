!define APPNAME "JRXViewer"
!define COMPANY "JRX Diagnostics"
!define DESCRIPTION "OHIF 기반 JRX DICOM Viewer"
!define VERSION "1.0.0"
!define EXENAME "jrxviewer.exe"

;OutFile "${APPNAME}-Setup.exe"
OutFile "..\dist-exe\${APPNAME}-Setup.exe"
InstallDir "$PROGRAMFILES64\${APPNAME}"
RequestExecutionLevel admin

Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles

Section "Install"
  SetOutPath "$INSTDIR"

  ; 🔧 상대 경로 수정 (Installer 폴더 기준 상위 경로)
  File "..\dist-exe\jrxviewer.exe"
  File /r "..\platform"
  File /r "..\proxy-server"

  ; 바탕화면에 바로가기
  CreateShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\${EXENAME}"

  ; Uninstall 등록
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\${EXENAME}"
  Delete "$DESKTOP\${APPNAME}.lnk"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR\platform"
  RMDir /r "$INSTDIR\proxy-server"
  RMDir "$INSTDIR"

  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
SectionEnd
