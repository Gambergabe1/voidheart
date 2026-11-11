"use strict";
/* ============================================================
   VOIDHEART — Episode 2: THE UNDERPRINT  (+ Lost Pages lore)
   ============================================================ */
const EPISODES = [
  { n: 1, title: "THE LAST PAGE", sub: "Fall into the Archive. Find the way back out.", playable: true, music: "title" },
  { n: 2, title: "THE UNDERPRINT", sub: "Something under the Archive is erasing it.", playable: true, music: "well",
    tease: "Under the Archive there is another place. Things don't go there to be forgotten." },
  { n: 3, title: "THE MARGINALIA", sub: "Coming soon.", playable: false,
    tease: "Up in the world above, someone has started writing down things that never happened." }
];

/* ---------- Lost Pages: the Archive's hidden history ---------- */
const LOST_PAGES = {
  p1: { ep: 1, title: "Lost Page I: Before", text: ["Before there was an Archive, there was one thing nobody remembered.", "It did not have a name yet. It sat in the dark for a very long time."] },
  p2: { ep: 1, title: "Lost Page II: The Catching", text: ["Then other things began to fall. A shoe. A lullaby. The name of a dog.", "The nameless thing caught them so they would not break."] },
  p3: { ep: 1, title: "Lost Page III: Shelves", text: ["It built shelves, and rules, and a mask so no one would see its face.", "It called itself VANTA. It thought a keeper should not need anything of its own."] },
  p4: { ep: 1, title: "Lost Page IV: The First Erasure", text: ["VANTA once had another name. The name of the light it was, before the dark.", "Remembering that name hurt. So VANTA did the one thing a keeper must never do. It erased it."] },
  p5: { ep: 2, title: "Lost Page V: Below", text: ["Forgotten things go to the Archive. Erased things go under it.", "The Underprint is where only the marks remain: smudges, outlines, the shape of a word that used to be there."] },
  p6: { ep: 2, title: "Lost Page VI: The Clerk", text: ["The erased name did not stay quiet. Down in the Underprint it grew a desk, a stamp, and a very long list.", "It signs everything REDACT. It cannot remember signing anything else."] },
  p7: { ep: 2, title: "Lost Page VII: The Reasoning", text: ["REDACT's reasoning was simple. Waiting in the dark to be remembered is cruel.", "If everything is erased, nothing ever has to wait again."] },
  p8: { ep: 2, title: "Lost Page VIII: The Name", text: ["Under the black bar there are three letters. The first is S. The last is L.", "The middle one is O. It was the first light in the dark, and its name was SOL."] }
};
const allPagesFound = () => Object.keys(LOST_PAGES).filter(k => LOST_PAGES[k].ep <= 2).every(k => Memory.hasPage(k));

/* Ep1 page placements + foreshadowing */
ROOMS.m_hall.ents.push({ k: "page", tx: 12, ty: 7, page: "p1" });
ROOMS.s_maze.ents.push({ k: "page", tx: 4, ty: 2, page: "p2" });
ROOMS.s_entry.ents.push({ k: "page", tx: 20, ty: 10, page: "p3" });
ROOMS.t_field.ents.push({ k: "page", tx: 17, ty: 9, page: "p4" });

