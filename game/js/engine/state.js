export function createInitialState() {
  return {
    player: {
      name: 'Haven',
      resources: {
        gold: 100,
        food: 500,
        population: 300,
        military: 50,
        influence: 30,
        knowledge: 10,
      },
      relationships: {},
      reputation: 50,
      discoveries: [],
      completedScenarios: [],
      stats: {
        scenariosPlayed: 0,
        choicesMade: [],
        cooperations: 0,
        defections: 0,
        retries: {},
      },
    },
    world: {
      factions: {},
      turn: 0,
      era: 1,
      currentScenario: null,
      currentRound: 0,
      multiRoundHistory: [],
    },
    history: [],
    settings: {
      difficulty: 'normal',
      soundEnabled: false,
      theme: 'dark',
      showTutorials: true,
    },
    meta: {
      version: '0.1.0',
      createdAt: null,
      updatedAt: null,
      playTime: 0,
    },
  };
}

export class GameState {
  constructor() {
    this.state = createInitialState();
    this._listeners = [];
    this._undoStack = [];
    this._maxUndo = 10;
  }

  get() { return this.state; }

  getPlayer() { return this.state.player; }

  getResources() { return this.state.player.resources; }

  getRelationships() { return this.state.player.relationships; }

  set(newState) {
    this._undoStack.push(JSON.parse(JSON.stringify(this.state)));
    if (this._undoStack.length > this._maxUndo) this._undoStack.shift();
    this.state = newState;
    this._notify();
  }

  update(path, value) {
    this._undoStack.push(JSON.parse(JSON.stringify(this.state)));
    if (this._undoStack.length > this._maxUndo) this._undoStack.shift();
    this._setNested(this.state, path, value);
    this._notify();
  }

  modifyResources(deltas) {
    const res = this.state.player.resources;
    for (const [key, delta] of Object.entries(deltas)) {
      if (res[key] !== undefined) {
        res[key] = Math.max(0, res[key] + delta);
      }
    }
    this._notify();
  }

  modifyRelationship(factionId, delta) {
    if (!this.state.player.relationships[factionId]) {
      this.state.player.relationships[factionId] = 0;
    }
    this.state.player.relationships[factionId] = Math.max(-100,
      Math.min(100, this.state.player.relationships[factionId] + delta)
    );
    this._notify();
  }

  addDiscovery(conceptId) {
    if (!this.state.player.discoveries.includes(conceptId)) {
      this.state.player.discoveries.push(conceptId);
      this._notify();
    }
  }

  completeScenario(scenarioId) {
    if (!this.state.player.completedScenarios.includes(scenarioId)) {
      this.state.player.completedScenarios.push(scenarioId);
    }
    this.state.player.stats.scenariosPlayed++;
    this._notify();
  }

  addToHistory(entry) {
    this.state.history.push({
      ...entry,
      turn: this.state.world.turn,
      timestamp: Date.now(),
    });
    this._notify();
  }

  undo() {
    if (this._undoStack.length === 0) return false;
    this.state = this._undoStack.pop();
    this._notify();
    return true;
  }

  canUndo() { return this._undoStack.length > 0; }

  onChange(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }

  reset() {
    this.state = createInitialState();
    this._undoStack = [];
    this._notify();
  }

  _setNested(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === undefined) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  _notify() {
    this.state.meta.updatedAt = Date.now();
    const snapshot = JSON.parse(JSON.stringify(this.state));
    for (const listener of this._listeners) {
      try { listener(snapshot); } catch (e) { console.error('State listener error:', e); }
    }
  }
}

export const gameState = new GameState();
