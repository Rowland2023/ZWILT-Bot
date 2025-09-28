import BaseController from './BaseController.js';

export default class PinterestController extends BaseController {
  constructor() {
    super("pinterest");
  }

  async followNextBoard(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "follow");
  }

  async saveNextPin(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "story"); // repurposed as "story" action
  }

  async likeNextPin(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "like");
  }

  async unlikeNextPin(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "unlike");
  }

  async commentOnNextPin(tabId, text) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "comment", { text });
  }
}
