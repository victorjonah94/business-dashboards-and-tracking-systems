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
  const volume = data.get("revenueBand");

  if (volume === "low-volume") {
    formResult.textContent =
      "Thanks for applying. Your operation may be better suited for the template package built for smaller businesses. We can guide you to that option.";
    formResult.className = "form-result warning";
    return;
  }

  formResult.textContent =
    "Application received. We will review your details and contact you on WhatsApp within 24 hours.";
  formResult.className = "form-result success";
  leadForm.reset();
});

// If screenshot files are missing, show graceful fallback card state.
document.querySelectorAll(".work-visual img").forEach((img) => {
  img.addEventListener("error", () => {
    img.closest(".work-visual")?.classList.add("image-missing");
  });
});
