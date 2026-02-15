/*
MODULE: LinkRepository
---------------------------------------------------
Loads managed links from spreadsheet and injects
$LINK tags into template HTML.
---------------------------------------------------
*/

function loadLinkRepository(config) {

  const sheetId = config.linkRepositorySheetId;
  const tabName = config.linkRepositoryTabName;
  const keyColumn = config.linkKeyColumn;
  const urlColumn = config.linkUrlColumn;

  try {

    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(tabName);
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return {};

    const headers = data.shift();
    const keyIndex = headers.indexOf(keyColumn);
    const urlIndex = headers.indexOf(urlColumn);

    const map = {};
    data.forEach(row => {
      const key = String(row[keyIndex]).trim();
      const url = String(row[urlIndex]).trim();
      if (key && url) map[key] = url;
    });

    return map;

  } catch (e) {
    Logger.log("Link repository error: " + e.message);
    return {};
  }
}


function injectManagedLinks(html, linkMap) {

  if (!html) return "";

  const regex = /\$LINK:(.*?),\s*TEXT:(.*?)\$/g;

  return html.replace(regex, function(match, rawKey, rawLabel) {

    const key = rawKey.trim();
    const label = rawLabel.trim();

    let url = linkMap[key];

    // allow direct URL fallback
    if (!url && key.match(/^https?:\/\//i)) {
      url = key;
    }

    if (!url) {
      return `<span style="background:#ffcccc;color:#cc0000;padding:2px 5px;border-radius:3px;">[Missing link: ${key}]</span>`;
    }

    return `<a href="${url}" style="color:#1155cc;text-decoration:underline;">${label}</a>`;
  });

}
