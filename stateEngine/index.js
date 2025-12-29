// stateEngine/index.js
// Super Breakout – State Engine Orchestrator

import { createStateMachine } from './stateMachine.js';
import { resolveNextState } from './stateTransitions.js';
import { buildMarketMetrics } from './metricsAdapter.js';

export function runStateEngine({ candles, zones, prevState }) {
  const metrics = buildMarketMetrics({ candles, zones });
  if (!metrics) return prevState || null;

  const machine = createStateMachine(prevState);
  const nextState = resolveNextState(machine.current, metrics);

  machine.transition(nextState);

  return {
    state: machine.current,
    metrics,
  };
}
