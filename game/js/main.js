import { events } from './engine/events.js';
import { gameState } from './engine/state.js';
import { engine } from './engine/core.js';
import { SaveManager } from './engine/storage.js';
import { scenarioRegistry } from './scenarios/registry.js';
import './scenarios/definitions-era1.js';
import './scenarios/definitions-era2.js';
import './scenarios/definitions-era3.js';
import './scenarios/definitions-era4.js';
import './scenarios/definitions-era5.js';
import './scenarios/definitions-era6.js';
import { decisionEngine } from './ai/decision.js';
import { resolutionEngine } from './simulation/resolution.js';
import { createAgentFromPersonality } from './ai/personality.js';
import { analytics } from './analytics/tracker.js';
import { CONCEPTS } from './data/concepts.js';
import { FLAVOR } from './data/flavor.js';
import { setAppRoot, render } from './ui/components.js';

const saveManager = new SaveManager(gameState);

let _currentScenario = null;
let _currentInstances = null;
let _scenarioStartTime = 0;
let _pendingDiscovery = null;

function getChoiceTags(choiceId) {
  const tags = [];
  if (choiceId === 'honor' || choiceId === 'share' || choiceId === 'fair' || choiceId === 'cooperate' || choiceId === 'stag' || choiceId === 'ration' || choiceId === 'negotiate') tags.push('cooperate');
  if (choiceId === 'betray' || choiceId === 'unfair' || choiceId === 'defect' || choiceId === 'seize' || choiceId === 'fight') tags.push('defect');
  if (choiceId === 'high' || choiceId === 'seize' || choiceId === 'expedition' || choiceId === 'fight') tags.push('high');
  if (choiceId === 'low' || choiceId === 'ration' || choiceId === 'withdraw' || choiceId === 'negotiate') tags.push('low', 'safe');
  if (choiceId === 'fair' || choiceId === 'medium' || choiceId === 'share' || choiceId === 'borrow') tags.push('medium');
  return tags;
}

