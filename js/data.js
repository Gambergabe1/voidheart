"use strict";
/* ============================================================
   VOIDHEART — data: items, monsters, songs, rooms, dialogue
   ============================================================ */

/* ---------- game state ---------- */
let G = null;
const WT_TABLE = [0, 10, 25, 50, 80, 120, 170, 230, 300, 400, 520, 99999];
const POOLS = {
  margins: ["dogear", "inkling", "paperweight"],
  stacks: ["bookwyrm", "shushling", "footnote"],
  static: ["rerun", "glitchmoth", "dialtone"]
};
const AREAS = {
  margins: { name: "THE MARGINS", music: "margins", sub: "where the things that didn't fit end up" },
  stacks: { name: "THE STACKS", music: "stacks", sub: "please return all memories by the due date" },
  static: { name: "THE STATIC FIELDS", music: "static", sub: "old signals, still broadcasting" },
  bridge: { name: "THE BRIDGE OF LIGHT", music: "lastpage", sub: "" },
  last: { name: "THE LAST PAGE", music: "lastpage", sub: "the way out, if it lets you" }
};

const EP_AREAS = { 1: ["margins", "stacks", "static"], 2: ["under", "garden", "office"] };
function freshGame(ep = 1, carry = null) {
  const g = {
    ep, carry, room: ep === 1 ? "m_fall" : "e2_well", x: 0, y: 0, dir: "down",
    hp: 20, wt: 1, exp: 0, gold: 0, kills: 0, spares: 0,
    inv: ep === 1 ? ["starcandy"] : ["starcandy", "mosstea"], weapon: "pencil", armor: "raincoat",
    flags: { runes: [] }, pools: {}, poolSize: {}, areaKills: {},
    killed: [], spared: [], restored: [], seenAreas: {}, time: 0
  };
  for (const a of EP_AREAS[ep]) { g.pools[a] = [...POOLS[a]]; g.areaKills[a] = 0; }
  if (ep === 2 && carry) {
    g.wt = carry.wt || 1; g.exp = carry.exp || 0; g.gold = carry.gold || 0; g.hp = 16 + g.wt * 4;
    const smudges = (carry.killed || []).filter(k => POOLS.margins.concat(POOLS.stacks, POOLS.static).includes(k)).slice(0, 4);
    g.pools.under.push(...smudges.map(k => "smudge_" + k));
  }
  for (const a of EP_AREAS[ep]) g.poolSize[a] = g.pools[a].length;
  return g;
}
const maxHP = () => 16 + G.wt * 4;
const atkStat = () => 8 + G.wt * 2 + (ITEMS[G.weapon].atk || 0);
const defStat = () => Math.floor((G.wt - 1) / 2) + (ITEMS[G.armor].def || 0);
function gainExp(n) {
  G.exp += n; let up = false;
  while (G.exp >= WT_TABLE[G.wt]) { G.wt++; G.hp += 4; up = true; }
  return up;
}
const areaVoid = a => !!G.pools[a] && G.pools[a].length === 0 && G.areaKills[a] === (G.poolSize ? G.poolSize[a] : POOLS[a].length);
const fullVoid = () => ["margins", "stacks", "static"].every(areaVoid) && G.flags.brasswick === "kill";
const nameOf = id => (MONSTERS[id] && MONSTERS[id].name) || id;
function addItem(id) { if (G.inv.length >= 8) return false; G.inv.push(id); return true; }

/* ---------- items ---------- */
const ITEMS = {
  starcandy: { name: "Star Candy", type: "heal", heal: 10, price: 10, desc: "A candy that hums like a tiny machine." },
  mosstea: { name: "Moss Tea", type: "heal", heal: 15, price: 18, desc: "Warm. Suspiciously warm." },
  patchkit: { name: "Patch Kit", type: "heal", heal: 99, price: 45, desc: "A full system repair. Smells like glue." },
  papercrane: { name: "Paper Crane", type: "heal", heal: 18, desc: "Someone folded a wish into it." },
  inkcookie: { name: "Ink Cookie", type: "heal", heal: 12, desc: "Quill's recipe. Leaves your teeth a little blue." },
  staticpop: { name: "Static Pop", type: "heal", heal: 22, desc: "Fizzes on your tongue like a bad signal." },
  pencil: { name: "Pencil", type: "weapon", atk: 0, desc: "Sharpened at both ends. Somehow." },
  letteropener: { name: "Letter Opener", type: "weapon", atk: 4, price: 40, desc: "For letters nobody sent. ATK +4." },
  ruler: { name: "Steel Ruler", type: "weapon", atk: 8, desc: "Measure twice, cut once. ATK +8." },
  raincoat: { name: "Old Raincoat", type: "armor", def: 0, desc: "Yellow once. Now the color of rain." },
  hardcover: { name: "Hardcover", type: "armor", def: 3, price: 35, desc: "A book cover worn as armor. DEF +3." },
  foilcape: { name: "Foil Cape", type: "armor", def: 6, desc: "Blocks bad signals. And attacks. DEF +6." },
  qnote: { name: "Quill's Note", type: "key", desc: "\"If you're reading this, you're doing great. -Q\"\n\"P.S. Don't drink the ink.\"" }
};

/* use an item from inventory slot i; returns narration text */
function useItem(i) {
  const id = G.inv[i], it = ITEMS[id];
  if (!it) return "* Nothing happened.";
  if (it.type === "heal") {
    const before = G.hp;
    G.hp = Math.min(maxHP(), G.hp + it.heal);
    G.inv.splice(i, 1);
    Sound.sfx("heal");
    return `* You used the ${it.name}.\n* ${it.desc}\n* ${G.hp >= maxHP() ? "Your HP was maxed out." : "You recovered " + (G.hp - before) + " HP!"}`;
  }
  if (it.type === "weapon" || it.type === "armor") {
    const slot = it.type === "weapon" ? "weapon" : "armor";
    const old = G[slot]; G[slot] = id; G.inv[i] = old;
    Sound.sfx("item");
    return `* You equipped the ${it.name}.`;
  }
  return `* You read ${it.name}.\n${it.desc}`;
}

