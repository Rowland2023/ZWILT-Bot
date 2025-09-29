/**
 * Pinterest Bot Controller
 * Listens for commands from the extension popup and executes actions on the Pinterest page.
 * Selectors now prioritize visible button text and fallback to robust data attributes.
 */

// Helper function to find a button (or button-like element) that contains specific text.
// This is critical for Pinterest as button text is more stable than dynamic IDs.
function findButtonByText(text) {
    // Search for button elements and elements that act like buttons (e.g., links with role="button")
    const selector = 'button, a[role="button"], div[role="button"]';
    const elements = document.querySelectorAll(selector);
    
    for (const el of elements) {
        // Use innerText for visible, rendered text and normalize it for comparison
        const elText = el.innerText ? el.innerText.trim() : '';
        
        // Check for exact match or near-exact match (case-insensitive)
        if (elText.toLowerCase() === text.toLowerCase()) {
            return el;
        }
    }
    return null;
}

// Utility function to simulate user input on contenteditable fields
function setContentEditableText(element, text) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        element.value = text;
    } else {
        // Assume contenteditable div
        element.textContent = text;
    }
    
    // Manually trigger events so the framework recognizes the change
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

(function() {
    console.log("Pinterest Controller injected and listener waiting for message...");

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            if (request.network !== 'Pinterest') {
                return false; 
            }

            try {
                let element, successMessage;

                switch (request.command) {
                    
                    case 'comment':
                        console.log(`Executing COMMENT command with text: ${request.text}`);
                        
                        // Selector targets the comment input box on a Pin.
                        const commentField = document.querySelector('textarea[placeholder*="Add a comment"]');

                        if (!commentField) {
                            throw new Error("Comment input field not found.");
                        }

                        // 1. Insert text
                        setContentEditableText(commentField, request.text);

                        // 2. Wait briefly for the "Post" button to activate/appear
                        setTimeout(() => {
                            // 3. Find and click the Post button using text or the data-test-id fallback
                            const postButton = findButtonByText('Post') || document.querySelector('button[data-test-id="comment-submit-button"]'); 

                            if (postButton) {
                                postButton.click();
                                successMessage = `Comment posted on Pinterest!`;
                            } else {
                                throw new Error("Post button not found after typing comment.");
                            }
                            sendResponse({ status: "SUCCESS", message: successMessage });
                        }, 500); 

                        return true; // Indicates an asynchronous response

                    case 'follow':
                    case 'followBoard':
                        console.log('Executing FOLLOW command.');
                        // Prioritize text lookup for reliability
                        element = findButtonByText('Follow');
                        successMessage = 'Board or profile followed on Pinterest.';
                        break;
                        
                    case 'unfollow':
                        console.log('Executing UNFOLLOW/UNFOLLOW BOARD command.');
                        
                        // 1. Find the button that indicates we are already following (text is "Following" or "Followed")
                        let unfollowBtn = findButtonByText('Following') || findButtonByText('Followed');

                        if (unfollowBtn) {
                            element = unfollowBtn;
                            successMessage = 'Profile or Board unfollowed on Pinterest.';
                        } else {
                            throw new Error("Could not find 'Following' or 'Followed' button to unfollow.");
                        }
                        break;

                    case 'savePin': 
                        console.log('Executing SAVE PIN command.');
                        // Find the prominent "Save" button
                        element = findButtonByText('Save');
                        // Fallback to the known data-test-id if text lookup fails (e.g., if the button shows a board name)
                        if (!element) {
                            element = document.querySelector("button[data-test-id='pin-save-button']");
                        }
                        successMessage = 'Pin saved on Pinterest.';
                        break;

                    case 'like':
                        console.log('Executing LIKE PIN command.');
                        // Find the heart icon/like button using the aria-label
                        element = document.querySelector('button[aria-label="Heart reaction"]') || document.querySelector("button[data-test-id='pin-like-button']");
                        successMessage = 'Pin liked on Pinterest.';
                        break;
                        
                    case 'unlike':
                        console.log('Executing UNLIKE PIN command.');
                        // On Pinterest, clicking the active 'like' button performs the 'unlike' action.
                        // We use the same selector as 'like' to toggle the state.
                        element = document.querySelector('button[aria-label="Heart reaction"]') || document.querySelector("button[data-test-id='pin-like-button']");
                        if (!element) {
                            throw new Error("Like button not found. Cannot unlike.");
                        }
                        successMessage = 'Pin unliked on Pinterest (by toggling the heart reaction).';
                        break;

                    case 'story':
                        console.log('Executing VIEW STORY/IDEA PIN command.');
                        // Targets the first visible Story/Idea Pin tile on the main feed
                        element = document.querySelector('div[data-test-id="idea-pin-tile"], div[data-test-id*="story"]');
                        if (!element) {
                            // Fallback to a common pin container
                            element = document.querySelector('div[data-test-id*="pin-visual-wrap"]');
                        }
                        successMessage = 'Attempting to click the first visible Story/Idea Pin on Pinterest.';
                        break;

                    default:
                        sendResponse({ status: "ERROR", reason: `Unknown command: ${request.command}` });
                        return true;
                }

                // Execute simple click actions synchronously
                if (element && element.click) {
                    element.click();
                    sendResponse({ status: "SUCCESS", message: successMessage });
                } else if (request.command !== 'comment') {
                    // Only throw error if it wasn't a 'comment' command (which handles its own response asynchronously)
                    throw new Error(`Target element for ${request.command} not found.`);
                }

            } catch (error) {
                sendResponse({ status: "ERROR", reason: `Execution failed on Pinterest: ${error.message}` });
            }

            return true;
        }
    );
})();
