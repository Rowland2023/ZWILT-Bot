chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.command) {
    case "connect":
      document.querySelector("button[aria-label='Connect']")?.click();
      sendResponse({ status: "connected" });
      break;

    case "like":
      document.querySelector("button[aria-label='Like']")?.click();
      sendResponse({ status: "liked" });
      break;

    case "comment":
      const commentBox = document.querySelector("textarea");
      if (commentBox) {
        commentBox.value = message.text;
        commentBox.dispatchEvent(new Event("input", { bubbles: true }));
        document.querySelector("button[type='submit']")?.click();
        sendResponse({ status: "commented" });
      } else {
        sendResponse({ status: "failed" });
      }
      break;
  }
});
