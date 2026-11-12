"use strict";
/* ============================================================
   VOIDHEART — loop secrets and unlockable extras
   Loaded after journal.js, before main.js.

   Secrets:   your Echo (second loop onward), THE INDEX (hidden boss, needs two
              different Episode 1 endings), Gerald (a rare, per-save random cat)
   Extras:    Journal, Achievements, Sound Test, Boss Rush, Hard Mode
   ============================================================ */

/* ---------- per-save luck: a hidden number that makes rare things appear ---------- */
{
  const fg = freshGame;
  freshGame = function (ep = 1, carry = null) { const g = fg(ep, carry); g.luck = rint(1, 100); return g; };
}
const geraldHere = () => !!G && G.luck !== undefined && G.luck <= 15;

/* ---------- items, speakers, achievements ---------- */
Object.assign(ITEMS, {
  loopcharm: { name: "Loop Charm", type: "armor", def: 2, desc: "A paperclip bent into a loop. Feels familiar. DEF +2." },
  indexcard: { name: "Index Card", type: "weapon", atk: 6, desc: "Very sharp corners. Filed under M, for MILO. ATK +6." }
});
Object.assign(SPEAKERS, { echo: { name: "ECHO", voice: 250 }, index: { name: "THE INDEX", voice: 130 } });
ACHIEVEMENTS.push(
  { id: "echo", name: "Familiar Face", desc: "Meet what you left behind last loop.", ep: 1, secret: true },
  { id: "indexed", name: "Cross-Referenced", desc: "Settle things with THE INDEX.", ep: 1, secret: true },
  { id: "gerald", name: "Gerald Is Real", desc: "Find the cat that never existed.", ep: 0, secret: true },
  { id: "hardway", name: "The Hard Way", desc: "Finish an episode in Hard Mode.", ep: 0 },
  { id: "rush", name: "Rush Hour", desc: "Clear the Boss Rush.", ep: 0 },
  { id: "listener2", name: "Front Row Seat", desc: "Hear 30 different songs.", ep: 0 }
);
for (const a of ACHIEVEMENTS) ACH_BY_ID[a.id] = a;

/* ---------- sprites ---------- */
Object.assign(NPC_DRAW, {
  echo(cx, by, t, u = 2) {
    ctx.save(); ctx.translate(cx, by); ctx.scale(u / 2, u / 2);
    drawMilo(Math.sin(t * 9) * .6, 0, "down", 0, .35 + .12 * Math.sin(t * 2.4));
    ctx.restore();
  },
  gerald(cx, by, t, u = 2) {
    const R = P(cx, by, u), c = "#2a2a30", tail = Math.sin(t * 3) * 1.5;
    R(-6, -9, 12, 8, c); R(-6, -13, 4, 5, c); R(-6, -15, 1.5, 2, c); R(-3.5, -15, 1.5, 2, c);
    R(6, -8 + tail, 2, 2, c); R(7, -11 + tail, 2, 4, c);
    R(-5, -11, 1, 1, "#ffd84a"); R(-3, -11, 1, 1, "#ffd84a");
    R(-5, -1, 2, 1, c); R(3, -1, 2, 1, c);
  },
  index(cx, by, t, u = 2) { MON_DRAW.index(cx, by, t, { sp: 0 }, u * .5); }
});
MON_DRAW.index = function (cx, by, t, e, u = 4) {
  const R = P(cx, by, u), calm = e && e.sp >= 100;
  R(-20, -52, 40, 50, "#3a2a1a"); R(-18, -50, 36, 46, "#6a4a2a"); R(-22, -2, 44, 3, "#2a1c12");
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const i = r * 3 + c, out = calm ? 0 : Math.max(0, Math.sin(t * 2.2 + i * 1.7)) * 3;
    const x = -17 + c * 12, y = -48 + r * 11 + out * .4;
    R(x, y, 10, 9, "#4a3420"); R(x + 1, y + 1, 8, 7, r === 0 && c !== 1 ? "#1a1a22" : "#8a6a40");
    if (r === 0 && c !== 1) { R(x + 3, y + 3, 4, 3, calm ? "#57dbff" : "#ffd84a"); R(x + 4 + Math.round(Math.sin(t * 2)), y + 4, 2, 2, "#1a1a22"); }
    else { R(x + 3, y + 5, 4, 1.5, "#d8b25a"); R(x + 2, y + 2, 6, 2, "#efe6cf"); }
    if (out > 2 && !(r === 0 && c !== 1)) R(x + 2, y - 3, 6, 4, "#efe6cf");
  }
  if (!calm) for (let i = 0; i < 5; i++) {
    const r = hash(i, 21), k = (t * .5 + r) % 1;
    ctx.save(); ctx.translate(cx + (r - .5) * 60 * u * .25 * 4, by - (50 + k * 20) * u); ctx.rotate(t * 2 + i);
    ctx.globalAlpha *= 1 - k; ctx.fillStyle = "#efe6cf"; ctx.fillRect(-2 * u, -1.4 * u, 4 * u, 2.8 * u); ctx.restore();
  }
};

