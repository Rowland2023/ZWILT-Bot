// Extension/background/CommentBot.js

import BotService from './BotService.js';
import InstagramController from '../src/controllers/InstagramController.js'; // or FacebookController, etc.

export default class CommentBot extends BotService {
  constructor(settings) {
    super(settings);
    this.controller = new InstagramController(); // Swap based on platform
    this.comments = settings.comments || [
      "Awesome!",
      "🔥🔥🔥",
      "Love this!",
      "Great post!"
    ];
  }

  execute() {
    const comment = this._getNextComment();
    try {
      this.controller.commentOnNextPost(comment);
    } catch (error) {
      console.error(`${this.constructor.name} failed to comment:`, error);
    }
  }

  _getNextComment() {
    return this.comments[this.progress % this.comments.length];
  }
}
