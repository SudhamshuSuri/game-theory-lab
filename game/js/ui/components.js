import { events } from '../engine/events.js';
import { gameState } from '../engine/state.js';
import { scenarioRegistry } from '../scenarios/registry.js';
import { CONCEPTS } from '../data/concepts.js';
import { FLAVOR, BOSS_FIGHTS } from '../data/flavor.js';
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
    case 'conceptDetail': renderConceptDetail(data.conceptId); break;
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
  const total = scenarioRegistry.getAll().filter(sc => !sc.bossFight).length;
  const discoveries = s.player.discoveries.length;
  const allScenarios = scenarioRegistry.getAll();
  const currentEra = Math.min(
    6,
    Math.floor(completed / 10) + 1
  );

  const eraBlocks = [1,2,3,4,5,6].map(eraNum => {
    const allScns = scenarioRegistry.getByEra(eraNum);
    const normalScns = allScns.filter(sc => !sc.bossFight);
    const bossScns = allScns.filter(sc => sc.bossFight);
    const done = normalScns.filter(sc => completedArr.includes(sc.id)).length;
    const unlocked = eraNum <= 1 || scenarioRegistry.getByEra(eraNum - 1)
      .filter(sc => !sc.bossFight).every(sc => completedArr.includes(sc.id));
    const allNormalDone = unlocked && normalScns.every(sc => completedArr.includes(sc.id));
    const bossData = BOSS_FIGHTS[eraNum];
    const bossDone = bossData && completedArr.includes(bossData.id);
    return `
      <div class="config-group" style="${!unlocked ? 'opacity:0.4;' : ''}">
        <h4>${FLAVOR.titles[`era${eraNum}`] || `Era ${eraNum}`}</h4>
        <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 8px;">
          ${FLAVOR.eraDescriptions[eraNum] || ''}
        </p>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">
          ${done}/${normalScns.length} completed
          ${!unlocked ? ' \u{1F512} Locked: Complete Era ' + (eraNum - 1) : ''}
        </p>
        <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">
          ${normalScns.map(sc => {
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
        ${bossData ? `
        <div style="margin-top: 12px; border-top: 1px solid var(--border-color); padding-top: 12px;">
          ${allNormalDone ? `
            <div style="background: rgba(212,163,115,0.08); border: 1px solid var(--accent-gold); border-radius: var(--radius-md); padding: 12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                <div style="min-width:0;">
                  <div style="font-size:0.7rem; color:var(--accent-gold); text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">\u{1F3F9} Boss Challenge</div>
                  <div style="font-weight:600; color:var(--text-primary); font-size:0.95rem;">${bossData.title}</div>
                  <div style="font-size:0.8rem; color:var(--text-muted);">${bossData.subtitle}</div>
                </div>
                <button class="btn ${bossDone ? 'btn-primary' : 'btn-secondary'}"
                  style="flex-shrink:0; font-size:0.8rem; padding:6px 14px; white-space:nowrap;"
                  ${bossDone ? 'disabled' : `onclick="App.playScenario('${bossData.id}')"`}>
                  ${bossDone ? '\u{2713} Defeated' : '\u{2694} Fight'}
                </button>
              </div>
              ${bossDone ? `
              <div style="margin-top:8px; padding:8px; background:rgba(212,163,115,0.05); border-radius:var(--radius-sm); font-size:0.8rem; color:var(--text-secondary); font-style:italic;">
                ${bossData.payoff}
              </div>` : ''}
            </div>
          ` : `
            <div style="background: var(--bg-tertiary); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 16px; opacity:0.6; text-align:center;">
              <div style="font-size:1.8rem; font-weight:700; color:var(--text-muted); letter-spacing:4px;">???</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
                ${unlocked ? 'Complete all scenarios in this era to unlock the Boss Challenge' : 'Unlock this era first'}
              </div>
            </div>
          `}
        </div>` : ''}
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
          const choiceLabels = Object.fromEntries(scenarioDef.choices.map(c => [c.id, c.label]));
          const you = choiceLabels[last.playerChoice] || last.playerChoice;
          const them = choiceLabels[Object.values(last.aiChoices)[0]] || Object.values(last.aiChoices)[0];
          const result = Object.values(last.result.resourceChanges || {}).reduce((a,b) => a+b, 0);
          return `You chose ${you}. They chose ${them}. Net change: ${result >= 0 ? '+' : ''}${result} gold.`;
        })()}</p>
      </div>` : ''}
    </div>
  `;
}

// ===================== RESULTS VIEW =====================
function renderResults(data) {
  const { scenario, result, playerChoice, aiChoices, aiReasoning, isMultiRound, multiRoundComplete, history } = data;
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
          const agentConfig = scenario.agents?.[agentId];
          const name = agentConfig?.name || agentId.charAt(0).toUpperCase() + agentId.slice(1);
          const label = (scenario.choices || []).find(c => c.id === choice)?.label || choice;
          const reasoning = aiReasoning?.[name] || '';
          return `
            <div style="font-size: 0.9rem; padding: 4px 0;">
              <strong>${name}:</strong> <span style="color: var(--accent-gold);">${label}</span>
              ${reasoning ? `
              <div style="font-size: 0.8rem; color: var(--text-muted); padding: 4px 0 0 12px; border-left: 2px solid var(--accent-blue); margin: 4px 0 0 8px;">
                <em>${reasoning}</em>
              </div>` : ''}
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

      ${scenario.gameTree ? renderGameTree(scenario.gameTree, playerChoice) : ''}

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

// ===================== CONCEPT DETAIL OVERLAY =====================
function renderConceptDetail(conceptId) {
  const concept = CONCEPTS[conceptId];
  if (!concept) return;

  const overlay = document.createElement('div');
  overlay.className = 'discovery-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="discovery-card">
      <button class="btn-close" onclick="this.closest('.discovery-overlay').remove()" style="position:absolute;top:12px;right:16px;background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;">\u2715</button>
      <h2>\u{1F4DC} ${concept.name}</h2>
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
                <td style="padding: 6px; border:1px solid var(--border-color); background: rgba(255,255,255,0.05); text-align:center;"><strong>${concept.payoffMatrix.cols[0]}</strong></td>
                <td style="padding: 6px; border:1px solid var(--border-color); background: rgba(255,255,255,0.05); text-align:center;"><strong>${concept.payoffMatrix.cols[1]}</strong></td>
              </tr>
              <tr>
                <td style="padding: 6px; border:1px solid var(--border-color); background: rgba(255,255,255,0.05);"><strong>${concept.payoffMatrix.rows[0]}</strong></td>
                <td style="padding: 6px; border:1px solid var(--border-color); text-align:center;">${concept.payoffMatrix.values[0][0]}</td>
                <td style="padding: 6px; border:1px solid var(--border-color); text-align:center;">${concept.payoffMatrix.values[0][1]}</td>
              </tr>
              <tr>
                <td style="padding: 6px; border:1px solid var(--border-color); background: rgba(255,255,255,0.05);"><strong>${concept.payoffMatrix.rows[1]}</strong></td>
                <td style="padding: 6px; border:1px solid var(--border-color); text-align:center;">${concept.payoffMatrix.values[1][0]}</td>
                <td style="padding: 6px; border:1px solid var(--border-color); text-align:center;">${concept.payoffMatrix.values[1][1]}</td>
              </tr>
            </table>
          </div>
        ` : ''}
        <div class="discovery-insight">${concept.insight}</div>
      </div>
      <button class="btn-discovery" onclick="this.closest('.discovery-overlay').remove()" style="background:var(--accent-blue);">Close \u2192</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ===================== ENCYCLOPEDIA =====================
function renderEncyclopedia() {
  const s = gameState.get();
  let discovered = s.player.discoveries;
  if (discovered.length === 0) {
    try {
      const raw = localStorage.getItem('sovereign_save_auto');
      if (raw) {
        const autoSave = JSON.parse(raw);
        if (autoSave.state?.player?.discoveries?.length) {
          discovered = autoSave.state.player.discoveries;
        }
      }
    } catch {}
  }
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
          const clickHandler = isDiscovered ? `onclick="App.showConceptDetail('${concept.id}')"` : '';
          return `
            <div class="concept-card ${isDiscovered ? 'clickable' : 'locked'}" ${clickHandler}>
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
  // Annotate history entries with scenario def, outcome, discovery info
  const seenConcepts = new Set();
  const annotated = history.map((entry, i) => {
    const def = scenarioRegistry.get(entry.scenario);
    const scenarioName = def ? def.title : entry.scenario;
    const era = def ? def.era : 0;
    const outcome = entry.outcome || 'mixed';
    const playerChoiceLabel = def ? (def.choices.find(c => c.id === entry.playerChoice)?.label || entry.playerChoice) : entry.playerChoice;
    const aiLabels = entry.aiChoices ? Object.entries(entry.aiChoices).map(([agentId, choice]) => {
      const agentName = def?.agents?.[agentId]?.name || agentId;
      const choiceLabel = def ? (def.choices.find(c => c.id === choice)?.label || choice) : choice;
      return { agentName, choiceLabel };
    }) : [];
    const delta = entry.resourceChanges ? Object.values(entry.resourceChanges).reduce((a, b) => a + b, 0) : 0;
    const concept = def?.concept ? CONCEPTS[def.concept] : null;
    let isDiscovery = false;
    if (concept && !seenConcepts.has(concept.id)) {
      seenConcepts.add(concept.id);
      isDiscovery = true;
    }
    return { ...entry, index: i, scenarioName, era, outcome, playerChoiceLabel, aiLabels, delta, concept, isDiscovery, def };
  });

  const eras = [...new Set(annotated.map(e => e.era).filter(Boolean))].sort();
  const victoryCount = annotated.filter(e => e.outcome === 'victory').length;
  const defeatCount = annotated.filter(e => e.outcome === 'defeat').length;
  const mixedCount = annotated.filter(e => e.outcome === 'mixed').length;

  _appRoot.innerHTML = `
    <div class="screen">
      <div class="scenario-header">
        <div>
          <h2 style="font-family: var(--font-display);">\u{1F4CB} Timeline</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">
            ${history.length} entries
            ${history.length > 0 ? `| <span style="color:var(--accent-green)">\u{1F3C6}${victoryCount}</span> <span style="color:var(--accent-red)">\u{1F4A5}${defeatCount}</span> <span style="color:var(--accent-gold)">\u{2694}${mixedCount}</span>` : ''}
          </p>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          ${history.length > 0 ? `
          <select id="timeline-era-filter" style="padding:6px 10px; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.85rem;" onchange="App.showTimeline()">
            <option value="all">All Eras</option>
            ${eras.map(e => `<option value="${e}">Era ${e}</option>`).join('')}
          </select>
          ` : ''}
          <button class="btn btn-secondary" onclick="App.showMenu()">\u{2190} Back</button>
        </div>
      </div>
      ${annotated.length === 0 ? `
        <p style="color: var(--text-muted); text-align: center; margin-top: 40px;">
          No history yet. Play some scenarios first.
        </p>
      ` : `
        <div class="timeline-view" style="margin-top: 16px;">
          ${(() => {
            const filterVal = typeof document !== 'undefined' && document.getElementById('timeline-era-filter')?.value || 'all';
            const filtered = filterVal === 'all' ? annotated : annotated.filter(e => e.era === parseInt(filterVal));
            const sorted = [...filtered].reverse();
            return sorted.map(entry => {
              const outcomeBadge = entry.outcome === 'victory'
                ? '<span style="color:var(--accent-green); font-weight:600;">\u{1F3C6} Victory</span>'
                : entry.outcome === 'defeat'
                  ? '<span style="color:var(--accent-red); font-weight:600;">\u{1F4A5} Defeat</span>'
                  : '<span style="color:var(--accent-gold); font-weight:600;">\u{2694} Mixed</span>';
              const resourceBreakdown = entry.resourceChanges && Object.keys(entry.resourceChanges).length > 0
                ? Object.entries(entry.resourceChanges).map(([k, v]) => {
                    const icon = RESOURCE_ICONS[k] || '';
                    const cls = v > 0 ? 'var(--accent-green)' : 'var(--accent-red)';
                    const sign = v > 0 ? '+' : '';
                    return `<span style="color:${cls}; font-size:0.8rem; margin-right:8px;">${icon}${sign}${v}</span>`;
                  }).join('')
                : '<span style="color:var(--text-muted); font-size:0.8rem;">No change</span>';
              const aiText = entry.aiLabels.length > 0
                ? entry.aiLabels.map(a => `${a.agentName}: ${a.choiceLabel}`).join(' | ')
                : '';
              return `
                <div class="timeline-entry" style="flex-wrap: wrap;">
                  <div class="turn-num">#${history.findIndex(h => h.timestamp === entry.timestamp) + 1}</div>
                  <div class="turn-choice" style="min-width:0;">
                    <div><strong>${entry.scenarioName}</strong> ${outcomeBadge}</div>
                    <div style="color: var(--accent-gold); font-size:0.85rem;">${entry.playerChoiceLabel}</div>
                    ${aiText ? `<div style="color: var(--text-muted); font-size:0.8rem;">\u{1F916} ${aiText}</div>` : ''}
                    ${entry.isDiscovery && entry.concept ? `<div style="color: var(--accent-purple); font-size:0.8rem; margin-top:2px;">\u{1F4DC} Discovered: ${entry.concept.name}</div>` : ''}
                  </div>
                  <div class="turn-outcome" style="text-align:right; flex-shrink:0;">
                    <div style="margin-bottom:4px;">${resourceBreakdown}</div>
                    <div style="color: ${entry.delta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}; font-size:0.9rem; font-weight:600;">
                      ${entry.delta >= 0 ? '+' : ''}${entry.delta} net
                    </div>
                    ${entry.era ? `<div style="color:var(--text-muted); font-size:0.75rem; margin-top:2px;">Era ${entry.era}</div>` : ''}
                  </div>
                </div>
              `;
            }).join('');
          })()}
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
  const { scenario, history, aiChoices, result } = data.replayData || data;
  const steps = history || [];
  const totalSteps = steps.length;

  _appRoot.innerHTML = `
    <div class="screen">
      <div class="scenario-header">
        <div>
          <h2 style="font-family: var(--font-display);">\u{1F504} Replay: ${scenario.title}</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Step <span id="replay-step-num">1</span> of ${totalSteps}</p>
        </div>
        <button class="btn btn-secondary" onclick="App.replayBack()">\u{2190} Back</button>
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
  const s = gameState.get();
  const events = analytics.getEvents();
  const choices = events.filter(e => e.type === 'choice');
  const completions = events.filter(e => e.type === 'scenario_complete');
  const discoveries = events.filter(e => e.type === 'discovery');
  const times = events.filter(e => e.type === 'time');

  const totalPlayed = completions.length;
  const coopRate = analytics.getCooperationRate();
  const totalConcepts = Object.keys(CONCEPTS).length;
  const discRate = totalConcepts > 0 ? discoveries.length / totalConcepts : 0;
  const avgTime = analytics.getAverageTimePerScenario();

  // Choice distribution
  const choiceCounts = {};
  for (const e of choices) {
    const cid = e.data.choiceId;
    choiceCounts[cid] = (choiceCounts[cid] || 0) + 1;
  }
  const sortedChoices = Object.entries(choiceCounts).sort((a, b) => b[1] - a[1]);
  const maxChoice = sortedChoices.length > 0 ? sortedChoices[0][1] : 1;

  // Outcome distribution
  const outcomeCounts = { victory: 0, defeat: 0, mixed: 0 };
  for (const e of choices) {
    const o = e.data.outcome;
    if (o === 'victory') outcomeCounts.victory++;
    else if (o === 'defeat') outcomeCounts.defeat++;
    else outcomeCounts.mixed++;
  }
  const maxOutcome = Math.max(1, outcomeCounts.victory, outcomeCounts.defeat, outcomeCounts.mixed);

  // Era breakdown
  const eraCounts = {};
  const seenScenarios = new Set();
  for (const e of choices) {
    const sid = e.data.scenarioId;
    if (!seenScenarios.has(sid)) {
      seenScenarios.add(sid);
      const def = scenarioRegistry.get(sid);
      const era = def ? def.era : 0;
      eraCounts[era] = (eraCounts[era] || 0) + 1;
    }
  }
  for (let i = 1; i <= 6; i++) { if (!eraCounts[i]) eraCounts[i] = 0; }
  const maxEra = Math.max(1, ...Object.values(eraCounts));

  // Cooperation trend (groups of 5 choices sorted chronologically)
  const sortedByTime = [...choices].sort((a, b) => a.timestamp - b.timestamp);
  const trendGroups = [];
  const groupSize = 5;
  for (let i = 0; i < sortedByTime.length; i += groupSize) {
    const group = sortedByTime.slice(i, i + groupSize);
    if (group.length === 0) continue;
    const coopCount = group.filter(e => {
      const cid = e.data.choiceId;
      return cid === 'honor' || cid === 'share' || cid === 'fair' || cid === 'cooperate' || cid === 'ration' || cid === 'negotiate';
    }).length;
    trendGroups.push({ label: `#${i + 1}`, rate: coopCount / group.length });
  }

  // Discovered concepts (from tracked analytics events)
  const discoveredConceptIds = [...new Set(discoveries.map(e => e.data.conceptId).filter(Boolean))];
  const discoveredConcepts = discoveredConceptIds.map(id => CONCEPTS[id]).filter(Boolean);

  // Resource history
  const resHist = gameState.get().resourcesHistory || [];
  const recentHistory = resHist.slice(-20);
  const maxGold = Math.max(1, ...recentHistory.map(h => h.resources?.gold || 0));
  const maxMilitary = Math.max(1, ...recentHistory.map(h => h.resources?.military || 0));

  // Retry rates
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

      <!-- KPI Cards -->
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

      <!-- Row 1: Outcome Distribution + Era Breakdown -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div class="resources-delta">
          <h3>Outcome Distribution</h3>
          ${choices.length === 0 ? '<p style="color: var(--text-muted);">No data yet.</p>' : `
            ${['victory', 'defeat', 'mixed'].map(o => {
              const count = outcomeCounts[o];
              const pct = choices.length > 0 ? (count / choices.length * 100).toFixed(1) : 0;
              const color = o === 'victory' ? 'var(--accent-green)' : o === 'defeat' ? 'var(--accent-red)' : 'var(--accent-gold)';
              const icon = o === 'victory' ? '\u{1F3C6}' : o === 'defeat' ? '\u{1F4A5}' : '\u{2694}';
              const label = o === 'victory' ? 'Victory' : o === 'defeat' ? 'Defeat' : 'Mixed';
              return `
                <div style="margin-bottom: 8px;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <span>${icon} ${label}</span>
                    <span style="color: var(--text-muted);">${count} (${pct}%)</span>
                  </div>
                  <div style="height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${(count / maxOutcome * 100).toFixed(1)}%; background: ${color}; border-radius: 4px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          `}
        </div>
        <div class="resources-delta">
          <h3>By Era</h3>
          ${sortedChoices.length === 0 ? '<p style="color: var(--text-muted);">No data yet.</p>' : `
            ${[1,2,3,4,5,6].map(era => {
              const count = eraCounts[era] || 0;
              return `
                <div style="margin-bottom: 6px;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <span>Era ${era}</span>
                    <span style="color: var(--text-muted);">${count}</span>
                  </div>
                  <div style="height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; width: ${(count / maxEra * 100).toFixed(1)}%; background: var(--accent-blue); border-radius: 3px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          `}
        </div>
      </div>

      <!-- Row 2: Choice Distribution + Cooperation Trend -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div class="resources-delta">
          <h3>Choice Distribution</h3>
          ${sortedChoices.length === 0 ? '<p style="color: var(--text-muted);">No choices tracked yet.</p>' : `
            <div style="margin-top: 8px; max-height: 300px; overflow-y: auto;">
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
          <h3>Cooperation Trend <span style="color:var(--text-muted); font-weight:400; text-transform:none; letter-spacing:0; font-size:0.8rem;">(per ${groupSize} choices)</span></h3>
          ${trendGroups.length < 2 ? '<p style="color: var(--text-muted);">Need more choices to show trend.</p>' : `
            <div style="margin-top: 8px; display: flex; align-items: end; gap: 3px; height: 100px;">
              ${trendGroups.map(g => `
                <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:end; height:100%;">
                  <div style="width:100%; background: ${g.rate >= 0.5 ? 'var(--accent-green)' : 'var(--accent-red)'}; border-radius: 2px 2px 0 0; height: ${Math.max(2, g.rate * 100)}%; min-height: ${g.rate > 0 ? '4px' : '2px'}; transition: height 0.3s;"></div>
                  <span style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px; white-space:nowrap;">${g.label}</span>
                </div>
              `).join('')}
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted); margin-top:4px;">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          `}
        </div>
      </div>

      <!-- Row 3: Discovered Concepts + Retry Rates -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div class="resources-delta">
          <h3>Discovered Concepts <span style="color:var(--text-muted); font-weight:400; text-transform:none; letter-spacing:0; font-size:0.8rem;">(${discoveredConcepts.length}/${Object.keys(CONCEPTS).length})</span></h3>
          ${discoveredConcepts.length === 0 ? '<p style="color: var(--text-muted);">No concepts discovered yet.</p>' : `
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
              ${discoveredConcepts.map(c => `
                <span style="background: rgba(188,140,255,0.15); color: var(--accent-purple); padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; border: 1px solid rgba(188,140,255,0.2); cursor:pointer;" onclick="App.showConceptDetail('${c.id}')">
                  \u{1F4DC} ${c.name}
                </span>
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

      <!-- Resource History -->
      ${recentHistory.length > 1 ? `
      <div class="resources-delta" style="margin-bottom: 16px;">
        <h3>Resource History <span style="color:var(--text-muted); font-weight:400; text-transform:none; letter-spacing:0; font-size:0.8rem;">(last ${recentHistory.length} turns)</span></h3>
        <div style="margin-top: 8px;">
          <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">Gold</div>
          <div style="display: flex; align-items: end; gap: 2px; height: 50px;">
            ${recentHistory.map(h => {
              const g = h.resources?.gold || 0;
              return `<div style="flex:1; height: ${Math.max(2, g / maxGold * 100)}%; background: var(--accent-gold); border-radius: 2px 2px 0 0;" title="Turn ${h.turn}: ${g} gold"></div>`;
            }).join('')}
          </div>
        </div>
        <div style="margin-top: 8px;">
          <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">Military</div>
          <div style="display: flex; align-items: end; gap: 2px; height: 50px;">
            ${recentHistory.map(h => {
              const m = h.resources?.military || 0;
              return `<div style="flex:1; height: ${Math.max(2, m / maxMilitary * 100)}%; background: var(--accent-red); border-radius: 2px 2px 0 0;" title="Turn ${h.turn}: ${m} military"></div>`;
            }).join('')}
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted); margin-top:4px;">
          <span>${recentHistory[0]?.completedCount || 0} scenarios</span>
          <span>${recentHistory[recentHistory.length - 1]?.completedCount || 0} scenarios</span>
        </div>
      </div>` : ''}

      <div style="margin-top: 16px; text-align: center;">
        <button class="btn btn-primary" onclick="App.exportAnalyticsCSV()">\u{1F4E5} Export CSV</button>
        <button class="btn btn-danger" onclick="if(confirm('Clear all analytics data?')) { App.clearAnalytics(); }" style="margin-left: 8px;">\u{1F5D1} Clear Data</button>
      </div>
    </div>
  `;
}

function renderGameTree(tree, chosenId) {
  let html = '<div class="game-tree"><h3>\u{1F333} Game Tree</h3>';
  html += _renderTreeNodes(tree, chosenId, 0);
  html += '</div>';
  return html;
}

function _renderTreeNodes(nodes, chosenId, depth) {
  let html = '<ul class="tree-level">';
  for (const node of nodes) {
    const isChosen = node.id && node.id === chosenId;
    const pathClass = isChosen ? ' chosen-path' : '';
    const indent = '&nbsp;'.repeat(depth * 2);
    html += '<li class="tree-node' + pathClass + '">';
    if (node.branch) {
      html += `<div class="tree-branch-label">${indent}${node.label}</div>`;
      if (node.children) {
        html += _renderTreeNodes(node.children, chosenId, depth + 1);
      }
    } else {
      html += '<div class="tree-leaf' + pathClass + '">';
      html += `${indent}${node.label}`;
      if (node.payoff) {
        html += ` <span class="tree-payoff">\u2192 (${node.payoff[0]}, ${node.payoff[1]})</span>`;
      }
      if (isChosen) {
        html += ' <span class="tree-chosen-badge">\u2190 Your Choice</span>';
      }
      html += '</div>';
    }
    html += '</li>';
  }
  html += '</ul>';
  return html;
}
