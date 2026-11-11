"use strict";
/* ============================================================
   VOIDHEART — Episode 3, region 2: THE MARGINALIA
   The margins of the world itself: white paper, blue rules,
   a red line down the side, and every note ever scribbled
   before it soaks down into Hollowmere.
   Area "marg", rooms "e3m_", boss THE DOODLER, Lost Page X.
   See docs/EP3_SPEC.md.
   ============================================================ */
POOLS.marg = ["wrongway", "underscore", "grinface", "scratchout", "coffeering"];
PAL.marg = {
  floor: "#f6f3e8", alt: "#f1ede0", spec: "#7a9ad0", wall: "#1e2436", face: "#e6dfca", line: "#c4bb9e",
  rug: "#fff27a", rug2: "#f2d23a", shelf: "#8a6a4a", grass: "#3a5ad0", grass2: "#d23a3a"
};
AREAS.marg = { name: "THE MARGINALIA", music: "marg", sub: "the edge of every page ever written" };

Object.assign(ITEMS, {
  m_cap: { name: "Highlighter Cap", type: "key", desc: "A little yellow cap. It has waited a hundred years to click onto something." },
  m_stroke: { name: "Last Stroke", type: "key", desc: "Dayglo's last stroke of yellow. Enough to make exactly one true thing stand out." },
  m_sticky: { name: "Sticky Snack", type: "heal", heal: 22, price: 16, desc: "A sticky note folded into a snack. It reminds you to eat it." },
  m_cocoa: { name: "Margin Cocoa", type: "heal", heal: 32, price: 26, desc: "Someone left it on a page at 3 a.m. Still warm." },
  m_redink: { name: "Red Ink Tea", type: "heal", heal: 48, price: 40, desc: "Old Rubric's own blend. Corrects your posture." },
  m_vest: { name: "Index Card Vest", type: "armor", def: 8, price: 65, desc: "Forty index cards laced together. Every one says IMPORTANT. DEF +8." },
  m_rubricpen: { name: "Retired Red Pen", type: "weapon", atk: 12, desc: "Old Rubric's working pen. It only corrects lies now. ATK +12." }
});
Object.assign(SPEAKERS, {
  asterisk: { name: "ASTERISK", voice: 640 },
  rubric: { name: "OLD RUBRIC", voice: 170 },
  dayglo: { name: "DAYGLO", voice: 380 },
  caret: { name: "CARET", voice: 470 },
  doodler: { name: "THE DOODLER", voice: 250 }
});
Object.assign(SONGS, {
  marg: { bpm: 92, tracks: [
    { w: "triangle", v: .05, n: "C5 - E5 G5 - E5 D5 - C5 - A4 - G4 - - - A4 - C5 D5 - C5 E5 - D5 - C5 - D5 - - -" },
    { w: "sine", v: .065, n: "C3 - - - G2 - - - A2 - - - E2 - - - F2 - - - C3 - - - G2 - - - G2 - - -" },
    { w: "square", v: .008, n: ". . C6 . . . G5 . . . C6 . . . E6 ." }] },
  doodler: { bpm: 138, tracks: [
    { w: "square", v: .022, n: "G4 B4 D5 G5 . F#5 D5 . E5 G5 B5 . A5 . F#5 . G4 B4 D5 G5 . A5 B5 . C6 . B5 . A5 . F#5 ." },
    { w: "triangle", v: .075, n: "G2 G3 G2 G3 G2 G3 G2 G3 E2 E3 E2 E3 C2 C3 D2 D3 G2 G3 G2 G3 G2 G3 G2 G3 C2 C3 C2 C3 D2 D3 D2 D3" },
    { w: "sawtooth", v: .01, n: "D5 - - - - - - - B4 - - - - - - - C5 - - - - - - - A4 - - - - - - -" }] }
});

/* ---------- custom tiles: 4 ruled paper, 5 doodle marks, 6 red margin line ---------- */
TILE_DRAW["4"] = (x, y) => { ctx.fillStyle = "#a9c4ea"; ctx.fillRect(x, y + 26, TILE, 2); };
TILE_DRAW["5"] = (x, y, tx, ty, pal, t, W, h) => {
  TILE_DRAW["4"](x, y);
  ctx.save(); ctx.lineCap = "round";
  if (h < .4) {
    ctx.strokeStyle = "rgba(150,100,60,.45)"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x + 16, y + 16, 10 + h * 4, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(150,100,60,.2)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x + 17, y + 15, 7 + h * 3, .4, 4.6); ctx.stroke();
  } else if (h < .7) {
    const a = Math.floor(h * 40) % 4 * Math.PI / 2;
    ctx.translate(x + 16, y + 16); ctx.rotate(a);
    ctx.strokeStyle = "#5a7cf0"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-10, 2); ctx.quadraticCurveTo(0, -4, 10, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(5, -5); ctx.lineTo(10, 0); ctx.lineTo(4, 4); ctx.stroke();
  } else {
    ctx.translate(x + 16, y + 15); ctx.strokeStyle = "#d23a3a"; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3 + h; ctx.beginPath(); ctx.moveTo(-Math.cos(a) * 6, -Math.sin(a) * 6); ctx.lineTo(Math.cos(a) * 6, Math.sin(a) * 6); ctx.stroke(); }
  }
  ctx.restore();
};
TILE_DRAW["6"] = (x, y, tx, ty, pal, t, W) => {
  const room = W && W.roomId;
  if (room === "e3m_spine") {
    ctx.fillStyle = "#d8cfb4"; ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "#b8ad8e"; ctx.fillRect(x, y + 14, TILE, 4);
    ctx.strokeStyle = "#3a3a5a"; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x + 6, y + 6); ctx.lineTo(x + 26, y + 26); ctx.moveTo(x + 26, y + 6); ctx.lineTo(x + 6, y + 26); ctx.stroke();
    ctx.fillStyle = "#1e2436"; ctx.fillRect(x + 4, y + 4, 4, 4); ctx.fillRect(x + 24, y + 4, 4, 4); ctx.fillRect(x + 4, y + 24, 4, 4); ctx.fillRect(x + 24, y + 24, 4, 4);
    return;
  }
  TILE_DRAW["4"](x, y);
  if (room === "e3m_gutter") {
    const left = W.tile(tx - 1, ty) !== "6";
    ctx.fillStyle = "rgba(40,44,80,.10)"; ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "rgba(40,44,80,.16)"; ctx.fillRect(left ? x + 16 : x, y, 16, TILE);
    if (!left) { ctx.fillStyle = "rgba(30,30,60,.45)"; ctx.fillRect(x - 1, y, 2, TILE); }
    return;
  }
  ctx.fillStyle = "#e0525a"; ctx.fillRect(x + 11, y, 2, TILE); ctx.fillRect(x + 18, y, 2, TILE);
};
SOLID.add("6");

/* ---------- new bullet patterns ---------- */
/* m_scrawl: a pen tip doodles a loop through the box, and its trail lingers */
PAT.m_scrawl = { box: [260, 190], dur: 6, def: { col: "#7a9cff" }, fn(B, S, P, dt, b) {
  if (!S.init) {
    S.init = 1; S.ph = pick([1.1, 2.0, 4.2, 5.1]);
    S.pen = () => {
      const I = b.ibox, k = S.t * P.s;
      return { x: I.x + I.w / 2 + Math.sin(k * 1.7 + S.ph) * I.w * .42, y: I.y + I.h / 2 + Math.sin(k * 2.6 + S.ph * 2) * I.h * .4 };
    };
    b.spawn({ x: 0, y: 0, r: 7, col: "#f6f3e8", shape: "diamond", life: 99, upd(o) { const p = S.pen(); o.x = p.x; o.y = p.y; o.vx = 0; o.vy = 0; } });
  }
  if (tick(S, .055 / P.d, dt)) { const p = S.pen(); b.spawn({ x: p.x, y: p.y, r: 3.5, col: P.col, shape: "orb", life: 1.1 + .4 * P.d }); }
} };
/* m_underline: everything you stand on gets underlined. Hard. */
PAT.m_underline = { box: [280, 170], dur: 5.5, def: { col: "#ff6b7a" }, fn(B, S, P, dt, b) {
  if (tick(S, .9 / P.d, dt, "c", .4)) {
    const y = clamp(b.soul.y, B.y + 10, B.y + B.h - 10), fromLeft = (S.n = (S.n || 0) + 1) % 2 === 1;
    b.spawn({ x: B.x + B.w / 2, y, w: B.w, h: 14, shape: "warn", col: "#ff2b45", life: .62,
      upd(o) {
        if (o.t > .55 && !o.fired) {
          o.fired = 1; Sound.sfx("slash"); const I = b.ibox;
          b.spawn({ x: fromLeft ? I.x - 40 : I.x + I.w + 40, y, vx: (fromLeft ? 760 : -760) * P.s, vy: 0, w: 80, h: 8, col: P.col, shape: "bar", life: 1.2 });
        }
      } });
  }
  if (tick(S, .45 / P.d, dt, "e", .8)) b.spawn({ x: B.x + 10 + rand(B.w - 20), y: B.y - 10, vx: 0, vy: 95 * P.s, r: 7, col: "#f6f3e8", shape: "char", ch: "!" });
} };

