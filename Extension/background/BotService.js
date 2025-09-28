// Extension/background/BotService.js

export default class BotService {
  constructor(settings) {
    this.settings = settings;
    this.isActive = false;
    this.loopInterval = null;
    this.progress = 0;
    this.maxTasks = settings.maxTasks || 10;
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.progress = 0;
    console.log(`${this.constructor.name} started`);
    this.loop();
  }

  stop() {
    if (!this.isActive) return;
    this.isActive = false;
    clearTimeout(this.loopInterval);
    this.loopInterval = null;
    console.log(`${this.constructor.name} stopped`);
  }

  loop() {
    if (!this.isActive || this.progress >= this.maxTasks) {
      this.stop();
      return;
    }

    try {
      this.execute();
      this.progress++;
      console.log(`${this.constructor.name} progress: ${this.progress}/${this.maxTasks}`);
    } catch (error) {
      console.error(`${this.constructor.name} execution error:`, error);
    }

    this.loopInterval = setTimeout(() => this.loop(), this.settings.interval || 1000);
  }

  execute() {
    // To be overridden by subclasses (e.g., FollowBot, LikeBot)
    // Typically calls a method on BaseController
  }
}
