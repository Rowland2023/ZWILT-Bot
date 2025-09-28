import BaseController from './BaseController.js';

export default class FacebookController extends BaseController {
  constructor() {
    super("facebook");
  }

  async likeNextPost(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "like");
  }

  async unlikeNextPost(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "unlike");
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
    return this.sendCommand(tabId, "story");
  }
}
