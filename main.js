// main.js
// Super Breakout – Application Entry Point
// ŠEIT notiek:
// - WebSocket savienojums
// - candle atjaunināšana
// - State Engine izsaukšana

import { runStateEngine } from './stateEngine/index.js';

// ===== Chart init (pieņemot, ka chart jau ir izveidots iepriekš) =====
const statusEl = document.getElementById('status');

// ===== WebSocket: Binance BTCUSDT 1m =====
const ws = new WebSocket(
  'wss://fstream.binance.com/ws/btcusdt@kline_1m'
);

ws.onopen = () => {
  console.log('[WS] Connected');
  if (statusEl) {
    statusEl.textContent = 'Connected';
    statusEl.style.background = '#0f5132';
  }
};

ws.onerror = () => {
  console.error('[WS] Error');
  if (statusEl) {
    statusEl.textContent = 'WebSocket error';
    statusEl.style.background = '#842029';
  }
};

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (!msg.k) return;

  const k = msg.k;

  // ===== RAW market data (tīri dati) =====
  const rawMarketData = {
    open: +k.o,
    high: +k.h,
    low: +k.l,
    close: +k.c,
    volume: +k.v,
    isFinal: k.x,
    time: k.t,
  };

  // ===== STATE ENGINE =====
  const stateResult = runStateEngine(rawMarketData);

  // ===== DEBUG (obligāti pagaidām) =====
  console.log('[STATE]', stateResult);
};
