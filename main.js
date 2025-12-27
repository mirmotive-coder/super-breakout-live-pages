const chart = LightweightCharts.createChart(
  document.getElementById('chart'),
  {
    layout: {
      background: { color: '#0b0e11' },
      textColor: '#d1d4dc',
    },
    grid: {
      vertLines: { color: '#1e222d' },
      horzLines: { color: '#1e222d' },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
  }
);

const candleSeries = chart.addCandlestickSeries({
  upColor: '#0ECB81',
  downColor: '#F6465D',
  borderDownColor: '#F6465D',
  borderUpColor: '#0ECB81',
  wickDownColor: '#F6465D',
  wickUpColor: '#0ECB81',
});

const statusEl = document.getElementById('status');
const lastUpdateEl = document.getElementById('lastUpdate');

let lastMessageTime = Date.now();

const ws = new WebSocket(
  'wss://fstream.binance.com/ws/btcusdt@kline_15m'
);

ws.onopen = () => {
  statusEl.textContent = 'Savienojums: LIVE';
};

ws.onclose = () => {
  statusEl.textContent = 'Savienojums: ATVIENOTS';
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const k = data.k;

  const candle = {
    time: k.t / 1000,
    open: parseFloat(k.o),
    high: parseFloat(k.h),
    low: parseFloat(k.l),
    close: parseFloat(k.c),
  };

  candleSeries.update(candle);

  lastMessageTime = Date.now();
  lastUpdateEl.textContent =
    'Pēdējais atjauninājums: ' +
    new Date().toLocaleTimeString();
};

// stale detection (vienkāršs)
setInterval(() => {
  if (Date.now() - lastMessageTime > 5000) {
    statusEl.textContent = 'Savienojums: STALE';
  }
}, 2000);

// resize
window.addEventListener('resize', () => {
  chart.applyOptions({
    width: document.getElementById('chart').clientWidth,
    height: document.getElementById('chart').clientHeight,
  });
});
