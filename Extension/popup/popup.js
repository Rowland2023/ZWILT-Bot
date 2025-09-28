/**
 * ZWILT Bot: Popup Controller
 * Handles UI rendering, button events, and script injection/messaging.
 */
document.addEventListener('DOMContentLoaded', () => {
  const statusDisplay = document.getElementById('global-status-display');
  const networksContainer = document.getElementById('networks-container');
  const commentInputArea = document.getElementById('comment-input-area');
  const commentInput = document.getElementById('comment-text-input');

  const networks = [
    "Facebook", "Instagram", "Pinterest", "Twitter", "TikTok", "Tinder", "LinkedIn"
  ];

  const bots = [
    { label: "Comment", command: "comment", requiresInput: true, color: "bg-green-500" },
    { label: "Like", command: "like", requiresInput: false, color: "bg-red-500" },
    { label: "Unlike", command: "unlike", requiresInput: false, color: "bg-yellow-500" },
    { label: "Follow", command: "follow", requiresInput: false, color: "bg-blue-500" },
    { label: "Story", command: "story", requiresInput: false, color: "bg-purple-500" }
  ];

  let activeBotCommand = null;

  function updateStatus(message, type = 'default') {
    const classes = {
      default: 'bg-gray-200 text-gray-700',
      success: 'bg-green-100 text-green-700 font-semibold',
      error: 'bg-red-100 text-red-700 font-semibold'
    };
    statusDisplay.className = `p-2 rounded-lg text-sm transition-all ${classes[type]}`;
    statusDisplay.textContent = message;
    statusDisplay.style.display = 'block';
  }

  function updateInputVisibility() {
    if (commentInputArea) {
      commentInputArea.classList.toggle('hidden', activeBotCommand !== 'comment');
    }
  }

  function injectUI() {
    networks.forEach(network => {
      const section = document.createElement('div');
      section.className = 'network-section p-4 bg-white rounded-xl shadow-md mb-4';
      section.innerHTML = `<h2 class="text-xl font-bold text-indigo-700 mb-3">${network}</h2><div class="bot-buttons grid grid-cols-3 sm:grid-cols-5 gap-2" id="${network}-buttons"></div>`;
      networksContainer.appendChild(section);

      const buttonGroup = section.querySelector('.bot-buttons');
      bots.forEach(bot => {
        const btn = document.createElement('button');
        btn.className = `bot-btn w-full ${bot.color} text-white font-medium py-2 rounded-lg shadow-lg hover:opacity-90 transition duration-150 text-xs`;
        btn.textContent = `${bot.label}Bot`;
        btn.dataset.network = network;
        btn.dataset.command = bot.command;
        btn.dataset.requiresInput = bot.requiresInput;
        buttonGroup.appendChild(btn);
      });
    });
  }

  function handleBotAction(network, command, buttonEl) {
    activeBotCommand = command;
    updateInputVisibility();

    const controllerPath = `src/content/${network.toLowerCase()}Controller.js`;
    let commentText = '';

    if (command === 'comment') {
      if (!commentInput) {
        updateStatus("Comment input field missing.", 'error');
        return;
      }
      commentText = commentInput.value.trim();
      if (!commentText) {
        updateStatus("CommentBot requires text input.", 'error');
        return;
      }
    }

    updateStatus(`Preparing ${command} on ${network}...`, 'default');
    buttonEl.disabled = true;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || activeTab.url.startsWith('chrome://')) {
        updateStatus("Extension cannot run on this page.", 'error');
        buttonEl.disabled = false;
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: [controllerPath]
      }, () => {
        buttonEl.disabled = false;

        if (chrome.runtime.lastError) {
          updateStatus(`Failed to inject controller. File not found: "${controllerPath}"`, 'error');
          console.error("Injection Error:", controllerPath, chrome.runtime.lastError.message);
          return;
        }

        setTimeout(() => {
          chrome.tabs.sendMessage(activeTab.id, {
            command,
            network,
            text: commentText
          }, (response) => {
            if (chrome.runtime.lastError) {
              updateStatus("Messaging failed. Content script didn't respond (Did it crash?).", 'error');
              console.error("Messaging Error:", chrome.runtime.lastError.message);
              return;
            }

            if (response?.status === "SUCCESS") {
              updateStatus(`${command} executed on ${network}!`, 'success');
              if (command === 'comment') commentInput.value = '';
            } else {
              updateStatus(`Error: ${response?.reason || "Unknown failure"}`, 'error');
            }
          });
        }, 100);
      });
    });
  }

  injectUI();
  updateInputVisibility();
  updateStatus("Ready to run bots.", 'default');

  networksContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('bot-btn')) {
      const network = e.target.dataset.network;
      const command = e.target.dataset.command;
      const requiresInput = e.target.dataset.requiresInput === 'true';

      activeBotCommand = requiresInput ? command : null;
      updateInputVisibility();

      handleBotAction(network, command, e.target);
    }
  });
});
