export const FLAVOR = {
  titles: {
    era1: 'The Foundations of Power',
    era2: 'The Web of Reputation',
    era3: 'The Fog of War',
    era4: 'The Marketplace of Ideas',
    era5: 'The Living World',
    era6: 'The Architect',
  },

  eraDescriptions: {
    1: 'In the beginning, there is scarcity. Every choice costs something. You will learn that strategy is about trade-offs, not solutions.',
    2: 'Word travels. Your reputation precedes you. Past choices echo into the future.',
    3: 'You never know the full truth. Information is power. Deception is strategy.',
    4: 'Create the rules. Design the game. Let others play within the world you build.',
    5: 'Strategies live and die. What survives is what works. Evolution, not rationality, shapes behavior.',
    6: 'You understand the principles. Now build a society from scratch.',
  },

  welcome: [
    'Welcome to the Shattered Coast.',
    'The Old Empire has fallen. A dozen city-states compete for survival.',
    'You rule Haven — a modest port with grand ambitions.',
    'Your decisions will shape your destiny.',
    'There is no manual. The game itself is your teacher.',
  ],

  goodOutcomes: [
    'Your strategy pays off. The people celebrate your wisdom.',
    'Fortune favors the bold. Today, you were bold.',
    'The bards will sing of this decision.',
    'Your council nods in approval. For now.',
  ],

  badOutcomes: [
    'The plan backfires. Your advisors exchange worried glances.',
    'You underestimated the consequences.',
    'The people grow restless. Whispers of discontent spread.',
    'A costly lesson. But lessons are what make a ruler wise.',
  ],

  mixedOutcomes: [
    'Every coin has two sides. So does this outcome.',
    'A partial victory. A partial defeat. The game continues.',
    'You gained something. You lost something. Such is ruling.',
  ],

  conceptUnlock: {
    preamble: 'You have experienced a pattern. A truth about strategic interaction.',
    title: 'DISCOVERY',
    footer: 'This knowledge is now yours. Apply it in future scenarios.',
  },

  hints: {
    firstLoss: 'Every ruler fails. The question is what you learn from failure.',
    retry: 'History is written by those who try again.',
    cooperation: 'Sometimes the best way to win is to help others win too.',
    defection: 'Betrayal pays once. The cost is paid forever.',
    reputation: 'Word travels. Your choices echo beyond the moment.',
  },
};

export const BOSS_FIGHTS = {
  1: {
    id: 'boss-cuban-missile',
    title: 'The Cuban Missile Crisis',
    subtitle: '1962 — Brinkmanship and the nuclear option',
    concept: 'chicken',
    payoff: 'Kennedy faced the same choice and chose the blockade — a move that communicated resolve while leaving Khrushchev a way out. In Chicken, the player who creates a credible commitment to stand firm forces the other to blink. The blockade was brinkmanship perfected.',
  },
  2: {
    id: 'boss-too-big-to-fail',
    title: 'Too Big to Fail',
    subtitle: '2008 — The moral hazard of bailouts',
    concept: 'moralHazard',
    payoff: 'Paulson\'s bailout of Bear Stearns saved the system but planted the seeds of the next crisis. Every rescue confirms the expectation of future rescues — that is moral hazard. The optimal mechanism punishes bad actors without collapsing the system.',
  },
  3: {
    id: 'boss-d-day-deception',
    title: 'Operation Fortitude',
    subtitle: '1944 — The signaling game that saved D-Day',
    concept: 'signaling',
    payoff: 'The Allies spent millions on a fake army to make their lie credible. The Germans had to screen truth from noise. Costly signals are hard to fake — but the best screeners triangulate across multiple sources. The most expensive bluff in history won the war.',
  },
  4: {
    id: 'boss-fcc-spectrum',
    title: 'The FCC Spectrum Auctions',
    subtitle: '1994 — Mechanism design in the public interest',
    concept: 'auctions',
    payoff: 'Before game theorists redesigned the system, spectrum was given away by lottery — leaving billions on the table. The simultaneous ascending auction let bidders learn from each other, reducing the winner\'s curse. Mechanism design captured the public\'s value.',
  },
  5: {
    id: 'boss-facebook-network',
    title: 'The Facebook Network Effect',
    subtitle: '2004 — Critical mass and platform strategy',
    concept: 'networkEffects',
    payoff: 'MySpace had more users, but Facebook had denser connections. Gradual, school-by-school rollout maintained quality while building toward critical mass. In network markets, density beats size — a connected user base outlasts a fragmented crowd.',
  },
  6: {
    id: 'boss-standards-war',
    title: 'The Standards War Gauntlet',
    subtitle: 'VHS vs Betamax · TCP/IP vs OSI · Chrome vs IE',
    concept: 'coordination',
    payoff: 'Three battles, one pattern: the technically superior product lost every time. VHS won on recording time, TCP/IP won on openness, Chrome won on distribution. In network markets, adoption beats perfection — always.',
  },
};
