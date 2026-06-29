import { scenarioRegistry } from './registry.js';

// ============================================================
// ERA V: Society & Evolution (Scenarios 41–50)
// Evolutionary game theory, stag hunt, mixed strategy,
// Nash equilibrium, bargaining, matching, tournament.
// ============================================================

scenarioRegistry.register({
  id: 'the-great-hunt',
  title: 'The Great Hunt',
  era: 5,
  order: 41,
  concept: 'stagHunt',
  type: 'stag_hunt',
  setup: (state) => {
    state.player.resources.population = 50;
  },
  story: [
    { speaker: 'Hunt Master Kaelen', text: 'A great stag has been spotted in the deep forest. It will feed the entire village for a month — but it takes all of us working together to catch it.' },
    { speaker: 'Hunter Brin', text: 'Or I could hunt hare alone. A hare feeds my family for a day. Small but certain. The stag is risky — if even one hunter falters, the stag escapes and we all go hungry.' },
    { speaker: 'Hunt Master Kaelen', text: 'The stag hunt is about trust. We all need to commit to the stag. Anyone who chases a hare dooms the stag hunt for everyone.' },
  ],
  context: 'The Stag Hunt: all hunters must cooperate to catch the stag (big payoff for all). Anyone who defects to hunt hare gets a smaller but guaranteed payoff. Unlike the Prisoner\'s Dilemma, defecting doesn\'t actively harm others — it just makes the cooperative payoff impossible. The question: do you trust the other hunters to stay committed?',
  choices: [
    { id: 'stag', label: 'Hunt the Stag', description: 'Commit to the group hunt. Big reward if everyone cooperates. Nothing if anyone defects.', risk: 'high', tags: ['cooperate'] },
    { id: 'hare', label: 'Hunt Hare Alone', description: 'Safe, guaranteed small reward. You eat tonight, but the village misses the stag.', risk: 'low', tags: ['safe'] },
  ],
  idealNote: 'The Stag Hunt models the tension between safety and social cooperation. Unlike the Prisoner\'s Dilemma (where defection is dominant), here both stag and hare can be equilibria. The stag outcome (cooperate, cooperate) is "Pareto-superior" — everyone gets more. But the hare outcome (defect, defect) is "risk-dominant" — it\'s safer if you don\'t trust others. Against a trustBuilder AI, the stag is the optimal choice: trustBuilder types start cooperative and stay cooperative unless betrayed. The lesson: the Stag Hunt is about trust and assurance, not temptation. You cooperate if you believe others will cooperate.',
  analyze: (choice, aiChoice) => {
    if (choice === 'stag' && aiChoice === 'stag') {
      return 'Both hunted the stag. The great beast is caught! The entire village feasts for a month. Payoff: +5 each. This is the Pareto-optimal equilibrium — both better off through cooperation. In the Stag Hunt, this outcome requires trust: each hunter must believe the other will also commit to the stag. This is an "assurance game" — unlike the Prisoner\'s Dilemma, there is no temptation to defect once you believe the other will cooperate. Real-world stag hunts: two countries coordinating on climate policy (both benefit if both act), or a team building a startup together (big success if both commit). The challenge is building the trust that makes the stag equilibrium stable.';
    }

    if (choice === 'stag' && aiChoice === 'hare') {
      return 'You hunted stag. AI hunted hare. The stag escapes (one defector ruins it for everyone). You got 0. AI got +2 (hare). You trusted the AI, but they chose safety. This is the risk of the Stag Hunt: cooperation is fragile. A single defector collapses the whole venture. This explains why many valuable cooperative projects fail — one party loses faith and pursues their safe alternative. The Stag Hunt shows that the main barrier to cooperation is not temptation (as in PD) but lack of assurance. You would have cooperated if you knew the AI would. The problem: you didn\'t know. Real-world example: the failure of international climate agreements — each country fears others will free ride, so they choose the "safe" path of minimal action.';
    }

    if (choice === 'hare' && aiChoice === 'stag') {
      return 'You hunted hare. AI hunted stag. You got +2 (hare). AI got 0. The stag escaped because you didn\'t commit. The AI trusted you, and you chose safety. You defected from the cooperative venture. Your payoff (+2) is better than the failed stag (0), but worse than the successful stag (+5). This is the "sucker\'s payoff" from the AI\'s perspective (they trusted and got 0). Your choice was rational given your uncertainty — hare is the "risk-dominant" strategy because it guarantees something positive. In evolutionary game theory, risk-dominant strategies are the ones that spread in a population because they\'re safer in mismatched encounters.';
    }

    return 'Both hunted hare. Each got +2. Safe but suboptimal. Both could have gotten +5 by cooperating. This is the "risk-dominant equilibrium" — the safe choice that guarantees some payoff. In evolutionary game theory, the hare equilibrium is "risk-dominant" while the stag equilibrium is "payoff-dominant." The central question of the Stag Hunt is: which equilibrium will a population converge to? If players can communicate, build trust, and make binding commitments, they can achieve the payoff-dominant stag. If they play anonymously or distrustfully, they get stuck at the risk-dominant hare. The lesson: trust is the mechanism that moves societies from safe-but-mediocre outcomes to ambitious-but-mutually-beneficial ones.';
  },
  agents: {
    kaelen: { personality: 'trustBuilder', name: 'Hunt Master Kaelen' },
    brin: { personality: 'riskAverse', name: 'Hunter Brin' },
  },
});

