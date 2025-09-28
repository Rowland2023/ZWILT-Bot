// Extension/src/models/TwitterModel.js
import BaseModel from './BaseModel.js';

export default class TwitterModel extends BaseModel {
  constructor(config = {}) {
    super({ ...config, platform: "twitter" });
  }

  getProfileUrl(handle) {
    return `https://twitter.com/${handle}`;
  }
}
