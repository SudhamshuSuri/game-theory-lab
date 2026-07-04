export const AI_PERSONALITIES = {
  alwaysCooperate: {
    id: 'alwaysCooperate',
    name: 'Trusting',
    description: 'Always chooses cooperation. Believes in the best of others.',
    traits: { greed: 1, trust: 10, revenge: 1, risk: 3, planning: 5, deception: 1, reciprocity: 8 },
    color: '#3fb950',
  },
  alwaysDefect: {
    id: 'alwaysDefect',
    name: 'Ruthless',
    description: 'Always betrays. Sees every interaction as a zero-sum game.',
    traits: { greed: 10, trust: 1, revenge: 5, risk: 7, planning: 3, deception: 6, reciprocity: 1 },
    color: '#d84a4a',
  },
  titForTat: {
    id: 'titForTat',
    name: 'Reciprocal',
    description: 'Mirrors your last move. Cooperates first, then does what you did.',
    traits: { greed: 3, trust: 5, revenge: 8, risk: 4, planning: 6, deception: 2, reciprocity: 10 },
    color: '#58a6ff',
  },
  random: {
    id: 'random',
    name: 'Chaotic',
    description: 'Unpredictable. Makes decisions randomly.',
    traits: { greed: 5, trust: 5, revenge: 5, risk: 8, planning: 1, deception: 7, reciprocity: 3 },
    color: '#bc8cff',
  },
  greedy: {
    id: 'greedy',
    name: 'Greedy',
    description: 'Greedy and opportunistic. Takes maximum profit regardless of future.',
    traits: { greed: 10, trust: 2, revenge: 3, risk: 8, planning: 2, deception: 7, reciprocity: 2 },
    color: '#f0883e',
  },
  riskSeeking: {
    id: 'riskSeeking',
    name: 'Reckless',
    description: 'Loves high-risk, high-reward plays. Thrills over safety.',
    traits: { greed: 7, trust: 3, revenge: 4, risk: 10, planning: 2, deception: 5, reciprocity: 3 },
    color: '#f0883e',
  },
  riskAverse: {
    id: 'riskAverse',
    name: 'Cautious',
    description: 'Avoids risk at all costs. Prefers small sure gains over large uncertain ones.',
    traits: { greed: 3, trust: 6, revenge: 4, risk: 1, planning: 8, deception: 3, reciprocity: 6 },
    color: '#56d4dd',
  },
  longTermPlanner: {
    id: 'longTermPlanner',
    name: 'Visionary',
    description: 'Sacrifices short-term gain for long-term relationship value.',
    traits: { greed: 4, trust: 5, revenge: 5, risk: 3, planning: 10, deception: 4, reciprocity: 7 },
    color: '#58a6ff',
  },
  revengeDriven: {
    id: 'revengeDriven',
    name: 'Vindictive',
    description: 'Never forgets a betrayal. Will sacrifice personal gain for revenge.',
    traits: { greed: 3, trust: 2, revenge: 10, risk: 6, planning: 2, deception: 3, reciprocity: 5 },
    color: '#d84a4a',
  },
  trustBuilder: {
    id: 'trustBuilder',
    name: 'Builder',
    description: 'Starts cooperative and continues until betrayed. Then slow to trust again.',
    traits: { greed: 2, trust: 7, revenge: 3, risk: 3, planning: 8, deception: 1, reciprocity: 9 },
    color: '#3fb950',
  },
  opportunist: {
    id: 'opportunist',
    name: 'Opportunist',
    description: 'Cooperates until they see a chance for a big win by defecting.',
    traits: { greed: 8, trust: 3, revenge: 4, risk: 8, planning: 5, deception: 8, reciprocity: 4 },
    color: '#f0883e',
  },
  coalitionFormer: {
    id: 'coalitionFormer',
    name: 'Politician',
    description: 'Builds coalitions. Rewards allies, punishes outsiders.',
    traits: { greed: 5, trust: 6, revenge: 4, risk: 5, planning: 7, deception: 5, reciprocity: 8 },
    color: '#bc8cff',
  },
  deceptive: {
    id: 'deceptive',
    name: 'Deceptive',
    description: 'Appears cooperative but defects when undetected.',
    traits: { greed: 7, trust: 2, revenge: 5, risk: 6, planning: 6, deception: 10, reciprocity: 3 },
    color: '#d84a4a',
  },
  grimTrigger: {
    id: 'grimTrigger',
    name: 'Unforgiving',
    description: 'Cooperates until you defect once. Then defects forever.',
    traits: { greed: 2, trust: 3, revenge: 10, risk: 2, planning: 9, deception: 1, reciprocity: 10 },
    color: '#d84a4a',
  },
  learningAgent: {
    id: 'learningAgent',
    name: 'Adaptive',
    description: 'Studies your patterns and adapts. Starts cooperative, builds an opponent model, then chooses the optimal counter-strategy.',
    traits: { greed: 5, trust: 5, revenge: 5, risk: 4, planning: 10, deception: 5, reciprocity: 8 },
    color: '#bc8cff',
  },
};

export function createAgentFromPersonality(personalityId, name) {
  const template = AI_PERSONALITIES[personalityId];
  if (!template) {
    console.warn(`Unknown personality: ${personalityId}, using random`);
    return createAgentRandom(name);
  }
  return {
    id: `${personalityId}_${Date.now()}`,
    name: name || template.name,
    personalityId,
    traits: { ...template.traits },
    memory: [],
    color: template.color,
    description: template.description,
  };
}

export function createAgentRandom(name) {
  const traits = {
    greed: randInt(1, 10),
    trust: randInt(1, 10),
    revenge: randInt(1, 10),
    risk: randInt(1, 10),
    planning: randInt(1, 10),
    deception: randInt(1, 10),
    reciprocity: randInt(1, 10),
  };
  return {
    id: `random_${Date.now()}`,
    name: name || 'Unknown',
    personalityId: 'random',
    traits,
    memory: [],
    color: '#bc8cff',
    description: 'Completely unpredictable.',
  };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
