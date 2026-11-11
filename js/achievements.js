"use strict";
/* ============================================================
   VOIDHEART — achievements
   Stored in Memory, so they persist across loops (and are wiped
   by ERASE MEMORY).  secret: name/description hidden until earned.
   ============================================================ */
const ACHIEVEMENTS = [
  // the basics
  { id: "mercy", name: "First Mercy", desc: "Spare someone.", ep: 0 },
  { id: "erase", name: "First Weight", desc: "Erase someone.", ep: 0 },
  { id: "flee", name: "Strategic Retreat", desc: "Flee from a battle.", ep: 0 },
  { id: "untouched", name: "Untouched", desc: "Win a battle without taking a single hit.", ep: 0 },
  { id: "flawless", name: "Flawless", desc: "Beat a boss without taking a single hit.", ep: 0 },
  { id: "soul_lost", name: "Get Up, MILO", desc: "Lose your soul once.", ep: 0 },
  { id: "shopper", name: "Pre-Owned", desc: "Buy something from a shop.", ep: 0 },
  { id: "heavy", name: "Heavy", desc: "Reach WT 5.", ep: 0 },
  // Episode 1
  { id: "thinker", name: "Three Forgotten Thoughts", desc: "Solve the rune puzzle in the Margins.", ep: 1 },
  { id: "promise", name: "Pinky Promise", desc: "Promise Quill you won't carry any weight.", ep: 1 },
  { id: "late", name: "Fashionably Late", desc: "Spare Brasswick.", ep: 1 },
  { id: "radio", name: "Good Reception", desc: "Help Signal finish the radio.", ep: 1 },
  { id: "signoff", name: "Goodnight, Everybody", desc: "Let DEAD AIR finish its show.", ep: 1, secret: true },
  { id: "friend1", name: "Nobody Left Behind", desc: "Spare every creature in Episode 1 in one loop.", ep: 1 },
  { id: "listener", name: "The Listener", desc: "Spare VANTA.", ep: 1 },
  { id: "remembered", name: "REMEMBERED", desc: "Reach Episode 1's Remembered ending.", ep: 1 },
  { id: "left", name: "LEFT BEHIND", desc: "Reach Episode 1's Left Behind ending.", ep: 1 },
  { id: "unwritten", name: "UNWRITTEN", desc: "Reach Episode 1's Unwritten ending.", ep: 1, secret: true },
  { id: "historian", name: "Historian", desc: "Find all four Lost Pages in Episode 1.", ep: 1 },
  // Episode 2
  { id: "restorer", name: "Not Gone After All", desc: "Restore a Smudge.", ep: 2 },
  { id: "stet", name: "Let It Stand", desc: "Recover the mayor's name in Carbon Town.", ep: 2 },
  { id: "gardener", name: "Clockwise", desc: "Trace the great flower in the Outline Gardens.", ep: 2 },
  { id: "tape", name: "Tape Is Better", desc: "Spare the Shredder.", ep: 2 },
  { id: "friend2", name: "Copies of Kindness", desc: "Spare every new creature in Episode 2 in one run.", ep: 2 },
  { id: "sol", name: "Say Its Name", desc: "Speak REDACT's true name.", ep: 2, secret: true },
  { id: "restored", name: "RESTORED", desc: "Reach Episode 2's Restored ending.", ep: 2 },
  { id: "struck", name: "STRUCK THROUGH", desc: "Reach Episode 2's Struck Through ending.", ep: 2, secret: true },
  // across loops
  { id: "archivist", name: "Archivist", desc: "Find every Lost Page.", ep: 0 },
  { id: "looper", name: "Familiar Crease", desc: "Finish Episode 1 three times.", ep: 0 },
  { id: "complete", name: "The Archive Remembers You", desc: "See every ending in every episode.", ep: 0 }
];
const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));

const Ach = {
  queue: [], cur: null, t: 0, scanT: 0,
  data() { return Memory.data.ach || (Memory.data.ach = {}); },
  has(id) { return !!this.data()[id]; },
  count() { return ACHIEVEMENTS.filter(a => this.has(a.id)).length; },
  unlock(id) {
    if (!ACH_BY_ID[id] || this.has(id)) return;
    this.data()[id] = Date.now(); Memory.save();
    this.queue.push(ACH_BY_ID[id]);
  },
  battle(id, res, hits, d) {
    if (res === "spare") this.unlock("mercy");
    if (res === "kill") this.unlock("erase");
    if (res === "flee") this.unlock("flee");
    if ((res === "spare" || res === "kill") && hits === 0 && Battle.e && Battle.e.turn >= 1) this.unlock(d && d.boss ? "flawless" : "untouched");
    if (res === "spare") {
      if (id === "brasswick") this.unlock("late");
      if (id === "deadair") this.unlock("signoff");
      if (id === "shredder") this.unlock("tape");
      if (id === "vanta") this.unlock("listener");
      if (id === "redact" && Battle.e && Battle.e.named) this.unlock("sol");
    }
  },
  scan() {
    if (!G) return;
    const f = G.flags, P = Memory.data.pages;
    if (f.puzzle1) this.unlock("thinker");
    if (G.inv.includes("qnote")) this.unlock("promise");
    if (f.radioFixed) this.unlock("radio");
    if (f.stetDone) this.unlock("stet");
    if (f.puzzle2) this.unlock("gardener");
    if (G.wt >= 5) this.unlock("heavy");
    if ((G.restored || []).length) this.unlock("restorer");
    if (["p1", "p2", "p3", "p4"].every(k => P.includes(k))) this.unlock("historian");
    if (Object.keys(LOST_PAGES).every(k => P.includes(k))) this.unlock("archivist");
    if (G.ep === 1 && [...POOLS.margins, ...POOLS.stacks, ...POOLS.static, "brasswick"].every(k => G.spared.includes(k))) this.unlock("friend1");
    if (G.ep === 2 && [...POOLS.under, ...POOLS.garden, ...POOLS.office, "shredder"].every(k => G.spared.includes(k))) this.unlock("friend2");
    if (Memory.data.runs >= 3) this.unlock("looper");
    if (Object.keys(ENDING_INFO).every(k => Memory.data.endings[k])) this.unlock("complete");
  },
  update(dt) {
    this.scanT -= dt;
    if (this.scanT <= 0) { this.scanT = .5; this.scan(); }
    if (!this.cur && this.queue.length) { this.cur = this.queue.shift(); this.t = 0; Sound.sfx("levelup"); }
    if (this.cur) { this.t += dt; if (this.t > 3.2) this.cur = null; }
  },
  draw() {
    if (!this.cur) return;
    const k = Math.min(1, this.t * 4, (3.2 - this.t) * 4), y = -64 + 76 * k;
    frame(150, y, 340, 58, "#ffd84a", 3, "#0b0b10");
    drawTrophy(178, y + 29, 2);
    txt("ACHIEVEMENT UNLOCKED", 204, y + 8, "#ffd84a", 20);
    txt(this.cur.name, 204, y + 28, "#fff", 26);
  }
};
function drawTrophy(cx, cy, s = 2, col = "#ffd84a") {
  bmp(["XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X...", "..XXX..", ".XXXXX."], { X: col }, cx - 3.5 * s, cy - 3.5 * s, s);
}

