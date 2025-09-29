/**
 * LinkedIn Bot Controller
 * Listens for commands from the extension popup and executes actions on the LinkedIn page.
 * Selectors are designed to target common, stable attributes like aria-label and button text.
 */

// Helper function to find a button (or button-like element) that contains specific text.
function findButtonByText(text) {
    const selector = 'button, a[role="button"]';
    const buttons = document.querySelectorAll(selector);
    
    for (const btn of buttons) {
        // Use innerText for visible, rendered text and normalize it for comparison
        const btnText = btn.innerText ? btn.innerText.trim() : '';
        
        if (btnText.toLowerCase() === text.toLowerCase()) {
            return btn;
        }
    }
    return null;
}

// Utility function to simulate user input on contenteditable fields
// LinkedIn often uses contenteditable DIVs for comment fields.
function setContentEditableText(element, text) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
        element.value = text;
    } else {
        // Assume contenteditable div
        element.textContent = text;
    }

    // Manually trigger events so LinkedIn's framework recognizes the change
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    // Attempting keyup 13 (Enter) can sometimes trigger the post button enablement
    element.dispatchEvent(new Event('keyup', { bubbles: true, keyCode: 13 })); 
}

(function() {
    console.log("LinkedIn Controller injected and listener waiting for message...");

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            
            // Ignore messages not explicitly for LinkedIn
            if (request.network !== 'LinkedIn') {
                return false; 
            }

            try {
                let element, successMessage;

                switch (request.command) {
                    
                    case 'comment':
                        console.log(`Executing COMMENT command with text: ${request.text}`);
                        
                        // 1. Find the comment input field
                        const commentField = document.querySelector('div[contenteditable="true"][aria-label="Add a comment..."]');

                        if (!commentField) {
                            throw new Error("Comment input field not found.");
                        }

                        // 2. Insert the text using the specialized function
                        setContentEditableText(commentField, request.text);

                        // 3. Wait briefly for the "Post" button to become visible/active
                        setTimeout(() => {
                            // 4. Find and click the Post/Submit button
                            // This targets the submit button after text is entered.
                            const postButton = findButtonByText('Post'); 

                            if (postButton) {
                                postButton.click();
                                successMessage = `Comment posted on LinkedIn!`;
                                sendResponse({ status: "SUCCESS", message: successMessage });
                            } else {
                                sendResponse({ status: "ERROR", reason: "Post button not found after typing comment." });
                            }
                        }, 500); // 500ms delay for UI update

                        // Returning true is CRITICAL because sendResponse is called asynchronously inside setTimeout
                        return true; 

                    case 'like':
                        console.log('Executing LIKE command.');
                        // Targets the button with the label 'Like' (the initial state)
                        element = document.querySelector("button[aria-label='Like']"); 
                        // Fallback for newer selectors that wrap the 'Like' action
                        if (!element) {
                            element = document.querySelector("button[aria-label*='React to']");
                        }
                        successMessage = 'Post liked on LinkedIn.';
                        break;
                        
                    case 'unlike':
                        console.log('Executing UNLIKE command.');
                        // Targets the button when it is in the liked state, usually indicated by 'Remove Like' or the same generic button now active
                        element = document.querySelector("button[aria-label='Remove Like']");
                        if (!element) {
                            // Fallback for generic button which acts as a toggle if it's currently active (LinkedIn class)
                            element = document.querySelector("button[aria-label='Like'].artdeco-button--active");
                        }
                        successMessage = 'Post unliked on LinkedIn.';
                        break;
                        
                    case 'follow': // Mapped from the common 'Connect' button
                        console.log('Executing FOLLOW (Connect) command.');
                        // 1. Try to find the Connect button on a profile
                        element = findButtonByText('Connect');
                        if (!element) {
                            // 2. Try to find the Follow button (e.g., for company pages)
                            element = findButtonByText('Follow');
                        }
                        successMessage = 'Connection or Follow request sent on LinkedIn.';
                        break;

                    case 'unfollow': 
                        console.log('Executing UNFOLLOW/DISCONNECT command. Attempting robust process.');
                        
                        // 1. Try simple company page unfollow
                        let unfollowBtn = findButtonByText('Following');
                        if (unfollowBtn) {
                            unfollowBtn.click();
                            // If a confirmation modal appears, we stop here and rely on user to confirm.
                            sendResponse({ status: "SUCCESS", message: "Clicked 'Following'. User may need to confirm unfollow." });
                            return true;
                        }
                        
                        // 2. More complex profile disconnect (requires More menu)
                        let primaryButton = findButtonByText('Message');
                        
                        if (primaryButton) {
                            // Click the 'More' (ellipsis) button next to it
                            const moreButton = primaryButton.closest('div')?.nextElementSibling?.querySelector('button[aria-label="More actions"]');
                            
                            if (moreButton) {
                                moreButton.click();
                                // Wait for the dropdown menu to appear
                                setTimeout(() => {
                                    // Find the 'Unfollow' or 'Remove Connection' option in the dropdown
                                    const unfollowOption = findButtonByText('Unfollow') || findButtonByText('Remove connection');
                                    if (unfollowOption) {
                                        unfollowOption.click();
                                        sendResponse({ status: "SUCCESS", message: "Successfully initiated Unfollow/Remove Connection process." });
                                    } else {
                                        sendResponse({ status: "ERROR", reason: "More menu opened, but 'Unfollow' or 'Remove connection' option not found." });
                                    }
                                }, 500); // Wait for dropdown to render
                                return true; // Async response
                            }
                        }
                        
                        throw new Error("Target element for UNFOLLOW/DISCONNECT not found.");


                    case 'story': // Viewing the first video/story
                        console.log('Executing STORY/VIDEO command.');
                        // Targets the story container in the sidebar. This is prone to breaking.
                        element = document.querySelector('div[data-control-name="view_story"]');
                        successMessage = 'Story/Video command executed on LinkedIn.';
                        break;

                    default:
                        sendResponse({ status: "ERROR", reason: `Unknown command: ${request.command}` });
                        return true;
                }
                
                // For synchronous commands (like, unlike, follow, story)
                if (element && element.click) {
                    element.click();
                    sendResponse({ status: "SUCCESS", message: successMessage });
                } else if (!successMessage) {
                    // This is a safety check for complex commands that might have failed to assign an element
                    sendResponse({ status: "SUCCESS", message: `Complex command ${request.command} executed on LinkedIn!` });
                } else {
                    throw new Error(`Target element for ${request.command} not found.`);
                }

            } catch (error) {
                // If any part of the execution fails (e.g., selector not found)
                sendResponse({ status: "ERROR", reason: `Execution failed on LinkedIn: ${error.message}` });
            }

            // Always return true to acknowledge that sendResponse might be called asynchronously
            return true;
        }
    );
})();