/* ---------- music ---------- */
const SONGS = {
  title: { bpm: 76, tracks: [
    { w: "triangle", v: .05, n: "E4 - G4 - B4 - A4 - G4 - E4 - D4 - E4 - - - . . . . . . . . G4 - B4 - D5 - C5 - B4 - G4 - A4 - B4 - - - . . . . . ." },
    { w: "sine", v: .06, n: "E2 - - - - - - - C2 - - - - - - - D2 - - - - - - - E2 - - - - - - - G2 - - - - - - - C2 - - - - - - - D2 - - - - - - - B1 - - - - - - -" }] },
  margins: { bpm: 100, tracks: [
    { w: "square", v: .022, n: "E5 - G5 - C6 - B5 - A5 - G5 - E5 - - - D5 - E5 - G5 - A5 - G5 - E5 - D5 - - -" },
    { w: "triangle", v: .06, n: "C3 - - - G3 - - - A2 - - - F2 - - - C3 - - - G3 - - - F2 - - - G2 - - -" },
    { w: "triangle", v: .02, n: ". . G4 . . . E4 . . . C5 . . . A4 . . . G4 . . . E4 . . . D4 . . . B3 ." }] },
  stacks: { bpm: 92, tracks: [
    { w: "triangle", v: .05, n: "A4 . C5 . E5 . D5 . C5 . B4 . A4 - - - G4 . A4 . B4 . C5 . B4 . G4 . E4 - - -" },
    { w: "sine", v: .07, n: "A2 - A2 - F2 - F2 - C3 - C3 - G2 - G2 - A2 - A2 - F2 - F2 - E2 - E2 - E2 - E2 -" },
    { w: "square", v: .01, n: "E6 . . . . . . . . . . . C6 . . . . . . . B5 . . . . . . . . . . ." }] },
  static: { bpm: 120, tracks: [
    { w: "square", v: .022, n: "E5 E5 . G5 . E5 D5 . B4 . B4 . D5 . E5 . E5 E5 . G5 . A5 G5 . F#5 . D5 . B4 . . ." },
    { w: "sawtooth", v: .022, n: "E2 . E2 . E2 . G2 . A2 . A2 . B2 . B2 . E2 . E2 . E2 . G2 . C3 . C3 . B2 . B2 ." }] },
  battle: { bpm: 140, tracks: [
    { w: "square", v: .024, n: "D5 . D5 F5 . D5 A5 . G5 . F5 . E5 . C5 . D5 . D5 F5 . D5 A5 . C6 . A5 . G5 . A5 ." },
    { w: "triangle", v: .07, n: "D3 D3 D2 D3 D3 D2 D3 D2 Bb2 Bb2 Bb1 Bb2 C3 C3 C2 C3 D3 D3 D2 D3 D3 D2 D3 D2 Bb2 Bb2 Bb1 Bb2 A2 A2 A1 A2" }] },
  brass: { bpm: 150, tracks: [
    { w: "square", v: .022, n: "A4 . E5 . A4 . E5 . C5 . G5 . C5 . G5 . F4 . C5 . F4 . C5 . E4 . B4 . G#4 . B4 ." },
    { w: "triangle", v: .07, n: "A2 - - - A2 - - - C3 - - - C3 - - - F2 - - - F2 - - - E2 - - - E2 - - -" },
    { w: "square", v: .012, n: "C7 . . . C7 . . . C7 . . . C7 . . . C7 . . . C7 . . . C7 . . . C7 . C7 ." }] },
  vanta: { bpm: 132, tracks: [
    { w: "square", v: .024, n: "C5 - Eb5 - G5 - C6 - Bb5 - G5 - Ab5 - - - G5 - F5 - Eb5 - D5 - Eb5 - F5 - G5 - - -" },
    { w: "triangle", v: .075, n: "C3 C3 C2 C3 C3 C2 C3 C2 Ab2 Ab2 Ab1 Ab2 Ab2 Ab1 Ab2 Ab1 F2 F2 F1 F2 F2 F1 F2 F1 G2 G2 G1 G2 G2 G1 B1 D2" },
    { w: "sawtooth", v: .012, n: "G4 - - - - - - - Eb4 - - - - - - - F4 - - - - - - - D4 - - - - - - -" }] },
  vantavoid: { bpm: 160, tracks: [
    { w: "sawtooth", v: .02, n: "C5 C5 Db5 C5 . C5 G4 . C5 C5 Db5 C5 . Eb5 Db5 . C5 C5 Db5 C5 . C5 G4 . Ab4 . G4 . F#4 . G4 ." },
    { w: "triangle", v: .08, n: "C2 C2 C3 C2 C2 C3 C2 C3 C2 C2 C3 C2 Db2 Db3 Db2 Db3 C2 C2 C3 C2 C2 C3 C2 C3 Ab1 Ab2 Ab1 Ab2 G1 G2 G1 G2" }] },
  lastpage: { bpm: 70, tracks: [
    { w: "triangle", v: .05, n: "G4 - B4 - D5 - G5 - F#5 - D5 - B4 - - - A4 - C5 - E5 - A5 - G5 - E5 - D5 - - -" },
    { w: "sine", v: .07, n: "G2 - - - - - - - D3 - - - - - - - A2 - - - - - - - D3 - - - - - - -" }] },
  void: { bpm: 60, tracks: [
    { w: "sine", v: .07, n: "C3 - - - - - - - - - - - - - - - Db3 - - - - - - - - - - - - - - -" },
    { w: "triangle", v: .015, n: "G5 . . . . . . . . . . . . . . . . . . . Ab5 . . . . . . . . . . ." }] },
  gameover: { bpm: 66, tracks: [
    { w: "triangle", v: .05, n: "C5 - - - B4 - - - A4 - - - G4 - - - E4 - - - - - - - . . . . . . . ." },
    { w: "sine", v: .05, n: "A2 - - - - - - - F2 - - - - - - - C2 - - - - - - - - - - - - - - -" }] },
  ending: { bpm: 80, tracks: [
    { w: "triangle", v: .05, n: "E5 - G5 - C6 - B5 - A5 - G5 - E5 - - - D5 - E5 - G5 - A5 - G5 - E5 - D5 - - - E5 - G5 - C6 - D6 - E6 - D6 - C6 - - - B5 - A5 - G5 - E5 - D5 - C5 - C5 - - -" },
    { w: "sine", v: .07, n: "C3 - - - G3 - - - A2 - - - F2 - - - C3 - - - G3 - - - F2 - - - G2 - - - A2 - - - E3 - - - F2 - - - C3 - - - F2 - - - G2 - - - C3 - - - - - - -" }] },
  sad: { bpm: 64, tracks: [
    { w: "triangle", v: .045, n: "A4 - - - C5 - - - B4 - - - G4 - - - A4 - - - E4 - - - F4 - - - E4 - - -" },
    { w: "sine", v: .06, n: "A2 - - - - - - - G2 - - - - - - - F2 - - - - - - - E2 - - - - - - -" }] }
};

/* ---------- dialogue helpers ---------- */
const L = (who, t, extra) => Object.assign({ who, t }, extra || {});
const SPEAKERS = {
  quill: { name: "QUILL", voice: 330 },
  lint: { name: "LINT", voice: 420 },
  margin: { name: "OLD MARGIN", voice: 140 },
  signal: { name: "SIGNAL", voice: 520 },
  brasswick: { name: "BRASSWICK", voice: 160 },
  vanta: { name: "VANTA", voice: 120 },
  voice: { name: "???", voice: 110 }
};

