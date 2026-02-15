/*
MODULE: MailOrchestrator
---------------------------------------------------
Main workflow engine that generates Gmail drafts
using all framework modules.
---------------------------------------------------
*/

function generateEmailDraft(templateName, overrides = {}) {

  // 1. INIT CONFIG
  const config = new AppConfig(overrides);

  Logger.log(`Starting email generation for template: ${templateName}`);
  Logger.log(`Template source: ${config.templateDocumentId}`);

  // 2. FETCH TEMPLATE
  const template = fetchTemplate(templateName, config.templateDocumentId);
  if (!template) {
    Logger.log("Template fetch returned null. Stopping.");
    return;
  }

  // 3. LOAD LINK REPOSITORY
  const linkMap = loadLinkRepository(config);
  const processedBody = injectManagedLinks(template.body, linkMap);

  // 4. RESOLVE RECIPIENTS
  const toKeys = parseRecipientKeys(template.to);
  const ccKeys = parseRecipientKeys(template.cc);

  const recipientsTo = toKeys.length > 0
    ? resolveRecipients(config, ...toKeys).join(",")
    : "";

  const recipientsCc = ccKeys.length > 0
    ? resolveRecipients(config, ...ccKeys).join(",")
    : "";

  // 5. GENERATE SIGNATURE
  const signatureHtml = generateUserSignature(config);
  const finalHtmlBody = processedBody + "<br><br>" + signatureHtml;

  // =====================================================
  // SMART DRAFT RECYCLING
  // =====================================================

  try {
    const existingDrafts = GmailApp.getDrafts();

    for (const draft of existingDrafts) {
      const draftSubject = draft.getMessage().getSubject();

      if (draftSubject.indexOf(template.subject) !== -1) {
        Logger.log("Existing draft found. Updating.");
        draft.update(recipientsTo, template.subject, "", {
          htmlBody: finalHtmlBody,
          cc: recipientsCc
        });
        Logger.log("Draft updated successfully.");
        return;
      }
    }

  } catch (e) {
    Logger.log("Draft recycle warning: " + e.message);
  }

  // =====================================================
  // THREAD SEARCH
  // =====================================================

  const threads = GmailApp.search(`subject:"${template.subject}"`, 0, 5);
  let targetThread = null;

  for (const thread of threads) {
    const subject = thread.getFirstMessageSubject();

    if (subject.match(/^(Automatic reply|OOO|Out of Office|Absence Notice):/i))
      continue;

    targetThread = thread;
    break;
  }

  // =====================================================
  // CREATE DRAFT
  // =====================================================

  if (targetThread) {
    targetThread.createDraftReplyAll("", {
      htmlBody: finalHtmlBody,
      cc: recipientsCc
    });
    Logger.log("Draft created as reply to existing thread.");
  } else {
    GmailApp.createDraft(recipientsTo, template.subject, "", {
      cc: recipientsCc,
      htmlBody: finalHtmlBody
    });
    Logger.log("Draft created as new email.");
  }

}