/* ---------- monsters ---------- */
Object.assign(MONSTERS, {
  wrongway: {
    name: "Wrongway", area: "marg", hp: 100, atk: 7, def: 2, exp: 34, gold: 22, voice: 420,
    check: "WRONGWAY - ATK 7 DEF 2\n* A drawn arrow that only points the wrong way.\n* It means well. It means very, very well.",
    intro: "* Wrongway points dramatically at the exit.\n* The exit is behind you. It's pointing at a wall.",
    flavor: ["* Wrongway is pointing at the sky. The sky is not an option.", "* Wrongway spins, settles, and points at its own tail.", "* Smells like a ballpoint pen and total confidence."],
    spareFlavor: "* Wrongway is pointing at you. For once, that's correct.",
    talk: ["THAT way! no. THAT way!", "trust me. i'm an ARROW.", "everyone who follows me ends up SOMEWHERE."],
    spareTalk: "...i pointed at YOU. and you were THERE!",
    acts: {
      "Ask Directions": e => {
        e.sp += e.asked ? 10 : 20; e.asked = 1; e.reply = "OH! a QUESTION! it's... that way!";
        return "* You ask Wrongway the way out.\n* It points, thrilled, at a coffee stain.";
      },
      "Turn Around": e => {
        if (!e.asked) { e.reply = "...where are you GOING?"; return "* You turn around for no reason.\n* Wrongway is confused. You didn't ask it anything."; }
        e.sp += e.turned ? 30 : 50; e.turned = 1; e.reply = "the RIGHT way?? because of ME?";
        return "* You face exactly the opposite of where Wrongway points.\n* It's the right way. With Wrongway, it always is.";
      },
      "Correct It": e => {
        e.sp -= 15; e.rage = 1; e.reply = "I KNOW. i can't HELP it.";
        return "* You tell Wrongway it's pointing the wrong way.\n* It already knew. Everybody tells it. Its tip droops.";
      }
    },
    pats: [{ id: "loop", col: "#7a9cff" }, { id: "side", col: "#ff6b7a" }]
  },
  underscore: {
    name: "Underscore", area: "marg", hp: 110, atk: 7, def: 3, exp: 38, gold: 26, voice: 260,
    check: "UNDERSCORE - ATK 7 DEF 3\n* An underline that emphasizes EVERYTHING.\n* When everything matters, nothing does.",
    intro: "* Underscore slides under your feet.\n* You suddenly feel VERY important. And VERY tired.",
    flavor: ["* Underscore is underlining the word 'the'. Twice.", "* Underscore vibrates with EMPHASIS.", "* Every word near Underscore sounds LOUDER."],
    spareFlavor: "* Underscore is resting under one small word.",
    talk: ["THIS is IMPORTANT.", "and THIS. and THIS!!", "LOOK. at. EVERYTHING."],
    spareTalk: "...just that one. that's the one.",
    acts: {
      "Listen": e => {
        e.sp += e.heard ? 10 : 20; e.heard = 1; e.reply = "you're LISTENING?! to ALL of it??";
        return "* You listen to everything Underscore says is important.\n* It takes a while. It's ALL important.";
      },
      "Pick One Word": e => {
        if (!e.heard) { e.reply = "PICK?? from WHAT??"; return "* You'd have to hear what it's emphasizing first."; }
        e.sp += e.picked ? 25 : 45; e.picked = 1; e.reply = "...only 'please'? just... please?";
        return "* Out of everything, you pick one word: 'please.'\n* Underscore tries underlining only that.\n* It's the most important it has ever felt.";
      },
      "Shout Back": e => {
        e.sp -= 15; e.rage = 1; e.reply = "YES!! LOUDER!! EVERYTHING!!";
        return "* You shout something back, with emphasis.\n* Underscore gets thicker. And louder. Oops.";
      }
    },
    pats: [{ id: "m_underline", col: "#ff6b7a" }, { id: "lasers", col: "#7a9cff" }]
  },
  grinface: {
    name: "Grin", area: "marg", hp: 95, atk: 6, def: 2, exp: 32, gold: 24, voice: 560,
    check: "GRIN - ATK 6 DEF 2\n* A doodled smiley that can't stop smiling.\n* Its cheeks have been sore since the day it was drawn.",
    intro: "* Grin bounces in, smiling!\n* (Grin is always smiling.)",
    flavor: ["* Grin's smile is a little too wide to be comfortable.", "* Grin is smiling at nothing in particular. Hard.", "* Someone drew Grin in a hurry and never came back."],
    spareFlavor: "* Grin's face has relaxed into something smaller. Something real.",
    talk: [":) everything's GREAT!", ":) :) :)", ":) ...ask me later. :)"],
    spareTalk: "...this face is mine. i picked it.",
    acts: {
      "Ask How It Is": e => {
        e.sp += e.asked ? 10 : 30; e.asked = 1; e.reply = ":) ...tired. :) so tired.";
        return "* You ask Grin how it's really doing.\n* It keeps smiling. But its eyes go somewhere far away.";
      },
      "Draw New Face": e => {
        if (!e.asked) { e.reply = ":D a NEW smile?!"; return "* You start drawing a new face for Grin.\n* It smiles harder. It doesn't know you mean it kindly."; }
        e.sp += e.drew ? 20 : 45; e.drew = 1; e.reply = "...i'm allowed a SLEEPY face?";
        return "* You draw Grin a small, sleepy face, just for a minute.\n* It wears it gratefully. Its cheeks finally rest.";
      },
      "Say Cheese": e => {
        e.sp -= 15; e.rage = 1; e.reply = ":D !!! :D !!!";
        return "* You say 'cheese!'\n* Grin smiles so hard it creaks.\n* That was the opposite of helpful.";
      }
    },
    pats: [{ id: "ring", col: "#ffd84a" }, { id: "flutter", col: "#f6f3e8" }]
  },
  scratchout: {
    name: "Scratchout", area: "marg", hp: 120, atk: 8, def: 2, exp: 40, gold: 28, voice: 300,
    check: "SCRATCHOUT - ATK 8 DEF 2\n* A word somebody crossed out in a hurry.\n* It still wants to be read.",
    intro: "* Scratchout scribbles into view!\n* Underneath all those lines, there's a word.",
    flavor: ["* Scratchout's lines are scratching at each other.", "* You can almost read what's underneath.", "* Scratchout smells like a pencil pressed too hard."],
    spareFlavor: "* Scratchout's lines have loosened. The word shows through.",
    talk: ["XXXXXX.", "i was a word. i WAS.", "they changed their mind about me."],
    spareTalk: "maybe. that's me. MAYBE.",
    acts: {
      "Read Through": e => {
        e.read = (e.read || 0) + 1;
        if (e.read > 3) { e.sp += 10; e.reply = "...still me."; return "* You read it again. It still says 'maybe.'\n* Scratchout likes being read twice."; }
        e.sp += 25;
        if (e.read === 1) { e.reply = "...you can SEE me?"; return "* You squint through the scribble.\n* There's an M. And a Y."; }
        if (e.read === 2) { e.reply = "keep GOING..."; return "* You look harder. M... A... Y...\n* 'May'? No. There's more."; }
        e.reply = "...they wrote NEVER over me.";
        return "* MAYBE. The word is 'maybe.'\n* Someone crossed out 'maybe' and wrote 'never' beside it.";
      },
      "Say It Aloud": e => {
        if ((e.read || 0) < 2) { e.reply = "say WHAT? you can't read me."; return "* You open your mouth to read it out loud.\n* ...You don't know what it says yet."; }
        if (e.said) { e.sp += 10; e.reply = "again! AGAIN!"; return "* You say it again: 'maybe.'\n* Scratchout glows a little."; }
        e.said = 1; e.sp += 40; e.reply = "...you SAID me. out LOUD.";
        return "* You read the crossed-out word out loud: 'maybe.'\n* Scratchout stops scratching.\n* Somebody finally read it.";
      },
      "Cross It Out": e => {
        e.sp -= 20; e.rage = 1; e.reply = "AGAIN?? EVERYONE DOES THAT.";
        return "* You add another line through Scratchout.\n* It scribbles itself darker. It's used to this.";
      }
    },
    pats: [{ id: "shred", col: "#7a9cff" }, { id: "letters", word: "MAYBENEVERMAYBE", col: "#f6f3e8" }]
  },
  coffeering: {
    name: "Coffee Ring", area: "marg", hp: 105, atk: 7, def: 3, exp: 36, gold: 30, voice: 200,
    check: "COFFEE RING - ATK 7 DEF 3\n* Left by a mug at 3 a.m., beside a sentence nobody finished.\n* Terrified of napkins.",
    intro: "* A Coffee Ring seeps up out of the page.\n* It smells like a very long night.",
    flavor: ["* Coffee Ring is still faintly warm.", "* Coffee Ring keeps looking around for its mug.", "* There's a sentence beside Coffee Ring. It stops halfway."],
    spareFlavor: "* Coffee Ring has a friend now. They overlap a little.",
    talk: ["...where's my mug?", "they set me down and never came back.", "please don't wipe me. please."],
    spareTalk: "two rings. like a pair of glasses. heh.",
    acts: {
      "Ask About Mug": e => {
        e.sp += e.asked ? 10 : 25; e.asked = 1; e.reply = "it said WORLD'S OKAYEST WRITER.";
        return "* You ask about the mug.\n* Someone stayed up all night writing something hard.\n* They kept starting over. The mug kept them company.";
      },
      "Set Yours Down": e => {
        if (!e.asked) { e.reply = "...what are you doing?"; return "* You mime setting down a mug.\n* Coffee Ring doesn't get it. It doesn't know you yet."; }
        e.sp += e.set ? 15 : 50; e.set = 1; e.reply = "...a ring? next to MINE?";
        return "* You set an imaginary mug down right beside it.\n* Now there are two rings, overlapping a little.\n* It isn't the only stain on the page anymore.";
      },
      "Wipe It Up": e => {
        e.sp -= 20; e.rage = 1; e.reply = "NO NO NO not the NAPKIN";
        return "* You reach for a napkin.\n* Coffee Ring boils with panic. Wrong move.";
      }
    },
    pats: [{ id: "ringwave", col: "#c8925a" }, { id: "blot", col: "#c8925a" }]
  },

  /* ---------- THE DOODLER ---------- */
  doodler: {
    name: "The Doodler", area: "marg", hp: 380, atk: 8, def: 3, exp: 90, gold: 70, voice: 250, boss: true, bar: true,
    title: "THE DOODLER // ANNOTATOR OF THE MARGINS", music: "doodler", noFlee: true,
    intro: "* The Doodler starts drawing a battle.\n* It doesn't finish the edges. You'll have to make do.",
    init: () => ({ drawn: 0, wip: null, sits: 0 }),
    checkFn: e => "THE DOODLER - ATK 8 DEF 3\n* An Annotator. It sketches revisions for whatever is below.\n* Has started 40,000 drawings. " + (e.drawn ? `Finished ${e.drawn}.` : "Finished none."),
    actNames() {
      const a = ["Watch It Draw", "Finish a Line", "Erase Mistake", "Sit With It", "Write STET"];
      if (G && G.flags.m_firstread) a.push("Show the Note");
      a.push("Draw Together");
      return a;
    },
    acts: {
      "Watch It Draw": e => {
        const D = MARG_DRAWINGS;
        if (e.wip) { e.sp += 4; e.reply = "shh! it's going to be a—"; return `* You keep watching. It's still drawing ${D[e.wip].name}.\n* It's started three more things around it.`; }
        if (e.drawn >= D.length) { e.sp += 6; e.reply = "...you're still HERE?"; return "* It starts something new. A sun. A boat. A dog.\n* Then it looks over at you, checking you're still here."; }
        e.wip = e.drawn; e.sp += 10; e.reply = D[e.wip].start;
        return D[e.wip].watch;
      },
      "Finish a Line": e => {
        if (e.wip === null || e.wip === undefined) { e.reply = "finish WHAT? there's so much—"; return "* You look for a line to finish.\n* Everything here is half-done. You don't know where to start.\n* (Maybe watch what it's drawing first.)"; }
        const d = MARG_DRAWINGS[e.wip];
        e.wip = null; e.drawn++; e.sp += 18; e.reply = d.reply;
        return d.finish;
      },
      "Erase Mistake": e => {
        e.sp -= 15; e.rage = 1; e.reply = "DON'T!! every line is a MAYBE!";
        return "* You rub out a wobbly line.\n* The Doodler shrieks. It was going to be a dog. Probably.";
      },
      "Sit With It": e => {
        if (!e.drawn) { e.sp += 4; e.reply = "can't sit. drawing. DRAWING!"; return "* You sit down on the page beside the Doodler.\n* It's too busy starting things to notice."; }
        e.sits++; e.sp += e.sits > 2 ? 6 : 12; e.reply = "...you're staying? like the cat?";
        return "* You sit beside the Doodler and the things you finished together.\n* For once it isn't drawing. It's just... with someone.";
      },
      "Write STET": e => {
        if (!e.drawn) { e.reply = "nothing's DONE, there's nothing to—"; return "* You uncap the Pen of STET.\n* But nothing here is finished yet.\n* There's nothing to let stand."; }
        if (e.stet) { e.reply = "they're staying. they're STAYING."; return "* STET is already written beside the finished drawings.\n* They're not going anywhere."; }
        e.stet = 1; e.sp += 20; e.reply = "...nobody below can take them?";
        return "* You write STET beside the finished drawings. Let it stand.\n* Whatever is below can't approve them away now.";
      },
      "Show the Note": e => {
        if (e.note) { e.reply = "a rumor. just a rumor."; return "* The Doodler is still staring at the first note.\n* It holds its pencil differently now."; }
        e.note = 1; e.sp += 25; e.reply = "...it was only a RUMOR?";
        return "* You tell it the first note: 'I heard that anything written in the margins comes true.'\n* Nobody checked. Somebody just heard it.";
      },
      "Draw Together": e => {
        if (e.sp < 70) { e.reply = "together? i never— not YET—"; return "* You hold your pen next to the Doodler's.\n* It flinches. It isn't ready to finish something with someone."; }
        e.sp = 100; e.together = 1; e.reply = "...";
        return "* You draw one thing together, start to finish:\n* two stick figures holding hands in the corner of the page.\n* The Doodler doesn't start anything else.";
      }
    },
    talkFn(e) {
      if (e.sp >= 100) return e.together ? "...we FINISHED it. and it's still here." : "...it's done. and it's still here.";
      if (e.reply) { const r = e.reply; e.reply = null; return r; }
      const N = ["hold STILL, i'm drawing you a—", "a cat! no, a kite! no—", "everything i finish LEAVES.", "below wants them finished. i WON'T.", "half a friend is better than none.", "...isn't it?"];
      return N[Math.min(e.turn - 1, N.length - 1)];
    },
    flavorFn(e) {
      if (e.sp >= 100) return "* The Doodler's pencil is resting. Nothing new is being started.";
      if (e.drawn >= 2) return "* The finished cat is sitting on the Doodler's foot. Purring.";
      if (e.drawn >= 1) return "* The finished cat watches you both. It's still here.";
      if (e.hp < e.maxhp * .3) return "* The Doodler's lines are going faint.";
      return pick(["* The Doodler starts a bird, then a bicycle, then a bird again.", "* Half-drawn things crowd the page around you.", "* Smells like pencil shavings and panic."]);
    },
    pattern(e) {
      const ph = e.sp >= 70 ? 2 : e.hp / e.maxhp < .5 ? 1 : 0;
      const L = [
        [{ id: "m_scrawl", col: "#7a9cff" }, { id: "flutter", col: "#f6f3e8" }, { id: "m_underline", col: "#ff6b7a" }],
        [{ id: "m_scrawl", col: "#7a9cff", d: 1.25, s: 1.1 }, { id: "snake", col: "#7a9cff" }, { id: "letters", word: "ALMOSTDONEALMOST", col: "#f6f3e8" }, { id: "m_underline", col: "#ff6b7a", d: 1.2 }],
        [{ id: "flutter", col: "#f6f3e8", d: .8 }, { id: "m_scrawl", col: "#ffd84a", d: .7, s: .8 }, { id: "tiny", col: "#f6f3e8" }]
      ][ph];
      const p = Object.assign({}, L[e.turn % L.length]);
      p.d = (p.d || 1) * (1 - Math.min(.25, e.sp / 400));
      return p;
    },
    onHit(e) { e.reply = pick(["OW! that line was going to be a BIRD.", "you smudged the—!", "...is that what finishing feels like?"]); },
    deathLines: () => ["...wait. i wasn't—", "...i wasn't finished...", "..."],
    spareLines: e => e.drawn >= 3
      ? ["...the cat stayed.", "the house kept its light on.", "and the kid has a face now. a smiling one.", "...finished things can STAY. i didn't know."]
      : ["...it's finished.", "and it's still HERE.", "...finished things can stay. i didn't know."]
  }
});
const MARG_DRAWINGS = [
  { name: "a cat", start: "a CAT! it's gonna be a—",
    watch: "* The Doodler starts a cat. Ears, whiskers, one eye...\n* It stops at the tail and looks at you, hopeful.",
    finish: "* You draw the cat's tail. One curl. Done.\n* The cat blinks, stretches, and sits on the Doodler's foot.\n* It doesn't sink away. It stays.",
    reply: "it... it STAYED?" },
  { name: "a house", start: "a HOUSE! with a—",
    watch: "* It starts a house. Walls, a door, a window...\n* It stops before the roof. A roof would make it done.",
    finish: "* You draw the roof, and a little chimney.\n* A light turns on in the window. Someone's home.",
    reply: "a light! someone's HOME!" },
  { name: "a kid with a telescope", start: "...this one. this one's—",
    watch: "* It starts a kid holding a telescope up at the sky.\n* Hair, jacket, a scarf with stars on it...\n* It stops before the face.",
    finish: "* You draw the face last. You don't know whose face it is.\n* You give it a big, goofy grin. It feels right.\n* The Doodler goes very quiet.",
    reply: "...below said leave that one OUT." }
];

