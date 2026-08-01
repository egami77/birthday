// enhancements.js — Premium Feature Additions (100-point upgrade)

/* ══════════════════════════════════════════
   1. CUSTOM HEART CURSOR
══════════════════════════════════════════ */
const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
document.body.appendChild(cursor);
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

/* ══════════════════════════════════════════
   2. CURTAIN REVEAL + PRELOADER %
══════════════════════════════════════════ */
const curtainL = document.createElement('div'); curtainL.id = 'curtain-left';
const curtainR = document.createElement('div'); curtainR.id = 'curtain-right';
document.body.prepend(curtainR);
document.body.prepend(curtainL);

// Preloader percentage
const pctEl = document.createElement('div');
pctEl.id = 'loaderPercent';
pctEl.textContent = 'Loading our memories... 0%';
const loaderEl = document.getElementById('loader');
if (loaderEl) {
  loaderEl.appendChild(pctEl);
  let pct = 0;
  const pctTimer = setInterval(() => {
    pct = Math.min(pct + Math.floor(Math.random() * 8 + 3), 99);
    pctEl.textContent = `Loading our memories... ${pct}%`;
    if (pct >= 99) clearInterval(pctTimer);
  }, 160);
}

// Begin btn opens curtains
const beginBtnEnh = document.getElementById('beginBtn');
if (beginBtnEnh) {
  beginBtnEnh.addEventListener('click', () => {
    if (pctEl) { pctEl.textContent = 'Loading our memories... 100%'; }
    setTimeout(() => {
      curtainL.classList.add('open');
      curtainR.classList.add('open');
    }, 200);
    // Film-open: body fades in
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 1.2s ease';
      document.body.style.opacity = '1';
    }, 400);
    // First-scroll chime (one-time)
    let firstScroll = false;
    window.addEventListener('scroll', function onFirstScroll() {
      if (firstScroll) return;
      firstScroll = true;
      if (window.playChime) playChime([783.99, 1046.50]);
      document.body.animate([{ filter: 'brightness(2)' }, { filter: 'brightness(1)' }], { duration: 350 });
      window.removeEventListener('scroll', onFirstScroll);
    }, { passive: true });
  }, { once: true });
}

/* ══════════════════════════════════════════
   3. AURORA BACKGROUND
══════════════════════════════════════════ */
const auroraDiv = document.createElement('div');
auroraDiv.id = 'aurora-bg';
for (let i = 0; i < 3; i++) {
  const w = document.createElement('div'); w.className = 'aurora-wave';
  auroraDiv.appendChild(w);
}
document.body.prepend(auroraDiv);

/* ══════════════════════════════════════════
   4. FOG LAYER
══════════════════════════════════════════ */
const fogDiv = document.createElement('div');
fogDiv.className = 'fog-layer';
document.body.prepend(fogDiv);

/* ══════════════════════════════════════════
   5. SCROLL-LINKED THEME GRADIENT + DEPTH FOG
══════════════════════════════════════════ */
const themes = ['theme-dusk', 'theme-gold', 'theme-rose', 'theme-night', 'theme-dawn'];
let lastTheme = '';
window.addEventListener('scroll', () => {
  const prog = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const idx = Math.min(Math.floor(prog * themes.length), themes.length - 1);
  const t = themes[idx];
  if (t !== lastTheme) {
    themes.forEach(c => document.body.classList.remove(c));
    document.body.classList.add(t);
    lastTheme = t;
  }
  // depth fog opacity increases with scroll
  fogDiv.style.opacity = String(0.3 + prog * 0.7);
}, { passive: true });

/* ══════════════════════════════════════════
   6. SECTION SCALE IN/OUT OBSERVER
══════════════════════════════════════════ */
const scaleObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.remove('leaving'); }
    else { if (e.target.classList.contains('active')) e.target.classList.add('leaving'); }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.reveal-el').forEach(el => scaleObs.observe(el));

