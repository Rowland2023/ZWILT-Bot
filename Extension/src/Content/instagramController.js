chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.command) {
    case "follow":
      document.querySelector("button:contains('Follow')")?.click();
      sendResponse({ status: "followed" });
      break;

    case "like":
      document.querySelector("svg[aria-label='Like']")?.parentElement?.click();
      sendResponse({ status: "liked" });
      break;

    case "comment":
      const input = document.querySelector("textarea");
      if (input) {
        input.value = message.text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        document.querySelector("button[type='submit']")?.click();
        sendResponse({ status: "commented" });
      } else {
        sendResponse({ status: "failed" });
      }
      break;

    case "unlike":
      document.querySelector("svg[aria-label='Unlike']")?.parentElement?.click();
      sendResponse({ status: "unliked" });
      break;

    case "viewStory":
      document.querySelector("div[role='button']")?.click();
      sendResponse({ status: "viewed" });
      break;
  }
});
