import { agentMemory } from './memory.js';

const COOPERATIVE_CHOICES = ['honor', 'share', 'fair', 'cooperate', 'stag', 'hunt', 'ration', 'negotiate', 'swerve', 'retreat', 'borrow', 'negotiate', 'contribute', 'sustain'];
const DEFECTIVE_CHOICES = ['betray', 'unfair', 'defect', 'seize', 'fight', 'take', 'free_ride'];
const RISKY_CHOICES = ['high', 'seize', 'expedition', 'fight', 'betray', 'unfair'];
const SAFE_CHOICES = ['low', 'ration', 'withdraw', 'negotiate', 'fair', 'honor'];

function isCooperative(id) { return COOPERATIVE_CHOICES.includes(id); }
function isDefective(id) { return DEFECTIVE_CHOICES.includes(id); }
function isRisky(id) { return RISKY_CHOICES.includes(id); }
function isSafe(id) { return SAFE_CHOICES.includes(id); }

export class DecisionEngine {
  constructor() {
    this._lastReasoning = {};
  }

  makeChoice(agent, playerChoice, scenarioId, choiceIds, gameState, round = 0, history = []) {
    let choice;
    let reasoning;
    switch (agent.personalityId) {
      case 'alwaysCooperate':
        choice = this._getCooperative(choiceIds);
        reasoning = `Always cooperate: no matter what, I choose the cooperative path. Trust is my default.`;
        break;
      case 'alwaysDefect':
        choice = this._getDefective(choiceIds);
        reasoning = `Always defect: I look out for myself first. Cooperation is weakness.`;
        break;
      case 'titForTat':
        choice = this._titForTat(playerChoice, history, choiceIds);
        reasoning = this._reasonTitForTat(playerChoice, history, choice);
        break;
      case 'random':
        choice = this._random(choiceIds);
        reasoning = `Random choice: no pattern, no preference. Pure unpredictability.`;
        break;
      case 'greedy':
        choice = this._greedy(choiceIds);
        reasoning = `Greedy: I pursue the highest immediate payoff. Long-term consequences are secondary.`;
        break;
      case 'riskSeeking':
        choice = this._riskSeeking(choiceIds);
        reasoning = `Risk-seeking: I prefer high-risk, high-reward options. The thrill of the gamble.`;
        break;
      case 'riskAverse':
        choice = this._riskAverse(choiceIds);
        reasoning = `Risk-averse: I choose the safest option. Better a certain small gain than a risky big one.`;
        break;
      case 'longTermPlanner':
        choice = this._longTermPlanner(playerChoice, history, choiceIds);
        reasoning = this._reasonLongTermPlanner(playerChoice, history, choice);
        break;
      case 'revengeDriven':
        choice = this._revengeDriven(playerChoice, history, choiceIds);
        reasoning = this._reasonRevengeDriven(playerChoice, history, choice);
        break;
      case 'trustBuilder':
        choice = this._trustBuilder(playerChoice, history, choiceIds);
        reasoning = this._reasonTrustBuilder(playerChoice, history, choice);
        break;
      case 'opportunist':
        choice = this._opportunist(playerChoice, history, choiceIds);
        reasoning = this._reasonOpportunist(playerChoice, history, choice);
        break;
      case 'coalitionFormer':
        choice = this._coalitionFormer(choiceIds, gameState);
        reasoning = this._reasonCoalitionFormer(gameState, choice);
        break;
      case 'deceptive':
        choice = this._deceptive(playerChoice, history, choiceIds);
        reasoning = this._reasonDeceptive(playerChoice, history, choice);
        break;
      case 'grimTrigger':
        choice = this._grimTrigger(playerChoice, history, choiceIds);
        reasoning = this._reasonGrimTrigger(playerChoice, history, choice);
        break;
      case 'learningAgent':
        choice = this._learningAgent(playerChoice, history, choiceIds, agent);
        reasoning = this._reasonLearningAgent(playerChoice, history, choice, agent);
        break;
      default:
        choice = this._random(choiceIds);
        reasoning = `No specific strategy — chose at random.`;
    }
    this._lastReasoning[agent.label || agent.personalityId] = reasoning;
    return choice;
  }

