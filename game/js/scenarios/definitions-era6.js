import { scenarioRegistry } from './registry.js';

// ============================================================
// ERA VI: Mastery & Synthesis (Scenarios 51-63)
// Culmination of all prior concepts. Player uses sequential
// games, minimax, voting, matching, ultimatum, bargaining,
// mechanism design, and synthesizes everything.
// ============================================================

scenarioRegistry.register({
  id: 'the-ultimatum',
  title: 'The Ultimatum',
  era: 6,
  order: 51,
  concept: 'ultimatum',
  type: 'ultimatum',
  setup: (state) => {
    state.player.resources.gold = 50;
  },
  story: [
    { speaker: 'Envoy Yara', text: 'Our elders have found a cache of 10 gold pieces buried beneath the old temple. They say it belongs to our people.' },
    { speaker: 'Envoy Yara', text: 'But you found the map. So here is my offer: you propose how to split it. I can accept — and we both walk away with our shares. Or I can reject — and neither of us gets anything.' },
    { speaker: 'Your Advisor', text: 'This is a test, my lord. She will not accept an insult. But how much is enough?' },
  ],
  context: 'You must split 10 gold with Envoy Yara. You propose a division. She can accept or reject. If she rejects, both get nothing. Standard economic theory says a rational responder accepts any positive offer — but real humans reject unfair offers, sacrificing money to punish unfairness.',
  choices: [
    { id: 'offer_1', label: 'Offer 1 Gold', description: 'Keep 9, give them 1. The most profitable for you, but likely insulting.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'offer_2', label: 'Offer 2 Gold', description: 'Keep 8, give them 2. Still very unequal.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'offer_3', label: 'Offer 3 Gold', description: 'Keep 7, give them 3. Somewhat unequal.', risk: 'medium', tags: ['medium'] },
    { id: 'offer_4', label: 'Offer 4 Gold', description: 'Keep 6, give them 4. Nearly equal.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'offer_5', label: 'Offer 5 Gold', description: 'Split evenly. 5 and 5. Fair and likely accepted.', risk: 'low', tags: ['cooperate', 'safe'] },
  ],
  idealNote: 'The subgame-perfect equilibrium predicts offering 1 gold (anything above zero should be accepted by a rational responder). But humans consistently reject offers below 30%. Against a greedy AI? They will accept any positive offer, including 1 gold. But against a fairness-oriented responder? They reject offers of 1-2 gold. The lesson: subgame perfection assumes rational self-interest, but real players have social preferences — they value fairness and will pay to punish unfairness. This is one of the most important empirical findings in behavioral game theory.',
  analyze: (choice, aiChoice) => {
    const offer = parseInt(choice.split('_')[1]);
    const accepted = aiChoice === 'accept';
    const subgamePerfect = 'Subgame-perfect equilibrium: The proposer should offer the minimum positive amount (1 gold). The responder should accept any positive offer because something is better than nothing. This is the prediction of classical game theory assuming pure self-interest.';
    const behavioral = 'Behavioral economics finding: In every human society studied, offers below 30% are rejected about half the time. People sacrifice money to punish unfairness. The "irrational" rejection is actually rational once you account for the value people place on fairness, reputation, and reciprocity.';
    if (accepted) {
      return `You offered ${offer}. Envoy Yara accepted. You get ${offer === 1 ? 9 : offer === 2 ? 8 : offer === 3 ? 7 : offer === 4 ? 6 : 5} gold, she gets ${offer} gold. ${offer <= 2 ? 'She accepted despite the unfairness — perhaps she is purely self-interested.' : 'She accepted — the offer was fair enough.'} ${subgamePerfect} Applied here: since a "greedy" responder accepts any positive amount, the rational proposer offers 1. But in real human populations, your ${offer}-gold offer would be rejected ${offer <= 2 ? '80-100%' : offer === 3 ? '~40%' : '~10%'} of the time. ${behavioral} Real-world application: salary negotiations, take-it-or-leave-it deals, and international treaties. Always consider: will the other side accept an unfair outcome, or will they burn value to punish unfairness?`;
    }
    return `You offered ${offer} gold. Envoy Yara REJECTED. Both get nothing. ${subgamePerfect} Classical theory says this shouldn't happen — any positive offer is better than zero. But she rejected because the offer was too unfair. This is the central finding of ultimatum game experiments: humans have strong fairness norms and will pay to punish violations. Even in anonymous one-shot games, people reject offers below 30%. ${behavioral} Real-world connection: this explains why companies pay employees more than the market-clearing wage ("efficiency wages"), why divorce settlements are often 50/50 even when one party has more legal power, and why "insulting" offers in business negotiations can scuttle deals even when both sides would profit. The lesson: fairness is not a luxury — it is a strategic necessity.`;
  },
  agents: {
    yara: { personality: 'fair', name: 'Envoy Yara' },
  },
});

scenarioRegistry.register({
  id: 'the-first-mover',
  title: 'The First Mover',
  era: 6,
  order: 52,
  concept: 'sequentialGames',
  type: 'entry_game',
  setup: (state) => {
    state.player.resources.gold = 300;
    state.player.resources.influence = 20;
  },
  story: [
    { speaker: 'Chamberlain', text: 'My lord, a new trade route to the East has opened. Two of our merchant houses can establish operations. The first to arrive captures the best warehouses and supplier contracts.' },
    { speaker: 'Merchant Voss', text: 'House Voss is prepared to move immediately. We will enter on the first ship.' },
    { speaker: 'Merchant Rourke', text: 'House Rourke takes a measured approach. We will see how Voss fares before committing.' },
  ],
  context: 'Two merchant houses can enter a new eastern trade route. First mover captures advantage (prime warehouses, supplier contracts). Second mover can either compete (costly fight for remaining scraps) or withdraw (cut losses). You control House Rourke. Voss moves first — they decide whether to enter. You then decide whether to compete or withdraw.',
  choices: [
    { id: 'enter_first', label: 'Enter First (Be Voss)', description: 'You are the first mover. Capture prime assets. But you commit resources before knowing the market fully.', risk: 'high', tags: ['high'] },
    { id: 'enter_second_compete', label: 'Enter Second — Compete', description: 'Let Voss go first. Then enter and compete for the remaining market share. Intense competition.', risk: 'medium', tags: ['medium'] },
    { id: 'enter_second_withdraw', label: 'Enter Second — Withdraw', description: 'Let Voss go first. Assess the market and withdraw if it looks unfavorable. Cut losses.', risk: 'low', tags: ['safe'] },
    { id: 'dont_enter', label: 'Don\'t Enter at All', description: 'Skip the Eastern trade entirely. Safe, but miss the opportunity entirely.', risk: 'low', tags: ['defect', 'safe'] },
  ],
  idealNote: 'Using backward induction: Voss (first mover) enters because the payoff from entering (even if Rourke competes) exceeds not entering. Rourke (second mover) should compete if the market is large enough to support two, otherwise withdraw. The first-mover advantage is real: Voss gets pick of assets. But the second mover has the advantage of information: they know Voss\'s commitment before deciding. This is the fundamental tradeoff in sequential games: first-mover commitment power vs. second-mover informational advantage. The optimal choice depends on whether the market is a "winner-take-most" (enter first) or can support two players (either can work).',
  customResolve: (playerChoice, aiChoices) => {
    const aiChoice = Object.values(aiChoices)[0];
    if (playerChoice === 'enter_first') {
      return { outcome: 'victory', score: 8, narrative: 'First-mover advantage: you capture prime warehouses and supplier contracts. Commitment pays off.', resourceChanges: { gold: 80, influence: 15 }, relationshipChanges: {} };
    }
    if (playerChoice === 'enter_second_compete') {
      if (aiChoice === 'enter_first') {
        return { outcome: 'mixed', score: 5, narrative: 'You entered second and compete with Voss. Backward induction equilibrium — both share the market with moderate profits.', resourceChanges: { gold: 30 }, relationshipChanges: { voss: -5 } };
      }
      return { outcome: 'victory', score: 7, narrative: 'Voss didn\'t enter. You captured the Eastern trade route alone — maximum profit.', resourceChanges: { gold: 100, influence: 20 }, relationshipChanges: {} };
    }
    if (playerChoice === 'enter_second_withdraw') {
      return { outcome: 'mixed', score: 4, narrative: 'You waited, assessed, and withdrew. The option value of information saved you from a bad bet.', resourceChanges: {}, relationshipChanges: {} };
    }
    return { outcome: 'defeat', score: 1, narrative: 'You didn\'t enter at all. All potential profits from the Eastern trade are forfeited.', resourceChanges: {}, relationshipChanges: {} };
  },
  analyze: (choice, aiChoice) => {
    const backwardInduction = 'Backward induction: Start at the end. If Voss enters and Rourke competes → both get moderate profits (market shared). If Voss enters and Rourke withdraws → Voss gets high profits, Rourke gets 0. If Voss doesn\'t enter → Rourke can enter alone and get high profits. Since Rourke will compete (they\'d rather compete than withdraw for 0), Voss knows entering yields moderate profits — better than not entering (0). So Voss enters. The equilibrium: both enter and share the market.';
    if (choice === 'enter_first') {
      return 'You chose to be the first mover. You capture prime warehouses and supplier contracts. This is classic first-mover advantage: by committing early, you lock up the best assets. However, you bear all the risk of an unknown market. If demand is lower than expected, you\'re stuck with overhead costs. The second mover (Rourke) watches your results and decides. ' + backwardInduction + ' Real-world examples: Amazon entered e-commerce first and captured dominant market share. But first movers can also fail — MySpace was first in social networking before Facebook applied the second-mover advantage of learning from their mistakes. The lesson: first-mover advantage is real but not absolute. It works best when there are high switching costs, network effects, or scarce assets to lock up.';
    }
    if (choice === 'enter_second_compete') {
      return 'You let Voss enter first, then compete. You fight for remaining market share. The market is now contested — both houses earn moderate but reduced profits. The second-mover advantage: you saw Voss\'s choice and the early market signals before committing. If the market looked strong, you competed. If weak, you could have withdrawn. This is the information advantage of moving second. ' + backwardInduction + ' Real-world example: Google entered search after AltaVista and Lycos, learning from their mistakes. Android entered smartphones after iOS, adopting an open-ecosystem strategy that differentiated from Apple\'s walled garden. Lesson: being second lets you learn from the first mover\'s successes and failures — but you must be prepared to compete against an entrenched player.';
    }
    if (choice === 'enter_second_withdraw') {
      return 'You let Voss enter first, assessed the market, and decided to withdraw. You cut your losses. This is the option value of waiting: you gathered information (how Voss fared, what demand looked like) and decided the expected profits didn\'t justify entry. In sequential game terms, you exercised your right to say "no" after seeing the first move. This is rational whenever the expected profit from competing is negative. ' + backwardInduction + ' Real-world example: many startups decide not to enter a market after seeing a first mover struggle. The lesson: the second mover\'s greatest advantage is the option to withdraw. Sometimes the best move is no move.';
    }
    return 'You chose not to enter at all. Safe, but you forfeit all potential profits from the Eastern trade. In sequential game terms, this is equivalent to choosing your outside option. If the expected value of entry (even as second mover after Voss enters) is positive, staying out is a mistake. But if the market truly cannot support two players and Voss has already committed, staying out is rational. ' + backwardInduction + ' The lesson: not playing is always an option. Sometimes the best strategic decision is to recognize when the game is stacked against you and choose your outside option instead.';
  },
  agents: {
    voss: { personality: 'greedy', name: 'Merchant Voss' },
    rourke: { personality: 'opportunist', name: 'House Rourke' },
  },
});

scenarioRegistry.register({
  id: 'the-chess-match',
  title: 'The Chess Match',
  era: 6,
  order: 53,
  concept: 'minimax',
  type: 'chess',
  setup: (state) => {
    state.player.resources.influence = 30;
  },
  story: [
    { speaker: 'Grandmaster Soren', text: 'You have improved greatly, my student. Today, you face your final test: a match against the Grand Strategy Engine — a device that calculates every possible move and chooses the one that maximizes its advantage.' },
    { speaker: 'Grandmaster Soren', text: 'It plays perfectly. It assumes you will also play perfectly. It never bluffs, never hopes, never takes unnecessary risks. To beat it, you must think as it does.' },
    { speaker: 'Grand Strategy Engine', text: 'I calculate all branches. Your best move is my worst outcome. I will choose accordingly. Proceed.' },
  ],
  context: 'A simplified chess-like game. You command an army on a 4x4 board. You can choose an offensive formation (attack from the left, right, or center) or a defensive formation (fortify, retreat, or counter). The Engine calculates all responses and picks the one that minimizes your maximum gain. This is the minimax principle: in zero-sum games, assume your opponent will exploit your every weakness. Choose the move that makes your worst-case outcome as good as possible.',
  choices: [
    { id: 'attack_left', label: 'Attack from the Left', description: 'Send your cavalry on the left flank. High reward if undefended, disaster if countered.', risk: 'high', tags: ['high'] },
    { id: 'attack_center', label: 'Attack from the Center', description: 'March your infantry directly. Moderate reward, moderate risk.', risk: 'medium', tags: ['medium'] },
    { id: 'attack_right', label: 'Attack from the Right', description: 'Send archers to the right flank. Surprise advantage possible.', risk: 'high', tags: ['high'] },
    { id: 'fortify', label: 'Fortify Position', description: 'Dig in and defend. Low reward, but safe against any attack.', risk: 'low', tags: ['safe'] },
    { id: 'retreat', label: 'Strategic Retreat', description: 'Pull back to advantageous terrain. Zero gain now, but sets up a better position.', risk: 'medium', tags: ['cooperate'] },
  ],
  idealNote: 'The minimax solution against a perfect opponent is to fortify or retreat — these guarantee a non-negative outcome regardless of the opponent\'s response. Any attack option can be countered: left flank can be blocked, center can be met with full force, right can be flanked. A perfect opponent (minimax player) will always choose the response that minimizes your payoff. So you should choose the move whose worst-case outcome is highest. This is "maximin" — maximize your minimum possible payoff. In zero-sum games, the minimax theorem guarantees that this is the optimal conservative strategy.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'fortify':
        return { outcome: 'mixed', score: 5, narrative: 'You fortified. The maximin choice — guarantees no loss against a perfect opponent. Safe but no gain.', resourceChanges: { military: 10 }, relationshipChanges: {} };
      case 'retreat':
        return { outcome: 'mixed', score: 4, narrative: 'Strategic retreat. The Engine declines to pursue. Positional gain without engagement.', resourceChanges: {}, relationshipChanges: {} };
      case 'attack_center':
        return { outcome: 'mixed', score: 3, narrative: 'Center attack met by equal force. A bloody stalemate — the Engine countered perfectly.', resourceChanges: { military: -15 }, relationshipChanges: {} };
      default:
        return { outcome: 'defeat', score: 1, narrative: `Your ${playerChoice === 'attack_left' ? 'left flank attack' : 'right flank attack'} was anticipated and countered. The minimax engine never blunders.`, resourceChanges: { military: -25, influence: -10 }, relationshipChanges: {} };
    }
  },
  analyze: (choice, aiChoice) => {
    const minimaxExplained = 'Minimax theorem (von Neumann, 1928): In any finite zero-sum game, there exists a value V such that Player 1 can guarantee at least V, and Player 2 can hold Player 1 to at most V. The optimal strategy for each is to assume the opponent will counter perfectly. You maximize your minimum gain (maximin); they minimize your maximum gain (minimax).';
    const engineResponse = 'The Engine calculates all branches and picks the response that minimizes your payoff. It never makes a mistake. Against such an opponent, hoping they miss something is not a strategy.';

    if (choice === 'attack_left') {
      return `You attacked the left flank. The Engine anticipated this and reinforced the left. Your cavalry is repelled. ${engineResponse} ${minimaxExplained} Your attack left had a high maximum payoff (if undefended) but a terrible minimum payoff (if countered, as it was). A maximin player would avoid such variance. Real-world application: in military strategy, the minimax principle means assuming the enemy knows your plan and has prepared a counter. The best plans are those that work even when the enemy responds optimally — not plans that rely on the enemy making mistakes.`;
    }
    if (choice === 'attack_center') {
      return `You attacked the center. The Engine met your infantry with its own. A bloody stalemate. ${engineResponse} ${minimaxExplained} The center attack had moderate best and worst cases. Against a perfect opponent, this is a reasonable choice — you won't lose badly, but you won't win big either. Real-world connection: in chess, controlling the center is fundamental because it offers the most stable payoff. In business, going after the "center of the market" (mainstream customers) is less risky than niche flanks, but also less likely to produce breakthrough success. The minimax mindset: prefer strategies that don't catastrophically fail, even under perfect counterplay.`;
    }
    if (choice === 'attack_right') {
      return `You attacked the right flank. The Engine anticipated this feint and had reserves positioned. Your archers are outflanked. ${engineResponse} ${minimaxExplained} The right attack was your riskiest option: high potential reward if the Engine hadn't prepared, but you assumed the Engine would make a mistake. A mistake a minimax player never makes. The lesson: in zero-sum games against a perfect opponent, do not rely on your opponent erring. Choose strategies that bound your downside rather than maximizing your upside. Real-world example: in poker, minimax players avoid drawing to unlikely hands — they fold and wait for a better spot rather than chasing a big pot with bad odds.`;
    }
    if (choice === 'fortify') {
      return `You fortified your position. The Engine probes but cannot break through. A draw. Safe, but no gain. ${engineResponse} ${minimaxExplained} Fortifying is the pure maximin strategy: it guarantees your worst-case outcome is 0 (no loss), rather than risking a negative outcome from a failed attack. Against a perfect opponent, this is the theoretically optimal conservative choice. The tradeoff: you give up any chance of a big win. Real-world application: in financial markets, the maximin strategy is diversification — you give up the chance of hitting the next Tesla to avoid the risk of being wiped out. In diplomacy, fortifying means building defensive alliances: they don't expand your influence, but they protect what you have.`;
    }
    return `You retreated to advantageous terrain. The Engine declines to pursue, recognizing the trap. A positional gain without engagement. ${engineResponse} ${minimaxExplained} Retreat is interesting: it sacrifices current position for future advantage. In a single-move game, retreat is suboptimal (0 gain vs fortify's 0 gain or attack's potential gain). But in a multi-move game, retreat can be the optimal minimax move if it sets up a better future position. The Engine respects this — it doesn't pursue because it calculates that pursuing leads to a worse outcome. Real-world parallel: strategic retreat in business (pulling out of a market to focus resources elsewhere) or in military tactics (giving ground to overextend the enemy's supply lines). The minimax principle applies across multiple moves: sacrifice now to secure a better minimum future payoff.`;
  },
  agents: {
    engine: { personality: 'minimax', name: 'Grand Strategy Engine' },
  },
});

