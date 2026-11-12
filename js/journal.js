"use strict";
/* ============================================================
   VOIDHEART — journal and end-of-episode stats
   Everything here lives in Memory, so it persists across loops
   and is wiped by ERASE MEMORY. Loaded after music.js.
   ============================================================ */
const Jn = {
  d() { const m = Memory.data; return m.journal || (m.journal = { c: {}, notes: {}, ev: {}, medal: {}, best: {}, run: {} }); },
  run(ep) { const d = this.d(); return d.run[ep] || (d.run[ep] = { time: 0, hits: 0, deaths: 0 }); },
  bosses: { 1: ["brasswick", "deadair", "vanta"], 2: ["shredder", "redact"], 3: [...E3.BOSSES, "palimpsest"] },
  creatures(ep) {
    const pools = { 1: ["margins", "stacks", "static"], 2: ["under", "garden", "office"], 3: EP_AREAS[3] }[ep];
    return [...pools.flatMap(a => POOLS[a] || []), ...this.bosses[ep]].filter(id => MONSTERS[id]);
  },
  allCreatures() { return [1, 2, 3].flatMap(ep => this.creatures(ep)); },
  allBosses() { return [1, 2, 3].flatMap(ep => this.bosses[ep]).filter(id => MONSTERS[id]); },
  /* [label, done, total] for every kind of thing there is to complete */
  tally() {
    const d = this.d(), all = this.allCreatures(), bosses = this.allBosses();
    return [
      ["Creatures befriended", all.filter(id => d.c[id] && d.c[id].s > 0).length, all.length],
      ["Endings seen", Object.keys(ENDING_INFO).filter(k => Memory.data.endings[k]).length, Object.keys(ENDING_INFO).length],
      ["Lost Pages", Object.keys(LOST_PAGES).filter(k => Memory.hasPage(k)).length, Object.keys(LOST_PAGES).length],
      ["Lies struck through", Object.keys(E3.notes).filter(f => d.notes[f]).length, Object.keys(E3.notes).length],
      ["Evidence gathered", Object.keys(d.ev).length, E3.EVIDENCE_TOTAL],
      ["Bosses beaten untouched", bosses.filter(id => d.medal[id]).length, bosses.length],
      ["Achievements", Ach.count(), ACHIEVEMENTS.length]
    ];
  },
  percent() { const t = this.tally(); return Math.floor(100 * t.reduce((a, r) => a + r[1], 0) / t.reduce((a, r) => a + r[2], 0)); },
  fmt(sec) { const s = Math.floor(sec), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s % 60).padStart(2, "0"); },
  scanT: 0,
  update(dt) {
    if (!G) return;
    if (["world", "battle", "trans"].includes(Scene.cur)) this.run(G.ep || 1).time += dt;
    this.scanT -= dt;
    if (this.scanT > 0) return;
    this.scanT = .5;
    if (G.ep !== 3) return;
    const d = this.d();
    for (const f of Object.keys(E3.notes)) if (G.flags[f]) d.notes[f] = 1;
    for (const e of E3.evidence()) d.ev[e.key] = 1;
  }
};

/* ---------- hooks ---------- */
{
  const bStart = Battle.start, bHurt = Battle.hurtBy, bFinish = Battle.finish;
  Battle.start = function (id, opts) {
    bStart.call(this, id, opts);
    if (!id.startsWith("smudge_")) { const c = Jn.d().c; c[id] = c[id] || { s: 0, k: 0 }; }
  };
  Battle.hurtBy = function (b) { const hp = G.hp; bHurt.call(this, b); if (G.hp < hp) Jn.run(G.ep || 1).hits++; };
  Battle.finish = function (res) {
    if (this.state !== "done" && !this.id.startsWith("smudge_")) {
      const d = Jn.d(), c = d.c[this.id] || (d.c[this.id] = { s: 0, k: 0 });
      if (res === "spare") c.s++; else if (res === "kill") c.k++;
      if (res !== "flee" && this.d.boss && !(this.hitsTaken > 0) && this.e.turn >= 1) d.medal[this.id] = 1;
      Memory.save();
    }
    bFinish.call(this, res);
  };
  const goStart = GameOver.start;
  GameOver.start = function (x, y) { Jn.run(G.ep || 1).deaths++; Memory.save(); goStart.call(this, x, y); };
  const bl = beginLoop;
  beginLoop = function (ep = 1) { Jn.d().run[ep] = { time: 0, hits: 0, deaths: 0 }; bl(ep); };
  const sg = saveGame;
  saveGame = function () { sg(); Memory.save(); };
  const au = Ach.update.bind(Ach);
  Ach.update = function (dt) { au(dt); Jn.update(dt); };

  const tBuild = Title.build, tUpd = Title.update;
  Title.build = function () {
    tBuild.call(this);
    const i = this.opts.indexOf("ACHIEVEMENTS");
    this.opts.splice(i < 0 ? this.opts.length : i, 0, "JOURNAL");
  };
  Title.update = function (dt) {
    if (!this.confirm && Fade.a <= .5 && Input.hit("ok") && this.opts[this.idx] === "JOURNAL") { Journal.start(); return; }
    tUpd.call(this, dt);
  };
  const es = EpisodeEnd.start.bind(EpisodeEnd);
  EpisodeEnd.start = function (ep, type) { EpStats.start(ep, type, () => es(ep, type)); };
}

