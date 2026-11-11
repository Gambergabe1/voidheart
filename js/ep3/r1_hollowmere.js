"use strict";
/* ============================================================
   VOIDHEART — Episode 3, region 1: HOLLOWMERE
   MILO's hometown on the Surface, slightly revised.
   Area "hollow", rooms e3h_*, boss THE RUMOR MILL, Lost Page IX.
   Also the tutorial for the Pen of STET.
   ============================================================ */
POOLS.hollow = ["hearsay", "stickynote", "lostposter", "dejavu", "talltale"];
AREAS.hollow = { name: "HOLLOWMERE", music: "hollow", sub: "a small town, slightly revised" };
PAL.hollow = {
  floor: "#5c5048", alt: "#605349", spec: "#7a6c5e", wall: "#1e1916", face: "#7a5a46", line: "#5a4232",
  rug: "#3a5878", rug2: "#5a7aa0", shelf: "#5a3a24", grass: "#5a8a44", grass2: "#9ad46a"
};
E3.start = { room: "e3h_bedroom", tx: 14, ty: 5, dir: "down" };

Object.assign(ITEMS, {
  h_receipt: { name: "Bakery Receipt", type: "key", desc: "HOLLOWMERE BAKERY. 2 cinnamon stars, 1 comet bun. Dated last spring. THANK YOU! COME AGAIN!" },
  h_lunch: { name: "Packed Lunch", type: "heal", heal: 30, desc: "A sandwich cut into triangles. Mom packed two. She doesn't know why." },
  h_cinnastar: { name: "Cinnamon Star", type: "heal", heal: 20, price: 12, desc: "A star-shaped pastry. Crunchy points, soft middle." },
  h_cometbun: { name: "Comet Bun", type: "heal", heal: 40, price: 24, desc: "A round bun with a long cinnamon tail. Invented for a dog." },
  h_glowstar: { name: "Glow Star", type: "heal", heal: 25, desc: "Peeled off a doorframe at kid height. Holding it makes you feel better." },
  h_cocoa: { name: "Old Thermos", type: "heal", heal: 50, desc: "Cocoa, left on the hill a long time ago. Somehow still warm." },
  h_baguette: { name: "Baguette", type: "weapon", atk: 10, price: 55, desc: "Day-old and dangerously crusty. ATK +10." },
  h_ovenmitt: { name: "Oven Mitts", type: "armor", def: 6, price: 50, desc: "Quilted, flour-dusted and fearless. DEF +6." }
});
Object.assign(SPEAKERS, {
  h_mom: { name: "MOM", voice: 380 },
  h_comet: { name: "COMET", voice: 240 },
  h_tully: { name: "MRS. TULLY", voice: 300 },
  h_baker: { name: "ODETTE", voice: 420 },
  h_teacher: { name: "MS. PLUMB", voice: 360 },
  h_librarian: { name: "MR. FOLIO", voice: 200 },
  h_pip: { name: "PIP", voice: 640 },
  h_oates: { name: "MR. OATES", voice: 170 },
  rumormill: { name: "THE RUMOR MILL", voice: 260 }
});
SONGS.rumormill = { bpm: 132, tracks: [
  { w: "square", v: .022, n: "D5 . F5 D5 . A4 . D5 F5 . G5 F5 E5 . D5 . C5 . E5 C5 . G4 . C5 E5 . F5 E5 D5 . C5 ." },
  { w: "triangle", v: .07, n: "D2 D3 A2 D3 D2 D3 A2 D3 Bb1 Bb2 F2 Bb2 C2 C3 G2 C3 D2 D3 A2 D3 D2 D3 A2 D3 Bb1 Bb2 C2 C3 A1 A2 A1 A2" },
  { w: "sine", v: .02, n: "A5 - - - - - - - G5 - - - - - - - F5 - - - - - - - E5 - - - - - - -" }] };

/* small helpers */
const hPhotoEv = () => E3.evidence().some(v => v.key === "photo");
const hBossDone = () => !!G.flags.boss_rumormill;

/* ---------- custom tiles: 1 hedge, 2 cobbles, 3 house front (outdoors) / counter or desk (indoors) ---------- */
TILE_DRAW["1"] = (x, y, tx, ty, pal, t, W, h) => {
  ctx.fillStyle = "#2e4a26"; ctx.fillRect(x, y + 4, TILE, TILE - 4);
  ctx.fillStyle = "#3e6a32"; ctx.fillRect(x + 1, y + 2, TILE - 2, TILE - 10);
  ctx.fillStyle = "#4e8a3e";
  for (let i = 0; i < 4; i++) ctx.fillRect(x + 1 + i * 8, y + 1 + ((i + tx) & 1) * 3, 6, 5);
  if (h < .25) { ctx.fillStyle = "#e86a9a"; ctx.fillRect(x + 6 + h * 60, y + 12, 3, 3); }
};
SOLID.add("1");
TILE_DRAW["2"] = (x, y, tx, ty, pal, t, W, h) => {
  ctx.fillStyle = "#3e3a36"; ctx.fillRect(x, y, TILE, TILE);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
    const k = hash(tx * 2 + c, ty * 2 + r), off = (r && (ty & 1)) ? 6 : 0;
    ctx.fillStyle = k < .33 ? "#6a625a" : k < .66 ? "#5e564e" : "#726a60";
    ctx.fillRect(x + c * 16 + 1 + off, y + r * 16 + 1, 14 - off, 14);
  }
};
TILE_DRAW["2"].floor = false;
TILE_DRAW["3"] = (x, y, tx, ty, pal, t, W, h) => {
  const below = W.tile(tx, ty + 1);
  if (W.def && W.def.outdoor) {
    let lx = tx; while (W.tile(lx - 1, ty) === "3") lx--;
    const ri = Math.floor(hash(lx, 77) * 4);
    if (below === "3") {
      ctx.fillStyle = ["#7a3a3a", "#3a5a7a", "#5a7a4a", "#7a6a3a"][ri]; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = "rgba(0,0,0,.2)"; for (let i = 0; i < 4; i++) ctx.fillRect(x + ((i & 1) ? 8 : 0), y + i * 8 + 6, TILE, 2);
      if (W.tile(tx, ty - 1) !== "3") { ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.fillRect(x, y, TILE, 3); }
    } else {
      ctx.fillStyle = ["#d8c8a8", "#c8d8e0", "#e0d0c0", "#d0c8e0"][ri]; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = "rgba(0,0,0,.08)"; for (let i = 0; i < 4; i++) ctx.fillRect(x, y + i * 8, TILE, 1);
      if (W.def.doors && W.def.doors.includes(tx + "," + ty)) {
        ctx.fillStyle = "#5a3a24"; ctx.fillRect(x + 8, y + 6, 16, 26); ctx.fillStyle = "#d8b25a"; ctx.fillRect(x + 20, y + 19, 2, 2);
      } else if ((tx - lx) % 2 === 1) {
        ctx.fillStyle = "#f6f6f2"; ctx.fillRect(x + 7, y + 7, 18, 16);
        ctx.fillStyle = "#6a8ab0"; ctx.fillRect(x + 9, y + 9, 14, 12);
        ctx.fillStyle = "#f6f6f2"; ctx.fillRect(x + 15, y + 9, 2, 12); ctx.fillRect(x + 9, y + 14, 14, 2);
      }
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(x, y + TILE - 3, TILE, 3);
    }
  } else {
    ctx.fillStyle = ((tx + ty) & 1) ? pal.floor : pal.alt; ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "#6a4a30"; ctx.fillRect(x, y + 6, TILE, TILE - 6);
    ctx.fillStyle = "#9a7048"; ctx.fillRect(x, y + 4, TILE, 10);
    ctx.fillStyle = "#b08a5a"; ctx.fillRect(x, y + 4, TILE, 2);
    if (W.tile(tx - 1, ty) !== "3") { ctx.fillStyle = "#4a3220"; ctx.fillRect(x, y + 4, 2, TILE - 4); }
    if (W.tile(tx + 1, ty) !== "3") { ctx.fillStyle = "#4a3220"; ctx.fillRect(x + TILE - 2, y + 4, 2, TILE - 4); }
    if (below !== "3") { ctx.fillStyle = "#4a3220"; ctx.fillRect(x, y + TILE - 4, TILE, 4); }
  }
};
TILE_DRAW["3"].floor = false;
SOLID.add("3");

/* ---------- new bullet patterns ---------- */
PAT.h_sails = { box: [230, 230], dur: 6.5, def: { col: "#efe6cf", start: "corner" }, fn(B, S, P, dt, b) {
  if (!S.init) {
    S.init = 1;
    const n = P.n || 4;
    for (let i = 0; i < n; i++) b.spawn({ shape: "line", ang: i * Math.PI * 2 / n, len: 8, th: 7, col: P.col, life: 99, x: 0, y: 0, vx: 0, vy: 0,
      upd(o, dt) { const I = b.ibox; o.x = I.x + I.w / 2; o.y = I.y + I.h / 2; o.ang += .9 * P.s * dt; o.len = Math.min(Math.min(I.w, I.h) / 2 - 20, o.len + 50 * dt); } });
  }
  if (tick(S, .75 / P.d, dt, "c", .9)) {
    const o = edgePoint(B, 8), v = aimAt(b, o.x, o.y, 85 * P.s);
    b.spawn({ x: o.x, y: o.y, vx: v.vx, vy: v.vy, r: 7, col: "#d8c8a0", shape: "char", ch: pick(["?", "!", "s", "h"]) });
  }
} };
PAT.h_gossip = { box: [280, 170], dur: 5.5, def: { col: "#f2ecd8", word: "DIDYOUHEAR" }, fn(B, S, P, dt, b) {
  if (!tick(S, .42 / P.d, dt)) return;
  S.i = (S.i || 0) + 1;
  const left = S.i % 2 === 0, y = B.y + 14 + rand(B.h - 28), sp = 95 * P.s, mid = B.x + B.w / 2;
  b.spawn({ x: left ? B.x - 8 : B.x + B.w + 8, y, vx: left ? sp : -sp, vy: 0, r: 7, col: P.col, shape: "char", ch: P.word[S.i % P.word.length], life: 6,
    upd(o) {
      if (!o.turned && Math.abs(o.x - mid) < 24) {
        o.turned = 1; o.ch = pick(["?", "!", "&", "#"]); o.col = "#ff9d3f";
        const v = aimAt(b, o.x, o.y, sp * 1.05); o.vx = v.vx; o.vy = v.vy;
      }
    } });
} };

