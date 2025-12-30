// stateEngine/index.js
// Super Breakout – Core Market State Engine
// Ideoloģija: COMPRESS → VACUUM → ABSORPTION → MOVE
//
// Šis dzinējs apraksta pašreizējo tirgus stāvokli (observability).
// NAV prognožu, NAV signālu.

import { createPatternLibrarian } from './patternLibrarian.js';

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function resonanceSignature(axis, level) {
  return `${axis}${level}`;
}

export function runStateEngine() {
  console.log('[STATE ENGINE] initialized');

  // ===== INTERNAL STATE =====
  let state = 'WAIT';
  let confidence = 0.0;

  // ===== INTERNAL MEMORY =====
  const candles = [];
  const MAX_CANDLES = 120;

  // Pattern Librarian (memory)
  const librarian = createPatternLibrarian({
    maxPatterns: 300,
    sequenceLen: 12,
    minMatch: 0.55,
  });

  // Debug/metrics
  let axis = 'C';          // C/V/A/M
  let phase = 0;           // 0..1
  let coherence = 0;       // 0..1
  let signature = 'C1';
  let lastMatch = {
    ready: false,
    matchScore: 0,
    matchLabel: 'Datu nepietiek (pattern)',
    samples: 0,
  };

  // ===== INPUT: CANDLE STREAM =====
  function onCandle(candle) {
    // candle = { time, open, high, low, close }

    candles.push(candle);
    if (candles.length > MAX_CANDLES) candles.shift();

    if (candles.length < 20) {
      state = 'WAIT';
      confidence = 0.15;
      axis = 'C';
      phase = 0;
      coherence = 0;
      signature = 'C1';
      return;
    }

    // ===== BASIC OBSERVABILITY METRICS =====
    // Range (last N candles)
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const range = Math.max(...highs) - Math.min(...lows);

    // Avg body (last 20)
    const last20 = candles.slice(-20);
    const bodies = last20.map(c => Math.abs(c.close - c.open));
    const avgBody = bodies.reduce((a, b) => a + b, 0) / bodies.length;

    // Coherence: mazāks range un mazāks avgBody => lielāka “koherence”
    // Normalizējam ar vienkāršiem drošiem aizsargiem.
    const rangeNorm = 1 / Math.max(range, 1e-9);
    const bodyNorm = 1 / Math.max(avgBody, 1e-9);

    // Neļaujam skaitļiem eksplodēt: pārvēršam uz 0..1 ar mīkstu clamp.
    coherence = clamp((Math.log10(rangeNorm + 1) + Math.log10(bodyNorm + 1)) / 6, 0, 1);

    // Phase: cik “tuvu” esam pilnam stāvoklim (vienkārši no coherence)
    phase = coherence;

    // ===== AXIS (C/V/A/M) — šobrīd minimālā loģika (vēl tiks papildināta) =====
    // Šeit mēs vēl NEVEIDOJAM pilnu vakuuma/agresijas matemātiku.
    // Mēs tikai dodam “karkasu”, kas ir stabils.
    //
    // Heiristika:
    // - ja coherence augsta => Compress (C)
    // - ja coherence vidēja + range sāk paplašināties => Move (M)
    // - Absorption/Vacuum tiks piesaistīti pie dziļākiem datiem (orderflow / gaps)
    //
    // Lai tagad būtu lietojams, turam vienkārši:
    if (coherence > 0.72) axis = 'C';
    else if (coherence < 0.35) axis = 'M';
    else axis = 'C';

    // ===== LEVEL (1..5) =====
    const level = clamp(Math.ceil(phase * coherence * 5), 1, 5);

    signature = resonanceSignature(axis, level);

    // ===== PATTERN LIBRARIAN UPDATE =====
    librarian.pushSignature(signature);
    lastMatch = librarian.findBestMatch();

    // ===== OUTPUT CONFIDENCE =====
    // confidence šeit = datu kvalitāte + stabilitāte, nevis “pareizība”.
    confidence = clamp(0.25 + coherence * 0.65, 0, 1);

    state = 'WAIT';
  }

  // ===== OUTPUT: UI / OBSERVER =====
  function getState() {
    return {
      state,
      confidence: Number(confidence.toFixed(3)),
      signature,
      axis,
      phase: Number(phase.toFixed(3)),
      coherence: Number(coherence.toFixed(3)),
      pattern: lastMatch,
      debug: {
        candles: candles.length,
        buf: librarian.getBuffer(),
      },
    };
  }

  // ===== PUBLIC API =====
  return {
    onCandle,
    getState,
  };
}
