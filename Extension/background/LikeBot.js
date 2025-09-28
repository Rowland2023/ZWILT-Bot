// Extension/background/LikeBot.js

import BotService from './BotService.js';
import InstagramController from '../src/controllers/InstagramController.js'; // or FacebookController, etc.

export default class LikeBot extends BotService {
  constructor(settings) {
    super(settings);
    this.controller = new InstagramController(); // Swap based on platform
  }

  execute() {
    try {
      this.controller.likeNextPost();
    } catch (error) {
      console.error(`${this.constructor.name} failed to like post:`, error);
    }
  }
}