/* ---------- dialogue ---------- */
function margArrival() {
  World.busy = true;
  G.flags.m_arrived = true;
  const a = [
    "* You squeeze through the crack in the basement wall...",
    "* ...and step out onto paper.",
    "* White paper, as far as you can see, ruled in faint blue lines. Somewhere far off, a red line runs down the world like a fence.",
    "* Beyond it, enormous printed words loom over the horizon, too big to read.",
    "* You're standing in the margin. The edge of the page. The edge of EVERY page.",
    "* Notes drift past overhead like slow birds. All in the same small, neat handwriting.",
    E3.stet()
      ? "* The Pen of STET is warm in your pocket. The copies in Carbon Town made it. It feels stubborn. Good."
      : "* The Pen of STET is warm in your pocket. Quill made it from their most stubborn feather. It feels stubborn. Good."];
  if (E3.vantaAlive()) a.push("* Far, far below, you think you hear someone turn a very old page. Probably the wind. Paper has a lot of wind.");
  Dialog.open(a, () => { World.busy = false; });
}
function margAsteriskTalk() {
  if (G.flags.m_metaster) {
    return [L("asterisk", pick([
      "I'd point you the right way, but I've been wrong so often I stopped trusting my arm.",
      "If you find something true out there, come tell me! I've got an arm all ready!",
      "The notes up here are drafts. When they're finished they float off and sink. I've never seen where they go.",
      "Old Rubric's camp is past the ruled plains, by the red line. He's grumpy. It's load-bearing grumpy."]))];
  }
  G.flags.m_metaster = true;
  const a = [
    "* A little ink star is bouncing on the spot, one arm stuck straight out.",
    L("asterisk", "OH! A reader! A real one! Hi! Hello! Look over THERE!"),
    L("asterisk", "...No, sorry. Habit. There's nothing over there. I'm an asterisk. Pointing is my whole job."),
    L("asterisk", "Well. WAS my whole job. I used to point at the small print. 'See below.' 'Terms apply.' 'Results may vary.'"),
    L("asterisk", "Then the notes up here started lying, and I was pointing people at lies all day long. So I quit."),
    L("asterisk", "Now I just want to point at ONE true thing. Just one. Before I get smudged, or turned into a bullet point."),
    L("asterisk", "Oh! Welcome to the Marginalia, by the way! The edge of every page ever written."),
    L("asterisk", "Everyone thinks the margins are empty. They're NOT. I live here! I have a mailbox! It's also an asterisk!"),
    L("asterisk", "Go right, across the ruled plains. Old Rubric keeps a camp by the red line. Tell him the star sent you.")];
  if (E3.ep1Void()) a.push(
    L("asterisk", "...Also. There's a note about you, farther down the page. It says you erased a whole Archive once."),
    L("asterisk", "I tried to point at it and say 'lie.' My arm wouldn't go."));
  return a;
}
function margAsteriskDotsTalk() {
  if (G.flags.m_dots) return [L("asterisk", "A STAR! A real one! Can I point at it? I'm pointing at it. Look at me pointing at it!")];
  return [
    L("asterisk", "Connect-the-dots! My favorite! I'm basically made of dots. Well. One dot and some lines."),
    L("asterisk", "It's supposed to be a star. People always go round the edge like a clock. That gets you a pentagon."),
    L("asterisk", "Pentagons are fine. Pentagons are NOT stars."),
    L("asterisk", "Start at the top dot. Then skip one. Always skip one. And never lift your pencil!")];
}
function margAsteriskSpineTalk() {
  if (G.flags.boss_doodler === "kill") return [
    L("asterisk", "..."),
    L("asterisk", "I was going to point at you. I was going to say 'that one's true.'"),
    L("asterisk", "...My arm's stuck again. Sorry. Go on through.")];
  if (G.flags.m_pointed) return [L("asterisk", "Still true! Still pointing! You can't stop me! Nobody can stop me!")];
  G.flags.m_pointed = true;
  return [
    L("asterisk", "I followed you! Quietly! Mostly quietly!"),
    L("asterisk", "I've been looking for something true to point at this whole time. And I think I finally found it."),
    "* Asterisk lifts its arm, very carefully, and points at you.",
    L("asterisk", "THAT one. That one's true."),
    L("asterisk", "...Oh, that feels good. That feels SO good. Go on. Go find whoever else needs pointing at.")];
}
function margShop() {
  Shop.open(["m_sticky", "m_cocoa", "m_redink", "m_vest", "patchkit"], "rubric", "Sticky notes, cocoa, red ink tea. All proofread for flavor. No refunds, no revisions.", "Mind the margins on your way out. They're narrower than they look.");
}
function margRubricTalk() {
  const shopLine = L("rubric", "Supplies are by the lamp, if you need 'em. Don't touch the lamp. The lamp is retired too.", { after: margShop });
  if (!G.flags.m_metrubric) {
    G.flags.m_metrubric = true; G.flags.m_quest = true;
    const a = [
      "* An old red pen sits in a folding chair, his cap pushed up like reading glasses.",
      L("rubric", "Hm. A reader. Haven't had one of those up here since the footnotes unionized."),
      L("rubric", "Name's Rubric. Old Rubric, these days. Forty years marking margins in red. 'See me.' 'Awk.' 'Citation needed.'"),
      L("rubric", "Nobody ever came to see me. I'm not bitter. I'm red. It's different."),
      L("rubric", "I retired the day the notes up here started being wrong on purpose. I correct mistakes, kid. I don't write them."),
      L("rubric", "So now I run Camp Retraction. Retired annotators only. Tea, a lamp, and no revisions after nine.")];
    if (E3.stet()) a.push(L("rubric", "...Hold on. You've got STET on you. I can smell it. Best word in the language. Here. On the house.", { give: "m_redink" }));
    if (E3.vantaAlive()) a.push(L("rubric", "There's a masked archivist down in the Archive who used to send me corrections in purple ink. Tell it its semicolons are still wrong."));
    a.push(
      L("rubric", "Since you're here. Want a job? Unpaid. Character-building."),
      L("rubric", "Every note up here came from another note. Notes on notes on notes. But somewhere there's a FIRST one."),
      L("rubric", "The very first note anybody ever wrote in these margins. Find it, and you'll know how all this started."),
      L("rubric", "It'll be somewhere old. The oldest page there is, with its corner folded down. North of the doodle fields, last I heard."),
      L("rubric", "Problem is, it was written in pencil, and pencil fades. You'll need something to make it stand out. Ask Dayglo. If she's awake."),
      L("rubric", "Then come back and tell me what it says. I've been wondering for forty years."),
      shopLine);
    return a;
  }
  if (G.flags.m_firstread && !G.flags.m_questdone) {
    if (G.inv.length >= 8) return [L("rubric", "You found it? Good. I've got something for you, but your pockets are stuffed. Make room and come back.")];
    G.flags.m_questdone = true;
    return [
      L("rubric", "You found it? The first note? Well, don't just stand there leaking. What did it say?"),
      "* You tell him: 'I heard that anything written in the margins comes true.'",
      L("rubric", "...That's it? That's the FIRST note?"),
      L("rubric", "Not a fact. Not even a lie. A rumor. 'I heard.' Somebody heard something, wrote it down, and nobody ever checked."),
      L("rubric", "And everything since got written on top of it. Every kind little lie in your town is standing on 'I heard.'"),
      L("rubric", "Forty years I've waited to mark that one."),
      "* Old Rubric takes a scrap of paper and writes, very small, in red: CITATION NEEDED.",
      L("rubric", "...There. Felt good. Felt REALLY good."),
      L("rubric", "Take my pen. The working one. It only corrects lies now. Retired, like me. Still sharp, like me.", { give: "m_rubricpen" }),
      L("rubric", "And kid? Whoever wrote that reply underneath... they meant well. That's the dangerous kind.")];
  }
  if (G.flags.m_questdone) return [L("rubric", pick([
    "CITATION NEEDED. I wrote it on my mirror, too. Every morning I agree with it.",
    "Forty years of 'see me.' Then a kid actually comes to see me. Hm. Don't tell anyone I smiled.",
    "Rumors are just notes nobody checked. Check everything, kid. Especially the nice ones."])), shopLine];
  return [L("rubric", G.flags.m_capped
    ? "Got Dayglo's yellow? Good. The oldest page is north of the doodle fields. Corner folded down. Mind the coffee rings."
    : "The first note's somewhere old, north of the doodle fields. Pencil, faded. Dayglo's yellow would bring it up, if she had any left."), shopLine];
}
function margDaygloTalk() {
  if (G.flags.m_capped) {
    const names = E3.restoredNames();
    if (G.flags.m_firstread) return [
      L("dayglo", "...a rumor? I spent my last yellow on a rumor?"),
      L("dayglo", "...No. I spent it on finding OUT it was a rumor. That's different."),
      L("dayglo", "That's the most important thing I ever highlighted. ...mm. Wake me if anything else matters.")];
    if (names.length && !G.flags.m_dayNames) {
      G.flags.m_dayNames = true;
      return [L("dayglo", `...mm. Saw some names coming back up through the pages, a while ago. ${names.slice(0, 3).join(", ")}.`), L("dayglo", "I gave them a little highlight. Just a little. Felt right.")];
    }
    return [L("dayglo", pick([
      "...don't spend the yellow on a lie. ...mm. I spent a whole life on those.",
      "The oldest page is north of the doodles. Folded corner. Everything old folds at the corner. Me too.",
      "...zz... I'm awake. I'm listening. I'm resting my eyes AT you."]))];
  }
  if (G.inv.includes("m_cap")) {
    G.inv = G.inv.filter(k => k !== "m_cap");
    G.flags.m_capped = true; G.flags.m_metday = true;
    return [
      L("dayglo", "...mm? ...is that... is that my CAP?"),
      L("dayglo", "I lost that a hundred years ago. Left it off one night. Woke up dry."),
      "* You click the cap back onto Dayglo. She shivers. Somewhere inside her, a little yellow comes back.",
      L("dayglo", "...oh. Oh, that's nice. That's like a nap, but for the inside of you."),
      L("dayglo", "I don't have much left. Enough for one stroke. One true thing."),
      L("dayglo", "Here. Don't spend it on anything that isn't true. I spent a whole life on those.", { give: "m_stroke" })];
  }
  if (!G.flags.m_metday) {
    G.flags.m_metday = true;
    return [
      "* A fat yellow highlighter is asleep on a yellow patch of page. She's very faded.",
      L("dayglo", "...zz... mm. Hi. Sorry. I'm Dayglo. I'm awake. Mostly."),
      L("dayglo", "I used to highlight the important parts. Then they told me everything was important. So I highlighted everything."),
      L("dayglo", "Whole pages. Whole books. Bright yellow, edge to edge. And then nothing stood out at all."),
      L("dayglo", "That's when I got tired. You can't make everything matter. You just run out."),
      L("dayglo", "Also I lost my cap. That didn't help. Dried right out. If you see a little yellow cap out there..."),
      "* Dayglo has fallen back asleep."];
  }
  return [L("dayglo", "...mm. My cap rolled off somewhere on the ruled plains, I think. Toward the far end. Everything rolls right, on a page.")];
}
function margCaretTalk() {
  if (G.flags.m_metcaret) return [L("caret", pick([
    "Every finished note goes down. Every unfinished one stays up here, waiting. Funny how that works.",
    "^ I keep wanting to insert a 'not' into those approved notes. 'The bakery was NOT always closed.' Old habits.",
    "Be kind to the Doodler. It's lonely. Half-finished things can't keep anyone company.",
    "The stamp is always purple. Purple is a color for things that want to look official without looking angry."]))];
  G.flags.m_metcaret = true;
  const a = [
    "* A small upside-down V stands at the edge of the ink, watching notes sink into the page.",
    L("caret", "^ Pardon me. Inserting myself. Caret. Insertion mark. Retired. Quite recently."),
    L("caret", "My job was inserting the words people left out. A forgotten 'not.' A dropped 'the.' Small, honest work."),
    L("caret", "This is the Bleed-Through. When a note up here is finished, the ink soaks down through the page."),
    L("caret", "Through every page under this one. All the way to the bottom. And from the bottom, it soaks back UP."),
    L("caret", "Into the world. Into a town called Hollowmere. You may have seen the results on your mirror."),
    L("caret", "Only the finished ones, mind you. Something down there checks each one first."),
    "* A note sinks past you. As it goes under, a word blooms across it in purple ink: APPROVED.",
    L("caret", "I used to insert words that were missing. Something down there inserts words that were never there at all."),
    L("caret", "I don't know who's approving them. I know the handwriting, though. Small. Neat. Very patient.")];
  if (E3.solAlly()) a.push(L("caret", "A light came up through here last month. It glowed. Said its own name like it was proud of it: SOL. It said, 'Somebody is writing over things. I know what that's like.'"));
  a.push(L("caret", "The Doodler is just past here, at the spine. Draws all day. Never finishes a thing."),
    L("caret", "Which, frankly, is the only reason that town of yours still has anything true left in it."));
  return a;
}
function margHalfcatTalk() {
  if (G.flags.m_halfcat) return ["* Half a cat. It's purring at you again.", "* Exactly half as loud as a whole cat. Exactly twice as sweet."];
  G.flags.m_halfcat = true;
  return ["* Half a cat, drawn in blue ballpoint. Front half only. It just... stops.", "* You pet it anyway.", "* It purrs. Exactly half as loud as a whole cat.", "* That was real. You felt it."];
}
function margFirstNoteTalk() {
  if (G.flags.m_firstread) {
    const a = ["* The first note. Faded pencil, one stripe of yellow.", "* 'I heard that anything written in the margins comes true.'", "* And underneath: 'Then I'll write that nobody has to be sad.'"];
    if (G.flags.m_questdone) a.push("* In the margin of the margin, in red, someone has added: CITATION NEEDED.");
    return a;
  }
  if (G.inv.includes("m_stroke")) return [
    "* A tiny scrap of paper, older than the corner it's tucked into.",
    "* The pencil has faded almost to nothing.",
    { t: "* Use Dayglo's last stroke of yellow on it?", ch: ["Highlight", "Not yet"], on: i => i !== 0 ? ["* You leave it be, for now."] : margReadFirstNote() }];
  if (G.flags.m_quest || G.flags.m_metday) return [
    "* A tiny scrap of paper, older than the corner it's tucked into.",
    "* This could be it. The very first note.",
    "* But the pencil has faded almost to nothing. You'd need something to make it stand out."];
  return ["* A tiny scrap of paper, tucked into the fold.", "* Something is written on it in pencil, too faint to read."];
}
function margReadFirstNote() {
  G.inv = G.inv.filter(k => k !== "m_stroke");
  G.flags.m_firstread = true;
  Sound.sfx("bell");
  E3.addEvidence("firstnote", "The first note ever written");
  return [
    "* You draw one careful stroke of yellow across the faded line.",
    "* The words lift off the page like they've been waiting a very long time.",
    "* 'I heard that anything written in the margins comes true.'",
    "* That's all. No name. No source. Somebody just... heard.",
    "* Underneath, in a different hand, someone has written a reply:",
    "* 'Then I'll write that nobody has to be sad.'",
    "* The second handwriting is small and neat. You've seen it before.",
    "* On your mirror.",
    "* You fold the note carefully into your pocket. Somebody, someday, is going to need to see this."];
}

