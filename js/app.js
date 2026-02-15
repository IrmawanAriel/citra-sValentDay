// =============================================================
//  Valentine Flip Book — iOS-Premium Motion Edition
//  Modular Architecture:
//    AnimationEngine  → rAF loop, spring / tween physics
//    GestureController → touch & mouse tracking with velocity
//    AudioController  → Web Audio API music player
//    BookController   → main application orchestrator
// =============================================================

'use strict';

/* ──────────────────────────────────────────────
   CONFIGURATION
   ────────────────────────────────────────────── */
const defaultConfig = {
  book_title: "Our Love Story",
  couple_names: "Andi & Bella",
  final_message:
    "Terima kasih telah menjadi bagian terindah dalam hidupku. Setiap hari bersamamu adalah hadiah yang tak ternilai. Aku mencintaimu lebih dari kata-kata bisa ungkapkan. Semoga cinta kita terus tumbuh dan berkembang selamanya. Happy Valentine's Day, cintaku! 💕"
};

let config = { ...defaultConfig };

/* ──────────────────────────────────────────────
   PAGE DATA
   ────────────────────────────────────────────── */
const pagesData = [
  {
    title: "When We First Met",
    subtitle: "The Beginning of Us",
    photos: [{ placeholder: "First Meeting", caption: "Hari di mana takdir mempertemukan kita" }],
    quote: "From the moment I saw you, I knew my heart would never be the same."
  },
  {
    title: "Our Beautiful Moments",
    subtitle: "Memories We Cherish",
    photos: [
      { placeholder: "Sweet Memory 1", caption: "Senyummu adalah matahariku" },
      { placeholder: "Sweet Memory 2", caption: "Bersama dalam suka dan duka" }
    ],
    quote: "Every moment with you is a treasure I hold close to my heart."
  },
  {
    title: "Our Adventures",
    subtitle: "Exploring Life Together",
    photos: [
      { placeholder: "Adventure 1", caption: "Menjelajah dunia bersama" },
      { placeholder: "Adventure 2", caption: "Setiap perjalanan bersamamu adalah rumah" },
      { placeholder: "Adventure 3", caption: "Kenangan yang tak terlupakan" }
    ],
    quote: "Life is an adventure, and I'm glad I'm on this journey with you."
  },
  {
    title: "Special Moments",
    subtitle: "Days to Remember",
    photos: [{ placeholder: "Special Day", caption: "Hari yang sangat berarti" }],
    quote: "Some days are just more magical with you by my side."
  },
  {
    isFinalPage: true,
    title: "Happy Valentine's Day",
    subtitle: "My Love ❤️"
  }
];

/* ──────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────── */
const roseSVG = `
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15C55 25 65 30 70 25C65 35 70 45 60 45C70 50 70 60 55 55C60 65 55 75 45 65C40 75 30 70 35 60C25 65 20 55 30 50C20 50 20 40 35 45C25 40 30 25 40 35C35 25 45 20 50 15Z" fill="#f9a8c9" opacity="0.7"/>
    <path d="M50 25C53 32 58 35 62 32C58 38 62 44 55 44C62 47 60 55 50 50C54 58 48 65 42 58C38 65 32 60 36 52C28 56 25 48 32 45C24 45 26 38 36 42C30 38 34 28 42 34C38 28 46 24 50 25Z" fill="#f472b6" opacity="0.8"/>
    <circle cx="50" cy="40" r="8" fill="#ec4899"/>
    <path d="M45 85L50 50L55 85C55 90 45 90 45 85Z" fill="#22c55e"/>
    <path d="M50 60C45 55 35 58 38 65" stroke="#22c55e" stroke-width="2" fill="none"/>
    <path d="M50 70C55 65 65 68 62 75" stroke="#22c55e" stroke-width="2" fill="none"/>
  </svg>`;

function getDummyPhotoUrl(seed, width = 800, height = 600) {
  const normalized = String(seed ?? 'photo')
    .trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  const safeSeed = encodeURIComponent(normalized || 'photo');
  return `https://picsum.photos/seed/${safeSeed}/${width}/${height}`;
}

