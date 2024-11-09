let daten;
let aktuellerIndex = 0;
let karte;
let markerLayer;

async function ladeDaten() {
  const antwort = await fetch('australien_reiseplan.json');
  daten = await antwort.json();
  initialisiereKarte();
  zeigeOrt(aktuellerIndex);
}

function initialisiereKarte() {
  karte = L.map('karte').setView([-25.2744, 133.7751], 5); // Start auf einer Übersicht über Australien
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(karte);

  markerLayer = L.layerGroup().addTo(karte); // Schicht für die Marker
  zeichneRoute(); // Zeichnet die gesamte Route
}

function zeichneRoute() {
  const routenPunkte = daten.map(stopp => [stopp.Breitengrad, stopp.Längengrad]);
  L.polyline(routenPunkte, { color: 'blue', weight: 4, opacity: 0.6 }).addTo(karte); // Linie für die Route
}

function zeigeOrt(index) {
  const ortDaten = daten[index];
  
  // Setzt die Ortsinformationen im HTML
  document.getElementById('ort').textContent = ortDaten.Ort;
  document.getElementById('tag').textContent = `Tag ${ortDaten.Tag}`;
  document.getElementById('datum').textContent = new Date(ortDaten.Datum).toLocaleDateString('de-DE');
  document.getElementById('unterkunft').textContent = ortDaten.Unterkunft;
  document.getElementById('sehenswuerdigkeiten').textContent = ortDaten.Sehenswürdigkeiten;
  document.getElementById('hinweise').textContent = ortDaten.Hinweise || 'Keine zusätzlichen Hinweise';

  const bildElement = document.getElementById('bild');
  bildElement.src = ortDaten.BildURL;
  bildElement.alt = `Bild von ${ortDaten.Ort}`;

  // Entfernt die alten Marker und fügt neue hinzu
  markerLayer.clearLayers();
  daten.forEach((stopp, i) => {
    const marker = L.marker([stopp.Breitengrad, stopp.Längengrad], { opacity: i === index ? 1 : 0.5 }); // Hellerer Marker für den aktuellen Stopp
    marker.bindPopup(`${stopp.Ort}`).openPopup();
    markerLayer.addLayer(marker);
  });

  // Zentriert die Karte auf den aktuellen Stopp
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

window.onload = ladeDaten;
