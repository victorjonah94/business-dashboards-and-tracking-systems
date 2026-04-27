const leadForm = document.getElementById("leadForm");
const formResult = document.getElementById("formResult");

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const budget = formData.get("budget");

  if (budget === "under-100k") {
    formResult.textContent =
      "Thanks. Based on your budget range, this service may not be the best fit yet. We can share a lighter starter option during a screening call.";
    formResult.className = "form-result warning";
    return;
  }

  formResult.textContent =
    "Great — your request has been received. Our team will contact you on WhatsApp within 24 hours to confirm your consultation slot.";
  formResult.className = "form-result success";

  leadForm.reset();
});
