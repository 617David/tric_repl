Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
strIndexPath = strScriptPath & "\index.html"

' Open the index.html file in the default browser
objShell.Run "cmd /c start """" """ & strIndexPath & """", 0, False

Set objShell = Nothing
Set objFSO = Nothing