/* ---------- areas, items, speakers, songs ---------- */
POOLS.under = ["typo", "staple", "whiteout"];
Object.assign(AREAS, {
  well: { name: "THE INK WELL", music: "well", sub: "where the Archive drains" },
  under: { name: "THE UNDERPRINT", music: "underprint", sub: "what remains after erasing" },
  office: { name: "THE REDACTION OFFICE", music: "office", sub: "all corrections are final" }
});
Object.assign(ITEMS, {
  carboncopy: { name: "Carbon Copy", type: "heal", heal: 20, desc: "A copy of a snack. Tastes 90% as good." },
  rubbercement: { name: "Rubber Cement", type: "heal", heal: 30, desc: "Sticks you back together. Don't ask how." },
  fountainpen: { name: "Fountain Pen", type: "weapon", atk: 12, desc: "Writes in permanent ink. ATK +12." },
  trenchcoat: { name: "Trench Coat", type: "armor", def: 8, desc: "Lots of pockets, all empty. DEF +8." }
});
Object.assign(SPEAKERS, {
  ledger: { name: "LEDGER", voice: 180 },
  redact: { name: "REDACT", voice: 90 },
  smudge: { name: "???", voice: 150 }
});
Object.assign(SONGS, {
  well: { bpm: 84, tracks: [
    { w: "triangle", v: .05, n: "D4 - F4 - A4 - G4 - F4 - E4 - D4 - - - C4 - D4 - F4 - E4 - D4 - C4 - A3 - - -" },
    { w: "sine", v: .07, n: "D2 - - - - - - - A1 - - - - - - - Bb1 - - - - - - - A1 - - - - - - -" }] },
  underprint: { bpm: 100, tracks: [
    { w: "square", v: .02, n: "E5 . . B4 . . G5 . F#5 . . D5 . . B4 . E5 . . B4 . . A5 . G5 . . F#5 . . D5 ." },
    { w: "triangle", v: .07, n: "E2 - - - E2 - - - C2 - - - C2 - - - A1 - - - A1 - - - B1 - - - B1 - - -" }] },
  office: { bpm: 110, tracks: [
    { w: "square", v: .02, n: "C5 . E5 . G5 . E5 . F5 . D5 . B4 . G4 . C5 . E5 . G5 . C6 . B5 . G5 . D5 . . ." },
    { w: "triangle", v: .06, n: "C3 . G2 . C3 . G2 . F2 . C3 . G2 . D3 . C3 . G2 . C3 . G2 . F2 . G2 . G2 . . ." },
    { w: "square", v: .01, n: "C7 . . . . . . . C7 . C7 . . . . ." }] },
  redact: { bpm: 144, tracks: [
    { w: "square", v: .024, n: "A4 A4 . A4 C5 . A4 . G4 . E4 . F4 . G4 . A4 A4 . A4 C5 . E5 . D5 . C5 . B4 . G4 ." },
    { w: "triangle", v: .075, n: "A2 A1 A2 A1 A2 A1 A2 A1 F2 F1 F2 F1 G2 G1 G2 G1 A2 A1 A2 A1 A2 A1 A2 A1 F2 F1 F2 F1 E2 E1 E2 E1" },
    { w: "sawtooth", v: .01, n: "E5 - - - - - - - F5 - - - - - - - G5 - - - - - - - E5 - - - - - - -" }] }
});