/* ---------- monsters ---------- */
const MONSTERS = {
  dogear: {
    name: "Dogear", area: "margins", hp: 30, atk: 3, def: 0, exp: 4, gold: 6, voice: 260,
    check: "DOGEAR - ATK 3 DEF 0\n* A page corner, folded so many times it went soft.\n* It is embarrassed about the crease.",
    intro: "* Dogear flops into view!",
    flavor: ["* Dogear is trying to lie flat. It can't.", "* Smells like an old library card.", "* Dogear crinkles nervously."],
    spareFlavor: "* Dogear is lying flat and content.",
    talk: ["...don't look at the fold.", "I used to mark someone's favorite part.", "crinkle. crinkle."],
    spareTalk: "...i feel flat. in a good way.",
    acts: {
      "Smooth": e => { e.sp += 60; e.reply = "oh... oh, that's nice."; return "* You gently smooth out Dogear's crease.\n* It flattens a little. It looks relieved."; },
      "Read": e => {
        if (e.read) return "* You read the grocery list again.\n* Dogear pretends not to be flattered.";
        e.read = 1; e.sp += 40; e.reply = "EGGS. that was MY idea.";
        return "* You read what's written on Dogear.\n* It's a grocery list from long ago.\n* Dogear is very proud of the eggs.";
      }
    },
    pats: [{ id: "rain", d: .7, s: .85, col: "#efe6cf" }, { id: "flutter", col: "#efe6cf" }]
  },
  inkling: {
    name: "Inkling", area: "margins", hp: 34, atk: 3, def: 1, exp: 5, gold: 7, voice: 200,
    check: "INKLING - ATK 3 DEF 1\n* A blot of spilled ink that copies what it sees.\n* It hasn't seen much.",
    intro: "* Inkling splashes in!",
    flavor: ["* Inkling is copying your posture.", "* Inkling drips thoughtfully.", "* Smells like a fountain pen."],
    spareFlavor: "* Inkling is waving at you. Badly.",
    talk: ["blot?", "...blot blot.", "i am you? i am you."],
    spareTalk: "BLOT! (friend!)",
    acts: {
      "Mimic": e => { e.mim = (e.mim || 0) + 1; e.sp += 35; e.reply = "blot blot blot!"; return "* You wobble like Inkling.\n* Inkling wobbles like you wobbling like it."; },
      "Wave": e => {
        if (!e.mim) return "* You wave.\n* Inkling doesn't know what waving is yet.";
        e.sp += 65; e.reply = "...wave?"; return "* You wave. Inkling waves back.\n* A friendship has been copied.";
      },
      "Ignore": e => { e.reply = "...splat."; return "* You ignore Inkling.\n* It copies your indifference. It doesn't like it."; }
    },
    pats: [{ id: "blot", col: "#7a6ad8" }, { id: "aimed", d: .7, s: .8, col: "#7a6ad8" }]
  },
  paperweight: {
    name: "Paperweight", area: "margins", hp: 42, atk: 4, def: 3, exp: 6, gold: 9, voice: 120,
    check: "PAPERWEIGHT - ATK 4 DEF 3\n* Holds things down for a living.\n* Has never once been picked up.",
    intro: "* Paperweight is in the way. Firmly.",
    flavor: ["* Paperweight is not moving. On purpose.", "* There's a tiny flower trapped inside it.", "* The air feels heavier."],
    spareFlavor: "* Paperweight looks... lighter.",
    talk: ["I DO NOT MOVE.", "Pressure is my purpose.", "...is it windy out there?"],
    spareTalk: "...i could float. maybe.",
    acts: {
      "Compliment": e => { e.comp = 1; e.sp += 40; e.reply = "...HMPH. thank you."; return "* You tell Paperweight it's doing a great job.\n* Its stony face cracks a tiny smile."; },
      "Lift": e => {
        if (!e.comp) { e.reply = "UNHAND ME."; return "* You try to lift Paperweight.\n* It digs in. It doesn't trust you yet."; }
        e.sp += 60; e.reply = "i'm... up? I'M UP."; return "* You lift Paperweight off the ground.\n* For the first time, it feels light.";
      },
      "Sit On": e => { e.sp += 20; e.reply = "...this is an honor?"; return "* You sit on Paperweight.\n* It's honored? It's honored."; }
    },
    pats: [{ id: "walls", d: .8, s: .85 }, { id: "stomp" }]
  },
  bookwyrm: {
    name: "Bookwyrm", area: "stacks", hp: 70, atk: 5, def: 2, exp: 14, gold: 14, voice: 240,
    check: "BOOKWYRM - ATK 5 DEF 2\n* A worm that eats stories instead of paper.\n* Starving for an ending.",
    intro: "* Bookwyrm uncurls from a shelf!",
    flavor: ["* Bookwyrm is chewing on a preface.", "* Bookwyrm's segments rustle.", "* You smell old glue and adventure."],
    spareFlavor: "* Bookwyrm is digesting a happy ending.",
    talk: ["Feed me a STORY.", "I've read the middle a thousand times.", "Nobody ever finishes us."],
    spareTalk: "...the ship blinked back. *sniff*",
    acts: {
      "Read Aloud": e => {
        e.reads = (e.reads || 0) + 1; e.sp += 34;
        if (e.reads === 1) { e.reply = "Go on. GO ON."; return "* You read: 'Once, a lighthouse loved a ship...'\n* Bookwyrm stops chewing."; }
        if (e.reads === 2) { e.reply = "Then what?!"; return "* '...it blinked every night so the ship could find home.'\n* Bookwyrm curls closer."; }
        e.reply = "...an ENDING."; return "* '...and one night, the ship blinked back.'\n* Bookwyrm sighs. It finally got an ending.";
      },
      "Bookmark": e => {
        if (e.bm) return "* Bookwyrm already has a bookmark.";
        e.bm = 1; e.sp += 30; e.reply = "I'll never lose my place again."; return "* You give Bookwyrm a bookmark.\n* It tucks it under a segment, delighted.";
      },
      "Spoil": e => { e.sp = Math.max(0, e.sp - 30); e.rage = 1; e.reply = "HOW. COULD. YOU."; return "* You spoil the ending.\n* Bookwyrm is FURIOUS."; }
    },
    pats: [{ id: "snake", col: "#d8a85a" }, { id: "letters", word: "ONCEUPONATIME", col: "#f2ecd8" }]
  },
  shushling: {
    name: "Shushling", area: "stacks", hp: 60, atk: 5, def: 1, exp: 12, gold: 12, voice: 500,
    check: "SHUSHLING - ATK 5 DEF 1\n* The ghost of a librarian.\n* Your footsteps are VERY loud to it.\n* Stillness may be appreciated.",
    intro: "* Shushling glides in. Silently.",
    flavor: ["* Shushling holds a finger to where its lips would be.", "* The books seem to be sleeping.", "* You hear your own heartbeat. Too loud."],
    spareFlavor: "* Shushling is peaceful. Very quietly.",
    talk: ["shhhh.", "SHHHHHHHH.", "...the books are sleeping."],
    spareTalk: "...thank you for being quiet.",
    acts: {
      "Whisper": e => { e.sp += 40; e.reply = "...better."; return "* You whisper an apology for existing loudly.\n* Shushling nods approvingly."; },
      "Stay Still": e => {
        e.still = 1; e.nextPat = { id: "hush" }; e.reply = "...show me your silence.";
        return "* You decide to stay perfectly still.\n* Shushling's next attack will judge your silence.";
      },
      "Yell": e => { e.sp = Math.max(0, e.sp - 30); e.reply = "SHHHHHHHHHHHHHH!!"; return "* You yell 'HELLO!'\n* Shushling expands with rage."; }
    },
    afterTurn(e, info) {
      if (!e.still) return null;
      e.still = 0;
      if (info.moved < 70) { e.sp += 70; return "* You barely moved.\n* Shushling is deeply, quietly impressed."; }
      return "* You fidgeted.\n* Shushling sighs a very quiet sigh.";
    },
    pats: [{ id: "ring", col: "#cfe0ff" }, { id: "lasers", col: "#cfe0ff", d: .8 }]
  },
  footnote: {
    name: "Footnote", area: "stacks", hp: 24, atk: 3, def: 0, exp: 10, gold: 8, voice: 700, small: true,
    check: "FOOTNOTE - ATK 3 DEF 0\n* Tiny. Easy to miss.\n* Has important information nobody reads.",
    intro: "* Something small appears. (Look down.)",
    flavor: ["* Footnote is trying to be noticed.", "* Footnote clears its tiny throat.", "* See below. (Footnote is below.)"],
    spareFlavor: "* Footnote has been noticed. It's glowing.",
    talk: ["*ahem*", "(see page 412)", "...is anyone reading this?"],
    spareTalk: "SOMEONE READ ME!!!",
    acts: {
      "Notice": e => { e.noticed = 1; e.sp += 50; e.reply = "y-you SEE me?"; return "* You notice Footnote.\n* It's the first time in years. It's vibrating."; },
      "Cite": e => {
        if (!e.noticed) return "* You'd have to notice it first.";
        e.sp += 50; e.reply = "I'M A SOURCE!"; return "* You cite Footnote as a source.\n* It faints from joy, then gets right back up.";
      },
      "Squint": e => { e.reply = "(see page 412)"; return "* You squint at Footnote.\n* It says: 'see page 412.' There is no page 412."; }
    },
    pats: [{ id: "tiny" }, { id: "tiny", d: 1.3 }]
  },
  brasswick: {
    name: "Brasswick", area: "stacks", hp: 200, atk: 6, def: 3, exp: 60, gold: 50, voice: 160, boss: true, bar: true,
    title: "BRASSWICK // KEEPER OF LATE RETURNS", music: "brass", noFlee: true,
    check: "BRASSWICK - ATK 6 DEF 3\n* Clockwork guard of the Late Returns.\n* Has never once been late. Is very tired.",
    intro: "* Brasswick ticks into position.",
    flavor: ["* Brasswick's gears grind. TICK. TOCK.", "* A spring creaks somewhere inside it.", "* Brasswick checks a clock that has no hands."],
    spareFlavor: "* Brasswick is... resting. For the first time.",
    talk: ["TICK. TOCK. HALT.", "NO ONE PASSES AFTER CLOSING TIME.", "IT IS ALWAYS CLOSING TIME.", "I HAVE NOT RESTED IN 9,000 YEARS."],
    spareTalk: "...TICK... i think... i'll take a break.",
    talkFn(e) {
      if (G.kills >= 6 && !e.toldVoid) { e.toldVoid = 1; return ["THE SHELVES ARE QUIET.", "YOU HAVE BEEN... BUSY."]; }
      return null;
    },
    acts: {
      "Wind Key": e => {
        if (e.wind) return "* The key is already fully wound.";
        e.wind = 1; e.sp += 25; e.reply = "...WHIRRRR. EFFICIENT."; return "* You wind the key on Brasswick's back.\n* Its gears hum a little smoother.";
      },
      "Tell Time": e => {
        if (e.time) return "* You tell it the time again. It's still wrong.";
        e.time = 1; e.sp += 25; e.reply = "THAT IS WRONG. ...THANK YOU."; return "* You tell Brasswick the time.\n* You're completely wrong. It's touched anyway.";
      },
      "Oil Gears": e => {
        if (e.oil) return "* Brasswick is already shiny.";
        e.oil = 1; e.sp += 25; e.reply = "...SQUEAK. no more squeak."; return "* You oil Brasswick's joints with Moss Tea residue.\n* It squeaks with relief.";
      },
      "Suggest a Break": e => {
        if (e.sp < 75) { e.reply = "A BREAK? ABSURD."; return "* You suggest Brasswick take a break.\n* It isn't ready to hear that yet."; }
        e.sp = 100; e.reply = "...A BREAK."; return "* You suggest Brasswick take a break.\n* It has never considered this.\n* Its ticking slows... and slows...";
      }
    },
    pats: [{ id: "clock", start: "corner" }, { id: "gears" }, { id: "tickrain" }],
    deathLines: () => ["TICK...", "...TOCK...", "...i was never... late..."],
    spareLines: () => ["...TICK.", "I SUPPOSE ONE LATE RETURN... IS PERMITTED."]
  },
  rerun: {
    name: "Rerun", area: "static", hp: 88, atk: 6, def: 2, exp: 30, gold: 20, voice: 300,
    check: "RERUN - ATK 6 DEF 2\n* A television that only plays one episode.\n* It has seen it 40,000 times.",
    intro: "* Rerun flickers on!",
    flavor: ["* Rerun is playing the same scene again.", "* A laugh track plays. Nobody laughed.", "* Rerun's antennae twitch."],
    spareFlavor: "* Rerun is watching nothing. Happily.",
    talk: ["PREVIOUSLY, ON...", "PREVIOUSLY, ON...", "...PREVIOUSLY ON. PREVIOUSLY ON."],
    spareTalk: "...this is a NEW episode.",
    acts: {
      "Change Channel": e => {
        e.ch = (e.ch || 0) + 1;
        if (e.ch > 3) return "* You flip channels. Rerun likes this one fine.";
        e.sp += 34;
        if (e.ch === 1) { e.reply = "...COOKING?"; return "* You change the channel.\n* A cooking show. Rerun is confused, but intrigued."; }
        if (e.ch === 2) { e.reply = "a turtle. a TURTLE."; return "* You change the channel.\n* A nature program. Rerun watches a turtle cross a road."; }
        e.reply = "...ahh. nothing."; return "* You change the channel.\n* Pure static. Rerun relaxes. It's been ages since it saw nothing at all.";
      },
      "Applaud": e => { if (e.app) return "* Rerun is still bowing from last time."; e.app = 1; e.sp += 30; e.reply = "THANK YOU. THANK YOU."; return "* You applaud.\n* Rerun bows. Then bows again. Then bows again."; },
      "Adjust Antenna": e => { e.sp += 15; e.reply = "...clearer."; return "* You bend Rerun's antenna.\n* The picture gets a little clearer."; }
    },
    pats: [{ id: "scan", col: "#cfe8ff" }, { id: "mixed", col: "#57dbff", d: .7 }]
  },
  glitchmoth: {
    name: "Glitchmoth", area: "static", hp: 78, atk: 6, def: 1, exp: 32, gold: 18, voice: 600,
    check: "GLITCHMOTH - ATK 6 DEF 1\n* Drawn to light. Your soul is very bright.\n* It knows this is a problem.",
    intro: "* Glitchmoth flutters toward your light!",
    flavor: ["* Glitchmoth's wings skip frames.", "* Glitchmoth is circling your soul.", "* Dust shimmers like dead pixels."],
    spareFlavor: "* Glitchmoth is content to just look.",
    talk: ["...light...", "so BRIGHT. so BRIGHT.", "i can't help it. i can't help it."],
    spareTalk: "...you're like a little moon.",
    acts: {
      "Dim": e => { e.nextPat = { id: "moths", d: .5, s: .8 }; e.sp += 50; e.reply = "...oh. calmer."; return "* You cup your hands around your soul.\n* The glow dims. Glitchmoth calms down."; },
      "Glow": e => { e.nextPat = { id: "moths", d: 1.6, s: 1.1 }; e.sp += 50; e.reply = "AAAAA PRETTY"; return "* You let your soul shine.\n* Glitchmoth is mesmerized.\n* Its next attack is... enthusiastic."; },
      "Swat": e => { e.reply = "rude."; return "* You swat at Glitchmoth.\n* It dodges. It's offended."; }
    },
    pats: [{ id: "moths" }, { id: "spark", col: "#be6cff", start: "bottom" }]
  },
  dialtone: {
    name: "Dial Tone", area: "static", hp: 70, atk: 5, def: 2, exp: 28, gold: 24, voice: 380,
    check: "DIAL TONE - ATK 5 DEF 2\n* An old phone, still waiting for a call.\n* It has been ringing for decades.",
    intro: "* Dial Tone is ringing!",
    flavor: ["* RING RING. RING RING.", "* Dial Tone's cord is tangled with hope.", "* Someone, somewhere, never called back."],
    spareFlavor: "* Dial Tone is happily on the line.",
    talk: ["RING RING.", "RING? RING??", "...is someone going to pick up?"],
    spareTalk: "...stay on the line? please?",
    acts: {
      "Answer": e => { if (e.ans) return "* You're already on the line."; e.ans = 1; e.sp += 40; e.reply = "hello?? HELLO? someone ANSWERED?"; Sound.sfx("ring"); return "* You pick up the receiver.\n* '...hello? hello??'"; },
      "Talk": e => {
        if (!e.ans) return "* You talk at the phone.\n* It's still ringing. It can't hear you.";
        e.sp += 60; e.reply = "...tell me more. tell me EVERYTHING."; return "* You talk about your day.\n* Dial Tone hangs on every word.";
      },
      "Hang Up": e => { e.sp = 0; e.ans = 0; e.reply = "...RING. RING. RING."; return "* You hang up.\n* The ringing starts again. Louder."; }
    },
    pats: [{ id: "ringwave", col: "#ff6b7a" }, { id: "lasers", col: "#ff6b7a" }]
  },
  vanta: {
    name: "VANTA", area: "last", hp: 360, atk: 6, def: 2, exp: 0, gold: 0, voice: 110, boss: true, bar: true,
    title: "VANTA // THE ARCHIVIST", music: "vanta", noFlee: true, draw: "vanta",
    init(o) {
      const e = { mood: 0 };
      if (o.void) Object.assign(e, { void: true, hp: 520, maxhp: 520, atkB: 2, defB: 1 });
      return e;
    },
    checkFn: e => e.void
      ? "VANTA - ATK 9 DEF 4\n* The first thing ever forgotten.\n* The last thing left."
      : "VANTA - ATK 7 DEF 3\n* A memory-keeper made of broken light.\n* It is trying very hard not to care.",
    intro: "* VANTA blocks the way.",
    actNames: () => Memory.data.runs > 0 ? ["Ask About Loop", "Joke", "Listen", "Remember"] : ["Ask About Loop", "Joke", "Listen"],
    acts: {
      "Ask About Loop": e => {
        if (e.void) return "* You ask about the loop.\n* VANTA doesn't answer. It's done talking.";
        e.loopQ = (e.loopQ || 0) + 1;
        if (e.loopQ === 1) { e.mood++; e.reply = "...You noticed. Everything here happens again."; return "* You ask why VANTA keeps mentioning loops.\n* Its face briefly glitches."; }
        if (e.loopQ === 2) { e.mood++; e.reply = "Every visitor. Every ending. I keep them all."; return "* You ask again.\n* VANTA looks away. Its light dims."; }
        return "* VANTA has said all it will about loops.";
      },
      "Joke": e => {
        if (e.void) return "* You tell a joke.\n* Nobody is left to laugh.";
        if (e.joked) { e.reply = "Once was enough."; return "* You tell the fog joke again.\n* VANTA is unamused. Mostly."; }
        e.joked = 1; e.mood++; e.reply = "...That was not funny. (It was a little funny.)";
        return "* You tell VANTA its entrance needed more fog.\n* ...A tiny static laugh escapes it.";
      },
      "Listen": e => {
        if (e.void) return "* You listen.\n* You hear nothing. You made sure of that.";
        e.listen = (e.listen || 0) + 1;
        if (e.listen <= 2) e.mood++;
        e.reply = e.listen === 1 ? "I was the first thing anyone ever forgot." : "So I decided nothing else would be. Not without my say.";
        return "* You stop trying to win the conversation.\n* For a moment, VANTA stops trying to win too.";
      },
      "Remember": e => {
        if (e.void) return "* You remember everything.\n* So does VANTA. That's the problem.";
        if (e.remembered) return "* VANTA already knows you remember.";
        e.remembered = 1; e.mood += 2; e.reply = "...You are not supposed to keep anything between loops.";
        return `* You tell VANTA you remember it.\n* From before. ${Memory.data.runs} time${Memory.data.runs > 1 ? "s" : ""} before.\n* VANTA freezes.`;
      }
    },
    canSpare: e => !e.void && (e.sp >= 100 || e.hp < e.maxhp * .15),
    mercyLocked: e => !!e.void,
    talkFn(e) {
      if (e.void) {
        const V = ["You won't reach the Last Page.", "Every shelf you passed is empty.", "Do you even remember their names?", "Dogear. Inkling. Paperweight...", "I am the first thing ever forgotten.", "I will be the last thing you erase.", "...not like this."];
        return V[Math.min(e.turn - 1, V.length - 1)];
      }
      if (!e.finalDone && e.mood >= 4 && e.turn >= 4) { e.finalReady = true; return ["...Enough talking.", "One last test.", "Survive it, and I will believe you."]; }
      if (e.sp >= 100) return "I'm waiting. Spare me, or don't.";
      if (e.hp < e.maxhp * .15) return "...you could end this. Either way.";
      if (e.reply) { const r = e.reply; e.reply = null; return r; }
      const N = ["I was told you would eventually arrive.", "You are much smaller than the reports implied.", "Please do not mistake hesitation for mercy.", "Every loop leaves a stain.", "Why are you still smiling?", "You could simply leave.", "That was not an invitation."];
      return N[Math.min(e.turn - 1, N.length - 1)];
    },
    flavorFn(e) {
      if (e.void) return pick(["* VANTA's light flickers. It is the last light.", "* The archive is silent.", "* VANTA is shaking."]);
      if (e.sp >= 100) return "* VANTA lowers its hands. It's waiting.";
      if (e.mood >= 3) return "* VANTA's pattern trembles.";
      const r = e.hp / e.maxhp;
      if (r < .35) return "* The archive begins to collapse.";
      if (r < .68) return "* VANTA's light sharpens.";
      return pick(["* VANTA raises one hand.", "* The air is completely still.", "* Somewhere, pages turn by themselves."]);
    },
    pattern(e) {
      if (e.finalReady) { e.finalReady = false; e.finalDone = true; e.finalNow = true; return { id: "final" }; }
      const r = e.hp / e.maxhp, ph = r < .35 ? 2 : r < .68 ? 1 : 0;
      const L = [
        [{ id: "rain", col: "#be6cff", d: 1.1 }, { id: "side" }, { id: "aimed" }, { id: "loop", d: .7 }],
        [{ id: "aimed", d: 1.2 }, { id: "spark", start: "bottom" }, { id: "walls" }, { id: "loop" }],
        [{ id: "walls", s: 1.15 }, { id: "loop", d: 1.3 }, { id: "mixed" }, { id: "collapse" }, { id: "archive" }]
      ][ph];
      const p = Object.assign({}, L[e.turn % L.length]);
      const calm = Math.min(3, e.mood) * .1;
      p.d = (p.d || 1) * (e.void ? 1.3 : 1 - calm);
      p.s = (p.s || 1) * (e.void ? 1.2 : 1);
      return p;
    },
    afterTurn(e) {
      if (e.finalNow) { e.finalNow = false; e.sp = 100; return "* The archive goes quiet.\n* VANTA lowers its hands. It's waiting."; }
      return null;
    },
    onHit(e) { if (!e.void) e.reply = pick(["...", "Is that all your weight?", "You could simply leave.", "Every blow is recorded."]); },
    deathLines: e => e.void
      ? ["So this is how the archive ends.", "Not forgotten...", "...erased."]
      : ["...Of course.", "Someone must keep the archive.", "I hope it isn't you."],
    spareLines: () => G.kills === 0
      ? ["...You really won't.", "Every loop, I braced for the blow.", "Perhaps an archive is not meant to decide which memories continue.", "...Go. I'll open the Last Page."]
      : ["...Fine.", "Take your weight with you.", "I'll keep what you left behind."]
  }
};