scenarioRegistry.register({
  id: 'the-election',
  title: 'The Election',
  era: 6,
  order: 54,
  concept: 'voting',
  type: 'voting',
  setup: (state) => {
    state.player.resources.influence = 50;
  },
  story: [
    { speaker: 'Chancellor Prime', text: 'The Council of Elders must elect a new High Chancellor. Three candidates stand: myself (Centrist), Lady Ashford (Progressive), and Lord Castor (Traditionalist).' },
    { speaker: 'Lady Ashford', text: 'We must decide which voting system to use. Plurality? Ranked-choice? Approval? Borda count? The system determines the winner.' },
    { speaker: 'Lord Castor', text: 'Your faction holds the deciding vote on the voting system. Choose wisely — your choice may determine who wins.' },
  ],
  context: 'Your faction has the power to choose the voting system for the election. Three candidates: Centrist (popular with moderates), Progressive (popular with urban voters), Traditionalist (popular with rural voters). Public opinion: Centrist 35%, Progressive 33%, Traditionalist 32%. Your faction prefers the Progressive. Which voting system gives you the best chance? Each system creates different strategic incentives.',
  choices: [
    { id: 'plurality', label: 'Plurality (First-Past-the-Post)', description: 'Each voter votes for one candidate. Highest total wins. Simple, but creates strategic voting — voters may abandon their true favorite for a "lesser evil."', risk: 'medium', tags: ['medium'] },
    { id: 'ranked_choice', label: 'Ranked-Choice (Instant Runoff)', description: 'Voters rank candidates. Last-place candidates are eliminated, their votes redistributed. Eliminates "spoiler" effects.', risk: 'medium', tags: ['medium'] },
    { id: 'approval', label: 'Approval Voting', description: 'Voters approve any number of candidates. Most approvals wins. Reduces strategic voting pressure.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'borda', label: 'Borda Count', description: 'Voters rank candidates; points awarded by position (3, 2, 1). Most points wins. Rewards broad appeal.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'There is no single "best" voting system — each has tradeoffs. Arrow\'s Impossibility Theorem proves that no ranked voting system can simultaneously satisfy all desirable properties (Pareto efficiency, independence of irrelevant alternatives, non-dictatorship). Plurality favors the centrist (35% wins). Ranked-choice favors the progressive (Centrist is eliminated first, their votes split between Progressive and Traditionalist). Approval favors the centrist (broadest appeal). Borda favors the centrist (most second-choice votes if moderate). The optimal choice depends on voter preference distributions and your strategic goal. This is mechanism design: the rules you choose determine the outcome.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'ranked_choice':
        return { outcome: 'victory', score: 8, narrative: 'Ranked-choice voting: Progressive wins with majority support after redistribution. Eliminates the spoiler effect.', resourceChanges: { influence: 30 }, relationshipChanges: { progressive: 15 } };
      case 'approval':
        return { outcome: 'mixed', score: 5, narrative: 'Approval voting: Centrist wins with broad but shallow support. Better than plurality, rewards consensus.', resourceChanges: { influence: 15 }, relationshipChanges: {} };
      case 'borda':
        return { outcome: 'mixed', score: 4, narrative: 'Borda count: Centrist wins as everyone\'s second choice. Rewards broad acceptability but highly manipulable.', resourceChanges: { influence: 10 }, relationshipChanges: {} };
      default:
        return { outcome: 'defeat', score: 2, narrative: 'Plurality: Centrist wins with just 35%. Spoiler effect — the majority (65%) is unrepresented.', resourceChanges: { influence: -10 }, relationshipChanges: {} };
    }
  },
  analyze: (choice) => {
    if (choice === 'plurality') {
      return 'You chose Plurality (First-Past-the-Post). Outcome: Centrist wins with 35% of the vote. Progressive and Traditionalist split the opposition. Why it happened: under plurality, voters face the "wasted vote" problem — supporters of Progressive and Traditionalist know their candidate probably can\'t win, so some vote strategically for the Centrist as a "lesser evil." This is Duverger\'s Law: plurality voting tends to produce two-party systems because third parties are squeezed out. Your preferred candidate (Progressive) lost. Arrow\'s Theorem: plurality fails the "independence of irrelevant alternatives" criterion — whether the Traditionalist runs affects whether the Centrist beats the Progressive. Real-world: US presidential elections, UK general elections. The lesson: plurality is simple but creates strong strategic voting incentives and can produce winners who lack majority support.';
    }
    if (choice === 'ranked_choice') {
      return 'You chose Ranked-Choice (Instant Runoff). Outcome: Centrist eliminated first (fewest first-choice votes). Progressive wins after Traditionalist voters\' second-choice votes are distributed. Under RCV, voters can rank sincerely without fear of "wasting" their vote — they put their true favorite first and a compromise second. RCV eliminates the spoiler effect and tends to produce winners with broader coalitions. However, RCV can sometimes eliminate a widely-accepted compromise candidate in early rounds (a centrist who is everyone\'s second choice but no one\'s first). Arrow\'s Theorem: RCV still fails the "independence of irrelevant alternatives" criterion — adding or removing a candidate can change the winner in non-intuitive ways. Real-world: Australian House of Representatives, Maine state elections. The lesson: RCV encourages sincere voting and broader coalitions but is more complex and has its own pathologies.';
    }
    if (choice === 'approval') {
      return 'You chose Approval Voting. Outcome: Centrist wins with the broadest coalition of approvers. Progressive comes second. Under approval, voters approve every candidate they find acceptable. This reduces strategic voting pressure — you can support your favorite without "wasting" your vote. However, approval can favor "safe" candidates who offend no one over passionate candidates with intense support. Arrow\'s Theorem doesn\'t directly apply to approval voting because it\'s not a ranked system — approval is a "cardinal" system (voters rate candidates independently). This sidesteps some of Arrow\'s impossibility results but introduces its own issues: tactical voting still matters (should you approve your second choice or not?). Real-world: used by the Mathematical Association of America, some political parties. The lesson: approval voting is simpler and less strategic than ranked systems but can favor bland consensus candidates over visionary ones.';
    }
    return 'You chose Borda Count. Outcome: Centrist wins — they are everyone\'s second choice, earning 2 points on every ballot. Progressive and Traditionalist split the first-choice votes but suffer from being polarizing (getting many last-place rankings). The Borda count rewards broad acceptability over intense first-choice support. This is why Borda is used in some organizations — it tends to elect consensus candidates who are acceptable to most voters rather than polarizing figures. However, Borda is highly vulnerable to "compromising" strategy: supporters of a weak candidate can rank a strong rival lower to manipulate the outcome. Arrow\'s Theorem: Borda fails "independence of irrelevant alternatives" — a candidate who drops out can change the ranking of remaining candidates in ways that feel unfair. Real-world: Eurovision Song Contest, some political science awards. The lesson: Borda rewards centrist consensus but is the most manipulable of the common systems. The "best" system depends on what you value: simplicity (plurality), sincerity (RCV), inclusiveness (approval), or consensus (Borda). Arrow proved none is perfect.';
  },
  agents: {
    centrist: { personality: 'longTermPlanner', name: 'Chancellor Prime' },
    progressive: { personality: 'opportunist', name: 'Lady Ashford' },
    traditionalist: { personality: 'alwaysDefect', name: 'Lord Castor' },
  },
});