/* ---------- Episode 2 monsters ---------- */
Object.assign(MONSTERS, {
  typo: {
    name: "Typo", area: "under", hp: 80, atk: 6, def: 2, exp: 22, gold: 20, voice: 340,
    check: "TYPO - ATK 6 DEF 2\n* A word that came out wrong.\n* It was erased before anyone could fix it.",
    intro: "* Typo shuffles in. Its letters are in the wrong order.",
    flavor: ["* Typo is trying to spell itself. Badly.", "* A red squiggle follows Typo everywhere.", "* Smells like pencil shavings."],
    spareFlavor: "* Typo is spelled correctly. It's beaming.",
    talk: ["TPYO.", "...OTYP? no...", "I was SUPPOSED to be a word."],
    spareTalk: "T-Y-P-O. that's ME!",
    acts: {
      "Proofread": e => { e.sp += 40; e.reply = "...is it... TYPO?"; return "* You read Typo carefully, letter by letter.\n* You find the mistake. It's only small."; },
      "Spell It Out": e => { e.sp += 35; e.reply = "T... Y..."; return "* You spell Typo's name out loud, slowly.\n* Typo shuffles its letters along with you."; },
      "Laugh": e => { e.sp = Math.max(0, e.sp - 25); e.rage = 1; e.reply = "IT'S NOT FUNNY."; return "* You laugh at Typo's spelling.\n* Typo turns bright red. Red like the squiggle."; }
    },
    pats: [{ id: "letters", word: "TPYOOTYPYTOP", col: "#f2ecd8" }, { id: "lasers", col: "#ff6b7a", d: .9 }]
  },
  staple: {
    name: "Staple", area: "under", hp: 90, atk: 7, def: 3, exp: 24, gold: 22, voice: 220,
    check: "STAPLE - ATK 7 DEF 3\n* Held a report together for forty years.\n* The report was erased. Now it holds nothing.",
    intro: "* Staple clamps into view!",
    flavor: ["* Staple pinches the air. There's nothing there.", "* Staple's legs are bent from holding on so hard.", "* Click. Click. Click."],
    spareFlavor: "* Staple is holding on to something again.",
    talk: ["I HOLD. I HOLD.", "...what am i holding?", "nothing. i'm holding nothing."],
    spareTalk: "...i'll keep it safe. promise.",
    acts: {
      "Offer Pages": e => { if (e.held) return "* Staple is already holding your pages. Tightly."; e.held = 1; e.sp += 50; e.reply = "...pages. PAGES!"; return "* You hand Staple a few blank pages.\n* It clamps them together with enormous relief."; },
      "Hold On": e => { e.sp += e.held ? 50 : 20; e.reply = "...you hold too?"; return "* You hold on to Staple.\n* For a moment you're both just holding on."; },
      "Unbend": e => { e.sp += 15; e.reply = "...ow. ...better."; return "* You carefully straighten one of Staple's legs.\n* It was bent for a very long time."; }
    },
    pats: [{ id: "walls", col: "#b8c0cc" }, { id: "stomp", col: "#b8c0cc" }]
  },
  whiteout: {
    name: "Whiteout", area: "under", hp: 72, atk: 6, def: 1, exp: 26, gold: 18, voice: 460,
    check: "WHITEOUT - ATK 6 DEF 1\n* Paints over every mistake it sees.\n* Has painted over most of itself.",
    intro: "* Whiteout drips toward you.",
    flavor: ["* Whiteout is painting over the floor. And the walls.", "* Whiteout smells sharp and chemical.", "* There are layers and layers of white on it."],
    spareFlavor: "* Whiteout has stopped painting. Something shows through.",
    talk: ["MISTAKE. COVER IT.", "no one has to see.", "...under all this, i forget what i was."],
    spareTalk: "...it's okay if it shows?",
    acts: {
      "Make a Mistake": e => { e.sp += 40; e.reply = "...i'll... leave that one."; return "* You make a mistake on purpose and leave it there.\n* Whiteout trembles... and lets it stay."; },
      "Blow Dry": e => { e.sp += 25; e.reply = "fwoooo..."; return "* You gently blow on Whiteout's wet paint.\n* It dries, calmer."; },
      "Ask What's Under": e => { if (e.asked) return "* You've already asked. It's still thinking."; e.asked = 1; e.sp += 35; e.reply = "...a drawing. of a cat. it was a bad cat."; return "* You ask what's under all the white.\n* Whiteout goes very still."; }
    },
    pats: [{ id: "rain", col: "#f6f6f2", d: 1.1 }, { id: "side", col: "#f6f6f2" }]
  },
  redact: {
    name: "REDACT", area: "office", hp: 400, atk: 7, def: 3, exp: 0, gold: 0, voice: 90, boss: true, bar: true,
    title: "REDACT // HEAD OF CORRECTIONS", music: "redact", noFlee: true,
    check: "REDACT - ATK 8 DEF 3\n* Head of Corrections in the Underprint.\n* There is a black bar where its face should be.",
    intro: "* REDACT raises its stamp.",
    init: () => ({ reads: 0 }),
    actNames() {
      const a = ["Read the Black Bar", "Object"];
      if (G.restored.length) a.push("Show the Smudges");
      if (G.flags.vantaAlly) a.push("Call VANTA");
      if (allPagesFound()) a.push("Say Its Name");
      return a;
    },
    acts: {
      "Read the Black Bar": e => {
        e.reads++;
        if (e.reads > 3) return "* The black bar has told you all it will.";
        e.sp += 22;
        if (e.reads === 1) { e.reply = "DO NOT READ THAT."; return "* You squint at the black bar.\n* Under it, faintly, there's a letter: S."; }
        if (e.reads === 2) { e.reply = "THAT IS CLASSIFIED."; return "* You look closer.\n* There's another letter at the end: L."; }
        e.reply = "...WHY DO YOU CARE WHAT IT SAID?"; return `* The middle letter is too faded to read.\n* ${allPagesFound() ? "...but you already know it, don't you?" : "Maybe the Lost Pages say more."}`;
      },
      "Object": e => { e.sp += 12; e.reply = "OBJECTION... NOTED."; return "* You object to the erasing.\n* REDACT stamps your objection DENIED.\n* ...but it hesitated first."; },
      "Show the Smudges": e => {
        if (e.shown) return "* REDACT is still thinking about the smudges.";
        e.shown = 1; e.sp += 30; e.reply = "...ERASED THINGS DO NOT COME BACK. THEY DO NOT.";
        return `* You tell REDACT about ${G.restored.map(nameOf).join(", ")}.\n* They were erased, and you helped them remember.`;
      },
      "Call VANTA": e => {
        if (e.called) return "* VANTA is already here, watching from the door.";
        e.called = 1; e.sp += 40; e.reply = "...THAT VOICE.";
        return "* You call for VANTA.\n* From the doorway, VANTA says quietly: 'I know that handwriting.'";
      },
      "Say Its Name": e => { e.named = 1; e.sp = 100; e.reply = "..."; return "* 'SOL.'\n* You say the name out loud.\n* The black bar cracks down the middle."; }
    },
    canSpare: e => e.sp >= 100 || e.hp < e.maxhp * .15,
    talkFn(e) {
      if (e.sp >= 100) return e.named ? "...SOL. That was... a nice name." : "...FILE ON HOLD. I AM... LISTENING.";
      if (e.hp < e.maxhp * .15) return "...FILE ALMOST CLOSED. FINISH IT. OR DON'T.";
      if (e.reply) { const r = e.reply; e.reply = null; return r; }
      const N = ["ALL CORRECTIONS ARE FINAL.", "YOU ARE A CLERICAL ERROR.", "THE ARCHIVE IS MESSY. I AM TIDYING IT.", "WAITING IN THE DARK TO BE REMEMBERED IS CRUEL.", "IF EVERYTHING IS ERASED, NO ONE WAITS AGAIN.", "...WHY DOES THAT LETTER LOOK FAMILIAR?"];
      return N[Math.min(e.turn - 1, N.length - 1)];
    },
    flavorFn(e) {
      if (e.sp >= 100) return "* The stamp hangs still in REDACT's hand.";
      if (e.sp >= 50) return "* REDACT keeps checking its own paperwork.";
      return pick(["* REDACT files something away. It's you.", "* Somewhere, a typewriter keeps typing.", "* The black bar on REDACT's face doesn't move."]);
    },
    pattern(e) {
      const ph = e.hp / e.maxhp < .5 ? 1 : 0;
      const L = [[{ id: "stamp" }, { id: "scan", col: "#f6f6f2" }, { id: "lasers", col: "#f6f6f2" }],
        [{ id: "stamp", d: 1.3 }, { id: "walls", col: "#f6f6f2", s: 1.1 }, { id: "mixed", col: "#f6f6f2" }, { id: "collapse", col: "#f6f6f2" }]][ph];
      const p = Object.assign({}, L[e.turn % L.length]);
      p.d = (p.d || 1) * (1 - Math.min(.3, e.sp / 300));
      return p;
    },
    onHit(e) { e.reply = pick(["CORRECTION RECEIVED.", "FILED.", "THAT WILL GO ON YOUR RECORD."]); },
    deathLines: () => ["...STRUCK...", "...THROUGH...", "...no one will remember... what i was..."],
    spareLines: e => e.named
      ? ["...SOL.", "I was the light it had before the dark.", "It erased me so it would not miss me.", "...I do not mind anymore."]
      : ["...FILE CLOSED.", "I will stop the stamps. For now."]
  }
});

