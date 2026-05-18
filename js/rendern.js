
function renderSchicht() {
  document.getElementById('barObjekt').textContent = state.beginn["objekt"];
  document.getElementById('beginnForm').style.display = 'none';
  document.getElementById('barMitarbeiter').textContent = 'SF: ' + state.beginn["Schichtfuehrer"];
  document.getElementById('schichtAktivBar').style.display = 'block';
}

function renderEreignisse() {
  const list = document.getElementById('ereignisListe');
  if (state.ereignisse.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="icon">📋</div>Noch keine Ereignisse erfasst</div>';
    return;
  }

  console.log(state.ereignisse)
  list.innerHTML = state.ereignisse.map((e, i) => `
    <div class="event-item">
      <div class="event-time">${e.uhrzeit}</div>
      <div class="event-content">
        <div class="event-type">${e.art}</div>
        <div class="event-desc">${e.beschreibung.slice(0,80)}${e.beschreibung.length > 80 ? '…' : ''}</div>
        ${e.polizei !== 'Nein' && e.polizei !== '—' ? '<div style="color:var(--danger);font-size:11px;margin-top:3px">🚨 ' + e.polizei + '</div>' : ''}
      </div>
      <button class="event-delete" onclick="deleteEreignis(${i})">🗑</button>
    </div>
  `).join('');
}


function renderStreifen() {
  const list = document.getElementById('streifeListe');
  if (state.streifen.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="icon">🚶</div>Noch keine Streife erfasst</div>';
    return;
  }
  list.innerHTML = state.streifen.map((s, i) => `
    <div class="streife-item">
      <div class="streife-info">
        <div class="streife-time">${s.von} – ${s.bis} Uhr</div>
        <div style="font-size:14px;margin-top:2px">${s.bereich}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">Türen: ${s.tueren} · ${s.auffaellig}</div>
      </div>
      <button class="event-delete" onclick="deleteStreife(${i})">🗑</button>
    </div>
  `).join('');
}

