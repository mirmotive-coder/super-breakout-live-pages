import { runStateEngine } from './stateEngine/index.js';

// ===== UI INIT =====
const statusEl = document.getElementById('status');

// ===== STATE ENGINE =====
const engine = runStateEngine();

// ===== WEBSOCKET START (DELAYED) =====
function startWebSocket() {
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
    const candle = {
      time: k.t / 1000,
      open: +k.o,
      high: +k.h,
      low: +k.l,
      close: +k.c,
    };

    engine.onCandle(candle);
  };
}

// ===== SAFE BOOT =====
window.addEventListener('load', () => {
  console.log('[APP] Loaded');

  // IMPORTANT: nekad nestartē WS uzreiz
  setTimeout(startWebSocket, 1500);
});
