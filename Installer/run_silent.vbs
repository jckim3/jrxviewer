Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "C:\JRxViewer\jrxviewer.exe" & chr(34), 0
Set WshShell = Nothing