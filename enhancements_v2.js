// enhancements_v2.js — Additional Premium Upgrades (100-point upgrade part 2)
window.__enhancementsV2 = window.__enhancementsV2 || {};

function initEnhancementsV2() {
  try {
    /* ══════════════════════════════════════════
       1. PREMIUM WEB AUDIO SYNTHESIS
    ══════════════════════════════════════════ */
    let audioCtx = null;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (err) {
      console.warn('AudioContext unavailable in enhancements_v2.js:', err);
    }
    function playSynthSound(freqs, type = 'sine', duration = 0.5, volume = 0.1) {
      if (!audioCtx || audioCtx.state === 'suspended') return;
      freqs.forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      });
    }
window.playPopSound = () => playSynthSound([600, 900], 'sine', 0.12, 0.08);
window.playWindchime = () => playSynthSound([1046.5, 1174.7, 1318.5], 'triangle', 1.2, 0.04);
window.playPaperSound = () => playSynthSound([180, 240, 300], 'triangle', 0.15, 0.03);

// Ambient ocean waves & heartbeat generated using noise
let waveNode = null, heartNode = null;
function startAmbientSounds() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  // We can simulate soft periodic noise for ocean waves or heartbeat
  const bufferSize = audioCtx.sampleRate * 2;
  const waveBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = waveBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = waveBuffer;
  noise.loop = true;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, audioCtx.currentTime);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
  waveNode = { source: noise, gain: gain, filter: filter };
}
document.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (!waveNode) startAmbientSounds();
}, { once: true });

/* ══════════════════════════════════════════
   2. EBOOK CHAPTER DOTS navigation
══════════════════════════════════════════ */
const chWrap = document.createElement('div');
chWrap.className = 'ebook-chapters';
document.body.appendChild(chWrap);

function refreshChapterDots() {
  chWrap.innerHTML = '';
  const secEls = document.querySelectorAll('.section');
  secEls.forEach((sec, idx) => {
    const t = sec.querySelector('.section-title')?.textContent || `Chapter ${idx + 1}`;
    const dot = document.createElement('div');
    dot.className = 'chapter-dot';
    dot.dataset.label = t;
    dot.addEventListener('click', () => {
      sec.scrollIntoView({ behavior: 'smooth' });
      window.playPaperSound && window.playPaperSound();
    });
    chWrap.appendChild(dot);
  });
}
refreshChapterDots();

let scrollTick = null;
function scheduleScrollWork(callback) {
  if (scrollTick) return;
  scrollTick = requestAnimationFrame(() => {
    scrollTick = null;
    callback();
  });
}
window.addEventListener('scroll', () => {
  scheduleScrollWork(() => {
    const dots = document.querySelectorAll('.chapter-dot');
    let activeIdx = 0;
    document.querySelectorAll('.section').forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.4) activeIdx = idx;
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIdx);
    });
    const distSec = document.getElementById('distance');
    if (distSec && waveNode) {
      const r = distSec.getBoundingClientRect();
      const isVis = r.top < window.innerHeight && r.bottom > 0;
      const tgt = isVis ? 0.05 : 0;
      waveNode.gain.gain.setTargetAtTime(tgt, audioCtx.currentTime, 1.2);
      if (isVis) {
        const f = 150 + Math.sin(Date.now() / 2000) * 80;
        waveNode.filter.frequency.setValueAtTime(f, audioCtx.currentTime);
      }
    }
  });
}, { passive: true });

/* ══════════════════════════════════════════
   3. THEN VS NOW SPLIT SCREEN SLIDER
══════════════════════════════════════════ */
const splitSecNode = document.createElement('section');
splitSecNode.id = 'then-now-sec';
splitSecNode.className = 'section reveal-el pressed-flower-bordered';
splitSecNode.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">Years pass, love grows</div>
    <h2 class="section-title">Then &amp; Now ✨</h2>
    <p class="section-sub">Drag the divider or scroll to see how beautiful the journey is.</p>
    <div class="split-screen-section" id="splitscreen">
      <div class="split-pane left">
        <img src="FB_IMG_1777340857582.jpg" onerror="window.placeholderImg && placeholderImg(this,'Then')">
        <div class="split-label">Then</div>
      </div>
      <div class="split-split" id="splitdivider"></div>
      <div class="split-pane right" style="clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%)">
        <img src="IMG-20260123-WA0001.jpg " onerror="window.placeholderImg && placeholderImg(this,'Now')">
        <div class="split-label">Now</div>
      </div>
    </div>
  </div>
