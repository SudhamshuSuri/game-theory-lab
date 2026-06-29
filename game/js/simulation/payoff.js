export class PayoffCalculator {
  calculatePD(playerChoice, aiChoice) {
    const playerCooperated = playerChoice === 'honor' || playerChoice === 'cooperate' || playerChoice === 'share';
    const aiCooperated = aiChoice === 'honor' || aiChoice === 'cooperate' || aiChoice === 'share';
    if (playerCooperated && aiCooperated) {
      return { player: 3, ai: 3, narrative: 'Both honored the agreement. Mutual profit.' };
    }
    if (playerCooperated && !aiCooperated) {
      return { player: 0, ai: 5, narrative: 'They betrayed you and took everything.' };
    }
    if (!playerCooperated && aiCooperated) {
      return { player: 5, ai: 0, narrative: 'You betrayed them and took everything.' };
    }
    return { player: 1, ai: 1, narrative: 'Both betrayed. Mutual loss.' };
  }

  calculateMarket(price1, price2) {
    if (price1 === 'high' && price2 === 'high') {
      return { p1: 4, p2: 4, narrative: 'Both kept prices high. Stable profits.' };
    }
    if (price1 === 'high' && price2 === 'medium') {
      return { p1: 2, p2: 6, narrative: 'They undercut you and captured your customers.' };
    }
    if (price1 === 'high' && price2 === 'low') {
      return { p1: 1, p2: 7, narrative: 'They drastically undercut you.' };
    }
    if (price1 === 'medium' && price2 === 'high') {
      return { p1: 6, p2: 2, narrative: 'You undercut them and captured customers.' };
    }
    if (price1 === 'medium' && price2 === 'medium') {
      return { p1: 3, p2: 3, narrative: 'Moderate competition. Moderate profits.' };
    }
    if (price1 === 'medium' && price2 === 'low') {
      return { p1: 1, p2: 5, narrative: 'They beat you on price.' };
    }
    if (price1 === 'low' && price2 === 'high') {
      return { p1: 7, p2: 1, narrative: 'You captured the market with low prices!' };
    }
    if (price1 === 'low' && price2 === 'medium') {
      return { p1: 5, p2: 1, narrative: 'Your low prices dominated.' };
    }
    if (price1 === 'low' && price2 === 'low') {
      return { p1: 0, p2: 0, narrative: 'Price war! Both selling at a loss.' };
    }
    return { p1: 0, p2: 0, narrative: 'Unclear outcome.' };
  }

  calculateStagHunt(playerChoice, aiChoice) {
    const playerStag = playerChoice === 'stag' || playerChoice === 'cooperate' || playerChoice === 'hunt';
    const aiStag = aiChoice === 'stag' || aiChoice === 'cooperate' || aiChoice === 'hunt';
    if (playerStag && aiStag) {
      return { player: 5, ai: 5, narrative: 'Together you caught the stag. Feast for all!' };
    }
    if (playerStag && !aiStag) {
      return { player: 0, ai: 3, narrative: 'You hunted stag alone while they caught hare. You starved.' };
    }
    if (!playerStag && aiStag) {
      return { player: 3, ai: 0, narrative: 'You settled for hare while they failed at stag.' };
    }
    return { player: 3, ai: 3, narrative: 'Both settled for hare. Safe but unsatisfying.' };
  }

  calculateChicken(playerChoice, aiChoice) {
    const playerSwerve = playerChoice === 'swerve' || playerChoice === 'cooperate' || playerChoice === 'retreat';
    const aiSwerve = aiChoice === 'swerve' || aiChoice === 'cooperate' || aiChoice === 'retreat';
    if (playerSwerve && aiSwerve) {
      return { player: 2, ai: 2, narrative: 'Both swerved. Mutual cowardice, mutual safety.' };
    }
    if (playerSwerve && !aiSwerve) {
      return { player: 1, ai: 4, narrative: 'You swerved. They won. You lost face.' };
    }
    if (!playerSwerve && aiSwerve) {
      return { player: 4, ai: 1, narrative: 'They swerved. You won. Glory is yours!' };
    }
    return { player: -10, ai: -10, narrative: 'Neither swerved. Catastrophe for both.' };
  }

  calculateCoordination(playerChoice, aiChoice) {
    if (playerChoice === aiChoice) {
      return { player: 5, ai: 5, narrative: 'You coordinated. Both benefited.' };
    }
    return { player: 0, ai: 0, narrative: 'Misaligned choices. No benefit for either.' };
  }
}

export const payoffCalc = new PayoffCalculator();
