const leadForm = document.getElementById("leadForm");
const formResult = document.getElementById("formResult");
const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(leadForm);
  const budget = data.get("budget");

  if (budget === "under-100k") {
    formResult.textContent =
      "Thanks for applying. Based on your current budget, this may be an early-stage fit. We can discuss a lighter setup during screening.";
    formResult.className = "form-result warning";
    return;
  }

  formResult.textContent =
    "Application received. We will review your details and contact you on WhatsApp within 24 hours.";
  formResult.className = "form-result success";
  leadForm.reset();
});
