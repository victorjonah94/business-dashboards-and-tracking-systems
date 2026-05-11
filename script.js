// ── Configuration ──────────────────────────────────────────────────────────
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyF6ITf1VMuD72ShYDNfBg8ypBanl3JPE25JevSl9u4hkflC6lGPlEE-afjlGqmKA-K/exec";
const WHATSAPP_NUMBER = "2348030750358";
// ───────────────────────────────────────────────────────────────────────────

// ── Dark mode ─────────────────────────────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

// Restore preference or use system default
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
});

// ── Reveal-on-scroll ──────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("show"); }),
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ── Form references ───────────────────────────────────────────────────────
const leadForm               = document.getElementById("leadForm");
const whatsappBtn            = document.getElementById("whatsappBtn");
const businessTypeSelect     = document.getElementById("businessType");
const otherCategoryWrap      = document.getElementById("otherCategoryWrap");
const otherBusinessTypeInput = document.getElementById("otherBusinessType");
const roleSelect             = document.getElementById("roleSelect");
const otherRoleWrap          = document.getElementById("otherRoleWrap");
const otherRoleInput         = document.getElementById("otherRole");

// ── WhatsApp button gating — enabled only when all required fields filled ──
function checkFormValidity() {
  if (!leadForm || !whatsappBtn) return;
  const name         = leadForm.querySelector('[name="name"]')?.value.trim();
  const email        = leadForm.querySelector('[name="email"]')?.value.trim();
  const phone        = leadForm.querySelector('[name="phone"]')?.value.trim();
  const businessType = leadForm.querySelector('[name="businessType"]')?.value;
  const businessName = leadForm.querySelector('[name="businessName"]')?.value.trim();
  const role         = leadForm.querySelector('[name="role"]')?.value;
  const location     = leadForm.querySelector('[name="location"]')?.value;
  const revenueBand  = leadForm.querySelector('[name="revenueBand"]')?.value;
  const otherCatOk   = businessType !== "Other" || !!otherBusinessTypeInput?.value.trim();
  const otherRoleOk  = role !== "Other" || !!otherRoleInput?.value.trim();
  whatsappBtn.disabled = !(name && email && phone && businessType && businessName && role && location && revenueBand && otherCatOk && otherRoleOk);
}

// ── Other business category toggle ───────────────────────────────────────
function handleOtherCategory() {
  const isOther = businessTypeSelect?.value === "Other";
  otherCategoryWrap?.classList.toggle("hidden-field", !isOther);
  if (isOther) {
    otherBusinessTypeInput?.setAttribute("required", "required");
  } else {
    otherBusinessTypeInput?.removeAttribute("required");
    if (otherBusinessTypeInput) otherBusinessTypeInput.value = "";
  }
  checkFormValidity();
}

// ── Other role toggle ─────────────────────────────────────────────────────
function handleOtherRole() {
  const isOther = roleSelect?.value === "Other";
  otherRoleWrap?.classList.toggle("hidden-field", !isOther);
  if (isOther) {
    otherRoleInput?.setAttribute("required", "required");
  } else {
    otherRoleInput?.removeAttribute("required");
    if (otherRoleInput) otherRoleInput.value = "";
  }
  checkFormValidity();
}

businessTypeSelect?.addEventListener("change", handleOtherCategory);
roleSelect?.addEventListener("change", handleOtherRole);
handleOtherCategory();
handleOtherRole();

// Watch all required fields for changes
["name", "email", "phone", "businessName", "location", "revenueBand"].forEach((n) => {
  leadForm?.querySelector(`[name="${n}"]`)?.addEventListener("input", checkFormValidity);
  leadForm?.querySelector(`[name="${n}"]`)?.addEventListener("change", checkFormValidity);
});
businessTypeSelect?.addEventListener("change", checkFormValidity);
roleSelect?.addEventListener("change", checkFormValidity);
otherBusinessTypeInput?.addEventListener("input", checkFormValidity);
otherRoleInput?.addEventListener("input", checkFormValidity);

