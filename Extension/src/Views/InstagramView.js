import BaseView from './BaseView.js';

export default class InstagramView extends BaseView {
  constructor() {
    super("#instagramPanel");
  }

  /**
   * Renders the bot status panel for Instagram.
   * @param {{ progress: number, maxTasks?: number }} status
   */
  renderStatus(status) {
    this.render(`
      <div class="bot-status">
        <h3>📸 Instagram Bot Status</h3>
        <p><strong>Likes:</strong> ${status.progress}${status.maxTasks ? ` / ${status.maxTasks}` : ''}</p>
        ${status.maxTasks ? `<progress value="${status.progress}" max="${status.maxTasks}"></progress>` : ''}
      </div>
    `);
  }
}
