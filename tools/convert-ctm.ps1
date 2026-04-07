# Converts downloaded CTM files to GLB and replaces models in the project
# CTM -> OBJ (ctmconv) -> GLB (obj2gltf)
# Usage: powershell -ExecutionPolicy Bypass -File tools\convert-ctm.ps1

$ctmconv  = "C:\Program Files (x86)\OpenCTM 1.0.3\bin\ctmconv.exe"
$ctmDir   = "D:\SC Data Extraction\ctm-downloads"
$tmpDir   = "D:\SC Data Extraction\ctm-tmp-obj"
$modelsDir = "C:\Users\jonic\Documents\Projects\uee-holoviewer\models"

New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$ok = 0; $fail = 0

Get-ChildItem "$ctmDir\*.ctm" | ForEach-Object {
    $name = $_.BaseName
    $ctmFile = $_.FullName
    $objFile = Join-Path $tmpDir "$name.obj"
    $glbFile = Join-Path $modelsDir "$name.glb"

    Write-Host "[$name]" -ForegroundColor Cyan

    # Step 1: CTM -> OBJ with normals
    Write-Host "  CTM -> OBJ..." -NoNewline
    & $ctmconv $ctmFile $objFile --calc-normals 2>&1 | Out-Null
    if (-not (Test-Path $objFile)) {
        Write-Host " FAILED" -ForegroundColor Red
        $fail++
        return
    }
    Write-Host " OK" -ForegroundColor Green

    # Step 2: OBJ -> GLB
    Write-Host "  OBJ -> GLB..." -NoNewline
    $result = & npx obj2gltf -i $objFile -o $glbFile 2>&1
    if (Test-Path $glbFile) {
        $size = [math]::Round((Get-Item $glbFile).Length / 1KB)
        Write-Host " OK (${size}KB)" -ForegroundColor Green
        $ok++
    } else {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  $result" -ForegroundColor DarkRed
        $fail++
    }
}

# Cleanup temp OBJs
Remove-Item "$tmpDir\*.obj" -ErrorAction SilentlyContinue
Remove-Item "$tmpDir\*.mtl" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Done.  Converted: $ok  Failed: $fail" -ForegroundColor Cyan
Write-Host "GLBs written to: $modelsDir"
