// Extension/src/models/PinterestModel.js
import BaseModel from './BaseModel.js';

export default class PinterestModel extends BaseModel {
  constructor(config = {}) {
    super({ ...config, platform: "pinterest" });
  }

  getBoardUrl(boardId) {
    return `https://www.pinterest.com/${boardId}`;
  }
}
