// Extension/src/models/TikTokModel.js
import BaseModel from './BaseModel.js';

export default class TikTokModel extends BaseModel {
  constructor(config = {}) {
    super({ ...config, platform: "tiktok" });
  }

  getProfileUrl(username) {
    return `https://www.tiktok.com/@${username}`;
  }
}
