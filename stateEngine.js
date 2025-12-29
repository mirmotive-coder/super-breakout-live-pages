// stateEngine.js
// Super Breakout – Core Market State Engine
// Ideoloģija: COMPRESS → VACUUM → ABSORPTION → RANGE / BREAK

// ===== STATES =====
export const STATES = Object.freeze({
  COMPRESS: 'COMPRESS',
  VACUUM_UP: 'VACUUM_UP',
  VACUUM_DOWN: 'VACUUM_DOWN',
  ABSORPTION: 'ABSORPTION',
  RANGE: 'RANGE',
});

// ===== EVENTS =====
export const EVENTS = Object.freeze({
  COMPRESS_DETECTED: 'COMPRESS_DETECTED',
  BREAK_UP: 'BREAK_UP',
  BREAK_DOWN: 'BREAK_DOWN',
  ABSORPTION_DETECTED: 'ABSORPTION_DETECTED',
  VACUUM_FILLED: 'VACUUM_FILLED',
  RANGE_REENTRY: 'RANGE_REENTRY',
});

// ===== STATE ENGINE =====
export class StateEngine {
  constructor() {
    this.state = STATES.RANGE;
    this.lastEvent = null;
    this.lastTransitionAt = Date.now();
  }

  getState() {
    return this.state;
  }

  getLastEvent() {
    return this.lastEvent;
  }

  // Galvenais likums:
  // State MAINĀS TIKAI, ja ir VALID EVENT
  dispatch(event) {
    const prevState = this.state;

    switch (this.state) {
      case STATES.RANGE:
        if (event === EVENTS.COMPRESS_DETECTED) {
          this._transition(STATES.COMPRESS, event);
        }
        break;

      case STATES.COMPRESS:
        if (event === EVENTS.BREAK_UP) {
          this._transition(STATES.VACUUM_UP, event);
        } else if (event === EVENTS.BREAK_DOWN) {
          this._transition(STATES.VACUUM_DOWN, event);
        }
        break;

      case STATES.VACUUM_UP:
      case STATES.VACUUM_DOWN:
        if (event === EVENTS.ABSORPTION_DETECTED) {
          this._transition(STATES.ABSORPTION, event);
        }
        break;

      case STATES.ABSORPTION:
        if (event === EVENTS.VACUUM_FILLED) {
          this._transition(STATES.RANGE, event);
        }
        break;

      default:
        break;
    }

    return {
      from: prevState,
      to: this.state,
      event: this.lastEvent,
    };
  }

  _transition(nextState, event) {
    this.state = nextState;
    this.lastEvent = event;
    this.lastTransitionAt = Date.now();

    // Šeit vēlāk var pieslēgt:
    // - logger
    // - UI notifier
    // - metrics
  }
}

// ===== SINGLETON (viena patiesība visai app) =====
export const stateEngine = new StateEngine();
