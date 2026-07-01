# Game Theory: A Practical Guide

_A living document generated from the codebase of Sovereign: A Game of Strategy — every concept below is backed by implemented payoff matrices, equilibrium logic, and resolution code._

---

## Era I: Foundations

### 1. Scarcity & Opportunity Cost

**The Empty Granary** — Every choice has a cost; there is no perfect option. Before strategic interaction with others, you must understand that resources are finite and tradeoffs are inescapable.

**Structure:** Single-player decision under scarcity. Food = 500, need 600 before resupply. Four options (ration, seize, expedition, borrow), each with deterministic resource changes. No opponent — this is purely about understanding that "the cost of something is what you give up to get it."

---

### 2. Prisoner's Dilemma (One-Shot)

**The Pirate's Offer** — The foundational game. Two prisoners, each chooses: cooperate (honor the split) or defect (betray).

| You \ AI | Honor | Betray |
|----------|-------|--------|
| **Honor** | 3, 3 | 0, 5 |
| **Betray** | 5, 0 | 1, 1 |

**Thresholds:** `player >= 3` → Victory, `player <= 1` → Defeat, else Mixed.

**Key insight:** Defect is the dominant strategy (5 > 3 when they honor; 1 > 0 when they betray). But mutual defection (1,1) is worse than mutual cooperation (3,3). Individual rationality produces collective disaster. The dilemma cannot be "won" in a one-shot game — the lesson is that the game itself is the problem.

---

### 3. Repeated Prisoner's Dilemma & Tit-for-Tat

**The Trade Route** — Same payoff matrix, but played over 7 rounds with a Tit-for-Tat AI. Cooperation becomes rational under the "shadow of the future." The four properties of successful reciprocal strategies: **Nice** (never defect first), **Provokable** (punish defection immediately), **Forgiving** (resume cooperation when they do), **Clear** (predictable pattern).

