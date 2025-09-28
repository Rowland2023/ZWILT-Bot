// Extension/src/controllers/PinterestController.js

import BaseController from './BaseController.js';

export default class PinterestController extends BaseController {
  constructor() {
    super("pinterest");
  }

  async followNextBoard(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "followBoard");
  }

  async saveNextPin(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "savePin");
  }

  async likeNextPin(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "like");
  }
}
