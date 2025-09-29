/**
 * Twitter Bot Controller
 * Listens for commands from the extension and executes actions on the X/Twitter platform.
 * FIX: Maps 'unlike' to 'like' data-testid and 'unretweet' to 'retweet' data-testid, 
 * as Twitter uses a single element for both states.
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

            // This function calls sendResponse SYNCHRONOUSLY.
            const respond = (status, message, reason) => {
                console.log(`[Twitter Controller] Sending response: ${status} - ${message || reason}`);
                sendResponse({ status, message, reason });
            };

            try {
                let targetElement;
                let targetTestId;

                switch (request.command) {
                    
                    case 'like':
                    case 'unlike':
                        // Both like and unlike use the same button with this data-testid
                        targetTestId = 'like'; 
                        targetElement = document.querySelector(`[data-testid='${targetTestId}']`);
                        
                        if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", `Post ${request.command} action executed on X (Twitter).`);
                        } else {
                            throw new Error(`Target element data-testid='${targetTestId}' not found. Ensure the post is visible.`);
                        }
                        break;
                        
                    case 'retweet':
                    case 'unretweet':
                        // Both retweet and unretweet use the same button with this data-testid
                        targetTestId = 'retweet'; 
                        targetElement = document.querySelector(`[data-testid='${targetTestId}']`);
                        
                        if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", `Post ${request.command} action executed on X (Twitter).`);
                        } else {
                            throw new Error(`Target element data-testid='${targetTestId}' not found. Ensure the post is visible.`);
                        }
                        break;

                    case 'follow':
                    case 'unfollow':
                        // This part is confirmed working, using resilient text search on buttons
                        targetElement = Array.from(document.querySelectorAll('div[role="button"], button'))
                            .find(el => {
                                const text = el.textContent?.toLowerCase().trim();
                                if (!text) return false;
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

                        // 1. Find the content-editable reply box using the stable role='textbox'
                        let replyBox = document.querySelector("[role='textbox']");
                        
                        if (!replyBox) {
                            throw new Error("Reply input field not found. You must ensure the reply box is open and focused.");
                        }

                        // 2. Set the text and dispatch events
                        setReplyBoxText(replyBox, request.text);

                        // 3. Find and click the submit button
                        // The 'tweetButton' test ID is often used for replies as well
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
                         break;

                    default:
                        respond("ERROR", null, `Unknown command: ${request.command}`);
                        break;
                }

            } catch (error) {
                // If any error occurs in the try block, catch it and send an ERROR response.
                respond("ERROR", null, `Execution failed on Twitter: ${error.message}`);
            }

            // Signal synchronous response
        }
    );
})();
