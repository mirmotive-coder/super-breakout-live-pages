// zones.js
// Price-anchored zones with lifecycle control
// No redraw jitter, no candle index dependency

export class ZoneManager {
  constructor(chart, series) {
    this.chart = chart;
    this.series = series;
    this.zones = new Map();
  }

  addZone({
    id,
    type = 'vacuum',
    priceLow,
    priceHigh,
    timeStart,
    timeEnd = null,
    strength = 1
  }) {
    if (!id) throw new Error('Zone must have id');

    const zone = {
      id,
      type,
      priceLow,
      priceHigh,
      timeStart,
      timeEnd,
      strength,
      state: 'active'
    };

    this.zones.set(id, zone);
    return zone;
  }

  expireZone(id) {
    const zone = this.zones.get(id);
    if (!zone) return;
    zone.state = 'expired';
  }

  getActiveZones() {
    return [...this.zones.values()].filter(
      z => z.state !== 'expired'
    );
  }

  updateLifecycle(currentTime) {
    for (const zone of this.zones.values()) {
      if (zone.timeEnd && currentTime > zone.timeEnd) {
        zone.state = 'fading';
      }
    }
  }

  render(ctx, timeScale, priceScale) {
    const zones = this.getActiveZones();

    zones.forEach(zone => {
      const x1 = timeScale.timeToCoordinate(zone.timeStart);
      const x2 = zone.timeEnd
        ? timeScale.timeToCoordinate(zone.timeEnd)
        : ctx.canvas.width;

      const y1 = priceScale.priceToCoordinate(zone.priceHigh);
      const y2 = priceScale.priceToCoordinate(zone.priceLow);

      if (
        x1 === null || x2 === null ||
        y1 === null || y2 === null
      ) return;

      ctx.save();

      // opacity based on state
      let alpha = 0.25 * zone.strength;
      if (zone.state === 'fading') alpha *= 0.5;

      ctx.fillStyle = this._zoneColor(zone.type, alpha);
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

      ctx.restore();
    });
  }

  _zoneColor(type, alpha) {
    switch (type) {
      case 'vacuum':
        return `rgba(0, 180, 255, ${alpha})`;
      case 'aggr':
        return `rgba(255, 80, 80, ${alpha})`;
      case 'compress':
        return `rgba(255, 200, 0, ${alpha})`;
      default:
        return `rgba(150, 150, 150, ${alpha})`;
    }
  }
}
