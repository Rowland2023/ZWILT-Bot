// Extension/background/FollowBot.js

import BotService from './BotService.js';
import FacebookController from '../src/controllers/FacebookController.js'; // or InstagramController, etc.

export default class FollowBot extends BotService {
  constructor(settings) {
    super(settings);
    this.controller = new FacebookController(); // Replace with dynamic platform if needed
  }

  execute() {
    try {
      this.controller.followNextUser();
    } catch (error) {
      console.error(`${this.constructor.name} failed to follow user:`, error);
    }
  }
}
