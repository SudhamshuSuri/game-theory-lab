# Sovereign: A Game of Strategy

A browser-based game that teaches game theory through play. Navigate 60+ scenarios across 6 eras, face AI opponents with distinct personalities, and discover concepts from the Prisoner's Dilemma to mechanism design — all without a single lecture.

## Setup

Sovereign is a pure client-side ES module app. It needs an HTTP server (ES modules don't work with `file://`):

```bash
# Python 3 (built-in)
python3 server.py 8080

# OR Node.js
npx serve .

# OR any static server
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

## How to Play

1. **New Game** — start fresh or **Continue** an auto-saved game
2. **Pick a scenario** from the Council map — each teaches one game theory concept
3. **Choose your strategy** — read the situation and commit
4. **See the outcome** — Victory, Defeat, or Mixed Outcome with resource changes
5. **Discover the theory** — after each scenario, a Discovery Card explains what you just experienced
6. **Explore more** — Sandbox mode to test strategies, Timeline to review decisions, Analytics to track trends

## Project Structure

```
game/
├── index.html            # Entry point (module script)
├── server.py             # Dev server (Python 3)
├── css/                  # Styles (main, components, animations)
├── js/
│   ├── main.js           # App init, game flow, save/load
│   ├── engine/           # State management, events, persistence
│   ├── ai/               # 13 AI personalities (titForTat, greedy, etc.)
│   ├── simulation/       # Payoff resolution for all game types
│   ├── scenarios/        # 60+ scenario definitions across 6 eras
│   ├── ui/               # All rendering (scenario, results, analytics, timeline)
│   ├── data/             # Concept library (46 concepts) and flavor text
│   └── analytics/        # Event tracking and reports
└── tests/
    └── test.js           # 54 automated tests
```

## Running Tests

```bash
node tests/test.js
```

## Design

- **Experience before label** — you play a Prisoner's Dilemma before learning its name
- **One concept per scenario** — each level isolates one strategic principle
- **AI personalities, not scripts** — opponents behave consistently across scenarios (alwaysCooperate, riskAverse, deceptive, etc.)
- **Failure teaches** — every loss explains the game theory behind what went wrong
- **All client-side** — zero dependencies, no build step, runs entirely in the browser

## AI Personalities

Always Cooperate, Always Defect, Tit-for-Tat, Grim Trigger, Random, Greedy, Risk Seeking, Risk Averse, Long-term Planner, Revenge Driven, Trust Builder, Opportunist, Deceptive

## Concepts Covered

Scarcity & Opportunity Cost, Prisoner's Dilemma, Tit-for-Tat, Zero-Sum vs Positive-Sum, Dominant Strategies, Nash Equilibrium, Stag Hunt, Chicken, Coordination Games, Commitment Problems, Moral Hazard, Signaling, Screening, Adverse Selection, Auctions (English, First-Price, Vickrey), Voting Systems, Public Goods, Network Effects, Bargaining, Minimax, Mechanism Design, and more across 6 eras.
