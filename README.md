# 📧 Universal Email Automation Engine

[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-Compatible-green)](https://developers.google.com/apps-script)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Production](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com/anomalyco/opencode)
[![Code Style: JSDoc](https://img.shields.io/badge/Code%20Style-JSDoc-blue)](https://jsdoc.app/)

> **A robust, config-driven framework that bridges the gap between raw data and professional communication.**
> *Automates 15+ daily operational reports, saving 10+ hours/week of manual toil.*

---

## ⚡ Quick Start (The "TL;DR")

- **What:** A library that turns Google Doc templates + Google Sheet data into high-fidelity Gmail drafts.
- **Why:** Solves the "Copy-Paste" problem in Operations, WFM, and Finance.
- **Key Features:**
    - 🔒 **Safe:** Dry-Run mode, Test Mode, and Draft Recycling (Idempotency).
    - 📊 **Observable:** Structured logging to "Run History" sheets.
    - 🧩 **Modular:** Separated logic (Engine) from content (Docs) and config (Sheets).

### 🎬 Visual Demo
> *[Insert 30s GIF here: Showing a Template in Docs -> script execution -> resulting Gmail Draft]*

---

## 🛠️ Engineering Highlights (For Hiring Managers)

This is not just a script; it's a **system** designed for reliability and scale.

### 1. Safety & Reliability First
- **Dry Run Mode:** `generateEmailDraft("Report", { dryRun: true })` simulates execution without touching Gmail.
- **Idempotency:** The engine checks for existing drafts before creating new ones. If a draft exists, it **updates** it. This prevents "draft spam" if the script runs multiple times.
- **Test Mode:** `userOverrides: { testMode: true }` forces all emails to go to the developer, regardless of the template's distribution list.

### 2. Observability & Logging
- **Run History:** Every execution (success or failure) is logged to a `System_Logs` sheet with:
    - Timestamp & User
    - Duration (ms)
    - Status (CREATED, UPDATED, ERROR)
    - Mode (PROD, TEST, DRY_RUN)
- **Structured Logs:** Codebase uses a `LoggerUtil` for consistent log levels (INFO, WARN, ERROR).

### 3. "Fail Fast" Validation
- **Template Validator:** Pre-flight checks ensure templates exist and tags are valid *before* fetching data, saving API quotas and reducing partial failures.

### 4. Architecture
*(See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed Mermaid diagrams and Decision Records)*

The system follows a strict **Pipeline Pattern**:
`Config Load` -> `Template Parse (Doc)` -> `Dictionary Resolution` -> `Recipient Resolution` -> `Draft Orchestration`.

---

## 📖 For Operations Teams (The "User" View)

### The Problem It Solves
In high-volume environments like **Workforce Management (WFM)**, managers spend hours manually assembling reports. This engine eliminates that toil.

1.  **Write in Docs:** Create templates in Google Docs using simple tags like `{{GREETING}}` or `[Table]`.
2.  **Manage in Sheets:** Update recipient lists in a central Google Sheet.
3.  **Run:** The engine combines them into pixel-perfect emails.

### Dynamic Dictionary Features
- **Time/Date:** `{{DATE:Today}}`, `{{DATE:Today-1}}` (Yesterday), `{{GREETING}}` (Morning/Afternoon).
- **Data Injection:** `[Table] Sheet: <ID>, range: 'Tab'!A1:D10` renders live spreadsheet ranges as HTML tables.
- **Link Management:** `$LINK:Key, TEXT:Label$` injects centralized URLs (useful for updating dashboard links without editing templates).

---

## 🚀 Usage & Deployment

### 1. Installation
Deploy this script as a **Library** in your Google Apps Script environment.

### 2. Basic Usage
```javascript
function sendMorningReport() {
  EmailEngine.generateEmailDraft("Morning_Status_Update");
}
```

### 3. Advanced Usage (developer options)
```javascript
function testReport() {
  EmailEngine.generateEmailDraft("Morning_Status_Update", {
    dryRun: true,      // Log what WOULD happen
    testMode: true,    // Send only to me
    templateDocId: "..." // Override default doc
  });
}
```

### 4. Scheduling
Use the built-in helper to schedule reports programmatically:
```javascript
function setupTriggers() {
  // Run at 8:00 AM daily
  Scheduler.scheduleDailyReport("Morning_Status_Update", 8);
}
```

---

## 👤 Author

**Enayatullh**
*Operations Engineer & System Designer*

> "I build tools that turn data into action. This project reflects my philosophy of **Systems Thinking**: building frameworks that solve entire categories of problems, not just one-off tasks."

- **Role Focus:** Automation Engineering, Internal Tools, WFM Systems.
- **Tech Stack:** JavaScript (ES6+), Google Workspace APIs, regex, HTML/CSS.

---
_© 2026 Universal Email Automation Engine. released under MIT License._
