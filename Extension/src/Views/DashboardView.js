// Extension/src/views/DashboardView.js

import BaseView from './BaseView.js';

export default class DashboardView extends BaseView {
  constructor() {
    super("#statusDisplay");
    this._bindEvents();
  }

  _bindEvents() {
    this._bindBotButton("#startFollowBot", "FollowBot");
    this._bindBotButton("#startLikeBot", "LikeBot");
    this._bindBotButton("#startCommentBot", "CommentBot");
    this._bindBotButton("#startUnlikeBot", "UnlikeBot");
    this._bindBotButton("#startStoryBot", "StoryBot");

    this.bindClick("#stopAllBots", () => this._sendCommand("STOP_ALL"));
  }

  _bindBotButton(selector, botName) {
    this.bindClick(selector, () => this._sendCommand("START_TASK", botName));
  }

  _sendCommand(type, taskName = null) {
    chrome.runtime.sendMessage({ type, taskName }, response => {
      const status = response?.status || "No response";
      this.showStatus(`${taskName || "All Bots"}: ${status}`, "info");
    });
  }
}
