# Sovereign: A Game of Strategy

The game that teaches game theory through play.

## Quick Start

```bash
# Start the development server
python3 server.py 8080

# Open in your browser
# http://localhost:8080
```

## How to Play

1. Click **New Game** on the title screen
2. Choose a scenario from the Council map
3. Read the situation and choose your strategy
4. See the consequences — victory, defeat, or mixed outcome
5. After experiencing a concept, receive a **Discovery Card** explaining what you learned
6. Progress through 60+ scenarios across 6 eras

## Architecture

```
game/
├── index.html           # Entry point
├── server.py           # Development server
├── css/
│   ├── main.css        # Core styles
│   ├── components.css  # UI component styles
│   └── animations.css  # Animations
├── js/
│   ├── main.js         # App initialization and game flow
│   ├── engine/         # Core engine (state, events, storage)
│   ├── ai/             # AI personalities and decision engine
│   ├── simulation/     # Payoff calculation and resolution
│   ├── scenarios/      # Scenario registry and definitions
│   ├── ui/             # UI components and rendering
│   ├── data/           # Concept library and flavor text
│   └── analytics/      # Learning analytics tracker
└── tests/
    └── test.js         # Automated tests (54 test cases)
```

## Running Tests

```bash
node tests/test.js
```

## Key Design Principles

- **Gameplay first** — never interrupt play for lectures
- **Discovery over explanation** — experience concepts before they're named
- **One concept per scenario** — each level teaches one strategic principle
- **Failure is educational** — every loss carries information
- **Emergence beats scripting** — AI personalities, not scripts

## Concepts Taught (MVP: Era I)

1. Scarcity & Opportunity Cost
2. Prisoner's Dilemma
3. Tit-for-Tat (Repeated Games)
4. Zero-Sum vs Positive-Sum
5. Dominant & Dominated Strategies

## AI Personalities

- Always Cooperate, Always Defect
- Tit-for-Tat, Grim Trigger
- Random, Greedy
- Risk Seeking, Risk Averse
- Long-term Planner, Revenge Driven
- Trust Builder, Opportunist
- Coalition Former, Deceptive
