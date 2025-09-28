// Extension/src/models/FacebookModel.js
import BaseModel from './BaseModel.js';

export default class FacebookModel extends BaseModel {
  constructor(config = {}) {
    super({ ...config, platform: "facebook" });
  }

  getProfileUrl(userId) {
    return `https://www.facebook.com/${userId}`;
  }
}