/* ══════════════════════════════════════════
   7. FLOATING DUST PARTICLES
══════════════════════════════════════════ */
function spawnDust() {
  const d = document.createElement('div');
  d.className = 'dust-particle';
  const size = 1.5 + Math.random() * 3;
  d.style.width = size + 'px';
  d.style.height = size + 'px';
  d.style.left = Math.random() * 100 + 'vw';
  d.style.bottom = '-10px';
  d.style.setProperty('--drift', (Math.random() - 0.5) * 80 + 'px');
  const dur = 12 + Math.random() * 10;
  d.style.animationDuration = dur + 's';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), dur * 1000);
}
setInterval(spawnDust, 800);

/* ══════════════════════════════════════════
   8. FALLING PETALS
══════════════════════════════════════════ */
function spawnPetal() {
  const p = document.createElement('div');
  p.className = 'falling-petal';
  p.textContent = ['🌸', '🌺', '🌼', '🌷'][Math.floor(Math.random() * 4)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.top = '-5vh';
  p.style.fontSize = (0.7 + Math.random() * 0.8) + 'rem';
  p.style.setProperty('--rot', (Math.random() - 0.5) * 720 + 'deg');
  p.style.setProperty('--drift', (Math.random() - 0.5) * 120 + 'px');
  const dur = 7 + Math.random() * 6;
  p.style.animationDuration = dur + 's';
  document.body.appendChild(p);
  setTimeout(() => p.remove(), dur * 1000);
}
setInterval(spawnPetal, 1400);

/* ══════════════════════════════════════════
   9. FIREFLY EFFECT (visible in dark sections)
══════════════════════════════════════════ */
function spawnFirefly() {
  const f = document.createElement('div');
  f.className = 'firefly';
  f.style.left = 10 + Math.random() * 80 + 'vw';
  f.style.top = 20 + Math.random() * 70 + 'vh';
  f.style.setProperty('--dx', (Math.random() - 0.5) * 80 + 'px');
  f.style.setProperty('--dy', (Math.random() - 0.5) * 60 + 'px');
  const dur = 4 + Math.random() * 5;
  f.style.animationDuration = dur + 's';
  f.style.animationDelay = Math.random() * 3 + 's';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), (dur + 3) * 1000);
}
for (let i = 0; i < 12; i++) setTimeout(spawnFirefly, i * 400);
setInterval(spawnFirefly, 2200);

/* ══════════════════════════════════════════
   10. RAIN ON GLASS (distance section)
══════════════════════════════════════════ */
const distanceSec = document.getElementById('distance');
if (distanceSec) {
  for (let i = 0; i < 30; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.height = 40 + Math.random() * 60 + 'px';
    drop.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
    drop.style.animationDelay = (Math.random() * 2) + 's';
    drop.style.opacity = 0;
    distanceSec.appendChild(drop);
  }
}

/* ══════════════════════════════════════════
   11. GOLD FOIL DIVIDERS between sections
══════════════════════════════════════════ */
document.querySelectorAll('.section').forEach(sec => {
  const foil = document.createElement('div');
  foil.className = 'foil-divider';
  sec.prepend(foil);
  const flourish = document.createElement('div');
  flourish.className = 'section-flourish';
  flourish.textContent = '✦  ❤  ✦';
  sec.prepend(flourish);
});

/* ══════════════════════════════════════════
   12. CANDLELIGHT MODE TOGGLE
══════════════════════════════════════════ */
const candleToggle = document.createElement('button');
candleToggle.id = 'candle-toggle';
candleToggle.title = 'Toggle Candlelight Mode';
candleToggle.textContent = '🕯️';
document.body.appendChild(candleToggle);
let candleMode = false;
candleToggle.addEventListener('click', () => {
  candleMode = !candleMode;
  document.body.classList.toggle('candle-mode', candleMode);
  candleToggle.textContent = candleMode ? '💡' : '🕯️';
  if (window.playChime) playChime([candleMode ? 523.25 : 659.25]);
});

