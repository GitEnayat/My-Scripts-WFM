/*
MODULE: TemplateService
--------------------------------
Loads templates from Google Docs and parses:
- Subject / Body / To / CC
- Dictionary engine
- Date engine
- HTML conversion
- Table injection
--------------------------------
*/


// ==========================================
// MAIN PUBLIC FUNCTION
// ==========================================
function fetchTemplate(tabName, documentId) {

  if (!documentId) {
    Logger.log("No document ID provided.");
    return null;
  }

  const doc = DocumentApp.openById(documentId);
  const tabs = doc.getTabs();

  const targetTab = findTabRecursive_(tabs, tabName);

  if (!targetTab) {
    Logger.log("Template tab not found: " + tabName);
    return null;
  }

  const bodyElement = targetTab.asDocumentTab().getBody();
  const numChildren = bodyElement.getNumChildren();

  let result = { subject: "", body: "", to: "", cc: "" };
  let mode = "none";

  for (let i = 0; i < numChildren; i++) {

    const child = bodyElement.getChild(i);
    const text = child.getText().trim();

    if (text === "[SUBJECT]") { mode = "subject"; continue; }
    if (text === "[BODY]") { mode = "body"; continue; }
    if (text === "[TO]") { mode = "to"; continue; }
    if (text === "[CC]") { mode = "cc"; continue; }

    if (mode === "subject" && text !== "") { result.subject = text; mode = "none"; }
    else if (mode === "to" && text !== "") result.to += text + ",";
    else if (mode === "cc" && text !== "") result.cc += text + ",";
    else if (mode === "body") result.body += convertElementToHtml_(child);

  }

  const processedSubject = applyDictionary_(result.subject);
  let processedBody = applyDictionary_(result.body);

  processedBody = processTables(processedBody);

  return {
    subject: processedSubject,
    body: processedBody,
    to: result.to,
    cc: result.cc
  };

}

function parseRecipientKeys(rawString) {
  if (!rawString) return [];
  return rawString.split(",").map(x => x.trim()).filter(x => x !== "");
}


function applyDictionary_(text) {

  if (!text) return "";

  const healedText = text.replace(/\{\{(.*?)\}\}/g, (match, inner) => {
    const cleanInner = inner
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return "{{" + cleanInner + "}}";
  });

  return healedText.replace(/\{\{(.*?)\}\}/g, function (match, content) {

    try {

      const parts = content.split(":").map(p => p.trim());
      const command = parts[0].toUpperCase();
      const param1 = parts[1] || "Today";
      const param2 = parts[2] || "Today";

      switch (command) {

        case "DATE": return formatDate_(parseDateToken_(param1));
        case "RANGE": return formatDate_(parseDateToken_(param1)) + " - " + formatDate_(parseDateToken_(param2));

        case "TIME":
          if (param1 === "BKK") return getRoundedTime_("Asia/Bangkok", "ICT");
          return getRoundedTime_("Asia/Kuala_Lumpur", "MYT");

        case "MONTHNAME":
          let d = new Date();
          if (!isNaN(Number(param1))) {
            d.setDate(1);
            d.setMonth(d.getMonth() + parseInt(param1, 10));
          } else {
            d = parseDateToken_(param1);
          }
          return Utilities.formatDate(d, Session.getScriptTimeZone(), "MMMM yyyy");

        case "RAMCO":
          return getRamcoCycle_(param1 === "PREVIOUS" ? -1 : 0);

        case "DATE_FORMAT":
          const dateObj = parseDateToken_(param1);
          const formatStr = parts[2] || "dd-MMM-yyyy";
          return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), formatStr.trim());

        case "ACTIVE_SPREADSHEET_LINK":
          return SpreadsheetApp.getActiveSpreadsheet().getUrl();

        default: return match;

      }

    } catch (e) {
      return "ERROR";
    }

  });

}

function parseDateToken_(token) {

  let now = new Date();
  const text = token.toLowerCase().replace(/\s+/g, "");

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  let dayIndex = -1;
  let mode = "dynamic";

  for (let i = 0; i < days.length; i++) {
    if (text.includes(days[i])) { dayIndex = i; break; }
  }

  if (dayIndex === -1) {
    if (text.includes("yesterday")) now.setDate(now.getDate() - 1);
    else if (text.includes("tomorrow")) now.setDate(now.getDate() + 1);
  }

  return now;

}

function formatDate_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "dd-MMM-yyyy");
}

function convertElementToHtml_(element) {

  if (element.getType() === DocumentApp.ElementType.PARAGRAPH) {
    let text = element.getText();
    if (text === "") return "<br>";
    return "<p style='margin:0;padding:0;'>" + getFormattedText_(element) + "</p>";
  }

  if (element.getType() === DocumentApp.ElementType.LIST_ITEM) {
    return "<li>" + getFormattedText_(element) + "</li>";
  }

  if (element.getType() === DocumentApp.ElementType.HORIZONTAL_RULE) {
    return "<hr style='border:0;border-top:1px solid #ccc;margin:15px 0;'>";
  }

  if (element.getType() === DocumentApp.ElementType.TABLE) {
    return processTableHTML_(element);
  }

  return "";

}


function findTabRecursive_(tabsList, targetName) {
  for (const tab of tabsList) {
    if (tab.getTitle() === targetName) return tab;
    const childTabs = tab.getChildTabs();
    if (childTabs.length > 0) {
      const found = findTabRecursive_(childTabs, targetName);
      if (found) return found;
    }
  }
  return null;
}
