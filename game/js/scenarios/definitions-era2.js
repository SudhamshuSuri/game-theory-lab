import { scenarioRegistry } from './registry.js';

// ============================================================
// ERA II: Repetition & Reputation (Scenarios 11–20)
// Repeated games, grim trigger, credible commitment,
// principal-agent problem, moral hazard.
// ============================================================

scenarioRegistry.register({
  id: 'the-trade-route-returns',
  title: 'The Trade Route Returns',
  era: 2,
  order: 11,
  concept: 'repeatedGames',
  type: 'prisoners_dilemma',
  multiRound: true,
  totalRounds: 10,
  setup: (state) => {
    state.player.resources.gold = 200;
  },
  story: [
    { speaker: 'Envoy of the Merchant Council', text: 'Our records show your previous trade route succeeded. We propose a new arrangement — a silk road through the mountain passes.' },
    { speaker: 'Envoy', text: 'Each season, we may toll fairly or toll greedily. Fair tolls grow the route for both. Greedy tolls profit one season but damage the road.' },
    { speaker: 'Your Advisor', text: 'The Merchant Council is known for one thing: they remember betrayal forever. A single unfair toll and they will never deal fairly again.' },
  ],
  context: 'You and the Merchant Council will operate a trade route for 10 seasons. Each season you choose: fair toll or unfair toll. The Council plays Grim Trigger — they cooperate until you cheat, then they cheat forever.',
  choices: [
    { id: 'fair', label: 'Fair Toll', description: 'Charge a reasonable fee. Both profit steadily. Builds the relationship.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'unfair', label: 'Unfair Toll', description: 'Exorbitant fees. Huge profit now, but you may never see another caravan.', risk: 'medium', tags: ['defect', 'high'] },
  ],
  idealNote: 'The optimal strategy is to play fair every single round. Because the Council uses Grim Trigger, a single defection destroys all future cooperation. With 10 rounds, the total value of mutual fair play (10 × +3 = +30) vastly exceeds the one-time gain from cheating (+5) followed by endless mutually destructive unfair tolls. This demonstrates the core insight of repeated games: the "shadow of the future" — the longer the relationship, the more cooperation pays.',
  analyze: (_choice, _aiChoice, history) => {
    const hist = history || [];
    const total = hist.length;
    if (total === 0) return 'Play through all rounds to see the full analysis.';
    const playerDefected = hist.filter(r => r.playerChoice === 'unfair').length;
    const firstDefectRound = hist.findIndex(r => r.playerChoice === 'unfair');
    const aiEverDefected = hist.some(r => {
      const ac = Object.values(r.aiChoices || {})[0];
      return ac === 'unfair';
    });
    const summary = `You played ${total} rounds. You chose unfair ${playerDefected} time(s).`;
    if (playerDefected === 0) {
      return summary + ' Perfect mutual cooperation. The Council (Grim Trigger) cooperated every round because you never triggered their vengeance. This is the ideal outcome in a repeated game with a Grim Trigger opponent: mutual cooperation is stable as long as no one defects. The "shadow of the future" — the knowledge that this relationship continues — makes betrayal irrational. Real-world example: long-term business partnerships where a single breach of trust ends the relationship permanently. Core insight: repeated interaction aligns individual incentives with collective welfare.';
    }
    if (firstDefectRound === 0) {
      return summary + ' You defected in round 1. The Council defected from round 2 onward — they never forgave you. This is Grim Trigger: one betrayal ends cooperation permanently. Total payoff from 1 unfair + 9 mutual unfair is far worse than 10 mutual fair rounds. Real-world echo: trade embargoes triggered by a single violation, divorce after infidelity, "zero tolerance" policies in international agreements. Lesson: Grim Trigger makes cooperation extremely stable, but it is brittle — one mistake or misunderstanding can lock both parties into permanent conflict.';
    }
    return summary + ` You defected in round ${firstDefectRound + 1}. The Council cooperated for ${firstDefectRound} rounds, then defected forever after your betrayal. The ${firstDefectRound} rounds of fair cooperation were valuable, but your single greedy choice destroyed them all. This is the tragedy of Grim Trigger: it works beautifully to enforce cooperation until the day it breaks, and then it never recovers. In the real world, this is why international treaties often include "re-entry" clauses — to avoid permanent breakdown from a single violation.`;
  },
  agents: {
    council: { personality: 'grimTrigger', name: 'Merchant Council' },
  },
});

scenarioRegistry.register({
  id: 'the-mercenary-contract',
  title: 'The Mercenary Contract',
  era: 2,
  order: 12,
  concept: 'principalAgent',
  type: 'contract',
  setup: (state) => {
    state.player.resources.gold = 300;
    state.player.resources.military = 50;
  },
  story: [
    { speaker: 'Captain Rourke', text: 'My company is the finest in the realm. Three hundred seasoned swords. We\'re available — for a price.' },
    { speaker: 'Your Steward', text: 'My lord, if we pay upfront, they may not fight as hard. If we pay only on results, they may refuse.' },
    { speaker: 'Captain Rourke', text: 'I fight for coin, not for glory. The question is: when do I get mine?' },
  ],
  context: 'You need mercenaries for an upcoming campaign. Captain Rourke\'s company is capable, but you must choose a payment structure. The challenge: once hired, Rourke\'s effort is hard to monitor. This is the Principal-Agent Problem.',
  choices: [
    { id: 'upfront', label: 'Pay Upfront', description: 'Full payment of 200 gold now. Rourke is paid regardless of performance.', risk: 'high', tags: ['high', 'defect'] },
    { id: 'performance', label: 'Performance Pay', description: '150 gold only if they fight well. Full incentive to perform.', risk: 'medium', tags: ['cooperate'] },
    { id: 'mixed', label: 'Mixed Payment', description: '100 gold now, 100 gold based on results. Balances risk and incentive.', risk: 'low', tags: ['cooperate', 'safe'] },
  ],
  idealNote: 'The optimal choice is mixed payment. Full upfront payment creates moral hazard (Rourke has no incentive to fight hard). Pure performance pay may be too risky for Rourke to accept. Mixed payment aligns incentives while sharing risk — the core solution to the Principal-Agent Problem. In the real world, this is why executives get base salary + bonuses, and why contractors get partial upfront + milestone payments.',
  analyze: (choice) => {
    const insights = {
      upfront: 'You paid 200 gold upfront. Captain Rourke has his money. Will he fight hard? The Principal-Agent Problem says: probably not. Once the agent (Rourke) is paid regardless of outcome, his incentives no longer align with yours (the principal). This is called moral hazard: the agent takes less care because he doesn\'t bear the consequences. Real-world parallels: CEOs paid regardless of performance, fixed-price contracts where quality suffers, employees with guaranteed salaries and no performance review. The lesson: when the agent\'s pay doesn\'t depend on results, expect mediocre results.',
      performance: 'You offered pure performance pay: 150 gold only for good results. This perfectly aligns Rourke\'s incentives with yours — but it shifts ALL the risk onto him. If the battle goes badly for reasons beyond his control (bad weather, bad intel), he gets nothing. In the real world, pure performance pay is rare because agents are risk-averse and demand a premium for bearing risk. This is the fundamental tradeoff in contract design: incentive alignment vs. risk sharing.',
      mixed: 'You chose mixed payment — the Goldilocks solution. Partial upfront covers Rourke\'s costs and gives him security. Partial performance pay keeps him motivated. This is the optimal contract in most real principal-agent relationships: salary + bonus, base + commission, retainer + milestone payments. It balances two competing goals: aligning incentives (so the agent works hard) and sharing risk (so the agent isn\'t ruined by bad luck). This is why virtually every real-world contract of consequence uses mixed payment.',
    };
    return insights[choice] || 'Contract design is about aligning incentives while sharing risk. The Principal-Agent Problem teaches that the structure of payment determines the quality of effort.';
  },
  agents: {
    rourke: { personality: 'greedy', name: 'Captain Rourke' },
  },
});

scenarioRegistry.register({
  id: 'the-tax-farmer',
  title: 'The Tax Farmer',
  era: 2,
  order: 13,
  concept: 'moralHazard',
  type: 'tax_farming',
  setup: (state) => {
    state.player.resources.gold = 500;
    state.player.resources.population = 1000;
  },
  story: [
    { speaker: 'Collector Vex', text: 'Give me the right to collect your taxes. I\'ll pay you 1,000 gold now — a guaranteed sum, no risk to your treasury.' },
    { speaker: 'Your Advisor', text: 'Tax farming is tempting, my lord. You get the gold upfront, no collection headaches. But Collector Vex will squeeze every last coin from the people to turn a profit.' },
    { speaker: 'Collector Vex', text: 'I\'m a businessman. The harder I collect, the more I keep. That\'s only fair, isn\'t it?' },
  ],
  context: 'Tax farming means selling the right to collect taxes for a fixed upfront payment. The "farmer" keeps everything above that amount. This creates a classic moral hazard: once Vex has paid you, he bears no cost for overtaxing the people — and every incentive to squeeze them dry.',
  choices: [
    { id: 'salary', label: 'Fixed Salary Collector', description: 'Hire Vex as a salaried employee. He gets 100 gold per season regardless of collection.', risk: 'medium', tags: ['safe', 'cooperate'] },
    { id: 'tax_farming', label: 'Tax Farming', description: 'Sell collection rights for 1,000 gold now. Vex keeps everything he collects beyond that.', risk: 'high', tags: ['high', 'defect'] },
    { id: 'oversight', label: 'Salary with Oversight', description: 'Hire Vex on salary but appoint an overseer to audit collection. Costs 50 gold per season for oversight.', risk: 'low', tags: ['cooperate', 'safe'] },
  ],
  idealNote: 'Salary with oversight is best. Tax farming creates pure moral hazard: Vex overtaxes ruthlessly because he bears no cost (he already paid you). Pure salary gives him no incentive to collect efficiently. Salary + oversight balances incentive and control, but monitoring costs money. This mirrors the fundamental insight of moral hazard theory: the optimal solution always involves a mix of incentives and monitoring, calibrated to the cost of oversight.',
  analyze: (choice) => {
    const insights = {
      salary: 'You hired Vex on a fixed salary. He gets 100 gold per season regardless of how much he collects. Result: he does the minimum. He has no incentive to find new taxpayers or pursue delinquents. This is the flip side of moral hazard — while he won\'t overtax (good), he also won\'t collect efficiently (bad). In game theory terms, you\'ve removed the incentive problem but killed productivity. Real-world parallel: government employees with no performance incentives often produce bureaucratic minimums.',
      tax_farming: 'You sold collection rights for 1,000 gold. Now Vex owns the right to tax. Since he already paid you, every extra coin he squeezes from the people is pure profit for him. He will overtax mercilessly, creating resentment, rebellion, and economic decay — but you already got your gold. This is the textbook definition of moral hazard: Vex takes the risky, aggressive action (overtaxing) because you bear the consequences (popular unrest) while he reaps the rewards. Historical examples: the French "Fermiers généraux" before the revolution, Roman publicani — both led to massive popular uprisings.',
      oversight: 'You chose salary with oversight. The overseer costs 50 gold per season, but this monitoring prevents Vex from overtaxing while giving him salary-based stability. The oversight cost is the price of aligning Vex\'s behavior with your interests. This demonstrates the key insight of moral hazard theory: monitoring is never free, but it is usually cheaper than the cost of unchecked moral hazard. In the real world, this is why we have auditors, inspectors, and regulators — imperfect but necessary checks on agent behavior.',
    };
    return insights[choice] || 'Moral hazard arises when someone makes decisions but doesn\'t bear the full consequences. The solution is always some combination of monitoring and incentive alignment.';
  },
  agents: {
    vex: { personality: 'greedy', name: 'Collector Vex' },
  },
});

scenarioRegistry.register({
  id: 'the-hostage-exchange',
  title: 'The Hostage Exchange',
  era: 2,
  order: 14,
  concept: 'credibleCommitment',
  type: 'hostage',
  setup: (state) => {
    state.player.resources.influence = 50;
  },
  story: [
    { speaker: 'King Aldric\'s Herald', text: 'My king proposes a mutual hostage exchange to seal the peace between our realms. A prince for a prince.' },
    { speaker: 'Your Spymaster', text: 'If we send a real hostage, they have leverage over us. If we send a fake, we risk war when they discover the deception.' },
    { speaker: 'King Aldric', text: 'I will send my own nephew. What will you send?' },
  ],
  context: 'Two kingdoms seek lasting peace. A hostage exchange makes the peace agreement credible: each side holds something valuable that will be destroyed if the other breaks the treaty. The question is whether you send a genuine hostage — someone whose safety you truly care about.',
  choices: [
    { id: 'send_real', label: 'Send a Royal Cousin', description: 'Send a genuine member of your royal family. Your commitment is credible because you truly fear for their safety if you break the treaty.', risk: 'high', tags: ['cooperate'] },
    { id: 'send_fake', label: 'Send a Commoner in Disguise', description: 'Send someone who looks noble but isn\'t. You keep your leverage while appearing to commit.', risk: 'high', tags: ['defect'] },
    { id: 'refuse_hostage', label: 'Refuse the Exchange', description: 'Refuse the hostage exchange entirely. No commitment, but no peace either.', risk: 'low', tags: ['safe'] },
  ],
  idealNote: 'Sending a real hostage is the only choice that makes peace credible. A fake hostage, if discovered, destroys trust permanently and triggers war. Refusing means no peace. The lesson: for a commitment to be credible, the cost of breaking it must be real and must exceed the benefit of betrayal. A hostage (literal or figurative — a reputation, a bond, a collateral) works only if the other side believes you truly value it.',
  analyze: (choice, aiChoice) => {
    if (choice === 'send_real') {
      return 'You sent a royal cousin. Your commitment is credible because King Aldric knows you value your family. If you break the treaty, you lose a relative. This is the essence of credible commitment: you voluntarily give up the option to betray by placing something valuable at risk. Historical examples: medieval kings exchanged sons as hostages; today we use escrow accounts, performance bonds, and marriage. The hostage (literal or figurative) transforms an empty promise into a binding commitment.';
    }
    if (choice === 'send_fake') {
      return 'You sent a commoner in disguise. King Aldric discovers the deception. Your reputation is shattered. Any future promise you make will be worthless — once you\'ve faked a hostage, no one will believe your commitments. This illustrates a critical point about signaling: faking works only if undetected, and the cost of exposure often exceeds the value of deception. In game theory terms, a non-credible commitment is worse than no commitment at all.';
    }
    return 'You refused the hostage exchange. No peace treaty is signed. Both kingdoms remain in cold war. Without a credible commitment mechanism, neither side trusts the other enough to disarm. This is the tragedy of commitment problems: both parties may genuinely want peace, but without a way to make promises stick, they remain locked in conflict. In real life, this is why treaties include enforcement mechanisms, why contracts require collateral, and why marriages involve public vows — all are credibility devices.';
  },
  agents: {
    aldric: { personality: 'trustBuilder', name: 'King Aldric' },
  },
});

scenarioRegistry.register({
  id: 'the-royal-surveyor',
  title: 'The Royal Surveyor',
  era: 2,
  order: 15,
  concept: 'adverseSelection',
  type: 'screening',
  setup: (state) => {
    state.player.resources.gold = 150;
  },
  story: [
    { speaker: 'Chamberlain', text: 'My lord, a dozen candidates have presented themselves for the position of Royal Surveyor. They all claim expertise in mapping, geology, and estate management.' },
    { speaker: 'Court Scholar', text: 'The problem: every candidate claims competence. The truly skilled have options and may not even apply. The incompetents have nothing to lose by lying.' },
    { speaker: 'Claimant Valerius', text: 'I am the best candidate. I have surveyed a hundred estates. Hire me and see for yourself.' },
  ],
  context: 'You need a Royal Surveyor to map your kingdom and assess land values. Many claim competence, but their true quality is unknown to you. This is adverse selection: the pool of applicants is disproportionately low-quality because the best candidates have better options elsewhere. You must design a screening mechanism to separate the competent from the claimants.',
  choices: [
    { id: 'written_test', label: 'Written Examination', description: 'Test all candidates on surveying knowledge, map reading, and geometry. Easy to administer, but tests book knowledge, not practical skill.', risk: 'medium', tags: ['medium'] },
    { id: 'reference_check', label: 'Reference Checks', description: 'Contact previous employers. Checks are cheap, but previous employers may lie to be rid of a bad worker.', risk: 'medium', tags: ['medium'] },
    { id: 'trial_period', label: 'Probationary Period', description: 'Hire the best candidate on a 3-month trial. Costly, but reveals true ability through actual work.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'oath_ceremony', label: 'Ceremonial Oath', description: 'Require all candidates to swear a binding oath to serve faithfully. Cheap talk — anyone can swear.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'A trial period is the most effective screen because it directly reveals competence through action. Written tests screen for knowledge but miss practical skill. Reference checks are unreliable (past employers may deceive). Oaths are pure cheap talk — they cost nothing and therefore convey no information. The key insight from adverse selection theory: for a screening mechanism to work, it must be costly or difficult for low-quality types to pass. This is why job interviews are multi-stage, why drivers have practical tests, and why professional certifications require demonstrated skill.',
  analyze: (choice) => {
    const insights = {
      written_test: 'The written test successfully screens for book knowledge. Three candidates scored well, but when you hire the top scorer, they struggle with practical surveying. They can recite geometry theorems but can\'t sight a level properly. This is the limitation of single-dimensional screening: it filters for what\'s easy to measure, not necessarily what matters. Real-world example: SAT scores predict college grades, not career success. Lessons for mechanism design: choose screening criteria that match the actual desired outcome, not just what\'s convenient to measure.',
      reference_check: 'Reference checks revealed little useful information. Past employers, eager to be rid of mediocre workers, gave glowing recommendations. The truly bad candidates were exposed, but you couldn\'t distinguish the good from the average. This illustrates a fundamental problem in adverse selection: information asymmetry goes both ways — the informed party (past employers) has their own strategic interests. Real-world parallel: why background checks are useful but insufficient, and why "reference inflation" is rampant in hiring.',
      trial_period: 'The trial period worked. In three months of actual work, the true quality of your chosen candidate became obvious. The competent surveyor produced accurate maps and sound assessments; the incompetent revealed themselves through errors and missed deadlines. This is the gold standard of screening: let actual performance reveal quality. It\'s costly (three months of salary before you know), but it\'s the most reliable mechanism. This is why probationary periods are standard in professional employment — they are the most effective solution to adverse selection in hiring.',
      oath_ceremony: 'Every candidate swore the oath. Every single one. The oath revealed nothing — it cost the candidates nothing to swear, so it provided no information about their true quality. This is the textbook definition of "cheap talk" in game theory: an action that costs nothing conveys no information. Real-world examples: promises by politicians, mission statements in corporate reports, "we value our customers" signs. The lesson: for a signal to be informative, it must be costly or risky for the low-quality type to send.',
    };
    return insights[choice] || 'Adverse selection means the pool of applicants is worse than the general population. The solution is screening: design a test that separates types by making it harder for low-quality candidates to pass.';
  },
  agents: {
    valerius: { personality: 'deceptive', name: 'Claimant Valerius' },
  },
});

scenarioRegistry.register({
  id: 'the-wedding-pact',
  title: 'The Wedding Pact',
  era: 2,
  order: 16,
  concept: 'credibleCommitment',
  type: 'wedding',
  setup: (state) => {
    state.player.resources.influence = 30;
    state.player.resources.gold = 400;
  },
  story: [
    { speaker: 'Duchess Elara', text: 'My house proposes a marriage between your eldest son and my daughter. Such an alliance would bind our families for generations.' },
    { speaker: 'Your Advisor', text: 'A marriage alliance makes peace credible, my lord. But the terms matter — a dowry is a bond, a hostage is a guarantee, and a simple promise is nothing.' },
    { speaker: 'Duchess Elara', text: 'I am prepared to offer a substantial dowry and my daughter\'s hand. What commitment do you bring to this union?' },
  ],
  context: 'A marriage alliance is proposed between your houses. Marriage is one of the oldest credible commitment devices — it creates shared descendants whose welfare depends on continued peace. But the depth of commitment varies: a dowry adds financial bond, offering a hostage adds a guarantee, and a simple promise is cheap talk.',
  choices: [
    { id: 'accept_dowry', label: 'Accept with Dowry', description: 'Accept the marriage with a substantial dowry from Duchess Elara. Her gold is at stake — if she breaks the alliance, she forfeits the dowry.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'accept_no_dowry', label: 'Accept Without Dowry', description: 'Accept the marriage on good faith alone. No financial commitment from either side.', risk: 'medium', tags: ['cooperate'] },
    { id: 'propose_hostage', label: 'Propose Mutual Hostage', description: 'Accept the marriage and exchange hostages as an additional guarantee. Maximum commitment from both sides.', risk: 'low', tags: ['cooperate'] },
    { id: 'refuse_marriage', label: 'Refuse the Alliance', description: 'Decline the marriage proposal. Maintain independence but forgo the alliance.', risk: 'medium', tags: ['defect', 'safe'] },
  ],
  idealNote: 'Accepting with mutual hostages creates the strongest credible commitment: both sides have skin in the game, and betrayal costs both parties dearly. A dowry alone commits only one side. No dowry is pure cheap talk — nothing is at stake. Refusing misses the opportunity entirely. The lesson: the strongest commitments are symmetric and involve both sides posting bonds that they forfeit if they betray.',
  analyze: (choice) => {
    const insights = {
      accept_dowry: 'The marriage proceeds with a dowry of 500 gold from Duchess Elara\'s house. The dowry is a bond: if Elara breaks the alliance, she forfeits the gold. This makes her commitment credible — she has something to lose. But your side has no equivalent bond. The commitment is asymmetric: Elara is bound, but you could theoretically betray without financial penalty. This is still a meaningful commitment (divorce was costly in reputation and family ties), but not as strong as mutual bonds. Real-world parallel: earnest money in real estate, security deposits, collateral loans.',
      accept_no_dowry: 'The marriage proceeds on promise alone. No gold changes hands. The wedding happens, but neither side has posted a bond. In game theory terms, this is a non-credible commitment — there is nothing preventing either side from betraying if it becomes advantageous. Marriage without a dowry or hostage is still a commitment (shared descendants create long-term aligned interests), but it\'s weaker. Real-world lesson: "I promise" is the weakest form of commitment. The most credible promises involve putting something valuable at risk.',
      propose_hostage: 'You propose mutual hostages in addition to the marriage. Both sides send a family member to the other\'s court. Now betrayal costs both parties dearly: break the alliance and your relative may be imprisoned or worse. This is symmetric, mutual credible commitment at its strongest. In game theory, this transforms the payoff structure: the benefit of betrayal is now outweighed by the certain cost of losing your hostage. This mirrors the logic behind escrow accounts, performance bonds, and international peacekeeping forces — neutral guarantors that make betrayal more costly than cooperation.',
      refuse_marriage: 'You refused the alliance. Duchess Elara is offended; relations cool. The opportunity for a lasting peace through family ties is lost. Refusing is sometimes strategically correct — you avoid being bound — but you also forgo the benefits of cooperation. This highlights a key insight about commitment: it\'s a double-edged sword. Commitment binds you, which is costly (you can\'t easily change your mind), but that binding is precisely what makes cooperation possible. Without the ability to commit, many valuable cooperative ventures cannot happen.',
    };
    return insights[choice] || 'Credible commitment is about making your promise believable by putting something valuable at risk. The more you risk, the more credible your promise.';
  },
  agents: {
    elara: { personality: 'longTermPlanner', name: 'Duchess Elara' },
  },
});

scenarioRegistry.register({
  id: 'the-siege',
  title: 'The Siege',
  era: 2,
  order: 17,
  concept: 'credibleCommitment',
  type: 'siege',
  setup: (state) => {
    state.player.resources.military = 200;
  },
  story: [
    { speaker: 'Lord Commander Vance', text: 'Our supplies last two more months. After that, we starve or surrender. The enemy offers terms: open the gates and they promise not to harm us.' },
    { speaker: 'Your Captain', text: 'They say they won\'t attack if we open the gates. But why should we believe them? Once the walls are open, we\'re helpless.' },
    { speaker: 'Enemy Herald', text: 'You have my lord\'s word. He is a man of honor. Open the gates and you will be treated fairly.' },
  ],
  context: 'Under siege, your fortress is weakening. The enemy promises safe passage if you surrender. But their promise is not credible — once your gates are open, they have no reason to keep their word. You need to find a way to make their commitment believable, or you must refuse.',
  choices: [
    { id: 'demand_hostage', label: 'Demand a Hostage', description: 'Demand the enemy general\'s son as a hostage before opening the gates. If they attack, their son dies.', risk: 'medium', tags: ['cooperate'] },
    { id: 'sign_treaty', label: 'Sign a Treaty', description: 'Negotiate a formal written treaty with terms and signatures. Better than nothing, but paper doesn\'t stop swords.', risk: 'high', tags: ['cooperate'] },
    { id: 'just_promise', label: 'Accept Their Promise', description: 'Trust their word of honor. Open the gates based on their promise alone.', risk: 'high', tags: ['high', 'defect'] },
    { id: 'hold_out', label: 'Refuse — Hold Out', description: 'Refuse to surrender. Continue the siege and hope for reinforcements or starvation.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'Demanding a hostage is the only path to a credible truce. A hostage transforms the enemy\'s promise from cheap talk into a binding commitment because the cost of betrayal (their son\'s life) now exceeds any benefit from attacking. A written treaty is better than nothing, but it lacks enforcement. A mere promise is worthless. Refusing means certain losses from continued siege. The lesson: a promise is only as credible as the penalty for breaking it.',
  analyze: (choice) => {
    const insights = {
      demand_hostage: 'You demand the enemy general\'s son as a hostage. They agree. Now their promise has teeth: if they attack after you open the gates, their son dies. You\'ve transformed their incentive structure — the cost of betrayal now exceeds the benefit. This is the essence of credible commitment: make breaking the promise more costly than keeping it. In the real world, this is why we use escrow accounts, performance bonds, and collateral. The hostage doesn\'t have to be a person — it can be money, reputation, or a valuable asset that the promising party puts at risk.',
      sign_treaty: 'You negotiate a formal treaty. Both sides sign. You open the gates. The enemy, seeing your vulnerability, decides that the treaty is just paper and attacks. Your city falls. A written agreement without enforcement is what game theorists call "non-binding communication" — it changes nothing about the underlying incentives. The enemy\'s incentive to attack (loot, strategic advantage) still outweighs their incentive to keep their word (honor, future reputation). Real-world lesson: treaties without enforcement mechanisms are often violated. The Treaty of Versailles (1919) imposed harsh terms on Germany but lacked credible enforcement — 20 years later, Europe was at war again.',
      just_promise: 'You trusted their word. They attacked as soon as the gates opened. You were betrayed. A promise that costs nothing to make and nothing to break is, in game theory terms, "cheap talk." It conveys no information because anyone — honest or dishonest — can make the same promise. The only reliable promises are those that involve a real commitment: something valuable is put at risk that will be lost if the promise is broken. Real-world example: "I promise to repay you" is cheap talk unless I put up collateral or sign a legally enforceable contract.',
      hold_out: 'You refused to surrender. The siege continues. Two months later, with no reinforcements, your garrison surrenders on worse terms — unconditional surrender. Refusing was your safest option given the lack of credible enemy commitment, but it was also the costliest in the long run. This illustrates a tragic dynamic: when commitments aren\'t credible, mutually beneficial agreements fail. Both sides would prefer a peaceful surrender with safe passage, but without credible commitment, the only equilibrium is continued conflict until one side is destroyed.',
    };
    return insights[choice] || 'Credible commitment is the art of making promises believable. The key insight: a promise is only as credible as the cost of breaking it.';
  },
  agents: {
    vance: { personality: 'trustBuilder', name: 'Lord Commander Vance' },
  },
});

scenarioRegistry.register({
  id: 'the-guild-apprentice',
  title: 'The Guild Apprentice',
  era: 2,
  order: 18,
  concept: 'moralHazard',
  type: 'apprentice',
  setup: (state) => {
    state.player.resources.gold = 200;
    state.player.resources.population = 50;
  },
  story: [
    { speaker: 'Master Armorer', text: 'Young Tycho shows great promise. He learns faster than any apprentice I\'ve trained. In three years, he could be a master smith himself.' },
    { speaker: 'Young Tycho', text: 'I\'m grateful for the training, Master. But once I\'m skilled, other guilds will pay well for my talents. What keeps me here?' },
    { speaker: 'Master Armorer', text: 'That\'s the problem, my lord. I spend years training him, and when he\'s most valuable, he leaves for a better offer. I bear all the cost of training; he reaps the benefit.' },
  ],
  context: 'You run a guild that trains apprentices. Training is costly (materials, master\'s time, spoiled work), but trained artisans are highly productive. The problem: once trained, the apprentice may leave for a competitor. You bear the cost of training; they capture the benefit. This combines moral hazard (the apprentice\'s effort during training is unobservable) with the principal-agent problem (the apprentice\'s post-training loyalty is not guaranteed).',
  choices: [
    { id: 'long_contract', label: 'Long Indenture Contract', description: 'Require a 10-year contract. The apprentice is legally bound to stay after training. Enforceable but may discourage the best candidates from applying.', risk: 'medium', tags: ['cooperate'] },
    { id: 'profit_share', label: 'Profit-Sharing Partnership', description: 'Offer a share of future workshop profits. The apprentice stays because their income depends on the workshop\'s success.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'loyalty_bonus', label: 'Loyalty Bonus', description: 'Pay a large bonus after 5 years of service. A golden handcuff — the bonus makes leaving costly.', risk: 'medium', tags: ['cooperate'] },
    { id: 'no_contract', label: 'Gentleman\'s Agreement', description: 'Train them on a handshake. Trust that they\'ll stay out of gratitude and loyalty.', risk: 'high', tags: ['high', 'defect'] },
  ],
  idealNote: 'Profit-sharing is the best long-term solution because it aligns the apprentice\'s ongoing incentive with yours — they stay because staying is profitable. A loyalty bonus is also effective (the "golden handcuff" approach). Long contracts can work but screen out the best candidates. A gentleman\'s agreement is almost certain to fail — gratitude is weak against a better salary offer. The lesson: solve moral hazard by aligning post-training incentives, not by relying on loyalty or legal coercion.',
  analyze: (choice) => {
    const insights = {
      long_contract: 'The 10-year contract keeps Tycho bound — legally, at least. He stays for the full term, but his resentment grows. He does the minimum required, never innovates, and leaves the day the contract expires. The contract solved the retention problem but created a new one: you can force compliance, not effort. This is the distinction between "effort" and "performance" in contract theory. A legal commitment ensures they show up; it doesn\'t ensure they care. Real-world parallels: indentured servitude, non-compete clauses, minimum employment periods. They bind the body but not the spirit.',
      profit_share: 'You offer Tycho a 10% share of workshop profits. Now his income depends on the workshop\'s success. He works harder, stays longer, and even contributes ideas to improve efficiency. This is the ideal solution: you\'ve aligned his incentives with yours without needing monitoring or enforcement. When the agent\'s reward matches the principal\'s success, the agent behaves like a principal. This is why partnerships, employee stock ownership, and profit-sharing plans exist — they transform agents into co-owners. The solution to the principal-agent problem is to make the agent a partial principal.',
      loyalty_bonus: 'The loyalty bonus of 500 gold after 5 years works like "golden handcuffs." The bonus is large enough that leaving before year 5 would be foolish. This defection is economically rational — the apprentice stays. But unlike profit-sharing, the bonus doesn\'t create ongoing incentive to work hard. It solves retention but not effort. This is a common real-world approach: deferred compensation, stock vesting schedules, retention bonuses. They work because they make leaving costly, but they work imperfectly because they don\'t align day-to-day incentives.',
      no_contract: 'You trained Tycho on a handshake and trust. A competitor offered him 50% more the day after his training ended. He left. Your investment is lost. This is the tragedy of relying on goodwill in a competitive market. In game theory, gratitude is a weak force against a large payoff difference. The competitor offers +5; your relationship is worth maybe +1. Rational actors (especially opportunists) go where the payoff is higher. Real-world lesson: never rely on loyalty alone to solve structural incentive problems. Contracts, bonds, and aligned incentives are more reliable than trust.',
    };
    return insights[choice] || 'The principal-agent problem and moral hazard combine here: the apprentice\'s effort during training is unobservable, and their post-training loyalty is unenforceable without costly mechanisms. The best solutions align incentives rather than try to enforce compliance.';
  },
  agents: {
    tycho: { personality: 'opportunist', name: 'Young Tycho' },
  },
});

scenarioRegistry.register({
  id: 'the-nobles-debt',
  title: 'The Noble\'s Debt',
  era: 2,
  order: 19,
  concept: 'grimTrigger',
  type: 'debt',
  multiRound: true,
  totalRounds: 5,
  setup: (state) => {
    state.player.resources.gold = 300;
  },
  story: [
    { speaker: 'Baron Marius', text: 'I owe your house 500 gold from the war loan. I cannot pay it all at once, but I will repay in good faith over time.' },
    { speaker: 'Your Treasurer', text: 'Baron Marius is honorable — as long as we treat him well. But if we demand immediate payment or add punitive terms, he may simply stop paying altogether.' },
    { speaker: 'Baron Marius', text: 'I am a man of my word. But I am also a proud man. Treat me with respect and I will honor my debt. Humiliate me and you\'ll never see a single coin.' },
  ],
  context: 'Baron Marius owes you 500 gold from a wartime loan. Each season, you decide how to approach him about repayment. Marius plays Grim Trigger: he will cooperate (make a payment) as long as you treat him with respect, but if you ever demand aggressively, he will refuse to pay ever again.',
  choices: [
    { id: 'honor', label: 'Kind Reminder', description: 'Politely remind him of the debt. Ask if he can make a payment. Respectful approach.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'fair', label: 'Restructure the Debt', description: 'Offer a formal restructured payment plan with lower installments. Cooperative restructuring.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'betray', label: 'Demand Immediate Payment', description: 'Send enforcers. Demand the full 500 gold now or face consequences. Aggressive approach.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'The optimal strategy is to be respectful every round — either kind reminders or restructuring. Baron Marius (Grim Trigger) will pay as long as you never demand aggressively. With 5 rounds of cooperation, you collect the full 500 gold. A single aggressive demand ends all future payments. This is the same logic as scenario 11 (The Trade Route Returns): in repeated interactions with a Grim Trigger counterpart, the value of sustained cooperation outweighs any one-time gain from aggression.',
  analyze: (_choice, _aiChoice, history) => {
    const hist = history || [];
    const total = hist.length;
    if (total === 0) return 'Play through all rounds to see the full analysis.';
    const demanded = hist.filter(r => r.playerChoice === 'betray').length;
    const firstDemand = hist.findIndex(r => r.playerChoice === 'betray');
    const payments = hist.filter(r => {
      const ac = Object.values(r.aiChoices || {})[0];
      return ac === 'honor';
    }).length;
    if (demanded === 0) {
      return `You were respectful in all ${total} rounds. Baron Marius made a payment each round. You recovered the full debt. This is the ideal outcome with a Grim Trigger debtor: mutual respect leads to sustained cooperation. The key insight: the threat of permanent retaliation (Grim Trigger) actually makes cooperation MORE stable, not less, because both parties know that a single aggressive act destroys everything. In the real world, this is why long-term lending relationships work — neither borrower nor lender wants to trigger the collapse of trust.`;
    }
    if (firstDemand === 0) {
      return `You demanded payment immediately. Baron Marius refused to pay from round 1 onward. You collected nothing. This is Grim Trigger triggered instantly: aggression met with permanent non-cooperation. The lesson: if you deal harshly with a Grim Trigger opponent, you lose all future benefits. You collected 0 instead of a possible 500. Real-world parallel: aggressive debt collection often results in the debtor simply refusing to pay anything, leaving both parties worse off.`;
    }
    return `You were respectful for ${firstDemand} rounds (receiving ${firstDemand} payments), then demanded aggressively in round ${firstDemand + 1}. Baron Marius stopped paying immediately and never resumed. You collected payments for ${firstDemand} rounds then nothing. The ${firstDemand} payments you received are better than nothing, but you lost all remaining payments. This is the tragedy of Grim Trigger systems: they maintain perfect cooperation until one violation, then collapse permanently. In the real world, this is why successful long-term relationships — whether marriages, business partnerships, or international treaties — include forgiveness mechanisms alongside enforcement. Pure Grim Trigger is powerful but brittle.`;
  },
  agents: {
    marius: { personality: 'grimTrigger', name: 'Baron Marius' },
  },
});

scenarioRegistry.register({
  id: 'the-tournament-of-strategies',
  title: 'The Tournament of Strategies',
  era: 2,
  order: 20,
  concept: 'repeatedGames',
  type: 'tournament',
  setup: (state) => {
    state.player.resources.gold = 100;
  },
  story: [
    { speaker: 'Grand Tournament Master', text: 'Welcome to the Grand Tournament of Strategies! Five of the realm\'s finest minds have submitted their approaches to repeated negotiation. Your strategy will play 10 rounds against each of them.' },
    { speaker: 'Herald', text: 'The contestants: the Trusting Fool (Always Cooperate), the Ruthless Lord (Always Defect), the Mirror Knight (Tit-for-Tat), the Unforgiving Judge (Grim Trigger), and the Mad Duke (Random).' },
    { speaker: 'Grand Master', text: 'Choose your champion\'s strategy carefully. Each approach has strengths and weaknesses depending on who you face.' },
  ],
  context: 'You submit a strategy that will play 10 rounds against each of five AI personalities. Each AI represents a classic repeated-game strategy. Your goal is to maximize total payoff across all five matches.',
  choices: [
    { id: 'always_cooperate', label: 'Always Cooperate (Nice)', description: 'Cooperate every single round, no matter what. The "turn the other cheek" approach.', risk: 'high', tags: ['cooperate'] },
    { id: 'always_defect', label: 'Always Defect (Ruthless)', description: 'Betray every single round. Maximum short-term gain, zero trust.', risk: 'high', tags: ['defect'] },
    { id: 'tit_for_tat', label: 'Tit-for-Tat (Reciprocal)', description: 'Start cooperative, then mirror your opponent\'s last move. Balanced and proven.', risk: 'medium', tags: ['cooperate'] },
    { id: 'grim_trigger', label: 'Grim Trigger (Unforgiving)', description: 'Cooperate until the opponent defects once, then defect forever. Harsh but stable.', risk: 'medium', tags: ['cooperate'] },
    { id: 'random', label: 'Random (Chaotic)', description: 'Flip a coin each round. Unpredictable but strategically incoherent.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'Tit-for-Tat is the optimal all-around strategy, as proven in Robert Axelrod\'s famous computer tournaments. It wins against Always Cooperate (exploits them never? No — TFT cooperates with them for mutual gain), ties with Tit-for-Tat (mutual cooperation), nearly ties with Grim Trigger (mutual cooperation until endgame), does well against Random, and limits losses against Always Defect (defects after first betrayal). Always Defect wins individual rounds but loses relationships. Always Cooperate gets exploited. Grim Trigger is too brittle. Random has no consistent logic. Tit-for-Tat is nice, provokable, forgiving, and clear — the four properties of a winning repeated-game strategy.',
  analyze: (choice) => {
    const results = {
      always_cooperate: 'Your Always Cooperate strategy played against all five opponents over 10 rounds each.\n\n' +
        'vs Always Cooperate: Mutual cooperation every round. +30 total. Best case.\n' +
        'vs Always Defect: You cooperated; they defected every round. You got +0, they got +50. Worst case — you were the "sucker" every round.\n' +
        'vs Tit-for-Tat: Mutual cooperation every round. +30 total. Perfect harmony.\n' +
        'vs Grim Trigger: Mutual cooperation every round. +30 total. Stable.\n' +
        'vs Random: Mixed results — about 50% mutual cooperation, 50% you got exploited. ~+15 total.\n\n' +
        'Total: ~105 points. Analysis: Always Cooperate is "nice" but naive. It does well against other cooperators but is brutally exploited by defectors. In a mixed population, it\'s a loser. Axelrod\'s tournaments showed unconditional cooperators get wiped out by defectors. Lesson: cooperation needs defense against exploitation.',
      always_defect: 'Your Always Defect strategy played against all five opponents over 10 rounds each.\n\n' +
        'vs Always Cooperate: You defected; they cooperated every round. You got +50, they got +0. Maximum exploitation.\n' +
        'vs Always Defect: Mutual defection every round. +10 total. Both lose.\n' +
        'vs Tit-for-Tat: Round 1 you defected; they cooperated. You got +5. From round 2 onward, TFT defected back. You got +1 for rounds 2-10 (mutual defect). Total: +14.\n' +
        'vs Grim Trigger: Round 1 you defected; they cooperated. You got +5. From round 2 onward, Grim Trigger defected forever. You got +1 for rounds 2-10. Total: +14.\n' +
        'vs Random: About 50% chance they defect. ~+25 total.\n\n' +
        'Total: ~113 points. Analysis: Always Defect does well against cooperators but starts conflicts it can\'t escape. Against reciprocal strategies (TFT, Grim Trigger), it creates a permanent feud. It "wins" individual interactions but creates a world of universal defection. In Axelrod\'s tournaments, Always Defect did moderately well but was beaten by nicer strategies that could sustain mutual cooperation.',
      tit_for_tat: 'Your Tit-for-Tat strategy played against all five opponents over 10 rounds each.\n\n' +
        'vs Always Cooperate: Mutual cooperation every round. +30 total. Perfect.\n' +
        'vs Always Defect: Round 1 you cooperated (they defected: you got 0). Round 2-10 you mirrored their defection. Total: 0 + 9 = +9. Better than Always Cooperate (which got 0), worse than Always Defect in this matchup.\n' +
        'vs Tit-for-Tat (self): Mutual cooperation every round. +30 total. Harmony.\n' +
        'vs Grim Trigger: Mutual cooperation every round. +30 total. Stability.\n' +
        'vs Random: Mixed. ~+18 total (cooperate first, then mirror).\n\n' +
        'Total: ~117 points. This strategy — start nice, then reciprocate — won Axelrod\'s tournaments because it maximizes cooperation with other cooperators while protecting itself from defectors. Its four properties: 1) Nice (never defects first), 2) Provokable (immediately punishes defection), 3) Forgiving (resumes cooperation when they do), 4) Clear (predictable pattern others can adapt to). This is why Tit-for-Tat is the single best all-around strategy for repeated interactions.',
      grim_trigger: 'Your Grim Trigger strategy played against all five opponents over 10 rounds each.\n\n' +
        'vs Always Cooperate: Mutual cooperation every round. +30 total. Perfect.\n' +
        'vs Always Defect: Round 1 they defected on your cooperation: you got 0. You triggered: defected rounds 2-10. Total: 0 + 9 = +9. Same as TFT.\n' +
        'vs Tit-for-Tat: Mutual cooperation every round. +30 total. Stable.\n' +
        'vs Grim Trigger (self): Mutual cooperation every round. +30 total. Stable.\n' +
        'vs Random: If Random defects even once, you defect forever. With 10 rounds, Random likely defects at least once. ~+12 total.\n\n' +
        'Total: ~111 points. Grim Trigger performs nearly as well as TFT against cooperators, but worse against Random (which might defect accidentally). Its weakness is brittleness: one mistake or miscommunication triggers permanent war. In real tournaments, Grim Trigger does well in perfect information but poorly when there\'s noise or error. Lesson: the best strategies include forgiveness, because in the real world, mistakes happen.',
      random: 'Your Random strategy played against all five opponents over 10 rounds each.\n\n' +
        'vs Always Cooperate: You cooperate ~50% of rounds, defect ~50%. Each coop round: +3. Each defect round: +5. Expected: ~+40 total.\n' +
        'vs Always Defect: You cooperate ~50%, defect ~50%. Coop when they defect: you get 0. Both defect: +1. Expected: ~+5 total.\n' +
        'vs Tit-for-Tat: TFT mirrors your last move. If you\'re random, TFT becomes chaotic too. Expected: ~+15 total.\n' +
        'vs Grim Trigger: First time you defect, Grim Trigger locks into permanent defection. After that, mutual defection. Expected: ~+8 total.\n' +
        'vs Random: Mirror match. Both random. Expected: ~+15 total.\n\n' +
        'Total: ~83 points. Random is the worst-performing strategy. It cannot sustain cooperation (because it randomly defects, triggering retaliation) but also can\'t consistently exploit (because it randomly cooperates). It lacks any strategic signal. Lesson: randomness is not a strategy. Even imperfect but principled approaches (like TFT) outperform pure chaos because they send a signal that others can adapt to.',
    };
    return results[choice] || 'The tournament demonstrates a profound insight: in repeated games, the best strategies are nice (start cooperative), provokable (punish defection), forgiving (resume cooperation), and clear (predictable). This is why Tit-for-Tat dominated Axelrod\'s tournaments.';
  },
  agents: {},
});

