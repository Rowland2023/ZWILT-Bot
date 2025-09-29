/**
 * TikTok Bot Controller
 * Listens for commands from the extension and executes actions on the TikTok page.
 * Uses high-quality data-e2e selectors for reliability.
 */

// Utility function to simulate text input and event dispatching
function setTextInputValue(element, text) {
    element.value = text;
    // Dispatch input and change events to notify the framework of the update
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

(function() {
    console.log("TikTok Controller injected and listening for messages...");

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            // Ensure we only process messages explicitly intended for TikTok
            if (request.network !== 'TikTok') {
                return false; 
            }

            try {
                let element, successMessage;

                switch (request.command) {

                    case 'like':
                        console.log('Executing LIKE command.');
                        // Selector for the Like button using the data-e2e attribute
                        element = document.querySelector("button[data-e2e='like-button']");
                        successMessage = 'Post liked on TikTok.';
                        break;

                    case 'follow':
                        console.log('Executing FOLLOW command.');
                        // Selector for the Follow button using the data-e2e attribute
                        element = document.querySelector("button[data-e2e='follow-button']");
                        successMessage = 'Profile followed on TikTok.';
                        break;

                    case 'viewVideo':
                        console.log('Executing VIEW VIDEO (play) command.');
                        // Selects the main video element and calls play()
                        const videoElement = document.querySelector("video");
                        if (videoElement) {
                            videoElement.play();
                            sendResponse({ status: "SUCCESS", message: "Video playback started on TikTok." });
                        } else {
                            throw new Error("Video element not found or not ready.");
                        }
                        // Return true to indicate asynchronous response
                        return true;

                    case 'comment':
                        console.log(`Executing COMMENT command with text: ${request.text}`);
                        
                        // 1. Find the comment textarea
                        // TikTok typically uses a standard textarea or an input field within the comment section
                        const commentBox = document.querySelector("textarea"); 
                        
                        if (!commentBox) {
                            throw new Error("Comment input field not found.");
                        }

                        // 2. Set the text and dispatch events
                        setTextInputValue(commentBox, request.text);

                        // 3. Find and click the submit button
                        // Using the user's generic submit button selector for simplicity, 
                        // but a data-e2e selector might be safer (e.g., [data-e2e='comment-post-button'])
                        const submitButton = document.querySelector("button[type='submit']:not([disabled])");
                        
                        if (submitButton) {
                            submitButton.click();
                            sendResponse({ status: "SUCCESS", message: "Comment posted on TikTok." });
                        } else {
                            throw new Error("Comment submit button not found or disabled.");
                        }
                        return true;
                        
                    case 'unlike':
                    case 'unfollow':
                        // TODO: Implement UNLIKE and UNFOLLOW logic here.
                        successMessage = `${request.command} command executed on TikTok (Action pending implementation).`;
                        break;

                    default:
                        sendResponse({ status: "ERROR", reason: `Unknown command: ${request.command}` });
                        return true;
                }

                // Handler for simple click actions (like and follow)
                if (element && element.click) {
                    element.click();
                    sendResponse({ status: "SUCCESS", message: successMessage });
                } else if (!successMessage) {
                     // Fallback for complex commands that don't need a simple click right now
                     sendResponse({ status: "SUCCESS", message: `Complex command ${request.command} executed on TikTok!` });
                } else {
                    // Element not found for simple click action
                    throw new Error(`Target element for ${request.command} not found. Selector might be wrong.`);
                }

            } catch (error) {
                // Catches errors from any synchronous or improperly executed step
                sendResponse({ status: "ERROR", reason: `Execution failed on TikTok: ${error.message}` });
            }

            // Must return true for all message handlers where sendResponse is called, 
            // even synchronously, to ensure the port stays open.
            return true;
        }
    );
})();
