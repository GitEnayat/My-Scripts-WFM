# 📧 Universal Email Automation Engine

A high-performance, modular Google Apps Script library designed to transform Google Docs tabs into dynamic, data-driven Gmail drafts. This system allows teams to manage professional email templates, recipient lists, and table data without touching a single line of code.



---

## ✨ Core Features

* **Doc-to-Draft Engine:** Uses individual Google Doc tabs as email templates, allowing for easy multi-report management.
* **Dynamic Dictionary:** Supports live placeholders like `{{DATE:Today}}`, `{{RAMCO}}`, and `{{GREETING}}` that resolve at the moment of creation.
* **Table Injection:** Renders live, formatted Google Sheet ranges (including support for Smart Chips) directly into the email body.
* **Safe Draft Recycling:** Identifies existing drafts with the same subject and updates them instead of creating duplicates—keeping your Drafts folder clean.
* **Identity Management:** Generates professional, Base64-encoded signatures based on user profiles fetched from a central database.
* **Formatting Preservation:** Maintains bolding, colors, and links from the source Google Doc.

---

## 📂 Project Architecture

The system is split into five functional modules to ensure long-term maintainability:

| File | Responsibility |
| :--- | :--- |
| **`Config.gs`** | Centralized IDs for the Template Doc, Data Spreadsheet, and Branding assets. |
| **`TemplateEngine.gs`** | The core parser. Handles recursive tab searching and HTML conversion. |
| **`TableRenderer.gs`** | Fetches Sheet data and generates CSS-styled HTML tables (including merged cells). |
| **`RecipientResolver.gs`** | Resolves distribution tags into email lists and fetches sender signatures. |
| **`DraftOrchestrator.gs`** | Orchestrates the final logic: thread searching, recycling, and draft creation. |

---

## 🚀 Setup & Deployment

### 1. Configure Global Variables
Create a file named `Config.gs` and update it with your specific Google Drive IDs. This centralizes your "Source of Truth."

```javascript
/**
 * PROJECT CONFIGURATION
 */
const TEMPLATE_DOC_ID = "YOUR_GOOGLE_DOC_ID";
const DATA_SOURCE_ID = "YOUR_SPREADSHEET_ID";
const BRAND_LOGO_ID = "YOUR_DRIVE_IMAGE_ID";

// Default Localization
const DEFAULT_TIMEZONE = "Asia/Kuala_Lumpur";
const DEFAULT_TZ_LABEL = "MYT";
const SIGNATURE_TAB_NAME = "Email_Signature";
const USER_PROFILES_TAB = "User_Data";
const CONTACT_GROUPS_TAB = "Distribution_Lists";

### 2. Implementation: The Main Trigger

To generate a draft, create a standalone script file (e.g., `Main.gs`) and call the orchestrator function. This is the primary entry point you will use to execute your automation.

```javascript
/**
 * Example trigger function to generate a specific report.
 * @param {string} "Morning_Status" - Must match the exact Tab Name in your Google Doc.
 */
function runMorningReport() {
  createReportDraft("Morning_Status");
}

/**
 * Example of overriding the default document for a one-off report.
 */
function runSpecialReport() {
  createReportDraft("Special_Template", {
    docId: "OPTIONAL_OVERRIDE_DOC_ID"
  });
}




