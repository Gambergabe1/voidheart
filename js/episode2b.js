"use strict";
/* ============================================================
   VOIDHEART — Episode 2 expansion:
   the Drain, Carbon Town, the Outline Gardens, the Shredder,
   the Reception and the Files
   ============================================================ */
POOLS.garden = ["outline", "papercut", "watermark"];
POOLS.office = ["ghostwriter", "duplicat", "crumbs"];
Object.assign(AREAS, {
  carbon: { name: "CARBON TOWN", music: "carbon", sub: "population: one, copied forty times" },
  garden: { name: "THE OUTLINE GARDENS", music: "garden", sub: "where erased things keep their shape" }
});
Object.assign(ITEMS, {
  letter_s: { name: "Lost Letter S", type: "key", desc: "A loose capital S. It's been looking for its word." },
  letter_e: { name: "Lost Letter E", type: "key", desc: "A lowercase e that won't stop leaning on things." },
  letter_t: { name: "Lost Letter T", type: "key", desc: "A T. There was another one just like it, somewhere." },
  sealofoffice: { name: "Seal of Office", type: "armor", def: 10, desc: "The mayor's seal. It says STET: let it stand. DEF +10." },
  correctiontape: { name: "Correction Tape", type: "weapon", atk: 10, price: 55, desc: "Covers mistakes in one swipe. ATK +10." },
  paperclipmail: { name: "Paperclip Mail", type: "armor", def: 5, price: 50, desc: "Chain mail made of 4,000 paperclips. DEF +5." }
});
ITEMS.carboncopy.price = 16; ITEMS.rubbercement.price = 28;
Object.assign(SPEAKERS, {
  lintcopy: { name: "LINT (COPY)", voice: 400 },
  copy: { name: "COPY", voice: 300 },
  deputy: { name: "DEPUTY COPY", voice: 280 },
  gardener: { name: "THE GARDENER", voice: 200 },
  bell: { name: "RECEPTION", voice: 900 },
  vol13: { name: "VOLUME THIRTEEN", voice: 170 },
  shredder: { name: "THE SHREDDER", voice: 130 }
});
Object.assign(SONGS, {
  carbon: { bpm: 96, tracks: [
    { w: "triangle", v: .05, n: "C5 . C5 . E5 . G5 . C5 . C5 . E5 . A5 . G5 . G5 . E5 . C5 . D5 . E5 . C5 - - -" },
    { w: "sine", v: .06, n: "C3 - G2 - C3 - G2 - F2 - C3 - F2 - C3 - G2 - D3 - G2 - D3 - G2 - B2 - C3 - - -" },
    { w: "square", v: .008, n: "C6 . . . C6 . . . C6 . . . C6 . . ." }] },
  garden: { bpm: 80, tracks: [
    { w: "triangle", v: .05, n: "E5 - - - D5 - B4 - - - G4 - A4 - - - B4 - D5 - - - E5 - G5 - - - - - - -" },
    { w: "sine", v: .065, n: "E2 - - - - - - - C2 - - - - - - - G2 - - - - - - - D2 - - - - - - -" }] },
  shredder: { bpm: 156, tracks: [
    { w: "square", v: .024, n: "E5 E5 D5 E5 . E5 G5 . E5 E5 D5 E5 . B4 C5 . E5 E5 D5 E5 . E5 A5 . G5 . F#5 . E5 . . ." },
    { w: "triangle", v: .075, n: "E2 E3 E2 E3 E2 E3 E2 E3 C2 C3 C2 C3 D2 D3 D2 D3 E2 E3 E2 E3 E2 E3 E2 E3 C2 C3 D2 D3 B1 B2 B1 B2" }] }
});

