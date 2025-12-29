/**
 * STATE ENGINE v1
 * Purpose: classify market STATE, not generate signals
 * Philosophy: price moves through SPACE, not indicators
 */

export function analyzeMarketState(candles) {
  if (!candles || candles.length < 5) return null;

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const range = last.high - last.low;
  const prevRange = prev.high - prev.low;

  const avgRange =
    candles
      .slice(-10)
      .reduce((sum, c) => sum + (c.high - c.low), 0) / 10;

  const body = Math.abs(last.close - last.open);
  const direction =
    last.close > last.open ? "UP" :
    last.close < last.open ? "DOWN" :
    "NONE";

  let STATE = "UNDEFINED";
  let ENERGY = "LOW";
  let DIRECTIONAL_BIAS = "NONE";
  let ACTION = "WAIT";

  // --- IMPULSE ---
  if (range > avgRange * 1.8 && body / range > 0.6) {
    STATE = "IMPULSE";
    ENERGY = "RELEASE";
    DIRECTIONAL_BIAS = direction;
    ACTION = "OBSERVE";
  }

  // --- COMPRESS ---
  if (range < avgRange * 0.6 && prevRange < avgRange * 0.6) {
    STATE = "COMPRESS";
    ENERGY = "BUILDING";
    DIRECTIONAL_BIAS = "NONE";
    ACTION = "WAIT";
  }

  // --- VACUUM ---
  if (
    prevRange < avgRange * 0.6 &&
    range > avgRange * 1.4 &&
    body / range > 0.5
  ) {
    STATE = "VACUUM";
    ENERGY = "RELEASE";
    DIRECTIONAL_BIAS = direction;
    ACTION = "MANAGE";
  }

  return {
    STATE,
    ENERGY,
    DIRECTIONAL_BIAS,
    ACTION,
    META: {
      range: range.toFixed(6),
      avgRange: avgRange.toFixed(6),
      bodyRatio: (body / range).toFixed(2)
    }
  };
}
