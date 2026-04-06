/**
 * UEE Recognition Training - v15.0
 * Restores "Cool" Visuals and Refined Menu Logic
 */

const CONFIG = { TRANSITION_DELAY_MS: 1200, DATA_PATH: 'data/ships.json', ROUND_TIME: 60 };
const state = { allModels: [], unseenModels: [], playerName: "", currentScore: 0, isTransitioning: false, timeLeft: CONFIG.ROUND_TIME, timerInterval: null, isGameOver: false, roundCorrect: 0, roundAttempts: 0, nextTarget: null };

const UI = {
    viewer: document.getElementById('ship-viewer'),
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
        // Transparent Electric Blue Base
        mat.pbrMetallicRoughness.setBaseColorFactor([0.0, 0.4, 0.8, 0.5]); 
        // Intense Holographic Glow
        mat.setEmissiveFactor([0.0, 1.0, 1.2]); 
        mat.pbrMetallicRoughness.setRoughnessFactor(0.2);
    });
}

window.onload = async () => {
    try {
        const res = await fetch(CONFIG.DATA_PATH);
        state.allModels = (await res.json()).ships;
    } catch(e) { console.error("Manifest Load Failed"); }
    
    document.getElementById('login-btn').onclick = () => {
        AudioEngine.init();
        state.playerName = document.getElementById('user-name').value || "PILOT";
        UI.nameDisplay.innerText = state.playerName.toUpperCase();
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
    UI.bootText.innerText = ">> INITIALIZING UEE NEURAL LINK\n>> DECRYPTING FLEET MANIFEST\n>> UPLOAD COMPLETE.";
    setTimeout(() => { UI.bootOverlay.style.display = "none"; startGame(); }, 2500);
}

function startTimer() {
    clearInterval(state.timerInterval);
    state.timeLeft = CONFIG.ROUND_TIME;
    UI.timeDisplay.innerText = state.timeLeft;
    state.timerInterval = setInterval(() => {
        if (state.isGameOver) return;
        state.timeLeft--;
        UI.timeDisplay.innerText = state.timeLeft;
        if (state.timeLeft <= 0) endGame();
    }, 1000);
}

function startGame() {
    state.currentScore = 0; state.isGameOver = false; state.roundCorrect = 0; state.roundAttempts = 0;
    state.unseenModels = [...state.allModels];
    UI.scoreDisplay.innerText = "0";
    UI.summaryOverlay.style.display = "none";
    startTimer();
    startNewRound();
}

async function startNewRound() {
    if (state.isGameOver || state.isTransitioning) return;
    state.isTransitioning = true;
    UI.optionsContainer.innerHTML = "";
    UI.status.innerText = "ANALYZING SPECTRAL SIGNATURE...";

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
        UI.status.innerText = "CONFIRM HULL IDENTITY";
        shuffled.forEach(c => {
            const btn = document.createElement('button');
            btn.textContent = c.display.toUpperCase();
            btn.onclick = () => handleAnswer(c, btn);
            UI.optionsContainer.appendChild(btn);
        });
        state.isTransitioning = false;
    }, { once: true });
    UI.viewer.addEventListener('error', () => {
        UI.status.innerText = "SIGNAL LOST — REACQUIRING...";
        state.isTransitioning = false;
        setTimeout(() => { if (!state.isGameOver) startNewRound(); }, 1000);
    }, { once: true });
}

function handleAnswer(choice, btn) {
    if (state.isTransitioning || state.isGameOver) return;
    state.roundAttempts++;
    if (choice.id === state.nextTarget.id) {
        AudioEngine.correct(); state.currentScore++; state.roundCorrect++;
        UI.status.innerText = "VERIFIED MATCH"; UI.status.style.color = "#3effaf";
        btn.classList.add('correct');
    } else {
        AudioEngine.wrong(); state.currentScore = 0;
        UI.status.innerText = "ID ERROR: MISMATCH"; UI.status.style.color = "#ff3e3e";
        btn.classList.add('wrong');
    }
    
    UI.scoreDisplay.innerText = state.currentScore;
    state.isTransitioning = true;
    setTimeout(() => { if(!state.isGameOver) { state.isTransitioning = false; startNewRound(); } }, 1000);
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
    UI.sumScore.innerText = state.roundCorrect;
    UI.sumAcc.innerText = accuracy + "%";
    UI.sumRank.innerText = getRank(accuracy);
    UI.summaryOverlay.style.display = "flex";
    UI.summaryOverlay.style.opacity = "1";
}