/* ══════════════════════════════════════════
   13. JUMP NAV (sticky)
══════════════════════════════════════════ */
const jumpNav = document.createElement('div');
jumpNav.id = 'jump-nav';
jumpNav.innerHTML = `
  <button id="jump-to-finale" onclick="document.getElementById('finale').scrollIntoView({behavior:'smooth'})">💌 Jump to Finale</button>
`;
document.body.appendChild(jumpNav);

/* ══════════════════════════════════════════
   14. GRADIENT TEXT on section titles
══════════════════════════════════════════ */
document.querySelectorAll('.section-title').forEach(t => {
  t.classList.add('gradient-text-animate');
});

/* ══════════════════════════════════════════
   15. UNDERLINE DRAW on emotional phrases
══════════════════════════════════════════ */
const taglineEl = document.querySelector('.tagline');
if (taglineEl) {
  taglineEl.innerHTML = taglineEl.innerHTML.replace(
    'even thousands of miles',
    '<span class="underline-draw">even thousands of miles</span>'
  );
}
const underlineObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('drawn');
  });
}, { threshold: 0.5 });
document.querySelectorAll('.underline-draw').forEach(el => underlineObs.observe(el));

/* ══════════════════════════════════════════
   16. STARFIELD SCROLL SPEED TWINKLE
══════════════════════════════════════════ */
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const speed = Math.abs(window.scrollY - lastScrollY);
  lastScrollY = window.scrollY;
  const canvas = document.querySelector('#hero .stars');
  if (canvas) {
    canvas.classList.toggle('stars-fast', speed > 30);
  }
}, { passive: true });

/* ══════════════════════════════════════════
   17. HOVER SOUND on music toggle & key buttons
══════════════════════════════════════════ */
document.querySelectorAll('.btn-primary, .btn-gold, #musicToggle').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (window.playChime) playChime([783.99]);
  });
});

/* ══════════════════════════════════════════
   18. DOUBLE TAP EASTER EGG on photos
══════════════════════════════════════════ */
let lastTap = 0;
document.addEventListener('touchend', e => {
  const now = Date.now();
  if (now - lastTap < 350) {
    const img = e.target.closest('img, .polaroid, figure');
    if (img) {
      if (window.triggerConfetti) triggerConfetti(12);
      if (window.playChime) playChime([523.25, 659.25, 783.99]);
      // Burst hearts at touch point
      const t = e.changedTouches[0];
      for (let i = 0; i < 8; i++) {
        const h = document.createElement('div');
        h.style.cssText = 'position:fixed;pointer-events:none;z-index:99999;font-size:1.4rem;transition:all 0.8s ease-out';
        h.textContent = '❤';
        h.style.left = t.clientX + 'px';
        h.style.top = t.clientY + 'px';
        document.body.appendChild(h);
        requestAnimationFrame(() => {
          const ang = (i / 8) * Math.PI * 2;
          h.style.transform = `translate(${Math.cos(ang) * 60}px, ${Math.sin(ang) * 60}px) scale(0)`;
          h.style.opacity = '0';
        });
        setTimeout(() => h.remove(), 850);
      }
    }
  }
  lastTap = now;
});

/* ══════════════════════════════════════════
   19. LONG-PRESS TO UNLOCK coupons on mobile
══════════════════════════════════════════ */
document.querySelectorAll('.coupon-card').forEach(card => {
  let pressTimer = null;
  card.addEventListener('touchstart', () => {
    pressTimer = setTimeout(() => {
      card.classList.add('flipped');
      if (window.playChime) playChime([523.25, 659.25, 783.99]);
      if (window.triggerConfetti) triggerConfetti(8);
    }, 600);
  }, { passive: true });
  card.addEventListener('touchend', () => clearTimeout(pressTimer));
  card.addEventListener('touchmove', () => clearTimeout(pressTimer));
});