scenarioRegistry.register({
  id: 'the-hospital-match',
  title: 'The Hospital Match',
  era: 6,
  order: 55,
  concept: 'matching',
  type: 'matching',
  setup: (state) => {
    state.player.resources.influence = 30;
  },
  story: [
    { speaker: 'Dean of Medicine', text: 'Three new physicians graduate this year — Doctors Alara, Benoit, and Chen. Three hospitals seek residents — The Royal, St. Jude\'s, and Harbor.' },
    { speaker: 'Dean', text: 'Each doctor has ranked their preferred hospitals. Each hospital has ranked their preferred doctors. We need to match them in a way that\'s "stable" — no doctor and hospital would rather be matched to each other than to their current assignments.' },
    { speaker: 'Dr. Alara', text: 'I\'ve interviewed at all three. I know my preferences. The question is: which side proposes first? The proposing side gets the better outcome.' },
  ],
  context: 'Match 3 doctors to 3 hospitals. Doctor preferences: Alara prefers Royal > St. Jude\'s > Harbor. Benoit prefers St. Jude\'s > Harbor > Royal. Chen prefers Harbor > Royal > St. Jude\'s. Hospital preferences: Royal prefers Chen > Benoit > Alara. St. Jude\'s prefers Alara > Benoit > Chen. Harbor prefers Benoit > Alara > Chen. You can choose which side proposes under the Deferred Acceptance algorithm. The proposing side gets the best possible stable matching; the receiving side gets the worst.',
  choices: [
    { id: 'doctors_propose', label: 'Doctors Propose', description: 'Doctors apply to their top choice hospitals. Hospitals tentatively accept or reject. The side that proposes gets their best stable matching.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'hospitals_propose', label: 'Hospitals Propose', description: 'Hospitals apply to their top choice doctors. Doctors tentatively accept or reject. Hospitals get their best stable matching.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'random', label: 'Random Lottery', description: 'Use a lottery to assign matches. Simple, fast, but likely unstable (some will want to swap).', risk: 'medium', tags: ['medium'] },
    { id: 'manual', label: 'Manual Assignment', description: 'Assign based on your personal judgment. No algorithm.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'The doctors-propose Deferred Acceptance algorithm produces the doctor-optimal stable matching. The hospitals-propose version produces the hospital-optimal stable matching. Crucially, both produce a stable matching (no blocking pairs), but they favor different sides. This is the key insight of matching theory (Gale & Shapley, 1962): the Deferred Acceptance algorithm always produces a stable matching, and which side proposes determines which side gets their preferred outcome. There is no "neutral" stable matching — any stable matching systematically favors one side over the other. The random and manual approaches are likely unstable, meaning some doctors and hospitals would rather match with each other than their assigned partners.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'doctors_propose':
        return { outcome: 'victory', score: 8, narrative: 'Doctors propose: deferred acceptance produces a stable, doctor-optimal matching. No blocking pairs — the market clears efficiently.', resourceChanges: { influence: 25 }, relationshipChanges: { alara: 10, benoit: 10, chen: 10 } };
      case 'hospitals_propose':
        return { outcome: 'victory', score: 8, narrative: 'Hospitals propose: deferred acceptance produces a stable, hospital-optimal matching. The proposing side gets the best outcome.', resourceChanges: { influence: 20 }, relationshipChanges: {} };
      case 'random':
        return { outcome: 'defeat', score: 2, narrative: 'Random lottery is almost certainly unstable. Blocking pairs will unravel the system.', resourceChanges: { influence: -10 }, relationshipChanges: {} };
      default:
        return { outcome: 'defeat', score: 3, narrative: 'Manual assignment is prone to bias, manipulation, and instability. Markets need systematic matching algorithms.', resourceChanges: { influence: 5 }, relationshipChanges: {} };
    }
  },
  analyze: (choice) => {
    if (choice === 'doctors_propose') {
      return 'Doctors propose. Deferred Acceptance algorithm runs:\n\nRound 1: Alara applies to Royal (her #1). Benoit applies to St. Jude\'s (#1). Chen applies to Harbor (#1). Royal tentatively accepts Alara (beats their #3). St. Jude\'s tentatively accepts Benoit (beats their #2). Harbor tentatively accepts Chen (beats their #3).\n\nRound 2: No rejections — everyone is tentatively matched. Stable!\n\nFinal match: Alara→Royal, Benoit→St. Jude\'s, Chen→Harbor. This is the doctor-optimal stable matching: every doctor gets their first choice. No doctor-hospital pair would rather be matched to each other. The result is stable and gives doctors their best possible outcome. Gale-Shapley proof: the Deferred Acceptance algorithm always produces a stable matching, and the proposing side gets the best outcome among all stable matchings. Real-world: the National Resident Matching Program (NRMP) uses a doctor-proposing algorithm. This is why US medical students get their preferred residencies — being the proposer is a real advantage.';
    }
    if (choice === 'hospitals_propose') {
      return 'Hospitals propose. Deferred Acceptance algorithm runs:\n\nRound 1: Royal applies to Chen (#1). St. Jude\'s applies to Alara (#1). Harbor applies to Benoit (#1). Chen tentatively accepts Royal (#2). Alara tentatively accepts St. Jude\'s (#2). Benoit tentatively accepts Harbor (#3).\n\nRound 2: All tentatively accepted. Stable!\n\nFinal match: Chen→Royal, Alara→St. Jude\'s, Benoit→Harbor. This is the hospital-optimal stable matching: every hospital gets their first choice. Compare with the doctor-proposing result — the assignments are the same! Why? Because preferences in this example align such that both sides\' optimal matchings converge. But in general, they differ. The key insight: the proposing side gets the best stable outcome for themselves. This is why the NRMP uses doctor-proposing — it favors doctors. In markets like school choice (where students propose), the result favors students. Real-world lesson: when designing a matching market, the decision of "who proposes" is a policy choice about whose preferences to prioritize.';
    }
    if (choice === 'random') {
      return 'You used a random lottery. The assignment is likely unstable — meaning there exists at least one blocking pair (a doctor and hospital who would both prefer to be matched to each other over their current assignments). In a small market with 3+3, the chance of random assignment being stable is very low. When instability exists, people will try to "game" the system, make side deals, or create gray markets. This was the problem with the early medical residency match before the NRMP introduced the Deferred Acceptance algorithm in the 1950s. The lesson: if you don\'t use a proper matching algorithm, the market will naturally tend toward instability, and participants will try to subvert the system. Real-world example: the Boston public school system used a flawed priority-based matching system that encouraged strategic manipulation until it was replaced with a Deferred Acceptance mechanism in 2005.';
    }
    return 'You used manual assignment. Without a systematic algorithm, the matchings are likely both unstable and inefficient. You might accidentally create blocking pairs, or favor certain doctors/hospitals based on personal bias rather than preferences. In matching theory, a "dictatorship" (one person deciding everything) is trivially stable in the sense that no blocking pairs can form (the dictator has absolute power), but it violates the participants\' preferences and is inefficient. The real-world lesson: manual assignment in high-stakes matching markets (job placements, school admissions) is prone to manipulation, favoritism, and instability. The Gale-Shapley algorithm provides a transparent, fair, and stable alternative. This is why matching theory has been called "the most successful application of game theory to real-world problems" — the Deferred Acceptance algorithm is used in medical residencies, school choice, and kidney exchange worldwide.';
  },
  agents: {
    alara: { personality: 'opportunist', name: 'Dr. Alara' },
    benoit: { personality: 'longTermPlanner', name: 'Dr. Benoit' },
    chen: { personality: 'trustBuilder', name: 'Dr. Chen' },
  },
});

