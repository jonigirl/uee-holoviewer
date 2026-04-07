/**
 * UEE Recognition Training - v15.0
 */

// ── Configuration & State ────────────────────────────────────────────────────

const CONFIG = {
    TRANSITION_DELAY_MS: 1000,
    DATA_PATH: 'data/ships.json',
    ROUND_TIME: 60,
    MODELS_BASE: 'https://pub-08c2d983d3d740e38793852534ce4390.r2.dev'
};

const state = {
    allModels: [],               // full ship list loaded from ships.json
    unseenModels: [],            // ships not yet shown this cycle (deduplication pool)
    playerName: "",
    currentScore: 0,             // current streak count (resets on wrong answer)
    isTransitioning: false,      // guard: prevents double-firing during model load
    timeLeft: CONFIG.ROUND_TIME,
    timerInterval: null,
    isGameOver: false,
    roundCorrect: 0,             // correct answers this round
    roundAttempts: 0,            // total answers this round
    nextTarget: null,            // current ship being identified
    roundStartTime: 0,           // timestamp when answer options appeared (ms)
    correctTimes: [],            // response times for correct answers (ms)
    bestStreak: 0,               // highest consecutive streak this round
    currentStreak: 0             // running streak counter
};

// ── DOM References ───────────────────────────────────────────────────────────

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
    sumStreak: document.getElementById('sum-streak'),
    sumAvgTime: document.getElementById('sum-avg-time'),
    sumBestTime: document.getElementById('sum-best-time'),
    bootOverlay: document.getElementById('boot-overlay'),
    bootText: document.getElementById('boot-text')
};

// ── Audio Engine ─────────────────────────────────────────────────────────────

const AudioEngine = {
    ctx: null,
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },

    // play(frequency, waveType, duration, volume)
    // Handles browser auto-suspend by awaiting ctx.resume() before playing
    play(f, t, d, v) {
        if (!this.ctx) return;
        const doPlay = () => {
            const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
            o.type = t; o.frequency.setValueAtTime(f, this.ctx.currentTime);
            g.gain.setValueAtTime(v, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + d);
            o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime + d);
        };
        if (this.ctx.state === 'suspended') { this.ctx.resume().then(doPlay); } else { doPlay(); }
    },

    correct()  { this.play(600, 'sine', 0.12, 0.04); setTimeout(() => this.play(900, 'sine', 0.15, 0.05), 80); },
    wrong()    { this.play(300, 'sawtooth', 0.15, 0.04); setTimeout(() => this.play(180, 'sawtooth', 0.2, 0.06), 60); },
    bootup()   { this.play(60, 'square', 2.0, 0.03); },
    gameover() {
        this.play(440, 'sawtooth', 0.3, 0.06);
        setTimeout(() => this.play(330, 'sawtooth', 0.3, 0.06), 200);
        setTimeout(() => this.play(220, 'sawtooth', 0.5, 0.07), 400);
    }
};

// ── Model Materials ──────────────────────────────────────────────────────────

// Override PBR material values to produce the RSI holographic look:
// dark metallic teal hull with suppressed baked textures
function applyMaterials() {
    const model = UI.viewer.model; if (!model) return;
    model.materials.forEach(mat => {
        mat.pbrMetallicRoughness.setBaseColorFactor([0.03, 0.12, 0.22, 1.0]);
        mat.setEmissiveFactor([0.0, 0.06, 0.14]);
        mat.pbrMetallicRoughness.setRoughnessFactor(0.3);
        mat.pbrMetallicRoughness.setMetallicFactor(0.85);
    });
}

// ── Preloader ────────────────────────────────────────────────────────────────

// Warms the browser cache for a random upcoming ship while the player answers
function preloadNext() {
    if (state.unseenModels.length === 0) return;
    const peekIdx = Math.floor(Math.random() * state.unseenModels.length);
    UI.preloader.src = `${CONFIG.MODELS_BASE}/${state.unseenModels[peekIdx].id}.glb`;
}

