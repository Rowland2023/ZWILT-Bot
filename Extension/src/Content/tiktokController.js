chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.command) {
    case "like":
      document.querySelector("button[data-e2e='like-button']")?.click();
      sendResponse({ status: "liked" });
      break;

    case "follow":
      document.querySelector("button[data-e2e='follow-button']")?.click();
      sendResponse({ status: "followed" });
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

    case "viewVideo":
      document.querySelector("video")?.play();
      sendResponse({ status: "viewed" });
      break;
  }
});