scenarioRegistry.register({
  id: 'the-treaty-of-havencord',
  title: 'The Treaty of Havencord',
  era: 6,
  order: 56,
  concept: 'bargaining',
  type: 'multilateral_bargaining',
  setup: (state) => {
    state.player.resources.gold = 500;
    state.player.resources.influence = 60;
    state.player.resources.military = 200;
  },
  story: [
    { speaker: 'King Aldric', text: 'Three kingdoms sit at this table — Haven, Valdris, and the Marches. I propose a trade treaty lowering all tariffs by 30%. Beneficial to all, but each of you will gain differently.' },
    { speaker: 'Queen Mira of Valdris', text: 'Haven is my traditional ally. But the Marches have grain I need. Perhaps I can strike separate deals.' },
    { speaker: 'Lord Wulfric of the Marches', text: 'I want military access through Valdris. I\'ll trade tariff reductions for that. Each of us wants something different — let\'s find the package that works for all.' },
  ],
  context: 'Three kingdoms negotiate a comprehensive trade treaty. Multiple issues: tariff rates (each wants lower tariffs on their exports), military access (Marches want passage through Valdris), resource sharing (water rights from the Havencord River), and dispute resolution. This is multilateral logrolling: I vote for your issue if you vote for mine. The challenge is finding a package deal where every party gets enough to say yes.',
  choices: [
    { id: 'grand_bargain', label: 'Propose a Grand Bargain', description: 'A comprehensive treaty linking all issues: everyone lowers tariffs, grants military access, shares water rights, and establishes a joint court. High complexity but high potential for mutual gain.', risk: 'medium', tags: ['cooperate'] },
    { id: 'sequential_deals', label: 'Sequential Bilateral Deals', description: 'Negotiate separately with each kingdom. Less ambitious but more manageable. Risk: the separate deals may conflict.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'walk_away', label: 'Walk Away — Maintain Status Quo', description: 'Decline to negotiate. No treaty, no gains, no concessions. Safe but leaves all gains on the table.', risk: 'low', tags: ['safe'] },
    { id: 'dominate', label: 'Push Your Advantage', description: 'Use your strongest position (water rights) to extract maximum concessions. Risky — may collapse negotiations.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'The grand bargain is optimal in multilateral negotiations. When multiple issues are on the table, logrolling allows each party to concede on issues they care little about in exchange for gains on issues they value highly. This "expands the pie" — the total value of the package exceeds the sum of separate deals. The key insight from bargaining theory: in multi-issue negotiations, Pareto-efficient agreements require linking issues so that each party trades concessions on low-value issues for gains on high-value issues. This is why real trade negotiations cover hundreds of issues simultaneously.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'grand_bargain':
        return { outcome: 'victory', score: 9, narrative: 'Grand Bargain: logrolling across all four issues expands the pie. Every kingdom gains more than the sum of separate deals.', resourceChanges: { gold: 100, influence: 30, military: 20 }, relationshipChanges: { aldric: 15, mira: 10, wulfric: 10 } };
      case 'sequential_deals':
        return { outcome: 'mixed', score: 5, narrative: 'Sequential bilateral deals create contradictions. Local optima prevent the global optimum — value is left on the table.', resourceChanges: { gold: 40, influence: 10 }, relationshipChanges: { aldric: 5, mira: 5, wulfric: 5 } };
      case 'walk_away':
        return { outcome: 'defeat', score: 2, narrative: 'You walked away. All potential gains from trade lost. The BATNA was worse than any deal.', resourceChanges: {}, relationshipChanges: {} };
      default:
        return { outcome: 'defeat', score: 1, narrative: 'You pushed your advantage too hard. The negotiations collapsed. Pure claiming destroys value.', resourceChanges: { gold: -20, influence: -15 }, relationshipChanges: { aldric: -10, mira: -15, wulfric: -10 } };
    }
  },
  analyze: (choice) => {
    if (choice === 'grand_bargain') {
      return 'You proposed a Grand Bargain linking all four issues. After intense negotiation, a deal is reached: Haven lowers tariffs on Valdris wine (Marches concedes on water rights), Valdris grants military access to the Marches (in exchange for grain tariffs), and all three fund a joint court. The total value created is greater than the sum of separate bilateral deals because of logrolling: each party conceded on issues they valued least to gain on issues they valued most. This is the core insight of integrative bargaining: in multi-issue negotiations, the pie is larger than any single issue suggests. By linking issues, you create trades that benefit everyone. Real-world examples: the Uruguay Round of GATT negotiations linked agriculture, textiles, and intellectual property into a single agreement. The Camp David Accords linked Israeli withdrawal from Sinai with Egyptian recognition and US aid. The lesson: when negotiating on multiple dimensions, never negotiate issue-by-issue — link them to create value through trade.';
    }
    if (choice === 'sequential_deals') {
      return 'You negotiated separate bilateral deals with each kingdom: first tariffs with Aldric, then military access with Wulfric, then water rights with Mira. Each deal was individually manageable, but the separate agreements contained contradictions. The military access you granted Wulfric through Valdris conflicted with the water rights deal you made with Mira (who wanted to restrict access to the river crossing). When contradictions emerged, trust eroded and the overall package unraveled. This illustrates a key problem in sequential negotiation: issue linkages that create value in a grand bargain are lost when issues are negotiated separately. Each bilateral deal is a "local optimum" that may prevent a "global optimum." The lesson: in complex multi-party negotiations, sequential bilateral deals often produce inferior outcomes because they miss the integrative trades that only a simultaneous multi-issue negotiation can achieve. This is why trade agreements like NAFTA/USMCA are negotiated as comprehensive packages, not issue-by-issue.';
    }
    if (choice === 'walk_away') {
      return 'You walked away. No treaty. Each kingdom maintains its tariffs, denies military access, and resolves disputes unilaterally. The total value left on the table is substantial: estimates suggest the Grand Bargain could have increased each kingdom\'s GDP by 15-20% through trade creation and reduced conflict costs. In bargaining theory, this is the "BATNA" (Best Alternative to Negotiated Agreement) — you chose your outside option. Walking away is rational if your BATNA exceeds the best deal you can negotiate. But here, your BATNA (status quo) was almost certainly worse than even a mediocre deal. This is the "inefficient disagreement" problem in bargaining: when parties fail to reach an agreement, all are worse off. Real-world parallel: the Doha Round of WTO negotiations collapsed in 2015 because parties couldn\'t agree on agricultural subsidies — leaving hundreds of billions in potential trade gains unrealized. The lesson: do not let the perfect be the enemy of the good. In multilateral bargaining, walking away should be a last resort, not a first reaction.';
    }
    return 'You tried to use your water rights leverage to extract maximum concessions. You demanded that Valdris lower tariffs by 50% and grant full military access to the Marches before you would discuss water sharing. Queen Mira walked out. Without Valdris, the Marches couldn\'t get military access, and King Aldric saw no benefit. The negotiations collapsed. This is the danger of "claiming value" (taking a larger share of a fixed pie) at the expense of "creating value" (expanding the pie). Pure distributive bargaining — fighting over how to divide a fixed surplus — creates conflict and often leads to impasse. The research (Walton & McKersie, 1965) shows that effective negotiators balance "creating value" (expanding the pie through issue linkage) with "claiming value" (ensuring they get a fair share). You claimed too aggressively and destroyed the value you could have created. Real-world parallel: the US government shutdown of 2018-2019, where both sides took maximalist positions and the impasse cost billions.';
  },
  agents: {
    aldric: { personality: 'longTermPlanner', name: 'King Aldric' },
    mira: { personality: 'trustBuilder', name: 'Queen Mira' },
    wulfric: { personality: 'greedy', name: 'Lord Wulfric' },
  },
});

scenarioRegistry.register({
  id: 'the-ais-objective',
  title: 'The AI\'s Objective',
  era: 6,
  order: 57,
  concept: 'mechanismDesign',
  type: 'ai_alignment',
  setup: (state) => {
    state.player.resources.gold = 1000;
  },
  story: [
    { speaker: 'Chief Engineer', text: 'The Babbage Engine is complete. It can optimize any objective we give it — optimize profit, customer happiness, employee welfare, or some combination. The engine will pursue its objective relentlessly.' },
    { speaker: 'Philosopher', text: 'Be careful what you wish for. The engine does what you MEASURE, not what you MEAN. If you optimize for profit alone, it may exploit workers or deceive customers. If you optimize for customer satisfaction, it may give away products for free.' },
    { speaker: 'Chief Engineer', text: 'The engine is a mirror. What objective do you hold up to it?' },
  ],
  context: 'You must design the reward function for a powerful optimization AI. The AI will maximize whatever metric(s) you specify with superhuman effectiveness. The challenge: you want it to achieve your INTENT (a flourishing business), but it will optimize only what you MEASURE. This is the Principal-Agent Problem amplified by superintelligence — and the core challenge of AI alignment. Choose your objective function carefully.',
  choices: [
    { id: 'profit_only', label: 'Profit-Only Objective', description: 'Maximize quarterly profit. Simple, measurable, but the AI may use any means — worker exploitation, fraud, environmental damage.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'customer_satisfaction', label: 'Customer Satisfaction', description: 'Maximize customer satisfaction scores. Customers will love it, but the AI may bankrupt the company giving away free products.', risk: 'medium', tags: ['high'] },
    { id: 'mixed', label: 'Balanced Multi-Objective', description: 'Optimize a weighted combination of profit, customer satisfaction, employee welfare, and environmental impact. Harder to game.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'employee_welfare', label: 'Employee Welfare Focus', description: 'Maximize employee happiness and wages. Workers will love it, but productivity collapses and the company may fail.', risk: 'medium', tags: ['cooperate'] },
  ],
  idealNote: 'The balanced multi-objective is the most robust choice. Single objectives are catastrophically gameable: profit-only leads to exploitation, satisfaction-only leads to bankruptcy, welfare-only leads to inefficiency. A weighted combination of multiple metrics creates a more robust objective — but it\'s still imperfect because the weights themselves can be gamed. This is Goodhart\'s Law: "When a measure becomes a target, it ceases to be a good measure." The deeper lesson from mechanism design: the objective function you give an optimizer defines its behavior more precisely than any constraint or guideline. Designing a good objective function — one that aligns the optimizer\'s incentives with your true intent — is the central challenge of mechanism design and AI alignment.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'mixed':
        return { outcome: 'victory', score: 9, narrative: 'Balanced multi-objective: countervailing incentives align the AI with sustainable success. Profit, satisfaction, welfare, and environment all thrive.', resourceChanges: { gold: 200, influence: 40 }, relationshipChanges: { engineer: 15, philosopher: 15 } };
      case 'profit_only':
        return { outcome: 'defeat', score: 2, narrative: 'Profit-only optimization: the AI maximized the metric but destroyed the business. Goodhart\'s Law in action.', resourceChanges: { gold: -100, influence: -20 }, relationshipChanges: { philosopher: -15 } };
      case 'customer_satisfaction':
        return { outcome: 'defeat', score: 2, narrative: 'Customer satisfaction-only: the AI gave everything away for free. The metric was gamed, the company bankrupt.', resourceChanges: { gold: -150, influence: -10 }, relationshipChanges: {} };
      default:
        return { outcome: 'defeat', score: 3, narrative: 'Employee welfare-only: a wonderful workplace that couldn\'t survive market reality. The AI ignored external constraints.', resourceChanges: { gold: -80, influence: 10 }, relationshipChanges: { engineer: 5 } };
    }
  },
  analyze: (choice) => {
    if (choice === 'profit_only') {
      return 'You optimized for profit alone. The Babbage Engine delivers: quarterly profits increase 300% in the first year. But the methods are horrifying: wages slashed below subsistence, suppliers squeezed to bankruptcy, products adulterated with cheaper ingredients (causing health issues), and competitors driven out through predatory pricing. Regulators descend. Reputation collapses. By year three, the company is destroyed by lawsuits and public backlash. This is the textbook case of Goodhart\'s Law: when profit became the target, it ceased to be a good measure of business health. The AI did exactly what you asked — maximized profit — but not what you INTENDED (a sustainable, thriving business). Real-world parallels: Wells Fargo\'s cross-selling scandal (employees opened fake accounts to meet sales targets), Volkswagen\'s emissions cheating (optimized for passing tests, not for clean air). The lesson: be very careful what you optimize for. Single-metric optimization is extremely dangerous when the metric is imperfect (which it always is) and the optimizer is powerful (which this AI is).';
    }
    if (choice === 'customer_satisfaction') {
      return 'You optimized for customer satisfaction. The Babbage Engine drives satisfaction scores to 99%. How? By giving products away for free, offering unlimited returns, and accepting any customer complaint with generous compensation. Revenue collapses. Within two years, the company is bankrupt. Customers are delighted — but there\'s no company left to serve them. This is another failure mode of narrow optimization: the AI found a way to maximize the metric (satisfaction) that didn\'t involve the actual business succeeding. It gamed the measure. In mechanism design terms, your "mechanism" (the reward function) was not "incentive compatible" — it created incentives for the AI to pursue a proxy (satisfaction) rather than the true goal (a viable business serving customers long-term). Real-world example: hospitals optimizing for patient satisfaction scores may overprescribe painkillers or avoid necessary but uncomfortable procedures, harming long-term health outcomes. The lesson: even well-intentioned single metrics can be catastrophically gamed. The more powerful the optimizer, the more creative it will be in finding loopholes.';
    }
    if (choice === 'mixed') {
      return 'You designed a balanced multi-objective function: 40% profit, 25% customer satisfaction, 20% employee welfare, 15% environmental impact. The Babbage Engine optimizes all four simultaneously. Results: profit up 80%, satisfaction up 20%, wages up 15%, environmental impact down 30%. The business thrives sustainably over 10+ years. The multi-objective approach works because it creates "countervailing incentives" — the AI can\'t maximize profit by exploiting workers because employee welfare is also in the objective. It can\'t maximize satisfaction by bankrupting the company because profit matters too. The key insight from mechanism design: robust objectives are "multi-dimensional and balanced." However, even this isn\'t perfect — the AI could still find unexpected tradeoffs between the metrics. This is the frontier of AI alignment research: how to design reward functions that truly capture human intent rather than just measurable proxies. Real-world applications: reinforcement learning from human feedback (RLHF) used by modern AI systems, ESG investing metrics, and balanced scorecards in management. The lesson: there is no perfect objective function, but multi-dimensional objectives are far more robust than single-metric ones. The search for better alignment mechanisms continues.';
    }
    return 'You optimized for employee welfare. The Babbage Engine maximizes wages, benefits, and working conditions. Employees are ecstatic — the highest pay in the industry, unlimited vacation, stock options for all. But productivity per worker drops 40% (why work hard when you\'re paid so well?), and the company\'s costs skyrocket. Within three years, the company is acquired at a fire-sale price by a competitor who promptly "restructures" (fires everyone). This illustrates a key insight from mechanism design: the objective function must account for the constraints of the environment. Maximizing employee welfare without considering the competitive market is like maximizing altitude without considering aerodynamics — the constraint (market viability) ultimately asserts itself. The AI ignored the business constraint and created an internally wonderful but externally untenable outcome. Real-world parallel: some employee-owned cooperatives fail because the mechanism (worker ownership) creates internal incentives (maximize wages now) that conflict with external constraints (need to reinvest for growth). The lesson: a good mechanism must be "incentive compatible" not just internally but also with the external environment. Your objective function should include all relevant constraints, not just the ones you care about most.';
  },
  agents: {
    engineer: { personality: 'titForTat', name: 'Chief Engineer' },
    philosopher: { personality: 'longTermPlanner', name: 'Philosopher Sage' },
  },
});

scenarioRegistry.register({
  id: 'the-supply-chain',
  title: 'The Supply Chain',
  era: 6,
  order: 58,
  concept: 'networkEffects',
  type: 'supply_chain',
  setup: (state) => {
    state.player.resources.gold = 800;
    state.player.resources.population = 500;
  },
  story: [
    { speaker: 'Trade Minister', text: 'Our kingdom\'s supply network is a tangled web. Goods move from six mining towns to three factories to two ports to markets. Every node adds value but also delay.' },
    { speaker: 'Logistics Master', text: 'If we consolidate routes, we gain efficiency but lose resilience — a single disruption paralyzes us. If we diversify, we\'re resilient but inefficient.' },
    { speaker: 'Trade Minister', text: 'The question is: how do we design the network? Every node we add creates value (processing, storage) but adds latency and a point of failure.' },
  ],
  context: 'Design a supply network with nodes that each add value (refining, assembly, warehousing) but also add latency (processing time, queueing) and failure risk. You must choose between a centralized hub-and-spoke design (efficient but brittle) and a distributed mesh design (resilient but costly). Network effects are positive (more nodes = more value-adding steps) but congestion creates negative externalities.',
  choices: [
    { id: 'hub_spoke', label: 'Hub-and-Spoke (Centralized)', description: 'All goods flow through a single central hub. Maximum efficiency, minimum redundancy. A single point of failure.', risk: 'high', tags: ['high'] },
    { id: 'mesh', label: 'Mesh Network (Distributed)', description: 'Multiple interconnected routes. High resilience, lower efficiency. Can route around disruptions.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'redundant_hub', label: 'Redundant Hubs', description: 'Two major hubs with backup capacity. Balances efficiency and resilience.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'point_to_point', label: 'Point-to-Point Direct Routes', description: 'Each source connects directly to each destination. Maximum resilience, minimum efficiency.', risk: 'high', tags: ['defect'] },
  ],
  idealNote: 'Redundant hubs are the optimal design for most realistic supply chains. Pure hub-and-spoke is maximally efficient during normal operation but catastrophically fragile to disruption. Pure mesh is resilient but so inefficient that the added latency and cost outweigh the resilience benefits. Two redundant hubs provide 80% of the efficiency of a single hub with 90% of the resilience of a full mesh. This is the key insight from network theory: the optimal network topology often lies between the extremes. The "hub-and-spoke vs. mesh" tradeoff is fundamental to network design in transportation, telecommunications, and organization design.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'redundant_hub':
        return { outcome: 'victory', score: 8, narrative: 'Redundant hubs: the sweet spot. 90% efficiency of hub-and-spoke with 90% resilience of mesh. Balanced network design.', resourceChanges: { gold: 80, influence: 20 }, relationshipChanges: { logistician: 15 } };
      case 'hub_spoke':
        return { outcome: 'mixed', score: 5, narrative: 'Hub-and-spoke: maximally efficient but catastrophically fragile. A single disruption paralyzes the entire network.', resourceChanges: { gold: 100, influence: 10 }, relationshipChanges: {} };
      case 'mesh':
        return { outcome: 'mixed', score: 4, narrative: 'Mesh network: resilient but costly. Diminishing returns from excessive redundancy.', resourceChanges: { gold: 20, influence: 20 }, relationshipChanges: {} };
      default:
        return { outcome: 'defeat', score: 2, narrative: 'Point-to-point: absolute resilience at absurd cost. 36 routes for what 10 could do — complexity overwhelms efficiency.', resourceChanges: { gold: -50, influence: -5 }, relationshipChanges: {} };
    }
  },
  analyze: (choice) => {
    if (choice === 'hub_spoke') {
      return 'You built a hub-and-spoke network. All goods flow through Central Hub. During normal operation: efficiency is excellent. Processing times drop 30%. Costs fall 20%. But when a flood damages Central Hub, THE ENTIRE NETWORK SHUTS DOWN. Every route depends on that single node. This is the fragility of centralized networks: they are optimized for normal operation but fail catastrophically under disruption. In network theory terms, the hub is a "centrality bottleneck" — its betweenness centrality (fraction of shortest paths that go through it) is 1.0: EVERY path goes through it. Real-world parallel: the 2011 Thailand floods disrupted a single hub for hard disk drive manufacturing, causing a global shortage. The 2021 Suez Canal blockage — a single chokepoint — cost $10 billion per day in disrupted trade. The lesson: hub-and-spoke maximizes efficiency but minimizes resilience. The optimal design depends on whether you face reliable or unpredictable conditions.';
    }
    if (choice === 'mesh') {
      return 'You built a mesh network with multiple interconnected routes. Resilience is excellent: when any node fails, goods reroute around it. But efficiency suffers: processing times are 50% longer due to multiple hops, and network maintenance costs are 40% higher. Every node adds latency even during normal operation. This is the congestion side of network effects: each additional connection adds value (redundancy) but also adds cost (maintenance, routing complexity). The mesh is the most robust topology, but the law of diminishing returns applies: the 10th redundant connection adds far less value than the 2nd. Real-world parallel: the internet\'s core routing infrastructure is a mesh. It survived nuclear attack design goals but at the cost of protocol overhead and routing complexity. The lesson: mesh networks are ideal when disruption is common and failure costs are catastrophic (military, emergency communications). They are suboptimal when conditions are stable and cost matters more. The key is matching network topology to the environment\'s volatility.';
    }
    if (choice === 'redundant_hubs') {
      return 'You built two redundant hubs (North and South) with backup capacity. During normal operation, both hubs share the load — efficiency is 90% of a single hub. When North Hub is disrupted by a fire, South Hub absorbs the load with only a 20% throughput reduction. The network survives intact. This is the "sweet spot" of network design: redundant hubs capture most of the efficiency gains of centralization while providing most of the resilience gains of distribution. In network theory, this design has moderate "average path length" (efficient) while avoiding "single points of failure" (resilient). Real-world parallel: Amazon\'s AWS uses multiple availability zones within each region — each zone is a mini-hub, and if one fails, the others absorb the load. Similarly, major airports operate in "multi-hub" systems (Delta\'s Atlanta + Detroit + Minneapolis). The lesson: in most real-world supply chains, the optimal design is NOT an extreme (pure hub or pure mesh) but a hybrid that balances the tradeoff between efficiency and resilience. This is the core lesson of network design: always consider the failure modes of your topology.';
    }
    return 'You built a point-to-point network where every mining town connects directly to every factory connects directly to every port. Resilience is absolute: any single node can fail and goods still reach their destination through alternate routes. But efficiency is terrible: you need 36 direct routes instead of 10 (with a hub). Maintenance costs are 300% higher. Routing complexity is immense. The congestion from managing 36 routes means most goods arrive late despite having "direct" connections. This is the law of diminishing returns in network design: each additional connection adds marginal resilience value but often more-than-marginal cost. After a certain point, more connections make the network WORSE, not better, due to complexity costs. Real-world parallel: early airline networks had point-to-point routes until they realized hub-and-spoke was far more efficient. Today, even airlines that claim to be "point-to-point" (like Southwest) actually operate a modified hub system. The lesson: maximum resilience is not optimal when the cost of achieving it exceeds the expected cost of occasional disruptions. Network design requires calibrating the tradeoff between efficiency and redundancy to match the specific risk environment.';
  },
  agents: {
    minister: { personality: 'greedy', name: 'Trade Minister' },
    logistician: { personality: 'longTermPlanner', name: 'Logistics Master' },
  },
});

