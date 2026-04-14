export function renderLabels(container, canvas, state) {
    container.innerHTML = "";

    const w = state.wheels[state.currentWheel];
    const step = (Math.PI * 2) / 8;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = canvas.width * 0.4;

    w.labels.forEach((text, i) => {
        const a = i * step - Math.PI / 2;

        const radius = maxRadius + 30;

        let x = centerX + Math.cos(a) * radius;
        let y = centerY + Math.sin(a) * radius;

        x = Math.max(40, Math.min(canvas.width - 40, x));
        y = Math.max(15, Math.min(canvas.height - 15, y));

        const div = document.createElement("div");
        div.className = "label";
        div.style.left = x + "px";
        div.style.top = y + "px";
        div.innerText = text;

        container.appendChild(div);
    });
}