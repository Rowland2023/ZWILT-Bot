/**
 * Tinder Bot Controller
 * Listens for commands from the extension and executes actions on the Tinder web platform.
 * Relies on the 'title' and 'aria-label' attributes of the main action buttons.
 */

(function() {
    // Check if the listener is already registered to prevent duplication
    if (window.hasTinderListener) return;
    window.hasTinderListener = true;
    
    console.log("Tinder Controller injected and listening for messages...");

    // Helper map for command to button title mapping
    const actionMap = {
        'like': 'Like',        // Swipes right (Green heart)
        'nope': 'Nope',        // Swipes left (Red X)
        'superLike': 'Super Like' // Swipes up (Blue star)
    };

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            
            // 1. Check intended recipient
            if (request.network !== 'Tinder') {
                return false; 
            }

            console.log(`[Tinder Controller] Received command: ${request.command}`);

            // This function calls sendResponse SYNCHRONOUSLY.
            const respond = (status, message, reason) => {
                console.log(`[Tinder Controller] Sending response: ${status} - ${message || reason}`);
                sendResponse({ status, message, reason });
            };

            const targetActionTitle = actionMap[request.command];

            if (!targetActionTitle) {
                respond("ERROR", null, `Unknown command: ${request.command}. Supported commands are like, nope, and superLike.`);
                return true;
            }

            try {
                // 1. Try finding the button based on the 'title' attribute (common in Tinder UI)
                let targetElement = document.querySelector(`button[title="${targetActionTitle}"]`);
                
                if (!targetElement) {
                    // 2. Fallback: Try finding the button using 'aria-label'
                    targetElement = document.querySelector(`button[aria-label="${targetActionTitle}"]`);
                }
                
                if (targetElement) {
                    targetElement.click();
                    respond("SUCCESS", `${request.command} action executed on Tinder.`);
                } else {
                    throw new Error(`Button for '${request.command}' not found. Ensure you are on the main swiping screen.`);
                }

            } catch (error) {
                // If any error occurs in the try block, catch it and send an ERROR response.
                respond("ERROR", null, `Execution failed on Tinder: ${error.message}`);
            }

            return true; // Keep true for compatibility with async messaging pattern
        }
    );
})();
