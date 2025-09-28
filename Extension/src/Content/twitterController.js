chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.command) {
    case "follow":
      document.querySelector("div[data-testid='follow']")?.click();
      sendResponse({ status: "followed" });
      break;

    case "like":
      document.querySelector("div[data-testid='like']")?.click();
      sendResponse({ status: "liked" });
      break;

    case "comment":
      const replyBox = document.querySelector("div[aria-label='Tweet text']");
      if (replyBox) {
        replyBox.textContent = message.text;
        replyBox.dispatchEvent(new Event("input", { bubbles: true }));
        document.querySelector("div[data-testid='tweetButton']")?.click();
        sendResponse({ status: "commented" });
      } else {
        sendResponse({ status: "failed" });
      }
      break;
  }
});