scenarioRegistry.register({
  id: 'rock-paper-scissors-tournament',
  title: 'The Rock-Paper-Scissors Tournament',
  era: 5,
  order: 42,
  concept: 'mixedStrategy',
  type: 'rps',
  setup: (state) => {
    state.player.resources.influence = 10;
  },
  story: [
    { speaker: 'Tournament Master', text: 'Welcome to the Grand RPS Championship! Best of 9 rounds. Your opponent studies your patterns. Predictable players lose.' },
    { speaker: 'Champion Vex', text: 'I\'ve never lost a tournament. I watch, I learn, I predict. Every tell, every pattern.' },
    { speaker: 'Your Coach', text: 'The only way to beat a pattern-learning opponent is to be unpredictable. You must play a mixed strategy — each choice with equal probability, independent of past rounds. Any pattern will be exploited.' },
  ],
  context: 'A 9-round Rock-Paper-Scissors tournament against Champion Vex, who learns your patterns. If you play the same move repeatedly or follow a cycle, Vex will predict and counter it. The optimal strategy is to play each move with equal (1/3) probability, independent of past rounds — a mixed strategy. This is the Nash equilibrium of Rock-Paper-Scissors.',
  choices: [
    { id: 'rock', label: 'Play Rock', description: 'Rock beats Scissors, loses to Paper. A single choice — predictable if repeated.', risk: 'medium', tags: ['medium'] },
    { id: 'paper', label: 'Play Paper', description: 'Paper beats Rock, loses to Scissors. A single choice — predictable if repeated.', risk: 'medium', tags: ['medium'] },
    { id: 'scissors', label: 'Play Scissors', description: 'Scissors beats Paper, loses to Rock. A single choice — predictable if repeated.', risk: 'medium', tags: ['medium'] },
  ],
  idealNote: 'The optimal strategy in Rock-Paper-Scissors is to play a uniform mixed strategy: each move with exactly 1/3 probability, independently each round. This is the unique Nash equilibrium of the game: at this mix, your opponent cannot exploit any pattern because there is no pattern to exploit. Any deterministic or biased strategy will eventually be detected and exploited by a learning opponent. The lesson: in zero-sum games with no pure-strategy equilibrium, the solution is a mixed strategy that makes you unpredictable. This applies to poker (bluffing at optimal frequency), sports (randomizing pitch types), and military strategy (randomizing patrol routes).',
  analyze: (choice, aiChoice, history) => {
    const hist = history || [];
    const totalRounds = hist.length + 1;

    const beats = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
    const loses = { rock: 'paper', paper: 'scissors', scissors: 'rock' };

    const playerWon = beats[choice] === aiChoice;
    const aiWon = beats[aiChoice] === choice;
    const draw = choice === aiChoice;

    let patternAnalysis = '';
    if (hist.length >= 3) {
      const lastChoices = hist.slice(-3).map(r => r.playerChoice);
      const allSame = lastChoices.every(c => c === lastChoices[0]);
      const cycling = lastChoices[0] !== lastChoices[1] && lastChoices[1] !== lastChoices[2] && lastChoices[0] !== lastChoices[2];
      if (allSame) patternAnalysis = ' Warning: you played the same move 3+ times. A pattern-learning opponent can now predict you with near-certainty.';
      else if (cycling) patternAnalysis = ' You are cycling through moves in order. Predictable! An observant opponent will cycle to counter you.';
    }

    const roundResult = playerWon ? 'You win this round!' : aiWon ? 'AI wins this round.' : 'Draw.';

    return roundResult + patternAnalysis + ` Round ${totalRounds}/9. Choice breakdown so far: ${hist.reduce((acc, r) => { acc[r.playerChoice] = (acc[r.playerChoice] || 0) + 1; return acc; }, {}).r || 0} Rocks, ${hist.reduce((acc, r) => { acc[r.playerChoice] = (acc[r.playerChoice] || 0) + 1; return acc; }, {}).p || 0} Papers, ${hist.reduce((acc, r) => { acc[r.playerChoice] = (acc[r.playerChoice] || 0) + 1; return acc; }, {}).s || 0} Scissors.` +
      ' The Nash equilibrium of RPS is to play each move with 1/3 probability. Any deviation from this uniform distribution creates an exploitable pattern. Champion Vex, as a pattern-learning opponent, will detect and exploit non-uniform strategies. In mixed strategy Nash equilibrium, each player must be indifferent between all three moves — which only happens when each is played with equal probability. Real-world lesson: when facing an adaptive opponent, true randomness is your only defense. In poker, optimal bluffing frequency is determined by mixed strategy equilibrium. In sports, penalty kick takers randomize direction because goalkeepers study patterns.';
  },
  agents: {
    vex: { personality: 'titForTat', name: 'Champion Vex' },
  },
});

scenarioRegistry.register({
  id: 'the-evolving-population',
  title: 'The Evolving Population',
  era: 5,
  order: 43,
  concept: 'evolutionaryGT',
  type: 'evolution',
  setup: (state) => {
    state.player.resources.influence = 20;
  },
  story: [
    { speaker: 'Natural Philosopher Lyra', text: 'I have modeled the evolution of strategies in our society. Each generation, the most successful strategies reproduce; the least successful die out.' },
    { speaker: 'Philosopher Lyra', text: 'We have three tribes: the Hawks (always fight), the Doves (always share), and the Bourgeois (fight if they\'re the owner, share if they\'re the intruder). Watch how the population composition evolves over generations.' },
    { speaker: 'Your Advisor', text: 'This is evolutionary game theory, my lord. Each strategy\'s fitness depends on what other strategies are in the population. The equilibrium is not chosen by rational agents — it emerges from natural selection of strategies.' },
  ],
  context: 'A population of creatures plays an "owner-intruder" game. Each encounter has an owner (who possesses a resource) and an intruder (who wants it). Three strategies exist: Hawk (always escalate to fight), Dove (always share), Bourgeois (play Hawk as owner, Dove as intruder). Over many generations, the mix of strategies evolves based on their relative payoffs. You propose a new strategy and watch it compete.',
  choices: [
    { id: 'hawk', label: 'Submit Hawk Strategy', description: 'Always escalate. Fight for the resource regardless of role. Aggressive but costly.', risk: 'high', tags: ['high'] },
    { id: 'dove', label: 'Submit Dove Strategy', description: 'Always share. Never fight. Peaceful but easily exploited.', risk: 'high', tags: ['cooperate'] },
    { id: 'bourgeois', label: 'Submit Bourgeois Strategy', description: 'Fight as owner, share as intruder. Respects property rights. The most successful known strategy.', risk: 'low', tags: ['cooperate', 'safe'] },
  ],
  idealNote: 'The Bourgeois strategy is the most successful in the classic Hawk-Dove game (Maynard Smith, 1982). Hawk does well when Doves are plentiful but crashes when facing other Hawks (fighting is costly). Dove does well against other Doves (peaceful sharing) but gets exploited by Hawks. Bourgeois does well against both: as owner, it fights (scaring Doves away); as intruder, it shares (avoiding costly Hawk-Hawk fights). Bourgeois is an "evolutionarily stable strategy" (ESS) — once established, no alternative strategy can invade. This explains why property rights emerge naturally in animal populations: the "resident wins" convention is evolutionarily stable.',
  analyze: (choice, history) => {
    const gen = (history?.length || 0) + 1;

    const hawkHawk = -2;
    const hawkDove = 3;
    const doveHawk = 0;
    const doveDove = 2;
    const bourgHawk = gen % 2 === 0 ? 1 : 3; // as owner fights (wins vs hawk with 50% cost), as intruder shares (gets 0)
    const bourgDove = 2;
    const bourgBourg = 2;

    if (choice === 'hawk') {
      return `Generation ${gen}: You submitted HAWK. Hawk always escalates. Against Dove: Hawk gets +3 (easy win). Against Hawk: Hawk gets -2 (costly fight). Against Bourgeois: Hawk does OK as intruder (Bourgeois shares, Hawk gets +1) but loses as owner (Bourgeois fights, -1). Overall: Hawk is an "evolutionarily unstable strategy" — it does great in a population of Doves, but when it becomes common, Hawks fight each other constantly and its fitness drops. This creates population cycles: Hawks rise when Doves are common, crash when they become too common, then Doves rebound. This is the "Hawk-Dove cycle" — a fundamental result in evolutionary game theory. Real-world analogy: aggressive business strategies that work in a market of passive competitors but fail when everyone competes aggressively.`;
    }

    if (choice === 'dove') {
      return `Generation ${gen}: You submitted DOVE. Dove always shares. Against Dove: +2 (peaceful coexistence). Against Hawk: 0 (intruder, Hawk takes everything). Against Bourgeois: +1 (gets half the resource). Dove is an "evolutionarily stable strategy" only in populations of other Doves. It is INVADABLE by Hawk: a single Hawk in a Dove population gets +3 every encounter and rapidly outbreeds the Doves. This is why pure cooperation is evolutionarily fragile — it cannot defend itself against exploitation. In evolutionary game theory, this explains why we see a mix of cooperative and aggressive strategies in nature, not pure cooperation. The lesson: unconditional cooperation (Dove) is evolutionarily unstable because it is vulnerable to invasion by Hawks. Cooperation needs defense mechanisms like reciprocity or punishment.`;
    }

    return `Generation ${gen}: You submitted BOURGEOIS. Bourgeois plays Hawk as owner, Dove as intruder. This "respect property rights" strategy is the most successful in the Hawk-Dove game. Against Hawk: as owner, Bourgeois fights (Hawk gets -2, Bourgeois gets +1); as intruder, Bourgeois shares (Hawk gets +3, Bourgeois gets 0). Against Dove: as owner, Bourgeois fights, Dove retreats (+3); as intruder, both share (+2). Against Bourgeois: mutual recognition of property, both get +2. Bourgeois is an "evolutionarily stable strategy" (ESS) — no alternative strategy can invade a Bourgeois population. This explains why property rights conventions emerge even without government: "resident wins" is a natural equilibrium. This result won John Maynard Smith the Crafoord Prize and established evolutionary game theory as a field.`;
  },
  agents: {
    lyra: { personality: 'longTermPlanner', name: 'Philosopher Lyra' },
  },
});

