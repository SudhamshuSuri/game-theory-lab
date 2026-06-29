import { events } from '../engine/events.js';
import { gameState } from '../engine/state.js';
import { scenarioRegistry } from '../scenarios/registry.js';
import { CONCEPTS } from '../data/concepts.js';
import { FLAVOR } from '../data/flavor.js';
import {
  RESOURCE_ICONS, RESOURCE_LABELS, RESOURCE_DESCRIPTIONS, formatResourceDelta,
} from '../simulation/resources.js';
import { analytics } from '../analytics/tracker.js';

let _appRoot = null;

export function setAppRoot(el) { _appRoot = el; }

export function render(screenName, data = {}) {
  if (!_appRoot) { console.error('App root not set'); return; }
  switch (screenName) {
    case 'title': renderTitle(); break;
    case 'menu': renderMenu(); break;
    case 'scenario': renderScenario(data.scenario, data.instances); break;
    case 'results': renderResults(data); break;
    case 'discovery': renderDiscovery(data.conceptId); break;
    case 'encyclopedia': renderEncyclopedia(); break;
    case 'sandbox': renderSandbox(); break;
    case 'timeline': renderTimeline(); break;
    case 'scenarioEditor': renderScenarioEditor(); break;
    case 'replay': renderReplay(data); break;
    case 'analytics': renderAnalyticsDashboard(); break;
    default: renderTitle(); break;
  }
}