/* ---------- new monsters ---------- */
Object.assign(MONSTERS, {
  outline: {
    name: "Outline", area: "garden", hp: 95, atk: 7, def: 2, exp: 30, gold: 24, voice: 360,
    check: "OUTLINE - ATK 7 DEF 2\n* A flower drawn in pencil and never colored in.\n* It is mostly edge.",
    intro: "* An Outline sways out of the white grass.",
    flavor: ["* The Outline's petals are only lines.", "* Smells like a pencil sharpener and spring.", "* The Outline keeps tracing itself, nervously."],
    spareFlavor: "* The Outline is full of color now.",
    talk: ["...what color was i?", "i'm just the idea of a flower.", "don't step on my lines."],
    spareTalk: "PINK! i was PINK!",
    acts: {
      "Color In": e => { e.sp += 40; e.reply = "...warm. that's warm."; return "* You color in one of the Outline's petals.\n* It shivers. The color stays."; },
      "Admire": e => { e.sp += 30; e.reply = "you think i'm a GOOD drawing?"; return "* You tell the Outline it's a lovely drawing.\n* Its lines stand up a little straighter."; },
      "Trace": e => { e.sp += 30; e.reply = "...that's how i was drawn."; return "* You trace the Outline's edge with your finger.\n* It remembers being drawn."; }
    },
    pats: [{ id: "flutter", col: "#e86a9a" }, { id: "ring", col: "#f2ecd8" }]
  },
  papercut: {
    name: "Paper Cut", area: "garden", hp: 85, atk: 8, def: 1, exp: 32, gold: 22, voice: 620,
    check: "PAPER CUT - ATK 8 DEF 1\n* A sliver of paper, sharp and very sorry about it.\n* It never meant to hurt anyone. It's paper.",
    intro: "* Paper Cut slices into view! (Sorry!)",
    flavor: ["* Paper Cut is apologizing to the air.", "* Paper Cut's edges glint.", "* You feel a small sting just looking at it."],
    spareFlavor: "* Paper Cut's edges have gone soft.",
    talk: ["sorry! SORRY!", "i don't want to be sharp.", "everyone flinches when i come near."],
    spareTalk: "...you're not flinching.",
    acts: {
      "Bandage": e => { e.sp += 40; e.reply = "i did that?? sorry..."; return "* You put a bandage on your finger.\n* Paper Cut is mortified, but grateful you're okay."; },
      "Fold Edge": e => { e.sp += 40; e.reply = "...round. i feel ROUND."; return "* You fold Paper Cut's sharpest edge over.\n* Now it can't cut anything."; },
      "Forgive": e => { e.sp += 30; e.reply = "...really?"; return "* You tell Paper Cut it's okay.\n* It has never been forgiven before."; }
    },
    pats: [{ id: "aimed", col: "#f6f6f2", s: 1.1 }, { id: "lasers", col: "#f6f6f2" }]
  },
  watermark: {
    name: "Watermark", area: "garden", hp: 70, atk: 7, def: 4, exp: 34, gold: 26, voice: 240,
    check: "WATERMARK - ATK 7 DEF 4\n* Can only be seen when held up to the light.\n* Has been in every important document. Nobody noticed.",
    intro: "* ...something is here.\n* You can't quite see it.",
    flavor: ["* You think Watermark is there. Probably.", "* A faint crest hangs in the air.", "* Watermark is being very official, very quietly."],
    spareFlavor: "* Watermark is clearly visible. It's thrilled.",
    talk: ["...", "(official silence)", "...you can't see me. nobody can."],
    spareTalk: "you SAW me. that makes it real.",
    acts: {
      "Hold to Light": e => { if (e.seen) return "* Watermark is already lit up."; e.seen = 1; e.sp += 50; e.reply = "AH. I'M VISIBLE."; return "* You hold Watermark up to the light.\n* A beautiful crest appears: a little crown over a leaf."; },
      "Squint": e => { e.sp += 15; e.reply = "...?"; return "* You squint really hard.\n* You see... a smudge? A crown?"; },
      "Trace Crest": e => { if (!e.seen) return "* You'd have to see it first."; e.sp += 50; e.reply = "nobody's ever traced me."; return "* You trace Watermark's crest in the air.\n* It glows a little brighter, proud."; }
    },
    pats: [{ id: "ringwave", col: "#cfd8e8" }, { id: "blot", col: "#cfd8e8" }]
  },
  ghostwriter: {
    name: "Ghostwriter", area: "office", hp: 100, atk: 8, def: 2, exp: 36, gold: 30, voice: 210,
    check: "GHOSTWRITER - ATK 8 DEF 2\n* Writes words for everyone else.\n* Has never once had its own name on anything.",
    intro: "* Ghostwriter appears.\n* (Ghostwriter wrote that line.)",
    flavor: ["* You were about to say something. Ghostwriter already wrote it.", "* Ghostwriter's pen scratches constantly.", "* Ghostwriter is editing your thoughts. Politely."],
    spareFlavor: "* Ghostwriter is signing its name. Over and over.",
    talk: ["Let me write that for you.", "You'd say it better my way.", "No one reads the byline anyway."],
    spareTalk: "...by GHOSTWRITER. i like how that looks.",
    acts: {
      "Own Line": e => { e.sp += 40; e.reply = "...that's not what i'd have written. it's better."; return "* You say something Ghostwriter didn't write.\n* It drops its pen in surprise."; },
      "Credit It": e => { if (e.credited) return "* You already gave it credit. It's still glowing."; e.credited = 1; e.sp += 45; e.reply = "...a BYLINE?"; return "* You say: 'Written by Ghostwriter.'\n* Nobody has ever said that out loud."; },
      "Edit Draft": e => { e.sp += 20; e.reply = "hmm. fair note."; return "* You suggest an edit to Ghostwriter's draft.\n* It considers it seriously."; }
    },
    pats: [{ id: "letters", word: "YOUSAIDTHIS", col: "#f2ecd8" }, { id: "scan", col: "#f2ecd8" }]
  },
  duplicat: {
    name: "Duplicat", area: "office", hp: 90, atk: 7, def: 2, exp: 34, gold: 28, voice: 560,
    check: "DUPLICAT - ATK 7 DEF 2\n* A cat, photocopied so many times it's mostly toner.\n* Somewhere in the stack is the original.",
    intro: "* Duplicat (and Duplicat, and Duplicat) pounces!",
    flavor: ["* Duplicat meows in three slightly different keys.", "* Duplicat leaves a trail of toner.", "* Which one is the real one?"],
    spareFlavor: "* Duplicat is purring. All of it.",
    talk: ["mew. mew. mew.", "MEW (copy)", "which one of us did you pet?"],
    spareTalk: "...purrrrrrrrr (x3)",
    acts: {
      "Pet": e => { e.sp += 35; e.reply = "purr? (purr?) (purr?)"; return "* You pet Duplicat.\n* All the copies purr a half-second apart."; },
      "Find Original": e => { if (e.found) return "* You already found the original. It's smug."; e.found = 1; e.sp += 40; e.reply = "...ME. i'm the one."; return "* You look closely and find the first Duplicat.\n* It's slightly darker and very pleased."; },
      "Call 'Kitty'": e => { e.sp += 25; e.reply = "MEW!!!"; return "* You call 'kitty kitty kitty.'\n* Every copy comes running."; }
    },
    pats: [{ id: "side", col: "#5a5a60" }, { id: "aimed", col: "#5a5a60" }]
  },
  crumbs: {
    name: "Crumbs", area: "office", hp: 60, atk: 6, def: 0, exp: 28, gold: 20, voice: 760,
    check: "CRUMBS - ATK 6 DEF 0\n* All that's left of an eraser that erased too much.\n* They're tired.",
    intro: "* A pile of Crumbs rolls toward you!",
    flavor: ["* The Crumbs are rolling around aimlessly.", "* Smells like a pink eraser.", "* The Crumbs keep trying to erase each other."],
    spareFlavor: "* The Crumbs have settled down to rest.",
    talk: ["rub rub rub.", "we erased SO much.", "...can we stop now?"],
    spareTalk: "...finally. a break.",
    acts: {
      "Sweep Up": e => { e.sp += 35; e.reply = "...tidy. thank you."; return "* You gently sweep the Crumbs into a neat pile.\n* They seem relieved to be together."; },
      "Let Them Rest": e => { e.sp += 40; e.reply = "...zzz."; return "* You tell the Crumbs they don't have to erase anything.\n* A few of them fall asleep immediately."; },
      "Brush Off": e => { e.sp += 20; e.reply = "wheee"; return "* You brush the Crumbs off your sleeve.\n* They tumble happily."; }
    },
    pats: [{ id: "rain", col: "#e8a0b0", d: 1.4, s: 1.1 }, { id: "spark", col: "#e8a0b0", start: "bottom" }]
  },
  shredder: {
    name: "The Shredder", area: "garden", hp: 260, atk: 7, def: 3, exp: 80, gold: 70, voice: 130, boss: true, bar: true,
    title: "THE SHREDDER // KEEPER OF SCRAPS", music: "shredder", noFlee: true,
    check: "THE SHREDDER - ATK 7 DEF 3\n* Eats everything that comes near REDACT's office.\n* Its teeth are full of scraps.",
    intro: "* The Shredder whirs to life.",
    flavor: ["* The Shredder chews loudly.", "* Strips of paper hang from its mouth like a beard.", "* WHRRRRRRRRRRR."],
    spareFlavor: "* The Shredder has stopped chewing.",
    talk: ["MUNCH. SAFE. MUNCH. SAFE.", "BLANK IS FOREVER. SCRAPS CAN HIDE.", "I EAT THEM BEFORE HE ERASES THEM.", "...IS THAT WRONG?"],
    spareTalk: "...I'LL SPIT THEM OUT. CAREFULLY.",
    acts: {
      "Feed Scrap": e => { e.fed = (e.fed || 0) + 1; if (e.fed > 2) return "* The Shredder is full. Very full."; e.sp += 20; e.reply = "MUNCH. ...THANK YOU."; return "* You feed the Shredder a blank page.\n* It chews it thoughtfully. Not every page needs to be saved."; },
      "Tape Together": e => { if (e.taped) return "* You've already shown it. It's still staring at the tape."; e.taped = 1; e.sp += 35; e.reply = "...THEY GO BACK TOGETHER?"; return "* You tape two of its scraps back into one page.\n* The Shredder has never seen anything un-shredded."; },
      "Unjam": e => { if (e.unjam) return "* Its gears are running smoothly now."; e.unjam = 1; e.sp += 25; e.reply = "AHHH. CLEAR."; return "* You pull a jammed staple out of its teeth.\n* The Shredder sighs a long, papery sigh."; }
    },
    pats: [{ id: "shred", col: "#f2ecd8" }, { id: "stomp", col: "#b8c0cc" }, { id: "side", col: "#f2ecd8" }],
    deathLines: () => ["WHRRR...", "...who will hide them now...", "...munch..."],
    spareLines: () => ["...I WAS SAVING THEM.", "SCRAPS ARE BETTER THAN NOTHING.", "...BUT TAPE IS BETTER THAN SCRAPS."]
  }
});

