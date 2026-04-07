/**
 * UEE Recognition Training - v15.0
 */

const CONFIG = { TRANSITION_DELAY_MS: 1000, DATA_PATH: 'data/ships.json', ROUND_TIME: 60 };
const state = { allModels: [], unseenModels: [], playerName: "", currentScore: 0, isTransitioning: false, timeLeft: CONFIG.ROUND_TIME, timerInterval: null, isGameOver: false, roundCorrect: 0, roundAttempts: 0, nextTarget: null };

const UI = {
    viewer: document.getElementById('ship-viewer'),
    preloader: document.getElementById('ship-preloader'),
    status: document.getElementById('status-text'),
    optionsContainer: document.getElementById('options'),
    loginOverlay: document.getElementById('login-overlay'),
    scoreDisplay: document.getElementById('score'),
    timeDisplay: document.getElementById('time-display'),
    summaryOverlay: document.getElementById('summary-overlay'),
    nameDisplay: document.getElementById('display-name'),
    sumScore: document.getElementById('sum-score'),
    sumAcc: document.getElementById('sum-acc'),
    sumRank: document.getElementById('sum-rank'),
    bootOverlay: document.getElementById('boot-overlay'),
    bootText: document.getElementById('boot-text')
};

const AudioEngine = {
    ctx: null, init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    play(f, t, d, v) { if (!this.ctx) return; if (this.ctx.state === 'suspended') this.ctx.resume(); const o = this.ctx.createOscillator(); const g = this.ctx.createGain(); o.type = t; o.frequency.setValueAtTime(f, this.ctx.currentTime); g.gain.setValueAtTime(v, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + d); o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime + d); },
    correct() { this.play(800, 'sine', 0.2, 0.05); }, wrong() { this.play(150, 'sawtooth', 0.4, 0.05); }, bootup() { this.play(60, 'square', 2.0, 0.03); }
};

function applyMaterials() {
    const model = UI.viewer.model; if (!model) return;
    model.materials.forEach(mat => {
        // Very dark base — suppresses baked bright hologram textures
        mat.pbrMetallicRoughness.setBaseColorFactor([0.03, 0.12, 0.22, 1.0]);
        // Near-zero emissive — prevents baked emissive maps from blowing out
        mat.setEmissiveFactor([0.0, 0.06, 0.14]);
        // High metalness + moderate roughness — dark metallic hull with reflections
        mat.pbrMetallicRoughness.setRoughnessFactor(0.3);
        mat.pbrMetallicRoughness.setMetallicFactor(0.85);
    });
}

function preloadNext() {
    if (state.unseenModels.length === 0) return;
    const peekIdx = Math.floor(Math.random() * state.unseenModels.length);
    UI.preloader.src = `models/${state.unseenModels[peekIdx].id}.glb`;
}

window.onload = async () => {
    try {
        const res = await fetch(CONFIG.DATA_PATH);
        state.allModels = (await res.json()).ships;
    } catch(e) { console.error("Manifest Load Failed"); }

    document.getElementById('login-btn').onclick = () => {
        AudioEngine.init();
        state.playerName = document.getElementById('user-name').value || "PILOT";
        UI.nameDisplay.textContent = state.playerName.toUpperCase();
        UI.loginOverlay.style.display = "none";
        playBoot();
    };

    document.getElementById('restart-btn').onclick = () => {
        UI.summaryOverlay.style.display = "none";
        startGame();
    };

    document.addEventListener('keydown', (e) => {
        const index = ['1','2','3','4'].indexOf(e.key);
        if (index === -1) return;
        const btn = UI.optionsContainer.children[index];
        if (btn) btn.click();
    });
};

function playBoot() {
    UI.bootOverlay.style.display = "flex"; AudioEngine.bootup();
    UI.bootText.textContent = ">> INITIALIZING UEE NEURAL LINK\n>> DECRYPTING FLEET MANIFEST\n>> UPLOAD COMPLETE.";
    setTimeout(() => { UI.bootOverlay.style.display = "none"; startGame(); }, 2500);
}

