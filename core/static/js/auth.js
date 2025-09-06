document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  
  if (!form) return;

  form.addEventListener("submit", (e) => {
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (!username || !password) {
      e.preventDefault();
      alert("Please enter both username and password.");
    }
  });

  // Simple input focus animation
  const inputs = form.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("focus", () => {
      input.style.borderColor = "#3498db";
      input.style.boxShadow = "0 0 5px rgba(52, 152, 219, 0.7)";
    });
    input.addEventListener("blur", () => {
      input.style.borderColor = "#ccc";
      input.style.boxShadow = "none";
    });
  });
});
