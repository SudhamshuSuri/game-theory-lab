import { scenarioRegistry } from './registry.js';

// ============================================================
// ERA I: Foundations (Scenarios 1–10)
// Core concepts of strategic decision-making under scarcity.
// ============================================================

scenarioRegistry.register({
  id: 'the-empty-granary',
  title: 'The Empty Granary',
  era: 1,
  order: 1,
  concept: 'scarcity',
  type: 'scarcity',
  setup: (state) => {
    state.player.resources.food = 500;
    state.player.resources.gold = 100;
    state.player.resources.population = 300;
  },
  story: [
    { speaker: 'Harbor Master', text: 'My lord, the autumn grain ships have been delayed by storms. Our granary holds only 500 bushels.' },
    { speaker: 'Steward', text: 'We need 300 bushels per season to feed the city. The next ship arrives in two seasons.' },
    { speaker: 'Advisor', text: 'We have options, my lord. Each carries a cost.' },
  ],
  context: 'Your granary holds 500 bushels. You need 300 per season. A ship arrives in two seasons. You have 100 gold in reserve and 300 citizens to feed.',
  choices: [
    { id: 'ration', label: 'Ration Food', description: 'Strictly ration food to stretch supplies. Everyone gets less, but no one starves.', risk: 'low', tags: ['safe', 'cooperate'] },
    { id: 'seize', label: 'Seize Merchant Stores', description: 'Confiscate food from merchants. Quick solution, but breeds resentment.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'expedition', label: 'Send Expedition', description: 'Send hunters and foragers into the wild. Risky but potentially rewarding.', risk: 'high', tags: ['high'] },
    { id: 'borrow', label: 'Borrow from Neighbor', description: 'Ask a neighboring city for a food loan. They will expect repayment.', risk: 'medium', tags: ['cooperate', 'medium'] },
  ],
  idealNote: 'There is no single "right" answer — that IS the lesson. Scarcity means every choice has an opportunity cost (the value of what you gave up). The skill is understanding what you sacrifice with each path, not finding a perfect option.',
  analyze: (choice) => {
    const analyses = {
      ration: 'You chose safety. Rationing avoids starvation but weakens your people\'s health and morale. The opportunity cost: lost productivity and trade surplus. In game theory terms: you chose a risk-free option with a guaranteed but modest outcome.',
      seize: 'You chose force — a "defect" move. It paid immediately but created enemies. The merchants will remember. This teaches: short-term gains often create long-term costs that outweigh the initial benefit.',
      expedition: 'You chose risk. It worked this time, but that\'s luck, not strategy. The lesson: risk can pay off, but good strategy doesn\'t depend on favorable rolls of the dice.',
      borrow: 'You chose debt. You got the food but now owe a favor. The strategic cost: reduced future flexibility. Every commitment today constrains your options tomorrow.',
    };
    return analyses[choice] || 'Every choice has a cost. The art is choosing which cost to bear.';
  },
  agents: {
    neighbor: { personality: 'longTermPlanner', name: 'Stonehold' },
    merchants: { personality: 'greedy', name: 'Iron Guild' },
  },
});

scenarioRegistry.register({
  id: 'the-pirates-offer',
  title: 'The Pirate\'s Offer',
  era: 1,
  order: 2,
  concept: 'prisonersDilemma',
  type: 'prisoners_dilemma',
  setup: (state) => {},
  story: [
    { speaker: 'Captain Redbeard', text: 'I\'ve spotted a fat merchant convoy. Together we can take it. Split the plunder 50/50. What say you?' },
    { speaker: 'First Mate', text: 'Captain, we could trust Redbeard... or we could take it all for ourselves.' },
    { speaker: 'Redbeard', text: 'Ha! I could say the same. But a bird in the hand is worth two in the bush. Or so they say.' },
  ],
  context: 'Redbeard proposes a joint raid. Each of you must decide: honor the split, or betray the other and take everything.',
  choices: [
    { id: 'honor', label: 'Honor the Split', description: 'Fight together and split the plunder evenly. Mutual trust, mutual gain.', risk: 'medium', tags: ['cooperate'] },
    { id: 'betray', label: 'Take It All', description: 'Let Redbeard do the fighting, then take the treasure for yourself.', risk: 'medium', tags: ['defect'] },
  ],
  idealNote: 'The Prisoner\'s Dilemma has no "win" in a one-shot game — that\'s the point. The dilemma is that individual rationality (betray) leads to collective disaster (both betray, both lose). The only real solutions change the game: make it repeated, add binding contracts, or build trust through prior relationships.',
  analyze: (choice, aiChoice) => {
    const matrix = 'Payoff: you get (them get). Both honor: +3 (+3). You honor, they betray: 0 (+5). You betray, they honor: +5 (0). Both betray: +1 (+1).';
    const lesson = 'Core insight: Each player\'s dominant strategy is to betray (because betray gives a higher payoff regardless of what the other does). But when both follow their dominant strategy, both get +1 instead of the +3 they could have gotten by cooperating.';
    if (choice === 'honor' && aiChoice === 'honor') return 'Both honored. You each got +3. ' + matrix + ' This is the cooperative outcome. But notice: each of you was tempted to betray for the chance at +5. That temptation IS the dilemma. ' + lesson;
    if (choice === 'honor' && aiChoice === 'betray') return 'You got 0. They got +5. You were the "sucker." ' + matrix + ' This is why cooperation is risky in a one-shot game — you need assurance the other will also cooperate. ' + lesson;
    if (choice === 'betray' && aiChoice === 'honor') return 'You got +5. They got 0. You won this round. ' + matrix + ' But this is a one-shot game — there\'s no next time. In real life, betraying creates a reputation cost that this simplified game doesn\'t capture. ' + lesson;
    if (choice === 'betray' && aiChoice === 'betray') return 'Both betrayed. Each got +1. ' + matrix + ' This is the "Nash Equilibrium" — neither player can improve their outcome by changing their choice alone. Yet both would prefer the +3 from mutual cooperation. ' + lesson;
    return matrix + ' ' + lesson;
  },
  agents: {
    redbeard: { personality: 'opportunist', name: 'Captain Redbeard' },
  },
});

scenarioRegistry.register({
  id: 'the-trade-route',
  title: 'The Trade Route',
  era: 1,
  order: 3,
  concept: 'titForTat',
  type: 'prisoners_dilemma',
  multiRound: true,
  totalRounds: 7,
  setup: (state) => {},
  story: [
    { speaker: 'Guildmaster Varik', text: 'The Iron Guild proposes a permanent trade route between our cities. Goods flow both ways.' },
    { speaker: 'Varik', text: 'Each season, we can toll the caravans fairly or unfairly. Fair tolls benefit both. Unfair tolls benefit one... for a season.' },
    { speaker: 'Your Advisor', text: 'This is a long-term arrangement, my lord. Every choice will be remembered.' },
  ],
  context: 'You and the Iron Guild will run a trade route for 7 seasons. Each season, you choose: fair toll or unfair toll. What happens in one season affects the next.',
  choices: [
    { id: 'fair', label: 'Fair Toll', description: 'Charge a reasonable toll. Both profit moderately. Builds trust.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'unfair', label: 'Unfair Toll', description: 'Charge exorbitant tolls. Big profit now, but damages the relationship.', risk: 'medium', tags: ['defect', 'high'] },
  ],
  idealNote: 'The optimal strategy is Tit-for-Tat: start fair, then mirror their last move. It works because it is: 1) Nice — never defects first, 2) Provokable — immediately punishes defection, 3) Forgiving — resumes cooperation when they do, 4) Clear — easy for the other to predict. In repeated games, the "shadow of the future" (knowing you\'ll interact again) makes cooperation rational.',
  analyze: (_choice, _aiChoice, history) => {
    const hist = history || [];
    const fairs = hist.filter(r => r.playerChoice === 'fair').length;
    const unfair = hist.filter(r => r.playerChoice === 'unfair').length;
    const total = hist.length;
    if (total === 0) return 'Play through all rounds to see the full analysis.';

    const aiFairs = hist.filter(r => {
      const ac = r.aiChoices && Object.values(r.aiChoices)[0];
      return ac === 'fair';
    }).length;
    const playerStart = hist[0]?.playerChoice;
    const aiStart = hist[0] && Object.values(hist[0].aiChoices)[0];
    const endRelation = unfair > unfair;

    const summary = `You chose fair ${fairs}/${total} rounds. AI chose fair ${aiFairs}/${total} rounds.`;
    const tft = 'The AI plays Tit-for-Tat: it started ' + (aiStart === 'fair' ? 'fair' : 'unfair') + ', then mirrored your last move each round.';

    if (fairs === total && aiFairs === total) return summary + ' Perfect mutual cooperation! Both benefited every round. ' + tft + ' Lesson: when both play nice, repeated games lead to sustained cooperation.';
    if (fairs === total) return summary + ' You were always fair. The AI exploited you sometimes. ' + tft + ' Lesson: unconditional cooperation is vulnerable to exploitation. Tit-for-Tat protects you by punishing defection.';
    if (unfair === total) return summary + ' You always cheated. The relationship collapsed. ' + tft + ' Lesson: constant defection destroys the value of repeated interaction. The other side eventually stops cooperating.';
    if (fairs > total * 0.7) return summary + ' You were mostly fair. ' + tft + ' Lesson: in repeated games, cooperation creates more total value than defection, as long as you punish betrayal when it happens.';
    if (unfair > total * 0.7) return summary + ' You mostly cheated. ' + tft + ' Lesson: the AI mirrored your behavior. If you defect repeatedly, they defect back, and both lose future gains.';
    return summary + ' You mixed fair and unfair. ' + tft + ' Lesson: inconsistency confuses your partner and makes cooperation harder to sustain. Being predictably reciprocal (like Tit-for-Tat) builds more trust.';
  },
  agents: {
    guild: { personality: 'titForTat', name: 'Guildmaster Varik' },
  },
});

scenarioRegistry.register({
  id: 'the-border-dispute',
  title: 'The Border Dispute',
  era: 1,
  order: 4,
  concept: 'zeroSum',
  type: 'coordination',
  setup: (state) => {},
  story: [
    { speaker: 'General Thorne', text: 'The fertile valley of Greenmarch lies between us and the Dominion. They claim it. We claim it.' },
    { speaker: 'Envoy from Dominion', text: 'The valley has been ours for generations. We will not yield.' },
    { speaker: 'General Thorne', text: 'We could fight, negotiate, share, or withdraw. Each path has consequences.' },
  ],
  context: 'The Greenmarch Valley is claimed by both Haven and the Dominion. It could be a source of endless conflict — or mutual prosperity.',
  choices: [
    { id: 'negotiate', label: 'Negotiate Borders', description: 'Propose a formal border agreement. Requires compromise but avoids war.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'fight', label: 'Military Conquest', description: 'Take the valley by force. Costly but decisive.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'share', label: 'Shared Stewardship', description: 'Propose joint management of the valley. Both benefit equally.', risk: 'medium', tags: ['cooperate'] },
    { id: 'withdraw', label: 'Withdraw Completely', description: 'Abandon the claim. Lose the valley but avoid conflict entirely.', risk: 'low', tags: ['safe'] },
  ],
  idealNote: 'The Dominion is aggressive (Always Defect) — they will fight if they see weakness. Against them: "Negotiate" limits losses but gains little. "Share" is the ideal if they\'d agree, but they won\'t. Lesson: against a purely adversarial opponent, positive-sum solutions require changing the other\'s incentives, not just your own strategy.',
  analyze: (choice, aiChoice) => {
    const dominionPersonality = 'The Dominion is "Always Defect" — they will take aggressive action regardless of what you do.';
    if (choice === 'share' && aiChoice === 'share') {
      return 'Both shared. Rare — the Dominion cooperated. This is the positive-sum ideal: the valley feeds both cities. Lesson: what looks like a fixed pie (zero-sum) can become a growing pie (positive-sum) through cooperation. ' + dominionPersonality;
    }
    if (choice === 'share' && aiChoice === 'fight') {
      return 'You offered to share. They attacked. ' + dominionPersonality + ' Lesson: being cooperative doesn\'t guarantee cooperation in return. You need to know your opponent\'s type. An Always Defect player cannot be reasoned with — they see your offer as weakness.';
    }
    if (choice === 'negotiate' && aiChoice === 'fight') {
      return 'You tried to negotiate. They attacked. ' + dominionPersonality + ' Lesson: against a purely adversarial opponent, negotiation without leverage is futile. You need either power (to make conflict costly for them) or a way to change their incentives.';
    }
    if (choice === 'negotiate' && (aiChoice === 'withdraw' || aiChoice === 'negotiate')) {
      return 'You negotiated. They backed down. ' + dominionPersonality + ' Rare outcome — perhaps they saw strength in your position. Lesson: sometimes projecting resolve can shift an opponent\'s calculation.';
    }
    if (choice === 'fight') {
      return 'You chose war. ' + dominionPersonality + ' They attacked back. War is a zero-sum mindset: you assumed one side must lose. The question: could the valley have been a positive-sum resource for both? The cost of conflict often exceeds the value of the prize.';
    }
    if (choice === 'withdraw') {
      return 'You withdrew. ' + dominionPersonality + ' They took the valley uncontested. Lesson: sometimes retreat is strategic (live to fight another day), but it can also encourage further aggression (they learn you back down).';
    }
    return 'The Greenmarch Valley looks like a zero-sum conflict (one wins, one loses). But "share" creates a positive-sum outcome (both benefit). The challenge: your opponent must agree. ' + dominionPersonality;
  },
  agents: {
    dominion: { personality: 'alwaysDefect', name: 'The Dominion Envoy' },
  },
});

scenarioRegistry.register({
  id: 'the-market-square',
  title: 'The Market Square',
  era: 1,
  order: 5,
  concept: 'dominantStrategy',
  type: 'market',
  setup: (state) => {},
  story: [
    { speaker: 'Baker James', text: 'The new baker from Freeport is stealing our customers. She undercuts our prices.' },
    { speaker: 'Baker Anna', text: 'We could lower our prices too. But then we both make less.' },
    { speaker: 'Your Advisor', text: 'This is a pricing war, my lord. Each baker chooses a price, and customers flock to the cheapest.' },
  ],
  context: 'Two bakeries in Haven compete for customers. Each must set a price: high, medium, or low. Your combined choices determine your profits.',
  choices: [
    { id: 'high', label: 'High Price (5 silver)', description: 'Premium pricing. Maximum profit per loaf, but customers may go elsewhere.', risk: 'high', tags: ['high'] },
    { id: 'medium', label: 'Medium Price (3 silver)', description: 'Fair pricing. Balanced approach.', risk: 'medium', tags: ['medium'] },
    { id: 'low', label: 'Low Price (1 silver)', description: 'Competitive pricing. Attracts customers but thin margins.', risk: 'high', tags: ['low', 'defect'] },
  ],
  idealNote: 'The greedy AI will always choose "low" (its dominant strategy). Against that, you CANNOT win — that IS the lesson. This demonstrates a key insight: when both players have a dominant strategy that leads to mutual destruction, the individually rational choice produces a collectively worse outcome. The real solution is to change the game structure, not play it better.',
  analyze: (choice, aiChoice) => {
    const matrix = 'Payoff matrix: Both high → 4 each. Both medium → 3 each. Both low → 0 each (price war). One low, other high → low gets 7, high gets 1.';
    const domStrat = 'Key concept — "Dominant Strategy": A strategy that gives a higher payoff regardless of what the opponent does. Here, "low" is dominant: it beats high (7 vs 1), beats medium (5 vs 1), and ties low (0 vs 0). But when both play their dominant strategy, both get 0 — worse than the 4 they\'d get from mutual high prices.';
    if (choice === 'low' && aiChoice === 'low') return 'Price war. Both chose low. Both got 0. ' + matrix + ' ' + domStrat + ' This is the "Prisoner\'s Dilemma" in pricing: individually rational choices lead to collective disaster. The only way out is to change the game (differentiate your product, collude, or build brand loyalty).';
    if (choice === 'medium' && aiChoice === 'low') return 'You chose medium. They chose low (their dominant strategy). They undercut you. You got 1, they got 5. ' + matrix + ' ' + domStrat + ' Lesson: against a competitor with a dominant strategy, moderate choices don\'t protect you — you need a fundamentally different approach.';
    if (choice === 'high' && aiChoice === 'low') return 'You chose high. They chose low (their dominant strategy). They stole your customers. You got 1, they got 7. ' + matrix + ' ' + domStrat + ' Lesson: premium pricing doesn\'t work when a competitor offers the same product for less. You need differentiation or cost advantage.';
    return matrix + ' ' + domStrat;
  },
  agents: {
    competitor: { personality: 'greedy', name: 'The Freeport Baker' },
  },
});

scenarioRegistry.register({
  id: 'boss-cuban-missile',
  title: 'The Cuban Missile Crisis',
  era: 1,
  order: 10.5,
  bossFight: true,
  concept: 'chicken',
  type: 'chicken',
  story: [
    { speaker: 'Advisor', text: 'Mr. President, reconnaissance has confirmed Soviet nuclear missiles in Cuba — 90 miles from Florida.' },
    { speaker: 'Kennedy', text: 'Khrushchev is testing us. If we do nothing, the strategic balance shifts. If we attack, we risk nuclear war.' },
    { speaker: 'Joint Chiefs', text: 'We recommend an immediate airstrike to destroy the missile sites before they become operational.' },
    { speaker: 'State Dept', text: 'A blockade is the safer path: firm but not an act of war. It gives Khrushchev room to back down.' },
    { speaker: 'Your Advisor', text: 'Khrushchev is playing the same game you are. Whoever flinches first loses. If neither flinches — catastrophe.' },
  ],
  context: 'October 16, 1962. Soviet nuclear missiles in Cuba. You are President Kennedy. Khrushchev has the same options: stand firm or back down. In game theory, this is Chicken — the game where the rational move is to appear irrational. The player who can credibly commit to "never swerve" forces the other to blink. The naval blockade was a masterstroke of commitment: it created a situation where both sides had time and incentive to de-escalate.',
  choices: [
    { id: 'blockade', label: 'Naval Blockade', description: 'Quarantine Cuba. Firm, visible, but not an act of war. Gives Khrushchev a face-saving exit.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'airstrike', label: 'Immediate Airstrike', description: 'Destroy the missile sites. Decisive action — but risks rapid escalation to all-out war.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'The optimal strategy was the naval blockade — a middle path that communicated resolve without forcing Khrushchev into a corner. In game theory, this is "brinkmanship": create a situation where both sides have an incentive to de-escalate. Kennedy gave Khrushchev an exit: remove the missiles and the US would not invade Cuba. The blockade was brilliant because it made the US look resolute while keeping the door open for Soviet de-escalation. In Chicken, the worst outcome is both standing firm. The blockade transformed the game from Chicken into a waiting game — one Khrushchev could lose gracefully.',
  analyze: (choice, aiChoice) => {
    if (choice === 'blockade') {
      if (aiChoice === 'blockade') return 'Both chose the blockade. A tense standoff — the world watches. Khrushchev blinks first; the missiles are removed. You won the game of chicken through a combination of resolve and restraint. The blockade worked because it was a "limited" move — it escalated the conflict but left both sides a path to de-escalate without losing face. In real history, this is exactly what happened: Kennedy announced the quarantine, Soviet ships stopped at the line, and back-channel negotiations resolved the crisis. The lesson: in brinkmanship, the best move is one that communicates resolve while leaving your opponent a way out.';
      return 'You chose the blockade. Khrushchev ordered an airstrike on Guantanamo. The crisis spirals. Your restraint was seen as weakness — he pushed harder. In Chicken, if one player swerves and the other doesn\'t, the swerver loses everything. The lesson: brinkmanship requires credibility. If your threat isn\'t believable, your opponent will call your bluff.';
    }
    if (choice === 'airstrike') {
      if (aiChoice === 'airstrike') return 'Mutual airstrikes. The world descends into nuclear war. This is the worst outcome of Chicken: both players stood firm and neither blinked. In game theory, this is the (defect, defect) cell — the mutually destructive outcome. Real history: Kennedy\'s military advisors recommended this. He rejected it. Why? Because in Chicken, the threat of mutual destruction only works if you DON\'T actually carry it out. The paradox of brinkmanship: you must be willing to go to the brink, but not cross it.';
      return 'You authorized the airstrike. Khrushchev blinks — Soviet ships turn back. You won decisively. But at what cost? The world came closer to nuclear war than ever before. In Chicken, standing firm while the other swerves is the best individual outcome. But the risk you took was enormous. This is the tension at the heart of Chicken: the best outcome requires maximum risk.';
    }
    return 'In the game of Chicken, the ideal outcome is to stand firm while your opponent swerves. But the challenge is credible commitment: how do you convince the other side you WILL stand firm — even when it\'s irrational to do so? Kennedy solved this with the blockade: a public, visible, hard-to-reverse commitment that gave Khrushchev time to de-escalate with dignity.';
  },
  customResolve: (playerChoice, aiChoices) => {
    if (playerChoice === 'blockade') {
      return { outcome: 'victory', score: 7, narrative: 'The naval blockade works. Khrushchev blinks — Soviet ships turn back. The missiles are removed. Kennedy\'s combination of resolve and restraint averted nuclear war. In Chicken, the best move is one that communicates resolve while leaving your opponent a way out.', resourceChanges: { gold: 50, influence: 40 }, relationshipChanges: {} };
    }
    return { outcome: 'defeat', score: 1, narrative: 'The airstrike triggers a chain reaction. Khrushchev responds in kind. The world spirals toward nuclear war. In Chicken, carrying out the threat of mutual destruction is catastrophic. The paradox of brinkmanship: you must be willing to go to the brink, but not cross it.', resourceChanges: { gold: -150, military: -50, influence: -30 }, relationshipChanges: {} };
  },
  agents: {
    khrushchev: { personality: 'riskSeeking', name: 'Premier Khrushchev' },
  },
});