/* ---------- your Echo: appears where you first fell, from the second loop on ---------- */
ROOMS.m_fall.ents.push({ k: "npc", id: "echo", tx: 10, ty: 9, if: () => Memory.data.runs > 0, talk: () => echoTalk() });
function echoTalk() {
  const last = Memory.data.last, n = Memory.data.runs, seen = endingsOf(1).filter(k => Memory.data.endings[k]).length;
  if (G.flags.echoMet) return [L("echo", pick(["I'll be here. I'm always here. That's sort of the problem.", "Go on. Do it differently. Or the same. I'll remember either way.", `Loop ${n + 1}. I'm keeping count so you don't have to.`]))];
  G.flags.echoMet = true; Ach.unlock("echo");
  const a = ["* Someone is standing where you landed.", "* They look like you. A little see-through."];
  if (last === "pacifist") a.push(L("echo", "Oh. It's you. Me. I'm what's left over from last time."), L("echo", "Everyone climbed out together. Somebody had to stay and hold the door. I didn't mind."));
  else if (last === "void") a.push(L("echo", "...Don't look at me like that. I remember what we did."), L("echo", "I'm the part that stayed behind to be sorry about it."));
  else a.push(L("echo", "Oh. It's you. Me. I'm what's left over from last time."), L("echo", "Somebody got left behind when you climbed out. Turns out it was me."));
  a.push(L("echo", "The Archive keeps a copy of everyone who leaves. Loops don't overwrite. They stack."));
  if (seen < 2) a.push(L("echo", "Old Margin keeps an index of every loop. It's thin right now. One kind of ending in it."), L("echo", "End things differently, then ask about the index. It gets... opinionated."));
  else a.push(L("echo", "Old Margin's index has more than one of your endings in it now. Ask about it. It has opinions."));
  a.push(L("echo", "Here. I held on to this for you.", { give: "loopcharm" }));
  return a;
}

/* ---------- THE INDEX: hidden boss, opens after two different Episode 1 endings ---------- */
SONGS.index = { bpm: 122, tracks: [
  { w: "pulse12", v: .03, env: "lead", vib: .005, echo: true, n: THEME_B + " " + THEME_A },
  { w: "triangle", v: .075, mood: "intense", n: ["D2", "C2", "A#1", "A1", "D2", "A1", "A#1", "F2"].map(musDrive).join(" ") },
  { w: "triangle", v: .04, env: "pad", mood: "calm", n: THEME_PADS },
  { w: "drums", v: .045, n: "k . h h s . h . k . h k s . h h" }] };
