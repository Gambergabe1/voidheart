"use strict";
/* ============================================================
   VOIDHEART — Episode 3, region 3: THE FICTION QUARTER
   A storybook city made of stories that never happened.
   PALIMPSEST keeps its kinder drafts here. Juni is found here.
   Area "fiction", rooms "e3f_", flags "f_", tiles 7 8 9.
   See docs/EP3_SPEC.md.
   ============================================================ */

/* ---------- region helpers ---------- */
const F3 = {
  recogKeys: ["f_r_joke", "f_r_whistle", "f_r_kite", "f_r_photo"],
  recog() { return G ? this.recogKeys.filter(k => G.flags[k]).length : 0; },
  hasPhoto() { return !!G && (G.inv.includes("juniphoto") || E3.evidence().some(v => v.key === "photo")); },
  starKeys: ["f_starA", "f_starB", "f_starC"],
  starCount() { return this.starKeys.filter(k => G.flags[k]).length; },
  starEnt(flag, tx, ty) {
    return { k: "deco", id: flag, sprite: "f_star", tx, ty, if: () => !G.flags[flag], talk: () => {
      G.flags[flag] = true; World.fadeEnt(flag); Sound.sfx("item");
      const n = F3.starCount();
      return ["* A fallen star, about the size of your hand.", "* It's warm. Painted gold on the front. Blank on the back.",
        n === 3 ? "* That's all three. Somebody up on the rooftops will be glad." : `* You tuck it into your pocket, carefully. (${n}/3)`];
    } };
  },
  give(id) {
    if (addItem(id)) { Toast.show("GOT: " + ITEMS[id].name.toUpperCase()); Sound.sfx("item"); return true; }
    Toast.show("POCKETS FULL"); return false;
  },
  SAVE: [
    "* A bookmark with a gold tassel. It promises to hold your place forever and ever.",
    "* A bookmark shaped like a tiny castle. It holds your place. Valiantly.",
    "* A bookmark that says 'YOU ARE HERE.' For once, a sign in this town that isn't lying."]
};

/* ---------- area, pool, palette, songs ---------- */
POOLS.fiction = ["f_herring", "f_plotarmor", "f_deusex", "f_purple", "f_cliche"];
AREAS.fiction = { name: "THE FICTION QUARTER", music: "f_quarter", sub: "every story that never happened, happily" };
PAL.fiction = {
  floor: "#e8d8b0", alt: "#e2d0a6", spec: "#b8955a", wall: "#3a2418", face: "#b5653a", line: "#8a4426",
  rug: "#8a2a3a", rug2: "#d8a630", shelf: "#6a3a1e", grass: "#6a9a3a", grass2: "#e86a9a"
};
Object.assign(SONGS, {
  f_quarter: { bpm: 100, tracks: [
    { w: "triangle", v: .05, n: "G4 - C5 E5 - C5 D5 - B4 G4 - - A4 - C5 F5 - E5 D5 - C5 B4 - - C5 - E5 G5 - E5 F5 - D5 B4 - G4 A4 - B4 C5 - - - - - . . ." },
    { w: "sine", v: .06, n: "C3 - - G2 - - G2 - - G2 - - F2 - - A2 - - G2 - - G2 - - C3 - - E2 - - F2 - - G2 - - F2 - - G2 - - C3 - - - - -" },
    { w: "square", v: .008, n: ". . . C6 . . . . . B5 . . . . . A5 . . . . . G5 . . . . . C6 . . . . . D6 . . . . . E6 . . . . . C6 . ." }] },
  f_happily: { bpm: 140, tracks: [
    { w: "square", v: .022, n: "C5 . E5 G5 C6 . G5 E5 F5 . A5 C6 F6 - E6 D6 E6 . C6 A5 D6 . B5 G5 C6 - - - G5 . . . A5 . C6 A5 F5 . A5 C6 G5 . E5 G5 C6 - B5 A5 G#5 . B5 D6 E6 - D6 C6 B5 . G5 A5 C6 - - -" },
    { w: "triangle", v: .07, n: "C3 C2 C3 C2 C3 C2 C3 C2 F2 F1 F2 F1 F2 F1 F2 F1 A2 A1 A2 A1 G2 G1 G2 G1 C3 C2 C3 C2 G2 G1 G2 G1 F2 F1 F2 F1 F2 F1 F2 F1 C3 C2 C3 C2 C3 C2 C3 C2 E2 E1 E2 E1 E2 E1 E2 E1 G2 G1 G2 G1 C3 C2 C3 C2" },
    { w: "square", v: .01, n: "C7 . . . . . . . G6 . . . . . . . C7 . . . . . . . G6 . . . . . . . C7 . . . . . . . G6 . . . . . . . E7 . . . . . . . D7 . . . . . . ." }] }
});

/* ---------- items, speakers ---------- */
Object.assign(ITEMS, {
  f_plottwist: { name: "Plot Twist", type: "weapon", atk: 14, price: 95, desc: "A corkscrew-shaped pen. Nobody sees it coming. Least of all you. ATK +14." },
  f_dustjacket: { name: "Dust Jacket", type: "armor", def: 10, price: 85, desc: "A hardback's jacket, worn as a coat. Glowing reviews on the back. DEF +10." },
  f_cocoa: { name: "Bedtime Cocoa", type: "heal", heal: 25, price: 18, desc: "Comes with a story. The story is that it's good. It is." },
  f_moralpie: { name: "Moral Pie", type: "heal", heal: 40, price: 32, desc: "Every slice comes with a lesson. The lesson is: pie." },
  f_nightlight: { name: "Jar of Night", type: "heal", heal: 60, desc: "Leftover night from the Lamplighter's brush. Good for when things get dark." },
  f_chapter7: { name: "Chapter Seven", type: "heal", heal: 45, desc: "The chapter where someone leaves. Sad. Also the best-written one on the street." },
  f_truthtea: { name: "Plain Truth Tea", type: "heal", heal: 30, desc: "No sugar. No story. Surprisingly good." },
  f_tart: { name: "Royal Tart", type: "heal", heal: 35, desc: "Baked for a happy ending. Better for being a little burnt." }
});
Object.assign(SPEAKERS, {
  f_prologue: { name: "THE PROLOGUE", voice: 560 },
  f_talltale: { name: "TALL TALE", voice: 170 },
  f_first: { name: "FIRST PERSON", voice: 330 },
  f_second: { name: "SECOND PERSON", voice: 380 },
  f_omni: { name: "THE OMNISCIENT", voice: 140 },
  f_lamp: { name: "THE LAMPLIGHTER", voice: 470 },
  f_moral: { name: "THE MORAL", voice: 210 },
  f_wolf: { name: "THE WOLF", voice: 190 },
  f_extra: { name: "EXTRA #4", voice: 420 },
  happilyever: { name: "HAPPILY EVER", voice: 230 }
});