function startTimer() {
    clearInterval(state.timerInterval);
    state.timeLeft = CONFIG.ROUND_TIME;
    UI.timeDisplay.textContent = state.timeLeft;
    state.timerInterval = setInterval(() => {
        if (state.isGameOver) return;
        state.timeLeft--;
        UI.timeDisplay.textContent = state.timeLeft;
        if (state.timeLeft <= 0) endGame();
    }, 1000);
}

function startGame() {
    state.currentScore = 0; state.isGameOver = false; state.roundCorrect = 0; state.roundAttempts = 0;
    state.unseenModels = [...state.allModels];
    UI.scoreDisplay.textContent = "0";
    UI.summaryOverlay.style.display = "none";
    startTimer();
    startNewRound();
}

async function startNewRound() {
    if (state.isGameOver || state.isTransitioning) return;
    state.isTransitioning = true;
    UI.optionsContainer.innerHTML = "";
    UI.status.textContent = "ANALYZING SPECTRAL SIGNATURE...";

    if (state.unseenModels.length === 0) state.unseenModels = [...state.allModels];
    const idx = Math.floor(Math.random() * state.unseenModels.length);
    const target = state.unseenModels.splice(idx, 1)[0];
    state.nextTarget = target;

    let choices = [target];
    while(choices.length < 4) {
        let d = state.allModels[Math.floor(Math.random() * state.allModels.length)];
        if(!choices.some(c => c.id === d.id)) choices.push(d);
    }
    const shuffled = choices.sort(() => Math.random() - 0.5);

    UI.viewer.src = `models/${target.id}.glb`;
    UI.viewer.addEventListener('load', () => {
        applyMaterials();
        preloadNext();
        UI.status.textContent = "CONFIRM HULL IDENTITY";
        shuffled.forEach((c, i) => {
            const btn = document.createElement('button');
            const badge = document.createElement('span');
            badge.className = 'hotkey';
            badge.textContent = i + 1;
            btn.appendChild(badge);
            btn.appendChild(document.createTextNode(c.display.toUpperCase()));
            btn.onclick = () => handleAnswer(c, btn);
            UI.optionsContainer.appendChild(btn);
        });
        state.isTransitioning = false;
    }, { once: true });
    UI.viewer.addEventListener('error', () => {
        UI.status.textContent = "SIGNAL LOST — REACQUIRING...";
        state.isTransitioning = false;
        setTimeout(() => { if (!state.isGameOver) startNewRound(); }, CONFIG.TRANSITION_DELAY_MS);
    }, { once: true });
}

function handleAnswer(choice, btn) {
    if (state.isTransitioning || state.isGameOver) return;
    state.roundAttempts++;
    if (choice.id === state.nextTarget.id) {
        AudioEngine.correct(); state.currentScore++; state.roundCorrect++;
        UI.status.textContent = "VERIFIED MATCH"; UI.status.style.color = "#3effaf";
        btn.classList.add('correct');
    } else {
        AudioEngine.wrong(); state.currentScore = 0;
        UI.status.textContent = "ID ERROR: MISMATCH"; UI.status.style.color = "#ff3e3e";
        btn.classList.add('wrong');
    }

    UI.scoreDisplay.textContent = state.currentScore;
    state.isTransitioning = true;
    setTimeout(() => { if(!state.isGameOver) { state.isTransitioning = false; startNewRound(); } }, CONFIG.TRANSITION_DELAY_MS);
}

function getRank(accuracy) {
    if (accuracy >= 95) return "ADMIRAL";
    if (accuracy >= 90) return "COMMANDER";
    if (accuracy >= 80) return "LIEUTENANT";
    if (accuracy >= 70) return "ENSIGN";
    if (accuracy >= 55) return "AUXILIARY";
    if (accuracy >= 40) return "CADET";
    return "CIVILIAN";
}

function endGame() {
    state.isGameOver = true;
    clearInterval(state.timerInterval);
    const accuracy = Math.round((state.roundCorrect / (state.roundAttempts || 1)) * 100);
    UI.sumScore.textContent = state.roundCorrect;
    UI.sumAcc.textContent = accuracy + "%";
    UI.sumRank.textContent = getRank(accuracy);
    UI.summaryOverlay.style.display = "flex";
    UI.summaryOverlay.style.opacity = "1";
}
