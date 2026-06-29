import { events } from '../engine/events.js';
import { gameState } from '../engine/state.js';
import { decisionEngine } from '../ai/decision.js';
import { resolutionEngine } from '../simulation/resolution.js';
import { agentMemory } from '../ai/memory.js';
import { createAgentFromPersonality } from '../ai/personality.js';

class ScenarioRegistry {
  constructor() {
    this._scenarios = new Map();
    this._eraOrder = [];
  }

  register(scenario) {
    this._scenarios.set(scenario.id, scenario);
    if (!this._eraOrder.includes(scenario.era)) {
      this._eraOrder.push(scenario.era);
    }
    this._eraOrder.sort((a, b) => a - b);
  }

  get(id) {
    return this._scenarios.get(id) || null;
  }

  getByEra(era) {
    return Array.from(this._scenarios.values())
      .filter(s => s.era === era)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getAll() {
    return Array.from(this._scenarios.values())
      .sort((a, b) => (a.era - b.era) || (a.order - b.order));
  }

  getNextScenario(currentId) {
    const all = this.getAll();
    const idx = all.findIndex(s => s.id === currentId);
    if (idx >= 0 && idx < all.length - 1) return all[idx + 1];
    return null;
  }

  getFirstUncompleted() {
    const completed = gameState.get().player.completedScenarios;
    for (const scenario of this.getAll()) {
      if (!completed.includes(scenario.id)) return scenario;
    }
    return null;
  }

  isUnlocked(scenarioId) {
    const scenario = this.get(scenarioId);
    if (!scenario) return false;
    if (scenario.era <= 1) return true;
    const completed = gameState.get().player.completedScenarios;
    const previousEraScenarios = this.getByEra(scenario.era - 1);
    return previousEraScenarios.every(s => completed.includes(s.id));
  }

  initializeScenario(scenarioId) {
    const def = this.get(scenarioId);
    if (!def) return null;
    const agents = {};
    const agentInstances = {};
    if (def.agents) {
      for (const [agentId, agentConfig] of Object.entries(def.agents)) {
        const agent = createAgentFromPersonality(agentConfig.personality, agentConfig.name);
        agents[agentId] = agent;
        agentInstances[agentId] = {
          decide: (playerChoice, gs, round, history) => {
            const choices = def.choices.map(c => c.id);
            return decisionEngine.makeChoice(agent, playerChoice, scenarioId, choices, gs, round, history);
          },
        };
      }
    }
    return {
      ...def,
      agents: agentInstances,
      _agentData: agents,
      resolve: (playerChoice, aiChoices, gs, round, history) => {
        return resolutionEngine.resolveAll(playerChoice, aiChoices, def);
      },
    };
  }
}

export const scenarioRegistry = new ScenarioRegistry();
