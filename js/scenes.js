"use strict";
/* ============================================================
   VOIDHEART — scenes: title, intro, game over, endings
   ============================================================ */
const Scene = { cur: "title", set(n) { this.cur = n; } };

const ENDING_INFO = {
  pacifist: { ep: 1, n: 1, name: "REMEMBERED", col: "#ffd84a" },
  neutral: { ep: 1, n: 2, name: "LEFT BEHIND", col: "#57dbff" },
  void: { ep: 1, n: 3, name: "UNWRITTEN", col: "#ff2b45" },
  restored: { ep: 2, n: 1, name: "RESTORED", col: "#ffd84a" },
  struck: { ep: 2, n: 2, name: "STRUCK THROUGH", col: "#ff2b45" }
};
const endingsOf = ep => Object.keys(ENDING_INFO).filter(k => ENDING_INFO[k].ep === ep);

/* ---------- title ---------- */
const Title = {
  idx: 0, opts: [], t: 0, confirm: 0, flakes: [],
  start() {
    Scene.set("title"); this.t = 0; this.idx = 0; this.confirm = 0; this.build();
    Music.play(Memory.data.last === "void" ? "void" : "title");
    this.flakes = Array.from({ length: 40 }, () => ({ x: rand(CW), y: rand(CH), v: rand(8, 30), r: rand(6), s: rand(3, 8) }));
    Fade.a = 1; Fade.in(null, 1.5);
  },
  build() {
    this.opts = [];
    if (hasSave()) this.opts.push("CONTINUE");
    this.opts.push("EPISODES");
    if (Memory.data.runs > 0 || hasSave() || Memory.data.pages.length) this.opts.push("ERASE MEMORY");
  },
  update(dt) {
    this.t += dt;
    for (const f of this.flakes) { f.y += f.v * dt; f.r += dt; if (f.y > CH + 10) { f.y = -10; f.x = rand(CW); } }
    if (Fade.a > .5) return;
    if (this.confirm) {
      if (Input.hit("left") || Input.hit("right")) { this.confirm = this.confirm === 1 ? 2 : 1; Sound.sfx("move"); }
      if (Input.hit("cancel")) { this.confirm = 0; Sound.sfx("back"); }
      if (Input.hit("ok")) {
        if (this.confirm === 1) { Memory.erase(); delSave(1); delSave(2); Store.del("vh_last"); Sound.sfx("dust"); Toast.show("MEMORY ERASED"); Music.play("title"); }
        else Sound.sfx("back");
        this.confirm = 0; this.build(); this.idx = 0;
      }
      return;
    }
    if (Input.hit("up")) { this.idx = (this.idx + this.opts.length - 1) % this.opts.length; Sound.sfx("move"); }
    if (Input.hit("down")) { this.idx = (this.idx + 1) % this.opts.length; Sound.sfx("move"); }
    if (Input.hit("ok")) {
      const o = this.opts[this.idx]; Sound.sfx("select");
      if (o === "CONTINUE") Fade.out(() => loadGame(), 2);
      else if (o === "ERASE MEMORY") this.confirm = 2;
      else Episodes.start();
    }
  },
  draw() {
    const vd = Memory.data.last === "void";
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    for (const f of this.flakes) {
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.r);
      ctx.fillStyle = vd ? "rgba(120,120,120,.25)" : "rgba(217,208,187,.18)"; ctx.fillRect(-f.s / 2, -f.s * .6, f.s, f.s * 1.2);
      ctx.restore();
    }
    const gl = Math.sin(this.t * 7) > .93 ? rand(-4, 4) : 0;
    txt("VOIDHEART", 320 - 3 + gl, 64, vd ? "#550010" : "#3a1a6a", 104, "center");
    txt("VOIDHEART", 320 + 3 - gl, 66, vd ? "#222" : "#0e3a4a", 104, "center");
    txt("VOIDHEART", 320, 64, vd ? "#9a9a9a" : "#f6f6f2", 104, "center");
    txt(vd ? "there is nothing left to forget." : "a story about what gets forgotten", 320, 158, vd ? "#ff2b45" : "#9a9aa4", 24, "center");
    const pulse = 1 + Math.sin(this.t * 3) * .06;
    const s = Math.round(5 * pulse);
    if (vd) {
      bmp(HEART_BROKEN_L, { X: "#5a5a5a" }, 320 - 5 * 5 - 4, 196, 5);
      bmp(HEART_BROKEN_R, { X: "#5a5a5a" }, 320 + 4, 196, 5);
    } else drawHeart(320, 216, "#ff2b45", s);
    this.opts.forEach((o, i) => {
      const y = 248 + i * 27, sel = i === this.idx && !this.confirm;
      if (sel) drawHeart(320 - 100, y + 13, "#ff2b45", 2);
      txt(o, 320, y, sel ? "#ffd84a" : "#fff", 29, "center");
    });
    if (this.confirm) {
      frame(110, 260, 420, 130);
      txt("Erase every loop? Even VANTA", 320, 276, "#fff", 28, "center");
      txt("will forget you.", 320, 304, "#fff", 28, "center");
      ["YES", "NO"].forEach((s2, i) => {
        const x = 250 + i * 140, sel = this.confirm === i + 1;
        if (sel) drawHeart(x - 30, 354, "#ff2b45", 2);
        txt(s2, x, 340, sel ? "#ffd84a" : "#fff", 30, "center");
      });
    }
    const E = Memory.data.endings;
    const epRows = EPISODES.filter(ep => ep.playable).map(ep => ep.n);
    epRows.forEach((ep, r) => {
      const ks = endingsOf(ep), y = 394 + r * 18;
      txt(`EP${ep}`, 40, y, "#444", 19);
      ks.forEach((k, i) => {
        const inf = ENDING_INFO[k], x = 150 + i * 170;
        txt(E[k] ? inf.name : "? ? ?", x, y, E[k] ? inf.col : "#333", 19, "center");
      });
    });
    if (typeof Jn !== "undefined" && Jn.percent() > 0) txt(`${Jn.percent()}% complete`, 600, 448, "#be6cff", 20, "right");
    txt("Z confirm · X cancel · C menu · M mute · F fullscreen", 40, 448, "#555", 20);
    if (!document.hasFocus() && Math.floor(this.t * 2) % 2) txt("click the screen to play", 320, 250, "#ffd84a", 26, "center");
  }
};

