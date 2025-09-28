export default class FacebookBot {
  run(message, sender, sendResponse) {
    const tabId = sender?.tab?.id;
    if (!tabId) {
      sendResponse({ status: "FAILED", reason: "No active tab" });
      return;
    }

    const controllerPath = "src/content/facebookController.js";

    chrome.scripting.executeScript({
      target: { tabId },
      files: [controllerPath]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("ZWILT Bot: Injection failed", chrome.runtime.lastError.message);
        sendResponse({ status: "FAILED", reason: "Injection failed" });
        return;
      }

      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          console.error("ZWILT Bot: Messaging failed", chrome.runtime.lastError.message);
          sendResponse({ status: "FAILED", reason: "Messaging failed" });
          return;
        }

        sendResponse(response);
      });
    });
  }
}