`;
const timelineSecNode = document.getElementById('story');
if (timelineSecNode) timelineSecNode.after(splitSecNode);

// Scroll merging split screen + Drag handling
const splitscreen = document.getElementById('splitscreen');
const splitdivider = document.getElementById('splitdivider');
const rightPane = splitscreen?.querySelector('.split-pane.right');

function setSplitPct(pct) {
  if (!rightPane || !splitdivider) return;
  const p = Math.max(0, Math.min(pct, 100));
  splitdivider.style.left = p + '%';
  rightPane.style.clipPath = `polygon(${p}% 0, 100% 0, 100% 100%, ${p}% 100%)`;
}
window.addEventListener('scroll', () => {
  if (!splitscreen) return;
  scheduleScrollWork(() => {
    const r = splitscreen.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      const track = 1 - (r.top / window.innerHeight);
      setSplitPct(track * 100);
    }
  });
}, { passive: true });

// Drag setup
let isDraggingSplit = false;
splitdivider?.addEventListener('mousedown', () => isDraggingSplit = true);
window.addEventListener('mouseup', () => isDraggingSplit = false);
window.addEventListener('mousemove', e => {
  if (!isDraggingSplit || !splitscreen) return;
  const rect = splitscreen.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pct = (x / rect.width) * 100;
  setSplitPct(pct);
});

/* ══════════════════════════════════════════
   4. CONVERSATION TEXT HISTORY MOCK UP
══════════════════════════════════════════ */
const chatSecNode = document.createElement('section');
chatSecNode.className = 'section reveal-el';
chatSecNode.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">Remember this?</div>
    <h2 class="section-title">Late Night Talks 💬</h2>
    <p class="section-sub">A typical screenshot of us talking across timezones.</p>
    <div class="chat-container">
      <div class="chat-header">
        <img class="chat-avatar" src="1767539285639.jpg" onerror="window.placeholderImg && placeholderImg(this,'Avatar')">
        <div>
          <div class="chat-name">Samikshya 🌸</div>
          <div style="font-size:0.68rem;opacity:0.65">Online (always for you)</div>
        </div>
      </div>
      <div class="chat-body" id="chatbody">
        <div class="chat-bubble received">What are you doing? It's 2 AM there! 😴</div>
        <div class="chat-bubble sent">Making a secret project... you will see.</div>
        <div class="chat-bubble received">Wait, is it another surprise? Tell me!</div>
        <div class="chat-bubble sent">Nope, you have to wait until your birthday! 🎂</div>
      </div>
    </div>
  </div>
`;
const textSecNode = document.getElementById('future-letter-sec');
if (textSecNode) textSecNode.before(chatSecNode);

/* ══════════════════════════════════════════
   5. PLANT GROWTH MILESTONE PLANT
══════════════════════════════════════════ */
const plantSecNode = document.createElement('section');
plantSecNode.className = 'section reveal-el';
plantSecNode.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">Growing stronger together</div>
    <h2 class="section-title">Friendship in Bloom 🌱</h2>
    <p class="section-sub">Scroll to watch our relationship grow from a seed to full flower.</p>
    <div class="plant-box">
      <canvas class="plant-canvas" id="plantCanvas" width="280" height="300"></canvas>
    </div>
  </div>
`;
const reasonsSecNode = document.getElementById('reasons');
if (reasonsSecNode) reasonsSecNode.after(plantSecNode);

let plantCanvas = null;
let plantCtx = null;
function initPlantCanvas() {
  plantCanvas = document.getElementById('plantCanvas');
  plantCtx = plantCanvas?.getContext('2d');
  if (plantCanvas) drawPlant(0);
}
function drawPlant(progress) {
  if (!plantCtx || !plantCanvas) return;
  plantCtx.clearRect(0, 0, plantCanvas.width, plantCanvas.height);
  const w = plantCanvas.width;
  const h = plantCanvas.height;
  // Soil
  plantCtx.fillStyle = '#3a2012';
  plantCtx.beginPath();
  plantCtx.ellipse(w / 2, h - 14, 40, 10, 0, 0, Math.PI * 2);
  plantCtx.fill();
  // Pot
  plantCtx.fillStyle = '#d3ac68';
  plantCtx.beginPath();
  plantCtx.moveTo(w / 2 - 25, h - 14);
  plantCtx.lineTo(w / 2 + 25, h - 14);
  plantCtx.lineTo(w / 2 + 20, h - 2);
  plantCtx.lineTo(w / 2 - 20, h - 2);
  plantCtx.closePath();
  plantCtx.fill();

  if (progress <= 0) return;
  // stem
  plantCtx.strokeStyle = '#5a8f35';
  plantCtx.lineWidth = 4;
  plantCtx.lineCap = 'round';
  plantCtx.beginPath();
  plantCtx.moveTo(w / 2, h - 14);
  const stemH = Math.min(progress * 180, 160);
  plantCtx.quadraticCurveTo(w / 2 - 10, h - 14 - stemH / 2, w / 2 + 5, h - 14 - stemH);
  plantCtx.stroke();

  // leaves
  if (progress > 0.4) {
    plantCtx.fillStyle = '#7dbf43';
    plantCtx.beginPath();
    plantCtx.ellipse(w / 2 - 8, h - 14 - stemH * 0.4, 12, 6, -Math.PI / 6, 0, Math.PI * 2);
    plantCtx.fill();
  }
  if (progress > 0.7) {
    plantCtx.beginPath();
    plantCtx.ellipse(w / 2 + 10, h - 14 - stemH * 0.7, 10, 5, Math.PI / 5, 0, Math.PI * 2);
    plantCtx.fill();
  }
  // Flower
  if (progress > 0.9) {
    const fX = w / 2 + 5;
    const fY = h - 14 - stemH;
    plantCtx.fillStyle = '#e8a7bb';
    for (let i = 0; i < 5; i++) {
      plantCtx.beginPath();
      const ang = (i / 5) * Math.PI * 2;
      plantCtx.arc(fX + Math.cos(ang) * 10, fY + Math.sin(ang) * 10, 8, 0, Math.PI * 2);
      plantCtx.fill();
    }
    // yellow center
    plantCtx.fillStyle = '#f0cf8e';
    plantCtx.beginPath();
    plantCtx.arc(fX, fY, 6, 0, Math.PI * 2);
    plantCtx.fill();
  }
}
initPlantCanvas();
window.addEventListener('scroll', () => {
  if (!plantCanvas) return;
  const rect = plantCanvas.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    const track = Math.max(0, Math.min(1 - (rect.top / (window.innerHeight - 100)), 1));
    drawPlant(track);
  }
}, { passive: true });

/* ══════════════════════════════════════════
   6. DISTANCE SHRINKING MAP
══════════════════════════════════════════ */
const distSecNode = document.getElementById('distance');
if (distSecNode) {
  const mapDiv = document.createElement('div');
  mapDiv.className = 'svg-map-container';
  mapDiv.innerHTML = `
    <svg viewBox="0 0 600 320" width="100%" height="100%">
      <!-- Map curves -->
      <path d="M120,80 Q220,180,480,240" fill="none" stroke="rgba(240,207,142,0.18)" stroke-width="2"/>
      <path id="flightpath" d="M120,80 Q220,180,480,240" fill="none" stroke="#e8a7bb" stroke-width="3" class="distance-shrink-line"/>
      <!-- Nepal Pin -->
      <circle cx="120" cy="80" r="6" fill="#f0cf8e"/>
      <text x="110" y="68" fill="#f0cf8e" font-size="12" font-family="'Playfair Display', serif">Nepal</text>
      <!-- Maldives Pin -->
      <circle cx="480" cy="240" r="6" fill="#e8a7bb"/>
      <text x="470" y="260" fill="#e8a7bb" font-size="12" font-family="'Playfair Display', serif">Maldives</text>
      <!-- Airplane indicator -->
      <g id="plane-indicator" transform="translate(120,80)">
        <text font-size="22" y="7" x="-10">✈️</text>
      </g>
    </svg>
    <div id="distance-indicator-text" style="position:absolute;bottom:1.2rem;left:50%;transform:translateX(-50%);font-family:'Lora',serif;font-size:0.95rem;color:#f0cf8e">Nepal to Maldives</div>
  `;
  distSecNode.querySelector('.section-inner').appendChild(mapDiv);
  window.addEventListener('scroll', () => {
    const rect = mapDiv.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const track = Math.max(0, Math.min(1 - (rect.top / (window.innerHeight - 100)), 1));
      // Make Airplane fly along flightpath
      const path = document.getElementById('flightpath');
      const plane = document.getElementById('plane-indicator');
      const text = document.getElementById('distance-indicator-text');
      if (path && plane && path.getTotalLength) {
        const len = path.getTotalLength();
        const pt = path.getPointAtLength(track * len);
        plane.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
        // Distance label fades to zero
        const totalMiles = Math.round((1 - track) * 2200);
        text.innerHTML = totalMiles === 0 ? "<strong>Actual distance: Zero (in my heart) ❤</strong>" : `Distance: ${totalMiles} miles away`;
      }
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════
   7. REPORT CARD AND TIMELINE NODES
══════════════════════════════════════════ */
const reportSecNode = document.createElement('section');
reportSecNode.className = 'section reveal-el';
reportSecNode.innerHTML = `
  <div class="section-inner glass">
    <div class="eyebrow">A solid review</div>
    <h2 class="section-title">Friendship Report Card 📝</h2>
    <div class="report-card-grid">
      <div class="report-row"><div class="report-num">A+++</div><div class="eyebrow">Being Iconic</div></div>
      <div class="report-row"><div class="report-num">A++</div><div class="eyebrow">Making Me Laugh</div></div>
      <div class="report-row"><div class="report-num">Only B</div><div class="eyebrow">Replying Speed</div></div>
      <div class="report-row"><div class="report-num">A+++</div><div class="eyebrow">Kindness</div></div>
    </div>
  </div>
