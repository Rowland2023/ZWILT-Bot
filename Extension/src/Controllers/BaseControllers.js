export default class BaseController {
  constructor(platform) {
    this.platform = platform;
    this.scriptMap = {
      facebook: "src/content/facebookController.js",
      instagram: "src/content/instagramController.js",
      twitter: "src/content/twitterController.js"
    };
  }

  /**
   * Injects the content script for the current platform.
   */
  async injectContentScript(tabId) {
    const scriptPath = this.scriptMap[this.platform];
    if (!scriptPath) throw new Error(`No script found for platform: ${this.platform}`);

    await chrome.scripting.executeScript({
      target: { tabId },
      files: [scriptPath]
    });
  }

  /**
   * Sends a command to the content script running in the tab.
   */
  async sendCommand(tabId, command, payload = {}) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, { command, ...payload }, response => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }
}