/* ---------- episode select ---------- */
const Episodes = {
  start() { Scene.set("episodes"); this.idx = 0; this.mode = "list"; this.sub = 0; this.msg = ""; this.t = 0; },
  status(n) {
    const e = Memory.data.eps[n], def = EPISODES[n - 1];
    if (!def || !def.playable) return { lock: true, soon: true, text: "COMING SOON", col: "#555" };
    if (n > 1 && !Memory.data.eps[n - 1]) return { lock: true, text: `LOCKED - finish Episode ${n - 1} first`, col: "#555" };
    if (hasSave(n)) return { text: "IN PROGRESS", col: "#57dbff" };
    if (e) return { text: `COMPLETE - ${ENDING_INFO[e.ending].name}`, col: ENDING_INFO[e.ending].col };
    return { text: "NOT STARTED", col: "#9a9aa4" };
  },
  go(n, cont) {
    Sound.sfx("select");
    if (cont) Fade.out(() => loadGame(n), 2);
    else Fade.out(() => Intro.start(n), 2);
  },
  update(dt) {
    this.t += dt;
    if (Fade.target === 1) return;
    if (this.mode === "choose") {
      if (Input.hit("up") || Input.hit("down")) { this.sub = 1 - this.sub; Sound.sfx("move"); }
      if (Input.hit("cancel")) { this.mode = "list"; Sound.sfx("back"); }
      else if (Input.hit("ok")) this.go(EPISODES[this.idx].n, this.sub === 0);
      return;
    }
    if (Input.hit("up")) { this.idx = (this.idx + EPISODES.length - 1) % EPISODES.length; Sound.sfx("move"); this.msg = ""; }
    if (Input.hit("down")) { this.idx = (this.idx + 1) % EPISODES.length; Sound.sfx("move"); this.msg = ""; }
    if (Input.hit("cancel")) { Sound.sfx("back"); Title.start(); return; }
    if (Input.hit("ok")) {
      const n = EPISODES[this.idx].n, st = this.status(n);
      if (st.lock) { Sound.sfx("buzz"); this.msg = st.soon ? `Episode ${n} isn't written yet.` : `Reach any ending in Episode ${n - 1} to open this.`; return; }
      if (hasSave(n)) { this.mode = "choose"; this.sub = 0; Sound.sfx("select"); return; }
      this.go(n, false);
    }
  },
  draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    txt("EPISODES", 320, 18, "#f6f6f2", 48, "center");
    EPISODES.forEach((ep, i) => {
      const y = 70 + i * 86, st = this.status(ep.n), sel = i === this.idx;
      frame(60, y, 520, 78, sel ? "#ffd84a" : st.lock ? "#333" : "#777", 3);
      if (sel) drawHeart(84, y + 39, "#ff2b45", 2);
      txt(`EPISODE ${ep.n}`, 108, y + 6, st.lock ? "#444" : "#9a9aa4", 20);
      txt(st.soon ? "? ? ?" : ep.title, 108, y + 24, st.lock ? "#555" : "#fff", 30);
      txt(st.text, 560, y + 6, st.col, 19, "right");
      txt(st.soon ? "" : ep.sub, 108, y + 52, "#777", 19);
    });
    if (this.msg) txt(this.msg, 320, 418, "#ff9d3f", 22, "center");
    txt("Z select · X back", 320, 448, "#555", 20, "center");
    if (this.mode === "choose") {
      frame(200, 170, 240, 120);
      ["CONTINUE", "START OVER"].forEach((s, i) => {
        const y = 192 + i * 40, sel = i === this.sub;
        if (sel) drawHeart(236, y + 14, "#ff2b45", 2);
        txt(s, 256, y, sel ? "#ffd84a" : "#fff", 30);
      });
    }
  }
};

