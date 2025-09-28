import BaseView from './BaseView.js';
export default class TinderView extends BaseView {
  constructor() {
    super("#tinderPanel");
  }

  renderStatus(status) {
    this.clear();
    this.append(`<h3>Tinder Bot Status</h3>`);
    this.append(`<p>Swipes: ${status.progress}</p>`);
  }
}
