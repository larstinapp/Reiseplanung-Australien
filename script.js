// Annahme: Daten sind bereits in der Variable `daten` enthalten, also entfällt der Ladeprozess
// daten = JSON-Daten des Reiseplans (anstelle eines separaten JSON-Fetch-Vorgangs).
// Wenn daten als externes JSON benötigt wird, aktivieren Sie ladeDaten().

let aktuellerIndex = 0;
let karte;
let markerLayer;
let aktuellerMarker;

function initialisiereKarte() {
  karte = L.map('karte').setView([-25.2744, 133.7751], 5); // Zentriert auf Australien
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(karte);

  // Marker-Layer für die Karte
  markerLayer = L.layerGroup().addTo(karte);
  zeichneRoute();
}

function zeichneRoute() {
  const routenPunkte = daten.map(stopp => [stopp.Breitengrad, stopp.Längengrad]);
  L.polyline(routenPunkte, { color: 'blue', weight: 4, opacity: 0.6 }).addTo(karte);
}

function zeigeOrt(index) {
  const ortDaten = daten[index];
  
  document.getElementById('ort').textContent = ortDaten.Ort;
  document.getElementById('tag').textContent = `Tag ${ortDaten.Tag}`;
  document.getElementById('datum').textContent = new Date(ortDaten.Datum).toLocaleDateString('de-DE');
  document.getElementById('unterkunft').textContent = ortDaten.Unterkunft;
  document.getElementById('sehenswuerdigkeiten').textContent = ortDaten.Sehenswürdigkeiten;
  document.getElementById('hinweise').textContent = ortDaten.Hinweise || 'Keine zusätzlichen Hinweise';

  const bildElement = document.getElementById('bild');
  bildElement.src = ortDaten.BildURL;
  bildElement.alt = `Bild von ${ortDaten.Ort}`;

  // Aktuellen Marker setzen
  if (aktuellerMarker) {
    markerLayer.removeLayer(aktuellerMarker);
  }
  aktuellerMarker = L.marker([ortDaten.Breitengrad, ortDaten.Längengrad], { opacity: 1 })
    .addTo(markerLayer)
    .bindPopup(`${ortDaten.Ort}`)
    .openPopup();

  karte.setView([ortDaten.Breitengrad, ortDaten.Längengrad], 10);
}

function naechsterOrt() {
  if (aktuellerIndex < daten.length - 1) {
    aktuellerIndex++;
    zeigeOrt(aktuellerIndex);
  }
}

function vorherigerOrt() {
  if (aktuellerIndex > 0) {
    aktuellerIndex--;
    zeigeOrt(aktuellerIndex);
  }
}

// Karte und erste Anzeige initialisieren
window.onload = function() {
  initialisiereKarte();
  zeigeOrt(aktuellerIndex);
};
