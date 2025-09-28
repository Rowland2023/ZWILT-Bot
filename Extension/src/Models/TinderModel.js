// Extension/src/models/TinderModel.js
import BaseModel from './BaseModel.js';

export default class TinderModel extends BaseModel {
  constructor(config = {}) {
    super({ ...config, platform: "tinder" });
  }

  getMatchSummary(matchId) {
    return `Match ID: ${matchId}`;
  }
}