/* ---------- the boss ---------- */
function margDoodlerEvent() {
  World.busy = true;
  G.flags.m_doodlerMet = true;
  Dialog.open([
    "* The page here is covered in half-drawn things. Half a bicycle. Two-thirds of a tree. A door with no handle.",
    "* In the middle of it all, something enormous and scribbly is drawing as fast as it can.",
    L("doodler", "OH! OH! A NEW— hold still, I'll draw you a— no wait, I already started you, look—"),
    "* Somewhere in the scribble is a sketch of MILO. It stops at the shoulders.",
    L("doodler", "I'm the Doodler! I draw things into BEING! Cats! Houses! Weather! A whole town, once! Mostly!"),
    L("doodler", "Below says draw it, I draw it. When a drawing's finished, it sinks. Below stamps it. And then it's GONE. Down into the world."),
    L("doodler", "So I don't finish. If I don't finish, they stay. Up here. With me."),
    L("doodler", "...But half a cat can't sit on your lap. Half a friend can't stay for dinner. They just wait. Like me."),
    L("doodler", "You're FINISHED, aren't you? All the way to the edges! Stay! Stay and I'll draw you a—"),
    L("doodler", "—don't LEAVE, everyone who's finished LEAVES—")], () => {
    startEncounter("doodler", { onEnd: E3.bossEnd("doodler", res => margDoodlerAfter(res)) });
  });
}
function margDoodlerAfter(res) {
  World.busy = true;
  const done = () => { World.busy = false; World.buildEnts(); saveGame(); };
  if (res === "kill") {
    Dialog.open([
      "* The half-drawn things on the page fade, one by one.",
      "* Half a bicycle. Two-thirds of a tree. The door with no handle.",
      "* The sketch of the kid with the telescope goes last.",
      "* The stitches in the spine go slack. The way through is open."], done);
    return;
  }
  Dialog.open([
    L("doodler", "...it's finished. And it's still HERE."),
    L("doodler", "The cat stayed. And you stayed. You stayed the whole time."),
    L("doodler", "I think I was scared that finished means gone. But you're finished all the way to the edges, and you're right here."),
    L("doodler", "That kid. The one with the telescope. Below told me to draw your town without them."),
    L("doodler", "I couldn't. I kept drawing them back in. Below kept sending the page back. 'Leave that one OUT.'"),
    L("doodler", "If you find them... tell them the Doodler kept their spot. I drew a little star where they used to stand."),
    L("doodler", "The spine's that way. It binds every page to the next. Past it is the Fiction Quarter, where the stories live."),
    L("doodler", "I'll draw you a door. And this time I'll finish it."),
    "* The Doodler draws a door into the stitching of the spine. It finishes the handle with a little flourish.",
    "* The door doesn't sink away. It stays."], done);
}

