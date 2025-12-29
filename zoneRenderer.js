// zoneRenderer.js
// Super Breakout – Zone Renderer (logical → chart coordinates)
// ŠIS FAILS NERĪKOJAS AR KRĀSĀM — tikai koordinātes

export class ZoneRenderer {
  constructor(chart, series) {
    this.chart = chart;
    this.series = series;
  }

  mapZones(zones) {
    const timeScale = this.chart.timeScale();
    const priceScale = this.series.priceScale();

    return zones
      .map(zone => {
        const yHigh = priceScale.priceToCoordinate(zone.high);
        const yLow = priceScale.priceToCoordinate(zone.low);
        const xStart = timeScale.timeToCoordinate(zone.startTime);
        const xEnd = zone.endTime
          ? timeScale.timeToCoordinate(zone.endTime)
          : timeScale.timeToCoordinate(zone.startTime);

        if (
          yHigh === null ||
          yLow === null ||
          xStart === null ||
          xEnd === null
        ) {
          return null;
        }

        return {
          type: zone.type,
          x: Math.min(xStart, xEnd),
          y: Math.min(yHigh, yLow),
          width: Math.abs(xEnd - xStart),
          height: Math.abs(yLow - yHigh)
        };
      })
      .filter(Boolean);
  }
}
