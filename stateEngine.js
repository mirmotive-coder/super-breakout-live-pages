// stateEngine.js
// Super Breakout – Core Market State Engine
// Ideoloģija: COMPRESS → VACUUM → ABSORPTION → RANGE / BREAK
// ŠIS IR KODOLS. Bez vizualizācijas. Bez UI. Tikai loģika.

export const MARKET_STATES = {
  COMPRESS: "COMPRESS",
  VACUUM: "VACUUM",
  ABSORPTION: "ABSORPTION",
  RANGE: "RANGE",
  BREAK: "BREAK"
};

// ===== CONFIG =====
const CONFIG = {
  compressRangePct: 0.6,      // % no vidējā range, lai uzskatītu par compress
  vacuumImpulsePct: 1.2,      // % kustība, lai uzskatītu par vakuuma impulsu
  absorptionBars: 3,          // cik sveces absorbcijai
  minVolumeSpike: 1.5          // apjoma pieauguma koeficients
};

// ===== CORE ENGINE =====
export class MarketStateEngine {
  constructor() {
    this.state = MARKET_STATES.RANGE;
    this.history = [];
    this.lastImpulse = null;
  }

  update(candle, context) {
    /**
     * candle: { open, high, low, close, volume }
     * context: {
     *   avgRange,
     *   avgVolume,
     *   prevHigh,
     *   prevLow
     * }
     */

    const range = candle.high - candle.low;
    const rangePct = (range / context.avgRange) * 100;
    const volumeSpike = candle.volume / context.avgVolume;

    // ===== COMPRESS =====
    if (rangePct < CONFIG.compressRangePct * 100) {
      this.state = MARKET_STATES.COMPRESS;
      this._push("compress", candle);
      return this.state;
    }

    // ===== VACUUM =====
    if (
      this.state === MARKET_STATES.COMPRESS &&
      rangePct > CONFIG.vacuumImpulsePct * 100 &&
      volumeSpike < CONFIG.minVolumeSpike
    ) {
      this.state = MARKET_STATES.VACUUM;
      this.lastImpulse = {
        direction: candle.close > candle.open ? "UP" : "DOWN",
        startPrice: candle.open,
        endPrice: candle.close
      };
      this._push("vacuum", candle);
      return this.state;
    }

    // ===== ABSORPTION =====
    if (
      this.state === MARKET_STATES.VACUUM &&
      volumeSpike >= CONFIG.minVolumeSpike
    ) {
      this.state = MARKET_STATES.ABSORPTION;
      this._push("absorption", candle);
      return this.state;
    }

    // ===== BREAK or RANGE =====
    if (this.state === MARKET_STATES.ABSORPTION) {
      const breakoutUp = candle.close > context.prevHigh;
      const breakoutDown = candle.close < context.prevLow;

      if (breakoutUp || breakoutDown) {
        this.state = MARKET_STATES.BREAK;
        this._push("break", candle);
        return this.state;
      } else {
        this.state = MARKET_STATES.RANGE;
        this._push("range", candle);
        return this.state;
      }
    }

    // ===== DEFAULT =====
    this.state = MARKET_STATES.RANGE;
    return this.state;
  }

  _push(type, candle) {
    this.history.push({
      type,
      candle,
      ts: Date.now()
    });

    if (this.history.length > 100) {
      this.history.shift();
    }
  }

  getState() {
    return this.state;
  }

  getHistory() {
    return this.history;
  }
}