/* ---------- rooms ---------- */
Object.assign(ROOMS, {
  e3m_gutter: {
    area: "marg", map: [
      "########################",
      "########################",
      "##444444444664444444444#",
      "##4P4444444664444444P4##",
      "##44444,444664444,4444##",
      "444444444444444444444444",
      "444444444444444444444444",
      "444444444444444444444444",
      "##444444444664444,4444##",
      "##4P44,4444664444444P4##",
      "##444444444664444444444#",
      "########################",
      "########################"],
    exits: [{ x: 23, y: 5, w: 1, h: 3, to: "e3m_ruled", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 5, ty: 4, text: () => ["* THE GUTTER.", "* (n.) The blank space where two pages meet.", "* Things fall in here and get stuck. Crumbs. Eyelashes. Small doubts."] },
      { k: "npc", id: "asterisk", tx: 16, ty: 3, talk: () => margAsteriskTalk() }],
    triggers: [{ x: 2, y: 2, w: 1, h: 9, if: () => !G.flags.m_arrived, run: () => margArrival() }]
  },
  e3m_ruled: {
    area: "marg", enc: true, map: [
      "##############################",
      "##############################",
      "##44444444444444444444444444##",
      "##444~~4444444445444444P4444##",
      "##444~~44444,444444444444444##",
      "444444444444444444444444444444",
      "444444444445444444444444444444",
      "444444444444444444444444444444",
      "##4444444444444~~~4444444444##",
      "##4P4444544444~~~~44444,4444##",
      "##44444444444444444444444P44##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3m_gutter", tx: 22, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3m_camp", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 9, ty: 3, text: () => ["* A margin note, in pencil: 'remember to buy milk.'", "* Under it, in small neat handwriting: 'There was never any milk.'", "* Someone else has crossed that out. Hard. Twice."] },
      { k: "item", tx: 24, ty: 9, item: "m_cap", flag: "it_m_cap" },
      E3.falseNote({
        flag: "m_note_empty", region: "marg", tx: 14, ty: 2,
        lie: "THE MARGINS ARE EMPTY. NOBODY LIVES HERE.",
        need: () => !!G.flags.m_metaster,
        hint: ["* That doesn't feel right. But who would live all the way out here?"],
        truth: ["* Asterisk lives here. It has a mailbox. The mailbox is also an asterisk.", "* Margins are never empty. That's where people write what they really think.", "* Tucked behind the note, someone left a snack."],
        onStrike: () => { if (addItem("m_sticky")) Toast.show("GOT: STICKY SNACK"); }
      })]
  },
  e3m_camp: {
    area: "marg", map: [
      "########################",
      "########################",
      "##44464444444444444444##",
      "##44464444444444444444##",
      "##4,4644444444444444,4##",
      "444444444444444444444444",
      "444444444444444444444444",
      "444444444444444444444444",
      "##44464444444444RRRR44##",
      "##444644444444L4RRRR44##",
      "##44464444444444444444##",
      "########################",
      "########################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3m_ruled", tx: 28, ty: 6, dir: "left" },
      { x: 23, y: 5, w: 1, h: 3, to: "e3m_doodles", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "sign", tx: 3, ty: 3, text: () => ["* THE RED LINE.", "* Teachers drew it so nobody would write in the margin.", "* Everybody wrote in the margin anyway. That's what margins are for."] },
      { k: "sign", tx: 10, ty: 2, text: () => ["* CAMP RETRACTION.", "* Retired annotators welcome.", "* No revisions after nine. No exceptions. (No exceptions to the no-exceptions rule.)"] },
      { k: "save", tx: 8, ty: 9 },
      { k: "npc", id: "rubric", tx: 13, ty: 3, talk: () => margRubricTalk() },
      { k: "npc", id: "dayglo", tx: 18, ty: 8, talk: () => margDaygloTalk() }]
  },
  e3m_doodles: {
    area: "marg", enc: true, map: [
      "##############44##############",
      "##############44##############",
      "##**44444444444444444444**44##",
      "##*444454444444444444444444*##",
      "##4444444444**44444445444444##",
      "44444444444444444444444444444" + "4",
      "4444*4444444444444444444**4444",
      "444444444444444444444444444444",
      "##44444444445444444**4444444##",
      "##*4444**444444444444444444*##",
      "##**4444444444444444444444**##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3m_camp", tx: 22, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3m_dots", tx: 1, ty: 6, dir: "right" },
      { x: 14, y: 0, w: 2, h: 1, to: "e3m_corner", tx: 9, ty: 10, dir: "up" }],
    ents: [
      { k: "deco", id: "m_halfcat", tx: 6, ty: 3, talk: () => margHalfcatTalk() },
      { k: "deco", id: "m_halfhouse", tx: 21, ty: 9, talk: () => ["* A house with walls and a door, but no roof.", "* A little stick figure stands inside, looking up.", "* It seems to be enjoying the view. You can see every star from in there."] },
      { k: "sign", tx: 11, ty: 9, text: () => ["* Every doodle here stops partway.", "* A bicycle with one wheel. A sun with three rays. A word that ends in 'wh—'.", "* Something big has been through here, starting things."] },
      { k: "item", tx: 3, ty: 4, item: "m_cocoa", flag: "it_m_cocoa1" },
      E3.falseNote({
        flag: "m_note_half", region: "marg", tx: 25, ty: 3,
        lie: "A HALF-FINISHED THING ISN'T REAL.",
        need: () => !!G.flags.m_halfcat,
        hint: ["* You're not sure. You haven't met anything half-finished yet. Not up close."],
        truth: ["* Half a cat purred at you. That was real.", "* A story that stops in the middle still happened. Every word of it.", "* Behind where the note hung, a mug of cocoa is cooling."],
        onStrike: () => { if (addItem("m_cocoa")) Toast.show("GOT: MARGIN COCOA"); }
      })]
  },
  e3m_corner: {
    area: "marg", map: [
      "####################",
      "####################",
      "##4444444444444#####",
      "##44P44444444444####",
      "##4444445444444444##",
      "##4444444444444444##",
      "##444P444444544444##",
      "##4444444444444444##",
      "##4444444444444P44##",
      "##4544444444444444##",
      "##4444444444444444##",
      "#########44#########",
      "#########44#########"],
    exits: [{ x: 9, y: 12, w: 2, h: 1, to: "e3m_doodles", tx: 14, ty: 2, dir: "down" }],
    ents: [
      { k: "sign", tx: 10, ty: 3, text: () => ["* The oldest page in the margins. It's gone soft and yellow.", "* Long ago, somebody folded its corner down to keep their place.", "* They never came back to finish reading."] },
      { k: "deco", id: "m_firstnote", tx: 4, ty: 5, talk: () => margFirstNoteTalk() },
      { k: "page", tx: 15, ty: 9, page: "p10" }]
  },
  e3m_dots: {
    area: "marg",
    puzzle: { flag: "m_dots", key: "m_dotsk", order: ["10,2", "13,9", "5,5", "15,5", "7,9"],
      wrong: "* The line wobbles off into a pentagon. The dots go dim. Start again from the top.",
      done: [
        "* The last line closes. The dots blaze up into a five-pointed star.",
        "* ...You've drawn a star like this before. Someone sat next to you and said: 'Don't lift the pencil. Stars hate that.'",
        "* You can't remember their face. You remember they were laughing.",
        "* The door in the margin swings open."] },
    map: [
      "####################",
      "####################",
      "##44444444o4444444##",
      "##4444444444444444##",
      "##4444444444444444##",
      "44444o444444444o444D",
      "4444444444444444444D",
      "4444444444444444444D",
      "##4444444444444444##",
      "##44444o44444o4444##",
      "##4444444444444444##",
      "####################",
      "####################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3m_doodles", tx: 28, ty: 6, dir: "left" },
      { x: 19, y: 5, w: 1, h: 3, to: "e3m_bleed", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "npc", id: "asterisk", tx: 3, ty: 3, talk: () => margAsteriskDotsTalk() },
      { k: "sign", tx: 16, ty: 3, text: () => G.flags.m_dots
        ? ["* A star, drawn without lifting the pencil.", "* Nobody told you how. Your hand just knew."]
        : ["* CONNECT THE DOTS!", "* (Picture: a star.)", "* Someone has added, in pencil: 'not a pentagon. trust me.'"] }]
  },
  e3m_bleed: {
    area: "marg", enc: true, map: [
      "##############################",
      "##############################",
      "##444444444444444444444444,4##",
      "##44444444~~~~~~~~~444444444##",
      "##4444444~~~~~~~~~~~44444444##",
      "4444444444~~~~~~~~~44444444444",
      "444444444444444444444444444444",
      "444444444444444444444444444444",
      "##444444444444~~~~~~44444444##",
      "##44,444444~~~~~~~~~~4444444##",
      "##44444444444~~~~~~444444444##",
      "##############################",
      "##############################"],
    exits: [
      { x: 0, y: 5, w: 1, h: 3, to: "e3m_dots", tx: 18, ty: 6, dir: "left" },
      { x: 29, y: 5, w: 1, h: 3, to: "e3m_spine", tx: 1, ty: 6, dir: "right" }],
    ents: [
      { k: "save", tx: 4, ty: 3 },
      { k: "npc", id: "caret", tx: 21, ty: 3, talk: () => margCaretTalk() },
      { k: "sign", tx: 7, ty: 9, text: () => ["* THE BLEED-THROUGH.", "* Where finished ink soaks down through the page.", "* Please do not lean over the edge. You may be approved."] },
      { k: "item", tx: 26, ty: 10, item: "m_sticky", flag: "it_m_sticky1" },
      E3.falseNote({
        flag: "m_note_stars", region: "marg", tx: 23, ty: 9,
        lie: "MILO HATES THE STARS. MILO NEVER LOOKED UP.",
        need: () => !!G.flags.m_dots,
        hint: ["* That's wrong. You're almost sure it's wrong.", "* But you can't remember WHY. Like a word on the tip of your tongue."],
        truth: ["* MILO loves the stars. Someone sat beside MILO on a roof once and named every one they could see.", "* Half the names were made up. That was the best part.", "* Folded behind the note: a cup of red ink tea, still steaming."],
        onStrike: () => { if (addItem("m_redink")) Toast.show("GOT: RED INK TEA"); }
      })]
  },
  e3m_spine: {
    area: "marg", map: [
      "##########################",
      "##########################",
      "##4646464646464646464#####",
      "##4444444444444444444#####",
      "##444,444444444444,44#####",
      "444444444444444444444D4444",
      "444444444444444444444D4444",
      "444444444444444444444D4444",
      "##4444444444444444444#####",
      "##44,4444444444444,44#####",
      "##4646464646464646464#####",
      "##########################",
      "##########################"],
    puzzle: { flag: "boss_doodler", key: "_m_spine" },
    exits: [{ x: 0, y: 5, w: 1, h: 3, to: "e3m_bleed", tx: 28, ty: 6, dir: "left" }],
    ents: [
      { k: "sign", tx: 4, ty: 3, text: () => ["* THE SPINE.", "* Every page in the world is stitched to the next one, here.", "* Past the stitches: the Fiction Quarter. Mind the plot holes."] },
      { k: "npc", id: "doodler", tx: 15, ty: 6, if: () => !G.flags.boss_doodler, talk: () => [] },
      { k: "npc", id: "doodler", tx: 16, ty: 3, if: () => G.flags.boss_doodler === "spare", talk: () => [L("doodler", pick([
        "I'm drawing a frame for the cat. I'll finish it tomorrow. ACTUALLY finish it.",
        "Say hi to the telescope kid. Tell them there's a star where they used to stand.",
        "The door's all done! Look at the handle! I did a flourish!"]))] },
      { k: "deco", id: "m_scribble", tx: 15, ty: 6, if: () => G.flags.boss_doodler === "kill", talk: () => ["* A loose scribble, going nowhere.", "* It stops in the middle of a line."] },
      { k: "npc", id: "asterisk", tx: 11, ty: 9, if: () => !!G.flags.boss_doodler, talk: () => margAsteriskSpineTalk() }],
    triggers: [{ x: 7, y: 2, w: 1, h: 9, if: () => !G.flags.boss_doodler, run: () => margDoodlerEvent() }]
  }
});

