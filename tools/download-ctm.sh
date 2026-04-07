#!/usr/bin/env bash
# Downloads confirmed CTM files for the 26 missing-normal GLBs
# Output: d:/SC Data Extraction/ctm-downloads/
# Usage: bash tools/download-ctm.sh

OUT="d:/SC Data Extraction/ctm-downloads"
mkdir -p "$OUT"

download() {
    local glb="$1"
    local url="$2"
    local dest="$OUT/${glb}.ctm"
    if [ -f "$dest" ]; then
        echo "SKIP (exists): ${glb}.ctm"
        return
    fi
    echo "DOWNLOADING: ${glb}.ctm"
    curl -L --silent --show-error --retry 3 --output "$dest" "$url"
    if [ $? -eq 0 ]; then
        echo "  OK: $(du -h "$dest" | cut -f1)"
    else
        echo "  FAILED: $url"
        rm -f "$dest"
    fi
}

download "aegis-eclipse-rotated3"         "https://robertsspaceindustries.com/media/pj30vwd8f32r5r/source/AEGIS_ECLIPSE_ROTATED3.ctm"
download "aegis-raven-2"                  "https://robertsspaceindustries.com/media/t6ohbfjwlj9mfr/source/AEGIS_RAVEN-2.ctm"
download "aegis-retaliator"               "https://robertsspaceindustries.com/media/h3h448c01rik3r/source/AEGIS-Retaliator.ctm"
download "aegis-vanguard-harbinger"       "https://robertsspaceindustries.com/media/jgq01rt1qdc35r/source/AEGIS-Vanguard.ctm"
download "aegis-vanguard-sentinel"        "https://robertsspaceindustries.com/media/jgq01rt1qdc35r/source/AEGIS-Vanguard.ctm"
download "aegis-vulcan"                   "https://robertsspaceindustries.com/media/6a5ypzjqsi3str/source/AEGIS_VULCAN.ctm"
download "anvil-hurricane-obj2"           "https://robertsspaceindustries.com/media/tsoe8jbqj9n73r/source/ANVIL_HURRICANE_OBJ2.ctm"
download "crusader-genesis-starliner"     "https://robertsspaceindustries.com/media/w558ix98pd084r/source/Crusader-Genesis-Starliner.ctm"
download "crusader-hercules-starlifter-c2" "https://robertsspaceindustries.com/media/bzk12730mpuv8r/source/CRUSADER_HERCULES_STARLIFTER_C2.ctm"
download "crusader-hercules-starlifter-m2" "https://robertsspaceindustries.com/media/hf0yvi22fmlt9r/source/CRUSADER_HERCULES_STARLIFTER_M2.ctm"
download "misc-hulla"                     "https://robertsspaceindustries.com/media/8ay6e9wxefsn0r/source/MISC-HullA.ctm"
download "misc-hullb"                     "https://robertsspaceindustries.com/media/8jqd89mpxcovrr/source/MISC-HullB.ctm"
download "misc-hullc"                     "https://robertsspaceindustries.com/media/3a5p02rnr932vr/source/MISC-HullC.ctm"
download "misc-hulld"                     "https://robertsspaceindustries.com/media/u044v5azkzfwtr/source/MISC-HullD.ctm"
download "misc-hulle"                     "https://robertsspaceindustries.com/media/st2avbfbqgj5br/source/MISC-HullE.ctm"
download "misc-razor-ex"                  "https://robertsspaceindustries.com/media/vu9g4x11mfr9sr/source/MISC_RAZOR_EX.ctm"
download "misc-razor-lx"                  "https://robertsspaceindustries.com/media/s0o6a3dw3x2hzr/source/MISC_RAZOR_LX.ctm"
download "misc-starfarer"                 "https://robertsspaceindustries.com/media/czc4kuisdi8p4r/source/MISC-StarFarer.ctm"
download "origin-600i-explorer"           "https://robertsspaceindustries.com/media/wg6k6v0r1ysqyr/source/ORIGIN_600i_EXPLORER.ctm"
download "rsi-constellation-andromeda-lod2" "https://robertsspaceindustries.com/media/dwwjcjv8h77str/source/RSI-Constellation-Andromeda_LOD2.ctm"
download "rsi-constellation-phoenix-lod2" "https://robertsspaceindustries.com/media/sceeoftxajvufr/source/RSI-Constellation-Phoenix_LOD2.ctm"
download "rsi-constellation-taurus-lod2"  "https://robertsspaceindustries.com/media/gofcvcfhbztatr/source/RSI-Constellation-Taurus_LOD2.ctm"
download "rsi-orion2"                     "https://robertsspaceindustries.com/media/1v8ddmkxqouesr/source/RSI-Orion2.ctm"
download "rsi-polaris"                    "https://robertsspaceindustries.com/media/l8fs5ivw36mdvr/source/RSI-Polaris.ctm"
download "vanduul-blade-rotated4"         "https://robertsspaceindustries.com/media/pujbt9uhoxz4ir/source/VANDUUL_BLADE_ROTATED4.ctm"
download "xian-nox2"                      "https://robertsspaceindustries.com/media/nwmuqf5rvz9elr/source/Xian_nox2.ctm"

echo ""
echo "Done. Files saved to: $OUT"
echo "Downloaded: $(ls "$OUT"/*.ctm 2>/dev/null | wc -l) / 26"
