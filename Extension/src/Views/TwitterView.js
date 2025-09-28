import BaseView from './BaseView.js';
export default class TwitterView extends BaseView {
  constructor() {
    super("#twitterPanel");
  }

  renderStatus(status) {
    this.clear();
    this.append(`<h3>Twitter Bot Status</h3>`);
    this.append(`<p>Likes: ${status.progress}</p>`);
  }
}
