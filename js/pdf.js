// ===== PDF EXPORT =====
function openPdfPreview() {
  const datum = state.beginn["datum"]
  const begZeit = state.beginn["uhrzeit"]
  const endZeit = document.getElementById('endUhrzeit').value;
  const objekt = state.beginn["objekt"] || '—';
  const sf = state.beginn["Schichtfuehrer"].trim() || '—';
  const mitarbeiter = state.beginn["Mitarbeiter"].trim() || '—';
  const uebergabeVon = state.beginn["UebergabeVon"].trim() || '—';
  const besonderheiten = state.beginn["Besonderheiten"].trim() || 'Keine';
  const schlussel = state.beginn["Schluessel"];
  const technik = state.beginn["Technik"];
  const uebergabeAn = document.getElementById('endUebergabeAn').value.trim() || '—';
  const endSchluessel = getRadio('endSchluessel');
  const lage = getRadio('endLage');
  const lageColor = lage === 'Kritisch' ? '#ff2d55' : lage === 'Angespannt' ? '#ff6b00' : '#00e676';
  const bemerkung = document.getElementById('endBemerkung').value.trim() || 'Keine';
  const endName = document.getElementById('endName').value.trim() || '—';
  const erstellt = new Date().toLocaleString('de-DE');

  let ereignisRows = '';
  if (state.ereignisse.length === 0) {
    ereignisRows = '<tr><td colspan="5" style="text-align:center;color:#888;padding:12px">Keine Ereignisse erfasst</td></tr>';
  } else {
    state.ereignisse.forEach((e, i) => {
      const polizeiHtml = e.polizei !== 'Nein' && e.polizei !== '—'
        ? `<span style="color:#ff2d55;font-weight:bold">🚨 ${e.polizei}</span>` : '—';
      ereignisRows += `<tr>
        <td>${i+1}</td>
        <td><strong>${e.uhrzeit}</strong></td>
        <td><strong>${e.art}</strong><br><span style="font-size:11px;color:#555">${e.beschreibung}</span></td>
        <td style="font-size:11px">${e.massnahmen || '—'}</td>
        <td style="font-size:11px">${polizeiHtml}</td>
      </tr>`;
    });
  }

  let streifeRows = '';
  if (state.streifen.length === 0) {
    streifeRows = '<tr><td colspan="4" style="text-align:center;color:#888;padding:12px">Keine Streifen erfasst</td></tr>';
  } else {
    state.streifen.forEach((s, i) => {
      streifeRows += `<tr>
        <td>${i+1}</td>
        <td>${s.von} – ${s.bis} Uhr</td>
        <td>${s.bereich}</td>
        <td>${s.tueren} · ${s.auffaellig}</td>
      </tr>`;
    });
  }

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Wachbuch ${datum} · ${objekt}</title>
<style>@page { size: A4; margin: 18mm 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1a1a2e; background: #fff; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1a1a2e; padding-bottom: 12px; margin-bottom: 16px; }
  .header-left h1 { font-size: 22px; font-weight: 800; letter-spacing: 1px; color: #1a1a2e; }
  .header-left p { font-size: 11px; color: #555; margin-top: 2px; letter-spacing: 1px; }
  .header-right { text-align: right; font-size: 11px; color: #555; }
  .header-right strong { font-size: 14px; color: #1a1a2e; }
  .badge { display: inline-block; background: #1a1a2e; color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 10px; letter-spacing: 1.5px; font-weight: 700; margin-top: 4px; }
  .section-title { background: #1a1a2e; color: #fff; padding: 6px 12px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 14px 0 8px; border-radius: 3px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; margin-bottom: 4px; }
  .info-row { display: flex; gap: 6px; padding: 5px 0; border-bottom: 1px solid #eee; }
  .info-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; min-width: 120px; padding-top: 1px; }
  .info-value { font-weight: 600; color: #1a1a2e; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  th { background: #f0f2f5; color: #1a1a2e; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; padding: 7px 8px; text-align: left; border-bottom: 2px solid #1a1a2e; }
  td { padding: 7px 8px; border-bottom: 1px solid #eee; vertical-align: top; color: #222; }
  tr:nth-child(even) td { background: #fafafa; }
  .lage { display: inline-block; padding: 3px 12px; border-radius: 12px; font-weight: 700; font-size: 12px; }
  .footer { margin-top: 20px; border-top: 2px solid #1a1a2e; padding-top: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
  .sig-line { border-bottom: 1px solid #555; width: 180px; margin-bottom: 4px; height: 30px; }
  .sig-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .watermark { font-size: 10px; color: #aaa; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }</style>
</head>
<body>

<div class="header">
  <div class="header-left" style="display:flex;align-items:center;gap:16px">
  <img src="/images/logo.jpg" alt="Secure Group" style="height:44px;object-fit:contain;filter:brightness(1.1)">
    <div>
      <h1 style="margin:0">WACHBUCH</h1>
      <p style="margin:2px 0 0">SECURE GROUP · WWW.SECURE-GROUP.DE</p>
      <span class="badge">VERTRAULICH</span>
    </div>
  </div>
  <div class="header-right">
    <strong>${objekt}</strong><br>
    Datum: ${datum}<br>
    Schicht: ${begZeit} – ${endZeit} Uhr<br>
    Schichtführer: ${sf}
  </div>
</div>

<div class="section-title">① Schichtbeginn</div>
<div class="info-grid">
  <div>
    <div class="info-row"><span class="info-label">Datum</span><span class="info-value">${datum}</span></div>
    <div class="info-row"><span class="info-label">Beginn</span><span class="info-value">${begZeit} Uhr</span></div>
    <div class="info-row"><span class="info-label">Objekt</span><span class="info-value">${objekt}</span></div>
    <div class="info-row"><span class="info-label">Schichtführer</span><span class="info-value">${sf}</span></div>
  </div>
  <div>
    <div class="info-row"><span class="info-label">Mitarbeiter</span><span class="info-value">${mitarbeiter}</span></div>
    <div class="info-row"><span class="info-label">Übergabe von</span><span class="info-value">${uebergabeVon}</span></div>
    <div class="info-row"><span class="info-label">Schlüssel</span><span class="info-value">${schlussel}</span></div>
    <div class="info-row"><span class="info-label">Technik</span><span class="info-value">${technik}</span></div>
  </div>
</div>
<div class="info-row" style="margin-top:4px"><span class="info-label">Besonderheiten</span><span class="info-value">${besonderheiten}</span></div>

<div class="section-title">② Ereignisprotokoll (${state.ereignisse.length} Einträge)</div>
<table>
  <thead><tr><th>#</th><th>Zeit</th><th>Art / Beschreibung</th><th>Maßnahmen</th><th>Behörden</th></tr></thead>
  <tbody>${ereignisRows}</tbody>
</table>

<div class="section-title">③ Streifenprotokoll (${state.streifen.length} Einträge)</div>
<table>
  <thead><tr><th>#</th><th>Zeitraum</th><th>Bereich</th><th>Ergebnis</th></tr></thead>
  <tbody>${streifeRows}</tbody>
</table>

<div class="section-title">④ Schichtende</div>
<div class="info-grid">
  <div>
    <div class="info-row"><span class="info-label">Ende</span><span class="info-value">${endZeit} Uhr</span></div>
    <div class="info-row"><span class="info-label">Übergabe an</span><span class="info-value">${uebergabeAn}</span></div>
    <div class="info-row"><span class="info-label">Schlüssel übergeben</span><span class="info-value">${endSchluessel}</span></div>
  </div>
  <div>
    <div class="info-row"><span class="info-label">Gesamtlage</span><span class="info-value"><span class="lage" style="background:${lageColor}20;color:${lageColor};border:1px solid ${lageColor}">${lage}</span></span></div>
    <div class="info-row"><span class="info-label">Abschlussbemerkung</span><span class="info-value">${bemerkung}</span></div>
  </div>
</div>

<div class="footer">
  <div>
    <div class="sig-line"></div>
    <div class="sig-label">Unterschrift: ${endName}</div>
  </div>
  <div style="text-align:right">
    <div class="watermark">Erstellt: ${erstellt}</div>
    <div class="watermark">Secure Group · www.secure-group.de – Digitales Wachbuch</div>
  </div>
</div>

<script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;

  const blob = new Blob([html], {type: 'text/html'});
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  showToast('📄 PDF-Vorschau geöffnet');
}