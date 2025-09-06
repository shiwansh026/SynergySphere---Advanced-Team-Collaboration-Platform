// Show greeting alert on landing page only
function greetLanding() {
  alert("Welcome to SynergySphere! Start collaborating.");
}

// Add click animation to buttons
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("a.btn-primary, a.btn-secondary");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.style.transform = "scale(0.95)";
      setTimeout(() => btn.style.transform = "scale(1)", 150);
    });
  });
});

// Call greeting after load
window.onload = greetLanding;