/* ---------- monsters ---------- */
const hRepeat = (e, n) => { if (e.last === n) return true; e.last = n; return false; };
Object.assign(MONSTERS, {
  hearsay: {
    name: "Hearsay", area: "hollow", hp: 96, atk: 6, def: 1, exp: 34, gold: 22, voice: 520,
    check: "HEARSAY - ATK 6 DEF 1\n* A rumor rolled up into a paper cone.\n* It heard it from someone who heard it from someone.",
    intro: "* Psst. Psst! Hearsay sidles up to you.",
    flavor: ["* Hearsay is whispering to a lamppost.", "* Hearsay leans in close. Its breath smells like newsprint.", "* Hearsay is telling you a secret about yourself. It's wrong."],
    spareFlavor: "* Hearsay has nothing left to whisper. It seems lighter.",
    talk: ["did you hear? DID you?", "everyone's saying it.", "i'm not saying it's TRUE. i'm just SAYING it.", "you didn't hear it from me. (you did.)"],
    spareTalk: "...i'll just keep it to myself. huh. that's new.",
    acts: {
      "Ask 'Says Who?'": e => {
        if (e.src) { e.sp += 5; e.reply = "...says... a guy?"; return "* You ask again who said so.\n* Hearsay still can't name a single person."; }
        e.src = 1; e.sp += 25; e.reply = "says... everyone? says SOMEONE."; return "* 'Says who?'\n* Hearsay opens its mouth. Closes it.\n* It has never once been asked that.";
      },
      "Don't Pass It On": e => {
        if (!e.src) { e.sp += 12; e.reply = "but it's SO GOOD."; return "* You tell Hearsay you won't repeat it.\n* It's hurt. It hasn't even told you the good part."; }
        e.sp += 40; e.reply = "...nowhere to go. that's okay?";
        return "* You heard it. You keep it.\n* With nobody to tell, Hearsay is just a story it once heard.\n* It unrolls a little. It looks relieved.";
      },
      "Gasp!": e => { e.sp -= 20; e.rage = 1; e.reply = "I KNOW, RIGHT?!"; return "* You gasp, scandalized.\n* Hearsay swells to twice its size.\n* Gasping is the worst thing you can do to a rumor. It's like feeding it."; }
    },
    pats: [{ id: "h_gossip", col: "#f2ecd8", word: "PSSTDIDYOUHEAR" }, { id: "aimed", col: "#e8d8b0" }]
  },
  stickynote: {
    name: "Sticky Note", area: "hollow", hp: 90, atk: 5, def: 2, exp: 30, gold: 20, voice: 640,
    check: "STICKY NOTE - ATK 5 DEF 2\n* A reminder of something that never happened.\n* It refuses to let you forget it.",
    intro: "* A Sticky Note slaps onto your sleeve!\n* REMEMBER: YOU HATE PANCAKES.",
    flavor: ["* Sticky Note flaps its curled corner at you.", "* You do not hate pancakes. Sticky Note disagrees.", "* Sticky Note has stuck itself to the battle box. Twice."],
    spareFlavor: "* Sticky Note has peeled off cleanly. No residue.",
    talk: ["REMEMBER!!", "don't forget! (the thing that didn't happen!)", "i'm just trying to HELP.", "you'll thank me. you won't remember why."],
    spareTalk: "...i'm still sticky. but i'll stick to true stuff.",
    acts: {
      "Read It": e => {
        if (e.read) { e.sp += 5; e.reply = "AND?? AND???"; return "* You read it again.\n* 'REMEMBER: YOU HATE PANCAKES.' You still don't."; }
        e.read = 1; e.sp += 20; e.reply = "you READ me. people never read me."; return "* You read Sticky Note carefully.\n* 'REMEMBER: YOU HATE PANCAKES.'\n* It's in very neat handwriting. Not yours.";
      },
      "Peel Gently": e => {
        if (!e.read) { e.sp += 10; e.reply = "NOT UNTIL YOU READ ME!"; return "* You try to peel Sticky Note off.\n* It clings harder. It doesn't think you've read it."; }
        e.sp += 40; e.reply = "...oh. that's how it feels to let go."; return "* You peel Sticky Note off, slowly, corner first.\n* It comes away clean.\n* It has never been treated so respectfully.";
      },
      "Stick It Back": e => { e.sp -= 20; e.rage = 1; e.reply = "I'M IN CHARGE NOW."; return "* You stick it on your forehead.\n* Now it's the boss of you.\n* Sticky Note gets very full of itself."; }
    },
    pats: [{ id: "flutter", col: "#e8d040" }, { id: "walls", col: "#e8d040", d: .85 }]
  },
  lostposter: {
    name: "Missing Poster", area: "hollow", hp: 104, atk: 6, def: 1, exp: 36, gold: 24, voice: 300,
    check: "MISSING POSTER - ATK 6 DEF 1\n* MISSING: GERALD. A CAT? PROBABLY.\n* Gerald was a rumor. The poster doesn't know that.",
    intro: "* A Missing Poster flaps toward you!\n* HAVE YOU SEEN THIS CAT?",
    flavor: ["* Missing Poster's tear-off tabs rustle hopefully.", "* The drawing of Gerald looks a lot like a potato.", "* Missing Poster checks under the battle box. No Gerald."],
    spareFlavor: "* Missing Poster has stopped searching. It's resting.",
    talk: ["have you seen gerald?", "he answers to nothing!", "last seen: never!", "somebody must miss him. somebody must."],
    spareTalk: "...maybe gerald is fine. wherever he is. or isn't.",
    acts: {
      "Read Description": e => {
        if (e.desc) { e.sp += 3; e.reply = "...color: YES."; return "* You read the description again.\n* Color: 'yes.' Size: 'cat-sized.' You're no wiser."; }
        e.desc = 1; e.sp += 15; e.reply = "you're LOOKING for him?"; return "* MISSING: one (1) cat. Color: 'yes.' Last seen: 'never.'\n* REWARD: a warm feeling.";
      },
      "Help Search": e => {
        if (!e.desc) { e.sp += 10; e.reply = "you don't even know what he LOOKS like."; return "* You look around for... something.\n* You're not sure what you're looking for."; }
        e.sp += 35; e.reply = "...no gerald. but we looked. TOGETHER.";
        return "* You look under a bench together. Behind a hedge. In your pocket.\n* No cat. But somebody finally looked.";
      },
      "Tear a Tab": e => {
        if (e.tab) return "* You already took a tab. One's enough.\n* Missing Poster keeps glancing at the gap. Proudly.";
        e.tab = 1; e.sp += 25; e.reply = "SOMEONE TOOK A TAB!!"; return "* You tear off one of the little phone-number tabs.\n* Nobody has ever taken a tab before.";
      },
      "It's Not Real": e => { e.sp -= 25; e.rage = 1; e.reply = "TAKE THAT BACK."; return "* You tell it Gerald never existed.\n* The poster crumples.\n* Telling someone their lost thing was never real is a very cruel thing to say."; }
    },
    pats: [{ id: "rain", col: "#f6f6f2", d: .9 }, { id: "side", col: "#c03a3a" }]
  },
  dejavu: {
    name: "Deja Vu", area: "hollow", hp: 110, atk: 6, def: 2, exp: 40, gold: 26, voice: 420,
    check: "DEJA VU - ATK 6 DEF 2\n* Is sure you've met before.\n* You haven't. ...Have you? (Doing the same thing twice won't help.)",
    intro: "* Deja Vu appears.\n* ...Deja Vu appears.",
    flavor: ["* You feel like you've read this line before.", "* Deja Vu waves at you. Again. Again.", "* Something about this moment is very familiar."],
    spareFlavor: "* Deja Vu is having a brand-new moment. It's thrilled.",
    talk: ["hello again!", "didn't we do this last tuesday?", "you always say that.", "i remember this part!"],
    spareTalk: "...i've never felt this before. EVER.",
    acts: {
      "Introduce Yourself": e => {
        if (hRepeat(e, "intro")) return "* You did that already. ...Didn't you?\n* Deja Vu sinks back into its loop.";
        if (e.intro) { e.sp += 8; e.reply = "...have we met?"; return "* You introduce yourself again.\n* 'Have we met?' it asks. Yes. Just now."; }
        e.intro = 1; e.sp += 20; e.reply = "...MILO. i'll remember that. for the first time.";
        return "* You introduce yourself properly. Name and everything.\n* Deja Vu has been re-met a thousand times. Never introduced.";
      },
      "Do Something New": e => {
        if (hRepeat(e, "new")) return "* You did that already. ...Didn't you?\n* Deja Vu sinks back into its loop.";
        if (!e.intro) { e.sp += 15; e.reply = "...new? from a stranger?"; return "* You hop on one foot and hum the alphabet backwards.\n* Deja Vu blinks. It doesn't know you well enough to be sure it's new."; }
        e.sp += 35; e.reply = "I'VE NEVER SEEN THAT BEFORE!!";
        return "* You do something completely new. You don't even know what to call it.\n* Neither does Deja Vu. That's the point.";
      },
      "Play Along": e => {
        hRepeat(e, "along");
        e.sp -= 15; e.rage = 1; e.reply = "YES! LAST TUESDAY! AND THE TUESDAY BEFORE!";
        return "* 'Oh, right, last Tuesday!' you say.\n* Deja Vu loops tighter. Now it's sure.";
      }
    },
    pats: [{ id: "loop", col: "#b8a8e8" }, { id: "ringwave", col: "#b8a8e8" }]
  },
  talltale: {
    name: "Tall Tale", area: "hollow", hp: 130, atk: 7, def: 3, exp: 44, gold: 30, voice: 200,
    check: "TALL TALE - ATK 7 DEF 3\n* A story that grows every time it's told.\n* It's on stilts. The stilts are also exaggerating.",
    intro: "* Tall Tale strides in on enormous stilts!\n* (They're not that enormous.)",
    flavor: ["* Tall Tale holds its arms out to show you a fish THIS big.", "* Tall Tale's stilts wobble alarmingly.", "* Tall Tale once wrestled a cloud. Allegedly."],
    spareFlavor: "* Tall Tale is standing at its real height. It's comfortable.",
    talk: ["I ONCE CAUGHT A FISH THIS BIG.", "AND THEN THE FISH CAUGHT ME.", "THE BAKERY? CLOSED A THOUSAND YEARS!", "I'M ONLY A LITTLE BIT TALLER THAN THE TRUTH."],
    spareTalk: "...it was a medium fish. it was a nice fish.",
    acts: {
      "Ask for Details": e => {
        e.det = (e.det || 0) + 1;
        if (e.det > 3) return "* You ask for more details.\n* Tall Tale has run out. It's starting to sweat.";
        e.sp += 12; e.reply = ["WHAT COLOR? ...FISH-COLORED.", "WHERE? ...IN THE WATER.", "WHEN? ...ONCE."][e.det - 1];
        return "* You ask for details. Tall Tale has to make some up.\n* Its stilts wobble.";
      },
      "Measure It": e => {
        if (!e.det) { e.sp += 8; e.reply = "THIS BIG! NO, THIS BIG!"; return "* You try to measure the fish.\n* It keeps changing size. Pin the story down first."; }
        e.sp += 38; e.reply = "...oh. it was this big.";
        return "* You measure the fish with your hands. It's exactly fish-sized.\n* Tall Tale shrinks to its real height. Stilts are exhausting.";
      },
      "Applaud": e => { e.sp -= 20; e.rage = 1; e.reply = "AND THEN I LIFTED A MOUNTAIN!"; return "* You applaud.\n* Tall Tale grows a whole foot.\n* Applause is fertilizer for a tall tale."; },
      "Tell a True Story": e => {
        if (e.story) return "* You've told your story. Tall Tale is still thinking about the stick.";
        e.story = 1; e.sp += 20; e.reply = "...a GOOD stick. i believe you.";
        return "* You tell it about the time you found a really good stick.\n* That's the whole story. Tall Tale is quietly moved.";
      }
    },
    pats: [{ id: "stomp", col: "#c8a040" }, { id: "letters", word: "THISBIGTHISBIG", col: "#efe6cf" }]
  }
});

