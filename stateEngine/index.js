console.log('[STATE ENGINE] index.js loaded');// stateEngine/index.js
// Super Breakout – State Engine Entry Point
// Atbild par state aprēķinu un rezultāta atgriešanu

import { evaluateState } from './stateMachine.js';
import { adaptMetrics } from './metricsAdapter.js';

export function runStateEngine(rawMarketData) {
  if (!rawMarketData) {
    console.warn('[STATE ENGINE] No market data provided');
    return null;
  }

  // 1. Pielāgojam datus engine vajadzībām
  const metrics = adaptMetrics(rawMarketData);

  // 2. Aprēķinam tirgus stāvokli
  const stateResult = evaluateState(metrics);

  // 3. Debug / izglītojošs logs
  console.log('[STATE ENGINE] Current state:', stateResult.state);
  console.log('[STATE ENGINE] Confidence:', stateResult.confidence);
  console.log('[STATE ENGINE] Details:', stateResult.details);

  return stateResult;
}
