/**
 * GOOGLE APPS SCRIPT — Form → Email Alerts
 * ─────────────────────────────────────────
 * SETUP INSTRUCTIONS (one-time, ~3 minutes):
 *
 * 1. Open Google Apps Script:  https://script.google.com
 *    Click "New project"
 *    Delete any existing code, then paste ALL of this file into the editor.
 *    Update NOTIFY_EMAIL below if needed.
 *
 * 2. Save the project (Ctrl+S), name it "Business Consultations Handler"
 *
 * 3. Deploy as Web App:
 *    Click Deploy → New deployment
 *    Type: Web app
 *    Execute as: Me
 *    Who has access: Anyone
 *    Click Deploy → Authorise access (sign in with your Google account)
 *    Copy the Web App URL shown.
 *
 * 4. Paste the Web App URL into script.js:
 *    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
 *
 * Done! Every form submission will:
 *   ✅ Send an email alert to your inbox with all form details
 */

// ── Configuration ────────────────────────────────────────────────────────────
var NOTIFY_EMAIL = "victorjonah94@gmail.com";
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var params = e.parameter;

    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    );

    var subject = "🔔 New Consultation Application – " + (params.name || "Unknown");
    var body =
      "A new consultation application has been submitted.\n\n" +
      "────────────────────────\n" +
      "Name:          " + (params.name         || "—") + "\n" +
      "Email:         " + (params.email        || "—") + "\n" +
      "Phone:         " + (params.phone        || "—") + "\n" +
      "Business Name: " + (params.businessName || "—") + "\n" +
      "Role:          " + (params.role         || "—") + "\n" +
      "Business Type: " + (params.businessType || "—") + "\n" +
      "Location:      " + (params.location     || "—") + "\n" +
      "Revenue Band:  " + (params.revenueBand  || "—") + "\n\n" +
      "Challenge / Message:\n" + (params.challenge || "—") + "\n\n" +
      "────────────────────────\n" +
      "Submitted: " + timestamp;

    MailApp.sendEmail({
      to:      NOTIFY_EMAIL,
      subject: subject,
      body:    body,
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log(err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Quick test — run this manually inside Apps Script to verify email delivery
function testPost() {
  var fakeEvent = {
    parameter: {
      name:         "Test User",
      email:        "test@example.com",
      phone:        "+234 800 000 0000",
      businessName: "Apex Trading Ltd",
      role:         "CEO",
      businessType: "Finance / Investment",
      location:     "Lagos",
      revenueBand:  "5M – 20M",
      challenge:    "This is a test submission from the Apps Script editor.",
    },
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