/* ══════════════════════════════════════════
   20. SHAKE TO REVEAL on mobile
══════════════════════════════════════════ */
let shakeCount = 0, lastShakeTime = 0;
if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', e => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    const now = Date.now();
    if (total > 25 && now - lastShakeTime > 500) {
      lastShakeTime = now;
      shakeCount++;
      if (shakeCount >= 2) {
        shakeCount = 0;
        showShakeMessage();
      }
    }
  });
}
function showShakeMessage() {
  const msgs = [
    '🌸 You are absolutely wonderful, Samikshya!',
    '💖 Every day you exist, the world gets brighter.',
    '✨ You were made for beautiful things.',
    '🌟 Your laugh is one of my favorite sounds.',
    '❤ Distance means nothing when someone means everything.'
  ];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  const pop = document.createElement('div');
  pop.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);z-index:99999;background:linear-gradient(135deg,#f0cf8e,#e8a7bb);color:#1c0f1a;padding:1.5rem 2rem;border-radius:20px;font-family:"Playfair Display",serif;font-size:1.1rem;max-width:90vw;text-align:center;box-shadow:0 30px 60px rgba(0,0,0,.5);transition:transform 0.4s cubic-bezier(0.22,1,0.36,1),opacity 0.4s ease';
  pop.textContent = msg;
  document.body.appendChild(pop);
  requestAnimationFrame(() => { pop.style.transform = 'translate(-50%,-50%) scale(1)'; });
  if (window.playChime) playChime();
  if (window.triggerConfetti) triggerConfetti(15);
  setTimeout(() => { pop.style.opacity = '0'; pop.style.transform = 'translate(-50%,-50%) scale(0.8)'; setTimeout(() => pop.remove(), 450); }, 3000);
}

/* ══════════════════════════════════════════
   21. SPIN-THE-WHEEL COMPLIMENT
══════════════════════════════════════════ */
const compliments = [
  'You have the most radiant smile in any room 🌟',
  'Your kindness literally changes lives 💖',
  'You are braver than you believe 🦋',
  'Your laugh is pure magic ✨',
  'The world is better because you\'re in it 🌸',
  'You make even the hardest days feel lighter 💛',
  'You are everything beautiful in one person 🌺',
  'Your strength is quiet but unforgettable 💫',
  'You inspire people without even trying 🌈',
  'Being your friend is one of my greatest gifts ❤'
];
const spinSec = document.getElementById('reasons');
if (spinSec) {
  const wrap = document.createElement('div');
  wrap.id = 'spin-wheel-wrap';
  wrap.innerHTML = `
    <button class="btn btn-secondary" id="spinBtn">🎡 Random Compliment for Samikshya</button>
    <div id="spin-result"></div>
  `;
  spinSec.querySelector('.section-inner').appendChild(wrap);
  document.getElementById('spinBtn').addEventListener('click', () => {
    const result = document.getElementById('spin-result');
    result.style.opacity = '0';
    setTimeout(() => {
      result.textContent = compliments[Math.floor(Math.random() * compliments.length)];
      result.style.opacity = '1';
      if (window.playChime) playChime([523.25, 659.25, 783.99]);
      if (window.triggerConfetti) triggerConfetti(8);
    }, 300);
    result.style.transition = 'opacity 0.3s';
  });
}

/* ══════════════════════════════════════════
   22. KONAMI CODE EASTER EGG
══════════════════════════════════════════ */
const konamiSeq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIdx = 0;
document.addEventListener('keydown', e => {
  if (e.key === konamiSeq[konamiIdx]) { konamiIdx++; } else { konamiIdx = 0; }
  if (konamiIdx === konamiSeq.length) {
    konamiIdx = 0;
    showKonamiEgg();
  }
});
function showKonamiEgg() {
  let ov = document.getElementById('konami-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'konami-overlay';
    ov.innerHTML = `
      <button id="konami-close" onclick="this.closest('#konami-overlay').classList.remove('show')">✕</button>
      <div style="font-size:4rem;margin-bottom:1.5rem">🎉</div>
      <div id="konami-msg">
        You found the secret! Here is your bonus message:<br>
        <small>"From the very first day I knew you, I knew you were someone extraordinary.
        Happy 25th, Samikshya. You are my favourite chapter in this story called life. ❤"</small>
      </div>
    `;
    document.body.appendChild(ov);
  }
  ov.classList.add('show');
  if (window.playChime) playChime([261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.50]);
  if (window.triggerConfetti) triggerConfetti(50);
}