**Backward induction paradox:** In a finitely repeated game with known end, the unique subgame-perfect equilibrium is to defect every round. But in practice (and in Axelrod's tournaments), Tit-for-Tat dominates.

---

### 4. Coordination Games & Zero-Sum Thinking

**The Border Dispute** — A coordination game against an Always Defect AI. If both pick the same action, both get 5; if different, both get 0. But the AI always picks "fight." This creates a tension: the formal equilibrium is fight-fight (score 5), but the lesson condemns war. Teaches that opponent type matters more than the game's formal structure.

**Threshold:** `player >= 5` → Victory (only fight-fight); everything else → Defeat.

---

### 5. Dominant Strategy & Bertrand Competition

**The Market Square** — Three-tier pricing game (High/Medium/Low) against a Greedy AI that always picks Low. The full 3×3 payoff matrix:

| You \ AI | High | Medium | Low |
|----------|------|--------|-----|
| **High** | 4, 4 | 2, 6 | 1, 7 |
| **Medium** | 6, 2 | 3, 3 | 1, 5 |
| **Low** | 7, 1 | 5, 1 | 0, 0 |

Against a Greedy AI (always Low), your maximum score is 1 — you cannot win. This is the Bertrand trap: when competitors undercut each other to the marginal cost, everyone loses.

**Thresholds:** `player >= 5` → Victory, `player <= 0` → Defeat, else Mixed.

---

## Era II: Repetition & Reputation

### 6. Repeated Games & Grim Trigger

**The Trade Route Returns** — 10-round repeated PD against a Grim Trigger AI. Grim Trigger cooperates until you defect once, then defects forever. One mistake destroys all future cooperation. The total value of mutual cooperation (10 × +3 = +30) vastly exceeds the one-time gain from a single defection (+5). Teaches that in long-term relationships, the shadow of the future makes cooperation rational — but Grim Trigger is brittle.

### 7. Principal-Agent Problem

**The Mercenary Contract** — Payment structure determines agent behavior. Three options:
- **Upfront:** Moral hazard — agent has no incentive after being paid.
- **Performance pay:** All risk on the agent; may be inefficient.
- **Mixed (salary + bonus):** The Goldilocks solution — aligns incentives while sharing risk.

**Key concept:** When effort is unobservable, the contract structure determines behavior. Optimal compensation balances incentive alignment with risk sharing.

### 8. Moral Hazard

**The Tax Farmer** — Tax farming: the collector pays upfront for collection rights, then overtaxes because they bear no cost. Solutions:
- **Oversight** → Victory (monitoring prevents abuse)
- **Salary** → Mixed (no incentive alignment)
- **Tax Farming** → Defeat (pure moral hazard)

### 9. Credible Commitment

**The Hostage Exchange** — A promise is only credible if the cost of breaking it exceeds the benefit. Sending a real hostage makes peace credible (your relative's life is at stake). Sending a fake is discovered. Refusing means no peace.

**Three scenarios on credible commitment:**
- **Hostage Exchange** (diplomatic): Strength through skin in the game
- **The Wedding Pact** (marital): Symmetric bonds are strongest
- **The Siege** (military): Without enforcement, mutually beneficial agreements fail

The meta-lesson: **"a promise is only as credible as the penalty for breaking it."**

### 10. Adverse Selection & Screening

**The Royal Surveyor** — The "market for lemons" problem in hiring: low-quality candidates are over-represented because the best have better options. Solutions:
- **Written test:** Screens for knowledge, not skill
- **Reference check:** Unreliable (past employers have incentives to lie)
- **Trial period:** The gold standard — reveals actual ability through real work
- **Oath:** Cheap talk — reveals nothing

### 11. Tournament of Strategies (Capstone)

**The Tournament of Strategies** — Simulates Robert Axelrod's IPD tournament. Five opponents, round-robin, 10 rounds each.

| Strategy | Score | Outcome | Why |
|----------|-------|---------|-----|
| Tit-for-Tat | ~117 | Victory | Nice, provokable, forgiving, clear |
| Generous TFT | ~116 | Victory | Same, but forgiveness helps in noise |
| Grim Trigger | ~111 | Mixed | Brittle vs random opponents |
| Always Defect | ~113 | Mixed | Wins rounds, loses tournament |
| Always Cooperate | ~106 | Mixed | Exploited by defectors |
| Random | ~83 | Defeat | Inconsistent, cannot sustain cooperation |

The grand lesson of Era II: **the best strategies for repeated interaction are nice but not naive, provokable but forgiving, and above all clear.**

---

## Era III: Uncertainty & Information

### 12. Bayesian Games

**The Hidden Army** — You don't know if General Varn's army is strong or weak (50/50 prior). Scouts provide a 70% accurate signal. You must compute posterior probabilities using Bayes' Theorem.

| Choice | Strong (50%) | Weak (50%) | Expected Value |
|--------|-------------|------------|----------------|
| Attack | -5 | +5 | 0 |
| Negotiate | -2 | +3 | +0.5 |
| Fortify | +1 | 0 | +0.5 |

With `P(strong) = 0.5`, the EV of attack is 0 even before scout costs. After "scout says strong," posterior `P(strong|signal) = (0.7 × 0.5) / (0.7×0.5 + 0.3×0.5) = 0.7` — still not enough to make attack rational (EV = -2.0). Fortify is the maximin (safest) choice.

**Key formula:** `P(type|evidence) = P(evidence|type) × P(type) / P(evidence)`

### 13. Costly Signaling

**The Peacock's Tail** (Spence, 1973) — A signal is informative only if it costs less for high-quality types than low-quality types. Demanding an expensive gift separates wealthy merchants from poor ones: the wealthy pay 200g for a charter worth 1000g (net +800g); the poor reveal their type by not being able to afford it. Token gifts and no gifts create **pooling equilibria** where no information is conveyed.

**Real-world:** College degrees, luxury advertising, warranties, expensive weddings.

### 14. Screening Mechanisms

**The Job Interview** — The uninformed party (employer) designs a test that separates types by imposing differential costs. A rigorous design challenge separates competent from incompetent candidates. Probation also works but costs more (salary during trial). Easy tests and interviews create pooling equilibria — everyone passes, nothing is revealed.

### 15. Chicken

**The Bridge Standoff** — Two players, mutual advance = catastrophe. Pure-strategy Nash equilibria: (Advance, Retreat) and (Retreat, Advance). The winner is the one who can credibly commit to not swerving. Against a risk-seeking opponent, advancing is optimal if you can make your commitment credible.

**Thresholds:** `player >= 4` → Victory, `player == 2` → Mixed, else Defeat.

### 16. Coordination & Focal Points

**The Festival Date** — When players want to match actions, any salient solution (focal point) resolves the coordination problem. All coordinated outcomes are Nash equilibria; the focal point selects among them. **Coordinated** → Victory, **Miscoordinated** → Defeat.

**Real-world:** Driving on the right, meeting at "the clock tower," standards adoption.

### 17. Bayesian Games with Information Acquisition

**The Spy Game** — Prior: 40% spy, 60% genuine. Trusting a genuine diplomat is great (+3), trusting a spy is disastrous (-5). EV of trust = 0.6 × 3 + 0.4 × (-5) = **-0.2** — negative! Purchase information (investigation) to update beliefs.

**The Informant** (Scenario 30) — Informant is 60% truthful. Prior attack probability = 50%. After informant says "attack coming," posterior = `(1.0 × 0.5) / (0.6 × 1.0 × 0.5 + 0.4 × 0.5 × 0.5) = 62.5%` — not enough to act on alone. Verification (sending scouts) transforms this into near-certainty.

### 18. The Market for Lemons (Akerlof, 1970)

**The Market for Lemons** — When buyers cannot distinguish quality, the price reflects average quality. This drives out high-quality sellers, crashing the market. The only Nash equilibrium is **market collapse**. Solution: warranties (screening mechanism that only high-quality sellers can afford).

---

## Era IV: Markets & Mechanism

### 19. Auction Theory

**Three auction formats, three lessons:**

| Auction | Format | Optimal Strategy | Pitfall |
|---------|--------|-----------------|---------|
| The Spice Auction | English (ascending) | Bid up to true value (7), then stop | Winner's curse: overpaying |
| The Silent Bids | First-price sealed-bid | Shade bid below true value | Overbidding destroys profit |
| The Treasury Bonds | Vickrey (second-price) | Bid truthfully (dominant strategy) | Over/under-bidding can only hurt |

**The Spice Auction:** `playerBid > spiceValue (7)` → you win but **lose** (winner's curse). Losing the auction is actually Victory if it means you avoided overpaying — a deliberate inversion to teach that "losing can be winning."

**The Treasury Bonds (Vickrey):** In a second-price sealed-bid auction, truthful bidding is a **dominant strategy** — your bid determines only whether you win; the second price determines what you pay. This is the Revelation Principle in action.

### 20. Public Goods & Free Riding

**The Town Fair** — 2 players, each contributes 10 or free rides. Fair happens if at least 1 contributes. Free riding is dominant, but universal free riding means no fair. This is structurally identical to the Prisoner's Dilemma.

**Resolution formula:** `totalPool × 0.6` returned to each player. Victory requires `totalPool >= 3` (3+ contributors) — only possible with multiple AI agents.

**The Public Library** — Adds a threshold mechanism (need 100 gold total) and multiple contribution levels (50, 10, 0). The threshold problem means contributions can be wasted if the goal isn't met. Conditional pledges (like Kickstarter) solve this.

### 21. Tragedy of the Commons (Hardin, 1968)

**The Fishing Lake** — Multi-agent (3 players: you + Elder + Kael). Resource health = `100 - overused × 25`. Each "take" reduces health by 25. Take is the dominant strategy: you get +30 vs +10 for conserve. But if everyone takes, the resource collapses.

**Thresholds:** `resourceHealth > 50` → Mixed, else Defeat. (Victory is impossible in this model — even sustainable use only achieves Mixed.)

### 22. Mechanism Design: Voting Systems

**The Voting Reform** — Three systems, same voter preferences (Hawks 30%, Doves 35%, Merchants 35%):

| System | Winner | Why |
|--------|--------|-----|
| Plurality | Hawks (30%) | Spoiler effect — minority wins |
| Ranked-choice | Doves (35%) | Majority support after redistribution |
| Approval | Centrist | Broad but shallow support |

**Arrow's Impossibility Theorem:** No ranked voting system can simultaneously satisfy Pareto efficiency, independence of irrelevant alternatives, and non-dictatorship. Every system makes different tradeoffs.

### 23. Mechanism Design: Charter Design

**The Guild Charter** — Four institutional designs:

| Charter | Outcome | Mechanism |
|---------|---------|-----------|
| Profit sharing | Victory | Incentive alignment |
| Entry fee | Mixed | Costly screening |
| Quality standards | Mixed | Third-party certification |
| Open membership | Defeat | Adverse selection death spiral |

### 24. Network Effects & Critical Mass

**The New Road** — Network value = 1g × users. The network needs both users to succeed. Early joiners bear risk; late joiners benefit from established value but miss first-mover advantages. The coordination problem: will enough people join?

### 25. Congestion Games & Selfish Routing

**The Bridge Toll** — Short Bridge time = 1 min × users; Long Bridge = constant 5 min. The Wardrop equilibrium: users distribute until both bridges are equally attractive. But individual optimization produces collectively inefficient congestion. Congestion pricing (tolls) can internalize the externality.

---

## Era V: Society & Evolution

### 26. Stag Hunt (Assurance Game)

**The Great Hunt** — Two Nash equilibria: (Stag, Stag) is Pareto-superior (+5 each); (Hare, Hare) is risk-dominant (+2 each, guaranteed). Unlike Prisoner's Dilemma, defection doesn't harm cooperators — it just makes cooperation impossible. The barrier is **lack of assurance**, not temptation.

| You \ AI | Stag | Hare |
|----------|------|------|
| **Stag** | 5, 5 | 0, 2 |
| **Hare** | 2, 0 | 2, 2 |

### 27. Mixed Strategies

**The Rock-Paper-Scissors Tournament** — No pure-strategy Nash equilibrium. The unique mixed-strategy Nash equilibrium is to play each move with exactly 1/3 probability. Any deviation creates an exploitable pattern. The AI detects and exploits non-uniform strategies.

### 28. Evolutionary Game Theory

**The Evolving Population** — Three strategies compete in a population:

| Strategy | vs Hawk | vs Dove | vs Bourgeois | ESS? |
|----------|---------|---------|-------------|------|
| Hawk | -2 | +3 | Variable | **No** — crashes when common |
| Dove | 0 | +2 | 0 | **No** — invadable by Hawk |
| Bourgeois | Variable | +2 | +2 | **Yes** — property rights emerge |

**Bourgeois** is the unique Evolutionarily Stable Strategy (ESS). The "resident wins" convention emerges naturally from evolutionary dynamics, explaining why property rights are observed across animal species.

### 29. Coalition Games & Nash Equilibrium

**The Three Kingdoms** — Three-player coalition game. Any two allied kingdoms can defeat the third. Every bilateral alliance is a Nash equilibrium (neither ally can improve alone; the excluded party cannot improve alone). The grand coalition is NOT a Nash equilibrium (any one kingdom can defect to form a bilateral alliance and gain more). **Stability ≠ fairness.**

### 30. Bargaining: BATNA, ZOPA & Surplus Division

**The Salary Negotiation** — Elara's BATNA = 150 gold (outside offer). Your BATNA = 80 gold (lesser architect). ZOPA = [150, value Elara adds]. 
- 80 offer: Below reservation → rejected, Defeat
- 120 offer: Within ZOPA but below reservation → likely rejected
- **160 offer**: Above reservation, captures surplus → Victory
- 200 offer: Full demand → Mixed (zero surplus captured)

**The Peace Treaty** — Splitting 100 units. Sum ≤ 100 = peace; > 100 = war (costly delay). The 50/50 split is the **focal point** (Nash Bargaining Solution for symmetric players).

### 31. Security Dilemma

**The Arms Race** — Structured as a Prisoner's Dilemma with an escape hatch (diplomacy + verification). Mutual armament is the Nash equilibrium of the one-shot game (costly but secure). Mutual disarmament is Pareto-optimal but not Nash. **Diplomacy transforms the game** from PD into a coordination game where both prefer cooperation — but only if backed by verification.

Key lesson: "Speak softly and carry a big stick" — diplomacy works best when backed by credible deterrent capability.

### 32. Matching Theory (Gale-Shapley)

**The Marriage Market** — 3 doctors + 3 hospitals with strict preference rankings. The Deferred Acceptance algorithm always produces a stable matching (no blocking pairs). The proposing side gets their BEST stable matching; the receiving side gets their WORST. This is a **policy choice**, not a technical one — which is why the NRMP (medical residency match) uses doctor-proposing.

### 33. Constitution as Mechanism Design

**The Constitution Convention** — Four constitutional designs, each with different incentive properties:

| Constitution | Voting | Tax | Military | Trade | Outcome |
|-------------|--------|-----|----------|-------|---------|
| Federal | Weighted | 10% | Proportional | Open | **Victory** — incentive-compatible |
| Confederal | Unanimous | 5% | Voluntary | Bilateral | Mixed — gridlock, free riding |
| Unitary | One-vote | 20% | Mandatory | Centralized | Mixed — majority tyranny |
| Minimal | None | 0% | None | None | Defeat — state of nature |

The Federal Constitution passes three tests: (1) incentive compatibility, (2) budget balance, (3) aligned incentives. Mirrors the US Constitution (1787) vs. the Articles of Confederation (1781-1789).

---

## Era VI: Mastery & Synthesis

### 34. Behavioral Game Theory

**The Ultimatum** — Split 10 gold. Subgame-perfect equilibrium: offer 1, they accept (1 > 0). But humans consistently reject offers below 30% — they pay to punish unfairness. The AI with "fair" personality rejects offers of 1-2 gold. This is the most famous empirical falsification of the Homo economicus model.

### 35. Sequential Games & Backward Induction

**The First Mover** — Solve from the end: What will the second mover do? Given that, what should the first mover do? **First-mover advantage** (commitment power) vs. **second-mover advantage** (informational flexibility). Applied to entry deterrence, Stackelberg competition.

### 36. Minimax Theorem (von Neumann, 1928)

**The Chess Match** — Against a perfect opponent, assume they will exploit every weakness. Choose the move whose worst-case outcome is highest (maximin). Fortifying guarantees 0 loss. Attacking is always countered. The minimax theorem guarantees that in any finite zero-sum game, there exists a value V such that the maximin and minimax coincide.

### 37. Voting Theory & Arrow's Theorem

**The Election** — Three candidates (Centrist 35%, Progressive 33%, Traditionalist 32%). Your faction prefers the Progressive. The voting system determines the winner. Arrow proved that no ranked voting system is "perfect" — every system makes different tradeoffs between simplicity, sincerity, inclusiveness, and consensus.

### 38. Matching: Who Proposes Matters

**The Hospital Match** — Gale-Shapley with doctors vs. hospitals proposing yields the same matching in this example (because preferences happen to align). But in general, "who proposes" determines whose preferences are prioritized. The NRMP uses doctor-proposing because it's a policy choice to favor doctors.

### 39. Multi-Issue Bargaining & Logrolling

**The Treaty of Havencord** — Four issues, three kingdoms. The Grand Bargain links all issues, allowing each party to concede on low-value issues for gains on high-value ones. This "expands the pie." Sequential bilateral deals create contradictions (contradictory commitments). Pure claiming (dominate) destroys value. The lesson: in multi-issue negotiations, **never negotiate issue-by-issue.**

### 40. Goodhart's Law & AI Alignment

**The AI's Objective** — "When a measure becomes a target, it ceases to be a good measure." Single-metric optimization is catastrophic when the optimizer is powerful:
- **Profit-only**: Exploitation, fraud, long-term collapse
- **Customer satisfaction**: Bankrupt giving away free products
- **Employee welfare**: Wonderful workplace, unsustainable costs
- **Balanced (40% profit, 25% satisfaction, 20% welfare, 15% environment)**: Sustainable — countervailing incentives prevent gaming

This connects directly to the principal-agent problem (Era II), amplified by superintelligence.

### 41. Network Topology: Efficiency vs. Resilience

**The Supply Chain** — Network design tradeoffs:

| Topology | Efficiency | Resilience | Failure Mode |
|----------|-----------|------------|-------------|
| Hub-and-spoke | High | Low | Single point of failure |
| Point-to-point | Very low | High | Complexity costs exceed marginal resilience |
| Mesh | Low | Very high | Congestion, routing complexity |
| **Redundant hubs** | High | High | **Optimal — sweet spot** |

The betweenness centrality of the hub in hub-and-spoke = 1.0: every path goes through it. One flood shuts down everything.

### 42. Platform Design & the Myth of Neutrality

**The Social Platform** — Engagement optimization creates a toxic cascade (outrage drives clicks, polarization increases, quality users leave, algorithm promotes even more extreme content). The hands-off approach is not neutral — it empowers the loudest, most extreme voices. The balanced approach is "Tit-for-Tat" of platform governance: not too trusting, not too aggressive.

### 43. Mechanism Choice for Public Goods

**The Carbon Tax** — Four mechanisms for reducing emissions:

| Mechanism | Efficiency | Certainty | Political |
|-----------|-----------|-----------|-----------|
| Carbon tax | High | Price | Hard |
| Cap-and-trade | Medium | Quantity | Medium |
| Subsidies | Low | Low | Easy |
| Voluntary | None | None | Easiest |

The Weitzman "Prices vs. Quantities" result: carbon tax gives price certainty but uncertain quantities; cap-and-trade gives quantity certainty but price volatility.

### 44. The Blockchain Trilemma

**The Distributed Ledger** — No consensus protocol can maximize all three of: **security, speed, decentralization.** You must sacrifice at least one.

| Protocol | Security | Speed | Decentralization | Tradeoff |
|----------|----------|-------|-----------------|----------|
| Proof-of-Work | High | Low (~7 TPS) | High | Energy-intensive |
| Proof-of-Stake | Medium | Medium (~1,000 TPS) | High | Economic security |
| DPoS | Medium | High (~10,000 TPS) | Low | Elected oligarchy |
| Proof-of-Authority | Medium | Very high (~100k TPS) | Very low | Permissioned |

### 45. Ostrom's 8 Design Principles (Capstone)

**The Tragedy Revisited** — Elinor Ostrom (Nobel 2009) proved the tragedy of the commons is NOT inevitable. Her 8 design principles for successful commons governance:

1. **Clearly defined boundaries** — who can use the resource
2. **Proportional equivalence** — benefits match costs
3. **Collective-choice arrangements** — users participate in rule changes
4. **Monitoring** — by the community, not external authorities
5. **Graduated sanctions** — from mild to severe
6. **Conflict-resolution mechanisms** — low-cost dispute resolution
7. **Minimal recognition of rights** — external authorities don't override
8. **Nested enterprises** — governance at multiple scales

**Score: 10/10** — the highest in the entire game. Community management beats privatization (Coase) and regulation (Hardin) when these conditions hold.

### 46. Society Designer (Final Synthesis)

**The Society Designer** — 100 AI agents with diverse personalities live for 50 turns in the society you design. Eight policy dimensions (voting, economy, tax, justice, education, military, trade, immigration), five comprehensive packages.

| Design | Growth | Equality | Cooperation | Stability | Outcome |
|--------|--------|----------|-------------|-----------|---------|
| Liberal Democracy | 4.2× GDP | Gini 0.32 | 72% | High | **Victory** |
| Social Democracy | 3.8× GDP | Gini 0.26 | 85% | High | **Victory** |
| Libertarian | 4.2× GDP | Gini 0.62 | Low | Low | Mixed |
| Authoritarian | 2.5× GDP | N/A | Fear-based | Fragile | Defeat |
| Utopian | 1.5× GDP | Perfect | Collapsing | Collapse | Defeat |

**The final lesson:** There is no perfect system — only better and worse tradeoffs. The art of strategy is understanding how rules shape behavior, how incentives drive outcomes, and how the structure of interaction determines the fate of all who play. **You graduate from player to designer.**

---

## Appendix: Core Payoff Matrices

### Prisoner's Dilemma
```
           Opponent cooperates    Opponent defects
You coop       3, 3                 0, 5
You defect     5, 0                 1, 1
```
**Conditions for PD:** T > R > P > S and (T+S)/2 < R

### Chicken
```
           Opponent swerves    Opponent holds
You swerve      2, 2             1, 4
You hold        4, 1            -10, -10
```

### Stag Hunt
```
           Opponent stag    Opponent hare
You stag       5, 5            0, 2
You hare       2, 0            2, 2
```

### Coordination Game
```
           Opponent matches    Opponent mismatches
You match        5, 5                0, 0
You mismatch     0, 0                0, 0
```

### Vickrey Auction
- **Dominant strategy:** Bid your true value
- **Payment:** Second-highest bid (not your own)
- **Result:** Truthful bidding is optimal

### Tragedy of the Commons
- `resourceHealth = 100 - overused × 25`
- Mixed if `resourceHealth > 50`, Defeat otherwise
- Victory requires zero overuse (all conserve)

---

## Appendix: Outcome Threshold Reference

| Type | Victory | Mixed | Defeat |
|------|---------|-------|--------|
| prisoners_dilemma | >= 3 | 2 | <= 1 |
| market | >= 5 | 1-4 | <= 0 |
| stag_hunt | >= 5 | 2-4 | <= 1 |
| chicken | >= 4 | = 2 | <= 0 |
| coordination | >= 5 | — | < 5 |
| public_goods | totalPool >= 3 | totalPool >= 2 | totalPool < 2 |
| tragedy_commons | — | health > 50 | health <= 50 |
| ultimatum | > 3 (accepted) | > 0 | = 0 (rejected) |
| auction | payoff > 5 | payoff > 0 | payoff <= 0 |
| default | — | always | — |

---

## Appendix: AI Personalities

| Personality | Behavior | Found In |
|-------------|----------|----------|
| Always Cooperate | Always cooperates | Era I |
| Always Defect | Always defects | Eras I-VI |
| Tit-for-Tat | Mirrors last move | Era I, V |
| Grim Trigger | Cooperates until defected on, then defects forever | Era II |
| Greedy | Always picks the exploitative choice | Eras I-VI |
| Opportunist | Cooperates first, may defect if player is predictable | Era II, IV |
| Trust Builder | Cooperates first; retaliates if betrayed | Era II, IV, V |
| Risk Averse | Always picks the safe choice | Era IV, V |
| Risk Seeking | Always picks the risky choice | Era III |
| Long Term Planner | Cooperates if recent cooperation > 60% | Eras I-VI |
| Deceptive | Appears cooperative, defects when undetected | Era II |
| Fair | Rejects unfair offers (< 30%) | Era VI |
| Minimax | Perfect play — maximizes minimum | Era VI |
