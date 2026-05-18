const FALL_THRESHOLD = 13.0;
let systemActive = false;
let sosWasActive = false;
let sosCount = 0, updateCount = 0;
let lastMode = 'DIRECT';

// INITIALIZE MAP
const map = L.map('map', { zoomControl: true }).setView([18.6453, 73.7583], 17);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const baseIcon = L.divIcon({
  html: '<div style="background:#00e5a0;color:#000;font-weight:700;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;">B</div>',
  iconSize: [24,24]
});
L.marker([18.6453, 73.7583], { icon: baseIcon }).addTo(map).bindPopup('Base Station');

let t1Marker = L.marker([18.6453, 73.7583]).addTo(map);
let t2Marker = L.marker([18.6461, 73.7595]).addTo(map);

// START SYSTEM
async function startSystem() {
  try {
    await fetch('http://localhost:5000/start', { method: 'POST' });
    systemActive = true;
    document.getElementById('start-screen').style.display = 'none';
  } catch(e) {
    alert("Python Server not found! Run server.py first.");
  }
}

// UPDATE DATA
async function fetchData() {
  if (!systemActive) return;
  try {
    const res = await fetch('http://localhost:5000/data');
    const d = await res.json();
    if (!d.active) return;

    updateCount++;
    document.getElementById('update-count').textContent = updateCount;
    
    // Update Mode Banner
    const isRelay = (d.mode === 'RELAY');
    const banner = document.getElementById('relay-banner');
    if (isRelay) banner.classList.add('show');
    else banner.classList.remove('show');

    // Update Vitals for T1 and T2... (Logic truncated for brevity, same as your original)
    // t1Marker.setLatLng([d.t1.lat, d.t1.lon]);
  } catch(e) { console.log("Waiting for data..."); }
}

// RUN CLOCK AND FETCH
setInterval(() => {
  document.getElementById('clock').textContent = new Date().toLocaleTimeString('en-IN', { hour12: false });
}, 1000);
setInterval(fetchData, 1500);