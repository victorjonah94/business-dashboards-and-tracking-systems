const leadForm = document.getElementById("leadForm");
const formResult = document.getElementById("formResult");
const revealItems = document.querySelectorAll(".reveal");
const businessTypeSelect = document.getElementById("businessType");
const otherCategoryWrap = document.getElementById("otherCategoryWrap");
const otherBusinessTypeInput = document.getElementById("otherBusinessType");

const leadWebhookUrl = window.LEAD_WEBHOOK_URL || "";

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

async function submitLeadToWebhook(payload) {
  const response = await fetch(leadWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed (${response.status})`);
  }
}

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(leadForm);
  const volume = data.get("revenueBand");

  if (volume === "low-volume") {
    formResult.textContent =
      "Thanks for applying. Your operation may be better suited for the template package built for smaller businesses. We can guide you to that option.";
    formResult.className = "form-result warning";
    return;
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    name: data.get("name") || "",
    phone: data.get("phone") || "",
    businessCategory: data.get("businessType") || "",
    otherBusinessType: data.get("otherBusinessType") || "",
    volumeBand: volume || "",
    challenge: data.get("challenge") || "",
    source: "Landing Page",
  };

  try {
    if (leadWebhookUrl) {
      await submitLeadToWebhook(payload);
      formResult.textContent =
        "Consultation request received. We will contact you on WhatsApp within 24 hours.";
      formResult.className = "form-result success";
      leadForm.reset();
      handleOtherCategory();
      return;
    }

    formResult.textContent =
      "Form is working, but Google Sheets is not connected yet. Add your Apps Script URL in index.html (window.LEAD_WEBHOOK_URL).";
    formResult.className = "form-result warning";
  } catch (error) {
    formResult.textContent =
      "Submission could not be saved right now. Please send your details via WhatsApp while we fix the connection.";
    formResult.className = "form-result warning";
  }
});

// If screenshot files are missing, show graceful fallback card state.
document.querySelectorAll(".work-visual img").forEach((img) => {
  img.addEventListener("error", () => {
    img.closest(".work-visual")?.classList.add("image-missing");
  });
});
