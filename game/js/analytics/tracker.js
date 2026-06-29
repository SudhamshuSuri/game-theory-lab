class AnalyticsTracker {
  constructor() {
    this._events = [];
    this._enabled = true;
  }

  track(eventType, data = {}) {
    if (!this._enabled) return;
    this._events.push({
      type: eventType,
      data: JSON.parse(JSON.stringify(data)),
      timestamp: Date.now(),
    });
    this._persist();
  }

  trackChoice(scenarioId, choiceId, outcome) {
    this.track('choice', { scenarioId, choiceId, outcome });
  }

  trackDiscovery(conceptId, scenarioId) {
    this.track('discovery', { conceptId, scenarioId });
  }

  trackScenarioComplete(scenarioId, attempts, outcome) {
    this.track('scenario_complete', { scenarioId, attempts, outcome });
  }

  trackTime(scenarioId, timeMs) {
    this.track('time', { scenarioId, timeMs });
  }

  getEvents() {
    return [...this._events];
  }

  getEventTypes() {
    const types = {};
    for (const event of this._events) {
      types[event.type] = (types[event.type] || 0) + 1;
    }
    return types;
  }

  getChoicesByScenario(scenarioId) {
    return this._events.filter(
      e => e.type === 'choice' && e.data.scenarioId === scenarioId
    );
  }

  getDiscoveryRate() {
    const discoveries = this._events.filter(e => e.type === 'discovery').length;
    const total = this._events.filter(e => e.type === 'scenario_complete').length;
    return total > 0 ? discoveries / total : 0;
  }

  getAverageTimePerScenario(scenarioId = null) {
    const times = this._events.filter(e => e.type === 'time' && 
      (scenarioId === null || e.data.scenarioId === scenarioId));
    if (times.length === 0) return 0;
    return times.reduce((sum, e) => sum + e.data.timeMs, 0) / times.length;
  }

  getCooperationRate() {
    const choices = this._events.filter(e => e.type === 'choice');
    if (choices.length === 0) return 0.5;
    const coopChoices = choices.filter(e => 
      e.data.choiceId === 'honor' || e.data.choiceId === 'share' ||
      e.data.choiceId === 'fair' || e.data.choiceId === 'cooperate' ||
      e.data.choiceId === 'ration' || e.data.choiceId === 'negotiate'
    ).length;
    return coopChoices / choices.length;
  }

  getRetryCount(scenarioId) {
    return this._events.filter(
      e => e.type === 'choice' && e.data.scenarioId === scenarioId
    ).length;
  }

  exportData() {
    return {
      events: this._events,
      summary: {
        totalEvents: this._events.length,
        eventTypes: this.getEventTypes(),
        cooperationRate: this.getCooperationRate(),
        discoveryRate: this.getDiscoveryRate(),
        averageTimePerScenario: this.getAverageTimePerScenario(),
      },
    };
  }

  clear() {
    this._events = [];
    this._persist();
  }

  _persist() {
    try {
      localStorage.setItem('sovereign_analytics', JSON.stringify(this._events.slice(-500)));
    } catch (e) {
      // Storage full or unavailable - silently continue
    }
  }

  _load() {
    try {
      const raw = localStorage.getItem('sovereign_analytics');
      if (raw) {
        this._events = JSON.parse(raw);
      }
    } catch (e) {
      // Silently continue
    }
  }

  setEnabled(enabled) {
    this._enabled = enabled;
  }

  generateReport() {
    const data = this.exportData();
    return `
Analytics Report
================
Total Events: ${data.summary.totalEvents}
Event Types: ${JSON.stringify(data.summary.eventTypes)}
Cooperation Rate: ${(data.summary.cooperationRate * 100).toFixed(1)}%
Discovery Rate: ${(data.summary.discoveryRate * 100).toFixed(1)}%
Avg Time/Scenario: ${(data.summary.averageTimePerScenario / 1000).toFixed(1)}s
    `.trim();
  }
}

export const analytics = new AnalyticsTracker();
