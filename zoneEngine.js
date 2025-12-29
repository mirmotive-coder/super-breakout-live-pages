// zoneEngine.js
// Super Breakout – Zone Engine
// Pārvērš MarketState → loģiskās zonas (bez zīmēšanas)

import { MARKET_STATES } from "./stateEngine.js";

export class ZoneEngine {
  constructor() {
    this.zones = [];
  }

  update(state, candle) {
    /**
     * candle: { open, high, low, close, time }
     */

    if (state === MARKET_STATES.COMPRESS) {
      this._addZone("COMPRESS", candle.low, candle.high, candle.time);
    }

    if (state === MARKET_STATES.VACUUM) {
      const high = Math.max(candle.open, candle.close);
      const low = Math.min(candle.open, candle.close);
      this._addZone("VACUUM", low, high, candle.time);
    }

    if (state === MARKET_STATES.ABSORPTION) {
      this._addZone("ABSORPTION", candle.low, candle.high, candle.time);
    }
  }

  _addZone(type, low, high, time) {
    this.zones.push({
      type,
      low,
      high,
      startTime: time,
      endTime: null
    });

    if (this.zones.length > 50) {
      this.zones.shift();
    }
  }

  closeActiveZone(time) {
    const last = this.zones[this.zones.length - 1];
    if (last && !last.endTime) {
      last.endTime = time;
    }
  }

  getZones() {
    return this.zones;
  }
}
