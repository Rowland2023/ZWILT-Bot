// Extension/src/models/InstagramModel.js
import BaseModel from './BaseModel.js';

export default class InstagramModel extends BaseModel {
  constructor(config = {}) {
    super({ ...config, platform: "instagram" });
  }

  getProfileUrl(username) {
    return `https://www.instagram.com/${username}`;
  }
}
