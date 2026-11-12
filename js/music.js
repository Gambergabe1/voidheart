"use strict";
/* ============================================================
   VOIDHEART — music engine v2 and the soundtrack's themes
   Loaded after every content file, before main.js.

   Track options (all optional, old songs keep working):
     w     "square" | "triangle" | "sawtooth" | "sine" | "pulse25" | "pulse12" | "drums"
     env   "pluck" (default) | "lead" (sustained) | "pad" (soft attack)
     vib   vibrato depth as a fraction of pitch (e.g. .008)
     echo  true → sent to the tempo-synced echo
     mood  "calm" → only while the enemy can be spared; "intense" → only while it can't
   Notes: "C4", chords "C4+E4+G4", "-" hold, "." rest. Drums: k s h (kick, snare, hat).
   Song name + "~void" plays it slow and low, for erased places.

   Recurring melodies:
     THEME  the VOIDHEART theme (title, the Last Page, VANTA, PALIMPSEST, endings)
     JUNI   Juni's four-note whistle (Hollowmere, PALIMPSEST when calm, Episode 3's ending)
   ============================================================ */
const MUS = { waves: {}, echoIn: null, delay: null, noise: null };

function musWave(ac, type) {
  if (!type.startsWith("pulse")) return null;
  if (MUS.waves[type]) return MUS.waves[type];
  const d = type === "pulse12" ? .125 : .25, n = 32, re = new Float32Array(n), im = new Float32Array(n);
  for (let i = 1; i < n; i++) im[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * d);
  return (MUS.waves[type] = ac.createPeriodicWave(re, im));
}
function musInit() {
  const ac = Sound.ac;
  if (MUS.echoIn || !ac) return;
  const d = ac.createDelay(1.5), fb = ac.createGain(), wet = ac.createGain();
  d.delayTime.value = .3; fb.gain.value = .3; wet.gain.value = .32;
  MUS.echoIn = ac.createGain();
  MUS.echoIn.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(Sound.mus);
  MUS.delay = d;
  const len = Math.floor(ac.sampleRate * .25), b = ac.createBuffer(1, len, ac.sampleRate), ch = b.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
  MUS.noise = b;
}
function musParse(tr) {
  return tr.n.trim().split(/\s+/).map(t => t === "-" ? -1 : t === "." ? 0 : tr.w === "drums" ? t : t.split("+").map(noteFreq));
}
function musVoice(tr, freqs, dur, when, warp) {
  const ac = Sound.ac, t = ac.currentTime + Math.max(0, when), env = tr.env || "pluck";
  const v = tr.v / Math.sqrt(freqs.length) * (warp ? .85 : 1);
  for (const f0 of freqs) {
    if (!f0) continue;
    const o = ac.createOscillator(), g = ac.createGain(), pw = musWave(ac, tr.w);
    if (pw) o.setPeriodicWave(pw); else o.type = tr.w;
    const f = f0 * (warp ? warp.pitch : 1);
    o.frequency.setValueAtTime(f, t);
    if (tr.vib && dur > .2) {
      const l = ac.createOscillator(), lg = ac.createGain();
      l.frequency.value = 5.5; lg.gain.value = f * tr.vib;
      l.connect(lg); lg.connect(o.frequency);
      l.start(t + Math.min(.14, dur * .3)); l.stop(t + dur + .05);
    }
    if (env === "pad") {
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + Math.min(.09, dur * .3));
      g.gain.setValueAtTime(v, t + dur * .8); g.gain.linearRampToValueAtTime(.0001, t + dur);
    } else if (env === "lead") {
      g.gain.setValueAtTime(v, t); g.gain.linearRampToValueAtTime(v * .7, t + dur * .6); g.gain.linearRampToValueAtTime(.0001, t + dur);
    } else {
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    }
    o.connect(g); g.connect(Sound.mus);
    if (tr.echo && MUS.echoIn) g.connect(MUS.echoIn);
    o.start(t); o.stop(t + dur + .05);
  }
}
function musDrum(ch, v, when) {
  const ac = Sound.ac, t = ac.currentTime + Math.max(0, when);
  if (ch === "k") {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + .12);
    g.gain.setValueAtTime(v * 1.8, t); g.gain.exponentialRampToValueAtTime(.0001, t + .14);
    o.connect(g); g.connect(Sound.mus); o.start(t); o.stop(t + .16);
    return;
  }
  if (!MUS.noise) return;
  const src = ac.createBufferSource(), hp = ac.createBiquadFilter(), g = ac.createGain(), snare = ch === "s";
  src.buffer = MUS.noise; hp.type = "highpass"; hp.frequency.value = snare ? 1800 : 7000;
  const d = snare ? .12 : .035;
  g.gain.setValueAtTime(snare ? v : v * .5, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  src.connect(hp); hp.connect(g); g.connect(Sound.mus); src.start(t); src.stop(t + d + .02);
}

