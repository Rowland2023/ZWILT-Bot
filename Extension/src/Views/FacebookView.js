import BaseView from './BaseView.js';
export default class FacebookView extends BaseView {
  constructor() {
    super("#facebookPanel");
  }

  renderStatus(status) {
    this.clear();
    this.append(`<h3>Facebook Bot Status</h3>`);
    this.append(`<p>Following: ${status.progress} / ${status.maxTasks}</p>`);
  }
}
