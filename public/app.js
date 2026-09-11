const taskList = document.getElementById("task-list");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCount = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");
const statusPill = document.getElementById("status-pill");

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

function setStatus(state, label) {
  statusPill.className = `pill pill--${state}`;
  statusPill.textContent = label;
}

function render(tasks) {
  taskList.innerHTML = "";
  taskCount.textContent = String(tasks.length);
  emptyState.classList.toggle("tasks__empty--hidden", tasks.length > 0);

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = `task${task.done ? " task--done" : ""}`;

    const check = document.createElement("button");
    check.className = `task__check${task.done ? " task__check--done" : ""}`;
    check.setAttribute("aria-label", "Toggle task");
    check.textContent = task.done ? "✓" : "";
    check.addEventListener("click", () => toggleTask(task.id));

    const title = document.createElement("span");
    title.className = "task__title";
    title.textContent = task.title;

    const del = document.createElement("button");
    del.className = "task__delete";
    del.setAttribute("aria-label", "Delete task");
    del.textContent = "✕";
    del.addEventListener("click", () => deleteTask(task.id));

    item.append(check, title, del);
    taskList.append(item);
  }
}

async function loadTasks() {
  try {
    const data = await api("/api/tasks");
    render(data.tasks);
    setStatus("ok", "online");
  } catch {
    setStatus("error", "offline");
  }
}

async function toggleTask(id) {
  await api(`/api/tasks/${id}`, { method: "PATCH" });
  await loadTasks();
}

async function deleteTask(id) {
  await api(`/api/tasks/${id}`, { method: "DELETE" });
  await loadTasks();
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  await api("/api/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  taskInput.value = "";
  taskInput.focus();
  await loadTasks();
});

loadTasks();
