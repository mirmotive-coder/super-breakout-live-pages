// ===== Super Breakout – Stable Core =====
// Chart engine: lightweight-charts
// Purpose: price-anchored zones foundation

import { createChart } from 'https://unpkg.com/lightweight-charts@4.1.0/dist/lightweight-charts.esm.production.js';

// ---------- CHART ----------
const chart = createChart(document.body, {
  layout: {
    background: { color: '#0b0e11' },
    textColor: '#cfd3dc',
  },
  grid: {
    vertLines: { color: '#1e2329' },
    horzLines: { color: '#1e2329' },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
});

const candleSeries = chart.addCandlestickSeries();
candleSeries.setData([
  { time: 1717000000, open: 68000, high: 68500, low: 67500, close: 68200 },
  { time: 1717000900, open: 68200, high: 69000, low: 68100, close: 68800 },
  { time: 1717001800, open: 68800, high: 69200, low: 68400, close: 68600 }
]);
// ---------- ZONE MANAGER ----------
class ZoneManager {
  constructor(chart, series) {
    this.chart = chart;
    this.series = series;
    this.zones = [];
  }

  addZone(zone) {
    this.zones.push(zone);
  }

  render() {
    const priceScale = this.series.priceScale();
    const timeScale = this.chart.timeScale();
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    this.zones.forEach(z => {
      const y1 = priceScale.priceToCoordinate(z.priceHigh);
      const y2 = priceScale.priceToCoordinate(z.priceLow);
      const x1 = timeScale.timeToCoordinate(z.timeStart);
      const x2 = timeScale.timeToCoordinate(z.timeEnd);

      if ([x1, x2, y1, y2].includes(null)) return;

      ctx.save();
      ctx.fillStyle = z.color;
      ctx.globalAlpha = z.alpha;
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      ctx.restore();
    });
  }
}

const zoneManager = new ZoneManager(chart, candleSeries);

// ---------- TEST ZONE (VACUUM) ----------
zoneManager.addZone({
  type: 'vacuum',
  priceLow: 64000,
  priceHigh: 66000,
  timeStart: Math.floor(Date.now() / 1000) - 3600 * 6,
  timeEnd: Math.floor(Date.now() / 1000) + 3600 * 6,
  color: 'rgb(0,180,255)',
  alpha: 0.25,
});
// ===== TEST DATA (render check) =====
const now = Math.floor(Date.now() / 1000);

candleSeries.setData([
  {
    time: now - 900,
    open: 65000,
    high: 65200,
    low: 64800,
    close: 65100,
  },
  {
    time: now - 600,
    open: 65100,
    high: 65350,
    low: 65050,
    close: 65250,
  },
  {
    time: now - 300,
    open: 65250,
    high: 65400,
    low: 65150,
    close: 65380,
  },
]);
// ---------- BINANCE FUTURES WS ----------
const ws = new WebSocket(
  'wss://fstream.binance.com/ws/btcusdt@kline_15m'
);

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  const k = msg.k;

  const candle = {
    time: k.t / 1000,
    open: parseFloat(k.o),
    high: parseFloat(k.h),
    low: parseFloat(k.l),
    close: parseFloat(k.c),
  };

  candleSeries.update(candle);
  zoneManager.render();
};