/* ---------- rooms ----------
 legend: ' ' void  # wall  B shelf  . , floor  P paper  R rug  o rune  D door
         ~ ink  = bridge  * static grass  T antenna  L lamp                     */
const SOLID = new Set([" ", "#", "B", "~", "T", "L"]);

const ROOMS = {
  m_fall: {
    area: "margins", map: [
      "####################",
      "####################",
      "##....,.......,...##",
      "##.PPP............##",
      "##PPPPP.......,...##",
      "##.PPP..............",
      "##..................",
      "##......,...........",
      "##................##",
      "##..,.........,...##",
      "##................##",
      "####################",
      "####################"],
    exits: [{ x: 19, y: 5, w: 1, h: 3, to: "m_hall", tx: 1, ty: 6, dir: "right" }],
    ents: [{ k: "save", tx: 15, ty: 3 }]
  },
  m_hall: {
    area: "margins", enc: true, map: [
      "##############################",
      "##############################",
      "###....,...........,......####",
      "##...........,..............##",
      "##..,..................,....##",
      "..............................",
      "......,.......................",
      "...................,..........",
      "##..........................##",
      "###......,..........,......###",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "m_fall", tx: 18, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "m_puzzle", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 6, ty: 3, text: () => ["* WELCOME TO THE MARGINS.", "* Where everything that didn't fit ends up.", "* (Someone scribbled underneath: 'be kind. we're all leftovers.')"] },
      { k: "sign", tx: 22, ty: 8, text: () => ["* TIP: Not every fight needs FIGHT.", "* Try ACT. When someone's name turns yellow, try MERCY."] }]
  },
  m_puzzle: {
    area: "margins", enc: true, map: [
      "####################",
      "####################",
      "##................##",
      "##..o.........o...##",
      "##................##",
      "...................D",
      "...................D",
      "...................D",
      "##................##",
      "##.......o........##",
      "##................##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "m_hall", tx: 28, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "m_quill", tx: 1, ty: 6, dir: "right" }],
    ents: [{ k: "sign", tx: 9, ty: 2, text: () => G.flags.puzzle1 ? ["* The three thoughts are lit.", "* The door has forgotten how to stay shut."] : ["* 'Three forgotten thoughts sleep on this floor.'", "* 'Step on each one to remember it.'"] }]
  },
  m_quill: {
    area: "margins", map: [
      "####################",
      "####BBBB####BBBB####",
      "##................##",
      "##..RRRRRR........##",
      "##..RRRRRR....L...##",
      "....RRRRRR..........",
      "....RRRRRR..........",
      "....................",
      "##................##",
      "##......,.........##",
      "##................##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "m_puzzle", tx: 18, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "s_entry", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "npc", id: "quill", tx: 12, ty: 3, if: () => !G.flags.quillGone, talk: () => quillHomeTalk() },
      { k: "sign", tx: 5, ty: 2, text: () => ["* A shelf of Quill's books.", "* 'How to Be Remembered.' 'Ink & You.' 'Kettles: A Warning.'"] }],
    triggers: [{ x: 9, y: 2, w: 1, h: 9, if: () => !G.flags.quillHome, run: () => quillHomeEvent() }]
  },
  s_entry: {
    area: "stacks", map: [
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBB",
      "BB....................BB",
      "BB..BB..BB....BB..BB..BB",
      "BB..BB..BB....BB..BB..BB",
      "........................",
      "........................",
      "........................",
      "BB..BB..BB....BB..BB..BB",
      "BB..BB..BB....BB..BB..BB",
      "BB....................BB",
      "BB.......RRRRRR.......BB",
      "BBBBBBBBBBBBBBBBBBBBBBBB"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "m_quill", tx: 18, ty: 6, dir: "left" },
      { x: 23, y: 5, w: 1, h: 3, to: "s_maze", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 5, ty: 10 },
      { k: "npc", id: "lint", tx: 12, ty: 11, talk: () => lintTalk() },
      { k: "sign", tx: 11, ty: 2, text: () => ["* THE STACKS.", "* 'Please return all memories by their due date.'", "* 'Due date: never.'"] }]
  },
  s_maze: {
    area: "stacks", enc: true, map: [
      "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
      "BB......BB.......BB.......BBBB",
      "BB......BB.......BB.......BBBB",
      "BB..BB..BB..BBB..BB..BBB..BBBB",
      "....BB......BBB......BBB......",
      "....BB......BBB......BBB......",
      "....BB..BB..BBB..BB..BBB......",
      "BB......BB.......BB.......BBBB",
      "BB......BB.......BB.......BBBB",
      "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "s_entry", tx: 22, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "s_reading", tx: 1, ty: 6, dir: "right" }],
    ents: [{ k: "item", tx: 13, ty: 9, item: "papercrane", flag: "it_crane" }]
  },
  s_reading: {
    area: "stacks", enc: true, map: [
      "BBBBBBBBBBBBBBBBBBBB",
      "BBBBBBBBBBBBBBBBBBBB",
      "BB................BB",
      "BB..RRRRRRRRRRRR..BB",
      "BB..RRRRRRRRRRRR..BB",
      "....RRRRRRRRRRRR....",
      "....RRRRRRRRRRRR....",
      "....RRRRRRRRRRRR....",
      "BB..RRRRRRRRRRRR..BB",
      "BB................BB",
      "BBBBBBBBBBBBBBBBBBBB"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "s_maze", tx: 28, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "s_clock", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 3, ty: 9 },
      { k: "npc", id: "margin", tx: 10, ty: 3, talk: () => marginTalk() }]
  },
  s_clock: {
    area: "stacks", map: [
      "####################",
      "####################",
      "##................##",
      "##.L............L.##",
      "##................##",
      "....................",
      "....................",
      "....................",
      "##................##",
      "##.L............L.##",
      "##................##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "s_reading", tx: 18, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "t_entry", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "npc", id: "brasswick", tx: 14, ty: 6, if: () => !G.flags.brasswick, talk: () => [] },
      { k: "npc", id: "brasswick", tx: 15, ty: 3, if: () => G.flags.brasswick === "spare", talk: () => brassTalk() },
      { k: "deco", id: "gears", tx: 14, ty: 6, if: () => G.flags.brasswick === "kill", talk: () => ["* A pile of cold gears.", "* None of them are ticking."] }],
    triggers: [{ x: 8, y: 2, w: 1, h: 9, if: () => !G.flags.brasswick, run: () => brassEvent() }]
  },
  t_entry: {
    area: "static", map: [
      "########################",
      "########################",
      "##****.....*****......##",
      "##**..T.......**...T..##",
      "##*..........*........##",
      "......*.........*.......",
      "....*.......*...........",
      "........*.........*.....",
      "##..T.....**........T.##",
      "##****..........****..##",
      "##....***.....*.......##",
      "########################",
      "########################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "s_clock", tx: 18, ty: 6, dir: "left" },
      { x: 23, y: 5, w: 1, h: 3, to: "t_field", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 8, ty: 9 },
      { k: "npc", id: "signal", tx: 12, ty: 3, talk: () => signalTalk() },
      { k: "item", tx: 21, ty: 9, item: "staticpop", flag: "it_pop" }]
  },
  t_field: {
    area: "static", enc: true, map: [
      "##################################",
      "##################################",
      "##..*****.....T.......****.....T##",
      "##.**...**..........**....*.....##",
      "##.*..T..*....****......T....**.##",
      "............*....**..........*....",
      ".....**........................*..",
      "..*......T....*.....**....T.......",
      "##...**.........*........***....##",
      "##.*....****.........T.......*..##",
      "##..T.......**...........**...T.##",
      "##################################",
      "##################################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "t_entry", tx: 22, ty: 6, dir: "left" },
      { x: 33, y: 5, w: 1, h: 3, to: "t_bridge", tx: 1, ty: 5, dir: "right" }],
    ents: [
      { k: "sign", tx: 8, ty: 3, text: () => ["* STATIC FIELDS.", "* CAUTION: OLD SIGNALS.", "* Do not answer anything that calls. (Unless it seems lonely.)"] },
      { k: "item", tx: 3, ty: 9, item: "ruler", flag: "it_ruler" },
      { k: "item", tx: 31, ty: 3, item: "foilcape", flag: "it_cape" }]
  },
  t_bridge: {
    area: "bridge", map: [
      "                              ",
      "                              ",
      "                              ",
      "                              ",
      "==============================",
      "==============================",
      "==============================",
      "                              ",
      "                              ",
      "                              ",
      "                              "],
    exits: [
      { x: 0, y: 4, w: 1, h: 3, to: "t_field", tx: 32, ty: 6, dir: "left" },
      { x: 29, y: 4, w: 1, h: 3, to: "v_gate", tx: 1, ty: 6, dir: "right" }],
    ents: [],
    triggers: [{ x: 14, y: 3, w: 1, h: 5, if: () => !G.flags.bridgeVoice, run: () => bridgeEvent() }]
  },
  v_gate: {
    area: "last", map: [
      "####################",
      "####################",
      "##......,.........##",
      "##................##",
      "##................##",
      "....................",
      "....................",
      "....................",
      "##................##",
      "##.......,........##",
      "##................##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "t_bridge", tx: 28, ty: 5, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "v_throne", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 4, ty: 3 },
      { k: "npc", id: "quill", tx: 13, ty: 6, if: () => !G.flags.gateQuill, talk: () => [] }],
    triggers: [{ x: 8, y: 2, w: 1, h: 9, if: () => !G.flags.gateQuill, run: () => gateEvent() }]
  },
  v_throne: {
    area: "last", noMusic: true, map: [
      "####################",
      "####################",
      "##................##",
      "##................##",
      "##................##",
      "..................##",
      "..................##",
      "..................##",
      "##................##",
      "##................##",
      "##................##",
      "####################",
      "####################"],
    exits: [{ x: 0, y: 5, w: 1, h: 3, to: "v_gate", tx: 18, ty: 6, dir: "left" }],
    ents: [{ k: "npc", id: "vanta", tx: 13, ty: 6, talk: () => [] }],
    triggers: [{ x: 6, y: 2, w: 1, h: 9, if: () => !G.flags.vantaDone, run: () => vantaEvent() }]
  }
};
// normalize map widths so a typo can never crash collision
for (const r of Object.values(ROOMS)) {
  const w = Math.max(...r.map.map(s => s.length));
  r.map = r.map.map(s => s.padEnd(w, "#"));
}