`;
const letterSecNode = document.getElementById('letter');
if (letterSecNode) letterSecNode.before(reportSecNode);

// Word per year timeline nodes
const timelineNodeWrap = document.createElement('section');
timelineNodeWrap.className = 'section reveal-el';
timelineNodeWrap.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">One word, one year</div>
    <h2 class="section-title">A Word Per Year ⏳</h2>
    <div class="timeline-horizontal">
      ${[
    { y: 20, w: 'Fearless' }, { y: 21, w: 'Radiant' }, { y: 22, w: 'Curious' }, { y: 23, w: 'Resilient' }, { y: 24, w: 'Unstoppable' }, { y: 25, w: 'Phenomenal' }
  ].map(node => `
        <div class="timeline-node">
          <div class="node-yr">Age ${node.y}</div>
          <div class="node-word">${node.w}</div>
        </div>
      `).join('')}
    </div>
  </div>
`;
const cakeSecNode = document.getElementById('cake-section');
if (cakeSecNode) cakeSecNode.before(timelineNodeWrap);

/* ══════════════════════════════════════════
   8. COMIC CAROUSEL - DAY IN HER LIFE
══════════════════════════════════════════ */
const comicSecNode = document.createElement('section');
comicSecNode.className = 'section reveal-el';
comicSecNode.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">A ordinary day</div>
    <h2 class="section-title">A Day in Her Life 🎨</h2>
    <div class="comic-strip-carousel">
      <div class="comic-panel"><div class="comic-panel-art">☕</div><div class="comic-panel-text"><strong>Morning ritual</strong><br>Late wakeup and immediate search for coffee.</div></div>
      <div class="comic-panel"><div class="comic-panel-art">📱</div><div class="comic-panel-text"><strong>Connecting</strong><br>Checking messages and smiling at inside jokes.</div></div>
      <div class="comic-panel"><div class="comic-panel-art">✈️</div><div class="comic-panel-text"><strong>Maldives mood</strong><br>Working hard with the tropical breeze in background.</div></div>
      <div class="comic-panel"><div class="comic-panel-art">🌙</div><div class="comic-panel-text"><strong>Wind down</strong><br>Listening to songs and talking about the future.</div></div>
    </div>
  </div>
`;
if (timelineNodeWrap) timelineNodeWrap.after(comicSecNode);

/* ══════════════════════════════════════════
   9. INTERACTIVE BEACH SAND DRAWING
══════════════════════════════════════════ */
const sandSecNode = document.createElement('section');
sandSecNode.className = 'section reveal-el';
sandSecNode.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">Write in the sand</div>
    <h2 class="section-title">Sand Art 🏖️</h2>
    <p class="section-sub">Drag your mouse or touch the sand below to write her name in it.</p>
    <div class="beach-sand-wrap">
      <canvas class="beach-sand-canvas" id="beachSand" width="460" height="350"></canvas>
      <div class="beach-sand-overlay"></div>
    </div>
    <button class="btn btn-secondary" onclick="clearSand()">🌊 Wash Away Sand</button>
  </div>
`;
const quizSecNode = document.getElementById('quiz-sec');
if (quizSecNode) quizSecNode.after(sandSecNode);

