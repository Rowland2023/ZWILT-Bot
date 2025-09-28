import BaseController from './BaseController.js';

export default class TwitterController extends BaseController {
  constructor() {
    super("twitter");
  }

  async likeNextTweet(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "like");
  }

  async unlikeNextTweet(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "unlike");
  }

  async followNextUser(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "follow");
  }

  async commentOnNextTweet(tabId, text) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "comment", { text });
  }

  async viewNextStory(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "story");
  }
}
