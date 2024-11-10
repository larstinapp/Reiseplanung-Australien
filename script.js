// ...rest of your code...

// Hinweise bearbeiten
function bearbeitenHinweise() {
  const aktuelleHinweise = daten[aktuellerIndex].Hinweise || 'Keine zusätzlichen Hinweise';
  document.getElementById('hinweise').value = aktuelleHinweise; // Vorhandene Hinweise im Textfeld anzeigen
  document.getElementById('hinweiseModal').style.display = 'block';
}

// Hinweise speichern
function speichereHinweise() {
  const hinweise = document.getElementById('hinweise').value;
  daten[aktuellerIndex].Hinweise = hinweise;
  localStorage.setItem('reiseplanDaten', JSON.stringify(daten));

  document.getElementById('hinweiseText').textContent = hinweise || 'Keine zusätzlichen Hinweise';
  schliesseModal();
}

// Modal schließen
function schliesseModal() {
  document.getElementById('hinweiseModal').style.display = 'none';
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

// Initialisierung
window.onload = ladeDaten;
