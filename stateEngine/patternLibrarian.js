// stateEngine/patternLibrarian.js
// Super Breakout — Pattern Librarian (Memory, NOT prediction)
//
// Mērķis: saglabāt pēdējo X "rezonanses parakstu" virkni un atrast līdzības ar vēsturē redzēto.
// Rezultāts: "matchScore" (0..1) un īss "matchLabel" (piem., "līdzīgs iepriekš redzētam").
// NAV virziena, NAV signālu, NAV prognožu.

export function createPatternLibrarian(options = {}) {
  const MAX_PATTERNS = options.maxPatterns ?? 300;     // cik daudz vēsturisko pattern saglabāt
  const SEQ_LEN = options.sequenceLen ?? 12;           // cik garu parakstu ķēdi salīdzina
  const MIN_MATCH = options.minMatch ?? 0.55;          // minimālais līdzības slieksnis “nozīmīgam” match

  // Saglabājam vēsturiskās sekvences: ["C2","C3","V2"...] (garums = SEQ_LEN)
  const library = [];

  // current rolling buffer of signatures
  const buf = [];

  function pushSignature(sig) {
    if (!sig || typeof sig !== 'string') return;

    buf.push(sig);
    if (buf.length > SEQ_LEN) buf.shift();

    // Kad buferī ir pilna sekvence — saglabājam library
    if (buf.length === SEQ_LEN) {
      library.push(buf.slice());
      if (library.length > MAX_PATTERNS) library.shift();
    }
  }

  // Vienkārša līdzība: cik daudz elementu sakrīt tajā pašā pozīcijā
  function similarity(seqA, seqB) {
    if (!seqA || !seqB) return 0;
    const n = Math.min(seqA.length, seqB.length);
    if (n === 0) return 0;

    let same = 0;
    for (let i = 0; i < n; i++) {
      if (seqA[i] === seqB[i]) same++;
    }
    return same / n; // 0..1
  }

  function findBestMatch() {
    if (buf.length < SEQ_LEN) {
      return {
        ready: false,
        matchScore: 0,
        matchLabel: 'Datu nepietiek (pattern)',
        samples: library.length,
      };
    }

    let best = 0;

    // Salīdzinām ar visām vēsturiskajām sekvencēm
    for (let i = 0; i < library.length; i++) {
      const score = similarity(buf, library[i]);
      if (score > best) best = score;
    }

    const matchLabel =
      best >= MIN_MATCH
        ? 'Līdzīgs iepriekš novērotam'
        : 'Nav skaidras līdzības';

    return {
      ready: true,
      matchScore: Number(best.toFixed(3)),
      matchLabel,
      samples: library.length,
      seqLen: SEQ_LEN,
    };
  }

  function getBuffer() {
    return buf.slice();
  }

  return {
    pushSignature,
    findBestMatch,
    getBuffer,
  };
}
