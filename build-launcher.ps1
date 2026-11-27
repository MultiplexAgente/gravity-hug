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
        
        # Remove atalho duplicado antigo caso exista
        $oldLnk = Join-Path $desktopPath 'HUG.lnk'
        if (Test-Path $oldLnk) {
            Remove-Item -Path $oldLnk -Force -ErrorAction SilentlyContinue
        }
        
        Write-Host "HUG.exe unico atualizado na Area de Trabalho: $destExe"
    }
} else {
    Write-Error "Falha ao compilar HUG.exe"
}