let sandCanvas = null;
let sandCtx = null;
let drawingSand = false;
function initSandCanvas() {
  sandCanvas = document.getElementById('beachSand');
  sandCtx = sandCanvas?.getContext('2d');
  if (!sandCtx || !sandCanvas) return;
  sandCtx.fillStyle = '#dfc39a';
  sandCtx.fillRect(0, 0, sandCanvas.width, sandCanvas.height);
  sandCtx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i < 4000; i++) {
    sandCtx.fillRect(Math.random() * sandCanvas.width, Math.random() * sandCanvas.height, 1.5, 1.5);
  }
}
initSandCanvas();
window.clearSand = () => {
  if (window.playChime) playChime([261, 329]);
  initSandCanvas();
};

function getSandPos(e) {
  if (!sandCanvas) return { x: 0, y: 0 };
  const r = sandCanvas.getBoundingClientRect();
  const scaleX = sandCanvas.width / r.width;
  const scaleY = sandCanvas.height / r.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (clientX - r.left) * scaleX,
    y: (clientY - r.top) * scaleY
  };
}
function drawSandStroke(pos) {
  if (!sandCtx) return;
  sandCtx.strokeStyle = '#b29672';
  sandCtx.lineWidth = 14;
  sandCtx.lineCap = 'round';
  sandCtx.lineJoin = 'round';
  sandCtx.beginPath();
  if (window.lastSandPos) {
    sandCtx.moveTo(window.lastSandPos.x, window.lastSandPos.y);
    sandCtx.lineTo(pos.x, pos.y);
    sandCtx.stroke();
  }
  window.lastSandPos = pos;
}

function wireSandEvents() {
  if (!sandCanvas) return;
  sandCanvas.addEventListener('mousedown', e => { drawingSand = true; window.lastSandPos = getSandPos(e); });
  sandCanvas.addEventListener('mousemove', e => { if (drawingSand) drawSandStroke(getSandPos(e)); });
  window.addEventListener('mouseup', () => drawingSand = false);
  sandCanvas.addEventListener('touchstart', e => { drawingSand = true; window.lastSandPos = getSandPos(e); }, { passive: true });
  sandCanvas.addEventListener('touchmove', e => { if (drawingSand) drawSandStroke(getSandPos(e)); }, { passive: true });
  sandCanvas.addEventListener('touchend', () => drawingSand = false);
}
wireSandEvents();

/* ══════════════════════════════════════════
   10. MIC CONFETTI CANNON (Clap trigger)
══════════════════════════════════════════ */
let audioStream = null;
const micToggle = document.createElement('button');
micToggle.className = 'btn btn-secondary';
micToggle.id = 'micConfettiBtn';
micToggle.style.cssText = 'margin:1rem auto;display:block';
micToggle.textContent = '🎤 Activate Clap Confetti';
document.getElementById('finale')?.querySelector('.section-inner').appendChild(micToggle);

micToggle.addEventListener('click', () => {
  if (audioStream) {
    audioStream.getTracks().forEach(t => t.stop());
    audioStream = null;
    micToggle.textContent = '🎤 Activate Clap Confetti';
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    audioStream = stream;
    micToggle.textContent = '🎤 Microphone Active (Clap now!)';
    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(2048, 1, 1);
    source.connect(processor);
    processor.connect(audioCtx.destination);
    processor.onaudioprocess = e => {
      const input = e.inputBuffer.getChannelData(0);
      let sum = 0;
      for (let i = 0; i < input.length; i++) {
        sum += input[i] * input[i];
      }
      const rms = Math.sqrt(sum / input.length);
      if (rms > 0.35) { // sharp clap sound threshold
        if (window.triggerConfetti) window.triggerConfetti(22);
        if (window.playChime) window.playChime([783.99, 1046.50]);
      }
    };
  }).catch(() => {
    micToggle.textContent = '🎤 Mic Access Refused (Static)';
  });
});

/* ══════════════════════════════════════════
   11. CONSTELLATION NAME TRACING
══════════════════════════════════════════ */
const constellSecNode = document.createElement('section');
constellSecNode.className = 'section reveal-el';
constellSecNode.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">Connect the stars</div>
    <h2 class="section-title">Samikshya's Constellation ✨</h2>
    <p class="section-sub">Trace the path of the stars to reveal your name in the night sky.</p>
    <div class="star-constellation-wrap">
      <div class="constellation-target-hint">Click &amp; connect the stars in order</div>
      <canvas id="constellCanvas" style="display:block;width:100%;height:100%"></canvas>
      <div class="constellation-photo-overlay" id="constellPhotoOverlay" aria-hidden="true"></div>
    </div>
  </div>
