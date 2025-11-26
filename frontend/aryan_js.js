let tasks = [];
let currentFilter = "all";

// ========== ADD TASK ==========
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    input.value = "";
    renderTasks();
    updateStats();
}

// ========== TOGGLE COMPLETE ==========
function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    renderTasks();
    updateStats();
}

// ========== DELETE TASK WITH CONFIRMATION ==========
function deleteTask(id) {
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (!confirmed) return; // user canceled

    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    updateStats();
}


// ========== EDIT TASK ==========
function editTask(id) {
    const newText = prompt("Edit your task:");

    if (newText === null) return; // cancelled
    if (newText.trim() === "") return; // empty

    tasks = tasks.map(t =>
        t.id === id ? { ...t, text: newText.trim() } : t
    );

    renderTasks();
}

// ========== RENDER TASKS ==========
function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    let filtered = tasks;

    if (currentFilter === "active") {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
        filtered = tasks.filter(t => t.completed);
    }

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${task.id})">

            <span class="task-text">${task.text}</span>

            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        list.appendChild(li);
    });
}

// ========== UPDATE STATS ==========
function updateStats() {
    document.getElementById("totalTasks").innerText = `${tasks.length} tasks`;
    const completedCount = tasks.filter(t => t.completed).length;
    document.getElementById("completedTasks").innerText = `${completedCount} completed`;
}

// ========== FILTER BUTTONS ==========
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = btn.getAttribute("data-filter");
        renderTasks();
    });
});
