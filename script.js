// script.js - Interactive Scripts for Birthday Page Upgrade

// 1. Photos & Videos Configuration
const photoFiles = [
  'Screenshot_20260723-014804.png',
  'file_0000000004c071fabea6c69ec86982a6.png',
  'FB_IMG_1777340857582.jpg',
  'FB_IMG_1777340773669~2.jpg',
  'FB_IMG_1777340848675 (1).jpg',
  '1767539285639.jpg',
  '1777352808638.png',
  '1776166865973.png',
  '1784736529383.png',
  'FB_IMG_1670835935529.jpg',
  'FB_IMG_1670835954863.jpg',
  'FB_IMG_1784735929225.jpg',
  'IMG-20250303-WA0011.jpg',
  'IMG-20250303-WA0013.jpg',
  'IMG-20250303-WA0014.jpg',
  'IMG-20251130-WA0008 (1).jpg',
  '20250509_1841_Black and White Portrait_remix_01jtths6aseer922b7nyv6jb4b (1).PNG',
  'IMG-20260123-WA0000.jpg',
  'IMG-20260123-WA0001.jpg',
  'Snapchat-1983143753.jpg',
  'Snapchat-819884599.jpg',
  'Screenshot_20260723-005110.png',
  'Snapchat-1487248685.jpg',
  'Snapchat-1677789103.jpg',
  'IMG20231106183245.jpg',
  'IMG_20230105_155958.jpg',
  'IMG_20241211_112643.jpg',
  'IMG_20260613_132112633.jpg',
  'Messenger_creation_0EED22DC-3E5D-4837-B7A3-746CA3CFAF79.jpg',
  'Messenger_creation_17FA0146-C195-4C59-89E4-832A4664054E.jpeg',
  'Messenger_creation_40D207E7-FDF8-4BED-BBCB-470079784715.jpg',
  'Messenger_creation_A2A9B5AA-7EF0-48B1-945B-E8387767550E.jpg',
  'Messenger_creation_B4292F91-96B4-4A0B-8F7C-D6C7FC73B496.jpeg',
  'Messenger_creation_C19E8D5A-BCAD-4A44-B948-1E898FA8E570.jpeg',
  'Messenger_creation_FB73C8F6-6D72-4DEC-9764-FE4102BDF656.jpeg',
  'Messenger_creation_FE1B23ED-B73F-49CB-A4FC-6F448F0DD5CC.jpg',
  'Screenshot (28).png',
  'Screenshot_20260122-155719.png',
  'Screenshot_20260122-160039.png',
  'Screenshot_20260122-160632.png',
  'Screenshot_20260722-214616.png'
];

const videoFiles = [
  'Messenger_creation_30557E28-575B-4A22-BB16-0FA0EDEBF48C.mp4',
  'Snapchat-1011837322.mp4',
  'Snapchat-1156408253.mp4',
  'Snapchat-1182665261.mp4',
  'Snapchat-1221843373.mp4',
  'Snapchat-1237556565.mp4',
  'Snapchat-1300868162.mp4',
  'Snapchat-1402317597.mp4',
  'Snapchat-140733780.mp4',
  'Snapchat-1563604826.mp4',
  'Snapchat-1620976717.mp4',
  'Snapchat-1667169808.mp4',
  'Snapchat-1668895841.mp4',
  'Snapchat-1672770258.mp4',
  'Snapchat-1709773235.mp4',
  'Snapchat-1745542806.mp4',
  'Snapchat-1824647378.mp4',
  'Snapchat-1855646460.mp4',
  'Snapchat-1892580515.mp4',
  'Snapchat-1931461253.mp4',
  'Snapchat-2099561418.mp4',
  'Snapchat-222045613.mp4',
  'Snapchat-400026075.mp4',
  'Snapchat-407519932.mp4',
  'Snapchat-447028571.mp4',
  'Snapchat-495496349.mp4',
  'Snapchat-554211771.mp4',
  'Snapchat-607051787.mp4',
  'Snapchat-621247177.mp4',
  'Snapchat-648564251.mp4',
  'Snapchat-660882891.mp4',
  'Snapchat-739402874.mp4',
  'Snapchat-743782718.mp4',
  'Snapchat-761579390.mp4',
  'Snapchat-811464626.mp4',
  'Snapchat-816059905.mp4',
  'Snapchat-97285534.mp4'
];

const allMediaFiles = [...photoFiles, ...videoFiles];

function getFiles(start, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(photoFiles[(start + i) % photoFiles.length]);
  }
  return result;
}

function repeatFiles(files, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(files[i % files.length]);
  }
  return result;
}

// 2. AudioContext Synthesizer (Page flips & chimes)
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playWhoosh() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.45; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    filter.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {}
}

function playChime(freqs = [523.25, 659.25, 783.99, 1046.50]) { // C5, E5, G5, C6
  try {
    const ctx = getAudioContext();
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      
      gain.gain.setValueAtTime(0.0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
    });
  } catch (e) {}
}

// 3. Setup Initial Elements
const heroImage = document.querySelector('.hero-photo-frame img');
if (heroImage && photoFiles.length) heroImage.src = photoFiles[0];