/* ══════════════════════════════════════════
   23. LIVE DISTANCE COUNTDOWN (days to meet)
══════════════════════════════════════════ */
const meetDate = new Date('2027-01-01T00:00:00'); // Adjust this!
const finaleSec = document.getElementById('finale');
if (finaleSec) {
  const cdWrap = document.createElement('div');
  cdWrap.id = 'live-countdown-wrap';
  cdWrap.innerHTML = `
    <div class="eyebrow" style="text-align:center;margin-bottom:0.8rem">Days until we meet again</div>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
      <div><div class="lcd-number" id="lcd-days">--</div><div class="lcd-label">Days</div></div>
      <div><div class="lcd-number" id="lcd-hrs">--</div><div class="lcd-label">Hours</div></div>
      <div><div class="lcd-number" id="lcd-min">--</div><div class="lcd-label">Mins</div></div>
    </div>
    <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:0.9rem;opacity:0.6;margin-top:0.8rem">Every second brings us closer ❤</div>
  `;
  finaleSec.querySelector('.section-inner').appendChild(cdWrap);
  function updateLiveCD() {
    const diff = meetDate - new Date();
    if (diff <= 0) { cdWrap.style.display = 'none'; return; }
    document.getElementById('lcd-days').textContent = Math.floor(diff / 86400000);
    document.getElementById('lcd-hrs').textContent = Math.floor(diff / 3600000) % 24;
    document.getElementById('lcd-min').textContent = Math.floor(diff / 60000) % 60;
  }
  updateLiveCD(); setInterval(updateLiveCD, 30000);
}

/* ══════════════════════════════════════════
   24. NEXT CHAPTER SECTION
══════════════════════════════════════════ */
const nextChapSec = document.createElement('section');
nextChapSec.id = 'next-chapter';
nextChapSec.className = 'section';
nextChapSec.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">The future is ours</div>
    <h2 class="section-title">Our Next Chapter ✈️</h2>
    <p class="section-sub">A real promise. Not just words.</p>
    <div class="chapter-promise">
      <h3>The Plan</h3>
      <p>When the timing is right — and it will be right — we are meeting somewhere between Nepal and Maldives, or perhaps right where one of us stands.
      We will walk somewhere new together, eat something incredible, and laugh about this website.
      I've already imagined it a hundred times.
      <br><br>
      Until then, every day counts. Every call matters. Every memory we make across this screen is real.
      <br><br>
      <strong>I'll be there. I promise.</strong></p>
    </div>
  </div>
