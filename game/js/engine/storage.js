const STORAGE_KEY = 'sovereign_save';
const SETTINGS_KEY = 'sovereign_settings';

export class SaveManager {
  constructor(gameState) {
    this.state = gameState;
    this._saveSlots = 3;
  }

  save(slot = 0) {
    try {
      const data = JSON.stringify({
        version: this.state.get().meta.version,
        timestamp: Date.now(),
        state: this.state.get(),
      });
      const key = `${STORAGE_KEY}_${slot}`;
      localStorage.setItem(key, data);
      return { success: true, slot };
    } catch (e) {
      console.error('Save failed:', e);
      return { success: false, error: e.message };
    }
  }

  load(slot = 0) {
    try {
      const key = `${STORAGE_KEY}_${slot}`;
      const raw = localStorage.getItem(key);
      if (!raw) return { success: false, error: 'No save found' };
      const data = JSON.parse(raw);
      if (data.state) {
        this.state.set(data.state);
        return { success: true, slot, timestamp: data.timestamp };
      }
      return { success: false, error: 'Corrupted save' };
    } catch (e) {
      console.error('Load failed:', e);
      return { success: false, error: e.message };
    }
  }

  deleteSave(slot = 0) {
    localStorage.removeItem(`${STORAGE_KEY}_${slot}`);
  }

  getSaveInfo(slot = 0) {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}_${slot}`);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return {
        exists: true,
        slot,
        timestamp: data.timestamp,
        scenariosCompleted: data.state?.player?.completedScenarios?.length || 0,
        era: data.state?.world?.era || 1,
        discoveries: data.state?.player?.discoveries?.length || 0,
      };
    } catch {
      return null;
    }
  }

  listSaves() {
    const saves = [];
    for (let i = 0; i < this._saveSlots; i++) {
      saves.push(this.getSaveInfo(i));
    }
    return saves;
  }

  exportSave(slot = 0) {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}_${slot}`);
      if (!raw) return null;
      return btoa(raw);
    } catch (e) {
      console.error('Export failed:', e);
      return null;
    }
  }

  importSave(data, slot = 0) {
    try {
      const decoded = atob(data);
      const parsed = JSON.parse(decoded);
      localStorage.setItem(`${STORAGE_KEY}_${slot}`, decoded);
      return { success: true, slot };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  hasSave() {
    for (let i = 0; i < this._saveSlots; i++) {
      if (localStorage.getItem(`${STORAGE_KEY}_${i}`)) return true;
    }
    return false;
  }

  autoSave() {
    try {
      const data = JSON.stringify({
        version: this.state.get().meta.version,
        timestamp: Date.now(),
        state: this.state.get(),
      });
      localStorage.setItem(`${STORAGE_KEY}_auto`, data);
      return true;
    } catch (e) {
      console.error('Auto-save failed:', e);
      return false;
    }
  }

  loadAutoSave() {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}_auto`);
      if (!raw) return { success: false, error: 'No auto-save found' };
      const data = JSON.parse(raw);
      if (data.state) {
        this.state.set(data.state);
        return { success: true, timestamp: data.timestamp };
      }
      return { success: false, error: 'Corrupted auto-save' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  hasAutoSave() {
    return !!localStorage.getItem(`${STORAGE_KEY}_auto`);
  }

  saveWaypoint(scenarioId, score, outcome) {
    const state = this.state.get();
    if (!state.waypoints) state.waypoints = [];
    state.waypoints.push({
      scenarioId,
      score: score || 0,
      outcome: outcome || 'mixed',
      order: state.waypoints.length + 1,
      timestamp: Date.now(),
      resources: { ...state.player.resources },
    });
    this.state._notify();
    this.autoSave();
  }

  getWaypoints() {
    return this.state.get().waypoints || [];
  }

  trackResourcesHistory() {
    const state = this.state.get();
    if (!state.resourcesHistory) state.resourcesHistory = [];
    state.resourcesHistory.push({
      turn: state.world.turn,
      timestamp: Date.now(),
      resources: { ...state.player.resources },
      reputation: state.player.reputation,
      completedCount: state.player.completedScenarios.length,
    });
    if (state.resourcesHistory.length > 200) state.resourcesHistory.shift();
    this.state._notify();
  }

  getResourcesHistory() {
    return this.state.get().resourcesHistory || [];
  }

  undoLastChoice() {
    if (!this.state.canUndo()) return false;
    this.state.undo();
    return true;
  }

  saveCustomScenario(scenario) {
    try {
      const key = 'sovereign_custom_scenarios';
      const raw = localStorage.getItem(key);
      const scenarios = raw ? JSON.parse(raw) : [];
      const idx = scenarios.findIndex(s => s.id === scenario.id);
      if (idx >= 0) scenarios[idx] = scenario;
      else scenarios.push(scenario);
      localStorage.setItem(key, JSON.stringify(scenarios));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  loadCustomScenario(id) {
    try {
      const raw = localStorage.getItem('sovereign_custom_scenarios');
      if (!raw) return null;
      const scenarios = JSON.parse(raw);
      return scenarios.find(s => s.id === id) || null;
    } catch {
      return null;
    }
  }

  listCustomScenarios() {
    try {
      const raw = localStorage.getItem('sovereign_custom_scenarios');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  deleteCustomScenario(id) {
    try {
      const key = 'sovereign_custom_scenarios';
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const scenarios = JSON.parse(raw);
      const filtered = scenarios.filter(s => s.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }
}
