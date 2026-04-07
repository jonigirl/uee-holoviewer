const missing = [
'300i1','350r2','400i-holo','a2','aegis-eclipse-rotated3','aegis-nautilus','aegis-raven-2','aegis-retaliator','aegis-vanguard-harbinger','aegis-vanguard-sentinel','aegis-vulcan','aegs-redeemer','anvil-hawk','anvil-hurricane-obj2','anvil-legionnaire','anvil-lib','anvil-pisces-c8','anvil-pisces-c8x','anvil-spartan','anvl-carrack-holo-viewer-opt','anvl-centurion-holo','anvl-paladin','aopoa-santokyai-final','ares-inferno','ares-ion','argo-raft','banu-defender','crus-spirit-a1-bomber','crus-spirit-c1-cargo','crus-spirit-e1-vip','crusader-genesis-starliner','crusader-hercules-starlifter-c2','crusader-hercules-starlifter-m2','cyclone-mt-holoviewer','drak-cutlass-red-v2-opt','drak-mule-holo','drake-cutter','drakecorsair3','freelancer-dur','freelancer-max','freelancer-mis','gatac-railen','grin-stv','hoverquad','misc-expanse','misc-hulla','misc-hullb','misc-hullc','misc-hulld','misc-hulle','misc-odyssey','misc-razor-ex','misc-razor-lx','misc-starfarer','mole-holoviewer-v2','mrai-fury-lx','mrai-fury-mx','mrai-fury','nomad-holoviewer-opt','origin-600i-explorer','origin-890-jump','roc-ds-holo','rsi-constellation-andromeda-lod2','rsi-constellation-phoenix-lod2','rsi-constellation-taurus-lod2','rsi-galaxy','rsi-lynx','rsi-mantis','rsi-orion2','rsi-polaris','rsi-scorpius','storm-holo','tumbril-ranger-cvcargo2','tumbril-ranger-rcsport1','tumbril-ranger-trmilitary','vanduul-blade-rotated4','xian-nox2'
];

