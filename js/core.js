"use strict";
/* ============================================================
   VOIDHEART — core: canvas, input, audio, text, storage, utils
   ============================================================ */
const CW = 640, CH = 480, TILE = 32;
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const FONT = '"VT323","Courier New",monospace';
const IS_TOUCH = ("ontouchstart" in window) || (window.matchMedia && matchMedia("(pointer:coarse)").matches);
if (IS_TOUCH) document.body.classList.add("touch");

function fitCanvas() {
  const availW = innerWidth - 8, availH = innerHeight - (IS_TOUCH ? 200 : 8);
  const s = Math.max(.35, Math.min(availW / CW, availH / CH));
  canvas.style.width = Math.floor(CW * s) + "px";
  canvas.style.height = Math.floor(CH * s) + "px";
}
addEventListener("resize", fitCanvas);
fitCanvas();

/* ---------- utils ---------- */
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const rand = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(rand(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const lerp = (a, b, t) => a + (b - a) * t;
function hash(x, y) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/* ---------- storage ---------- */
const Store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

/* Memory persists between loops (playthroughs). The Archive remembers. */
const Memory = {
  data: Store.get("vh_memory", null) || { runs: 0, endings: {}, last: null },
  save() { Store.set("vh_memory", this.data); },
  record(ending, ep = 1, info = null) {
    if (ep === 1) { this.data.runs++; this.data.last = ending; }
    this.data.endings[ending] = true;
    this.data.eps[ep] = Object.assign({ ending }, info || {});
    this.save();
  },
  hasPage(id) { return this.data.pages.includes(id); },
  addPage(id) { if (!this.hasPage(id)) { this.data.pages.push(id); this.save(); } },
  erase() { this.data = { runs: 0, endings: {}, last: null, eps: {}, pages: [] }; this.save(); }
};
Memory.data.eps = Memory.data.eps || {};
Memory.data.pages = Memory.data.pages || [];

/* ---------- timers ---------- */
const Timers = {
  list: [],
  after(t, fn) { this.list.push({ t, fn }); },
  update(dt) {
    const l = this.list; this.list = [];
    for (const x of l) { x.t -= dt; if (x.t <= 0) x.fn(); else this.list.push(x); }
  },
  clear() { this.list = []; }
};

/* ---------- input ---------- */
const Input = {
  down: new Set(), hits: new Set(),
  map: {
    up: ["ArrowUp", "KeyW"], down: ["ArrowDown", "KeyS"], left: ["ArrowLeft", "KeyA"], right: ["ArrowRight", "KeyD"],
    ok: ["KeyZ", "Enter", "NumpadEnter", "Space"], cancel: ["KeyX", "ShiftLeft", "ShiftRight", "Backspace"],
    menu: ["KeyC", "ControlLeft", "ControlRight"]
  },
  held(a) { return this.map[a].some(k => this.down.has(k)); },
  hit(a) { return this.map[a].some(k => this.hits.has(k)); },
  press(k) { if (!this.down.has(k)) this.hits.add(k); this.down.add(k); },
  release(k) { this.down.delete(k); },
  endFrame() { this.hits.clear(); }
};
function toggleFull() {
  try {
    const p = !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen();
    if (p && p.catch) p.catch(() => Toast.show("FULLSCREEN UNAVAILABLE"));
  } catch (e) {}
}
addEventListener("keydown", e => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "Enter", "Backspace"].includes(e.code)) e.preventDefault();
  Sound.unlock();
  if (e.repeat) return;
  if (e.code === "KeyM") { Sound.toggleMute(); return; }
  if (e.code === "KeyF") { toggleFull(); return; }
  Input.press(e.code);
});
addEventListener("keyup", e => Input.release(e.code));
addEventListener("blur", () => Input.down.clear());
canvas.tabIndex = 0;
canvas.addEventListener("pointerdown", () => { Sound.unlock(); try { canvas.focus(); window.focus(); } catch (e) {} });
document.querySelectorAll("#touch .tb").forEach(el => {
  const code = el.dataset.code;
  const on = e => { e.preventDefault(); Sound.unlock(); Input.press(code); el.classList.add("on"); };
  const off = e => { e.preventDefault(); Input.release(code); el.classList.remove("on"); };
  el.addEventListener("pointerdown", on);
  el.addEventListener("pointerup", off);
  el.addEventListener("pointercancel", off);
  el.addEventListener("pointerleave", off);
});

/* ---------- toast ---------- */
const Toast = {
  msg: "", t: 0,
  show(m) { this.msg = m; this.t = 1.6; },
  update(dt) { this.t = Math.max(0, this.t - dt); },
  draw() {
    if (this.t <= 0) return;
    ctx.globalAlpha = Math.min(1, this.t * 2);
    txt(this.msg, CW - 12, 8, "#ffd84a", 22, "right");
    ctx.globalAlpha = 1;
  }
};

