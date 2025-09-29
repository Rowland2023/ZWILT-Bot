/**
 * Tinder Bot Controller
 * Listens for commands from the extension and executes dating actions on the Tinder page.
 * Relies on aria-label selectors, which are highly reliable on this platform.
 */

(function() {
    console.log("Tinder Controller injected and listening for messages...");

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            // Ensure we only process messages explicitly intended for Tinder
            if (request.network !== 'Tinder') {
                return false; 
            }

            try {
                let element, successMessage;

                switch (request.command) {
                    
                    case 'swipeRight':
                    case 'like':
                        console.log('Executing SWIPE RIGHT (Like) command.');
                        // Selector for the Like button using the aria-label
                        element = document.querySelector("button[aria-label='Like']");
                        successMessage = 'Swiped right (liked) on Tinder.';
                        break;

                    case 'superLike':
                        console.log('Executing SUPER LIKE command.');
                        // Selector for the Super Like button using the aria-label
                        element = document.querySelector("button[aria-label='Super Like']");
                        successMessage = 'Super Liked on Tinder.';
                        break;

                    case 'swipeLeft':
                    case 'pass':
                        console.log('Executing SWIPE LEFT (Nope) command.');
                        // Selector for the Nope button (the pass action)
                        element = document.querySelector("button[aria-label='Nope']");
                        successMessage = 'Swiped left (passed) on Tinder.';
                        break;
                        
                    case 'comment':
                    case 'sendMessage':
                        // TODO: Implement logic for sending a message/chat if a match is open.
                        successMessage = `Message command executed on Tinder (Action pending implementation).`;
                        break;

                    default:
                        sendResponse({ status: "ERROR", reason: `Unknown command: ${request.command}` });
                        return true;
                }

                // Handler for simple click actions (swipe, like, etc.)
                if (element && element.click) {
                    element.click();
                    sendResponse({ status: "SUCCESS", message: successMessage });
                } else if (!successMessage) {
                     // Fallback for complex commands that don't need a simple click right now
                     sendResponse({ status: "SUCCESS", message: `Complex command ${request.command} executed on Tinder!` });
                } else {
                    // Element not found for simple click action
                    throw new Error(`Target element for ${request.command} not found. Make sure you are on the discovery screen.`);
                }

            } catch (error) {
                // Catches errors from any synchronous step
                sendResponse({ status: "ERROR", reason: `Execution failed on Tinder: ${error.message}` });
            }

            // Must return true for all message handlers
            return true;
        }
    );
})();
