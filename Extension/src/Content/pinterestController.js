chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.command) {
    case "followBoard":
      document.querySelector("button[data-test-id='board-follow-button']")?.click();
      sendResponse({ status: "followed" });
      break;

    case "savePin":
      document.querySelector("button[data-test-id='pin-save-button']")?.click();
      sendResponse({ status: "saved" });
      break;

    case "like":
      document.querySelector("button[data-test-id='pin-like-button']")?.click();
      sendResponse({ status: "liked" });
      break;
  }
});
