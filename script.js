let daten = [];
let aktuellerIndex = 0;
let karte;
let markerLayer;
let aktuellerMarker;

async function ladeDaten() {
  try {
    const antwort = await fetch('australien_reiseplan.json');
    daten = await antwort.json();
    const gespeicherteDaten = JSON.parse(localStorage.getItem('reiseplanDaten'));
    if (gespeicherteDaten && gespeicherteDaten.length === daten.length) {
      daten = gespeicherteDaten;
    }
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
  karte = L.map('karte').setView([-25.2744, 133.7751], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(karte);

  markerLayer = L.layerGroup().addTo(karte);
  zeichneRoute();
}

function zeichneRoute() {
  const routenPunkte = daten.map(stopp => [stopp.Breitengrad, stopp.Längengrad]);
  L.polyline(routenPunkte, { color: '#00796b', weight: 4, opacity: 0.7 }).addTo(karte);
}

function zeigeOrt(index) {
  const ortDaten = daten[index];
  
  document.getElementById('ort').textContent = ortDaten.Ort;
  document.getElementById('tag').textContent = ortDaten.Tag;
  document.getElementById('datum').textContent = new Date(ortDaten.Datum).toLocaleDateString('de-DE');
  document.getElementById('unterkunft').textContent = ortDaten.Unterkunft;
  document.getElementById('sehenswuerdigkeiten').textContent = ortDaten.Sehenswürdigkeiten;

  document.getElementById('hinweiseText').textContent = ortDaten.Hinweise || 'Keine zusätzlichen Hinweise';
  document.getElementById('hinweise').value = ortDaten.Hinweise || '';

  const bildElement = document.getElementById('bild');
  bildElement.src = ortDaten.BildURL;
  bildElement.alt = `Bild von ${ortDaten.Ort}`;

  if (aktuellerMarker) {
    markerLayer.removeLayer(aktuellerMarker);
  }
  aktuellerMarker = L.marker([ortDaten.Breitengrad, ortDaten.Längengrad], { opacity: 1 })
    .addTo(markerLayer)
    .bindPopup(`${ortDaten.Ort}`)
    .openPopup();

  karte.setView([ortDaten.Breitengrad, ortDaten.Längengrad], 10);
}

// Hinweise bearbeiten
function bearbeitenHinweise() {
  document.getElementById('hinweiseText').style.display = 'none';
  document.getElementById('hinweise').style.display = 'block';
  document.getElementById('editButton').style.display = 'none';
  document.getElementById('saveButton').style.display = 'inline';
}

// Hinweise speichern
function speichereHinweise() {
  const hinweise = document.getElementById('hinweise').value;
  daten[aktuellerIndex].Hinweise = hinweise;
  localStorage.setItem('reiseplanDaten', JSON.stringify(daten));

  document.getElementById('hinweiseText').textContent = hinweise || 'Keine zusätzlichen Hinweise';
  document.getElementById('hinweiseText').style.display = 'block';
  document.getElementById('hinweise').style.display = 'none';
  document.getElementById('editButton').style.display = 'inline';
  document.getElementById('saveButton').style.display = 'none';

  alert('Hinweise gespeichert!');
}

// Navigation
function naechsterOrt() {
  if (aktuellerIndex < daten.length - 1) {
    aktuellerIndex++;
    zeigeOrt(aktuellerIndex);
  } else {
    aktuellerIndex = 0;
    zeigeOrt(aktuellerIndex);
  }
}

function vorherigerOrt() {
  if (aktuellerIndex > 0) {
    aktuellerIndex--;
    zeigeOrt(aktuellerIndex);
  } else {
    aktuellerIndex = daten.length - 1;
    zeigeOrt(aktuellerIndex);
  }
}

window.onload = ladeDaten;