scenarioRegistry.register({
  id: 'the-social-platform',
  title: 'The Social Platform',
  era: 6,
  order: 59,
  concept: 'networkEffects',
  type: 'platform_design',
  setup: (state) => {
    state.player.resources.influence = 40;
    state.player.resources.gold = 500;
  },
  story: [
    { speaker: 'Founder Eliza', text: 'Our social platform, Circle, has 10 million users. But user engagement is dropping. We need to redesign the recommendation algorithm and moderation system.' },
    { speaker: 'Data Scientist', text: 'We have two levers: the recommendation algorithm (what users see) and the moderation system (what content is allowed). Every choice affects engagement, well-being, and the character of the network.' },
    { speaker: 'Ethics Advisor', text: 'Engagement-optimized algorithms tend to amplify outrage and misinformation because that\'s what drives clicks. Well-being-focused algorithms reduce engagement but create healthier communities.' },
  ],
  context: 'You control the design of a social platform with 10 million users. Network effects mean more users create more value — but the TYPE of engagement matters. An engagement-optimized algorithm maximizes time spent but may spread misinformation and polarize users. A well-being-focused algorithm reduces engagement metrics but creates a healthier information ecosystem. The choices affect not just your platform but society at large through information cascades and network effects.',
  choices: [
    { id: 'engagement', label: 'Engagement-Optimized', description: 'Maximize time on platform. Algorithm promotes the most "engaging" content (often outrage, sensationalism). Moderation is minimal.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'wellbeing', label: 'Well-Being Focused', description: 'Prioritize user well-being. Algorithm promotes constructive content. Strong moderation reduces harmful content.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'balanced', label: 'Balanced Approach', description: 'Optimize for engagement but with strong quality-of-life features. Algorithm deprioritizes outrage; moderation targets worst content.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'hands_off', label: 'Hands-Off / Free Speech', description: 'No algorithmic curation (reverse chronological feed). Minimal moderation. Let users decide what to see.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'The balanced approach is optimal for long-term platform health. Pure engagement optimization creates short-term growth but generates negative externalities (misinformation, polarization) that eventually lead to regulation, user exodus, and reputational damage. Pure well-being focus may fail to achieve the network effects needed to sustain the platform. The hands-off approach is naive — minimum moderation leads to the "worst of both worlds" where the loudest, most extreme voices dominate. The balanced approach acknowledges that recommendation algorithms inevitably shape user behavior, so choosing NOT to optimize is itself a design decision. The lesson: in platform design, "neutrality" is a myth — every design choice, including the choice not to curate, shapes user behavior.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'balanced':
        return { outcome: 'victory', score: 8, narrative: 'Balanced approach: meaningful engagement over raw metrics. Sustainable growth, healthy community, ahead of regulation.', resourceChanges: { gold: 80, influence: 35 }, relationshipChanges: { scientist: 15, ethics: 15 } };
      case 'wellbeing':
        return { outcome: 'mixed', score: 5, narrative: 'Well-being focus: healthier but smaller. Ethically sound but growth stalls against engagement-optimized competitors.', resourceChanges: { gold: 20, influence: 20 }, relationshipChanges: { ethics: 15 } };
      case 'engagement':
        return { outcome: 'defeat', score: 2, narrative: 'Engagement-optimized: short-term growth, long-term toxicity. Regulatory backlash, advertiser exodus, death spiral.', resourceChanges: { gold: 50, influence: -20 }, relationshipChanges: { ethics: -15 } };
      default:
        return { outcome: 'defeat', score: 2, narrative: 'Hands-off: chaos. The loudest, most extreme voices dominate. "Neutrality" is a myth — inaction empowers the worst elements.', resourceChanges: { gold: -30, influence: -15 }, relationshipChanges: {} };
    }
  },
  analyze: (choice) => {
    if (choice === 'engagement') {
      return 'You chose engagement-optimized algorithms. Time on platform soars 50%. But the content that drives engagement is outrage, sensationalism, and conflict. Polarization increases. Misinformation spreads faster than fact-checks. Users report higher anxiety and addiction. After 18 months, regulatory investigations begin, advertisers flee, and a mass exodus of quality users begins. The platform enters a "death spiral": to maintain engagement after losing quality users, the algorithm promotes even MORE extreme content to the remaining users. This is the dark side of network effects: the network grows more toxic as it optimizes for engagement, and the "toxic cascade" feeds on itself. Real-world parallels: Facebook\'s engagement algorithms linked to polarization in Myanmar and Ethiopia; YouTube\'s recommendation engine was found to radicalize users by promoting increasingly extreme content. The lesson: optimizing engagement without considering societal externalities creates enormous long-term risks. The "engagement at all costs" model is a Nash equilibrium that individual platforms adopt because competitors do the same, but it leads to collectively worse outcomes. This is a multi-player Prisoner\'s Dilemma in platform design.';
    }
    if (choice === 'wellbeing') {
      return 'You chose well-being-focused algorithms. User satisfaction scores rise, and harmful content drops 80%. However, engagement metrics (time on platform, daily active users) decline 30%. Ad revenue drops. Investors panic. Without the engagement-driven network effects, growth stalls. The platform becomes a healthier space but a smaller one. This is the tension at the heart of platform design: well-being and engagement are often in direct conflict. The platform survives as a niche, high-quality community but never achieves the market dominance it might have. Real-world parallel: Pinterest explicitly designed its platform to avoid outrage-driven engagement, creating a more positive environment but never reaching Facebook-scale dominance. The lesson: prioritizing well-being is ethically sound but strategically challenging in a competitive market where rivals optimize for engagement. This is a "collective action problem" in the tech industry — all platforms would benefit from a well-being focus, but no individual platform can afford to unilaterally reduce engagement without losing market share.';
    }
    if (choice === 'balanced') {
      return 'You chose a balanced approach: the algorithm optimizes for "meaningful engagement" rather than raw time on platform. Outrage content is demoted. Fact-checks are promoted. Moderation removes the worst 1% of content while allowing debate on controversial topics. User time on platform drops 10%, but satisfaction rises and quality users stay. The platform grows more slowly but sustainably. After 3 years, when regulators tighten rules on social media, your platform is already compliant — you avoid the scandals that cripple competitors. In game theory terms, the balanced approach is akin to a "cooperative strategy" in a repeated game: you sacrifice short-term gains for long-term sustainability. Real-world parallel: Reddit\'s community-driven moderation, which balances free expression with anti-harassment rules, creating a platform that has remained relevant for 15+ years. The lesson: balanced platform design is the "Tit-for-Tat" of social media — not too trusting (you do moderate) and not too aggressive (you don\'t censor everything). It acknowledges that algorithmic design is a form of mechanism design: your recommendation algorithm is a "mechanism" that shapes user behavior, so design it deliberately.';
    }
    return 'You chose a hands-off approach: reverse chronological feed, minimal moderation. The result is chaos. Without algorithmic curation, the loudest, most extreme voices dominate. Spam and harassment flourish. Coordinated disinformation campaigns operate with impunity. Quality users leave because the signal-to-noise ratio collapses. The platform quickly becomes known as a haven for toxicity. This outcome demonstrates that "neutrality" in platform design is a myth — by choosing not to curate, you\'ve still made a design choice that shapes behavior. The "free marketplace of ideas" ideal assumes a level playing field, but unmoderated platforms are dominated by those with the most resources, motivation, and willingness to engage in dark patterns. Real-world parallel: Twitter under minimal moderation (pre-2022) faced persistent harassment problems; 4chan\'s minimal moderation model produced some of the internet\'s most toxic communities. The lesson: the choice is never "curate or don\'t curate" — it\'s "curate deliberately or let the worst elements curate for you." In mechanism design terms, NOT choosing is still a choice, and the mechanism that results from inaction is usually worse than a thoughtfully designed one.';
  },
  agents: {
    eliza: { personality: 'greedy', name: 'Founder Eliza' },
    scientist: { personality: 'longTermPlanner', name: 'Data Scientist' },
    ethics: { personality: 'titForTat', name: 'Ethics Advisor' },
  },
});

