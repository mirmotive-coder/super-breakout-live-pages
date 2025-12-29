// zoneLayer.js
// Super Breakout – Unified Zone Canvas Layer
// ŠIS IR VIENĪGAIS ZĪMĒŠANAS SLĀNIS VISĀ APP

export class ZoneLayer {
  constructor(chart) {
    this.chart = chart;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '10';

    chart.container().appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.chart.container().getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawZones(mappedZones) {
    this.clear();

    mappedZones.forEach(zone => {
      this.ctx.save();

      switch (zone.type) {
        case 'vacuum':
          this.ctx.fillStyle = 'rgba(0, 180, 255, 0.18)';
          break;
        case 'compress':
          this.ctx.fillStyle = 'rgba(255, 180, 0, 0.22)';
          break;
        case 'aggression':
          this.ctx.fillStyle = 'rgba(255, 60, 60, 0.25)';
          break;
        default:
          this.ctx.fillStyle = 'rgba(150,150,150,0.15)';
      }

      this.ctx.fillRect(
        zone.x,
        zone.y,
        zone.width,
        zone.height
      );

      this.ctx.restore();
    });
  }
}
