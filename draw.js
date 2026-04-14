export function drawWheel(ctx, canvas, state, rotation = 0) {
    const w = state.wheels[state.currentWheel];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = canvas.width * 0.4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);

    const step = (Math.PI * 2) / 8;

    for (let r = 1; r <= 10; r++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (maxRadius / 10) * r, 0, Math.PI * 2);
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
    }

    for (let i = 0; i < 8; i++) {
        const a = i * step - Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(a) * maxRadius,
            centerY + Math.sin(a) * maxRadius
        );
        ctx.stroke();
    }

    ctx.beginPath();
    w.values.forEach((v, i) => {
        const a = i * step - Math.PI / 2;
        const r = (v / 10) * maxRadius;

        const x = centerX + Math.cos(a) * r;
        const y = centerY + Math.sin(a) * r;

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fillStyle = "rgba(0,150,255,0.2)";
    ctx.fill();

    ctx.strokeStyle = "#007bff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
}