chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.command) {
    case "swipeRight":
      document.querySelector("button[aria-label='Like']")?.click();
      sendResponse({ status: "swiped right" });
      break;

    case "superLike":
      document.querySelector("button[aria-label='Super Like']")?.click();
      sendResponse({ status: "super liked" });
      break;
  }
});