`;
const futureSec = document.getElementById('future-letter-sec');
if (futureSec) futureSec.after(nextChapSec);

/* ══════════════════════════════════════════
   25. REAL REPLY MECHANISM (email + WhatsApp)
══════════════════════════════════════════ */
const yourTurnSec = document.getElementById('your-turn-sec');
if (yourTurnSec) {
  const replyWrap = document.createElement('div');
  replyWrap.style.cssText = 'text-align:center;margin-top:1.5rem';
  replyWrap.innerHTML = `
    <p style="font-family:'Cormorant Garamond',serif;font-style:italic;opacity:0.7;margin-bottom:1rem">Or reach me directly — I'm real and I'm waiting:</p>
    <a class="reply-link" href="mailto:[EMAIL_ADDRESS]?subject=Happy Birthday Reply from Samikshya&body=Dear Image,">
      📧 Send me an Email
    </a>
    &nbsp;&nbsp;
    <a class="reply-link" href="https://wa.me/9779861589171?text=Hey!+I+just+read+your+birthday+page..." target="_blank" rel="noopener">
      💬 WhatsApp Me
    </a>
  `;
  yourTurnSec.querySelector('.section-inner').appendChild(replyWrap);
}

/* ══════════════════════════════════════════
   26. VOICE MESSAGE WALL
══════════════════════════════════════════ */
const voiceSec = document.createElement('section');
voiceSec.className = 'section';
voiceSec.innerHTML = `
  <div class="section-inner glass">
    <div class="eyebrow">From the heart, out loud</div>
    <h2 class="section-title">Voice Messages 💌</h2>
    <p class="section-sub">Tap any note to hear it play — real words, just for you.</p>
    <div id="voice-wall">
      ${[
    { icon: '🌸', label: 'Happy Birthday', text: 'Happy birthday Samikshya! Wishing you an amazing 25th full of joy!' },
    { icon: '💖', label: 'I miss you', text: 'I miss you so much. This distance is hard but you are worth every mile.' },
    { icon: '⭐', label: 'You are loved', text: 'You are so loved. Never forget that. Happy birthday, beautiful soul.' },
    { icon: '🎉', label: '25 is your year', text: '25 is your year! Go out and take everything the world has to offer.' },
    { icon: '🌙', label: 'Goodnight wish', text: 'Wherever you are tonight, know someone in Nepal is smiling thinking of you.' }
  ].map((v, i) => `
        <div class="voice-chip" data-msg="${v.text}" data-idx="${i}">
          <span class="vc-icon">${v.icon}</span> ${v.label}
        </div>`).join('')}
    </div>
  </div>
`;
const memBoxSec = document.getElementById('memorybox');
if (memBoxSec) memBoxSec.before(voiceSec);

// Voice chip speech synthesis
let currentUtter = null;
document.querySelectorAll('.voice-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    if (currentUtter) { speechSynthesis.cancel(); }
    const msg = chip.dataset.msg;
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = 'en-US'; u.rate = 0.9; u.pitch = 1.1;
    const voices = speechSynthesis.getVoices();
    const fem = voices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Karen'));
    if (fem) u.voice = fem;
    currentUtter = u;
    document.querySelectorAll('.voice-chip').forEach(c => c.classList.remove('playing'));
    chip.classList.add('playing');
    u.onend = () => { chip.classList.remove('playing'); currentUtter = null; };
    speechSynthesis.speak(u);
    if (window.playChime) playChime([523.25]);
  });
});

/* ══════════════════════════════════════════
   27. FILM STRIP SECTION
══════════════════════════════════════════ */
const filmSec = document.createElement('section');
filmSec.className = 'section';
filmSec.innerHTML = `
  <div class="section-inner">
    <div class="eyebrow">Like a cinema</div>
    <h2 class="section-title">Film Strip 🎞️</h2>
    <p class="section-sub">Scroll sideways through the reel of our memories.</p>
    <div class="filmstrip-wrap" id="filmstrip-wrap"></div>
  </div>
`;
const storySecEl = document.getElementById('story');
if (storySecEl) storySecEl.after(filmSec);

setTimeout(() => {
  const fw = document.getElementById('filmstrip-wrap');
  if (!fw) return;
  const files = window.photoFiles || [];
  files.slice(0, 16).forEach(src => {
    const frame = document.createElement('div');
    frame.className = 'film-frame';
    frame.innerHTML = `<img src="${src}" alt="Film frame" loading="lazy" onerror="window.placeholderImg && placeholderImg(this,'${src}')">`;
    frame.querySelector('img').addEventListener('click', () => window.openLightbox && openLightbox(src, false));
    fw.appendChild(frame);
  });
}, 600);

/* ══════════════════════════════════════════
   28. MINI PLAYLIST PLAYER
══════════════════════════════════════════ */
const playlistSongs = [
  { name: 'Our Song', artist: 'Nishan Bhattarai', src: 'nishan bhattari new song oe bhunti monkey dance funy video HD-mc.m4a', cover: 'file_0000000004c071fabea6c69ec86982a6.png' }
];
const playlistSec = document.createElement('section');
playlistSec.className = 'section';
playlistSec.innerHTML = `
  <div class="section-inner glass">
    <div class="eyebrow">Our Playlist 🎵</div>
    <h2 class="section-title">Songs That Remind Me of You</h2>
    <div id="playlist-player">
      <img class="album-art" id="plAlbumArt" src="${playlistSongs[0].cover}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\'><rect fill=\\'%23200d2a\\' width=\\'80\\' height=\\'80\\'/></svg>'">
      <div class="player-track-name" id="plTrackName">${playlistSongs[0].name}</div>
      <div class="player-track-sub">${playlistSongs[0].artist}</div>
      <audio id="plAudio" src="${playlistSongs[0].src}"></audio>
      <div class="player-controls">
        <button class="player-btn" id="plPrev">⏮</button>
        <button class="player-btn" id="plPlay">▶️</button>
        <button class="player-btn" id="plNext">⏭</button>
      </div>
    </div>
  </div>
