import { scenarioRegistry } from './registry.js';

// ============================================================
// ERA III: Uncertainty & Information (Scenarios 21–30)
// Bayesian games, signaling, adverse selection, chicken,
// coordination under incomplete information.
// ============================================================

scenarioRegistry.register({
  id: 'the-hidden-army',
  title: 'The Hidden Army',
  era: 3,
  order: 21,
  concept: 'bayesianGames',
  type: 'hidden_army',
  setup: (state) => {
    state.player.resources.military = 150;
    state.player.resources.gold = 200;
  },
  story: [
    { speaker: 'Scout Captain', text: 'My lord, our scouts report movement beyond the Grey Mountains. General Varn\'s army may be massing — or it may be a trading caravan. Our intel is incomplete.' },
    { speaker: 'Spymaster', text: 'We know two things: if his army is strong, he will attack us. If it is weak, he will negotiate. But our scouts could be wrong — they\'ve misread signs before.' },
    { speaker: 'General Varn\'s Envoy (?)', text: 'We come in peace. But we also come prepared. The choice is yours.' },
  ],
  context: 'Your scouts report that General Varn may have a large army hidden beyond the mountains. But the reports are imperfect: a strong army looks like a weak one 30% of the time to your scouts. You must decide: attack (risky if he\'s strong), negotiate (safe but weak if he\'s strong), or fortify (defensive, costs gold). This is a Bayesian game — you must act based on probabilistic beliefs about Varn\'s hidden type.',
  choices: [
    { id: 'attack', label: 'Preemptive Attack', description: 'Strike first before his army crosses the mountains. High reward if he\'s weak, disaster if he\'s strong.', risk: 'high', tags: ['high'] },
    { id: 'negotiate', label: 'Send Negotiators', description: 'Open diplomatic channels. Safe if he\'s weak, dangerous if he\'s strong (he attacks while you talk).', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'fortify', label: 'Fortify the Pass', description: 'Spend 100 gold to strengthen defenses. Protects against attack regardless of his strength.', risk: 'low', tags: ['safe'] },
  ],
  idealNote: 'Fortifying is the safest move given uncertainty — it works well regardless of Varn\'s type. Attacking is only optimal if you\'re very confident he\'s weak. Negotiating is optimal only if you\'re very confident he\'s peaceful. The Bayesian approach: assign prior probabilities (say 50% strong, 50% weak), update based on scout reports (which have known error rates), then choose the action with the highest expected payoff. This is the essence of Bayesian games: decision-making under probabilistic uncertainty about others\' types.',
  analyze: (choice, aiChoice) => {
    const payoffTable = 'Payoffs based on Varn\'s true type:\n' +
      '  If Varn is STRONG: Attack = defeat (-5), Negotiate = vulnerable (-2), Fortify = safe (+1)\n' +
      '  If Varn is WEAK: Attack = victory (+5), Negotiate = peace (+3), Fortify = costly but safe (0)\n' +
      'Scout accuracy: 70% correct, 30% wrong.';

    if (choice === 'attack') {
      return 'You attacked. If Varn\'s army was weak, brilliant victory! If he was strong, catastrophe. The Bayesian question: was your prior belief about his strength strong enough to justify this gamble? Even with 70%-accurate scouts, if the prior chance of a strong army is high, attacking is still a bad bet. This teaches a core Bayesian lesson: always incorporate both the prior and the evidence, weighing each by its reliability. ' + payoffTable;
    }
    if (choice === 'negotiate') {
      return 'You sent negotiators. If Varn was weak, peace is secured. If he was strong, your delegation was captured and he now knows your weakness. The risk of negotiating under uncertainty is that your action reveals information about your own beliefs (and thus your weakness). In Bayesian games, your choice signals something about your type. A strong player might attack; a weak one might negotiate. Varn updates his beliefs about you based on your choice. ' + payoffTable;
    }
    return 'You fortified the pass. The 100 gold cost is insurance: regardless of Varn\'s true strength, your position is secure. This is the "maximin" approach — maximize the minimum possible payoff. When uncertainty is high and the downside of being wrong is severe, the safe choice is optimal. This is analogous to buying insurance: you pay a premium to eliminate downside risk, even if the expected value is negative. ' + payoffTable;
  },
  customResolve: (playerChoice) => {
    const varnIsStrong = Math.random() < 0.5;

    const scoutCorrect = Math.random() < 0.7;
    const scoutSays = scoutCorrect ? (varnIsStrong ? 'strong' : 'weak') : (varnIsStrong ? 'weak' : 'strong');

    let outcome, score, narrative, resourceChanges;

    if (playerChoice === 'attack') {
      if (varnIsStrong) {
        outcome = 'defeat'; score = 1;
        narrative = `Your scouts reported Varn as ${scoutSays}, but he was strong. Your preemptive attack was crushed.`;
        resourceChanges = { military: -80, gold: -50 };
      } else {
        outcome = 'victory'; score = 9;
        narrative = `Your scouts reported Varn as ${scoutSays}. You struck fast — his weak army crumbled.`;
        resourceChanges = { military: 30, gold: 100, influence: 20 };
      }
    } else if (playerChoice === 'negotiate') {
      if (varnIsStrong) {
        outcome = 'defeat'; score = 2;
        narrative = `Your scouts reported Varn as ${scoutSays}, but he was strong. While you talked, his army crossed the mountains.`;
        resourceChanges = { military: -30, gold: -50, reputation: -15 };
      } else {
        outcome = 'victory'; score = 7;
        narrative = `Your scouts reported Varn as ${scoutSays}. Both sides sent negotiators — peace secured.`;
        resourceChanges = { gold: -20, influence: 25, reputation: 10 };
      }
    } else {
      if (varnIsStrong) {
        outcome = 'mixed'; score = 5;
        narrative = `Your scouts reported Varn as ${scoutSays}. You fortified — his strong army could not break through.`;
        resourceChanges = { gold: -100, military: 10 };
      } else {
        outcome = 'mixed'; score = 4;
        narrative = `Your scouts reported Varn as ${scoutSays}. You fortified against a weak army that never intended to attack. Safe, but costly.`;
        resourceChanges = { gold: -100 };
      }
    }

    return { outcome, score, narrative, resourceChanges, relationshipChanges: {} };
  },
  agents: {
    varn: { personality: 'deceptive', name: 'General Varn' },
  },
});