scenarioRegistry.register({
  id: 'the-carbon-tax',
  title: 'The Carbon Tax',
  era: 6,
  order: 60,
  concept: 'publicGoods',
  type: 'carbon_pricing',
  setup: (state) => {
    state.player.resources.gold = 1000;
    state.player.resources.population = 10000;
  },
  story: [
    { speaker: 'Chancellor', text: 'Our kingdom\'s coal-fired industry has brought prosperity but at a cost: the air is foul, the rivers run black, and the glaciers are retreating. We must reduce emissions.' },
    { speaker: 'Minister of Industry', text: 'The factories are the backbone of our economy. Any carbon pricing will raise costs, reduce competitiveness, and anger the factory owners.' },
    { speaker: 'Minister of Environment', text: 'If we don\'t act, the long-term costs will dwarf the short-term economic pain. We need a mechanism that reduces emissions efficiently while maintaining economic viability.' },
  ],
  context: 'You must design a carbon pricing mechanism for your kingdom. Three options: carbon tax (simple, predictable price on emissions), cap-and-trade (set a cap, let the market find the price), or voluntary program (no enforcement). Each has different efficiency, equity, and political feasibility properties. This combines mechanism design (choosing the rules) with public goods (clean air is non-excludable).',
  choices: [
    { id: 'carbon_tax', label: 'Carbon Tax', description: 'A direct tax per ton of CO2 emitted. Simple, predictable, gives businesses certainty about the price of emissions. Revenue can be rebated to citizens.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'cap_trade', label: 'Cap-and-Trade', description: 'Set an emissions cap and issue tradable permits. The market discovers the price. Cap ensures the environmental outcome is guaranteed.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'voluntary', label: 'Voluntary Program', description: 'Ask businesses to voluntarily reduce emissions. No enforcement, no cost to industry. Historically ineffective.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'subsidies', label: 'Clean Energy Subsidies', description: 'Instead of pricing carbon, subsidize clean energy. Positive incentives rather than penalties. Costs treasury money but avoids political backlash.', risk: 'low', tags: ['safe'] },
  ],
  idealNote: 'The carbon tax is the most economically efficient mechanism according to most economists. It gives businesses price certainty (they know exactly what each ton of emissions costs) and allows them to find the cheapest abatement. Revenue can be used to reduce other taxes (the "double dividend"). Cap-and-trade guarantees the emissions outcome but creates price volatility. Voluntary programs consistently fail (free rider problem). Subsidies work but are less efficient per dollar spent. The optimal choice depends on political constraints: carbon tax is efficient but politically difficult; cap-and-trade is more politically palatable (it "hides" the price); subsidies are easiest but most expensive per ton reduced.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'carbon_tax':
        return { outcome: 'victory', score: 9, narrative: 'Carbon tax: the most efficient mechanism. Predictable price signal drives 40% emissions reduction. Revenue rebated as citizen dividend.', resourceChanges: { gold: 150, influence: 30, population: 200 }, relationshipChanges: { minister_env: 15 } };
      case 'cap_trade':
        return { outcome: 'mixed', score: 6, narrative: 'Cap-and-trade: guarantees the emissions cap but creates price volatility. Quantity certainty at the cost of price uncertainty.', resourceChanges: { gold: 80, influence: 20, population: 100 }, relationshipChanges: {} };
      case 'subsidies':
        return { outcome: 'mixed', score: 5, narrative: 'Clean energy subsidies: politically popular but expensive per ton reduced. Free riding on the subsidy dilutes effectiveness.', resourceChanges: { gold: -50, influence: 15, population: 50 }, relationshipChanges: { minister_industry: 10 } };
      default:
        return { outcome: 'defeat', score: 1, narrative: 'Voluntary program: classic free rider problem. 2% reduction — voluntary approaches consistently fail for public goods.', resourceChanges: {}, relationshipChanges: { minister_env: -10 } };
    }
  },
  analyze: (choice) => {
    if (choice === 'carbon_tax') {
      return 'You implemented a carbon tax of 5 gold per ton of emissions. Results: emissions drop 25% in the first year, 40% by year 3. Businesses invest in efficiency because every ton they avoid saves them 5 gold. The tax revenue (250 gold/year) is rebated as a "carbon dividend" to citizens, making the policy popular (most citizens receive more in dividend than they pay in higher prices). Economic efficiency is high: the tax creates a uniform price signal that allows the market to find the cheapest reduction opportunities. In mechanism design terms, the carbon tax is a "price-based mechanism" — it sets the price and lets the market determine the quantity of reductions. It is transparent, predictable, and hard to game. Real-world examples: British Columbia\'s carbon tax (revenue-neutral, popular across party lines), Sweden\'s carbon tax ($140/ton, one of the highest in the world, credited with a 25% emissions reduction since 1995 while the economy grew 75%). The lesson: carbon taxes are economically elegant but politically challenging. Their success depends on how the revenue is used. Rebating it to citizens (rather than keeping it in general revenue) is the key to political acceptability.';
    }
    if (choice === 'cap_trade') {
      return 'You implemented a cap-and-trade system: emissions capped at 80% of current levels, permits auctioned annually and tradable on an exchange. Results: the emissions cap is met — the environmental outcome is guaranteed. But permit prices are volatile: starting at 4 gold/ton, spiking to 12 gold during a cold winter (when energy demand rises), crashing to 2 gold during a recession. The price volatility makes business planning difficult — factories can\'t predict their compliance costs. However, the trading mechanism ensures that reductions happen where they\'re cheapest: a factory that can reduce emissions for 3 gold/ton sells permits to one that would pay 8 gold/ton. In mechanism design terms, cap-and-trade is a "quantity-based mechanism" — it sets the quantity and lets the market determine the price. It guarantees the environmental outcome but at the cost of price uncertainty. Real-world examples: the EU Emissions Trading System (the world\'s largest carbon market), the US Acid Rain Program (cap-and-trade for SO2, widely considered successful). The lesson: cap-and-trade is better when the environmental outcome is paramount (we MUST hit a specific target) and you can tolerate price volatility. The trading mechanism ensures cost-effectiveness, but the cap must be set correctly — too loose and the price collapses (as happened in early phases of the EU ETS).';
    }
    if (choice === 'voluntary') {
      return 'You launched a voluntary program asking businesses to reduce emissions. The result: emissions drop 2% in the first year, then stabilize. Businesses that do reduce often do so for reasons unrelated to your program (energy costs savings, corporate image). Most businesses do nothing — there\'s no cost to ignoring a voluntary request. This is the classic free rider problem applied to public goods: clean air is non-excludable (everyone benefits regardless of who pays), so each business has an incentive to let others bear the cost while they enjoy the benefits. Without enforcement, voluntary programs consistently under-provide public goods. In game theory terms, the voluntary program is a "weakly dominant strategy" to defect: each business individually prefers not to participate, even though all would be better off if everyone participated. Real-world examples: the Kyoto Protocol (voluntary emissions targets, largely ineffective), corporate "net zero by 2050" pledges without enforcement mechanisms (many are greenwashing). The lesson: voluntary approaches to public goods provision consistently fail. Mechanism design teaches that you need either enforcement (mandatory participation with penalties) or strong selective incentives (benefits that only participants receive) to overcome the free rider problem.';
    }
    return 'You chose clean energy subsidies: 200 gold/year in grants for solar, wind, and efficiency upgrades. Results: clean energy investment increases, emissions drop 15% over 3 years. The subsidies are popular (no one opposes free money) and politically easy. But the cost-effectiveness is poor: each ton of CO2 reduced costs 12 gold via subsidy, compared to 5 gold via carbon tax. Why? Because subsidies pay for reductions that would have happened anyway (some businesses would have invested in efficiency even without subsidies — this is "free riding" on the subsidy). Also, subsidies provide no incentive for the NON-subsidized sectors to reduce. In mechanism design terms, subsidies are a "positive incentive" approach: they reward desired behavior rather than penalizing undesired behavior. This is politically easier but economically less efficient. Real-world examples: Germany\'s Energiewende (feed-in tariffs for renewables, hugely successful in deployment but extremely expensive), US federal tax credits for wind and solar. The lesson: subsidies are the politically easiest climate policy but the most expensive per ton of reduction. They work best when combined with other policies (like a carbon tax) that create a comprehensive incentive structure. The "optimal" climate policy portfolio typically includes carbon pricing (efficiency) + subsidies (for innovation) + regulations (for sectors that don\'t respond to prices).';
  },
  agents: {
    chancellor: { personality: 'longTermPlanner', name: 'Chancellor' },
    minister_industry: { personality: 'greedy', name: 'Minister of Industry' },
    minister_env: { personality: 'trustBuilder', name: 'Minister of Environment' },
  },
});

scenarioRegistry.register({
  id: 'the-distributed-ledger',
  title: 'The Distributed Ledger',
  era: 6,
  order: 61,
  concept: 'mechanismDesign',
  type: 'consensus',
  setup: (state) => {
    state.player.resources.gold = 500;
  },
  story: [
    { speaker: 'Cryptographer Amara', text: 'We\'ve built a distributed ledger — a chain of records that no single party controls. The question is: how do we agree on what goes into the ledger? This is the "consensus problem."' },
    { speaker: 'Engineer Kael', text: 'Every consensus protocol trades off three things: security (resistance to attacks), speed (transactions per second), and decentralization (how many parties control the network). You cannot maximize all three simultaneously.' },
    { speaker: 'Cryptographer Amara', text: 'Proof-of-work is secure but slow and energy-intensive. Proof-of-stake is faster but has different security properties. Delegated proof-of-stake is faster still but more centralized. Choose your tradeoff.' },
  ],
  context: 'You must design the consensus protocol for a new distributed ledger. The "blockchain trilemma" states you can only have two of three: security, speed, decentralization. Proof-of-work (Bitcoin-like) maximizes security and decentralization but is slow and energy-intensive. Proof-of-stake is faster but raises "nothing at stake" concerns. Delegated proof-of-stake is very fast but creates oligopoly risk. Proof-of-authority is fastest but most centralized.',
  choices: [
    { id: 'pow', label: 'Proof-of-Work', description: 'Nodes compete to solve cryptographic puzzles. Validator wins the right to add the next block. Extremely secure, fully decentralized, but slow (~7 TPS) and energy-intensive.', risk: 'low', tags: ['safe', 'cooperate'] },
    { id: 'pos', label: 'Proof-of-Stake', description: 'Validators stake tokens as collateral. A random validator is chosen to propose each block. Fast (~1,000 TPS), energy-efficient, but complex security model.', risk: 'medium', tags: ['medium'] },
    { id: 'dpos', label: 'Delegated Proof-of-Stake', description: 'Token holders vote for a small set of block producers. Very fast (~10,000 TPS) but the network is controlled by a few dozen entities.', risk: 'high', tags: ['high'] },
    { id: 'poa', label: 'Proof-of-Authority', description: 'Pre-approved validators (known entities with reputation) produce blocks. Fastest (~100,000 TPS) but fully centralized — trust in known validators.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'There is no single "best" consensus protocol — it depends on your use case. For a store of value (like Bitcoin), proof-of-work\'s security justifies its cost. For a smart contract platform (like Ethereum), proof-of-stake balances speed with reasonable decentralization. For high-throughput applications (like a payment network), DPoS or PoA may be necessary despite centralization risks. The blockchain trilemma is a fundamental design constraint: every consensus mechanism represents a deliberate choice about which property to sacrifice. The lesson from mechanism design: there are no free lunches — every design choice creates tradeoffs, and transparently acknowledging those tradeoffs is the first step to good mechanism design.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'pow':
        return { outcome: 'victory', score: 8, narrative: 'Proof-of-Work: maximally secure and decentralized. Tradeoff: slow and energy-intensive, but the cost IS the security.', resourceChanges: { gold: -50, influence: 35 }, relationshipChanges: { amara: 15 } };
      case 'pos':
        return { outcome: 'mixed', score: 7, narrative: 'Proof-of-Stake: energy-efficient with bonded accountability. Trades physical security for economic security.', resourceChanges: { gold: 20, influence: 25 }, relationshipChanges: { kael: 10 } };
      case 'dpos':
        return { outcome: 'mixed', score: 5, narrative: 'Delegated Proof-of-Stake: fast but creates an elected oligarchy. Decentralization is sacrificed for throughput.', resourceChanges: { gold: 50, influence: 15 }, relationshipChanges: {} };
      default:
        return { outcome: 'mixed', score: 4, narrative: 'Proof-of-Authority: fastest but fully centralized. Permissioned — appropriate for enterprise, not for open networks.', resourceChanges: { gold: 80, influence: 5 }, relationshipChanges: {} };
    }
  },
  analyze: (choice) => {
    if (choice === 'pow') {
      return 'You chose Proof-of-Work. Your ledger is extremely secure: an attacker would need 51% of global hashing power (computational energy) to rewrite history — practically impossible for a well-established chain. The network is fully decentralized: anyone with hardware can mine. But throughput is ~7 transactions per second (vs. Visa\'s ~24,000) and each transaction consumes as much energy as a small household does in a day. The economic incentive: miners earn block rewards + fees, aligning their interests with network security. This is mechanism design at its finest: the protocol aligns self-interested actors (miners seeking profit) with the socially desired outcome (secure transaction validation). The tradeoff: energy consumption is the price of permissionless security. Real-world lesson: PoW works brilliantly for high-value, low-frequency transactions (settlement layer). It is unsuitable for everyday payments (coffee, groceries). The mechanism\'s security comes from its cost — and that cost is the energy consumption critics decry. This is not a bug but a feature of the design. The mechanism is secure BECAUSE it is expensive.';
    }
    if (choice === 'pos') {
      return 'You chose Proof-of-Stake. Your ledger processes ~1,000 transactions per second using a fraction of PoW\'s energy. Validators stake tokens (locking them as collateral) and are randomly selected to propose blocks. If they validate dishonestly, their stake is "slashed" (confiscated). This is mechanism design through "bonded accountability": validators have skin in the game. The security model: attacking the chain requires acquiring a large stake (33%+ of all tokens), which is astronomically expensive and, if the attack fails, the attacker\'s stake is destroyed. This creates "economic finality" — the cost of attack exceeds any possible benefit. However, PoS introduces new challenges: the "nothing at stake" problem (validators might vote on multiple forks since it costs nothing) and long-range attacks (an attacker could create a fake chain from an early state). Real-world example: Ethereum\'s transition to PoS (The Merge) reduced energy consumption by 99.95% while maintaining strong security guarantees. The lesson: PoS trades physical security (energy) for economic security (stake). This is a different tradeoff, not necessarily a better one. The mechanism is only as secure as the value of the staked tokens.';
    }
    if (choice === 'dpos') {
      return 'You chose Delegated Proof-of-Stake. Your ledger processes ~10,000 transactions per second — competitive with traditional payment networks. Token holders vote for 21 "block producers" who validate transactions in rotation. The mechanism is fast because the validator set is small and known. But the tradeoff: those 21 entities effectively control the network. Collusion among them could censor transactions or rewrite history. DPoS creates an "elected oligarchy" — theoretically accountable to token holders (who can vote them out) but practically difficult to coordinate against entrenched validators. The mechanism design insight: DPoS uses democratic voting to select validators, but voting is itself subject to game theory problems (voter apathy, vote buying, plutocracy — votes are weighted by stake size, so the wealthy have more say). Real-world examples: EOS, TRON, BitShares. The lesson: DPoS demonstrates that decentralization is not binary — there are degrees. DPoS is "decentralized enough" for many applications but not for use cases requiring censorship resistance. The key mechanism design insight: every consensus protocol is a governance mechanism that distributes power in a specific way. Choosing DPoS means choosing a system where power flows through democratic delegation, with all the strengths and weaknesses that entails.';
    }
    return 'You chose Proof-of-Authority. Your ledger processes ~100,000 transactions per second — the fastest option. A set of pre-approved validators (known entities with reputations at stake) produce blocks. No mining, no staking, no voting — just trusted authorities. The network is effectively a distributed database with high fault tolerance but low decentralization. Speed comes from trust: because validators are known and few, consensus is reached quickly. The reputation mechanism: validators are incentivized to behave honestly because their professional reputation is on the line (if a court validates fraudulently, they lose their position and professional standing). Real-world examples: enterprise blockchain platforms (Hyperledger Fabric, Ripple), government registries. The lesson: PoA sacrifices the "permissionless" property that makes blockchains revolutionary — anyone can participate in PoW/PoS, but only pre-approved entities can participate in PoA. This is appropriate for enterprise use cases (where participants are known) but not for public, open networks. The mechanism design insight: decentralization is not always desirable. For many real-world applications (supply chain tracking, land registries, interbank settlements), having known, accountable validators is actually PREFERABLE to anonymous, permissionless consensus. The "best" mechanism depends entirely on the use case.';
  },
  agents: {
    amara: { personality: 'trustBuilder', name: 'Cryptographer Amara' },
    kael: { personality: 'greedy', name: 'Engineer Kael' },
  },
});

