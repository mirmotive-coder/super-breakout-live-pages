import { runStateEngine } from './stateEngine/index.js';

// ===== UI INIT =====
const statusEl = document.getElementById('status');
const stateEl = document.getElementById('state');

// Ja tev HTML nav šādu elementu, tas nekas — vienkārši nerādīs tekstu.
const signatureEl = document.getElementById('signature');
const patternEl = document.getElementById('pattern');

const engine = runStateEngine();

// ===== WEBSOCKET =====
const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@kline_1m');

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

  const s = engine.getState();

  if (stateEl) {
    stateEl.textContent = `STATE: ${s.state} | CONF: ${s.confidence}`;
  }

  if (signatureEl) {
    signatureEl.textContent = `RESONANCE: ${s.signature} | axis=${s.axis} | coh=${s.coherence}`;
  }

  if (patternEl) {
    const p = s.pattern || {};
    patternEl.textContent =
      `PATTERN: ${p.matchLabel || ''} | score=${p.matchScore ?? 0} | samples=${p.samples ?? 0}`;
  }
};