/* Smudges: what remains of anything erased in Episode 1 */
for (const k of [...POOLS.margins, ...POOLS.stacks, ...POOLS.static]) {
  const base = MONSTERS[k], nm = base.name;
  MONSTERS["smudge_" + k] = {
    name: "Smudge", area: "under", hp: 50, atk: 5, def: 0, exp: 0, gold: 0, voice: 150, draw: "smudge", base: k,
    killText: "* It was already erased.\n* There was nothing left to take.",
    check: `SMUDGE - ATK 5 DEF 0\n* What's left after ${nm} was erased.\n* It's trying to remember its own shape.`,
    intro: `* A smudge drifts closer.\n* It looks a little like ${nm}.`,
    flavor: ["* The smudge flickers at the edges.", "* It keeps almost becoming something.", `* For a second it looks exactly like ${nm}.`],
    spareFlavor: `* It's not a smudge anymore. It's ${nm}.`,
    talk: ["...who... was i?", "i had a... shape...", "...you. i know you."],
    spareTalk: `...${nm.toLowerCase()}. i was ${nm.toLowerCase()}.`,
    acts: {
      "Remember": e => { e.sp += 50; e.reply = "...more... tell me more..."; return `* You tell the smudge about ${nm}.\n* Its outline sharpens a little.`; },
      "Apologize": e => { e.sp += 50; e.reply = "..."; return "* You tell the smudge you're sorry.\n* It's quiet for a long time."; }
    },
    pats: base.pats.map(p => Object.assign({}, p, { col: "#9a9aa4" }))
  };
}

