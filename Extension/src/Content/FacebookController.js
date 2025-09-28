chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("ZWILT Bot: Received command", message.command);

  switch (message.command) {
    case "follow":
      const followBtn = document.querySelector("button[aria-label='Follow']");
      if (followBtn) {
        followBtn.click();
        sendResponse({ status: "SUCCESS" });
      } else {
        sendResponse({ status: "FAILED", reason: "Follow button not found" });
      }
      break;

    case "like":
      const likeBtn = document.querySelector("div[aria-label='Like']");
      if (likeBtn) {
        likeBtn.click();
        sendResponse({ status: "SUCCESS" });
      } else {
        sendResponse({ status: "FAILED", reason: "Like button not found" });
      }
      break;

    case "comment":
      const input = document.querySelector("div[contenteditable='true']");
      const submitBtn = document.querySelector("button[type='submit']");
      if (input && submitBtn) {
        input.textContent = message.text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        submitBtn.click();
        sendResponse({ status: "SUCCESS" });
      } else {
        sendResponse({ status: "FAILED", reason: "Comment input or submit button missing" });
      }
      break;

    default:
      sendResponse({ status: "FAILED", reason: "Unknown command" });
  }

  return true; // ✅ Keeps the message port open for async response
});
