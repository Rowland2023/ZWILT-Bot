document.addEventListener('DOMContentLoaded', () => {
  const statusDisplay = document.getElementById('statusDisplay');

  function updateStatus(message, type = 'default') {
    const classes = {
      default: 'bg-gray-100 text-gray-700',
      success: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700'
    };
    statusDisplay.className = `mb-4 p-3 text-sm font-medium rounded-lg shadow-inner ${classes[type]} transition duration-300`;
    statusDisplay.textContent = message;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    if (!activeTab || activeTab.url.startsWith('chrome://')) {
      updateStatus("Extension cannot run on this page. Navigate to the target website.", 'error');
      return;
    }

    function handleBotAction(botName, action) {
      updateStatus(`Preparing to run ${botName}...`);

      // Dynamically inject the content script before messaging
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: [`src/content/${botName.replace('Bot', '').toLowerCase()}Controller.js`]
      }, () => {
        chrome.tabs.sendMessage(activeTab.id, {
          action: action,
          bot: botName
        }, (response) => {
          if (chrome.runtime.lastError) {
            updateStatus("Content script not running. Check manifest permissions.", 'error');
            console.error("Content Script Error:", chrome.runtime.lastError.message);
            return;
          }

          if (response?.status === "SUCCESS") {
            updateStatus(`${botName} started successfully!`, 'success');
          } else if (response?.status === "STOPPED") {
            updateStatus(`All bots stopped.`, 'default');
          } else if (response?.message) {
            updateStatus(`Error: ${response.message}`, 'error');
          } else {
            updateStatus(`Command sent, but response was inconclusive.`, 'default');
          }
        });
      });
    }

    // Attach listeners
    document.getElementById('startFollowBot')?.addEventListener('click', () => handleBotAction('FollowBot', 'START_TASK'));
    document.getElementById('startLikeBot')?.addEventListener('click', () => handleBotAction('LikeBot', 'START_TASK'));
    document.getElementById('startCommentBot')?.addEventListener('click', () => handleBotAction('CommentBot', 'START_TASK'));
    document.getElementById('startUnlikeBot')?.addEventListener('click', () => handleBotAction('UnlikeBot', 'START_TASK'));
    document.getElementById('startStoryBot')?.addEventListener('click', () => handleBotAction('StoryBot', 'START_TASK'));
    document.getElementById('stopAllBots')?.addEventListener('click', () => handleBotAction('AllBots', 'STOP_TASK'));

    updateStatus("Ready to run bot.", 'default');
  });
});