MONSTERS.index = {
  name: "The Index", area: "stacks", hp: 320, atk: 7, def: 2, exp: 50, gold: 60, voice: 130, boss: true, bar: true,
  title: "THE INDEX // EVERY LOOP, CROSS-REFERENCED", music: "index", noFlee: true,
  check: "THE INDEX - ATK 7 DEF 2\n* A card catalog of every loop you have ever lived.\n* The cards disagree with each other. It can't stand that.",
  intro: "* Drawers slide open, one after another.",
  flavor: ["* The Index shuffles through you.", "* A drawer labeled 'MILO' is overflowing.", "* Cards flutter out. Each one is a different you."],
  spareFlavor: "* The Index has filed you under one heading at last.",
  talk: ["WHICH ONE ARE YOU?", "MILO, SEE ALSO: MILO.", "ONE CARD SAYS KIND. ONE CARD SAYS OTHERWISE.", "A RECORD CANNOT SAY TWO THINGS."],
  spareTalk: "...FILED UNDER: MILO. ALL OF THEM.",
  actNames() {
    const a = ["Look Yourself Up"], E = Memory.data.endings;
    if (E.pacifist) a.push("Cite: Remembered");
    if (E.neutral) a.push("Cite: Left Behind");
    if (E.void) a.push("Cite: Unwritten");
    a.push("Tear Out a Card", "Close the Drawer");
    return a;
  },
  acts: {
    "Look Yourself Up": e => {
      e.looks = (e.looks || 0) + 1;
      if (e.looks > 2) { e.sp += 6; e.reply = "PUT THAT BACK."; return "* You read another of your cards.\n* Different loop. Same handwriting."; }
      e.sp += 10; e.reply = "YOU ARE NOT SUPPOSED TO READ YOUR OWN ENTRY.";
      return e.looks === 1 ? `* You pull your card. 'MILO. Loops completed: ${Memory.data.runs}.'\n* There are a lot of cards behind it.` : "* You read further back.\n* Every card is in your handwriting.";
    },
    "Cite: Remembered": e => { if (e.cP) return "* That card is already on the table."; e.cP = 1; e.sp += 30; e.reply = "...THAT ONE IS KIND. I HAVE IT."; return "* You tell the Index about the loop where nobody was erased.\n* It was real. It happened."; },
    "Cite: Left Behind": e => { if (e.cN) return "* That card is already on the table."; e.cN = 1; e.sp += 30; e.reply = "...SOME SPARED. SOME NOT. I HAVE IT."; return "* You tell the Index about the loop where you climbed out alone.\n* That was real too."; },
    "Cite: Unwritten": e => { if (e.cV) return "* That card is already on the table."; e.cV = 1; e.sp += 30; e.reply = "...THAT ONE. YES. I HAVE THAT ONE."; return "* You tell the Index about the loop where you erased everything.\n* You don't look away while you say it."; },
    "Tear Out a Card": e => { e.sp = Math.max(0, e.sp - 25); e.rage = 1; e.reply = "DO NOT REMOVE RECORDS!"; return "* You tear out a card you don't like.\n* The Index is furious. That one was true, too."; },
    "Close the Drawer": e => {
      if (e.sp < 70) { e.reply = "THE ENTRIES DO NOT AGREE. I CANNOT CLOSE."; return "* You try to push the drawer shut.\n* It won't close while the cards still argue."; }
      e.sp = 100; e.reply = "..."; return "* You tell the Index every card is you.\n* The kind one. The other one. All filed under the same name.\n* The drawer slides shut.";
    }
  },
  pattern(e) {
    const L = [{ id: "letters", word: "SEEALSOMILO", col: "#efe6cf" }, { id: "loop", col: "#d8b25a" }, { id: "clock", start: "corner", col: "#d8b25a" }, { id: "archive" }];
    return Object.assign({}, L[e.turn % L.length]);
  },
  deathLines: () => ["...RECORD... DESTROYED...", "...you will not remember... which one you were..."],
  spareLines: () => ["...ONE NAME. MANY CARDS.", "THAT IS ALLOWED. I CHECKED.", "TAKE THIS. YOU ARE OVERDUE FOR ONE."]
};
Jn.bosses[1].push("index");
{
  const mt = marginTalk;
  marginTalk = function () {
    const lines = mt();
    const seen = endingsOf(1).filter(k => Memory.data.endings[k]).length;
    if (seen < 2 || G.flags.indexDone || areaVoid("stacks")) return lines;
    return [...lines, L("margin", "Hm. My index is behaving oddly. It has you down under more than one ending, and it does not care for that at all.", {
      ch: ["Ask about it", "Leave it"],
      on: i => i === 0 ? [L("margin", "Oh dear. It heard you. Mind the drawers.", { after: () => indexEvent() })] : [L("margin", "Wise. It bites. Alphabetically.")]
    })];
  };
}
function indexEvent() {
  World.busy = true;
  Dialog.open([
    "* The shelves behind Old Margin rattle.", "* A card catalog walks out of the wall.",
    L("index", "MILO. SEE ALSO: MILO. SEE ALSO: MILO."),
    L("index", "I HOLD EVERY LOOP. THE ENTRIES CONTRADICT."),
    L("index", "ONE OF YOU MUST BE AN ERROR. HOLD STILL WHILE I DETERMINE WHICH.")], () => {
    startEncounter("index", {
      onEnd: res => {
        G.flags.indexDone = res; Ach.unlock("indexed");
        if (res === "kill") { G.kills++; G.killed.push("index"); }
        else { G.spares++; G.spared.push("index"); Timers.after(1.2, () => { if (addItem("indexcard")) Toast.show("GOT: INDEX CARD"); Dialog.open(["* The Index left you a card.", "* It says: 'MILO. See: all of the above.'"]); }); }
        returnToWorld();
      }
    });
  });
}

