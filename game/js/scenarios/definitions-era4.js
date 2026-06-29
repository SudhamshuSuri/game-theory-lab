import { scenarioRegistry } from './registry.js';

// ============================================================
// ERA IV: Markets & Mechanism (Scenarios 31–40)
// Auctions, mechanism design, public goods, tragedy of the
// commons, network effects, congestion, voting systems.
// ============================================================

scenarioRegistry.register({
  id: 'the-spice-auction',
  title: 'The Spice Auction',
  era: 4,
  order: 31,
  concept: 'auctions',
  type: 'auction',
  setup: (state) => {
    state.player.resources.gold = 50;
  },
  story: [
    { speaker: 'Auctioneer Voss', text: 'Ladies and gentlemen, a rare shipment of Qafir Spice! Ten crates, enough to season a kingdom for a year. Bidding starts at 1 gold.' },
    { speaker: 'Merchant Lord Hark', text: 'I\'ve seen this spice before. The last shipment was adulterated. But this one... smells genuine.' },
    { speaker: 'Your Advisor', text: 'Be careful, my lord. In an English auction, the winner is the one who bids highest. But the winner may also overpay — the \'winner\'s curse.\' Value the spice at 7 gold maximum.' },
  ],
  context: 'An English (ascending) auction for rare Qafir Spice. Bids rise round by round. You value the spice at 7 gold — anything above that is overpaying. The AI bids aggressively. The winner\'s curse looms: the winner may be the one who most overestimates the value.',
  choices: [
    { id: '1', label: 'Bid 1 Gold', description: 'Open the bidding low. Safe, but unlikely to win.', risk: 'low', tags: ['safe'] },
    { id: '3', label: 'Bid 3 Gold', description: 'A moderate opening bid. Shows interest without commitment.', risk: 'low', tags: ['medium'] },
    { id: '5', label: 'Bid 5 Gold', description: 'A serious bid near the spice\'s true value.', risk: 'medium', tags: ['medium'] },
    { id: '7', label: 'Bid 7 Gold', description: 'Bid the maximum true value. Profitable if you win, zero profit margin.', risk: 'medium', tags: ['high'] },
    { id: '9', label: 'Bid 9 Gold', description: 'Overvalue the spice. Likely win, but negative profit — the winner\'s curse.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'In an English auction against aggressive bidders, the optimal strategy is to bid up to your true value (7 gold) and stop. Bidding 9 almost guarantees the win, but at a loss — the classic winner\'s curse. The AI (greedy) will escalate the price beyond rational value. If you win at 7 or below, you capture value. If the price exceeds 7, let the AI overpay and suffer the winner\'s curse. The lesson: in common-value auctions, the winner tends to be the most optimistic bidder, which is often bad news. Always set a maximum bid based on your valuation and walk away when exceeded.',
  analyze: (choice, aiChoice) => {
    const playerBid = parseInt(choice);
    const aiBid = parseInt(aiChoice || '0');
    const spiceValue = 7;
    const playerProfit = spiceValue - playerBid;
    const aiProfit = spiceValue - aiBid;
    const won = playerBid >= aiBid;

    if (!won) {
      return `You bid ${playerBid}. AI bid ${aiBid}. AI won. AI's profit: ${aiProfit} gold. Your profit: 0. You avoided the winner's curse by not overpaying. The spice was worth ${spiceValue}. The AI paid ${aiBid}${
        aiBid > spiceValue ? ' — more than it\'s worth! That IS the winner\'s curse: the winner overpaid because they got caught up in the bidding frenzy.' : '. A fair price.'
      } In English auctions, the key discipline is knowing your maximum and sticking to it. Winner's curse is strongest in common-value auctions (where the item's true value is the same for everyone but unknown), like oil drilling rights or IPO shares. The winner tends to be the most optimistic bidder, and optimism often means overpayment.`;
    }

    if (playerBid > spiceValue) {
      return `You won with ${playerBid}. AI bid ${aiBid}. You paid ${playerBid} for spice worth ${spiceValue}. Profit: ${playerProfit}. You overpaid! This is the winner's curse: you won the auction but lost money. The spice is worth ${spiceValue} gold; you paid ${playerBid}. The AI's greed drove the price up, and your willingness to exceed your valuation created a loss. In real auctions, this happens when bidders get emotionally invested or fail to account for the fact that winning means everyone else thought it was worth less. Lesson: always set a reservation price and walk away when exceeded.`;
    }

    return `You won with ${playerBid}. AI bid ${aiBid}. Profit: ${playerProfit} gold. You bought the spice below its ${spiceValue} gold value — a good deal. You avoided the winner's curse by not exceeding your valuation. In English auctions, discipline is the key skill. The AI bid ${aiBid}${
      aiBid > spiceValue ? ', overvaluing the spice and suffering the curse they would have if they\'d won.' : ', also staying rational.'
    } Your strategy of bidding your true value and stopping is the optimal approach for a common-value English auction.`;
  },
  agents: {
    hark: { personality: 'greedy', name: 'Merchant Lord Hark' },
  },
});

scenarioRegistry.register({
  id: 'the-silent-bids',
  title: 'The Silent Bids',
  era: 4,
  order: 32,
  concept: 'auctions',
  type: 'auction',
  setup: (state) => {
    state.player.resources.gold = 30;
  },
  story: [
    { speaker: 'Chamberlain', text: 'The crown auctions the rights to the Eastern Trade Route. Sealed bids only — each writes their offer and submits it in secret.' },
    { speaker: 'Rival Merchant Valerius', text: 'I\'ve submitted my bid. Highest bid wins and pays exactly what they bid. The question: how much do you shade your bid below true value?' },
    { speaker: 'Your Trade Advisor', text: 'In a first-price sealed-bid auction, the optimal strategy is to shade your bid below your true valuation. The more you shade, the higher your profit if you win — but the lower your chance of winning. It\'s a tradeoff.' },
  ],
  context: 'First-price sealed-bid auction for the Eastern Trade Route rights. You value the route at 9 gold. You submit one sealed bid; the highest bid wins and pays their bid exactly. All bids are secret. The AI bids aggressively based on its personality.',
  choices: [
    { id: '1', label: 'Bid 1 Gold', description: 'Very low bid. Huge profit if you win, but very unlikely.', risk: 'low', tags: ['safe'] },
    { id: '3', label: 'Bid 3 Gold', description: 'Low bid. Decent profit potential, low win chance.', risk: 'low', tags: ['medium'] },
    { id: '5', label: 'Bid 5 Gold', description: 'Moderate bid. Balanced risk and profit.', risk: 'medium', tags: ['medium'] },
    { id: '7', label: 'Bid 7 Gold', description: 'High bid close to true value. High win chance, thin margin.', risk: 'medium', tags: ['high'] },
    { id: '9', label: 'Bid 9 Gold', description: 'Your full valuation. Guarantees zero profit but highest win chance.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'In a first-price sealed-bid auction, optimal bidding requires shading. The Nash equilibrium strategy is to bid below your true value by an amount that depends on how many competitors you face and your belief about their valuations. Against a single greedy competitor who bids near their true value, a bid of 5 or 7 balances win probability and profit. Bidding 9 guarantees winning but zero profit. Bidding 1-3 rarely wins. The core insight: you trade off win probability against profit margin, and the optimal balance depends on your competitor\'s likely behavior.',
  analyze: (choice, aiChoice) => {
    const playerBid = parseInt(choice);
    const aiBid = parseInt(aiChoice || '0');
    const trueValue = 9;
    const playerProfit = playerBid <= trueValue ? trueValue - playerBid : 0;
    const won = playerBid >= aiBid;

    if (!won) {
      return `You bid ${playerBid}. AI bid ${aiBid}. AI won and pays ${aiBid}. Their profit: ${trueValue - aiBid}. You lost. In a first-price sealed-bid auction, you balance two forces: bidding higher increases win chance but shrinks profit. You chose a conservative ${playerBid}. Against a ${aiBid > playerBid ? 'more aggressive' : 'similarly aggressive'} opponent, it wasn't enough. Key concept — "bid shading": the optimal strategy is to bid your true value minus some shade. The amount of shade depends on how many bidders and how aggressive they are. More competitors = less shading needed (you must bid higher to win). Fewer competitors = more shading (you can bid lower and still win).`;
    }

    if (playerBid > trueValue) {
      return `You won with ${playerBid} — which exceeds the route's true value of ${trueValue}! You overpaid. Profit: negative. In a first-price auction, overbidding is even worse than in an English auction because there are no second chances. Once sealed, your bid is final. This is why due diligence and valuation discipline are essential before submitting a sealed bid. Real-world example: in sealed-bid procurement, the winning contractor often suffers the winner's curse by having bid too aggressively.`;
    }

    return `You won with ${playerBid}. AI bid ${aiBid}. Your profit: ${playerProfit} gold. You bid ${playerBid}, shaded ${trueValue - playerBid} below true value. This is the art of first-price auctions: bid high enough to win, low enough to profit. Your bid of ${playerBid} beat the AI's ${aiBid}. The ${trueValue - playerBid} gold you left on the table is your "bid shading" — the discount you gave yourself for winning. In equilibrium, optimal shading depends on the number of bidders (more bidders = less shade) and your risk tolerance. Real-world application: Treasury bill auctions use this format, and bidders carefully study competitors' past behavior to calibrate their shade.`;
  },
  agents: {
    valerius: { personality: 'greedy', name: 'Merchant Valerius' },
  },
});

scenarioRegistry.register({
  id: 'the-treasury-bonds',
  title: 'The Treasury Bonds',
  era: 4,
  order: 33,
  concept: 'auctions',
  type: 'auction',
  setup: (state) => {
    state.player.resources.gold = 50;
  },
  story: [
    { speaker: 'Royal Treasurer', text: 'The crown issues 1,000 gold in war bonds. We use a Vickrey auction: highest bid wins but pays the second-highest price.' },
    { speaker: 'Banker Corvin', text: 'A Vickrey auction? Fascinating. So if I bid 9 and the second-highest is 5, I pay only 5 even though I bid 9?' },
    { speaker: 'Your Advisor', text: 'Precisely, my lord. In a Vickrey auction, truth-telling is the dominant strategy. You should bid exactly what the bonds are worth to you — no more, no less. Any deviation can only hurt you.' },
  ],
  context: 'A Vickrey (second-price sealed-bid) auction for 1,000 gold in war bonds. You value the bonds at 7 gold. Highest bid wins but pays the second-highest bid. The key insight: in this format, truthful bidding is a dominant strategy. Bid your true value — there is no advantage to shading or overbidding.',
  choices: [
    { id: '1', label: 'Bid 1 Gold', description: 'Far below true value. Safe if you don\'t want to win, but irrational if you do.', risk: 'low', tags: ['safe'] },
    { id: '3', label: 'Bid 3 Gold', description: 'Below true value. Capricious shading.', risk: 'low', tags: ['medium'] },
    { id: '5', label: 'Bid 5 Gold', description: 'Below true value. Still shading for no reason.', risk: 'medium', tags: ['medium'] },
    { id: '7', label: 'Bid 7 Gold', description: 'Your true valuation. The dominant strategy — bid truthfully.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: '9', label: 'Bid 9 Gold', description: 'Above true value. Overbidding risks overpaying.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'Bid 7 — your true value. In a Vickrey auction, truth-telling is the dominant strategy. If you shade (bid 1-5), you reduce win probability without gaining anything: if you win, you still pay the second price, not your bid. If you overbid (9), you risk overpaying if the second price is above your true value. The Vickrey auction is the only sealed-bid format where truthful bidding is optimal. This is why Nobel laureate William Vickrey called it "the auction that solves the winner\'s curse" — it decouples what you pay from what you bid, incentivizing honesty.',
  analyze: (choice, aiChoice) => {
    const playerBid = parseInt(choice);
    const aiBid = parseInt(aiChoice || '0');
    const trueValue = 7;
    const secondPrice = Math.min(playerBid, aiBid);
    const pricePaid = secondPrice;
    const won = playerBid >= aiBid;
    const profit = won ? trueValue - pricePaid : 0;

    if (choice === '7') {
      return `You bid 7 (truthful). AI bid ${aiBid}. ${won ? `You won! Pay the second price: ${pricePaid}. Profit: ${profit}.` : 'AI won.'} Truthful bidding dominates in Vickrey auctions. Why? Your bid only determines whether you WIN — it doesn't affect what you PAY (the second price determines that). So bidding below true value only reduces your chance of winning without improving your price. Bidding above true value risks paying more than the item is worth. The only rational bid is exactly what you value the item at. This mechanism is used in eBay auctions, Google's IPO, and spectrum auctions. Vickrey won the Nobel Prize for showing that second-price sealed-bid auctions align incentives with honesty.`;
    }

    if (parseInt(choice) < 7) {
      return `You bid ${playerBid} (below true value). AI bid ${aiBid}. ${won ? `You won and pay ${pricePaid}. Profit: ${profit}. But you didn't need to shade — in Vickrey, shading only hurts your win probability.` : 'You lost. If you had bid your true value of 7, you would have won.'} The key insight: in a Vickrey auction, shading is never beneficial. Your bid determines if you win; the second price determines what you pay. By bidding below 7, you made yourself harder to beat without any price advantage. This is the unique property of Vickrey (second-price) auctions — they make honest bidding a dominant strategy. Real-world parallel: eBay's proxy bidding system, where you enter your maximum and the system bids incrementally for you.`;
    }

    if (parseInt(choice) > 7) {
      return `You bid ${playerBid} (above true value). AI bid ${aiBid}. ${won ? `You won and pay ${pricePaid}. ` : 'AI won. '}` +
        (won && pricePaid > trueValue
          ? `But you overpaid! The second price was ${pricePaid} which exceeds your true value of ${trueValue}. You paid ${pricePaid} for something worth ${trueValue}. This is the risk of overbidding in a Vickrey auction: your bid doesn't set the price, so you can win at a price above your valuation.`
          : won
            ? `You paid ${pricePaid}, below your ${trueValue} valuation. You overbid but luckily the second price was low enough.`
            : 'Your overbidding didn\u2019t matter since you lost anyway.') +
        ` The lesson: overbidding in a Vickrey auction is never beneficial and always risky. Truthful bidding is the only rational strategy.`;
    }

    return 'In a Vickrey auction, the optimal strategy is simple: bid your true value. The auction structure makes honesty the dominant strategy — a rare and elegant property in mechanism design. This is why Vickrey auctions are considered the gold standard for efficiency.';
  },
  agents: {
    corvin: { personality: 'opportunist', name: 'Banker Corvin' },
  },
});

scenarioRegistry.register({
  id: 'the-town-fair',
  title: 'The Town Fair',
  era: 4,
  order: 34,
  concept: 'publicGoods',
  type: 'public_goods',
  setup: (state) => {
    state.player.resources.gold = 100;
  },
  story: [
    { speaker: 'Mayor Aldric', text: 'The autumn fair is our town\'s greatest tradition. But the treasury is low. I ask each of you: will you contribute to make this year\'s fair happen?' },
    { speaker: 'Merchant Thalia', text: 'The fair brings customers to all our shops. Even if you don\'t pay a copper, you\'ll still benefit from the crowds. The question is whether to be a contributor or a free rider.' },
    { speaker: 'Your Steward', text: 'The fair costs 50 gold. It returns 80 gold in total value to the town. But the benefits are non-excludable — everyone enjoys the crowds, not just those who paid.' },
  ],
  context: 'The town fair is a public good: non-rivalrous (one person enjoying it doesn\'t reduce it for others) and non-excludable (everyone benefits regardless of who pays). The fair costs 50 gold and generates 80 gold of total value. If enough contribute, the fair happens and ALL benefit — even those who didn\'t pay. This creates the classic free rider problem.',
  choices: [
    { id: 'contribute', label: 'Contribute 10 Gold', description: 'Pay your fair share toward the town festival. The fair happens and everyone benefits.', risk: 'medium', tags: ['cooperate'] },
    { id: 'free', label: 'Free Ride', description: 'Don\'t contribute. If others pay, you still enjoy the fair. If nobody pays, there is no fair.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'Contributing is the cooperative choice. If everyone free rides, the fair doesn\'t happen and everyone loses the 80 gold of value. But individually, free riding is tempting: you get the benefit without the cost. This is the public goods dilemma. Against a mix of cooperators and defectors, your contribution increases the likelihood the fair happens. The optimal strategy depends on how many others contribute. In a one-shot game, there\'s always a temptation to free ride. In repeated interactions, reputation for cooperation matters.',
  analyze: (choice, aiChoice) => {
    const playerContributed = choice === 'contribute';
    const aiContributed = aiChoice === 'contribute';
    const totalContributors = (playerContributed ? 1 : 0) + (aiContributed ? 1 : 0);
    const fairHappens = totalContributors >= 1;
    const playerCost = playerContributed ? 10 : 0;
    const playerBenefit = fairHappens ? 20 : 0;
    const playerNet = playerBenefit - playerCost;

    if (playerContributed && aiContributed) {
      return `Both contributed. Fair happens! Your cost: 10 gold. Benefit: 20 gold. Net: +${playerNet}. The town thrives. This is the ideal public goods outcome: when everyone contributes their fair share, the public good is provided and everyone enjoys the surplus. But notice: each of you individually could have done better by free riding (saving 10 gold while still enjoying the fair). The public goods game is structurally similar to the Prisoner's Dilemma — individually rational free riding leads to collective failure. The fair's 80 gold of value was generated by 20 gold of contributions — a 300% social return.`;
    }

    if (playerContributed && !aiContributed) {
      return `You contributed. AI free rode. Fair happens (barely). Your cost: 10 gold. Benefit: 20 gold. Net: +${playerNet}. The AI got a benefit of 20 gold for free — the classic free rider. You made the fair possible but the AI reaped the reward without paying. This feels unfair, but in game theory terms, you both got +${playerNet} vs. the AI's +20. You might resent the free rider, but you still came out ahead of what would have happened if nobody contributed (0). The question: should you continue to contribute if you know others will free ride? In one-shot games, the temptation to free ride is hard to resist. In repeated games, you can punish free riders in future rounds.`;
    }

    if (!playerContributed && aiContributed) {
      return `You free rode. AI contributed. Fair happens. Your cost: 0 gold. Benefit: 20 gold. Net: +20 gold. You exploited the AI's cooperation. This is the free rider's payoff — maximum personal gain. But consider: if everyone reasoned as you did, the fair wouldn't happen and everyone would get 0. The public goods dilemma is that individual rationality (free ride) leads to collective disaster (no public good). In the real world, free riding explains why public radio struggles with funding, why voluntary vaccination falls short of herd immunity, and why taxation is mandatory rather than voluntary.`;
    }

    return `Neither contributed. No fair. Both get 0. This is the tragedy of the public goods game: individually rational choices (each chooses to free ride) produce a collectively worse outcome (no fair for anyone). The fair would have generated 80 gold of total value for a 50 gold investment — a clear social good. But without a mechanism to enforce contributions, the public good goes unprovided. This is why governments use taxes to fund roads, schools, and defense — purely voluntary systems of public goods provision tend to under-provide. The core lesson: when benefits are non-excludable, markets alone can't efficiently provide public goods.`;
  },
  agents: {
    thalia: { personality: 'trustBuilder', name: 'Merchant Thalia' },
  },
});

scenarioRegistry.register({
  id: 'the-fishing-lake',
  title: 'The Fishing Lake',
  era: 4,
  order: 35,
  concept: 'tragedyCommons',
  type: 'tragedy_commons',
  setup: (state) => {
    state.player.resources.gold = 50;
    state.player.resources.population = 100;
  },
  story: [
    { speaker: 'Elder Fisherman', text: 'The lake has fed our village for generations. But now every family sends more boats. The fish can\'t keep up.' },
    { speaker: 'Young Fisher Kael', text: 'If I don\'t take more fish, someone else will. The fish belong to whoever catches them.' },
    { speaker: 'Elder Fisherman', text: 'That\'s the problem. The lake is shared. Each family benefits fully from the fish they take, but the cost of depletion is shared by everyone. Every extra boat harms the whole village — but the benefit goes to just one family.' },
  ],
  context: 'The fishing lake is a common-pool resource: rivalrous (fish taken by one can\'t be taken by another) but non-excludable (anyone can fish). Each season, you choose to conserve (limit your catch) or take (fish as much as possible). The AI represents three other fishing families. If everyone conserves, the fish population sustains. If too many take excessively, the fishery collapses.',
  choices: [
    { id: 'conserve', label: 'Conserve (Limit Catch)', description: 'Fish sustainably. Take only what you need. Helps preserve the lake for future seasons.', risk: 'medium', tags: ['cooperate'] },
    { id: 'take', label: 'Take (Maximum Catch)', description: 'Fish as much as possible this season. Big short-term gain but depletes the resource.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'The optimal play depends on how many others cooperate. If most conserve, the lake thrives and taking is tempting (you get the benefit without paying the cost). If most take, the lake collapses anyway — taking is the only rational response. This is the tragedy of the commons: without regulation, each individual\'s rational self-interest leads to resource destruction. The only solutions are: (1) privatize the lake into individual plots, (2) regulate with catch limits enforced by the community, or (3) build norms of cooperation through repeated interaction.',
  analyze: (choice, aiChoice) => {
    const playerConserves = choice === 'conserve';
    const aiConserves = aiChoice === 'conserve';

    if (playerConserves && aiConserves) {
      return 'Both conserve. The lake thrives. Fish population regenerates. Everyone eats well year after year. Total: +4 each. This is the sustainable equilibrium. The lake has enough fish for everyone if each takes only their fair share. This demonstrates Elinor Ostrom\'s principles for managing common-pool resources: clear group boundaries, rules tailored to local conditions, collective choice arrangements, and monitoring. Ostrom won the Nobel Prize (2009) for showing that communities CAN sustainably manage commons without privatization or government regulation — through trust, communication, and graduated sanctions.';
    }

    if (playerConserves && !aiConserves) {
      return 'You conserved. AI took excessively. The lake depletes faster. You got +1 (conservation reward). AI got +5 (short-term gain). Your restraint is noble but ineffective alone — one family\'s conservation cannot offset another family\'s overfishing. This illustrates the core tragedy: the costs of overfishing are shared (everyone suffers depletion), but the benefits are private (the overfisher keeps all the extra fish). In game theory terms, "take" is the dominant strategy: it gives a higher payoff regardless of what others do. But when everyone follows the dominant strategy, the resource collapses and everyone loses. This is the tragedy of the commons in action. Real-world examples: overfishing of Atlantic cod (the Grand Banks collapse of 1992), deforestation of the Amazon, and groundwater depletion in the Ogallala Aquifer.';
    }

    if (!playerConserves && aiConserves) {
      return 'You took excessively. AI conserved. You got +5. AI got +1. You exploited their restraint for short-term gain. But the lake\'s fish population declines. If every family reasons as you did, the fishery collapses within a few seasons, leaving everyone with 0. The tragedy is that your individual gain today is tiny compared to the collective loss tomorrow. In the classic formulation by Garrett Hardin (1968): "Freedom in the commons brings ruin to all." Each herder adds one more animal to the common pasture, benefiting fully from the extra animal while the cost of overgrazing is shared by all. The rational choice for each individual leads to destruction for all.';
    }

    return 'Both took excessively. The lake collapses. Both get 0. This is the tragedy of the commons in its purest form: individually rational decisions (each family maximizes its catch) produce a collectively catastrophic outcome (the resource is destroyed). No one wanted this outcome. Each family would prefer sustainable use. But without coordination or enforcement, the dominant strategy for each is "take." This is NOT because people are greedy or irrational — it\'s the structural incentive: the benefit of overuse is private and immediate; the cost is shared and delayed. The solutions are well-understood: (1) create property rights (each family gets a private fishing plot), (2) impose and enforce catch limits, (3) build community governance systems as Ostrom described. The tragedy is not inevitable — it requires the right institutions.';
  },
  agents: {
    elder: { personality: 'longTermPlanner', name: 'Elder Fisherman' },
    kael: { personality: 'greedy', name: 'Young Fisher Kael' },
  },
});

scenarioRegistry.register({
  id: 'the-voting-reform',
  title: 'The Voting Reform',
  era: 4,
  order: 36,
  concept: 'voting',
  type: 'voting',
  setup: (state) => {
    state.player.resources.influence = 30;
  },
  story: [
    { speaker: 'Chancellor Pella', text: 'Our council is deadlocked. The current plurality system means the largest faction controls everything, while minority voices are silenced.' },
    { speaker: 'Councilor Vex', text: 'Every voting system has biases. Plurality favors large parties. Ranked-choice favors consensus candidates. Approval voting favors moderates. The system you choose determines who wins.' },
    { speaker: 'Your Advisor', text: 'This is a mechanism design problem, my lord. The voting rules determine the outcome. Choose wisely — the system you pick will shape policy for generations.' },
  ],
  context: 'The council needs a new voting system. Three factions compete: the Hawks (30% of voters), the Doves (35%), and the Merchants (35%). Each voting system produces different winners and different levels of voter satisfaction. You must choose the system — your choice affects which faction dominates and how representative the council will be.',
  choices: [
    { id: 'plurality', label: 'Plurality (First-Past-the-Post)', description: 'Each voter picks one candidate. Highest vote total wins. Simple, but can elect candidates with less than 50% support.', risk: 'medium', tags: ['medium'] },
    { id: 'ranked_choice', label: 'Ranked-Choice (Instant Runoff)', description: 'Voters rank candidates. Last-place eliminated, votes redistributed. More complex but ensures majority winner.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'approval', label: 'Approval Voting', description: 'Voters approve any number of candidates. Most approvals wins. Elects broadly acceptable candidates.', risk: 'medium', tags: ['cooperate'] },
  ],
  idealNote: 'Ranked-choice voting is generally the best system for ensuring majority support and minimizing strategic voting. Plurality is simple but vulnerable to vote-splitting and the "spoiler effect" — a third-party candidate can split the vote and let a candidate with minority support win. Approval voting elects broadly acceptable candidates but can be gamed strategically. Ranked-choice combines majority rule with the freedom to vote for a first choice without fear of wasting your vote. The mechanism design lesson: the rules of the game determine the outcome. Choose your voting system as carefully as you choose your policies.',
  analyze: (choice) => {
    if (choice === 'plurality') {
      return 'You chose plurality (first-past-the-post). With 30% Hawks, 35% Doves, 35% Merchants, no faction has a majority. Under plurality, the Merchants and Doves split the moderate vote, letting the Hawks win with just 30% support. The majority (65%) is unrepresented. This is the "spoiler effect": two similar candidates split the vote, letting an unpopular third win. Real-world examples: the 2000 US presidential election (Nader split the liberal vote, helping Bush win Florida), and the UK general elections where the Liberal Democrats win far fewer seats than their vote share. Plurality is simple but deeply flawed when more than two viable candidates exist.';
    }

    if (choice === 'ranked_choice') {
      return 'You chose ranked-choice voting (instant runoff). Voters rank candidates. The last-place candidate (Hawks, with 30%) is eliminated, and their votes are redistributed to second choices. If most Hawk voters prefer Merchants over Doves, the Merchants win with ~55% of the final vote. The winner has true majority support. Ranked-choice eliminates the spoiler effect and strategic voting — voters can honestly rank their preferences without fear of wasting their vote. Real-world examples: Australia, Ireland, and increasingly US cities like San Francisco and New York use ranked-choice. It produces more representative outcomes and reduces negative campaigning (candidates need second-choice votes, so they can\'t afford to alienate opponents\' supporters).';
    }

    return 'You chose approval voting. Each voter approves any number of candidates. The most approved candidate wins. In our three-faction council, the Doves and Merchants both appeal to moderates, so they\'d likely receive broad approval. The Hawks, being more extreme, receive fewer approvals. Outcome: a moderate (either Dove or Merchant) wins with broad but shallow support — many voters approve them, but few love them. Approval voting tends to elect centrists who offend no one. This is good for consensus but can suppress passionate minority viewpoints. Real-world users: the Society for Industrial and Applied Mathematics, the American Mathematical Society, and several political parties use approval voting for internal elections.';
  },
  agents: {
    pella: { personality: 'longTermPlanner', name: 'Chancellor Pella' },
  },
});

scenarioRegistry.register({
  id: 'the-guild-charter',
  title: 'The Guild Charter',
  era: 4,
  order: 37,
  concept: 'mechanismDesign',
  type: 'mechanism',
  setup: (state) => {
    state.player.resources.gold = 200;
    state.player.resources.influence = 40;
  },
  story: [
    { speaker: 'Guildmaster Irina', text: 'We are founding a new Merchant Guild to control trade along the Silver River. We need a charter — the rules that will govern us.' },
    { speaker: 'Master of Coin', text: 'The charter is a mechanism, my lord. Every rule creates incentives. Entry fees screen for wealthy members. Profit sharing aligns interests. Quality standards protect reputation. Open membership maximizes reach but dilutes quality.' },
    { speaker: 'Guildmaster Irina', text: 'Choose wisely. The charter we write today will determine whether our guild thrives or collapses.' },
  ],
  context: 'You are designing the charter (constitution) for the Silver River Merchant Guild. Each mechanism you choose creates different incentives and attracts different types of members. You must choose the primary mechanism that will define the guild\'s character and economic strategy.',
  choices: [
    { id: 'entry_fee', label: 'High Entry Fee', description: 'Charge 500 gold to join. Only wealthy merchants apply. Ensures quality but limits membership. Revenue funds guild operations.', risk: 'medium', tags: ['medium'] },
    { id: 'profit_sharing', label: 'Profit Sharing', description: 'Pool 20% of all profits and redistribute equally. Aligns incentives, rewards cooperation, and reduces inequality within the guild.', risk: 'low', tags: ['cooperate', 'safe'] },
    { id: 'quality_standards', label: 'Quality Standards', description: 'Mandatory minimum quality for all goods sold under guild mark. Protects reputation but raises costs and excludes small producers.', risk: 'medium', tags: ['cooperate'] },
    { id: 'open_membership', label: 'Open Membership', description: 'Anyone can join for 10 gold. Maximizes membership and reach but attracts low-quality merchants who damage the guild\'s reputation.', risk: 'high', tags: ['high'] },
  ],
  idealNote: 'Profit sharing is the strongest mechanism for long-term guild success. It creates aligned incentives: every member benefits when any member succeeds. High entry fees screen for wealthy members (a costly signal of commitment) but limit growth. Quality standards protect the brand but increase costs. Open membership maximizes short-term revenue but attracts free riders who damage the guild\'s reputation — a classic adverse selection problem. The best mechanism designs align individual incentives with collective welfare. Profit sharing does this most directly: when each member\'s reward depends on the group\'s success, cooperative behavior emerges naturally.',
  analyze: (choice) => {
    const insights = {
      entry_fee: 'You chose a high entry fee (500 gold). This is a "costly signaling" mechanism: only wealthy, committed merchants pay. The fee screens for financial quality (adverse selection solution) and funds guild operations. Result: a small guild of wealthy members with high trust. The downside: you exclude talented but capital-poor merchants. This mechanism works well for exclusive professional associations (like the New York Stock Exchange historically) but limits competition. The mechanism design principle: entry fees create a separating equilibrium where high-quality types join and low-quality types self-select out. The optimal fee balances the quality signal against the loss of potential talent.',
      profit_sharing: 'You chose profit sharing (20% pool redistributed equally). This is the strongest mechanism for aligning incentives. Every member benefits when any member succeeds — cooperation becomes individually rational. This transforms the guild from a collection of competing merchants into a cooperative enterprise. The mechanism reduces inequality (successful members subsidize struggling ones, stabilizing the guild) and incentivizes knowledge sharing (helping a colleague now means higher shared profits later). Real-world parallels: law firm partnerships, worker cooperatives, and profit-sharing plans like John Lewis Partnership. The downside: free rider problems (lazy members share equally in profits from hard workers). Best mitigated by combining profit sharing with peer monitoring and minimum contribution requirements.',
      quality_standards: 'You chose mandatory quality standards. This protects the guild\'s brand reputation — the "Silver River" mark becomes synonymous with quality. Customers pay a premium for guild-certified goods. The mechanism solves the "market for lemons" problem: without quality standards, low-quality goods would drive out high-quality ones (adverse selection). The cost: compliance burdens and exclusion of small producers. This mechanism is effective when the guild\'s reputation is its primary asset. Real-world examples: the "Made in Switzerland" label, ISO certification, and medieval guild hallmarking systems. The mechanism design insight: when quality is unobservable to buyers before purchase, third-party certification creates value for everyone.',
      open_membership: 'You chose open membership (10 gold entry fee). Mass membership generates short-term revenue but creates an adverse selection death spiral. Low-quality merchants flood in, damage the guild\'s reputation with substandard goods, and high-quality merchants leave because the guild mark no longer signals quality. This mirrors Akerlof\'s "Market for Lemons" — when buyers can\'t distinguish quality, the average quality drops, the price drops, and high-quality sellers exit. The guild collapses into irrelevance. Real-world examples: eBay\'s early quality problems, unregulated certification programs. The lesson: open membership without quality controls leads to a "race to the bottom." Mechanism design requires barriers to entry that preserve quality. Open membership only works when combined with strong enforcement of quality standards.',
    };
    return insights[choice] || 'Mechanism design is the art of writing rules that align individual incentives with collective welfare. The best mechanism depends on your goals: screening for quality, aligning cooperation, protecting reputation, or maximizing reach. Each creates tradeoffs.';
  },
  agents: {
    irina: { personality: 'longTermPlanner', name: 'Guildmaster Irina' },
  },
});

scenarioRegistry.register({
  id: 'the-new-road',
  title: 'The New Road',
  era: 4,
  order: 38,
  concept: 'networkEffects',
  type: 'network',
  setup: (state) => {
    state.player.resources.gold = 100;
  },
  story: [
    { speaker: 'Royal Surveyor', text: 'A new trade road through the Eastern Pass would cut travel time by half. But it only becomes valuable once enough merchants use it.' },
    { speaker: 'Merchant Lina', text: 'If I\'m the only one on the road, bandits will pick me off. But if everyone uses it, patrols make it safe and way stations make it profitable.' },
    { speaker: 'Your Advisor', text: 'This is a network effects problem, my lord. The road\'s value depends on how many use it. Early adopters take a risk. Late joiners benefit from an established network. But if nobody joins, the road is worthless.' },
  ],
  context: 'The Eastern Pass Road\'s value depends on the number of merchants using it. With few users: dangerous, few way stations, low profit. With many users: patrolled, well-supplied, highly profitable. You must decide when to join. The AI merchants make their own decisions based on risk tolerance.',
  choices: [
    { id: 'join_early', label: 'Join Early (Season 1)', description: 'Be among the first on the road. High risk of bandits and sparse amenities, but you establish trade relationships early.', risk: 'high', tags: ['high'] },
    { id: 'wait', label: 'Wait and Observe (Season 2)', description: 'Let others test the road first. If it proves viable, join later. Safer, but you lose first-mover advantage.', risk: 'medium', tags: ['medium'] },
    { id: 'dont_join', label: 'Don\'t Join', description: 'Stick to the old road. Slower but reliable. No exposure to network risk.', risk: 'low', tags: ['safe'] },
  ],
  idealNote: 'Waiting is the optimal balance. Early adopters face significant risk (bandits, no way stations) and rely on others also joining to create value. Late joiners benefit from the established network but missed the early relationships. Waiting lets you observe the network\'s growth and join once it crosses the critical mass threshold where the road becomes self-sustaining. The key concept from network effects theory: critical mass — the point at which the network becomes valuable enough to attract users on its own momentum. Below critical mass, the network may fail entirely.',
  analyze: (choice, aiChoice) => {
    const networkEffect = 'Network effects mean the road\'s value to each user increases as more users join. The road is worth: 1 gold × (number of users).';

    if (choice === 'join_early') {
      if (aiChoice === 'join_early') {
        return 'You joined early, and the AI joined early too! Both early adopters. The road gets a strong start. You faced some risk but established dominance on the route. Network effect: with both of you, the road is moderately safe and there\'s enough traffic for a basic way station. Your early position means you can offer guiding services to later joiners. This is the classic "first-mover advantage" in network industries: early adopters who help build the network capture disproportionate value. Real-world examples: early PayPal users who built the payment network, early Facebook users who created the social graph. The key is that early adoption is risky but positions you as a central node in the network.';
      }
      return 'You joined early. The AI waited. You\'re alone on the road. It\'s dangerous and barely profitable. You took the risk but the network didn\'t materialize. This is the danger of being an early adopter: if the network doesn\'t reach critical mass, your investment is wasted. In network economics, this is called a "startup problem" — the network has no value until it reaches a certain size, but people won\'t join until it has value. This chicken-and-egg problem is why many platform businesses fail. Real-world examples: Google+ couldn\'t overcome Facebook\'s existing network; early video phone services failed because too few people owned them. Lesson: timing entry into a network market requires judging whether the network will reach critical mass.';
    }

    if (choice === 'wait') {
      if (aiChoice === 'join_early') {
        return 'You waited. AI joined early. Season 2: the road has some traffic, a way station is being built, and bandits are fewer. You join a growing network without the early risks. This is often the optimal strategy — let the risk-tolerant pioneers prove the concept, then enter once the network has momentum. You pay a slight premium (established merchants already have relationships) but avoid the downside of a failed network. This mirrors the "fast follower" strategy in technology: let first movers test the market, then enter with a better product. Real-world examples: Google (not first search engine), Facebook (not first social network), Apple (not first smartphone).';
      }
      return 'You waited. The AI also waited. Nobody joined. The road remains empty and dangerous. In season 3, the project is abandoned. The network failed because neither party was willing to take the initial risk. This is a "network failure" — a potentially valuable network that never launched because early adopters wouldn\'t take the risk. This is the classic coordination problem of network effects: everyone would benefit if everyone joined, but no one wants to be first. Solving this requires a "big push" — a subsidy or guarantee that reduces early adopter risk. Real-world examples: governments subsidizing rural broadband (to solve the startup problem), Amazon subsidizing early Kindle content (to make the device valuable).';
    }

    return 'You didn\'t join. The old road is slow but reliable. You miss the potential benefits of the new road entirely. If the network succeeds, your competitors gain an advantage. If it fails, you\'ve made the safe choice. This is the "wait and see" strategy pushed to its extreme: you never commit to the network, so you never benefit from it either. ' + networkEffect + ' In network industries, the risk of not joining is that competitors who join early build relationships and market position that you can never catch up to. This is the "incumbent\'s dilemma": established players often miss network transitions (e.g., Nokia missing the smartphone transition, Blockbuster missing streaming). The optimal strategy depends on the probability that the network reaches critical mass. If P(success) × network_value > cost of early entry, join early. Otherwise, wait or skip.';
  },
  agents: {
    lina: { personality: 'riskAverse', name: 'Merchant Lina' },
  },
});

scenarioRegistry.register({
  id: 'the-bridge-toll',
  title: 'The Bridge Toll',
  era: 4,
  order: 39,
  concept: 'congestion',
  type: 'congestion',
  setup: (state) => {
    state.player.resources.gold = 50;
  },
  story: [
    { speaker: 'Caravan Master', text: 'Two bridges cross the river to the market. The Short Bridge: fast but narrow. When too many use it, everyone crawls. The Long Bridge: slow but never congested.' },
    { speaker: 'Trader Voss', text: 'Every merchant thinks "I\'ll take the Short Bridge — it\'s fine if just I use it." But when everyone thinks that, the Short Bridge is a parking lot.' },
    { speaker: 'Your Advisor', text: 'This is a congestion game, my lord. Each merchant chooses a route. Your travel time depends on how many others pick the same route. The individually optimal choice may not be the collectively optimal one.' },
  ],
  context: 'Two bridges to the market. The Short Bridge takes 1 minute in free flow, but 1 minute × (number of users) in congestion. The Long Bridge takes a constant 5 minutes regardless of usage. You must pick a bridge each day for 5 days. Other merchants make the same choice. Total travel time is the sum of all your waiting.',
  choices: [
    { id: 'short', label: 'Short Bridge', description: 'Fast if few use it, disastrous if many do. Time = 1 × users.', risk: 'medium', tags: ['high'] },
    { id: 'long', label: 'Long Bridge', description: 'Always 5 minutes. Reliable but slower when the Short Bridge is uncongested.', risk: 'low', tags: ['safe'] },
  ],
  idealNote: 'The optimal strategy depends on congestion levels. If Short Bridge has 3+ users, Long Bridge is faster. If 1-2 users, Short Bridge is faster. This is a classic congestion/El Farol Bar problem: the individually optimal choice depends on the aggregate choices of everyone. The Nash equilibrium occurs when enough people choose the Long Bridge to make both bridges equally attractive — this is the "Wardrop equilibrium" in traffic flow theory. The insight: when many people independently optimize, the system reaches a balance where no single user can improve their travel time by unilaterally switching — but the total travel time may still be higher than the socially optimal (cooperative) outcome.',
  analyze: (choice, aiChoice) => {
    const playerShort = choice === 'short';
    const aiShort = aiChoice === 'short';
    const totalShort = (playerShort ? 1 : 0) + (aiShort ? 1 : 0);
    const shortTime = totalShort; // 1 min per user
    const playerTime = playerShort ? shortTime : 5;
    const aiTime = aiShort ? shortTime : 5;

    const summary = `Short Bridge users: ${totalShort}. Short Bridge time: ${shortTime} min. Long Bridge time: 5 min. Your time: ${playerTime} min.`;

    if (playerShort && aiShort) {
      return summary + ' Both chose Short Bridge. Heavy congestion! 2 users × 1 min each = 2 min travel time — better than Long Bridge (5 min) but worse than if just one used it. This is the classic congestion externality: each additional user slows the bridge for everyone, but no individual considers this cost when choosing. In traffic economics, this is the "social cost" of congestion — the difference between the average cost (what each driver experiences) and the marginal cost (the additional delay caused to others). The optimal toll to internalize this externality would be 1 minute-equivalent per additional user.';
    }

    if (playerShort && !aiShort) {
      return summary + ' You chose Short Bridge (1 min). AI chose Long Bridge (5 min). You got there faster. Your individual choice was optimal given the AI\'s choice. This demonstrates the "selfish routing" outcome: when few people use the fast route, it IS faster. The problem is that each individual sees this and is tempted to switch, leading to the congested outcome. This is why real traffic systems oscillate: uncongested → more drivers switch → congested → some switch back → uncongested.';
    }

    if (!playerShort && aiShort) {
      return summary + ' You chose Long Bridge (5 min). AI chose Short Bridge (1 min). The AI got there faster. You sacrificed speed for reliability. In congestion games, the "safe" choice (Long Bridge) guarantees a fixed travel time regardless of others\' choices. This is attractive for risk-averse travelers. The Long Bridge is like taking the subway instead of driving: slower in ideal conditions, but predictable.';
    }

    return summary + ' Both chose Long Bridge. Short Bridge is empty. Travel time: 5 min each. You could have used Short Bridge in 1 minute! This is "over-congestion" on the safe route: fear of congestion on Short Bridge led everyone to the Long Bridge, leaving the Short Bridge underused. This is the opposite problem from the tragedy of the commons — here, too many people choose the safe option. In traffic theory, this is called "Braess\'s Paradox" in reverse: sometimes closing a road can improve travel times because it changes routing patterns. The lesson: in congestion games, individually rational choices don\'t guarantee efficient aggregate outcomes.';
  },
  agents: {
    voss: { personality: 'riskAverse', name: 'Trader Voss' },
  },
});

scenarioRegistry.register({
  id: 'the-public-library',
  title: 'The Public Library',
  era: 4,
  order: 40,
  concept: 'publicGoods',
  type: 'public_goods',
  setup: (state) => {
    state.player.resources.gold = 100;
  },
  story: [
    { speaker: 'Scholar Miriam', text: 'Our city needs a public library. A place where all citizens — rich and poor — can read, learn, and research. It would cost 200 gold to build and 20 gold per season to maintain.' },
    { speaker: 'Tax Collector', text: 'The treasury can cover half the cost. We need voluntary donations from the wealthy citizens to make up the rest.' },
    { speaker: 'Scholar Miriam', text: 'A library benefits everyone: literate citizens, educated workforce, cultural prestige. Even those who don\'t donate will benefit from it. That\'s why donations are voluntary — but also why donations fall short.' },
  ],
  context: 'The city needs 100 gold in voluntary donations to build a public library. The library is a public good: non-rivalrous (one person reading doesn\'t prevent another) and non-excludable (once built, anyone can use it). You and other wealthy citizens can donate. The total donations determine whether the library is built. Free riders benefit if it is built but pay nothing.',
  choices: [
    { id: 'donate_generously', label: 'Donate 50 Gold', description: 'A generous donation. Shows commitment to public good. Nearly ensures the library is built.', risk: 'medium', tags: ['cooperate'] },
    { id: 'donate_little', label: 'Donate 10 Gold', description: 'A token donation. You contribute something but mostly free ride on others.', risk: 'low', tags: ['medium'] },
    { id: 'dont_donate', label: 'Donate Nothing', description: 'Free ride completely. If the library is built, you enjoy it for free. If not, you pay nothing.', risk: 'high', tags: ['defect', 'high'] },
  ],
  idealNote: 'Donating generously (50 gold) is the cooperative ideal. Even if others under-contribute, your donation makes the library more likely. Donating little (10 gold) balances personal cost with some contribution — you\'re partially free riding. Donating nothing is pure free riding. The key insight from public goods theory: voluntary contributions almost always underfund public goods because each individual\'s incentive is to free ride. This is why public goods like libraries, schools, and defense are typically funded through mandatory taxation rather than voluntary donations. The gap between individual rationality (free ride) and collective welfare (contribute) is the public goods dilemma.',
  analyze: (choice, aiChoice) => {
    const playerDonation = choice === 'donate_generously' ? 50 : choice === 'donate_little' ? 10 : 0;
    const aiDonation = aiChoice === 'donate_generously' ? 50 : aiChoice === 'donate_little' ? 10 : 0;
    const totalDonations = playerDonation + aiDonation;
    const libraryBuilt = totalDonations >= 100;
    const playerBenefit = libraryBuilt ? 30 : 0;
    const playerNet = playerBenefit - playerDonation;

    const summary = `You donated ${playerDonation} gold. AI donated ${aiDonation} gold. Total: ${totalDonations}/100. Library built: ${libraryBuilt ? 'YES' : 'NO'}. Your net: ${playerNet >= 0 ? '+' : ''}${playerNet} gold.`;

    if (libraryBuilt && playerDonation >= 50) {
      return summary + ' The library is built! Your generous donation was crucial. Net: you got 30 gold value for 50 gold cost (-20 gold net), but the city gains a permanent institution that will educate generations. This is the "warm glow" of giving — you contributed beyond your personal benefit for the collective good. In public goods experiments (like the "public goods game" in behavioral economics), about 20-30% of participants contribute generously even in anonymous one-shot games. This suggests humans have an inherent cooperative tendency, not just rational self-interest. The library\'s social value (increased literacy, civic pride, economic growth) far exceeds the 100 gold cost — this is the "social surplus" generated by public goods provision.';
    }

    if (libraryBuilt && playerDonation === 10) {
      return summary + ' The library is built! You donated a token 10 gold and enjoyed 30 gold of benefits — you free rode on the AI\'s generous contribution. Net: +20 gold. You captured the free rider\'s surplus: all the benefit, little of the cost. But what if everyone donated like you? 10 × 10 from 10 wealthy citizens would only be 100 gold — exactly the target. In that case, token donations work. But if everyone donated 0, the library fails. The public goods game is a "social dilemma": individually optimal choices (free ride) lead to collectively suboptimal outcomes (no library). Real-world parallel: public radio fund drives — a minority of listeners contribute, the majority free ride, but the service survives because the contributors care enough.';
    }

    if (libraryBuilt && playerDonation === 0) {
      return summary + ' The library is built! You donated nothing and enjoy full benefits — the pure free rider. Net: +30 gold. Maximum personal gain. But your zero contribution matters: you shifted the burden entirely to others. In the real world, free riders are hard to detect (library use is anonymous), so you get away with it. But if too many people reason like you, the library won\'t be built. This is the fundamental tension of public goods: the rational individual maximizes their personal outcome by free riding, but everyone acting rationally destroys the public good. The free rider problem is why public goods are typically provided by taxation — it solves the dilemma by making contribution mandatory.';
    }

    if (!libraryBuilt && playerDonation >= 50) {
      return summary + ' Despite your generous donation, the library wasn\'t built. Your 50 gold wasn\'t enough — you needed 100 total. This illustrates the "minimum threshold" problem in public goods: contributions are wasted if the threshold isn\'t met. In mechanism design, this is why "conditional pledges" (I\'ll donate if enough others do) can help solve the threshold problem. Real-world example: Kickstarter campaigns use this model — pledges are only charged if the funding goal is met. This reduces the risk of contributing to a failed project.';
    }

    if (!libraryBuilt) {
      return summary + ' Library not built. Total contributions fell short. Your donation of ' + playerDonation + ' didn\'t help enough. This is the tragedy of the public goods problem: a socially valuable project (returns 30 gold per donor, for 100 gold cost = massive social surplus) fails because of collective inaction. Each individual correctly calculated: "My 10 gold won\'t make the difference, and I benefit if others pay." But when everyone calculates this way, nobody pays. This is why governments exist — to solve these collective action problems through mandatory contribution. The lesson: free riding is individually rational but collectively disastrous.';
    }

    return summary + ' The public library illustrates the fundamental challenge of public goods: non-excludable benefits mean free riding is tempting, but universal free riding means the good is never provided. Solutions include: taxation (mandatory contribution), privatization (make it excludable), or social norms (shame free riders).';
  },
  agents: {
    miriam: { personality: 'trustBuilder', name: 'Scholar Miriam' },
  },
});