`;
if (sandSecNode) sandSecNode.before(constellSecNode);

let constellCanvas = null;
let constellCtx = null;
function initConstellationCanvas() {
  constellCanvas = document.getElementById('constellCanvas');
  constellCtx = constellCanvas?.getContext('2d');
  if (!constellCtx || !constellCanvas) return;
  constellCanvas.width = 640;
  constellCanvas.height = 420;
  drawConstellation();
}
const starsData = [
  { x: 60, y: 150 },
  { x: 120, y: 100 },
  { x: 180, y: 80 },
  { x: 240, y: 140 },
  { x: 300, y: 200 },
  { x: 360, y: 120 },
  { x: 420, y: 80 }
];
let traceIdx = 0;
let constellationRevealed = false;
const constellHint = constellSecNode.querySelector('.constellation-target-hint');
let constellPhotoOverlay = constellSecNode.querySelector('#constellPhotoOverlay');
function ensureConstellOverlay() {
  if (!constellPhotoOverlay) {
    const constellWrap = constellSecNode.querySelector('.star-constellation-wrap');
    if (!constellWrap) return;
    constellPhotoOverlay = document.createElement('div');
    constellPhotoOverlay.id = 'constellPhotoOverlay';
    constellPhotoOverlay.className = 'constellation-photo-overlay';
    constellWrap.appendChild(constellPhotoOverlay);
  }
  if (constellPhotoOverlay && constellPhotoOverlay.innerHTML.trim() === '') {
    constellPhotoOverlay.innerHTML = `<img src="1767539285639.jpg" alt="Samikshya star reveal">`;
  }
}
ensureConstellOverlay();
function drawConstellation() {
  if (!constellCtx || !constellCanvas) return;
  constellCtx.clearRect(0, 0, constellCanvas.width, constellCanvas.height);
  // draw stars
  starsData.forEach((st, idx) => {
    constellCtx.fillStyle = idx <= traceIdx ? '#f0cf8e' : 'rgba(255,255,255,0.4)';
    constellCtx.shadowColor = '#f0cf8e';
    constellCtx.shadowBlur = idx <= traceIdx ? 12 : 2;
    constellCtx.beginPath();
    constellCtx.arc(st.x, st.y, 5, 0, Math.PI * 2);
    constellCtx.fill();
    constellCtx.shadowBlur = 0; // reset
  });
  // draw traced lines
  if (traceIdx > 0) {
    constellCtx.strokeStyle = '#e8a7bb';
    constellCtx.lineWidth = 1.5;
    constellCtx.beginPath();
    constellCtx.moveTo(starsData[0].x, starsData[0].y);
    for (let i = 1; i <= traceIdx; i++) {
      constellCtx.lineTo(starsData[i].x, starsData[i].y);
    }
    constellCtx.stroke();
  }
  if (traceIdx === starsData.length - 1 || constellationRevealed) {
    ensureConstellOverlay();
    constellPhotoOverlay?.classList.add('visible');
  } else {
    constellPhotoOverlay?.classList.remove('visible');
  }
}
initConstellationCanvas();

constellCanvas?.addEventListener('click', e => {
  const rect = constellCanvas.getBoundingClientRect();
  const nextTarget = starsData[traceIdx + 1];
  if (!nextTarget) {
    if (!constellationRevealed) {
      constellationRevealed = true;
      constellHint.textContent = 'Photo revealed in the sky ✨';
      if (window.triggerConfetti) triggerConfetti(18);
      drawConstellation();
      return;
    }
    traceIdx = 0;
    constellationRevealed = false;
    constellHint.textContent = 'Click & connect the stars in order';
    if (window.playChime) playChime([261]);
    drawConstellation();
    return;
  }
  const scaleX = constellCanvas.width / rect.width;
  const scaleY = constellCanvas.height / rect.height;
  const cX = (e.clientX - rect.left) * scaleX;
  const cY = (e.clientY - rect.top) * scaleY;
  const dist = Math.hypot(cX - nextTarget.x, cY - nextTarget.y);
  if (dist < 42) { // clicked near star
    traceIdx++;
    if (window.playChime) playChime([261 + traceIdx * 80]);
    if (traceIdx === starsData.length - 1) {
      if (window.triggerConfetti) triggerConfetti(18);
      constellationRevealed = true;
      constellHint.textContent = 'Photo revealed in the sky ✨';
    }
    drawConstellation();
  }
});

/* ══════════════════════════════════════════
   12. DEVICE TILT / GYROSCOPE PARALLAX
══════════════════════════════════════════ */
window.addEventListener('deviceorientation', e => {
  const b = e.beta; // rotation front/back
  const g = e.gamma; // rotation left/right
  if (b === null || g === null) return;
  const items = document.querySelectorAll('.polaroid, .open-when-card, .btn');
  items.forEach(el => {
    // subtle parallax tilt shift
    el.style.transform = `translate(${g * 0.3}px, ${b * 0.3}px)`;
  });
});

/* ══════════════════════════════════════════
   13. SOMEONE ELSE IS VIEWING LIVE INDICATOR
══════════════════════════════════════════ */
const someoneViewing = document.createElement('div');
someoneViewing.style.cssText = 'position:fixed;bottom:1rem;left:1.2rem;z-index:500;padding:6px 12px;background:rgba(28,13,26,0.75);border-radius:99px;border:1px solid rgba(240,207,142,0.25);font-size:0.72rem;color:#f0cf8e;pointer-events:none;';
someoneViewing.textContent = '✨ 1 mutual friend is also viewing this right now!';
document.body.appendChild(someoneViewing);
setInterval(() => {
  const cnt = Math.floor(Math.random() * 3 + 1);
  someoneViewing.textContent = `✨ ${cnt} mutual friends are looking index this right now!`;
}, 22000);

/* ══════════════════════════════════════════
   14. DYNAMIC WEATHER GREETING
══════════════════════════════════════════ */
// Dynamic greeting injected into hero section directly
const heroSec = document.getElementById('hero');
if (heroSec) {
  const greetDiv = document.createElement('div');
  greetDiv.className = 'custom-greeting';
  const hr = new Date().getHours();
  let greetWord = 'Hello';
  if (hr < 12) greetWord = 'Good Morning 🌅';
  else if (hr < 17) greetWord = 'Good Afternoon ☀️';
  else greetWord = 'Good Evening 🌌';
  greetDiv.textContent = `${greetWord}, Samikshya`;
  // Insert after the hero-name
  const heroNameEl = heroSec.querySelector('#heroName');
  if (heroNameEl) heroNameEl.before(greetDiv);
  else heroSec.prepend(greetDiv);
  // Geo weather bar
  const geoDiv = document.createElement('div');
  geoDiv.className = 'geo-weather-bar';
  geoDiv.textContent = '📍 Maldives weather: Sunny, 29°C 🏝️';
  heroSec.querySelector('#countdown')?.after(geoDiv) || heroSec.appendChild(geoDiv);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      geoDiv.textContent = `📍 Location detected: ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E | Sending warmth from Nepal! 💖`;
    });
  }
}

/* ══════════════════════════════════════════
   15. WAX SEAL Envelope / Letter
══════════════════════════════════════════ */
const specialLetterSecNode = document.createElement('section');
specialLetterSecNode.className = 'section reveal-el';
specialLetterSecNode.innerHTML = `
  <div class="section-inner glass">
    <div class="eyebrow">For your eyes only</div>
    <h2 class="section-title">The Sealed Message 🤫</h2>
    <div class="wax-seal-seal" id="waxSealBtn">🏵️</div>
    <div id="sealedLetterBody" style="display:none;font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-style:italic;line-height:1.8;text-align:left;animation:fadeIn 0.8s ease;">
      If you are reading this, it means you broke the wax seal.
      Here is a reminder: You don't have to face the world alone. Even if we're miles apart, I'm just a chat or call away.
      Whatever comes this year, remember how much you are valued and celebrated.
      Happy 25th birthday, Samikshya. 💖
    </div>
  </div>