// ── Initialisation ───────────────────────────────────────────────────────────

window.onload = async () => {
    // Load ship manifest on page load so it's ready before the player logs in
    try {
        const res = await fetch(CONFIG.DATA_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        state.allModels = (await res.json()).ships;
        if (!state.allModels.length) throw new Error('Empty manifest');
    } catch(e) {
        console.error('Manifest load failed:', e.message);
        const btn = document.getElementById('login-btn');
        btn.textContent = 'MANIFEST ERROR — RELOAD';
        btn.disabled = true;
    }

    document.getElementById('login-btn').onclick = () => {
        AudioEngine.init(); // must be triggered by user gesture to satisfy browser policy
        state.playerName = document.getElementById('user-name').value.trim() || "PILOT";
        UI.nameDisplay.textContent = state.playerName.toUpperCase();
        UI.loginOverlay.style.display = "none";
        playBoot();
    };

    document.getElementById('restart-btn').onclick = () => {
        UI.summaryOverlay.style.display = "none";
        startGame();
    };

    // Keyboard shortcuts: 1-4 map to the four answer buttons
    document.addEventListener('keydown', (e) => {
        const index = ['1','2','3','4'].indexOf(e.key);
        if (index === -1) return;
        e.preventDefault();
        const btn = UI.optionsContainer.children[index];
        if (btn) btn.click();
    });
};

// ── Boot Sequence ────────────────────────────────────────────────────────────

function playBoot() {
    UI.bootOverlay.style.display = "flex"; AudioEngine.bootup();
    UI.bootText.textContent = ">> INITIALIZING UEE NEURAL LINK\n>> DECRYPTING FLEET MANIFEST\n>> UPLOAD COMPLETE.";
    setTimeout(() => { UI.bootOverlay.style.display = "none"; startGame(); }, 2500);
}

// ── Timer ────────────────────────────────────────────────────────────────────

function startTimer() {
    clearInterval(state.timerInterval);
    state.timeLeft = CONFIG.ROUND_TIME;
    UI.timeDisplay.textContent = state.timeLeft;
    state.timerInterval = setInterval(() => {
        if (state.isGameOver) return;
        state.timeLeft--;
        UI.timeDisplay.textContent = state.timeLeft;
        if (state.timeLeft === 10) UI.timeDisplay.classList.add('urgent');
        if (state.timeLeft <= 0) endGame();
    }, 1000);
}

// ── Game Flow ────────────────────────────────────────────────────────────────

function startGame() {
    state.currentScore = 0; state.isGameOver = false; state.roundCorrect = 0; state.roundAttempts = 0;
    state.correctTimes = []; state.bestStreak = 0; state.currentStreak = 0;
    UI.timeDisplay.classList.remove('urgent');
    state.unseenModels = [...state.allModels];
    UI.scoreDisplay.textContent = "0";
    UI.summaryOverlay.style.display = "none";
    startTimer();
    startNewRound();
}

async function startNewRound() {
    if (state.isGameOver || state.isTransitioning) return;
    if (state.allModels.length === 0) { endGame(); return; }
    state.isTransitioning = true;
    UI.optionsContainer.innerHTML = "";
    UI.status.classList.remove('correct', 'wrong');
    UI.status.textContent = "ANALYZING SPECTRAL SIGNATURE...";

    // Replenish pool when all ships have been seen; exclude the last shown ship
    if (state.unseenModels.length === 0) {
        state.unseenModels = [...state.allModels];
        if (state.nextTarget) state.unseenModels = state.unseenModels.filter(m => m.id !== state.nextTarget.id);
    }

    const idx = Math.floor(Math.random() * state.unseenModels.length);
    const target = state.unseenModels.splice(idx, 1)[0];
    state.nextTarget = target;

    // Build 4 choices: the correct answer + 3 random decoys
    let choices = [target];
    while(choices.length < 4) {
        let d = state.allModels[Math.floor(Math.random() * state.allModels.length)];
        if(!choices.some(c => c.id === d.id)) choices.push(d);
    }
    const shuffled = choices.sort(() => Math.random() - 0.5);

    UI.viewer.src = `${CONFIG.MODELS_BASE}/${target.id}.glb`;

    // { once: true } ensures the listener self-removes after firing
    UI.viewer.addEventListener('load', () => {
        applyMaterials();
        preloadNext();
        UI.status.textContent = "CONFIRM HULL IDENTITY";
        state.roundStartTime = Date.now();
        shuffled.forEach((c, i) => {
            const btn = document.createElement('button');
            btn.dataset.shipId = c.id; // used to locate correct btn on wrong answer
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

    // If a model fails to load, release the transition lock and skip to next round
    UI.viewer.addEventListener('error', () => {
        UI.status.textContent = "SIGNAL LOST — REACQUIRING...";
        state.isTransitioning = false;
        setTimeout(() => { if (!state.isGameOver) startNewRound(); }, CONFIG.TRANSITION_DELAY_MS);
    }, { once: true });
}

// ── Answer Handling ──────────────────────────────────────────────────────────

function handleAnswer(choice, btn) {
    if (state.isTransitioning || state.isGameOver) return;
    state.roundAttempts++;
    const elapsed = Date.now() - state.roundStartTime;
    if (choice.id === state.nextTarget.id) {
        AudioEngine.correct(); state.currentScore++; state.roundCorrect++;
        state.correctTimes.push(elapsed);
        state.currentStreak++;
        if (state.currentStreak > state.bestStreak) state.bestStreak = state.currentStreak;
        UI.status.textContent = "VERIFIED MATCH"; UI.status.classList.add('correct');
        btn.classList.add('correct');
    } else {
        AudioEngine.wrong(); state.currentScore = 0;
        state.currentStreak = 0;
        UI.status.textContent = "ID ERROR: MISMATCH"; UI.status.classList.add('wrong');
        btn.classList.add('wrong');
        // Reveal the correct answer so the player can learn from the mistake
        const correctBtn = UI.optionsContainer.querySelector(`[data-ship-id="${CSS.escape(state.nextTarget.id)}"]`);
        if (correctBtn) correctBtn.classList.add('correct');
    }

    UI.scoreDisplay.textContent = state.currentScore;
    state.isTransitioning = true;
    setTimeout(() => { if(!state.isGameOver) { state.isTransitioning = false; startNewRound(); } }, CONFIG.TRANSITION_DELAY_MS);
}

// ── Rank Calculation ─────────────────────────────────────────────────────────

function getRank(accuracy) {
    if (accuracy >= 95) return "ADMIRAL";
    if (accuracy >= 90) return "COMMANDER";
    if (accuracy >= 80) return "LIEUTENANT";
    if (accuracy >= 70) return "ENSIGN";
    if (accuracy >= 55) return "AUXILIARY";
    if (accuracy >= 40) return "CADET";
    return "CIVILIAN";
}

// ── End Game ─────────────────────────────────────────────────────────────────

function endGame() {
    state.isGameOver = true;
    clearInterval(state.timerInterval);
    AudioEngine.gameover();
    const accuracy = Math.round((state.roundCorrect / (state.roundAttempts || 1)) * 100);
    const avgTime = state.correctTimes.length
        ? (state.correctTimes.reduce((a, b) => a + b, 0) / state.correctTimes.length / 1000).toFixed(1) + 's'
        : '---';
    const bestTime = state.correctTimes.length
        ? (Math.min(...state.correctTimes) / 1000).toFixed(1) + 's'
        : '---';
    UI.sumScore.textContent = state.roundCorrect;
    UI.sumAcc.textContent = accuracy + "%";
    UI.sumRank.textContent = getRank(accuracy);
    UI.sumStreak.textContent = state.bestStreak;
    UI.sumAvgTime.textContent = avgTime;
    UI.sumBestTime.textContent = bestTime;
    UI.summaryOverlay.style.display = "flex";
}
