// Extension/src/views/DashboardView.js

export default class DashboardView {
  constructor() {
    this.statusDisplay = document.getElementById("statusDisplay");
    this._bindEvents();
  }

  _bindEvents() {
    document.getElementById("startFollowBot").addEventListener("click", () => this._sendCommand("START_TASK", "FollowBot"));
    document.getElementById("startLikeBot").addEventListener("click", () => this._sendCommand("START_TASK", "LikeBot"));
    document.getElementById("startCommentBot").addEventListener("click", () => this._sendCommand("START_TASK", "CommentBot"));
    document.getElementById("startUnlikeBot").addEventListener("click", () => this._sendCommand("START_TASK", "UnlikeBot"));
    document.getElementById("startStoryBot").addEventListener("click", () => this._sendCommand("START_TASK", "StoryBot"));
    document.getElementById("stopAllBots").addEventListener("click", () => this._sendCommand("STOP_ALL"));
  }

  _sendCommand(type, taskName = null) {
    chrome.runtime.sendMessage({ type, taskName }, response => {
      this._updateStatus(`${taskName || "All Bots"}: ${response.status}`);
    });
  }

  _updateStatus(message) {
    if (this.statusDisplay) {
      this.statusDisplay.textContent = message;
    }
  }
}
