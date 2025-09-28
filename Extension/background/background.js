// IMPORTANT: This file MUST NOT import BaseController, ViewClass, or any code that touches the DOM (document or window).

/**
 * Service Worker Initialization
 * Set up listeners for installation and one-time setup.
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log('ZWILT Bot Background Service Worker Initialized.');
  // You can initialize storage, bot state, or analytics here.
});

/**
 * Bot state tracker (optional)
 * Maps tabId → botName for tracking active bots.
 */
const botState = new Map();

/**
 * Listener for communication from Popup and Content Scripts.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const tabId = sender?.tab?.id || null;

  // Handle popup commands
  if (request.type === "START_TASK") {
    const taskName = request.taskName || "UnknownBot";
    console.log(`START_TASK received: ${taskName} on tab ${tabId}`);

    if (tabId) {
      botState.set(tabId, taskName);
      sendResponse({ status: `${taskName} started` });
    } else {
      console.warn("No tab ID found for START_TASK");
      sendResponse({ status: "Failed: No active tab" });
    }

    return true;
  }

  if (request.type === "STOP_ALL") {
    console.log("STOP_ALL received: Clearing all bot states");
    botState.clear();
    sendResponse({ status: "All bots stopped" });
    return true;
  }

  // Handle controller requests
  if (request.action === "fetchUserEmail") {
    const userEmail = "mockuser@zwilt.com"; // Replace with chrome.storage logic if needed
    console.log("fetchUserEmail request received");
    sendResponse({ email: userEmail });
    return true;
  }

  if (request.action === "startBot") {
    console.log(`startBot received from ${sender.url}`);
    if (tabId) botState.set(tabId, "unknownBot");
    sendResponse({ status: "Bot acknowledged" });
    return true;
  }

  if (request.action === "reportProgress") {
    console.log(`reportProgress received from tab ${tabId}: ${request.progress}`);
    sendResponse({ status: "Progress received" });
    return true;
  }

  // Fallback for unhandled messages
  console.warn("Unhandled message received:", request);
  sendResponse({ status: "Unhandled request" });
  return true;
});
