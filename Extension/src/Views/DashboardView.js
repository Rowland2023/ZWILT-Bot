export default class DashboardView {
  constructor() {
    this.statusDisplay = document.getElementById("statusDisplay");
    this._bindEvents();
  }

  _bindEvents() {
    document.getElementById("startFollowBot").addEventListener("click", () => this._sendCommand("START_TASK", "FollowBot"));
    document.getElementById("startLikeBot").addEventListener("click", () => this._sendCommand("START_TASK", "LikeBot"));
    document.getElementById("startCommentBot").addEventListener("click", () => {
      const commentText = document.getElementById("commentText")?.value?.trim();
      if (!commentText) {
        this._updateStatus("Please enter a comment before starting CommentBot.");
        return;
      }
      this._sendCommand("START_TASK", "CommentBot", commentText);
    });
    document.getElementById("startUnlikeBot").addEventListener("click", () => this._sendCommand("START_TASK", "UnlikeBot"));
    document.getElementById("startStoryBot").addEventListener("click", () => this._sendCommand("START_TASK", "StoryBot"));
    document.getElementById("stopAllBots").addEventListener("click", () => this._sendCommand("STOP_ALL"));
  }

  _sendCommand(type, taskName = null, text = null) {
    const payload = { type, taskName };
    if (text) payload.text = text;

    chrome.runtime.sendMessage(payload, response => {
      this._updateStatus(`${taskName || "All Bots"}: ${response.status}`);
    });
  }

  _updateStatus(message) {
    if (this.statusDisplay) {
      this.statusDisplay.textContent = message;
    }
  }
}