function generatePageContent(pageData, pageIndex) {
  if (pageData.isFinalPage) return generateFinalPage();

  const photosHTML = pageData.photos.map((photo, idx) => {
    const seed = `${pageIndex}-${idx}-${photo.placeholder || 'photo'}`;
    const src = photo.url || getDummyPhotoUrl(seed, 900, 675);
    const alt = photo.alt || photo.placeholder || 'Foto';
    return `
      <div class="flex flex-col min-h-0">
        <div class="photo-frame w-full overflow-hidden rounded-lg" style="aspect-ratio:4/3;min-height:0;">
          <img src="${src}" alt="${alt}" loading="lazy" decoding="async" referrerpolicy="no-referrer"/>
        </div>
        <p class="font-body text-rose-600 text-center mt-1 italic" style="font-size:clamp(0.55rem,1.4vw,0.85rem);">${photo.caption}</p>
      </div>`;
  }).join('');

  const n = pageData.photos.length;
  const layoutClass = n === 1
    ? 'flex flex-col'
    : n === 2
      ? 'grid grid-cols-2 gap-2 md:gap-3'
      : 'grid grid-cols-3 gap-2';

  return `
    <div class="h-full flex flex-col relative" style="padding:clamp(8px,2vw,24px);padding-top:clamp(6px,1.5vw,20px);">
      <div class="corner-rose top-left opacity-40">${roseSVG}</div>
      <div class="corner-rose bottom-right opacity-40">${roseSVG}</div>
      <div class="text-center flex-shrink-0" style="margin-bottom:clamp(4px,1.2vh,20px);">
        <h2 class="font-romantic text-rose-500" style="font-size:clamp(1.15rem,3.5vw,2.2rem);line-height:1.2;">${pageData.title}</h2>
        <p class="font-elegant text-rose-400 italic" style="font-size:clamp(0.6rem,1.6vw,1rem);">${pageData.subtitle}</p>
        <div class="flex items-center justify-center gap-1 mt-1">
          <div class="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" style="width:clamp(16px,5vw,64px);"></div>
          <span class="text-rose-300" style="font-size:clamp(0.5rem,1.2vw,0.85rem);">✿</span>
          <div class="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" style="width:clamp(16px,5vw,64px);"></div>
        </div>
      </div>
      <div class="flex-1 min-h-0 ${n === 1 ? 'flex flex-col mx-auto w-full' : layoutClass}" style="${n === 1 ? 'max-width:min(100%,320px);' : ''}">
        ${photosHTML}
      </div>
      <div class="text-center flex-shrink-0" style="margin-top:clamp(4px,1vh,16px);">
        <p class="font-body text-rose-400 italic" style="font-size:clamp(0.5rem,1.3vw,0.85rem);">"${pageData.quote}"</p>
      </div>
    </div>`;
}

function generateFinalPage() {
  return `
    <div class="h-full flex flex-col items-center justify-center relative overflow-hidden" style="padding:clamp(8px,2vw,32px);">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute" style="top:8%;left:8%;font-size:clamp(1.5rem,5vw,3.5rem);">❤️</div>
        <div class="absolute" style="top:16%;right:14%;font-size:clamp(1rem,3.5vw,2.5rem);">💕</div>
        <div class="absolute" style="bottom:16%;left:14%;font-size:clamp(1.2rem,4vw,3rem);">💗</div>
        <div class="absolute" style="bottom:8%;right:10%;font-size:clamp(1rem,3.5vw,2.5rem);">💖</div>
      </div>
      <div class="corner-rose top-left">${roseSVG}</div>
      <div class="corner-rose bottom-right">${roseSVG}</div>
      <div class="cinematic-reveal photo-frame rounded-full overflow-hidden flex-shrink-0" style="width:clamp(64px,16vw,180px);height:clamp(64px,16vw,180px);margin-bottom:clamp(6px,1.5vh,20px);">
        <img src="${getDummyPhotoUrl('final-special', 600, 600)}" alt="Foto spesial" loading="lazy" decoding="async" referrerpolicy="no-referrer"/>
      </div>
      <h2 class="cinematic-reveal font-romantic text-rose-500 text-center relative z-10" style="font-size:clamp(1.2rem,4vw,3rem);line-height:1.2;margin-bottom:clamp(2px,0.5vh,8px);">
        Happy Valentine's Day
      </h2>
      <p class="cinematic-reveal font-elegant text-rose-400 italic" style="font-size:clamp(0.75rem,2.2vw,1.4rem);margin-bottom:clamp(6px,1.2vh,20px);">My Love ❤️</p>
      <div class="cinematic-reveal w-full bg-white/50 rounded-2xl shadow-inner relative z-10 overflow-y-auto" style="max-width:min(100%,400px);padding:clamp(6px,1.5vw,20px);max-height:clamp(60px,18vh,180px);">
        <p id="final-message-text" class="font-body text-rose-600 text-center leading-relaxed" style="font-size:clamp(0.55rem,1.4vw,0.9rem);">
          ${config.final_message}
        </p>
      </div>
      <div class="cinematic-reveal text-center flex-shrink-0" style="margin-top:clamp(4px,1vh,20px);">
        <p class="font-romantic text-rose-400" style="font-size:clamp(0.9rem,2.8vw,1.75rem);">With All My Love,</p>
        <p id="final-names" class="font-elegant text-rose-500 italic" style="font-size:clamp(0.7rem,1.8vw,1.2rem);margin-top:2px;">${config.couple_names}</p>
      </div>
    </div>`;
}

