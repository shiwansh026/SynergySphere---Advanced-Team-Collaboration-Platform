// Simple confirmation on logout or navigation back
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.querySelector("a.btn-primary");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      if (!confirm("Return to dashboard?")) {
        e.preventDefault();
      }
    });
  }
});
