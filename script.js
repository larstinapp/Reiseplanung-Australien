let daten;
let aktuellerIndex = 0;
let karte;
let markerLayer;

async function ladeDaten() {
  try {
    const antwort = await fetch('australien_reiseplan.json');
    daten = await antwort.json();
    if (daten && daten.length > 0) {
      initialisiereKarte();
      zeigeOrt(aktuellerIndex);
    } else {
      console.error('Die JSON-Datei enthält keine Daten.');
    }
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
  }
}

function initialisiereKarte() {
  const mapContainer = document.getElementById('karte');
  if (!mapContainer) {
    console.error('Karten-Container nicht gefunden.');
    return;
  }

  karte = L.map('karte').setView([-25.2744, 133.7751], 5); // Zentrum auf Australien
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(karte);

  // Marker-Layer erstellen
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

  markerLayer.clearLayers();
  daten.for