/* ---------- intro ---------- */
const EP1_SLIDES = [
    { t: "", art: "epcard" },
    { t: "Everything that is forgotten goes somewhere.", art: "fall" },
    { t: "Old toys. Unsent letters. Songs nobody hums anymore.", art: "fall" },
    { t: "They sink down, past the dark, into the ARCHIVE.", art: "shelves" },
    { t: "There, a keeper named VANTA decides which memories continue...", art: "vanta" },
    { t: "...and which are erased.", art: "vanta2" },
    { t: "One evening, a kid named MILO chased a lost page a little too far.", art: "milo" },
    { t: "...", art: "black" }
];
const Intro = {
  start(ep = 1) {
    Scene.set("intro"); this.ep = ep; this.i = 0; this.t = 0;
    this.slides = ep === 2 ? ep2IntroSlides(Memory.data.eps[1]) : EP1_SLIDES;
    this.typer = new Typer(this.slides[0].t, { speed: 30, voice: 160 });
    Music.play(ep === 2 ? "well" : "title"); Fade.a = 1; Fade.in();
  },
  update(dt) {
    this.t += dt; this.typer.update(dt);
    if (Fade.a > 0 && Fade.target === 1) return;
    if (Input.hit("cancel")) { Fade.out(() => beginLoop(this.ep), 2); return; }
    if (Input.hit("ok")) {
      if (!this.typer.done) { this.typer.skip(); return; }
      this.i++;
      if (this.i >= this.slides.length) { Fade.out(() => beginLoop(this.ep), 1.5); return; }
      this.typer = new Typer(this.slides[this.i].t, { speed: 30, voice: 160 }); this.t = 0;
    }
  },
  draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    const s = this.slides[Math.min(this.i, this.slides.length - 1)];
    if (s.art !== "black") {
      frame(116, 36, 408, 240, "#f6f6f2", 3);
      ctx.save(); ctx.beginPath(); ctx.rect(119, 39, 402, 234); ctx.clip();
      drawArt(s.art, 320, 156, this.t);
      ctx.restore();
    }
    drawTyped(this.typer.full, this.typer.n, 80, 310, 480, 30);
    txt("X: skip", CW - 16, CH - 26, "#444", 20, "right");
  }
};

