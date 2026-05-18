// ===== STATE =====
let state = {
  schichtAktiv: false,
  beginnZeit: "",
  objekt: '',
  schichtfuehrer: '',
  ereignisse: [],
  streifen: []
};
// FUNKTION: Speichern
function saveToLocalStorage() {
    // Wir wandeln das Objekt in einen Text (JSON) um, da LocalStorage nur Text speichert
    localStorage.setItem('wachbuch_data', JSON.stringify(state));
    console.log("Speichervorgang: Daten im LocalStorage gesichert.");
}

// FUNKTION: Laden (wird beim Start der Seite aufgerufen)
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('wachbuch_data');
    if (savedData) {
        // Text zurück in ein JavaScript-Objekt umwandeln
        state = JSON.parse(savedData);
        console.log("Daten geladen:", state);
        return true;
    }
    return false;
}