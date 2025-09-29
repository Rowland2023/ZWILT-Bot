/**
 * Instagram Bot Controller
 * Listens for commands from the extension and executes actions on the Instagram page.
 * Uses native DOM methods, including a helper function to reliably find buttons by text content.
 */

// Helper function to find a button (or button-like element) that contains specific text.
function findButtonByText(text) {
    const selector = 'button, a[role="button"]'; // Select standard buttons and anchor tags acting as buttons
    const buttons = document.querySelectorAll(selector);
    
    for (const btn of buttons) {
        // Use innerText for visible, rendered text and normalize it for comparison
        const btnText = btn.innerText.trim();
        
        // Case-insensitive exact match or close match is often best
        if (btnText.toLowerCase() === text.toLowerCase()) {
            return btn;
        }
        
        // For 'Following', it might be in a different element, but 'Follow' is usually simple text
    }
    return null;
}

// Helper function to simulate typing into a content-editable element (like a comment box)
function simulateTextEntry(element, text) {
    element.focus();
    element.textContent = text;
    // Dispatch necessary events to ensure Instagram's React framework recognizes the input
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}


(function() {
    console.log("Instagram Controller injected and listening for messages...");

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            
            // Ensure we only process messages explicitly intended for Instagram
            if (request.network !== 'Instagram') {
                return false;
            }

            try {
                let element, successMessage;

                switch (request.command) {
                    
                    case 'follow':
                        console.log('Executing FOLLOW command.');
                        // FIX: Use the native JS function to locate the button by its text content.
                        element = findButtonByText('Follow');
                        successMessage = 'Profile followed on Instagram.';
                        break;

                    case 'unfollow':
                        console.log('Executing UNFOLLOW command.');
                        // Typically, the "Following" button needs two clicks to confirm unfollow.
                        element = findButtonByText('Following');
                        if (element) {
                             element.click(); // Click 'Following' to open confirmation modal
                             // The confirmation modal button is often the second button with text 'Unfollow'
                             // This is complex and often requires a delay, so we'll simplify for now 
                             // and just focus on finding the 'Unfollow' text in the modal if needed.
                             // For a single click from the profile, we'll try to find the 'Following' button.
                             successMessage = "Clicked 'Following'. User may need to confirm unfollow in modal.";
                        } else {
                            throw new Error("Could not find 'Following' button to initiate unfollow.");
                        }
                        break;
                    
                    case 'like':
                        console.log('Executing LIKE command.');
                        // Like button is usually an SVG icon with the aria-label "Like" or "Double tap to like"
                        element = document.querySelector('svg[aria-label="Like"], svg[aria-label="Double tap to like"]');
                        // We must click the ancestor button, not the SVG itself
                        element = element ? element.closest('button, div[role="button"]') : null;
                        successMessage = 'Post liked on Instagram.';
                        break;
                    
                    case 'unlike':
                        console.log('Executing UNLIKE command.');
                        // Unlike button is the filled-in heart icon
                        element = document.querySelector('svg[aria-label="Unlike"]');
                        element = element ? element.closest('button, div[role="button"]') : null;
                        successMessage = 'Post unliked on Instagram.';
                        break;

                    case 'comment':
                        console.log(`Executing COMMENT command with text: ${request.text}`);
                        // 1. Find the comment input area. Often by aria-label or specific container.
                        const commentInput = document.querySelector('textarea[aria-label="Add a comment..."], input[aria-label="Add a comment..."]');
                        
                        if (!commentInput) {
                            throw new Error("Comment input field not found.");
                        }

                        // 2. Insert the text
                        simulateTextEntry(commentInput, request.text);

                        // 3. Find and click the Post button (which usually appears after text is entered)
                        // It's often the button with the text 'Post'
                        setTimeout(() => {
                            const postButton = findButtonByText('Post');
                            if (postButton) {
                                postButton.click();
                                sendResponse({ status: "SUCCESS", message: "Comment posted on Instagram." });
                            } else {
                                sendResponse({ status: "ERROR", reason: "Post button not found or disabled." });
                            }
                        }, 500); // Small delay to allow the 'Post' button to activate
                        
                        return true; // Return true for async response (due to setTimeout)

                    default:
                        sendResponse({ status: "ERROR", reason: `Unknown command: ${request.command}` });
                        return true;
                }

                // Handler for simple click actions (like, follow, etc.)
                if (element && element.click) {
                    element.click();
                    sendResponse({ status: "SUCCESS", message: successMessage });
                } else if (request.command !== 'comment') {
                    // Only throw error if it wasn't a 'comment' command (which handles its own response)
                    throw new Error(`Target element for ${request.command} not found. Check if the element is visible on the page.`);
                }

            } catch (error) {
                // Catches errors from any synchronous step
                sendResponse({ status: "ERROR", reason: `Execution failed on Instagram: ${error.message}` });
            }

            // Must return true for all message handlers
            return true;
        }
    );
})();