/* ===========================================================
   ANIMATION ENGINE
   rAF-driven loop with spring physics & tweening
   =========================================================== */
class AnimationEngine {
  constructor() {
    this._anims = new Map();
    this._rafId = null;
    this._running = false;
  }

  /* — lifecycle — */
  _start() {
    if (this._running) return;
    this._running = true;
    this._tick();
  }

  _stop() {
    this._running = false;
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
  }

  _tick() {
    if (!this._running) return;
    const now = performance.now();
    const done = [];
    this._anims.forEach((a, id) => { if (a.update(now)) done.push(id); });
    done.forEach(id => this._anims.delete(id));
    if (this._anims.size === 0) { this._stop(); return; }
    this._rafId = requestAnimationFrame(() => this._tick());
  }

  /* — spring animation —
     physics: F = −k·x − d·v   (damped harmonic oscillator)  */
  spring(id, { from, to, stiffness = 130, damping = 15, mass = 1,
               velocity: v0 = 0, onUpdate, onComplete, precision = 0.4 }) {
    this.cancel(id);
    let pos = from, vel = v0, lastT = performance.now();
    this._anims.set(id, {
      update(now) {
        const dt = Math.min((now - lastT) / 1000, 0.064);
        lastT = now;
        const disp = pos - to;
        const acc  = (-stiffness * disp - damping * vel) / mass;
        vel += acc * dt;
        pos += vel * dt;
        if (onUpdate) onUpdate(pos, vel);
        if (Math.abs(disp) < precision && Math.abs(vel) < precision) {
          if (onUpdate) onUpdate(to, 0);
          if (onComplete) onComplete();
          return true;
        }
        return false;
      }
    });
    this._start();
  }

  /* — tween animation — */
  tween(id, { from, to, duration = 400,
              easing = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2,
              onUpdate, onComplete }) {
    this.cancel(id);
    const t0 = performance.now();
    this._anims.set(id, {
      update(now) {
        let t = Math.min((now - t0) / duration, 1);
        const v = from + (to - from) * easing(t);
        if (onUpdate) onUpdate(v);
        if (t >= 1) { if (onUpdate) onUpdate(to); if (onComplete) onComplete(); return true; }
        return false;
      }
    });
    this._start();
  }

  cancel(id)  { this._anims.delete(id); }
  cancelAll() { this._anims.clear(); this._stop(); }
  get active(){ return this._anims.size > 0; }
}

/* ===========================================================
   GESTURE CONTROLLER
   Touch + mouse tracking with velocity calculation
   =========================================================== */
class GestureController {
  constructor(el, cb) {
    this.el = el;
    this.cb = cb;  // { onStart, onMove, onEnd }
    this._tracking = false;
    this._sx = 0; this._sy = 0;
    this._cx = 0; this._cy = 0;
    this._t0 = 0;
    this._vBuf = [];

    // Bound handlers
    this._ts = this._ts.bind(this);
    this._tm = this._tm.bind(this);
    this._te = this._te.bind(this);
    this._md = this._md.bind(this);
    this._mm = this._mm.bind(this);
    this._mu = this._mu.bind(this);
    this._bind();
  }