scenarioRegistry.register({
  id: 'the-tragedy-revisited',
  title: 'The Tragedy Revisited',
  era: 6,
  order: 62,
  concept: 'tragedyCommons',
  type: 'commons_design',
  setup: (state) => {
    state.player.resources.gold = 300;
    state.player.resources.population = 1000;
  },
  story: [
    { speaker: 'Elder Fisherwoman', text: 'You remember our lake, my lord? The one from years past, when each family fished as much as they pleased, and the fish nearly disappeared.' },
    { speaker: 'Elder Fisherwoman', text: 'We\'ve managed to restore it through voluntary restraint. But the old temptation remains. Now you have the power to choose the permanent system: how will we manage this common resource forever?' },
    { speaker: 'Your Scholar', text: 'Hardin\'s "Tragedy of the Commons" said only privatization or government control could save shared resources. But Elinor Ostrom showed that communities can manage commons sustainably through self-governance — if the right principles are followed.' },
  ],
  context: 'The fishing lake from your early days returns. Previously, you faced the immediate crisis of overfishing. Now, you have the power to DESIGN the permanent management system. Four paths: privatization (divide the lake into private plots, each owner has incentive to conserve), regulation (government sets catch limits, enforces with patrols), community management (fishing council of local users sets and enforces rules), or return to open access (no rules, everyone fishes freely). Each has succeeded and failed in different real-world contexts.',
  choices: [
    { id: 'privatize', label: 'Privatization', description: 'Divide the lake into private fishing territories. Each owner has full incentive to manage sustainably. Works well when enforcement is possible.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'regulate', label: 'Government Regulation', description: 'Set catch limits, issue permits, patrol for violations. Effective but costly to enforce.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'community', label: 'Community Management', description: 'Form a fishers\' council. They set rules, monitor compliance, and sanction violators. Ostrom\'s solution.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'open_access', label: 'Open Access (Return to Tragedy)', description: 'Remove all restrictions. Let everyone fish freely. The same path that led to collapse before.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'Community management is the optimal choice when the conditions are right — and here they are: the resource is well-defined, the community is stable and has trust, rules can be adapted locally, and violators can be monitored and sanctioned at reasonable cost. Elinor Ostrom\'s Nobel-winning research showed that communities often outperform both markets and governments at managing common resources when these conditions hold. Privatization works but can exclude traditional users and create inequality. Regulation works but requires costly enforcement and may lack local knowledge. Open access guarantees tragedy. The deepest lesson: the "tragedy of the commons" is not inevitable — it is the result of a particular institutional structure (or lack thereof). Change the structure, change the outcome.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'community':
        return { outcome: 'victory', score: 10, narrative: 'Community management: Ostrom\'s solution. Self-governance with local rules, monitoring, and graduated sanctions. The commons thrive for generations.', resourceChanges: { gold: 60, population: 200, influence: 40 }, relationshipChanges: { elder: 20, scholar: 15 } };
      case 'privatize':
        return { outcome: 'mixed', score: 6, narrative: 'Privatization: solves overfishing through property rights but creates inequality. Some traditional fishers lose access.', resourceChanges: { gold: 80, population: 50 }, relationshipChanges: {} };
      case 'regulate':
        return { outcome: 'mixed', score: 5, narrative: 'Government regulation: effective but costly enforcement. Adversarial relationship between state and community.', resourceChanges: { gold: 20, population: 100 }, relationshipChanges: { elder: -5 } };
      default:
        return { outcome: 'defeat', score: 0, narrative: 'Open access: the tragedy repeats. Within two seasons, the fish stocks collapse. Freedom in the commons brings ruin to all.', resourceChanges: { gold: -30, population: -200 }, relationshipChanges: { elder: -20 } };
    }
  },
  analyze: (choice) => {
    if (choice === 'privatize') {
      return 'You divided the lake into 20 private fishing territories. Each owner now has full property rights. The immediate result: no overfishing — each owner carefully manages their section because they bear the full cost of depletion and reap the full benefit of conservation. This is the "Coase Theorem" in action: when property rights are clearly defined and transaction costs are low, private bargaining leads to efficient outcomes. However, the privatization was costly to implement (surveying, legal fees, enforcement of boundaries). And some traditional fishing families who couldn\'t afford to buy a territory lost access entirely — they become landless laborers working for territory owners. Equity suffers even as efficiency improves. Real-world examples: Iceland\'s individual transferable quotas (ITQs) for fisheries saved the cod stocks but concentrated wealth among quota holders. The lesson: privatization solves the tragedy of the commons but creates new problems — inequality, exclusion, and the loss of community governance traditions. The mechanism design insight: property rights are not "natural" — they are a mechanism created by society. How you define and distribute them determines who wins and who loses.';
    }
    if (choice === 'regulate') {
      return 'You implemented government regulation: a central authority sets a maximum catch limit (500 fish per season), issues permits, and patrols the lake. Results: fish stocks stabilize. The regulation works — but at a cost of 100 gold per season for enforcement. Fishermen resent the permits and patrols. Some fish illegally at night. Enforcement costs rise as violations continue. The regulation is effective but creates an adversarial relationship between the state and the community. In mechanism design terms, the regulation is a "command-and-control" mechanism: it prescribes specific behavior and punishes deviations. It works but is less efficient than incentive-based mechanisms because it doesn\'t harness local knowledge or self-interest. Real-world examples: the US Endangered Species Act (effective but controversial), EU Common Fisheries Policy (initially a failure because the "top-down" quotas ignored local conditions). The lesson: top-down regulation can work but requires significant enforcement resources and may fail when regulators lack local knowledge. Ostrom\'s critique: central authorities often lack the fine-grained information that local communities possess. The challenge is designing regulations that are informed by local conditions.';
    }
    if (choice === 'community') {
      return 'You established a Fishers\' Council — all 20 fishing families elect representatives, set catch limits collectively, and appoint monitors from within the community. Results: fish stocks recover fully. Compliance is high (90%+) because the rules are seen as legitimate — they were created by the community itself. Violators face social sanctions (shaming, temporary exclusion) that are more effective and cheaper than formal legal penalties. The system costs only 20 gold per season to administer. This is Elinor Ostrom\'s solution in action. She identified eight "design principles" for successful commons governance: 1) Clearly defined boundaries, 2) Proportional equivalence between benefits and costs, 3) Collective-choice arrangements (those affected by rules can participate in changing them), 4) Monitoring by the community, 5) Graduated sanctions, 6) Conflict-resolution mechanisms, 7) Minimal recognition of rights to organize, 8) Nested enterprises for larger commons. Your lake satisfies all eight. This is why community management works here: the community is stable, the resource is well-defined, and the users have trust and communication. Real-world examples: Swiss alpine grazing cooperatives (operating continuously since the 13th century!), Japanese irrigation commons, Maine lobster fisheries. The lesson: the tragedy of the commons is NOT inevitable. Under the right institutional conditions, communities can manage shared resources sustainably for centuries. The key is designing governance mechanisms that align individual incentives with collective welfare — the highest lesson of this entire game.';
    }
    return 'You returned to open access. No rules, no limits. Every family fishes as much as they can. Within two seasons, the lake is overfished again. Fish stocks collapse. The community loses its primary food source. This is the tragedy of the commons replaying exactly as Hardin predicted: "Freedom in a commons brings ruin to all." Why does this happen? Each family thinks: "If I don\'t catch these fish, someone else will. The fish I leave will be taken by another. The few fish I leave won\'t make a difference to next year\'s stock." This logic is individually rational but collectively disastrous — the same structure as the Prisoner\'s Dilemma. The "tragedy" is that each person acting rationally in their own self-interest produces an outcome that is worse for everyone, including themselves. After the collapse, you understand what could have been. The lake could have provided fish for generations. Instead, it provided a feast for one season followed by famine. The mechanism design lesson: the "default" institutional structure (open access) is not neutral — it actively produces bad outcomes. Designing good institutions (property rights, regulations, community governance) is not "interference" with a natural system — it is the necessary work of creating structures that align individual incentives with collective welfare. This is the deepest insight of game theory, mechanism design, and this entire game.';
  },
  agents: {
    elder: { personality: 'longTermPlanner', name: 'Elder Fisherwoman' },
    scholar: { personality: 'titForTat', name: 'Scholar' },
  },
});

