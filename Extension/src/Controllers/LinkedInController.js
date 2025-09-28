// Extension/src/controllers/LinkedInController.js

import BaseController from './BaseController.js';

export default class LinkedInController extends BaseController {
  constructor() {
    super("linkedin");
  }

  async connectWithNextUser(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "connect");
  }

  async likeNextPost(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "like");
  }

  async commentOnNextPost(tabId, text) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "comment", { text });
  }
}
