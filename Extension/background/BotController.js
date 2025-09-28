// Extension/background/BotController.js

import FollowBot from './FollowBot.js';
import LikeBot from './LikeBot.js';
import UnlikeBot from './UnlikeBot.js';
import CommentBot from './CommentBot.js';
import StoryBot from './StoryBot.js';

export default class BotController {
  constructor(settings) {
    this.settings = settings;
    this.bots = {};
    this.botClasses = {
      FollowBot,
      LikeBot,
      UnlikeBot,
      CommentBot,
      StoryBot
    };
  }

  /**
   * Initializes all bot instances with shared settings.
   */
  initializeBots() {
    for (const [name, BotClass] of Object.entries(this.botClasses)) {
      this.bots[name] = new BotClass(this.settings);
    }
  }

  /**
   * Starts a specific bot by name.
   * @param {string} botName
   */
  startBot(botName) {
    const bot = this.bots[botName];
    if (bot && !bot.isActive) {
      try {
        bot.start();
        console.log(`${botName} started`);
      } catch (error) {
        console.error(`Failed to start ${botName}:`, error);
      }
    }
  }

  /**
   * Stops a specific bot by name.
   * @param {string} botName
   */
  stopBot(botName) {
    const bot = this.bots[botName];
    if (bot && bot.isActive) {
      try {
        bot.stop();
        console.log(`${botName} stopped`);
      } catch (error) {
        console.error(`Failed to stop ${botName}:`, error);
      }
    }
  }

  /**
   * Starts all bots.
   */
  startAll() {
    Object.keys(this.bots).forEach(botName => this.startBot(botName));
  }

  /**
   * Stops all bots.
   */
  stopAll() {
    Object.keys(this.bots).forEach(botName => this.stopBot(botName));
  }

  /**
   * Gets the status of all bots.
   * @returns {Array<{name: string, active: boolean}>}
   */
  getAllStatuses() {
    return Object.entries(this.bots).map(([name, bot]) => ({
      name,
      active: bot.isActive
    }));
  }

  /**
   * Checks if any bot is active.
   * @returns {boolean}
   */
  getStatus() {
    return Object.values(this.bots).some(bot => bot.isActive);
  }
}
