const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let centerX, centerY, maxRadius;

const sectorsCount = 8;
let data = [];
let tasks = [];

// ===== RESIZE =====
function resizeCanvas() {
    const size = Math.min(window.innerWidth - 20, 500);

    canvas.width = size;
    canvas.height = size;

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    maxRadius = size * 0.4;

    draw();
}

window.addEventListener("resize", resizeCanvas);

// ===== LOAD =====
function loadData() {
    const saved = localStorage.getItem("wheelData");
    const savedTasks = localStorage.getItem("tasks");

    if (saved) data = JSON.parse(saved);
    else {
        for (let i = 0; i < sectorsCount; i++) {
            data.push({ label: "Сфера " + (i + 1), value: 5 });
        }
    }

    if (savedTasks) tasks = JSON.parse(savedTasks);
}

// ===== SAVE =====
function saveData() {
    localStorage.setItem("wheelData", JSON.stringify(data));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== CHECK RESET =====
function checkReset() {
    const allMax = data.every(item => item.value === 10);
    if (allMax) {
        data.forEach(item => item.value = 1);
        alert("🎉 Все сферы достигли 10! Прогресс сброшен.");
    }
}

// ===== CONTROLS =====
const controlsDiv = document.getElementById("controls");

function createControls() {
    controlsDiv.innerHTML = "";

    data.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "sector";

        const input = document.createElement("input");
        input.value = item.label;
        input.oninput = () => {
            data[index].label = input.value;
            saveData();
            draw();
        };

        const minus = document.createElement("button");
        minus.innerText = "-";
        minus.onclick = () => {
            if (data[index].value > 0) {
                data[index].value--;
                update();
            }
        };

        const value = document.createElement("div");
        value.innerText = item.value;

        const plus = document.createElement("button");
        plus.innerText = "+";
        plus.onclick = () => {
            if (data[index].value < 10) {
                data[index].value++;
                update();
            }
        };

        div.append(input, minus, value, plus);
        controlsDiv.appendChild(div);
    });
}

// ===== TASKS =====
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

addTaskBtn.onclick = () => {
    if (taskInput.value.trim() === "") return;

    tasks.push({
        text: taskInput.value,
        completed: false
    });

    taskInput.value = "";
    update();
};

function renderTasks() {
    taskList.innerHTML = "";

    // сортировка: невыполненные вверх
    const sorted = [...tasks].sort((a, b) => a.completed - b.completed);

    sorted.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";
        if (task.completed) div.classList.add("completed");

        div.innerText = task.text;

        div.onclick = () => {
            task.completed = !task.completed;
            update();
        };

        taskList.appendChild(div);
    });
}

// ===== UPDATE =====
function update() {
    checkReset();
    saveData();
    createControls();
    renderTasks();
    draw();
}

// ===== DRAW =====
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const angleStep = (Math.PI * 2) / sectorsCount;

    for (let r = 1; r <= 10; r++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (maxRadius / 10) * r, 0, Math.PI * 2);
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
    }

    for (let i = 0; i < sectorsCount; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * maxRadius;
        const y = centerY + Math.sin(angle) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#aaa";
        ctx.stroke();
    }

    ctx.beginPath();
    data.forEach((item, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const radius = (item.value / 10) * maxRadius;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.closePath();

    ctx.fillStyle = "rgba(0,150,255,0.3)";
    ctx.fill();
    ctx.strokeStyle = "blue";
    ctx.stroke();

    data.forEach((item, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const radius = (item.value / 10) * maxRadius;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
    });

    ctx.font = "12px Arial";

    data.forEach((item, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (maxRadius + 15);
        const y = centerY + Math.sin(angle) * (maxRadius + 15);

        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(item.label, x, y);
    });
}

// INIT
loadData();
resizeCanvas();
createControls();
renderTasks();