// ── WhatsApp submit — sends email via Apps Script + opens WhatsApp ─────────
whatsappBtn?.addEventListener("click", () => {
  if (!leadForm.checkValidity()) { leadForm.reportValidity(); return; }

  const data = Object.fromEntries(new FormData(leadForm).entries());
  if (data.businessType === "Other" && data.otherBusinessType) {
    data.businessType = data.otherBusinessType;
  }
  delete data.otherBusinessType;

  const resolvedRole = data.role === "Other" ? data.otherRole : data.role;
  delete data.otherRole;
  data.role = resolvedRole;

  const standardRoles = ["CEO", "Managing Director", "Founder"];
  const articleRole = standardRoles.includes(resolvedRole)
    ? `the ${resolvedRole}`
    : `a ${resolvedRole}`;

  const waMessage = `Hi Victor, I am ${articleRole} of ${data.businessName}, when could we meet so I can walk you through what I need built for my business.`;

  // Open WhatsApp synchronously (before any async) to avoid popup blockers
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`,
    "_blank"
  );

  // Fire-and-forget email submission via Apps Script
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(data).toString(),
  }).catch(() => {});

  leadForm.reset();
  handleOtherCategory();
  handleOtherRole();
});

// ── Image fallback ────────────────────────────────────────────────────────
document.querySelectorAll(".work-visual img").forEach((img) => {
  img.addEventListener("error", () => img.closest(".work-visual")?.classList.add("image-missing"));
});

// ── Lightbox ─────────────────────────────────────────────────────────────
const lightbox      = document.getElementById("lightbox");
const lightboxImg   = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDesc  = document.getElementById("lightboxDesc");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxCta   = document.querySelector(".lightbox-cta");

function openLightbox(card) {
  const img = card.querySelector(".work-visual img");
  lightboxImg.src   = img?.src || "";
  lightboxImg.alt   = img?.alt || "";
  lightboxTitle.innerHTML = card.dataset.title || card.querySelector("h3")?.textContent || "";
  lightboxDesc.innerHTML  = card.dataset.desc  || "";

  const sheetUrl = card.dataset.sheetUrl;
  if (lightboxCta) {
    if (sheetUrl) {
      lightboxCta.textContent = "Preview This Sheet";
      lightboxCta.href = sheetUrl;
      lightboxCta.target = "_blank";
      lightboxCta.rel = "noopener";
    } else {
      lightboxCta.textContent = "Apply to Build This";
      lightboxCta.href = "#book";
      lightboxCta.removeAttribute("target");
      lightboxCta.removeAttribute("rel");
    }
  }

  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".work-card").forEach((card) => {
  const visual = card.querySelector(".work-visual");
  if (visual) {
    visual.style.cursor = "zoom-in";
    visual.addEventListener("click", () => openLightbox(card));
  }
  card.querySelector(".expand-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox(card);
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});

// ── Pain Points slider ───────────────────────────────────────────────────
(function initPainSlider() {
  const slider   = document.getElementById("painSlider");
  const dotsWrap = document.getElementById("painDots");
  const prev     = document.getElementById("painPrev");
  const next     = document.getElementById("painNext");
  if (!slider || !dotsWrap) return;

  const cards = Array.from(slider.children);

  function getStep() {
    const first  = cards[0];
    if (!first) return slider.clientWidth;
    const second = cards[1];
    if (second) return second.offsetLeft - first.offsetLeft;
    return first.offsetWidth + 16;
  }

  function getCardsPerView() {
    const step = getStep();
    return Math.max(1, Math.round(slider.clientWidth / step));
  }

  function getPageCount() {
    return Math.max(1, Math.ceil(cards.length / getCardsPerView()));
  }

  function getCurrentPage() {
    const step = getStep();
    const cpv  = getCardsPerView();
    return Math.round(slider.scrollLeft / (step * cpv));
  }

  function scrollToPage(page) {
    const step = getStep();
    const cpv  = getCardsPerView();
    const max  = getPageCount() - 1;
    const target = Math.max(0, Math.min(max, page));
    slider.scrollTo({ left: step * cpv * target, behavior: "smooth" });
  }

  function renderDots() {
    const total = getPageCount();
    dotsWrap.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.className = "pain-dot";
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Page ${i + 1} of ${total}`);
      dot.addEventListener("click", () => scrollToPage(i));
      dotsWrap.appendChild(dot);
    }
    updateActive();
  }

  function updateActive() {
    const dots = dotsWrap.querySelectorAll(".pain-dot");
    const cur  = getCurrentPage();
    dots.forEach((d, i) => d.classList.toggle("active", i === cur));
    if (prev) prev.toggleAttribute("disabled", cur <= 0);
    if (next) next.toggleAttribute("disabled", cur >= getPageCount() - 1);
  }

  prev?.addEventListener("click", () => scrollToPage(getCurrentPage() - 1));
  next?.addEventListener("click", () => scrollToPage(getCurrentPage() + 1));

  let scrollTimer;
  slider.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateActive, 90);
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderDots, 150);
  });

  renderDots();
})();
