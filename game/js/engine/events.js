export class EventBus {
  constructor() {
    this._listeners = {};
    this._history = [];
    this._maxHistory = 100;
  }

  on(event, callback, context = null) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push({ callback, context });
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(
      l => l.callback !== callback
    );
  }

  emit(event, data = {}) {
    const entry = { event, data, timestamp: Date.now() };
    this._history.push(entry);
    if (this._history.length > this._maxHistory) this._history.shift();
    const listeners = this._listeners[event] || [];
    for (const listener of listeners) {
      try {
        listener.callback.call(listener.context, data);
      } catch (e) {
        console.error(`EventBus error in ${event}:`, e);
      }
    }
  }

  getHistory(event = null) {
    if (event) return this._history.filter(h => h.event === event);
    return [...this._history];
  }

  clear() {
    this._listeners = {};
    this._history = [];
  }
}

export const events = new EventBus();
