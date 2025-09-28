import BaseController from './BaseController.js';

export default class TinderController extends BaseController {
  constructor() {
    super("tinder");
  }

  async likeNextProfile(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "like"); // maps to swipeRight
  }

  async unlikePreviousProfile(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "unlike"); // optional: undo swipe
  }

  async superLike(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "story"); // repurposed for superLike
  }

  async followMatch(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "follow"); // maps to match or message
  }

  async commentOnMatch(tabId, text) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "comment", { text }); // maps to message
  }
}
