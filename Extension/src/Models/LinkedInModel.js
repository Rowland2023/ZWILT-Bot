// Extension/src/models/LinkedInModel.js
import BaseModel from './BaseModel.js';

export default class LinkedInModel extends BaseModel {
  constructor(config = {}) {
    super({ ...config, platform: "linkedin" });
  }

  getProfileUrl(profileId) {
    return `https://www.linkedin.com/in/${profileId}`;
  }
}