/* REDACT learns about the new parts of the journey */
{
  const R = MONSTERS.redact, baseNames = R.actNames;
  R.actNames = function () {
    const a = baseNames.call(this);
    if (G.flags.shredder === "spare") a.splice(2, 0, "Show the Scraps");
    if (G.flags.stetDone) a.splice(2, 0, "Say STET");
    return a;
  };
  R.acts["Show the Scraps"] = e => {
    if (e.scraps) return "* REDACT is still thinking about the scraps.";
    e.scraps = 1; e.sp += 30; e.reply = "...HE KEPT SCRAPS? FROM ME?";
    return "* You tell REDACT the Shredder has been saving scraps.\n* Torn things can be taped back.\n* Blank things can't.";
  };
  R.acts["Say STET"] = e => {
    if (e.stet) return "* You already said it. REDACT's arm is still locked.";
    e.stet = 1; e.sp += 40; e.reply = "THAT WORD IS NOT PERMITTED IN THIS OFFICE.";
    return "* 'STET.'\n* You say it the way the copies taught you. Let it stand.\n* REDACT's stamp arm locks up.";
  };
}

/* ---------- new rooms ---------- */
Object.assign(ROOMS, {
  e2_drain: {
    area: "under", enc: true, map: [
      "##############################",
      "##############################",
      "##~~~~~~~~~~~~~~~~~~~~~~~~~~##",
      "##..........~~~~............##",
      "##..,.......~~~~.......,....##",
      "..............................",
      "..............................",
      "......,.......................",
      "##.........~~~~~~...........##",
      "##..,......~~~~~~......,....##",
      "##~~~~~~~~~~~~~~~~~~~~~~~~~~##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_well", tx: 18, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e2_under1", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 6, ty: 3, text: () => ["* THE DRAIN.", "* Everything that washes out of the Archive passes through here.", "* Some of it gets stuck."] },
      { k: "item", tx: 25, ty: 9, item: "letter_s", flag: "it_ls" }]
  },
  e2_carbongate: {
    area: "carbon", map: [
      "####################",
      "####################",
      "##................##",
      "##..BB........BB..##",
      "##..BB........BB..##",
      "....................",
      "....................",
      "....................",
      "##..BB........BB..##",
      "##..BB........BB..##",
      "##................##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_under2", tx: 22, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "e2_town", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 9, ty: 2, text: () => ["* CARBON TOWN.", "* Population: 1.", "* (Copied 40 times.)"] },
      { k: "save", tx: 9, ty: 10 }]
  },
  e2_town: {
    area: "carbon", map: [
      "##############################",
      "######....####################",
      "##....................RRRR..##",
      "##..##..........##....RRRR..##",
      "##..##..........##..........##",
      "..............................",
      "..............................",
      "..............................",
      "##....##......##.......##...##",
      "##....##......##.......##...##",
      "##..........................##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_carbongate", tx: 18, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e2_garden1", tx: 1, ty: 6, dir: "right" },
      { x: 6, y: 1, w: 4, h: 1, to: "e2_house", tx: 9, ty: 10, dir: "up" }],
    ents: [
      { k: "npc", id: "lintcopy", tx: 24, ty: 3, talk: () => [{ who: "lintcopy", t: "Welcome to Lint's Lost & Found (Copy)! I'm a carbon copy of a shopkeeper upstairs. Slightly blurrier. Same prices.", after: () => Shop.open(["carboncopy", "rubbercement", "patchkit", "correctiontape", "paperclipmail"], "lintcopy", "Everything here is a copy of something that got lost upstairs. Copies of lost things. Very collectible.") }] },
      { k: "npc", id: "copy", tx: 10, ty: 4, talk: () => [L("copy", "Hello! I'm a copy of the mayor. So is everyone. The original got erased."), L("copy", "We remember everything about the mayor except the name. A town can't run on a blank, you know.")] },
      { k: "npc", id: "copy", tx: 19, ty: 7, talk: () => deputyTalk() },
      { k: "npc", id: "copy", tx: 8, ty: 10, talk: () => [L("copy", pick(["I'm a copy of a copy. I've never met the original. I hear it was a nice name.", "If you see a stray letter out there, bring it to the Deputy. Letters get lonely.", "REDACT erased the mayor first. Mayors make rules. REDACT doesn't like other people's rules."]))] },
      { k: "sign", tx: 12, ty: 2, text: () => G.flags.stetDone ? ["* TOWN NOTICE: 'OUR MAYOR IS STET. LET IT STAND.'", "* Someone has drawn a lot of tiny hearts around it."] : ["* TOWN NOTICE: 'OUR MAYOR IS ________.'", "* The name has been blacked out."] }]
  },
  e2_house: {
    area: "carbon", map: [
      "####################",
      "####BBBBBBBBBBBB####",
      "##................##",
      "##..RRRRRRRRRR....##",
      "##..RRRRRRRRRR....##",
      "##..RRRRRRRRRR....##",
      "##................##",
      "##................##",
      "##................##",
      "##................##",
      "##................##",
      "########....########",
      "########....########"],
    exits: [{ x: 8, y: 12, w: 4, h: 1, to: "e2_town", tx: 7, ty: 2, dir: "down" }],
    ents: [
      { k: "npc", id: "vol13", tx: 9, ty: 3, talk: () => vol13Talk() },
      { k: "item", tx: 15, ty: 9, item: "patchkit", flag: "it_housekit" },
      { k: "sign", tx: 4, ty: 7, text: () => ["* A shelf of carbon-copied books.", "* Every title is slightly blurrier than the last."] }]
  },
  e2_garden1: {
    area: "garden", enc: true, map: [
      "##############################",
      "##############################",
      "##**..****......***....****.##",
      "##*....**...~~....*......**.##",
      "##.........~~~~.............##",
      ".......*......................",
      "..............................",
      "....**............**..........",
      "##..........~~~~.......*.....##",
      "##**....***..~~....****...**##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_town", tx: 28, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e2_garden2", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "npc", id: "gardener", tx: 6, ty: 4, talk: () => gardenerTalk() },
      { k: "item", tx: 26, ty: 8, item: "letter_e", flag: "it_le" }]
  },
  e2_garden2: {
    area: "garden",
    puzzle: { flag: "puzzle2", key: "runes2", order: ["9,2", "15,4", "15,8", "8,10", "4,8", "4,4"],
      wrong: "* The outline smudges. Start again from the top.",
      done: ["* The big flower's outline glows, all the way around.", "* The gate in the hedge swings open."] },
    map: [
      "####################",
      "####################",
      "##*......o.......*##",
      "##................##",
      "##..o..........o..##",
      "...................D",
      "...................D",
      "...................D",
      "##..o..........o..##",
      "##................##",
      "##*.....o........*##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_garden1", tx: 28, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "e2_garden3", tx: 1, ty: 6, dir: "right" }],
    ents: [{ k: "sign", tx: 12, ty: 3, text: () => G.flags.puzzle2 ? ["* The flower is complete."] : ["* 'A drawing is finished the way it was started.'", "* 'Begin at the top petal. Go round like a clock.'"] }]
  },
  e2_garden3: {
    area: "garden", enc: true, map: [
      "####################",
      "####################",
      "##**....~~....**..##",
      "##*.....~~.....*..##",
      "##................##",
      "....................",
      "....................",
      "....................",
      "##..**........**..##",
      "##.......~~.......##",
      "##**.....~~.....**##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_garden2", tx: 18, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "e2_shredder", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 4, ty: 4 },
      { k: "item", tx: 16, ty: 9, item: "letter_t", flag: "it_lt" }]
  },
  e2_shredder: {
    area: "garden", noMusic: true, map: [
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
      { x: 0, y: 5, w: 1, h: 3, to: "e2_garden3", tx: 18, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "e2_lobby", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "npc", id: "shredder", tx: 14, ty: 6, if: () => !G.flags.shredder, talk: () => [] },
      { k: "npc", id: "shredder", tx: 15, ty: 3, if: () => G.flags.shredder === "spare", talk: () => [L("shredder", "I KEEP THE SCRAPS UNDER MY TEETH NOW. GENTLY."), L("shredder", "SOMEONE WILL TAPE THEM BACK. SOMEDAY.")] },
      { k: "deco", id: "scraps", tx: 14, ty: 6, if: () => G.flags.shredder === "kill", talk: () => ["* A drift of paper scraps.", "* Nobody is chewing them anymore."] }],
    triggers: [{ x: 8, y: 2, w: 1, h: 9, if: () => !G.flags.shredder, run: () => shredderEvent() }]
  },
  e2_lobby: {
    area: "office", map: [
      "####################",
      "##BBBB##BBBB##BBBB##",
      "##................##",
      "##................##",
      "##..L..........L..##",
      "....................",
      "....................",
      "....................",
      "##................##",
      "##.......,........##",
      "##................##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e2_shredder", tx: 18, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "e2_files", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 3, ty: 3 },
      { k: "npc", id: "bell", tx: 10, ty: 3, talk: () => [L("bell", "DING. WELCOME TO THE REDACTION OFFICE."), L("bell", "TAKE A NUMBER. YOUR NUMBER IS 0."), L("bell", "NOW SERVING: NUMBER 0."), L("bell", "...THAT IS YOU. GO ON THROUGH. REDACT IS VERY BUSY. REDACT IS ALWAYS BUSY.")] }]
  },
  e2_files: {
    area: "office", enc: true, map: [
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
      { x: 0, y: 5, w: 1, h: 3, to: "e2_lobby", tx: 18, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e2_hall", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "item", tx: 13, ty: 9, item: "staticpop", flag: "it_filepop" },
      { k: "sign", tx: 3, ty: 2, text: () => ["* A filing cabinet labeled CORRECTIONS: A TO Z.", "* Every drawer is labeled 'COMPLETE.' Every drawer is empty."] }]
  }
});
for (const id of ["e2_drain", "e2_carbongate", "e2_town", "e2_house", "e2_garden1", "e2_garden2", "e2_garden3", "e2_shredder", "e2_lobby", "e2_files"]) {
  const r = ROOMS[id], w = Math.max(...r.map.map(s => s.length));
  r.map = r.map.map(s => s.padEnd(w, "#"));
}
/* re-route the old path through the new regions */
ROOMS.e2_well.exits[0] = { x: 19, y: 5, w: 1, h: 3, to: "e2_drain", tx: 1, ty: 6, dir: "right" };
ROOMS.e2_under1.exits[0] = { x: 0, y: 5, w: 1, h: 3, to: "e2_drain", tx: 28, ty: 6, dir: "left" };
ROOMS.e2_under2.exits[1] = { x: 23, y: 5, w: 1, h: 3, to: "e2_carbongate", tx: 1, ty: 6, dir: "right" };
ROOMS.e2_hall.exits[0] = { x: 0, y: 5, w: 1, h: 3, to: "e2_files", tx: 28, ty: 6, dir: "left" };

