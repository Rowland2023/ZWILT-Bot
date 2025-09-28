import BaseView from './BaseView.js';

export default class FacebookView extends BaseView {
  constructor() {
    super("#facebookPanel");
  }

  /**
   * Renders the bot status panel for Facebook.
   * @param {{ progress: number, maxTasks: number }} status
   */
  renderStatus(status) {
    this.render(`
      <div class="bot-status">
        <h3>📘 Facebook Bot Status</h3>
        <p><strong>Progress:</strong> ${status.progress} / ${status.maxTasks}</p>
        <progress value="${status.progress}" max="${status.maxTasks}"></progress>
      </div>
    `);
  }
}