// 4. Custom Particle Mouse Trail
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.08) return; 
  const p = document.createElement('div');
  p.className = 'cursor-trail-particle';
  const symbols = ['❤', '♥', '✦', '✧', '🌸', '✨'];
  p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  p.style.color = ['#e8a7bb', '#f0cf8e', '#b79fd6', '#f2c6d3'][Math.floor(Math.random() * 4)];
  p.style.left = `${e.clientX}px`;
  p.style.top = `${e.clientY}px`;
  document.body.appendChild(p);

  const duration = 800 + Math.random() * 600;
  const dx = (Math.random() - 0.5) * 80;
  const dy = -60 - Math.random() * 60;
  const r = (Math.random() - 0.5) * 180;
  
  p.animate([
    { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 0.9 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.1) rotate(${r}deg)`, opacity: 0 }
  ], { duration, easing: 'ease-out', fill: 'forwards' });

  setTimeout(() => p.remove(), duration);
});

// 5. Scroll Progress Bar
const progressBar = document.getElementById('scrollProgressBar');
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  if(progressBar) progressBar.style.width = scrolled + "%";
});

// 6. Section Scroll Reveals
const reveals = document.querySelectorAll('.reveal-el');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => revealObserver.observe(el));

// 7. Days Since We Met Counter
const metDate = new Date('2022-08-24T00:00:00'); // Custom milestone date
function updateDaysCounter() {
  const display = document.getElementById('daysCounterDisplay');
  if (!display) return;
  const diff = new Date() - metDate;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  display.innerHTML = `🌟 <b>${days.toLocaleString()}</b> Days, <b>${hours}</b> Hours, <b>${mins}</b> Mins, <b>${secs}</b> Secs Together`;
}
updateDaysCounter();
setInterval(updateDaysCounter, 1000);

// 8. 3D Tilt Interaction
function applyTilt(el) {
  if (window.innerWidth < 768) return; 
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 2 - 1;
    const py = (y / rect.height) * 2 - 1;
    const intensity = 10;
    el.style.transform = `perspective(600px) rotateY(${px * intensity}deg) rotateX(${-py * intensity}deg) scale(1.04)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
}
document.querySelectorAll('.polaroid, .book-page, .grow-item, .coupon-card-inner, .guess-card').forEach(applyTilt);

// 9. Stars & Shooting Stars backdrop
(function starsAndShooters(){
  const canvas = document.querySelector('#hero .stars');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  
  const starsArray = Array.from({ length: 110 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    s: Math.random() * 0.02 + 0.005,
    o: Math.random()
  }));

  let shootingStar = null;

  function spawnShootingStar() {
    shootingStar = {
      x: Math.random() * canvas.width * 0.6,
      y: 0,
      dx: 4 + Math.random() * 3,
      dy: 3 + Math.random() * 2,
      length: 80 + Math.random() * 80,
      opacity: 1,
      speed: 0.1
    };
  }

  setInterval(spawnShootingStar, 12000);

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    // Draw regular twinkling stars
    starsArray.forEach(p => {
      p.o += p.s;
      if (p.o > 1.0) p.o = 0.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 207, 142, ${p.o})`;
      ctx.fill();
    });

    // Draw shooting star
    if (shootingStar) {
      ctx.beginPath();
      const grad = ctx.createLinearGradient(
        shootingStar.x, shootingStar.y, 
        shootingStar.x - shootingStar.dx * 8, shootingStar.y - shootingStar.dy * 8
      );
      grad.addColorStop(0, `rgba(232, 167, 187, ${shootingStar.opacity})`);
      grad.addColorStop(1, 'rgba(232, 167, 187, 0)');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(shootingStar.x - shootingStar.dx * 5, shootingStar.y - shootingStar.dy * 5);
      ctx.stroke();

      // Progress coordinates
      shootingStar.x += shootingStar.dx;
      shootingStar.y += shootingStar.dy;
      shootingStar.opacity -= 0.015;

      if (shootingStar.opacity <= 0 || shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
        shootingStar = null;
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// 10. Cake candles blowing logic
const candles = document.querySelectorAll('.candle');
let candlesBlown = false;

function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;
  playChime();
  
  candles.forEach((c, i) => {
    setTimeout(() => {
      c.querySelector('.flame').classList.add('out');
      const smoke = c.querySelector('.smoke');
      smoke.classList.add('active');
      setTimeout(() => smoke.classList.remove('active'), 800);
      playWhoosh();
    }, i * 180);
  });

  setTimeout(() => {
    document.getElementById('wishMsg').textContent = '⭐ Your beautiful wish is drifting into the universe! ⭐';
    triggerConfetti();
  }, 1200);
}

document.getElementById('blowBtn').addEventListener('click', blowCandles);
document.getElementById('resetCakeBtn').addEventListener('click', () => {
  candlesBlown = false;
  candles.forEach(c => {
    c.querySelector('.flame').classList.remove('out');
    c.querySelector('.smoke').classList.remove('active');
  });
  document.getElementById('wishMsg').textContent = '';
});

// Confetti burst generator
function triggerConfetti(ctValue = 35) {
  const emojis = ['🎈', '🎉', '✨', '🌸', '❤', '⭐', '🎊', '💖'];
  for (let i = 0; i < ctValue; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      c.style.position = 'fixed';
      c.style.left = `${10 + Math.random() * 80}%`;
      c.style.top = '-5%';
      c.style.fontSize = `${1.2 + Math.random() * 1.6}rem`;
      c.style.zIndex = '99999';
      c.style.pointerEvents = 'none';
      c.style.transition = 'transform 2.2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 2.2s ease-out';
      document.body.appendChild(c);
      
      requestAnimationFrame(() => {
        c.style.transform = `translateY(${95 + Math.random() * 10}vh) rotate(${Math.random() * 360}deg)`;
        c.style.opacity = '0';
      });
      setTimeout(() => c.remove(), 2300);
    }, i * 65);
  }
}

// 11. Growing Up & Chapter Grid Initialization
const growingAges = [1, 3, 6, 10, 15, 20, 25];
const growingGrid = document.getElementById('growingGrid');
const growingFiles = getFiles(1, growingAges.length);
growingAges.forEach((age, idx) => {
  const file = growingFiles[idx];
  const div = document.createElement('div');
  div.className = 'grow-item';
  div.innerHTML = `<img src="${file}" alt="Growing up" onerror="placeholderImg(this,'${file}')">`;
  growingGrid.appendChild(div);
});

const chapterGrid = document.getElementById('chapterGrid');
const chapterFiles = getFiles(8, 7);
chapterFiles.forEach((file, idx) => {
  const fig = document.createElement('figure');
  fig.innerHTML = `<img src="${file}" alt="Memory ${idx + 1}" loading="lazy" onerror="placeholderImg(this,'${file}')">`;
  fig.onclick = () => openLightbox(file, false);
  chapterGrid.appendChild(fig);
});

// Lightbox logic
const lightbox = document.getElementById('lightbox');
const lbContent = document.getElementById('lbContent');
function openLightbox(file, video) {
  playWhoosh();
  lbContent.innerHTML = video
    ? `<video controls autoplay playsinline webkit-playsinline><source src="${file}" type="video/mp4"></video>`
    : `<img src="${file}" alt="Memory" onerror="placeholderImg(this,'${file}')">`;
  lightbox.classList.add('open');
}
const lbCloseEl = document.getElementById('lbClose');
if (lbCloseEl) lbCloseEl.onclick = () => { lightbox.classList.remove('open'); lbContent.innerHTML = ''; };
lightbox.addEventListener('click', e => { if (e.target === lightbox) { lightbox.classList.remove('open'); lbContent.innerHTML = ''; } });
window.openLightbox = openLightbox;

// 12. Memory Book Pages setup
const bookWrap = document.getElementById('bookWrap');
const memoryBookFiles = getFiles(17, 5);
const memoryBookPages = memoryBookFiles.map((file, idx) => ({
  file,
  caption: [
    "This smile — I don't know if you remember this day, but this picture always makes me smile.",
    "You were so proud that day. I was proud too, from wherever I was.",
    "Family, laughter, and you right in the middle of it — exactly where you belong.",
    "The look of someone chasing a dream. I've never doubted you'd get there.",
    "A gorgeous view of Maldives, but I know what the true treasure in this window is."
  ][idx]
}));
memoryBookPages.forEach((page, idx) => {
  const div = document.createElement('div');
  div.className = 'book-page';
  div.innerHTML = `<div class="pin">📌</div><img src="${page.file}" alt="Memory" loading="lazy" onerror="placeholderImg(this,'${page.file}')"><p>${page.caption}</p>`;
  div.addEventListener('click', () => {
    playWhoosh();
    div.animate([
      { transform: 'translateY(0) rotate(0deg)' },
      { transform: 'translateY(-10px) rotate(2deg)', offset: 0.5 },
      { transform: 'translateY(0) rotate(0deg)' }
    ], { duration: 400 });
  });
  bookWrap.appendChild(div);
  setTimeout(() => div.classList.add('show'), 200 + idx * 120);
});

// 13. Our Story photos
const storyPhotos = document.getElementById('storyPhotos');
const storyFiles = getFiles(15, 2);
storyFiles.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Us';
  img.loading = 'lazy';
  img.addEventListener('click', () => playChime([261.63, 329.63, 392.00, 523.25])); // C4 Chord
  img.onerror = function(){ placeholderImg(this, src); };
  storyPhotos.appendChild(img);
});

// 14. Carousel Slides Setup
const carouselWrap = document.getElementById('carouselWrap');
allMediaFiles.forEach(file => {
  const slide = document.createElement('div');
  slide.className = 'slide';
  const isVid = /\.(mp4|mov|webm)$/i.test(file);
  slide.onclick = () => openLightbox(file, isVid);
  if (isVid) {
    slide.innerHTML = `<div class="play-badge">▶</div><video muted playsinline webkit-playsinline><source src="${file}" type="video/mp4"></video>`;
  } else {
    slide.innerHTML = `<img src="${file}" alt="Memory" onerror="placeholderImg(this,'${file}')">`;
  }
  carouselWrap.appendChild(slide);
});

// 15. Theatre setup
const theatreGrid = document.getElementById('theatreGrid');
const theatreVideos = repeatFiles(videoFiles, 16); 
theatreVideos.forEach(file => {
  const item = document.createElement('div');
  item.className = 'theatre-item';
  item.innerHTML = `<video muted playsinline webkit-playsinline><source src="${file}" type="video/mp4"></video><div class="play-icon">▶</div>`;
  item.onclick = () => openLightbox(file, true);
  theatreGrid.appendChild(item);
});

// 16. Reasons setup
const reasonsGrid = document.getElementById('reasonsGrid');
const reasons = [ '🌸 Your smile', '💖 Your kindness', '🌎 Your strength', '✨ Your laugh', '🌙 Your dreams', '🌟 Your courage', '💫 Your grace', '🌺 Your warmth', '🍀 Your optimism', '🌈 Your spirit', '🌻 Your joy', '💎 Your resilience' ];
reasons.forEach(r => {
  const div = document.createElement('div');
  div.className = 'reason-card';
  const [emoji, ...rest] = r.split(' ');
  div.innerHTML = `<span class="emoji">${emoji}</span><div>${rest.join(' ')}</div>`;
  div.addEventListener('mouseenter', () => playChime([659.25])); // Quick chime note on hover
  reasonsGrid.appendChild(div);
});

// 17. 25 Reasons list
const reasons25Grid = document.getElementById('reasons25Grid');
const reasons25 = [
  'Your radiant smile', 'Your infinite kindness', 'Your beautiful laugh', 'Your gentle eyes', 
  'Your gorgeous dreams', 'Your quiet strength', 'Your charming elegance', 'Your cozy warmth', 
  'Your brave courage', 'Your bright optimism', 'Your golden spirit', 'Your simple joy', 
  'Your amazing resilience', 'Your caring loyalty', 'Your deep wisdom', 'Your silly jokes', 
  'Your true sincerity', 'Your artistic soul', 'Your sweet voice', 'Your generous heart', 
  'Your helpful nature', 'Your wonderful passion', 'Your endless patience', 'Your stunning mind', 
  'Your warm presence'
];
reasons25.forEach((r, i) => {
  const div = document.createElement('div');
  div.className = 'reason-25';
  div.textContent = `${i + 1}. ${r}`;
  div.style.animationDelay = `${i * 0.04}s`;
  reasons25Grid.appendChild(div);
});

// 18. Polaroid Wall initialization with real files. Remove the missing file.
const polaroidWall = document.getElementById('polaroidWall');
const realPolaroids = [
  'Screenshot_20260723-014804.png',
  'file_0000000004c071fabea6c69ec86982a6.png',
  'FB_IMG_1777340857582.jpg',
  'FB_IMG_1777340773669~2.jpg',
  'FB_IMG_1777340848675 (1).jpg',
  '1767539285639.jpg',
  '1777352808638.png',
  '1776166865973.png',
  '1784736529383.png',
  'FB_IMG_1670835935529.jpg',
  'FB_IMG_1670835954863.jpg',
  'FB_IMG_1784735929225.jpg'
];
realPolaroids.forEach((src, i) => {
  const p = document.createElement('div');
  p.className = 'polaroid';
  p.style.setProperty('--rot', `${(Math.random() - 0.5) * 8}deg`);
  p.innerHTML = `<img src="${src}" alt="Polaroid ${i+1}" onerror="placeholderImg(this,'${src}')">`;
  p.onclick = () => openLightbox(src, false);
  polaroidWall.appendChild(p);
});

// 19. Guess the memory Game
const guessMemoriesGrid = document.getElementById('guessMemoriesGrid');
const guessData = [
  { src: 'IMG-20250303-WA0011.jpg', clue: 'Double tap to reveal where this gorgeous smile was shining.' },
  { src: '20250509_1841_Black and White Portrait_remix_01jtths6aseer922b7nyv6jb4b (1).PNG', clue: 'This gorgeous portrait is waiting to be uncovered.' },
  { src: 'IMG-20260123-WA0000.jpg', clue: 'Uncover the story of this serene winter moment.' },
  { src: 'Snapchat-1983143753.jpg', clue: 'Where did this cozy laughter take place?' }
];
guessData.forEach(item => {
  const card = document.createElement('div');
  card.className = 'guess-card';
  card.innerHTML = `
    <div class="guess-img-wrap">
      <img src="${item.src}" alt="Mystery Image" onerror="placeholderImg(this,'${item.src}')">
      <div class="guess-overlay">?</div>
    </div>
    <div class="guess-clue">${item.clue}</div>
  `;
  card.addEventListener('click', () => {
    if (!card.classList.contains('revealed')) {
      card.classList.add('revealed');
      playChime([392.00, 523.25, 659.25]); // Beautiful tri-note chime
      triggerConfetti(8);
    }
  });
  guessMemoriesGrid.appendChild(card);
});

// 20. Scratch-to-reveal canvas logic
const scratchCanvas = document.getElementById('scratchCanvas');
if (scratchCanvas) {
  const ctx = scratchCanvas.getContext('2d');
  let isDrawing = false;
  let hasCleared = false;

  function initScratch() {
    scratchCanvas.width = scratchCanvas.parentElement.offsetWidth;
    scratchCanvas.height = scratchCanvas.parentElement.offsetHeight;
    
    // Draw pretty scratch card surface
    const gradient = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    gradient.addColorStop(0, '#e8a7bb');
    gradient.addColorStop(0.5, '#b79fd6');
    gradient.addColorStop(1, '#f0cf8e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    
    ctx.font = "italic 1.1rem 'Cormorant Garamond', serif";
    ctx.fillStyle = "#1c0f1a";
    ctx.textAlign = "center";
    ctx.fillText("Scratch off to reveal a special note ❤", scratchCanvas.width / 2, scratchCanvas.height / 2 + 5);
  }

  // Handle resizing / initializing
  setTimeout(initScratch, 500);
  window.addEventListener('resize', initScratch);

  function scratch(x, y) {
    if (hasCleared) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    
    // Check transparency ratio occasionally
    if (Math.random() < 0.1) {
      const imgData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
      let trans = 0;
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === 0) trans++;
      }
      const pct = (trans / (imgData.data.length / 4)) * 100;
      if (pct > 45) {
        hasCleared = true;
        scratchCanvas.style.opacity = '0';
        playChime();
        triggerConfetti(20);
        setTimeout(() => scratchCanvas.remove(), 500);
      }
    }
  }

  // Mouse & Touch events
  function getCoords(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  scratchCanvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    const { x, y } = getCoords(e);
    scratch(x, y);
  });
  
  scratchCanvas.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(e);
    scratch(x, y);
  });
  
  document.addEventListener('pointerup', () => {
    isDrawing = false;
  });
}

// 21. Jigsaw Puzzle Logic
const puzzlePiecesPool = document.getElementById('puzzlePiecesPool');
const puzzleBoard = document.getElementById('puzzleBoard');
let activeDrag = null;

function initPuzzle() {
  if (!puzzlePiecesPool || !puzzleBoard) return;
  puzzlePiecesPool.innerHTML = '';
  // Clean board slots
  puzzleBoard.querySelectorAll('.puzzle-slot').forEach(slot => {
    slot.innerHTML = '';
  });
  
  const puzzleImg = 'IMG_20260613_132112633.jpg'; // Real target photo
  const pieceIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  
  // Scramble pieces
  const scrambled = [...pieceIndexes].sort(() => Math.random() - 0.5);
  
  scrambled.forEach(idx => {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.dataset.correctIdx = idx;
    piece.style.backgroundImage = `url('${puzzleImg}')`;
    
    // Background offsets for 3x3 grid on 300px image
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
    
    // Enable drag coordinates
    piece.addEventListener('pointerdown', onDragStart);
    puzzlePiecesPool.appendChild(piece);
  });
}

function onDragStart(e) {
  e.preventDefault();
  activeDrag = e.target;
  activeDrag.style.position = 'absolute';
  activeDrag.style.zIndex = '1000';
  document.addEventListener('pointermove', onDragging);
  document.addEventListener('pointerup', onDragEnd);
}

function onDragging(e) {
  if (!activeDrag) return;
  const boardRect = puzzleBoard.getBoundingClientRect();
  // Center piece to pointer coordinates
  activeDrag.style.left = `${e.clientX - boardRect.left - 50}px`;
  activeDrag.style.top = `${e.clientY - boardRect.top - 50}px`;
}

function onDragEnd(e) {
  if (!activeDrag) return;
  document.removeEventListener('pointermove', onDragging);
  document.removeEventListener('pointerup', onDragEnd);
  
  const boardRect = puzzleBoard.getBoundingClientRect();
  const x = e.clientX - boardRect.left;
  const y = e.clientY - boardRect.top;
  
  let snapped = false;
  
  if (x >= 0 && x <= 300 && y >= 0 && y <= 300) {
    const col = Math.floor(x / 100);
    const row = Math.floor(y / 100);
    const targetIdx = row * 3 + col;
    
    if (parseInt(activeDrag.dataset.correctIdx) === targetIdx) {
      const slot = puzzleBoard.children[targetIdx];
      if (slot.children.length === 0) {
        // Correct snap!
        slot.appendChild(activeDrag);
        activeDrag.style.position = 'relative';
        activeDrag.style.left = '0px';
        activeDrag.style.top = '0px';
        activeDrag.style.cursor = 'default';
        activeDrag.removeEventListener('pointerdown', onDragStart);
        playWhoosh();
        snapped = true;
      }
    }
  }
  
  if (!snapped) {
    // Return piece back to pool
    puzzlePiecesPool.appendChild(activeDrag);
    activeDrag.style.position = 'relative';
    activeDrag.style.left = '';
    activeDrag.style.top = '';
  }
  
  activeDrag = null;
  checkPuzzleComplete();
}

function checkPuzzleComplete() {
  let completed = true;
  puzzleBoard.querySelectorAll('.puzzle-slot').forEach((slot, idx) => {
    if (slot.children.length === 0 || parseInt(slot.children[0].dataset.correctIdx) !== idx) {
      completed = false;
    }
  });
  if (completed) {
    playChime();
    triggerConfetti(28);
    const successMsg = document.createElement('div');
    successMsg.style.cssText = "color:#e8a7bb; font-family:'Playfair Display',serif; font-size:1.2rem; margin-top:20px; font-weight:bold; text-align:center;";
    successMsg.textContent = "🎉 You put the memory back together! Spectacular work! 🎉";
    puzzleBoard.parentElement.appendChild(successMsg);
  }
}

document.getElementById('resetPuzzleBtn').addEventListener('click', initPuzzle);
setTimeout(initPuzzle, 600);

// 22. Digital Coupon Book actions
document.querySelectorAll('.coupon-card').forEach(card => {
  card.addEventListener('click', () => {
    if(!card.classList.contains('flipped')) {
      card.classList.add('flipped');
      playChime([523.25, 659.25, 783.99]); 
      triggerConfetti(8);
    }
  });
});

// 23. Time Capsule padlock logic
const padlock = document.getElementById('capsulePadlock');
const lockedView = document.getElementById('capsuleLockedView');
const unlockedContent = document.getElementById('capsuleUnlockedContent');

function unlockCapsule() {
  lockedView.style.display = 'none';
  unlockedContent.style.display = 'block';
  playChime();
  triggerConfetti(15);
}

if (padlock) {
  padlock.addEventListener('click', () => {
    padlock.animate([
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-12deg)' },
      { transform: 'rotate(12deg)' },
      { transform: 'rotate(0deg)' }
    ], { duration: 300 });
    
    // Check if birthday reached or bypass unlocked
    const birthdayDate = new Date('2026-08-24T00:00:00');
    if (new Date() >= birthdayDate) {
      unlockCapsule();
    } else {
      playWhoosh();
    }
  });
}

const bypassBtn = document.getElementById('capsuleBypassBtn');
if (bypassBtn) {
  bypassBtn.addEventListener('click', () => {
    const input = document.getElementById('capsuleCodeInput').value.trim().toUpperCase();
    if (input === 'SAMIKSHYA' || input === 'LOVE' || input === 'HAPPY') {
      unlockCapsule();
    } else {
      bypassBtn.textContent = '❌ Wrong Code';
      setTimeout(() => bypassBtn.textContent = 'Bypass', 1200);
    }
  });
}

// 24. Stars Map constellation drawing
const mapSvg = document.getElementById('starMapSvg');
if (mapSvg) {
  // Clear placeholders
  mapSvg.innerHTML = '';
  // Generate random starry dots
  for (let i = 0; i < 90; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', Math.random() * 400);
    circle.setAttribute('cy', Math.random() * 400);
    circle.setAttribute('r', Math.random() * 1.5 + 0.4);
    circle.setAttribute('fill', '#fff');
    circle.setAttribute('opacity', Math.random());
    mapSvg.appendChild(circle);
  }
  
  // Constellation coordinate points
  const points = {
    A: {x: 100, y: 150, n: 'Sirius'},
    B: {x: 140, y: 130, n: 'Polaris'},
    C: {x: 200, y: 110, n: 'Betelgeuse'},
    D: {x: 260, y: 130, n: 'Capella'},
    E: {x: 300, y: 180, n: 'Rigel'},
    F: {x: 240, y: 220, n: 'Vega'},
    G: {x: 160, y: 240, n: 'Spica'},
    H: {x: 120, y: 200, n: 'Altair'}
  };
  
  // Connections
  const links = [['A','B'], ['B','C'], ['C','D'], ['D','E'], ['E','F'], ['F','G'], ['G','H'], ['H','A'], ['C','G'], ['B','F']];
  
  links.forEach(([from, to]) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', points[from].x);
    line.setAttribute('y1', points[from].y);
    line.setAttribute('x2', points[to].x);
    line.setAttribute('y2', points[to].y);
    line.setAttribute('stroke', 'rgba(240, 207, 142, 0.45)');
    line.setAttribute('stroke-width', '1');
    mapSvg.appendChild(line);
  });
  
  // Render main labels
  Object.keys(points).forEach(k => {
    const pt = points[k];
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pt.x);
    circle.setAttribute('cy', pt.y);
    circle.setAttribute('r', 3);
    circle.setAttribute('fill', '#f0cf8e');
    circle.setAttribute('stroke', '#fff');
    circle.setAttribute('stroke-width', '0.5');
    mapSvg.appendChild(circle);

    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', pt.x + 6);
    txt.setAttribute('y', pt.y + 4);
    txt.setAttribute('fill', 'rgba(248, 236, 223, 0.8)');
    txt.setAttribute('font-size', '8');
    txt.setAttribute('font-family', 'sans-serif');
    txt.textContent = pt.n;
    mapSvg.appendChild(txt);
  });
}

// 25. Trivia quiz logic
const quizQuestions = [
  { q: "Where does her beautiful name 'Samikshya' originate from?", a: ["Sanskrit (meaning analysis/gaze)", "Nepali (meaning star)", "Hindi (meaning blessing)", "Persian (meaning flower)"], c: 0 },
  { q: "Which destination separates the two of you in kilometers?", a: ["India to Maldives", "Nepal to Maldives", "Nepal to India", "Maldives to Sri Lanka"], c: 1 },
  { q: "What birthday is she celebrating this year?", a: ["21st Birthday", "23rd Birthday", "25th Birthday", "26th Birthday"], c: 2 },
  { q: "What is the true distance between two hearts in love?", a: ["Exactly 3,400 KM", "Zero distance", "Determined by flights", "Depends on timezone"], c: 1 }
];

let quizIdx = 0;
let quizScore = 0;

function loadQuestion() {
  const questEl = document.getElementById('quizQuestionText');
  const optsEl = document.getElementById('quizOptions');
  const tracks = document.getElementById('quizTracks');
  
  if(!questEl || !optsEl) return;
  optsEl.innerHTML = '';
  
  // Render tracks progress
  tracks.innerHTML = '';
  quizQuestions.forEach((_, idx) => {
    const track = document.createElement('div');
    track.className = 'quiz-track';
    const fill = document.createElement('div');
    fill.className = 'quiz-track-fill';
    if(idx < quizIdx) fill.style.width = '100%';
    else if(idx === quizIdx) fill.style.width = '50%';
    track.appendChild(fill);
    tracks.appendChild(track);
  });

  if (quizIdx >= quizQuestions.length) {
    showQuizScore();
    return;
  }

  const qData = quizQuestions[quizIdx];
  questEl.textContent = qData.q;

  qData.a.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => submitAnswer(idx, btn));
    optsEl.appendChild(btn);
  });
}

function submitAnswer(idx, btn) {
  const correctIdx = quizQuestions[quizIdx].c;
  const options = document.querySelectorAll('.quiz-option');
  
  // Disable all
  options.forEach(opt => opt.style.pointerEvents = 'none');
  
  if (idx === correctIdx) {
    btn.classList.add('correct');
    quizScore++;
    playChime([523.25, 659.25, 783.99, 1046.50]); // Success chime
    triggerConfetti(6);
  } else {
    btn.classList.add('wrong');
    options[correctIdx].classList.add('correct');
    playWhoosh(); // Fail woosh
  }

  setTimeout(() => {
    quizIdx++;
    loadQuestion();
  }, 1600);
}

function showQuizScore() {
  const container = document.getElementById('quizContainer');
  let pct = Math.round((quizScore / quizQuestions.length) * 100);
  
  container.innerHTML = `
    <div class="quiz-score-view">
      <div class="quiz-score-badge">💖</div>
      <div class="quiz-score-title">Your Score: ${pct}%</div>
      <div class="quiz-score-desc">
        ${pct === 100 
          ? "Spectacular! You know her heart perfectly. True friendship is untouched by distance! ❤" 
          : "Wonderfully done! Celebrating every detail of her amazing presence."}
      </div>
      <button class="btn btn-primary" onclick="window.resetQuiz()">🔄 Take Quiz Again</button>
    </div>
  `;
  triggerConfetti(15);
}

window.resetQuiz = function() {
  quizIdx = 0;
  quizScore = 0;
  const container = document.getElementById('quizContainer');
  container.innerHTML = `
    <div class="quiz-progress-tracks" id="quizTracks"></div>
    <div class="quiz-question-box">
      <div class="quiz-question-text" id="quizQuestionText"></div>
      <div class="quiz-options" id="quizOptions"></div>
    </div>
  `;
  loadQuestion();
};

setTimeout(loadQuestion, 500);

// 26. Typist birthday letter actions
const letterFull = `Happy 25th birthday, Samikshya.\n\nWatching you grow through these pictures reminds me how beautiful your journey has been. I wish I could celebrate this day beside you. Until then, this website carries every hug I couldn't give, every smile I wanted to see, and every "Happy Birthday" I wanted to whisper in person.\n\nNo matter where life takes you, I'll always wish for your happiness first. May this year bring every dream you've worked so hard for.\n\nHappy birthday.\nI miss you.\nI appreciate you.\nI'm proud of you. ❤`;
let typed = false;
function typeLetter() {
  if (typed) return; typed = true;
  const el = document.getElementById('letterText');
  el.innerHTML = '<span class="cursor">&nbsp;</span>'; 
  let i = 0;
  function step() {
    if (i < letterFull.length) {
      const char = letterFull[i++];
      el.innerHTML = el.innerHTML.replace('<span class="cursor">&nbsp;</span>', '') + (char === '\n' ? '<br>' : char) + '<span class="cursor">&nbsp;</span>';
      setTimeout(step, 45 + Math.random()*25);
    } else {
      const cursor = el.querySelector('.cursor');
      if(cursor) cursor.remove();
    }
  }
  step();
}

const letterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { typeLetter(); } });
}, { threshold: 0.18 });
const letterSec = document.querySelector('#letter');
if(letterSec) letterObserver.observe(letterSec);

// Handle font toggle
const fontBtn = document.getElementById('toggleLetterFont');
const letterContainer = document.getElementById('letterText');
if (fontBtn && letterContainer) {
  fontBtn.addEventListener('click', () => {
    if (letterContainer.classList.contains('font-handwritten')) {
      letterContainer.classList.remove('font-handwritten');
      letterContainer.classList.add('font-normal-letter');
      fontBtn.textContent = '✍ Choose Cursive';
    } else {
      letterContainer.classList.remove('font-normal-letter');
      letterContainer.classList.add('font-handwritten');
      fontBtn.textContent = '🔤 Choose Normal';
    }
    playChime([783.99]);
  });
}

// 27. Envelope clicking
const letterEnvelopeEl = document.getElementById('letterEnvelope');
if (letterEnvelopeEl) {
  letterEnvelopeEl.addEventListener('click', function(){
    const content = document.getElementById('letterContent');
    if (content) {
      content.classList.toggle('open');
      const isOpened = content.classList.contains('open');
      const seal = this.querySelector('.seal');
      if (seal) seal.textContent = isOpened ? '💌' : '✉️';
      if (isOpened) {
        playChime([523.25, 659.25, 783.99]);
        triggerConfetti(8);
      } else {
        playWhoosh();
      }
    }
  });
}

// 28. Memory Box clicking
const memoryBoxEl = document.getElementById('memoryBox');
if (memoryBoxEl) {
  memoryBoxEl.addEventListener('click', function(e){
    // If clicking target is image, open in lightbox instead of closing box
    if(e.target.tagName === 'IMG') {
      e.stopPropagation();
      openLightbox(e.target.src, false);
      return;
    }
    const contents = document.getElementById('boxContents');
    contents.classList.toggle('open');
    const isOpen = contents.classList.contains('open');
    if (isOpen) {
      playChime([392.00, 523.25, 659.25]);
      triggerConfetti(10);
      if (contents.children.length === 0) {
        const imgs = repeatFiles(photoFiles, 8);
        imgs.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.alt = 'Memory';
          img.loading = 'lazy';
          img.onerror = function(){ placeholderImg(this, src); };
          contents.appendChild(img);
        });
      }
    } else {
      playWhoosh();
    }
  });
}

// 29. Surprise button actions
const finaleBtnEl = document.getElementById('finaleBtn');
if (finaleBtnEl) {
  finaleBtnEl.addEventListener('click', function(){
    playChime([523.25, 659.25, 783.99, 1046.50]);
    triggerConfetti(45);
    
    // Balloon / Heart visual impact
    const big = document.createElement('div');
    big.textContent = '❤';
    big.style.position = 'fixed';
    big.style.top = '50%';
    big.style.left = '50%';
    big.style.transform = 'translate(-50%, -50%) scale(0)';
    big.style.fontSize = '8rem';
    big.style.zIndex = '99999';
    big.style.pointerEvents = 'none';
    big.style.textShadow = '0 0 25px rgba(232,167,187,0.8)';
    big.style.transition = 'all 1.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
    document.body.appendChild(big);
    
    requestAnimationFrame(() => {
      big.style.transform = 'translate(-50%, -50%) scale(1.4)';
      big.style.opacity = '1';
    });
    
    setTimeout(() => {
      big.style.transform = 'translate(-50%, -50%) scale(2.2)';
      big.style.opacity = '0';
      setTimeout(() => big.remove(), 800);
    }, 1800);

    // Pops thank you modal
    const thank = document.createElement('div');
    thank.className = 'thank-you-popup';
    thank.textContent = 'Happy 25th Birthday Samikshya! ❤';
    document.body.appendChild(thank);
    requestAnimationFrame(() => { thank.classList.add('show'); });
    setTimeout(() => {
      thank.classList.remove('show');
      setTimeout(() => thank.remove(), 550);
    }, 3200);
  });
}

// 30. Background Audio
const beginBtn = document.getElementById('beginBtn');
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    const fill = document.getElementById('heartFill');
    if(fill) fill.style.strokeDashoffset = '0';
  });
  if (beginBtn) setTimeout(() => beginBtn.classList.add('show'), 2200);
});

const bgMusic = document.getElementById('bgMusic');
let musicPlaying = false;
const musicToggle = document.getElementById('musicToggle');

function updateMusicIcon() {
  if(!musicToggle) return;
  musicToggle.textContent = musicPlaying ? '🔊' : '🔇';
  musicToggle.style.opacity = musicPlaying ? '1' : '0.65';
}

if (beginBtn) {
  beginBtn.addEventListener('click', () => {
    if (loader) loader.classList.add('hidden');
    // Start AudioContext trigger
    getAudioContext();
    if (bgMusic) {
      bgMusic.volume = 0.55;
      bgMusic.play().catch(() => {});
    }
    musicPlaying = true;
    updateMusicIcon();
    playChime();
  });
}

if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    musicPlaying = !musicPlaying;
    if (musicPlaying && bgMusic) bgMusic.play().catch(() => {});
    else if (bgMusic) bgMusic.pause();
    updateMusicIcon();
    playChime([musicPlaying ? 783.99 : 523.25]);
  });
}

// 31. Twinkle Countdown
function nextBirthday() {
  const now = new Date();
  let y = now.getFullYear();
  let b = new Date(y, 7, 24); // Aug 24
  if (b < now) b = new Date(y + 1, 7, 24);
  return b;
}

function renderCountdown() {
  const el = document.getElementById('countdown');
  if(!el) return;
  const diff = nextBirthday() - new Date();
  if (diff <= 0) { el.innerHTML = ''; return; }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  el.innerHTML = `
    <div class="countdown-box"><b>${String(d).padStart(2,'0')}</b><span>Days</span></div>
    <div class="countdown-box"><b>${String(h).padStart(2,'0')}</b><span>Hours</span></div>
    <div class="countdown-box"><b>${String(m).padStart(2,'0')}</b><span>Minutes</span></div>
    <div class="countdown-box"><b>${String(s).padStart(2,'0')}</b><span>Seconds</span></div>
  `;
}
renderCountdown();
setInterval(renderCountdown, 1000);

// 32. Twinkle Floaties (hearts & sparkles)
const ambient = document.getElementById('ambient');
const symbols = [ {cls:'heart', char:'❤'}, {cls:'heart', char:'♥'}, {cls:'sparkle', char:'✦'}, {cls:'sparkle', char:'✧'} ];

function spawnFloaty() {
  if(!ambient) return;
  const isPetal = Math.random() < 0.25;
  const el = document.createElement('div');
  if (isPetal) {
    el.className = 'floaty petal';
  } else {
    const symbol = symbols[Math.floor(Math.random()*symbols.length)];
    el.className = `floaty ${symbol.cls}`;
    el.textContent = symbol.char;
  }
  const startX = Math.random() * 100;
  el.style.left = `${startX}vw`;
  ambient.appendChild(el);
  
  const duration = 9 + Math.random() * 7;
  const drift = (Math.random() - 0.5) * 160;
  const rotate = (Math.random() - 0.5) * 360;
  
  el.animate([
    { transform: 'translateX(0px) translateY(0px) rotate(0deg)', opacity: 0 },
    { transform: `translateX(${drift}px) translateY(-130vh) rotate(${rotate}deg)`, opacity: 1 }
  ], { duration: duration * 1000, easing:'ease-out', fill:'forwards' });
  
  setTimeout(() => el.remove(), duration * 1000 + 200);
}
setInterval(spawnFloaty, 750);