`;
if (letterSecNode) letterSecNode.after(specialLetterSecNode);

document.getElementById('waxSealBtn')?.addEventListener('click', function () {
  this.classList.add('broken');
  if (window.playPopSound) window.playPopSound();
  setTimeout(() => {
    this.style.display = 'none';
    const content = document.getElementById('sealedLetterBody');
    if (content) content.style.display = 'block';
    if (window.triggerConfetti) triggerConfetti(12);
  }, 600);
});

function observeNewRevealElements() {
  const newRevs = document.querySelectorAll('.reveal-el:not(.observed)');
  if (!newRevs.length) return;
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.08 });
  newRevs.forEach(el => {
    el.classList.add('observed');
    revealObserver.observe(el);
  });
}

function forceRevealElements() {
  document.querySelectorAll('.reveal-el:not(.active)').forEach(el => el.classList.add('active'));
}

/* ══════════════════════════════════════════
   16. BRANCHING CHOOSE YOUR ADVENTURE
══════════════════════════════════════════ */
const cyoaNode = document.createElement('section');
cyoaNode.className = 'section reveal-el';
cyoaNode.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">Play a mini adventure</div>
    <h2 class="section-title text-center">Choose Our Hangout ✈️</h2>
    <div class="cyoa-panel" id="cyoaPanel">
      <div id="cyoaText">We just landed at the airport. Where should we go first?</div>
      <div class="cyoa-choices" id="cyoaChoices">
        <button class="btn btn-secondary" onclick="chooseAdventure(1)">🏖️ The Beach</button>
        <button class="btn btn-secondary" onclick="chooseAdventure(2)">🍜 Food Stalls</button>
      </div>
    </div>
  </div>
`;
if (quizSecNode) quizSecNode.after(cyoaNode);

window.chooseAdventure = (choice) => {
  const panel = document.getElementById('cyoaPanel');
  const txt = document.getElementById('cyoaText');
  const choices = document.getElementById('cyoaChoices');
  if (window.playPopSound) window.playPopSound();
  if (choice === 1) {
    txt.innerHTML = "🏖️ We sit on the sand, watch waves, and laugh about Nepal's zero beaches. What next?";
    choices.innerHTML = `
      <button class="btn btn-secondary" onclick="chooseAdventure(3)">🎵 Play some music</button>
      <button class="btn btn-secondary" onclick="chooseAdventure(4)">🍦 Grab ice cream</button>
    `;
  } else if (choice === 2) {
    txt.innerHTML = "🍜 We eat spicy street food. Your nose is red from the spice. What next?";
    choices.innerHTML = `
      <button class="btn btn-secondary" onclick="chooseAdventure(5)">📷 Take a funny selfie</button>
      <button class="btn btn-secondary" onclick="chooseAdventure(4)">🍦 Get ice cream to cool down</button>
    `;
  } else if (choice === 3) {
    txt.innerHTML = "🎶 We plug in shared earcups, play songs, and feel completely at peace. You won the adventure! 💖";
    choices.innerHTML = `<button class="btn btn-primary" onclick="resetCYOA()">🔁 Play Again</button>`;
    if (window.triggerConfetti) triggerConfetti(10);
  } else if (choice === 4) {
    txt.innerHTML = "🍦 The ice cream melts all over our hands. We look ridiculous but completely happy. You won! 🎉";
    choices.innerHTML = `<button class="btn btn-primary" onclick="resetCYOA()">🔁 Play Again</button>`;
    if (window.triggerConfetti) triggerConfetti(10);
  } else if (choice === 5) {
    txt.innerHTML = "📷 We make ugly faces at the camera. Best memory ever. You won! ⭐";
    choices.innerHTML = `<button class="btn btn-primary" onclick="resetCYOA()">🔁 Play Again</button>`;
    if (window.triggerConfetti) triggerConfetti(10);
  }
};
window.resetCYOA = () => {
  const txt = document.getElementById('cyoaText');
  const choices = document.getElementById('cyoaChoices');
  if (txt && choices) {
    txt.innerHTML = "We just landed at the airport. Where should we go first?";
    choices.innerHTML = `
      <button class="btn btn-secondary" onclick="chooseAdventure(1)">🏖️ The Beach</button>
      <button class="btn btn-secondary" onclick="chooseAdventure(2)">🍜 Food Stalls</button>
    `;
  }
};

