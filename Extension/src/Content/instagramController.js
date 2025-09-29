/**
 * Instagram Bot Controller
 * Listens for commands from the extension and executes actions on the Instagram web platform.
 * Relies heavily on aria-labels and text content due to dynamic class names.
 */

// Utility function to simulate text input in a textarea
function setCommentBoxText(element, text) {
    if (element.tagName === 'TEXTAREA') {
        element.value = text;
    } else {
        // Fallback for content-editable div (sometimes used in replies)
        element.textContent = text;
    }
    
    // Dispatch events to notify Instagram's framework of the text update
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

(function() {
    // Check if the listener is already registered to prevent duplication
    if (window.hasInstagramListener) return;
    window.hasInstagramListener = true;
    
    console.log("Instagram Controller injected and listening for messages...");

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            
            // 1. Check intended recipient
            if (request.network !== 'Instagram') {
                return false; 
            }

            console.log(`[Instagram Controller] Received command: ${request.command}`);

            // This function calls sendResponse SYNCHRONOUSLY.
            const respond = (status, message, reason) => {
                console.log(`[Instagram Controller] Sending response: ${status} - ${message || reason}`);
                sendResponse({ status, message, reason });
            };

            try {
                let targetElement;

                switch (request.command) {
                    
                    case 'like':
                    case 'unlike':
                        // Instagram uses an aria-label on the button that contains the heart icon.
                        // We target the button with the label 'Like' or 'Unlike' (they are mutually exclusive on a single button at a time)
                        targetElement = document.querySelector('button[aria-label="Like"], button[aria-label="Unlike"]');
                        
                        if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", `${request.command} action executed on Instagram.`);
                        } else {
                            throw new Error(`Like/Unlike button not found. Ensure the post is visible and loaded.`);
                        }
                        break;
                        
                    case 'follow':
                    case 'unfollow':
                        // Look for the Follow/Following/Unfollow buttons based on text content, common on profile pages and within posts
                        targetElement = Array.from(document.querySelectorAll('button'))
                            .find(el => {
                                const text = el.textContent?.toLowerCase().trim();
                                if (!text) return false;
                                return text === 'follow' || text === 'following' || text === 'unfollow';
                            });

                        if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", `Profile action (${request.command}) executed on Instagram.`);
                        } else {
                            throw new Error("Follow/Unfollow button not found. You must be on a user's profile page or the button must be visible.");
                        }
                        break;


                    case 'comment':
                        console.log(`Executing COMMENT command with text: ${request.text}`);
                        
                        if (!request.text) {
                             throw new Error("Cannot send comment: Text is missing.");
                        }

                        // 1. Find the comment input field (usually a textarea)
                        let commentInput = document.querySelector('textarea[aria-label="Add a comment..."]');
                        
                        if (!commentInput) {
                            // Fallback for different languages or UI variations
                             commentInput = Array.from(document.querySelectorAll('textarea'))
                                .find(el => el.getAttribute('placeholder')?.includes('comment'));
                            if (!commentInput) {
                                throw new Error("Comment input field not found. Ensure the post is visible and the comment section is loaded.");
                            }
                        }

                        // 2. Set the text and dispatch events
                        setCommentBoxText(commentInput, request.text);
                        
                        // 3. Find the submit button
                        // The Post button is often disabled until text is entered, so we look for the button with the text 'Post'
                        const submitButton = Array.from(document.querySelectorAll('button'))
                            .find(el => el.textContent?.trim() === 'Post');
                        
                        if (submitButton) {
                            submitButton.click();
                            respond("SUCCESS", "Comment posted on Instagram.");
                        } else {
                            throw new Error("Post button not found or is disabled. Ensure text has been added to the field.");
                        }
                        break;
                        
                    case 'story':
                         // Story interaction is highly contextual and difficult to generalize reliably on the web.
                         // We will attempt to click the "Next" button if a story is open.
                         targetElement = document.querySelector('div[role="button"][aria-label="Next"]');
                         if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", "Advanced to the next story on Instagram.");
                         } else {
                            respond("ERROR", null, `Command 'story' failed. Next button not found. You need to manually open a story first.`);
                         }
                         break;

                    default:
                        respond("ERROR", null, `Unknown command: ${request.command}`);
                        break;
                }

            } catch (error) {
                // If any error occurs in the try block, catch it and send an ERROR response.
                respond("ERROR", null, `Execution failed on Instagram: ${error.message}`);
            }

            // Signal synchronous response
        }
    );
})();
