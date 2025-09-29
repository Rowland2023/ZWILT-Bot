/**
 * TikTok Bot Controller
 * Listens for commands from the extension and executes actions on the TikTok web platform.
 * Relies primarily on data-e2e attributes for stability.
 */

// Utility function to simulate text input in a content-editable div
function setCommentBoxText(element, text) {
    // The TikTok comment box is a content-editable div
    element.textContent = text;
    
    // Dispatch events to notify TikTok's framework of the text update
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

(function() {
    // Check if the listener is already registered to prevent duplication
    if (window.hasTikTokListener) return;
    window.hasTikTokListener = true;
    
    console.log("TikTok Controller injected and listening for messages...");

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            
            // 1. Check intended recipient
            if (request.network !== 'TikTok') {
                return false; 
            }

            console.log(`[TikTok Controller] Received command: ${request.command}`);

            // This function calls sendResponse SYNCHRONOUSLY.
            const respond = (status, message, reason) => {
                console.log(`[TikTok Controller] Sending response: ${status} - ${message || reason}`);
                sendResponse({ status, message, reason });
            };

            try {
                let targetElement;

                switch (request.command) {
                    
                    case 'like':
                    case 'unlike':
                        // Targets the button wrapping the like icon (which has data-e2e="like-icon")
                        // TikTok uses the same button to toggle like/unlike
                        targetElement = document.querySelector('[data-e2e="video-player-actions"] button:nth-child(1)'); // The first button in the actions group is usually 'Like'
                        
                        if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", `${request.command} action executed on TikTok.`);
                        } else {
                            throw new Error(`Like/Unlike button not found. Ensure the video is visible and loaded.`);
                        }
                        break;
                        
                    case 'follow':
                    case 'unfollow':
                        // Targets the main "Follow" button next to the profile information above the video
                        targetElement = document.querySelector('[data-e2e="follow-button-2"]'); 
                        
                        if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", `Profile action (${request.command}) executed on TikTok.`);
                        } else {
                            // Fallback: search for a follow button on the user's profile page
                            targetElement = Array.from(document.querySelectorAll('button'))
                                .find(el => el.textContent?.toLowerCase().trim() === 'follow' || el.textContent?.toLowerCase().trim() === 'following');

                            if (targetElement) {
                                 targetElement.click();
                                 respond("SUCCESS", `Profile action (${request.command}) executed on TikTok (using text fallback).`);
                            } else {
                                throw new Error("Follow/Unfollow button not found. Must be on a user's profile or the video player.");
                            }
                        }
                        break;


                    case 'comment':
                        console.log(`Executing COMMENT command with text: ${request.text}`);
                        
                        if (!request.text) {
                             throw new Error("Cannot send comment: Text is missing.");
                        }

                        // 1. Find the comment input field (contenteditable div)
                        // It is usually the one with the placeholder "Add comment..."
                        let commentInput = document.querySelector('[contenteditable="true"][aria-label*="Add comment"], [contenteditable="true"][placeholder*="Add comment"]');
                        
                        if (!commentInput) {
                            throw new Error("Comment input field not found. Ensure the comment box is open.");
                        }

                        // 2. Set the text and dispatch events
                        setCommentBoxText(commentInput, request.text);
                        
                        // 3. Find the submit button using data-e2e attribute
                        const submitButton = document.querySelector('[data-e2e="comment-post-button"]');
                        
                        if (submitButton) {
                            submitButton.click();
                            respond("SUCCESS", "Comment posted on TikTok.");
                        } else {
                            throw new Error("Post button not found or is disabled. Ensure text has been added to the field.");
                        }
                        break;
                        
                    case 'story':
                         // TikTok web UI scrolls to the next video using the down arrow button.
                         targetElement = document.querySelector('[data-e2e="arrow-down"]'); 
                         if (targetElement) {
                            targetElement.click();
                            respond("SUCCESS", "Advanced to the next video (Story/Next) on TikTok.");
                         } else {
                            respond("ERROR", null, `Command 'story' failed. Next video button not found. You need to be viewing a video.`);
                         }
                         break;

                    default:
                        respond("ERROR", null, `Unknown command: ${request.command}`);
                        break;
                }

            } catch (error) {
                // If any error occurs in the try block, catch it and send an ERROR response.
                respond("ERROR", null, `Execution failed on TikTok: ${error.message}`);
            }
        }
    );
})();
