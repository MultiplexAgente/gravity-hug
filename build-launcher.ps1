$csc = 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe'
$src = 'D:\Desenvolvimento\Projetos\multiplex-ia\HUGLauncher.cs'
$out = 'D:\Desenvolvimento\Projetos\multiplex-ia\HUG.exe'
$ico = 'D:\Desenvolvimento\Projetos\multiplex-ia\public\favicon.ico'

& $csc /target:winexe "/win32icon:$ico" "/out:$out" "$src"

if (Test-Path $out) {
    Write-Host "HUG.exe compilado com sucesso!"
    $desktopPath = [System.Environment]::GetFolderPath('Desktop')
    
    if (Test-Path $desktopPath) {
        $destExe = Join-Path $desktopPath 'HUG.exe'
        Copy-Item -Path $out -Destination $destExe -Force
        
        $wsh = New-Object -ComObject WScript.Shell
        $shortcut = $wsh.CreateShortcut((Join-Path $desktopPath 'HUG.lnk'))
        $shortcut.TargetPath = $destExe
        $shortcut.WorkingDirectory = 'D:\Desenvolvimento\Projetos\multiplex-ia'
        $shortcut.IconLocation = "$ico,0"
        $shortcut.Description = 'HUG Desktop - Plataforma Inteligente'
        $shortcut.Save()
        Write-Host "HUG.exe e atalho HUG atualizados em: $desktopPath"
    }
} else {
    Write-Error "Falha ao compilar HUG.exe"
}
