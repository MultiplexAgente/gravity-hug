$csc = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe'
$src = 'D:\Desenvolvimento\Projetos\multiplex-ia\HUGLauncher.cs'
$out = 'D:\Desenvolvimento\Projetos\multiplex-ia\HUG.exe'
$ico = 'D:\Desenvolvimento\Projetos\multiplex-ia\public\favicon.ico'

& $csc /target:winexe "/win32icon:$ico" "/out:$out" "$src"

if (Test-Path $out) {
    Write-Host "HUG.exe compilado com sucesso!"
    $desktop1 = 'C:\Users\antho\OneDrive\Área de Trabalho'
    $desktop2 = 'C:\Users\antho\Desktop'
    
    if (Test-Path $desktop1) {
        Copy-Item -Path $out -Destination (Join-Path $desktop1 'HUG.exe') -Force
        
        $wsh = New-Object -ComObject WScript.Shell
        $shortcut = $wsh.CreateShortcut((Join-Path $desktop1 'HUG.lnk'))
        $shortcut.TargetPath = (Join-Path $desktop1 'HUG.exe')
        $shortcut.WorkingDirectory = 'D:\Desenvolvimento\Projetos\multiplex-ia'
        $shortcut.IconLocation = "$ico,0"
        $shortcut.Description = 'HUG Desktop - Plataforma Inteligente'
        $shortcut.Save()
        Write-Host "HUG.exe e atalho HUG criados na Area de Trabalho OneDrive"
    }
    
    if (Test-Path $desktop2) {
        Copy-Item -Path $out -Destination (Join-Path $desktop2 'HUG.exe') -Force
        $wsh = New-Object -ComObject WScript.Shell
        $shortcut = $wsh.CreateShortcut((Join-Path $desktop2 'HUG.lnk'))
        $shortcut.TargetPath = (Join-Path $desktop2 'HUG.exe')
        $shortcut.WorkingDirectory = 'D:\Desenvolvimento\Projetos\multiplex-ia'
        $shortcut.IconLocation = "$ico,0"
        $shortcut.Description = 'HUG Desktop - Plataforma Inteligente'
        $shortcut.Save()
        Write-Host "HUG.exe e atalho HUG criados na Area de Trabalho padrao"
    }
} else {
    Write-Error "Falha ao compilar HUG.exe"
}
