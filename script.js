const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// DOM Elements
const taskDateEl = document.getElementById("taskDate");
const taskTimeEl = document.getElementById("taskTime");
const taskTextEl = document.getElementById("taskText");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskListEl = document.getElementById("taskList");

// Initialize date picker to today
taskDateEl.value = formatDate(new Date());

// Load tasks on initial load
loadTasks();

// Event: Add Task
addTaskBtn.addEventListener("click", () => {
  const dateKey = taskDateEl.value;
  const time = taskTimeEl.value;
  const text = taskTextEl.value.trim();

  if (!time) {
    alert("Please select a time.");
    return;
  }
  if (!text) {
    alert("Please enter a task.");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem(dateKey) || "[]");
  tasks.push({ time, text });
  tasks.sort((a, b) => a.time.localeCompare(b.time));
  localStorage.setItem(dateKey, JSON.stringify(tasks));

  taskTimeEl.value = "";
  taskTextEl.value = "";

  renderTasks(tasks);
});

// Event: Change date
taskDateEl.addEventListener("change", loadTasks);

// Render tasks for current date
function loadTasks() {
  const dateKey = taskDateEl.value;
  const tasks = JSON.parse(localStorage.getItem(dateKey) || "[]");
  tasks.sort((a, b) => a.time.localeCompare(b.time));
  renderTasks(tasks);
}

// Render tasks into DOM
function renderTasks(tasks) {
  taskListEl.innerHTML = "";
  if (tasks.length === 0) {
    taskListEl.innerHTML =
      '<p style="text-align:center;color:#888;">No tasks yet. Add one above!</p>';
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement("div");
    item.className = "task-item";
    item.innerHTML = `
        <div class="task-time">${task.time}</div>
        <div class="task-text">${task.text}</div>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
    taskListEl.appendChild(item);
  });

  // Attach delete handlers
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      deleteTask(index);
    });
  });
}

// Delete task by index
function deleteTask(idx) {
  const dateKey = taskDateEl.value;
  const tasks = JSON.parse(localStorage.getItem(dateKey) || "[]");
  tasks.splice(idx, 1);
  localStorage.setItem(dateKey, JSON.stringify(tasks));
  renderTasks(tasks);
}
