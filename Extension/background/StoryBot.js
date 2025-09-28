// Extension/background/StoryBot.js

import BotService from './BotService.js';
import InstagramController from '../src/controllers/InstagramController.js'; // Swap based on platform

export default class StoryBot extends BotService {
  constructor(settings) {
    super(settings);
    this.controller = new InstagramController(); // Consider dynamic controller mapping
    this.tabId = settings.tabId; // ✅ Ensure tabId is passed in settings
  }

  async execute() {
    try {
      const result = await this.controller.viewNextStory(this.tabId);
      console.log(`${this.constructor.name} viewed story:`, result);
    } catch (error) {
      console.error(`${this.constructor.name} failed to view story:`, error);
    }
  }
}
