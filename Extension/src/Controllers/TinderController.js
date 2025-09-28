// Extension/src/controllers/TinderController.js

import BaseController from './BaseController.js';

export default class TinderController extends BaseController {
  constructor() {
    super("tinder");
  }

  async swipeRight(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "swipeRight");
  }

  async superLike(tabId) {
    await this.injectContentScript(tabId);
    return this.sendCommand(tabId, "superLike");
  }
}
