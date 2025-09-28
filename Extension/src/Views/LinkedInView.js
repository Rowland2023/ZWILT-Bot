import BaseView from './BaseView.js';
export default class LinkedInView extends BaseView {
  constructor() {
    super("#linkedinPanel");
  }

  renderStatus(status) {
    this.clear();
    this.append(`<h3>LinkedIn Bot Status</h3>`);
    this.append(`<p>Connections Sent: ${status.progress}</p>`);
  }
}
