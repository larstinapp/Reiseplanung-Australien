// JavaScript to handle data and navigation
let data;
let currentIndex = 0;

async function loadData() {
  const response = await fetch('australia_travel_plan.json');
  data = await response.json();
  displayLocation(currentIndex);
}

function displayLocation(index) {
  const locationData = data[index];
  document.getElementById('location').textContent = locationData.Location;
  document.getElementById('date').textContent = new Date(locationData.Date).toLocaleDateString();
  document.getElementById('accommodation').textContent = locationData.Accommodation;
  document.getElementById('price').textContent = locationData.Price;
  document.getElementById('carRental').textContent = locationData.CarRental;
  document.getElementById('sights').textContent = locationData.Sights;
  document.getElementById('notes').textContent = locationData.Notes;

  // Initialize map
  if (window.map) {
    window.map.remove();
  }
  window.map = L.map('map').setView([-25.2744, 133.7751], 5); // General location of Australia
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(window.map);
}

function nextLocation() {
  if (currentIndex < data.length - 1) {
    currentIndex++;
    displayLocation(currentIndex);
  }
}

function prevLocation() {
  if (currentIndex > 0) {
    currentIndex--;
    displayLocation(currentIndex);
  }
}

window.onload = loadData;
