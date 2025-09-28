import BaseController from './BaseController.js';

export default class InstagramController extends BaseController {
  constructor() {
    super("instagram");
  }

  async likeNextPost(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "like");
  }

  async followNextUser(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "follow");
  }

  async commentOnNextPost(tabId, text) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "comment", { text });
  }

  async viewNextStory(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "viewStory");
  }
}