/* ---------- Gerald: a rumor of a cat, real in roughly one save out of seven ---------- */
{
  const gerald = (ep3) => () => {
    Ach.unlock("gerald");
    const a = ["* A cat.", "* It looks at you like it knows it isn't supposed to exist.", "* ...Mrow."];
    if (ep3) a.push("* The poster was right all along. Gerald is real.", "* Gerald has always been real.");
    return a;
  };
  ROOMS.m_quill.ents.push({ k: "npc", id: "gerald", tx: 9, ty: 9, if: geraldHere, talk: gerald(false) });
  ROOMS.e2_house.ents.push({ k: "npc", id: "gerald", tx: 5, ty: 8, if: geraldHere, talk: gerald(false) });
  ROOMS.e3h_park.ents.push({ k: "npc", id: "gerald", tx: 13, ty: 7, if: geraldHere, talk: gerald(true) });
}

/* ---------- Hard Mode ---------- */
{
  const bl = beginLoop;
  beginLoop = function (ep = 1) { bl(ep); if (G) G.hard = !!Memory.data.hard; };
  const bs = Battle.start, sd = Battle.startDodge, hud = Battle.drawHUD, es = Ending.start;
  Battle.start = function (id, opts) { bs.call(this, id, opts); if (G.hard) this.e.atkB = (this.e.atkB || 0) + 3; };
  Battle.startDodge = function () { sd.call(this); if (G.hard && this.pat) { this.pat.P.s *= 1.12; this.pat.P.d *= 1.2; } };
  Battle.drawHUD = function () { hud.call(this); if (G.hard) txt("HARD", 608, 400, "#ff2b45", 18, "right"); };
  Ending.start = function (type, info) { const hard = G.hard; es.call(this, type, info); if (hard) Ach.unlock("hardway"); };
}

