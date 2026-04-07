# download-ctm.ps1 — UEE Recognition Training v15.0
# Downloads confirmed CTM files for the 26 missing-normal GLBs
# Output: D:\SC Data Extraction\ctm-downloads\
# Usage: powershell -ExecutionPolicy Bypass -File tools\download-ctm.ps1

$out = "D:\SC Data Extraction\ctm-downloads"
New-Item -ItemType Directory -Force -Path $out | Out-Null

$downloads = @(
    @{ glb = "aegis-eclipse-rotated3";          url = "https://robertsspaceindustries.com/media/pj30vwd8f32r5r/source/AEGIS_ECLIPSE_ROTATED3.ctm" },
    @{ glb = "aegis-raven-2";                   url = "https://robertsspaceindustries.com/media/t6ohbfjwlj9mfr/source/AEGIS_RAVEN-2.ctm" },
    @{ glb = "aegis-retaliator";                url = "https://robertsspaceindustries.com/media/h3h448c01rik3r/source/AEGIS-Retaliator.ctm" },
    @{ glb = "aegis-vanguard-harbinger";        url = "https://robertsspaceindustries.com/media/jgq01rt1qdc35r/source/AEGIS-Vanguard.ctm" },
    @{ glb = "aegis-vanguard-sentinel";         url = "https://robertsspaceindustries.com/media/jgq01rt1qdc35r/source/AEGIS-Vanguard.ctm" },
    @{ glb = "aegis-vulcan";                    url = "https://robertsspaceindustries.com/media/6a5ypzjqsi3str/source/AEGIS_VULCAN.ctm" },
    @{ glb = "anvil-hurricane-obj2";            url = "https://robertsspaceindustries.com/media/tsoe8jbqj9n73r/source/ANVIL_HURRICANE_OBJ2.ctm" },
    @{ glb = "crusader-genesis-starliner";      url = "https://robertsspaceindustries.com/media/w558ix98pd084r/source/Crusader-Genesis-Starliner.ctm" },
    @{ glb = "crusader-hercules-starlifter-c2"; url = "https://robertsspaceindustries.com/media/bzk12730mpuv8r/source/CRUSADER_HERCULES_STARLIFTER_C2.ctm" },
    @{ glb = "crusader-hercules-starlifter-m2"; url = "https://robertsspaceindustries.com/media/hf0yvi22fmlt9r/source/CRUSADER_HERCULES_STARLIFTER_M2.ctm" },
    @{ glb = "misc-hulla";                      url = "https://robertsspaceindustries.com/media/8ay6e9wxefsn0r/source/MISC-HullA.ctm" },
    @{ glb = "misc-hullb";                      url = "https://robertsspaceindustries.com/media/8jqd89mpxcovrr/source/MISC-HullB.ctm" },
    @{ glb = "misc-hullc";                      url = "https://robertsspaceindustries.com/media/3a5p02rnr932vr/source/MISC-HullC.ctm" },
    @{ glb = "misc-hulld";                      url = "https://robertsspaceindustries.com/media/u044v5azkzfwtr/source/MISC-HullD.ctm" },
    @{ glb = "misc-hulle";                      url = "https://robertsspaceindustries.com/media/st2avbfbqgj5br/source/MISC-HullE.ctm" },
    @{ glb = "misc-razor-ex";                   url = "https://robertsspaceindustries.com/media/vu9g4x11mfr9sr/source/MISC_RAZOR_EX.ctm" },
    @{ glb = "misc-razor-lx";                   url = "https://robertsspaceindustries.com/media/s0o6a3dw3x2hzr/source/MISC_RAZOR_LX.ctm" },
    @{ glb = "misc-starfarer";                  url = "https://robertsspaceindustries.com/media/czc4kuisdi8p4r/source/MISC-StarFarer.ctm" },
    @{ glb = "origin-600i-explorer";            url = "https://robertsspaceindustries.com/media/wg6k6v0r1ysqyr/source/ORIGIN_600i_EXPLORER.ctm" },
    @{ glb = "rsi-constellation-andromeda-lod2"; url = "https://robertsspaceindustries.com/media/dwwjcjv8h77str/source/RSI-Constellation-Andromeda_LOD2.ctm" },
    @{ glb = "rsi-constellation-phoenix-lod2";  url = "https://robertsspaceindustries.com/media/sceeoftxajvufr/source/RSI-Constellation-Phoenix_LOD2.ctm" },
    @{ glb = "rsi-constellation-taurus-lod2";   url = "https://robertsspaceindustries.com/media/gofcvcfhbztatr/source/RSI-Constellation-Taurus_LOD2.ctm" },
    @{ glb = "rsi-orion2";                      url = "https://robertsspaceindustries.com/media/1v8ddmkxqouesr/source/RSI-Orion2.ctm" },
    @{ glb = "rsi-polaris";                     url = "https://robertsspaceindustries.com/media/l8fs5ivw36mdvr/source/RSI-Polaris.ctm" },
    @{ glb = "vanduul-blade-rotated4";          url = "https://robertsspaceindustries.com/media/pujbt9uhoxz4ir/source/VANDUUL_BLADE_ROTATED4.ctm" },
    @{ glb = "xian-nox2";                       url = "https://robertsspaceindustries.com/media/nwmuqf5rvz9elr/source/Xian_nox2.ctm" }
)

$ok = 0; $skip = 0; $fail = 0

foreach ($d in $downloads) {
    $dest = Join-Path $out "$($d.glb).ctm"
    if (Test-Path $dest) {
        Write-Host "SKIP (exists): $($d.glb).ctm" -ForegroundColor DarkGray
        $skip++
        continue
    }
    Write-Host "DOWNLOADING:  $($d.glb).ctm" -NoNewline
    try {
        Invoke-WebRequest -Uri $d.url -OutFile $dest -UseBasicParsing -ErrorAction Stop
        $size = [math]::Round((Get-Item $dest).Length / 1KB)
        Write-Host "  OK (${size}KB)" -ForegroundColor Green
        $ok++
    } catch {
        Write-Host "  FAILED: $_" -ForegroundColor Red
        Remove-Item $dest -ErrorAction SilentlyContinue
        $fail++
    }
}

Write-Host ""
Write-Host "Done.  OK: $ok  Skipped: $skip  Failed: $fail" -ForegroundColor Cyan
Write-Host "Files saved to: $out"
