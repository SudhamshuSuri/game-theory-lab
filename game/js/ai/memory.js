export class AgentMemory {
  constructor() {
    this.interactions = {};
  }

  record(agentId, playerChoice, aiChoice, outcome) {
    if (!this.interactions[agentId]) {
      this.interactions[agentId] = [];
    }
    this.interactions[agentId].push({
      playerChoice,
      aiChoice,
      outcome,
      timestamp: Date.now(),
    });
  }

  getHistory(agentId, limit = null) {
    const history = this.interactions[agentId] || [];
    return limit ? history.slice(-limit) : history;
  }

  getRecentInteractions(agentId, count = 5) {
    return this.getHistory(agentId, count);
  }

  getPlayerCooperationRate(agentId) {
    const history = this.getHistory(agentId);
    if (history.length === 0) return 0.5;
    const coopChoices = history.filter(
      h => h.playerChoice === 'honor' || h.playerChoice === 'share' ||
           h.playerChoice === 'cooperate' || h.playerChoice === 'fair'
    ).length;
    return coopChoices / history.length;
  }

  getPlayerDefectionRate(agentId) {
    return 1 - this.getPlayerCooperationRate(agentId);
  }

  getMutualCooperationCount(agentId) {
    return this.getHistory(agentId).filter(
      h => (h.playerChoice === 'honor' || h.playerChoice === 'share' || h.playerChoice === 'cooperate') &&
           (h.aiChoice === 'honor' || h.aiChoice === 'share' || h.aiChoice === 'cooperate')
    ).length;
  }

  clear(agentId = null) {
    if (agentId) {
      delete this.interactions[agentId];
    } else {
      this.interactions = {};
    }
  }
}

export const agentMemory = new AgentMemory();