/* ---------- songs heard (for the Sound Test) ---------- */
const SONG_NAMES = {
  title: "VOIDHEART (Main Theme)", margins: "The Margins", stacks: "The Stacks", static: "Static Fields", battle: "Spare or Erase",
  brass: "Closing Time", vanta: "The Archivist", vantavoid: "Not Forgotten, Erased", lastpage: "The Last Page", void: "Quiet Now",
  gameover: "Soul Lost", ending: "Remembered", sad: "Left Behind", deadair: "Dead Air", well: "The Ink Well", underprint: "The Underprint",
  office: "All Corrections Final", redact: "Head of Corrections", carbon: "Carbon Town", garden: "Outline Gardens", shredder: "Keeper of Scraps",
  hollow: "Hollowmere", e3intro: "A Little Bit Wrong", rumormill: "Everybody Says So", marg: "The Marginalia", doodler: "Unfinished",
  f_quarter: "The Fiction Quarter", f_happily: "Happily Ever", errata: "The Errata", e_trial: "MILO vs. the Record", palim: "The Palimpsest",
  milorevised: "A Kinder Draft", palimpsest: "Every Draft", palimvoid: "The Last Page Left", e3ending: "True Story", index: "See Also: MILO"
};
{
  const mp = Music.play;
  Music.play = function (name) {
    mp.call(this, name);
    if (!name || Scene.cur === "soundtest") return;
    const base = name.replace("~void", ""), h = Jn.d().heard || (Jn.d().heard = {});
    if (!h[base]) { h[base] = 1; if (Object.keys(h).length >= 30) Ach.unlock("listener2"); }
  };
}

/* ---------- the Extras menu ---------- */
const Extras = {
  back: false,
  items() {
    const done = Object.keys(Memory.data.eps).length > 0;
    return [
      { name: "JOURNAL", sub: `${Jn.percent()}% complete`, go: () => { this.back = true; Journal.start(); } },
      { name: "ACHIEVEMENTS", sub: `${Ach.count()} / ${ACHIEVEMENTS.length}`, go: () => { this.back = true; AchScene.start(); } },
      { name: "SOUND TEST", sub: done ? `${Object.keys(Jn.d().heard || {}).length} / ${Object.keys(SONGS).length} songs heard` : "", lock: !done && "Finish any episode to unlock", go: () => SoundTest.start() },
      { name: "BOSS RUSH", sub: done ? (Jn.d().rush ? `best ${Jn.fmt(Jn.d().rush.time)}` : `${Rush.lineup().length} bosses, back to back`) : "", lock: !done && "Finish any episode to unlock", go: () => Rush.start() },
      { name: "HARD MODE", sub: done ? (Memory.data.hard ? "ON for new games: harder hits, faster attacks" : "OFF") : "", lock: !done && "Finish any episode to unlock",
        go: () => { Memory.data.hard = !Memory.data.hard; Memory.save(); Sound.sfx(Memory.data.hard ? "boom" : "back"); } }
    ];
  },
  start() { Scene.set("extras"); this.idx = this.idx || 0; this.msg = ""; Music.play(Memory.data.last === "void" ? "void" : "title"); if (Fade.a > 0) Fade.in(null, 3); },
  update() {
    const it = this.items(), n = it.length;
    if (Fade.target === 1) return;
    if (Input.hit("up")) { this.idx = (this.idx + n - 1) % n; this.msg = ""; Sound.sfx("move"); }
    if (Input.hit("down")) { this.idx = (this.idx + 1) % n; this.msg = ""; Sound.sfx("move"); }
    if (Input.hit("cancel")) { Sound.sfx("back"); this.back = false; Title.start(); return; }
    if (Input.hit("ok")) {
      const x = it[this.idx];
      if (x.lock) { Sound.sfx("buzz"); this.msg = x.lock; return; }
      Sound.sfx("select"); x.go();
    }
  },
  draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    txt("EXTRAS", 320, 22, "#f6f6f2", 48, "center");
    this.items().forEach((x, i) => {
      const y = 96 + i * 62, sel = i === this.idx;
      frame(100, y, 440, 54, sel ? "#ffd84a" : x.lock ? "#222" : "#555", 3);
      if (sel) drawHeart(124, y + 27, "#ff2b45", 2);
      txt(x.lock ? "? ? ?" : x.name, 148, y + 5, x.lock ? "#444" : "#fff", 28);
      txt(x.lock ? "locked" : x.sub, 148, y + 30, x.lock ? "#333" : x.name === "HARD MODE" && Memory.data.hard ? "#ff2b45" : "#9a9aa4", 18);
    });
    if (this.msg) txt(this.msg, 320, 416, "#ff9d3f", 22, "center");
    txt("Z select · X back", 320, 448, "#555", 20, "center");
  }
};
{
  const tBuild = Title.build, tUpd = Title.update, tStart = Title.start, tDraw = Title.draw;
  Title.build = function () {
    tBuild.call(this);
    this.opts = this.opts.filter(o => o !== "JOURNAL" && o !== "ACHIEVEMENTS");
    const i = this.opts.indexOf("ERASE MEMORY");
    this.opts.splice(i < 0 ? this.opts.length : i, 0, "EXTRAS");
  };
  Title.update = function (dt) {
    if (!this.confirm && Fade.a <= .5 && Input.hit("ok") && this.opts[this.idx] === "EXTRAS") { Sound.sfx("select"); Extras.idx = 0; Extras.start(); return; }
    tUpd.call(this, dt);
  };
  Title.start = function () { if (Extras.back) { Extras.back = false; Extras.start(); return; } tStart.call(this); };
  Title.draw = function () { tDraw.call(this); if (Memory.data.hard) txt("HARD MODE", 600, 8, "#ff2b45", 20, "right"); };
}

