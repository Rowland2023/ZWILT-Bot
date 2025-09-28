// Extension/background/LikeBot.js

import BotService from './BotService.js';
import InstagramController from '../src/controllers/InstagramController.js'; // Swap based on platform

export default class LikeBot extends BotService {
  constructor(settings) {
    super(settings);
    this.controller = new InstagramController(); // Consider dynamic controller mapping
    this.tabId = settings.tabId; // ✅ Ensure tabId is passed in settings
  }

  async execute() {
    try {
      const result = await this.controller.likeNextPost(this.tabId);
      console.log(`${this.constructor.name} liked post:`, result);
    } catch (error) {
      console.error(`${this.constructor.name} failed to like post:`, error);
    }
  }
}
