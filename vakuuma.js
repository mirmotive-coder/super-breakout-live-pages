/**
 * Candle shape expected:
 * { time:number, open:number, high:number, low:number, close:number }
 *
 * VACUUM = gap between prev.close and curr.open (NOT wicks).
 */

export function computeVacuumZones(candles, opts = {}) {
  const {
    minPct = 0.0006,     // 0.06% of price
    minAbs = 5,          // absolute minimum gap
    keepFilled = false,  // if true -> keep filled zones with status=FILLED
    maxZones = 200       // safety cap
  } = opts;

  if (!Array.isArray(candles) || candles.length < 2) return [];

  const zones = [];

  for (let i = 1; i < candles.length; i++) {
    const prev = candles[i - 1];
    const curr = candles[i];

    if (!isValidCandle(prev) || !isValidCandle(curr)) continue;

    const a = prev.close;
    const b = curr.open;

    // no gap
    if (a === b) continue;

    const low = Math.min(a, b);
    const high = Math.max(a, b);
    const size = high - low;

    const minSize = Math.max(minAbs, Math.abs(a) * minPct);
    if (size < minSize) continue;

    const zone = {
      id: `${prev.time}-${curr.time}-${a.toFixed(2)}-${b.toFixed(2)}`,
      createdAt: curr.time,
      low,
      high,
      size,
      direction: b > a ? "UP" : "DOWN",
      status: "ACTIVE",
      filledAt: null
    };

    zones.push(zone);
    if (zones.length >= maxZones) break;
  }

  // Invalidate zones by forward scan (body touch only: open/close)
  // We scan candles forward from zone.createdAt candle index
  // If touched -> FILLED
  for (const z of zones) {
    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      if (!isValidCandle(c)) continue;
      if (c.time < z.createdAt) continue;

      if (bodyTouchesZone(c, z.low, z.high)) {
        z.status = "FILLED";
        z.filledAt = c.time;
        break;
      }
    }
  }

  return keepFilled ? zones : zones.filter(z => z.status === "ACTIVE");
}

function isValidCandle(c) {
  return c && Number.isFinite(c.time) &&
    Number.isFinite(c.open) &&
    Number.isFinite(c.close);
}

// only body touch (open/close), NOT wicks
function bodyTouchesZone(candle, low, high) {
  const o = candle.open;
  const cl = candle.close;

  const oIn = o >= low && o <= high;
  const cIn = cl >= low && cl <= high;

  return oIn || cIn;
}
