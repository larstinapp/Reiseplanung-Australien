let daten;
let aktuellerIndex = 0;

async function ladeDaten() {
  const antwort = await fetch('australien_reiseplan.json');
  daten = await antwort.json();
  zeigeOrt(aktuellerIndex);
}

function zeigeOrt(index) {
  const ortDaten = daten[index];
  document.getElementById('ort').textContent = ortDaten.Ort;
  document.getElementById('tag').textContent = `Tag ${ortDaten.Tag}`;
  document.getElementById('datum').textContent = new Date(ortDaten.Datum).toLocaleDateString('de-DE');
  document.getElementById('unterkunft').textContent = ortDaten.Unterkunft;
  document.getElementById('mietwagen').textContent = ortDaten.Mietwagen ? `Mietwagen: ${ortDaten.Mietwagen}` : 'Kein Mietwagen';
  document.getElementById('sehenswuerdigkeiten').textContent = ortDaten.Sehenswürdigkeiten;
  document.getElementById('hinweise').textContent = ortDaten.Hinweise || 'Keine zusätzlichen Hinweise';

  const bildElement = document.getElementById('bild');
  bildElement.src = ortDaten.BildURL;
  bildElement.alt = `Bild von ${ortDaten.Ort}`;

  if (window.karte) {
    window.karte.remove();
  }
  window.karte = L.map('karte').setView([ortDaten.Breitengrad, ortDaten.Längengrad], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(window.karte);
  L.marker([ortDaten.Breitengrad, ortDaten.Längengrad]).addTo(window.karte)
    .bindPopup(ortDaten.Ort)
    .openPopup();
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
