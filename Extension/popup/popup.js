document.addEventListener('DOMContentLoaded', () => {
  const statusDisplay = document.getElementById('global-status-display');

  const networks = [
    "Facebook", "Instagram", "Pinterest", "Twitter", "TikTok", "Tinder", "LinkedIn"
  ];

  const bots = [
    { label: "Comment", command: "comment" },
    { label: "Like", command: "like" },
    { label: "Unlike", command: "unlike" },
    { label: "Follow", command: "follow" },
    { label: "Story", command: "story" }
  ];

  function updateStatus(message, type = 'default') {
    const classes = {
      default: 'global-status-default',
      success: 'global-status-success',
      error: 'global-status-error'
    };
    statusDisplay.className = classes[type];
    statusDisplay.textContent = message;
    statusDisplay.style.display = 'block';
  }

  function injectUI() {
    const container = document.getElementById('networks-container');
    networks.forEach(network => {
      const section = document.createElement('div');
      section.className = 'network-section';
      section.innerHTML = `<h2>${network}</h2><div class="bot-buttons" id="${network}-buttons"></div>`;
      container.appendChild(section);

      const buttonGroup = section.querySelector('.bot-buttons');
      bots.forEach(bot => {
        const btn = document.createElement('button');
        btn.className = 'bot-btn';
        btn.textContent = `${bot.label}Bot`;
        btn.dataset.network = network;
        btn.dataset.command = bot.command;
        buttonGroup.appendChild(btn);
      });
    });
  }

  function handleBotAction(network, command) {
    updateStatus(`Preparing ${command} on ${network}...`);

    const controllerPath = `src/content/${network.toLowerCase()}Controller.js`;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || activeTab.url.startsWith('chrome://')) {
        updateStatus("Extension cannot run on this page.", 'error');
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: [controllerPath]
      }, () => {
        if (chrome.runtime.lastError) {
          updateStatus("Failed to inject controller.", 'error');
          console.error("Injection Error:", chrome.runtime.lastError.message);
          return;
        }

        chrome.tabs.sendMessage(activeTab.id, {
          command: command,
          bot: `${network}Bot`
        }, (response) => {
          if (chrome.runtime.lastError) {
            updateStatus("Content script not responding.", 'error');
            console.error("Messaging Error:", chrome.runtime.lastError.message);
            return;
          }

          if (response?.status === "SUCCESS") {
            updateStatus(`${command} executed on ${network}!`, 'success');
          } else {
            updateStatus(`Error: ${response?.reason || "Unknown failure"}`, 'error');
          }
        });
      });
    });
  }

  injectUI();

  document.getElementById('networks-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('bot-btn')) {
      const network = e.target.dataset.network;
      const command = e.target.dataset.command;
      handleBotAction(network, command);
    }
  });

  updateStatus("Ready to run bots.", 'default');
});