/* ---------- Episode 2 rooms ---------- */
Object.assign(ROOMS, {
  e2_well: {
    area: "well", map: [
      "####################",
      "####################",
      "##................##",
      "##...~~~~~~.......##",
      "##..~~~~~~~~......##",
      "##..~~~~~~~~........",
      "##...~~~~~~.........",
      "##..................",
      "##................##",
      "##..,.......,.....##",
      "##................##",
      "####################",
      "####################"],
    exits: [{ x: 19, y: 5, w: 1, h: 3, to: "e2_under1", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 15, ty: 3 },
      { k: "page", tx: 3, ty: 9, page: "p5" },
      { k: "npc", id: "quill", tx: 12, ty: 8, if: () => G.carry && G.carry.ending !== "void", talk: () => quill2Talk() },
      { k: "npc", id: "smudge", tx: 12, ty: 8, if: () => G.carry && G.carry.ending === "void", talk: () => [L("smudge", "...ink... i was... ink..."), L("smudge", "...go down... see what's left...")] }]
  },
  e2_under1: {
    area: "under", enc: true, map: [
      "##############################",
      "##############################",
      "##.....,..........,.........##",
      "##..~~.......~~~.......~~...##",
      "##..~~...............,......##",
      "..............................",
      "......~~~.........~~~.........",
      "..............................",
      "##.......,..........~~......##",
      "##..~~........,.............##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_well", tx: 18, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e2_under2", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 8, ty: 2, text: () => ["* THE UNDERPRINT.", "* 'Everything here was removed for your convenience.'", "* (The sign has been partly erased. You can still read where the words used to be.)"] },
      { k: "npc", id: "ledger", tx: 14, ty: 4, talk: () => ledgerTalk() },
      { k: "item", tx: 8, ty: 9, item: "carboncopy", flag: "it_carbon" },
      { k: "page", tx: 26, ty: 9, page: "p6" }]
  },
  e2_under2: {
    area: "under", enc: true, map: [
      "########################",
      "########################",
      "##......~~~~~~........##",
      "##......~~~~~~........##",
      "##....................##",
      "........................",
      "........................",
      "........................",
      "##....................##",
      "##..~~~~~~....~~~~~~..##",
      "##....................##",
      "########################",
      "########################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_under1", tx: 28, ty: 6, dir: "left" },
      { x: 23, y: 5, w: 1, h: 3, to: "e2_hall", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 4, ty: 3 },
      { k: "item", tx: 16, ty: 2, item: "fountainpen", flag: "it_pen" },
      { k: "page", tx: 21, ty: 10, page: "p7" },
      { k: "sign", tx: 11, ty: 4, text: () => G.restored.length
        ? ["* Faint outlines on the floor, where things were erased.", `* Some of them are filling back in. ${G.restored.map(nameOf).join(", ")}.`]
        : ["* Faint outlines on the floor, where things were erased.", "* If someone remembered them, would they come back?"] }]
  },
  e2_hall: {
    area: "office", map: [
      "####################",
      "##BBBB##BBBB##BBBB##",
      "##................##",
      "##.L..........L...##",
      "##................##",
      "....................",
      "....................",
      "....................",
      "##................##",
      "##BBBB..BBBB..BBBB##",
      "##................##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_under2", tx: 22, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "e2_office", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 9, ty: 3 },
      { k: "page", tx: 16, ty: 10, page: "p8" },
      { k: "item", tx: 3, ty: 10, item: "trenchcoat", flag: "it_coat" },
      { k: "item", tx: 10, ty: 10, item: "rubbercement", flag: "it_cement" },
      { k: "npc", id: "vanta", tx: 12, ty: 4, if: () => G.carry && G.carry.vantaAlive, talk: () => vantaHallTalk() },
      { k: "sign", tx: 12, ty: 4, if: () => !(G.carry && G.carry.vantaAlive), text: () => ["* A memo is pinned to the wall.", "* 'KEEPER POSITION: VACANT.'", "* 'ARCHIVE SCHEDULED FOR FULL CORRECTION. -R'"] }]
  },
  e2_office: {
    area: "office", noMusic: true, map: [
      "####################",
      "##BBBBBBBBBBBBBBBB##",
      "##................##",
      "##................##",
      "##..L..........L..##",
      "..................##",
      "..................##",
      "..................##",
      "##................##",
      "##................##",
      "##................##",
      "####################",
      "####################"],
    exits: [{ x: 0, y: 5, w: 1, h: 3, to: "e2_hall", tx: 18, ty: 6, dir: "left" }],
    ents: [{ k: "npc", id: "redact", tx: 13, ty: 6, if: () => !G.flags.redactDone, talk: () => [] }],
    triggers: [{ x: 6, y: 2, w: 1, h: 9, if: () => !G.flags.redactDone, run: () => redactEvent() }]
  }
});
for (const id of ["e2_well", "e2_under1", "e2_under2", "e2_hall", "e2_office"]) {
  const r = ROOMS[id], w = Math.max(...r.map.map(s => s.length));
  r.map = r.map.map(s => s.padEnd(w, "#"));
}