/* ---------- the journal screen ---------- */
const Journal = {
  tabs: ["EPISODE 1", "EPISODE 2", "EPISODE 3", "RECORDS"],
  start() { Scene.set("journal"); this.tab = 0; this.idx = 0; this.scroll = 0; this.t = 0; Sound.sfx("select"); },
  list() { return this.tab < 3 ? Jn.creatures(this.tab + 1) : []; },
  update(dt) {
    this.t += dt;
    if (Input.hit("left")) { this.tab = (this.tab + 3) % 4; this.idx = this.scroll = 0; Sound.sfx("move"); }
    if (Input.hit("right")) { this.tab = (this.tab + 1) % 4; this.idx = this.scroll = 0; Sound.sfx("move"); }
    const n = this.list().length, vis = 6;
    if (n) {
      if (Input.hit("up")) { this.idx = (this.idx + n - 1) % n; Sound.sfx("move"); }
      if (Input.hit("down")) { this.idx = (this.idx + 1) % n; Sound.sfx("move"); }
      if (this.idx < this.scroll) this.scroll = this.idx;
      if (this.idx >= this.scroll + vis) this.scroll = this.idx - vis + 1;
    }
    if (Input.hit("cancel") || Input.hit("ok")) { Sound.sfx("back"); Title.start(); }
  },
  draw(t) {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    txt("JOURNAL", 40, 10, "#f6f6f2", 40);
    txt(`${Jn.percent()}% complete`, 600, 22, "#be6cff", 24, "right");
    this.tabs.forEach((s, i) => {
      const x = 40 + i * 142, sel = i === this.tab;
      frame(x, 56, 134, 28, sel ? "#ffd84a" : "#333", 2, sel ? "#14140a" : "#000");
      txt(s, x + 67, 59, sel ? "#ffd84a" : "#777", 20, "center");
    });
    if (this.tab === 3) return this.drawRecords();
    const list = this.list(), d = Jn.d(), vis = 6;
    for (let r = 0; r < vis; r++) {
      const i = this.scroll + r, id = list[i];
      if (!id) break;
      const m = MONSTERS[id], c = d.c[id], y = 94 + r * 56, sel = i === this.idx;
      frame(40, y, 560, 50, sel ? "#ffd84a" : c ? "#444" : "#222", 2, "#050507");
      if (c) {
        ctx.save(); ctx.beginPath(); ctx.rect(44, y + 3, 64, 44); ctx.clip();
        try { MON_DRAW[m.draw || id](76, y + 46, this.t, { hp: 1, maxhp: 1, sp: c.s ? 100 : 0, ans: 1 }, m.boss ? .85 : 1.3); } catch (e) {}
        ctx.restore(); ctx.globalAlpha = 1;
      } else txt("?", 76, y + 8, "#333", 34, "center");
      txt(c ? m.name : "? ? ?", 120, y + 4, c ? "#fff" : "#555", 26);
      const st = !c ? "not met yet" : [c.s && `spared ×${c.s}`, c.k && `erased ×${c.k}`].filter(Boolean).join("   ") || "met";
      txt(st, 120, y + 27, !c ? "#444" : c.s ? "#ffd84a" : c.k ? "#ff2b45" : "#9a9aa4", 19);
      if (m.boss) { txt("BOSS", 560, y + 5, "#777", 18, "right"); drawTrophy(580, y + 15, 2, d.medal[id] ? "#ffd84a" : "#2a2a30"); if (d.medal[id]) txt("untouched", 590, y + 27, "#ffd84a", 17, "right"); }
    }
    if (this.scroll > 0) txt("▲", 618, 96, "#777", 20, "center");
    if (this.scroll + vis < list.length) txt("▼", 618, 408, "#777", 20, "center");
    txt("←→ tabs · ↑↓ browse · Z / X back", 320, 452, "#555", 20, "center");
  },
  drawRecords() {
    const tl = Jn.tally(), d = Jn.d();
    tl.forEach((r, i) => {
      const y = 100 + i * 32, full = r[1] >= r[2];
      txt(r[0], 60, y, "#fff", 26);
      ctx.fillStyle = "#1a1a22"; ctx.fillRect(330, y + 8, 170, 12);
      ctx.fillStyle = full ? "#ffd84a" : "#be6cff"; ctx.fillRect(330, y + 8, 170 * (r[2] ? r[1] / r[2] : 0), 12);
      txt(`${r[1]} / ${r[2]}`, 590, y, full ? "#ffd84a" : "#bbb", 26, "right");
    });
    txt("BEST TIMES", 60, 336, "#9a9aa4", 22);
    [1, 2, 3].forEach((ep, i) => txt(`EP${ep}  ${d.best[ep] ? Jn.fmt(d.best[ep]) : "--:--"}`, 60 + i * 180, 362, d.best[ep] ? "#57dbff" : "#444", 26));
    txt(`loops of Episode 1 finished: ${Memory.data.runs}`, 60, 398, "#777", 22);
    txt("←→ tabs · Z / X back", 320, 452, "#555", 20, "center");
  }
};

