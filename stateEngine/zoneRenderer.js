// zoneRenderer.js
// Super Breakout – Zone Renderer
// Atbild TIKAI par zonu uzzīmēšanu uz canvas

export function renderZones({ chart, zones }) {
  const canvas = document.querySelector('canvas');
  if (!canvas || !zones || zones.length === 0) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  zones.forEach(zone => {
    ctx.save();

    // Zona
    ctx.globalAlpha = 1;
    ctx.fillStyle = zone.color;
    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);

    // Robeža
    ctx.strokeStyle = zone.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

    // Teksts
    if (zone.label) {
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        zone.label,
        zone.x + zone.width / 2,
        zone.y + zone.height / 2
      );
    }

    ctx.restore();
  });
}