/* ---------- NPC dialogue ---------- */
const looped = () => Memory.data.runs > 0;
const lastVoid = () => Memory.data.last === "void";

function introQuillLines() {
  const a = [];
  if (lastVoid()) {
    a.push(L("quill", "Oh! Oh, a pers-"), L("quill", "..."), L("quill", "...No. I know that face."), L("quill", "You've been here before. Haven't you."), L("quill", "Everything went so quiet last time."), L("quill", "...I'm sorry. I'm being rude. Maybe this loop will be different."));
  } else {
    a.push(L("quill", "Oh! Oh oh oh. A person. A whole one!"));
    if (looped()) a.push(L("quill", "...Have we met? You have a familiar crease to you."));
    a.push(L("quill", "Don't be scared! I'm Quill. I look after the Margins."));
  }
  a.push(
    L("quill", "You fell in, didn't you? Things fall in all the time. Socks. Birthdays. Whole languages."),
    L("quill", "This is the Archive. Everything that gets forgotten ends up down here."),
    L("quill", "To get back up, you'll have to reach the Last Page. VANTA guards it."),
    L("quill", "Folks down here might get defensive. You don't have to hurt them."),
    L("quill", "Use ACT. Talk. Listen. When they're ready to stop, their name turns yellow."),
    L("quill", "That's when you show MERCY."),
    L("quill", "My nook is just past the hall. I'll put the kettle on! Ink kettle. Don't drink from it."));
  return a;
}