`;
const quizSecEl = document.getElementById('quiz-sec');
if (quizSecEl) quizSecEl.before(playlistSec);

let plIdx = 0; let plPlaying = false;
const plAudio = () => document.getElementById('plAudio');
const plAlbum = () => document.getElementById('plAlbumArt');
document.getElementById('plPlay')?.addEventListener('click', () => {
  const a = plAudio(); if (!a) return;
  if (plPlaying) { a.pause(); plPlaying = false; document.getElementById('plPlay').textContent = '▶️'; plAlbum()?.classList.remove('spinning'); }
  else { a.play().catch(() => { }); plPlaying = true; document.getElementById('plPlay').textContent = '⏸️'; plAlbum()?.classList.add('spinning'); }
});

/* ══════════════════════════════════════════
   29. SCROLL-TRIGGERED CONFETTI at finale
══════════════════════════════════════════ */
let finalConfettiFired = false;
const finalObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !finalConfettiFired) {
    finalConfettiFired = true;
    if (window.triggerConfetti) triggerConfetti(45);
    if (window.playChime) playChime([523.25, 659.25, 783.99, 1046.50]);
  }
}, { threshold: 0.4 });
const finSecEl = document.getElementById('finale');
if (finSecEl) finalObs.observe(finSecEl);

/* ══════════════════════════════════════════
   30. SECTION REVEAL OBSERVER (add new sections)
══════════════════════════════════════════ */
setTimeout(() => {
  const newRevs = document.querySelectorAll('.reveal-el:not(.observed)');
  const existingObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.08 });
  newRevs.forEach(el => { el.classList.add('observed'); existingObs.observe(el); });
  // Re-apply tilt to new cards
  if (window.applyTilt) {
    document.querySelectorAll('.voice-chip, .chapter-promise').forEach(window.applyTilt);
  }
}, 1200);

/* ══════════════════════════════════════════
   31. LENS FLARE near gold elements
══════════════════════════════════════════ */
document.querySelectorAll('.btn-gold, .foil-divider').forEach(el => {
  const fl = document.createElement('div');
  fl.className = 'lens-flare';
  fl.style.cssText = 'width:60px;height:60px;top:-10px;left:40%;z-index:1;';
  el.style.position = 'relative';
  el.appendChild(fl);
});

/* ══════════════════════════════════════════
   32. FAVICON + TAB TITLE CYCLE
══════════════════════════════════════════ */
const tabTitles = ['Happy Birthday Samikshya 🎂', 'Made with love ❤', '25 & Wonderful ✨', 'Missing you 🌸', 'Happy Birthday! 🎉'];
let tabIdx = 0;
setInterval(() => {
  document.title = tabTitles[tabIdx++ % tabTitles.length];
}, 3000);

/* ══════════════════════════════════════════
   33. PAGE VISIBILITY — pause/resume floaties
══════════════════════════════════════════ */
document.addEventListener('visibilitychange', () => {
  const allAnimated = document.querySelectorAll('.dust-particle, .falling-petal, .firefly');
  allAnimated.forEach(el => {
    el.style.animationPlayState = document.hidden ? 'paused' : 'running';
  });
});
