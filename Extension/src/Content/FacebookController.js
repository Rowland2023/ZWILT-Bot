/**
 * ZWILT Bot: Facebook Controller
 * Handles automation tasks on Facebook pages.
 */

function sanitize(text) {
  // Removes HTML tags to prevent XSS issues when inserting content
  return String(text).replace(/<[^>]*>?/gm, '');
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("ZWILT Bot: Received command", message.command);
  console.log("ZWILT Bot: Message payload", message);

  try {
    switch (message.command) {
      case "follow":
        handleFollow(sendResponse);
        break;

      case "like":
        handleLike(sendResponse);
        break;

      case "comment":
        if (!message.text || typeof message.text !== "string" || !message.text.trim()) {
          console.warn("ZWILT Bot: Missing or invalid 'text' for comment command.");
          sendResponse({ status: "FAILED", reason: "Missing or invalid 'text' for comment command." });
        } else {
          // 1. Ensure content is loaded (scroll to reveal posts/comments)
          scrollToBottom(5); 
          // 2. Click the Comment buttons to open the input fields
          triggerCommentBox(); 
          // 3. Find input, type, and submit
          handleComment(message, sendResponse);
        }
        break;

      default:
        console.warn("ZWILT Bot: Unknown command", message.command);
        sendResponse({ status: "FAILED", reason: "Unknown command" });
    }
  } catch (err) {
    console.error("ZWILT Bot: Error executing command", err);
    sendResponse({ status: "FAILED", reason: err.message });
  }

  return true;
});

function handleFollow(sendResponse) {
  const followBtn = document.querySelector("button[aria-label='Follow']:not([disabled]), a[role='button'][href*='follow']");
  if (followBtn) {
    followBtn.click();
    sendResponse({ status: "SUCCESS" });
  } else {
    console.warn("ZWILT Bot: Follow button not found");
    sendResponse({ status: "FAILED", reason: "Follow button not found" });
  }
}

function handleLike(sendResponse) {
  const likeBtn = document.querySelector("div[aria-label='Like'], span[aria-label='Like'], a[data-testid*='reaction-bar']");
  if (likeBtn) {
    likeBtn.click();
    sendResponse({ status: "SUCCESS" });
  } else {
    console.warn("ZWILT Bot: Like button not found");
    sendResponse({ status: "FAILED", reason: "Like button not found" });
  }
}

function scrollToBottom(retries = 5, delay = 1000) {
  let count = 0;
  const scrollInterval = setInterval(() => {
    // Scroll one viewport height down
    window.scrollBy(0, window.innerHeight); 
    count++;
    if (count >= retries) clearInterval(scrollInterval);
  }, delay);
}

function triggerCommentBox() {
  // Find all "Comment" buttons and click them to make the text input visible
  const commentButtons = document.querySelectorAll("div[aria-label='Comment'], span[aria-label='Comment'], a[role='button'][aria-label='Comment']");
  commentButtons.forEach(btn => {
    // Only scroll to and click buttons that are reasonably visible
    if (btn.getBoundingClientRect().top < window.innerHeight) {
        btn.click();
    }
  });
}

/**
 * NEW: Robustly finds the comment input field using modern Facebook selectors.
 */
function findCommentInput() {
  const selectors = [
    // 1. Most reliable: The content-editable element within the 'Write a comment' wrapper
    "[aria-label*='Write a comment'][role='textbox']", 
    
    // 2. Alternative, targets the common structural role for textboxes
    "div[role='textbox'][contenteditable='true']",
    
    // 3. Fallback: Generic but often used for the main input area
    "div[contenteditable='true']:not([aria-hidden='true'])",
    
    // 4. Older but sometimes still present test ID (UFI = Unified Feedback Interface)
    "[data-testid='UFI2CommentComposer/root_input']",
    
    // 5. Catch-all for text inputs that are visible and editable
    "textarea[placeholder*='comment']:not([disabled]), input[placeholder*='comment']:not([disabled])", 
  ];
  
  for (const selector of selectors) {
    const input = document.querySelector(selector);
    console.log(`ZWILT Bot: Trying selector ${selector} → ${!!input}`);
    if (input) {
      // input.style.outline = "2px solid red"; // Highlight the found element
      console.log(`ZWILT Bot: Found comment input using selector: ${selector}`);
      return input;
    }
  }
  return null;
}

function waitForInputField(maxRetries = 20, interval = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const timer = setInterval(() => {
      const input = findCommentInput();
      if (input) {
        clearInterval(timer);
        resolve(input);
      } else if (++attempts >= maxRetries) {
        clearInterval(timer);
        reject("Comment input field not found after retries.");
      }
    }, interval);
  });
}

function handleComment(message, sendResponse) {
  waitForInputField()
    .then((input) => {
      // 1. Focus and insert text
      input.focus();
      input.textContent = sanitize(message.text);
      
      // 2. Dispatch events to trigger reactivity (crucial for Facebook/React)
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: " " }));

      // 3. Wait briefly, then find and click the submit button
      setTimeout(() => {
        // Search for the Post/Comment button, usually submit type, or with aria-label='Comment'
        const submitBtn = document.querySelector("button[type='submit'][aria-label*='Comment'], button[type='submit'][aria-label*='Post']");
        
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.click();
          console.log("ZWILT Bot: Comment posted successfully.");
          sendResponse({ status: "SUCCESS" });
        } else {
          console.warn("ZWILT Bot: Submit button missing or disabled after input.");
          sendResponse({ status: "FAILED", reason: "Submit button missing or disabled after input." });
        }
      }, 500);
    })
    .catch((err) => {      
      console.warn("ZWILT Bot:", err);
      sendResponse({ status: "FAILED", reason: err });
    });
}
