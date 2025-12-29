// zoneEngine.js
// Super Breakout – Zone Engine
// Atbild par zonu (COMPRESS / VACUUM / AGGRESSION) dzīves ciklu
// Zonas tiek saglabātas, nepazūd uz zoom / TF maiņu

export class ZoneEngine {
  constructor() {
    this.zones = [];
  }

  makeKey(z) {
    return `${z.type}|${z.tStart}|${z.tEnd}|${z.pLow}|${z.pHigh}`;
  }

  addZone(zone) {
    const key = this.makeKey(zone);
    if (this.zones.find(z => z.key === key)) return;

    this.zones.push({ ...zone, key });
  }

  prune(now, ttl = 6 * 3600) {
    const cutoff = now - ttl;
    this.zones = this.zones.filter(z => z.tEnd >= cutoff);
  }

  update({ now, candle, marketState }) {
    this.prune(now);

    // ===== COMPRESS =====
    if (marketState?.compress?.active) {
      this.addZone({
        type: 'compress',
        tStart: marketState.compress.tStart ?? now - 20 * 60,
        tEnd: marketState.compress.tEnd ?? now + 20 * 60,
        pLow: marketState.compress.pLow ?? candle.low,
        pHigh: marketState.compress.pHigh ?? candle.high,
      });
    }

    // ===== VACUUM ABOVE =====
    if (marketState?.vacuum?.above?.active) {
      this.addZone({
        type: 'vacuum',
        tStart: marketState.vacuum.above.tStart ?? now - 3600,
        tEnd: marketState.vacuum.above.tEnd ?? now + 3600,
        pLow: marketState.vacuum.above.pLow,
        pHigh: marketState.vacuum.above.pHigh,
      });
    }

    // ===== VACUUM BELOW =====
    if (marketState?.vacuum?.below?.active) {
      this.addZone({
        type: 'vacuum',
        tStart: marketState.vacuum.below.tStart ?? now - 3600,
        tEnd: marketState.vacuum.below.tEnd ?? now + 3600,
        pLow: marketState.vacuum.below.pLow,
        pHigh: marketState.vacuum.below.pHigh,
      });
    }

    // ===== AGGRESSION LEVELS =====
    if (marketState?.aggression?.levels?.length) {
      marketState.aggression.levels.forEach(lvl => {
        this.addZone({
          type: 'aggression',
          tStart: lvl.tStart ?? now - 2 * 3600,
          tEnd: lvl.tEnd ?? now + 2 * 3600,
          pLow: lvl.pLow,
          pHigh: lvl.pHigh,
        });
      });
    }

    return this.zones;
  }

  getZones() {
    return this.zones;
  }
}
