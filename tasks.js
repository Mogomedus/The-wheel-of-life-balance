export function initTasks(state, update) {
    const input = document.getElementById("taskInput");
    const list = document.getElementById("taskList");
    const block = document.getElementById("tasksBlock");

    block.classList.add("hidden");

    // 🔥 МОДАЛКА (улучшенная)
    const selector = document.createElement("div");
    selector.className = "modal hidden";
    selector.innerHTML = `
        <div class="modal-content">
            <span id="closeSelector" class="modal-close">✖</span>
            <p style="margin-bottom:10px;">Выбери сферы</p>
            <div id="sphereList" style="display:flex;flex-wrap:wrap;gap:6px;"></div>
            <button id="confirmSphere">OK</button>
        </div>
    `;
    document.body.appendChild(selector);

    let selectedIndexes = new Set(); // 🔥 теперь можно несколько

    function openSelector() {
        const listDiv = selector.querySelector("#sphereList");
        listDiv.innerHTML = "";
        selectedIndexes.clear();

        const w = state.wheels[state.currentWheel];

        w.labels.forEach((label, i) => {
            const btn = document.createElement("button");
            btn.innerText = label;

            btn.style.flex = "1 1 45%";

            btn.onclick = () => {
                if (selectedIndexes.has(i)) {
                    selectedIndexes.delete(i);
                    btn.style.background = "";
                } else {
                    selectedIndexes.add(i);
                    btn.style.background = "#cce5ff";
                }
            };

            listDiv.appendChild(btn);
        });

        selector.classList.remove("hidden");
    }

    // ❌ закрытие
    selector.querySelector("#closeSelector").onclick = () => {
        selector.classList.add("hidden");
    };

    selector.onclick = (e) => {
        if (e.target === selector) {
            selector.classList.add("hidden");
        }
    };

    // ✅ подтверждение
    selector.querySelector("#confirmSphere").onclick = () => {
        if (selectedIndexes.size === 0) return; // минимум 1

        if (!input.value.trim()) return;

        state.tasks.push({
            text: input.value,
            completed: false,
            spheres: [...selectedIndexes] // 🔥 массив
        });

        input.value = "";
        selector.classList.add("hidden");

        update();
    };

    document.getElementById("addTask").onclick = () => {
        openSelector();
    };

    document.getElementById("toggleTasks").onclick = () => {
        block.classList.toggle("hidden");
    };

    function render() {
        list.innerHTML = "";

        state.tasks
            .sort((a, b) => a.completed - b.completed)
            .forEach((task) => {
                const div = document.createElement("div");
                div.className = "task";
                if (task.completed) div.classList.add("completed");

                // ❌ убрали подписи сфер
                div.innerText = task.text;

                div.onclick = () => {
                    if (!task.completed) {
                        task.completed = true;

                        const w = state.wheels[state.currentWheel];

                        // 🔥 прокачка ВСЕХ выбранных сфер
                        task.spheres.forEach(i => {
                            if (w.values[i] < 10) {
                                w.values[i]++;
                            }
                        });
                    }

                    update();
                };

                list.appendChild(div);
            });
    }

    return render;
}