function drawArt(kind, cx, cy, t) {
  switch (kind) {
    case "fall": {
      for (let i = 0; i < 14; i++) {
        const x = cx - 190 + (i * 53) % 380, y = ((cy - 120) + (t * 30 + i * 47) % 260);
        ctx.save(); ctx.translate(x, y); ctx.rotate(t + i);
        ctx.fillStyle = ["#efe6cf", "#be6cff", "#57dbff", "#ff9d3f"][i % 4]; ctx.fillRect(-6, -8, 12, 16); ctx.restore();
      }
      break;
    }
    case "shelves": {
      for (let c = 0; c < 6; c++) for (let r = 0; r < 4; r++) drawTile("B", cx - 192 + c * 64, cy - 110 + r * 64, c * 3, r * 2, PAL.stacks, t, "stacks", { tile: () => "." });
      ctx.fillStyle = "rgba(0,0,0,.4)"; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      break;
    }
    case "vanta": case "vanta2": {
      ctx.save(); ctx.translate(cx, cy + 110); ctx.scale(.9, .9); ctx.translate(-165, -217);
      drawVanta(t * 1000, { hp: 1, maxhp: 1, mood: 0, void: kind === "vanta2" }); ctx.restore();
      break;
    }
    case "milo": {
      const y = cy - 40 + Math.sin(t * 2) * 6 + Math.min(80, t * 20);
      ctx.save(); ctx.translate(cx, y); ctx.rotate(Math.sin(t) * .3); drawMilo(0, 16, "down", 1); ctx.restore();
      ctx.save(); ctx.translate(cx + 40, y - 40 + Math.sin(t * 3) * 10); ctx.rotate(t * 1.5);
      ctx.fillStyle = "#efe6cf"; ctx.fillRect(-7, -9, 14, 18); ctx.restore();
      break;
    }
    case "door": {
      const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 200);
      g.addColorStop(0, "#fff8e0"); g.addColorStop(1, "#2a2040");
      ctx.fillStyle = g; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      ctx.fillStyle = "#fff"; ctx.fillRect(cx - 40, cy - 90, 80, 150);
      drawMilo(cx, cy + 100, "up", 0);
      break;
    }
    case "crowd": {
      ctx.fillStyle = "#1c1830"; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      const g = ctx.createLinearGradient(0, cy - 120, 0, cy + 120); g.addColorStop(0, "rgba(255,248,224,.5)"); g.addColorStop(1, "rgba(255,248,224,0)");
      ctx.fillStyle = g; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      const ids = [...new Set((G ? G.spared : []).map(i => i.startsWith("smudge_") ? i.slice(7) : i))].filter(i => i !== "vanta" && i !== "redact" && MON_DRAW[i]).slice(0, 10);
      const n = ids.length + 1, sp = Math.min(70, 380 / Math.max(1, n));
      NPC_DRAW.quill(cx - (n - 1) * sp / 2, cy + 60, t, 2);
      ids.forEach((id, i) => MON_DRAW[id](cx - (n - 1) * sp / 2 + (i + 1) * sp, cy + 70 - (i % 2) * 40, t, { hp: 1, maxhp: 1, sp: 100 }, id === "brasswick" ? 1.2 : id === "footnote" ? 2 : 1.8));
      drawMilo(cx, cy + 116, "up", 0);
      break;
    }
    case "alone": {
      const g = ctx.createLinearGradient(0, cy - 120, 0, cy + 120); g.addColorStop(0, "#ffcf8a"); g.addColorStop(1, "#5a3a6a");
      ctx.fillStyle = g; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      ctx.fillStyle = "#fff4c0"; ctx.beginPath(); ctx.arc(cx + 90, cy - 40, 30, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2a1a30"; ctx.fillRect(cx - 200, cy + 70, 400, 50);
      drawMilo(cx - 60, cy + 76, "right", 0);
      break;
    }
    case "phone": {
      ctx.fillStyle = "#120a10"; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      MON_DRAW.dialtone(cx, cy + 70, t, { ans: 0 }, 5);
      for (let i = 0; i < 3; i++) { ctx.strokeStyle = `rgba(255,107,122,${.6 - i * .18})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 70 + i * 24 + (t * 30) % 24, -2.4, -.7); ctx.stroke(); }
      break;
    }
    case "break": {
      ctx.save(); ctx.globalAlpha = Math.max(0, 1 - t * .25); ctx.translate(cx, cy + 110); ctx.scale(.9, .9); ctx.translate(-165, -217);
      drawVanta(t * 1000, { hp: 0, maxhp: 1, mood: 0 }); ctx.restore();
      for (let i = 0; i < 40; i++) {
        const r = hash(i, 7), y = cy + 80 - ((t * 40 + r * 300) % 260);
        ctx.fillStyle = i % 2 ? "#be6cff" : "#d9d3e8"; ctx.fillRect(cx - 150 + r * 300, y, 4, 4);
      }
      break;
    }
    case "white": ctx.fillStyle = "#f4f2ff"; ctx.fillRect(cx - 200, cy - 120, 400, 240); break;
    case "epcard": {
      const ep = EPISODES[(Intro.ep || 1) - 1];
      ctx.fillStyle = "#06060a"; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      ctx.globalAlpha = Math.min(1, t);
      txt(`EPISODE ${ep.n}`, cx, cy - 64, "#9a9aa4", 30, "center");
      txt(ep.title, cx, cy - 26, "#f6f6f2", 50, "center");
      ctx.fillStyle = "#be6cff"; ctx.fillRect(cx - 90, cy + 34, 180, 2);
      txt(ep.sub, cx, cy + 48, "#777", 20, "center");
      ctx.globalAlpha = 1;
      break;
    }
    case "redactCalm": case "redactBreak": {
      ctx.fillStyle = "#14130f"; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      if (kind === "redactBreak") ctx.globalAlpha = Math.max(0, 1 - t * .25);
      MON_DRAW.redact(cx, cy + 110, t, { sp: kind === "redactCalm" ? 100 : 0 }, 3.4);
      ctx.globalAlpha = 1;
      if (kind === "redactBreak") for (let i = 0; i < 30; i++) {
        const r = hash(i, 3), y = cy + 80 - ((t * 40 + r * 300) % 260);
        ctx.fillStyle = i % 2 ? "#f6f6f2" : "#1a1a1e"; ctx.fillRect(cx - 80 + r * 160, y, 5, 5);
      }
      break;
    }
    case "book": {
      ctx.fillStyle = "#0b0b10"; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      ctx.fillStyle = "#5a3c78"; ctx.fillRect(cx - 150, cy - 90, 300, 190);
      ctx.fillStyle = "#efe6cf"; ctx.fillRect(cx - 142, cy - 84, 140, 178); ctx.fillRect(cx + 2, cy - 84, 140, 178);
      ctx.fillStyle = "#b9ae95";
      for (let i = 0; i < 9; i++) { ctx.fillRect(cx - 130, cy - 70 + i * 18, 110, 2); }
      ctx.fillStyle = "#3a3540"; ctx.fillRect(cx - 1, cy - 84, 2, 178);
      break;
    }
    case "black": break;
  }
}

/* ---------- start a new loop ---------- */
function beginLoop(ep = 1) {
  G = freshGame(ep, ep === 2 ? Memory.data.eps[1] : null); delSave(ep);
  Timers.clear();
  Scene.set("world"); World.busy = true;
  if (ep === 2) {
    World.enter("e2_well", 8, 8, "down");
    Fade.a = 1;
    Fade.in(() => Timers.after(3, ep2Arrival), 1);
    return;
  }
  World.enter("m_fall", 4, 4, "down");
  Fade.a = 1;
  Fade.in(() => {
    Timers.after(2.6, () => {
      World.spawn({ k: "npc", id: "quill", tx: 9, ty: 5, alpha: 0, appearing: true, talk: () => [] });
      Sound.sfx("bell");
      Timers.after(.9, () => Dialog.open(introQuillLines(), () => {
        World.fadeEnt("quill"); World.busy = false; saveGame();
      }));
    });
  }, 1);
}

/* ---------- game over ---------- */
const GameOver = {
  start(x, y) {
    Scene.set("gameover"); this.t = 0; this.x = x; this.y = y; this.phase = 0; this.shards = []; this.idx = 0; this.typer = null;
    Music.stop();
  },
  update(dt) {
    this.t += dt;
    if (this.phase === 0 && this.t > .7) { this.phase = 1; Sound.sfx("shatter"); }
    if (this.phase === 1 && this.t > 1.5) {
      this.phase = 2; Sound.sfx("shatter");
      for (let i = 0; i < 7; i++) this.shards.push({ x: this.x, y: this.y, vx: rand(-120, 120), vy: rand(-220, -60), r: rand(6) });
    }
    for (const s of this.shards) { s.vy += 420 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.r += dt * 6; }
    if (this.phase === 2 && this.t > 2.8) {
      this.phase = 3; Music.play("gameover");
      const vl = G.kills > 0 && G.spares === 0;
      this.typer = new Typer(vl ? "..." : pick([
        "MILO. Get up. The Archive isn't done with you yet.",
        "You're not forgotten. Not while I'm still here. Get up!",
        "Hey... don't let it end like this. Someone's still waiting for you.",
        "Things down here are counting on you to remember them. Get up."
      ]), { voice: 330, speed: 34 });
    }
    if (this.phase === 3) {
      this.typer.update(dt);
      if (Input.hit("ok")) { if (!this.typer.done) this.typer.skip(); else { this.phase = 4; Sound.sfx("select"); } }
    } else if (this.phase === 4) {
      if (Input.hit("left") || Input.hit("right")) { this.idx = 1 - this.idx; Sound.sfx("move"); }
      if (Input.hit("ok")) {
        Sound.sfx("select");
        if (this.idx === 0) Fade.out(() => { const ep = G.ep || 1; if (!loadGame(ep)) beginLoop(ep); }, 2);
        else Fade.out(() => Title.start(), 2);
        this.phase = 5;
      }
    }
  },
  draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    if (this.phase === 0) drawHeart(this.x, this.y, "#ff2b45", 2);
    else if (this.phase === 1) {
      bmp(HEART_BROKEN_L, { X: "#ff2b45" }, this.x - 11, this.y - 8, 2);
      bmp(HEART_BROKEN_R, { X: "#ff2b45" }, this.x + 1, this.y - 8, 2);
    } else for (const s of this.shards) {
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.r); ctx.fillStyle = "#ff2b45"; ctx.fillRect(-3, -3, 6, 6); ctx.restore();
    }
    if (this.phase >= 3) {
      const a = Math.min(1, (this.t - 2.8) / 1.5);
      ctx.globalAlpha = a;
      txt("SOUL", 320, 60, "#fff", 96, "center");
      txt("LOST", 320, 150, "#fff", 96, "center");
      ctx.globalAlpha = 1;
      if (this.typer) drawTyped(this.typer.full, this.typer.n, 110, 290, 420, 30);
    }
    if (this.phase >= 4) {
      ["CONTINUE", "TITLE"].forEach((s, i) => {
        const x = 220 + i * 200, sel = i === this.idx;
        if (sel) drawHeart(x - 78, 418, "#ff2b45", 2);
        txt(s, x, 404, sel ? "#ffd84a" : "#fff", 32, "center");
      });
    }
  }
};

/* ---------- endings ---------- */
const Ending = {
  start(type, info) {
    this.type = type; this.info = info || {}; this.ep = G.ep || 1;
    const carry = this.ep === 1
      ? { spared: [...G.spared], killed: [...G.killed], wt: G.wt, exp: G.exp, gold: G.gold, vantaAlive: !G.killed.includes("vanta") }
      : { restored: [...G.restored], named: !!this.info.named, spared: [...G.spared], killed: [...G.killed],
          wt: G.wt, exp: G.exp, gold: G.gold, vantaAlive: !!(G.carry && G.carry.vantaAlive),
          stet: !!G.flags.stetDone, shredder: G.flags.shredder || null };
    Memory.record(type, this.ep, carry); delSave(this.ep);
    this.pages = this.build();
    this.i = 0; this.t = 0; this.phase = "pages"; this.scroll = 0;
    this.typer = new Typer(this.pages[0].t, { speed: 34, voice: 180 });
    this.credits = this.buildCredits();
    Scene.set("ending");
    Music.play(type === "void" ? "void" : (type === "neutral" || type === "struck") ? "sad" : "ending");
    Fade.a = 1; Fade.in(null, 1);
  },
  build() {
    const P = (t, art) => ({ t, art });
    const spared = G.spared.filter(i => i !== "vanta").map(nameOf);
    const killed = G.killed.filter(i => i !== "vanta").map(nameOf);
    const c = G.carry || {}, vA = !!c.vantaAlive;
    if (this.type === "restored") {
      const back = G.restored.map(nameOf);
      const a = [P("* The black bar cracks. Light leaks out from behind it.", "redactCalm"),
        this.info.named ? P("REDACT: \"...SOL. I had forgotten I was ever called anything.\"", "redactCalm") : P("REDACT: \"...FILE CLOSED. I will stop the stamps.\"", "redactCalm")];
      if (vA) a.push(P("* VANTA steps into the office. For a long moment, neither of them says anything.", "redactCalm"),
        P(this.info.named ? "VANTA: \"...Sol. I am sorry. I thought losing you would hurt less than keeping you.\"" : "VANTA: \"I know your handwriting. I think... I used to write like that.\"", "redactCalm"),
        P("REDACT: \"It did not hurt less. For either of us.\"", "redactCalm"));
      else a.push(P("REDACT: \"The keeper is gone. Someone has to keep the Archive.\"", "redactCalm"), P("REDACT: \"...I will keep it. Without erasing. I will try.\"", "redactCalm"));
      a.push(P(back.length ? `* Upstairs, the white shelves fill back in. ${back.join(", ")} remember their own shapes.` : "* Upstairs, the white shelves slowly fill back in.", "crowd"));
      if (G.flags.stetDone) a.push(P("* In Carbon Town, forty copies of Mayor STET hold a very small, very blurry parade.", "crowd"));
      if (G.flags.shredder === "spare") a.push(P("* The Shredder spits out a mountain of saved scraps. Quill and Lint get out the tape.", "crowd"));
      if (c.ending !== "void") a.push(P("QUILL: \"You did it AGAIN. You'll have to stop doing that. People will start expecting it.\"", "crowd"));
      a.push(P("* You climb back up through the Ink Well. This time, the way stays open behind you.", "alone"));
      return a;
    }
    if (this.type === "struck") {
      const a = [P("* REDACT's stamp falls and cracks on the floor.", "redactBreak"),
        P("REDACT: \"...no one will remember... what I was...\"", "redactBreak"),
        P("* The erasing stops. But nothing that was erased comes back.", "white"),
        P("* Half the Archive stays white. A quiet, tidy, empty white.", "white")];
      if (vA) a.push(P("VANTA: \"...I knew that handwriting. Now I will never remember where from.\"", "black"));
      a.push(P("* You climb back up through the Ink Well alone.", "alone"));
      return a;
    }
    if (this.type === "pacifist") {
      return [
        P("* VANTA lowers its hands. The light behind its mask turns a soft, quiet blue.", "vantaCalm"),
        P("VANTA: \"I have kept this archive since before there were words for forgetting.\"", "vantaCalm"),
        P("VANTA: \"I thought keeping meant deciding. Who continues. Who is erased.\"", "vantaCalm"),
        P("VANTA: \"But you did not erase anyone. Not a single one.\"", "vantaCalm"),
        P("* The Last Page opens. Behind it, there is morning.", "door"),
        P(spared.length ? `* Quill arrives, out of breath. Then ${spared.join(", ")}.` : "* Quill arrives, out of breath. Then, slowly, everyone else.", "crowd"),
        P("QUILL: \"We heard the Archive go quiet. The good kind of quiet.\"", "crowd"),
        P("VANTA: \"Go home, MILO. And when you get there...\"", "vantaCalm"),
        P("VANTA: \"...remember us. That is all a forgotten thing ever wants.\"", "vantaCalm"),
        P("VANTA: \"...There is something under the Archive I have never told anyone about. Another time.\"", "vantaCalm"),
        ...(G.flags.deadair === "spare" ? [P("* On the way up, a radio in the dark turns itself on. A voice says: '...and that's the show. Goodnight, everybody.'", "alone")] : []),
        P("* You climb up into the light. Behind you, a hundred small voices hum the same song.", "alone"),
        P("* Somewhere in the Archive, a new page is written. It says: REMEMBERED.", "book")
      ];
    }
    if (this.type === "neutral") {
      const a = [];
      if (this.info.vantaKilled) a.push(P("* VANTA breaks apart into quiet violet pixels.", "break"), P("* With no one left to hold it, the Last Page drifts open on its own.", "door"));
      else a.push(P("* VANTA steps aside. \"Go. I will keep what you left behind.\"", "vantaCalm"), P("* The Last Page opens. Just wide enough for one.", "door"));
      a.push(P("* You climb out alone.", "alone"), P("* The surface is exactly how you left it. It feels smaller now.", "alone"));
      if (G.flags.deadair === "spare") a.push(P("* At 3 a.m. the kitchen radio turns on by itself: '...and that's the show. Goodnight, everybody.'", "alone"));
      if (!G.killed.includes("dialtone")) {
        a.push(P("* ...RING RING.", "phone"),
          P("DIAL TONE: \"...hello? It's me! Dial Tone! I patched into the surface line!\"", "phone"),
          P("DIAL TONE: \"Quill wanted you to know how things are down here.\"", "phone"));
        if (killed.length) a.push(P(`DIAL TONE: "We kept a quiet page for the ones who didn't come back. ${killed.join(", ")}."`, "phone"));
        a.push(this.info.vantaKilled
          ? P("DIAL TONE: \"Without VANTA, the Archive is coming loose. Things are being forgotten faster now.\"", "phone")
          : P("DIAL TONE: \"VANTA is still keeping the Archive. Grumpier than ever. It asked about you.\"", "phone"),
          P("DIAL TONE: \"...Anyway. You got out. That counts for something. Bye, MILO.\"", "phone"),
          P("* ...click.", "phone"));
      } else {
        a.push(P("* Somewhere far below, a shelf creaks.", "book"), P("* A phone that used to ring is silent now.", "book"), P("* Nobody calls.", "book"));
      }
      a.push(P("* Something was left behind. Maybe next loop... nothing has to be.", "book"));
      return a;
    }
    return [
      P("VANTA: \"So this is how the archive ends.\"", "break"),
      P("VANTA: \"Not forgotten...\"", "break"),
      P("VANTA: \"...erased.\"", "break"),
      P("* The violet light goes out.", "white"),
      P("* The shelves are empty. The fields are silent. The margins are blank.", "white"),
      P("* There is nothing left to forget.", "white"),
      P("* On the Last Page, there is one entry left.", "book"),
      P(`* It reads: MILO. WEIGHT ${G.wt}.`, "book"),
      P("* You close the book.", "black"),
      P("* ...", "black"),
      P("* Next loop, the Archive will remember this.", "black")
    ];
  },
  buildCredits() {
    const c = [{ t: "VOIDHEART", size: 64 }, { t: "a story about what gets forgotten", size: 24, col: "#9a9aa4" }, { gap: 40 }, { t: "- THE ARCHIVE -", size: 30, col: "#be6cff" }, { gap: 16 }];
    const list = this.ep === 2
      ? ["typo", "staple", "whiteout", ...Object.keys(MONSTERS).filter(k => k.startsWith("smudge_") && (G.spared.includes(k) || G.killed.includes(k))),
        "outline", "papercut", "watermark", "shredder", "ghostwriter", "duplicat", "crumbs", "redact"]
      : ["dogear", "inkling", "paperweight", "scribble", "bookwyrm", "shushling", "footnote", "overdue", "brasswick", "rerun", "glitchmoth", "dialtone", "feedback", "deadair", "vanta"];
    for (const id of list) {
      const st = G.spared.includes(id) ? [id.startsWith("smudge_") ? "RESTORED" : "REMEMBERED", "#ffd84a"] : G.killed.includes(id) ? ["ERASED", "#ff2b45"] : ["never met", "#555"];
      const base = id.startsWith("smudge_") ? id.slice(7) : id;
      c.push({ mon: base, t: id.startsWith("smudge_") ? `${nameOf(base)} (smudged)` : nameOf(id), st: st[0], col: st[1] });
    }
    c.push({ gap: 30 });
    if (this.ep === 2) c.push({ t: "LEDGER ........ now accepting credits", size: 26 }, { t: "QUILL ........ kettle still on", size: 26 },
      { t: G.flags.stetDone ? "MAYOR STET ........ let it stand" : "THE MAYOR ........ name still missing", size: 26 },
      { t: "THE GARDENER ........ coloring in", size: 26 }, { t: "VOLUME THIRTEEN ........ still under the white", size: 26 });
    else c.push({ t: "QUILL ........ still remembering", size: 26 }, { t: "LINT ........ still open (probably)", size: 26 },
      { t: "OLD MARGIN ........ volume twelve", size: 26 }, { t: G.flags.radioFixed ? "SIGNAL ........ now receiving everything" : "SIGNAL ........ bzzt", size: 26 });
    c.push({ t: `lost pages found: ${Memory.data.pages.length} / ${Object.keys(LOST_PAGES).length}`, size: 24, col: "#be6cff" }, { gap: 40 },
      { t: "built from VOIDHEART // Original Boss Fight", size: 22, col: "#9a9aa4" }, { gap: 30 }, { t: "Thank you for playing.", size: 34 });
    return c;
  },
  update(dt) {
    this.t += dt;
    if (this.phase === "pages") {
      this.typer.update(dt);
      if (Input.hit("ok")) {
        if (!this.typer.done) { this.typer.skip(); return; }
        this.i++; this.t = 0;
        if (this.i >= this.pages.length) { this.phase = "credits"; this.scroll = 0; if (this.type === "pacifist") Music.play("margins"); return; }
        this.typer = new Typer(this.pages[this.i].t, { speed: 34, voice: 180 });
      }
    } else if (this.phase === "credits") {
      this.scroll += dt * (Input.held("ok") ? 200 : 45);
      if (this.scroll > this.creditsHeight() + CH) { this.phase = "final"; this.t = 0; Sound.sfx("bell"); }
    } else if (this.phase === "final") {
      if (this.t > 1 && Input.hit("ok")) { this.phase = "out"; Fade.out(() => EpisodeEnd.start(this.ep, this.type), 1); }
    }
  },
  creditsHeight() { return this.credits.reduce((h, c) => h + (c.gap || (c.mon ? 64 : (c.size || 28) + 14)), 0); },
  draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    if (this.phase === "pages") {
      const pg = this.pages[this.i];
      if (pg.art !== "black") {
        frame(116, 30, 408, 250, this.type === "void" ? "#777" : "#f6f6f2", 3);
        ctx.save(); ctx.beginPath(); ctx.rect(119, 33, 402, 244); ctx.clip();
        if (pg.art === "vantaCalm") {
          ctx.fillStyle = "#08080f"; ctx.fillRect(119, 33, 402, 244);
          ctx.save(); ctx.translate(320, 268); ctx.scale(.95, .95); ctx.translate(-165, -217);
          drawVanta(this.t * 1000, { hp: 1, maxhp: 1, mood: 3, sp: 100 }); ctx.restore();
        } else drawArt(pg.art, 320, 155, this.t);
        ctx.restore();
      }
      drawTyped(this.typer.full, this.typer.n, 70, 306, 500, 30, this.type === "void" && pg.art === "black" ? "#ff2b45" : "#fff");
    } else if (this.phase === "credits") {
      let y = CH - this.scroll;
      for (const c of this.credits) {
        if (c.gap) { y += c.gap; continue; }
        if (c.mon) {
          if (y > -80 && y < CH + 80) {
            if (c.mon === "vanta") NPC_DRAW.vanta(200, y + 54, this.t, 2);
            else MON_DRAW[c.mon](200, y + 54, this.t, { hp: 1, maxhp: 1, sp: c.st === "REMEMBERED" ? 100 : 0, ans: 1 }, c.mon === "brasswick" ? 1.2 : c.mon === "footnote" ? 2 : 1.7);
            txt(c.t, 290, y + 8, "#fff", 30);
            txt(c.st, 290, y + 36, c.col, 22);
          }
          y += 64; continue;
        }
        const sz = c.size || 28;
        if (y > -60 && y < CH + 60) txt(c.t, 320, y, c.col || "#fff", sz, "center");
        y += sz + 14;
      }
    } else {
      const inf = ENDING_INFO[this.type], a = Math.min(1, this.t);
      ctx.globalAlpha = a;
      const ks = endingsOf(this.ep);
      txt(`EPISODE ${this.ep} · ENDING ${inf.n} / ${ks.length}`, 320, 120, "#9a9aa4", 30, "center");
      txt(inf.name, 320, 160, inf.col, inf.name.length > 12 ? 64 : 80, "center");
      const found = ks.filter(k => Memory.data.endings[k]).length, E = Memory.data.endings;
      txt(`episode ${this.ep} endings found: ${found} / ${ks.length}`, 320, 270, "#777", 24, "center");
      const hint = found >= ks.length ? "The Archive remembers all of you." : this.ep === 2
        ? (!E.restored ? "hint: maybe REDACT just needs to hear its name." : "hint: some corrections are permanent.")
        : !E.pacifist ? "hint: what if no one was erased?" :
        !E.neutral ? "hint: not every story ends clean." : "hint: ...some loops are best left unwritten.";
      txt(hint, 320, 300, "#555", 22, "center");
      if (this.t > 1) txt("press Z", 320, 400, Math.floor(this.t * 2) % 2 ? "#fff" : "#888", 26, "center");
      ctx.globalAlpha = 1;
    }
  }
};

/* ---------- end of episode ---------- */
const EpisodeEnd = {
  start(ep, type) {
    Scene.set("epend"); this.ep = ep; this.type = type; this.t = 0; this.idx = 0;
    const nx = EPISODES[ep];
    this.opts = nx && nx.playable ? [`CONTINUE TO EPISODE ${nx.n}`, "RETURN TO TITLE"] : ["RETURN TO TITLE"];
    Music.play((nx && nx.music) || "title"); Fade.a = 1; Fade.in(null, 1);
  },
  update(dt) {
    this.t += dt;
    if (this.t < 1.2 || Fade.target === 1) return;
    if (Input.hit("up") || Input.hit("down")) { this.idx = (this.idx + 1) % this.opts.length; Sound.sfx("move"); }
    if (Input.hit("ok")) {
      Sound.sfx("select");
      if (this.opts[this.idx].startsWith("CONTINUE")) Fade.out(() => Intro.start(this.ep + 1), 1.5);
      else Fade.out(() => Title.start(), 1.5);
    }
  },
  draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    const a = Math.min(1, this.t / 1.2), ep = EPISODES[this.ep - 1], nx = EPISODES[this.ep];
    ctx.globalAlpha = a;
    txt(`END OF EPISODE ${this.ep}`, 320, 70, "#9a9aa4", 30, "center");
    txt(ep.title, 320, 106, "#f6f6f2", 56, "center");
    txt(ENDING_INFO[this.type].name, 320, 172, ENDING_INFO[this.type].col, 28, "center");
    ctx.fillStyle = "#be6cff"; ctx.fillRect(220, 216, 200, 2);
    if (nx) {
      txt(`NEXT: EPISODE ${nx.n}`, 320, 232, "#777", 24, "center");
      txt(nx.playable ? nx.title : "? ? ?", 320, 258, nx.playable ? "#fff" : "#555", 34, "center");
      drawTyped(nx.tease || "", Math.floor(this.t * 40), 110, 300, 420, 22, "#9a9aa4");
      if (!nx.playable) txt("COMING SOON", 320, 356, "#ff9d3f", 26, "center");
    }
    if (this.t > 1.2) this.opts.forEach((s, i) => {
      const y = 392 + i * 34, sel = i === this.idx;
      if (sel) drawHeart(320 - 150, y + 14, "#ff2b45", 2);
      txt(s, 320, y, sel ? "#ffd84a" : "#fff", 28, "center");
    });
    ctx.globalAlpha = 1;
  }
};