  _bind() {
    this.el.addEventListener('touchstart',  this._ts, { passive: false });
    this.el.addEventListener('touchmove',   this._tm, { passive: false });
    this.el.addEventListener('touchend',    this._te, { passive: true });
    this.el.addEventListener('touchcancel', this._te, { passive: true });
    this.el.addEventListener('mousedown',   this._md);
    document.addEventListener('mousemove',  this._mm);
    document.addEventListener('mouseup',    this._mu);
  }

  destroy() {
    this.el.removeEventListener('touchstart',  this._ts);
    this.el.removeEventListener('touchmove',   this._tm);
    this.el.removeEventListener('touchend',    this._te);
    this.el.removeEventListener('touchcancel', this._te);
    this.el.removeEventListener('mousedown',   this._md);
    document.removeEventListener('mousemove',  this._mm);
    document.removeEventListener('mouseup',    this._mu);
  }

  _ts(e) { if (e.touches.length === 1) this._begin(e.touches[0].clientX, e.touches[0].clientY); }
  _tm(e) { if (!this._tracking) return; e.preventDefault(); this._drag(e.touches[0].clientX, e.touches[0].clientY); }
  _te()  { if (this._tracking) this._release(); }
  _md(e) { if (e.button === 0) { e.preventDefault(); this._begin(e.clientX, e.clientY); } }
  _mm(e) { if (this._tracking) this._drag(e.clientX, e.clientY); }
  _mu()  { if (this._tracking) this._release(); }

  _begin(x, y) {
    this._tracking = true;
    this._sx = x; this._sy = y;
    this._cx = x; this._cy = y;
    this._t0 = performance.now();
    this._vBuf = [{ x, t: this._t0 }];
    if (this.cb.onStart) this.cb.onStart({ x, y, startX: x, startY: y, rect: this.el.getBoundingClientRect() });
  }

  _drag(x, y) {
    this._cx = x; this._cy = y;
    const now = performance.now();
    this._vBuf.push({ x, t: now });
    while (this._vBuf.length > 1 && now - this._vBuf[0].t > 100) this._vBuf.shift();
    if (this.cb.onMove) this.cb.onMove({
      x, y, startX: this._sx, startY: this._sy,
      deltaX: x - this._sx, deltaY: y - this._sy,
      rect: this.el.getBoundingClientRect()
    });
  }

  _release() {
    this._tracking = false;
    if (this.cb.onEnd) this.cb.onEnd({
      x: this._cx, y: this._cy,
      startX: this._sx, startY: this._sy,
      deltaX: this._cx - this._sx, deltaY: this._cy - this._sy,
      velocityX: this._vel(),
      duration: performance.now() - this._t0,
      rect: this.el.getBoundingClientRect()
    });
  }

  _vel() {
    const b = this._vBuf;
    if (b.length < 2) return 0;
    const dt = (b[b.length-1].t - b[0].t) / 1000;
    return dt === 0 ? 0 : (b[b.length-1].x - b[0].x) / dt;
  }
}

/* ===========================================================
   AUDIO CONTROLLER
   Web Audio API with smooth gain-based fades
   =========================================================== */
class AudioController {
  constructor(src) {
    this.src = src;
    this._audio = null;
    this._ctx = null;
    this._gain = null;
    this._ready = false;
    this.playing = false;
    this._btn = null;
  }

  async init() {
    try {
      this._audio = new Audio(this.src);
      this._audio.loop = true;
      this._audio.volume = 0;
      this._audio.preload = 'auto';

      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = this._ctx.createMediaElementSource(this._audio);
      this._gain = this._ctx.createGain();
      this._gain.gain.value = 0;
      src.connect(this._gain);
      this._gain.connect(this._ctx.destination);
      this._ready = true;
      this._createBtn();
    } catch (e) { console.warn('Audio init failed:', e); }
  }

