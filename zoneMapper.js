// zoneMapper.js
// Super Breakout – Zone → Chart Coordinate Mapper
// Atbild par zonu sasaisti ar grafika cenu un laika skalām

export function mapZonesToChart({ zones, chart, series }) {
  if (!zones || zones.length === 0) return [];

  const timeScale = chart.timeScale();
  const priceScale = series.priceScale();

  return zones
    .map(zone => {
      const xStart = timeScale.timeToCoordinate(zone.tStart);
      const xEnd = timeScale.timeToCoordinate(zone.tEnd);
      const yHigh = priceScale.priceToCoordinate(zone.pHigh);
      const yLow = priceScale.priceToCoordinate(zone.pLow);

      if (
        xStart == null ||
        xEnd == null ||
        yHigh == null ||
        yLow == null
      ) {
        return null;
      }

      let color = 'rgba(180,180,180,0.15)';
      let border = 'rgba(180,180,180,0.4)';
      let label = '';

      switch (zone.type) {
        case 'compress':
          color = 'rgba(255,180,0,0.18)';
          border = 'rgba(255,180,0,0.6)';
          label = 'COMPRESS';
          break;

        case 'vacuum':
          color = 'rgba(0,200,255,0.18)';
          border = 'rgba(0,200,255,0.6)';
          label = 'VACUUM';
          break;

        case 'aggression':
          color = 'rgba(255,60,60,0.22)';
          border = 'rgba(255,60,60,0.7)';
          label = 'AGGRESSION';
          break;
      }

      return {
        ...zone,
        x: Math.min(xStart, xEnd),
        y: Math.min(yHigh, yLow),
        width: Math.abs(xEnd - xStart),
        height: Math.abs(yLow - yHigh),
        color,
        border,
        label,
      };
    })
    .filter(Boolean);
}
