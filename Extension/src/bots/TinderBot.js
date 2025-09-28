export default class TinderBot {
  run(message, sender, sendResponse) {
    const tabId = sender?.tab?.id;
    if (!tabId) {
      sendResponse({ status: "FAILED", reason: "No active tab" });
      return;
    }

    const controllerPath = "src/content/tinderController.js";

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