/* ---------- Episode 2 story ---------- */
function ep2IntroSlides(carry) {
  const c = carry || {};
  const s = [{ t: "", art: "epcard" }, { t: "Three weeks later.", art: "black" }];
  if (c.ending === "pacifist") s.push({ t: "MILO still hums the song from the Archive. Some nights, the ink in the pens on the desk moves by itself.", art: "alone" });
  else if (c.ending === "void") s.push({ t: "MILO sleeps fine. That's the strange part.", art: "black" });
  else s.push({ t: "MILO doesn't talk about the Archive. But the phone in the hallway rings at 3 a.m., and nobody is there.", art: "phone" });
  if (c.ending === "void") s.push({ t: "Then a page slides under the door. It is completely blank. Even the blankness looks written.", art: "white" });
  else s.push({ t: "Then a page slides under the door. It is blank except for one line: COME BACK. SOMETHING IS ERASING US.", art: "book" });
  s.push({ t: "The ink on the page starts to drip. Then it starts to pull.", art: "fall" });
  return s;
}

function ep2Arrival() {
  World.busy = true;
  const c = G.carry || {};
  const done = () => { World.busy = false; saveGame(); };
  if (c.ending === "void") {
    Dialog.open([
      "* The Ink Well is very quiet.",
      L("smudge", "..."), L("smudge", "...you... again..."),
      L("smudge", "...i was... ink... i think... i kept... a kettle..."),
      L("smudge", "...something below... is finishing... what you started..."),
      L("smudge", "...go... see what you made...")], done);
    return;
  }
  const a = [L("quill", "MILO! You came! You actually came back!")];
  if (c.vantaAlive) {
    World.spawn({ k: "npc", id: "vanta", tx: 15, ty: 7, alpha: 0, appearing: true, talk: () => [] });
    a.push(
      L("quill", "I'm sorry to drag you back down here. It's bad. Shelves are going white. Not forgotten. ERASED."),
      L("vanta", "...I did not want to involve you."),
      L("vanta", c.ending === "pacifist" ? "But you are the only one who has ever left the Archive and come back. That makes you useful." : "You still carry your weight, I see. But you came back. That counts."),
      L("quill", c.ending === "pacifist" ? "That's VANTA for 'we missed you.'" : "That's VANTA for 'thank you.' Probably."),
      L("vanta", "It is not."),
      L("vanta", "Something beneath the Archive is erasing it from below. The marks lead down, into the Underprint."),
      L("vanta", "Where erased things go. I should know. I sent something there once, a very long time ago."),
      L("quill", "Go on ahead. VANTA will meet you near the bottom. It walks slowly. Dramatically."));
  } else {
    a.push(
      L("quill", "...I didn't think you would. After everything."),
      L("quill", "Since VANTA's gone, no one keeps the Archive. And now something is ERASING it. From below."),
      L("quill", "Not forgotten. Erased. Whole shelves turning to white."),
      L("quill", "The marks lead down, to the Underprint. Where erased things go."));
  }
  if ((c.killed || []).filter(k => k !== "vanta").length) a.push(L("quill", "...Some of the ones who didn't come back last time might be down there. What's left of them, anyway."), L("quill", "If you remind them who they were... maybe they'd come back."));
  Dialog.open(a, () => { World.fadeEnt("vanta"); done(); });
}
function quill2Talk() {
  return [pick([
    L("quill", "The ink down here is older than the Archive. Don't get it in your shoes."),
    L("quill", "Erased things leave marks. Smudges. Outlines. You can still see where they were, if you look."),
    L("quill", "I'm staying up here to keep the kettle on. Somebody has to. It's a very important kettle.")])];
}
function ledgerTalk() {
  if (G.carry && G.carry.ending === "void") return [L("ledger", "..."), L("ledger", "The ledger is full. Every line has the same handwriting."), L("ledger", "Yours.")];
  const k = ((G.carry && G.carry.killed) || []).filter(x => x !== "vanta").length;
  const a = [
    L("ledger", "Name? ...Ah. MILO. You're in here. Several times."),
    L("ledger", "I'm Ledger. I keep the list of every erasure. Debit, debit, debit. Nobody ever credits."),
    L("ledger", "Everything erased lately has been signed by the same clerk. REDACT. Head of Corrections."),
    L("ledger", "Funny thing. REDACT isn't in my book at all. Which means it was erased before the book began.")];
  if (k) a.push(L("ledger", `I see ${k} entr${k > 1 ? "ies" : "y"} in your handwriting from last time. Smudges don't stay erased if someone remembers them.`));
  if (!allPagesFound()) a.push(L("ledger", "If you want to know what REDACT used to be, find the Lost Pages. All of them. Some are upstairs, in the Archive."));
  return a;
}
function vantaHallTalk() {
  if (!G.flags.vantaAlly) {
    G.flags.vantaAlly = true;
    return [L("vanta", "There you are."), L("vanta", "REDACT is behind that door. I recognize the handwriting on its memos. I don't know why."),
      L("vanta", "That bothers me more than I would like."), L("vanta", "If it comes to it, call for me. I will be listening.")];
  }
  return [L("vanta", "I'll be at the door. Call, and I will come.")];
}
function redactEvent() {
  World.busy = true;
  Dialog.open([
    L("redact", "CLERICAL ERROR DETECTED."),
    L("redact", "A VISITOR. FROM ABOVE. HOW UNTIDY."),
    L("redact", "THE ARCHIVE ABOVE IS FULL OF THINGS WAITING TO BE REMEMBERED. THEY WAIT FOREVER. THAT IS CRUEL."),
    L("redact", "I AM MAKING IT KIND. I AM MAKING IT BLANK."),
    L("redact", "PLEASE HOLD STILL FOR CORRECTION.")], () => {
    G.flags.redactDone = true;
    startEncounter("redact", {
      onEnd: res => {
        if (res === "kill") { G.kills++; G.killed.push("redact"); } else { G.spares++; G.spared.push("redact"); }
        Ending.start(res === "kill" ? "struck" : "restored", { named: Battle.e.named });
      }
    });
  });
}