Object.assign(Music, {
  warp: null,
  play(name) {
    if (name === this.name) return;
    this.name = name || null;
    let base = name; this.warp = null;
    if (name && name.endsWith("~void")) { base = name.slice(0, -5); this.warp = { pitch: Math.pow(2, -5 / 12), rate: .62 }; }
    this.song = base ? SONGS[base] : null;
    if (this.song && !this.song._q) this.song._q = this.song.tracks.map(musParse);
    this.step = 0;
    if (Sound.ac) this.next = Sound.ac.currentTime + .08;
  },
  update() {
    const ac = Sound.ac;
    if (!ac || !this.song) return;
    musInit();
    const calm = Scene.cur === "battle" && Battle.e && Battle.state !== "done" && !Battle.e.dying && Battle.canSpare();
    if (this.next < ac.currentTime) this.next = ac.currentTime + .05;
    const sd = 60 / this.song.bpm / 2 / (this.warp ? this.warp.rate : 1);
    if (MUS.delay) MUS.delay.delayTime.value = Math.min(1.4, sd * 3);
    let guard = 0;
    while (this.next < ac.currentTime + .25 && guard++ < 64) {
      const when = this.next - ac.currentTime;
      this.song.tracks.forEach((tr, i) => {
        if (tr.mood === "calm" && !calm) return;
        if (tr.mood === "intense" && calm) return;
        const seq = this.song._q[i], idx = this.step % seq.length, tok = seq[idx];
        if (tr.w === "drums") { if (!calm && !this.warp && typeof tok === "string") musDrum(tok, tr.v, when); return; }
        if (!Array.isArray(tok)) return;
        let len = 1;
        while (len < seq.length && seq[(idx + len) % seq.length] === -1) len++;
        musVoice(tr, tok, sd * len * (tr.env === "pad" ? 1 : .95), when, this.warp);
      });
      this.next += sd; this.step++;
    }
  }
});