/* ---------- audio ---------- */
const Sound = {
  ac: null, master: null, mus: null, fx: null, muted: Store.get("vh_muted", false),
  unlock() {
    if (this.ac) { if (this.ac.state === "suspended") this.ac.resume(); return; }
    try {
      this.ac = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ac.createGain(); this.master.gain.value = this.muted ? 0 : .7;
      this.master.connect(this.ac.destination);
      this.mus = this.ac.createGain(); this.mus.gain.value = .55; this.mus.connect(this.master);
      this.fx = this.ac.createGain(); this.fx.gain.value = .9; this.fx.connect(this.master);
    } catch (e) { this.ac = null; }
  },
  toggleMute() {
    this.muted = !this.muted; Store.set("vh_muted", this.muted);
    if (this.master) this.master.gain.value = this.muted ? 0 : .7;
    Toast.show(this.muted ? "SOUND OFF  [M]" : "SOUND ON  [M]");
  },
  tone(f, d, type = "square", v = .05, when = 0, slideTo = 0, dest) {
    if (!this.ac || !f) return;
    const t = this.ac.currentTime + Math.max(0, when);
    const o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + d);
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(dest || this.fx);
    o.start(t); o.stop(t + d + .03);
  },
  noise(d = .1, v = .08, when = 0) {
    if (!this.ac) return;
    const ac = this.ac, len = Math.max(1, Math.floor(ac.sampleRate * d));
    const b = ac.createBuffer(1, len, ac.sampleRate), ch = b.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ac.createBufferSource(); src.buffer = b;
    const g = ac.createGain(); g.gain.value = v;
    src.connect(g); g.connect(this.fx); src.start(ac.currentTime + when);
  },
  sfx(n, p = 0) {
    if (!this.ac) return;
    const T = (...a) => this.tone(...a);
    switch (n) {
      case "move": T(420, .03, "square", .025); break;
      case "select": T(660, .05, "square", .035); T(880, .06, "square", .03, .04); break;
      case "back": T(300, .06, "square", .03); break;
      case "text": T(p + rand(0, 25), .028, "square", .012); break;
      case "hit": this.noise(.14, .13); T(170, .14, "sawtooth", .05, 0, 60); break;
      case "slash": this.noise(.09, .07); T(1400, .12, "sawtooth", .025, 0, 300); break;
      case "hurt": T(240, .16, "square", .06, 0, 90); this.noise(.08, .06); break;
      case "heal": T(523, .08, "triangle", .06); T(784, .14, "triangle", .06, .07); break;
      case "save": [523, 659, 784, 1046].forEach((f, i) => T(f, .2, "triangle", .05, i * .08)); break;
      case "dust": this.noise(.6, .07); T(420, .6, "sine", .03, 0, 70); break;
      case "spare": T(880, .1, "triangle", .05); T(660, .25, "triangle", .05, .09); break;
      case "flee": [700, 560, 420, 300].forEach((f, i) => T(f, .06, "square", .03, i * .05)); break;
      case "encounter": T(880, .07, "square", .05); T(1320, .12, "square", .05, .07); break;
      case "bell": T(1046, .5, "sine", .06); T(1568, .7, "sine", .035, .06); break;
      case "item": T(659, .08, "triangle", .05); T(988, .16, "triangle", .05, .08); break;
      case "shatter": T(300, .1, "square", .06, 0, 100); this.noise(.35, .08, .08); break;
      case "levelup": [392, 523, 659, 784].forEach((f, i) => T(f, .1, "square", .03, i * .06)); break;
      case "boom": this.noise(.45, .15); T(90, .45, "sawtooth", .08, 0, 30); break;
      case "buzz": T(110, .2, "sawtooth", .04, 0, 90); break;
      case "ring": for (let i = 0; i < 6; i++) T(i % 2 ? 1400 : 1200, .05, "square", .025, i * .05); break;
      case "warn": T(990, .05, "square", .025); break;
      case "door": T(220, .1, "triangle", .05); T(330, .12, "triangle", .04, .08); break;
    }
  }
};

const NOTE_IDX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function noteFreq(tok) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(tok);
  if (!m) return 0;
  const n = NOTE_IDX[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  const midi = 12 * (parseInt(m[3], 10) + 1) + n;
  return 440 * Math.pow(2, (midi - 69) / 12);
}
function parseTrack(s) { return s.trim().split(/\s+/).map(t => t === "-" ? -1 : t === "." ? 0 : noteFreq(t)); }

