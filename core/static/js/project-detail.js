document.addEventListener("DOMContentLoaded", () => {
  // Highlight task when clicked
  const tasks = document.querySelectorAll(".list-group-item");
  tasks.forEach(task => {
    task.addEventListener("click", () => {
      tasks.forEach(t => t.classList.remove("selected"));
      task.classList.add("selected");
    });
  });

  // Alert placeholder for Add Task button
  const addTaskBtn = document.querySelector("a.btn-primary.mb-2");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", (e) => {
      alert("Add Task feature coming soon.");
      e.preventDefault();
    });
  }
});