/* ---------- custom tiles ---------- */
/* 7: painted scenery flats (houses in town, trees in the woods, stone in the castle). solid */
TILE_DRAW["7"] = (x, y, tx, ty, pal, t, W, h) => {
  const up = W.tile(tx, ty - 1) === "7", dn = W.tile(tx, ty + 1) === "7", id = W.roomId;
  ctx.fillStyle = pal.floor; ctx.fillRect(x, y, TILE, TILE);
  if (id === "e3f_woods") {
    if (!dn) { ctx.fillStyle = "#7a4a2a"; ctx.fillRect(x + 12, y + 18, 8, 14); ctx.fillStyle = "#4a2a14"; ctx.fillRect(x + 12, y + 18, 2, 14); }
    const cy = y + (dn ? 18 : 13);
    ctx.fillStyle = "#2f5a24"; ctx.beginPath(); ctx.arc(x + 16, cy, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = h < .5 ? "#4a8a3a" : "#5a9a3a"; ctx.beginPath(); ctx.arc(x + 16, cy, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#7aba5a"; ctx.beginPath(); ctx.arc(x + 11, cy - 5, 5, 0, Math.PI * 2); ctx.fill();
    if (h < .3) { ctx.fillStyle = "#e85a5a"; ctx.fillRect(x + 18, cy + 2, 4, 4); ctx.fillRect(x + 8, cy + 5, 3, 3); }
    return;
  }
  if (id === "e3f_castle") {
    ctx.fillStyle = "#c8b8a0"; ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "#a08a70";
    ctx.fillRect(x, y + 10, TILE, 2); ctx.fillRect(x, y + 21, TILE, 2);
    ctx.fillRect(x + ((tx & 1) ? 8 : 22), y, 2, 10); ctx.fillRect(x + ((tx & 1) ? 20 : 6), y + 12, 2, 9); ctx.fillRect(x + 14, y + 23, 2, 9);
    if (!up) { ctx.fillStyle = pal.wall; ctx.fillRect(x + 4, y, 8, 6); ctx.fillRect(x + 20, y, 8, 6); }
    if (up && h < .3) {
      ctx.fillStyle = "#8a2a3a"; ctx.fillRect(x + 9, y, 14, 22);
      ctx.beginPath(); ctx.moveTo(x + 9, y + 22); ctx.lineTo(x + 16, y + 28); ctx.lineTo(x + 23, y + 22); ctx.fill();
      ctx.fillStyle = "#d8a630"; ctx.fillRect(x + 9, y, 14, 2); ctx.fillRect(x + 14, y + 8, 4, 4);
    }
    return;
  }
  const roofs = ["#c85a4a", "#4a7ab8", "#6aa04a", "#d8a040", "#a05ab0"], walls = ["#f4e8d0", "#f0dcc0", "#e8e0d0"];
  const rc = roofs[Math.floor(hash(tx, 7) * roofs.length)], wc = walls[Math.floor(hash(tx, 3) * walls.length)];
  if (!up) {
    ctx.fillStyle = wc; ctx.fillRect(x + 3, y + 14, 26, 18);
    ctx.fillStyle = "#3a2418"; ctx.beginPath(); ctx.moveTo(x - 1, y + 16); ctx.lineTo(x + 16, y + 1); ctx.lineTo(x + 33, y + 16); ctx.fill();
    ctx.fillStyle = rc; ctx.beginPath(); ctx.moveTo(x + 1, y + 15); ctx.lineTo(x + 16, y + 3); ctx.lineTo(x + 31, y + 15); ctx.fill();
    if (h < .4) { ctx.fillStyle = "#6a3a2a"; ctx.fillRect(x + 21, y + 3, 4, 7); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(x + 22, y - 3 + Math.sin(t * 2 + h * 9) * 1, 3, 3); }
    ctx.fillStyle = "#5a3a2a"; ctx.fillRect(x + 12, y + 18, 9, 8);
    ctx.fillStyle = "#ffd88c"; ctx.fillRect(x + 13, y + 19, 7, 6); ctx.fillStyle = "#5a3a2a"; ctx.fillRect(x + 16, y + 19, 1, 6);
  } else {
    ctx.fillStyle = wc; ctx.fillRect(x + 3, y, 26, TILE);
    ctx.fillStyle = "#b89a70"; ctx.fillRect(x + 3, y, 2, TILE); ctx.fillRect(x + 27, y, 2, TILE);
    if (!dn || h < .5) {
      ctx.fillStyle = "#6a3a2a"; ctx.fillRect(x + 11, y + 12, 10, 20); ctx.fillStyle = rc; ctx.fillRect(x + 12, y + 13, 8, 19);
      ctx.fillStyle = "#ffd84a"; ctx.fillRect(x + 18, y + 22, 2, 2);
    } else { ctx.fillStyle = "#ffd88c"; ctx.fillRect(x + 8, y + 8, 7, 7); ctx.fillRect(x + 18, y + 8, 7, 7); }
  }
};
TILE_DRAW["7"].floor = false;
SOLID.add("7");

/* 8: a chapter break across the street. walkable */
TILE_DRAW["8"] = (x, y, tx, ty, pal, t) => {
  ctx.fillStyle = "rgba(184,149,90,.25)"; ctx.fillRect(x + 15, y, 2, TILE);
  ctx.fillStyle = `rgba(184,124,40,${.55 + .35 * Math.sin(t * 2 + ty * .8)})`;
  for (let i = 0; i < 3; i++) { const cy = y + 6 + i * 10; ctx.fillRect(x + 15, cy - 3, 2, 6); ctx.fillRect(x + 13, cy - 1, 6, 2); }
};

/* 9: the Plot Hole. solid. It also repaints the D bridge tiles directly above it. */
F3.isHole = c => c === "9" || (c === "D" && !G.flags.f_plot);
F3.holeAt = (x, y, tx, ty, t, W) => {
  const h = hash(tx, ty);
  ctx.fillStyle = "#140e1c"; ctx.fillRect(x, y, TILE, TILE);
  if (h < .45) {
    const k = (t * .25 + h * 7) % 1;
    ctx.globalAlpha = (1 - k) * .55;
    txt("abcdefghijklmnopqrstuvwxyz"[Math.floor(h * 260) % 26], x + 8 + h * 14, y + k * 18, "#b89ad8", 16);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = "#efe2c0";
  for (let i = 0; i < 4; i++) {
    const d = 2 + hash(tx * 4 + i, ty * 3) * 6;
    if (!F3.isHole(W.tile(tx, ty - 1))) ctx.fillRect(x + i * 8, y, 8, d);
    if (!F3.isHole(W.tile(tx, ty + 1))) ctx.fillRect(x + i * 8, y + TILE - d, 8, d);
    if (!F3.isHole(W.tile(tx - 1, ty))) ctx.fillRect(x, y + i * 8, d, 8);
    if (!F3.isHole(W.tile(tx + 1, ty))) ctx.fillRect(x + TILE - d, y + i * 8, d, 8);
  }
};
F3.bridgeAt = (x, y, tx, ty, W) => {
  ctx.fillStyle = "#140e1c"; ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#efe2c0"; ctx.fillRect(x + 1, y + 1, 30, 30);
  ctx.fillStyle = "#c8b890";
  for (let i = 0; i < 4; i++) ctx.fillRect(x + 5, y + 7 + i * 6, 14 + hash(tx + i, ty) * 8, 1);
  ctx.fillStyle = "#b89a70"; ctx.fillRect(x + 30, y + 1, 1, 30);
  ctx.fillStyle = "#8a6a4a";
  if (W.tile(tx, ty - 1) !== "D") ctx.fillRect(x, y, TILE, 3);
  if (W.tile(tx, ty + 1) !== "D") ctx.fillRect(x, y + TILE - 3, TILE, 3);
};
TILE_DRAW["9"] = (x, y, tx, ty, pal, t, W) => {
  F3.holeAt(x, y, tx, ty, t, W);
  for (let k = 1; W.tile(tx, ty - k) === "D"; k++) {
    if (G.flags.f_plot) F3.bridgeAt(x, y - k * TILE, tx, ty - k, W);
    else F3.holeAt(x, y - k * TILE, tx, ty - k, t, W);
  }
};
TILE_DRAW["9"].floor = false;
SOLID.add("9");

/* ---------- a new pattern: the page turns ---------- */
PAT.f_pageturn = { box: [260, 180], dur: 6, def: { col: "#f2e6c8" }, fn(B, S, P, dt, b) {
  if (!tick(S, 2.1 / P.d, dt, "c", .15)) return;
  S.k = (S.k || 0) + 1;
  const sx = B.x + B.w / 2, sy = B.y + B.h + 2, dir = S.k % 2 ? 1 : -1, T = 1.6 / P.s;
  const maxR = Math.hypot(B.w / 2, B.h) + 8, gap = 34 + rand(Math.max(10, Math.min(B.w / 2, B.h) - 70));
  for (let r = 14; r < maxR; r += 15) {
    if (r > gap && r < gap + 44) continue;
    b.spawn({ x: sx + r * dir, y: sy, r: 5, col: P.col, shape: "page", rot: 0, life: T + .05, rr: r,
      upd(o) {
        const k = Math.min(1, o.t / T), a = dir > 0 ? -k * Math.PI : -Math.PI + k * Math.PI;
        o.x = sx + Math.cos(a) * o.rr; o.y = sy + Math.sin(a) * o.rr; o.rot = a;
      } });
  }
} };

/* ---------- save points speak storybook here ---------- */
{
  const ds = doSave;
  doSave = function () {
    const a = World.def && World.def.area;
    if (a !== "fiction" || areaVoid(a)) return ds();
    G.hp = Math.max(G.hp, maxHP()); Sound.sfx("save"); saveGame();
    const lines = [pick(F3.SAVE), "* HP fully restored. Your place is saved."];
    if (G.kills > 0 && G.spares === 0 && G.pools[a] && G.pools[a].length) lines.push(`* (${G.pools[a].length} left.)`);
    Dialog.open(lines);
  };
}

/* ---------- monsters: tropes come to life ---------- */
Object.assign(MONSTERS, {
  f_herring: {
    name: "Red Herring", area: "fiction", hp: 100, atk: 7, def: 2, exp: 36, gold: 24, voice: 520,
    check: "RED HERRING - ATK 7 DEF 2\n* A very red fish that points at things.\n* It is not important. It would love to be.",
    intro: "* A Red Herring flops into view!\n* ...Or did it? Look over there!",
    flavor: ["* The Red Herring points at a suspicious cloud.", "* Smells like a clue. It isn't.", "* The Red Herring winks at nothing in particular."],
    spareFlavor: "* The Red Herring is just a fish now. It looks relieved.",
    talk: ["LOOK OVER THERE!", "the butler did it. probably.", "i'm VERY significant. foreshadowing!", "suspect EVERYONE. except me."],
    spareTalk: "...i was never the answer. that's okay.",
    acts: {
      "Take Notes": e => {
        if (!e.notes) { e.notes = 1; e.sp += 30; e.reply = "you're WRITING it DOWN?"; return "* You write down everything the Red Herring says.\n* Nobody has ever taken it seriously before."; }
        e.notes++;
        if (e.notes > 3) return "* Your notebook is full of fish facts.\n* None of them are clues.";
        e.sp += 10; e.reply = "a FOOTNOTE. for ME."; return "* You add a footnote: 'very red.'\n* The Red Herring is honored.";
      },
      "Ask What It Means": e => {
        if (!e.notes) return "* You don't have anything to go on yet.\n* Maybe write some of this down first?";
        e.asked = (e.asked || 0) + 1;
        if (e.asked === 1) { e.sp += 45; e.reply = "...nothing. they mean nothing. is that ALLOWED?"; return "* You read your notes back and ask what it all means.\n* The Red Herring thinks very hard.\n* ...It doesn't mean anything. It never did."; }
        if (e.asked === 2) { e.sp += 25; e.reply = "i'm just... a fish?"; return "* You tell it that's fine. Not everything has to be a clue.\n* The Red Herring stops pointing."; }
        return "* The Red Herring has already solved itself.";
      },
      "Look Over There": e => { e.sp -= 15; e.reply = "...that one was a trick. sorry. habit."; return "* You look where it's pointing.\n* There's nothing there.\n* The Red Herring feels terrible about it."; }
    },
    pats: [{ id: "snake", col: "#e8483a" }, { id: "side", col: "#e8483a" }]
  },
  f_plotarmor: {
    name: "Plot Armor", area: "fiction", hp: 140, atk: 8, def: 4, exp: 44, gold: 30, voice: 180,
    check: "PLOT ARMOR - ATK 8 DEF 4\n* Can't be hurt while the story needs it.\n* The story has needed it for a very long time.",
    intro: "* Plot Armor clanks forward. Nothing can touch it.\n* (It is very tired of that.)",
    flavor: ["* A piano falls on Plot Armor. It didn't even want to survive.", "* Plot Armor is polished to a nervous shine.", "* An arrow bounces off Plot Armor. It apologizes to the arrow."],
    spareFlavor: "* Plot Armor has taken its helmet off. Its hair is a mess. It's happy.",
    talk: ["I CANNOT FALL. I AM NOT ALLOWED.", "THE HERO MUST REACH THE LAST CHAPTER.", "...what if i just sat down? for one page?"],
    spareTalk: "...i TRIPPED. it was WONDERFUL.",
    acts: {
      "Find a Dent": e => {
        e.dent = (e.dent || 0) + 1;
        if (e.dent === 1) { e.sp += 25; e.reply = "a DENT? in ME?"; return "* You search Plot Armor all over.\n* There's one tiny dent, from chapter two.\n* It gasps. It thought it was flawless."; }
        if (e.dent <= 3) { e.sp += 10; e.reply = "...another one. i've been HIT before?"; return "* You find another dent. A scratch. A wobbly rivet.\n* Plot Armor has been through things."; }
        return "* You've found every dent there is.\n* Plot Armor is quietly proud of them.";
      },
      "Say 'You Can Fail'": e => {
        if (!e.dent) { e.reply = "I CANNOT."; return "* You tell Plot Armor it's allowed to fail.\n* It won't believe you. Not while it thinks it's perfect."; }
        e.told = (e.told || 0) + 1;
        if (e.told > 2) return "* It heard you. It's practicing wobbling.";
        e.sp += 35; e.reply = "...i can? ...i CAN."; return "* You tell Plot Armor it's allowed to fail.\n* Stories survive that. So do people.";
      },
      "Cheer It On": e => { e.sp -= 15; e.reply = "YES. NOTHING. EVER. (help)"; return "* You cheer: 'Nothing can stop you!'\n* Plot Armor stiffens.\n* That's exactly the problem."; }
    },
    pats: [{ id: "stomp", col: "#c8ccd8" }, { id: "walls", col: "#d8b25a" }]
  },
  f_deusex: {
    name: "Deus Ex Machina", area: "fiction", hp: 115, atk: 8, def: 2, exp: 46, gold: 36, voice: 760,
    check: "DEUS EX MACHINA - ATK 8 DEF 2\n* Lowered from the sky on a rope to fix anything.\n* It is ALWAYS called at the last minute.",
    intro: "* A creaking sound from above.\n* Deus Ex Machina descends to save the day!",
    flavor: ["* Deus Ex Machina's rope creaks.", "* Deus Ex Machina has fixed six problems since you blinked.", "* Somewhere offstage, a stagehand sighs."],
    spareFlavor: "* Deus Ex Machina has both feet on the ground. Literally.",
    talk: ["FEAR NOT! I FIX ALL!", "no time to explain! SOLVED!", "...nobody ever asks how i'M doing."],
    spareTalk: "...i'll stay down here a while. the view's nice.",
    acts: {
      "Solve It Yourself": e => {
        e.solved = (e.solved || 0) + 1;
        if (e.solved === 1) { e.sp += 35; e.reply = "...you didn't NEED me?"; return "* You work out your own problem, slowly, the long way.\n* Deus Ex Machina watches in wonder.\n* Nobody has ever done that."; }
        if (e.solved <= 3) { e.sp += 15; e.reply = "again! by HAND!"; return "* You solve another small problem yourself.\n* Deus Ex Machina takes notes."; }
        return "* You've solved everything nearby.\n* It's very peaceful.";
      },
      "Help It Down": e => {
        if (!e.solved) { e.reply = "CAN'T! SOMEONE MIGHT NEED ME!"; return "* You reach for its rope.\n* It won't come down. Not while somebody might need saving."; }
        e.down = (e.down || 0) + 1;
        if (e.down === 1) { e.sp += 40; e.reply = "...the floor. it's so... FLOOR."; return "* You help Deus Ex Machina down to the ground.\n* Its rope goes slack.\n* It has never touched the floor before."; }
        if (e.down === 2) { e.sp += 20; e.reply = "i could get used to this."; return "* You offer it a seat on the curb.\n* It sits. It creaks. It sighs."; }
        return "* It's already down. It's staying down.";
      },
      "Ask for Help": e => { e.sp -= 20; e.reply = "AGAIN? ...SOLVED. *wheeze*"; return "* You ask it for help.\n* It swoops in and solves everything.\n* It looks more exhausted than ever."; }
    },
    pats: [{ id: "rain", col: "#ffd84a" }, { id: "gears", col: "#d8b25a" }]
  },
  f_purple: {
    name: "Purple Prose", area: "fiction", hp: 120, atk: 8, def: 1, exp: 40, gold: 28, voice: 420,
    check: "PURPLE PROSE - ATK 8 DEF 1\n* Never uses one word where forty will do.\n* Underneath, it has something simple to say.",
    intro: "* Lo! Upon the sun-dappled, dew-kissed cobbles,\n* Purple Prose emerges, resplendent!",
    flavor: ["* Purple Prose describes the weather. It takes a while.", "* The air smells of lavender and adjectives.", "* Purple Prose gestures, luminously, at length."],
    spareFlavor: "* Purple Prose said what it meant. Briefly. It's beaming.",
    talk: ["O, the ineffable crepuscular ache of it!", "verily the cerulean firmament doth weep!", "...so many words. i can't find the one."],
    spareTalk: "...i'm glad you came. (that's it. that's the sentence.)",
    acts: {
      "Listen Patiently": e => {
        e.listened = (e.listened || 0) + 1;
        if (e.listened > 3) return "* You've heard the whole paragraph.\n* Twice. Backwards.";
        e.sp += 20; e.reply = "...you're still LISTENING?"; return "* You listen to the whole paragraph. All of it.\n* Somewhere in the middle, there's a real feeling.";
      },
      "Cut a Word": e => {
        if (!e.listened) return "* You don't know which words matter yet.\n* Listen first.";
        e.cuts = (e.cuts || 0) + 1;
        if (e.cuts > 3) return "* There's nothing left to cut. It's down to the bone.\n* The bone is lovely.";
        e.sp += 30;
        if (e.cuts === 1) { e.reply = "...resplendent? GONE?"; return "* You strike out 'resplendent.'\n* Purple Prose gasps. Then breathes easier."; }
        if (e.cuts === 2) { e.reply = "lighter... i feel LIGHTER."; return "* You strike out 'effulgent' and 'crepuscular.'\n* It fades from violet to a gentle lilac."; }
        e.reply = "i... missed you? no. i'm glad you came."; return "* You cut everything but one sentence.\n* It's a very small sentence. It's true.";
      },
      "Compliment Its Style": e => { e.sp -= 15; e.rage = 1; e.reply = "SPLENDIFEROUS! UNPARALLELED! MAGNIFICENT!"; return "* You call it eloquent.\n* It is overjoyed, and adds nine more adjectives.\n* You can't see the sentence anymore."; }
    },
    pats: [{ id: "letters", word: "EFFULGENTLYRESPLENDENT", col: "#b07ad8" }, { id: "flutter", col: "#c89ae8" }]
  },
  f_cliche: {
    name: "Cliche", area: "fiction", hp: 95, atk: 7, def: 3, exp: 34, gold: 22, voice: 300,
    check: "CLICHE - ATK 7 DEF 3\n* Worn smooth from being used too often.\n* It knows exactly what it'll say next. So do you.",
    intro: "* Cliche appears, right on cue.\n* (You saw this coming.)",
    flavor: ["* Cliche does exactly what you expected.", "* It was all a dream. (It wasn't.)", "* Cliche twirls a mustache that's only glued on."],
    spareFlavor: "* Cliche did something new. It's still shaking.",
    talk: ["IT'S QUIET. TOO QUIET.", "we're not so different, you and i.", "...i used to mean something. the first time."],
    spareTalk: "...i've never said this before. hello.",
    acts: {
      "Surprise It": e => {
        e.surp = (e.surp || 0) + 1;
        if (e.surp > 3) return "* You've run out of surprises.\n* Cliche doesn't mind. It's still recovering.";
        e.sp += 30;
        if (e.surp === 1) { e.reply = "...a SANDWICH? that's not in the scene!"; return "* You do something nobody would write.\n* You offer Cliche half a sandwich."; }
        if (e.surp === 2) { e.reply = "wrong song. WRONG SONG. i love it."; return "* You hum a song that doesn't fit the mood at all.\n* Cliche's mustache falls off."; }
        e.reply = "i don't HAVE shoes. ...thank you."; return "* You compliment its shoes.\n* It has no shoes. It's delighted anyway.";
      },
      "Ask What It Meant": e => {
        if (!e.surp) { e.reply = "it's not you. it's me."; return "* You ask what it really means.\n* It gives you a line it's said ten thousand times.\n* Catch it off guard first."; }
        e.meant = (e.meant || 0) + 1;
        if (e.meant === 1) { e.sp += 40; e.reply = "...'i'll always be here.' someone MEANT it."; return "* You ask what it meant, the very first time.\n* Cliche goes quiet. It remembers.\n* Somebody meant it. Really meant it."; }
        if (e.meant === 2) { e.sp += 15; e.reply = "...it's still true. isn't it."; return "* You tell Cliche old words can still be true.\n* It holds very still, so as not to spill it."; }
        return "* Cliche is still remembering.";
      },
      "Finish Its Sentence": e => { e.sp -= 20; e.reply = "...you KNEW."; return "* Cliche starts: 'It's not you, it's...'\n* You finish it for it.\n* It wilts. It wanted, just once, to surprise someone."; }
    },
    pats: [{ id: "ring", col: "#d8c8a0" }, { id: "aimed", col: "#d8c8a0" }]
  },

  /* ---------- the region boss ---------- */
  happilyever: {
    name: "Happily Ever", area: "fiction", hp: 420, atk: 9, def: 3, exp: 100, gold: 80, voice: 230, boss: true, bar: true, noFlee: true,
    title: "HAPPILY EVER // OF THE AFTERS", music: "f_happily",
    check: "HAPPILY EVER - ATK 9 DEF 3\n* Royal of the Afters. Enforcer of happy endings.\n* Has never once let a story actually end.",
    intro: "* Happily Ever rises from the throne.\n* Somewhere, a choir clears its throat.",
    init: () => ({ tale: 0, mid: 0, calls: 0 }),
    actNames() {
      const a = ["Listen to the Tale", "Ask About the Middle", "Applaud", "Call to Juni"];
      if (G.flags.f_r_whistle) a.push("Whistle");
      if (G.flags.f_kite) a.push("Point at the Kite");
      a.push("Tell the True Ending");
      return a;
    },
    acts: {
      "Listen to the Tale": e => {
        if (e.tale >= 3) return "* You know the tale by heart now.\n* So does Happily Ever. It mouths along.";
        e.tale++; e.sp += 15;
        if (e.tale === 1) { e.reply = "Isn't it LOVELY? Not one tear!"; return "* Happily Ever reads the tale aloud.\n* 'Once upon a time, the one in the tower\n  lived happily. The end.'"; }
        if (e.tale === 2) { e.reply = "The middle was... unnecessary."; return "* It reads the tale again, slower.\n* 'Once upon a time...' and then it skips ahead.\n* You hear a page turned past. Quickly."; }
        e.reply = "STOP LISTENING SO CAREFULLY."; return "* You listen a third time.\n* There's a gap in it the size of a rainy day.";
      },
      "Ask About the Middle": e => {
        if (!e.tale) return "* The middle of what?\n* Happily Ever hasn't told you a story yet.";
        if (e.mid >= e.tale || e.mid >= 2) return "* Happily Ever pretends not to hear you.\n* It's very good at pretending.";
        e.mid++; e.sp += e.mid === 1 ? 20 : 15;
        if (e.mid === 1) { e.reply = "The middle is where things go WRONG."; return "* You ask what happens in the middle.\n* Every story has one, you say. Where it goes wrong.\n* Happily Ever's smile wobbles."; }
        e.reply = "I cut it. It was DREADFUL. Someone left."; return "* You ask again. Gently.\n* Happily Ever looks at the floor.\n* There's a torn edge where the middle used to be.";
      },
      "Applaud": e => { e.sp -= 10; e.rage = 1; e.reply = "BRAVO! HAPPILY HAPPILY EVER AFTER!"; return "* You applaud the happy ending.\n* Happily Ever is thrilled. It adds three more\n  'happilys.' The tower grows a little taller."; },
      "Call to Juni": e => {
        if (e.calls >= 3) return "* You call to Juni again.\n* The tower window stays bright. Juni is listening.";
        e.calls++;
        const r = F3.recog();
        e.sp += 10 + r * 4 + (F3.hasPhoto() ? 4 : 0);
        if (r >= 3) { e.reply = "They KNOW you. Oh no. They know you."; return "* You shout Juni's name up the stairs.\n* Juni shouts yours back. Loudly.\n* Without stopping to wonder why."; }
        if (r >= 1) { e.reply = "Stop that! That's not their LINE!"; return "* You call up: 'Black hole in the plan!'\n* Faintly, from the top of the tower:\n* '...so we orbit around it!'"; }
        e.reply = "There's no one up there by that name!"; return "* You call Juni's name up the tower stairs.\n* Far above, someone stops humming.";
      },
      "Whistle": e => {
        if (e.whistled) return "* The tune is still drifting down the stairs.";
        e.whistled = 1; e.sp += 20; e.reply = "What IS that tune? ...Is there more of it?";
        return "* You whistle the four notes. The fourth one wrong.\n* From the top of the tower, Juni whistles back.\n* Wrong in exactly the same way.";
      },
      "Point at the Kite": e => {
        if (e.kite) return "* The kite is still up there. Still crooked.";
        e.kite = 1; e.sp += 20; e.reply = "Who put a CROOKED thing in my sky?";
        return "* You point out the window at the painted sky.\n* There's a kite up there, made of stars.\n* The tail is wrong. Happily Ever didn't put it there.";
      },
      "Tell the True Ending": e => {
        if (e.sp < 70) { e.reply = "NOT YET. Not while one happy page is left!"; return "* You start to tell it how the story really goes.\n* Happily Ever covers the page with both hands.\n* It isn't ready. Not yet."; }
        e.sp = 100; e.trueEnd = 1; e.reply = "...";
        return "* You tell it what the Plot Hole taught you.\n* A beginning. A trouble. A goodbye. An ending.\n* Not one page skipped.";
      }
    },
    talkFn(e) {
      if (e.sp >= 100) return e.trueEnd ? "...a goodbye. In MY story. ...Read it again?" : "...Perhaps the ending can wait a moment.";
      if (e.reply) { const r = e.reply; e.reply = null; return r; }
      const N = ["Isn't this LOVELY? Nobody is sad!", "In my stories, no car ever pulls away in the rain.", "Endings are where people get hurt. So I keep the last page warm.", "Every night I tuck the tower in. 'And they lived happily.'", "Why would anyone CHOOSE a sad ending? Why?", "...the one in the tower whistles at night. I don't know the tune.", "If I let them go, someone will have to say goodbye. I can't bear it."];
      return N[Math.min(e.turn - 1, N.length - 1)];
    },
    flavorFn(e) {
      if (e.sp >= 100) return "* Happily Ever is holding the last page loosely.";
      if (e.sp >= 50) return "* Happily Ever's smile keeps slipping. It keeps putting it back.";
      return pick(["* Happily Ever adjusts its crown. It's slightly too big.", "* A choir hums somewhere. It only knows one chord.", "* Gold leaf flakes off the throne. Someone sweeps it up instantly."]);
    },
    pattern(e) {
      const ph = e.hp < e.maxhp * .5 ? 2 : e.sp >= 50 ? 1 : 0;
      const L = [
        [{ id: "f_pageturn", col: "#f2e6c8" }, { id: "letters", word: "HAPPILYEVERAFTER", col: "#ffd84a" }, { id: "flutter", col: "#f2e6c8", d: 1.2 }],
        [{ id: "f_pageturn", col: "#ffd84a", s: .9 }, { id: "hush", col: "#e8c0d8" }, { id: "ring", col: "#ffd84a" }],
        [{ id: "f_pageturn", col: "#ff9d3f", d: 1.3, s: 1.1 }, { id: "walls", col: "#f2e6c8", s: 1.1 }, { id: "mixed", col: "#ffd84a" }]][ph];
      const p = Object.assign({}, L[e.turn % L.length]);
      p.d = (p.d || 1) * (1 - Math.min(.3, e.sp / 300));
      return p;
    },
    onHit(e) { e.reply = pick(["Ow! That's not in the script!", "Violence? In the LAST CHAPTER?", "Please, mind the gilding!"]); },
    deathLines: () => ["...and they all lived...", "...lived...", F3.recog() >= 2 ? "...tell them it was a good story..." : "...the end?"],
    spareLines: () => ["...'And then, one rainy day, somebody left.'", "'It was very, very sad.'", "...", "'And it was still a good story.'", "...Oh. That isn't so bad. That isn't so bad at all."]
  }
});

/* ---------- rooms ---------- */
Object.assign(ROOMS, {
  e3f_gate: {
    area: "fiction", map: [
      "####################",
      "####################",
      "##77....,.....,.77##",
      "##77...##..##...77##",
      "##.....##..##.....##",
      "....................",
      "......*......*......",
      "....................",
      "##.....##..##.....##",
      "##.,...##..##...*.##",
      "##................##",
      "####################",
      "####################"],
    exits: [{ x: 19, y: 5, w: 1, h: 3, to: "e3f_rooftops", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 9, ty: 4, text: () => ["* Carved over the archway, in curly gold letters:", "* 'ONCE UPON A TIME.'", "* Underneath, much smaller: 'Please wipe your feet. Stories track in.'"] },
      { k: "sign", tx: 14, ty: 2, text: () => ["* A notice board, painted all over with little hearts.", "* RULES OF THE FICTION QUARTER:\n* 1. Every story ends happily.\n* 2. See rule 1.", "* Someone has added, in small, neat handwriting: '3. Nobody ever leaves.'"] },
      { k: "npc", id: "f_prologue", tx: 5, ty: 4, talk: () => F3.prologueTalk() },
      { k: "save", tx: 15, ty: 10 }]
  },
  e3f_rooftops: {
    area: "fiction", enc: true, map: [
      "##############################",
      "#############....#############",
      "##777777777##....##777777777##",
      "##777777777##....##777777777##",
      "##...L.....,......,......L..##",
      "..............................",
      "..............................",
      "..............................",
      "##..*.....,.........*.....,.##",
      "##77777...7777777...77777...##",
      "##77777...7777777...77777...##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3f_gate", tx: 18, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3f_chapters", tx: 1, ty: 6, dir: "right" },
      { x: 13, y: 1, w: 4, h: 1, to: "e3f_inn", tx: 9, ty: 10, dir: "up" }],
    ents: [
      { k: "npc", id: "f_lamp", tx: 21, ty: 4, talk: () => F3.lampTalk() },
      { k: "sign", tx: 8, ty: 4, text: () => ["* A house with a perfect red roof, a perfect round window and a perfect curl of smoke.", "* The smoke is painted on. It doesn't move.", "* Nobody lives inside. The door is painted on too."] },
      { k: "sign", tx: 15, ty: 4, text: () => ["* A hanging sign shaped like a tankard.", "* 'THE INN OF UNRELIABLE NARRATORS. Up the steps.'", "* 'Est. yesterday, a thousand years ago.'"] },
      { k: "item", tx: 8, ty: 10, item: "f_cocoa", flag: "f_it_cocoa" }]
  },
  e3f_inn: {
    area: "fiction", map: [
      "####################",
      "##BBBBBBBBBBBBBBBB##",
      "##................##",
      "##................##",
      "##.RRR......RRR...##",
      "##.RRR......RRR...##",
      "##................##",
      "##................##",
      "##.RRR......RRR...##",
      "##.RRR......RRR...##",
      "##................##",
      "########....########",
      "########....########"],
    exits: [{ x: 8, y: 12, w: 4, h: 1, to: "e3f_rooftops", tx: 14, ty: 2, dir: "down" }],
    ents: [
      { k: "npc", id: "f_talltale", tx: 9, ty: 2, talk: () => F3.tallTalk() },
      { k: "npc", id: "f_first", tx: 4, ty: 4, talk: () => F3.firstTalk() },
      { k: "npc", id: "f_second", tx: 13, ty: 5, talk: () => F3.secondTalk() },
      { k: "npc", id: "f_omni", tx: 13, ty: 8, talk: () => F3.omniTalk() },
      { k: "save", tx: 16, ty: 2 },
      { k: "sign", tx: 2, ty: 2, text: () => ["* A chalkboard menu:", "* SOUP OF THE DAY: The soup is a dragon.\n* (It is not a dragon.)", "* TODAY'S SPECIAL: Whatever you heard it was."] },
      E3.falseNote({
        flag: "f_noteInn", region: "r3", tx: 17, ty: 9,
        lie: "EVERY STORY TOLD IN THIS INN IS TRUE.",
        need: () => G.flags.f_n1 && G.flags.f_n2 && G.flags.f_n3,
        hint: ["* It's a lie. Probably. You'd have to hear the stories first.", "* There are three narrators in here. Listen to all of them."],
        truth: ["* A dragon. A tree. A tower built yesterday, a thousand years ago.", "* Three stories, and they can't all be true. Maybe none of them are.", "* But every one of them had a road in it, and somebody looking down it.", "* Behind where the note was pinned, someone left a cup of tea. Still warm."],
        onStrike: () => F3.give("f_truthtea")
      })]
  },
  e3f_chapters: {
    area: "fiction", enc: true, map: [
      "##############################",
      "##############################",
      "##....8.....8.....8.....8...##",
      "##....8.....8.....8.....8...##",
      "##.L..8.....8..L..8.....8...##",
      "......8.....8.....8.....8.....",
      "......8.....8.....8.....8.....",
      "......8.....8.....8.....8.....",
      "##....8.....8.....8.....8...##",
      "##..*.8.....8..*..8.....8...##",
      "##....8.....8.....8.....8...##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3f_rooftops", tx: 28, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3f_plothole", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 4, ty: 2, text: () => ["* CHAPTER ONE:", "* 'In Which Everything Is Fine.'"] },
      { k: "sign", tx: 9, ty: 2, text: () => ["* CHAPTER TWO:", "* 'In Which Everything Continues To Be Fine.'"] },
      { k: "sign", tx: 15, ty: 2, text: () => ["* CHAPTER THREE:", "* 'In Which Someone Almost Has A Feeling, But It Passes.'"] },
      { k: "sign", tx: 21, ty: 2, text: () => ["* CHAPTER SIX:", "* 'In Which Everything Is Fine Again.'", "* (Chapters Four and Five have been removed for pacing.)"] },
      { k: "sign", tx: 26, ty: 2, text: () => ["* CHAPTER EIGHT:", "* 'In Which Everything Is Extremely Fine, And Nobody Asks About Chapter Seven.'"] },
      { k: "sign", tx: 21, ty: 10, text: () => { G.flags.f_ch7 = true; return ["* A torn page, kicked into the gutter between two chapters.", "* 'CHAPTER SEVEN: In Which Someone Leaves.'", "* The rest is gone. Not erased. Torn out, in a hurry, by someone who couldn't bear it.", "* It's the only chapter on this street that sounds true."]; } },
      F3.starEnt("f_starA", 9, 10),
      E3.falseNote({
        flag: "f_noteCh7", region: "r3", tx: 26, ty: 9,
        lie: "THIS STREET HAS ONLY HAPPY CHAPTERS.",
        need: () => G.flags.f_ch7,
        hint: ["* It's a lie. The chapter numbers skip. Something's missing.", "* Maybe the missing chapter is lying around somewhere."],
        truth: ["* You write SEVEN in the gap between SIX and EIGHT.", "* The whole street shudders, like a book closing on a finger.", "* Chapter Seven settles back into place. It's sad. It's also the best-written one on the street.", "* A loose copy of it flutters into your hands."],
        onStrike: () => F3.give("f_chapter7")
      })]
  },
  e3f_plothole: {
    area: "fiction",
    puzzle: { flag: "f_plot", key: "f_plotrunes", order: ["10,9", "4,3", "10,3", "4,9"],
      wrong: "* The story stumbles. The beats you told sink back into the floor.\n* Start again from the beginning.",
      done: ["* Beginning. Trouble. Goodbye. Ending.", "* The torn edges of the Plot Hole lean toward each other...", "* ...and knit together into a bridge of pages. Every page is a chapter somebody wanted to skip."] },
    map: [
      "##############################",
      "##############################",
      "##...........99999999.......##",
      "##..o.....o..99999999.......##",
      "##...........99999999.......##",
      ".............DDDDDDDD.........",
      ".............DDDDDDDD.........",
      ".............DDDDDDDD.........",
      "##...........99999999.......##",
      "##..o.....o..99999999.......##",
      "##.....o.....99999999.......##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3f_chapters", tx: 28, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3f_woods", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "npc", id: "f_moral", tx: 7, ty: 3, talk: () => F3.moralTalk() },
      { k: "sign", tx: 3, ty: 3, text: () => ["* A beat of story, carved beside the rune:", "* '...Then one of them had to move away. Far away.'"] },
      { k: "sign", tx: 11, ty: 3, text: () => ["* A beat of story, carved beside the rune:", "* '...They never really said goodbye. That was the hardest part.'"] },
      { k: "sign", tx: 3, ty: 9, text: () => ["* A beat of story, carved beside the rune:", "* '...And they were still friends, a long way apart. The end.'"] },
      { k: "sign", tx: 11, ty: 9, text: () => ["* A beat of story, carved beside the rune:", "* 'Once, in a town by a lake, there were two best friends.'"] },
      { k: "sign", tx: 6, ty: 10, text: () => ["* A beat of story, carved beside the rune:", "* '...And nobody ever had to leave. Happily ever after.'", "* This one is written in gold leaf. It's the prettiest. It doesn't fit."] },
      { k: "sign", tx: 24, ty: 9, text: () => ["* Scratched into the far lip of the hole:", "* 'P. was here. P. fixes everything. P. is sorry about the hole.'", "* The handwriting is small and very neat."] },
      F3.starEnt("f_starB", 25, 3)]
  },
  e3f_woods: {
    area: "fiction", enc: true, map: [
      "##############################",
      "##############################",
      "##77..777..*..777...77..777.##",
      "##77..777.....777...77..777.##",
      "##..........*.........*.....##",
      "..............................",
      "......77..........77..........",
      "..............................",
      "##....*..........*..........##",
      "##.777...777..*...777..777..##",
      "##.777...777......777..777..##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3f_plothole", tx: 28, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3f_castle", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 4, ty: 4 },
      { k: "page", tx: 27, ty: 2, page: "p11" },
      { k: "sign", tx: 10, ty: 4, text: () => ["* THE ONCE-WOODS.", "* 'Stay on the path. The path is for your own good. The path loves you.'", "* The path has been painted on. Rather sweetly."] },
      { k: "npc", id: "f_wolf", tx: 22, ty: 8, talk: () => F3.wolfTalk() },
      { k: "item", tx: 7, ty: 10, item: "f_moralpie", flag: "f_it_pie" },
      F3.starEnt("f_starC", 14, 10)]
  },
  e3f_castle: {
    area: "fiction", map: [
      "########################",
      "##77777777777777777777##",
      "##77777777777777777777##",
      "##......777777777777..##",
      "##....................##",
      "........................",
      "........RRRRRRRR........",
      "........................",
      "##..*..............*..##",
      "##.L................L.##",
      "##....................##",
      "########################",
      "########################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3f_woods", tx: 28, ty: 6, dir: "left" },
      { x: 23, y: 5, w: 1, h: 3, to: "e3f_tower", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "deco", id: "f_window", tx: 13, ty: 4, talk: () => F3.windowTalk() },
      { k: "npc", id: "f_extra", tx: 5, ty: 4, talk: () => F3.extraTalk() },
      { k: "sign", tx: 17, ty: 4, text: () => ["* A sign at the foot of the tower:", "* 'THE TOWER. Home of the One in the Tower. Visiting hours: never.'", "* 'By order of HAPPILY EVER, of the Afters. The stairs are to the east.'"] },
      { k: "save", tx: 21, ty: 4 },
      E3.falseNote({
        flag: "f_noteTower", region: "r3", tx: 3, ty: 10,
        lie: "THE ONE IN THE TOWER IS PERFECTLY HAPPY.",
        need: () => F3.recog() >= 2,
        hint: ["* It's a lie. Probably. Juni does look happy, up there.", "* But you'd want to really talk to them first. Up at the window."],
        truth: ["* Perfectly happy. Nobody is perfectly happy. Not even in stories.", "* Juni was happy a lot. Loudly. Badly-whistling happy. Not like this. Not painted on.", "* Under the note, someone left a picnic basket. There's a tart inside."],
        onStrike: () => F3.give("f_tart")
      })]
  },
  e3f_tower: {
    area: "fiction", noMusic: true, puzzle: { flag: "boss_happilyever", key: "f_towerkey" }, map: [
      "####################",
      "####################",
      "##RRRRRRRRRRRRRRRR##",
      "##.L............L.##",
      "##................##",
      "..................D.",
      "..................D.",
      "..................D.",
      "##................##",
      "##.L............L.##",
      "##RRRRRRRRRRRRRRRR##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3f_castle", tx: 22, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "e3f_epilogue", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "npc", id: "happilyever", tx: 14, ty: 6, if: () => !G.flags.boss_happilyever, talk: () => [] },
      { k: "npc", id: "happilyever", tx: 14, ty: 3, if: () => G.flags.boss_happilyever === "spare", talk: () => F3.heAfterTalk() },
      { k: "deco", id: "f_crown", tx: 14, ty: 6, if: () => G.flags.boss_happilyever === "kill", talk: () => ["* A paper crown, lying on the floor. The gold leaf has all flaked off.", "* Underneath, someone wrote in pencil: 'and they lived'", "* The rest of the sentence is missing."] }],
    triggers: [{ x: 7, y: 2, w: 1, h: 9, if: () => !G.flags.boss_happilyever, run: () => F3.bossEvent() }]
  },
  e3f_epilogue: {
    area: "fiction", map: [
      "########################",
      "##77777..........77777##",
      "##77777..........77777##",
      "##.....,...~~.........##",
      "##.........~~.........##",
      "........................",
      "...*..............*.....",
      "........................",
      "##....................##",
      "##.L......RRRR......L.##",
      "##....................##",
      "########################",
      "########################"],
    exits: [{ x: 0, y: 5, w: 1, h: 3, to: "e3f_tower", tx: 17, ty: 6, dir: "left" }],
    ents: [
      { k: "sign", tx: 8, ty: 4, text: () => G.flags.juniFound
        ? ["* EPILOGUE SQUARE.", "* 'Where everyone ends up, eventually. Smiling.'", "* Someone has added, in chalk: 'and sometimes crying. that's allowed too. -J'"]
        : ["* EPILOGUE SQUARE.", "* 'Where everyone ends up, eventually. Smiling.'"] },
      { k: "sign", tx: 13, ty: 4, text: () => F3.fountainTalk() },
      { k: "npc", id: "juni", tx: 12, ty: 9, if: () => !!G.flags.juniFound, talk: () => F3.juniEpilogue() },
      { k: "npc", id: "sol", tx: 17, ty: 4, if: () => E3.solAlly(), talk: () => [
        L("sol", "MILO. I followed the light down here. Old habit."),
        L("sol", "Once, I erased things because I thought waiting was cruel."),
        L("sol", "PALIMPSEST writes over things because it thinks missing someone is cruel."),
        L("sol", "We were both wrong in the same direction. Tell it that, when you find it.")] },
      E3.falseNote({
        flag: "f_noteEpi", region: "r3", tx: 20, ty: 3,
        lie: "AND NOBODY EVER MOVED AWAY.",
        need: () => !!G.flags.juniFound,
        hint: ["* It's a lie. You can feel it like a splinter.", "* But you haven't heard the whole truth yet. Not from the person it happened to."],
        truth: ["* Somebody moved away. A car, a rainy day, a wave through a wet window.", L("juni", "Hey. Look at that. You wrote STET next to it."), L("juni", "Let it stand. The leaving part AND the friends part. Both."), "* The note curls up and blows out of the square, toward the north."],
        onStrike: () => { G.flags.f_epiStet = true; }
      })]
  }
});

/* ---------- region dialogue ---------- */
Object.assign(F3, {
  prologueTalk() {
    if (!G.flags.f_prologue) {
      G.flags.f_prologue = true;
      const a = [
        L("f_prologue", "HEAR YE! HEAR YE! Welcome, traveler, to the Fiction Quarter!"),
        L("f_prologue", "I'm the Prologue. I come first. Hardly anyone reads me. They skip straight to chapter one."),
        L("f_prologue", "So thank you. Genuinely. I've been rehearsing this bit for ages."),
        L("f_prologue", "Everything in the Quarter is a story that never happened. Kinder versions. Spare drafts. Lovely, lovely lies."),
        L("f_prologue", "Somebody up in the world wishes a thing had gone differently, and down here, PLOP. A new street."),
        L("f_prologue", "...You've got a look on your face. Like you're looking for someone."),
        L("f_prologue", "Folks only get written in here when someone wanted them in a nicer story. Whoever it is, they were loved."),
        L("f_prologue", "Front to back: rooftops, Chapter Street, the Plot Hole, the woods, the castle. Then the tower. Then the end.")];
      if (E3.stet()) a.push(L("f_prologue", "Is that a Pen of STET? Careful with that here. Half this town is a lie that's very happy being one."));
      return a;
    }
    return [pick([
      L("f_prologue", "Stories go front to back. The tower's near the end. Endings always are."),
      L("f_prologue", "If you see the Lamplighter on the rooftops, say hello. She paints the night on every evening. By hand."),
      L("f_prologue", "Don't skip the inn! The narrators in there will tell you anything. Some of it even happened."),
      L("f_prologue", "I'd come with you, but then I'd be the middle. I've no training for the middle.")])];
  },
  lampTalk() {
    const n = F3.starCount();
    if (G.flags.f_starDone) {
      const a = [L("f_lamp", "Your kite's still up there. People keep stopping to look at it."),
        L("f_lamp", "Nobody in this town has ever seen a crooked thing on purpose. They don't know what to do with their faces.")];
      if (G.flags.juniFound) a.push(L("f_lamp", "Your friend came by and said it was 'correctly lopsided.' I've decided that's a compliment."));
      return a;
    }
    if (!G.flags.f_starQuest) {
      G.flags.f_starQuest = true;
      return [
        L("f_lamp", "Careful there, the sky's still wet!"),
        "* She waves a very long brush at the painted sky above the rooftops.",
        L("f_lamp", "I'm the Lamplighter. Every evening I paint the night on. Every morning I wash it off. Steady work."),
        L("f_lamp", "Only, last night the story said 'and not a single star was out of place.'"),
        L("f_lamp", "And three of my stars heard that and just... let go. Fell right out of the sky. Too much pressure, I think."),
        L("f_lamp", n ? `Oh! You've already got ${n}? Bring me the rest, would you?` : "If you see a fallen star lying about, would you bring it back? About yea big. Warm. Slightly embarrassed."),
        L("f_lamp", "Stars like to fall where a story trips. Chapter Street. The Plot Hole. The deep part of the woods.")];
    }
    if (n < 3) return [L("f_lamp", n ? `That's ${n} of my three! You're a natural.` : "No stars yet? Try Chapter Street, the Plot Hole, the woods. Anywhere a story stumbles."),
      L("f_lamp", "And mind the paint. It never really dries. That's fiction for you.")];
    G.flags.f_starDone = true; G.flags.f_kite = true;
    const kite = [
      "* You show her: four stars in a diamond, then three for the tail. The last one a bit too far left.",
      "* It's crooked. It was always crooked. Juni said that was the point.",
      L("f_lamp", "...A kite. With a wonky tail. That's not in the story at all."),
      L("f_lamp", "I think I like it better."),
      L("f_lamp", "Here. For your trouble. It's a jar of the leftover night. Good for when things get dark.", { give: "f_nightlight" })];
    return [
      L("f_lamp", "Three! All three! Oh, look at them, they're so relieved."),
      L("f_lamp", "Now. The story says they go back in perfect rows. Neat little lines, like buttons."),
      "* There are four stars already painted over the rooftops. You look at them for a long time.",
      "* Four up there, and three in your hands. Seven.",
      "* You remember a ceiling. Glow-in-the-dark stickers. Someone standing on your bed, saying 'hold still, I'm making us a constellation.'",
      { t: "* Where should the stars go?", ch: ["Perfect rows", "A lopsided kite"], on: i => i === 0
        ? [L("f_lamp", "Perfect rows it is... hm. You've stopped smiling."), "* The rows look fine. They look like nothing at all.", L("f_lamp", "Let's try that again, shall we? Your way."), ...kite]
        : kite }];
  },
  tallTalk() {
    const a = [L("f_talltale", "WELCOME, WELCOME to the Inn of Unreliable Narrators! Established yesterday, a thousand years ago!")];
    if (!G.flags.f_metTall) {
      G.flags.f_metTall = true;
      a.push(L("f_talltale", "I'm Tall Tale, the tallest innkeeper in the world. The top of my hat is in a different chapter."),
        L("f_talltale", "Everything here is legendary. Our soup once wrestled a bear. Our chairs were carved by the moon."));
      if (E3.shredderSpared()) a.push(L("f_talltale", "A big chewing fellow from down below stayed here once. Ate the guestbook. Very politely."));
    }
    a.push(L("f_talltale", "Buy something? Every item comes with a story. The story is free. The item is not.",
      { after: () => Shop.open(["f_plottwist", "f_dustjacket", "f_cocoa", "f_moralpie"], "f_talltale", "This pen was pulled from a stone. The stone was pulled from a bigger pen. Very rare.", "Off you go. Every good story needs a little shopping in the middle.") }));
    return a;
  },
  firstTalk() {
    G.flags.f_n1 = true;
    return [
      L("f_first", "Ah. You've come to hear MY story. Everyone does, eventually."),
      L("f_first", "The tower story? I was in it. I was the hero. I'm the hero in every story I tell. That's first person."),
      L("f_first", "In my version, the one in the tower is a dragon, and I defeat it with one devastating remark."),
      L("f_first", "..."),
      L("f_first", "Fine. I was a tree outside the tower. But I was a very IMPORTANT tree. I saw everything."),
      L("f_first", "And what I saw was this: at night, the one in the tower watches the road. Like they're waiting for a car to come back.")];
  },
  secondTalk() {
    G.flags.f_n2 = true;
    return [
      L("f_second", "You walk over to the corner table. You don't know why you're doing this. You do it anyway."),
      L("f_second", "You're looking for someone. You already know their name. You're scared to say it, in case it isn't real."),
      L("f_second", "You'll find them in the tower past the castle. They won't know you. That will hurt. You'll keep talking."),
      L("f_second", "You'll try to whistle. You'll be bad at it. You have always been bad at it."),
      L("f_second", "You are wondering how I know all this. You are not going to get an answer. That's second person for you.")];
  },
  omniTalk() {
    G.flags.f_n3 = true;
    const a = [
      L("f_omni", "I know EVERYTHING. Every thought of every character. Ask me anything. No, don't. I already know what you'd ask."),
      L("f_omni", "The one in the tower has never met a single soul. Fact. The tower was built a thousand years ago, yesterday. Fact."),
      L("f_omni", "The Plot Hole? Simple. You start at the END and work backwards. Everyone knows that."),
      L("f_omni", "...The Moral said otherwise? Well. The Moral is an owl. Owls are famously wrong about narrative structure.")];
    if (E3.vantaAlive()) a.push(L("f_omni", "I also know everything about a certain masked archivist. Everything. ...No. Even I have manners."));
    a.push(L("f_omni", "I am never, ever wrong. Write that down. Actually, don't. I'll know if you spell it wrong."));
    return a;
  },
  moralTalk() {
    if (G.flags.f_plot) return [
      L("f_moral", "Hoo. Well told. The goodbye was the hardest part, wasn't it? It usually is."),
      L("f_moral", "The moral of this story is: the hard part is load-bearing.")];
    const a = [];
    if (!G.flags.f_metMoral) {
      G.flags.f_metMoral = true;
      a.push(L("f_moral", "Hoo. Hoo-hoo. Ahem. That's not a question, that's me clearing my throat."),
        L("f_moral", "I'm the Moral. I come at the end of stories and explain them. Nobody likes me. Somebody has to do it."),
        L("f_moral", "This is the Plot Hole. Somebody tore a page out so hard, they tore the street."));
    }
    a.push(L("f_moral", "To cross, you have to tell it right. Five beats on the floor. One of them is a lie."),
      L("f_moral", "A true story goes: a beginning. A trouble. A goodbye. An ending. Skip the goodbye and you fall straight through."),
      L("f_moral", "The moral of this story is: you can't get to the end by skipping the hard part."),
      L("f_moral", "...Also, look both ways before crossing. That's the moral of most stories. Nobody listens."));
    if (E3.ep1Void()) a.push(L("f_moral", "Hoo. The moral of YOUR story, I hear, is a heavy one. Mind how you carry it."));
    return a;
  },
  wolfTalk() {
    if (G.flags.juniFound) return [L("f_wolf", "Your friend went by, humming. Got the fourth note right this time."), L("f_wolf", "Sounded better wrong, honestly. Don't tell them I said so.")];
    if (!G.flags.f_metWolf) {
      G.flags.f_metWolf = true;
      return [
        L("f_wolf", "Oh! Hello! Don't worry, I'm the nice kind. I got rewritten."),
        L("f_wolf", "I used to be the Big Bad one. Then somebody up in the world had a nightmare about me, and someone kind wrote over it."),
        L("f_wolf", "Now I'm the Medium Polite Wolf. Tea at four. Never late, never hungry, never anything."),
        L("f_wolf", "...Sorry. That came out sad. We're not supposed to come out sad here."),
        L("f_wolf", "Headed for the castle? The one in the tower whistles at night. Four notes. The fourth one's always wrong.")];
    }
    return [pick([
      L("f_wolf", "My grandmother says hello. I don't have a grandmother. That was the old version. I miss her anyway."),
      L("f_wolf", "You smell like a long walk and a bit of ink. Good combination."),
      L("f_wolf", "The path loves you. The path told me to say that. I think the path is lonely.")])];
  },
  extraTalk() {
    if (G.flags.boss_happilyever === "kill") return [L("f_extra", "It's very quiet in the castle now. I think... the story's over?"), L("f_extra", "Nobody told me what to do after. I'll just... keep holding the spear. In case.")];
    if (G.flags.juniFound) return [L("f_extra", "The tower's empty. I could put the spear down now."), L("f_extra", "...I think I'll hold it a bit longer. For old times.")];
    if (!G.flags.f_metExtra) {
      G.flags.f_metExtra = true;
      return [
        L("f_extra", "Oh! Oh, a speaking part! I'm talking! Somebody's TALKING to me!"),
        L("f_extra", "I'm Extra Number Four. I stand here and I hold the spear. In chapter nine I point and say 'The castle!'"),
        L("f_extra", "It's a very good line. I've been saving it for nine chapters."),
        L("f_extra", "His Majesty Happily Ever lives up there. Kindest royal there ever was. Gives everybody a happy ending."),
        L("f_extra", "Mine is standing here, happily, forever."),
        L("f_extra", "...Forever's a long time to hold a spear, though. My arm fell asleep in chapter two.")];
    }
    return [pick([
      L("f_extra", "The one in the tower waves at me sometimes. Nobody else ever waves at me."),
      L("f_extra", "Between you and me, the one in the tower looks at the road a lot. Like they lost something on it."),
      L("f_extra", "'The castle!' ...Sorry. Practicing.")])];
  },

  /* ---------- Juni at the window: recognition, step by step ---------- */
  windowTalk() {
    const f = G.flags;
    if (f.juniFound || f.boss_happilyever) return ["* The window is empty now. The curtain moves a little, like someone just left."];
    if (!f.f_metJuni) {
      f.f_metJuni = true;
      return [
        "* High up in the tower, a window glows. Someone leans out.",
        L("juni", "Oh! A visitor! Hello down there!"),
        L("juni", "Sorry, I'm not supposed to have visitors. That's sort of what makes this a peaceful ending."),
        L("juni", "I'm the one in the tower. I've always been the one in the tower. Good mornings, good nights, stars on time."),
        { t: "* Juni is smiling at you the way you smile at a stranger.", ch: ["It's me, MILO", "...Hi."], on: i => i === 0
          ? [L("juni", "MILO? That's a nice name. It sounds like a name somebody would whistle."), L("juni", "I'm Juni. I think. People don't really call me anything. There aren't really people.")]
          : [L("juni", "Hi! You're very quiet. That's okay. Quiet people notice the best stuff.")] },
        L("juni", "I don't think we've met. I'd remember. I'm really good at remembering things. Stars, mostly."),
        L("juni", "Come back and talk any time. Well. Not ANY time. Visiting hours are never. But I won't tell.")];
    }
    if (!f.f_r_joke) return [
      L("juni", "You came back! Nobody comes back. Mostly because nobody comes."),
      L("juni", "The royal says I shouldn't talk to people from sad stories. Are you from a sad story? You look a bit... lopsided."),
      { t: "* Something tugs at you. A thing Juni always said, whenever a plan fell apart.", ch: ["Say the line", "Say nothing"], on: i => {
        if (i !== 0) return [L("juni", "...You looked like you were about to say something. Something about... space?"), L("juni", "Weird. Come back if you remember it.")];
        f.f_r_joke = true;
        return [
          "* You say: 'Well. That's a black hole in the plan.'",
          L("juni", "...so we orbit around it."),
          L("juni", "..."),
          L("juni", "Why did I say that? That's not my line. My lines are 'good morning' and 'what a lovely ending.'"),
          L("juni", "That's a terrible joke. It's not even a pun. It's barely astronomy."),
          L("juni", "...Say it again sometime? I want to see if I say it again."),
          L("happilyever", "AHEM! The one in the tower is VERY BUSY being content! Visiting hours are over!")];
      } }];
    if (!f.f_r_whistle) return [
      L("juni", "You again! I've been thinking about orbiting. I don't know why. I've orbited the whole tower in my head."),
      L("juni", "At night I whistle. Same four notes. I don't know where they're from. The fourth one always comes out wrong."),
      { t: "* You know that tune. Juni taught it to you, sitting on a fence, the summer you were nine.", ch: ["Whistle it", "Not yet"], on: i => {
        if (i !== 0) return [L("juni", "That's okay. I can wait. Apparently I'm great at waiting.")];
        f.f_r_whistle = true;
        return [
          "* You put two fingers in your mouth. The wrong way. The way Juni always said was wrong.",
          "* You whistle. Three notes come out fine. The fourth one cracks.",
          L("juni", "No, no, you're doing it wrong, you have to curl your tongue, you ALWAYS forget to curl your..."),
          L("juni", "..."),
          L("juni", "How do I know that? How do I know you always forget?"),
          "* Juni whistles back. Four notes. The fourth one is wrong in exactly the same way.",
          L("juni", "MILO. I feel like I'm reading a book I already know the end of.")];
      } }];
    if (f.f_kite && !f.f_r_kite) {
      f.f_r_kite = true;
      return [
        "* Juni is leaning way out of the window, staring up at the painted sky.",
        L("juni", "MILO! Somebody put a kite up there! In the stars! Look!"),
        L("juni", "It's lopsided. The tail goes the wrong way. ...It's SUPPOSED to go the wrong way."),
        L("juni", "I stuck that on a ceiling once. Standing on a bed. Somebody was holding the stool and laughing too hard to hold it."),
        L("juni", "It was your ceiling. You fell off the stool, and we said the crooked star was for luck."),
        L("juni", "MILO. I know you. I KNOW you. Why don't I know how I know you?")];
    }
    if (!f.f_r_photo) {
      f.f_r_photo = true;
      const a = F3.hasPhoto() ? [
        "* You hold up the torn photo. Half of it: you, laughing at something just out of the picture.",
        L("juni", "That's... that's my hand. On your shoulder. Right at the edge."),
        L("juni", "I was doing bunny ears behind your head. It's torn right through the bunny ears."),
        L("juni", "Who tears a photo right through the bunny ears? That's the best part!")] : [
        "* You don't have the photo on you. But you remember it anyway. You, laughing at something just out of frame.",
        "* You tell Juni about it. The fair. The photo booth. The bunny ears.",
        L("juni", "...Bunny ears. Behind your head. I did bunny ears."),
        L("juni", "And you laughed so hard you snorted, and the booth took the picture right on the snort.")];
      return [...a,
        L("juni", "Something's wrong with my ending, isn't it. Something got written over."),
        L("juni", "...The royal's coming. I can hear the fanfare. It's always slightly too long."),
        L("juni", "Come up the tower, MILO. Please. I want to remember the rest. Even if it's the sad part.")];
    }
    if (!f.f_kite) return [L("juni", "There's something missing from the sky. I keep looking up for it. I think it fell."),
      L("juni", "The Lamplighter on the rooftops would know. She knows every star by its first name.")];
    return [L("juni", pick(["Come up the tower. I'm ready. I think.", "I keep almost knowing all of you. It's like a word on the tip of my tongue, except it's a whole person.", "What do you call a star that never stops talking? A... no. I had a better one. I'll remember."]))];
  },

  /* ---------- the boss ---------- */
  bossEvent() {
    World.busy = true;
    const a = [
      "* A fanfare plays. It goes on slightly too long.",
      "* Then a little longer than that.",
      L("happilyever", "WELCOME, dear reader! Welcome to the very last page of the very best story!"),
      L("happilyever", "I am HAPPILY EVER, of the Afters. I see to it that every story ends the way it ought to."),
      L("happilyever", "Warmly. Neatly. With nobody waving through a rainy car window, and nobody left on the curb.")];
    if (F3.recog()) a.push(L("happilyever", "You've been visiting my tower. Telling it jokes. WHISTLING at it! Old tunes from an old, sad story!"));
    a.push(
      L("happilyever", "Up there is the one in the tower. They have a PERFECT ending. Not one goodbye in it. Do you know how rare that is?"),
      L("happilyever", "You want to take them back into a story where somebody leaves. Where somebody doesn't come outside."),
      "* ...Doesn't come outside for what?",
      L("happilyever", "I am terribly sorry. Truly. But I cannot let a story end sadly. It's the only rule I've got."),
      L("happilyever", "So! A lovely, gentle battle. And afterward you may live happily ever after. Somewhere else. Far away."));
    Dialog.open(a, () => startEncounter("happilyever", { onEnd: E3.bossEnd("happilyever", res => F3.juniFreed(res)) }));
  },
  juniFreed(res) {
    World.busy = true;
    Music.play("hollow");
    World.spawn({ k: "npc", id: "f_junifree", sprite: "juni", tx: 10, ty: 5, alpha: 0, appearing: true, talk: () => [] });
    const kill = res === "kill", r = F3.recog(), a = [];
    if (kill) a.push(
      "* Happily Ever is gone. The gold leaf on the walls begins to peel.",
      "* Somewhere above, a tower with no story left to hold it up comes apart, page by page.",
      "* Footsteps on the stairs. Slow ones. Careful ones.");
    else a.push(
      "* The throne room goes quiet. For once, no fanfare.",
      L("happilyever", "...Go on, then. I've unlocked the tower."),
      L("happilyever", "Mind the last step. It's a sad one."),
      "* Footsteps on the stairs. Fast ones. Two at a time.");
    a.push(L("juni", "MILO."));
    if (!kill) a.push(L("juni", "...MILO! You came up the stairs two at a time. You always do that. You always trip on the last one."));
    else a.push(L("juni", "...MILO. The stairs fell away behind me. One at a time. Like someone closing a book very slowly."));
    if (r >= 2) a.push(L("juni", "I remember. The fence. The whistle. The terrible black hole joke. I remember EVERYTHING."));
    else a.push(L("juni", "Hold on. It's all coming back at once. It's like a shelf falling on me. A nice shelf. With heavy books."),
      L("juni", "The fence. The whistle. Your ceiling. ...You. I remember you."));
    a.push(
      L("juni", kill ? "I remember being 'the one in the tower,' too. It was nice. It was so nice. It wasn't real." : "Ugh. I remember being 'the one in the tower' too. I said 'what a lovely ending' forty times a day. Embarrassing."),
      "* Juni laughs. Then stops laughing. Then looks at you for a long time.",
      L("juni", "MILO, I have to tell you something. You won't like it. You didn't like it the first time."),
      L("juni", "I moved away. Last year. My mom got the job at the observatory up north, and we went."),
      L("juni", "It rained the whole day. The car was packed to the roof. I had the telescope on my lap."),
      L("juni", "I kept the window down, even with the rain coming in. I kept looking at your door."),
      L("juni", "You didn't come out."),
      "* You remember now. Standing behind your front door with your hand on the handle. Not turning it.",
      "* Because if you didn't say goodbye, it wasn't real yet.",
      "* And you have wished, every single day since, that you'd opened it.",
      L("juni", "It was awful. For both of us. And something down in the blank pages read how awful it was..."),
      L("juni", "...and decided to be KIND about it. It didn't write over the goodbye. It wrote over me."),
      L("juni", "No Juni, no goodbye. Nothing to miss. That's PALIMPSEST's idea of kind."),
      { t: "* Juni is waiting for you to say something.", ch: ["I'm sorry", "I was scared"], on: i => i === 0
        ? [L("juni", "I know. I knew then, too. I was mad for about a week. Then I was mostly just sad you missed the wave."), L("juni", "I did a really good wave. Both arms. Out of a moving car. In the rain.")]
        : [L("juni", "I know. Me too. Saying it would've made it real."), L("juni", "I almost didn't wave. I nearly pretended I was asleep.")] },
      L("juni", "But it was real anyway. The goodbye was real. And so was all the rest of it."),
      L("juni", "Goodbye doesn't un-write a friendship, MILO. It's one line. It isn't the whole book."));
    if (kill) a.push(
      L("juni", "...It wasn't cruel, you know. Happily Ever. It just loved endings so much it couldn't let anyone have one."),
      L("juni", "I guess it got one anyway."));
    else a.push(L("happilyever", "...'And it was still a good story.' Hm. I'm writing that one down."));
    a.push(
      L("juni", "Here. This is mine to say, so I'm saying it. Take it with you. Show it to whoever needs proof."),
      "* Juni tells you everything, start to finish, the way it really happened. You hold on to every word.",
      L("juni", "I can't come with you. Not really. I'm still mostly ink right now. Sort of see-through at the edges."),
      L("juni", "But I'll follow you through the margins. Look at the edge of the page, whenever you need me."),
      L("juni", "I'll be the doodle of a star. A lopsided one."));
    if (G.flags.f_kite) a.push(L("juni", "...You put the kite up. In the actual sky. You big sap."));
    a.push(L("juni", kill ? "Let's not stay for the last page of this one. I'll meet you in the Epilogue." : "Go on. I'll meet you in the Epilogue. Every story has one. Even this one."));
    Dialog.open(a, () => {
      G.flags.juniFound = true;
      E3.addEvidence("juni", "Juni's own testimony");
      World.fadeEnt("f_junifree");
      World.busy = false;
      saveGame();
    });
  },
  heAfterTalk() {
    return [
      L("happilyever", "Ah. The reader. I've been practicing. Listen: 'And then they said goodbye.'"),
      L("happilyever", "...Dreadful. Simply dreadful. I hate it. I'm keeping it."),
      L("happilyever", "Do come back and tell me how your story ends. Even if it's sad. ESPECIALLY if... no. Even if.")];
  },
  juniEpilogue() {
    const n = G.flags.f_juniTalk = (G.flags.f_juniTalk || 0) + 1;
    if (n === 1 && G.flags.boss_happilyever === "kill") return [
      L("juni", "...It's quieter here than it should be. The ending's all frayed at the edges."),
      L("juni", "It's okay. We'll write a better one. A true one."),
      L("juni", "Next stop's the Errata. A trial, I heard. 'MILO versus the Record.' If they need a witness, call me.")];
    const S = [
      [L("juni", "Hey. You made it to the Epilogue. Most people skip it. The Prologue is going to be SO jealous."),
        L("juni", "Next stop's the Errata. A trial, I heard. 'MILO versus the Record.' Very dramatic."),
        L("juni", "If they need a witness, call me. I'll tell them I existed. I'm extremely qualified.")],
      [L("juni", "What do you call a goodbye that comes back? A see-you-later."), L("juni", "...I'm workshopping it.")],
      [L("juni", "When this is over, write me a letter. A real one. With a stamp. I always write back."), L("juni", "Even when you're bad at writing back. ESPECIALLY then.")],
      [L("juni", "Did you know starlight left its star a really long time ago? It's still real. Just far."), L("juni", "...Okay, that one wasn't a pun. That one was just true.")]];
    const a = S[(n - 1) % S.length].slice();
    if (n === 2 && G.flags.f_epiStet) a.push(L("juni", "Also, thanks for the STET. Over there. On the note. I saw."));
    return a;
  },
  fountainTalk() {
    const a = ["* A fountain of ink in the middle of the square. It ripples, though there's no wind.",
      L("quill", "MILO? Can you hear me? I'm in the ink! Every fountain pen in the world is a door, if you're brave and a bit damp.")];
    if (G.flags.juniFound) a.push(L("quill", "You found them. Oh, MILO. You found Juni. I can see them waving at me through the ink."),
      L("quill", "Don't tell them I cried. Ink doesn't cry. It just... runs."));
    else a.push(L("quill", "...Keep going. I believe in you. Loudly. From inside a fountain."));
    a.push(L("quill", "The Errata is next. Everything ever written wrong gets filed there. Bring your evidence."));
    return a;
  }
});

/* ---------- monster sprites ---------- */
Object.assign(MON_DRAW, {
  f_herring(cx, by, t, e, u = 5) {
    const calm = e && e.sp >= 100, R = P(cx, by + Math.sin(t * 2.4) * 2, u);
    const body = calm ? "#c8a0a8" : "#e8483a", dark = calm ? "#9a7880" : "#a82a20";
    R(-5, -4, 10, 4, dark); R(-8, -2, 4, 2, dark); R(4, -2, 4, 2, dark);
    R(-3, -8, 6, 4, body);
    R(-6, -26, 12, 18, body); R(-5, -30, 10, 4, body); R(-3, -33, 6, 3, body);
    R(-4, -24, 3, 12, "rgba(255,255,255,.25)");
    for (let i = 0; i < 4; i++) R(-3 + (i % 2) * 3, -22 + i * 3, 2, 1, dark);
    R(1, -28, 3, 3, "#fff"); R(2, -27, 1.5, 1.5, "#1a1a22");
    const pt = calm ? 3 : Math.sin(t * 3) * 2;
    R(6, -20 + pt, 7, 2, dark); R(12, -21 + pt, 2, 4, dark);
    R(-9, -18, 3, 5, dark);
    if (!calm) {
      R(-5, -36, 10, 3, "#6a5a3a"); R(-7, -34, 14, 1, "#4a3a2a");
      txt("?", cx + 13 * u, by - 38 * u + Math.sin(t * 4) * u, "#ffd84a", 8 * u, "center");
    } else R(-2, -15, 4, 1, dark);
  },
  f_plotarmor(cx, by, t, e, u = 5) {
    const free = e && e.sp >= 100, R = P(cx, by, u), st = "#c8ccd8", sh = "#8a90a4";
    if (!free) { ctx.save(); ctx.globalAlpha *= .18 + .08 * Math.sin(t * 4); ctx.fillStyle = "#ffd84a"; ctx.beginPath(); ctx.arc(cx, by - 18 * u, 19 * u, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    R(-6, -6, 5, 6, sh); R(1, -6, 5, 6, sh);
    R(-8, -22, 16, 16, st); R(-7, -21, 14, 14, "#dfe2ec"); R(-1, -21, 2, 14, sh);
    R(-11, -21, 3, 12, st); R(8, -21, 3, 12, st);
    R(9, -18, 7, 9, "#d8b25a"); R(10, -17, 5, 7, "#8a2a3a"); R(12, -16, 1, 5, "#ffd84a");
    if (free) {
      R(-5, -31, 10, 9, "#f0c8a0"); R(-6, -33, 12, 4, "#8a5a3a"); R(-7, -32, 3, 3, "#8a5a3a"); R(5, -34, 2, 3, "#8a5a3a");
      R(-3, -28, 1, 1, "#1a1a22"); R(2, -28, 1, 1, "#1a1a22"); R(-2, -25, 4, 1, "#a04040");
      R(-16, -6, 7, 6, st); R(-15, -4, 5, 1, "#1a1a22");
    } else { R(-5, -32, 10, 10, st); R(-4, -28, 8, 1.5, "#1a1a22"); R(-1, -36, 2, 4, "#ff2b45"); }
  },
  f_deusex(cx, by, t, e, u = 5) {
    const down = e && e.sp >= 100, lift = down ? 0 : 8 + Math.sin(t * 1.6) * 2, oy = by - lift * u, R = P(cx, oy, u);
    if (!down) { ctx.fillStyle = "#8a7a5a"; const top = by - 46 * u, bot = oy - 30 * u; if (bot > top) ctx.fillRect(cx - u * .4, top, u * .8, bot - top); }
    else { R(-3, -34, 6, 2, "#8a7a5a"); R(-5, -32, 10, 2, "#8a7a5a"); }
    R(-12, -30, 24, 4, "#b08a3e"); R(-14, -26, 28, 14, "#ffd84a"); R(-13, -25, 26, 2, "#fff0a0");
    ctx.save(); ctx.translate(cx - 9 * u, oy - 19 * u); ctx.rotate(t * (down ? .3 : 2));
    ctx.fillStyle = "#b08a3e"; for (let i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.fillRect(-u * .6, -3.5 * u, u * 1.2, 2 * u); }
    ctx.beginPath(); ctx.arc(0, 0, 2.2 * u, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    R(-2, -22, 3, down ? 2 : 1, "#1a1a22"); R(5, -22, 3, down ? 2 : 1, "#1a1a22"); R(0, -17, 6, 1, "#7a5a2a");
    R(-16, -12, 9, 4, "#f6f6f2"); R(-8, -11, 10, 4, "#f6f6f2"); R(3, -12, 12, 4, "#f6f6f2"); R(-12, -9, 22, 3, "#e8e8f0");
    if (!down) for (let i = 0; i < 3; i++) R(-10 + i * 9, -6 + ((t * 8 + i * 3) % 5), 1, 1, "#ffd84a");
  },
  f_purple(cx, by, t, e, u = 5) {
    const k = e ? Math.min(1, (e.sp || 0) / 100) : 0, col = k >= 1 ? "#d8c0f0" : "#9a4ad8";
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = u * 1.1; ctx.lineCap = "round";
    const n = Math.round(7 - k * 4);
    for (let i = 0; i < n; i++) { const a = t * .8 + i * 1.1, r = (9 + i * 1.7) * u; ctx.beginPath(); ctx.arc(cx, by - 20 * u, r * .55, a, a + 2.2); ctx.stroke(); }
    ctx.restore();
    const R = P(cx, by + Math.sin(t * 2) * 2, u);
    R(-6, -26, 12, 14, col); R(-7, -14, 14, 6, col);
    for (let i = 0; i < 4; i++) R(-7 + i * 3.6, -8, 3, 3 + ((i + Math.floor(t * 3)) % 2) * 2, col);
    R(-3, -22, 2, 2, "#fff"); R(2, -22, 2, 2, "#fff");
    if (k >= 1) { R(-2, -18, 4, 1, "#3a1a4a"); R(-3, -19, 1, 1, "#3a1a4a"); R(2, -19, 1, 1, "#3a1a4a"); }
    else R(-1, -19, 2, 3, "#3a1a4a");
    R(7, -32, 2, 12, "#f6f6f2"); R(8, -34, 3, 5, "#f6f6f2");
    if (k < 1) { const w = ["lo!", "o,", "verily", "thus"]; txt(w[Math.floor(t) % 4], cx - 15 * u, by - 34 * u, "#c89ae8", 5 * u, "center"); }
  },
  f_cliche(cx, by, t, e, u = 5) {
    const real = e && e.sp >= 100, oy = by + Math.sin(t * 2) * 1.5, R = P(cx, oy, u);
    R(-4, -7, 2, 7, "#5a4a30"); R(2, -7, 2, 7, "#5a4a30"); R(-5, -1, 3, 1, "#3a3020"); R(2, -1, 3, 1, "#3a3020");
    ctx.fillStyle = "#9a8a60"; ctx.beginPath(); ctx.arc(cx, oy - 18 * u, 12 * u, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#d8c8a0"; ctx.beginPath(); ctx.arc(cx, oy - 18 * u, 10.5 * u, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.arc(cx - 4 * u, oy - 23 * u, 3 * u, 0, Math.PI * 2); ctx.fill();
    R(-5, -21, 2, 2, "#3a3020"); R(3, -21, 2, 2, "#3a3020");
    if (!real) {
      R(-6, -16, 5, 2, "#2a2018"); R(1, -16, 5, 2, "#2a2018"); R(-7, -17, 2, 1, "#2a2018"); R(5, -17, 2, 1, "#2a2018");
      R(-6, -38, 12, 8, "#2a2a30"); R(-9, -30, 18, 2, "#2a2a30"); R(-6, -32, 12, 1, "#8a2a3a");
    } else {
      R(-4, -15, 8, 1, "#3a3020"); R(-5, -16, 1, 1, "#3a3020"); R(4, -16, 1, 1, "#3a3020");
      R(-8, -18, 2, 1, "#e8a0a0"); R(6, -18, 2, 1, "#e8a0a0");
    }
  },
  happilyever(cx, by, t, e, u = 3.6) {
    const soft = e && e.sp >= 100, sway = Math.sin(t * 1.2) * 1.5, R = P(cx, by, u);
    R(-22, -44, 21, 30, "#efe2c0"); R(1, -44, 21, 30, "#efe2c0"); R(-1, -45, 2, 32, "#8a2a3a");
    for (let i = 0; i < 6; i++) { R(-19, -40 + i * 4, 15, 1, "#b8a070"); R(4, -40 + i * 4, 15, 1, "#b8a070"); }
    R(-23, -45, 46, 2, "#d8b25a"); R(-23, -15, 46, 2, "#d8b25a");
    R(-9, -32, 18, 28, "#8a2a3a"); R(-10, -8, 20, 4, "#6a1a2a"); R(-2, -32, 4, 26, "#d8b25a");
    R(-10, -33, 20, 3, "#f6f6f2"); for (let i = 0; i < 5; i++) R(-9 + i * 4, -32, 1, 1, "#1a1a22");
    R(-6, -44, 12, 11, "#f6e0c0");
    if (!soft) {
      R(-4, -40, 3, 1, "#3a2a1a"); R(1, -40, 3, 1, "#3a2a1a");
      R(-3, -36, 6, 1, "#a03040"); R(-4, -37, 1, 1, "#a03040"); R(3, -37, 1, 1, "#a03040");
      R(-5, -38, 2, 1, "#f0a0a0"); R(3, -38, 2, 1, "#f0a0a0");
    } else {
      R(-4, -41, 2, 2, "#3a2a1a"); R(2, -41, 2, 2, "#3a2a1a"); R(3, -39, 1, 2, "#57dbff"); R(-2, -36, 4, 1, "#a03040");
    }
    const cs = soft ? 2 : 0;
    R(-7 + cs, -48 + cs * .5, 14, 4, "#ffd84a"); R(-7 + cs, -51 + cs * .5, 2, 3, "#ffd84a"); R(-1 + cs, -52 + cs * .5, 2, 4, "#ffd84a"); R(5 + cs, -51 + cs * .5, 2, 3, "#ffd84a");
    R(-1 + cs, -47 + cs * .5, 2, 2, "#ff2b45");
    R(11, -40 + sway, 2, 30, "#d8b25a"); R(12, -48 + sway, 4, 9, "#f6f6f2"); R(13, -46 + sway, 1, 6, "#d8d0c0");
    R(13, -30 + sway, 8, 3, "#ff2b45"); R(19, -27 + sway, 2, 3, "#ff2b45");
    R(9, -24, 4, 3, "#f6e0c0"); R(-13, -24, 4, 3, "#f6e0c0");
    for (let i = 0; i < 4; i++) {
      const k = (t * .7 + i * .25) % 1;
      if (Math.sin(t * 5 + i * 2) > .3) R(-20 + i * 13, -50 + k * 40, 1, 1, "#fff8c0");
    }
  }
});

/* ---------- NPC sprites ---------- */
Object.assign(NPC_DRAW, {
  f_prologue(cx, by, t, u = 2) {
    const R = P(cx, by + (Math.sin(t * 3) > .9 ? -u : 0), u);
    R(-5, -4, 4, 4, "#5a3a2a"); R(1, -4, 4, 4, "#5a3a2a");
    R(-6, -20, 12, 16, "#efe2c0"); R(-7, -20, 14, 2, "#d8c8a0"); R(-7, -6, 14, 2, "#d8c8a0");
    R(-4, -16, 8, 1, "#8a7f68"); R(-4, -13, 6, 1, "#8a7f68"); R(-4, -10, 7, 1, "#8a7f68");
    R(-5, -28, 10, 8, "#f0c8a0"); R(-3, -25, 2, 2, "#1a1a22"); R(2, -25, 2, 2, "#1a1a22"); R(-1, -22, 2, 1, "#a04040");
    R(-6, -31, 12, 3, "#8a2a3a"); R(4, -35, 2, 5, "#ffd84a");
    R(6, -19, 6, 2, "#ffd84a"); R(11, -21, 3, 6, "#ffd84a");
  },
  f_talltale(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-4, -4, 3, 4, "#2a1a12"); R(1, -4, 3, 4, "#2a1a12");
    R(-3, -24, 6, 20, "#5a3a6a"); R(-4, -24, 8, 3, "#7a5a8a"); R(-2, -20, 4, 14, "#efe2c0");
    R(-6, -22, 2, 12, "#5a3a6a"); R(4, -22, 2, 12, "#5a3a6a");
    R(-3, -31, 6, 7, "#f0c8a0"); R(-2, -28, 1, 1, "#1a1a22"); R(1, -28, 1, 1, "#1a1a22"); R(-3, -26, 6, 1, "#3a2a1a");
    R(-3, -46, 6, 15, "#2a2a30"); R(-5, -32, 10, 2, "#2a2a30"); R(-3, -36, 6, 1, "#ffd84a");
    R(5, -11, 6, 1, "#b8a070"); R(7, -14, 3, 3, "#efe2c0");
  },
  f_first(cx, by, t, u = 2) {
    const R = P(cx, by, u), pt = Math.sin(t * 3) > 0 ? 0 : 1;
    R(-5, -5, 4, 5, "#3a3a5a"); R(1, -5, 4, 5, "#3a3a5a");
    R(-6, -18, 12, 13, "#d86a3a"); R(-1, -16, 2, 8, "#ffd84a"); R(-2, -16, 4, 1, "#ffd84a"); R(-2, -9, 4, 1, "#ffd84a");
    R(-5, -27, 10, 9, "#f0c8a0"); R(-5, -28, 10, 3, "#2a1a12");
    R(-3, -24, 2, 2, "#1a1a22"); R(2, -24, 2, 2, "#1a1a22"); R(-1, -21, 3, 1, "#a04040");
    R(-9, -16, 3, 8, "#d86a3a"); R(-7, -15 - pt, 3, 2, "#f0c8a0");
  },
  f_second(cx, by, t, u = 2) {
    const R = P(cx, by, u), j = Math.sin(t * 2.5) > .6 ? 1 : 0;
    R(-5, -5, 4, 5, "#2a3a4a"); R(1, -5, 4, 5, "#2a3a4a");
    R(-6, -18, 12, 13, "#3a8aa8"); R(-6, -18, 12, 2, "#2a6a88");
    R(-5, -27, 10, 9, "#f0c8a0"); R(-6, -29, 12, 3, "#d8b25a"); R(-6, -27, 2, 4, "#d8b25a");
    R(-4, -25, 3, 3, "#fff"); R(1, -25, 3, 3, "#fff"); R(-3, -24, 1.5, 1.5, "#1a1a22"); R(2, -24, 1.5, 1.5, "#1a1a22");
    R(-1, -21, 2, 1, "#a04040");
    R(4, -16, 6, 3, "#3a8aa8"); R(9, -17 + j, 3, 3, "#f0c8a0"); R(11, -16 + j, 3, 1, "#f0c8a0");
  },
  f_omni(cx, by, t, u = 2) {
    const f = Math.sin(t * 2) * u * 1.5, R = P(cx, by - 6 * u + f, u);
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(cx - 6 * u, by - 2 * u, 12 * u, 2 * u);
    R(-9, -22, 8, 14, "#3a5a8a"); R(1, -22, 8, 14, "#3a5a8a"); R(-8, -21, 7, 12, "#efe2c0"); R(1, -21, 7, 12, "#efe2c0");
    R(-1, -23, 2, 16, "#2a3a6a");
    R(-5, -18, 10, 6, "#fff"); R(-2, -17, 4, 4, "#3a5a8a"); R(-1, -16, 2, 2, "#1a1a22");
    if (Math.sin(t * 4) > 0) { R(-1, -28, 2, 3, "#ffd84a"); R(-11, -25, 2, 2, "#ffd84a"); R(9, -25, 2, 2, "#ffd84a"); }
  },
  f_lamp(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-5, -5, 4, 5, "#3a2a1a"); R(1, -5, 4, 5, "#3a2a1a");
    R(-6, -19, 12, 14, "#2a3a6a"); for (let i = 0; i < 5; i++) R(-5 + hash(i, 2) * 9, -18 + i * 3, 1, 1, "#ffd84a");
    R(-5, -27, 10, 8, "#f0c8a0"); R(-3, -24, 2, 2, "#1a1a22"); R(2, -24, 2, 2, "#1a1a22"); R(-1, -21, 3, 1, "#a04040");
    R(-6, -30, 12, 3, "#8a2a3a"); R(-3, -32, 6, 2, "#8a2a3a");
    R(7, -38, 1.5, 34, "#6a4a2a"); R(5, -18, 4, 2, "#f0c8a0");
    const g = .5 + .5 * Math.sin(t * 3);
    R(6, -41, 4, 4, g > .5 ? "#ffd84a" : "#ffe890");
  },
  f_moral(cx, by, t, u = 2) {
    const R = P(cx, by, u), bl = (t % 4) < .15;
    R(-4, -3, 3, 3, "#e8a040"); R(1, -3, 3, 3, "#e8a040");
    R(-6, -20, 12, 17, "#8a6a4a"); R(-5, -14, 10, 10, "#c8a878");
    R(-6, -23, 3, 3, "#8a6a4a"); R(3, -23, 3, 3, "#8a6a4a");
    R(-5, -19, 4, 4, "#fff"); R(1, -19, 4, 4, "#fff");
    if (bl) { R(-5, -17, 4, 1, "#1a1a22"); R(1, -17, 4, 1, "#1a1a22"); } else { R(-4, -18, 2, 2, "#1a1a22"); R(2, -18, 2, 2, "#1a1a22"); }
    R(-6, -20, 5, 1, "#3a3a44"); R(1, -20, 5, 1, "#3a3a44"); R(-1, -18, 2, 1, "#3a3a44");
    R(-1, -15, 2, 2, "#e8a040");
    R(10, -10, 1, 7, "#6a4a2a"); R(7, -15, 7, 5, "#efe2c0"); R(8, -13, 5, 1, "#8a7f68");
  },
  f_wolf(cx, by, t, u = 2) {
    const R = P(cx, by, u), wag = Math.sin(t * 6) > 0 ? 1 : 0;
    R(-5, -4, 3, 4, "#5a5a66"); R(2, -4, 3, 4, "#5a5a66");
    R(-6, -18, 12, 14, "#8a8a9a"); R(-4, -15, 8, 10, "#c8c8d4");
    R(6, -10 - wag, 5, 2, "#8a8a9a"); R(10, -12 - wag, 2, 3, "#8a8a9a");
    R(-5, -27, 10, 9, "#8a8a9a"); R(-6, -30, 3, 4, "#8a8a9a"); R(3, -30, 3, 4, "#8a8a9a");
    R(-2, -22, 4, 3, "#c8c8d4"); R(-1, -22, 2, 1, "#1a1a22");
    R(-4, -25, 2, 2, "#ffd84a"); R(2, -25, 2, 2, "#ffd84a"); R(-3, -24, 1, 1, "#1a1a22"); R(3, -24, 1, 1, "#1a1a22");
    R(-10, -13, 4, 3, "#f6f6f2"); R(-11, -14, 6, 1, "#f6f6f2"); R(-6, -12, 1, 2, "#f6f6f2");
    R(-3, -18, 2, 2, "#8a2a3a"); R(1, -18, 2, 2, "#8a2a3a"); R(-1, -17.5, 2, 1, "#d8a630");
  },
  f_extra(cx, by, t, u = 2) {
    const R = P(cx, by + (Math.sin(t * 1.3) > .95 ? -u * .5 : 0), u);
    R(-6, -2, 12, 2, "#8a6a4a"); R(-1, -6, 2, 4, "#8a6a4a");
    R(-6, -29, 12, 23, "#c8a878"); R(5, -29, 1, 23, "#a08858");
    R(-4, -28, 8, 4, "#8a90a4"); R(-4, -24, 8, 5, "#f0c8a0"); R(-3, -22, 1, 1, "#1a1a22"); R(2, -22, 1, 1, "#1a1a22"); R(-1, -20, 2, 1, "#a04040");
    R(-5, -19, 10, 10, "#3a6a9a"); R(-1, -19, 2, 10, "#d8a630"); R(-4, -9, 3, 3, "#3a3a44"); R(1, -9, 3, 3, "#3a3a44");
    R(7, -34, 1, 30, "#6a4a2a"); R(6, -37, 3, 3, "#c8ccd8");
  },
  happilyever(cx, by, t, u = 2) { MON_DRAW.happilyever(cx, by, t, { sp: G && G.flags.boss_happilyever === "spare" ? 100 : 0 }, u * .5); },
  f_window(cx, by, t, u = 2) {
    const R = P(cx, by, u), free = G && (G.flags.juniFound || G.flags.boss_happilyever);
    R(-7, -31, 14, 16, "#5a4a3a"); R(-6, -33, 12, 2, "#5a4a3a"); R(-4, -34, 8, 1, "#5a4a3a");
    R(-6, -30, 12, 14, free ? "#3a2a4a" : "#ffd88c");
    if (!free) {
      const w = Math.sin(t * 2) > .3;
      R(-3, -27, 6, 3, "#e8a040"); R(-2, -25, 4, 3, "#8a5a3a"); R(-1, -24, 1, 1, "#1a1a22"); R(1, -24, 1, 1, "#1a1a22");
      R(-3, -22, 6, 5, "#3a8a6a");
      if (w) R(3, -27, 2, 3, "#8a5a3a");
    } else { R(-6, -30, 3, 14, "#8a2a3a"); R(3, -30, 3, 14, "#8a2a3a"); }
    R(-8, -16, 16, 2, "#d8c8a0");
    R(-9, -26, 2, 10, "#5a8a3a"); R(7, -30, 2, 12, "#5a8a3a");
    R(-3, -5, 6, 5, "#b5653a"); R(-2, -8, 4, 3, "#5a8a3a"); R(-1, -10, 2, 2, "#e86a9a");
  },
  f_star(cx, by, t, u = 2) {
    const g = .5 + .5 * Math.sin(t * 3 + cx), y0 = by - 6 * u;
    ctx.save(); ctx.globalAlpha *= .25 + .2 * g; ctx.fillStyle = "#ffd84a";
    ctx.beginPath(); ctx.arc(cx, y0, 9 * u, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#ffd84a"; ctx.beginPath();
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 2.6 * u : 6 * u, a = -Math.PI / 2 + i * Math.PI / 5 + .3; ctx.lineTo(cx + Math.cos(a) * r, y0 + Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff8c0"; ctx.fillRect(cx - u, y0 - u, u, u);
  },
  f_crown(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-12, -2, 5, 2, "#d8d0bb"); R(8, -3, 5, 2, "#d8d0bb"); R(-3, -1, 4, 1, "#d8d0bb");
    R(-7, -6, 14, 4, "#a89a70"); R(-7, -9, 2, 3, "#a89a70"); R(-1, -10, 2, 4, "#a89a70"); R(5, -9, 2, 3, "#a89a70");
    R(-1, -5, 2, 2, "#6a5a5a");
  }
});
