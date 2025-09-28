// Extension/src/controllers/TikTokController.js

import BaseController from './BaseController.js';

export default class TikTokController extends BaseController {
  constructor() {
    super("tiktok");
  }

  async likeNextVideo(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "like");
  }

  async followNextCreator(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "follow");
  }

  async commentOnNextVideo(tabId, text) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "comment", { text });
  }

  async viewNextVideo(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "viewVideo");
  }
}