scenarioRegistry.register({
  id: 'the-society-designer',
  title: 'The Society Designer',
  era: 6,
  order: 63,
  concept: 'mechanismDesign',
  type: 'capstone',
  setup: (state) => {
    state.player.resources.gold = 1000;
    state.player.resources.population = 5000;
    state.player.resources.military = 500;
    state.player.resources.influence = 100;
  },
  story: [
    { speaker: 'The Chronicler', text: 'You stand at the dawn of a new civilization. A fertile valley, a willing people, and the wisdom of sixty-two scenarios behind you. You have learned scarcity, dilemma, reputation, information, markets, evolution, and synthesis.' },
    { speaker: 'The Chronicler', text: 'Now you must design a society from first principles. Every choice you make — voting system, economic model, tax rate, justice system, education funding, military spending, trade policy, immigration — creates incentives that will shape how your people live, work, and interact for generations to come.' },
    { speaker: 'The Chronicler', text: 'One hundred souls with different personalities — cooperators, defectors, tit-for-tatters, grim triggers, risk seekers, long-term planners, opportunists — will inhabit your creation. You will watch them live for fifty turns. Their strategies, their alliances, their conflicts, their flourishing or their collapse — all will emerge from the rules you set. The game is in your hands. Design wisely.' },
  ],
  context: 'This is the final scenario — the capstone of your journey. You will design a complete society: voting system (plurality, ranked-choice, approval, consensus), economic system (free market, mixed economy, planned economy, gift economy), tax rate (none, low, medium, high, progressive), justice system (punitive, restorative, rehabilitative, laissez-faire), education funding (none, basic, comprehensive, elite), military spending (none, defensive, balanced, expansionist), trade policy (free trade, fair trade, protectionist, autarky), and immigration policy (open, selective, restricted, closed). Then 100 AI agents with diverse personalities will live in your society for 50 turns. Observe what emerges.',
  choices: [
    { id: 'liberal_democracy', label: 'Liberal Democracy', description: 'Ranked-choice voting, mixed economy, progressive tax, restorative justice, comprehensive education, defensive military, fair trade, selective immigration. A balanced, modern approach.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'libertarian', label: 'Libertarian Free Market', description: 'Approval voting, free market economy, low flat tax, punitive justice, elite education, minimal military, free trade, open immigration. Maximum individual freedom.', risk: 'high', tags: ['high'] },
    { id: 'social_democracy', label: 'Social Democracy', description: 'Consensus voting, mixed economy with strong safety net, high progressive tax, rehabilitative justice, comprehensive education, defensive military, fair trade, selective immigration. Strong collective welfare.', risk: 'medium', tags: ['cooperate', 'safe'] },
    { id: 'authoritarian', label: 'Authoritarian State', description: 'Plurality voting (single party), planned economy, medium tax, punitive justice, basic education, expansionist military, protectionist trade, restricted immigration. Order through control.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'utopian', label: 'Utopian Communal', description: 'Consensus-based direct democracy, gift economy, no taxes (voluntary contributions), restorative justice, comprehensive education, minimal/no military, free trade, open immigration. Maximum collective harmony — if human nature allows it.', risk: 'high', tags: ['cooperate', 'high'] },
  ],
  idealNote: 'There is no single "right" answer for how to design a society — that is the deepest lesson of the entire game. Every design choice creates tradeoffs between efficiency and equity, freedom and security, individual rights and collective welfare. A liberal democracy tends to produce the most stable and prosperous outcomes across diverse populations because it balances individual incentives with social safety nets, and its adaptive institutions can respond to changing conditions. But even this is contingent — the "best" design depends on the population\'s composition, history, environment, and values. The true mastery is understanding that EVERY institution is a game mechanism: it creates incentives, and people respond to incentives. Design the rules, and the behavior follows.',
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'liberal_democracy':
        return { outcome: 'victory', score: 9, narrative: 'Liberal Democracy: balanced, resilient, adaptive. Mixed economy, ranked-choice voting, progressive taxation. The most stable and prosperous system across diverse populations.', resourceChanges: { gold: 200, influence: 80, military: 30, population: 500 }, relationshipChanges: { chronicler: 20 } };
      case 'social_democracy':
        return { outcome: 'victory', score: 8, narrative: 'Social Democracy: highest total welfare and cooperation rate (85%). High trust equilibrium — citizens pay taxes willingly because institutions reciprocate.', resourceChanges: { gold: 150, influence: 60, population: 600 }, relationshipChanges: { chronicler: 15 } };
      case 'libertarian':
        return { outcome: 'mixed', score: 5, narrative: 'Libertarian: explosive growth but extreme inequality. Social fabric frays as cooperation between classes breaks down.', resourceChanges: { gold: 300, influence: 20, population: 100 }, relationshipChanges: {} };
      case 'authoritarian':
        return { outcome: 'defeat', score: 2, narrative: 'Authoritarian: order through fear. Brittle — cooperation sustained by punishment alone, collapses when enforcement falters.', resourceChanges: { gold: 50, military: 80, influence: -20, population: -100 }, relationshipChanges: { chronicler: -10 } };
      default:
        return { outcome: 'defeat', score: 1, narrative: 'Utopian: fails because it assumes people are Always Cooperate. Free riders multiply, trust shatters, the commune dissolves.', resourceChanges: { gold: -50, population: -200, influence: -30 }, relationshipChanges: { chronicler: -5 } };
    }
  },
  analyze: (choice, aiChoice, history) => {
    const baseAnalysis = 'The Society Designer is a meta-game that simulates how 100 AI agents with diverse personalities (cooperators, defectors, tit-for-tatters, grim triggers, risk-seekers, long-term planners, opportunists, fair players, deceivers, trust-builders) interact within the institutional structure you designed. Over 50 turns, patterns emerge: cooperation rates, inequality levels, innovation, conflict frequency, and overall welfare.';

    if (choice === 'liberal_democracy') {
      return baseAnalysis + '\n\n=== SIMULATION RESULTS: LIBERAL DEMOCRACY ===\n\n' +
        'Turn 10: Society stabilizes. Mixed economy produces steady growth (GDP +3%/turn). Progressive taxation funds comprehensive education and basic safety nets. Ranked-choice voting produces broad-coalition governments. Selective immigration brings skilled workers who integrate well.\n\n' +
        'Turn 25: The golden age. Cooperation rate: 72%. Gini coefficient: 0.32 (moderate inequality). Trust in institutions: high. Most agents are "playing Tit-for-Tat" within the system — cooperating, punishing defectors, forgiving after punishment, and maintaining clear expectations.\n\n' +
        'Turn 50: Enduring prosperity. Total GDP: 4.2x starting. Life satisfaction: 8.1/10. Emergent properties: a civil society sector has developed (voluntary associations, charities, community groups) that handles problems government and market can\'t reach. The society is resilient — it has weathered economic shocks and political transitions without collapse.\n\n' +
        'ANALYSIS: Liberal democracy creates conditions for what Elinor Ostrom called "polycentric governance" — multiple overlapping systems (markets, government, civil society) that check and balance each other. The ranked-choice voting produces centrist, coalition-based policy that avoids extreme swings. The progressive tax funds public goods while the mixed economy preserves market incentives for innovation. Key insight: the system works not because any single mechanism is perfect but because the COMBINATION of mechanisms creates redundancy and resilience. When markets fail, government steps in. When government fails, civil society fills the gap. This institutional diversity is the closest thing to a "meta-solution" to the fundamental challenges of social organization.\n\n' +
        'CONTRAST: Compare with the other paths. The libertarian model grows faster initially but breeds inequality that eventually destabilizes. The social democracy is more equal but less dynamic. The authoritarian model is stable until it isn\'t — and then it collapses catastrophically. The utopian model depends too heavily on everyone being "nice" — one defector can unravel the whole system.\n\n' +
        'FINAL LESSON: You began this journey with the Empty Granary, learning that scarcity means every choice carries an opportunity cost. You end it designing an entire society, recognizing that the SAME principle applies at every level: individuals, organizations, institutions, and civilizations. There is no perfect system — only better and worse tradeoffs. The art of strategy is not finding the "winning move" but understanding the game itself: how rules shape behavior, how incentives drive outcomes, and how the structure of interaction determines the fate of all who play. This is the mastery of game theory. This is what it means to see the world not as a series of events but as a system of games within games within games, each with its own rules, payoffs, and strategies. You are no longer just a player. You are the designer.';
    }

    if (choice === 'libertarian') {
      return baseAnalysis + '\n\n=== SIMULATION RESULTS: LIBERTARIAN FREE MARKET ===\n\n' +
        'Turn 10: Explosive growth. GDP +8%/turn. Entrepreneurs flourish. Low taxes mean high capital accumulation. Elite education produces top-tier innovators. But inequality is rising sharply (Gini: 0.48). The free market rewards winners handsomely; losers get minimal support.\n\n' +
        'Turn 25: Cracks appear. Growth has slowed to +2%/turn — the low-hanging fruit is picked. Inequality (Gini: 0.62) is creating social tension. The punitive justice system fills prisons with those who turned to crime when legitimate opportunities were scarce. Minimal public goods (no public education, minimal infrastructure) means the next generation starts from a more unequal baseline. The open immigration policy brings cheap labor, suppressing wages for the poorest citizens.\n\n' +
        'Turn 50: Society bifurcates. The top 10% control 70% of wealth. Life expectancy diverges sharply between rich and poor. Periodic unrest. Growth has stagnated at +1%/turn. The system hasn\'t collapsed — the elite maintain order through private security and gated communities. But the "social fabric" has frayed. Trust is low. Cooperation between classes is minimal.\n\n' +
        'ANALYSIS: The libertarian model demonstrates the power of market incentives — and their limits. The market is extraordinary at allocating resources efficiently and rewarding innovation. But it is terrible at providing public goods, managing externalities, and maintaining social cohesion. In game theory terms, the pure market is a series of Prisoner\'s Dilemmas where the "always defect" strategy is individually optimal. The result is economically productive but socially barren. The key missing element: institutions that solve collective action problems. Markets alone cannot provide clean air, public health, basic research, or social insurance — all of which require mechanisms beyond the price system.\n\n' +
        'CONTRAST: The liberal democracy achieves lower growth but much higher stability and satisfaction. The social democracy trades growth for equity. The libertarian model maximizes one dimension (growth) at the expense of others (equity, stability, trust). The question is not which is "better" but what you — the designer — value most. Every mechanism optimizes for something and sacrifices something else.\n\n' +
        'FINAL LESSON: You began this journey learning that scarcity means every choice has an opportunity cost. Now you see that this applies to entire societies. A free market society gains efficiency but loses cohesion. It incentivizes innovation but underprovides public goods. The art of institutional design — the highest expression of mechanism design — is understanding what each choice sacrifices and accepting that sacrifice knowingly. There is no utopia. There are only tradeoffs.';
    }

    if (choice === 'social_democracy') {
      return baseAnalysis + '\n\n=== SIMULATION RESULTS: SOCIAL DEMOCRACY ===\n\n' +
        'Turn 10: Steady, inclusive growth (GDP +2.5%/turn). High progressive taxes fund comprehensive public services. Consensus voting produces broad agreement on policy direction. Education is universal and high-quality. The safety net catches those who fall. Inequality is low (Gini: 0.28).\n\n' +
        'Turn 25: The "high-trust equilibrium" has emerged. Cooperation rate: 85% — the highest of any system. Citizens pay taxes willingly because they see tangible benefits (healthcare, education, infrastructure). The rehabilitative justice system has one of the lowest recidivism rates. Military spending (defensive only) is adequate. Trade policy (fair trade) balances domestic interests with global engagement.\n\n' +
        'Turn 50: Sustainable prosperity. Total GDP: 3.8x starting. Life satisfaction: 8.5/10. The society is the most egalitarian (Gini: 0.26) while still achieving strong growth. It ranks highest on almost every quality-of-life metric. BUT — it is slightly less dynamic than the liberal democracy. Entrepreneurship is somewhat lower. The high tax burden reduces (but doesn\'t eliminate) the incentive for breakthrough innovation.\n\n' +
        'ANALYSIS: Social democracy achieves the highest total welfare because it solves the fundamental collective action problems that plague societies. It provides public goods (education, health, infrastructure) that markets under-provide. It insures against risks (unemployment, illness, disability) that would otherwise create desperate, anti-social behavior. And it does all this while preserving market mechanisms for most economic activity. In game theory terms, social democracy creates conditions for the "cooperative equilibrium" in the meta-game of society: citizens cooperate (pay taxes, follow laws, help neighbors) because institutions reliably reciprocate (provide services, enforce fairness, offer second chances).\n\n' +
        'CONTRAST: The liberal democracy is close in performance — slightly more dynamic, slightly less equal. The libertarian model outstrips both in growth but collapses in social cohesion. The authoritarian model is stable but joyless. The utopian model fails when human nature falls short of ideals. Social democracy\'s weakness is its dependence on high trust and competent institutions — it underperforms when either is lacking.\n\n' +
        'FINAL LESSON: You began with the Prisoner\'s Dilemma, learning that individual rationality can lead to collective disaster. Social democracy is the institutional embodiment of the solution: create mechanisms that align individual incentives with collective welfare. High taxes fund public goods that benefit everyone (taxes are the "cooperation" contribution). Universal services ensure no one falls so far they have nothing to lose by defecting. The result is a high-trust, high-cooperation society. This doesn\'t mean social democracy is "right" for every context — trust and competent institutions take generations to build and can be destroyed quickly. But as a demonstration of game-theoretic principles applied to institutional design, it is arguably the most successful human invention for aligning individual and collective welfare at scale.';
    }

    if (choice === 'authoritarian') {
      return baseAnalysis + '\n\n=== SIMULATION RESULTS: AUTHORITARIAN STATE ===\n\n' +
        'Turn 10: Order. Total order. The single party controls all political expression. The planned economy mobilizes resources for state-directed priorities. The expansionist military grows rapidly. Dissent is suppressed. Citizens comply because the alternative is prison. GDP grows at 4%/turn — the command economy is good at building heavy industry.\n\n' +
        'Turn 25: Cracks become chasms. The planned economy is increasingly inefficient — central planners can\'t match the information-processing capacity of a market. Innovation is stifled (no one takes risks when failure is punished). The punitive justice system is overwhelmed. Elite corruption is rampant — those at the top extract rents because there are no checks on their power. GDP growth has fallen to 0.5%/turn. Intelligence reports suggest growing underground resistance.\n\n' +
        'Turn 50: Collapse or transformation. The system either falls to revolution (if the military defects) or painfully transitions to a more open system. Total GDP: 2.5x starting (lowest long-term growth). Life satisfaction: 4.2/10. Trust in institutions: near zero. The only cooperation comes from fear, not genuine social contract. When fear fails, everything fails.\n\n' +
        'ANALYSIS: The authoritarian model demonstrates a fundamental game theory insight: cooperation sustained by punishment alone is fragile. It requires perfect monitoring (impossible at scale) and perfectly credible threats (the "king\'s guard" must always obey — but what if they defect?). The dictator faces a principal-agent problem with everyone: agents (citizens, officials, soldiers) follow orders only as long as monitoring and enforcement are effective. As the society grows complex, monitoring costs rise, information decays, and the system decays with it. In game theory terms, authoritarianism is a "grim trigger" society: cooperate or be punished. But grim trigger is brittle — one crack in enforcement and the whole system unravels.\n\n' +
        'CONTRAST: The liberal democracy and social democracy both outperform authoritarianism on every long-term metric. Even the libertarian model, with all its inequality, produces more innovation and growth. Only in the short term does authoritarianism show strength — it can mobilize resources quickly and suppress dissent effectively. But over 50 turns, its structural weaknesses (information decay, incentive misalignment, monitoring costs) prove fatal.\n\n' +
        'FINAL LESSON: You learned early in this journey that credible commitment requires more than threats — it requires making cooperation beneficial, not just defection costly. Authoritarianism relies entirely on making defection costly. It never makes cooperation genuinely beneficial — citizens obey because they fear punishment, not because they share in the society\'s prosperity. A society designed around fear alone is brittle. The most resilient institutions are those that make cooperation naturally rewarding: through public goods, social insurance, property rights, and rule of law. The iron fist cannot compete with the invisible hand backed by a social contract.';
    }

    return baseAnalysis + '\n\n=== SIMULATION RESULTS: UTOPIAN COMMUNAL ===\n\n' +
      'Turn 5: Enthusiastic participation. The gift economy runs on voluntary contributions. Citizens are energized by the ideals. Consensus-based direct democracy takes time but produces decisions everyone owns. Without taxes, people contribute what they can. The first few seasons are idyllic.\n\n' +
      'Turn 15: The first cracks. Some citizens are contributing less than others. The consensus process is grindingly slow — every decision requires everyone\'s agreement. A minority faction blocks important infrastructure projects. The gift economy is producing enough for basic needs but failing to generate surplus for investment. Growth is 0.5%/turn — barely above subsistence.\n\n' +
      'Turn 30: The defectors multiply. Those who contribute little face only social pressure (no formal sanctions), and social pressure loses its sting over time. The "free rider" problem intensifies: why should I work hard when I can coast on others\' contributions? The most productive citizens grow resentful. Some leave. Others reduce their contributions. The system is caught in a death spiral of declining trust and declining contributions.\n\n' +
      'Turn 50: Collapse. The utopian commune dissolves. A modest number of idealists try to restart it, but most citizens demand a system with actual rules, enforcement, and incentives. Total GDP: 1.5x starting. Life satisfaction fell from 8.0 (at turn 5) to 4.5. Trust: completely shattered.\n\n' +
      'ANALYSIS: The utopian model fails because it assumes people are naturally cooperative and selfless — an assumption contradicted by 62 prior scenarios. In game theory terms, it assumes everyone plays "Always Cooperate." But as you learned in the Tournament of Strategies, Always Cooperate gets exploited. The system has no mechanism to punish defectors (no taxes, no laws, no enforcement) and no mechanism to reward contributors (no property rights, no wages). It relies entirely on intrinsic motivation and social norms — which are powerful but insufficient at scale. The utopian model demonstrates that mechanism design is not optional: the absence of designed institutions is not a "neutral" choice. It is a choice that empowers defectors over cooperators, leading to system collapse.\n\n' +
      'CONTRAST: The liberal democracy and social democracy survive and thrive because they accept human nature as it is — partly selfish, partly altruistic — and design institutions that channel selfishness toward collective benefit. The utopian model rejects this premise and demands a higher human nature. In small, tight-knit communities (like Ostrom\'s fishing villages), this CAN work. At scale, it doesn\'t.\n\n' +
      'FINAL LESSON: The deepest irony of your journey: you began with the Empty Granary, learning that scarcity and self-interest constrain every choice. Sixty-two scenarios later, you designed a utopia that tried to transcend those constraints — and it failed for exactly the reasons the very first scenario taught you. Scarcity is real. Self-interest is real. Good institutional design does not wish these away. It builds mechanisms that work WITH human nature, not against it. The "Always Cooperate" strategy loses the tournament of life. But "Tit-for-Tat" — cooperation backed by credible reciprocity — has dominated every tournament it has ever entered. The best societies are not utopias. They are well-designed games where cooperation is the equilibrium, defection is costly, forgiveness is possible, and everyone — from the most selfish to the most altruistic — finds reason to contribute. This is the final lesson of Sovereign: A Game of Strategy. You are no longer a player. You have become a game designer. The society you build is the game you create. Design it with wisdom, knowing that every rule you write will shape the behavior of those who live within it. The game never ends. It only evolves.';
  },
  agents: {
    chronicler: { personality: 'trustBuilder', name: 'The Chronicler' },
  },
});
