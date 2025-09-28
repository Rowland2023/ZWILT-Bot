import FacebookBot from './Bots/FacebookBot.js';
// Add other bots like InstagramBot, TwitterBot, etc.

export default class BaseController {
  static handle(message, sender, sendResponse) {
    const botMap = {
      FacebookBot: FacebookBot,
      // InstagramBot: InstagramBot,
      // TwitterBot: TwitterBot,
      // etc.
    };

    const BotClass = botMap[message.bot];
    if (!BotClass) {
      console.warn("ZWILT Bot: Unknown bot", message.bot);
      sendResponse({ status: "FAILED", reason: "Unknown bot" });
      return;
    }

    const botInstance = new BotClass();
    botInstance.run(message, sender, sendResponse);
  }
}
