export function renderControls(container, state, update) {
    container.innerHTML = "";

    const w = state.wheels[state.currentWheel];

    w.labels.forEach((label) => {
        const row = document.createElement("div");
        row.className = "sector";

        const span = document.createElement("div");
        span.innerText = label;

        span.style.flex = "1";
        span.style.padding = "6px";
        span.style.border = "1px solid #bbb";
        span.style.borderRadius = "6px";
        span.style.background = "#fff";

        row.append(span);

        // 🔥 только в режиме эксперимента появляются кнопки
        if (state.experimentMode) {
            const minus = document.createElement("button");
            minus.innerText = "-";

            const plus = document.createElement("button");
            plus.innerText = "+";

            minus.onclick = () => {
                if (w.values[row.dataset.index] > 0) {
                    w.values[row.dataset.index]--;
                    update();
                }
            };

            plus.onclick = () => {
                if (w.values[row.dataset.index] < 10) {
                    w.values[row.dataset.index]++;
                    update();
                }
            };

            row.append(minus, plus);
        }

        container.appendChild(row);
    });
}