/* ---------- new dialogue ---------- */
function deputyTalk() {
  const have = ["letter_s", "letter_e", "letter_t"].filter(k => G.inv.includes(k));
  if (G.flags.stetDone) return [L("deputy", "Mayor Stet's whole town thanks you. Well. Mayor Stet's whole town is Mayor Stet. But still.")];
  if (have.length === 3) {
    G.inv = G.inv.filter(k => !k.startsWith("letter_"));
    G.flags.stetDone = true; G.gold += 100;
    return [
      L("deputy", "Those are... our letters! Let me see. We kept a T. So..."),
      L("deputy", "S... T... E... T."),
      L("deputy", "STET! Our mayor's name was STET!"),
      L("deputy", "It's the mark you write beside something that was crossed out by mistake. It means: let it stand."),
      L("deputy", "Our mayor's name was the word for UN-erasing. No wonder REDACT got rid of it first."),
      L("deputy", "Take the Seal of Office. And if you meet REDACT, tell it the copies said STET.", { give: "sealofoffice" }),
      "* You also received 100 scraps."];
  }
  G.flags.stetQuest = true;
  return [
    L("deputy", "Ah, a visitor! I'm the Deputy Copy. Temporarily in charge. Permanently, maybe."),
    L("deputy", "Our mayor's name had three different letters. We kept one of them, a T. The rest blew away into the Underprint."),
    L("deputy", `${have.length ? `You've found ${have.length} already!` : "If you find them, would you bring them back?"} Look where erased things settle: the drain, the gardens.`)];
}
function gardenerTalk() {
  const a = [
    L("gardener", "Ah. A colored-in person. Haven't seen one of those in an age."),
    L("gardener", "Everything in my garden was erased down to its outline. The flowers, the bees, the bench."),
    L("gardener", "But an outline's a promise. It says: something was here, and could be again."),
    L("gardener", "The gate ahead opens if you trace the big flower the way it was drawn. Top petal first, then round like a clock.")];
  if (G.carry && (G.carry.spared || []).includes("brasswick")) a.push(L("gardener", "A clockwork fellow from upstairs used to visit. He'd approve of the clock part."));
  return a;
}
function vol13Talk() {
  return [
    L("vol13", "...oh. Someone found me. I'm Volume Thirteen. The one after Old Margin."),
    L("vol13", "Volume Twelve is unfinished because I was erased. An encyclopedia needs its last volume, or it never ends."),
    L("vol13", "I held the entries from S onward. Sol. Stet. Shredder. Every word REDACT didn't like."),
    L("vol13", "If you see Twelve again, tell it I'm still here. Under the white.")];
}
function shredderEvent() {
  World.busy = true;
  Dialog.open([
    L("shredder", "WHRRRRRRRR. MUNCH."),
    L("shredder", "OH. NOT A PAGE. A PERSON. PERSONS ARE VERY BIG TO SHRED."),
    L("shredder", "EVERYTHING THAT COMES THIS WAY GOES IN MY MOUTH. BEFORE IT REACHES HIM."),
    L("shredder", "SCRAPS ARE SAFE. BLANK IS FOREVER."),
    L("shredder", "...I WILL TRY ANYWAY.")], () => {
    startEncounter("shredder", {
      onEnd: res => {
        G.flags.shredder = res;
        if (res === "kill") { G.kills++; G.killed.push("shredder"); } else { G.spares++; G.spared.push("shredder"); }
        returnToWorld();
      }
    });
  });
}

/* ---------- sprites ---------- */
Object.assign(MON_DRAW, {
  outline(cx, by, t, e, u = 5) {
    const k = e ? Math.min(1, (e.sp || 0) / 100) : 0, sw = Math.sin(t * 1.5) * .08;
    ctx.save(); ctx.translate(cx, by); ctx.rotate(sw);
    ctx.strokeStyle = "#3a3a44"; ctx.lineWidth = u * .6;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -16 * u); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-4 * u, -7 * u, 4 * u, 1.6 * u, -.5, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 + t * .3, px = Math.cos(a) * 6 * u, py = -22 * u + Math.sin(a) * 6 * u;
      ctx.beginPath(); ctx.arc(px, py, 4.2 * u, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,106,154,${k * .9})`; ctx.fill(); ctx.strokeStyle = "#d9d6cf"; ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(0, -22 * u, 3 * u, 0, Math.PI * 2); ctx.fillStyle = k > .5 ? "#ffd84a" : "#000"; ctx.fill(); ctx.strokeStyle = "#d9d6cf"; ctx.stroke();
    ctx.fillStyle = "#d9d6cf"; ctx.fillRect(-1.6 * u, -23 * u, u, u); ctx.fillRect(.8 * u, -23 * u, u, u);
    ctx.restore();
  },
  papercut(cx, by, t, e, u = 5) {
    const soft = e && e.sp >= 100, j = soft ? 0 : Math.sin(t * 25) * .5;
    ctx.save(); ctx.translate(cx + j * u, by - 16 * u + Math.sin(t * 2) * 3); ctx.rotate(-.2);
    ctx.fillStyle = "#f6f6f2"; ctx.beginPath(); ctx.moveTo(-3 * u, 14 * u); ctx.lineTo(4 * u, -16 * u); ctx.lineTo(7 * u, 13 * u); ctx.closePath(); ctx.fill();
    if (!soft) { ctx.strokeStyle = "#ff2b45"; ctx.lineWidth = u * .5; ctx.beginPath(); ctx.moveTo(4 * u, -16 * u); ctx.lineTo(7 * u, 13 * u); ctx.stroke(); }
    ctx.fillStyle = "#1a1a22"; ctx.fillRect(2 * u, -3 * u, u, 1.4 * u); ctx.fillRect(4.4 * u, -3 * u, u, 1.4 * u);
    ctx.fillRect(2.4 * u, 1 * u, 2.6 * u, .6 * u);
    ctx.restore();
  },
  watermark(cx, by, t, e, u = 5) {
    const seen = e && e.seen, a0 = ctx.globalAlpha;
    ctx.globalAlpha = a0 * (seen ? .9 : .18 + .08 * Math.sin(t * 2));
    const R = P(cx, by + Math.sin(t) * 2, u);
    R(-10, -26, 20, 22, "#cfd8e8"); R(-8, -24, 16, 18, "#9fb0c8");
    R(-6, -22, 2, 4, "#cfd8e8"); R(-1, -23, 2, 5, "#cfd8e8"); R(4, -22, 2, 4, "#cfd8e8"); R(-6, -18, 12, 2, "#cfd8e8");
    R(-3, -14, 6, 6, "#cfd8e8"); R(-1, -9, 2, 3, "#cfd8e8");
    R(-4, -12, 1, 1, "#1a1a22"); R(3, -12, 1, 1, "#1a1a22");
    ctx.globalAlpha = a0;
  },
  ghostwriter(cx, by, t, e, u = 5) {
    const R = P(cx, by + Math.sin(t * 1.7) * 4, u);
    R(-8, -28, 16, 22, "#e8eeff"); R(-9, -24, 18, 16, "#e8eeff");
    for (let i = 0; i < 6; i++) R(-9 + i * 3, -8, 3, 2 + ((i + Math.floor(t * 4)) % 2) * 2, "#e8eeff");
    R(-5, -22, 2, 2, "#1a1a22"); R(3, -22, 2, 2, "#1a1a22");
    R(9, -26, 2, 14, "#3a3a44"); R(9, -12, 2, 3, "#d8b25a");
    for (let i = 0; i < 3; i++) R(-6, -17 + i * 3, 4 + ((Math.floor(t * 6) + i) % 4) * 2, 1, "#5a5a6a");
    if (e && e.sp >= 100) txt("by G.", cx, by - 4 * u, "#d8b25a", 4 * u, "center");
  },
  duplicat(cx, by, t, e, u = 5) {
    const a0 = ctx.globalAlpha;
    const cat = (ox, oy, al, col) => {
      ctx.globalAlpha = a0 * al; const R = P(cx + ox * u, by + oy * u, u);
      R(-8, -14, 16, 12, col); R(-7, -19, 5, 6, col); R(2, -19, 5, 6, col); R(-6, -22, 2, 3, col); R(4, -22, 2, 3, col);
      R(7, -8, 6, 2, col); R(11, -12, 2, 5, col);
      R(-5, -16, 2, 2, "#f6f6f2"); R(3, -16, 2, 2, "#f6f6f2"); R(-1, -13, 2, 1, "#e8a0b0");
    };
    cat(9 + Math.sin(t * 2) * .5, -2, .3, "#6a6a72");
    cat(-9 + Math.cos(t * 2) * .5, -1, .5, "#4a4a52");
    cat(0, 0, 1, "#2a2a30");
    ctx.globalAlpha = a0;
  },
  crumbs(cx, by, t, e, u = 5) {
    const tired = e && e.sp >= 100;
    for (let i = 0; i < 7; i++) {
      const r = hash(i, 9), x = cx + (r - .5) * 26 * u, y = by - 3 * u - Math.abs(Math.sin(t * (tired ? .5 : 3) + i)) * (tired ? 1 : 8) * u - (i % 3) * 3 * u;
      const s = (2 + r * 2) * u;
      ctx.fillStyle = i % 2 ? "#e8a0b0" : "#d88898"; ctx.fillRect(x - s, y - s, s * 2, s * 1.6);
      ctx.fillStyle = "#1a1a22";
      if (tired) ctx.fillRect(x - s * .5, y - s * .3, s, u * .4);
      else { ctx.fillRect(x - s * .5, y - s * .4, u * .6, u * .6); ctx.fillRect(x + s * .3, y - s * .4, u * .6, u * .6); }
    }
  },
  shredder(cx, by, t, e, u = 4) {
    const R = P(cx, by, u), chew = Math.abs(Math.sin(t * (e && e.sp >= 100 ? 1 : 8))) * 1.5;
    R(-20, -46, 40, 40, "#3a3a44"); R(-18, -44, 36, 36, "#5a5a66");
    R(-16, -40, 32, 4, "#2a2a30");
    R(-7, -34, 4, 4, "#ffd84a"); R(3, -34, 4, 4, "#ffd84a"); R(-6, -33, 2, 2, "#1a1a22"); R(4, -33, 2, 2, "#1a1a22");
    R(-16, -24 + chew, 32, 6, "#1a1a1e");
    for (let i = 0; i < 8; i++) R(-15 + i * 4, -24 + chew, 2, 2, "#d9d6cf");
    for (let i = 0; i < 6; i++) R(-13 + i * 5, -18 + chew, 3, 8 + ((i * 3 + Math.floor(t * 4)) % 5), "#f2ecd8");
    R(-22, -8, 44, 4, "#2a2a30"); R(-18, -4, 6, 4, "#1a1a1e"); R(12, -4, 6, 4, "#1a1a1e");
    R(14, -50, 3, 6, "#ff2b45");
  }
});
Object.assign(NPC_DRAW, {
  lintcopy(cx, by, t, u = 2) { ctx.save(); ctx.filter = "grayscale(1) contrast(.8)"; NPC_DRAW.lint(cx, by, t, u); ctx.restore(); },
  copy(cx, by, t, u = 2) {
    const R = P(cx, by + Math.sin(t * 2 + cx) * u * .5, u);
    R(-6, -26, 12, 9, "#d9d6cf"); R(-5, -25, 10, 7, "#efe9dc");
    R(-3, -23, 2, 2, "#3a3a44"); R(2, -23, 2, 2, "#3a3a44"); R(-2, -20, 4, 1, "#9a98a8");
    R(-6, -17, 12, 12, "#9a98a8"); R(-2, -17, 4, 10, "#d9d6cf"); R(-1, -16, 2, 7, "#5a5a66");
    R(-5, -5, 4, 4, "#5a5a66"); R(1, -5, 4, 4, "#5a5a66");
    ctx.fillStyle = "rgba(42,42,48,.25)"; ctx.fillRect(cx + 2 * u, by - 26 * u, 12 * u, 22 * u);
  },
  gardener(cx, by, t, u = 2) {
    ctx.save(); ctx.strokeStyle = "#3a3a44"; ctx.lineWidth = u * .7; ctx.setLineDash([u * 1.5, u]);
    ctx.strokeRect(cx - 5 * u, by - 26 * u, 10 * u, 9 * u);
    ctx.strokeRect(cx - 6 * u, by - 17 * u, 12 * u, 12 * u);
    ctx.beginPath(); ctx.moveTo(cx - 8 * u, by - 27 * u); ctx.lineTo(cx + 8 * u, by - 27 * u); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#3a3a44"; ctx.fillRect(cx - 3 * u, by - 23 * u, u, u); ctx.fillRect(cx + 2 * u, by - 23 * u, u, u);
    ctx.fillStyle = "#5a8a5a"; ctx.fillRect(cx + 6 * u, by - 12 * u, 5 * u, 4 * u); ctx.fillRect(cx + 10 * u, by - 14 * u, 2 * u, 2 * u);
    ctx.fillStyle = "#1a1a22"; ctx.fillRect(cx - 5 * u, by - 5 * u, 4 * u, 4 * u); ctx.fillRect(cx + 1 * u, by - 5 * u, 4 * u, 4 * u);
    ctx.restore();
  },
  bell(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-12, -10, 24, 10, "#5a4a3a"); R(-12, -10, 24, 2, "#7a6a5a");
    R(-5, -16, 10, 5, "#d8b25a"); R(-6, -12, 12, 2, "#b08a3e"); R(-1, -18, 2, 2, "#d8b25a");
    if ((t % 3) < .2) R(7, -20, 4, 1, "#fff");
  },
  vol13(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-4, -24, 8, 23, "#2a4a6a"); R(-3, -23, 6, 21, "#3a6a9a");
    R(-4, -20, 8, 1, "#d8b25a"); R(-4, -5, 8, 1, "#d8b25a");
    txt("13", cx, by - 18 * u, "#d8b25a", 5 * u, "center");
    R(-2, -12, 1, 1, "#1a1a22"); R(1, -12, 1, 1, "#1a1a22");
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(cx - 4 * u, by - 10 * u, 8 * u, 3 * u);
  },
  shredder(cx, by, t, u = 2) { MON_DRAW.shredder(cx, by, t, { sp: G && G.flags.shredder === "spare" ? 100 : 0 }, u * .5); },
  scraps(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    for (let i = 0; i < 9; i++) { const r = hash(i, 4); R(-10 + r * 18, -6 + ((r * 7) % 1) * 5, 2, 5, i % 2 ? "#f2ecd8" : "#d9d0bb"); }
  }
});