function quillHomeEvent() {
  World.busy = true;
  const done = () => { G.flags.quillHome = true; World.busy = false; };
  if (areaVoid("margins")) {
    Dialog.open([
      L("quill", "...Oh. It's you."),
      L("quill", "Dogear didn't come when I called. Neither did Inkling. Or Paperweight."),
      L("quill", "You're carrying a lot of weight already. I can see it on you."),
      L("quill", "...The way is open. I won't stand in it."),
      L("quill", "I'm just ink.")], () => { G.flags.quillGone = true; done(); });
    return;
  }
  const lines = [
    L("quill", "You made it! And you solved the runes! You're smarter than a dictionary."),
    L("quill", "Here, take these for the road. One cookie, still warm. Don't ask what kind of warm.")];
  Dialog.open(lines, () => {
    if (addItem("inkcookie")) Toast.show("GOT: INK COOKIE");
    Sound.sfx("item");
    const more = [
      L("quill", "Past my nook are the Stacks. Then the Static Fields. Then the bridge to the Last Page."),
      L("quill", "VANTA isn't cruel. VANTA just decided someone has to choose what's worth remembering."),
      L("quill", "Can I ask you something?"),
      L("quill", "Every time you erase someone down here, you carry them. We call that WEIGHT."),
      L("quill", "It makes you stronger. And heavier. Much heavier."),
      L("quill", "Will you promise me you'll try not to carry any?", {
        ch: ["I promise", "No promises"],
        on: i => i === 0
          ? [L("quill", "...Thank you. Here, take this. Read it if you ever feel heavy.", { give: "qnote" })]
          : [L("quill", "...That's honest, at least. I'll hope anyway. Hoping's free.")]
      })];
    Dialog.open(more, done);
  });
}
function quillHomeTalk() {
  if (G.kills > 0 && !G.flags.quillKnows) {
    G.flags.quillKnows = true;
    return [L("quill", "...You feel heavier than when I last saw you."), L("quill", "I'm not angry. I just... I hope they weren't scared.")];
  }
  return [pick([
    L("quill", "The kettle's on! It's always on. It doesn't have an off."),
    L("quill", "If you get lost, just follow the paper trail. Literally. There's a lot of paper."),
    L("quill", "Lint runs a shop in the Stacks. Everything is pre-owned. Very pre-owned.")])];
}
function lintTalk() {
  if (areaVoid("stacks") || (G.kills >= 4 && G.spares === 0)) {
    return ["* The counter is empty.", "* A note: 'CLOSED. FOREVER. DON'T COME LOOKING.'"];
  }
  return [{ who: "lint", t: "Welcome to Lint's Lost & Found! Everything's pre-owned. Extremely pre-owned.", after: () => Shop.open() }];
}
function marginTalk() {
  if (areaVoid("stacks")) return ["* The old book is shut tight.", "* Its pages are glued together, as if it's holding its breath."];
  const a = [
    L("margin", "Ahh. A visitor. I am Old Margin, volume twelve of an encyclopedia no one finished."),
    L("margin", "You'd like to know about VANTA? VANTA was the very first thing anyone ever forgot."),
    L("margin", "Being forgotten first gives you the longest memory down here. VANTA remembers every visitor."),
    L("margin", "Some say it remembers visitors who came before... and came again.")];
  if (looped()) a.push(L("margin", `Curious. Your name is already in my index. ${Memory.data.runs + 1} entries. All you.`));
  if (G.kills > 0) a.push(L("margin", `...And I see ${G.kills} name${G.kills > 1 ? "s" : ""} newly crossed out. Hm.`));
  return a;
}
function signalTalk() {
  if (areaVoid("static")) return ["* Only static plays here now.", "* Signal is nowhere to be found."];
  return [pick([
    [L("signal", "bzzt! Hi! I'm Signal! I pick up old broadcasts with my head!"), L("signal", "Right now I'm getting a weather report from a town that doesn't exist anymore. Sunny!")],
    [L("signal", "Past the fields there's a bridge. Sometimes VANTA's voice comes out of my head when people cross it."), L("signal", "Spooky, huh? bzzt.")],
    [L("signal", "There's a phone in the fields that never stops ringing."), L("signal", "My mom says don't answer strangers. But it sounds so lonely...")]
  ])].flat();
}
function brassTalk() {
  return [L("brasswick", "TICK. YOU MAY PASS."), L("brasswick", "I HAVE DECIDED TO BE LATE. ON PURPOSE. IT IS... THRILLING.")];
}

