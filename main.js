import { runStateEngine } from './stateEngine/index.js';

// ===== UI INIT =====
const statusEl = document.getElementById('status');
const stateEl = document.getElementById('state');

// ===== WEBSOCKET =====
const ws = new WebSocket(
  'wss://fstream.binance.com/ws/btcusdt@kline_1m'
);

ws.onopen = () => {
  console.log('[WS] Connected');
  if (statusEl) statusEl.textContent = 'Connected';
};

ws.onerror = (e) => {
  console.error('[WS] Error', e);
  if (statusEl) statusEl.textContent = 'WS error';
};

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (!msg.k) return;

  const k = msg.k;

  engine.onCandle({
    time: k.t / 1000,
    open: +k.o,
    high: +k.h,
    low: +k.l,
    close: +k.c,
  });

  // === READ STATE ENGINE ===
  const { state, confidence } = engine.getState();

  if (stateEl) {
    stateEl.textContent = `STATE: ${state} | CONF: ${confidence}`;
  }
};};

  const result = runStateEngine(marketData);

  if (!result) return;

  if (stateEl) {
    stateEl.textContent =
      `STATE: ${result.state} | CONF: ${result.confidence}`;
  }
};
