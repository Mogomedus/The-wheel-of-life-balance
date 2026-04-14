export function loadState(state) {
    const saved = localStorage.getItem("wheels");

    if (saved) {
        state.wheels = JSON.parse(saved);
    } else {
        state.wheels = [
            {
                name: "Колесо баланса жизни",
                labels: ["Религия","Семья","Окружение","Финансы","Работа","Отдых","Здоровье","Саморазвитие"],
                values: Array(8).fill(1)
            }
        ];
    }

    state.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    state.score = JSON.parse(localStorage.getItem("score")) || 0;
    state.lastMin = JSON.parse(localStorage.getItem("lastMin")) || 1;
    state.lastScoreDate = localStorage.getItem("lastScoreDate") || null;
}

export function saveState(state) {
    localStorage.setItem("wheels", JSON.stringify(state.wheels));
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
    localStorage.setItem("score", JSON.stringify(state.score));
    localStorage.setItem("lastMin", JSON.stringify(state.lastMin));
    localStorage.setItem("lastScoreDate", state.lastScoreDate);
}