function brassEvent() {
  World.busy = true;
  const v = G.kills >= 6;
  const lines = v
    ? [L("brasswick", "TICK."), L("brasswick", "THE STACKS HAVE GONE QUIET. THE LATE RETURNS WILL NOT BE RETURNING."), L("brasswick", "YOU WILL NOT PASS.")]
    : [L("brasswick", "TICK. TOCK. HALT."), L("brasswick", "I AM BRASSWICK. KEEPER OF LATE RETURNS."), L("brasswick", "IT IS PAST CLOSING TIME. IT IS ALWAYS PAST CLOSING TIME."), L("brasswick", "NO ONE PASSES AFTER CLOSING.")];
  Dialog.open(lines, () => {
    startEncounter("brasswick", {
      onEnd: res => {
        G.flags.brasswick = res;
        if (res === "kill") { G.kills++; G.killed.push("brasswick"); }
        else { G.spares++; G.spared.push("brasswick"); }
        returnToWorld();
      }
    });
  });
}
function bridgeEvent() {
  World.busy = true; G.flags.bridgeVoice = true;
  let lines;
  if (fullVoid()) lines = [L("voice", "Stop."), L("voice", "There is nothing left behind you. Do you understand? Nothing."), L("voice", "I will not let you reach the Last Page.")];
  else if (G.kills === 0) lines = [L("voice", "...I can hear you crossing."), L("voice", "You've spared every one of them. Why?"), L("voice", "Kindness doesn't last down here. It's the first thing to be forgotten."), L("voice", "Come, then. Let me see if it survives me.")];
  else lines = [L("voice", "You've left marks on my archive."), L("voice", "Some names erased. Some spared. How indecisive."), L("voice", "Come. Let us decide together.")];
  Music.play("void");
  Dialog.open(lines, () => { World.busy = false; Music.play(World.musicFor()); });
}
function gateEvent() {
  World.busy = true; G.flags.gateQuill = true;
  let lines;
  if (fullVoid()) {
    const names = G.killed.filter(k => k !== "brasswick").map(nameOf);
    lines = [L("quill", "..."), L("quill", "I counted them. Every name."), L("quill", names.join(". ") + ". Brasswick."), L("quill", "I can't stop you. I'm just ink."), L("quill", "But I can remember them. That's the one thing you can't take.")];
  } else {
    lines = [L("quill", "You're here! I took a shortcut. Through a footnote. Don't ask."), L("quill", "Whatever happens in there... I'm glad you fell in. Is that weird to say?")];
    if (G.kills > 0) lines.push(L("quill", "I know you hurt some of them. I won't pretend I don't. But it isn't too late to listen."));
    lines.push(L("quill", "VANTA's been alone a long time. Longer than anyone. Maybe... just talk to it."));
  }
  Dialog.open(lines, () => { World.fadeEnt("quill"); World.busy = false; });
}
function vantaEvent() {
  World.busy = true;
  const r = G.kills === 0 ? "pacifist" : fullVoid() ? "void" : "neutral";
  const lines = [];
  if (lastVoid() && r !== "void") lines.push(L("vanta", "You. I remember what you did last time. The white. The quiet."), L("vanta", "...And yet you've come back differently."));
  else if (looped()) lines.push(L("vanta", `Again. You've walked this way ${Memory.data.runs} time${Memory.data.runs > 1 ? "s" : ""} before. I remember every one.`));
  else lines.push(L("vanta", "So. The one who fell."));
  if (r === "pacifist") lines.push(L("vanta", "You hurt no one. In all my archive, there are very few records of that."), L("vanta", "But kindness that has never been tested is only a rumor."), L("vanta", "Let us test it."));
  else if (r === "neutral") lines.push(L("vanta", `You carry ${G.kills} erased memor${G.kills > 1 ? "ies" : "y"}. Weight ${G.wt}.`), L("vanta", "Leave the rest of them here with me, and go."), L("vanta", "...No? Then let us end this."));
  else lines.push(L("vanta", "Every shelf is empty. Every voice is gone."), L("vanta", "You didn't come here to leave. You came here to finish."), L("vanta", "I am the last thing in the Archive. And I was the first."), L("vanta", "I will not be erased quietly."));
  Dialog.open(lines, () => {
    G.flags.vantaDone = true;
    startEncounter("vanta", {
      void: r === "void",
      onEnd: res => {
        const vk = res === "kill";
        let end;
        if (!vk && G.kills === 0) end = "pacifist";
        else if (vk && fullVoid()) end = "void";
        else end = "neutral";
        if (vk) { G.kills++; G.killed.push("vanta"); } else { G.spared.push("vanta"); }
        Ending.start(end, { vantaKilled: vk });
      }
    });
  });
}