const Music = {
  name: null, song: null, step: 0, next: 0,
  play(name) {
    if (name === this.name) return;
    this.name = name || null;
    this.song = name ? SONGS[name] : null;
    if (this.song && !this.song._p) this.song._p = this.song.tracks.map(t => parseTrack(t.n));
    this.step = 0;
    if (Sound.ac) this.next = Sound.ac.currentTime + .08;
  },
  stop() { this.play(null); },
  update() {
    const ac = Sound.ac;
    if (!ac || !this.song) return;
    if (this.next < ac.currentTime) this.next = ac.currentTime + .05;
    const sd = 60 / this.song.bpm / 2;
    let guard = 0;
    while (this.next < ac.currentTime + .25 && guard++ < 64) {
      this.song.tracks.forEach((tr, i) => {
        const seq = this.song._p[i];
        const idx = this.step % seq.length, tok = seq[idx];
        if (tok > 0) {
          let len = 1;
          while (len < seq.length && seq[(idx + len) % seq.length] === -1) len++;
          Sound.tone(tok, sd * len * .95, tr.w, tr.v, this.next - ac.currentTime, 0, Sound.mus);
        }
      });
      this.next += sd; this.step++;
    }
  }
};

/* ---------- drawing helpers ---------- */
function setFont(size) { ctx.font = `${size}px ${FONT}`; }
function txt(s, x, y, col = "#fff", size = 28, align = "left") {
  setFont(size); ctx.textAlign = align; ctx.textBaseline = "top"; ctx.fillStyle = col;
  ctx.fillText(s, x, y);
}
const _wrap = new Map();
function wrapText(s, maxW, size) {
  const key = s + "|" + maxW + "|" + size;
  let r = _wrap.get(key);
  if (r) return r;
  setFont(size); r = [];
  for (const para of s.split("\n")) {
    let line = "";
    for (const w of para.split(" ")) {
      const test = line ? line + " " + w : w;
      if (line && ctx.measureText(test).width > maxW) { r.push(line); line = w; } else line = test;
    }
    r.push(line);
  }
  if (_wrap.size > 600) _wrap.clear();
  _wrap.set(key, r);
  return r;
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => _wrap.clear());

function drawTyped(full, n, x, y, maxW, size = 28, col = "#fff", lh = 1.12) {
  const lines = wrapText(full, maxW, size);
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (n <= 0) break;
    txt(l.slice(0, n), x, y + i * size * lh, col, size);
    n -= l.length + 1;
  }
}

class Typer {
  constructor(text, opt = {}) {
    this.full = text || ""; this.n = 0; this.t = 0;
    this.speed = opt.speed || 48; this.voice = opt.voice === undefined ? 220 : opt.voice;
    this.done = this.full.length === 0;
  }
  update(dt) {
    if (this.done) return;
    this.t += dt * this.speed;
    while (this.t >= 1 && !this.done) {
      this.t -= 1;
      const ch = this.full[this.n++];
      if (ch && ch !== " " && ch !== "\n" && ch !== "*" && this.n % 2 === 0 && this.voice) Sound.sfx("text", this.voice);
      if (ch && ",.!?".includes(ch) && this.full[this.n] === " ") this.t -= 3;
      if (this.n >= this.full.length) this.done = true;
    }
  }
  skip() { this.n = this.full.length; this.done = true; }
}

function frame(x, y, w, h, border = "#fff", bw = 4, fill = "#000") {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = border;
  ctx.fillRect(x, y, w, bw); ctx.fillRect(x, y + h - bw, w, bw);
  ctx.fillRect(x, y, bw, h); ctx.fillRect(x + w - bw, y, bw, h);
}

function bmp(rows, pal, x, y, s = 2, flip = false) {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const col = pal[row[c]];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(x + (flip ? row.length - 1 - c : c) * s, y + r * s, s, s);
    }
  }
}

const HEART = [
  ".XX...XX.",
  "XXXX.XXXX",
  "XXXXXXXXX",
  "XXXXXXXXX",
  ".XXXXXXX.",
  "..XXXXX..",
  "...XXX...",
  "....X...."
];
function drawHeart(cx, cy, col = "#ff2b45", s = 2) {
  bmp(HEART, { X: col }, Math.round(cx - 4.5 * s), Math.round(cy - 4 * s), s);
}
const HEART_BROKEN_L = [".XX..", "XXXX.", "XXXXX", "XXXX.", ".XXXX", "..XX.", "...XX", "....X"];
const HEART_BROKEN_R = ["..XX.", ".XXXX", "XXXXX", ".XXXX", "XXXX.", "XXX..", "XX...", "X...."];

/* Fade overlay */
const Fade = {
  a: 1, target: 0, speed: 3, cb: null,
  out(cb, speed = 3) { this.target = 1; this.speed = speed; this.cb = cb || null; },
  in(cb, speed = 3) { this.target = 0; this.speed = speed; this.cb = cb || null; },
  update(dt) {
    if (this.a < this.target) this.a = Math.min(this.target, this.a + this.speed * dt);
    else if (this.a > this.target) this.a = Math.max(this.target, this.a - this.speed * dt);
    if (this.a === this.target && this.cb) { const c = this.cb; this.cb = null; c(); }
  },
  draw() { if (this.a > 0) { ctx.fillStyle = `rgba(0,0,0,${this.a})`; ctx.fillRect(0, 0, CW, CH); } }
};