/* ══════════════════════════════════════════
   17. EXTRA COMPILATION MOCKS (prescription, app review)
══════════════════════════════════════════ */
const extraWrap = document.createElement('section');
extraWrap.className = 'section reveal-el';
extraWrap.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">Creative layouts</div>
    <div style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center">
      <!-- Prescription -->
      <div class="prescription-card">
        <div class="rx-rx">℞</div>
        <strong style="display:block;margin-bottom:8px">Patient Name: Samikshya</strong>
        <div><strong>Directions:</strong> Take 1 birthday hug, unlimited daily laughs, and remember you're loved. Refills: Unlimited.</div>
      </div>
      <!-- App review -->
      <div class="app-review">
        <div class="review-stars">⭐⭐⭐⭐⭐</div>
        <strong style="display:block;margin-bottom:4px">Best Friend App Store Review</strong>
        <div style="font-size:0.88rem;opacity:0.85">"10/10 would be friends again. Excellent communication, high quality sarcasm, survived Nepal-Maldives distance. Highly recommend."</div>
      </div>
    </div>
  </div>
`;
if (cyoaNode) cyoaNode.before(extraWrap);
refreshChapterDots();
observeNewRevealElements();
/* ══════════════════════════════════════════
   18. BOOKMARK REMINDER AND FOOTER STATS
══════════════════════════════════════════ */
const footerStats = document.createElement('div');
footerStats.style.cssText = 'text-align:center;font-size:0.75rem;opacity:0.5;margin-top:2rem;font-family:monospace;';
footerStats.innerHTML = `
  🛠️ Built with love in 32 hours | ☕ 16 cups of coffee consumed | Version 25.0 (Updated details)
  <br>
  <button class="btn btn-secondary" style="margin-top:10px;font-size:0.7rem;padding:6px 12px" onclick="alert('Press Ctrl+D (or Cmd+D) to bookmark this page!')">⭐ Bookmark This Page</button>