scenarioRegistry.register({
  id: 'the-peacocks-tail',
  title: 'The Peacock\'s Tail',
  era: 3,
  order: 22,
  concept: 'signaling',
  type: 'signaling',
  setup: (state) => {
    state.player.resources.gold = 300;
  },
  story: [
    { speaker: 'Merchant Zephyr', text: 'I represent a trading consortium of immense wealth. We seek a royal charter to establish a trade monopoly in the eastern provinces.' },
    { speaker: 'Your Advisor', text: 'Every merchant claims wealth, my lord. If they truly have gold, they can afford to prove it. If they\'re destitute adventurers, they can only make promises.' },
    { speaker: 'Merchant Zephyr', text: 'I can offer you gifts, of course. A token of my consortium\'s esteem. Or something more... substantial.' },
  ],
  context: 'A merchant seeks a royal charter worth 1,000 gold in profit. They claim to be wealthy. You must decide whether to believe them. The key: wealthy merchants can afford costly signals (gifts worth 200 gold). Poor merchants cannot — they\'d be ruined by the expense. This is the "costly signaling" mechanism: a signal only works if it\'s too expensive for low-quality types to fake.',
  choices: [
    { id: 'demand_costly', label: 'Demand an Expensive Gift', description: 'Insist on a 200-gold gift as proof of wealth. Only genuinely wealthy merchants can afford this.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'accept_cheap', label: 'Accept a Token Gift', description: 'Accept a symbolic gift worth 10 gold. Anyone can afford this — it reveals nothing.', risk: 'high', tags: ['high', 'defect'] },
    { id: 'demand_nothing', label: 'No Gift Needed', description: 'Take them at their word. No gift, no proof, pure faith.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'Demanding an expensive gift is the optimal screening mechanism. In signaling theory (Spence, 1973), a signal is informative only if it is costly enough that low-quality types cannot afford to send it. A 200-gold gift is affordable to a wealthy merchant but ruinous to a poor one. A 10-gold gift is affordable to both — it reveals nothing. No gift reveals nothing. This is why peacocks have heavy tails (only healthy males can carry them), why luxury brands burn money on advertising (only profitable companies can afford it), and why expensive weddings signal commitment (only serious couples pay).',
  analyze: (choice) => {
    if (choice === 'demand_costly') {
      return 'You demanded a 200-gold gift. The wealthy merchant pays it easily and the charter is granted. The poor merchant cannot pay — they reveal their true type by being unable to afford the signal. This is a "separating equilibrium": the signal (expensive gift) perfectly separates high-type from low-type. The key insight of signaling theory: for a signal to work, it must be costlier for low-quality types than for high-quality types. Real-world applications: college degrees (harder for low-ability students), warranties (costlier for low-quality products), IPO underwriting (reputational cost for low-quality firms). This is why the peacock\'s tail proves genetic fitness — it\'s heavy, expensive, and only the fittest can afford to carry it.';
    }
    if (choice === 'accept_cheap') {
      return 'You accepted a 10-gold token gift. Both the wealthy merchant (who could afford 200) and the poor adventurer (who can barely afford 10) can send this signal. The signal conveys NO information — it doesn\'t separate the types. In signaling theory, this is a "pooling equilibrium": both types send the same signal, so you learn nothing. The result: you may have granted a charter to an imposter. Real-world example: nice business cards, a professional website, and a suit — anyone can have these, so they don\'t signal real financial substance. Lesson: cheap talk is cheap precisely because it costs the same for everyone. Information is revealed only by differential cost.';
    }
    return 'You accepted a pure promise with no gift required. Every merchant — wealthy and destitute alike — makes the same claims. You\'ve learned nothing. This is the ultimate "pooling equilibrium": all types say the same thing because saying it costs nothing. In the worst case, you grant the charter to an imposter who has no wealth, no trade network, and no ability to deliver. Real-world parallel: interview candidates who all claim to be "hardworking and passionate" — since everyone says it, it conveys nothing. The lesson: if a signal costs nothing to send, it conveys no information. Information is revealed through costly actions, not cheap words.';
  },
  customResolve: (playerChoice) => {
    const merchantWealthy = Math.random() < 0.5;
    switch (playerChoice) {
      case 'demand_costly':
        if (merchantWealthy) {
          return { outcome: 'victory', score: 8, narrative: 'The wealthy merchant pays the 200-gold gift without hesitation. The charter is granted to a genuinely wealthy partner.', resourceChanges: { gold: -200, influence: 30 }, relationshipChanges: {} };
        }
        return { outcome: 'mixed', score: 4, narrative: 'The merchant cannot afford the 200-gold gift. You have successfully screened out an imposter. No charter granted, but no harm done.', resourceChanges: {}, relationshipChanges: {} };
      case 'accept_cheap':
        return { outcome: 'defeat', score: 2, narrative: 'The token gift reveals nothing. You may have granted a charter to an imposter with no real wealth.', resourceChanges: { gold: 10, reputation: -10 }, relationshipChanges: {} };
      default:
        return { outcome: 'defeat', score: 1, narrative: 'You accepted a pure promise with no proof. Every claimant says the same thing. You likely granted a charter to an imposter.', resourceChanges: { gold: -50, reputation: -15 }, relationshipChanges: {} };
    }
  },
  agents: {
    zephyr: { personality: 'deceptive', name: 'Merchant Zephyr' },
  },
});

scenarioRegistry.register({
  id: 'the-job-interview',
  title: 'The Job Interview',
  era: 3,
  order: 23,
  concept: 'signaling',
  type: 'hiring',
  setup: (state) => {
    state.player.resources.gold = 200;
  },
  story: [
    { speaker: 'Chamberlain', text: 'Twenty candidates seek the position of Royal Architect. Some are master builders. Others can barely read a blueprint.' },
    { speaker: 'Candidate Mira', text: 'I designed the Aqueducts of Westport. I can do the same for your capital. Trust me.' },
    { speaker: 'Chamberlain', text: 'They all say they\'re qualified, my lord. We need a way to tell the true masters from the pretenders.' },
  ],
  context: 'You need a Royal Architect to design your new capital\'s infrastructure. Self-proclaimed experts are plentiful; genuine talent is rare. This is an adverse selection problem: you must design a hiring process (a screening mechanism) that separates competent from incompetent candidates. For a screening mechanism to work, it must be harder for low-ability types to pass.',
  choices: [
    { id: 'easy_test', label: 'Easy Aptitude Test', description: 'A basic test of architectural knowledge. Everyone passes — it reveals nothing.', risk: 'high', tags: ['high', 'defect'] },
    { id: 'hard_test', label: 'Rigorous Design Challenge', description: 'A full day of complex design problems. Only true masters pass; pretenders are exposed.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'interview', label: 'Personal Interview', description: 'A conversation about their experience and philosophy. Reveals confidence, not competence.', risk: 'high', tags: ['high'] },
    { id: 'probation', label: 'Probationary Project', description: 'Hire on a trial basis with a small real project. Actual work reveals actual ability.', risk: 'medium', tags: ['cooperate', 'medium'] },
  ],
  idealNote: 'The rigorous design challenge is the best screening tool: it\'s hard for incompetents to fake and directly tests relevant skills. Probation is also effective but costly (you pay salary before knowing). The easy test and interview both fail because they don\'t separate types — both competent and incompetent candidates pass them easily. The insight from signaling/screening theory: the screening mechanism must impose differential costs on different types — harder for low-quality, manageable for high-quality.',
  analyze: (choice) => {
    const insights = {
      easy_test: 'The easy test was passed by all 20 candidates. It revealed nothing. You hired someone based on a "perfect score" that everyone achieved, only to discover they can\'t design a load-bearing wall. The easy test failed to separate types — it was a "pooling" screen that everybody passed. This is a classic screening failure: if the test is too easy, it provides no information about candidate quality. Real-world parallel: multiple-choice tests where everyone guesses the right answer, or reference letters where every former employer says "they were great." The lesson: screens only work if they\'re hard enough to be informative.',
      hard_test: 'The rigorous design challenge separated the candidates perfectly. Three candidates produced elegant, structurally sound designs. The other seventeen revealed their incompetence through impossible arches and unsupported spans. You hired the best — a true master architect. This is a "separating" screening mechanism: it imposes a cost (effort, knowledge, skill) that low-ability types cannot bear. Real-world examples: the bar exam for lawyers, board certification for doctors, auditioning for musicians. The key: the test must directly test the relevant ability, and it must be difficult enough that only the truly qualified can pass.',
      interview: 'The interview was pleasant but uninformative. Every candidate spoke confidently about their "passion for architecture." Confidence and competence are almost uncorrelated in interviews — research shows interviews are one of the worst predictors of job performance. Both competent and incompetent candidates perform equally well in conversation. This is a classic "pooling" outcome: all types send the same signal (confidence), so no information is revealed. Real-world lesson: job interviews primarily reveal social skills, not job competence. That\'s why modern hiring increasingly uses work-sample tests and structured assessments.',
      probation: 'The probationary period worked. By the end of the first month, the incompetents had produced unusable designs, while the true architect produced excellent work. Probation is costly (you paid salary to everyone for a month) but it is the most reliable screen because it directly observes productive output. This is the "gold standard" of screening: let actual work reveal actual ability. The cost is the payment to the unproductive workers during the trial. In signaling theory: the probation period is a "counter-signal" — instead of making the candidate send a costly signal, you (the principal) bear a cost to reveal their type.',
    };
    return insights[choice] || 'Screening is the art of designing a test that separates types. The key: the test must impose a cost that low-quality types cannot afford to pay, whether that cost is effort, time, money, or demonstrated skill.';
  },
  customResolve: (playerChoice) => {
    switch (playerChoice) {
      case 'hard_test':
        return { outcome: 'victory', score: 8, narrative: 'The rigorous design challenge separated the candidates. You hired a true master architect.', resourceChanges: { gold: -50, influence: 30 }, relationshipChanges: {} };
      case 'probation':
        return { outcome: 'victory', score: 7, narrative: 'The probationary period worked. Actual work revealed the true architect. Costly but reliable.', resourceChanges: { gold: -100, influence: 25 }, relationshipChanges: {} };
      case 'easy_test':
        return { outcome: 'defeat', score: 2, narrative: 'The easy test revealed nothing. You hired an incompetent who cannot design a load-bearing wall.', resourceChanges: { gold: -80, reputation: -10 }, relationshipChanges: {} };
      default:
        return { outcome: 'defeat', score: 3, narrative: 'The interview was pleasant but uninformative. Confidence is not competence. You hired poorly.', resourceChanges: { gold: -30, reputation: -5 }, relationshipChanges: {} };
    }
  },
  agents: {
    mira: { personality: 'deceptive', name: 'Candidate Mira' },
  },
});

scenarioRegistry.register({
  id: 'the-bridge-standoff',
  title: 'The Bridge Standoff',
  era: 3,
  order: 24,
  concept: 'chicken',
  type: 'chicken',
  setup: (state) => {
    state.player.resources.military = 100;
    state.player.resources.influence = 50;
  },
  story: [
    { speaker: 'Warlord Kael', text: 'The Stone Bridge is the only crossing for a hundred miles. I will cross it. The question is whether you will be on it when I do.' },
    { speaker: 'Your General', text: 'If we both march onto the bridge, we fight. If one of us backs down, that side loses face but lives to fight another day.' },
    { speaker: 'Warlord Kael', text: 'I am Kael. I do not back down. But maybe — maybe — you are different.' },
  ],
  context: 'Two armies approach the Stone Bridge from opposite sides. Each must decide: advance onto the bridge or retreat. If both advance, catastrophic battle. If one retreats, the other wins glory but no blood is shed. If both retreat, both lose face but survive. This is the classic game of Chicken: the winner is the one who convinces the other they will NOT swerve.',
  choices: [
    { id: 'retreat', label: 'Retreat (Swerve)', description: 'Pull your army back. Safe but shameful. Kael crosses unopposed.', risk: 'low', tags: ['safe'] },
    { id: 'advance', label: 'Hold Position (Don\'t Swerve)', description: 'March onto the bridge. If Kael also advances, catastrophic battle. If he retreats, you win.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'Against a risk-seeking opponent like Kael, the optimal move is to advance — but only if you can make your commitment credible. Kael (risk-seeking) will likely advance too, creating a 50% chance of catastrophe. The game theory insight: the way to win Chicken is to "remove your steering wheel" — convince your opponent that you literally cannot swerve. This is why nuclear deterrence involves automatic retaliation systems, why union negotiators say "my members will never accept this," and why generals burn bridges behind them. The more committed you appear, the more likely the other side swerves.',
  analyze: (choice, aiChoice) => {
    const pSwerve = choice === 'retreat';
    const aSwerve = aiChoice === 'retreat';
    const payoffNote = 'Chicken payoff: Both swerve → 2 each. You swerve, they hold → 1 (you lose face). You hold, they swerve → 4 (you win!). Both hold → -10 (catastrophe!).';
    if (pSwerve && aSwerve) return 'Both armies retreated. Neither wins glory, but neither dies. You got 2 points. ' + payoffNote + ' This is the safest outcome but unsatisfying. The lesson: in Chicken, the best individual outcome (you hold, they swerve) requires convincing the other side you\'re more committed than they are. Real-world example: two cars heading toward each other — if both swerve, both are safe but "losers." The game is about signaling commitment, not about the payoff itself.';
    if (pSwerve && !aSwerve) return 'You retreated. Kael held. He crosses the bridge unchallenged. You got 1 point — the "chicken" outcome. ' + payoffNote + ' Kael\'s risk-seeking personality made him willing to gamble on mutual destruction. By retreating, you avoided catastrophe but lost face and strategic position. In real-world Chicken (e.g., nuclear brinkmanship, corporate takeover battles), the "swerver" often loses the war without fighting a battle. The lesson: if you face a truly committed opponent, sometimes the rational choice is to swerve — but you should have signaled commitment earlier to avoid this position.';
    if (!pSwerve && aSwerve) return 'You held. Kael retreated. Victory! You got 4 points. ' + payoffNote + ' You won this round of Chicken. Kael blinked. Why? Perhaps your reputation for resolve convinced him you wouldn\'t back down. In game theory, winning Chicken is about credibility: if you can make your threat to hold perfectly credible (by burning bridges, literally or figuratively), the other side must swerve. This is the logic of MAD (Mutually Assured Destruction): if both sides have a "dead hand" that automatically retaliates, the first side to show hesitation loses.';
    return 'CATASTROPHE! Both armies advanced. Battle erupted. Thousands dead. You got -10 points. ' + payoffNote + ' This is the worst outcome of Chicken — and the paradox is that it should never happen if both players are rational. Yet it happens in real life because: (1) both sides believe the other will swerve, (2) pride or commitment makes swerving politically impossible, or (3) communication failures. The Cuban Missile Crisis was a real-world game of Chicken that nearly ended in catastrophe — both Kennedy and Khrushchev held firm before eventually finding a face-saving compromise. Lesson: Chicken is dangerous because the equilibrium of mutual destruction is unstable but possible.';
  },
  agents: {
    kael: { personality: 'riskSeeking', name: 'Warlord Kael' },
  },
});

scenarioRegistry.register({
  id: 'the-festival-date',
  title: 'The Festival Date',
  era: 3,
  order: 25,
  concept: 'coordination',
  type: 'coordination',
  setup: (state) => {
    state.player.resources.influence = 20;
  },
  story: [
    { speaker: 'Elder Rowan', text: 'Our villages have long celebrated the harvest separately. This year, let us hold a joint festival — one grand celebration for both peoples!' },
    { speaker: 'Your Village Council', text: 'Elder Rowan\'s people prefer the First Moon (their traditional date). We prefer the Harvest Moon (our tradition). But any shared date is better than separate festivals.' },
    { speaker: 'Elder Rowan', text: 'We have sent word that we are flexible. But we will likely choose the First Moon — it is our oldest tradition.' },
  ],
  context: 'Two neighboring villages want to hold a joint festival. Both prefer their own traditional date, but both agree that a shared date (even on the other village\'s preferred day) is far better than separate festivals on different days. You must coordinate on the same date. The challenge: communication is limited, and both sides have slight preferences over which date to pick.',
  choices: [
    { id: 'cooperate', label: 'First Moon Festival', description: 'Agree to their preferred date. Good coordination, you yield on preference.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'share', label: 'Harvest Moon Festival', description: 'Hold firm on your preferred date. Best if they yield, worst if they don\'t.', risk: 'high', tags: ['cooperate'] },
    { id: 'fair', label: 'Winter Solstice Compromise', description: 'Propose a third date neither prefers. Neutral ground, but risky if they stick to tradition.', risk: 'medium', tags: ['cooperate', 'medium'] },
  ],
  idealNote: 'Against Elder Rowan (a long-term planner who values cooperation), the safest bet is to pick the First Moon — their preferred date. They\'ve signaled their intention, and a long-term planner will stick with their declared choice because changing would create uncertainty. But if you really prefer the Harvest Moon, you could pick it and hope they yield. The key insight from coordination games: any agreement is better than miscoordination. The "focal point" is a salient solution that players naturally gravitate toward — here, the First Moon, because Rowan explicitly stated it. In real life, focal points include driving on the right side of the road, meeting at "the clock tower," or using a standard measurement system.',
  analyze: (choice, aiChoice) => {
    const coordinated = choice === aiChoice;
    if (coordinated && choice === 'cooperate') {
      return 'Perfect coordination! Both villages chose the First Moon. The festival is a grand success. Both get +5. Elder Rowan\'s hint about their tradition served as a "focal point" — a salient solution that coordinated expectations. In coordination games, focal points solve the alignment problem without requiring explicit communication. Real-world examples: driving on the right side of the road (everyone just knows), meeting at "the information desk in Grand Central," or using the same unit of measurement. Lesson: sometimes the best way to coordinate is to look for what\'s obvious to everyone.';
    }
    if (coordinated && choice === 'share') {
      return 'Perfect coordination! Both villages chose the Harvest Moon. The festival is a grand success. Both get +5. You held firm and Rowan yielded — perhaps because they value harmony over tradition. This demonstrates that in coordination games, the outcome is good regardless of WHICH date you coordinate on — the important thing is that you coordinate. The specific point both players converge to is less important than the fact of convergence. This is why standards wars (VHS vs Beta, Blu-ray vs HD-DVD) end with one standard winning: any standard is better than incompatible standards.';
    }
    if (coordinated && choice === 'fair') {
      return 'Perfect coordination on the Winter Solstice! Both villages chose the compromise date. Both get +5. The compromise worked because Elder Rowan was willing to meet you in the middle. This is a "compromise focal point" — sometimes the most salient solution isn\'t anyone\'s first choice but the option that\'s obviously "fair." In real-world negotiations, 50/50 splits are common focal points for this reason. Lesson: fairness can serve as a coordination device when preferences conflict.';
    }
    if (!coordinated) {
      return `Miscoordination. You chose ${choice}, Elder Rowan chose ${aiChoice}. Different dates, separate festivals. Both get 0. Neither village wanted this outcome, but without a clear focal point or sufficient communication, you failed to align. This is the cost of failed coordination: both sides prefer the other\'s date to no coordination at all, yet each clung to their own preference. Real-world examples: incompatible technical standards (different power plugs in different countries), failed merger negotiations, scheduling conflicts. Lesson: when coordination is at stake, clear communication and focal points are worth more than fighting for your preferred outcome.`;
    }
    return 'Coordination games teach us that sometimes any agreement is better than the best disagreement. The challenge is finding a common ground that both sides can identify independently.';
  },
  agents: {
    rowan: { personality: 'longTermPlanner', name: 'Elder Rowan' },
  },
});

scenarioRegistry.register({
  id: 'the-spy-game',
  title: 'The Spy Game',
  era: 3,
  order: 26,
  concept: 'bayesianGames',
  type: 'spy',
  setup: (state) => {
    state.player.resources.influence = 30;
    state.player.resources.gold = 150;
  },
  story: [
    { speaker: 'Ambassador Silas', text: 'I bring greetings from the neighboring kingdom. My lord wishes to renew our trade agreement on favorable terms.' },
    { speaker: 'Your Spymaster', text: 'We have reason to believe Ambassador Silas may be a spy. But we\'re not certain — perhaps only 40% chance. His behavior will either confirm or refute our suspicions.' },
    { speaker: 'Ambassador Silas', text: 'I am a simple diplomat. Nothing more. You may trust me or doubt me, but the trade agreement benefits both our realms.' },
  ],
  context: 'Ambassador Silas may be a spy or a genuine diplomat. Your prior belief: 40% chance he\'s a spy, 60% chance he\'s genuine. A spy would act friendly to gain access. A genuine diplomat would also act friendly. But a spy might be nervous or overeager. You must decide whether to trust him, investigate further, or expel him — updating your beliefs based on his behavior.',
  choices: [
    { id: 'trust', label: 'Trust the Ambassador', description: 'Accept him at face value. Grant access and negotiate the trade deal. Risky if he\'s a spy.', risk: 'high', tags: ['cooperate', 'high'] },
    { id: 'investigate', label: 'Investigate Further', description: 'Spend 50 gold on deeper investigation. Plant false information and see if it reaches the enemy court.', risk: 'medium', tags: ['medium'] },
    { id: 'expel', label: 'Expel Him', description: 'Refuse the delegation and send him home. Safe but damages relations with his kingdom.', risk: 'low', tags: ['defect', 'safe'] },
  ],
  idealNote: 'Investigation is the optimal Bayesian choice. With a 40% prior probability of spying, the expected value of trust is negative (60% chance of good trade deal × +3, 40% chance of spy leak × -5 = -0.2). Expelling avoids risk but loses the potential trade deal (-2). Investigation costs 50 gold but updates your beliefs — a spy who takes the bait confirms themselves, a genuine diplomat who doesn\'t is confirmed. This is Bayesian updating in action: new information revises your posterior belief, allowing a better-informed final decision.',
  analyze: (choice) => {
    const bayesianFramework = 'Bayesian framework: Prior P(spy) = 40%, P(genuine) = 60%. A spy acts friendly with probability 90% (wants access). A genuine diplomat acts friendly with probability 95% (that\'s their job). So friendliness alone doesn\'t update beliefs much. But a spy who takes \'investigation bait\' (passes false intel to their handlers) is caught with near-certainty.';

    if (choice === 'trust') {
      return 'You trusted Ambassador Silas. If he was genuine, you gained a valuable trade agreement. If he was a spy, your military plans are now compromised. Without updating your prior beliefs, you took a 40% gamble on disaster. This illustrates a key Bayesian insight: when the expected value of the worst outcome (spy leaks) multiplied by its probability exceeds the expected benefit of the best outcome, the rational choice is to seek more information before deciding. ' + bayesianFramework;
    }
    if (choice === 'investigate') {
      return 'You spent 50 gold on investigation — a classic Bayesian information purchase. You planted false documents suggesting a troop movement. If Silas is a spy, this intelligence will reach his handlers, confirming his nature. If he\'s genuine, nothing happens and you\'ve lost only 50 gold. The investigation updates your posterior probability: if the false intel surfaces in the enemy court, P(spy) rises to near 100%. If not, P(spy) drops significantly. This is Bayesian updating in practice: you use new evidence to revise your beliefs, then make a better-informed decision. In the real world, this is why intelligence agencies run "double-check" operations and why companies run background checks — they\'re buying information to update their beliefs.';
    }
    return 'You expelled Ambassador Silas. Safe but costly. You damaged diplomatic relations (-2) and lost the potential trade benefits. In Bayesian terms, you chose the "maximin" strategy — minimize the maximum possible loss — rather than calculating expected value. This is the conservative approach: when uncertainty is high and the downside of being wrong is severe, expelling the ambassador is defensible. But it also means you never learn his true type — you forfeit the information that his future behavior would have revealed. In game theory, this is the cost of type 1 errors (false positives) — you treat a genuine diplomat as a spy and lose the benefits of cooperation. ' + bayesianFramework;
  },
  customResolve: (playerChoice) => {
    const isSpy = Math.random() < 0.4;
    switch (playerChoice) {
      case 'trust':
        if (isSpy) {
          return { outcome: 'defeat', score: 1, narrative: 'Ambassador Silas was a spy. Your military plans are now compromised. Trusting without verification was a gamble that failed.', resourceChanges: { influence: -30, reputation: -15 }, relationshipChanges: {} };
        }
        return { outcome: 'victory', score: 8, narrative: 'Ambassador Silas was genuine. You gained a valuable trade agreement. Trust paid off.', resourceChanges: { gold: 100, influence: 20 }, relationshipChanges: {} };
      case 'investigate':
        if (isSpy) {
          return { outcome: 'victory', score: 7, narrative: 'Your investigation caught Ambassador Silas red-handed. The false intelligence reached enemy hands, confirming his nature. You expelled him and gained valuable counter-intelligence.', resourceChanges: { gold: -50, influence: 15, reputation: 15 }, relationshipChanges: {} };
        }
        return { outcome: 'mixed', score: 5, narrative: 'Your investigation cleared Ambassador Silas. He is genuine. The 50 gold cost was the price of certainty — you can now negotiate the trade deal with confidence.', resourceChanges: { gold: -50, influence: 10 }, relationshipChanges: {} };
      default:
        return { outcome: 'mixed', score: 3, narrative: 'You expelled Ambassador Silas. Safe, but you damaged relations and lost the potential trade benefits. You will never know his true type.', resourceChanges: { influence: -15, reputation: -5 }, relationshipChanges: {} };
    }
  },
  agents: {
    silas: { personality: 'deceptive', name: 'Ambassador Silas' },
  },
});

scenarioRegistry.register({
  id: 'the-market-for-lemons',
  title: 'The Market for Lemons',
  era: 3,
  order: 27,
  concept: 'adverseSelection',
  type: 'lemons',
  setup: (state) => {
    state.player.resources.gold = 300;
    state.player.resources.population = 200;
  },
  story: [
    { speaker: 'Horse Trader Borin', text: 'I have a magnificent stallion for sale. Sound of limb, gentle temperament, strong as an ox. Five years old. A steal at 200 gold.' },
    { speaker: 'Your Stable Master', text: 'My lord, every horse trader says the same thing. The horse might be worth 200 gold — or it might be a broken-down nag worth 20. How can we tell?' },
    { speaker: 'Horse Trader Borin', text: 'Do you doubt my word? Look at him! He\'s beautiful! What more proof do you need?' },
  ],
  context: 'You want to buy a horse. Borin knows its true quality; you don\'t. Good horses are worth 200 gold; "lemons" (bad horses) are worth 20 gold. The problem: since you can\'t tell them apart, you\'re only willing to pay the average price — maybe 110 gold. But owners of good horses won\'t sell at that price. So only lemons come to market. This is the classic "Market for Lemons" (Akerlof, 1970): adverse selection destroys the market for quality.',
  choices: [
    { id: 'offer_warranty', label: 'Demand a Warranty', description: 'Offer 200 gold but demand a written warranty: if the horse is unsound within a year, Borin refunds 150 gold. Only a seller with a good horse would accept.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'sell_as_is', label: 'Buy As-Is for 110 Gold', description: 'Offer 110 gold — the average of good and bad horses. If Borin accepts, you probably got a lemon (good horse owners won\'t sell at a discount).', risk: 'high', tags: ['high', 'defect'] },
    { id: 'dont_buy', label: 'Don\'t Buy', description: 'Walk away. Without reliable information, the risk isn\'t worth it. The market fails.', risk: 'low', tags: ['safe'] },
  ],
  idealNote: 'Demanding a warranty is the optimal move. A warranty is a "costly signal" that only a seller with a good horse can afford — if the horse is a lemon, the warranty will cost Borin the 150 gold refund. Asking for the warranty (a screening mechanism) shifts the information asymmetry: the seller\'s willingness to offer a warranty reveals the horse\'s quality. This is why real-world markets use warranties, certifications, third-party inspections, and return policies — they mitigate adverse selection by letting high-quality sellers credibly signal their quality.',
  analyze: (choice) => {
    if (choice === 'offer_warranty') {
      return 'You offered 200 gold with a warranty demand. If Borin\'s horse is good, he accepts gladly (he\'ll never have to pay the warranty). If it\'s a lemon, he refuses or hesitates. His response reveals the horse\'s quality. This is the solution to the adverse selection problem: create a mechanism where high-quality sellers can credibly separate themselves from low-quality ones. The warranty shifts the information asymmetry back in your favor. This is why certified used cars cost more than uncertified ones, why brand-name products offer guarantees, and why employers value degrees — they\'re all mechanisms that allow high-quality sellers to prove their quality credibly.';
    }
    if (choice === 'sell_as_is') {
      return 'You offered 110 gold — the average of a good horse (200) and a lemon (20). Borin accepted immediately. You almost certainly bought a lemon. Here\'s why: the owner of a good horse (worth 200) would never sell for 110 — that\'s a 90 gold loss. Only the owner of a lemon (worth 20) would be thrilled to get 110 — a 90 gold profit. This is the core insight of Akerlof\'s "Market for Lemons": when buyers can\'t distinguish quality, the market price reflects average quality, which drives high-quality sellers away, which lowers average quality further, which lowers the price further — a "death spiral" that can destroy the market entirely. This is why bad money drives out good (Gresham\'s Law) and why poorly regulated markets fill with low-quality goods.';
    }
    return 'You walked away. The market failed — a potentially mutually beneficial transaction (you want a horse, Borin wants to sell) didn\'t happen because of information asymmetry. You couldn\'t trust the quality, so you refused to participate. This market failure is the central result of adverse selection theory: asymmetric information can destroy otherwise efficient markets. Real-world examples: the 2008 financial crisis (nobody knew which mortgage-backed securities were toxic), health insurance markets (sick people buy more insurance, driving up prices for everyone), online dating (people exaggerate their qualities). The lesson: when information asymmetry is severe, markets can collapse. Mechanisms like warranties, certificates, and third-party verification are essential to keep markets functioning.';
  },
  customResolve: (playerChoice) => {
    const horseIsGood = Math.random() < 0.5;
    switch (playerChoice) {
      case 'offer_warranty':
        if (horseIsGood) {
          return { outcome: 'victory', score: 8, narrative: 'Borin accepts the warranty gladly. The horse is sound — a fair deal for a quality animal.', resourceChanges: { gold: -200, population: 10 }, relationshipChanges: { borin: 10 } };
        }
        return { outcome: 'mixed', score: 4, narrative: 'Borin hesitates at the warranty demand and refuses. The horse is a lemon — you successfully screened out a bad purchase.', resourceChanges: {}, relationshipChanges: { borin: -5 } };
      case 'sell_as_is':
        if (horseIsGood) {
          return { outcome: 'mixed', score: 5, narrative: 'Borin accepts 110 gold. By chance you got a decent horse — but the owner of a good horse should never have sold at this price. Luck, not strategy.', resourceChanges: { gold: -110, population: 5 }, relationshipChanges: {} };
        }
        return { outcome: 'defeat', score: 2, narrative: 'Borin accepts immediately. You bought a lemon. This is adverse selection in action: only bad horses sell at the average price.', resourceChanges: { gold: -110, reputation: -5 }, relationshipChanges: { borin: -5 } };
      default:
        return { outcome: 'mixed', score: 3, narrative: 'You walked away. The market failed — information asymmetry prevented a potentially beneficial exchange.', resourceChanges: {}, relationshipChanges: {} };
    }
  },
  agents: {
    borin: { personality: 'deceptive', name: 'Horse Trader Borin' },
  },
});

scenarioRegistry.register({
  id: 'the-duel-at-dawn',
  title: 'The Duel at Dawn',
  era: 3,
  order: 28,
  concept: 'chicken',
  type: 'duel',
  setup: (state) => {
    state.player.resources.influence = 40;
    state.player.resources.military = 80;
  },
  story: [
    { speaker: 'Champion Draven', text: 'At dawn, we settle this. I will be on the field. Whether you are there or not is your choice.' },
    { speaker: 'Your Second', text: 'If you charge first, you signal commitment — he may retreat. If you wait, you see his move first but lose the advantage of initiative. If you don\'t show, you live but your honor is ruined.' },
    { speaker: 'Champion Draven', text: 'I\'ll be there. I always am. The question is: will you?' },
  ],
  context: 'A duel at dawn. You and Champion Draven must decide: charge immediately (first-mover advantage but risky if he also charges), wait and react (safer but you give up initiative), or retreat (safe but dishonorable). This combines Chicken (mutual aggression is catastrophic) with sequential game dynamics (the first mover signals commitment).',
  choices: [
    { id: 'seize', label: 'Charge Immediately', description: 'Draw your sword and advance. First-mover advantage — you signal commitment. He may retreat or may charge too.', risk: 'high', tags: ['high'] },
    { id: 'wait', label: 'Wait and React', description: 'Stand your ground and see what he does. You give up initiative but can respond to his move.', risk: 'medium', tags: ['medium'] },
    { id: 'retreat', label: 'Retreat (Don\'t Fight)', description: 'Refuse the duel. Safe but shameful. Your reputation suffers.', risk: 'low', tags: ['safe'] },
  ],
  idealNote: 'Against a risk-seeking opponent like Draven, charging first is the optimal move. Draven is reckless — he\'s likely to charge too, creating mutual disaster. But by charging first, you signal such strong commitment that even Draven might hesitate. This combines Chicken logic (the first mover who appears most committed wins) with sequential logic (moving first conveys information about your type). The maxim: in a duel, the one who most credibly commits to not backing down wins. This is why "drawing first" in a confrontation is strategically advantageous — but only if your commitment is believable.',
  analyze: (choice, aiChoice) => {
    const chickenPayoff = 'Payoff structure: Both charge → -10 (mutual disaster). You charge, he waits → +4 (you win). You wait, he charges → +1 (you lose face but survive). Both wait → +2 (standoff, no resolution). You retreat → +0 (safe but dishonorable).';

    if (choice === 'seize') {
      if (aiChoice === 'wait') {
        return 'You charged. Draven hesitated. You won the duel. +4 points. By charging first, you made your commitment to fight credible, and Draven — for all his bluster — blinked. This is the first-mover advantage in sequential games: the player who moves first can "commit" to a course of action, forcing the second mover to respond. In Chicken terms, you removed your steering wheel by charging — you could no longer back down, so Draven had to. ' + chickenPayoff;
      }
      return 'Both charged! The duel is a bloody catastrophe. Both are wounded. -10 points. Draven\'s risk-seeking nature meant he was always going to charge. By charging too, you created the worst possible outcome. The lesson: against a truly reckless opponent, sometimes the best move is to let them commit first and then react. In sequential Chicken, the second mover has an advantage: they can see the first mover\'s choice and then decide. If you had waited, you could have retreated when Draven charged. This is the "second-mover advantage" — the ability to respond after seeing the first move. ' + chickenPayoff;
    }
    if (choice === 'wait') {
      if (aiChoice === 'seize') {
        return 'You waited. Draven charged. You retreated and lost face. +1 point. You gave up the initiative and Draven exploited it. In sequential games, the second mover has information but loses commitment power. You knew he was charging, but by the time you knew, it was too late to counter-charge — you could only retreat. This is the disadvantage of waiting: you can react, but your reactions are constrained by the first mover\'s commitment. In real life, this is why businesses try to be "first movers" in new markets: they capture commitment advantages that latecomers can\'t easily overcome. ' + chickenPayoff;
      }
      return 'Both waited. A tense standoff. No blood, but no resolution. +2 points. Neither side committed. In game theory terms, this is a "coordination failure" in the sequential language of Chicken — both waited for the other to move first. This outcome is stable but unsatisfying for everyone. ' + chickenPayoff;
    }
    return 'You retreated. The duel didn\'t happen. Zero points — safe but dishonorable. Your reputation suffers, and Draven is emboldened. In the sequential game, retreating is the safest individual choice but the worst collective outcome if both would have waited. This illustrates the "security" vs. "efficiency" tradeoff in games of conflict: retreat guarantees safety but forfeits all potential gains. ' + chickenPayoff;
  },
  customResolve: (playerChoice, aiChoices) => {
    const aiChoice = Object.values(aiChoices)[0];
    if (playerChoice === 'seize') {
      if (aiChoice === 'wait') {
        return { outcome: 'victory', score: 8, narrative: 'You charged. Draven hesitated. You won the duel — first-mover advantage carried the day.', resourceChanges: { influence: 25, military: 10 }, relationshipChanges: { draven: -10 } };
      }
      return { outcome: 'defeat', score: 1, narrative: 'Both charged! Mutual catastrophe. Draven\'s recklessness met your aggression — the worst possible outcome.', resourceChanges: { military: -60, influence: -20, gold: -30 }, relationshipChanges: { draven: -20 } };
    }
    if (playerChoice === 'wait') {
      if (aiChoice === 'seize') {
        return { outcome: 'defeat', score: 3, narrative: 'You waited. Draven charged. You retreated and lost face. His first-mover commitment overwhelmed your caution.', resourceChanges: { influence: -15, reputation: -10 }, relationshipChanges: { draven: -5 } };
      }
      return { outcome: 'mixed', score: 5, narrative: 'Both waited. A tense standoff with no resolution. Safe but unsatisfying for both.', resourceChanges: {}, relationshipChanges: {} };
    }
    return { outcome: 'mixed', score: 2, narrative: 'You retreated. Safe but dishonorable. Draven is emboldened and your reputation suffers.', resourceChanges: { influence: -20, reputation: -15 }, relationshipChanges: { draven: -10 } };
  },
  agents: {
    draven: { personality: 'riskSeeking', name: 'Champion Draven' },
  },
});

scenarioRegistry.register({
  id: 'the-alliance-treaty',
  title: 'The Alliance Treaty',
  era: 3,
  order: 29,
  concept: 'signaling',
  type: 'alliance',
  setup: (state) => {
    state.player.resources.gold = 200;
    state.player.resources.military = 150;
    state.player.resources.influence = 30;
  },
  story: [
    { speaker: 'Queen Seraphine', text: 'The Northern tribes grow bold. I propose a mutual defense alliance between our kingdoms. Together we are strong; divided we fall.' },
    { speaker: 'Your Marshal', text: 'An alliance requires trust. If we commit fully and she commits weakly, we bear the cost of any war while she reaps the protection. We need to know her true commitment level.' },
    { speaker: 'Queen Seraphine', text: 'I am willing to pledge troops, gold, and my son\'s hand in marriage to seal this pact. Judge my commitment by the size of my offer.' },
  ],
  context: 'Queen Seraphine proposes a military alliance. You must assess her commitment level: is she a reliable partner who will share the burden of defense, or a free rider who wants protection without cost? She signals her type through the alliance terms she proposes. This is a signaling game: the terms of the offer reveal (or conceal) her true commitment.',
  choices: [
    { id: 'strong_alliance', label: 'Accept Strong Alliance', description: 'Propose a mutual defense pact with binding troop commitments (200 soldiers from each side). High commitment from both.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'weak_alliance', label: 'Accept Token Alliance', description: 'A non-binding agreement to "consult" in case of attack. Low commitment, low cost, low protection.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'no_alliance', label: 'Refuse Alliance', description: 'Decline the alliance entirely. Maintain independence. No commitment, no protection.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'Accepting the strong alliance is optimal if Queen Seraphine is genuine (which she is — she\'s a trust builder). The size of her proposed commitment signals her type: a free rider would propose a weak alliance with minimal obligations. A genuine ally proposes strong, symmetric commitments. This is the signaling equilibrium: high-quality types (committed allies) can afford to send strong signals (large troop commitments); low-quality types (free riders) cannot, because they don\'t want to bear the cost. The signal is credible because it\'s costly.',
  analyze: (choice, aiChoice) => {
    if (choice === 'strong_alliance') {
      return 'You proposed a strong mutual defense pact with 200 soldiers each. Queen Seraphine accepts enthusiastically. The alliance is formed — credible, binding, and symmetric. Both sides have skin in the game. This is a "separating equilibrium": only a genuinely committed ally would accept such binding terms. A free rider would have balked at the cost. Queen Seraphine\'s willingness to commit strongly signals her type. In signaling theory, this is analogous to a company spending heavily on a product launch: only a company confident in its product spends big money on marketing, because if the product fails, the marketing cost is wasted. The costly signal credibly conveys quality.';
    }
    if (choice === 'weak_alliance') {
      return 'You proposed a non-binding "consultation" agreement. Queen Seraphine is disappointed but accepts. The alliance provides little actual protection: when the Northern tribes attack, you\'ll "consult" while your kingdom burns. This is a "pooling equilibrium": both committed allies and free riders would accept a weak, non-binding agreement because it costs nothing. The terms don\'t separate the types, so you learn nothing about Seraphine\'s true commitment. In the real world, weak alliances are often worthless — the League of Nations failed because its members had no binding commitment to act. Lesson: the strength of a commitment signal is proportional to its cost. Weak signals convey no information.';
    }
    return 'You refused the alliance. Queen Seraphine is offended; relations cool. The Northern tribes grow bolder seeing your division. You maintained independence but lost a potentially valuable ally. Without a credible commitment from either side, the cooperative venture (mutual defense) fails entirely. This is the tragedy of signaling failures: when signals are not credible or are misunderstood, mutually beneficial cooperation collapses. In the real world, this is why diplomacy is so delicate — the parties must find ways to credibly signal their intentions, and miscommunication can lead to conflict even when both sides genuinely want peace.';
  },
  customResolve: (playerChoice, aiChoices) => {
    const aiChoice = Object.values(aiChoices)[0];
    switch (playerChoice) {
      case 'strong_alliance':
        if (aiChoice === 'strong_alliance') {
          return { outcome: 'victory', score: 9, narrative: 'Both sides commit 200 soldiers. A credible, binding mutual defense pact. The Northern tribes will think twice.', resourceChanges: { military: -200, influence: 40, gold: -50 }, relationshipChanges: { seraphine: 20 } };
        }
        return { outcome: 'mixed', score: 5, narrative: 'You proposed a strong alliance but Queen Seraphine\'s commitment is weaker. The pact is unbalanced — you bear more cost.', resourceChanges: { military: -200, influence: 15 }, relationshipChanges: { seraphine: 5 } };
      case 'weak_alliance':
        return { outcome: 'mixed', score: 4, narrative: 'A non-binding consultation agreement. Little actual protection, but no costly commitments either. A pooling equilibrium — no information revealed.', resourceChanges: { influence: 5 }, relationshipChanges: { seraphine: 5 } };
      default:
        return { outcome: 'defeat', score: 2, narrative: 'You refused the alliance. Queen Seraphine is offended. The Northern tribes grow bolder seeing your division.', resourceChanges: { military: -20, influence: -15 }, relationshipChanges: { seraphine: -20 } };
    }
  },
  agents: {
    seraphine: { personality: 'trustBuilder', name: 'Queen Seraphine' },
  },
});

scenarioRegistry.register({
  id: 'the-informant',
  title: 'The Informant',
  era: 3,
  order: 30,
  concept: 'bayesianGames',
  type: 'informant',
  setup: (state) => {
    state.player.resources.gold = 100;
    state.player.resources.influence = 20;
  },
  story: [
    { speaker: 'Informant Kestrel', text: 'I have information that will change everything. The neighboring kingdom plans to attack at the next full moon.' },
    { speaker: 'Your Spymaster', text: 'Kestrel has brought us information before. Some was accurate. Some was self-serving. We estimate his information is truthful about 60% of the time.' },
    { speaker: 'Kestrel', text: 'This time I\'m certain. I heard it from a guard in the king\'s own citadel. But believe what you will — I\'ve done my part.' },
  ],
  context: 'Informant Kestrel claims the neighboring kingdom will attack at the next full moon. Your prior belief: Kestrel is truthful 60% of the time based on past history. A truthful informant would report an attack if and only if one is actually planned. A lying informant fabricates reports for personal gain. You must decide whether to believe him, verify the information (costs gold), or ignore him. This is a Bayesian game: you have a prior probability about Kestrel\'s truthfulness, and you must update it based on his report and any additional evidence.',
  choices: [
    { id: 'believe', label: 'Believe and Prepare', description: 'Accept Kestrel\'s report as true. Mobilize the army. Costs 100 gold but prepares you for attack.', risk: 'medium', tags: ['cooperate', 'medium'] },
    { id: 'verify', label: 'Send Scouts to Verify', description: 'Spend 50 gold to send your own scouts. If they confirm, mobilize. If they don\'t, ignore Kestrel\'s report.', risk: 'low', tags: ['safe'] },
    { id: 'ignore', label: 'Ignore the Report', description: 'Dismiss Kestrel as unreliable. Save the mobilization cost but risk being caught unprepared.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'Verification is optimal. With a 60% prior that Kestrel is truthful, the expected value of believing directly is marginal (60% × benefit of preparation - 40% × cost of false alarm). Verification for 50 gold updates your beliefs significantly: if scouts confirm the attack, posterior P(attack) rises above 90%, and mobilizing is clearly correct. If scouts find nothing, P(attack) drops and you save the mobilization cost. This is the essence of Bayesian decision-making: before acting on uncertain information, determine whether additional information is worth its cost, then update your beliefs and act.',
  analyze: (choice) => {
    const bayesian = 'Bayesian calculation: Prior P(truthful) = 60%. A truthful informant reports attack if attack is real. A liar may report attack regardless. Bayes\' Theorem: P(attack | report) = P(report | attack) × P(attack) / P(report). If we assume P(attack) = 50% and liars report attack 50% of the time, then P(attack | Kestrel reports) = (1.0 × 0.5) / (0.6 × 1.0 × 0.5 + 0.4 × 0.5 × 0.5) = 0.5 / 0.4 = 62.5%. The report only updates you from 50% to 62.5% — not enough to justify a costly mobilization.';

    if (choice === 'believe') {
      return 'You believed Kestrel and mobilized. Cost: 100 gold. If the attack was real, you\'re prepared. If it was a lie, you wasted resources. Based on his 60% historical truthfulness, the Bayesian posterior probability that the attack is real given his report is only about 62%. Mobilizing with 62% confidence is a gamble. ' + bayesian + ' The lesson: when information sources are unreliable, acting on their reports without additional verification is risky. Always ask: "How much does this new information actually update my beliefs?" A 60%-reliable source doesn\'t make you 60% confident — it depends on your prior and the base rate of the event.';
    }
    if (choice === 'verify') {
      return 'You spent 50 gold to send scouts — a classic Bayesian information purchase. Your scouts report: they saw no army massing. You now update your beliefs: Kestrel was either lying or mistaken. You saved 100 gold in mobilization costs. The 50 gold verification cost is your "information premium" — the price of reducing uncertainty. In Bayesian terms, you paid 50 gold to transform a 60%-reliable source into a near-certain assessment. In the real world, this is why companies do due diligence before acquisitions, why doctors order tests before treatment, and why generals send patrols before committing troops. The expected value of information is the reduction in decision error multiplied by the cost of being wrong.';
    }
    return 'You ignored Kestrel\'s report. You saved 100 gold in mobilization cost. If the attack was a lie, you made the right call. If it was real, your kingdom is now vulnerable. ' + bayesian + ' Ignoring the report entirely is the "maximin" strategy (minimize worst-case loss: you lose at most 100 gold if you\'re wrong, vs. 100 gold + potential invasion if you mobilize for a false alarm). But it\'s also a missed opportunity: even an imperfect informant provides some information. The Bayesian approach is not to ignore or fully trust, but to update beliefs proportionally and act on the expected value. In the real world, intelligence agencies never fully trust or fully ignore a source — they maintain a "source reliability rating" and update it with each report, adjusting their confidence accordingly.';
  },
  customResolve: (playerChoice) => {
    const attackReal = Math.random() < 0.5;
    switch (playerChoice) {
      case 'believe':
        if (attackReal) {
          return { outcome: 'victory', score: 7, narrative: 'Kestrel was right — the attack came at the full moon. Your army was prepared and the defense held.', resourceChanges: { gold: -100, military: 20, influence: 10 }, relationshipChanges: { kestrel: 10 } };
        }
        return { outcome: 'defeat', score: 2, narrative: 'Kestrel was wrong. You mobilized against a phantom threat, wasting resources and crying wolf.', resourceChanges: { gold: -100, reputation: -15 }, relationshipChanges: { kestrel: -10 } };
      case 'verify':
        if (attackReal) {
          return { outcome: 'victory', score: 8, narrative: 'Your scouts confirmed the attack. You mobilized with certainty — the 50 gold verification cost was the price of confidence.', resourceChanges: { gold: -150, military: 20, influence: 15 }, relationshipChanges: { kestrel: 5 } };
        }
        return { outcome: 'mixed', score: 5, narrative: 'Your scouts found nothing. Kestrel\'s report was false. The 50 gold saved you from wasting 100 on a false mobilization.', resourceChanges: { gold: -50 }, relationshipChanges: { kestrel: -5 } };
      default:
        if (attackReal) {
          return { outcome: 'defeat', score: 1, narrative: 'Kestrel was right, but you ignored him. The attack caught you completely unprepared.', resourceChanges: { military: -60, gold: -80, reputation: -20 }, relationshipChanges: { kestrel: -15 } };
        }
        return { outcome: 'mixed', score: 4, narrative: 'Kestrel was wrong and you saved mobilization cost. But relying on luck is not a strategy.', resourceChanges: {}, relationshipChanges: { kestrel: -5 } };
    }
  },
  agents: {
    kestrel: { personality: 'deceptive', name: 'Informant Kestrel' },
  },
});

scenarioRegistry.register({
  id: 'boss-d-day-deception',
  title: 'Operation Fortitude',
  era: 3,
  order: 30.5,
  bossFight: true,
  concept: 'signaling',
  type: 'signaling',
  story: [
    { speaker: 'Eisenhower', text: 'The fate of Europe rests on one question: where will the Germans believe we land?' },
    { speaker: 'Montgomery', text: 'They know an invasion is coming. The only unknown is where. We must make them believe it\'s Pas de Calais, not Normandy.' },
    { speaker: 'Intelligence Officer', text: 'We\'ve created an entirely fake army group — FUSAG — under General Patton. Inflatable tanks, fake radio traffic, dummy landing craft. The Abwehr has informants we\'ve "turned" — they\'re feeding the deception directly to Berlin.' },
    { speaker: 'Eisenhower', text: 'The Germans have their own intelligence. They\'ll be trying to screen our signals. The question is: how much will they believe?' },
  ],
  context: '1944. The Allies are about to launch the largest amphibious invasion in history. But the Germans know it\'s coming. The only question: where? The Allies have built an entirely fake army (FUSAG) — inflatable tanks, fake radio traffic, double agents, dummy landing craft — all pointing to Pas de Calais. You are a German intelligence analyst. The signals you receive are a mix of genuine deception (the fake army) and real preparations (Normandy). Your job: screen the signals, update your beliefs, and advise the High Command. This is a signaling game: the Allies choose what to signal, the Germans choose what to believe.',
  choices: [
    { id: 'believe_calais', label: 'Believe Calais', description: 'Trust the overwhelming evidence. Patton\'s army is real — the main invasion will hit Calais. Hold the panzer divisions in reserve near Calais.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'believe_normandy', label: 'Believe Normandy', description: 'Trust the double agent\'s last-minute tip. Calais is a decoy — the real blow falls at Normandy. Commit reserves south.', risk: 'high', tags: ['defect', 'high'] },
    { id: 'wait', label: 'Wait for Proof', description: 'Split your reserves between both locations. Safe but guarantees you\'re too slow to reinforce the real landing point.', risk: 'low', tags: ['cooperate', 'safe'] },
  ],
  idealNote: 'The optimal intelligence assessment was to believe Normandy — but you needed the right evidence. The Allies\' deception was incredibly costly: an entire fake army group with real radio traffic, real command structures, real supply depots. This is a "costly signal" — the very expense of the deception made it credible (why spend millions on a fake army if it wasn\'t protecting something real?). The key intelligence came from Ultra (decrypted German communications) and the double agent network. When the Germans saw that Allied agents in Calais were unusually quiet, and that resistance activity in Normandy increased, the pattern emerged. In game theory terms: the optimal screening strategy is to look for signals that are costly to fake. The Allies\' deception was so good that the Germans never fully solved it — even after D-Day, Hitler held reserves at Calais for weeks, believing the Normandy landing was a diversion.',
  analyze: (choice, aiChoice) => {
    const landed = 'Normandy';
    if (choice === 'believe_calais') return 'You believed the evidence pointed to Calais. The fake army was incredibly convincing — real radio traffic, real command structure, a legendary general (Patton) in charge. When the invasion hit Normandy, your panzer divisions were 200 miles away waiting at Calais. This is the perfect deception: the Allies sent costly signals (millions of dollars, thousands of personnel) that made the lie credible. In game theory, this is a "separating equilibrium" — the signal was so convincing that even a rational receiver believed it. The lesson: when evaluating intelligence, ask not just "what does the evidence say?" but "what would it cost the other side to fake this evidence?"';
    if (choice === 'believe_normandy') return 'You trusted the double agents and Ultra intercepts. The Normandy beaches are where the real blow falls. You ordered the panzer reserves south — but too late. Rommel was in France on leave. The German response was fragmented and delayed. But here\'s the twist: you WERE right. And if Hitler had listened to his commanders who suspected Normandy, the Allied landings might have failed. The lesson: in signaling games, the best screening strategy is to triangulate across multiple independent signals. The Abwehr\'s double agents, Ultra intercepts, aerial reconnaissance, and resistance activity all pointed in different directions — but together, the pattern emerged. No single signal was reliable, but the COST of the deception (the fake army) told you something: the Allies were protecting SOMETHING important.';
    return 'You split your reserves between Calais and Normandy. Safe — you covered both possibilities. But safe is slow. By the time you confirmed Normandy was the real invasion, your reserves were too far from the beachhead to repel the attack. This is the "pooling" strategy in signaling games: avoid committing to any interpretation, keep options open, update beliefs as new evidence arrives. In intelligence work, this is often the safest approach. But against an opponent who has invested heavily in a deception campaign, waiting for certainty means forfeiting the initiative. The lesson: in screening problems, the cost of waiting for perfect information is often higher than the cost of acting on imperfect information.';
  },
  customResolve: (playerChoice, aiChoices) => {
    if (playerChoice === 'believe_normandy') {
      return { outcome: 'victory', score: 7, narrative: 'You trusted the right signals. Normandy was the real landing. Though the German response was too slow, your assessment was correct. The costly signal of the fake army was designed to deceive — but you triangulated across multiple sources to find the truth.', resourceChanges: { influence: 40, knowledge: 30 }, relationshipChanges: {} };
    }
    if (playerChoice === 'believe_calais') {
      return { outcome: 'defeat', score: 2, narrative: 'The deception worked perfectly. You committed your reserves to Calais while Normandy was the real target. The Allies\' costly signal — an entire fake army — was so convincing that even a rational analyst believed it.', resourceChanges: { influence: -30, military: -50 }, relationshipChanges: {} };
    }
    return { outcome: 'mixed', score: 4, narrative: 'You split your reserves. Safe, but slow. By the time you confirmed Normandy was real, the beachhead was firmly established. Waiting for certainty forfeited the initiative.', resourceChanges: { influence: -10 }, relationshipChanges: {} };
  },
  agents: {
    abwehr: { personality: 'riskAverse', name: 'German High Command' },
  },
});

