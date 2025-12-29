// stateTransitions.js
// Super Breakout – State Transition Logic
// Ideoloģija: COMPRESS → VACUUM → ABSORPTION → RANGE / BREAK

export function resolveNextState({ state, metrics }) {
  const {
    compressionLevel,   // 0..1 (cik saspiesta cena)
    momentum,           // -1..1 (spiediena virziens un spēks)
    vacuumAbove,        // boolean
    vacuumBelow,        // boolean
    absorptionStrength, // 0..1
  } = metrics;

  switch (state) {
    case 'RANGE':
      if (compressionLevel > 0.7) return 'COMPRESS';
      return 'RANGE';

    case 'COMPRESS':
      if (momentum > 0.3 && vacuumAbove) return 'VACUUM_UP';
      if (momentum < -0.3 && vacuumBelow) return 'VACUUM_DOWN';
      return 'COMPRESS';

    case 'VACUUM_UP':
    case 'VACUUM_DOWN':
      if (absorptionStrength > 0.6) return 'ABSORPTION';
      return state;

    case 'ABSORPTION':
      if (compressionLevel < 0.3) return 'RANGE';
      if (momentum > 0.5) return 'BREAK_UP';
      if (momentum < -0.5) return 'BREAK_DOWN';
      return 'ABSORPTION';

    case 'BREAK_UP':
    case 'BREAK_DOWN':
      return 'RANGE';

    default:
      return 'RANGE';
  }
}