  _createBtn() {
    const btn = document.createElement('button');
    btn.className = 'audio-toggle paused';
    btn.setAttribute('aria-label', 'Toggle music');
    btn.innerHTML = '<div class="audio-bars"><span></span><span></span><span></span><span></span></div>';
    btn.addEventListener('click', () => this.toggle());
    document.body.appendChild(btn);
    this._btn = btn;
  }

  async toggle() {
    if (!this._ready) return;
    if (this._ctx.state === 'suspended') await this._ctx.resume();
    this.playing ? this.fadeOut(.5) : this.fadeIn(1.2);
  }

  async fadeIn(dur = 1.2) {
    if (!this._ready) return;
    try {
      if (this._ctx.state === 'suspended') await this._ctx.resume();
      await this._audio.play();
      this.playing = true;
      this._btn?.classList.remove('paused');
      const t = this._ctx.currentTime;
      this._gain.gain.cancelScheduledValues(t);
      this._gain.gain.setValueAtTime(this._gain.gain.value, t);
      this._gain.gain.linearRampToValueAtTime(0.65, t + dur);
    } catch (e) { console.warn('Audio play failed:', e); }
  }

  fadeOut(dur = .5) {
    if (!this._ready || !this.playing) return;
    const t = this._ctx.currentTime;
    this._gain.gain.cancelScheduledValues(t);
    this._gain.gain.setValueAtTime(this._gain.gain.value, t);
    this._gain.gain.linearRampToValueAtTime(0, t + dur);
    this.playing = false;
    this._btn?.classList.add('paused');
    setTimeout(() => { if (!this.playing) this._audio.pause(); }, dur * 1000 + 60);
  }
}

/* ===========================================================
   BOOK CONTROLLER
   Orchestrates pages, flipping, gestures, opening/closing
   =========================================================== */
