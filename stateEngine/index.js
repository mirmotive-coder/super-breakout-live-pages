// stateEngine/index.js
// Super Breakout – Core Market State Engine
// Ideoloģija: COMPRESS → VACUUM → ABSORPTION → MOVE

export function runStateEngine() {
  console.log('[STATE ENGINE] initialized');

  // === INTERNAL STATE ===
  let state = 'INIT';
  let confidence = 0;

  // === INTERNAL MEMORY ===
  const candles = [];
  const MAX_CANDLES = 20;

  let compressScore = 0;

  // === INPUT: CANDLE STREAM ===
  function onCandle(candle) {
    // candle = { time, open, high, low, close }

    candles.push(candle);
    if (candles.length > MAX_CANDLES) {
      candles.shift();
    }

    if (candles.length < 5) {
      state = 'WAIT';
      confidence = 0.1;
      return;
    }

    // === COMPRESS OBSERVATION (NO DECISION YET) ===
    const highs = candles.map(c => c.high);
    const lows  = candles.map(c => c.low);

    const range = Math.max(...highs) - Math.min(...lows);

    // vienkārša normalizēta dzīvības metrika
    compressScore = 1 / range;

    state = 'WAIT';
    confidence = Math.min(0.2 + compressScore * 0.01, 0.4);
  }

  // === OUTPUT: UI / OBSERVER ===
  function getState() {
    return {
      state,
      confidence,
      debug: {
        candles: candles.length,
        compressScore: Number(compressScore.toFixed(4)),
      },
    };
  }

  // === PUBLIC API ===
  return {
    onCandle,
    getState,
  };
}
