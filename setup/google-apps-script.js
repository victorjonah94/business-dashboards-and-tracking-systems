/**
 * GOOGLE APPS SCRIPT — Form → Google Sheets + Email Alerts
 * ──────────────────────────────────────────────────────────
 * SETUP INSTRUCTIONS (one-time, ~5 minutes):
 *
 * 1. Open Google Sheets:  https://sheets.google.com
 *    Create a new spreadsheet called "Business Consultations"
 *    Copy the spreadsheet ID from the URL:
 *      https://docs.google.com/spreadsheets/d/<<<COPY THIS PART>>>/edit
 *    Paste it into SPREADSHEET_ID below.
 *
 * 2. Open Google Apps Script:  https://script.google.com
 *    Click "New project"
 *    Delete any existing code, then paste ALL of this file into the editor.
 *    Update SPREADSHEET_ID and NOTIFY_EMAIL below.
 *
 * 3. Save the project (Ctrl+S), name it "Business Consultations Handler"
 *
 * 4. Deploy as Web App:
 *    Click Deploy → New deployment
 *    Type: Web app
 *    Execute as: Me
 *    Who has access: Anyone
 *    Click Deploy → Authorise access (sign in with your Google account)
 *    Copy the Web App URL shown.
 *
 * 5. Paste the Web App URL into script.js:
 *    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
 *
 * Done! Every form submission will:
 *   ✅ Append a row to your Google Sheet
 *   ✅ Send an email alert to victorjonah94@gmail.com
 */

// ── Configuration ────────────────────────────────────────────────────────────
var SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
var SHEET_NAME     = "Bookings";            // Tab name in your spreadsheet
var NOTIFY_EMAIL   = "victorjonah94@gmail.com";
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var params = e.parameter;

    var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Write header row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email",
        "Phone (WhatsApp)",
        "Business Category",
        "Monthly Revenue Band",
        "Main Tracking Challenge",
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    );

    sheet.appendRow([
      timestamp,
      params.name        || "",
      params.email       || "",
      params.phone       || "",
      params.businessType || "",
      params.revenueBand  || "",
      params.challenge    || "",
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 7);

    // Send email notification
    var subject = "🔔 New Consultation Application – " + (params.name || "Unknown");
    var body =
      "A new consultation application has been submitted.\n\n" +
      "────────────────────────\n" +
      "Name:     " + (params.name        || "—") + "\n" +
      "Email:    " + (params.email       || "—") + "\n" +
      "Phone:    " + (params.phone       || "—") + "\n" +
      "Business: " + (params.businessType || "—") + "\n" +
      "Revenue:  " + (params.revenueBand  || "—") + "\n\n" +
      "Challenge / Message:\n" + (params.challenge || "—") + "\n\n" +
      "────────────────────────\n" +
      "Submitted: " + timestamp + "\n" +
      "View spreadsheet: https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID;

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

// Quick test — run this manually inside Apps Script to verify everything works
function testPost() {
  var fakeEvent = {
    parameter: {
      name:         "Test User",
      email:        "test@example.com",
      phone:        "+234 800 000 0000",
      businessType: "Finance / Investment",
      revenueBand:  "₦1m - ₦5m",
      challenge:    "This is a test submission from the Apps Script editor.",
    },
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
