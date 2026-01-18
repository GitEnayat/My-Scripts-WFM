# Google Workspace Email Automation Framework

A production-ready email templating and drafting framework built on  
**Google Docs, Google Sheets, and Gmail** using **Google Apps Script**.

This project is designed as an **internal platform**, not a one-off script.  
It enables teams to author, manage, and send complex emails safely and consistently — without touching code.

---

## 🚀 Why This Project Exists

Manual email workflows inside organizations are:
- Error-prone (wrong dates, wrong recipients)
- Time-consuming
- Hard to standardize
- Difficult to safely re-run

This framework solves those problems by introducing:
- Doc-based templates
- Dynamic data injection
- Spreadsheet-powered tables
- Role-based distribution lists
- Safe Gmail draft recycling

---

## ✨ Key Features

### 📄 Doc-Based Email Templates
- Email templates are authored in **Google Docs**
- Each template lives in its own **Doc tab**
- Supports:
  - Subject
  - Body
  - TO / CC sections

---

### 🧠 Dynamic Dictionary Engine
Templates support inline commands such as:
- `{{DATE:Today}}`
- `{{RANGE:MonthStart-1:Today-1}}`
- `{{TIME}}`
- `{{MONTHNAME:-1}}`
- `{{GREETING}}`
- Custom business logic (e.g., payroll cycles)

All logic is centrally managed and safely executed.

---

### 📊 Spreadsheet → HTML Table Rendering
- Inline `[Table]` directives inside Docs
- Renders live Google Sheets ranges into HTML tables
- Preserves:
  - Cell formatting
  - Colors
  - Fonts
  - Alignment
  - Merged cells
- Automatically trims empty rows
- Fully Gmail-compatible HTML output

---

### 👥 Role-Based Distribution Lists
- Recipients resolved dynamically from Google Sheets
- Supports:
  - Role-based tags
  - Workflow-based tags
  - Direct email overrides
- Results are cached per execution for performance

---

### ✍️ Gmail Signature Engine
- User-specific signatures generated automatically
- Signature template authored in Google Docs
- Embedded logo via **Base64** (no broken images)
- Cached for performance and reliability

---

### 🛡️ Safe Gmail Draft Recycling
- Prevents duplicate drafts
- Re-running the same report updates the existing draft
- Automatically detects:
  - Existing drafts
  - Existing threads
  - Out-of-office replies (skipped safely)

---

## 🧱 Architecture Overview

