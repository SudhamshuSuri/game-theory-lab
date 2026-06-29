const COOPERATIVE_CHOICES = ['honor', 'share', 'fair', 'cooperate', 'stag', 'hunt', 'ration', 'negotiate', 'swerve', 'retreat', 'borrow', 'negotiate', 'contribute', 'sustain'];
const DEFECTIVE_CHOICES = ['betray', 'unfair', 'defect', 'seize', 'fight', 'take', 'free_ride'];
const RISKY_CHOICES = ['high', 'seize', 'expedition', 'fight', 'betray', 'unfair'];
const SAFE_CHOICES = ['low', 'ration', 'withdraw', 'negotiate', 'fair', 'honor'];

function isCooperative(id) { return COOPERATIVE_CHOICES.includes(id); }
function isDefective(id) { return DEFECTIVE_CHOICES.includes(id); }
function isRisky(id) { return RISKY_CHOICES.includes(id); }
function isSafe(id) { return SAFE_CHOICES.includes(id); }

export class DecisionEngine {
  makeChoice(agent, playerChoice, scenarioId, choiceIds, gameState, round = 0, history = []) {
    switch (agent.personalityId) {
      case 'alwaysCooperate':
        return this._getCooperative(choiceIds);
      case 'alwaysDefect':
        return this._getDefective(choiceIds);
      case 'titForTat':
        return this._titForTat(playerChoice, history, choiceIds);
      case 'random':
        return this._random(choiceIds);
      case 'greedy':
        return this._greedy(choiceIds);
      case 'riskSeeking':
        return this._riskSeeking(choiceIds);
      case 'riskAverse':
        return this._riskAverse(choiceIds);
      case 'longTermPlanner':
        return this._longTermPlanner(playerChoice, history, choiceIds);
      case 'revengeDriven':
        return this._revengeDriven(playerChoice, history, choiceIds);
      case 'trustBuilder':
        return this._trustBuilder(playerChoice, history, choiceIds);
      case 'opportunist':
        return this._opportunist(playerChoice, history, choiceIds);
      case 'coalitionFormer':
        return this._coalitionFormer(choiceIds, gameState);
      case 'deceptive':
        return this._deceptive(playerChoice, history, choiceIds);
      case 'grimTrigger':
        return this._grimTrigger(playerChoice, history, choiceIds);
      default:
        return this._random(choiceIds);
    }
  }

  _getCooperative(choiceIds) {
    const coop = choiceIds.find(id => isCooperative(id));
    return coop || choiceIds[0];
  }

  _getDefective(choiceIds) {
    const defect = choiceIds.find(id => isDefective(id));
    return defect || choiceIds[choiceIds.length - 1];
  }

  _getRisky(choiceIds) {
    const risky = choiceIds.find(id => isRisky(id));
    return risky || choiceIds[choiceIds.length - 1];
  }

  _getSafe(choiceIds) {
    const safe = choiceIds.find(id => isSafe(id));
    return safe || choiceIds[0];
  }

  _titForTat(playerChoice, history, choiceIds) {
    if (!history || history.length === 0) {
      return this._getCooperative(choiceIds);
    }
    const lastPlayerChoice = history[history.length - 1].playerChoice;
    return lastPlayerChoice;
  }

  _random(choiceIds) {
    return choiceIds[Math.floor(Math.random() * choiceIds.length)];
  }

  _greedy(choiceIds) {
    return this._getDefective(choiceIds);
  }

  _riskSeeking(choiceIds) {
    return this._getRisky(choiceIds);
  }

  _riskAverse(choiceIds) {
    return this._getSafe(choiceIds);
  }

  _longTermPlanner(playerChoice, history, choiceIds) {
    if (!history || history.length < 2) {
      return this._getCooperative(choiceIds);
    }
    const recentHistory = history.slice(-5);
    const coopCount = recentHistory.filter(r => isCooperative(r.playerChoice)).length;
    const cooperationRate = coopCount / recentHistory.length;
    if (cooperationRate > 0.6) {
      return this._getCooperative(choiceIds);
    }
    return this._getDefective(choiceIds);
  }

  _revengeDriven(playerChoice, history, choiceIds) {
    if (!history || history.length === 0) {
      return this._getCooperative(choiceIds);
    }
    const playerDefections = history.filter(r => isDefective(r.playerChoice)).length;
    if (playerDefections > 0) {
      return this._getDefective(choiceIds);
    }
    return this._getCooperative(choiceIds);
  }

  _trustBuilder(playerChoice, history, choiceIds) {
    if (!history || history.length === 0) {
      return this._getCooperative(choiceIds);
    }
    const lastPlayerChoice = history[history.length - 1].playerChoice;
    if (isDefective(lastPlayerChoice)) {
      return this._getDefective(choiceIds);
    }
    return this._getCooperative(choiceIds);
  }

  _opportunist(playerChoice, history, choiceIds) {
    if (!history || history.length < 3) {
      return this._getCooperative(choiceIds);
    }
    const recent = history.slice(-3);
    const playerAlwaysCooperated = recent.every(r => isCooperative(r.playerChoice));
    if (playerAlwaysCooperated && Math.random() < 0.4) {
      return this._getDefective(choiceIds);
    }
    return this._getCooperative(choiceIds);
  }

  _coalitionFormer(choiceIds, gameState) {
    const relationships = gameState.getPlayer().relationships;
    const values = Object.values(relationships);
    const avgTrust = values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
    if (avgTrust > 20) {
      return this._getCooperative(choiceIds);
    }
    return this._getDefective(choiceIds);
  }

  _deceptive(playerChoice, history, choiceIds) {
    if (!history || history.length < 2) {
      return this._getCooperative(choiceIds);
    }
    const canDefectUndetected = Math.random() < 0.3;
    if (canDefectUndetected) {
      return this._getDefective(choiceIds);
    }
    return this._getCooperative(choiceIds);
  }

  _grimTrigger(playerChoice, history, choiceIds) {
    if (!history || history.length === 0) {
      return this._getCooperative(choiceIds);
    }
    const everDefected = history.some(r => isDefective(r.playerChoice));
    if (everDefected) {
      return this._getDefective(choiceIds);
    }
    return this._getCooperative(choiceIds);
  }
}

export const decisionEngine = new DecisionEngine();
