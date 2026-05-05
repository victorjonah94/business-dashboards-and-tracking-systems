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

// ── Reveal-on-scroll ──────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ── Other category toggle ─────────────────────────────────────────────────
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

// ── Form submission ───────────────────────────────────────────────────────
leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }

  const formData = new FormData(leadForm);
  const payload = {};
  formData.forEach((val, key) => { payload[key] = val; });

  if (payload.businessType === "Other" && payload.otherBusinessType) {
    payload.businessType = payload.otherBusinessType;
  }
  delete payload.otherBusinessType;

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  formResult.textContent = "";
  formResult.className = "form-result";

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(payload).toString(),
    });
    showSuccess();
  } catch {
    showSuccess();
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application";
  }
});

function showSuccess() {
  formResult.textContent =
    "✅ Application received! We'll review your details and contact you on WhatsApp within 24 hours.";
  formResult.className = "form-result success";
  leadForm.reset();
  handleOtherCategory();
  formResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ── Graceful image fallback ───────────────────────────────────────────────
document.querySelectorAll(".work-visual img").forEach((img) => {
  img.addEventListener("error", () => {
    img.closest(".work-visual")?.classList.add("image-missing");
  });
});

// ── Lightbox ─────────────────────────────────────────────────────────────
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(card) {
  const img = card.querySelector(".work-visual img");
  const title = card.dataset.title || card.querySelector("h3")?.textContent || "";
  const desc = card.dataset.desc || "";

  lightboxImg.src = img ? img.src : "";
  lightboxImg.alt = img ? img.alt : "";
  lightboxTitle.innerHTML = title;
  lightboxDesc.innerHTML = desc;

  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

// Click image or expand button to open
document.querySelectorAll(".work-card").forEach((card) => {
  card.querySelector(".work-visual")?.addEventListener("click", () => openLightbox(card));
  card.querySelector(".expand-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox(card);
  });

  // Make image cursor a pointer hint
  const visual = card.querySelector(".work-visual");
  if (visual) visual.style.cursor = "zoom-in";
});

lightboxClose.addEventListener("click", closeLightbox);

// Click backdrop to close
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Escape key to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});