/* ---------- end-of-episode stats ---------- */
const EpStats = {
  start(ep, type, next) {
    Scene.set("epstats"); this.ep = ep; this.type = type; this.next = next; this.t = 0;
    const d = Jn.d(), run = Jn.run(ep);
    this.rows = [
      ["Time", Jn.fmt(run.time)],
      ["Spared", String(G.spares)],
      ["Erased", String(G.kills), G.kills ? "#ff2b45" : "#fff"],
      ["Hits taken", String(run.hits)],
      ["Souls lost", String(run.deaths)],
      ["Lost Pages", `${Object.keys(LOST_PAGES).filter(k => LOST_PAGES[k].ep === ep && Memory.hasPage(k)).length} / ${Object.keys(LOST_PAGES).filter(k => LOST_PAGES[k].ep === ep).length}`]
    ];
    if (ep === 3) this.rows.push(["Lies struck through", `${E3.notesStruck()} / ${Object.keys(E3.notes).length}`], ["Evidence", `${E3.evidence().length} / ${E3.EVIDENCE_TOTAL}`]);
    this.newBest = run.time > 0 && (!d.best[ep] || run.time < d.best[ep]);
    this.oldBest = d.best[ep] || 0;
    if (this.newBest) d.best[ep] = run.time;
    Memory.save();
    Fade.a = 1; Fade.in(null, 1.5);
  },
  update(dt) {
    this.t += dt;
    if (Fade.target === 1) return;
    const shown = Math.floor((this.t - .4) / .3);
    if (Input.hit("ok")) {
      if (shown < this.rows.length + 2) { this.t = 99; Sound.sfx("move"); }
      else { Sound.sfx("select"); const n = this.next; this.next = null; if (n) Fade.out(n, 1.5); }
    }
  },
  draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    const inf = ENDING_INFO[this.type], d = Jn.d();
    txt(`EPISODE ${this.ep} COMPLETE`, 320, 20, "#9a9aa4", 28, "center");
    txt(inf.name, 320, 48, inf.col, 44, "center");
    const shown = Math.floor((this.t - .4) / .3), rh = this.rows.length > 6 ? 27 : 31;
    this.rows.forEach((r, i) => {
      if (i > shown) return;
      const y = 108 + i * rh;
      txt(r[0], 150, y, "#bbb", 26); txt(r[1], 490, y, r[2] || "#fff", 26, "right");
    });
    const by = 108 + this.rows.length * rh + 12;
    if (shown >= this.rows.length) {
      txt("BOSSES", 150, by, "#9a9aa4", 20);
      Jn.bosses[this.ep].filter(id => MONSTERS[id]).forEach((id, i, a) => {
        const x = 320 + (i - (a.length - 1) / 2) * 76 + 60, sp = G.spared.includes(id), k = G.killed.includes(id);
        drawTrophy(x, by + 34, 3, !sp && !k ? "#2a2a30" : k ? "#ff2b45" : d.medal[id] ? "#ffd84a" : "#bcbcc7");
        txt(MONSTERS[id].name.replace(/^The /, "").slice(0, 9), x, by + 50, "#777", 15, "center");
      });
      txt("gold: spared untouched · silver: spared · red: erased", 320, by + 70, "#555", 17, "center");
    }
    if (shown >= this.rows.length + 1) {
      if (this.newBest) txt(this.oldBest ? `NEW BEST TIME!  (was ${Jn.fmt(this.oldBest)})` : "FIRST CLEAR!", 320, 410, "#57dbff", 24, "center");
      else if (this.oldBest) txt(`best time: ${Jn.fmt(this.oldBest)}`, 320, 410, "#777", 22, "center");
      if (Math.floor(this.t * 2) % 2) txt("press Z", 320, 444, "#fff", 24, "center");
    }
  }
};
