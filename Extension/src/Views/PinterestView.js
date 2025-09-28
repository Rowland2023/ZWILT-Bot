import BaseView from './BaseView.js';
export default class PinterestView extends BaseView {
  constructor() {
    super("#pinterestPanel");
  }

  renderStatus(status) {
    this.clear();
    this.append(`<h3>Pinterest Bot Status</h3>`);
    this.append(`<p>Pins Saved: ${status.progress}</p>`);
  }
}
