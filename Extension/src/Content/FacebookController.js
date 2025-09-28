/**
 * Facebook Bot Controller
 * Listens for commands from popup.js and executes actions on the Facebook page.
 */

// Utility function to simulate user input on contenteditable fields
function setContentEditableText(element, text) {
    element.textContent = text;
    
    // Manually trigger an 'input' event so Facebook's framework recognizes the change
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Manually trigger a 'keyup' or 'change' event for wider compatibility
    element.dispatchEvent(new Event('keyup', { bubbles: true, keyCode: 13 })); // 13 is Enter key
}

(function() {
    console.log("Facebook Controller injected and listener waiting for message...");

    // The critical message listener setup.
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            // Ignore messages not explicitly for Facebook
            if (request.network !== 'Facebook') {
                return false; 
            }

            try {
                // Determine which action to perform based on the command
                switch (request.command) {
                    
                    case 'comment':
                        console.log(`Executing COMMENT command with text: ${request.text}`);
                        
                        // 1. Find the comment input field (typically a contenteditable div)
                        // This selector targets a common comment box element on Facebook posts
                        const commentField = document.querySelector('[aria-label="Write a comment"]');

                        if (!commentField) {
                            throw new Error("Comment input field not found. Selector might be outdated.");
                        }

                        // 2. Insert the text using the specialized function
                        // Note: We use .textContent because it's a contenteditable DIV, not an input field.
                        setContentEditableText(commentField, request.text);

                        // 3. Wait briefly for the "Post" button to become visible/active
                        // We use a small timeout to allow Facebook's UI to update after text is entered
                        setTimeout(() => {
                            // 4. Find and click the Post/Send button
                            // This selector targets the Post button that appears after typing
                            // Note: This button usually has a role="button" and appears near the comment field
                            const postButton = document.querySelector('div[aria-label="Press Enter to post"]'); 

                            if (postButton) {
                                postButton.click();
                                sendResponse({ status: "SUCCESS", message: `Comment posted on Facebook!` });
                            } else {
                                sendResponse({ status: "ERROR", reason: "Post button not found after typing comment." });
                            }
                        }, 500); // 500ms delay

                        // Returning true here is crucial because sendResponse is called asynchronously inside setTimeout
                        return true; 
                        
                    case 'like':
                        console.log('Executing LIKE command.');
                        // TODO: Implement Facebook LIKE logic here.
                        break;
                        
                    case 'unlike':
                        console.log('Executing UNLIKE command.');
                        // TODO: Implement Facebook UNLIKE logic here.
                        break;
                        
                    case 'follow':
                        console.log('Executing FOLLOW command.');
                        // TODO: Implement Facebook FOLLOW logic here.
                        break;
                        
                    case 'story':
                        console.log('Executing STORY command.');
                        // TODO: Implement Facebook STORY viewing/clicking logic here.
                        break;

                    default:
                        sendResponse({ status: "ERROR", reason: `Unknown command: ${request.command}` });
                        return true;
                }

                // For synchronous commands (all except 'comment' currently), send a success response immediately.
                sendResponse({ status: "SUCCESS", message: `${request.command} executed on Facebook!` });

            } catch (error) {
                // If any part of the execution fails (e.g., selector not found)
                sendResponse({ status: "ERROR", reason: `Execution failed: ${error.message}` });
            }

            // Return 'true' for synchronous responses as well (best practice to ensure no leaks)
            return true;
        }
    );
})();
