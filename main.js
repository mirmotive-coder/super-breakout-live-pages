// main.js — SUPER BREAKOUT LIVE
// WS → StateEngine → UI (single clean pipeline)

import { runStateEngine } from './stateEngine/index.js';

// ===== INIT STATE ENGINE =====
const engine = runStateEngine();

// ===== SAFE UI HELPERS =====
const statusEl = document.getElementById('status');
const stateEl  = document.getElementById('state');
const debugEl  = document.getElementById('debug');

function setText(el, text) {
  if (el) el.textContent = text;
}

setText(statusEl, 'Connecting...');

// ===== BINANCE WS CONFIG =====
const SYMBOL = 'btcusdt';
const TF = '1m';
const WS_URL = `wss://fstream.binance.com/ws/${SYMBOL}@kline_${TF}`;

let ws;

// ===== CONNECT FUNCTION =====
function connect() {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('[WS] Connected');
    setText(statusEl, 'Connected');
  };

  ws.onerror = () => {
    setText(statusEl, 'WS error');
  };

  ws.onclose = () => {
    setText(statusEl, 'Reconnecting...');
    setTimeout(connect, 1200);
  };

  ws.onmessage = (e) => {
    let msg;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }

    if (!msg.k) return;

    const k = msg.k;

    const candle = {
      time: k.t / 1000,
      open: +k.o,
      high: +k.h,
      low:  +k.l,
      close:+k.c,
    };

    // === FEED STATE ENGINE ===
    engine.onCandle(candle);

    // === READ STATE ===
    const s = engine.getState();

    setText(
      stateEl,
      `STATE: ${s.state} | CONF: ${s.confidence.toFixed(3)}`
    );

    if (debugEl && s.debug) {
      debugEl.textContent =
        `candles=${s.debug.candles} | compressScore=${s.debug.compressScore}`;
    }
  };
}

// ===== START =====
connect();
