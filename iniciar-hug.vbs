Set WshShell = CreateObject("WScript.Shell")
Set WshEnv = WshShell.Environment("PROCESS")

' Remove a variavel herdada pelo terminal para garantir que o Electron abra como aplicativo grafico e nao como script
On Error Resume Next
WshEnv.Remove("ELECTRON_RUN_AS_NODE")
On Error GoTo 0

WshShell.CurrentDirectory = "D:\Desenvolvimento\Projetos\multiplex-ia"

' Inicia o Electron de forma 100% silenciosa sem abrir janela preta do prompt CMD
WshShell.Run """D:\Desenvolvimento\Projetos\multiplex-ia\node_modules\electron\dist\electron.exe"" ""D:\Desenvolvimento\Projetos\multiplex-ia\electron\main.cjs""", 0, False
