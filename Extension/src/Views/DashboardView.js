export default class DashboardView {
  constructor() {
    this.statusDisplay = document.getElementById("statusDisplay");
    this.commentInput = document.getElementById("commentText");
    this.botButtons = {
      FollowBot: "startFollowBot",
      LikeBot: "startLikeBot",
      CommentBot: "startCommentBot",
      UnlikeBot: "startUnlikeBot",
      StoryBot: "startStoryBot"
    };
    this._bindEvents();
  }

  _bindEvents() {
    Object.entries(this.botButtons).forEach(([botName, buttonId]) => {
      const button = document.getElementById(buttonId);
      if (!button) return;

      button.addEventListener("click", () => {
        if (botName === "CommentBot") {
          const commentText = this.commentInput?.value?.trim();
          if (!commentText) {
            this._updateStatus("⚠️ Please enter a comment before starting CommentBot.", "error");
            return;
          }
          this._sendCommand("START_TASK", botName, { text: commentText });
        } else {
          this._sendCommand("START_TASK", botName);
        }
      });
    });

    document.getElementById("stopAllBots")?.addEventListener("click", () => {
      this._sendCommand("STOP_ALL");
    });
  }

  _sendCommand(type, taskName = null, params = {}) {
    const payload = { type, taskName, ...params };

    chrome.runtime.sendMessage(payload, response => {
      if (chrome.runtime.lastError) {
        console.error("Messaging Error:", chrome.runtime.lastError.message);
        this._updateStatus(`❌ ${taskName || "All Bots"} failed: ${chrome.runtime.lastError.message}`, "error");
        return;
      }

      const status = response?.status || "No response";
      this._updateStatus(`${taskName || "All Bots"}: ${status}`, status === "SUCCESS" ? "success" : "error");
    });
  }

  _updateStatus(message, type = "default") {
    if (!this.statusDisplay) return;

    const colors = {
      success: "#28a745",
      error: "#dc3545",
      default: "#333"
    };

    this.statusDisplay.textContent = message;
    this.statusDisplay.style.color = colors[type] || colors.default;
    this.statusDisplay.style.display = "block";
  }
}