scenarioRegistry.register({
  id: 'the-three-kingdoms',
  title: 'The Three Kingdoms',
  era: 5,
  order: 44,
  concept: 'nashEquilibrium',
  type: 'coalition',
  setup: (state) => {
    state.player.resources.military = 150;
    state.player.resources.influence = 30;
  },
  story: [
    { speaker: 'Envoy of the North', text: 'Three kingdoms — yours, the Northern Dominion, and the Eastern Alliance. Any two together can crush the third. Alone, none can stand.' },
    { speaker: 'Your Spymaster', text: 'Alliances shift like wind, my lord. Today\'s ally is tomorrow\'s enemy. The only stable outcome is one where no kingdom wants to switch partners.' },
    { speaker: 'Envoy of the North', text: 'The Northern Dominion proposes an alliance with you against the East. They offer you the Eastern territories. What say you?' },
  ],
  context: 'Three kingdoms of roughly equal military power. Any two allied together can defeat the third. Each kingdom wants to maximize its territory. Alliances are not binding — any kingdom can switch sides if offered a better deal. You must find the Nash equilibrium: a set of alliances where no kingdom can improve its outcome by unilaterally changing its alignment.',
  choices: [
    { id: 'ally_north', label: 'Ally with the North', description: 'Form an alliance with the Northern Dominion against the Eastern Alliance. Partition the East between you.', risk: 'medium', tags: ['cooperate'] },
    { id: 'ally_east', label: 'Ally with the East', description: 'Form an alliance with the Eastern Alliance against the Northern Dominion. Partition the North between you.', risk: 'medium', tags: ['cooperate'] },
    { id: 'neutral', label: 'Stay Neutral', description: 'Remain unaligned. Promise nothing to anyone. Neither side attacks you directly, but you gain no territory either.', risk: 'low', tags: ['safe'] },
    { id: 'grand_coalition', label: 'Propose Grand Coalition', description: 'Propose all three kingdoms share power equally. No one is attacked. Peaceful but fragile.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'In a three-kingdom game, every two-kingdom alliance is a Nash equilibrium: the two allied kingdoms each prefer the status quo (they\'re winning), and the isolated kingdom cannot improve its position alone (it\'s outnumbered). The grand coalition is NOT a Nash equilibrium: any kingdom could secretly ally with another and improve its position by splitting the third. The insight: in three-player games, stable outcomes often involve coalitions that exclude someone. This is the logic of triadic power structures — the "balance of power" in international relations is essentially the search for stable coalition equilibria.',
  analyze: (choice, aiChoice) => {
    if (choice === 'ally_north') {
      return 'You allied with the Northern Dominion against the East. Together you defeat the Eastern Alliance and partition their territory. You gain +3, North gains +3, East loses -5. Is this stable? The East now has no power. Could the North betray you and ally with the East? If North + East attacks you, North gets more (your territory) than they got from the original alliance (Eastern territory). This depends on the North\'s trustworthiness. In repeated games, reputation for reliability matters. The Nash equilibrium concept says: check if any player can do better by changing their choice alone. You and the North are both winning — neither wants to switch. The East would love to change things but can\'t alone. This IS a Nash equilibrium: two players winning, one losing, but the loser can\'t improve unilaterally.';
    }

    if (choice === 'ally_east') {
      return 'You allied with the Eastern Alliance against the North. Together you defeat the Northern Dominion and partition their territory. You gain +3, East gains +3, North loses -5. This is a Nash equilibrium in the same sense: you and the East both benefit from the status quo; the North cannot improve alone. But watch out: the Northern Dominion, now weak, may offer the East a better deal to switch sides. This is the instability inherent in three-kingdom games — every coalition excludes someone, and the excluded party has every incentive to break up the winning coalition by making a better offer to one member. This is the logic of the "balance of power" in international relations: great powers form and reform alliances to prevent any one power from dominating.';
    }

    if (choice === 'neutral') {
      return 'You stayed neutral. The Northern Dominion and Eastern Alliance form an alliance against... someone. Since you\'re neutral, they may attack each other or ignore you. You gain 0 territory, lose 0. Safe but passive. In three-kingdom games, neutrality is viable only if you\'re strong enough to deter attack. If you\'re weak, the other two will ally against you and partition your territory. Neutrality is a Nash equilibrium only if the other two prefer their current arrangement to attacking you. The lesson: in strategic settings with three players, staying out of the game can be rational — but it requires the other players to have something better to do than attack you. This mirrors the foreign policy of small neutral nations like Switzerland or Sweden.';
    }

    return 'You proposed a grand coalition: all three kingdoms share power equally. The others consider it... and reject it. Why? Because any two kingdoms can do better by allying against the third. In game theory terms, the grand coalition is NOT a Nash equilibrium: each kingdom can unilaterally defect and form a bilateral alliance, gaining more territory. The only Nash equilibria in this game are the bilateral alliances. This illustrates a core insight: the Nash equilibrium is about stability, not fairness. The fair outcome (equal sharing) is unstable because someone can always profit by deviating. The stable outcomes (two against one) are unfair. This tension between stability and fairness appears in many real-world settings: cartels, political coalitions, and international alliances.';
  },
  agents: {
    north: { personality: 'coalitionFormer', name: 'Northern Dominion Envoy' },
    east: { personality: 'opportunist', name: 'Eastern Alliance Envoy' },
  },
});

scenarioRegistry.register({
  id: 'the-salary-negotiation',
  title: 'The Salary Negotiation',
  era: 5,
  order: 45,
  concept: 'bargaining',
  type: 'bargaining',
  setup: (state) => {
    state.player.resources.gold = 500;
  },
  story: [
    { speaker: 'Chancellor Voss', text: 'Master Architect Elara has rebuilt our city wall, designed a new aqueduct, and trained our engineers. She demands a salary of 200 gold per season to stay.' },
    { speaker: 'Your Treasurer', text: '200 gold is steep. But she has an offer from the neighboring kingdom for 150 gold per season. Our BATNA (Best Alternative To Negotiated Agreement) is that we\'d have to hire a lesser architect for 80 gold per season.' },
    { speaker: 'Architect Elara', text: 'I know my worth. The question is: do you value me enough to pay it? Let\'s find a number we can both accept.' },
  ],
  context: 'Negotiating Master Architect Elara\'s salary. She has an outside offer of 150 gold from a rival kingdom. Your BATNA is hiring a lesser architect for 80 gold. The surplus from agreement is the value Elara creates above your next-best option. Both parties want to maximize their share of this surplus. This is a classic bargaining problem: the negotiation range is between Elara\'s reservation price (150, her outside offer) and your reservation price (the value she adds minus the 80 gold fallback).',
  choices: [
    { id: 'offer_80', label: 'Offer 80 Gold', description: 'Low-ball offer. What you\'d pay a lesser architect. Elara almost certainly leaves.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'offer_120', label: 'Offer 120 Gold', description: 'Moderate offer. Above her outside option. She may accept, but you keep most of the surplus.', risk: 'medium', tags: ['medium'] },
    { id: 'offer_160', label: 'Offer 160 Gold', description: 'Generous offer. Above her outside option of 150. She\'ll likely stay, and you get significant value.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'offer_200', label: 'Offer 200 Gold', description: 'Match her demand exactly. Guarantees she stays but captures zero surplus for you.', risk: 'low', tags: ['cooperate'] },
  ],
  idealNote: 'Offering 160 gold is the optimal play. It exceeds Elara\'s outside option (150), incentivizing her to stay, while keeping 40 gold of surplus for you. Offering 120 risks losing her (she leaves for 150). Offering 80 is insulting. Offering 200 gives all the surplus to her. The bargaining theory insight: the "negotiation range" is the gap between the two parties\' reservation prices (150 and whatever value Elara adds minus 80). Within this range, the exact price depends on bargaining power. Your BATNA (80 gold architect) and her BATNA (150 gold offer) define the negotiation zone. The better your BATNA, the lower you can negotiate. The key to good negotiation is improving your BATNA before you sit down.',
  analyze: (choice) => {
    if (choice === 'offer_80') {
      return 'You offered 80 gold — what a lesser architect would cost. Elara rejects immediately and takes the 150 gold offer from the neighboring kingdom. You now have a lesser architect for 80 gold. But what did you lose? Elara\'s superior skills would have generated far more value for your kingdom. By lowballing, you failed to capture any of that value. The negotiation lesson: your BATNA (80 gold for a lesser architect) is your fallback, but it\'s also your weakness — it defines the floor of the negotiation zone. The surplus you could have shared with Elara is now lost entirely. Real-world parallel: companies that lowball highly skilled candidates often lose them to competitors who offer market rates. The cost is not just the salary difference but the lost productivity.';
    }

    if (choice === 'offer_120') {
      return 'You offered 120 gold. Elara counter-offers — her reservation price is 150 (her outside offer). You\'re below her walk-away point. In the end, she may accept 120 if she values non-monetary benefits (your kingdom\'s prestige, working conditions, loyalty). But likely she leaves for 150. You offered within the "negotiation zone" (between her 150 and your surplus-based maximum), but barely. The lesson: successful negotiation requires understanding the other party\'s reservation price, not just offering what you\'d like to pay. The "ZOPA" (Zone of Possible Agreement) is the range where a deal is possible. If your offer is below her reservation price, there is no ZOPA. Real-world parallel: salary negotiations where the candidate has a competing offer — the employer must beat the competing offer to close the deal.';
    }

    if (choice === 'offer_160') {
      return 'You offered 160 gold. This exceeds Elara\'s outside option of 150. She accepts. You retain a world-class architect at 160 gold — a 40 gold premium over her outside option, but still 40 gold below what you were willing to pay. This is optimal bargaining: you both get something. She gets more than her alternative. You keep some surplus. The key concept is "splitting the difference" — the 10 gold above her reservation price is your "bargaining surplus" that makes the deal attractive to her. In Nash Bargaining, the equilibrium splits the surplus according to bargaining power. Your offer captured most of the surplus because you made the first offer (anchoring effect) and knew her reservation price. Real-world lesson: first offers anchor negotiations. Offer aggressively but within the ZOPA.';
    }

    return 'You offered 200 gold — her full demand. She accepts but you capture zero surplus. All the value of her superior skills flows to her. This is a "negotiation failure" in the sense that you left money on the table — you could have paid less and still kept her. Offering your reservation price immediately is a common mistake called "leaving money on the table" or "failing to claim value." The best negotiators both create value (expanding the pie) and claim value (getting a fair share of it). By offering 200 immediately, you created the deal but claimed none of its value. The lesson: negotiating effectively requires knowing not just the other party\'s BATNA but also not revealing your full willingness to pay. Anchoring, patience, and information management are key negotiation skills.';
  },
  agents: {
    elara: { personality: 'opportunist', name: 'Architect Elara' },
  },
});

scenarioRegistry.register({
  id: 'the-peace-treaty',
  title: 'The Peace Treaty',
  era: 5,
  order: 46,
  concept: 'bargaining',
  type: 'bargaining',
  setup: (state) => {
    state.player.resources.military = 100;
    state.player.resources.gold = 200;
  },
  story: [
    { speaker: 'Queen Seraphine\'s Envoy', text: 'Three years of war have exhausted both our kingdoms. The disputed territory must be divided. Let us negotiate a peace before more blood is spilled.' },
    { speaker: 'Your General', text: 'We can fight for all of it and risk everything. Or we can settle for half and have peace. Or we can take a quarter and end the war cheaply.' },
    { speaker: 'Envoy', text: 'We have our own demands. We will accept nothing less than a quarter. But we hope for more. The question is: what do you demand?' },
  ],
  context: 'Two kingdoms negotiate to divide 100 units of disputed territory. Both want as much as possible. If they agree on a division, peace prevails and both get their share. If they cannot agree, the war continues, costing each side 20 units per year of additional conflict. You must decide how much to demand. The AI has its own demand. If demands overlap (sum ≤ 100), peace is reached. If demands exceed 100, war continues.',
  choices: [
    { id: 'demand_most', label: 'Demand 70 Units', description: 'Demand the lion\'s share. High risk of continued war.', risk: 'high', tags: ['high'] },
    { id: 'demand_half', label: 'Demand 50 Units', description: 'Demand half. Fair split, likely acceptable.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'demand_quarter', label: 'Demand 25 Units', description: 'Demand a quarter. Cede most of the territory for guaranteed peace.', risk: 'low', tags: ['cooperate'] },
  ],
  idealNote: 'Demand half is the optimal strategy against a rational opponent. Both sides want to avoid the cost of continued war (20 per year). A 50/50 split is the "focal point" — the most natural, salient division. In laboratory bargaining experiments, 50/50 splits are by far the most common agreement. The AI (a trustBuilder) is likely to accept half. Demanding 70 is risky: the AI may reject it (continuing war), and even if accepted, you leave the AI with only 30 — a deal they\'d resent and potentially undermine later. Demanding 25 is too generous — you leave 75 on the table unnecessarily. The Nash Bargaining Solution for symmetric players with equal fallback positions is exactly 50/50.',
  analyze: (choice, aiChoice) => {
    const playerDemand = choice === 'demand_most' ? 70 : choice === 'demand_half' ? 50 : 25;
    const aiDemand = aiChoice === 'demand_most' ? 70 : aiChoice === 'demand_half' ? 50 : 25;
    const sum = playerDemand + aiDemand;
    const peace = sum <= 100;
    const playerGets = peace ? playerDemand : -20;
    const aiGets = peace ? aiDemand : -20;

    if (peace) {
      return `Peace! You demanded ${playerDemand}. AI demanded ${aiDemand}. Total: ${sum} ≤ 100. Agreement reached. You get ${playerDemand} units, AI gets ${aiDemand} units. This is the Nash Bargaining Solution: when both parties demand shares that sum to exactly 100, they split the pie exactly.${playerDemand === 50 ? ` The 50/50 split is the "focal point" — it's mathematically salient, perceived as fair, and is the most common outcome in bargaining experiments. It's also the Nash Bargaining Solution when both parties have equal bargaining power (symmetric threat points).` : ''} The lesson: in distributive bargaining, knowing the focal point (50/50) and anchoring near it leads to efficient agreements. Greedy demands risk war, and too-generous offers leave value on the table.`;
    }

    if (playerDemand + aiDemand > 100) {
      return `War continues! You demanded ${playerDemand}. AI demanded ${aiDemand}. Total: ${sum} > 100. No agreement possible. Each side loses 20 this year. This is inefficient — both of you would prefer peace, but you couldn't coordinate on a division. This is the "bargaining failure" problem: when both parties are optimistic about their bargaining position or unwilling to compromise, the surplus from peace is destroyed. In game theory, this is a "costly delay" or "inefficient bargaining" outcome. Real-world examples: government shutdowns (both sides refuse to budge), strikes (unions and management can't agree), and litigation (both sides spend more on lawyers than the dispute is worth). The lesson: stubbornness in bargaining can destroy value. The zone of possible agreement (ZOPA) exists, but psychological barriers prevent reaching it.`;
    }

    return 'Negotiation continues...';
  },
  agents: {
    seraphine: { personality: 'trustBuilder', name: "Queen Seraphine's Envoy" },
  },
});

scenarioRegistry.register({
  id: 'the-prisoners-tournament',
  title: 'The Prisoner\'s Tournament',
  era: 5,
  order: 47,
  concept: 'evolutionaryGT',
  type: 'tournament',
  setup: (state) => {
    state.player.resources.influence = 20;
  },
  story: [
    { speaker: 'Grand Tournament Master', text: 'Welcome to the Prisoner\'s Tournament! Six strategies compete in a round-robin Iterated Prisoner\'s Dilemma (10 rounds each pairing). Classic strategies include Tit-for-Tat, Grim Trigger, Always Cooperate, Always Defect, and more.' },
    { speaker: 'Herald', text: 'Your strategy will play against every other strategy. The total score determines the winner. Robert Axelrod ran this exact tournament in 1980 — and the result surprised everyone.' },
    { speaker: 'Grand Master', text: 'Choose your champion\'s strategy. The field includes the naive, the ruthless, the forgiving, and the chaotic.' },
  ],
  context: 'Six strategies compete in a round-robin tournament, each playing 10 rounds of iterated Prisoner\'s Dilemma against every other. Classic strategies: Tit-for-Tat (start cooperate, then mirror), Grim Trigger (cooperate until betrayed, then defect forever), Always Cooperate, Always Defect, Random, and one more. Your strategy choice enters the tournament. The aggregate scores reveal which approach performs best across all matchups.',
  choices: [
    { id: 'always_cooperate', label: 'Always Cooperate (Naive)', description: 'Cooperate every round without fail. Innocent but exploitable.', risk: 'high', tags: ['cooperate'] },
    { id: 'always_defect', label: 'Always Defect (Ruthless)', description: 'Betray every round. Maximizes single-round gains, destroys relationships.', risk: 'high', tags: ['defect'] },
    { id: 'tit_for_tat', label: 'Tit-for-Tat (Reciprocal)', description: 'Start cooperative, then mirror opponent\'s last move. Nice, provokable, forgiving, clear.', risk: 'medium', tags: ['cooperate'] },
    { id: 'grim_trigger', label: 'Grim Trigger (Vengeful)', description: 'Cooperate until first betrayal, then defect forever. Powerful but brittle.', risk: 'medium', tags: ['cooperate'] },
    { id: 'generous_tft', label: 'Generous Tit-for-Tat', description: 'Like TFT but occasionally forgives defection (10% chance). Prevents grudge spirals.', risk: 'medium', tags: ['cooperate'] },
    { id: 'random', label: 'Random (Chaotic)', description: 'Flip a coin each round. Unpredictable but strategically empty.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'Tit-for-Tat won Axelrod\'s original tournament and is the optimal all-around strategy. It is "nice" (never defects first), "provokable" (immediately punishes defection), "forgiving" (resumes cooperation when opponent does), and "clear" (predictable pattern). These four properties make it robust across all matchups. Generous TFT performs similarly but can avoid echo-chamber defection spirals with other TFT-like strategies. The lesson: in evolutionary tournaments, strategies that sustain mutual cooperation while defending against exploitation outperform purely aggressive or purely cooperative approaches.',
  analyze: (choice) => {
    const results = {
      always_cooperate: 'Your Always Cooperate strategy enters the round-robin:\n\n' +
        'vs Always Defect: Cooperates every round, gets exploited every round. +0 points. Worst matchup.\n' +
        'vs Tit-for-Tat: Mutual cooperation every round. +30 points. Excellent.\n' +
        'vs Grim Trigger: Mutual cooperation every round. +30 points.\n' +
        'vs Generous TFT: Mutual cooperation (with occasional minor losses). ~+28 points.\n' +
        'vs Random: Mixed. ~+18 points (cooperate each round, Random sometimes defects).\n\n' +
        'Total score: ~106 points. Rank: Probably 4th-5th. Analysis: Always Cooperate does great with other cooperators but gets brutally exploited by Always Defect. In a mixed population, unconditional cooperators get wiped out — that\'s why naive cooperation disappears evolutionarily. Axelrod\'s tournament proved that nice strategies succeed, but they need to be PROVOKABLY nice — willing to punish defection. Pure niceness without defense is evolutionarily unstable. Lesson: trust is good, but blind trust is dangerous.',
      always_defect: 'Your Always Defect strategy enters the round-robin:\n\n' +
        'vs Always Cooperate: Exploits them every round. +50 points. Maximum.\n' +
        'vs Tit-for-Tat: Round 1 you exploit (5), then TFT defects forever. +14 points total.\n' +
        'vs Grim Trigger: Round 1 you exploit (5), then Grim defects forever. +14 points.\n' +
        'vs Generous TFT: Exploit round 1 (5), GTFT sometimes forgives, then you exploit again. ~+20 points.\n' +
        'vs Random: Mixed. ~+25 points.\n\n' +
        'Total score: ~123 points. Rank: Probably 2nd-3rd. Analysis: Always Defect wins big against cooperators but creates permanent feuds with reciprocal strategies. It does well but not best — because it fails to capture the gains from mutual cooperation. In Axelrod\'s actual tournament, Always Defect finished in the middle of the pack. It "wins" individual rounds but loses the tournament because the strategies it can exploit (Always Cooperate, Random) perform poorly against everyone else, dragging down AD\'s aggregate. Lesson: pure ruthlessness is self-limiting. Exploitation works when there are victims, but victims die out, leaving only other predators.',
      tit_for_tat: 'Your Tit-for-Tat strategy enters the round-robin — the champion of Axelrod\'s tournament:\n\n' +
        'vs Always Cooperate: Mutual cooperation. +30 points.\n' +
        'vs Always Defect: Round 1 cooperation (exploited, 0), rounds 2-10 mirror defection. +9 points.\n' +
        'vs Grim Trigger: Mutual cooperation every round. +30 points.\n' +
        'vs Generous TFT: Mutual cooperation (with slight forgiveness). ~+28 points.\n' +
        'vs Random: Cooperate first, then mirror. ~+18 points.\n\n' +
        'Total score: ~115 points. Rank: 1st or 2nd. Analysis: TFT wins because it (1) NEVER defects first — it avoids unnecessary conflict, (2) IMMEDIATELY punishes defection — it\'s not exploitable, (3) FORGIVES — it resumes cooperation when the opponent does, ending feuds, and (4) is CLEAR — opponents can predict and adapt to it. These four properties made Tit-for-Tat the winner of both of Axelrod\'s tournaments and thousands of subsequent evolutionary simulations. The lesson: the most successful strategy in repeated games is nice-but-not-naive. Be cooperative but willing to defend yourself, and be willing to make peace.',
      grim_trigger: 'Your Grim Trigger strategy enters the round-robin:\n\n' +
        'vs Always Cooperate: Mutual cooperation. +30 points.\n' +
        'vs Always Defect: Round 1 exploited (0), rounds 2-10 defect. +9 points.\n' +
        'vs Tit-for-Tat: Mutual cooperation. +30 points.\n' +
        'vs Generous TFT: Mutual cooperation. +30 points.\n' +
        'vs Random: If Random defects once (likely in 10 rounds), Grim defects forever. ~+10 points.\n\n' +
        'Total score: ~109 points. Rank: 3rd-4th. Analysis: Grim Trigger does almost as well as TFT against rational opponents but performs worse against Random (which might defect by chance, triggering permanent war). Its weakness: brittleness. One mistake or miscommunication and cooperation collapses permanently. In Axelrod\'s tournaments, Grim Trigger did well but not as well as TFT because it lacks forgiveness. In the real world, where errors and miscommunications happen, forgiveness is essential. Lesson: the best strategies include a forgiveness mechanism. "Never forgive" sounds strong but performs poorly in noisy environments.',
      generous_tft: 'Your Generous Tit-for-Tat (10% forgiveness) enters the round-robin:\n\n' +
        'vs Always Cooperate: Mutual cooperation with occasional forgiven defection. ~+29 points.\n' +
        'vs Always Defect: Similar to TFT but occasionally forgives and gets exploited again. ~+8 points.\n' +
        'vs Tit-for-Tat: Almost perfect mutual cooperation. ~+29 points.\n' +
        'vs Grim Trigger: Mutual cooperation. ~+30 points.\n' +
        'vs Random: Forgiveness helps recover from random defections. ~+20 points.\n\n' +
        'Total score: ~116 points. Rank: Contending for 1st. Analysis: Generous TFT matches or slightly beats standard TFT because it corrects one of TFT\'s weaknesses: the "echo effect" where a single accidental defection triggers an endless cycle of retaliation (TFT defects, opponent defects back, TFT defects back...). A 10% forgiveness rate breaks this cycle. Axelrod later showed that generous variants of TFT can outperform strict TFT in noisy environments. The lesson: forgiveness is not weakness — it\'s a strategy for recovering from errors. In any real-world repeated interaction, mistakes happen. The best strategies account for this.',
      random: 'Your Random strategy enters the round-robin:\n\n' +
        'vs Always Cooperate: Cooperates ~50%, defects ~50%. ~+20 points.\n' +
        'vs Always Defect: Mostly exploited. ~+5 points.\n' +
        'vs Tit-for-Tat: TFT mirrors your chaos. ~+15 points.\n' +
        'vs Grim Trigger: First defect triggers permanent war. ~+8 points.\n' +
        'vs Generous TFT: ~+12 points.\n\n' +
        'Total score: ~60 points. Rank: Last. Analysis: Random is the worst-performing strategy by far. It cannot sustain cooperation (because it randomly defects, triggering retaliation) and cannot consistently exploit (because it randomly cooperates). It sends no signal, builds no trust, and creates no value. Lesson: randomness is not a strategy. Even imperfect but principled approaches outperform pure chaos. In both Axelrod tournaments and evolutionary simulations, random strategies are the first to go extinct. The key insight: successful strategies are those that can form cooperative relationships with other successful strategies. Randomness prevents relationship formation entirely.',
    };
    return results[choice] || 'The Prisoner\'s Tournament teaches the most important lesson in strategic interaction: the best long-run strategy is to be cooperative but not exploitable, forgiving but not naive, and above all, clear and predictable. This is why Tit-for-Tat and its variants have dominated evolutionary tournaments for decades.';
  },
  agents: {},
});

scenarioRegistry.register({
  id: 'the-marriage-market',
  title: 'The Marriage Market',
  era: 5,
  order: 48,
  concept: 'matching',
  type: 'matching',
  setup: (state) => {
    state.player.resources.influence = 30;
  },
  story: [
    { speaker: 'Matchmaker Beatrice', text: 'Three noble houses seek marriages for their children. Each has preferences. I need your help finding a stable matching — where no two people would rather be with each other than their assigned partners.' },
    { speaker: 'Noble House Aldric', text: 'Our daughter prefers the Valerius heir above all. But the Valerius heir prefers the Celestine daughter. And the Celestine family... well, preferences are complex.' },
    { speaker: 'Matchmaker Beatrice', text: 'The challenge: find a matching where no "blocking pair" exists. A blocking pair is a man and woman who prefer each other over their current matches. If such a pair exists, the matching is unstable.' },
  ],
  context: 'Three noble families arrange marriages for their children. Each has strict preferences over partners. You must propose a matching (who marries whom). A matching is "stable" if no unmatched pair would both prefer to leave their current partners and marry each other. This is the Gale-Shapley "stable marriage" problem (1962), which won Shapley the Nobel Prize.',
  choices: [
    { id: 'propose_rank', label: 'Rank-Based Proposal', description: 'Use the Gale-Shapley algorithm: men propose to their top choice, women accept the best offer. Produces a stable matching favoring the proposing side.', risk: 'medium', tags: ['cooperate'] },
    { id: 'propose_utility', label: 'Utility-Maximizing Match', description: 'Find the matching that maximizes total happiness (sum of preference ranks). May be unstable if someone can do better by switching.', risk: 'high', tags: ['high'] },
    { id: 'propose_random', label: 'Random Matching', description: 'Randomly assign partners. Simple but very unlikely to be stable.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'The Gale-Shapley deferred acceptance algorithm is the optimal choice. It always produces a stable matching in which no blocking pair exists. Furthermore, it produces the matching that is optimal for the proposing side (each proposer gets the best partner they could get in ANY stable matching). This algorithm and its insight — that stable matchings always exist and can be found efficiently — won Lloyd Shapley the 2012 Nobel Prize in Economics. It is used in real-world matching markets: the National Resident Matching Program (matching doctors to hospitals), school choice systems in New York and Boston, and college admissions.',
  analyze: (choice) => {
    if (choice === 'propose_rank') {
      return 'You used the Gale-Shapley algorithm: men propose to their top choice; women tentatively accept the best offer but can upgrade later. The result: a stable matching where no blocking pair exists. This matching is "men-optimal" — each man gets the best partner they could get in any stable matching. But it\'s "women-pessimal" — each woman gets the worst partner possible in any stable matching (because women only choose among offers, and men propose in preference order). The key insight: stable matchings always exist! This was a revolutionary result — before Gale and Shapley, economists weren\'t sure stable matchings existed in all preference profiles. The algorithm is "strategy-proof" for the proposing side: men cannot benefit by misrepresenting their preferences. Real-world use: the National Resident Matching Program has used this algorithm since the 1950s to match 40,000+ doctors to residency programs each year. Lloyd Shapley and Alvin Roth won the 2012 Nobel Prize for this work.';
    }

    if (choice === 'propose_utility') {
      return 'You tried to maximize total "happiness" — the sum of preference ranks. The result: a matching with high total utility but UNSTABLE. A man and woman who prefer each other over their current partners form a "blocking pair" and elope, breaking the matching. This is the fundamental insight of matching theory: maximizing total utility does NOT guarantee stability. Stability — the absence of blocking pairs — is a constraint that often conflicts with efficiency or equality. In the real world, unstable matchings fall apart because individuals act on their preferences. The National Resident Matching Program specifically uses Gale-Shapley instead of a utilitarian algorithm because stability is essential — if doctors could improve their match by switching, the whole system would unravel. Lesson: in matching markets, stability trumps efficiency because unstable matchings are self-destructive.';
    }

    return 'You used random matching. Unsurprisingly, the resulting matching is unstable. Multiple blocking pairs exist. The marriages wouldn\'t last — someone will leave their assigned partner for someone they prefer. Random matching almost never produces a stable outcome (the probability approaches zero as the market grows). This illustrates why matching markets need deliberate design — leaving them to chance or unguided markets leads to inefficient, unstable outcomes. The Gale-Shapley insight is that a small amount of centralized structure (the algorithm) can dramatically improve outcomes. Real-world parallel: school choice systems that use random lotteries produce unstable, unpopular results — which is why New York, Boston, and other cities switched to Gale-Shapley-based systems. The lesson: when preferences matter, matching algorithms matter even more.';
  },
  agents: {
    beatrice: { personality: 'longTermPlanner', name: 'Matchmaker Beatrice' },
  },
});

scenarioRegistry.register({
  id: 'the-arms-race',
  title: 'The Arms Race',
  era: 5,
  order: 49,
  concept: 'nashEquilibrium',
  type: 'security',
  setup: (state) => {
    state.player.resources.gold = 300;
    state.player.resources.military = 100;
  },
  story: [
    { speaker: 'General Thorne', text: 'The neighboring kingdom has increased its military budget by 50%. Our spies confirm they\'re building new fortifications on the border.' },
    { speaker: 'Your Treasurer', text: 'If we match their spending, we drain the treasury and neither side gains an advantage. If we don\'t, we become vulnerable. If both disarm, we\'d both be rich and safe.' },
    { speaker: 'General Thorne', text: 'The security dilemma: one side\'s defense is the other\'s offense. If I build walls to protect us, they see it as preparation for attack. There\'s no purely defensive action in international relations.' },
  ],
  context: 'The classic security dilemma: two kingdoms choose military spending levels. Both spend heavily: both are safe but poor. Both disarm: both are safe AND rich. One arms while the other disarms: the armed kingdom dominates. This is a Prisoner\'s Dilemma structure with high stakes — the Nash equilibrium (both arm) produces an outcome that neither prefers to the Pareto-superior (both disarm), but neither trusts the other to disarm.',
  choices: [
    { id: 'arm', label: 'Arm Heavily', description: 'Increase military spending to match the neighbor. Safe but costly. Perpetuates the arms race.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'disarm', label: 'Disarm Completely', description: 'Cut military spending. Invest the savings in infrastructure and trade. Risky if they attack.', risk: 'high', tags: ['cooperate'] },
    { id: 'diplomacy', label: 'Propose Mutual Disarmament', description: 'Send diplomats to negotiate a mutual disarmament treaty with verification. Attempt to escape the dilemma through communication and binding commitments.', risk: 'medium', tags: ['cooperate'] },
  ],
  idealNote: 'Proposing mutual disarmament with verification is the optimal move. Unilateral disarmament is naive (vulnerable to exploitation). Unilateral arming is costly and perpetuates the security dilemma. The path out of the arms race requires BOTH communication (to coordinate on the cooperative outcome) AND verification (to ensure compliance). This is why real-world arms control treaties (SALT, START, INF) include verification mechanisms like on-site inspections and satellite monitoring. The security dilemma isn\'t a Prisoner\'s Dilemma when communication and enforcement are possible — it becomes a coordination game where both prefer mutual disarmament to mutual armament.',
  analyze: (choice, aiChoice) => {
    if (choice === 'arm') {
      if (aiChoice === 'arm') {
        return 'Both arm. Escalation spiral. Both kingdoms maintain parity but at enormous cost: military spending drains the treasury, trade suffers, and citizens bear higher taxes. Net: both get +0 (mutual deterrence with no advantage). This is the Nash Equilibrium: neither can improve by changing alone (disarming would make you vulnerable). But both would prefer mutual disarmament (+3 each). This is the tragedy of the security dilemma: individually rational choices (arming to protect yourself) lead to collectively worse outcomes (everyone spends heavily on defense and no one is safer). The arms race between the US and USSR during the Cold War is the classic real-world example: both spent trillions, neither gained a strategic advantage, and both were less prosperous than if they had cooperated. The Nash equilibrium of the security dilemma is "prison" — both trapped by mutually reinforcing fear.';
      }
      return 'You armed. AI disarmed. You now have military superiority. You could invade, but the AI\'s disarmament is a signal of peaceful intent. If you invade, you win territory but gain a reputation for aggression. If you don\'t, you\'ve wasted gold on arms you don\'t need. This outcome is unstable: the AI will likely re-arm next season, realizing that disarmament without trust is vulnerability. Your armament "caused" the AI to feel threatened. This is the security dilemma dynamic: your action to increase security (arming) decreases THEIR security, prompting them to arm, which decreases YOUR security — a spiral of mutual fear. The tragedy is that both sides would prefer the outcome where neither arms, but fear prevents it.';
    }

    if (choice === 'disarm') {
      if (aiChoice === 'disarm') {
        return 'Both disarm! Peace dividends flow. Military budgets are redirected to infrastructure, education, and trade. Both kingdoms prosper. Net: +3 each. This is the Pareto-optimal outcome — both prefer it to mutual armament. But is it a Nash equilibrium? No. Consider: if you disarm and they arm, they can dominate you. The "both disarm" outcome is not a Nash equilibrium because each side can improve by unilaterally arming (gaining advantage over a disarmed opponent). This means "both disarm" is unstable without enforcement. Real-world example: the dissolution of the Soviet Union led to unilateral Russian disarmament in the 1990s — but the US didn\'t reciprocate fully, leading to Russian resentment and eventual re-armament under Putin. The lesson: mutual disarmament requires verification and enforcement to be stable.';
      }
      return 'You disarmed. AI armed. You are now vulnerable. The AI has military superiority and can extract concessions. This is the worst outcome: you trusted and they exploited. Net: -2 (you lose). This is the "sucker\'s payoff" — the cost of naive cooperation against an aggressive opponent. In the security dilemma, unilateral disarmament without a binding treaty is extremely risky because the opponent has both the incentive and the opportunity to exploit your vulnerability. Real-world example: the appeasement of Nazi Germany in the 1930s (other European nations disarmed while Germany re-armed, leading to disaster). The lesson: disarmament must be MUTUAL and VERIFIED. Unilateral disarmament in the absence of trust is dangerous.';
    }

    if (choice === 'diplomacy') {
      if (aiChoice === 'diplomacy') {
        return 'Mutual diplomacy succeeds! Both kingdoms sign a binding arms control treaty with on-site verification. Armies are reduced by 50%. Military spending is redirected to social programs and trade. Both get +3. This is the cooperative escape from the security dilemma. The key ingredients: communication (you talked to each other), binding commitment (treaty), and verification (you can check compliance). These three elements transform the security dilemma from a Prisoner\'s Dilemma (where defection is dominant) into a coordination game (where both prefer the cooperative outcome). Real-world examples: the INF Treaty (1987) eliminating intermediate-range nuclear missiles, the SALT/START treaties limiting strategic arms. The lesson: the security dilemma is not fate — institutions, communication, and verification can resolve it. This is the foundation of international relations theory and diplomacy.';
      }
      return 'You proposed diplomacy. The AI rejected it and armed instead. Your diplomatic overture was seen as weakness. You now face a superior military power and must either arm yourself (playing catch-up) or accept vulnerability. Diplomacy failed because the AI either didn\'t trust your sincerity or was determined to gain advantage. This is the risk of offering cooperation to an aggressive opponent. The lesson: diplomacy works best when both sides want peace AND have credible threats if the other defects. "Speak softly and carry a big stick" — the diplomatic approach is most effective when backed by the capability to defend yourself. Pure diplomacy without deterrent capability is often ignored.';
    }

    return 'The security dilemma is one of the most profound concepts in game theory and international relations. It shows how individually rational security-seeking behavior can produce collective insecurity. The only escape routes are: (1) mutual verification and enforcement, (2) transforming the relationship through repeated interaction and trust-building, or (3) an external hegemon that enforces peace.';
  },
  agents: {
    thorne: { personality: 'riskAverse', name: 'General Thorne' },
  },
});

scenarioRegistry.register({
  id: 'the-constitution-convention',
  title: 'The Constitution Convention',
  era: 5,
  order: 50,
  concept: 'mechanismDesign',
  type: 'constitution',
  setup: (state) => {
    state.player.resources.influence = 50;
    state.player.resources.gold = 400;
  },
  story: [
    { speaker: 'Chancellor Ariana', text: 'Seven kingdoms have agreed to form a new alliance — the Grand Compact. But the rules of this alliance must be written first. The constitution we write today will shape the fate of a continent.' },
    { speaker: 'Ambassador from the North', text: 'Every clause creates winners and losers. The voting system determines who has a voice. The tax rate determines who pays. The military commitment determines who fights. The trade policy determines who prospers.' },
    { speaker: 'Chancellor Ariana', text: 'We need a constitution that every kingdom can ratify — one that balances power, provides public goods, and creates incentives for cooperation. This is mechanism design at the grandest scale.' },
  ],
  context: 'You are one of seven kingdoms designing the constitution of the Grand Compact. Four provisions must be chosen: (1) voting system, (2) tax rate, (3) military commitment, and (4) trade policy. Each choice affects how the alliance functions. Your goal is to create rules that produce good outcomes even when each kingdom acts in its own self-interest — the essence of mechanism design.',
  choices: [
    { id: 'federal', label: 'Federal Constitution', description: 'Strong central council with weighted voting (by population), moderate taxes (10%), proportional military commitment, and open trade. Balances power and responsibility.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'confederal', label: 'Confederal Constitution', description: 'Weak central council, unanimous voting for major decisions, low taxes (5%), voluntary military contributions, and bilateral trade only. Maximizes sovereignty but limits collective action.', risk: 'medium', tags: ['cooperate'] },
    { id: 'unitary', label: 'Unitary Constitution', description: 'Strong central authority, one-kingdom-one-vote, high taxes (20%), mandatory military contributions, and centralized trade management. Powerful but may concentrate too much control.', risk: 'high', tags: ['high'] },
    { id: 'minimal', label: 'Minimal Charter', description: 'No central authority beyond a forum for discussion. Zero taxes, no military commitment, no trade rules. A loose alliance in name only.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'The Federal Constitution is the optimal mechanism design. It balances weighted voting (proportional to population, solving the "one-kingdom-one-vote vs. majority tyranny" problem), moderate taxes (providing public goods without overburdening), proportional military commitment (burden-sharing proportional to capacity), and open trade (creating mutual interdependence that makes conflict costly). The Confederal approach is too weak to solve collective action problems. The Unitary approach concentrates too much power. The Minimal charter is an alliance in name only. The lesson: mechanism design is about creating rules that align individual incentives with collective welfare. The Federal approach does this by "making everyone have skin in the game" through proportional contributions and proportional voice.',
  analyze: (choice) => {
    if (choice === 'federal') {
      return 'You chose the Federal Constitution. Weighted voting by population: large kingdoms have more say, but small kingdoms still have a voice (they can form coalitions). Moderate 10% taxes fund shared public goods: a standing peacekeeping force, a unified road network, and a dispute resolution court. Proportional military commitment: each kingdom contributes soldiers proportional to its population, so no one is overburdened. Open trade: all kingdoms trade freely, creating economic interdependence that raises the cost of conflict.\n\n' +
        'Mechanism design analysis: The Federal Constitution passes the "incentive compatibility" test — no kingdom can gain by misrepresenting its size or capacity (taxes and voting shares are based on verifiable population). It passes the "budget balance" test — taxes collected equal services provided. It creates "aligned incentives" — each kingdom benefits from the alliance\'s success. The trade provision creates "mutual dependence" — trade partners are less likely to fight because conflict destroys the trade surplus. This mirrors the design of the US Constitution (1787) which balanced large vs. small states through the Great Compromise (House proportional, Senate equal). The lesson: good constitutions align individual incentives with collective welfare through carefully balanced checks and proportional obligation.';
    }

    if (choice === 'confederal') {
      return 'You chose the Confederal Constitution. Unanimous voting: any kingdom can veto any decision. This protects sovereignty but creates gridlock — nothing gets done. Low 5% taxes: barely funds a secretariat. Voluntary military contributions: in a crisis, some kingdoms may not send troops. Bilateral trade: each kingdom negotiates its own deals, limiting the alliance\'s economic power.\n\n' +
        'Mechanism design analysis: This constitution is "individually rational" (no kingdom gives up much power) but "collectively inefficient" (the alliance cannot solve collective action problems). The unanimity requirement creates a "hold-up problem" — any kingdom can block progress to extract concessions. The voluntary military commitment creates a "free rider problem" — everyone wants protection, few want to pay for it. This is the design of the Articles of Confederation (the US\'s first constitution, 1781-1789) which failed precisely because it was too weak to raise taxes, coordinate defense, or regulate interstate commerce. It was replaced by the current Constitution in 1789. The lesson: constitutions that are too weak to act cannot maintain alliances. Freedom from constraint often means freedom from effective governance.';
    }

    if (choice === 'unitary') {
      return 'You chose the Unitary Constitution. One-kingdom-one-vote: each kingdom has equal say regardless of size (small kingdoms dominate). High 20% taxes: substantial funding but a heavy burden. Mandatory military contributions: reliable collective defense but may force kingdoms to fight in wars they don\'t support. Centralized trade: the council controls all external trade, maximizing bargaining power but eliminating local autonomy.\n\n' +
        'Mechanism design analysis: One-kingdom-one-vote creates "majority tyranny" — a coalition of small kingdoms can tax large kingdoms heavily while contributing little themselves. High taxes may drive the wealthiest kingdoms to secede. Mandatory military commitments could drag kingdoms into unwanted wars. This constitution is vulnerable to the "problem of faction" (Madison, Federalist No. 10): a majority coalition could exploit the minority (small kingdoms taxing large ones) or a minority could obstruct (large kingdoms block taxes that fund services they don\'t need). The unitary design concentrates enforcement power but lacks checks and balances. Historically, highly centralized unions like the Soviet Union failed because they imposed uniform rules on diverse populations without adequate representation.';
    }

    return 'You chose the Minimal Charter — a loose discussion forum with no binding commitments. Zero taxes: nothing is funded. No military commitment: no collective defense. No trade rules: each kingdom for itself. This is effectively not an alliance at all. It provides no public goods, creates no collective security, and generates no trade surplus. Each kingdom is as isolated as if the Grand Compact never existed.\n\n' +
        'Mechanism design analysis: This fails every test of mechanism design. It provides no "incentives" for cooperation (there\'s no benefit to joining), produces no "public goods" (no shared defense, roads, or courts), and fails to solve any "collective action problem" (free riding is absolute). In game theory terms, this is the "state of nature" — anarchy where each kingdom relies solely on its own power. As Hobbes wrote, life in the state of nature is "solitary, poor, nasty, brutish, and short." The Minimal Charter avoids the risks of a bad constitution but also captures none of the benefits of cooperation. The lesson: the absence of governance is itself a choice — and it\'s a choice that leaves all the gains from cooperation on the table. A well-designed constitution (the Federal option) captures those gains while mitigating the risks.';
  },
  agents: {
    ariana: { personality: 'longTermPlanner', name: 'Chancellor Ariana' },
  },
});