window.App = {
  init() {
    const appRoot = document.getElementById('app');
    setAppRoot(appRoot);
    engine.init();

    const savedSettings = saveManager.loadSettings();
    if (savedSettings) {
      gameState.update('settings', { ...gameState.get().settings, ...savedSettings });
    }

    events.on('scenario:resolve', (data) => {
      analytics.trackChoice(data.scenarioId, data.playerChoice, data.result.outcome);
    });

    events.on('concept:discovered', (data) => {
      analytics.trackDiscovery(data.conceptId, data.scenarioId);
    });

    events.on('scenario:complete', (data) => {
      analytics.trackScenarioComplete(data.scenarioId, 1, 'completed');
    });

    this.showTitle();
  },

  startNewGame() {
    gameState.reset();
    saveManager.saveSettings(gameState.get().settings);
    analytics.clear();
    this.showMenu();
  },

  continueSave() {
    const result = saveManager.loadAutoSave();
    if (result.success) {
      const state = gameState.get();
      const pendingConcept = state.world.pendingDiscovery;
      if (pendingConcept) {
        gameState.update('world.pendingDiscovery', null);
        _pendingDiscovery = null;
        render('discovery', { conceptId: pendingConcept });
        return;
      }
      const completed = state.player.completedScenarios;
      const lastDone = completed[completed.length - 1];
      if (lastDone) {
        const next = scenarioRegistry.getNextScenario(lastDone);
        if (next) {
          this.playScenario(next.id);
          return;
        }
      }
      this.showMenu();
    } else {
      this.startNewGame();
    }
  },

  showTitle() {
    _currentScenario = null;
    _currentInstances = null;
    _pendingDiscovery = null;
    gameState.update('world.pendingDiscovery', null);
    render('title');
  },

  showMenu() {
    render('menu');
  },

  showEncyclopedia() {
    render('encyclopedia');
  },

  showConceptDetail(conceptId) {
    render('conceptDetail', { conceptId });
  },

  showTimeline() {
    render('timeline');
  },

  showSandbox() {
    _currentScenario = null;
    _currentInstances = null;
    render('sandbox');
  },

  showScenarioEditor() {
    _currentScenario = null;
    _currentInstances = null;
    render('scenarioEditor');
  },

  showReplay(data) {
    render('replay', { replayData: data });
  },

  showAnalytics() {
    render('analytics');
  },

  playScenario(scenarioId) {
    _scenarioStartTime = Date.now();
    const def = scenarioRegistry.get(scenarioId);
    if (!def) {
      console.error(`Scenario not found: ${scenarioId}`);
      return;
    }

    if (def.setup) {
      const state = gameState.get();
      def.setup(state);
    }

    gameState.update('world.currentScenario', scenarioId);
    gameState.update('world.currentRound', 0);
    gameState.update('world.multiRoundHistory', []);

    _currentScenario = def;
    _currentInstances = this._initScenarioAgents(def);

    render('scenario', { scenario: def, instances: _currentInstances });
  },

  _initScenarioAgents(def) {
    const agentData = {};
    const agentInstances = {};
    if (def.agents) {
      for (const [agentId, config] of Object.entries(def.agents)) {
        const agent = createAgentFromPersonality(config.personality, config.name);
        agentData[agentId] = agent;
        agentInstances[agentId] = {
          decide: (playerChoice, gs, round, history) => {
            const choiceIds = def.choices.map(c => c.id);
            return decisionEngine.makeChoice(agent, playerChoice, def.id, choiceIds, gs, round, history);
          },
        };
      }
    }
    return { agents: agentInstances, _agentData: agentData };
  },

  makeChoice(choiceId) {
    if (!_currentScenario || !_currentInstances) return;

    const def = _currentScenario;
    const isMultiRound = def.multiRound;
    const round = gameState.get().world.currentRound || 0;
    const history = gameState.get().world.multiRoundHistory || [];
    const choiceIds = def.choices.map(c => c.id);

    const aiChoices = {};
    for (const [agentId, agent] of Object.entries(_currentInstances.agents)) {
      aiChoices[agentId] = decisionEngine.makeChoice(
        _currentInstances._agentData[agentId],
        choiceId, def.id, choiceIds, gameState, round, history
      );
    }

    let result;
    if (isMultiRound) {
      result = resolutionEngine.resolveAll(choiceId, aiChoices, def);
      gameState.modifyResources(result.resourceChanges || {});
      if (result.relationshipChanges) {
        for (const [faction, delta] of Object.entries(result.relationshipChanges)) {
          gameState.modifyRelationship(faction, delta);
        }
      }

      const roundResult = { round, playerChoice: choiceId, aiChoices, result, resourceChanges: result.resourceChanges };
      history.push(roundResult);
      gameState.update('world.currentRound', round + 1);
      gameState.update('world.multiRoundHistory', history);

      const multiRoundComplete = (round + 1) >= def.totalRounds;

      if (multiRoundComplete) {
        const totalDelta = history.reduce((sum, r) => {
          const rc = r.resourceChanges || {};
          return sum + Object.values(rc).reduce((a, b) => a + b, 0);
        }, 0);

        result = {
          ...result,
          outcome: def.evaluateOutcome ? def.evaluateOutcome(totalDelta, history) : (totalDelta > 5 ? 'victory' : totalDelta > 0 ? 'mixed' : 'defeat'),
          narrative: totalDelta > 0
            ? `After ${def.totalRounds} rounds, net gain: ${totalDelta} gold.`
            : `After ${def.totalRounds} rounds, net loss: ${totalDelta} gold.`,
        };

        this._completeScenario(def, choiceId, aiChoices, result, history, true);
      } else {
        render('results', {
          scenario: def, result, playerChoice: choiceId, aiChoices,
          isMultiRound: true, multiRoundComplete: false, history,
        });
      }
    } else {
      result = resolutionEngine.resolveAll(choiceId, aiChoices, def);
      gameState.modifyResources(result.resourceChanges || {});
      if (result.relationshipChanges) {
        for (const [faction, delta] of Object.entries(result.relationshipChanges)) {
          gameState.modifyRelationship(faction, delta);
        }
      }
      this._completeScenario(def, choiceId, aiChoices, result);
    }

    analytics.trackChoice(def.id, choiceId, result.outcome);
  },

  _completeScenario(def, choiceId, aiChoices, result, history = null, isMultiRound = false) {
    const timeSpent = Date.now() - _scenarioStartTime;
    analytics.trackTime(def.id, timeSpent);

    const concept = def.concept ? CONCEPTS[def.concept] : null;
    const alreadyDiscovered = concept && gameState.get().player.discoveries.includes(concept.id);

    gameState.completeScenario(def.id);
    if (concept && !alreadyDiscovered) {
      gameState.addDiscovery(concept.id);
      _pendingDiscovery = concept.id;
      gameState.update('world.pendingDiscovery', concept.id);
    } else {
      _pendingDiscovery = null;
      gameState.update('world.pendingDiscovery', null);
    }

    saveManager.autoSave();
    saveManager.trackResourcesHistory();
    saveManager.saveWaypoint(def.id, result.score || 0, result.outcome || 'mixed');

    render('results', {
      scenario: def, result, playerChoice: choiceId, aiChoices,
      isMultiRound, multiRoundComplete: true, history,
    });
  },

  nextRound() {
    const def = _currentScenario;
    if (!def) return;
    render('scenario', { scenario: def, instances: _currentInstances });
  },

  continueAfterResult(scenarioId) {
    if (_pendingDiscovery) {
      const conceptId = _pendingDiscovery;
      _pendingDiscovery = null;
      render('discovery', { conceptId });
      return;
    }
    const next = scenarioRegistry.getNextScenario(scenarioId);
    if (next) {
      this.playScenario(next.id);
    } else {
      this.showMenu();
    }
  },

  afterDiscovery() {
    _pendingDiscovery = null;
    gameState.update('world.pendingDiscovery', null);
    const next = _currentScenario ? scenarioRegistry.getNextScenario(_currentScenario.id) : null;
    if (next) {
      this.playScenario(next.id);
    } else {
      this.showMenu();
    }
  },

  runSandbox() {
    const gameType = document.getElementById('sandbox-game').value;
    const rounds = parseInt(document.getElementById('sandbox-rounds').value);
    const aiPersonality = document.getElementById('sandbox-ai').value;

    const agent = createAgentFromPersonality(aiPersonality, 'Opponent');

    const results = [];
    let playerScore = 0;
    let aiScore = 0;
    const history = [];

    let choiceIds;
    switch (gameType) {
      case 'market': choiceIds = ['high', 'medium', 'low']; break;
      case 'public_goods': choiceIds = ['contribute', 'free_ride']; break;
      case 'tragedy_commons': choiceIds = ['sustain', 'take']; break;
      default: choiceIds = ['honor', 'betray'];
    }

    const playerChoices = this._genSandboxChoices(gameType);
    const heatmap = {};

    for (let r = 0; r < rounds; r++) {
      const playerChoice = playerChoices[r % playerChoices.length];
      const aiChoice = decisionEngine.makeChoice(agent, playerChoice, 'sandbox',
        choiceIds, gameState, r, history);

      let roundResult;
      switch (gameType) {
        case 'prisoners_dilemma':
          roundResult = resolutionEngine.calcPD(playerChoice, aiChoice);
          break;
        case 'stag_hunt':
          roundResult = resolutionEngine.calcStagHunt(playerChoice, aiChoice);
          break;
        case 'chicken':
          roundResult = resolutionEngine.calcChicken(playerChoice, aiChoice);
          break;
        case 'coordination':
          roundResult = resolutionEngine.calcCoordination(playerChoice, aiChoice);
          break;
        case 'market':
          roundResult = resolutionEngine.calcMarket(playerChoice, aiChoice);
          break;
        case 'public_goods':
          roundResult = resolutionEngine.calcPublicGoods(playerChoice, aiChoice);
          break;
        case 'tragedy_commons':
          roundResult = resolutionEngine.calcTragedyCommons(playerChoice, aiChoice);
          break;
        default:
          roundResult = { player: 0, ai: 0, narrative: '' };
      }

      const pScore = roundResult.player !== undefined ? roundResult.player : (roundResult.p1 !== undefined ? roundResult.p1 : 0);
      const aScore = roundResult.ai !== undefined ? roundResult.ai : (roundResult.p2 !== undefined ? roundResult.p2 : 0);

      playerScore += pScore;
      aiScore += aScore;
      results.push({ round: r + 1, playerChoice, aiChoice, pScore, aScore });
      history.push({ playerChoice, aiChoice, result: roundResult });

      const cellKey = `${playerChoice}_${aiChoice}`;
      heatmap[cellKey] = (heatmap[cellKey] || 0) + 1;
    }

    const allLabels = [...new Set(choiceIds)];
    const heatmapRows = allLabels.map(pc =>
      allLabels.map(ac => heatmap[`${pc}_${ac}`] || 0)
    );
    const maxCount = Math.max(1, ...Object.values(heatmap));

    const container = document.getElementById('sandbox-results');
    container.innerHTML = `
      <div class="resources-delta">
        <h3>Sandbox Results \u2014 ${gameType} (${rounds} rounds, ${aiPersonality})</h3>
        <div style="display: flex; gap: 20px; margin: 12px 0;">
          <div>Your Score: <strong style="color: var(--accent-green)">${playerScore}</strong></div>
          <div>AI Score: <strong style="color: var(--accent-red)">${aiScore}</strong></div>
          <div>Winner: <strong style="color: ${playerScore >= aiScore ? 'var(--accent-green)' : 'var(--accent-red)'}">
            ${playerScore > aiScore ? 'You' : playerScore < aiScore ? 'AI' : 'Tie'}
          </strong></div>
        </div>
        <div style="margin-top: 12px;">
          <h4 style="color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Heatmap: Choice Frequency</h4>
          <div style="overflow-x: auto;">
            <table style="border-collapse: collapse; font-size: 0.85rem; width: 100%;">
              <tr>
                <td style="padding: 6px 10px;"></td>
                ${allLabels.map(l => `<td style="padding: 6px 10px; text-align: center; font-weight: 600; color: var(--text-secondary);">${l}</td>`).join('')}
              </tr>
              ${allLabels.map((pc, i) => `
                <tr>
                  <td style="padding: 6px 10px; font-weight: 600; color: var(--text-secondary);">${pc}</td>
                  ${heatmapRows[i].map((count, j) => {
                    const intensity = count / maxCount;
                    const r = Math.round(13 + intensity * 40);
                    const g = Math.round(23 + (1 - intensity) * 30);
                    const b = Math.round(34 + intensity * 60);
                    const bg = `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
                    return `<td style="padding: 10px 14px; text-align: center; background: ${bg}; border: 1px solid var(--border-color); border-radius: 4px; font-weight: ${count > 0 ? '600' : '400'}; color: ${count > 0 ? 'var(--text-primary)' : 'var(--text-muted)'};">${count > 0 ? count : '-'}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </table>
          </div>
        </div>
        <div class="timeline-view" style="max-height: 300px; overflow-y: auto; margin-top: 12px;">
          ${results.map(r => `
            <div class="timeline-entry">
              <div class="turn-num">R${r.round}</div>
              <div class="turn-choice">You: ${r.playerChoice} | AI: ${r.aiChoice}</div>
              <div class="turn-outcome">
                <span style="color: var(--accent-green)">+${r.pScore}</span>
                <span style="color: var(--accent-red)">+${r.aScore}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  _genSandboxChoices(gameType) {
    const choices = [];
    let pool;
    switch (gameType) {
      case 'market': pool = ['high', 'medium', 'low']; break;
      case 'public_goods': pool = ['contribute', 'free_ride']; break;
      case 'tragedy_commons': pool = ['sustain', 'take']; break;
      default: pool = ['honor', 'betray'];
    }
    for (let i = 0; i < 20; i++) {
      choices.push(pool[i % pool.length]);
    }
    return choices;
  },

  runScenarioTest(scenarioId) {
    this.playScenario(scenarioId);
  },

  // ===================== EDITOR METHODS =====================

  _editorChoices: [],
  _editorAgents: [],
  _editorPayoffMatrix: null,

  refreshEditorUI() {
    const list = document.getElementById('editor-choices-list');
    if (list) {
      list.innerHTML = this._editorChoices.map((c, i) => `
        <div style="background: var(--bg-tertiary); padding: 8px; border-radius: var(--radius-sm); margin-bottom: 6px; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>${c.label}</strong>
            <button class="btn btn-danger" style="padding: 2px 8px; font-size: 0.75rem;" onclick="App.removeEditorChoice(${i})">\u{2716}</button>
          </div>
          <span style="color: var(--text-muted);">${c.id} | ${c.risk} risk</span>
        </div>
      `).join('');
    }
    const agents = document.getElementById('editor-agents-list');
    if (agents) {
      agents.innerHTML = this._editorAgents.map((a, i) => `
        <div style="background: var(--bg-tertiary); padding: 8px; border-radius: var(--radius-sm); margin-bottom: 6px; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>${a.name}</strong>
            <button class="btn btn-danger" style="padding: 2px 8px; font-size: 0.75rem;" onclick="App.removeEditorAgent(${i})">\u{2716}</button>
          </div>
          <span style="color: var(--text-muted);">${a.personality}</span>
        </div>
      `).join('');
    }
    const matrix = document.getElementById('editor-payoff-matrix');
    if (matrix) {
      const m = this._editorPayoffMatrix || { rows: ['A', 'B'], cols: ['A', 'B'], values: [[3,3,0,5],[5,0,1,1]] };
      matrix.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; max-width: 300px;">
          ${m.rows.map((r, i) => m.cols.map((c, j) => {
            const idx = i * m.cols.length + j;
            const pVal = m.values[i] ? m.values[i][idx * 2] : 3;
            const aVal = m.values[i] ? m.values[i][idx * 2 + 1] : 3;
            return `
              <div style="background: var(--bg-tertiary); padding: 6px; border-radius: var(--radius-sm); text-align: center;">
                <div style="font-size: 0.75rem; color: var(--text-muted);">${r} vs ${c}</div>
                <div><input type="number" value="${pVal}" style="width:50px; padding:2px 4px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:3px; color:var(--text-primary); font-size:0.8rem;" onchange="App.updateEditorPayoff(${i},${j},0,this.value)" /> : <input type="number" value="${aVal}" style="width:50px; padding:2px 4px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:3px; color:var(--text-primary); font-size:0.8rem;" onchange="App.updateEditorPayoff(${i},${j},1,this.value)" /></div>
              </div>
            `;
          }).join('')).join('')}
        </div>
      `;
    }
  },

  addEditorChoice() {
    const id = prompt('Choice ID (e.g., cooperate):');
    if (!id) return;
    const label = prompt('Label (e.g., Cooperate):');
    if (!label) return;
    const desc = prompt('Description:') || '';
    const risk = prompt('Risk (low/medium/high):') || 'low';
    this._editorChoices.push({ id, label, description: desc, risk, tags: [risk] });
    this.refreshEditorUI();
  },

  removeEditorChoice(index) {
    this._editorChoices.splice(index, 1);
    this.refreshEditorUI();
  },

  addEditorAgent() {
    const id = prompt('Agent ID (e.g., opponent):');
    if (!id) return;
    const name = prompt('Display name:');
    if (!name) return;
    const personality = prompt('Personality (titForTat, alwaysCooperate, alwaysDefect, random, greedy, etc.):') || 'titForTat';
    this._editorAgents.push({ id, personality, name });
    this.refreshEditorUI();
  },

  removeEditorAgent(index) {
    this._editorAgents.splice(index, 1);
    this.refreshEditorUI();
  },

  updateEditorPayoff(row, col, isAi, value) {
    const m = this._editorPayoffMatrix;
    if (!m) return;
    const idx = col * 2 + isAi;
    if (!m.values[row]) m.values[row] = [];
    m.values[row][idx] = parseInt(value) || 0;
  },

  saveEditorScenario() {
    const title = document.getElementById('editor-title')?.value.trim();
    if (!title) { this._showEditorStatus('Please enter a title.', 'var(--accent-red)'); return; }
    const era = parseInt(document.getElementById('editor-era')?.value || '1');
    const order = parseInt(document.getElementById('editor-order')?.value || '1');
    const concept = document.getElementById('editor-concept')?.value || null;
    const type = document.getElementById('editor-type')?.value || 'scarcity';
    const context = document.getElementById('editor-context')?.value || '';
    const idealNote = document.getElementById('editor-idealnote')?.value || '';

    const scenario = {
      id: `custom_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
      title,
      era,
      order,
      concept: concept || undefined,
      type,
      context,
      idealNote: idealNote || undefined,
      story: [],
      choices: this._editorChoices.map(c => ({ ...c })),
      agents: {},
      multiRound: false,
      totalRounds: 1,
      payoffMatrix: this._editorPayoffMatrix ? {
        rows: this._editorPayoffMatrix.rows,
        cols: this._editorPayoffMatrix.cols,
        values: this._editorPayoffMatrix.values.map(r => [...r]),
      } : undefined,
      customResolve: undefined,
      analyze: undefined,
    };

    for (const agent of this._editorAgents) {
      scenario.agents[agent.id] = { personality: agent.personality, name: agent.name };
    }

    saveManager.saveCustomScenario(scenario);
    this._showEditorStatus(`Saved "${title}" successfully!`, 'var(--accent-green)');
    this._loadEditorScenarioList();
  },

  testEditorScenario() {
    const title = document.getElementById('editor-title')?.value.trim() || 'Test Scenario';
    const era = parseInt(document.getElementById('editor-era')?.value || '1');
    const order = parseInt(document.getElementById('editor-order')?.value || '1');
    const concept = document.getElementById('editor-concept')?.value || null;
    const type = document.getElementById('editor-type')?.value || 'scarcity';
    const context = document.getElementById('editor-context')?.value || '';

    const scenario = {
      id: `test_${Date.now()}`,
      title,
      era,
      order,
      concept: concept || undefined,
      type,
      context,
      story: [],
      choices: this._editorChoices.map(c => ({ ...c })),
      agents: {},
      multiRound: false,
      totalRounds: 1,
      customResolve: undefined,
      analyze: undefined,
    };

    for (const agent of this._editorAgents) {
      scenario.agents[agent.id] = { personality: agent.personality, name: agent.name };
    }

    this.playScenario(scenario.id);
    scenarioRegistry.register(scenario);
  },

  loadEditorScenario() {
    const raw = localStorage.getItem('sovereign_custom_scenarios');
    const scenarios = raw ? JSON.parse(raw) : [];
    if (scenarios.length === 0) { this._showEditorStatus('No saved scenarios found.', 'var(--accent-red)'); return; }

    const list = document.getElementById('editor-saved-list');
    list.innerHTML = `
      <div class="resources-delta">
        <h3>Saved Scenarios</h3>
        ${scenarios.map(s => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(48,54,61,0.5);">
            <span>${s.title} <span style="color: var(--text-muted); font-size: 0.8rem;">(Era ${s.era})</span></span>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="App.loadEditorScenarioById('${s.id}')">Load</button>
              <button class="btn btn-danger" style="padding: 4px 10px; font-size: 0.75rem;" onclick="App.deleteEditorScenario('${s.id}')">Del</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  loadEditorScenarioById(id) {
    const scenario = saveManager.loadCustomScenario(id);
    if (!scenario) { this._showEditorStatus('Scenario not found.', 'var(--accent-red)'); return; }
    const titleEl = document.getElementById('editor-title');
    const eraEl = document.getElementById('editor-era');
    const orderEl = document.getElementById('editor-order');
    const conceptEl = document.getElementById('editor-concept');
    const typeEl = document.getElementById('editor-type');
    const contextEl = document.getElementById('editor-context');
    const idealEl = document.getElementById('editor-idealnote');
    if (titleEl) titleEl.value = scenario.title || '';
    if (eraEl) eraEl.value = scenario.era || 1;
    if (orderEl) orderEl.value = scenario.order || 1;
    if (conceptEl) conceptEl.value = scenario.concept || '';
    if (typeEl) typeEl.value = scenario.type || 'scarcity';
    if (contextEl) contextEl.value = scenario.context || '';
    if (idealEl) idealEl.value = scenario.idealNote || '';
    this._editorChoices = (scenario.choices || []).map(c => ({ ...c }));
    this._editorAgents = Object.entries(scenario.agents || {}).map(([id, a]) => ({ id, personality: a.personality, name: a.name }));
    this._editorPayoffMatrix = scenario.payoffMatrix ? JSON.parse(JSON.stringify(scenario.payoffMatrix)) : { rows: ['Cooperate', 'Defect'], cols: ['Cooperate', 'Defect'], values: [[3,3,0,5],[5,0,1,1]] };
    this.refreshEditorUI();
    this._showEditorStatus(`Loaded "${scenario.title}"`, 'var(--accent-green)');
  },

  deleteEditorScenario(id) {
    if (!confirm('Delete this scenario?')) return;
    saveManager.deleteCustomScenario(id);
    this._showEditorStatus('Deleted.', 'var(--accent-green)');
    this._loadEditorScenarioList();
  },

  _showEditorStatus(msg, color) {
    const el = document.getElementById('editor-status');
    if (el) { el.innerHTML = `<span style="color: ${color};">${msg}</span>`; }
  },

  _loadEditorScenarioList() {
    const list = document.getElementById('editor-saved-list');
    if (!list) return;
    const scenarios = saveManager.listCustomScenarios();
    list.innerHTML = scenarios.length === 0 ? '' : `
      <div class="resources-delta">
        <h3>Saved Scenarios</h3>
        ${scenarios.map(s => `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(48,54,61,0.5);">
            <span>${s.title} <span style="color: var(--text-muted); font-size: 0.8rem;">(Era ${s.era})</span></span>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;" onclick="App.loadEditorScenarioById('${s.id}')">Load</button>
              <button class="btn btn-danger" style="padding: 4px 10px; font-size: 0.75rem;" onclick="App.deleteEditorScenario('${s.id}')">Del</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ===================== REPLAY METHODS =====================

  _replayData: null,

  replaySeek(stepIndex) {
    if (!this._replayData) return;
    const { scenario, history, result } = this._replayData;
    const step = Math.max(0, Math.min(stepIndex, history.length - 1));
    this._replayData.currentStep = step;

    const slider = document.getElementById('replay-slider');
    const stepNum = document.getElementById('replay-step-num');
    if (slider) slider.value = step + 1;
    if (stepNum) stepNum.textContent = step + 1;

    const content = document.getElementById('replay-content');
    if (!content) return;

    const entry = history[step];
    if (!entry) {
      content.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No data for this step.</p>';
      return;
    }

    const pScore = entry.pScore !== undefined ? entry.pScore : (entry.result?.player || 0);
    const aScore = entry.aScore !== undefined ? entry.aScore : (entry.result?.ai || 0);
    const playerRaw = entry.playerChoice || entry.aiChoices?.['player'] || '?';
    const playerLabel = (scenario.choices || []).find(c => c.id === playerRaw)?.label || playerRaw;
    const aiRaw = entry.aiChoice || Object.values(entry.aiChoices || {})[0] || '?';
    const aiLabel = (scenario.choices || []).find(c => c.id === aiRaw)?.label || aiRaw;

    content.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md);">
          <h4 style="color: var(--accent-blue); margin-bottom: 8px;">You</h4>
          <div style="font-size: 1.2rem; font-weight: 600; color: var(--text-primary);">${playerLabel}</div>
          <div style="color: var(--accent-green); font-size: 1.5rem; margin-top: 8px;">+${pScore}</div>
        </div>
        <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md);">
          <h4 style="color: var(--accent-red); margin-bottom: 8px;">AI</h4>
          <div style="font-size: 1.2rem; font-weight: 600; color: var(--text-primary);">${aiLabel}</div>
          <div style="color: var(--accent-red); font-size: 1.5rem; margin-top: 8px;">+${aScore}</div>
        </div>
      </div>
      <div style="margin-top: 12px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md);">
        <p style="font-style: italic; color: var(--text-secondary);">${entry.result?.narrative || ''}</p>
      </div>
    `;

    const summary = document.getElementById('replay-summary');
    const summaryContent = document.getElementById('replay-summary-content');
    if (summary && summaryContent && step === history.length - 1 && result) {
      summary.style.display = 'block';
      summaryContent.innerHTML = `
        <p><strong>Outcome:</strong> ${result.outcome || 'Mixed'}</p>
        <p><strong>Total Steps:</strong> ${history.length}</p>
        ${result.narrative ? `<p><em>${result.narrative}</em></p>` : ''}
      `;
    } else if (summary) {
      summary.style.display = 'none';
    }
  },

  replayPrev() {
    if (!this._replayData) return;
    this.replaySeek(this._replayData.currentStep - 1);
  },

  replayNext() {
    if (!this._replayData) return;
    this.replaySeek(this._replayData.currentStep + 1);
  },

  // ===================== ANALYTICS EXPORT =====================

  exportAnalyticsCSV() {
    const events = analytics.getEvents();
    if (events.length === 0) { alert('No analytics data to export.'); return; }
    const headers = ['type', 'timestamp', ...new Set(events.flatMap(e => Object.keys(e.data)))];
    const rows = events.map(e => {
      return headers.map(h => {
        if (h === 'type') return e.type;
        if (h === 'timestamp') return new Date(e.timestamp).toISOString();
        return JSON.stringify(e.data[h] ?? '');
      }).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sovereign-analytics-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

window.App.init();