/* ---------- the boss: THE RUMOR MILL ---------- */
const H_SAILS = [
  { r: "THE BAKERY WAS ALWAYS CLOSED!", known: () => !!(G.flags.h_bakerMem || G.flags.h_bakery),
    truth: "* You tell it about Odette, and the receipt, and the comet buns.\n* A bakery that invented a bun for a dog was not always closed." },
  { r: "IT'S POURING! EVERYBODY STAY INSIDE!", known: () => !!G.flags.h_rain,
    truth: "* You point up. Blue sky. Not one cloud.\n* The mill looks up too. It seems embarrassed." },
  { r: "NOBODY ON MAPLE STREET EVER MOVED AWAY!", known: () => !!(G.flags.h_comet || G.flags.h_juninote),
    truth: "* You tell it about Comet, waiting outside number 9.\n* A dog doesn't wait outside a house where nobody ever lived." },
  { r: "MILO NEVER HAD A BEST FRIEND!", known: () => !!G.flags.juniFound,
    truth: "* You tell it the truth. You found them.\n* The last sail stops." }
];
const hStill = (e, i) => { if (i >= 0 && !e.stilled.includes(i)) e.stilled.push(i); };
const hNextSail = e => H_SAILS.findIndex((s, i) => !e.stilled.includes(i));
MONSTERS.rumormill = {
  name: "The Rumor Mill", area: "hollow", hp: 360, atk: 8, def: 2, exp: 90, gold: 60, voice: 260, boss: true, bar: true,
  title: "THE RUMOR MILL // EVERYBODY SAYS SO", music: "rumormill", noFlee: true,
  check: "THE RUMOR MILL - ATK 8 DEF 2\n* A windmill of whispers. Each sail is a rumor.\n* It doesn't need to be true. It needs to be believed.",
  intro: "* The Rumor Mill creaks into motion.\n* Four sails. Four rumors. All spinning at once.",
  init: () => ({ stilled: [], heard: 0, cur: 0 }),
  actNames(e) {
    const a = ["Listen", "Fact-Check", "Don't Repeat It", "Ask Who Wrote It", "Believe It"];
    if (hPhotoEv()) a.push("Show the Photo");
    if (G.flags.h_bakery && G.inv.includes("h_cometbun")) a.push("Share a Comet Bun");
    if (G.flags.h_telescope) a.push("Remember Juni");
    if (e.stilled.length >= 2 || e.sp >= 60) a.push("Let It Rest");
    return a;
  },
  acts: {
    "Listen": e => {
      const i = hNextSail(e);
      if (i < 0) { e.sp += 4; return "* Every sail is still. There's nothing left to hear but wind."; }
      if (e.heard) { e.sp += 4; e.reply = "...AND THEN? AND THEN?"; return "* You keep listening.\n* The Rumor Mill repeats itself. It does that."; }
      e.heard = 1; e.cur = i; e.sp += 12; e.reply = H_SAILS[i].r;
      return "* You listen. Really listen. All the way to the end.\n* Nobody has ever heard a whole rumor before.\n* They always just passed it on.";
    },
    "Fact-Check": e => {
      if (!e.heard) { e.sp += 3; e.reply = "CHECK WHAT? YOU WEREN'T EVEN LISTENING!"; return "* You check your facts.\n* ...but you haven't heard the rumor yet. Listen first."; }
      const k = H_SAILS.findIndex((s, i) => !e.stilled.includes(i) && s.known());
      if (k >= 0) { hStill(e, k); e.heard = 0; e.sp += 24; e.reply = "...OH. OH NO. THAT ONE ISN'T TRUE AT ALL."; return H_SAILS[k].truth + "\n* One sail creaks to a stop."; }
      e.sp += 10; e.reply = "SEE? YOU CAN'T PROVE IT! ...CAN YOU?";
      return "* You don't know the truth about that one. Not yet.\n* But you notice the rumor never says who saw it happen.\n* Nobody did. The sail wobbles.";
    },
    "Don't Repeat It": e => {
      if (!e.heard) { e.sp += 4; e.reply = "DON'T REPEAT WHAT? WE HAVEN'T SAID IT YET!"; return "* You promise not to repeat anything.\n* The mill finds this deeply upsetting."; }
      hStill(e, e.cur); e.heard = 0; e.sp += 18; e.reply = "W-WAIT. YOU'RE NOT GOING TO TELL ANYONE?";
      return "* You heard it. You keep it to yourself.\n* A rumor nobody passes on has nowhere to go.\n* One sail slows, and stops.";
    },
    "Ask Who Wrote It": e => {
      if (e.asked) { e.sp += 6; e.reply = "...A GENTLE HAND. THAT'S ALL WE REMEMBER."; return "* You ask again who wrote the sails.\n* It still doesn't know. It's thinking about it, though."; }
      e.asked = 1; e.sp += 15; e.reply = "WRITTEN? WE WERE... WRITTEN?";
      return "* There's handwriting on every sail. Small. Neat.\n* The same handwriting as the notes.\n* The Rumor Mill has never wondered who wrote it.";
    },
    "Believe It": e => {
      e.sp -= 15; e.rage = 1; e.reply = "YES! YES!! EVERYBODY BELIEVES US!";
      return "* You nod along. Sure. Maybe it's true.\n* The mill roars with joy and spins twice as fast.\n* Being believed is what it eats. It is NOT good for it.";
    },
    "Show the Photo": e => {
      if (e.photo) return "* You hold the photo up again.\n* The mill can't stop looking at the arm around your shoulder.";
      e.photo = 1; e.sp += 20; e.reply = "...THAT'S NOT A RUMOR. THAT'S A PHOTO.";
      return "* You hold up the torn photo. Half of it is you, laughing.\n* The other half is gone. But there's an arm around your shoulder.\n* A rumor can't put its arm around anybody.";
    },
    "Share a Comet Bun": e => {
      const i = G.inv.indexOf("h_cometbun");
      if (i < 0 || e.bun) return "* You've already shared. The mill is still chewing.";
      G.inv.splice(i, 1); e.bun = 1; e.sp += 25; hStill(e, 0); e.reply = "...IT TASTES LIKE A FACT.";
      return "* You break a comet bun in half and offer it to the mill.\n* Fresh this morning, from a bakery that was 'always closed.'\n* The bakery sail stops mid-turn.";
    },
    "Remember Juni": e => {
      if (e.juni) return "* You're still remembering. The mill is quiet while you do.";
      e.juni = 1; e.sp += 25; hStill(e, 3); e.reply = "...WE CAN'T SPIN WHAT YOU REMEMBER.";
      return "* You don't need the mill to believe you.\n* You remember a hill, a blanket, and a promise: same stars, different windows.\n* The last sail shudders and stops.";
    },
    "Let It Rest": e => {
      if (e.sp < 75) { e.reply = "REST? THEN WHO WOULD SPREAD US?"; return "* You tell the mill it can stop now.\n* It isn't ready to be quiet. Not yet."; }
      e.sp = 100; e.reply = "...quiet. is this what quiet is?";
      return "* You tell the Rumor Mill it doesn't have to be believed.\n* It only had to be heard. And you heard it.\n* The sails slow... and slow...";
    }
  },
  talk: ["DID YOU HEAR? DID YOU HEAR?", "EVERYBODY SAYS SO!", "IF ENOUGH PEOPLE SAY IT, IT'S TRUE!", "WE'RE NOT LYING. WE'RE REPEATING.", "BELIEVE US! IT'S KINDER THIS WAY!"],
  spareTalk: "...shh. listen. that's just the wind.",
  flavorFn(e) {
    if (e.sp >= 100) return "* The Rumor Mill's sails turn gently. Just wind now.";
    const n = e.stilled.length;
    if (n >= 3) return "* Only one sail is still turning. It's whispering to itself.";
    if (n >= 1) return `* ${n} sail${n > 1 ? "s hang" : " hangs"} still. The others spin harder to make up for it.`;
    return pick(["* The sails whisper as they pass. Each one a different story.", "* The whole square smells like gossip and flour.", "* Somewhere, a pigeon repeats something it heard."]);
  },
  pattern(e) {
    const ph = e.hp / e.maxhp < .5 ? 1 : 0, n = Math.max(1, 4 - e.stilled.length);
    const L = [[{ id: "h_sails", col: "#efe6cf", n }, { id: "h_gossip", col: "#f2ecd8", word: "THEBAKERYWASALWAYSCLOSED" }, { id: "ring", col: "#d8c8a0" }],
      [{ id: "h_sails", col: "#efe6cf", n, s: 1.15, d: 1.2 }, { id: "mixed", col: "#f2ecd8" }, { id: "h_gossip", col: "#f2ecd8", word: "NOBODYEVERMOVEDAWAY", d: 1.3 }]][ph];
    const p = Object.assign({}, L[e.turn % L.length]);
    p.d = (p.d || 1) * (1 - Math.min(.3, e.sp / 300));
    return p;
  },
  onHit(e) { e.reply = pick(["OW! DID YOU HEAR THAT? SOMEBODY HIT US!", "THAT'LL BE ALL OVER TOWN BY LUNCH!", "WE'RE TELLING EVERYONE YOU DID THAT."]); },
  deathLines: () => ["did you hear...", "...nobody's... saying anything...", "...(whisper)..."],
  spareLines: e => e.stilled.length >= 3
    ? ["...WE'VE NEVER BEEN QUIET BEFORE.", "nobody ever listened to the whole thing.", "they just passed it on. and on. and on.", "...thank you for not passing us on."]
    : ["...OKAY. OKAY. WE'LL STOP.", "we just wanted somebody to believe us.", "...hearing is almost as good."]
};

