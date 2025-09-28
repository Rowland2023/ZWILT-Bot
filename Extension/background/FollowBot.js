// Extension/background/FollowBot.js

import BotService from './BotService.js';
import FacebookController from '../src/controllers/FacebookController.js'; // Swap dynamically if needed

export default class FollowBot extends BotService {
  constructor(settings) {
    super(settings);
    this.controller = new FacebookController(); // Consider dynamic controller mapping
    this.tabId = settings.tabId; // ✅ Ensure tabId is passed in settings
  }

  async execute() {
    try {
      const result = await this.controller.followNextUser(this.tabId);
      console.log(`${this.constructor.name} followed user:`, result);
    } catch (error) {
      console.error(`${this.constructor.name} failed to follow user:`, error);
    }
  }
}
