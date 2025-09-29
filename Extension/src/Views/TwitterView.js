/**
 * Twitter Bot Controller
 * Listens for commands from the extension and executes actions on the X/Twitter platform.
 * NOTE: The popup sends 'Twitter' as the network name.
 */

// Utility function to simulate text input in a content-editable div
function setReplyBoxText(element, text) {
    element.textContent = text;
    // Dispatch input and change events to notify X's framework of the text update
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

(function() {
    // Check if the listener is already registered to prevent duplication
    if (window.hasTwitterListener) return;
    window.hasTwitterListener = true;
    
    console.log("Twitter Controller injected and listening for messages...");

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            
            // 1. Check intended recipient
            if (request.network !== 'Twitter') {
                return false; 
            }

            console.log(`[Twitter Controller] Received command: ${request.command}`);

            // Declare response function outside of try/catch for cleaner use
            const respond = (status, message, reason) => {
                console.log(`[Twitter Controller] Sending response: ${status} - ${message || reason}`);
                // Ensure sendResponse is always called
                sendResponse({ status, message, reason });
            };

            try {
                let targetElement;

                switch (request.command) {
                    
                    case 'like':
                    case 'unlike':
                    case 'retweet':
                    case 'unretweet':
                        // Post actions often have stable data-testid attributes
                        const testId = request.command; 
                        
                        targetElement = document.querySelector(`div[data-testid='${testId}']`);
                        
                        if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", `Post ${request.command}ed on X (Twitter).`);
                        } else {
                            throw new Error(`Target element data-testid='${testId}' not found. Ensure the post is visible.`);
                        }
                        break;
                        
                    case 'follow':
                    case 'unfollow':
                        // **CRITICAL FIX:** Use .toLowerCase() and .trim() for maximum text resilience.
                        targetElement = Array.from(document.querySelectorAll('div[role="button"], button'))
                            .find(el => {
                                const text = el.textContent?.toLowerCase().trim();
                                if (!text) return false;
                                // Check for common Follow/Following text variants
                                return text.includes('follow') || text.includes('following');
                            });

                        if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", `Profile action (${request.command}) executed on X (Twitter).`);
                        } else {
                            throw new Error("Follow/Unfollow button not found. You must be on a user's profile page and the button must be visible.");
                        }
                        break;


                    case 'comment':
                        console.log(`Executing COMMENT (Reply) command with text: ${request.text}`);
                        
                        if (!request.text) {
                             throw new Error("Cannot send comment: Reply text is missing.");
                        }

                        // 1. Find the content-editable reply box 
                        // The selector for the reply box must be specific, typically using the aria-label
                        const replyBox = document.querySelector("div[aria-label='Tweet text'], div[aria-label='Text area to compose new post']");
                        
                        if (!replyBox) {
                            throw new Error("Reply input field not found. You must ensure the reply box is open.");
                        }

                        // 2. Set the text and dispatch events
                        setReplyBoxText(replyBox, request.text);

                        // 3. Find and click the submit button
                        // data-testid='tweetButton' is often used for both new tweets and replies
                        const submitButton = document.querySelector("div[data-testid='replyButton'], div[data-testid='tweetButton']");
                        
                        if (submitButton) {
                            submitButton.click();
                            respond("SUCCESS", "Comment (Reply) sent on X (Twitter).");
                        } else {
                            throw new Error("Reply/Tweet button not found or disabled.");
                        }
                        break;
                        
                    case 'story':
                         respond("ERROR", null, `Command 'story' is not applicable to the current Twitter/X web interface.`);
                         return true;

                    default:
                        respond("ERROR", null, `Unknown command: ${request.command}`);
                        return true; 
                }

            } catch (error) {
                // This ensures we always send a response back even if execution fails
                respond("ERROR", null, `Execution failed on Twitter: ${error.message}`);
            }

            // MUST return true to indicate that we will call sendResponse asynchronously
            return true;
        }
    );
})();