// ===================== TITLE SCREEN =====================
function renderTitle() {
  const s = gameState.get();
  const hasSave = s.player.completedScenarios.length > 0 || s.meta.createdAt !== null;
  const autoSaveData = (() => {
    try {
      const raw = localStorage.getItem('sovereign_save_auto');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  })();
  const hasAutoSave = autoSaveData && autoSaveData.state?.player?.completedScenarios?.length > 0;
  const discovered = s.player.discoveries.length || autoSaveData?.state?.player?.discoveries?.length || 0;
  _appRoot.innerHTML = `
    <div class="screen title-screen">
      <div style="font-size: 4rem; margin-bottom: 0.2em;">\u{1F3F0}</div>
      <h1>SOVEREIGN</h1>
      <p class="subtitle">A Game of Strategy</p>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2em;">
        The game that teaches game theory through play.
      </p>
      <div class="title-menu">
        <button class="btn-title" onclick="App.startNewGame()">
          \u{2694} New Game
        </button>
        ${hasAutoSave ? `
        <button class="btn-title" onclick="App.continueSave()" style="border-color: var(--accent-gold); color: var(--accent-gold-bright);">
          \u{25B6} Continue (${autoSaveData.state.player.completedScenarios.length} scenarios)
        </button>` : ''}
        ${(hasSave || hasAutoSave) ? `
        <button class="btn-title" onclick="App.showEncyclopedia()">
          \u{1F4D6} Encyclopedia (${discovered} discovered)
        </button>` : ''}
      </div>
      <div style="margin-top: 3em; max-width: 500px; text-align: center;">
        ${FLAVOR.welcome.map(t => `<p style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">${t}</p>`).join('')}
      </div>
    </div>
  `;
}

// ===================== MENU / WORLD =====================
function renderMenu() {
  const s = gameState.get();
  const completedArr = s.player.completedScenarios;
  const completed = completedArr.length;
  const total = scenarioRegistry.getAll().length;
  const discoveries = s.player.discoveries.length;
  const allScenarios = scenarioRegistry.getAll();
  const currentEra = Math.min(
    6,
    Math.floor(completed / 10) + 1
  );

  const eraBlocks = [1,2,3,4,5,6].map(eraNum => {
    const scenarios = scenarioRegistry.getByEra(eraNum);
    const done = scenarios.filter(sc => completedArr.includes(sc.id)).length;
    const unlocked = eraNum <= 1 || scenarioRegistry.getByEra(eraNum - 1)
      .every(sc => completedArr.includes(sc.id));
    return `
      <div class="config-group" style="${!unlocked ? 'opacity:0.4;' : ''}">
        <h4>${FLAVOR.titles[`era${eraNum}`] || `Era ${eraNum}`}</h4>
        <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 8px;">
          ${FLAVOR.eraDescriptions[eraNum] || ''}
        </p>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">
          ${done}/${scenarios.length} completed
          ${!unlocked ? ' \u{1F512} Locked: Complete Era ' + (eraNum - 1) : ''}
        </p>
        <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">
          ${scenarios.map(sc => {
            const isDone = completedArr.includes(sc.id);
            const isAvailable = unlocked && (isDone || eraNum <= 1 || scenarioRegistry.isUnlocked(sc.id));
            return `
              <button class="btn ${isDone ? 'btn-primary' : 'btn-secondary'}"
                style="font-size: 0.75rem; padding: 4px 10px;"
                ${!isAvailable ? 'disabled' : ''}
                onclick="App.playScenario('${sc.id}')">
                ${isDone ? '\u{2713}' : ''} ${sc.title}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');

  const player = s.player;
  _appRoot.innerHTML = `
    <div class="screen">
      <div class="scenario-header">
        <div>
          <h2 style="font-family: var(--font-display);">The Council of Haven</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">
            ${completed}/${total} scenarios completed | ${discoveries} discoveries
          </p>
        </div>
        <button class="btn btn-secondary" onclick="App.showTitle()">\u{2190} Title</button>
      </div>

      <div class="resource-bar" style="margin: 16px 0;">
        ${Object.entries(RESOURCE_ICONS).map(([key, icon]) => {
          const val = player.resources[key];
          if (val === undefined) return '';
          return `<div class="resource-item"><span class="icon">${icon}</span><span class="value">${val}</span><span class="label">${RESOURCE_LABELS[key]}</span></div>`;
        }).join('')}
        <div class="resource-item">
          <span class="icon">\u{2B50}</span>
          <span class="value">${player.reputation}</span>
          <span class="label">Reputation</span>
        </div>
      </div>

      <div class="sandbox-config">
        ${eraBlocks}
      </div>

      <div style="margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap;">
        ${discoveries > 0 ? `
        <button class="btn btn-secondary" onclick="App.showEncyclopedia()">
          \u{1F4D6} Encyclopedia (${discoveries} concepts)
        </button>` : ''}
        ${completed > 0 ? `
        <button class="btn btn-secondary" onclick="App.showTimeline()">
          \u{1F4CB} Timeline
        </button>` : ''}
        <button class="btn btn-secondary" onclick="App.showSandbox()">
          \u{1F9EA} Sandbox
        </button>
        <button class="btn btn-secondary" onclick="App.showAnalytics()">
          \u{1F4CA} Analytics
        </button>
        <button class="btn btn-secondary" onclick="App.showScenarioEditor()">
          \u{270F} Editor
        </button>
        <button class="btn btn-secondary" onclick="App.showTitle()">
          \u{1F3E0} Title
        </button>
      </div>
    </div>
  `;
}

// ===================== SCENARIO VIEW =====================
function renderScenario(scenarioDef, instances) {
  const s = gameState.get();
  const concept = scenarioDef.concept ? CONCEPTS[scenarioDef.concept] : null;
  const isDiscovery = concept && !s.player.discoveries.includes(concept.id);
  const round = s.world.currentRound || 0;
  const totalRounds = scenarioDef.multiRound ? scenarioDef.totalRounds : 1;

  _appRoot.innerHTML = `
    <div class="screen scenario-container">
      <div class="scenario-header">
        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 4px 12px;" onclick="App.showMenu()">\u{2190}</button>
          <h3 style="font-family: var(--font-display);">${scenarioDef.title}</h3>
          <span class="era-tag">Era ${scenarioDef.era}</span>
          ${isDiscovery ? '<span class="concept-tag">New Concept</span>' : ''}
        </div>
        <span style="color: var(--text-muted); font-size: 0.85rem;">
          ${scenarioDef.multiRound ? `Round ${round + 1}/${totalRounds}` : ''}
        </span>
      </div>

      ${scenarioDef.multiRound ? `
      <div class="round-indicators">
        ${Array.from({length: totalRounds}, (_, i) => {
          const history = s.world.multiRoundHistory || [];
          const pastRound = history[i];
          let cls = 'round-dot';
          if (i === round) cls += ' active';
          else if (pastRound) {
            cls += pastRound.playerChoice === 'fair' || pastRound.playerChoice === 'honor' || pastRound.playerChoice === 'share' ? ' cooperate' : ' defect';
          }
          return `<div class="${cls}"></div>`;
        }).join('')}
      </div>` : ''}

      <div class="scenario-story">
        ${scenarioDef.story.map(line => `
          <div class="dialogue-box">
            <div class="speaker">${line.speaker}</div>
            <p style="margin-bottom: 8px;">"${line.text}"</p>
          </div>
        `).join('')}
        <div class="story-context">
          ${scenarioDef.context}
        </div>
      </div>

      <div style="margin-bottom: 8px;">
        <h4 style="color: var(--text-secondary); font-size: 0.9rem;">What do you do?</h4>
      </div>

      <div class="choices-container stagger-children">
        ${scenarioDef.choices.map(choice => `
          <button class="choice-card"
            onclick="App.makeChoice('${choice.id}')"
            id="choice-${choice.id}">
            <div class="choice-title">${choice.label}</div>
            <div class="choice-desc">${choice.description}</div>
            <span class="choice-risk ${choice.risk}">${choice.risk.toUpperCase()} RISK</span>
          </button>
        `).join('')}
      </div>

      ${scenarioDef.multiRound && round > 0 ? `
      <div class="analysis-box" style="border-color: var(--accent-blue); background: rgba(88,166,255,0.05);">
        <h3 style="color: var(--accent-blue);">Previous Round</h3>
        <p>${(() => {
          const history = s.world.multiRoundHistory || [];
          const last = history[history.length - 1];
          if (!last) return '';
          const you = last.playerChoice === 'fair' ? 'fair toll' : 'unfair toll';
          const them = Object.values(last.aiChoices)[0] === 'fair' ? 'fair toll' : 'unfair toll';
          const result = Object.values(last.result.resourceChanges || {}).reduce((a,b) => a+b, 0);
          return `You charged ${you}. They charged ${them}. Net change: ${result >= 0 ? '+' : ''}${result} gold.`;
        })()}</p>
      </div>` : ''}
    </div>
  `;
}

// ===================== RESULTS VIEW =====================
function renderResults(data) {
  const { scenario, result, playerChoice, aiChoices, isMultiRound, multiRoundComplete, history } = data;
  const isVictory = result.outcome === 'victory';
  const isDefeat = result.outcome === 'defeat';
  const outcomeClass = isVictory ? 'victory' : isDefeat ? 'defeat' : 'mixed';
  const outcomeIcon = isVictory ? '\u{1F3C6}' : isDefeat ? '\u{1F4A5}' : '\u{2694}';

  _appRoot.innerHTML = `
    <div class="screen results-container">
      <div class="results-header">
        <div class="outcome-icon">${outcomeIcon}</div>
        <h2 class="${outcomeClass}">${isVictory ? 'Victory' : isDefeat ? 'Defeat' : 'Mixed Outcome'}</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">${scenario.title}</p>
      </div>

      <div class="results-narrative">
        ${result.narrative || 'The situation resolves.'}
      </div>

      ${aiChoices && Object.keys(aiChoices).length > 0 ? `
      <div class="resources-delta" style="border-color: var(--accent-blue); background: rgba(58,106,200,0.05);">
        <h3>\u{1F916} What They Chose</h3>
        ${Object.entries(aiChoices).map(([agentId, choice]) => {
          const name = agentId.charAt(0).toUpperCase() + agentId.slice(1);
          return `
            <div style="font-size: 0.9rem; padding: 4px 0;">
              <strong>${name}:</strong> <span style="color: var(--accent-gold);">${choice}</span>
            </div>
          `;
        }).join('')}
      </div>` : ''}

      ${result.resourceChanges && Object.keys(result.resourceChanges).length > 0 ? `
      <div class="resources-delta">
        <h3>Resources</h3>
        <div class="resource-changes">
          ${Object.entries(result.resourceChanges).map(([key, delta]) => {
            const cls = delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral';
            const sign = delta > 0 ? '+' : '';
            const icon = RESOURCE_ICONS[key] || '';
            const label = RESOURCE_LABELS[key] || key;
            return `<div class="resource-change"><span>${icon} ${label}</span><span class="${cls}">${sign}${delta}</span></div>`;
          }).join('')}
        </div>
      </div>` : ''}

      ${result.relationshipChanges && Object.keys(result.relationshipChanges).length > 0 ? `
      <div class="resources-delta">
        <h3>Relationships</h3>
        ${Object.entries(result.relationshipChanges).map(([faction, delta]) => {
          const cls = delta > 0 ? 'positive' : 'negative';
          const sign = delta > 0 ? '+' : '';
          return `<div class="relations-change"><span>${faction}: </span><span class="${cls}">${sign}${delta}</span></div>`;
        }).join('')}
      </div>` : ''}

      ${scenario.analyze && multiRoundComplete ? `
      <div class="analysis-box" style="${isDefeat ? '' : 'border-color: var(--accent-blue); background: rgba(88,166,255,0.05);'}">
        <h3 style="${isDefeat ? 'color: var(--accent-red)' : 'color: var(--accent-blue)'}">
          ${isDefeat ? '\u{1F4A1} Why You Lost' : '\u{1F4A1} Analysis'}
        </h3>
        <p>${scenario.analyze(playerChoice, (aiChoices && Object.values(aiChoices)[0]) || null, history || null)}</p>
      </div>` : ''}
      ${!multiRoundComplete && isMultiRound ? `
      <div class="analysis-box" style="border-color: var(--accent-blue); background: rgba(88,166,255,0.05);">
        <h3 style="color: var(--accent-blue);">\u{1F504} Round Complete</h3>
        <p>Round ${(history ? history.length : 0)} of ${scenario.totalRounds || '?'} complete. Keep going to see the full pattern emerge. Track how each choice affects the next round.</p>
      </div>` : ''}
      ${scenario.idealNote ? `
      <div class="resources-delta" style="border-color: var(--accent-teal); background: rgba(86,212,221,0.05);">
        <h3 style="color: var(--accent-teal);">\u{1F3AF} Optimal Strategy</h3>
        <p style="font-size: 0.9rem;">${scenario.idealNote}</p>
      </div>` : ''}

      <div class="btn-group">
        ${isMultiRound && !multiRoundComplete ? `
          <button class="btn btn-primary" onclick="App.nextRound()">
            \u{25B6} Next Round
          </button>` : `
          <button class="btn btn-primary" onclick="App.continueAfterResult('${scenario.id}')">
            \u{25B6} Continue
          </button>
        `}
        ${history && history.length > 0 ? `
          <button class="btn btn-secondary" onclick="App.showReplay({
            scenario: ${JSON.stringify(scenario).replace(/"/g, '&quot;')},
            history: ${JSON.stringify(history).replace(/"/g, '&quot;')},
            aiChoices: ${JSON.stringify(aiChoices || {}).replace(/"/g, '&quot;')},
            result: ${JSON.stringify(result).replace(/"/g, '&quot;')}
          })">
            \u{1F504} Replay
          </button>` : ''}
        ${scenarioRegistry.getNextScenario(scenario.id) ? `
          <button class="btn btn-secondary" onclick="App.showMenu()">
            \u{1F3F0} Back to Council
          </button>` : ''}
      </div>
    </div>
  `;
}

// ===================== DISCOVERY CARD =====================
function renderDiscovery(conceptId) {
  const concept = CONCEPTS[conceptId];
  if (!concept) { events.emit('ui:error', { message: `Unknown concept: ${conceptId}` }); return; }

  const overlay = document.createElement('div');
  overlay.className = 'discovery-overlay';
  overlay.innerHTML = `
    <div class="discovery-card">
      <div class="discovery-badge">${FLAVOR.conceptUnlock.title}</div>
      <h2>\u{1F3C6} ${concept.name}</h2>
      <div class="discovery-quote">${concept.quote}</div>
      <div class="discovery-body">
        <p>${concept.explanation}</p>
        ${concept.realWorld ? `
          <p><strong>In real life:</strong> ${concept.realWorld}</p>
        ` : ''}
        ${concept.payoffMatrix ? `
          <div style="margin: 12px 0; overflow-x: auto;">
            <table style="width:100%; border-collapse: collapse; font-size: 0.85rem;">
              <tr>
                <td></td>
                <td style="padding: 6px; border:1px solid var(--border-color); background: rgba(255,255,255,0.05); text-align:center;">
                  <strong>${concept.payoffMatrix.cols[0]}</strong>
                </td>
                <td style="padding: 6px; border:1px solid var(--border-color); background: rgba(255,255,255,0.05); text-align:center;">
                  <strong>${concept.payoffMatrix.cols[1]}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px; border:1px solid var(--border-color); background: rgba(255,255,255,0.05);">
                  <strong>${concept.payoffMatrix.rows[0]}</strong>
                </td>
                <td style="padding: 6px; border:1px solid var(--border-color); text-align:center;">${concept.payoffMatrix.values[0][0]}</td>
                <td style="padding: 6px; border:1px solid var(--border-color); text-align:center;">${concept.payoffMatrix.values[0][1]}</td>
              </tr>
              <tr>
                <td style="padding: 6px; border:1px solid var(--border-color); background: rgba(255,255,255,0.05);">
                  <strong>${concept.payoffMatrix.rows[1]}</strong>
                </td>
                <td style="padding: 6px; border:1px solid var(--border-color); text-align:center;">${concept.payoffMatrix.values[1][0]}</td>
                <td style="padding: 6px; border:1px solid var(--border-color); text-align:center;">${concept.payoffMatrix.values[1][1]}</td>
              </tr>
            </table>
          </div>
        ` : ''}
        <div class="discovery-insight">
          ${concept.insight}
        </div>
      </div>
      <button class="btn-discovery" onclick="this.closest('.discovery-overlay').remove(); App.afterDiscovery()">
        Add to Encyclopedia \u{2192}
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ===================== ENCYCLOPEDIA =====================
function renderEncyclopedia() {
  const s = gameState.get();
  const discovered = s.player.discoveries;
  const allConcepts = Object.values(CONCEPTS).sort((a, b) => a.name.localeCompare(b.name));

  _appRoot.innerHTML = `
    <div class="screen">
      <div class="scenario-header">
        <h2 style="font-family: var(--font-display);">\u{1F4D6} Encyclopedia of Strategy</h2>
        <button class="btn btn-secondary" onclick="App.showMenu()">\u{2190} Back</button>
      </div>
      <p style="color: var(--text-muted); margin: 12px 0;">
        ${discovered.length} of ${allConcepts.length} concepts discovered.
        ${discovered.length < allConcepts.length ? 'Complete scenarios to discover more.' : 'All concepts mastered!'}
      </p>
      <div class="encyclopedia-grid">
        ${allConcepts.map(concept => {
          const isDiscovered = discovered.includes(concept.id);
          return `
            <div class="concept-card ${isDiscovered ? '' : 'locked'}">
              <div class="concept-name">${isDiscovered ? '\u{1F4DC}' : '\u{1F512}'} ${concept.name}</div>
              <div class="concept-desc">${isDiscovered ? concept.explanation.substring(0, 100) + '...' : '???'}</div>
              ${isDiscovered && concept.insight ? `
                <div style="margin-top: 8px; font-size: 0.8rem; color: var(--accent-gold); font-style: italic;">
                  ${concept.insight.substring(0, 80)}...
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ===================== SANDBOX MODE =====================
function renderSandbox() {
  const personalities = [
    'alwaysCooperate', 'alwaysDefect', 'titForTat', 'random',
    'greedy', 'riskSeeking', 'riskAverse', 'longTermPlanner',
    'revengeDriven', 'trustBuilder', 'opportunist', 'deceptive', 'grimTrigger',
  ];
  const s = gameState.get();
  const completedCount = s.player.completedScenarios.length;

  _appRoot.innerHTML = `
    <div class="screen sandbox-container">
      <div class="scenario-header">
        <div>
          <h2 style="font-family: var(--font-display);">\u{1F9EA} Sandbox Mode</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">
            Design a strategic interaction and see what happens.
          </p>
        </div>
        <button class="btn btn-secondary" onclick="App.showMenu()">\u{2190} Back</button>
      </div>
      <div class="sandbox-config">
        <div class="config-group">
          <h4>Game Type</h4>
          <label for="sandbox-game">Scenario Type</label>
          <select id="sandbox-game">
            <option value="prisoners_dilemma">Prisoner's Dilemma</option>
            <option value="stag_hunt">Stag Hunt</option>
            <option value="chicken">Chicken</option>
            <option value="coordination">Coordination Game</option>
            <option value="market">Market Competition</option>
            <option value="public_goods">Public Goods</option>
            <option value="tragedy_commons">Tragedy of the Commons</option>
          </select>
          <label for="sandbox-rounds">Rounds</label>
          <select id="sandbox-rounds">
            <option value="1">1 (One-shot)</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div class="config-group">
          <h4>Opponent Personality</h4>
          <label for="sandbox-ai">AI Personality</label>
          <select id="sandbox-ai">
            ${personalities.map(p => `<option value="${p}">${p}</option>`).join('')}
          </select>
          <button class="btn btn-primary" style="margin-top: 10px; width:100%;" onclick="App.runSandbox()">
            \u{25B6} Run Simulation
          </button>
        </div>
      </div>
      <div id="sandbox-results" style="margin-top: 12px;"></div>
    </div>
  `;
}

// ===================== TIMELINE =====================
function renderTimeline() {
  const s = gameState.get();
  const history = s.history;

  _appRoot.innerHTML = `
    <div class="screen">
      <div class="scenario-header">
        <h2 style="font-family: var(--font-display);">\u{1F4CB} Timeline</h2>
        <button class="btn btn-secondary" onclick="App.showMenu()">\u{2190} Back</button>
      </div>
      ${history.length === 0 ? `
        <p style="color: var(--text-muted); text-align: center; margin-top: 40px;">
          No history yet. Play some scenarios first.
        </p>
      ` : `
        <div class="timeline-view" style="margin-top: 16px;">
          ${history.slice().reverse().map(entry => {
            const scenarioDef = scenarioRegistry.get(entry.scenario);
            const scenarioName = scenarioDef ? scenarioDef.title : entry.scenario;
            const delta = entry.resourceChanges ? 
              Object.values(entry.resourceChanges).reduce((a, b) => a + b, 0) : 0;
            const sign = delta > 0 ? '+' : '';
            return `
              <div class="timeline-entry">
                <div class="turn-num">#${entry.turn + 1}</div>
                <div class="turn-choice">
                  <strong>${scenarioName}</strong>
                  <span style="color: var(--text-muted);">\u{2192} ${entry.playerChoice}</span>
                </div>
                <div class="turn-outcome" style="color: ${delta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}">
                  ${sign}${delta}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;
}

// ===================== SCENARIO EDITOR =====================
function renderScenarioEditor() {
  const personalities = [
    'alwaysCooperate', 'alwaysDefect', 'titForTat', 'random',
    'greedy', 'riskSeeking', 'riskAverse', 'longTermPlanner',
    'revengeDriven', 'trustBuilder', 'opportunist', 'deceptive', 'grimTrigger',
  ];
  const concepts = Object.keys(CONCEPTS).map(k => CONCEPTS[k]);

  _appRoot.innerHTML = `
    <div class="screen">
      <div class="scenario-header">
        <div>
          <h2 style="font-family: var(--font-display);">\u{270F} Scenario Editor</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">
            Create and test your own strategic scenarios.
          </p>
        </div>
        <button class="btn btn-secondary" onclick="App.showMenu()">\u{2190} Back</button>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
        <div class="config-group">
          <h4>Scenario Details</h4>
          <label for="editor-title">Title</label>
          <input id="editor-title" type="text" placeholder="My Scenario" />
          <label for="editor-era">Era</label>
          <select id="editor-era">
            <option value="1">Era 1</option>
            <option value="2">Era 2</option>
            <option value="3">Era 3</option>
            <option value="4">Era 4</option>
            <option value="5">Era 5</option>
            <option value="6">Era 6</option>
          </select>
          <label for="editor-order">Order</label>
          <input id="editor-order" type="number" value="1" min="1" max="100" />
          <label for="editor-concept">Concept</label>
          <select id="editor-concept">
            <option value="">None</option>
            ${concepts.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
          <label for="editor-type">Game Type</label>
          <select id="editor-type">
            <option value="prisoners_dilemma">Prisoner's Dilemma</option>
            <option value="stag_hunt">Stag Hunt</option>
            <option value="chicken">Chicken</option>
            <option value="coordination">Coordination</option>
            <option value="market">Market</option>
            <option value="public_goods">Public Goods</option>
            <option value="tragedy_commons">Tragedy of the Commons</option>
            <option value="scarcity">Scarcity</option>
          </select>
          <label for="editor-context">Context</label>
          <textarea id="editor-context" rows="3" placeholder="Describe the scenario situation..." style="width:100%; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); padding:8px; font-size:0.9rem;"></textarea>
          <label for="editor-idealnote">Optimal Strategy Note</label>
          <textarea id="editor-idealnote" rows="2" placeholder="What's the optimal play?" style="width:100%; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); padding:8px; font-size:0.9rem;"></textarea>
        </div>
        <div class="config-group">
          <h4>Choices</h4>
          <div id="editor-choices-list"></div>
          <button class="btn btn-secondary" style="width:100%; margin-top: 8px;" onclick="App.addEditorChoice()">+ Add Choice</button>
          <h4 style="margin-top: 16px;">AI Agents</h4>
          <div id="editor-agents-list"></div>
          <button class="btn btn-secondary" style="width:100%; margin-top: 8px;" onclick="App.addEditorAgent()">+ Add Agent</button>
        </div>
      </div>
      <div class="config-group" style="margin-top: 16px;">
        <h4>Payoff Matrix (2x2 for simple games)</h4>
        <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 8px;">Format: row label, col label, player payoff, AI payoff per cell.</p>
        <div id="editor-payoff-matrix"></div>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 16px; justify-content: center;">
        <button class="btn btn-primary" onclick="App.saveEditorScenario()">\u{1F4BE} Save Scenario</button>
        <button class="btn btn-secondary" onclick="App.testEditorScenario()">\u{25B6} Test Scenario</button>
        <button class="btn btn-danger" onclick="App.loadEditorScenario()">\u{1F4C2} Load</button>
      </div>
      <div id="editor-saved-list" style="margin-top: 12px;"></div>
      <div id="editor-status" style="margin-top: 8px; text-align: center;"></div>
    </div>
  `;

  App._editorChoices = [
    { id: 'cooperate', label: 'Cooperate', description: 'Work together', risk: 'low', tags: ['cooperate'] },
    { id: 'defect', label: 'Defect', description: 'Betray trust', risk: 'high', tags: ['defect'] },
  ];
  App._editorAgents = [
    { id: 'opponent', personality: 'titForTat', name: 'Opponent' },
  ];
  App._editorPayoffMatrix = { rows: ['Cooperate', 'Defect'], cols: ['Cooperate', 'Defect'], values: [[3,3,0,5],[5,0,1,1]] };

  App.refreshEditorUI();
}

function setupEditorButton(id, action) {
  const el = document.getElementById(id);
  if (el) el.onclick = action;
}

// ===================== REPLAY MODE =====================
function renderReplay(data) {
  const { scenario, history, aiChoices, result } = data;
  const steps = history || [];
  const totalSteps = steps.length;

  _appRoot.innerHTML = `
    <div class="screen">
      <div class="scenario-header">
        <div>
          <h2 style="font-family: var(--font-display);">\u{1F504} Replay: ${scenario.title}</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Step <span id="replay-step-num">1</span> of ${totalSteps}</p>
        </div>
        <button class="btn btn-secondary" onclick="App.showMenu()">\u{2190} Back</button>
      </div>

      <div style="margin: 16px 0; display: flex; align-items: center; gap: 12px;">
        <button class="btn btn-secondary" id="replay-prev" onclick="App.replayPrev()">\u{25C0} Prev</button>
        <input type="range" id="replay-slider" min="1" max="${totalSteps}" value="1" step="1"
          style="flex:1; accent-color: var(--accent-gold);"
          oninput="App.replaySeek(parseInt(this.value))" />
        <button class="btn btn-secondary" id="replay-next" onclick="App.replayNext()">Next \u{25B6}</button>
      </div>

      <div id="replay-content" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 20px;">
        <p style="color: var(--text-muted); text-align: center;">Use the slider to navigate through steps.</p>
      </div>

      <div id="replay-summary" style="display: none; margin-top: 16px;" class="resources-delta">
        <h3>Final Summary</h3>
        <div id="replay-summary-content"></div>
      </div>
    </div>
  `;

  App._replayData = { scenario, history: steps, aiChoices, result, currentStep: 0, totalSteps };
  App.replaySeek(0);
}

// ===================== ANALYTICS DASHBOARD =====================
function renderAnalyticsDashboard() {
  const events = analytics.getEvents();
  const choices = events.filter(e => e.type === 'choice');
  const completions = events.filter(e => e.type === 'scenario_complete');
  const discoveries = events.filter(e => e.type === 'discovery');
  const times = events.filter(e => e.type === 'time');

  const totalPlayed = completions.length;
  const coopRate = analytics.getCooperationRate();
  const discRate = analytics.getDiscoveryRate();
  const avgTime = analytics.getAverageTimePerScenario();

  const choiceCounts = {};
  for (const e of choices) {
    const cid = e.data.choiceId;
    choiceCounts[cid] = (choiceCounts[cid] || 0) + 1;
  }
  const sortedChoices = Object.entries(choiceCounts).sort((a, b) => b[1] - a[1]);
  const maxChoice = sortedChoices.length > 0 ? sortedChoices[0][1] : 1;

  const scenarioRetries = {};
  for (const e of completions) {
    const sid = e.data.scenarioId;
    if (!scenarioRetries[sid]) scenarioRetries[sid] = { completions: 0, totalChoices: 0 };
    scenarioRetries[sid].completions++;
  }
  for (const e of choices) {
    const sid = e.data.scenarioId;
    if (!scenarioRetries[sid]) scenarioRetries[sid] = { completions: 0, totalChoices: 0 };
    scenarioRetries[sid].totalChoices++;
  }

  _appRoot.innerHTML = `
    <div class="screen">
      <div class="scenario-header">
        <div>
          <h2 style="font-family: var(--font-display);">\u{1F4CA} Analytics Dashboard</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">
            ${events.length} total events tracked
          </p>
        </div>
        <button class="btn btn-secondary" onclick="App.showMenu()">\u{2190} Back</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 16px 0;">
        <div class="resources-delta" style="text-align: center;">
          <div style="font-size: 2rem; color: var(--accent-gold);">${totalPlayed}</div>
          <div style="color: var(--text-muted); font-size: 0.85rem;">Scenarios Played</div>
        </div>
        <div class="resources-delta" style="text-align: center;">
          <div style="font-size: 2rem; color: var(--accent-green);">${(coopRate * 100).toFixed(1)}%</div>
          <div style="color: var(--text-muted); font-size: 0.85rem;">Cooperation Rate</div>
        </div>
        <div class="resources-delta" style="text-align: center;">
          <div style="font-size: 2rem; color: var(--accent-purple);">${(discRate * 100).toFixed(1)}%</div>
          <div style="color: var(--text-muted); font-size: 0.85rem;">Discovery Rate</div>
        </div>
        <div class="resources-delta" style="text-align: center;">
          <div style="font-size: 2rem; color: var(--accent-blue);">${(avgTime / 1000).toFixed(1)}s</div>
          <div style="color: var(--text-muted); font-size: 0.85rem;">Avg Time / Scenario</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="resources-delta">
          <h3>Choice Distribution</h3>
          ${sortedChoices.length === 0 ? '<p style="color: var(--text-muted);">No choices tracked yet.</p>' : `
            <div style="margin-top: 8px;">
              ${sortedChoices.map(([cid, count]) => `
                <div style="margin-bottom: 6px;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <span>${cid}</span>
                    <span style="color: var(--text-muted);">${count}</span>
                  </div>
                  <div style="height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; width: ${(count / maxChoice * 100).toFixed(1)}%; background: var(--accent-gold); border-radius: 3px;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
        <div class="resources-delta">
          <h3>Retry Rates by Scenario</h3>
          ${Object.keys(scenarioRetries).length === 0 ? '<p style="color: var(--text-muted);">No data yet.</p>' : `
            <div style="margin-top: 8px; max-height: 300px; overflow-y: auto;">
              ${Object.entries(scenarioRetries).map(([sid, data]) => {
                const name = scenarioRegistry.get(sid) ? scenarioRegistry.get(sid).title : sid;
                const retryRate = data.completions > 0 ? ((data.totalChoices / data.completions) - 1).toFixed(1) : '0';
                return `
                  <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(48,54,61,0.5); font-size: 0.85rem;">
                    <span>${name}</span>
                    <span style="color: var(--text-muted);">${retryRate} retries</span>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>

      <div style="margin-top: 16px; text-align: center;">
        <button class="btn btn-primary" onclick="App.exportAnalyticsCSV()">\u{1F4E5} Export CSV</button>
        <button class="btn btn-danger" onclick="if(confirm('Clear all analytics data?')) { analytics.clear(); App.showAnalytics(); }" style="margin-left: 8px;">\u{1F5D1} Clear Data</button>
      </div>
    </div>
  `;
}