`;
document.querySelector('footer')?.appendChild(footerStats);

// Re-apply tilt and reveal on v2 elements
setTimeout(() => {
  const newV2Revs = document.querySelectorAll('.reveal-el:not(.observed)');
  const v2Obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.08 });
  newV2Revs.forEach(el => { el.classList.add('observed'); v2Obs.observe(el); });
  if (window.applyTilt) {
    document.querySelectorAll('.timeline-node, .report-row, .comic-panel, .prescription-card, .app-review').forEach(window.applyTilt);
  }
}, 1200);

  function insertAfter(el, target) {
    if (!target || !target.parentNode) return;
    target.parentNode.insertBefore(el, target.nextSibling);
  }

  function addPremiumV2Moments() {
    const finale = document.getElementById('finale');
    const referenceNode = finale || document.querySelector('footer');

    const candleWords = ['Every','candle','holds','a','word','from','my','heart','to','you,','each','tiny','flame','speaks','with','a','silent','promise.','May','your','25th','shine','brighter','than','ever.'];
    const candleRitual = document.createElement('section');
    candleRitual.className = 'section reveal-el';
    candleRitual.innerHTML = `
      <div class="section-inner glass">
        <div class="eyebrow">Light each tiny flame</div>
        <h2 class="section-title">Candle Lighting Ritual</h2>
        <p class="section-sub">Tap each candle to reveal one word of the message.</p>
        <div class="candle-ritual-room" id="candleRitualRoom"></div>
        <div class="candle-ritual-message" id="candleRitualMessage">${Array(candleWords.length).fill('⬜').join(' ')}</div>
      </div>
    `;
    insertAfter(candleRitual, referenceNode);
    const candleRoom = candleRitual.querySelector('#candleRitualRoom');
    const candleMsg = candleRitual.querySelector('#candleRitualMessage');
    const litState = Array(candleWords.length).fill(false);
    candleWords.forEach((word, idx) => {
      const candle = document.createElement('button');
      candle.type = 'button';
      candle.className = 'ritual-candle';
      candle.dataset.index = String(idx);
      candle.addEventListener('click', () => {
        if (candle.classList.contains('lit')) return;
        candle.classList.add('lit');
        litState[idx] = true;
        candleMsg.textContent = candleWords.map((w, i) => litState[i] ? w : '⬜').join(' ');
        if (litState.every(Boolean)) {
          setTimeout(() => {
            candleMsg.textContent = 'This message is now fully lit — just like you.';
          }, 500);
        }
      });
      candleRoom.appendChild(candle);
    });

    const licenseSection = document.createElement('section');
    licenseSection.className = 'section reveal-el';
    licenseSection.innerHTML = `
      <div class="section-inner">
        <div class="eyebrow">Official friendship credentials</div>
        <h2 class="section-title">Friendship License</h2>
        <div class="friendship-license-card">
          <div class="license-top-row">
            <div class="license-title-text">
              <span class="license-label">FRIENDSHIP LICENSE</span>
              <strong>Certified Best Friend</strong>
            </div>
            <span class="license-badge">Certified Since 2023</span>
          </div>
          <div class="license-body">
            <div class="license-photo-wrap">
              <img src="Snapchat-819884599.jpg" alt="Friendship license photo" onerror="window.placeholderImg && placeholderImg(this,'1767539285639.jpg')">
            </div>
            <div class="license-info">
              <div class="license-name">SAMIKSHYA</div>
              <div class="license-role">Certified Best Friend since 2023</div>
              <div class="license-row"><span>ID Number</span><strong>BFF-2023-∞</strong></div>
              <div class="license-row"><span>Issued by</span><strong>Heartfelt Adventures</strong></div>
              <div class="license-row"><span>Validity</span><strong>Lifetime / Always</strong></div>
            </div>
          </div>
          <div class="license-barcode"></div>
          <div class="license-note">This is a playful, official-looking friendship credential. Valid only within our story.</div>
        </div>
      </div>
    `;
    insertAfter(licenseSection, candleRitual);

    const nightWishSection = document.createElement('section');
    nightWishSection.className = 'section reveal-el';
    nightWishSection.innerHTML = `
      <div class="section-inner">
        <div class="eyebrow">A wish to the night sky</div>
        <h2 class="section-title">Night Sky Wish</h2>
        <div class="nightwish-panel">
          <button type="button" class="shooting-star" id="shootingStarBtn">✨</button>
          <div class="wish-form active" id="wishForm">
            <input type="text" id="wishInput" placeholder="Type your wish..." autocomplete="off" spellcheck="false">
            <button type="button" class="btn btn-secondary" id="submitWishBtn">Send Wish</button>
          </div>
          <div class="wish-feedback" id="wishFeedback"></div>
        </div>
      </div>
    `;
    insertAfter(nightWishSection, licenseSection);
    const wishBtn = nightWishSection.querySelector('#shootingStarBtn');
    const wishForm = nightWishSection.querySelector('.wish-form');
    const wishInput = nightWishSection.querySelector('#wishInput');
    const wishFeedback = nightWishSection.querySelector('#wishFeedback');
    const submitWishBtn = nightWishSection.querySelector('#submitWishBtn');
    wishForm.classList.add('active');
    submitWishBtn.type = 'button';
    wishInput.spellcheck = false;
    wishBtn.addEventListener('click', () => {
      wishForm.classList.add('active');
      setTimeout(() => wishInput.focus(), 60);
    });
    submitWishBtn.addEventListener('click', event => {
      event.preventDefault();
      const wish = wishInput.value.trim();
      if (!wish) {
        wishFeedback.textContent = 'Type a wish first.';
        wishFeedback.classList.add('error');
        wishFeedback.classList.remove('launching', 'granted');
        return;
      }
      wishFeedback.textContent = `Wish sent: "${wish}"`;
      wishFeedback.classList.remove('error');
      wishFeedback.classList.add('launching');
      setTimeout(() => {
        wishFeedback.textContent = 'Already granted.';
        wishFeedback.classList.remove('launching');
        wishFeedback.classList.add('granted');
      }, 1200);
      setTimeout(() => wishFeedback.classList.remove('granted'), 2600);
      wishInput.value = '';
    });
    wishInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitWishBtn.click();
      }
    });

    const fogSection = document.createElement('section');
    fogSection.className = 'section reveal-el';
    fogSection.innerHTML = `
      <div class="section-inner">
        <div class="eyebrow">Wipe away the fog</div>
        <h2 class="section-title">Breath Fog Reveal</h2>
        <div class="fog-photo-wrap" id="fogPhotoWrap">
          <img class="fog-image" src="Screenshot_20260722-214616.png" alt="Fog reveal photo" onerror="window.placeholderImg && window.placeholderImg(this,'Screenshot_20260722-214616.png')">
          <div class="fog-overlay" id="fogOverlay">Hover or tap to clear</div>
        </div>
      </div>
    `;
    insertAfter(fogSection, nightWishSection);
    const fogOverlay = fogSection.querySelector('#fogOverlay');
    const fogWrap = fogSection.querySelector('.fog-photo-wrap');
    fogWrap?.addEventListener('click', () => fogWrap.classList.toggle('cleared'));
    fogOverlay.addEventListener('click', (event) => {
      event.stopPropagation();
      fogWrap?.classList.toggle('cleared');
    });
    fogOverlay.addEventListener('mouseenter', () => fogWrap?.classList.add('cleared'));
    fogOverlay.addEventListener('mouseleave', () => fogWrap?.classList.remove('cleared'));

    const draftSection = document.createElement('section');
    draftSection.className = 'section reveal-el';
    draftSection.innerHTML = `
      <div class="section-inner glass">
        <div class="eyebrow">A message left unsent</div>
        <h2 class="section-title">Text Draft Reveal</h2>
        <div class="draft-message">
          <div class="draft-header">Drafts</div>
          <div class="draft-body" id="draftBody">I wanted to tell you how much this moment meant...</div>
        </div>
        <button class="btn btn-secondary" id="revealDraftBtn">Reveal the unsent text</button>
      </div>
    `;
    insertAfter(draftSection, fogSection);
    const draftBody = draftSection.querySelector('#draftBody');
    draftSection.querySelector('#revealDraftBtn').addEventListener('click', () => {
      draftBody.textContent = 'I never sent this because I wanted it to be a surprise — you are cherished more than words can hold.';
      draftSection.querySelector('#revealDraftBtn').disabled = true;
    });

    const reassureSection = document.createElement('section');
    reassureSection.className = 'section reveal-el';
    reassureSection.innerHTML = `
      <div class="section-inner glass">
        <div class="eyebrow">A note to return to</div>
        <h2 class="section-title">This page will always be here</h2>
        <p class="section-sub">The link never expires. Come back anytime — this gift stays for you.</p>
      </div>
    `;
    insertAfter(reassureSection, draftSection);

    const waxProgress = document.createElement('div');
    waxProgress.className = 'wax-progress';
    waxProgress.innerHTML = '<div class="wax-progress-track"><div class="wax-progress-fill" id="waxProgressFill"></div></div>';
    document.body.appendChild(waxProgress);
    const waxFill = waxProgress.querySelector('#waxProgressFill');
    const updateWax = () => {
      const pct = Math.min(Math.max(window.scrollY / (document.body.scrollHeight - window.innerHeight), 0), 1);
      waxFill.style.height = `${pct * 100}%`;
    };
    window.addEventListener('scroll', updateWax, { passive: true });
    updateWax();

    refreshChapterDots();
    observeNewRevealElements();
  }

  addPremiumV2Moments();
  window.__enhancementsV2.loaded = true;
  } catch (err) {
    console.error('enhancements_v2.js initialization failed:', err);
    window.__enhancementsV2.lastError = err;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancementsV2);
} else {
  initEnhancementsV2();
}