/* ---------- composing helpers ---------- */
const MUS_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
/* transpose a note string by n semitones */
function musShift(s, n) {
  return s.trim().split(/\s+/).map(tok => tok === "-" || tok === "." ? tok : tok.split("+").map(t => {
    const m = /^([A-G])([#b]?)(-?\d)$/.exec(t);
    if (!m) return t;
    const midi = 12 * (parseInt(m[3], 10) + 1) + NOTE_IDX[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + n;
    return MUS_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
  }).join("+")).join(" ");
}
const musRep = (s, n) => Array(n).fill(s.trim()).join(" ");
/* one bar of driving octave bass on a root like "D2" */
const musDrive = root => { const hi = musShift(root, 12); return `${root} ${root} ${hi} ${root} ${root} ${hi} ${root} ${hi}`; };
/* one bar: root on beat 1, fifth-ish on beat 3 */
const musWalk = (a, b) => `${a} - - - ${b} - - -`;
const musHold = ch => `${ch} - - - - - - -`;

/* ---------- the two recurring melodies ---------- */
/* THE VOIDHEART THEME (D minor / F major). A asks, B answers. */
const THEME_A = "D5 - - A4 D5 - E5 F5  E5 - - C5 A4 - - -  A#4 - - F4 A#4 - C5 D5  C5 - A4 - A4 - - -";
const THEME_B = "F5 - - D5 F5 - G5 A5  G5 - - E5 C5 - - -  A#4 - - D5 F5 - E5 D5  E5 - C#5 - D5 - - -";
const THEME_B_MAJOR = "F5 - - D5 F5 - G5 A5  G5 - - E5 C5 - - -  A#4 - - D5 F5 - E5 D5  G5 - E5 - F5 - - -";
const THEME = THEME_A + " " + THEME_B;
const THEME_PADS = [musHold("D3+F3+A3"), musHold("A2+C3+E3"), musHold("A#2+D3+F3"), musHold("F2+A2+C3"),
  musHold("D3+F3+A3"), musHold("C3+E3+G3"), musHold("A#2+D3+F3"), musHold("A2+C#3+E3")].join(" ");
const THEME_PADS_MAJOR = [musHold("F3+A3+C4"), musHold("C3+E3+G3"), musHold("A#2+D3+F3"), musHold("F3+A3+C4"),
  musHold("F3+A3+C4"), musHold("C3+E3+G3"), musHold("A#2+D3+F3"), "C3+E3+G3 - - - F3+A3+C4 - - -"].join(" ");
/* JUNI'S WHISTLE (G major): four notes. In the story the fourth always comes out wrong;
   the soundtrack plays it the way it was meant to go. */
const JUNI = "G5 B5 A5 D6";

/* ---------- the soundtrack ---------- */
Object.assign(SONGS, {
  /* Title: the theme, slow, with echo */
  title: { bpm: 80, tracks: [
    { w: "pulse25", v: .034, env: "lead", vib: .006, echo: true, n: THEME },
    { w: "triangle", v: .03, env: "pad", n: THEME_PADS },
    { w: "sine", v: .06, env: "pad", n: [musWalk("D2", "A2"), musWalk("A1", "E2"), musWalk("A#1", "F2"), musWalk("F1", "C2"), musWalk("D2", "A2"), musWalk("C2", "G2"), musWalk("A#1", "F2"), musWalk("A1", "E2")].join(" ") },
    { w: "square", v: .007, echo: true, n: "A5 . . . . . D6 . . . . . . . . ." }] },
  /* The Last Page: the theme as a music box, just before VANTA */
  lastpage: { bpm: 66, tracks: [
    { w: "sine", v: .05, echo: true, n: musShift(THEME_A, 12) + " " + musShift(THEME_B, 12) },
    { w: "triangle", v: .022, env: "pad", n: THEME_PADS },
    { w: "sine", v: .05, env: "pad", n: [musHold("D2"), musHold("A1"), musHold("A#1"), musHold("F2"), musHold("D2"), musHold("C2"), musHold("A#1"), musHold("A1")].join(" ") }] },
  /* VANTA: the theme, driving. Softens when VANTA can be spared */
  vanta: { bpm: 138, tracks: [
    { w: "pulse25", v: .03, env: "lead", vib: .005, n: THEME },
    { w: "pulse12", v: .012, mood: "intense", n: musShift(THEME_A, -12) + " " + musShift(THEME_B, -12) },
    { w: "triangle", v: .075, mood: "intense", n: ["D2", "A1", "A#1", "F2", "D2", "C2", "A#1", "A1"].map(musDrive).join(" ") },
    { w: "triangle", v: .04, env: "pad", mood: "calm", n: THEME_PADS },
    { w: "drums", v: .05, n: "k . h . s . h . k k h . s . h h" }] },
  /* VANTA on the kill route: the theme, bent */
  vantavoid: { bpm: 160, tracks: [
    { w: "sawtooth", v: .02, n: "D5 D5 . A4 D5 . E5 F5  E5 E5 . C5 A4 . . .  A#4 A#4 . F4 A#4 . C5 C#5  C5 . A4 . G#4 . A4 ." },
    { w: "triangle", v: .08, n: ["D2", "D2", "A#1", "A1"].map(musDrive).join(" ") },
    { w: "drums", v: .055, n: "k k s k k s k s" }] },
  /* Episode 1's good ending: Quill's melody, then the theme turned major */
  ending: { bpm: 84, tracks: [
    { w: "pulse25", v: .034, env: "lead", vib: .006, echo: true,
      n: "E5 - G5 - C6 - B5 - A5 - G5 - E5 - - - D5 - E5 - G5 - A5 - G5 - E5 - D5 - - - E5 - G5 - C6 - D6 - E6 - D6 - C6 - - - B5 - A5 - G5 - E5 - D5 - C5 - C5 - - - " + THEME_A + " " + THEME_B_MAJOR },
    { w: "sine", v: .065, env: "pad",
      n: "C3 - - - G3 - - - A2 - - - F2 - - - C3 - - - G3 - - - F2 - - - G2 - - - A2 - - - E3 - - - F2 - - - C3 - - - F2 - - - G2 - - - C3 - - - - - - - "
        + [musWalk("F2", "C3"), musWalk("C2", "G2"), musWalk("A#1", "F2"), musWalk("F2", "C3"), musWalk("F2", "C3"), musWalk("C2", "G2"), musWalk("A#1", "F2"), musWalk("C2", "F2")].join(" ") },
    { w: "triangle", v: .022, env: "pad", n: musRep(". . . . . . . .", 8) + " " + THEME_PADS_MAJOR }] },
  /* PALIMPSEST: the theme again, written over. Juni's whistle joins when it can be spared */
  palimpsest: { bpm: 128, tracks: [
    { w: "pulse25", v: .028, env: "lead", vib: .005, echo: true, n: THEME },
    { w: "triangle", v: .075, mood: "intense", n: ["D2", "A1", "A#1", "F2", "D2", "C2", "A#1", "A1"].map(musDrive).join(" ") },
    { w: "sawtooth", v: .009, mood: "intense", n: "A4 - - - - - - - E4 - - - - - - - F4 - - - - - - - C4 - - - - - - -" },
    { w: "triangle", v: .04, env: "pad", mood: "calm", n: THEME_PADS },
    { w: "sine", v: .04, env: "lead", vib: .012, echo: true, mood: "calm", n: musShift(JUNI, -2) + " - - - - . . . . . . . ." },
    { w: "drums", v: .05, n: "k . h . s . h k k . h . s . h ." }] },
  /* Episode 3's good ending: Juni's whistle grows into a tune, then the theme in G major */
  e3ending: { bpm: 84, tracks: [
    { w: "sine", v: .05, env: "lead", vib: .012, echo: true,
      n: "G5 B5 A5 D6 - - B5 -  A5 - G5 - E5 - - -  G5 B5 A5 E6 - - D6 -  B5 - A5 - G5 - - -  C6 - B5 A5 G5 - E5 -  D5 - G5 - A5 - B5 -  G5 B5 A5 D6 - - - -  G6 - - - - - - - "
        + musShift(THEME_A, 2) + " " + musShift(THEME_B_MAJOR, 2) },
    { w: "sine", v: .065, env: "pad",
      n: [musWalk("G2", "D3"), musWalk("C2", "G2"), musWalk("G2", "C3"), musWalk("D2", "G2"), musWalk("C2", "G2"), musWalk("G2", "D3"), musWalk("E2", "D2"), musHold("G2"),
        musWalk("G2", "D3"), musWalk("D2", "A2"), musWalk("C2", "G2"), musWalk("G2", "D3"), musWalk("G2", "D3"), musWalk("D2", "A2"), musWalk("C2", "G2"), musWalk("D2", "G2")].join(" ") },
    { w: "triangle", v: .022, env: "pad", n: musRep(". . . . . . . .", 8) + " " + musShift(THEME_PADS_MAJOR, 2) }] }
});

/* Hollowmere: Juni's whistle drifts through, now and then, before MILO knows what it is */
if (SONGS.hollow) SONGS.hollow.tracks.push({ w: "sine", v: .03, env: "lead", vib: .012, echo: true, n: JUNI + " - - - - " + musRep(". . . . . . . .", 7) });
/* gentle echo on the exploring themes */
for (const k of ["margins", "stacks", "well", "garden", "marg", "f_quarter"]) if (SONGS[k]) SONGS[k].tracks[0].echo = true;
/* drums for every battle theme that has none */
if (SONGS.battle) SONGS.battle.tracks.push({ w: "drums", v: .045, n: "k . h . s . h . k . h k s . h ." });
for (const d of Object.values(MONSTERS)) {
  const s = d.boss && d.music && SONGS[d.music];
  if (s && d.music !== "deadair" && !s.tracks.some(t => t.w === "drums")) s.tracks.push({ w: "drums", v: .045, n: "k . h . s . h . k k h . s . h ." });
}

/* erased places play their own theme, slow and low, instead of a drone */
{
  const mf = World.musicFor.bind(World);
  World.musicFor = function () {
    const r = mf();
    if (r !== "void") return r;
    const a = AREAS[this.def.area], m = a && a.music;
    return m && SONGS[m] ? m + "~void" : r;
  };
}

/* Juni's whistle as a sound: three notes right, the fourth cracks */
{
  const sfx = Sound.sfx.bind(Sound);
  Sound.sfx = function (n, p) {
    if (n !== "whistle") return sfx(n, p);
    if (!this.ac) return;
    const f = JUNI.split(" ").map(noteFreq);
    this.tone(f[0], .2, "sine", .07, 0); this.tone(f[1], .2, "sine", .07, .22); this.tone(f[2], .2, "sine", .07, .44);
    this.tone(f[3] * 1.02, .32, "sine", .07, .66, f[3] * .92);
  };
  const hook = (mon, act) => {
    const d = MONSTERS[mon];
    if (!d || !d.acts || !d.acts[act]) return;
    const fn = d.acts[act];
    d.acts[act] = e => { Sound.sfx("whistle"); return fn(e); };
  };
  hook("happilyever", "Whistle"); hook("milorevised", "Whistle"); hook("palimpsest", "Call Juni");
}
