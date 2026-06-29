import { events } from './events.js';
import { gameState } from './state.js';

export class GameEngine {
  constructor() {
    this._running = false;
    this._frameId = null;
    this._lastTime = 0;
    this._startTime = 0;
  }

  init() {
    this._startTime = Date.now();
    this._running = true;
    events.emit('engine:init', { timestamp: this._startTime });
    this._loop();
  }

  _loop() {
    if (!this._running) return;
    const now = Date.now();
    const delta = now - this._lastTime;
    this._lastTime = now;
    const state = gameState.get();
    state.meta.playTime += delta;
    events.emit('engine:tick', { delta, timestamp: now });
    this._frameId = requestAnimationFrame(() => this._loop());
  }

  startScenario(scenarioId) {
    events.emit('scenario:start', { scenarioId });
  }

  resolveTurn(playerChoice, scenario) {
    const aiChoices = {};
    for (const [agentId, agent] of Object.entries(scenario.agents)) {
      aiChoices[agentId] = agent.decide(playerChoice, gameState);
    }
    const result = scenario.resolve(playerChoice, aiChoices, gameState);
    gameState.modifyResources(result.resourceChanges || {});
    if (result.relationshipChanges) {
      for (const [faction, delta] of Object.entries(result.relationshipChanges)) {
        gameState.modifyRelationship(faction, delta);
      }
    }
    gameState.addToHistory({
      scenario: scenario.id,
      playerChoice,
      aiChoices,
      outcome: result.outcome,
      resourceChanges: result.resourceChanges,
    });
    events.emit('scenario:resolve', {
      scenarioId: scenario.id,
      playerChoice,
      aiChoices,
      result,
    });
    return result;
  }

  resolveMultiRoundTurn(playerChoice, scenario) {
    const state = gameState.get();
    const round = state.world.currentRound || 0;
    const history = state.world.multiRoundHistory || [];
    const aiChoices = {};
    for (const [agentId, agent] of Object.entries(scenario.agents)) {
      aiChoices[agentId] = agent.decide(playerChoice, gameState, round, history);
    }
    const result = scenario.resolve(playerChoice, aiChoices, gameState, round, history);
    gameState.modifyResources(result.resourceChanges || {});
    if (result.relationshipChanges) {
      for (const [faction, delta] of Object.entries(result.relationshipChanges)) {
        gameState.modifyRelationship(faction, delta);
      }
    }
    const roundResult = {
      round,
      playerChoice,
      aiChoices,
      result,
      resourceChanges: result.resourceChanges,
    };
    history.push(roundResult);
    gameState.update('world.currentRound', round + 1);
    gameState.update('world.multiRoundHistory', history);
    events.emit('scenario:multiRoundResolve', roundResult);
    return roundResult;
  }

  completeScenario(scenarioId, conceptId = null) {
    gameState.completeScenario(scenarioId);
    if (conceptId && !gameState.get().player.discoveries.includes(conceptId)) {
      gameState.addDiscovery(conceptId);
      events.emit('concept:discovered', { conceptId, scenarioId });
    }
    events.emit('scenario:complete', { scenarioId, conceptId });
  }

  shutdown() {
    this._running = false;
    if (this._frameId) cancelAnimationFrame(this._frameId);
    events.emit('engine:shutdown', {});
  }
}

export const engine = new GameEngine();