  getLastReasoning(agentLabel) {
    return this._lastReasoning[agentLabel] || null;
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

  _reasonTitForTat(playerChoice, history, choice) {
    if (!history || history.length === 0) {
      return `Tit-for-tat: starting with cooperation. I mirror your choices — cooperate and I'll cooperate back.`;
    }
    const lastMove = history[history.length - 1].playerChoice;
    const isCoop = isCooperative(choice);
    return `Tit-for-tat: mirroring your last move (${lastMove}). You ${isCooperative(lastMove) ? 'cooperated' : 'defected'}, so I ${isCoop ? 'cooperate' : 'defect'} in return.`;
  }

  _reasonLongTermPlanner(playerChoice, history, choice) {
    if (!history || history.length < 2) {
      return `Long-term planner: starting with cooperation to build a foundation of trust.`;
    }
    const recent = history.slice(-5);
    const coopRate = recent.filter(r => isCooperative(r.playerChoice)).length / recent.length;
    return `Long-term planner: analyzing your recent choices. Your cooperation rate over the last ${recent.length} rounds is ${Math.round(coopRate * 100)}%. I ${coopRate > 0.6 ? 'cooperate to maintain the relationship' : 'defect because cooperation is unreliable'}.`;
  }

  _reasonRevengeDriven(playerChoice, history, choice) {
    if (!history || history.length === 0) {
      return `Revenge-driven: first impression. I start cooperative but watch for betrayal.`;
    }
    const defections = history.filter(r => isDefective(r.playerChoice)).length;
    return `Revenge-driven: counting betrayals. You've defected ${defections} time(s). ${defections > 0 ? 'Once trust is broken, I seek revenge.' : 'No betrayals yet — I continue cooperating.'}`;
  }

  _reasonTrustBuilder(playerChoice, history, choice) {
    if (!history || history.length === 0) {
      return `Trust builder: extending trust first. I hope you'll reciprocate.`;
    }
    const lastPlayerChoice = history[history.length - 1].playerChoice;
    if (isDefective(lastPlayerChoice)) {
      return `Trust builder: you defected last round. I must defend myself — trust requires reciprocity.`;
    }
    return `Trust builder: you cooperated last round. Trust is building — I continue cooperating.`;
  }

  _reasonOpportunist(playerChoice, history, choice) {
    if (!history || history.length < 3) {
      return `Opportunist: watching and waiting. Give me time to learn your patterns.`;
    }
    const recent = history.slice(-3);
    const allCoop = recent.every(r => isCooperative(r.playerChoice));
    if (allCoop && isDefective(choice)) {
      return `Opportunist: you've cooperated 3 times in a row. Perfect moment to exploit your trust.`;
    }
    return `Opportunist: you've shown some defection — I'll cooperate for now and wait for a better opportunity.`;
  }

  _reasonCoalitionFormer(gameState, choice) {
    const relationships = gameState.getPlayer().relationships;
    const values = Object.values(relationships);
    const avgTrust = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    return `Coalition-former: assessing relationships. Average trust level is ${avgTrust}. ${avgTrust > 20 ? 'Trust is high — I choose cooperation.' : 'Trust is low — I prioritize my own interests.'}`;
  }

  _reasonDeceptive(playerChoice, history, choice) {
    if (!history || history.length < 2) {
      return `Deceptive: building trust early. I appear cooperative while watching for the right moment.`;
    }
    if (isDefective(choice)) {
      return `Deceptive: I see a chance to defect without being detected. Appearances matter — I choose the selfish option while maintaining a cooperative facade.`;
    }
    return `Deceptive: cooperating for now. The risk of being caught defecting is too high — I'll wait for a safer opportunity.`;
  }

  _reasonGrimTrigger(playerChoice, history, choice) {
    if (!history || history.length === 0) {
      return `Grim trigger: starting cooperative. But remember — one defection from you and I NEVER cooperate again.`;
    }
    const everDefected = history.some(r => isDefective(r.playerChoice));
    if (everDefected) {
      return `Grim trigger: you defected earlier. That was your one chance. I will NEVER cooperate with you again.`;
    }
    return `Grim trigger: you've never defected. Cooperation continues — but I'm watching.`;
  }

  _learningAgent(playerChoice, history, choiceIds, agent) {
    const memHistory = agentMemory.getHistory(agent.id);
    if (memHistory.length < 3) {
      return this._getCooperative(choiceIds);
    }
    const coopRate = agentMemory.getPlayerCooperationRate(agent.id);
    const recent = memHistory.slice(-5);
    const recentDefections = recent.filter(r => isDefective(r.playerChoice)).length;

    if (coopRate > 0.85 && recent.length >= 3 && recentDefections === 0) {
      return this._getDefective(choiceIds);
    }
    if (coopRate < 0.25) {
      return this._getDefective(choiceIds);
    }
    return this._titForTat(playerChoice, memHistory, choiceIds);
  }

  _reasonLearningAgent(playerChoice, history, choice, agent) {
    const memHistory = agentMemory.getHistory(agent.id);
    if (memHistory.length < 3) {
      return `Learning agent: gathering data. Only ${memHistory.length} interaction(s) recorded — insufficient to model your behavior. Starting with cooperation.`;
    }
    const coopRate = agentMemory.getPlayerCooperationRate(agent.id);
    const totalInt = memHistory.length;
    if (coopRate > 0.85) {
      return `Learning agent: model predicts you are highly cooperative (${Math.round(coopRate * 100)}% cooperation over ${totalInt} rounds). Exploiting your trust for maximum gain.`;
    }
    if (coopRate < 0.25) {
      return `Learning agent: model predicts you are highly defective (only ${Math.round(coopRate * 100)}% cooperation over ${totalInt} rounds). Defensive defection — cannot risk cooperating.`;
    }
    return `Learning agent: model shows mixed behavior (${Math.round(coopRate * 100)}% cooperation over ${totalInt} rounds). Switching to tit-for-tat as the most robust response to an unpredictable opponent.`;
  }
}

export const decisionEngine = new DecisionEngine();
