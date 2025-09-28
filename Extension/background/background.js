// IMPORTANT: This file MUST NOT import BaseController, ViewClass, or any code that touches the DOM

chrome.runtime.onInstalled.addListener(() => {
  console.log('ZWILT Bot Background Service Worker Initialized.');
});

const botState = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const tabId = sender?.tab?.id || null;

  // Handle popup task tracking
  if (request.type === "START_TASK") {
    const taskName = request.taskName || "UnknownBot";
    console.log(`START_TASK received: ${taskName} on tab ${tabId}`);
    if (tabId) {
      botState.set(tabId, taskName);
      sendResponse({ status: `${taskName} started` });
    } else {
      sendResponse({ status: "Failed: No active tab" });
    }
    return true;
  }

  if (request.type === "STOP_ALL") {
    botState.clear();
    sendResponse({ status: "All bots stopped" });
    return true;
  }

  // Utility actions
  if (request.action === "fetchUserEmail") {
    sendResponse({ email: "mockuser@zwilt.com" });
    return true;
  }

  if (request.action === "reportProgress") {
    console.log(`Progress from tab ${tabId}: ${request.progress}`);
    sendResponse({ status: "Progress received" });
    return true;
  }

  // ✅ NEW: Handle bot execution
  if (request.command && request.bot) {
    console.log(`ZWILT Bot: Routing ${request.command} to ${request.bot} on tab ${tabId}`);

    if (!tabId) {
      sendResponse({ status: "FAILED", reason: "No active tab" });
      return true;
    }

    const controllerPath = `src/content/${request.bot.replace("Bot", "").toLowerCase()}Controller.js`;

    chrome.scripting.executeScript({
      target: { tabId },
      files: [controllerPath]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Injection failed:", chrome.runtime.lastError.message);
        sendResponse({ status: "FAILED", reason: "Injection failed" });
        return;
      }

      chrome.tabs.sendMessage(tabId, request, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Messaging failed:", chrome.runtime.lastError.message);
          sendResponse({ status: "FAILED", reason: "Messaging failed" });
          return;
        }

        sendResponse(response);
      });
    });

    return true;
  }

  // Fallback
  console.warn("Unhandled message received:", request);
  sendResponse({ status: "Unhandled request" });
  return true;
});