const ctmUrls = [
'https://robertsspaceindustries.com/media/ct7eey0jlo7yzr/source/AEGIS-Avenger.ctm',
'https://robertsspaceindustries.com/media/pr95737pl0obdr/source/AEGIS_AVENGER_TITAN.ctm',
'https://robertsspaceindustries.com/media/a03drsgan2lp7r/source/AEGIS_AVENGER_WARLOCK.ctm',
'https://robertsspaceindustries.com/media/pj30vwd8f32r5r/source/AEGIS_ECLIPSE_ROTATED3.ctm',
'https://robertsspaceindustries.com/media/oibvdxxco2narr/source/AEGIS-Gladius2.ctm',
'https://robertsspaceindustries.com/media/3hlkgpwpgsnzcr/source/AEGIS_GLADIUS_VALIANT.ctm',
'https://robertsspaceindustries.com/media/6tk7y9bo869byr/source/AEGIS_HAMMERHEAD_v3.ctm',
'https://robertsspaceindustries.com/media/kvt3bfwjb1cxwr/source/AEGIS_JAVELIN.ctm',
'https://robertsspaceindustries.com/media/dsofjsnag9vvkr/source/AEGIS-Reclaimer.ctm',
'https://robertsspaceindustries.com/media/h3h448c01rik3r/source/AEGIS-Retaliator.ctm',
'https://robertsspaceindustries.com/media/u504isq8qo05fr/source/Citcon_concept.ctm',
'https://robertsspaceindustries.com/media/00pzvgs3qq7pnr/source/9-AEGIS-Sabre-Comet.ctm',
'https://robertsspaceindustries.com/media/t6ohbfjwlj9mfr/source/AEGIS_RAVEN-2.ctm',
'https://robertsspaceindustries.com/media/8l566ksz0lnh5r/source/AEGIS_VANGUARD_HOPLITE.ctm',
'https://robertsspaceindustries.com/media/jgq01rt1qdc35r/source/AEGIS-Vanguard.ctm',
'https://robertsspaceindustries.com/media/6a5ypzjqsi3str/source/AEGIS_VULCAN.ctm',
'https://robertsspaceindustries.com/media/tz3cozg51fyi7r/source/ANVIL_ARROW2.ctm',
'https://robertsspaceindustries.com/media/4blyneqonxfqbr/source/ANVIL-Crucible.ctm',
'https://robertsspaceindustries.com/media/z8jid7tacmes7r/source/ANVIL-Hornet-F7C3.ctm',
'https://robertsspaceindustries.com/media/gmpmvy9gd8bwur/source/ANVIL_F7C_HORNET_WILDFIRE.ctm',
'https://robertsspaceindustries.com/media/316nwcsk1agm2r/source/ANVIL-Hornet-F7CM.ctm',
'https://robertsspaceindustries.com/media/sokp1oqaotbudr/source/ANVIL-Hornet-F7CR2.ctm',
'https://robertsspaceindustries.com/media/ek9qoudwbhha1r/source/ANVIL-Hornet-F7CS2.ctm',
'https://robertsspaceindustries.com/media/0z6gvbcvhpvqmr/source/ANVIL-Gladiator_LOD1.ctm',
'https://robertsspaceindustries.com/media/tsoe8jbqj9n73r/source/ANVIL_HURRICANE_OBJ2.ctm',
'https://robertsspaceindustries.com/media/uoywzrnpv3ccyr/source/Terrapin_31_v2.ctm',
'https://robertsspaceindustries.com/media/7n06n2u3pz8b4r/source/ANVIL_VALKYRIE2.ctm',
'https://robertsspaceindustries.com/media/h23gran7882ykr/source/XIAN-Karthu-Al2.ctm',
'https://robertsspaceindustries.com/media/nwmuqf5rvz9elr/source/Xian_nox2.ctm',
'https://robertsspaceindustries.com/media/d0upmaztijqc1r/source/ARGO-Cargo.ctm',
'https://robertsspaceindustries.com/media/koz4glzea88jer/source/ARGO-Personnel.ctm',
'https://robertsspaceindustries.com/media/tqfeltxgynglwr/source/MUSTANG_ALPHA.ctm',
'https://robertsspaceindustries.com/media/ms92kv2ag2m0jr/source/MUSTANG_BETA.ctm',
'https://robertsspaceindustries.com/media/cncdl20mq6u32r/source/MUSTANG_DELTA.ctm',
'https://robertsspaceindustries.com/media/ghitj6nm4glctr/source/MUSTANG_GAMMA2.ctm',
'https://robertsspaceindustries.com/media/301gcpt6z4zz3r/source/MUSTANG_OMEGA2.ctm',
'https://robertsspaceindustries.com/media/4qayc3taiskh3r/source/CNOU_PIONEER.ctm',
'https://robertsspaceindustries.com/media/bzk12730mpuv8r/source/CRUSADER_HERCULES_STARLIFTER_C2.ctm',
'https://robertsspaceindustries.com/media/w558ix98pd084r/source/Crusader-Genesis-Starliner.ctm',
'https://robertsspaceindustries.com/media/hf0yvi22fmlt9r/source/CRUSADER_HERCULES_STARLIFTER_M2.ctm',
'https://robertsspaceindustries.com/media/r8rkg5ooz653ar/source/CRUSADER_MERCURY_STARRUNNER.ctm',
'https://robertsspaceindustries.com/media/3ibgatzkhr8lxr/source/DRAKE_Buccaneer-1.ctm',
'https://robertsspaceindustries.com/media/lcpg319apivogr/source/DRAKE-Caterpillar.ctm',
'https://robertsspaceindustries.com/media/7w8rse7wgq0bir/source/DRAKE_CUTLASSBLACK.ctm',
'https://robertsspaceindustries.com/media/l4f6394uo04qor/source/DRAKE-Dragonfly.ctm',
'https://robertsspaceindustries.com/media/3rfns6dn3oc0zr/source/DRAKE_Herald.ctm',
'https://robertsspaceindustries.com/media/bkqg6vmixwic8r/source/DRAKE_KRAKEN.ctm',
'https://robertsspaceindustries.com/media/8jveur81q9gsyr/source/DRAKE_VULTURE.ctm',
'https://robertsspaceindustries.com/media/pujbt9uhoxz4ir/source/VANDUUL_BLADE_ROTATED4.ctm',
'https://robertsspaceindustries.com/media/slwxueaytl5pqr/source/VANDUUL-Glaive2.ctm',
'https://robertsspaceindustries.com/media/v35vmkazu407pr/source/KRUGER-Merlin.ctm',
'https://robertsspaceindustries.com/media/xtrbocrcv6aier/source/KRUGER-Archimedes.ctm',
'https://robertsspaceindustries.com/media/bitttll0saevhr/source/Razor_31_v2.ctm',
'https://robertsspaceindustries.com/media/vu9g4x11mfr9sr/source/MISC_RAZOR_EX.ctm',
'https://robertsspaceindustries.com/media/s0o6a3dw3x2hzr/source/MISC_RAZOR_LX.ctm',
'https://robertsspaceindustries.com/media/8irwyka793wucr/source/MISC-Endeavor.ctm',
'https://robertsspaceindustries.com/media/h31sdu0iioxgjr/source/MISC-Freelancer.ctm',
'https://robertsspaceindustries.com/media/8ay6e9wxefsn0r/source/MISC-HullA.ctm',
'https://robertsspaceindustries.com/media/8jqd89mpxcovrr/source/MISC-HullB.ctm',
'https://robertsspaceindustries.com/media/3a5p02rnr932vr/source/MISC-HullC.ctm',
'https://robertsspaceindustries.com/media/u044v5azkzfwtr/source/MISC-HullD.ctm',
'https://robertsspaceindustries.com/media/st2avbfbqgj5br/source/MISC-HullE.ctm',
'https://robertsspaceindustries.com/media/0lxkekoaagvfrr/source/MISC-Prospector.ctm',
'https://robertsspaceindustries.com/media/ggvscct10a5hwr/source/MISC-Reliant.ctm',
'https://robertsspaceindustries.com/media/wsx2jml4c0tb3r/source/MISC-Reliant-News.ctm',
'https://robertsspaceindustries.com/media/8ivsmrhvb606sr/source/MISC-Reliant-Researcher.ctm',
'https://robertsspaceindustries.com/media/a3vl48xznz5x1r/source/MISC-Reliant-Skirmisher-1.ctm',
'https://robertsspaceindustries.com/media/5vy3qbg8wwm7jr/source/MISC-Starfarer-NEW.ctm',
'https://robertsspaceindustries.com/media/czc4kuisdi8p4r/source/MISC-StarFarer.ctm',
'https://robertsspaceindustries.com/media/3pbu69b7j423kr/source/Origin_100i_v2.ctm',
'https://robertsspaceindustries.com/media/dxlin2lzrdqn8r/source/Origin_100i_combat.ctm',
'https://robertsspaceindustries.com/media/bbcxmz62e3aaqr/source/Origin_100i_cargo.ctm',
'https://robertsspaceindustries.com/media/vm94cq29ylqulr/source/ORIGIN-315P3.ctm',
'https://robertsspaceindustries.com/media/nc147yxwmx0m6r/source/ORIGIN-325A.ctm',
'https://robertsspaceindustries.com/media/wg6k6v0r1ysqyr/source/ORIGIN_600i_EXPLORER.ctm',
'https://robertsspaceindustries.com/media/ohndkfqlx55tvr/source/ORIGIN_600i.ctm',
'https://robertsspaceindustries.com/media/tyhft6nzbm7car/source/ORIGIN_X1.ctm',
'https://robertsspaceindustries.com/media/8bzyhqppqtpf0r/source/ORIGIN_X1_VELOCITY.ctm',
'https://robertsspaceindustries.com/media/w29tifhncoqi9r/source/RSI-Apollo-Medivac.ctm',
'https://robertsspaceindustries.com/media/mwpjvt8oedqexr/source/RSI-Apollo-Triage.ctm',
'https://robertsspaceindustries.com/media/891b8unsmtxhlr/source/RSI-Aurora2.ctm',
'https://robertsspaceindustries.com/media/0i3lbvne36vx5r/source/RSI_AURORALX.ctm',
'https://robertsspaceindustries.com/media/dwwjcjv8h77str/source/RSI-Constellation-Andromeda_LOD2.ctm',
'https://robertsspaceindustries.com/media/exmhfqngu54v8r/source/RSI_CONSTELLATION_AQUILA.ctm',
'https://robertsspaceindustries.com/media/sceeoftxajvufr/source/RSI-Constellation-Phoenix_LOD2.ctm',
'https://robertsspaceindustries.com/media/gofcvcfhbztatr/source/RSI-Constellation-Taurus_LOD2.ctm',
'https://robertsspaceindustries.com/media/1v8ddmkxqouesr/source/RSI-Orion2.ctm',
'https://robertsspaceindustries.com/media/l8fs5ivw36mdvr/source/RSI-Polaris.ctm',
'https://robertsspaceindustries.com/media/fb0t5mb4tnmqer/source/RSI_URSA_ROVER.ctm',
'https://robertsspaceindustries.com/media/pwj6or2stnrmar/source/Cyclone_31_3.ctm',
'https://robertsspaceindustries.com/media/i1bgu8c0m3r8tr/source/TUMBRIL_CYCLONE_AA.ctm',
'https://robertsspaceindustries.com/media/8cadofq6qo4dyr/source/TUMBRIL_CYCLONE_RC.ctm',
'https://robertsspaceindustries.com/media/igt24zjwuo5g9r/source/TUMBRIL_CYCLONE_RN.ctm',
'https://robertsspaceindustries.com/media/b50t19ut6e94tr/source/TUMBRIL_CYCLONE_TR_.ctm',
'https://robertsspaceindustries.com/media/dic42iqv0y11cr/source/TUMBRIL_NOVA_TANK.ctm',
'https://robertsspaceindustries.com/media/21qi67il3hjrar/source/VANDUUL-Scythe4.ctm'
];

const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const ctmMap = {};
ctmUrls.forEach(url => {
    const fname = url.split('/').pop().replace('.ctm','');
    ctmMap[norm(fname)] = url;
});

const matched = [];
const unmatched = [];

missing.forEach(glb => {
    const key = norm(glb);
    // Exact normalised match
    if (ctmMap[key]) { matched.push({ glb, url: ctmMap[key] }); return; }
    // Substring match — only if the GLB key is at least 6 chars AND
    // the CTM key starts with the GLB key (avoids "a2" hitting "gamma2")
    if (key.length >= 6) {
        const found = Object.keys(ctmMap).find(k => k.startsWith(key) || key.startsWith(k));
        if (found) { matched.push({ glb, url: ctmMap[found] }); return; }
    }
    unmatched.push(glb);
});

console.log('=== MATCHED (' + matched.length + ') ===');
matched.forEach(m => console.log(m.glb + ' -> ' + m.url));
console.log('\n=== UNMATCHED (' + unmatched.length + ') ===');
unmatched.forEach(u => console.log(u));
