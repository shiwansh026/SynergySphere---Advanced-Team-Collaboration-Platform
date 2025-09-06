document.addEventListener("DOMContentLoaded", () => {
  // Highlight list items on click
  const listItems = document.querySelectorAll(".list-group-item");
  listItems.forEach(item => {
    item.addEventListener("click", () => {
      listItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // Optional: Add event to add-project button to show alert
  const addProjectBtn = document.querySelector("a.btn-primary.mb-2");
  if (addProjectBtn) {
    addProjectBtn.addEventListener("click", (e) => {
      alert("Add Project feature (prototype) is not implemented yet.");
      e.preventDefault();
    });
  }
});
