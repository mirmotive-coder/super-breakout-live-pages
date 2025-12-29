// stateMachine.js
// Super Breakout – Market State Machine
// Atbild par tirgus stāvokļa noteikšanu un maiņu

export const MARKET_STATES = {
  COMPRESS: 'COMPRESS',
  VACUUM: 'VACUUM',
  ABSORPTION: 'ABSORPTION',
  RANGE: 'RANGE',
  BREAK: 'BREAK'
};

let currentState = MARKET_STATES.RANGE;

export function getMarketState() {
  return currentState;
}

export function setMarketState(nextState) {
  if (!Object.values(MARKET_STATES).includes(nextState)) {
    console.warn('❗ Unknown market state:', nextState);
    return;
  }

  if (currentState !== nextState) {
    console.log(`🔁 Market state: ${currentState} → ${nextState}`);
    currentState = nextState;
  }
}

export function resetMarketState() {
  currentState = MARKET_STATES.RANGE;
}
