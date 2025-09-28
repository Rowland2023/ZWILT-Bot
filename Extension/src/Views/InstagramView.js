import BaseView from './BaseView.js';
export default class InstagramView extends BaseView {
  constructor() {
    super("#instagramPanel");
  }

  renderStatus(status) {
    this.clear();
    this.append(`<h3>Instagram Bot Status</h3>`);
    this.append(`<p>Likes: ${status.progress}</p>`);
  }
}