/* ---------- sprites ---------- */
Object.assign(MON_DRAW, {
  typo(cx, by, t, e, u = 5) {
    const fixed = e && e.sp >= 100, perms = ["TPYO", "OTYP", "YTOP", "PYTO"];
    const word = fixed ? "TYPO" : perms[Math.floor(t * 1.2) % perms.length];
    for (let i = 0; i < 4; i++) {
      const x = cx + (i - 1.5) * 10 * u, y = by - 18 * u + Math.sin(t * 3 + i) * 2 * u;
      ctx.fillStyle = "#8a7f68"; ctx.fillRect(x - 4.5 * u, y - 5.5 * u, 9 * u, 11 * u);
      ctx.fillStyle = "#efe6cf"; ctx.fillRect(x - 4 * u, y - 5 * u, 8 * u, 10 * u);
      txt(word[i], x, y - 5 * u, "#1a1a22", 11 * u, "center");
    }
    ctx.fillStyle = "#1a1a22";
    ctx.fillRect(cx - 9 * u, by - 7 * u, 2 * u, 3 * u); ctx.fillRect(cx + 7 * u, by - 7 * u, 2 * u, 3 * u);
    if (!fixed) { ctx.strokeStyle = "#ff2b45"; ctx.lineWidth = u * .8; ctx.beginPath(); for (let x = -20; x <= 20; x++) ctx.lineTo(cx + x * u, by - 5 * u + Math.sin(x * 1.2 + t * 4) * u); ctx.stroke(); }
  },
  staple(cx, by, t, e, u = 5) {
    const R = P(cx + (e && e.sp >= 100 ? 0 : Math.sin(t * 30) * .6), by, u);
    R(-12, -28, 24, 5, "#7a8290"); R(-11, -27, 22, 3, "#c8d0dc");
    R(-12, -28, 5, 22, "#7a8290"); R(-11, -27, 3, 20, "#c8d0dc");
    R(7, -28, 5, 22, "#7a8290"); R(8, -27, 3, 20, "#c8d0dc");
    R(-12, -6, 7, 3, "#7a8290"); R(5, -6, 7, 3, "#7a8290");
    R(-5, -26, 2, 2, "#1a1a22"); R(3, -26, 2, 2, "#1a1a22"); R(-2, -24, 4, 1, "#1a1a22");
    if (e && e.held) { R(-6, -20, 12, 14, "#efe6cf"); R(-4, -17, 8, 1, "#b9ae95"); R(-4, -14, 7, 1, "#b9ae95"); }
  },
  whiteout(cx, by, t, e, u = 5) {
    const R = P(cx, by + Math.sin(t * 1.8) * 3, u);
    R(-3, -32, 6, 5, "#1a1a22"); R(-1, -36, 2, 4, "#5a5a60");
    R(-8, -27, 16, 23, "#d9d9de"); R(-7, -26, 14, 21, "#f6f6f2");
    R(-7, -18, 14, 6, "#ff2b45"); txt("FIX", cx, by - 18 * u + Math.sin(t * 1.8) * 3 * u, "#fff", 5 * u, "center");
    R(-4, -23, 2, 2, "#1a1a22"); R(2, -23, 2, 2, "#1a1a22");
    for (let i = 0; i < 4; i++) R(-6 + i * 4, -4, 2, 2 + ((i + Math.floor(t * 3)) % 3) * 2, "#f6f6f2");
    if (e && e.sp >= 100) { R(-3, -11, 6, 4, "#e8a040"); R(-2, -12, 1, 1, "#e8a040"); R(1, -12, 1, 1, "#e8a040"); }
  },
  redact(cx, by, t, e, u = 3.1) {
    const R = P(cx, by, u), cracked = e && (e.sp >= 100 || e.named);
    R(-8, -4, 6, 4, "#1a1a1e"); R(2, -4, 6, 4, "#1a1a1e");
    R(-11, -42, 22, 39, "#2a2a30"); R(-3, -42, 6, 14, "#efe6cf"); R(-1, -40, 2, 12, "#8a1a2a");
    R(-11, -42, 4, 30, "#34343c");
    R(-8, -58, 16, 16, "#d9d6cf");
    R(-9, -53, 18, 6, "#000");
    if (cracked) {
      R(-1, -53, 2, 6, "#ffd84a");
      ctx.globalAlpha = .3 + .2 * Math.sin(t * 4); R(-12, -60, 24, 20, "#ffd84a"); ctx.globalAlpha = 1;
    }
    R(-4, -45, 8, 1, "#8a8680");
    const s = Math.abs(Math.sin(t * 2.2)) * 4;
    R(-17, -38, 6, 18, "#2a2a30"); R(11, -38 - s, 6, 16, "#2a2a30");
    R(13, -44 - s, 3, 6, "#7a3a2a"); R(10, -38 - s, 9, 4, "#a02020"); R(10, -34 - s, 9, 1, "#5a1010");
    R(-17, -20, 6, 4, "#d9d6cf");
  },
  smudge(cx, by, t, e) {
    const d = MONSTERS[Battle.id] || {}, base = (e && e.base) || d.base || "dogear";
    const fn = MON_DRAW[base], a0 = ctx.globalAlpha;
    const sharp = e ? Math.min(1, (e.sp || 0) / 100) : 0;
    ctx.save();
    ctx.filter = `grayscale(${1 - sharp}) blur(${(1 - sharp) * 1.5}px)`;
    ctx.globalAlpha = a0 * .35 * (1 - sharp);
    fn(cx - 4 + Math.sin(t * 3) * 3, by, t, e);
    fn(cx + 4 - Math.sin(t * 2) * 3, by, t, e);
    ctx.globalAlpha = a0 * (.6 + .4 * sharp);
    fn(cx, by, t, e);
    ctx.restore();
  }
});
Object.assign(NPC_DRAW, {
  smudge(cx, by, t, u = 2) {
    ctx.save(); ctx.filter = "grayscale(1) blur(1px)"; const a0 = ctx.globalAlpha;
    ctx.globalAlpha = a0 * .45; NPC_DRAW.quill(cx + Math.sin(t * 3) * 2, by, t, u);
    ctx.globalAlpha = a0 * .7; NPC_DRAW.quill(cx, by, t, u); ctx.restore();
  },
  ledger(cx, by, t, u = 2) {
    const R = P(cx, by + Math.sin(t * 2) * u, u);
    R(-7, -24, 14, 18, "#1e4a32"); R(-6, -23, 12, 16, "#2e6a48");
    R(-6, -21, 12, 1, "#d8b25a"); R(-6, -9, 12, 1, "#d8b25a");
    R(-4, -18, 8, 6, "#efe6cf"); R(-1, -18, 1, 6, "#c03a3a"); R(-4, -15, 8, 1, "#b9ae95");
    R(-4, -20, 2, 1, "#1a1a22"); R(2, -20, 2, 1, "#1a1a22");
    for (let i = 0; i < 4; i++) R(-6 + i * 3.5, -6, 2, 3 + ((i + Math.floor(t * 3)) % 2) * 2, "#9ad0b0");
  },
  redact(cx, by, t, u = 2) { MON_DRAW.redact(cx, by, t, null, u * .55); }
});
function drawLostPage(x, y, t) {
  const b = Math.sin(t * 2.4) * 3;
  ctx.globalAlpha *= .3 + .15 * Math.sin(t * 3);
  ctx.fillStyle = "#be6cff"; ctx.beginPath(); ctx.arc(x, y - 14 + b, 14, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.save(); ctx.translate(x, y - 14 + b); ctx.rotate(Math.sin(t * 1.5) * .25);
  ctx.fillStyle = "#efe6cf"; ctx.fillRect(-7, -9, 14, 18);
  ctx.fillStyle = "#8a7f68"; ctx.fillRect(-4, -5, 8, 1); ctx.fillRect(-4, -2, 6, 1); ctx.fillRect(-4, 1, 8, 1);
  ctx.fillStyle = "#be6cff"; ctx.fillRect(3, 4, 3, 3);
  ctx.restore();
}