/* ---------- sprites ---------- */
Object.assign(MON_DRAW, {
  wrongway(cx, by, t, e, u = 5) {
    const ok = e && e.sp >= 100, wob = ok ? 0 : Math.sin(t * 2.3) * .18;
    ctx.save(); ctx.translate(cx, by - 18 * u + Math.sin(t * 2) * u); ctx.rotate(wob); if (!ok) ctx.scale(-1, 1);
    ctx.fillStyle = "#f6f3e8"; ctx.strokeStyle = "#5a7cf0"; ctx.lineWidth = u * .8; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-15 * u, -3 * u); ctx.lineTo(5 * u, -3 * u); ctx.lineTo(5 * u, -9 * u); ctx.lineTo(17 * u, 0);
    ctx.lineTo(5 * u, 9 * u); ctx.lineTo(5 * u, 3 * u); ctx.lineTo(-15 * u, 3 * u); ctx.closePath();
    ctx.fill(); ctx.stroke();
    const look = ok ? 1 : -1;
    ctx.fillStyle = "#1a1a22";
    ctx.fillRect((-7 + look) * u, -1.6 * u, 1.4 * u, 1.6 * u); ctx.fillRect((-3 + look) * u, -1.6 * u, 1.4 * u, 1.6 * u);
    ctx.fillRect(-6 * u, 1.2 * u, 3 * u, .6 * u);
    ctx.restore();
  },
  underscore(cx, by, t, e, u = 5) {
    const ok = e && e.sp >= 100, th = ok ? 2 : 4 + Math.abs(Math.sin(t * 6)) * 1.5;
    const R = P(cx + (ok ? 0 : Math.sin(t * 20) * .4), by, u);
    R(-18, -6 - th, 36, th, ok ? "#7a9cff" : "#ff6b7a");
    R(-5, -16, 3, 3, "#f6f3e8"); R(3, -16, 3, 3, "#f6f3e8");
    R(-4, -15, 1.4, 1.6, "#1a1a22"); R(4, -15, 1.4, 1.6, "#1a1a22");
    if (!ok) { R(-6, -19, 4, 1, "#f6f3e8"); R(3, -19, 4, 1, "#f6f3e8"); }
    if (ok) txt("please", cx, by - 24 * u, "#f6f3e8", 5 * u, "center");
    else for (let i = 0; i < 3; i++) txt("!", cx + (i - 1) * 12 * u, by - 28 * u - Math.abs(Math.sin(t * 4 + i)) * 3 * u, "#ff6b7a", 7 * u, "center");
  },
  grinface(cx, by, t, e, u = 5) {
    const ok = e && e.sp >= 100, y = by - 16 * u - Math.abs(Math.sin(t * (ok ? 1.5 : 4))) * 2 * u;
    ctx.save(); ctx.lineCap = "round";
    ctx.fillStyle = "#ffd84a"; ctx.strokeStyle = "#2a2a30"; ctx.lineWidth = u * .8;
    ctx.beginPath(); ctx.arc(cx, y, 14 * u, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#2a2a30";
    if (ok) {
      ctx.beginPath(); ctx.moveTo(cx - 7 * u, y - 4 * u); ctx.lineTo(cx - 3 * u, y - 4 * u); ctx.moveTo(cx + 3 * u, y - 4 * u); ctx.lineTo(cx + 7 * u, y - 4 * u); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, y + 2 * u, 4 * u, .2 * Math.PI, .8 * Math.PI); ctx.stroke();
    } else {
      ctx.fillRect(cx - 6 * u, y - 6 * u, 2 * u, 3 * u); ctx.fillRect(cx + 4 * u, y - 6 * u, 2 * u, 3 * u);
      ctx.strokeStyle = "rgba(42,42,48,.5)"; ctx.lineWidth = u * .4;
      ctx.beginPath(); ctx.arc(cx - 5 * u, y - 2.6 * u, 1.6 * u, .1 * Math.PI, .9 * Math.PI); ctx.arc(cx + 5 * u, y - 2.6 * u, 1.6 * u, .1 * Math.PI, .9 * Math.PI); ctx.stroke();
      ctx.strokeStyle = "#2a2a30"; ctx.lineWidth = u * .8; ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(cx, y, 10 * u, .1 * Math.PI, .9 * Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.lineWidth = u * .3; ctx.beginPath(); ctx.moveTo(cx - 9 * u, y + 3 * u); ctx.lineTo(cx + 9 * u, y + 3 * u); ctx.stroke();
      ctx.strokeStyle = "#d23a3a"; ctx.lineWidth = u * .4;
      for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(cx + s * (10 + i * 1.4) * u, y + 1 * u); ctx.lineTo(cx + s * (9 + i * 1.4) * u, y + 3 * u); ctx.stroke(); }
    }
    ctx.restore();
  },
  scratchout(cx, by, t, e, u = 5) {
    const k = e ? Math.min(1, (e.sp || 0) / 100) : 0, y = by - 20 * u;
    txt("maybe", cx, y - 6 * u, k > .5 ? "#fff" : "#cfd4e0", 11 * u, "center");
    ctx.save(); ctx.strokeStyle = "#5a7cf0"; ctx.lineWidth = u * .9; ctx.lineCap = "round";
    ctx.globalAlpha *= 1 - k * .85;
    ctx.beginPath();
    for (let i = 0; i <= 16; i++) {
      const x = cx + (i / 16 - .5) * 32 * u + Math.sin(t * 9 + i) * u * (1 - k), yy = y + (i % 2 ? -5 : 5) * u + Math.cos(t * 7 + i * 2) * u;
      if (i === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 17 * u, y); ctx.lineTo(cx + 17 * u, y + Math.sin(t * 3) * u); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#f6f3e8"; ctx.fillRect(cx - 5 * u, y - 12 * u, 3 * u, 3 * u); ctx.fillRect(cx + 2 * u, y - 12 * u, 3 * u, 3 * u);
    ctx.fillStyle = "#1a1a22"; ctx.fillRect(cx - 4 * u, y - 11 * u, 1.4 * u, 1.6 * u); ctx.fillRect(cx + 3 * u, y - 11 * u, 1.4 * u, 1.6 * u);
  },
  coffeering(cx, by, t, e, u = 5) {
    const ok = e && e.sp >= 100, y = by - 14 * u;
    ctx.save(); ctx.lineCap = "round";
    const ring = (x, a) => {
      ctx.globalAlpha = a; ctx.strokeStyle = "#c8925a"; ctx.lineWidth = 3 * u;
      ctx.beginPath(); ctx.arc(x, y, 12 * u, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = u; ctx.globalAlpha = a * .5; ctx.beginPath(); ctx.arc(x + u, y - u, 9 * u, .5, 4.8); ctx.stroke();
    };
    const a0 = ctx.globalAlpha;
    if (ok) ring(cx + 9 * u, a0 * .8);
    ring(ok ? cx - 7 * u : cx, a0);
    ctx.globalAlpha = a0;
    const ex = ok ? cx - 7 * u : cx;
    ctx.fillStyle = "#f6f3e8"; ctx.fillRect(ex - 5 * u, y - 3 * u, 3 * u, 3 * u); ctx.fillRect(ex + 2 * u, y - 3 * u, 3 * u, 3 * u);
    ctx.fillStyle = "#1a1a22";
    if (ok) { ctx.fillRect(ex - 5 * u, y - 1 * u, 3 * u, .8 * u); ctx.fillRect(ex + 2 * u, y - 1 * u, 3 * u, .8 * u); }
    else { ctx.fillRect(ex - 4 * u, y - 2 * u, 1.4 * u, 1.6 * u); ctx.fillRect(ex + 3 * u, y - 2 * u, 1.4 * u, 1.6 * u); }
    if (!ok) {
      ctx.strokeStyle = "rgba(230,230,240,.45)"; ctx.lineWidth = u * .6;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let s = 0; s <= 8; s++) { const yy = y - 15 * u - s * 1.5 * u, xx = cx + (i - 1) * 5 * u + Math.sin(t * 3 + s * .8 + i) * 1.6 * u; if (s === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); }
        ctx.stroke();
      }
    }
    ctx.restore();
  },
  doodler(cx, by, t, e, u = 4) {
    const k = e ? Math.min(1, (e.sp || 0) / 100) : 0, calm = k >= 1, drawn = (e && e.drawn) || 0;
    const ox = cx, oy = by - 24 * u + Math.sin(t * (calm ? 1 : 2.6)) * u;
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    // body: a loopy outline that closes as it calms down
    const cov = .62 + .38 * k, N = 64;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const a = -Math.PI / 2 + .4 + i / N * cov * Math.PI * 2;
      const r = 18 * u + Math.sin(a * 5 + t * 2) * 1.3 * u * (1 - k);
      const x = ox + Math.cos(a) * r, y = oy + Math.sin(a) * r * .92;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    if (calm) { ctx.closePath(); ctx.fillStyle = "rgba(122,156,255,.16)"; ctx.fill(); }
    ctx.strokeStyle = "#7a9cff"; ctx.lineWidth = 1.3 * u; ctx.stroke();
    // scribbly hair loops
    ctx.lineWidth = .8 * u;
    for (let j = 0; j < 3; j++) {
      ctx.beginPath();
      for (let s = 0; s <= 20; s++) {
        const a = s / 20 * Math.PI * 4 + t * (calm ? .3 : 2) + j, r = (1 + s / 8) * u;
        const x = ox + (j - 1) * 9 * u + Math.cos(a) * r, y = oy - 18 * u - s * .25 * u + Math.sin(a) * r;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // eyes
    const look = calm ? 0 : Math.sin(t * 3.1) * 1.4 * u;
    ctx.fillStyle = "#f6f3e8";
    ctx.beginPath(); ctx.arc(ox - 7 * u, oy - 5 * u, 4.2 * u, 0, Math.PI * 2); ctx.arc(ox + 7 * u, oy - 5 * u, 4.2 * u, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a22";
    ctx.beginPath(); ctx.arc(ox - 7 * u + look, oy - 5 * u, 1.8 * u, 0, Math.PI * 2); ctx.arc(ox + 7 * u + look, oy - 5 * u, 1.8 * u, 0, Math.PI * 2); ctx.fill();
    // mouth
    ctx.strokeStyle = "#f6f3e8"; ctx.lineWidth = .9 * u;
    ctx.beginPath();
    if (calm) ctx.arc(ox, oy + 3 * u, 5 * u, .15 * Math.PI, .85 * Math.PI);
    else ctx.arc(ox, oy + 5 * u, (1.6 + Math.abs(Math.sin(t * 5))) * u, 0, Math.PI * 2);
    ctx.stroke();
    // the drawing arm and its pencil
    const px = ox + 24 * u + (calm ? 0 : Math.sin(t * 6) * 3 * u), py = oy + 12 * u + (calm ? 0 : Math.cos(t * 8.5) * 2 * u);
    ctx.strokeStyle = "#7a9cff"; ctx.lineWidth = u;
    ctx.beginPath(); ctx.moveTo(ox + 16 * u, oy + 4 * u); ctx.quadraticCurveTo(ox + 22 * u, oy, px, py - 4 * u); ctx.stroke();
    ctx.save(); ctx.translate(px, py); ctx.rotate(.5);
    ctx.fillStyle = "#ffd84a"; ctx.fillRect(-1.2 * u, -8 * u, 2.4 * u, 7 * u);
    ctx.fillStyle = "#f0c8a0"; ctx.fillRect(-1.2 * u, -1 * u, 2.4 * u, 1.6 * u);
    ctx.fillStyle = "#2a2a30"; ctx.fillRect(-.5 * u, .6 * u, u, u);
    ctx.fillStyle = "#e88a9a"; ctx.fillRect(-1.2 * u, -9.5 * u, 2.4 * u, 1.6 * u);
    ctx.restore();
    // what it has finished so far sits beside it
    ctx.strokeStyle = "#f6f3e8"; ctx.lineWidth = .6 * u;
    if (drawn >= 1) {
      const cx2 = ox - 22 * u, cy2 = by - 4 * u;
      ctx.beginPath(); ctx.arc(cx2, cy2, 2.6 * u, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx2 - 2.4 * u, cy2 - 1.4 * u); ctx.lineTo(cx2 - 2 * u, cy2 - 4 * u); ctx.lineTo(cx2 - .6 * u, cy2 - 2.4 * u);
      ctx.moveTo(cx2 + 2.4 * u, cy2 - 1.4 * u); ctx.lineTo(cx2 + 2 * u, cy2 - 4 * u); ctx.lineTo(cx2 + .6 * u, cy2 - 2.4 * u); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx2 + 2.6 * u, cy2 + 1 * u); ctx.quadraticCurveTo(cx2 + 6 * u, cy2, cx2 + 5 * u, cy2 - 3 * u); ctx.stroke();
    }
    if (drawn >= 2) {
      const hx = ox - 23 * u, hy = oy - 12 * u;
      ctx.strokeRect(hx - 3 * u, hy - 3 * u, 6 * u, 5 * u);
      ctx.beginPath(); ctx.moveTo(hx - 4 * u, hy - 3 * u); ctx.lineTo(hx, hy - 7 * u); ctx.lineTo(hx + 4 * u, hy - 3 * u); ctx.stroke();
      ctx.fillStyle = "#ffd84a"; ctx.fillRect(hx - 1.5 * u, hy - 1.5 * u, 2 * u, 2 * u);
    }
    if (drawn >= 3) {
      ctx.fillStyle = "#ffd84a";
      const sx = ox + 20 * u, sy = oy - 20 * u;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? 1.2 : 3) * u; ctx.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); }
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
});
Object.assign(NPC_DRAW, {
  asterisk(cx, by, t, u = 2) {
    const b = Math.abs(Math.sin(t * 4)) * 2 * u;
    ctx.save(); ctx.translate(cx, by - 14 * u - b);
    ctx.strokeStyle = "#2a2a40"; ctx.lineWidth = 2.2 * u; ctx.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3 + Math.sin(t * 1.3) * .08, len = i === 0 ? 11 * u : 7 * u;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len); ctx.stroke();
    }
    ctx.fillStyle = "#2a2a40"; ctx.beginPath(); ctx.arc(11 * u, 0, 1.4 * u, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f6f3e8"; ctx.beginPath(); ctx.arc(0, 0, 3.4 * u, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a22"; ctx.fillRect(-1.8 * u, -1.2 * u, u, 1.4 * u); ctx.fillRect(.8 * u, -1.2 * u, u, 1.4 * u);
    ctx.restore();
  },
  rubric(cx, by, t, u = 2) {
    const R = P(cx, by + Math.sin(t * 1.5) * u * .3, u);
    R(-2, -4, 4, 4, "#2a2a30"); R(-1, -1, 2, 1, "#2a2a30");
    R(-4, -22, 8, 18, "#c8303a"); R(-3, -21, 1, 15, "#e0606a");
    R(-4, -8, 8, 2, "#8a1a22");
    R(-4, -28, 8, 6, "#8a1a22"); R(3, -27, 1, 8, "#d8d0b8");
    R(-4, -19, 3, 3, "#d8d0b8"); R(1, -19, 3, 3, "#d8d0b8"); R(-1, -18, 2, 1, "#d8d0b8");
    R(-3, -18, 1, 1, "#1a1a22"); R(2, -18, 1, 1, "#1a1a22");
    R(-3, -14, 6, 1, "#f6f3e8");
    R(-6, -15, 2, 6, "#c8303a"); R(4, -15, 2, 6, "#c8303a"); R(5, -11, 3, 3, "#f6f3e8");
  },
  dayglo(cx, by, t, u = 2) {
    const capped = G && G.flags && G.flags.m_capped, col = capped ? "#f6e84a" : "#e6dfa0";
    const R = P(cx, by + Math.sin(t * 1.2) * u * .4, u);
    R(-5, -3, 4, 3, "#3a3a44"); R(1, -3, 4, 3, "#3a3a44");
    R(-6, -21, 12, 18, col); R(-6, -21, 2, 18, capped ? "#fff27a" : "#efe9c0");
    R(-6, -11, 12, 3, "#3a3a44");
    if (capped) { R(-6, -27, 12, 6, "#f2d23a"); R(4, -26, 1, 6, "#c8a820"); }
    else { R(-3, -23, 6, 2, "#d8c860"); R(-2, -25, 3, 2, "#d8c860"); }
    if (capped) { R(-4, -18, 2, 2, "#3a3a44"); R(2, -18, 2, 2, "#3a3a44"); }
    else { R(-4, -17, 3, 1, "#3a3a44"); R(1, -17, 3, 1, "#3a3a44"); if (t % 2.4 < 1.2) txt("z", cx + 8 * u, by - 32 * u - (t % 1.2) * 4 * u, "#5a7cf0", 6 * u, "center"); }
  },
  caret(cx, by, t, u = 2) {
    const b = Math.sin(t * 2) * u * .4;
    ctx.save(); ctx.strokeStyle = "#3a4aa0"; ctx.lineWidth = 2.6 * u; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(cx - 7 * u, by - 1 * u + b); ctx.lineTo(cx, by - 22 * u + b); ctx.lineTo(cx + 7 * u, by - 1 * u + b); ctx.stroke();
    ctx.fillStyle = "#1a1a22"; ctx.fillRect(cx - 2 * u, by - 15 * u + b, u, 1.4 * u); ctx.fillRect(cx + 1 * u, by - 15 * u + b, u, 1.4 * u);
    ctx.fillStyle = "#3a4aa0"; ctx.fillRect(cx - 2 * u, by - 12 * u + b, 4 * u, .8 * u);
    ctx.restore();
  },
  doodler(cx, by, t, u = 2) {
    const sp = G && G.flags && G.flags.boss_doodler === "spare";
    MON_DRAW.doodler(cx, by, t, { sp: sp ? 100 : 0, drawn: sp ? 3 : 0 }, u * .5);
  },
  m_halfcat(cx, by, t, u = 2) {
    ctx.save(); ctx.strokeStyle = "#3a5ad0"; ctx.lineWidth = .8 * u; ctx.lineCap = "round";
    const y = by - 8 * u;
    ctx.beginPath(); ctx.arc(cx - 3 * u, y - 4 * u, 3.4 * u, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 6 * u, y - 6 * u); ctx.lineTo(cx - 5.4 * u, y - 10 * u); ctx.lineTo(cx - 3.4 * u, y - 7.4 * u); ctx.lineTo(cx - 1.4 * u, y - 10 * u); ctx.lineTo(cx - .2 * u, y - 6 * u); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, y - 2 * u); ctx.lineTo(cx + 5 * u, y - 2 * u); ctx.moveTo(cx - 3 * u, y); ctx.lineTo(cx - 3 * u, y + 7 * u); ctx.moveTo(cx - 1 * u, y + 1 * u); ctx.lineTo(cx - 1 * u, y + 7 * u); ctx.stroke();
    ctx.setLineDash([u, u]); ctx.beginPath(); ctx.moveTo(cx + 5 * u, y - 2 * u); ctx.lineTo(cx + 9 * u, y - 2 * u); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#3a5ad0"; ctx.fillRect(cx - 4.4 * u, y - 5 * u, .8 * u, .8 * u); ctx.fillRect(cx - 2 * u, y - 5 * u, .8 * u, .8 * u);
    if (Math.sin(t * 3) > .3) txt("~", cx + 4 * u, y - 12 * u, "#3a5ad0", 5 * u, "center");
    ctx.restore();
  },
  m_halfhouse(cx, by, t, u = 2) {
    ctx.save(); ctx.strokeStyle = "#3a5ad0"; ctx.lineWidth = .8 * u;
    ctx.strokeRect(cx - 8 * u, by - 14 * u, 16 * u, 13 * u);
    ctx.strokeRect(cx - 2 * u, by - 8 * u, 4 * u, 7 * u);
    ctx.setLineDash([u, 1.4 * u]); ctx.beginPath(); ctx.moveTo(cx - 9 * u, by - 14 * u); ctx.lineTo(cx - 4 * u, by - 18 * u); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#3a5ad0"; ctx.fillRect(cx + 4 * u, by - 11 * u, 1.2 * u, 1.2 * u); ctx.fillRect(cx + 4.3 * u, by - 9.8 * u, .6 * u, 3 * u);
    ctx.restore();
  },
  m_firstnote(cx, by, t, u = 2) {
    const R = P(cx, by + Math.sin(t * 1.4) * u * .3, u);
    R(-6, -10, 12, 9, "#e8dcb0"); R(-6, -10, 12, 1, "#cfc090");
    R(-4, -7, 8, .6, "rgba(90,80,60,.35)"); R(-4, -5, 6, .6, "rgba(90,80,60,.35)"); R(-4, -3, 7, .6, "rgba(90,80,60,.35)");
    if (G && G.flags && G.flags.m_firstread) { R(-5, -7.6, 10, 1.8, "rgba(255,242,122,.85)"); R(-4, -7, 8, .6, "#3a3a44"); }
  },
  m_scribble(cx, by, t, u = 2) {
    ctx.save(); ctx.strokeStyle = "rgba(90,110,170,.55)"; ctx.lineWidth = .7 * u; ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < 14; i++) { const r = hash(i, 21), x = cx + (r - .5) * 18 * u, y = by - (2 + hash(i, 5) * 10) * u; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.stroke(); ctx.restore();
  }
});
