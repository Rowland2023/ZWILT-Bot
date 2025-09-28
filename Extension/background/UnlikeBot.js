// Extension/background/UnlikeBot.js

import BotService from './BotService.js';
import InstagramController from '../src/controllers/InstagramController.js'; // or FacebookController, etc.

export default class UnlikeBot extends BotService {
  constructor(settings) {
    super(settings);
    this.controller = new InstagramController(); // Swap based on platform
  }

  execute() {
    try {
      this.controller.unlikeNextPost();
    } catch (error) {
      console.error(`${this.constructor.name} failed to unlike post:`, error);
    }
  }
}
