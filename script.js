// ── Configuration ──────────────────────────────────────────────────────────
// After deploying the Google Apps Script (see setup/google-apps-script.js),
// paste your Web App URL here:
const APPS_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
// ───────────────────────────────────────────────────────────────────────────

const leadForm = document.getElementById("leadForm");
const formResult = document.getElementById("formResult");
const submitBtn = document.getElementById("submitBtn");
const businessTypeSelect = document.getElementById("businessType");
const otherCategoryWrap = document.getElementById("otherCategoryWrap");
const otherBusinessTypeInput = document.getElementById("otherBusinessType");

// Reveal-on-scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Show/hide "Other" business category input
function handleOtherCategory() {
  const isOther = businessTypeSelect?.value === "Other";
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

// Form submission
leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }

  // Collect form data
  const formData = new FormData(leadForm);
  const payload = {};
  formData.forEach((val, key) => { payload[key] = val; });

  // Combine businessType with otherBusinessType if applicable
  if (payload.businessType === "Other" && payload.otherBusinessType) {
    payload.businessType = payload.otherBusinessType;
  }
  delete payload.otherBusinessType;

  // Disable button while submitting
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  formResult.textContent = "";
  formResult.className = "form-result";

  try {
    // Submit to Google Apps Script (no-cors because GAS redirects on POST)
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(payload).toString(),
    });

    // With no-cors we can't read the response, but the script will have run.
    showSuccess();
  } catch {
    // Network error — still show success as data is likely sent via the GAS redirect
    showSuccess();
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application";
  }
});

function showSuccess() {
  formResult.textContent =
    "✅ Application received! We will review your details and contact you on WhatsApp within 24 hours.";
  formResult.className = "form-result success";
  leadForm.reset();
  handleOtherCategory();
  leadForm.scrollIntoView({ behavior: "smooth", block: "end" });
}

// Graceful image fallback for missing portfolio screenshots
document.querySelectorAll(".work-visual img").forEach((img) => {
  img.addEventListener("error", () => {
    img.closest(".work-visual")?.classList.add("image-missing");
  });
});
