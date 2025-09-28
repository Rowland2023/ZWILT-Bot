import BaseController from './BaseController.js';

export default class LinkedInController extends BaseController {
  constructor() {
    super("linkedin");
  }

  async connectWithNextUser(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "follow"); // standardize as "follow"
  }

  async likeNextPost(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "like");
  }

  async unlikeNextPost(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "unlike");
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
