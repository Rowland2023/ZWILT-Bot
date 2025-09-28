import BaseView from './BaseView.js';
export default class TikTokView extends BaseView {
  constructor() {
    super("#tiktokPanel");
  }

  renderStatus(status) {
    this.clear();
    this.append(`<h3>TikTok Bot Status</h3>`);
    this.append(`<p>Videos Viewed: ${status.progress}</p>`);
  }
}
