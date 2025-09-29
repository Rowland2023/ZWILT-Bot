/**
 * LinkedIn Bot Controller
 * Listens for commands from the extension and executes actions on the LinkedIn web platform.
 * Actions include reacting (liking), commenting, and following/connecting.
 */

(function() {
    // Check if the listener is already registered to prevent duplication
    if (window.hasLinkedInListener) return;
    window.hasLinkedInListener = true;
    
    console.log("LinkedIn Controller injected and listening for messages...");

    /**
     * Finds the parent article/post element for the current action.
     * This ensures the action targets the correct post in the feed.
     * @param {HTMLElement} element A child element (like the Like button).
     * @returns {HTMLElement|null} The ancestor post element.
     */
    function findPostContainer(element) {
        // Targets the main feed item container for context
        return element ? element.closest('.feed-shared-update-v2, .scaffold-finite-scroll__content li') : null;
    }

    /**
     * Finds the post-specific action button (e.g., Like, Comment) within a post container.
     * @param {HTMLElement} postContainer The post element.
     * @param {string} text The text/aria-label to look for (e.g., "Like", "Comment").
     * @returns {HTMLElement|null} The action button.
     */
    function findPostActionButton(postContainer, text) {
        if (!postContainer) return null;
        
        // Search for buttons that contain the given text (case-insensitive)
        const buttons = postContainer.querySelectorAll('button');
        for (const btn of buttons) {
            const label = btn.getAttribute('aria-label') || btn.textContent;
            if (label && label.toLowerCase().includes(text.toLowerCase())) {
                return btn;
            }
        }
        return null;
    }

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            
            if (request.network !== 'LinkedIn') {
                return false; 
            }

            console.log(`[LinkedIn Controller] Received command: ${request.command}`);

            const respond = (status, message, reason) => {
                console.log(`[LinkedIn Controller] Sending response: ${status} - ${message || reason}`);
                sendResponse({ status, message, reason });
            };

            try {
                let targetElement = null;
                let postContainer = null;
                let successMessage = "";

                switch (request.command) {
                    
                    case 'like':
                    case 'unlike':
                        // 1. Find the most recent 'Like' button visible in the feed.
                        // We target buttons with aria-label containing "Like" or "React"
                        targetElement = document.querySelector('button[aria-label*="Like"], button[aria-label*="React"], button[title*="Like"]');
                        postContainer = findPostContainer(targetElement);
                        targetElement = findPostActionButton(postContainer, 'Like');

                        if (targetElement) {
                            targetElement.click();
                            successMessage = `Reaction/Like executed on the most recent LinkedIn post.`;
                        } else {
                            throw new Error("Like/React button not found on the most recent visible post.");
                        }
                        break;
                        
                    case 'comment':
                        if (!request.text) {
                             throw new Error("Cannot send comment: Text is missing.");
                        }

                        // 1. Find the comment button for the latest post
                        const commentButton = document.querySelector('button[aria-label*="Comment"], button[title*="Comment"]');
                        postContainer = findPostContainer(commentButton);
                        
                        if (!postContainer) {
                             throw new Error("Post container for comment not found.");
                        }

                        // 2. Click the comment button to expand the input field (if not already expanded)
                        const initialCommentBtn = findPostActionButton(postContainer, 'Comment');
                        if (initialCommentBtn) {
                           initialCommentBtn.click();
                        }
                        
                        // Wait briefly for the UI to expand the text area
                        setTimeout(() => {
                            // 3. Find the actual text input area (contenteditable div for comment)
                            const commentInput = postContainer.querySelector('[contenteditable="true"], .editor-container .ql-editor');
                            // 4. Find the Post button
                            const postButton = findPostActionButton(postContainer, 'Post');

                            if (commentInput && postButton) {
                                // Set the text and dispatch events to trigger LinkedIn's internal logic
                                commentInput.textContent = request.text;
                                commentInput.dispatchEvent(new Event('input', { bubbles: true }));
                                commentInput.dispatchEvent(new Event('change', { bubbles: true }));
                                
                                // Click the post button
                                postButton.click();
                                respond("SUCCESS", "Comment posted on LinkedIn.");
                            } else {
                                respond("ERROR", null, "Comment input field or Post button not found after clicking comment.");
                            }
                        }, 700); // 700ms delay to wait for UI transition
                        return true; // Keep connection open for the async response

                    case 'follow':
                    case 'connect':
                        // Search for the first 'Follow' or 'Connect' button visible on the page (usually primary actions)
                        targetElement = document.querySelector('button:is([aria-label*="Follow"], [aria-label*="Connect"])');
                        
                        if (targetElement) {
                            targetElement.click();
                            successMessage = `Follow/Connect action executed.`;
                        } else {
                            throw new Error("Follow or Connect button not found on the page.");
                        }
                        break;

                    case 'story':
                        // Scroll down to view the next post
                        window.scrollBy(0, window.innerHeight * 0.8); // Scroll 80% of the viewport height
                        successMessage = "Scrolled down to view the next post/story on LinkedIn.";
                        break;

                    default:
                        respond("ERROR", null, `Unknown command: ${request.command}`);
                        return true;
                }
                
                // Only for synchronous commands (like, follow, story)
                if (successMessage) {
                    respond("SUCCESS", successMessage);
                }

            } catch (error) {
                respond("ERROR", null, `Execution failed on LinkedIn: ${error.message}`);
            }

            return true;
        }
    );
})();
