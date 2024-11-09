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
  document.getElementById('datum').textContent = new Date(ortDaten.Datum).toLocaleDateString('de-DE');
  document.getElementById('unterkunft').textContent = ortDaten.Unterkunft;
  document.getElementById('preis').textContent = ortDaten.Preis;
  document.getElementById('mietwagen').textContent = ortDaten.Mietwagen;
  document.getElementById('sehenswuerdigkeiten').textContent = ortDaten.Sehenswuerdigkeiten;
  document.getElementById('hinweise').textContent = ortDaten.Hinweise;
  document.getElementById('bild').src = ortDaten.BildURL;
  document.getElementById('bild').alt = `Bild von ${ortDaten.Ort}`;

  // Karte initialisieren
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
