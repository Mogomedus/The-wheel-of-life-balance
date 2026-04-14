export function initSwitcher(state, update) {
    const select = document.getElementById("wheelSelect");
    const nameInput = document.getElementById("wheelName");
    const addBtn = document.getElementById("addWheel");
    const deleteBtn = document.getElementById("deleteWheel");

    function render() {
        select.innerHTML = "";

        state.wheels.forEach((w, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.text = w.name;
            select.appendChild(opt);
        });

        select.value = state.currentWheel;
        nameInput.value = state.wheels[state.currentWheel].name;

        // 🔥 отключаем всё
        nameInput.disabled = true;
        addBtn.style.display = "none";
        deleteBtn.style.display = "none";
    }

    select.onchange = () => {
        state.currentWheel = +select.value;
        update();
    };

    return render;
}