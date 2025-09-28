export default class InstagramBot {
  run(message, sender, sendResponse) {
    const tabId = sender?.tab?.id;
    if (!tabId) {
      sendResponse({ status: "FAILED", reason: "No active tab" });
      return;
    }

    const controllerPath = "src/content/instagramController.js";

    chrome.scripting.executeScript({
      target: { tabId },
      files: [controllerPath]
    }, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ status: "FAILED", reason: "Injection failed" });
        return;
      }

      chrome.tabs.sendMessage(tabId, message, sendResponse);
    });
  }
}
