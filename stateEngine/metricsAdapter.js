// metricsAdapter.js
// Super Breakout – Market Metrics Adapter
// Pārveido cenu struktūru uz skaitliskiem signāliem state engine

export function buildMarketMetrics({ candles, zones }) {
  if (!candles || candles.length < 20) {
    return null;
  }

  const recent = candles.slice(-20);

  const highs = recent.map(c => c.high);
  const lows = recent.map(c => c.low);
  const closes = recent.map(c => c.close);

  const range = Math.max(...highs) - Math.min(...lows);
  const avgRange =
    recent.reduce((sum, c) => sum + (c.high - c.low), 0) / recent.length;

  // COMPRESS: cik šauri kustas cena
  const compressionLevel = avgRange === 0
    ? 0
    : Math.min(1, avgRange / range);

  // MOMENTUM: virziens + spēks
  const momentum =
    (closes[closes.length - 1] - closes[0]) / range;

  // VACUUM: brīva telpa virs / zem cenas
  const lastClose = closes[closes.length - 1];

  const vacuumAbove = zones
    ? !zones.some(z => z.type === 'resistance' && z.price > lastClose)
    : false;

  const vacuumBelow = zones
    ? !zones.some(z => z.type === 'support' && z.price < lastClose)
    : false;

  // ABSORPTION: lēna kustība ar lielu apjomu (vienkāršota versija)
  const volumes = recent.map(c => c.volume || 0);
  const avgVolume =
    volumes.reduce((a, b) => a + b, 0) / volumes.length;

  const lastVolume = volumes[volumes.length - 1];

  const absorptionStrength =
    avgVolume === 0 ? 0 : Math.min(1, lastVolume / avgVolume);

  return {
    compressionLevel,
    momentum,
    vacuumAbove,
    vacuumBelow,
    absorptionStrength,
  };
}
