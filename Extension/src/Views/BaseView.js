// Extension/src/views/BaseView.js

export default class BaseView {
  constructor(rootSelector) {
    this.root = document.querySelector(rootSelector);
    if (!this.root) {
      throw new Error(`BaseView: Root element "${rootSelector}" not found.`);
    }
  }

  /**
   * Clears the view content.
   */
  clear() {
    this.root.innerHTML = "";
  }

  /**
   * Renders HTML content inside the view.
   * @param {string} html
   */
  render(html) {
    this.root.innerHTML = html;
  }

  /**
   * Appends HTML content to the view.
   * @param {string} html
   */
  append(html) {
    this.root.insertAdjacentHTML("beforeend", html);
  }

  /**
   * Binds a click event to a selector inside the view.
   * @param {string} selector
   * @param {Function} handler
   */
  bindClick(selector, handler) {
    const element = this.root.querySelector(selector);
    if (element) {
      element.addEventListener("click", handler);
    }
  }

  /**
   * Shows a status message.
   * @param {string} message
   * @param {string} type - success, error, info
   */
  showStatus(message, type = "info") {
    const color = {
      success: "green",
      error: "red",
      info: "blue"
    }[type] || "black";

    this.append(`<p style="color:${color};">${message}</p>`);
  }
}
