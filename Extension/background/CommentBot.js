// Extension/background/CommentBot.js

import BotService from './BotService.js';
import InstagramController from '../src/controllers/InstagramController.js'; // Swap based on platform

export default class CommentBot extends BotService {
  constructor(settings) {
    super(settings);
    this.controller = new InstagramController(); // Dynamically swap based on settings.platform if needed
    this.comments = settings.comments || [
      "Awesome!",
      "🔥🔥🔥",
      "Love this!",
      "Great post!"
    ];
    this.tabId = settings.tabId; // ✅ Ensure tabId is passed in settings
  }

  async execute() {
    const comment = this._getNextComment();
    try {
      const result = await this.controller.commentOnNextPost(this.tabId, comment);
      console.log(`${this.constructor.name} commented:`, result);
    } catch (error) {
      console.error(`${this.constructor.name} failed to comment:`, error);
    }
  }

  _getNextComment() {
    return this.comments[this.progress % this.comments.length];
  }
}
