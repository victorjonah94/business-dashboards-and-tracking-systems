const leadForm = document.getElementById("leadForm");
const formResult = document.getElementById("formResult");
const revealItems = document.querySelectorAll(".reveal");
const businessTypeSelect = document.getElementById("businessType");
const otherCategoryWrap = document.getElementById("otherCategoryWrap");
const otherBusinessTypeInput = document.getElementById("otherBusinessType");

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

function handleOtherCategory() {
  const isOther = businessTypeSelect?.value === "other";
  if (isOther) {
    otherCategoryWrap?.classList.remove("hidden-field");
    otherBusinessTypeInput?.setAttribute("required", "required");
  } else {
    otherCategoryWrap?.classList.add("hidden-field");
    otherBusinessTypeInput?.removeAttribute("required");
    if (otherBusinessTypeInput) otherBusinessTypeInput.value = "";
  }
}
businessTypeSelect?.addEventListener("change", handleOtherCategory);
handleOtherCategory();

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
  handleOtherCategory();
});

// If screenshot files are missing, show graceful fallback card state.
document.querySelectorAll(".work-visual img").forEach((img) => {
  img.addEventListener("error", () => {
    img.closest(".work-visual")?.classList.add("image-missing");
  });
});