/* ---------- Sound Test ---------- */
const SoundTest = {
  start() { Scene.set("soundtest"); this.idx = 0; this.scroll = 0; this.playing = null; this.keys = Object.keys(SONGS); Music.stop(); },
  update() {
    const n = this.keys.length, vis = 9;
    if (Input.hit("up")) { this.idx = (this.idx + n - 1) % n; Sound.sfx("move"); }
    if (Input.hit("down")) { this.idx = (this.idx + 1) % n; Sound.sfx("move"); }
    if (this.idx < this.scroll) this.scroll = this.idx;
    if (this.idx >= this.scroll + vis) this.scroll = this.idx - vis + 1;
    if (Input.hit("cancel")) { Sound.sfx("back"); Extras.start(); return; }
    if (Input.hit("ok")) {
      const k = this.keys[this.idx];
      if (!(Jn.d().heard || {})[k]) { Sound.sfx("buzz"); return; }
      if (this.playing === k) { this.playing = null; Music.stop(); } else { this.playing = k; Music.name = null; Music.play(k); }
    }
  },
  draw(t) {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    txt("SOUND TEST", 320, 14, "#f6f6f2", 44, "center");
    const heard = Jn.d().heard || {}, vis = 9;
    txt(`${Object.keys(heard).length} / ${this.keys.length} heard`, 320, 58, "#9a9aa4", 22, "center");
    for (let r = 0; r < vis; r++) {
      const i = this.scroll + r, k = this.keys[i];
      if (!k) break;
      const y = 92 + r * 38, sel = i === this.idx, got = heard[k], on = this.playing === k;
      frame(90, y, 460, 33, sel ? "#ffd84a" : on ? "#57dbff" : "#2a2a30", 2, on ? "#06141a" : "#050507");
      txt(String(i + 1).padStart(2, "0"), 104, y + 3, "#555", 24);
      txt(got ? (SONG_NAMES[k] || k) : "? ? ?", 146, y + 3, got ? (on ? "#57dbff" : "#fff") : "#444", 24);
      if (on) for (let b = 0; b < 4; b++) { const h = 4 + Math.abs(Math.sin(t * 6 + b * 1.3)) * 16; ctx.fillStyle = "#57dbff"; ctx.fillRect(500 + b * 8, y + 27 - h, 5, h); }
    }
    if (this.scroll > 0) txt("▲", 570, 94, "#777", 20, "center");
    if (this.scroll + vis < this.keys.length) txt("▼", 570, 404, "#777", 20, "center");
    txt("Z play / stop · X back", 320, 452, "#555", 20, "center");
  }
};