/* ---------- rooms ---------- */
Object.assign(ROOMS, {
  e3h_bedroom: {
    area: "hollow", map: [
      "####################",
      "####################",
      "##BB..............##",
      "##..........,.....##",
      "##..RRRRRR........##",
      "##..RRRRRR........##",
      "##..RRRRRR........##",
      "##................##",
      "##.,..............##",
      "##................##",
      "##................##",
      "#########..#########",
      "#########..#########"],
    exits: [{ x: 9, y: 12, w: 2, h: 1, to: "e3h_house", tx: 8, ty: 2, dir: "down" }],
    ents: [
      { k: "deco", id: "h_desk", tx: 6, ty: 2, talk: () => hDeskTalk() },
      { k: "npc", id: "quill", tx: 7, ty: 2, talk: () => hQuillBed() },
      { k: "deco", id: "h_mirror", tx: 12, ty: 2, talk: () => hMirrorTalk() },
      E3.falseNote({ flag: "h_mirror", region: "hollow", tx: 13, ty: 2, lie: "MILO NEVER HAD A BEST FRIEND.",
        need: () => !!G.flags.juniFound,
        get hint() {
          const a = ["* It's a lie. You know it's a lie, the way you know your own name.", "* But knowing it in your stomach isn't the same as knowing it for sure."];
          if (hPhotoEv()) a.push("* Comet remembers. The photo is real. But half a photo is only half a truth.", "* You'll need the other half. You'll need to find them.");
          else a.push("* You'll need more than a feeling. Maybe the torn photo can tell you something.");
          return a;
        },
        truth: ["* MILO had a best friend.", "* MILO has one still."] }),
      { k: "deco", id: "h_bed", tx: 16, ty: 3, talk: () => hBedTalk() },
      { k: "deco", id: "h_toybox", tx: 3, ty: 9, talk: () => [
        "* Your toy chest. A yo-yo with no string. A dinosaur with no tail.",
        "* And one walkie-talkie, set to channel 9. You press the button.",
        "* Static. Nobody on the other end.",
        "* There used to be two of these. You don't know why you're so sure."] },
      { k: "save", tx: 16, ty: 9 }],
    triggers: [{ x: 9, y: 10, w: 2, h: 1, if: () => G.flags.e3arrived && !G.flags.h_photo && !G.flags.h_nag, run: () => {
      G.flags.h_nag = true;
      Dialog.open([L("quill", "MILO! The photo! On your desk!"), L("quill", "It's been elbowing me all morning. Photos don't have elbows. This one does."), L("quill", "Take it with you. I have a feeling about it.")]);
    } }]
  },
  e3h_house: {
    area: "hollow", puzzle: { flag: "h_rain", key: "h_rainkey" }, map: [
      "########..##########",
      "####B###..###33333##",
      "##................##",
      "##..RRRRR.........##",
      "##..RRRRR.........##",
      "##..RRRRR.........##",
      "##................##",
      "##.........,......##",
      "##................##",
      "##................##",
      "##................##",
      "########DD##########",
      "########..##########"],
    exits: [
      { x: 8, y: 0, w: 2, h: 1, to: "e3h_bedroom", tx: 9, ty: 10, dir: "up" },
      { x: 8, y: 12, w: 2, h: 1, to: "e3h_maple", tx: 5, ty: 4, dir: "down" }],
    ents: [
      { k: "npc", id: "h_mom", tx: 15, ty: 2, talk: () => hMomTalk() },
      { k: "deco", id: "h_window", tx: 6, ty: 2, talk: () => hWindowTalk() },
      { k: "deco", id: "h_radio", tx: 12, ty: 2, talk: () => hRadioTalk() },
      { k: "deco", id: "h_fridge", tx: 17, ty: 2, talk: () => hFridgeTalk() },
      E3.falseNote({ flag: "h_rain", region: "hollow", tx: 10, ty: 10, lie: "IT IS POURING RAIN. MILO STAYS INSIDE TODAY.",
        need: () => !!G.flags.h_window,
        hint: ["* It's a lie. Probably. You can't hear any rain.", "* But 'probably' isn't knowing. Quill said the pen can't guess.", "* You'd have to actually look outside."],
        truth: ["* The note peels off the door and drifts away like a leaf.", "* The front door swings open. Sunlight pours in. (Sunlight. Not rain.)",
          L("quill", "That's it! That's exactly it. Find the truth, then strike the lie."), L("quill", "One down. Probably lots to go.")],
        onStrike: () => Sound.sfx("door") })],
    triggers: [{ x: 6, y: 9, w: 6, h: 2, if: () => !G.flags.h_tut && !G.flags.h_rain, run: () => {
      G.flags.h_tut = true; World.busy = true;
      Dialog.open([
        "* The Pen of STET buzzes in your pocket.",
        L("quill", "Psst! MILO! It's me. I'm in the pen. Well. My voice is. The rest of me is in the inkwell. It's complicated."),
        L("quill", "See that note by the front door? That's one of them. Your mom believes it. Everybody believes them."),
        L("quill", "Before you strike a lie through, you have to KNOW the truth. Not guess it. Know it."),
        L("quill", "So. Is it actually raining? Don't look at me. I'm a bottle. Look at something useful. Like a window.")], () => { World.busy = false; });
    } }]
  },
  e3h_maple: {
    area: "hollow", enc: true, outdoor: true, doors: ["15,3", "24,3"], map: [
      "##############################",
      "##3333333###3333333###33333###",
      "##3333333###3333333###33333###",
      "##333.333###3333333###33333###",
      "##........L.........L.......##",
      "222222222222222222222222222222",
      "222222222222222222222222222222",
      "222222222222222222222222222222",
      "##..L...........,.......L...##",
      "##1111****111111****1111**..##",
      "##**....**......**....**....##",
      "##############################",
      "##############################"],
    exits: [
      { x: 5, y: 3, w: 1, h: 1, to: "e3h_house", tx: 8, ty: 10, dir: "up" },
      { x: 0, y: 5, w: 1, h: 3, to: "e3h_school", tx: 18, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3h_square", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 3, ty: 8, text: () => ["* MAPLE STREET.", "* School to the west. Town square to the east.", "* Someone has added, in neat handwriting: 'NOBODY EVER MOVED AWAY FROM HERE.'"] },
      { k: "deco", id: "h_mailbox", tx: 13, ty: 4, talk: () => hMailboxTalk() },
      E3.falseNote({ flag: "h_juninote", region: "hollow", tx: 15, ty: 4, lie: "NUMBER 9 HAS ALWAYS BEEN EMPTY.",
        need: () => !!G.flags.h_comet,
        hint: ["* Something about it is wrong. The doormat says WELCOME.", "* Who buys a doormat for a house nobody ever lived in?", "* But a doormat isn't proof. Somebody who was here would know."],
        truth: ["* The note curls up and blows away down Maple Street.", "* Under it, on the door, there's a pale rectangle where a nameplate used to be. Four little screw holes.",
          "* And on the doorframe, at kid height, a glow-in-the-dark star.", "* Somebody lived here. Somebody left."],
        onStrike: () => World.buildEnts() }),
      { k: "item", tx: 15, ty: 4, item: "h_glowstar", flag: "it_h_glowstar", if: () => !!G.flags.h_juninote },
      { k: "npc", id: "h_comet", tx: 17, ty: 4, talk: () => hCometTalk() },
      { k: "npc", id: "h_tully", tx: 24, ty: 4, talk: () => hTullyTalk() },
      { k: "item", tx: 27, ty: 10, item: "h_cinnastar", flag: "it_h_maplestar" }]
  },
  e3h_school: {
    area: "hollow", enc: true, map: [
      "####################",
      "####################",
      "##................##",
      "##.33.33.33.......##",
      "##................##",
      "##.33.33.33.........",
      "##..................",
      "##.33.33.33.........",
      "##................##",
      "##.33.33.3........##",
      "##................##",
      "####################",
      "####################"],
    exits: [{ x: 19, y: 5, w: 1, h: 3, to: "e3h_maple", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "npc", id: "h_teacher", tx: 14, ty: 2, talk: () => hTeacherTalk() },
      { k: "deco", id: "h_chart", tx: 5, ty: 2, talk: () => hChartTalk() },
      { k: "deco", id: "h_classphoto", tx: 8, ty: 2, talk: () => [
        "* LAST YEAR'S CLASS PHOTO. Twenty-four kids. No. Twenty-three kids and a gap.",
        "* The gap is right next to you. The kids around it are leaning away from nothing, like they're making room.",
        "* You're looking at the gap and laughing. You remember why you were laughing. You don't remember who said it."] },
      { k: "deco", id: "h_jdesk", tx: 10, ty: 9, talk: () => [
        "* The spare desk. Someone carved into the lid, small and careful: a star, and 'J + M'.",
        "* A sticky note has been pasted over the J. 'NOBODY SAT HERE.' It isn't even floating. It's just glue.",
        "* Inside: a pencil with tooth marks. Somebody used to swap pencils with you. Every Monday. On purpose."] },
      { k: "deco", id: "h_lostfound", tx: 17, ty: 10, talk: () => hLostFoundTalk() }]
  },
  e3h_bakery: {
    area: "hollow", map: [
      "####################",
      "####################",
      "##3333333333......##",
      "##................##",
      "##................##",
      "##................##",
      "##................##",
      "##................##",
      "##................##",
      "##................##",
      "##.......RR.......##",
      "#########..#########",
      "#########..#########"],
    exits: [{ x: 9, y: 12, w: 2, h: 1, to: "e3h_square", tx: 7, ty: 4, dir: "down" }],
    ents: [
      { k: "npc", id: "h_baker", tx: 7, ty: 3, talk: () => hBakerTalk() },
      { k: "deco", id: "h_case", tx: 11, ty: 3, talk: () => G.flags.h_bakery
        ? ["* The display case is full: cinnamon stars, comet buns, and a loaf shaped like a cat. On purpose."]
        : ["* The display case. Paper doilies, perfectly clean. Not a crumb. Not one.", "* For a bakery that was always closed, it's been dusted very recently."] },
      E3.falseNote({ flag: "h_bakery", region: "hollow", tx: 14, ty: 2, lie: "THE BAKERY WAS ALWAYS CLOSED.",
        need: () => !!G.flags.h_bakerMem,
        hint: ["* It's a lie. It smells like a lie. A cinnamon-scented lie.", "* But a smell isn't proof. Somebody must have bought something here once. Somebody must have kept the receipt."],
        truth: ["* The note flutters into the oven and is never seen again.", "* The lights flicker on. The oven goes FWOOMP. The bell over the door rings all by itself.",
          "* HOLLOWMERE BAKERY: OPEN. It always was."],
        onStrike: () => Sound.sfx("bell") }),
      { k: "deco", id: "h_table", tx: 5, ty: 6, talk: () => hTableTalk(0) },
      { k: "deco", id: "h_table", tx: 10, ty: 7, talk: () => hTableTalk(1) },
      { k: "deco", id: "h_table", tx: 14, ty: 6, talk: () => hTableTalk(2) }]
  },
  e3h_square: {
    area: "hollow", outdoor: true, doors: ["15,3"], map: [
      "##############################",
      "##33333333##33333333##########",
      "##33333333##33333333##########",
      "##33333.33##33333333##########",
      "##..2222222222222222222.....##",
      "222222222222222222222222222222",
      "222222222222~~2222222222222222",
      "222222222222~~2222222222222222",
      "##..2222222222222222222.....##",
      "##*..........*......*.......##",
      "##**.....1111..***.....L...*##",
      "######22######################",
      "######22######################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3h_maple", tx: 28, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3h_library", tx: 1, ty: 6, dir: "right" },
      { x: 7, y: 3, w: 1, h: 1, to: "e3h_bakery", tx: 9, ty: 10, dir: "up" },
      { x: 6, y: 12, w: 2, h: 1, to: "e3h_park", tx: 5, ty: 1, dir: "down" }],
    ents: [
      { k: "save", tx: 10, ty: 9 },
      { k: "sign", tx: 5, ty: 4, text: () => G.flags.h_bakery
        ? ["* HOLLOWMERE BAKERY. OPEN.", "* Underneath, in chalk: 'COMET BUNS ARE BACK.' Someone has drawn a dog."]
        : ["* HOLLOWMERE BAKERY.", "* A sign in the window: CLOSED. A note under it: '(ALWAYS)'.", "* The window smells faintly of cinnamon."] },
      { k: "sign", tx: 15, ty: 4, text: () => ["* TOWN NOTICE BOARD.", "* 'LOST: CAT, GERALD. (Did we ever have a cat called Gerald?)'",
        "* 'SPRING FAIR: NOBODY CAME. NOBODY WAS SAD ABOUT IT.'", "* 'FAREWELL PARTY FOR THE ______ FAMILY: CANCELLED. (THERE WAS NOTHING TO SAY GOODBYE TO.)'",
        "* All of it in the same small, neat handwriting."] },
      { k: "npc", id: "h_oates", tx: 9, ty: 8, talk: () => hOatesTalk() },
      { k: "npc", id: "rumormill", tx: 25, ty: 6, if: () => G.flags.boss_rumormill !== "kill", talk: () => hBossDone() ? [
        L("rumormill", pick(["...we just turn when there's wind now. it's very relaxing.", "if you hear a rumor, you can tell it to us. we promise not to pass it on.", "a gentle hand wrote us. down under the library. it said: it's kinder this way."])),
        L("rumormill", "...was it? kinder?")] : [] },
      { k: "deco", id: "h_millwreck", tx: 25, ty: 6, if: () => G.flags.boss_rumormill === "kill", talk: () => ["* A heap of torn sails.", "* You can still read one scrap: '...ALWAYS...'", "* Nobody in the square is talking."] }],
    triggers: [{ x: 21, y: 4, w: 1, h: 7, if: () => !G.flags.boss_rumormill, run: () => hMillEvent() }]
  },
  e3h_park: {
    area: "hollow", enc: true, outdoor: true,
    puzzle: { flag: "h_stars", key: "h_starkey", order: ["4,6", "9,3", "14,5", "19,3", "11,9"],
      wrong: "* The stones go dark. Just dots again. (Start from the nose.)",
      done: ["* The five stones light up, one after another: nose, ear, back, tail, paw.", "* For a moment, a dog made of starlight shakes itself off and trots up the hill.", "* The hedge gate on the hill swings open."] },
    map: [
      "#####..#######################",
      "##*.....**.....*****..1111111#",
      "##.............*****..1.....1#",
      "##*......o.........o..1.....1#",
      "##....................1.....1#",
      "##.....~~~....o.......D.....1#",
      "##..o..~~~............D.....1#",
      "##.....~~~............D.....1#",
      "##....................1.....1#",
      "##*........o..........1.....1#",
      "##**.....*****....***.1111111#",
      "##############################",
      "##############################"],
    exits: [{ x: 5, y: 0, w: 2, h: 1, to: "e3h_square", tx: 6, ty: 10, dir: "up" }],
    ents: [
      { k: "sign", tx: 12, ty: 2, text: () => G.flags.h_stars
        ? ["* STAR GARDEN.", "* 'COMET MAJOR, as charted by J., age 9.'", "* The stones are still glowing a little."]
        : ["* STAR GARDEN. Stepping stones set in the shape of a constellation.", "* 'COMET MAJOR, as charted by ___, age 9.'",
          "* A sticky note covers the name: 'NOBODY CHARTED THIS.' You peel it off. Underneath, just a J.", "* 'Walk the stars in order and the gate on the hill will open.'"] },
      { k: "npc", id: "h_pip", tx: 17, ty: 8, talk: () => hPipTalk() },
      { k: "save", tx: 3, ty: 9 },
      { k: "deco", id: "h_telescope", tx: 25, ty: 3, talk: () => hTelescopeTalk() },
      { k: "item", tx: 26, ty: 8, item: "h_cocoa", flag: "it_h_cocoa" }]
  },
  e3h_library: {
    area: "hollow", enc: true, map: [
      "##############################",
      "##BBBBBBBBBBBBBBBBBBBBBBBBBB##",
      "##..........................##",
      "##.BB.BB.BB......BB.BB.BB.BB##",
      "##.BB.BB.BB......BB.BB.BB.BB##",
      "..............................",
      "..............................",
      "..............................",
      "##.BB.BB.BB......BB.BB.BB.BB##",
      "##.BB.BB.BB......BB.BB.BB.BB##",
      "##..........RRRR............##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3h_square", tx: 28, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3h_gate", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "npc", id: "h_librarian", tx: 14, ty: 3, talk: () => hLibrarianTalk() },
      { k: "deco", id: "h_libdesk", tx: 13, ty: 3, talk: () => ["* The returns desk. A stamp, an ink pad, and a little bell that says RING FOR SERVICE.", "* Someone has added a note: 'NO ONE HAS EVER BORROWED ANYTHING.' The stamp is worn flat."] },
      { k: "deco", id: "h_book", tx: 13, ty: 10, talk: () => [
        "* HOLLOWMERE: A HISTORY. It's open on the reading rug.", "* 'Hollowmere was founded by people who wanted somewhere small enough to know everyone.'",
        "* In the margin, neat and small: 'and nobody ever left.'", "* Further down: 'Every goodbye in this town has been corrected. You're welcome.'"] },
      { k: "deco", id: "h_cart", tx: 2, ty: 2, talk: () => {
        const n = E3.restoredNames();
        return n.length ? ["* A book cart labeled RETURNED. Somebody keeps putting books on it that the library never owned.", `* The spines say: ${n.join(", ")}.`, "* You know those names. From further down."]
          : ["* A book cart labeled RETURNED. It's empty.", "* A note on the handle: 'NOTHING EVER COMES BACK.' The cart squeaks, offended."];
      } },
      { k: "deco", id: "h_tshredder", tx: 27, ty: 2, if: () => E3.shredderSpared(), talk: () => ["* A little desk shredder, taped back together.", "* It refuses to shred. It just holds the papers gently in its teeth, like it's keeping them safe.", "* ...It reminds you of someone very big, very far down."] },
      { k: "item", tx: 3, ty: 10, item: "h_cinnastar", flag: "it_h_libstar" }]
  },
  e3h_gate: {
    area: "hollow", map: [
      "####################",
      "##BBBB####BBBB######",
      "##....,.....P.....##",
      "##.PP........PPP..##",
      "##................##",
      "....................",
      "....................",
      "....................",
      "##..P.........P...##",
      "##.PPP.......PP...##",
      "##................##",
      "####################",
      "####################"],
    exits: [{ x: 0, y: 5, w: 1, h: 3, to: "e3h_library", tx: 28, ty: 6, dir: "left" }],
    ents: [
      { k: "save", tx: 3, ty: 4 },
      { k: "page", tx: 14, ty: 9, page: "p9" },
      { k: "npc", id: "quill", tx: 15, ty: 4, if: () => !!G.flags.h_gate, talk: () => [
        L("quill", "Through the crack. That way. Into the margins."),
        L("quill", hPhotoEv() ? "And keep that photo safe. A dog vouched for it. That's practically legal." : "...If you want to find out who Juni was first, Hollowmere's still right behind us.")] },
      { k: "npc", id: "sol", tx: 15, ty: 8, if: () => E3.solAlly(), talk: () => [
        L("sol", "...MILO. I followed the light down here. Old habit."), L("sol", "These blank pages. I left them, when I stopped erasing. I just... left them."),
        L("sol", "I thought blank was kind. I was wrong about that as well. I am trying to be wrong less often."), L("sol", "Go. I will keep a light on at this end.")] },
      { k: "deco", id: "h_crack", tx: 17, ty: 3, talk: () => ["* The margin of the world has split open like a seam.", "* Neat handwriting leaks out of it, line after line, and crawls up the walls toward the town.", "* The way through is to the east."] }],
    triggers: [{ x: 9, y: 2, w: 1, h: 9, if: () => !G.flags.h_gate, run: () => hGateEvent() }]
  }
});
for (const id of Object.keys(ROOMS).filter(k => k.startsWith("e3h_"))) {
  const r = ROOMS[id], w = Math.max(...r.map.map(s => s.length));
  r.map = r.map.map(s => s.padEnd(w, "#"));
}

/* ---------- dialogue ---------- */
function hDeskTalk() {
  if (G.flags.h_photo) return ["* Your desk. Quill's inkwell. A pencil chewed in a way you don't remember chewing it."];
  return [
    "* Your desk. Homework, a dead pen, and Quill's inkwell, still wobbling a little.",
    "* And a photo, torn down the middle.",
    "* It's you, at the lake, laughing so hard your eyes are shut.",
    "* There's an arm around your shoulder. The arm stops at the tear.",
    { t: "* You take the torn photo.", after: () => {
      if (!addItem("juniphoto")) { Dialog.open(["* Your pockets are full. You leave it on the desk for now."]); return; }
      G.flags.h_photo = true; Toast.show("GOT: TORN PHOTO"); Sound.sfx("item");
    } }];
}
function hQuillBed() {
  if (!G.flags.h_photo) return [L("quill", "The photo! On the desk! It keeps elbowing me. Photos don't have elbows. This one does.")];
  if (!G.flags.h_rain) return [L("quill", "My voice will come with you, in the pen. The rest of me is staying in this inkwell. It's cozy."),
    L("quill", "Remember: find the truth first. THEN strike. The pen can't guess.")];
  if (!hPhotoEv()) return [L("quill", "Somebody in this town must remember who's in that photo."), L("quill", "Somebody who can't read notes, maybe. Notes only work on readers.")];
  return [L("quill", pick(["Your room is very you. I mean that as a compliment. Mostly.", "I keep wanting to tidy your desk. Archivist instincts. Resist, Quill. Resist.", "Go on! The town's waiting. I'm right there in your pocket. Sort of."]))];
}
function hMirrorTalk() {
  return ["* Your mirror. You look like you. Bed hair. A pillow crease on one cheek.",
    E3.ep1Void() ? "* For a second your reflection looks heavier than you feel. Like it's still carrying something you put down." : "* You make a face. The mirror makes it back. Good. Some things still work.",
    "* Taped to the glass, there's a note. It's written more carefully than any of the others."];
}
function hBedTalk() {
  return ["* Your bed. Unmade, as is tradition.", "* You lie back for a second. There are glow-in-the-dark stars on the ceiling.",
    "* They're not random. They're numbered in marker, like a connect-the-dots. 1, 2, 3, 4, 5.",
    "* Join them up and it's a dog. Nose, ear, back, tail, paw. A dog with a long streaky tail.",
    "* You couldn't reach the ceiling. Somebody stood on your bed to put those up. In socks, probably."];
}
function hWindowTalk() {
  G.flags.h_window = true;
  const a = ["* You look out the window.", "* Sunshine. Blue sky. Mrs. Tully's laundry, bone dry, flapping on the line.",
    "* A bird is sitting in the birdbath. The birdbath is empty. The bird looks disappointed.", "* It is not pouring. It has never been less pouring."];
  if (!G.flags.h_rain) a.push("* That's the truth. You know it now. The Pen of STET feels warm in your pocket.");
  return a;
}
function hRadioTalk() {
  if (E3.vantaAlive()) return ["* The kitchen radio crackles. The station drifts by itself.",
    L("signal", "bzzzt... is this thing on? MILO! I can pick you up all the way from the Static Fields!"),
    L("signal", "VANTA says something's writing on the world up there. VANTA says be careful."),
    L("signal", "VANTA also says don't tell you VANTA said that. ...Oops. bzzt!"), "* The radio goes back to the weather."];
  return ["* The kitchen radio is playing the Hollowmere morning report.", "* 'Sunny today. Correction: pouring. Correction to the correction: see note.'", "* Then a long, embarrassed silence."];
}
function hFridgeTalk() {
  const a = E3.stet()
    ? ["* The fridge. Magnets, a grocery list, and a postcard from CARBON TOWN.", "* 'WISH YOU WERE HERE!' Then the same postcard again, a little blurrier. Forty copies.", "* At the bottom of the last one: 'LET IT STAND. -THE COPIES (ALL OF US)'"]
    : ["* The fridge. Magnets, and a grocery list: 'EGGS. MILK. ???'"];
  a.push("* And a crayon drawing: two kids and a dog under a lot of stars. One of the kids has been neatly rubbed out.",
    "* A note on it says 'MILO DREW THIS ALL ALONE.' You didn't. You couldn't draw dogs back then. Somebody else drew the dog.");
  return a;
}
function hMomTalk() {
  if (!G.flags.h_rain) {
    if (G.flags.h_window) return [L("h_mom", "Sunny? Don't be silly, sweetheart, it's..."), "* She looks out the window.",
      L("h_mom", "...huh. Well. The note says pouring, though. Notes don't lie, honey. They're written down.")];
    return [L("h_mom", "Morning, sleepyhead! There's toast. It's a little burnt. I'm calling it 'rustic.'"),
      L("h_mom", "Don't even think about going out today, though. It's pouring."), "* You can't hear any rain.",
      L("h_mom", "It says so right there on the front door. In writing. Very neat writing."),
      L("h_mom", "If it's written down that neatly, it must be true. That's just how things work. Isn't it?")];
  }
  if (!G.flags.h_lunch) return [L("h_mom", "Would you look at that sun! I could've sworn... never mind. Go on, get some air."),
    L("h_mom", "Here. I packed your lunch.", { give: "h_lunch" }),
    L("h_mom", "...I packed two. I don't know why I packed two. I've been doing that since... I don't know since when.", { give: "h_lunch", after: () => { G.flags.h_lunch = true; } })];
  return [{ t: L("h_mom", "Off out again? Need anything?").t, who: "h_mom", ch: ["Ask about Juni", "Say bye"], on: i => i === 0 ? hMomJuni() : [L("h_mom", G.flags.h_bakery
    ? "The bakery's OPEN? Bring me back a cinnamon star! I used to buy two. One for you, and one for... huh."
    : pick(["Back by dinner! It's spaghetti. Probably. The jar has a note on it that says soup.", "Wear a coat! ...You're wearing a coat? Good. Wear another one.", "Say hi to Mrs. Tully! And that sweet dog of hers. Is he hers?"]))] }];
}
function hMomJuni() {
  if (hPhotoEv()) return [L("h_mom", "That photo again? That's you at Loon Lake. You fell in. Twice."),
    L("h_mom", "...Whose arm is that, around your shoulder? I should know that. I feel like I should know that."),
    L("h_mom", "There was a rainy day last year when you wouldn't come out of your room. I never found out why."),
    L("h_mom", "...Sorry, sweetheart. I don't know why I said that.")];
  return [L("h_mom", "Juni? Is that a band? Is that one of those phone games?"),
    L("h_mom", "You've always been happy on your own, haven't you? My little lone wolf."), "* That isn't true. You don't know how you know. But it isn't."];
}
function hMailboxTalk() {
  if (G.flags.h_juninote) return ["* The mailbox of number 9. The flag is down.", "* Inside the lid there's a yellow sticker: 'PLEASE FORWARD.'", "* The address underneath has been scribbled out in neat little loops."];
  return ["* The mailbox of number 9.", "* A sticky note on the lid: 'NO MAIL. EVER.' It isn't even floating. It's just a sticky note.", "* The hinge is worn shiny, like it used to open every single day."];
}
function hCometTalk() {
  const desc = "* A scruffy dog with a white streak down his back, like a comet's tail. He's staring at the door of number 9.";
  if (G.flags.h_comet) return [desc.replace("He's staring", "He's guarding"), L("h_comet", pick(["Wuff.", "Wuff wuff.", "...wuff."])),
    "* He doesn't know nobody's coming. Or he does, and he waits anyway."];
  const a = [desc, "* His tag says COMET. On the back, in marker: IF FOUND, YOU ARE A GOOD FRIEND."];
  if (!G.inv.includes("juniphoto")) return [...a, L("h_comet", "Wuff?"), "* He sniffs your empty hands, then goes back to watching the door.",
    "* If you had something that smelled like whoever lived here..."];
  a.push({ t: "* Show Comet the torn photo?", ch: ["Show it", "Pet him"], on: i => i !== 0
    ? ["* You scratch Comet behind the ears. His back leg goes. He's still watching the door."]
    : ["* You hold out the torn photo. Comet sniffs it. Sniffs it again. His tail starts going.",
      "* He presses his nose against the torn edge. The edge where someone else should be.", L("h_comet", "WUFF! WUFF!"),
      "* He trots to the door of number 9 and sits, very straight, the way dogs sit when someone is about to come home.",
      "* Notes can't fool a dog. Dogs can't read.",
      { t: "* Comet remembers. Somebody was in this photo with you, and they lived here.", after: () => { G.flags.h_comet = true; E3.addEvidence("photo", "Juni's torn photo"); } }] });
  return a;
}
function hTullyTalk() {
  if (G.flags.h_juninote) return [L("h_tully", "'Please forward.' Well. I suppose somebody did live at number 9. I suppose I knew that."),
    L("h_tully", "I've been saving the Sunday crossword for someone, every week. I don't even DO crosswords.")];
  if (G.flags.h_comet) return [L("h_tully", "Look at him wag! He hasn't wagged like that since..."),
    L("h_tully", "...since a rainy day. A car with boxes tied to the roof, getting soaked. I remember the boxes."),
    L("h_tully", "I don't remember the car leaving. I don't remember anyone waving. Isn't that odd?")];
  return [L("h_tully", "Morning, MILO. You're up early. Or late. I've stopped being sure what time it is since the notes came."),
    L("h_tully", "That dog sits outside number 9 every single day. Number 9's always been empty. Says so right on the door."),
    L("h_tully", "He turned up on my porch one day with his own bowl. 'COMET,' in a kid's handwriting. I've fed him ever since."),
    L("h_tully", "Somebody asked me to. I'm sure somebody asked me to."),
    L("h_tully", "If you want to know about number 9, ask the dog. He knows more than I do these days.")];
}
function hTeacherTalk() {
  const a = [];
  if (!G.flags.h_metPlumb) {
    G.flags.h_metPlumb = true;
    a.push(L("h_teacher", "MILO! No school today. Teacher work day. Which means I drink cold coffee and stare at the spare desk."),
      L("h_teacher", "Twenty-three students. Twenty-four desks. We've always had a spare, for luck. The district says that's normal."),
      L("h_teacher", "Nineteen years I've taught. I have never once kept a spare desk. I hate spare desks. They look like they're waiting."));
  } else a.push(L("h_teacher", pick(["The silver star chart is the best in the class. I gave it a gold star. ...Whose is it? Why didn't I write it down?",
    "If you're cutting through to the square, the bakery's always closed. Or so I'm told. By a note. Hm.",
    "Lost and found's by the window. One coat has been there a whole year. I can't bring myself to donate it."]))) ;
  if (hPhotoEv()) a.push(L("h_teacher", "Oh, that photo! The class trip to Loon Lake. You fell in. Twice. Someone fished you out, both times."),
    L("h_teacher", "...Who fished you out? I wrote a whole note home about it. I remember the note. Not the name."));
  return a;
}
function hChartTalk() {
  G.flags.h_chart = true;
  return ["* Star charts by Class 4B. Orion. The Big Dipper. A rocket (not a constellation).",
    "* One chart is different. Silver pen on navy paper, very careful. No name. Just a J.",
    "* 'COMET MAJOR (the dog constellation). Connect in order or it's just dots!'",
    "* '1. NOSE: far west, the brightest. 2. EAR: up from the nose. 3. BACK: right in the middle.'",
    "* '4. TAIL: way east, up high. 5. PAW: down low, last, so he can run.'",
    "* At the bottom: 'P.S. M, I named the little one after you. It's small because it's far away. Not because it's small.'"];
}
function hLostFoundTalk() {
  if (G.flags.h_coat) return ["* The green coat is still here. You leave it.", "* Somebody might come back for it."];
  return ["* LOST & FOUND. A mitten. A recorder. A retainer (gross).",
    "* And a green coat with a yellow star sewn on the pocket. It's been here a long time. Nobody's claimed it.",
    "* It would fit you. It would fit you exactly. It isn't yours.", "* In the pocket, folded small: a receipt.",
    { t: "* You take the receipt.", after: () => {
      if (!addItem("h_receipt")) { Dialog.open(["* Your pockets are full. You leave the receipt in the coat for now."]); return; }
      G.flags.h_coat = true; Toast.show("GOT: BAKERY RECEIPT"); Sound.sfx("item");
    } }];
}
function hTableTalk(i) {
  if (G.flags.h_bakery) return [["* A little round table, chairs down. Someone has left a crumb. A real crumb. Evidence!",
    "* A table by the window. Two chairs. One of them has a dog bowl tucked under it.", "* A table with a tiny vase of daisies. The daisies look relieved."][i]];
  return ["* A little round table. The chairs are stacked on top, legs in the air, like they've given up."];
}
function hBakerTalk() {
  const shop = ["h_cinnastar", "h_cometbun", "h_baguette", "h_ovenmitt"];
  if (G.flags.h_bakery) {
    if (!G.flags.h_bakeGift) return [L("h_baker", "OPEN! We're open! Look at me, I'm covered in flour, I'm SO happy."),
      L("h_baker", "Here. A comet bun, on the house. The first one in a year.", { give: "h_cometbun" }),
      L("h_baker", "And look what I found in the back. A baguette with a crust like armor, and oven mitts that have survived everything.", {
        after: () => { G.flags.h_bakeGift = true; Shop.open(shop, "h_baker", "Everything's fresh! Well. Everything's a year old and somehow fresh. Don't think about it.", "Say hi to your mom for me. And to Comet!"); } })];
    return [L("h_baker", pick(["Welcome back! What'll it be?", "Fresh out of the oven! Most of it. Some of it is the oven.", "Comet's had three buns today. Don't tell him I counted."]), {
      after: () => Shop.open(shop, "h_baker", "Take your time. Bread is patient.", "Say hi to your mom for me. And to Comet!") })];
  }
  if (G.flags.h_bakerMem) return [L("h_baker", "That note by the window says we were always closed. I believed it. It was written so NEATLY."),
    L("h_baker", "You've got that pen, haven't you? Go on. Strike it out for me. I'll get the oven going.")];
  if (G.inv.includes("h_receipt")) return ["* You show Odette the receipt from the coat pocket.",
    L("h_baker", "HOLLOWMERE BAKERY. Two cinnamon stars, one comet bun. Paid in coins. Lots of very small coins."),
    L("h_baker", "Dated last spring. That's my till. That's my 'THANK YOU, COME AGAIN.' I drew that smiley face!"),
    L("h_baker", "Comet buns. I INVENTED comet buns! A bun with a long cinnamon tail, for a dog. A dog who came in every Saturday with two kids."),
    L("h_baker", "One of them was you. The other one had a star on their coat and counted the coins out loud. Every coin. Every time."),
    L("h_baker", "I remember. The bakery was OPEN, MILO. It was the best thing I ever did."),
    { t: "* (You know the truth now. The note in the corner doesn't.)", after: () => { G.inv = G.inv.filter(k => k !== "h_receipt"); G.flags.h_bakerMem = true; } }];
  if (!G.flags.h_bakeQuest) {
    G.flags.h_bakeQuest = true;
    return [L("h_baker", "Oh! A customer? No, no, sorry, we're closed. We've always been closed. It's on the note."),
      L("h_baker", "I'm Odette. I come in every morning at five. I put on the apron. I preheat the oven. Then I stand here. Closed."),
      L("h_baker", "Some mornings I knead nothing. Just the air. My hands seem to know how."),
      L("h_baker", "...Why do my hands smell like cinnamon, if we were always closed?"),
      L("h_baker", "If you ever find proof I sold so much as a crumb... bring it here. I'd like to know.")];
  }
  return [L("h_baker", pick(["The oven's warm. It's always warm. I don't know what for.", "Proof. A crumb of proof. That's all I'd need.", "Closed. Closed, closed, closed. It's a sad word if you say it enough."]))];
}
function hOatesTalk() {
  if (G.flags.boss_rumormill === "kill") return [L("h_oates", "It's very quiet. Nobody's telling anybody anything."), L("h_oates", "I thought I'd like that more.")];
  if (hBossDone()) return [L("h_oates", "I've decided to only repeat things I've seen with my own two eyes."),
    L("h_oates", "So far today I've seen one pigeon, a second pigeon, and you. I've told everyone about all three.")];
  return [L("h_oates", "Did you hear? The bakery was always closed. Eighty-one years I've lived here. Never bought a crumb."),
    L("h_oates", "...Then why do I tell the pigeons this seed is 'the good stuff from Odette's'?"),
    L("h_oates", "Stay away from that windmill, child. It tells you things. Then you tell people things. Then it's true."),
    L("h_oates", "There was never a windmill there, you know. ...There's a note on it that says there always was.")];
}
function hPipTalk() {
  if (hBossDone()) return [L("h_pip", "I'm only saying TRUE stuff now. Did you know dogs have wet noses? TRUE. I checked."),
    L("h_pip", G.flags.h_stars ? "And the stones lit up! I saw it with my actual eyes!" : "The stepping stones are a constellation. That's true too. A big kid told me.")];
  if (G.flags.h_stars) return [L("h_pip", "WHOA. The stones lit up! Was that you? I'm telling EVERYONE."), L("h_pip", "...Is it a rumor if it's true? I think it's just news.")];
  return [L("h_pip", "Psst! Did you hear? The windmill in the square says the bakery was always closed!"),
    L("h_pip", "And that it NEVER rains on Tuesdays! And ALSO that it's pouring! Both! At the same time!"),
    L("h_pip", "Those stones are a constellation, by the way. A big kid who knew all the stars showed me. It's a dog. Looks like dots to me."),
    L("h_pip", "I forget who the big kid was. I forget a lot lately. Everybody does.")];
}
function hTelescopeTalk() {
  if (G.flags.h_telescope) return ["* The telescope is pointed at where the dog will be, tonight."];
  return ["* An old telescope on a tripod. The brass has gone green.",
    "* A label in silver pen: PROPERTY OF J. IF FOUND, YOU'RE ON THE HILL. STAY FOR A BIT.",
    "* You look through it. In the daytime it's just blue. But you know what's up there.",
    "* You remember a blanket. Too much cocoa. Two kids naming stars until one of them fell asleep mid-sentence.",
    L("juni", "When you can't sleep, find the dog. Nose, ear, back, tail, paw. Then you'll know I'm looking at it too."),
    "* Same stars. Different windows. Somebody promised that.",
    "* You remember rain on your bedroom window, and a car with boxes on the roof. You remember you didn't go outside.",
    { t: "* You don't remember why. ...You don't want to. Not yet.", after: () => { G.flags.h_telescope = true; } }];
}
function hLibrarianTalk() {
  if (G.flags.h_metFolio) return [L("h_librarian", pick(["Shh. Sorry. Reflex.", "The basement's through the east door. I'll be up here. Shushing things. Bravely.",
    "Every book has notes in it now. Even the dictionary. Under 'goodbye' it just says: 'see: nothing.'"]))];
  G.flags.h_metFolio = true;
  return [L("h_librarian", "Shh. Oh, it's you, MILO. Sorry. I shush everyone. I shushed a moth this morning."),
    L("h_librarian", "Every book in this library has notes in the margins now. Little ones. Neat ones."),
    L("h_librarian", "'This never happened.' 'She didn't mean it.' 'Nobody was sad.' In every book. Even the cookbooks."),
    L("h_librarian", "They started in the basement. The basement door's been rattling all week, like something down there is writing very fast."),
    L("h_librarian", "Also, if you see a kid with a J on their library card: 'A Child's Guide to the Night Sky' is eleven months overdue."),
    L("h_librarian", "...Tell them it's fine. Tell them I'd waive the fine. I'd just like to know they're all right.")];
}
function hMillEvent() {
  World.busy = true;
  Dialog.open([
    "* The square goes quiet. Then it goes very, very loud.",
    "* In the middle of the road to the library there is a windmill. Its sails are made of pages, and every page is whispering.",
    "* There has never been a windmill in Hollowmere. A note pinned to it says there always has.",
    L("rumormill", "DID YOU HEAR? DID YOU HEAR? DID YOU HEAR?"),
    L("rumormill", "THE BAKERY WAS ALWAYS CLOSED! IT'S POURING! NOBODY ON MAPLE STREET EVER MOVED AWAY!"),
    L("rumormill", "AND MILO NEVER HAD A BEST FRIEND!"),
    L("rumormill", "EVERYBODY SAYS SO. EVERYBODY! AND IF EVERYBODY SAYS SO..."),
    L("rumormill", "...THEN IT'S TRUE. ISN'T IT? SAY IT'S TRUE. SAY YOU BELIEVE US!")],
  () => startEncounter("rumormill", { onEnd: E3.bossEnd("rumormill", hMillAfter) }));
}
function hMillAfter(res) {
  if (res === "kill") {
    Dialog.open(["* The sails fall one by one. Each one lands with a whisper, and then nothing.", "* Hollowmere is very quiet. Nobody is saying anything at all.",
      L("quill", "...MILO. It only wanted to be believed."), "* The road to the library is open."]);
    return;
  }
  Dialog.open(["* The sails creak to a stop. For the first time in days, Hollowmere is quiet.",
    L("rumormill", "...we were written, you know. on a blank page. down under the library."),
    L("rumormill", "by a very gentle hand. it said: tell them. tell everyone. it's kinder this way."),
    L("rumormill", "...was it kinder? it didn't feel kinder. it felt loud."),
    L("quill", "Under the library. That's where it's all coming from. Come on, MILO.")]);
}
function hGateEvent() {
  G.flags.h_gate = true; World.busy = true;
  const a = [
    "* The library basement. It's full of paper. Not old paper. BLANK paper, hundreds of sheets, warm to the touch.",
    "* At the far wall the margin of the world has split open like a seam. Neat handwriting leaks out, line after line.",
    "* Your pen sputters. A little splash of ink, and Quill climbs out of it, slightly out of breath.",
    L("quill", "Phew. Long-distance ink travel. Never again. Until next time."),
    L("quill", "Look at these pages. Blank, just like the ones REDACT left behind in the Underprint."),
    L("quill", "Somebody's been writing on them. Writing UP, into your world. Kinder versions of things. Wrong versions.")];
  if (hPhotoEv()) a.push(L("quill", "You've got proof Juni was real. A dog's word. That counts. Hold on to it. Somebody, somewhere, is going to ask for it."));
  else a.push(L("quill", "...We still don't know who Juni is. Somebody in Hollowmere must remember. If you want to look, now's the time."));
  if (G.flags.h_bakery) a.push(L("quill", "And the bakery's open again! I could smell it from the pen. Ink can't eat. But it can WANT."));
  a.push(L("quill", "Whatever's through there, we go together. Me in the pen. You in the... you."), L("quill", "Ready when you are. Just walk into the margin."));
  Dialog.open(a, () => { World.busy = false; World.buildEnts(); });
}

/* ---------- sprites: monsters ---------- */
Object.assign(MON_DRAW, {
  hearsay(cx, by, t, e, u = 5) {
    const calm = e && e.sp >= 100, R = P(cx, by + Math.sin(t * 3) * (calm ? 1 : 3), u);
    R(-6, -10, 2, 8, "#8a7f68"); R(2, -8, 2, 6, "#8a7f68"); R(-7, -3, 4, 2, "#5a4a3a"); R(1, -3, 4, 2, "#5a4a3a");
    R(-13, -21, 5, 6, "#d9d0bb"); R(-8, -23, 6, 10, "#e8e0cc"); R(-2, -25, 6, 14, "#efe6cf"); R(4, -27, 6, 18, "#f6f0dc");
    R(10, -28, 2, 20, "#b9ae95"); R(5, -24, 4, 12, "#d9d0bb");
    R(6, -20, 3, calm ? 1 : 2 + Math.abs(Math.sin(t * 8)) * 3, "#5a2a2a");
    R(-5, -21, 2, 2, "#1a1a22"); R(-1, -22, 2, 2, "#1a1a22");
    R(-9, -17, 5, 1, "#8a7f68"); R(-3, -16, 6, 1, "#8a7f68"); R(-3, -14, 4, 1, "#8a7f68");
    if (!calm) for (let i = 0; i < 3; i++) {
      const k = (t * .8 + i / 3) % 1;
      txt(["psst", "did you", "hear?"][i], cx + (15 + k * 8) * u, by - (26 - i * 6 + k * 4) * u, `rgba(242,236,216,${(.8 * (1 - k)).toFixed(2)})`, 3 * u, "center");
    }
  },
  stickynote(cx, by, t, e, u = 5) {
    const calm = e && e.sp >= 100, f = calm ? 0 : Math.sin(t * 4) * 1.5, R = P(cx, by + Math.sin(t * 2) * 2, u);
    R(-12, -32, 24, 24, "#e8d040"); R(-12, -32, 24, 4, "#d8bc30");
    R(4, -12 - f, 8, 4 + f, "#c8ac28"); R(8, -10 - f, 4, 2, "#b89c20");
    R(-6, -24, 3, 3, "#1a1a22"); R(3, -24, 3, 3, "#1a1a22");
    if (calm) { R(-4, -19, 8, 1, "#1a1a22"); R(-5, -20, 1, 1, "#1a1a22"); R(4, -20, 1, 1, "#1a1a22"); }
    else R(-3, -19, 6, 2, "#5a2a2a");
    txt(calm ? "thanks!" : "REMEMBER:", cx, by - 15 * u, "#3a3a6a", 3.4 * u, "center");
    R(-8, -11, 10, .6, "#3a3a6a"); R(-8, -9.5, 7, .6, "#3a3a6a");
  },
  lostposter(cx, by, t, e, u = 5) {
    const calm = e && e.sp >= 100, R = P(cx, by + Math.sin(t * 1.6) * 2, u), oy = Math.sin(t * 1.6) * 2;
    R(-12, -36, 24, 30, "#f6f6f2"); R(-12, -36, 24, 1, "#c8c8c8");
    R(-14, -37, 5, 2, "#d9d0bb"); R(9, -37, 5, 2, "#d9d0bb");
    txt("MISSING", cx, by - 35 * u + oy, "#c03a3a", 5 * u, "center");
    R(-5, -26, 10, 8, "#5a5a66"); R(-5, -28, 2, 2, "#5a5a66"); R(3, -28, 2, 2, "#5a5a66"); R(5, -21, 4, 1, "#5a5a66");
    const look = Math.sin(t * 1.3) > 0 ? 1 : 0;
    R(-3 + look, -24, 1, 1, "#ffd84a"); R(2 + look, -24, 1, 1, "#ffd84a");
    if (calm) R(-2, -21, 4, 1, "#f6f6f2");
    R(-10, -15, 14, 1, "#8a8a8a"); R(-10, -13, 10, 1, "#8a8a8a");
    for (let i = 0; i < 6; i++) {
      if (calm && i === 2) continue;
      R(-11 + i * 4, -8, 3, 5 + Math.sin(t * 6 + i) * .8, "#f6f6f2"); R(-11 + i * 4 + 1, -7, 1, 3, "#8a8a8a");
    }
  },
  dejavu(cx, by, t, e, u = 5) {
    const calm = e && e.sp >= 100, sep = calm ? 0 : 4 + Math.sin(t * 2) * 2;
    const body = (ox, col) => {
      const R = P(cx + ox * u, by + Math.sin(t * 2 + ox) * 2, u);
      R(-8, -28, 16, 20, col); R(-10, -24, 20, 12, col); R(-6, -8, 4, 5, col); R(2, -8, 4, 5, col);
    };
    if (!calm) { body(-sep, "rgba(184,168,232,.25)"); body(sep, "rgba(184,168,232,.25)"); }
    body(0, "#b8a8e8");
    const ex = cx, ey = by - 20 * u + Math.sin(t * 2) * 2;
    ctx.strokeStyle = "#3a2a5a"; ctx.lineWidth = u * .7; ctx.beginPath();
    for (let a = 0; a < Math.PI * 4; a += .2) { const r = a * .45 * u, aa = a + (calm ? 0 : t * 3); ctx.lineTo(ex + Math.cos(aa) * r, ey + Math.sin(aa) * r); }
    ctx.stroke();
    ctx.fillStyle = "#3a2a5a"; ctx.fillRect(cx - 3 * u, by - 12 * u, 6 * u, u);
  },
  talltale(cx, by, t, e, u = 5) {
    const k = e ? Math.min(1, (e.sp || 0) / 100) : 0, st = 16 - k * 12, sw = Math.sin(t * 2) * (1 - k) * .8;
    const R = P(cx + sw * u, by, u);
    R(-5, -st, 2, st, "#c8a040"); R(3, -st, 2, st, "#c8a040"); R(-6, -st, 4, 1, "#8a6a2a"); R(2, -st, 4, 1, "#8a6a2a");
    const b = -st;
    R(-6, b - 16, 12, 16, "#efe6cf"); for (let i = 0; i < 4; i++) R(-4, b - 13 + i * 3, 8, .6, "#8a7f68");
    R(-5, b - 24, 10, 8, "#f0c8a0"); R(-3, b - 21, 2, 2, "#1a1a22"); R(2, b - 21, 2, 2, "#1a1a22"); R(-2, b - 18, 5, 1, "#8a3a2a");
    R(-6, b - 25, 12, 2, "#2a2a30"); R(-4, b - 31, 8, 6, "#2a2a30"); R(-4, b - 27, 8, 1, "#c03a3a");
    const arm = 6 + (1 - k) * 6;
    R(-6 - arm, b - 13, arm, 2, "#efe6cf"); R(6, b - 13, arm, 2, "#efe6cf");
    R(-6 - arm - 1, b - 14, 2, 4, "#f0c8a0"); R(6 + arm - 1, b - 14, 2, 4, "#f0c8a0");
    if (k < 1) txt("THIS BIG", cx, by + (b - 11) * u, "#c8a040", 3 * u, "center");
  },
  rumormill(cx, by, t, e, u = 3.5) {
    const calm = e && e.sp >= 100, st = (e && e.stilled) || [];
    const spin = calm ? .25 : 2.4 - st.length * .45;
    if (e) { e.ang = (e.ang || 0) + Math.min(.1, Math.max(0, t - (e.lt === undefined ? t : e.lt))) * spin; e.lt = t; }
    const ang = e ? e.ang : t * spin, R = P(cx, by, u);
    R(-12, -6, 24, 6, "#5a524a"); R(-11, -6, 22, 1, "#7a7068");
    for (let i = 0; i < 7; i++) { const w = 20 - i * 1.6, y = -6 - (i + 1) * 4; R(-w / 2, y, w, 4, i % 2 ? "#e8e0cc" : "#d9d0bb"); R(-w / 2 + 1, y + 1.5, w - 2, .6, "#8a7f68"); }
    const m = calm ? 1 : 2 + Math.abs(Math.sin(t * 9)) * 2;
    R(-2.5, -6 - m * 1.4, 5, m * 1.4, "#2a1a1a");
    R(-5, -22, 3, 3, calm ? "#ffd84a" : "#1a1a22"); R(2, -22, 3, 3, calm ? "#ffd84a" : "#1a1a22");
    R(-6, -38, 12, 4, "#7a3a3a"); R(-4, -40, 8, 2, "#7a3a3a");
    const hx = cx, hy = by - 33 * u;
    for (let i = 0; i < 4; i++) {
      const still = st.includes(i);
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang + i * Math.PI / 2);
      ctx.fillStyle = "#6a5a4a"; ctx.fillRect(-u * .5, 0, u, 18 * u);
      ctx.fillStyle = still ? "#9a9488" : "#f6f0dc"; ctx.fillRect(u * .5, 3 * u, 5 * u, 14 * u);
      ctx.fillStyle = "#8a7f68"; for (let k = 0; k < 5; k++) ctx.fillRect(u * 1.2, (4.5 + k * 2.6) * u, (2 + hash(i, k) * 3) * u, .5 * u);
      if (still) { ctx.strokeStyle = "#ff2b45"; ctx.lineWidth = u * .7; ctx.beginPath(); ctx.moveTo(u, 3 * u); ctx.lineTo(5.5 * u, 17 * u); ctx.stroke(); }
      ctx.restore();
    }
    R(-1.5, -34.5, 3, 3, "#3a2a1a");
    if (!calm) for (let i = 0; i < 4; i++) {
      const k = (t * .6 + i / 4) % 1;
      txt(["psst", "did you", "hear?", "!!"][i], cx + (i % 2 ? 1 : -1) * (14 + k * 10) * u, by - (16 + k * 18) * u, `rgba(242,236,216,${(.7 * (1 - k)).toFixed(2)})`, 3 * u, "center");
    }
  }
});