class BookController {
  constructor() {
    this.anim   = new AnimationEngine();
    this.audio  = new AudioController('assets/ChangeYaMind.mp3');
    this.gesture = null;
    this.config  = { ...defaultConfig };

    // State
    this.currentPage = 0;
    this.isOpen      = false;
    this.isFlipping  = false;
    this.isDragging  = false;
    this.dragDir     = 0;   // 1 = forward, -1 = backward
    this.dragIdx     = -1;

    // DOM
    this.book = null;
    this.cover = null;
    this.pagesEl = null;
    this.nav = null;
    this.closeBtn = null;
    this.heartsCt = null;

    // Page tracking
    this.pages  = [];   // DOM elements
    this.angles = [];   // current rotateY per page (degrees)

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* —— INIT —— */
  init() {
    this.book     = document.getElementById('book');
    this.cover    = document.getElementById('cover');
    this.pagesEl  = document.getElementById('pages-container');
    this.nav      = document.getElementById('navigation');
    this.closeBtn = document.getElementById('close-btn');
    this.heartsCt = document.getElementById('hearts-container');

    this._buildPages();
    this._bindCover();
    this._bindNav();
    this._bindKeyboard();

    this.gesture = new GestureController(this.pagesEl, {
      onStart: d => this._gestStart(d),
      onMove:  d => this._gestMove(d),
      onEnd:   d => this._gestEnd(d)
    });

    this.audio.init();
    this.applyConfig();
    this._entranceAnim();
  }

  /* —— PAGE BUILDING —— */
  _buildPages() {
    this.pagesEl.innerHTML = '';
    this.pages  = [];
    this.angles = [];

    pagesData.forEach((pd, i) => {
      const page = document.createElement('div');
      page.className = 'page';
      page.style.zIndex  = pagesData.length - i;
      page.style.width   = '100%';
      page.style.height  = '100%';
      page.dataset.index = i;

      const front = document.createElement('div');
      front.className = 'page-front paper-texture';
      front.innerHTML = generatePageContent(pd, i);

      const back = document.createElement('div');
      back.className = 'page-back paper-texture';
      back.innerHTML = i < pagesData.length - 1
        ? `<div class="h-full flex items-center justify-center opacity-30">
             <div class="text-center"><span class="text-6xl">📖</span>
             <p class="font-elegant text-rose-400 mt-2">Halaman ${i + 2}</p></div></div>`
        : `<div class="h-full flex items-center justify-center">
             <div class="text-center"><span class="text-4xl mb-2">💝</span>
             <p class="font-romantic text-2xl text-rose-400">The End</p>
             <p class="font-elegant text-rose-300 text-sm mt-2 italic">Our story continues...</p></div></div>`;

      page.appendChild(front);
      page.appendChild(back);
      this.pagesEl.appendChild(page);
      this.pages.push(page);
      this.angles.push(0);
    });
  }

  /* —— ENTRANCE ANIMATION —— */
  _entranceAnim() {
    const w = document.querySelector('.book-wrapper');
    if (this.reducedMotion) { w.style.opacity = '1'; return; }
    w.style.opacity = '0';
    w.style.transform = 'scale(0.93) translateY(24px)';
    w.style.transition = 'none';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      w.style.transition = 'opacity 850ms cubic-bezier(0.22,1,0.36,1), transform 900ms cubic-bezier(0.22,1,0.36,1)';
      w.style.opacity = '1';
      w.style.transform = 'scale(1) translateY(0)';
    }));
  }

  /* —— COVER EVENTS —— */
  _bindCover() {
    document.getElementById('open-btn').addEventListener('click', e => { e.stopPropagation(); this.openBook(); });
    this.cover.addEventListener('click', () => this.openBook());
    this.closeBtn.addEventListener('click', () => this.closeBook());
  }

  /* —— NAV EVENTS —— */
  _bindNav() {
    document.getElementById('prev-btn').addEventListener('click', () => {
      if (this.currentPage > 0) this.flipToPage(this.currentPage - 1);
    });
    document.getElementById('next-btn').addEventListener('click', () => {
      if (this.currentPage < pagesData.length - 1) this.flipToPage(this.currentPage + 1);
    });
  }

  /* —— KEYBOARD —— */
  _bindKeyboard() {
    document.addEventListener('keydown', e => {
      if (!this.isOpen) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openBook(); }
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (this.currentPage < pagesData.length - 1) this.flipToPage(this.currentPage + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (this.currentPage > 0) this.flipToPage(this.currentPage - 1);
      } else if (e.key === 'Escape') {
        this.closeBook();
      }
    });
  }

  /* ========================================================
     GESTURE-DRIVEN FLIP  (the core premium interaction)
     ======================================================== */
  _gestStart(d) {
    if (this.isFlipping || !this.isOpen) return;
    const relX = d.x - d.rect.left;
    const half = d.rect.width / 2;

    if (relX > half && this.currentPage < pagesData.length - 1) {
      this.dragDir = 1;
      this.dragIdx = this.currentPage;
    } else if (relX <= half && this.currentPage > 0) {
      this.dragDir = -1;
      this.dragIdx = this.currentPage - 1;
    } else {
      this.dragDir = 0;
      return;
    }
    this.isDragging = true;
    this.anim.cancel(`flip-${this.dragIdx}`);
  }

  _gestMove(d) {
    if (!this.isDragging || this.dragDir === 0) return;
    const pw = d.rect.width;
    let angle;

    if (this.dragDir === 1) {
      // Forward: drag left → 0 → −180
      const p = Math.max(0, Math.min(1, -d.deltaX / (pw * 0.55)));
      angle = -p * 180;
      // elastic at boundaries
      if (angle < -180) angle = -180 - (angle + 180) * 0.12;
      if (angle > 0)    angle = angle * 0.12;
      angle = Math.max(-196, Math.min(8, angle));
    } else {
      // Backward: drag right → −180 → 0
      const p = Math.max(0, Math.min(1, d.deltaX / (pw * 0.55)));
      angle = -180 + p * 180;
      if (angle > 0)    angle = angle * 0.12;
      if (angle < -180) angle = -180 + (angle + 180) * 0.12;
      angle = Math.max(-196, Math.min(8, angle));
    }

    this._setAngle(this.dragIdx, angle);
  }

  _gestEnd(d) {
    if (!this.isDragging || this.dragDir === 0) { this.isDragging = false; return; }

    const vx    = d.velocityX;          // px/s
    const angle = this.angles[this.dragIdx];
    const VEL_T = 280;                  // velocity threshold

    let complete;
    if (this.dragDir === 1)  complete = angle < -90 || vx < -VEL_T;
    else                     complete = angle > -90 || vx >  VEL_T;

    const target = this.dragDir === 1
      ? (complete ? -180 : 0)
      : (complete ? 0 : -180);

    // Map px velocity → angular velocity (approx)
    const angVel = (vx / d.rect.width) * -180;

    this.isDragging = false;
    this.isFlipping = true;
    const idx = this.dragIdx;

    this.anim.spring(`flip-${idx}`, {
      from: angle, to: target,
      stiffness: this.reducedMotion ? 320 : 150,
      damping:   this.reducedMotion ? 32  : 16,
      velocity: angVel * 2.5,
      precision: 0.25,
      onUpdate: v => this._setAngle(idx, v),
      onComplete: () => {
        this._setAngle(idx, target);
        this.isFlipping = false;
        if (target === -180 && this.dragDir === 1)   this.currentPage = idx + 1;
        if (target === 0   && this.dragDir === -1)  this.currentPage = idx;
        this._updateIndicator();
        this._handleFinalPage();
      }
    });
  }

  /* —— SET PAGE ANGLE & DYNAMIC SHADOWS —— */
  _setAngle(i, deg) {
    if (i < 0 || i >= this.pages.length) return;
    this.angles[i] = deg;
    this.pages[i].style.transform = `rotateY(${deg}deg)`;
    this._pageShadow(this.pages[i], deg);
    this._bookShadow();
  }

  _pageShadow(page, deg) {
    const norm = Math.abs(deg) / 180;
    const intensity = Math.sin(norm * Math.PI);

    let sh = page.querySelector('.page-flip-shadow');
    if (!sh) {
      sh = document.createElement('div');
      sh.className = 'page-flip-shadow';
      page.querySelector('.page-front').appendChild(sh);
    }
    sh.style.opacity = intensity * 0.4;
    sh.style.background = deg < -90
      ? `linear-gradient(to right, rgba(0,0,0,0.28), transparent 65%)`
      : `linear-gradient(to left,  rgba(0,0,0,0.28), transparent 65%)`;
  }

  _bookShadow() {
    const el = document.querySelector('.book-shadow');
    if (!el) return;
    let mx = 0;
    this.angles.forEach(a => { mx = Math.max(mx, Math.sin(Math.abs(a)/180 * Math.PI)); });
    el.style.setProperty('--lift',   `${mx * 8}px`);
    el.style.setProperty('--spread', `${mx * 12}px`);
  }

  /* —— PROGRAMMATIC FLIP —— */
  flipToPage(target) {
    if (this.isFlipping || this.isDragging) return;
    if (target < 0 || target >= pagesData.length || target === this.currentPage) return;

    this.isFlipping = true;
    const dir = target > this.currentPage ? 1 : -1;
    const flips = [];

    if (dir === 1) for (let i = this.currentPage; i < target; i++) flips.push({ i, to: -180 });
    else           for (let i = this.currentPage - 1; i >= target; i--) flips.push({ i, to: 0 });

    let done = 0;
    flips.forEach((f, n) => {
      setTimeout(() => {
        if (this.reducedMotion) {
          this._setAngle(f.i, f.to);
          if (++done === flips.length) this._flipDone(target);
          return;
        }
        this.anim.spring(`flip-${f.i}`, {
          from: this.angles[f.i], to: f.to,
          stiffness: 140, damping: 16, precision: 0.25,
          onUpdate:   v => this._setAngle(f.i, v),
          onComplete: () => { this._setAngle(f.i, f.to); if (++done === flips.length) this._flipDone(target); }
        });
      }, n * 90);
    });
  }

  _flipDone(target) {
    this.currentPage = target;
    this.isFlipping = false;
    this._updateIndicator();
    this._handleFinalPage();
  }

  /* —— OPEN / CLOSE —— */
  openBook() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.cover.classList.add('opened');
    this.audio.fadeIn(1.5);

    setTimeout(() => {
      this.pagesEl.style.display = 'block';
      this.pagesEl.style.opacity = '0';
      this.nav.classList.remove('hidden');
      this.closeBtn.classList.remove('hidden');
      requestAnimationFrame(() => {
        this.pagesEl.style.transition = 'opacity 0.45s ease';
        this.pagesEl.style.opacity = '1';
      });
      this._updateIndicator();
    }, 850);
  }

  closeBook() {
    this.isOpen = false;
    this.currentPage = 0;
    this.pages.forEach((_, i) => this._setAngle(i, 0));
    this.nav.classList.add('hidden');
    this.closeBtn.classList.add('hidden');
    this._hideHearts();
    setTimeout(() => {
      this.pagesEl.style.display = 'none';
      this.pagesEl.style.opacity = '';
      this.pagesEl.style.transition = '';
      this.cover.classList.remove('opened');
    }, 120);
  }

  /* —— INDICATOR —— */
  _updateIndicator() {
    const ind = document.getElementById('page-indicator');
    if (ind) ind.textContent = `${this.currentPage + 1} / ${pagesData.length}`;
    const pb = document.getElementById('prev-btn');
    const nb = document.getElementById('next-btn');
    if (pb) pb.disabled = this.currentPage === 0;
    if (nb) nb.disabled = this.currentPage === pagesData.length - 1;
  }

  /* —— FINAL PAGE CINEMATIC —— */
  _handleFinalPage() {
    if (this.currentPage === pagesData.length - 1) {
      this._showHearts();
      this._cinematicReveal();
    } else {
      this._hideHearts();
    }
  }

  _cinematicReveal() {
    const front = this.pages[this.pages.length - 1]?.querySelector('.page-front');
    if (!front) return;
    front.querySelectorAll('.cinematic-reveal').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'none';
      setTimeout(() => {
        el.style.transition = 'opacity .65s cubic-bezier(0.22,1,0.36,1), transform .65s cubic-bezier(0.22,1,0.36,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 250 + i * 160);
    });
  }

  _showHearts() {
    this.heartsCt.style.display = 'block';
    this.heartsCt.innerHTML = '';
    const glyphs = ['❤️','💕','💗','💖','💝','💘','♥️'];
    for (let i = 0; i < 20; i++) {
      const h = document.createElement('div');
      h.className = 'floating-heart';
      h.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      h.style.left = Math.random() * 100 + '%';
      h.style.fontSize = (Math.random() * 20 + 10) + 'px';
      h.style.animationDelay    = Math.random() * 4 + 's';
      h.style.animationDuration = (Math.random() * 2 + 3) + 's';
      this.heartsCt.appendChild(h);
    }
  }

  _hideHearts() { this.heartsCt.style.display = 'none'; }

  /* —— CONFIG —— */
  applyConfig() {
    const t = document.getElementById('cover-title');
    if (t) t.textContent = this.config.book_title;
    const n = document.getElementById('cover-names');
    if (n) n.textContent = this.config.couple_names;
    const m = document.getElementById('final-message-text');
    if (m) m.textContent = this.config.final_message;
    const fn = document.getElementById('final-names');
    if (fn) fn.textContent = this.config.couple_names;
  }

  updateConfig(c) {
    this.config = { ...defaultConfig, ...c };
    config = this.config;   // keep module-level in sync for generators
    this.applyConfig();
    if (this.isOpen && this.currentPage === pagesData.length - 1) {
      const last = this.pages[this.pages.length - 1];
      if (last) { const f = last.querySelector('.page-front'); if (f) f.innerHTML = generateFinalPage(); }
    }
  }
}

/* ===========================================================
   BOOTSTRAP
   =========================================================== */
const app = new BookController();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

/* Element SDK integration */
const elementConfig = {
  defaultConfig,
  onConfigChange: async (newCfg) => app.updateConfig(newCfg),
  mapToCapabilities: () => ({ recolorables: [], borderables: [], fontEditable: undefined, fontSizeable: undefined }),
  mapToEditPanelValues: cfg => new Map([
    ['book_title',    cfg.book_title    || defaultConfig.book_title],
    ['couple_names',  cfg.couple_names  || defaultConfig.couple_names],
    ['final_message', cfg.final_message || defaultConfig.final_message]
  ])
};

if (window.elementSdk) window.elementSdk.init(elementConfig);
