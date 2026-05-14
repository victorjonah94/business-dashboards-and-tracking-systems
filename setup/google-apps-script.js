/**
 * GOOGLE APPS SCRIPT — Form → Email Alert + Google Sheets Log
 * ─────────────────────────────────────────────────────────────
 * SETUP INSTRUCTIONS (one-time, ~5 minutes):
 *
 * 1. Open Google Apps Script:  https://script.google.com
 *    Click "New project", name it "Business Consultations Handler"
 *    Delete any existing code, paste ALL of this file into the editor.
 *
 * 2. Save the project (Ctrl+S).
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
 *    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydCCxbJGVPBE9GENuiwyrYqUTHyRXn-GMqqNN3iLu_FF3277AGsB9cfriZpptZYrhT/exec";
 *
 * 5. (Optional) For Book a Meeting:
 *    Go to calendar.google.com → Settings → Appointment schedules → Create
 *    Copy the booking link and paste it into index.html:
 *    id="bookMeetingBtn" href="YOUR_CALENDAR_LINK"
 *
 * Done! Every form submission will:
 *   ✅ Send an email alert to victorjonah94@gmail.com with all form details
 *   ✅ Log each submission as a new row in a Google Sheet named
 *      "Business Consultation Applications" (created automatically)
 *
 * GOOGLE FORMS ALTERNATIVE (even simpler):
 *   Create a Google Form at forms.google.com with the same fields.
 *   Google Forms auto-creates a linked Google Sheet.
 *   Then update GOOGLE_FORM_URL below and call submitToGoogleForm() from doPost().
 */

// ── Configuration ─────────────────────────────────────────────────────────────
var NOTIFY_EMAIL   = "victorjonah94@gmail.com";
var SHEET_NAME     = "Business Consultation Applications";
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var params = e.parameter;

    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    );

    // ── 1. Send email notification ───────────────────────────────────────────
    var subject = "🔔 New Consultation Request – " + (params.name || "Unknown");
    var body =
      "A new consultation request has been submitted.\n\n" +
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

    // ── 2. Log to Google Sheet ───────────────────────────────────────────────
    var ss = getOrCreateSheet();
    ss.appendRow([
      timestamp,
      params.name         || "",
      params.email        || "",
      params.phone        || "",
      params.businessName || "",
      params.role         || "",
      params.businessType || "",
      params.location     || "",
      params.revenueBand  || "",
      params.challenge    || "",
    ]);

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

// Creates the spreadsheet + header row if it doesn't exist yet
function getOrCreateSheet() {
  var files = DriveApp.getFilesByName(SHEET_NAME);
  var spreadsheet;

  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(SHEET_NAME);
    var sheet = spreadsheet.getActiveSheet();
    sheet.setName("Submissions");
    sheet.appendRow([
      "Timestamp", "Name", "Email", "Phone",
      "Business Name", "Role", "Business Type",
      "Location", "Revenue Band", "Challenge / Message",
    ]);
    // Freeze header row and bold it
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold");
  }

  return spreadsheet.getSheets()[0];
}

// Quick test — run this manually inside Apps Script to verify email + sheet
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