/* ---------- sprites: NPCs and decorations ---------- */
const H_MILL_NPC = { stilled: [] };
Object.assign(NPC_DRAW, {
  rumormill(cx, by, t, u = 2) {
    H_MILL_NPC.sp = G && G.flags.boss_rumormill === "spare" ? 100 : 0;
    MON_DRAW.rumormill(cx, by, t, H_MILL_NPC, u * .5);
  },
  h_mom(cx, by, t, u = 2) {
    const R = P(cx, by + (Math.sin(t * 2) > .98 ? -u : 0), u);
    R(-3, -33, 6, 4, "#6a3a24"); R(-6, -30, 12, 5, "#6a3a24"); R(-6, -26, 2, 6, "#6a3a24"); R(4, -26, 2, 6, "#6a3a24");
    R(-4, -26, 8, 8, "#f0c8a0"); R(-3, -23, 2, 2, "#1a1a22"); R(2, -23, 2, 2, "#1a1a22"); R(-1, -20, 3, 1, "#b05a4a");
    R(-6, -18, 12, 14, "#c86a5a"); R(-4, -16, 8, 10, "#f2ecd8"); R(-4, -16, 8, 1, "#d8c8b0");
    R(-7, -17, 1, 7, "#f0c8a0"); R(6, -17, 1, 7, "#f0c8a0");
    R(-4, -4, 3, 4, "#3a2a22"); R(1, -4, 3, 4, "#3a2a22");
  },
  h_comet(cx, by, t, u = 2) {
    const happy = G && G.flags.h_comet, wag = Math.sin(t * (happy ? 16 : 3)) * (happy ? 2 : 1), R = P(cx, by, u);
    R(-8, -12, 14, 7, "#8a6a4a"); R(-8, -13, 14, 2, "#f2ecd8");
    R(4, -18, 7, 7, "#8a6a4a"); R(9, -15, 3, 3, "#6a4a30"); R(11, -15, 1, 1, "#1a1a22");
    R(7, -16, 1, 1, "#1a1a22"); R(4, -20, 2, 4, "#5a4030");
    R(-7, -5, 2, 5, "#8a6a4a"); R(-3, -5, 2, 5, "#8a6a4a"); R(1, -5, 2, 5, "#8a6a4a"); R(4, -5, 2, 5, "#8a6a4a");
    R(3, -11, 3, 1, "#c03a3a"); R(4, -10, 1, 1, "#d8b25a");
    R(-11, -14 + wag * .5, 3, 2, "#8a6a4a"); R(-13, -16 + wag, 3, 3, "#f2ecd8");
  },
  h_tully(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-5, -30, 10, 5, "#d8d8e0"); R(-6, -27, 2, 4, "#d8d8e0"); R(4, -27, 2, 4, "#d8d8e0");
    R(-4, -26, 8, 8, "#e8c0a0"); R(-3, -23, 2, 1, "#1a1a22"); R(2, -23, 2, 1, "#1a1a22"); R(-4, -24, 3, 3, "rgba(255,255,255,.3)"); R(1, -24, 3, 3, "rgba(255,255,255,.3)");
    R(-1, -20, 3, 1, "#a05a5a");
    R(-6, -18, 12, 14, "#7a4a8a"); R(-1, -18, 2, 12, "#d8b25a");
    R(-7, -17, 1, 7, "#e8c0a0"); R(7, -12, 1, 12, "#6a4a30"); R(6, -13, 3, 1, "#6a4a30");
    R(-4, -4, 3, 4, "#3a3a44"); R(1, -4, 3, 4, "#3a3a44");
  },
  h_baker(cx, by, t, u = 2) {
    const R = P(cx, by + (Math.sin(t * 3) > .97 ? -u : 0), u);
    R(-5, -36, 10, 6, "#f6f6f2"); R(-6, -34, 3, 3, "#f6f6f2"); R(3, -34, 3, 3, "#f6f6f2"); R(-5, -30, 10, 2, "#d8d8d8");
    R(-5, -28, 10, 9, "#d8a080"); R(-3, -25, 2, 2, "#1a1a22"); R(2, -25, 2, 2, "#1a1a22"); R(-2, -21, 4, 1, "#a05a4a");
    R(-5, -24, 2, 2, "#e87a7a"); R(3, -24, 2, 2, "#e87a7a");
    R(-7, -19, 14, 15, "#e8a040"); R(-5, -18, 10, 12, "#f6f6f2");
    if (G && G.flags.h_bakery) { R(-4, -15, 2, 2, "#efe6cf"); R(2, -12, 2, 2, "#efe6cf"); }
    R(-8, -18, 1, 7, "#d8a080"); R(7, -18, 1, 7, "#d8a080");
    R(-4, -4, 3, 4, "#3a2a22"); R(1, -4, 3, 4, "#3a2a22");
  },
  h_teacher(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-6, -31, 12, 6, "#2a1a14"); R(-6, -26, 2, 8, "#2a1a14"); R(4, -26, 2, 8, "#2a1a14");
    R(-4, -27, 8, 8, "#c89070"); R(-4, -24, 3, 2, "#3a3a44"); R(1, -24, 3, 2, "#3a3a44"); R(-1, -24, 2, 1, "#3a3a44");
    R(-3, -23, 1, 1, "#1a1a22"); R(2, -23, 1, 1, "#1a1a22"); R(-1, -21, 3, 1, "#8a4a3a");
    R(-6, -19, 12, 15, "#4a6a3a"); R(-2, -19, 4, 10, "#e8e0cc");
    R(-7, -18, 1, 7, "#c89070"); R(6, -18, 1, 7, "#c89070"); R(5, -14, 3, 3, "#f2ecd8");
    R(-4, -4, 3, 4, "#2a2a30"); R(1, -4, 3, 4, "#2a2a30");
  },
  h_librarian(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-4, -34, 8, 9, "#d8a888"); R(-5, -31, 1, 4, "#9a9aa4"); R(4, -31, 1, 4, "#9a9aa4");
    R(-4, -30, 3, 2, "#d8b25a"); R(1, -30, 3, 2, "#d8b25a"); R(-1, -30, 2, 1, "#d8b25a");
    R(-3, -29, 1, 1, "#1a1a22"); R(2, -29, 1, 1, "#1a1a22"); R(-1, -27, 3, 1, "#7a4a3a");
    R(-2, -25, 4, 2, "#c03a3a");
    R(-5, -23, 10, 19, "#5a3a5a"); R(-2, -23, 4, 10, "#e8e0cc"); R(-3, -16, 6, 4, "#7a5a3a");
    R(-6, -22, 1, 9, "#d8a888"); R(5, -22, 1, 9, "#d8a888");
    R(-4, -4, 3, 4, "#2a2a30"); R(1, -4, 3, 4, "#2a2a30");
  },
  h_pip(cx, by, t, u = 2) {
    const R = P(cx, by + (Math.sin(t * 7) > .6 ? -u : 0), u);
    R(-5, -24, 10, 3, "#3a6ac0"); R(-7, -23, 3, 2, "#3a6ac0");
    R(-4, -21, 8, 7, "#e8b890"); R(-3, -19, 2, 2, "#1a1a22"); R(2, -19, 2, 2, "#1a1a22"); R(-1, -16, 3, 1, "#8a3a2a");
    R(-5, -14, 10, 9, "#d84a3a"); R(-1, -12, 2, 2, "#ffd84a");
    R(-6, -13, 1, 5, "#e8b890"); R(5, -13, 1, 5, "#e8b890");
    R(-4, -5, 3, 5, "#3a3a6a"); R(1, -5, 3, 5, "#3a3a6a");
  },
  h_oates(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-6, -31, 12, 3, "#5a5a4a"); R(-5, -33, 10, 2, "#6a6a5a");
    R(-4, -28, 8, 8, "#d8a888"); R(-3, -26, 2, 1, "#1a1a22"); R(2, -26, 2, 1, "#1a1a22");
    R(-4, -23, 8, 5, "#e8e8f0"); R(-2, -19, 4, 2, "#e8e8f0");
    R(-6, -18, 12, 14, "#6a6a72"); R(-1, -18, 2, 12, "#4a4a52");
    R(-7, -17, 1, 8, "#d8a888"); R(6, -17, 1, 8, "#d8a888");
    R(-4, -4, 3, 4, "#2a2a30"); R(1, -4, 3, 4, "#2a2a30");
    const hop = Math.abs(Math.sin(t * 5)) * 1.5;
    R(8, -5 - hop, 5, 4, "#8a8a9a"); R(12, -6 - hop, 2, 2, "#8a8a9a"); R(13, -5 - hop, 1, 1, "#d8a040"); R(9, -1 - hop, 1, 1, "#d8a040");
  },
  h_desk(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-9, -16, 18, 4, "#9a7048"); R(-9, -16, 18, 1, "#b08a5a"); R(-8, -12, 2, 12, "#6a4a30"); R(6, -12, 2, 12, "#6a4a30"); R(-8, -12, 16, 3, "#7a5a3a");
    R(-6, -19, 6, 3, "#efe6cf"); R(-5, -18, 4, .6, "#8a7f68");
    if (!(G && G.flags.h_photo)) { R(2, -18, 5, 2, "#d8c8a8"); R(2, -18, 2, 2, "#e8a040"); }
  },
  h_bed(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -30, 16, 30, "#5a3a24"); R(-7, -29, 14, 6, "#f6f6f2"); R(-7, -23, 14, 21, "#5a7aa0"); R(-7, -23, 14, 2, "#7a9ac0");
    R(-4, -18, 1, 1, "#ffd84a"); R(2, -14, 1, 1, "#ffd84a"); R(-2, -9, 1, 1, "#ffd84a"); R(4, -7, 1, 1, "#ffd84a");
  },
  h_mirror(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-5, -30, 10, 26, "#8a6a4a"); R(-4, -29, 8, 24, "#a8c8d8"); R(-3, -27, 2, 10, "#d8f0ff"); R(-5, -4, 10, 4, "#6a4a30");
  },
  h_toybox(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -12, 16, 12, "#a05a3a"); R(-8, -12, 16, 3, "#c87a4a"); R(-1, -9, 2, 3, "#d8b25a");
    R(3, -16, 3, 4, "#3a3a44"); R(4, -19, 1, 3, "#3a3a44"); R(-6, -15, 3, 3, "#4e8a3e");
  },
  h_window(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-9, -31, 18, 14, "#f6f6f2"); R(-8, -30, 16, 12, "#8ac4ec"); R(-1, -30, 2, 12, "#f6f6f2"); R(-8, -25, 16, 1, "#f6f6f2");
    R(-7, -29, 3, 3, "#ffe88a"); R(-10, -17, 20, 2, "#d9d0bb");
    R(-3, -6, 6, 6, "#a05a3a"); R(-2, -11, 1, 5, "#4e8a3e"); R(0, -12, 1, 6, "#4e8a3e"); R(1, -13, 2, 2, "#e86a9a");
  },
  h_radio(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-6, -10, 12, 2, "#9a7048"); R(-5, -8, 1, 8, "#6a4a30"); R(4, -8, 1, 8, "#6a4a30");
    R(-5, -17, 10, 7, "#c86a3a"); R(-4, -16, 4, 5, "#3a2a1a"); R(2, -16, 2, 2, "#d8b25a"); R(2, -13, 2, 1, "#f2ecd8");
    R(3, -22, 1, 5, "#9a9aa4");
    if (E3.vantaAlive() && (t % 1.4) < .7) R(2, -23, 3, 1, "#57dbff");
  },
  h_fridge(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-7, -32, 14, 32, "#e8eef2"); R(-7, -20, 14, 1, "#9aa8b0"); R(4, -29, 1, 6, "#9aa8b0"); R(4, -17, 1, 8, "#9aa8b0");
    R(-5, -29, 5, 4, E3.stet() ? "#9a98a8" : "#e8a040"); R(-5, -16, 6, 5, "#f6f6f2"); R(-4, -14, 2, 2, "#8a6a4a"); R(-1, -15, 1, 3, "#3a6ac0");
  },
  h_mailbox(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-1, -10, 2, 10, "#5a3a24"); R(-5, -18, 10, 8, "#3a5a7a"); R(-5, -18, 10, 2, "#4a6a8a");
    R(5, -18, 1, 5, "#c03a3a"); R(5, -18, 3, 2, "#c03a3a");
    txt("9", cx, by - 16 * u, "#f2ecd8", 5 * u, "center");
  },
  h_chart(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -31, 16, 14, "#1a2a4a");
    [[-6, -24], [-4, -28], [0, -25], [5, -28], [1, -20]].forEach(([x, y]) => R(x, y, 1.4, 1.4, "#e8eef2"));
    R(-5, -21, 1, 1, "#d8b25a"); R(-2, -10, 4, 4, "#efe6cf");
  },
  h_classphoto(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-9, -30, 18, 12, "#8a6a4a"); R(-8, -29, 16, 10, "#c8d8e0");
    for (let i = 0; i < 6; i++) if (i !== 3) R(-7 + i * 2.6, -25, 2, 3, ["#e8b890", "#c89070", "#8a5a3a"][i % 3]);
    for (let i = 0; i < 6; i++) R(-7 + i * 2.6, -22, 2, 3, "#5a7aa0");
  },
  h_lostfound(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -12, 16, 12, "#a08a5a"); R(-8, -12, 16, 2, "#c0aa7a");
    if (!(G && G.flags.h_coat)) R(2, -12, 1, 1, "#efe6cf");
    R(-6, -17, 7, 9, "#3a8a6a"); R(-4, -15, 2, 2, "#ffd84a"); R(2, -14, 4, 3, "#c03a3a");
  },
  h_jdesk(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -14, 16, 10, "#9a7048"); R(-8, -14, 16, 2, "#b08a5a"); R(-8, -4, 16, 4, "#6a4a30");
    R(-1, -11, 2, 2, "#5a3a24"); R(2, -11, 2, 2, "#e8d040");
  },
  h_table(cx, by, t, u = 2) {
    const R = P(cx, by, u), open = G && G.flags.h_bakery;
    R(-7, -12, 14, 3, "#9a7048"); R(-1, -9, 2, 9, "#6a4a30"); R(-4, -1, 8, 1, "#6a4a30");
    if (open) { R(-11, -8, 3, 8, "#7a5a3a"); R(8, -8, 3, 8, "#7a5a3a"); R(-1, -14, 2, 2, "#e8a040"); }
    else { R(-5, -20, 3, 8, "#7a5a3a"); R(2, -20, 3, 8, "#7a5a3a"); R(-6, -21, 12, 1, "#7a5a3a"); }
  },
  h_case(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -16, 16, 16, "#6a4a30"); R(-7, -15, 14, 8, "rgba(200,230,255,.45)"); R(-7, -9, 14, 1, "#f6f6f2");
    if (G && G.flags.h_bakery) { R(-6, -12, 3, 3, "#d8a040"); R(-1, -12, 3, 3, "#c87a3a"); R(4, -12, 2, 3, "#e8c070"); }
  },
  h_telescope(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-5, -2, 1, 2, "#5a5a4a"); R(4, -2, 1, 2, "#5a5a4a"); R(-4, -10, 1, 9, "#6a6a5a"); R(3, -10, 1, 9, "#6a6a5a"); R(-1, -11, 2, 10, "#6a6a5a");
    ctx.save(); ctx.translate(cx, by - 13 * u); ctx.rotate(-.6);
    ctx.fillStyle = "#6a9a7a"; ctx.fillRect(-7 * u, -1.5 * u, 15 * u, 3 * u); ctx.fillStyle = "#d8b25a"; ctx.fillRect(7 * u, -2 * u, 2 * u, 4 * u);
    ctx.restore();
  },
  h_libdesk(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-9, -14, 18, 14, "#7a5a3a"); R(-9, -14, 18, 2, "#9a7048"); R(-6, -17, 3, 3, "#d8b25a"); R(2, -17, 4, 2, "#3a3a44"); R(3, -19, 2, 2, "#5a3a24");
  },
  h_book(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -8, 16, 6, "#efe6cf"); R(-1, -8, 2, 6, "#b9ae95");
    R(-7, -7, 5, .6, "#8a7f68"); R(-7, -5, 4, .6, "#8a7f68"); R(2, -7, 5, .6, "#8a7f68"); R(2, -5, 4, .6, "#3a3a6a");
    R(6, -4, 2, .6, "#3a3a6a");
  },
  h_cart(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -14, 16, 2, "#6a6a72"); R(-8, -7, 16, 2, "#6a6a72"); R(-8, -14, 1, 12, "#4a4a52"); R(7, -14, 1, 12, "#4a4a52");
    R(-7, -2, 2, 2, "#2a2a30"); R(5, -2, 2, 2, "#2a2a30");
    if (E3.restoredNames().length) { R(-6, -19, 2, 5, "#7a3a3a"); R(-3, -18, 2, 4, "#3a5a7a"); R(0, -19, 3, 5, "#5a7a3a"); }
  },
  h_tshredder(cx, by, t, u = 2) {
    MON_DRAW.shredder(cx, by, t, { sp: 100 }, u * .3);
    const R = P(cx, by, u); R(-6, -11, 12, 1, "#e8e0b0"); R(-3, -13, 1, 6, "#e8e0b0");
  },
  h_crack(cx, by, t, u = 2) {
    const pulse = .5 + .3 * Math.sin(t * 2.5);
    ctx.save();
    ctx.strokeStyle = `rgba(190,108,255,${pulse.toFixed(2)})`; ctx.lineWidth = 10;
    const pts = [[6, -70], [-2, -48], [8, -30], [-4, -8], [6, 14], [0, 40], [8, 70]];
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(cx + x, by + y) : ctx.moveTo(cx + x, by + y)); ctx.stroke();
    ctx.strokeStyle = "#fffbe8"; ctx.lineWidth = 3;
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(cx + x, by + y) : ctx.moveTo(cx + x, by + y)); ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const k = (t * .4 + i / 4) % 1;
      ctx.fillStyle = `rgba(58,58,106,${(1 - k).toFixed(2)})`; ctx.fillRect(cx - 10 - k * 40, by - 40 + i * 20 - k * 10, 10, 2);
    }
    ctx.restore();
  },
  h_millwreck(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -4, 16, 4, "#5a524a");
    for (let i = 0; i < 7; i++) { const r = hash(i, 31); R(-10 + r * 18, -8 + ((r * 7) % 1) * 5, 5, 2, i % 2 ? "#f6f0dc" : "#9a9488"); }
    R(-1, -14, 2, 10, "#6a5a4a");
  }
});
