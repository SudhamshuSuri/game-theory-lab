export class ResolutionEngine {
  resolveAll(playerChoice, aiChoices, scenario) {
    if (scenario.customResolve) {
      return scenario.customResolve(playerChoice, aiChoices);
    }
    switch (scenario.type) {
      case 'prisoners_dilemma':
        return this._resolvePD(playerChoice, aiChoices, scenario);
      case 'market':
        return this._resolveMarket(playerChoice, aiChoices, scenario);
      case 'stag_hunt':
        return this._resolveStagHunt(playerChoice, aiChoices, scenario);
      case 'chicken':
        return this._resolveChicken(playerChoice, aiChoices, scenario);
      case 'coordination':
        return this._resolveCoordination(playerChoice, aiChoices, scenario);
      case 'scarcity':
        return this._resolveScarcity(playerChoice, aiChoices, scenario);
      case 'public_goods':
        return this._resolvePublicGoods(playerChoice, aiChoices, scenario);
      case 'tragedy_commons':
        return this._resolveTragedyCommons(playerChoice, aiChoices, scenario);
      case 'ultimatum':
        return this._resolveUltimatum(playerChoice, aiChoices, scenario);
      case 'auction':
        return this._resolveAuction(playerChoice, aiChoices, scenario);
      default:
        return this._resolveDefault(playerChoice, aiChoices, scenario);
    }
  }

  _resolvePD(playerChoice, aiChoices, scenario) {
    const aiChoice = Object.values(aiChoices)[0];
    const { player, ai, narrative } = this.calcPD(playerChoice, aiChoice);
    return {
      outcome: player >= 3 ? 'victory' : player <= 1 ? 'defeat' : 'mixed',
      score: player,
      narrative,
      resourceChanges: { gold: (player - 2) * 10 },
      relationshipChanges: {},
    };
  }

  _resolveMarket(playerChoice, aiChoices, scenario) {
    const aiChoice = Object.values(aiChoices)[0];
    const { p1, p2, narrative } = this.calcMarket(playerChoice, aiChoice);
    return {
      outcome: p1 >= 5 ? 'victory' : p1 <= 0 ? 'defeat' : 'mixed',
      score: p1,
      narrative,
      resourceChanges: { gold: (p1 - 2) * 15 },
      relationshipChanges: {},
    };
  }

  _resolveStagHunt(playerChoice, aiChoices, scenario) {
    const aiChoice = Object.values(aiChoices)[0];
    const { player, ai, narrative } = this.calcStagHunt(playerChoice, aiChoice);
    return {
      outcome: player >= 5 ? 'victory' : player <= 1 ? 'defeat' : 'mixed',
      score: player,
      narrative,
      resourceChanges: { food: player * 20 },
      relationshipChanges: {},
    };
  }

  _resolveChicken(playerChoice, aiChoices, scenario) {
    const aiChoice = Object.values(aiChoices)[0];
    const { player, ai, narrative } = this.calcChicken(playerChoice, aiChoice);
    return {
      outcome: player >= 4 ? 'victory' : player <= -5 ? 'defeat' : 'mixed',
      score: player,
      narrative,
      resourceChanges: { gold: player * 15, military: Math.max(0, player * 2) },
      relationshipChanges: {},
    };
  }

  _resolveCoordination(playerChoice, aiChoices, scenario) {
    const aiChoice = Object.values(aiChoices)[0];
    const { player, ai, narrative } = this.calcCoordination(playerChoice, aiChoice);
    return {
      outcome: player >= 5 ? 'victory' : 'defeat',
      score: player,
      narrative,
      resourceChanges: { influence: player * 5 },
      relationshipChanges: {
        [Object.keys(aiChoices)[0]]: player >= 5 ? 15 : -10,
      },
    };
  }

  _resolveScarcity(playerChoice, aiChoices, scenario) {
    switch (playerChoice) {
      case 'ration':
        return {
          outcome: 'mixed',
          score: 2,
          narrative: 'You rationed food carefully. Your people survive, but trade suffers from lack of surplus. The opportunity cost: the gold and influence you would have gained from trade.',
          resourceChanges: { food: -100, gold: -10, population: -10 },
          relationshipChanges: {},
        };
      case 'seize':
        return {
          outcome: 'mixed',
          score: 1,
          narrative: 'You seized the merchants\' stores. You got the food, but at a terrible cost: the merchants are now enemies, and your reputation suffers. The opportunity cost: the trust and trade partnerships you destroyed.',
          resourceChanges: { food: 200, gold: -30, population: -20, reputation: -15 },
          relationshipChanges: { freeport: -20 },
        };
      case 'expedition':
        return {
          outcome: 'mixed',
          score: 3,
          narrative: 'Your expedition found a fertile valley — this time. But exploration is risky; it could have failed. The opportunity cost: the 20 gold you spent could have been used elsewhere, and the expedition members might not have returned.',
          resourceChanges: { food: 200, gold: -20, knowledge: 5 },
          relationshipChanges: {},
        };
      case 'borrow':
        return {
          outcome: 'mixed',
          score: 2,
          narrative: 'Your neighbor lends you food, but the debt constrains your future choices. The opportunity cost: the political flexibility you surrendered. Every favor must eventually be returned.',
          resourceChanges: { food: 200, gold: 0 },
          relationshipChanges: { neighbor: -10 },
        };
      default:
        return {
          outcome: 'mixed',
          score: 1,
          narrative: 'You hesitated. The situation worsened. The opportunity cost of inaction is often the worst choice of all.',
          resourceChanges: { food: -50, population: -5 },
          relationshipChanges: {},
        };
    }
  }

  calcPD(pc, ac) {
    const pCoop = pc === 'honor' || pc === 'cooperate' || pc === 'share' || pc === 'fair';
    const aCoop = ac === 'honor' || ac === 'cooperate' || ac === 'share' || ac === 'fair';
    if (pCoop && aCoop) return { player: 3, ai: 3, narrative: 'Both honored the agreement. Mutual profit.' };
    if (pCoop && !aCoop) return { player: 0, ai: 5, narrative: 'They betrayed you. You lost everything.' };
    if (!pCoop && aCoop) return { player: 5, ai: 0, narrative: 'You betrayed them. All theirs is yours.' };
    return { player: 1, ai: 1, narrative: 'Mutual betrayal. Both walk away wounded.' };
  }

  calcMarket(p1, p2) {
    if (p1 === 'high' && p2 === 'high') return { p1: 4, p2: 4, narrative: 'Both kept prices high. Stable profits.' };
    if (p1 === 'high' && p2 === 'medium') return { p1: 2, p2: 6, narrative: 'They undercut you.' };
    if (p1 === 'high' && p2 === 'low') return { p1: 1, p2: 7, narrative: 'They destroyed your market share.' };
    if (p1 === 'medium' && p2 === 'high') return { p1: 6, p2: 2, narrative: 'You undercut them.' };
    if (p1 === 'medium' && p2 === 'medium') return { p1: 3, p2: 3, narrative: 'Moderate competition.' };
    if (p1 === 'medium' && p2 === 'low') return { p1: 1, p2: 5, narrative: 'They beat you on price.' };
    if (p1 === 'low' && p2 === 'high') return { p1: 7, p2: 1, narrative: 'You dominated!' };
    if (p1 === 'low' && p2 === 'medium') return { p1: 5, p2: 1, narrative: 'Your low prices won.' };
    if (p1 === 'low' && p2 === 'low') return { p1: 0, p2: 0, narrative: 'Price war! Both lose.' };
    return { p1: 0, p2: 0, narrative: 'Unclear.' };
  }

  calcStagHunt(pc, ac) {
    const pStag = pc === 'stag' || pc === 'cooperate' || pc === 'hunt';
    const aStag = ac === 'stag' || ac === 'cooperate' || ac === 'hunt';
    if (pStag && aStag) return { player: 5, ai: 5, narrative: 'Together you caught the stag!' };
    if (pStag && !aStag) return { player: 0, ai: 3, narrative: 'You starved while they ate hare.' };
    if (!pStag && aStag) return { player: 3, ai: 0, narrative: 'You ate hare while they failed.' };
    return { player: 3, ai: 3, narrative: 'Both ate hare. Safe but small.' };
  }

  calcChicken(pc, ac) {
    const pSwerve = pc === 'swerve' || pc === 'cooperate' || pc === 'retreat';
    const aSwerve = ac === 'swerve' || ac === 'cooperate' || ac === 'retreat';
    if (pSwerve && aSwerve) return { player: 2, ai: 2, narrative: 'Both swerved. Safe.' };
    if (pSwerve && !aSwerve) return { player: 1, ai: 4, narrative: 'They held. You lost.' };
    if (!pSwerve && aSwerve) return { player: 4, ai: 1, narrative: 'You held. Glory!' };
    return { player: -10, ai: -10, narrative: 'Catastrophe!' };
  }

  calcCoordination(pc, ac) {
    if (pc === ac) return { player: 5, ai: 5, narrative: 'Perfect coordination!' };
    return { player: 0, ai: 0, narrative: 'Misaligned.' };
  }

  calcPublicGoods(pc, ac) {
    const pContrib = pc === 'contribute';
    const aContrib = ac === 'contribute';
    if (pContrib && aContrib) return { player: 3, ai: 3, narrative: 'Both contributed to the public good.' };
    if (pContrib && !aContrib) return { player: 0, ai: 5, narrative: 'You contributed while they free rode.' };
    if (!pContrib && aContrib) return { player: 5, ai: 0, narrative: 'You free rode on their contribution.' };
    return { player: 1, ai: 1, narrative: 'No one contributed. The public good collapsed.' };
  }

  calcTragedyCommons(pc, ac) {
    const pTake = pc === 'take';
    const aTake = ac === 'take';
    if (!pTake && !aTake) return { player: 3, ai: 3, narrative: 'Both sustained the commons.' };
    if (!pTake && aTake) return { player: 0, ai: 5, narrative: 'You sustained while they overused.' };
    if (pTake && !aTake) return { player: 5, ai: 0, narrative: 'You overused while they sustained.' };
    return { player: -2, ai: -2, narrative: 'Both overused. The commons collapsed.' };
  }

  _resolvePublicGoods(playerChoice, aiChoices, scenario) {
    const contributed = playerChoice === 'contribute';
    const aiContributed = Object.values(aiChoices).some(c => c === 'contribute');
    const totalPool = (contributed ? 1 : 0) + Object.values(aiChoices).filter(c => c === 'contribute').length;
    const returnPerPerson = totalPool * 0.6;
    const playerReturn = returnPerPerson;
    const aiReturn = aiContributed ? returnPerPerson - 1 : returnPerPerson;
    return {
      outcome: totalPool >= 3 ? 'victory' : totalPool >= 2 ? 'mixed' : 'defeat',
      score: playerReturn,
      narrative: contributed
        ? `You contributed. ${totalPool} of ${Object.keys(aiChoices).length + 1} contributed. Everyone gets ${returnPerPerson.toFixed(1)} back.`
        : `You free rode. ${totalPool} of ${Object.keys(aiChoices).length + 1} contributed. You got ${returnPerPerson.toFixed(1)} for free.`,
      resourceChanges: { gold: Math.round(playerReturn * 20) },
      relationshipChanges: {},
    };
  }

  _resolveTragedyCommons(playerChoice, aiChoices, scenario) {
    const overused = Object.values(aiChoices).filter(c => c === 'take').length + (playerChoice === 'take' ? 1 : 0);
    const resourceHealth = Math.max(0, 100 - overused * 25);
    const playerGain = playerChoice === 'take' ? 30 : 10;
    return {
      outcome: resourceHealth > 50 ? 'mixed' : 'defeat',
      score: resourceHealth / 10,
      narrative: overused > 2
        ? `Too many took from the commons. The resource collapsed to ${resourceHealth}%. You gained ${playerGain} but now there's nothing left.`
        : `The commons survived at ${resourceHealth}%. Restrained use preserves the resource.`,
      resourceChanges: { gold: playerGain, food: resourceHealth > 50 ? 20 : -30 },
      relationshipChanges: {},
    };
  }

  _resolveUltimatum(playerChoice, aiChoices, scenario) {
    const aiChoice = Object.values(aiChoices)[0];
    const playerGain = playerChoice === 'accept' ? parseInt(aiChoice) || 3 : 0;
    return {
      outcome: playerGain > 3 ? 'victory' : playerGain > 0 ? 'mixed' : 'defeat',
      score: playerGain,
      narrative: playerChoice === 'accept'
        ? `You accepted the offer of ${playerGain}. Better than nothing.`
        : `You rejected the offer. Both got nothing. You punished unfairness at a cost to yourself.`,
      resourceChanges: { gold: playerGain * 10 },
      relationshipChanges: {},
    };
  }

  _resolveAuction(playerChoice, aiChoices, scenario) {
    const aiBid = parseInt(Object.values(aiChoices)[0]) || 3;
    const playerBid = parseInt(playerChoice) || 0;
    const wins = playerBid >= aiBid;
    const payoff = wins ? (10 - playerBid) : 0;
    return {
      outcome: payoff > 5 ? 'victory' : payoff > 0 ? 'mixed' : 'defeat',
      score: payoff,
      narrative: wins
        ? `You won the auction with a bid of ${playerBid}. Net gain: ${payoff}.`
        : `The AI won with a bid of ${aiBid}. You bid ${playerBid}. You keep your gold.`,
      resourceChanges: { gold: wins ? (10 - playerBid) * 10 : 0 },
      relationshipChanges: {},
    };
  }

  _resolveDefault(playerChoice, aiChoices, scenario) {
    return {
      outcome: 'mixed',
      score: 2,
      narrative: 'The situation resolves. Consequences ripple through the realm.',
      resourceChanges: {},
      relationshipChanges: {},
    };
  }
}

export const resolutionEngine = new ResolutionEngine();