/* ---------- the achievements screen ---------- */
const AchScene = {
  start() { Scene.set("ach"); this.idx = 0; this.scroll = 0; Sound.sfx("select"); },
  update(dt) {
    const n = ACHIEVEMENTS.length;
    if (Input.hit("up")) { this.idx = (this.idx + n - 1) % n; Sound.sfx("move"); }
    if (Input.hit("down")) { this.idx = (this.idx + 1) % n; Sound.sfx("move"); }
    if (Input.hit("cancel") || Input.hit("ok")) { Sound.sfx("back"); Title.start(); return; }
    const vis = 7;
    if (this.idx < this.scroll) this.scroll = this.idx;
    if (this.idx >= this.scroll + vis) this.scroll = this.idx - vis + 1;
  },
  draw(t) {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    txt("ACHIEVEMENTS", 320, 14, "#f6f6f2", 44, "center");
    txt(`${Ach.count()} / ${ACHIEVEMENTS.length} unlocked`, 320, 58, "#9a9aa4", 22, "center");
    const vis = 7;
    for (let r = 0; r < vis; r++) {
      const i = this.scroll + r, a = ACHIEVEMENTS[i];
      if (!a) break;
      const got = Ach.has(a.id), hide = a.secret && !got, y = 90 + r * 50, sel = i === this.idx;
      frame(40, y, 560, 44, sel ? "#ffd84a" : got ? "#6a6a3a" : "#2a2a30", 2, got ? "#0f0f08" : "#050507");
      drawTrophy(66, y + 22, 2, got ? "#ffd84a" : "#3a3a44");
      txt(hide ? "? ? ?" : a.name, 90, y + 4, got ? "#fff" : "#777", 24);
      txt(hide ? "A secret. Keep looking." : a.desc, 90, y + 24, got ? "#bbb" : "#555", 18);
      txt(a.ep ? `EP${a.ep}` : "ANY", 588, y + 6, "#555", 18, "right");
      if (got) { const d = new Date(Ach.data()[a.id]); txt(`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`, 588, y + 24, "#6a6a3a", 16, "right"); }
    }
    if (this.scroll > 0) txt("▲", 620, 92, "#777", 20, "center");
    if (this.scroll + vis < ACHIEVEMENTS.length) txt("▼", 620, 418, "#777", 20, "center");
    txt("↑↓ browse · Z / X back", 320, 452, "#555", 20, "center");
  }
};

/* ---------- hooks into the existing game ---------- */
{
  const bStart = Battle.start, bHurt = Battle.hurtBy, bFinish = Battle.finish;
  Battle.start = function (id, opts) { bStart.call(this, id, opts); this.hitsTaken = 0; };
  Battle.hurtBy = function (b) { const hp = G.hp; bHurt.call(this, b); if (G.hp < hp) this.hitsTaken++; };
  Battle.finish = function (res) { if (this.state !== "done") Ach.battle(this.id, res, this.hitsTaken || 0, this.d); bFinish.call(this, res); };

  const goStart = GameOver.start;
  GameOver.start = function (x, y) { goStart.call(this, x, y); Ach.unlock("soul_lost"); };

  const endStart = Ending.start;
  Ending.start = function (type, info) {
    endStart.call(this, type, info);
    Ach.unlock({ pacifist: "remembered", neutral: "left", void: "unwritten", restored: "restored", struck: "struck" }[type] || type);
    Ach.scan();
  };

  const shopUpd = Shop.update;
  Shop.update = function (dt) { const g = G.gold; shopUpd.call(this, dt); if (G.gold < g) Ach.unlock("shopper"); };

  const tBuild = Title.build, tUpd = Title.update;
  Title.build = function () {
    tBuild.call(this);
    const i = this.opts.indexOf("ERASE MEMORY");
    this.opts.splice(i < 0 ? this.opts.length : i, 0, "ACHIEVEMENTS");
  };
  Title.update = function (dt) {
    if (!this.confirm && Fade.a <= .5 && Input.hit("ok") && this.opts[this.idx] === "ACHIEVEMENTS") { AchScene.start(); return; }
    tUpd.call(this, dt);
  };
}