/* ---------- Boss Rush ---------- */
const Rush = {
  lineup() { return [1, 2, 3].filter(ep => Memory.data.eps[ep]).flatMap(ep => Jn.bosses[ep]).filter(id => MONSTERS[id] && (id !== "index" || Jn.d().c.index)); },
  start() {
    this.list = this.lineup(); this.i = 0; this.spares = 0; this.kills = 0; this.result = null;
    G = freshGame(3); G.ep = 9; G.rush = true; G.hard = false;
    G.wt = 6; G.hp = maxHP(); G.weapon = "fountainpen"; G.armor = "trenchcoat"; G.inv = ["patchkit", "patchkit", "rubbercement"];
    Jn.d().run[9] = { time: 0, hits: 0, deaths: 0 };
    this.card();
  },
  card() { Scene.set("rush"); this.t = 0; Music.stop(); Fade.a = 1; Fade.in(null, 4); },
  fight() {
    const id = this.list[this.i];
    Battle.start(id, { void: false, onEnd: res => {
      if (res === "kill") this.kills++; else this.spares++;
      G.hp = Math.min(maxHP(), G.hp + Math.ceil(maxHP() / 2));
      this.i++;
      if (this.i >= this.list.length) this.finish(true); else this.card();
    } });
  },
  finish(won) {
    const run = Jn.run(9), d = Jn.d();
    this.result = { won, time: run.time, hits: run.hits, at: this.i };
    if (won) { Ach.unlock("rush"); this.newBest = !d.rush || run.time < d.rush.time; if (this.newBest) d.rush = { time: run.time, n: this.list.length }; }
    Memory.save(); G.rush = false;
    Scene.set("rush"); this.t = 0; Music.play(won ? "ending" : "gameover"); Fade.a = 1; Fade.in(null, 2);
  },
  update(dt) {
    this.t += dt;
    if (this.result) { if (this.t > 1 && (Input.hit("ok") || Input.hit("cancel"))) { Sound.sfx("select"); this.result = null; Fade.out(() => Extras.start(), 2); } return; }
    if (this.t > 1.8 || (this.t > .4 && Input.hit("ok"))) this.fight();
  },
  draw(t) {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    const r = this.result;
    if (r) {
      txt(r.won ? "BOSS RUSH CLEARED" : "BOSS RUSH OVER", 320, 70, r.won ? "#ffd84a" : "#ff2b45", 48, "center");
      const rows = [["Bosses faced", `${Math.min(r.at + (r.won ? 0 : 1), this.list.length)} / ${this.list.length}`], ["Time", Jn.fmt(r.time)], ["Hits taken", String(r.hits)], ["Spared", String(this.spares)], ["Erased", String(this.kills)]];
      rows.forEach((x, i) => { txt(x[0], 170, 160 + i * 34, "#bbb", 28); txt(x[1], 470, 160 + i * 34, "#fff", 28, "right"); });
      if (r.won && this.newBest) txt("NEW BEST TIME!", 320, 350, "#57dbff", 26, "center");
      if (!r.won) txt(`Fell to ${nameOf(this.list[r.at])}.`, 320, 350, "#9a9aa4", 24, "center");
      if (this.t > 1 && Math.floor(this.t * 2) % 2) txt("press Z", 320, 420, "#fff", 24, "center");
      return;
    }
    const id = this.list[this.i], m = MONSTERS[id];
    txt(`BOSS ${this.i + 1} / ${this.list.length}`, 320, 150, "#9a9aa4", 30, "center");
    txt(m.name.toUpperCase(), 320, 190, "#f6f6f2", 56, "center");
    txt(`HP ${G.hp} / ${maxHP()}`, 320, 270, "#ffd84a", 26, "center");
  }
};
{
  const go = GameOver.start;
  GameOver.start = function (x, y) { if (G && G.rush) { Rush.finish(false); return; } go.call(this, x, y); };
}
