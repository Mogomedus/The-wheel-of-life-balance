import { state } from "./state.js";
import { loadState, saveState } from "./storage.js";

import { drawWheel } from "./draw.js";
import { renderLabels } from "./labels.js";

import { renderControls } from "./controls.js";
import { initSwitcher } from "./switcher.js";
import { initTasks } from "./tasks.js";

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const labelsDiv = document.getElementById("labels");
const controlsDiv = document.getElementById("controls");
const scoreDiv = document.getElementById("score");

let rotation = 0;

// INIT
loadState(state);

function resize() {
    const size = Math.min(window.innerWidth - 20, 400);
    canvas.width = size;
    canvas.height = size;
}

window.addEventListener("resize", () => {
    resize();
    update();
});

const renderSwitcher = initSwitcher(state, update);
const renderTasks = initTasks(state, update);

// 📅 проверка нового дня
function isNewDay(lastDate) {
    if (!lastDate) return true;

    const last = new Date(lastDate);
    const now = new Date();

    return now.toDateString() !== last.toDateString();
}

// 🎯 очки
function checkScore() {
    const values = state.wheels[state.currentWheel].values;
    const min = Math.min(...values);

    if (values.every(v => v === 10) && !state.spinning) {
        state.score += 5;
        state.lastScoreDate = new Date().toISOString();
        spinWheel();
        return;
    }

    if (isNewDay(state.lastScoreDate)) {
        if (min > state.lastMin) {
            state.score += 1;
            state.lastMin = min;
            state.lastScoreDate = new Date().toISOString();
        }
    }
}

// 🌀 вращение
function spinWheel() {
    state.spinning = true;

    const w = state.wheels[state.currentWheel];
    const duration = 2000;

    let start = null;

    function animate(ts) {
        if (!start) start = ts;
        const progress = ts - start;

        rotation = (progress / duration) * Math.PI * 4;

        drawWheel(ctx, canvas, state, rotation);

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            sequentialReset(w.values, () => {
                rotation = 0;
                state.lastMin = 1;
                state.spinning = false;
                update();
            });
        }
    }

    requestAnimationFrame(animate);
}

// 🔥 плавный сброс
function sequentialReset(values, callback) {
    let i = 0;

    function step() {
        if (i >= values.length) {
            callback();
            return;
        }

        values[i] = 1;
        update();

        i++;
        setTimeout(step, 200);
    }

    step();
}

// 🧪 режим эксперимента
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const dist = Math.hypot(x - centerX, y - centerY);

    if (dist < 30) {
        state.centerClicks++;

        if (state.centerClicks >= 5) {
            toggleExperiment();
            state.centerClicks = 0;
        }
    } else {
        state.centerClicks = 0;
    }
});

function toggleExperiment() {
    if (!state.experimentMode) {
        state.experimentMode = true;

        state.experimentBackup = JSON.parse(
            JSON.stringify(state.wheels[state.currentWheel].values)
        );
    } else {
        state.experimentMode = false;

        state.wheels[state.currentWheel].values =
            state.experimentBackup;

        state.experimentBackup = null;
    }

    update();
}

// 🎨 декор
const decorBtn = document.getElementById("decorBtn");
const modal = document.getElementById("decorModal");
const closeModal = document.getElementById("closeModal");

decorBtn.onclick = () => modal.classList.remove("hidden");
closeModal.onclick = () => modal.classList.add("hidden");

modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
};

// UPDATE
function update() {
    checkScore();

    saveState(state);

    scoreDiv.innerText = state.score;

    renderSwitcher();
    renderControls(controlsDiv, state, update);
    renderLabels(labelsDiv, canvas, state);
    renderTasks();

    if (!state.spinning) {
        drawWheel(ctx, canvas, state, rotation);
    }
}

// START
resize();
update();