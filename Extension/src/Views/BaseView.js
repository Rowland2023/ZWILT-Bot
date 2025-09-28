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
    this.root.textContent = ""; // faster than innerHTML for clearing
  }

  /**
   * Renders HTML content inside the view.
   * @param {string} html
   */
  render(html) {
    this.clear();
    this.root.insertAdjacentHTML("afterbegin", html);
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
    element?.addEventListener("click", handler);
  }

  /**
   * Binds delegated click events for dynamic elements.
   * @param {string} selector
   * @param {Function} handler
   */
  bindDelegatedClick(selector, handler) {
    this.root.addEventListener("click", event => {
      if (event.target.matches(selector)) {
        handler(event);
      }
    });
  }

  /**
   * Shows a status message.
   * @param {string} message
   * @param {string} type - success, error, info
   */
  showStatus(message, type = "info") {
    const colors = {
      success: "#28a745",
      error: "#dc3545",
      info: "#007bff"
    };
    this.append(`<p style="color:${colors[type] || "#333"};">${message}</p>`);
  }

  /**
   * Shows a loading spinner.
   * @param {string} message
   */
  showLoading(message = "Loading...") {
    this.append(`<div class="loading"><span>${message}</span></div>`);
  }

  /**
   * Hides the loading spinner.
   */
  hideLoading() {
    const loader = this.root.querySelector(".loading");
    loader?.remove();
  }

  /**
   * Binds input change events.
   * @param {string} selector
   * @param {Function} handler
   */
  bindInput(selector, handler) {
    const input = this.root.querySelector(selector);
    input?.addEventListener("input", event => handler(event.target.value));
  }

  /**
   * Displays an error message.
   * @param {Error|string} error
   */
  showError(error) {
    const message = typeof error === "string" ? error : error.message;
    this.showStatus(message, "error");
  }
}
