

// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  document.getElementById('clockDisplay').textContent =
    now.toTimeString().slice(0,5);
}
setInterval(updateClock, 1000);
updateClock();

// ===== SET DEFAULTS =====
(function setDefaults() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0,10);
  const timeStr = now.toTimeString().slice(0,5);
  document.getElementById('begDatum').value = dateStr;
  document.getElementById('begUhrzeit').value = timeStr;
  document.getElementById('evtUhrzeit').value = timeStr;
  document.getElementById('strVon').value = timeStr;
  document.getElementById('strBis').value = timeStr;
  document.getElementById('endUhrzeit').value = timeStr;
})();

// ===== NAVIGATION =====
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.bottom-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  document.getElementById('btn-' + name).classList.add('active');
  window.scrollTo(0,0);
}

// ===== RADIO BUTTONS =====
function selectRadio(el, groupId) {
  const group = document.getElementById(groupId);
  group.querySelectorAll('.radio-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

function getRadio(groupId) {
  const selected = document.querySelector('#' + groupId + ' .radio-btn.selected');
  return selected ? selected.textContent.trim() : '—';
}

// ===== TOAST =====
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== SCHICHT STARTEN =====
function startSchicht() {
    const beginnZeit = document.getElementById("begUhrzeit").value;
    const beginnDatum = document.getElementById("begDatum").value
    const objekt = document.getElementById('begObjekt').value;
    const sf = document.getElementById('begSchichtfuehrer').value.trim();
    const mitarbeiter = document.getElementById('begMitarbeiter').value;
    const uebergabeVon = document.getElementById('begUebergabeVon').value;
    const besonderheiten = document.getElementById('begBesonderheiten').value;
    const schluessel = getRadio('begSchluessel');
    const technik = getRadio('begTechnik');

    if (!objekt) { showToast('⚠️ Bitte Objekt wählen'); return; }
    if (!sf) { showToast('⚠️ Schichtführer eintragen'); return; }

    state.schichtAktiv = true;

    const beg = {
      datum: beginnDatum,
      uhrzeit: beginnZeit,
      objekt: objekt,
      Schichtfuehrer: sf,
      Mitarbeiter: mitarbeiter,
      UebergabeVon: uebergabeVon,
      Besonderheiten: besonderheiten,
      Schluessel: schluessel,
      Technik: technik

    }
    state.beginn = beg;
    saveToLocalStorage();
    renderSchicht();

    showToast('✅ Schicht gestartet · ' + objekt);
}


// ===== EREIGNIS =====
function addEreignis() {
  const uhrzeit = document.getElementById('evtUhrzeit').value;
  const art = document.getElementById('evtArt').value;
  const beschreibung = document.getElementById('evtBeschreibung').value.trim();
  if (!art) { showToast('⚠️ Art des Ereignisses wählen'); return; }
  if (!beschreibung) { showToast('⚠️ Beschreibung erforderlich'); return; }

  const evt = {
    uhrzeit,
    art,
    beschreibung,
    personen: document.getElementById('evtPersonen').value.trim(),
    massnahmen: document.getElementById('evtMassnahmen').value.trim(),
    polizei: getRadio('evtPolizei'),
    aktenzeichen: document.getElementById('evtAktenzeichen').value.trim(),
    meldung: getRadio('evtMeldung')
  };

  state.ereignisse.push(evt)
  saveToLocalStorage();
  renderEreignisse();

  // Reset
  document.getElementById('evtBeschreibung').value = '';
  document.getElementById('evtPersonen').value = '';
  document.getElementById('evtMassnahmen').value = '';
  document.getElementById('evtAktenzeichen').value = '';
  document.querySelectorAll('#sec-ereignis .radio-btn').forEach(b => b.classList.remove('selected'));

  saveToLocalStorage();
  showToast('✅ Ereignis gespeichert');
}

function deleteEreignis(i) {
  state.ereignisse.splice(i, 1);
  saveToLocalStorage();
  renderEreignisse();
  showToast('Ereignis gelöscht');
}

// ===== STREIFE =====
function addStreife() {
  const von = document.getElementById('strVon').value;
  const bis = document.getElementById('strBis').value;
  const bereich = document.getElementById('strBereich').value.trim();
  if (!bereich) { showToast('⚠️ Kontrollbereich angeben'); return; }

  const s = {
    von, bis, bereich,
    tueren: getRadio('strTueren'),
    auffaellig: getRadio('strAuffaellig')
  };

  state.streifen.push(s);
  saveToLocalStorage();
  renderStreifen();
  document.getElementById('strBereich').value = '';
  document.querySelectorAll('#sec-streife .radio-btn').forEach(b => b.classList.remove('selected'));
  showToast('✅ Streife gespeichert');
}

function deleteStreife(i) {
  state.streifen.splice(i, 1);
  saveToLocalStorage();
  renderStreifen();
}

// Diese Logik ganz unten in dein Skript packen
window.addEventListener('DOMContentLoaded', () => {
    const hatDaten = loadFromLocalStorage();
    
    if (hatDaten) {
        // Falls eine Schicht aktiv war, UI wiederherstellen
        renderSchicht();
        renderEreignisse();
        renderStreifen();
        
        showToast('Schicht wiederhergestellt');
    }
});

// ===== RESET =====
function resetSchicht() {
  if (!confirm('Neue Schicht beginnen? Alle Daten werden gelöscht.')) return;
  deleteState();
  document.getElementById('beginnForm').style.display = 'block';
  document.getElementById('schichtAktivBar').style.display = 'none';
  renderEreignisse();
  renderStreifen();
  document.querySelectorAll('input, textarea').forEach(el => el.value = '');
  document.querySelectorAll('select').forEach(el => el.value = '');
  document.querySelectorAll('.radio-btn').forEach(b => b.classList.remove('selected'));
  const now = new Date();
  document.getElementById('begDatum').value = now.toISOString().slice(0,10);
  document.getElementById('begUhrzeit').value = now.toTimeString().slice(0,5);
  showSection('beginn');
  showToast('🔄 Bereit für neue Schicht');
}