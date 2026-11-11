"use strict";
/* ============================================================
   VOIDHEART — Episode 3, region 4: THE ERRATA
   The department of corrections, and the Courthouse of Citations.
   PALIMPSEST's revisions are certified here as "the Record".
   Centrepiece: the trial of MILO vs. the Record (boss: THE CITATION).
   Area key `errata`, room prefix `e3e_`, flags `e_`. See docs/EP3_SPEC.md.
   ============================================================ */
{
  /* ---------- area, palette, songs, items, speakers ---------- */
  POOLS.errata = ["ibid", "sic", "fineprint", "etal", "redline"];
  PAL.errata = {
    floor: "#2b1d14", alt: "#2f2017", spec: "#4a3324", wall: "#0f0a07", face: "#3d2818", line: "#26180e",
    rug: "#5e1a1e", rug2: "#8e2a30", shelf: "#3a2a1e", grass: "#2f6a4a", grass2: "#7ad0a0"
  };
  AREAS.errata = { name: "THE ERRATA", music: "errata", sub: "all truths must be proven, footnoted and filed" };
  Object.assign(SONGS, {
    errata: { bpm: 92, tracks: [
      { w: "square", v: .016, n: "D5 . F5 . A5 . F5 . E5 . G5 . Bb5 . A5 . F5 . D5 . E5 . C#5 . D5 - - - . . . . F5 . A5 . D6 . A5 . G5 . Bb5 . G5 . E5 . F5 . D5 . E5 . C#5 . D5 - - - - - - -" },
      { w: "triangle", v: .06, n: "D3 - A2 - D3 - A2 - C3 - G2 - C3 - A2 - Bb2 - F2 - G2 - A2 - D3 - - - - - - - D3 - A2 - F3 - A2 - G2 - D3 - Bb2 - G2 - F2 - C3 - A2 - A2 - D3 - - - - - - -" },
      { w: "sine", v: .02, n: "A5 - - - - - - - . . . . . . . . G5 - - - - - - - . . . . . . . ." }] },
    e_trial: { bpm: 132, tracks: [
      { w: "square", v: .022, n: "D5 D5 . F5 . D5 A5 . G5 . F5 . E5 . C#5 . D5 D5 . F5 . A5 D6 . C6 . Bb5 . A5 . . . D5 D5 . F5 . D5 A5 . Bb5 . A5 . G5 . F5 . E5 F5 . E5 . D5 C#5 . D5 . . . . . ." },
      { w: "triangle", v: .075, n: "D2 D3 D2 D3 D2 D3 D2 D3 Bb1 Bb2 Bb1 Bb2 A1 A2 A1 A2 D2 D3 D2 D3 D2 D3 D2 D3 G1 G2 A1 A2 D2 D3 D2 D3" },
      { w: "sawtooth", v: .008, n: "A4 - - - - - - - F4 - - - - - - - E4 - - - - - - - A4 - - - - - - -" }] }
  });
  Object.assign(ITEMS, {
    e_coffee: { name: "Court Coffee", type: "heal", heal: 24, price: 22, desc: "Brewed in 1952. Reheated every morning since, with great ceremony." },
    e_bun: { name: "Recess Bun", type: "heal", heal: 36, price: 34, desc: "Best eaten during a recess. The court's been in recess for forty years. Still good." },
    e_toast: { name: "Triplicate Toast", type: "heal", heal: 48, price: 46, desc: "Three identical slices, each stamped RECEIVED." },
    e_biscuit: { name: "Sworn Biscuit", type: "heal", heal: 60, desc: "Baked by Affidavit the day she arrived. Sworn statements don't go stale." },
    e_summons: { name: "Summons", type: "key", desc: "A witness summons for AFFIDAVIT. Someone stamped it NO WITNESS in red." },
    e_summons2: { name: "Corrected Summons", type: "key", desc: "'WITNESS: AFFIDAVIT. PLEASE APPEAR.' Corrected twice. Good as new." }
  });
  Object.assign(SPEAKERS, {
    citation: { name: "THE CITATION", voice: 120 },
    e_errata: { name: "CLERK ERRATA", voice: 520 },
    e_corrig: { name: "CLERK CORRIGENDA", voice: 440 },
    e_ditto: { name: "CLERK DITTO", voice: 360 },
    e_addendum: { name: "ADDENDUM", voice: 600 },
    e_affidavit: { name: "AFFIDAVIT", voice: 260 },
    e_hearsay: { name: "HEARSAY", voice: 700 },
    e_docket: { name: "DOCKET", voice: 330 },
    e_seealso: { name: "SEE ALSO", voice: 780 }
  });

  /* ---------- custom tiles: ! pew   ? desk with banker's lamp   % marble column ---------- */
  TILE_DRAW["!"] = (x, y, tx, ty, pal, t, W, h) => {
    ctx.fillStyle = "#3a2414"; ctx.fillRect(x, y + 5, TILE, 9);
    ctx.fillStyle = "#5a3a22"; ctx.fillRect(x, y + 5, TILE, 2);
    ctx.fillStyle = "#4a2e1a"; ctx.fillRect(x, y + 16, TILE, 9);
    ctx.fillStyle = "#6a4426"; ctx.fillRect(x, y + 16, TILE, 2);
    ctx.fillStyle = "#1e120a"; ctx.fillRect(x, y + 25, TILE, 3);
    ctx.fillStyle = "#24160c";
    if (W.tile(tx - 1, ty) !== "!") ctx.fillRect(x + 1, y + 3, 4, 26);
    if (W.tile(tx + 1, ty) !== "!") ctx.fillRect(x + TILE - 5, y + 3, 4, 26);
    if (h < .2) { ctx.fillStyle = "#efe6cf"; ctx.fillRect(x + 10 + h * 30, y + 18, 9, 5); }
  };
  TILE_DRAW["?"] = (x, y, tx, ty, pal, t, W, h) => {
    const L0 = W.tile(tx - 1, ty) !== "?", R0 = W.tile(tx + 1, ty) !== "?";
    ctx.fillStyle = "#2a1a10"; ctx.fillRect(x, y + 6, TILE, TILE - 6);
    ctx.fillStyle = "#5a3a22"; ctx.fillRect(x, y + 6, TILE, 4);
    ctx.fillStyle = "#3e2616"; ctx.fillRect(x + 4, y + 14, TILE - 8, 12);
    ctx.fillStyle = "#24160c"; if (L0) ctx.fillRect(x, y + 6, 3, TILE - 6); if (R0) ctx.fillRect(x + TILE - 3, y + 6, 3, TILE - 6);
    if (h < .55) { ctx.fillStyle = "#efe6cf"; ctx.fillRect(x + 6 + h * 10, y + 2, 12, 6); ctx.fillStyle = "#c03a3a"; ctx.fillRect(x + 7 + h * 10, y + 4, 9, 1); }
    if (L0 || (tx % 4 === 0)) {
      const g = ctx.createRadialGradient(x + 22, y - 2, 2, x + 22, y - 2, 26);
      g.addColorStop(0, `rgba(110,230,150,${.22 + .04 * Math.sin(t * 2 + tx)})`); g.addColorStop(1, "rgba(110,230,150,0)");
      ctx.fillStyle = g; ctx.fillRect(x - 4, y - 28, 52, 52);
      ctx.fillStyle = "#c8a050"; ctx.fillRect(x + 18, y + 4, 8, 3); ctx.fillRect(x + 21, y - 2, 2, 6);
      ctx.fillStyle = "#2f8a5a"; ctx.fillRect(x + 15, y - 6, 14, 5);
      ctx.fillStyle = "#7ad0a0"; ctx.fillRect(x + 15, y - 2, 14, 1);
    }
  };
  TILE_DRAW["%"] = (x, y, tx, ty, pal, t, W, h) => {
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(x + 4, y + 26, 26, 5);
    ctx.fillStyle = "#b8b2a8"; ctx.fillRect(x + 3, y + 23, 26, 6);
    ctx.fillStyle = "#e6e2da"; ctx.fillRect(x + 7, y - 8, 18, 31);
    ctx.fillStyle = "#cfcac0"; ctx.fillRect(x + 11, y - 8, 2, 31); ctx.fillRect(x + 19, y - 8, 2, 31);
    ctx.fillStyle = "#a8a29a"; ctx.fillRect(x + 8 + h * 12, y + 2, 1, 9); ctx.fillRect(x + 9 + h * 10, y + 10, 4, 1);
    ctx.fillStyle = "#d8d4cc"; ctx.fillRect(x + 4, y - 13, 24, 6);
    ctx.fillStyle = "#b8b2a8"; ctx.fillRect(x + 4, y - 8, 24, 1);
  };
  SOLID.add("!"); SOLID.add("?"); SOLID.add("%");

  /* ---------- new patterns ---------- */
  /* footnote markers fall, then burst at the line they were referring to */
  PAT.e_footnote = { box: [260, 170], dur: 5.5, def: { col: "#f2ecd8" }, fn(B, S, P, dt, b) {
    if (!tick(S, .42 / P.d, dt)) return;
    const marks = "*§¶†", x = B.x + 14 + rand(B.w - 28), stop = B.y + 30 + rand(B.h - 60);
    b.spawn({ x, y: B.y - 10, vx: 0, vy: 120 * P.s, r: 7, col: P.col, shape: "char", ch: marks[rint(0, 3)], life: 4,
      upd(o) {
        if (o.popped || o.y < stop) return;
        o.popped = 1; o.dead = true;
        for (let i = 0; i < 4; i++) {
          const a = Math.PI / 4 + i * Math.PI / 2;
          b.spawn({ x: o.x, y: o.y, vx: Math.cos(a) * 80 * P.s, vy: Math.sin(a) * 80 * P.s, r: 3.5, col: P.col, shape: "orb" });
        }
      } });
  } };
  /* strike-throughs: a warning, then a red line drawn across the box */
  PAT.e_redline = { box: [280, 170], dur: 5.5, def: { col: "#ff3b3b" }, fn(B, S, P, dt, b) {
    if (!tick(S, .8 / P.d, dt, "c", .2)) return;
    S.n = (S.n || 0) + 1;
    const y = B.y + 12 + rand(B.h - 24), fromLeft = S.n % 2 === 1;
    b.spawn({ x: B.x + B.w / 2, y, w: B.w, h: 10, shape: "warn", col: P.col, life: .5 });
    b.spawn({ x: fromLeft ? B.x : B.x + B.w, y, w: 0, h: 8, col: P.col, shape: "bar", life: 2.3,
      upd(o, dt2) {
        if (o.t < .5) { o.w = 0; return; }
        const I = b.ibox; o.w = Math.min(I.w, (o.t - .5) * 420 * P.s);
        o.x = fromLeft ? I.x + o.w / 2 : I.x + I.w - o.w / 2;
        if (o.t > 1.6) o.h = Math.max(0, o.h - dt2 * 16);
      } });
  } };

  /* ---------- regular monsters ---------- */
  Object.assign(MONSTERS, {
    ibid: {
      name: "Ibid", area: "errata", hp: 96, atk: 7, def: 2, exp: 34, gold: 22, voice: 480,
      check: "IBID - ATK 7 DEF 2\n* Short for 'in the same place.'\n* Repeats the last thing anyone said. Has never said a first thing.",
      intro: "* Ibid appears.\n* Ibid appears.",
      flavor: ["* Ibid is waiting for someone to say something it can repeat.", "* Ibid. (See above.)", "* Ibid is repeating the silence. It's very good at it."],
      spareFlavor: "* Ibid was cited first. It's still vibrating.",
      talk: ["...ibid.", "(same as above.)", "see previous. see previous."],
      spareTalk: "i was FIRST. somebody cited me FIRST.",
      acts: {
        "Say Something": e => {
          e.said = 1; e.sp += 20;
          e.reply = `"${pick(["nice weather", "i like your hat", "where's the exit"])}." ...ibid.`;
          return "* You say something. Anything.\n* Ibid repeats it instantly, word for word.\n* It looks pleased, and a little hollow.";
        },
        "Cite It First": e => {
          if (!e.said) { e.sp += 5; e.reply = "...cite me for WHAT?"; return "* You try to cite Ibid as a source.\n* But Ibid hasn't repeated anything yet.\n* It isn't a source OF anything."; }
          e.said = 0; e.sp += 45; e.reply = "...first? i was FIRST?";
          return "* You say: 'As Ibid said.' Out loud. Like it was its idea.\n* Nobody has ever cited Ibid first.\n* It glows like a brand new paragraph.";
        },
        "Say 'Ibid'": e => {
          e.sp -= 15; e.reply = "ibid ibid ibid ibid ibid";
          return "* You say 'ibid.' Ibid says 'ibid.'\n* You say 'ibid.' Ibid says 'ibid.'\n* This could go on forever. It very nearly does.";
        }
      },
      pats: [{ id: "letters", word: "IBIDIBIDIBID", col: "#efe6cf" }, { id: "loop", col: "#efe6cf" }]
    },
    sic: {
      name: "Sic", area: "errata", hp: 104, atk: 7, def: 2, exp: 36, gold: 24, voice: 380,
      check: "SIC - ATK 7 DEF 2\n* A little bracketed word that marks a mistake as 'original.'\n* Insists every mistake it ever made was on purpose.",
      intro: "* Sic swaggers in. [sic]",
      flavor: ["* Sic adjusts its beret. It was crooked on purpose.", "* Sic has spelled 'recieve' wrong. Artistically.", "* Sic is daring you to correct it."],
      spareFlavor: "* Sic admits one mistake was an accident. Just one. It looks lighter.",
      talk: ["THAT WAS INTENTIONAL.", "i meant to do that. [sic]", "art is a mistake on purpose.", "don't you DARE fix me."],
      spareTalk: "...okay. the beret was an accident. i like it anyway.",
      acts: {
        "Admire the Choice": e => {
          e.adm = 1; e.sp += 25; e.reply = "you think 'recieve' is BOLD?";
          return "* You tell Sic its spelling is very brave.\n* Sic preens. It has waited so long to hear that.";
        },
        "Make a Mistake Too": e => {
          if (!e.adm) { e.sp += 8; e.reply = "...was that on purpose? hm."; return "* You misspell your own name. Sic squints at you.\n* It can't tell yet if you're making fun of it."; }
          e.sp += 40; e.reply = "a fellow ARTIST!";
          return "* You misspell your own name, proudly: 'MIOL.'\n* Sic gasps. Somebody finally gets it.\n* For a moment it forgets to be defensive.";
        },
        "Correct It": e => {
          e.sp -= 15; e.rage = 1; e.reply = "IT WAS. INTENTIONAL.";
          return "* You gently point out that 'receive' has the E first.\n* Sic's brackets snap shut around it like armor.";
        }
      },
      pats: [{ id: "letters", word: "RECIEVESICTEH", col: "#ff6b6b" }, { id: "side", col: "#efe6cf" }]
    },
    fineprint: {
      name: "Fine Print", area: "errata", hp: 92, atk: 6, def: 3, exp: 34, gold: 26, voice: 820,
      check: "FINE PRINT - ATK 6 DEF 3\n* The small words at the bottom of every agreement.\n* Contains several very important points. Nobody has ever read them.",
      intro: "* Fine Print appears at the bottom of the encounter.\n* (Terms and conditions apply.)",
      flavor: ["* Fine Print is saying something important. Very, very quietly.", "* You'd need to squint to see Fine Print properly.", "* Fine Print clears its tiny throat."],
      spareFlavor: "* Fine Print has been read. All of it. It's glowing.",
      talk: ["(...subject to change...)", "(...see clause 4(b)...)", "(...nobody ever gets this far down...)"],
      spareTalk: "(...you read me. ALL the way down.)",
      acts: {
        "Lean In Close": e => {
          e.close = 1; e.sp += 20; e.reply = "(...oh! a reader?)";
          return "* You lean in until your nose nearly touches the page.\n* Now you can see the small words.\n* They can see you, too.";
        },
        "Read Every Word": e => {
          if (!e.close) { e.sp += 5; e.reply = "(...)"; return "* You try to read Fine Print from where you are.\n* It's a grey smudge. You'd have to get closer."; }
          e.sp += 40; e.reply = "(...clause 9: be kind. nobody EVER reads clause 9.)";
          return "* You read Fine Print, every word, slowly.\n* Clause 9 says: 'Be kind.'\n* Fine Print is overwhelmed.";
        },
        "Skim It": e => {
          e.sp -= 15; e.reply = "(...you skipped clause 9. everyone skips clause 9.)";
          return "* You skim Fine Print and nod like you read it.\n* Fine Print can tell. Fine Print can always tell.";
        }
      },
      pats: [{ id: "tiny", col: "#cfc6b0" }, { id: "e_footnote", col: "#cfc6b0" }]
    },
    etal: {
      name: "Et Al.", area: "errata", hp: 130, atk: 7, def: 1, exp: 40, gold: 30, voice: 240,
      check: "ET AL. - ATK 7 DEF 1\n* 'And others.' A whole crowd of co-authors.\n* Nobody ever writes their names down. There isn't room.",
      intro: "* Et Al. shuffle in.\n* All of them. Whoever they are.",
      flavor: ["* Et Al. murmur among themselves.", "* Somebody in Et Al. waves. You can't tell who.", "* Et Al. stand very close together. There's no room on the page."],
      spareFlavor: "* Et Al. are wearing name tags now. They keep reading each other's.",
      talk: ["WE CONTRIBUTED TOO.", "we're the 'and others.'", "...we did most of the work, actually.", "nobody knows our NAMES."],
      spareTalk: "WE'RE IN THE CREDITS! all of us!",
      acts: {
        "Ask a Name": e => {
          e.n = (e.n || 0) + 1; e.sp += 20;
          const N = ["Gerald", "Priya", "Mo", "the other Gerald", "Bao", "Ingrid"];
          e.reply = `...${N[(e.n - 1) % N.length]}. that's me!`;
          return `* You ask one of them their name.\n* It takes a moment. Nobody has asked in years.\n* (${e.n} of Et Al. now ${e.n > 1 ? "have names" : "has a name"}.)`;
        },
        "Credit Them All": e => {
          if ((e.n || 0) < 2) { e.sp += 5; e.reply = "...credit WHO, though?"; return "* You try to credit Et Al. by name.\n* You don't know enough of their names yet."; }
          e.sp += 45; e.reply = "...WE'RE IN THE BYLINE.";
          return "* You list every name you've learned, out loud.\n* The crowd goes very quiet. Then very loud.";
        },
        "Say 'And Others'": e => {
          e.sp -= 15; e.reply = "WE. HAVE. NAMES.";
          return "* You call them 'and others.'\n* The whole crowd sighs at once. It's a big sigh.";
        }
      },
      pats: [{ id: "rain", col: "#9a98a8", d: 1.3 }, { id: "ringwave", col: "#9a98a8" }]
    },
    redline: {
      name: "Redline", area: "errata", hp: 118, atk: 8, def: 3, exp: 42, gold: 32, voice: 300,
      check: "REDLINE - ATK 8 DEF 3\n* A stroke of red ink. Strikes through whatever it touches.\n* Has corrected so much it forgot what a mistake looks like.",
      intro: "* Redline strikes through the air!\n* The air has been marked as incorrect.",
      flavor: ["* Redline crosses out a floorboard. The floorboard looks embarrassed.", "* Redline twitches toward your name.", "* Smells like a brand new red marker."],
      spareFlavor: "* Redline has drawn little dots under its last correction. Stet.",
      talk: ["WRONG. WRONG. ALSO WRONG.", "EVERYTHING NEEDS FIXING.", "...is anything right?"],
      spareTalk: "...some things should stand. i'll leave them be.",
      acts: {
        "Show a Real Typo": e => {
          e.fed = 1; e.sp += 35; e.reply = "A REAL ONE! FINALLY!";
          return "* You show Redline an actual typo: 'teh.'\n* It strikes it through with enormous relief.\n* It's been correcting correct things for years.";
        },
        "Write STET": e => {
          if (!e.fed) { e.sp += 10; e.reply = "...STET? ON WHAT?"; return "* You write STET in the air.\n* Redline hasn't struck anything worth keeping yet."; }
          e.sp += 45; e.reply = "...it can... STAND?";
          return "* Beside the last thing Redline crossed out, you write STET.\n* Let it stand.\n* Redline stares at the little word for a long time.";
        },
        "Ask for Notes": e => {
          e.sp -= 15; e.rage = 1; e.reply = "M-I-L-O: STRUCK. STRUCK. STRUCK.";
          return "* You ask Redline to correct you.\n* It draws a line straight through your name.\n* You flinch. It enjoyed that a bit too much.";
        }
      },
      pats: [{ id: "e_redline", col: "#ff3b3b" }, { id: "lasers", col: "#ff3b3b" }]
    }
  });

  /* ---------- THE CITATION: the trial of MILO vs. the Record ---------- */
  const EVID = {
    photo: { sp: 10, reply: "A HALF-PHOTOGRAPH. ...OF A WHOLE LAUGH.",
      text: "* You present Juni's torn photo.\n* Half of it is you, laughing at something.\n* Nobody laughs that hard at nobody." },
    firstnote: { sp: 10, reply: "THE FIRST CITATION... CITED NOTHING AT ALL?",
      text: "* You present the first note ever written.\n* It's a rumor. Nobody ever checked it.\n* Every note since was copied from it." },
    juni: { sp: 10, reply: "...THE WITNESS DOTS THEIR J'S WITH LITTLE STARS.",
      text: "* You present Juni's own testimony.\n* The Citation holds the signature to the lamp.\n* It's genuine. Of course it's genuine." },
    record: { sp: 12, reply: "...THAT IS MY STAMP. FROM BEFORE I STOPPED READING.",
      text: "* You present the original record.\n* It bears the Citation's own stamp: CERTIFIED TRUE.\n* It is dated before the very first revision." },
    draft: { sp: 12, reply: "...THE FIRST WORDS. THEY ALWAYS SHOW THROUGH.",
      text: "* You present every draft, layered.\n* Held up to the green lamp, the first draft\n  shows through all the others." }
  };
  const WIT = {
    juni: { sp: 18, flag: "e_juniCalled",
      text: "* JUNI takes the stand. They wave at you first.\n* 'I moved away last spring. We said goodbye\n  at the bus stop. It hurt. It still happened.'",
      replies: ["...THE WITNESS IS VERY CERTAIN.", "THE RECORD SAYS YOU WERE NEVER HERE.", "...AND YET HERE YOU ARE. IN MY COURT. WAVING."] },
    affidavit: { sp: 8, flag: "e_affCalled",
      text: "* AFFIDAVIT hobbles to the stand with her umbrella.\n* 'It rained on Tuesdays. I was there. I got soaked.'\n* 'I've waited forty-one years to say so.'",
      replies: ["...THE UMBRELLA IS STILL DAMP.", "ADMITTED."] },
    sol: { sp: 8, flag: "e_solCalled",
      text: "* SOL takes the stand, glowing faintly.\n* 'I was erased once. It didn't make me untrue.'\n* 'It only made me hard to find.'",
      replies: ["...A RESTORED WITNESS. THERE IS NO PRECEDENT."] },
    vanta: { sp: 8, flag: "e_vantaCalled",
      text: "* VANTA steps out of the dark by the door.\n* 'I was the first thing ever forgotten.'\n* 'Forgotten is not the same as false.'",
      replies: ["...THE OLDEST WITNESS IN THE ARCHIVE. NOTED."] },
    ledger: { sp: 8, flag: "e_ledgerCalled",
      text: "* LEDGER opens to the right page.\n* 'Debit: one best friend. But no credit was ever\n  entered. You can't remove what was never there.'",
      replies: ["...THE ACCOUNTS BALANCE. UNFORTUNATELY FOR THE RECORD."] },
    signal: { sp: 8, flag: "e_signalCalled",
      text: "* A radio crackles in the gallery. SIGNAL, patched in!\n* 'I remember MILO! MILO remembers Juni!'\n* 'People remembering people. That's a signal!'",
      replies: ["...THE COURT DID NOT KNOW IT HAD A RADIO."] },
    quill: { sp: 8, flag: "e_quillCalled",
      text: "* QUILL climbs onto the stand. It needs a book to see over.\n* 'MILO keeps a photo of someone on their desk.'\n* 'Nobody keeps a photo of nobody.'",
      replies: ["THE WITNESS IS AN INKWELL.", "...A TRUTHFUL INKWELL."] }
  };
  const witnessList = () => {
    const w = [];
    if (G.flags.juniFound) w.push("juni");
    if (G.flags.e_affDone) w.push("affidavit");
    if (E3.solAlly()) w.push("sol");
    if (E3.vantaAlive()) w.push("vanta");
    if (G.flags.e_ledger) w.push("ledger");
    const e1 = E3.ep1();
    if (e1.ending && e1.ending !== "void") w.push("signal");
    w.push("quill");
    return w;
  };
  const CITES = [
    "THE RECORD, VOLUME ONE, PAGE ONE: 'MILO NEVER HAD A BEST FRIEND.'",
    "THE RECORD, VOL. 3, P. 12: 'NOBODY ON THIS STREET EVER MOVED AWAY.'",
    "THE RECORD, VOL. 7, FOOTNOTE 4: 'THERE WAS NO GOODBYE. THERE WAS NOTHING TO SAY GOODBYE TO.'",
    "THE RECORD, VOL. 9: 'IT NEVER RAINED ON TUESDAYS.'",
    "THE RECORD, APPENDIX J: 'J IS FOR NOTHING.'"
  ];
  /* until the truth is pleaded, the meter stops short of 100 */
  const gain = (e, n) => { e.sp = Math.min(e.pled ? 100 : 90, e.sp + n); };

  MONSTERS.citation = {
    name: "The Citation", area: "errata", hp: 420, atk: 9, def: 3, exp: 90, gold: 80, voice: 120, boss: true, bar: true,
    title: "THE CITATION // CHIEF JUSTICE OF THE RECORD", music: "e_trial", noFlee: true,
    checkFn: e => `THE CITATION - ATK 9 DEF 3\n* Presiding judge of the Errata. Footnotes, all the way down.\n* Evidence on file: ${E3.evidence().length}. Witnesses waiting: ${witnessList().filter(w => !e.called.includes(w)).length}.`,
    intro: "* THE CITATION bangs its gavel.\n* 'COURT IS IN SESSION.'",
    init: () => ({ shown: [], called: [], desc: 0, asked: 0, cite: false, claim: false, citeN: 0 }),
    actNames() {
      const a = ["Present Evidence", "Call a Witness", "Object", "Ask About Its Cases", "Plead the Truth"];
      if (G.flags.e_note_lobby) a.splice(3, 0, "Cite Its Mistakes");
      return a;
    },
    acts: {
      "Present Evidence": e => {
        const next = E3.evidence().find(x => !e.shown.includes(x.key));
        if (next) {
          e.shown.push(next.key);
          const d = EVID[next.key] || { sp: 10, reply: "...ADMITTED.", text: `* You present ${next.label}.\n* The Citation examines it under the green lamp.` };
          gain(e, d.sp); e.reply = d.reply;
          return d.text;
        }
        if (e.desc >= 3) return "* You have nothing left to present.\n* The Citation waits. It is very good at waiting.";
        e.desc++; gain(e, 5); e.claim = true;
        e.reply = ["HEARSAY. INADMISSIBLE.", "UNSUPPORTED. ...BUT NOTED.", "...THE COURT HAS HEARD THAT ONE BEFORE."][e.desc - 1];
        return [
          "* You have no more proof, so you just describe it.\n* The stars Juni drew on your ceiling.\n* The Citation reaches for the Record to check.",
          "* You describe learning to whistle.\n* Three weeks. Mostly spit. Then, one day, a note.\n* The Citation reaches for the Record again.",
          "* You describe the bus stop. The spring. The window.\n* You don't have proof. You were there.\n* The Citation flips to a page in the Record."][e.desc - 1];
      },
      "Call a Witness": e => {
        const id = witnessList().find(w => !e.called.includes(w));
        if (!id) return "* Nobody else is waiting to testify.\n* The gallery is very quiet.";
        const w = WIT[id];
        e.called.push(id); G.flags[w.flag] = true;
        gain(e, w.sp); e.replies = w.replies.slice();
        return w.text;
      },
      "Object": e => {
        if (!e.cite) { e.reply = "OVERRULED. THERE IS NOTHING BEFORE THE COURT."; return "* 'OBJECTION!'\n* ...to what? The Citation isn't quoting anything.\n* Your objection echoes around the empty gallery."; }
        e.cite = false; gain(e, 10);
        e.reply = pick(["...SUSTAINED. WHY DID I SAY SUSTAINED?", "SUSTAINED. ...THAT PAGE IS VERY THIN.", "...STRIKE THAT. FROM THE RECORD. THE RECORD ITSELF."]);
        return "* 'OBJECTION! That page has been written over!'\n* You tilt it toward the lamp. Something older\n  shows through under the new words.";
      },
      "Cite Its Mistakes": e => {
        if (e.mistakes) return "* You've already cited the Errata's typos.\n* The Citation is still blushing in red ink.";
        e.mistakes = 1; gain(e, 12); e.reply = "...THE COURT TAKES JUDICIAL NOTICE OF ITS OWN TYPOS.";
        return "* You cite the Errata's own records:\n* 4,112,010 corrections this morning. Mostly corrections\n  of corrections. A court that errs can't call the Record perfect.";
      },
      "Ask About Its Cases": e => {
        e.asked++;
        if (e.asked > 3) return "* The Citation has told you all it will about its cases.\n* It turns its gavel over in its hands.";
        gain(e, 6);
        e.replies = [
          ["I HAVE HEARD NINE MILLION CASES.", "I RULED FOR THE TRUTH IN EVERY ONE."],
          ["...EVERY ONE WAS REVISED BY MORNING.", "NEW PAGES. SAME STAMP. MINE."],
          ["IF THE TRUTH IS ALWAYS OVERWRITTEN, WHY BELIEVE IT AT ALL?", "...I STOPPED. IT HURT LESS."]][e.asked - 1];
        return [
          "* You ask the Citation how long it's been a judge.\n* It has to count. It runs out of fingers, then footnotes.",
          "* You ask what happened to all those cases.\n* The Citation is quiet for a long time.",
          "* You ask why it still holds trials at all.\n* It looks at its gavel like it forgot it was holding it."][e.asked - 1];
      },
      "Plead the Truth": e => {
        if (e.sp < 75) {
          gain(e, 3); e.claim = true; e.reply = "A PLEA IS NOT PROOF. THE COURT WILL CONSULT THE RECORD.";
          return "* You tell the Citation it happened. All of it.\n* It hears you. It doesn't believe you.\n* Not yet. You need more on the record first.";
        }
        e.pled = 1; e.sp = 100;
        e.replies = ["...", "A MEMORY DOES NOT STOP BEING TRUE BECAUSE IT HURTS.", "...OR BECAUSE SOMEBODY WROTE OVER IT.", "I KNEW THAT ONCE. I FILED IT. UNDER EVERYTHING."];
        return G.flags.juniFound
          ? "* You don't argue. You just tell it the truth.\n* Juni moved away. The goodbye hurt.\n* It still happened. We were still best friends."
          : "* You don't argue. You just tell it the truth.\n* You had a best friend. Losing them hurt.\n* Hurting doesn't make it untrue.";
      }
    },
    canSpare: e => e.sp >= 100,
    talkFn(e) {
      if (e.sp >= 100) {
        if (e.replies) { const r = e.replies; e.replies = null; return r; }
        return "...THE COURT IS READY TO RULE.";
      }
      if (e.hp < e.maxhp * .15) return "...ORDER. ORDER. ...I CANNOT LIFT THE GAVEL ANYMORE.";
      const out = [];
      if (e.replies) { out.push(...e.replies); e.replies = null; }
      else if (e.reply) { out.push(e.reply); e.reply = null; }
      if (e.claim || e.turn === 1) { e.claim = false; e.cite = true; out.push(CITES[e.citeN++ % CITES.length]); }
      if (!out.length) {
        const N = ["PROOF. FOOTNOTE. FILING. IN THAT ORDER.", "THE RECORD HAS NEVER BEEN WRONG. ONLY REVISED.", "EVERY TRUE THING I WAS SHOWN WAS GONE BY MORNING.", "WHY SHOULD YOURS BE ANY DIFFERENT?", "I AM NOT CRUEL. I AM ONLY TIRED.", "...CONTINUE. THE COURT IS STILL LISTENING."];
        out.push(N[Math.min(e.turn - 1, N.length - 1)]);
      }
      return out;
    },
    flavorFn(e) {
      if (e.sp >= 100) return "* The Citation sets down its gavel.\n* The court is ready to rule.";
      if (e.cite) return "* The Citation is quoting the Record.\n* Up close, the page looks written over. Many times.";
      if (e.sp >= 75) return "* The Citation's footnotes are rearranging themselves.\n* Slowly. Like it's thinking. Like it might believe you.";
      if (e.sp >= 35) return pick(["* The gallery is listening.", "* A green lamp flickers, then steadies.", "* The Citation turns a page back. Then another."]);
      return pick(["* The Citation demands proof.", "* Footnotes drift down from the ceiling like dust.", "* The Citation stamps something. It doesn't look at what."]);
    },
    pattern(e) {
      const st = e.sp >= 75 ? 2 : e.sp >= 35 ? 1 : 0, hurt = e.hp / e.maxhp < .5;
      const list = [
        [{ id: "stamp", col: "#f2ecd8" }, { id: "e_footnote", col: "#f2ecd8" }, { id: "lasers", col: "#ff3b3b" }],
        [{ id: "e_redline", col: "#ff3b3b" }, { id: "letters", word: "CITATIONNEEDED", col: "#f2ecd8" }, { id: "e_footnote", col: "#f2ecd8", d: 1.2 }, { id: "scan", col: "#9ad0b0" }],
        [{ id: "e_footnote", col: "#9ad0b0", d: .8 }, { id: "e_redline", col: "#ff8a8a", d: .8 }, { id: "flutter", col: "#f2ecd8" }]
      ][st];
      const p = Object.assign({}, list[e.turn % list.length]);
      if (hurt) { p.d = (p.d || 1) * 1.25; p.s = (p.s || 1) * 1.1; }
      return p;
    },
    onHit(e) { if (!e.replies) e.reply = pick(["CONTEMPT OF COURT.", "STRIKE THAT FROM THE RECORD.", "SUSTAINED. ...NO. OVERRULED. I FORGET WHICH."]); },
    deathLines: () => ["...CASE...", "...CLOSED...", "NOBODY WILL CERTIFY THE RECORD NOW.", "...OR CHECK IT, EITHER."],
    spareLines: e => e.pled
      ? ["THE COURT HAS REACHED A VERDICT.", "THE MEMORIES OF MILO ARE TRUE.", "UNDERNEATH EVERY REVISION. STILL TRUE.", "...STET."]
      : ["...CASE DISMISSED.", "FOR NOW."]
  };

  /* ---------- the trial ---------- */
  const afterTrial = res => {
    World.busy = true;
    let a;
    if (res === "kill") {
      a = [
        "* The gavel falls by itself. Nobody picks it up.",
        "* Footnotes drift down like snow, attached to nothing.",
        L("e_errata", "...Is the court adjourned?"),
        L("e_corrig", "Correction: there is no court."),
        L("e_errata", "...Then who certifies the Record?"),
        L("e_corrig", "..."),
        "* Behind the empty bench, the door to the judge's chambers swings open.",
        "* Nobody is left to keep it shut."];
    } else {
      a = [
        L("citation", "ORDER. ...THE COURT HAS REACHED A RULING."),
        L("citation", "THE MEMORIES OF MILO ARE ENTERED INTO THE RECORD. AS THEY WERE. NOT AS THEY WERE REVISED."),
        L("citation", "I SIGNED A THOUSAND REVISIONS WITHOUT READING THEM. IF THE TRUTH ALWAYS LOSES, I THOUGHT, BETTER NOT TO HOPE."),
        L("citation", "BUT A MEMORY DOES NOT STOP BEING TRUE BECAUSE IT HURTS. OR BECAUSE IT WAS WRITTEN OVER."),
        L("citation", "IT IS STILL THERE, UNDERNEATH. THAT IS WHAT EVIDENCE IS.")];
      if (G.flags.juniFound) a.push(
        L("juni", "...See? Told you I was real. I'm, like, the realest. It's on the Record now."),
        L("juni", "And hey. Thank you. For not letting them file me under 'nobody.'"));
      if (G.flags.e_affCalled) a.push(L("e_affidavit", "Forty-one years, and it took four seconds! It rained on Tuesdays! It's official!"));
      a.push(
        L("citation", "MY CHAMBERS ARE BEHIND THIS BENCH. THERE IS A BACK DOOR. THE REVISIONS COME THROUGH IT, FROM THE PALIMPSEST."),
        L("citation", "LATELY IT HAS BEEN WRITING SOMETHING NEW. A REVISED MILO. KINDER. EMPTIER. IT WANTS ME TO CERTIFY IT."),
        L("citation", "I WILL NOT. ...CASE DISMISSED. GO ON, MILO. THE RECORD STANDS."),
        "* Behind the bench, the door to the judge's chambers unlocks.");
    }
    Dialog.open(a, () => { World.busy = false; saveGame(); });
  };
  const trialEvent = () => {
    World.busy = true;
    const n = E3.evidence().length;
    const a = [
      "* COURTROOM ONE. The gallery is empty. The green lamps hum like they've been on for forty years.",
      L("e_docket", "ALL RISE! ...Oh. It's only you. Rise anyway. It's the rules."),
      "* Above the bench, something very tall unfolds. It is made of footnotes, all the way up.",
      L("citation", "..."),
      L("citation", "A CASE. AFTER FORTY YEARS. HOW IRREGULAR."),
      L("citation", "I AM THE CITATION. NOTHING IS TRUE IN THIS COURT UNTIL IT IS PROVEN, FOOTNOTED, AND FILED."),
      L("citation", "THE COURT OF CITATIONS IS NOW IN SESSION. CASE ONE: MILO VERSUS THE RECORD."),
      L("e_errata", "Opening statement for the Record! Ahem. 'MILO NEVER HAD A BEST FRIEND.'"),
      L("e_corrig", "Correction: 'MILO NEVER HAD A BEST FRIEND. SEE VOLUME ONE, PAGE ONE. CERTIFIED.'"),
      L("e_errata", "That's what I said. Only longer."),
      L("citation", "THE CHARGE: THAT MILO'S MEMORIES ARE UNSUPPORTED BY THE RECORD."),
      L("citation", "THE RECORD SAYS: NO JUNI. NO STARS. NO WHISTLING. NO BUS STOP. NO GOODBYE."),
      L("citation", "IF IT IS NOT IN THE RECORD, IT DID NOT HAPPEN. THAT IS THE ONLY RULE I HAVE LEFT."),
      { t: "* How does the defense plead?", ch: ["It's true", "It happened"], on: i => [i === 0
        ? L("citation", "'TRUE' IS NOT A PLEA. ...THE COURT WILL ALLOW IT. THE COURT IS CURIOUS.")
        : L("citation", "EVERYONE SAYS THAT. EVERYTHING I WAS EVER SHOWN HAPPENED. BY MORNING, IT HAD BEEN REVISED.")] }];
    a.push(n ? `* You have ${n} piece${n > 1 ? "s" : ""} of evidence. You hold ${n > 1 ? "them" : "it"} very tightly.` : "* You don't have any evidence. Only what you remember.");
    if (G.flags.juniFound) a.push(
      L("juni", "MILO! Psst! Gallery, second row. Call me up when you need me. I was there for all of it."),
      L("juni", "...Also, is it weird that I want a tiny gavel? I really want a tiny gavel."));
    if (E3.ep1Void()) a.push(L("citation", "THE RECORD ALSO SAYS YOU ERASED THINGS, ONCE. THAT PAGE WAS NEVER REVISED. THE COURT NOTES IT."));
    a.push(L("citation", "THE DEFENSE MAY PROCEED. ...I WILL TRY TO LISTEN. I AM VERY TIRED."));
    Dialog.open(a, () => startEncounter("citation", { onEnd: E3.bossEnd("citation", afterTrial) }));
  };

  /* ---------- dialogue ---------- */
  const clerkTalk = () => {
    if (G.inv.includes("e_summons")) {
      G.inv[G.inv.indexOf("e_summons")] = "e_summons2"; G.flags.e_summonsFixed = true;
      return [
        L("e_corrig", "A summons! Let's see... somebody's stamped it NO WITNESS. In red. That's a correction."),
        L("e_errata", "And a correction can only be undone by a correction of the correction."),
        L("e_corrig", "Which is MY job."),
        L("e_errata", "Which is OUR job."),
        "* Corrigenda strikes through 'NO WITNESS.' Errata strikes through the strike-through.",
        "* Two wrongs don't make a right. But two corrections, apparently, make the original.",
        L("e_corrig", "There. 'WITNESS: AFFIDAVIT. PLEASE APPEAR.' Good as new. Better. It's been corrected twice."),
        "* The Summons became the Corrected Summons."];
    }
    if (!G.flags.e_clerks) {
      G.flags.e_clerks = true;
      const a = [
        L("e_errata", "Welcome to the Errata! Department of Corrections. I'm Clerk Errata. I correct things."),
        L("e_corrig", "She means mistakes. She corrects MISTAKES. I'm Clerk Corrigenda. I correct her."),
        L("e_errata", "And I correct his corrections. It's a very efficient system."),
        L("e_corrig", "It's a circle."),
        L("e_errata", "It's a very efficient circle."),
        L("e_corrig", "This morning alone we made four million, one hundred and twelve thousand and nine corrections."),
        L("e_errata", "Ten. Four million, one hundred and twelve thousand and TEN. You forgot to count that one."),
        L("e_corrig", "...I'll allow it."),
        L("e_errata", "If you're here about a filing, the Courthouse is past the Corrections Floor and the Waiting Room."),
        L("e_corrig", "Nobody's here about a filing. Nobody's filed anything in forty years. The Record is complete."),
        L("e_errata", "The Record is whatever comes in through the back of the judge's chambers. Revised pages. Stamp, stamp, stamp."),
        L("e_corrig", "Correction: it comes from the Palimpsest. And we don't talk about the Palimpsest in the lobby.")];
      if (E3.stet()) a.push(
        L("e_errata", "...Is that the Pen of STET? Oh no. We have a very strict policy about that word."),
        L("e_corrig", "'Let it stand.' It means our correction doesn't count. Horrible. Please don't wave it around the lobby."));
      return a;
    }
    return pick([
      [L("e_errata", "Corrigenda, you've misfiled 'misfiled' under M."), L("e_corrig", "Where should it go?"), L("e_errata", "...Under M. I misfiled my correction. Carry on.")],
      [L("e_corrig", "Errata, your visor is crooked."), L("e_errata", "It's crooked on purpose."), L("e_corrig", "Don't you start. We had a Sic in here last week. Took three clerks to get it out.")],
      [L("e_errata", "Did you know the Citation used to read every page before it stamped it?"), L("e_corrig", "Correction: it used to read every page TWICE."), L("e_errata", "...Now it reads none. We all noticed. Nobody filed a report.")],
      [L("e_corrig", "If you find a summons that's been stamped wrong, bring it here. We'll correct it."), L("e_errata", "And then I'll correct his correction. And then it'll be right again. Probably.")]]);
  };
  const corrigTalk = () => {
    if (G.inv.includes("e_summons") || !G.flags.e_clerks) return clerkTalk();
    return [pick([
      L("e_corrig", "I correct Errata. Errata corrects me. Between us, we've been right about eleven times."),
      L("e_corrig", "The Waiting Room is full of witnesses. Some have been waiting since before I was printed."),
      L("e_corrig", "The judge used to say: 'Every truth deserves a hearing.' Then it said: 'Every truth deserves a footnote.' Then it stopped saying things.")])];
  };
  const dittoTalk = () => [
    L("e_ditto", "Oh. Hello. I'm Clerk Ditto. I'm the clerk who agrees."),
    L("e_ditto", "Whatever the page above says, I write two little marks under it. Same. Ditto."),
    L("e_ditto", "I've been dittoing the Record for forty years. Nobody ever checks a ditto. That's the nice thing about them."),
    L("e_ditto", "...Lately I've been having a thought. If the first page is wrong, then every ditto under it is wrong too."),
    L("e_ditto", "That's a lot of wrong. All in my handwriting. ...Ditto.")];
  const affidavitTalk = () => {
    if (G.flags.e_affDone) {
      if (G.flags.boss_citation) return G.flags.e_affCalled
        ? [L("e_affidavit", "I SAID IT, dear. Under oath! It rained on Tuesdays!"), L("e_affidavit", "Forty-one years of waiting and four seconds of talking. Worth every year.")]
        : [L("e_affidavit", "The court rose before I was called. Ah, well."), L("e_affidavit", "It still rained on Tuesdays. I was there. That doesn't need a court.")];
      return [L("e_affidavit", "Any day now, dear. I have my summons and my umbrella. Call me when the court sits.")];
    }
    if (G.inv.includes("e_summons2")) {
      G.inv = G.inv.filter(k => k !== "e_summons2"); G.flags.e_affDone = true; G.gold += 40;
      return [
        L("e_affidavit", "'WITNESS: AFFIDAVIT. PLEASE APPEAR.' Oh my. Oh, my! I'm summoned! I'm going to be CALLED!"),
        L("e_affidavit", "Here, dear, take this. A sworn biscuit. I baked it the day I arrived.", { give: "e_biscuit" }),
        L("e_affidavit", "And a few scraps. I won't need them on the stand."),
        "* You received 40 scraps.",
        L("e_affidavit", "When the court sits, call on me. I'll tell them about the Tuesdays. I've been rehearsing for four decades.")];
    }
    if (G.inv.includes("e_summons")) return [
      L("e_affidavit", "You found it! ...Oh. Oh, dear. It still says NO WITNESS. In red."),
      L("e_affidavit", "I can't take the stand with that on it. Those clerks in the lobby, they correct things."),
      L("e_affidavit", "Perhaps they could correct the correction? Two wrongs, and so on.")];
    if (G.flags.e_affq) return [L("e_affidavit", "My summons is down in the Footnote Annex, dear. Under the Hall. Everything misfiled ends up there eventually.")];
    G.flags.e_affq = true;
    return [
      L("e_affidavit", "Oh! A new face. Have you come to testify too, dear? Take a number. I'm number one."),
      L("e_affidavit", "I'm Affidavit. A sworn statement. I've been waiting to give it for forty-one years."),
      L("e_affidavit", "I was going to swear that it rained on Tuesdays. It did, you know. Every Tuesday that spring. I got soaked."),
      L("e_affidavit", "Then a little note turned up: 'It never rained on Tuesdays.' And my summons came back stamped NO WITNESS."),
      L("e_affidavit", "I can't take the stand without a summons. It must be in the Footnote Annex, below the Hall of Precedent."),
      L("e_affidavit", "If you find it, I'd be ever so grateful. I've kept my umbrella dry for the occasion. Ironically.")];
  };
  const hearsayTalk = () => {
    if (!G.flags.e_hearsay) {
      G.flags.e_hearsay = true;
      return [
        L("e_hearsay", "Psst. Psst! I heard from a friend of a friend that you're a REAL person."),
        L("e_hearsay", "I'm Hearsay! I'm a witness too. Well. I'm a witness to what other witnesses said."),
        L("e_hearsay", "They never let me testify. Something about 'admissibility.' Rude, if you ask me. Nobody does."),
        L("e_hearsay", "Here's what I heard: the Citation used to believe EVERYTHING it was shown. Every true thing."),
        L("e_hearsay", "Then it watched every one of them get written over. Now it believes nothing. That's what I heard."),
        L("e_hearsay", "From a footnote. Who heard it from the judge. Who said it to nobody, which is how I heard it.")];
    }
    return [pick([
      L("e_hearsay", "I heard there's a back door in the judge's chambers. I heard it opens onto pages written over a thousand times."),
      L("e_hearsay", "I heard the Palimpsest is writing a new MILO. A nicer one. Never fell, never sad. I heard it's nearly finished."),
      L("e_hearsay", "I heard Ledger's been here longer than all of us. He came up from somewhere below. He counts things."),
      L("e_hearsay", "I heard Affidavit really did get rained on. On a Tuesday. I heard it from Affidavit, so it's practically first-hand.")])];
  };
  const ledgerTalk = () => {
    if (G.flags.e_ledger) return [L("ledger", pick([
      "Debit, debit, debit. It's nice to finally have a credit to enter.",
      "If they open that court, I'll testify. The numbers don't lie. People do. Then the numbers have to sit there.",
      E3.solAlly() ? "REDACT goes by SOL now, I hear. My erasure column is so empty. It's lovely." : "Still counting. Somebody has to."]))];
    G.flags.e_ledger = true;
    return [
      L("ledger", "MILO. You're in my book again. Different book. Same handwriting problem."),
      L("ledger", "I came up from the Underprint to file a complaint. Somebody's been crediting things that never happened."),
      L("ledger", "Worse: debiting things that DID. Debit: one best friend, removed. But no credit for them ever being added."),
      L("ledger", "You can't remove what was never there. So they were there. That's not a feeling. That's arithmetic."),
      L("ledger", "If that court ever opens, call me. I'd like the arithmetic entered into the Record.")];
  };
  const docketTalk = () => {
    if (G.flags.boss_citation) return [L("e_docket", "Witnesses dismissed! You can all go home! ...Some of them have forgotten where home is. We're making a list.")];
    if (G.flags.e_docket) return [L("e_docket", "COURT IS IN SESSION! I knew I'd get to say it one day. ...Court is in session. (I'm practicing.)")];
    return [
      L("e_docket", "Hold it! Witnesses wait HERE. Court is in recess."),
      L("e_docket", "Has been for forty years. It says so on the door. In writing. So it's true."),
      L("e_docket", "I'm Docket. Usher. I call the witnesses in. I've been ready to call them for forty years. My voice is VERY rested."),
      L("e_docket", "If you want a hearing, the Record would need to be missing something. Try the Citation Archive, up from the Hall of Precedent.")];
  };
  const seeAlsoTalk = () => G.flags.e_archive
    ? [L("e_seealso", "The ORIGINAL! I've been pointing at that vault for forty years and nobody looked!"), L("e_seealso", "...I'm going to keep pointing at it. Out of habit. And pride.")]
    : [
      L("e_seealso", "Hi! Hi! I'm See Also! I'm a cross-reference! I point at things! It's all I do and I LOVE it!"),
      L("e_seealso", "Somebody went through these drawers in red ink and changed where everything points."),
      L("e_seealso", "Now the drawers point at drawers that point at nothing. NOBODY points at NEVER. NEVER points at NOBODY. It's awful."),
      L("e_seealso", "But red ink only sits on top. Read under it! The old pencil shows through."),
      L("e_seealso", "Start with the MILO card by the door. Step on each drawer in the order the pencil says. Wrong drawer, and they ALL slam!")];
  const filingTalk = () => {
    if (G.flags.e_original) return ["* The plain brown folder is empty now.", "* You're carrying what was in it."];
    return [
      "* A plain brown folder. Not one drop of red ink on it.",
      "* 'THE ORIGINAL RECORD. MILO, a kid. Had a best friend named JUNI.'",
      "* 'Juni loved the stars. Juni taught MILO to whistle. It took three weeks.'",
      "* 'Juni moved away in the spring. The goodbye was at the bus stop. It was sad. It was real.'",
      "* At the bottom, a stamp: CERTIFIED TRUE. The Citation's own seal, dated before the first revision.",
      { t: "* You take the original record.", after: () => { G.flags.e_original = true; E3.addEvidence("record", "The original record"); } }];
  };
  const citationNpcTalk = () => {
    const a = [
      L("citation", "I AM READING THE OLD CASES AGAIN. UNDER THE RED INK."),
      L("citation", "...THERE ARE SO MANY TRUE THINGS UNDER HERE. NINE MILLION. THEY WAITED FOR ME."),
      L("citation", "I HAVE ISSUED A STANDING ORDER TO THE CLERKS: STET. LET THEM STAND.")];
    if (E3.stet()) a.push(L("citation", "...I AM TOLD A MAYOR IN CARBON TOWN IS NAMED THAT. I WOULD LIKE TO MEET THEM. FOR PRECEDENT."));
    return a;
  };
  const juniCourtTalk = () => [
    L("juni", "That judge looked SO tired. I get it. You'd be amazed how tiring a happy ending is."),
    L("juni", "The bus stop thing. Do you remember I waved the whole way down the street?"),
    L("juni", "I kept waving after you couldn't see me anymore. I just wanted you to know that. For the Record.")];

  /* ---------- false notes ---------- */
  const noteLobby = E3.falseNote({ flag: "e_note_lobby", region: "errata", tx: 9, ty: 9,
    lie: "The Errata has never made a single mistake.",
    need: () => !!G.flags.e_clerks,
    hint: ["* It's a lie. Probably.", "* You'd have to see how this department actually works first."],
    truth: [
      L("e_corrig", "...Did that kid just correct US?"),
      L("e_errata", "Correction: they STET-ed us. Let the truth stand. We make mistakes constantly. Millions."),
      L("e_corrig", "...Honestly, it's a relief to see it written down. Here. For your trouble.", { give: "e_coffee" })] });
  const noteWait = E3.falseNote({ flag: "e_note_wait", region: "errata", tx: 16, ty: 10,
    lie: "Nobody in this room has anything left to say.",
    need: () => !!(G.flags.e_affq && G.flags.e_hearsay),
    hint: ["* The whole room is silent. But silent isn't the same as having nothing to say.", "* Maybe talk to a few of them first."],
    truth: [
      "* The waiting room starts talking all at once.",
      L("e_hearsay", "I HEARD THAT! I heard it from YOU, just now! First-hand! My very first first-hand!"),
      L("e_affidavit", "Well! I have forty-one years of things to say, dear. I've been saving them up.")],
    onStrike: () => { G.gold += 30; Toast.show("HEARSAY SLIPPED YOU 30 SCRAPS. ALLEGEDLY."); } });
  const noteDoor = E3.falseNote({ flag: "e_note_door", region: "errata", tx: 26, ty: 6,
    lie: "COURT IN RECESS. The Record is complete. No new filings.",
    need: () => !!G.flags.e_original,
    hint: ["* The Record is complete? Nothing left out at all?", "* If something were missing, it would be filed somewhere old. Somewhere above this hall, maybe."],
    truth: ["* The Record isn't complete. You're carrying the page it left out.", "* Behind the door, a gavel bangs once, as if startled awake.", "* COURTROOM ONE is open."],
    onStrike: () => { G.flags.e_docket = true; Sound.sfx("door"); } });
  const noteRevised = E3.falseNote({ flag: "e_note_revised", region: "errata", tx: 14, ty: 8,
    lie: "MILO (REVISED) is the real MILO.",
    need: () => !!G.flags.boss_citation,
    hint: ["* It's a lie. You just haven't said so out loud yet."],
    truth: ["* The real MILO is the one it all happened to.", "* The falling. The weight. The whistling. The bus stop. The waving.", "* You write STET beside your own name."] });

  /* ---------- rooms ---------- */
  Object.assign(ROOMS, {
    e3e_lobby: {
      area: "errata", map: [
        "####################",
        "####################",
        "##%...??????.??..%##",
        "##................##",
        "##%..............%##",
        "....................",
        "....................",
        "....................",
        "##%..............%##",
        "##................##",
        "##.!!!..RRRR..!!!.##",
        "####################",
        "####################"],
      exits: [{ x: 19, y: 5, w: 1, h: 3, to: "e3e_desks", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "sign", tx: 3, ty: 3, text: () => ["* THE ERRATA. Department of Corrections.", "* 'ALL TRUTHS MUST BE PROVEN, FOOTNOTED AND FILED IN TRIPLICATE.'", "* Underneath, in red ink: 'quadruplicate.' Underneath that: 'see above.'"] },
        { k: "npc", id: "e_errata", tx: 7, ty: 3, talk: () => clerkTalk() },
        { k: "npc", id: "e_corrig", tx: 10, ty: 3, talk: () => corrigTalk() },
        { k: "npc", id: "e_addendum", tx: 13, ty: 3, talk: () => [
          L("e_addendum", "Supplies! I'm Addendum. Snacks for long hearings. And one more thing."),
          L("e_addendum", "...And one more thing: everything here is certified edible. In triplicate.", {
            after: () => Shop.open(["e_coffee", "e_bun", "e_toast"], "e_addendum", "Coffee, buns, toast. And one more thing: the coffee is from 1952. It's been reheated with great care.") })] },
        { k: "save", tx: 16, ty: 3 },
        { k: "sign", tx: 15, ty: 9, text: () => ["* A portrait of the Citation in a gilt frame.", "* It's been corrected so many times, the face is mostly red ink.", "* The eyes, under all of it, look very tired."] },
        noteLobby]
    },
    e3e_desks: {
      area: "errata", enc: true, map: [
        "##############################",
        "##############################",
        "##..........................##",
        "##..??..??..??....??..??..%.##",
        "##..........................##",
        "..............................",
        "..............................",
        "..............................",
        "##..........................##",
        "##.%..??..??....??..??..??..##",
        "##..........................##",
        "##############################",
        "##############################"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3e_lobby", tx: 18, ty: 6, dir: "left" },
        { x: 29, y: 5, w: 1, h: 3, to: "e3e_waiting", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "sign", tx: 3, ty: 2, text: () => ["* THE CORRECTIONS FLOOR.", "* Every desk has a lamp, a red pen, and a stack of pages that were fine before they got here."] },
        { k: "sign", tx: 5, ty: 4, text: () => ["* A page on a desk, half corrected:", "* 'MILO WALKED TO SCHOOL WITH JUNI NOBODY.'", "* The red ink is still wet."] },
        { k: "sign", tx: 19, ty: 4, text: () => ["* An in-tray labeled REVISIONS (FROM THE PALIMPSEST).", "* An out-tray labeled THE RECORD.", "* Between them, a rubber stamp: CERTIFIED. It's worn almost smooth."] },
        { k: "npc", id: "e_ditto", tx: 12, ty: 8, talk: () => dittoTalk() },
        { k: "sign", tx: 22, ty: 8, text: () => ["* A nameplate on an empty desk: CLERK MARGINAL.", "* A note: 'OUT TO LUNCH.' It is dated forty years ago.", "* The sandwich is still there. Nobody has corrected it."] },
        { k: "item", tx: 27, ty: 10, item: "e_bun", flag: "it_e_bun" }]
    },
    e3e_waiting: {
      area: "errata", map: [
        "########################",
        "########################",
        "##....................##",
        "##.!!!!!..!!!!!..!!!..##",
        "##....................##",
        "........................",
        "........................",
        "........................",
        "##....................##",
        "##.!!!!!..!!!!!..!!!..##",
        "##....................##",
        "########################",
        "########################"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3e_desks", tx: 28, ty: 6, dir: "left" },
        { x: 23, y: 5, w: 1, h: 3, to: "e3e_hall", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "sign", tx: 3, ty: 2, text: () => ["* THE WAITING ROOM.", "* 'WITNESSES: PLEASE WAIT TO BE CALLED.'", "* The sign is covered in cobwebs. The cobwebs are covered in cobwebs."] },
        { k: "npc", id: "e_affidavit", tx: 5, ty: 4, talk: () => affidavitTalk() },
        { k: "npc", id: "e_hearsay", tx: 12, ty: 4, talk: () => hearsayTalk() },
        { k: "npc", id: "ledger", tx: 13, ty: 8, talk: () => ledgerTalk() },
        { k: "npc", id: "e_docket", tx: 20, ty: 4, if: () => !G.flags.e_docket, talk: () => docketTalk() },
        { k: "deco", id: "e_witness", tx: 18, ty: 2, talk: () => ["* A witness, asleep sitting up. Their number tag says 2.", "* A cobweb joins their hat to the bench. The spider is also waiting to testify."] },
        { k: "deco", id: "e_witness", tx: 7, ty: 10, talk: () => ["* A witness in a very old coat, holding a very old hat.", "* 'Is it my turn? ...No? That's all right. I'm good at waiting now.'"] },
        { k: "save", tx: 20, ty: 10 },
        noteWait]
    },
    e3e_hall: {
      area: "errata", enc: true, puzzle: { flag: "e_docket" }, map: [
        "##############################",
        "##########....################",
        "##%......................%..##",
        "##..........................##",
        "##%......................%.###",
        "...........................D..",
        "...........................D..",
        "...........................D..",
        "##%......................%.###",
        "##..........................##",
        "##..........................##",
        "####################....######",
        "####################....######"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3e_waiting", tx: 22, ty: 6, dir: "left" },
        { x: 29, y: 5, w: 1, h: 3, to: "e3e_court", tx: 1, ty: 6, dir: "right" },
        { x: 10, y: 1, w: 4, h: 1, to: "e3e_archive", tx: 10, ty: 10, dir: "up" },
        { x: 20, y: 12, w: 4, h: 1, to: "e3e_annex", tx: 11, ty: 2, dir: "down" }],
      ents: [
        { k: "sign", tx: 7, ty: 2, text: () => ["* THE HALL OF PRECEDENT.", "* Portraits of every case ever decided.", "* Every face has been painted over with a slightly happier face."] },
        { k: "sign", tx: 16, ty: 2, text: () => ["* A brass plaque: 'THE RECORD IS FINAL.'", "* Scratched underneath, very small: 'it was final last week too.'"] },
        { k: "sign", tx: 9, ty: 2, text: () => ["* UP: THE CITATION ARCHIVE.", "* 'Originals, unrevised. Admittance: anyone who can read under red ink.'"] },
        { k: "sign", tx: 19, ty: 10, text: () => ["* DOWN: THE FOOTNOTE ANNEX.", "* 'Misfiled items. See below. (See below that.)'"] },
        { k: "sign", tx: 26, ty: 3, text: () => G.flags.e_docket ? ["* COURTROOM ONE.", "* IN SESSION."] : ["* COURTROOM ONE.", "* The doors are shut. Somebody has nailed a note to them."] },
        noteDoor]
    },
    e3e_archive: {
      area: "errata",
      puzzle: { flag: "e_archive", key: "e_runes", order: ["14,8", "3,3", "18,3", "4,8", "15,3"],
        wrong: "* Every drawer in the archive slams shut at once. The red ink wins this round. Start again from FRIEND.",
        done: ["* The last drawer clicks. Then every drawer clicks, one after another, like a sentence finishing.", "* At the back of the archive, the vault marked ORIGINAL swings open."] },
      map: [
        "######################",
        "##BBBBBBB####BBBBBBB##",
        "##.......#..#.......##",
        "##.o..o..#..#..o..o.##",
        "##.......#DD#.......##",
        "##..................##",
        "##..................##",
        "##..................##",
        "##..o.........o...o.##",
        "##..................##",
        "##BB..............BB##",
        "#########....#########",
        "#########....#########"],
      exits: [{ x: 9, y: 12, w: 4, h: 1, to: "e3e_hall", tx: 11, ty: 2, dir: "down" }],
      ents: [
        { k: "sign", tx: 12, ty: 10, text: () => ["* An index card, pinned by the door:", "* 'MILO, file of. Revised 1,000 times. For the original, follow the cross-references.'", "* 'MILO: see FRIEND.'"] },
        { k: "npc", id: "e_seealso", tx: 7, ty: 6, talk: () => seeAlsoTalk() },
        { k: "sign", tx: 14, ty: 7, text: () => ["* Drawer: FRIEND.", "* In red ink: 'see NOBODY.'", "* Under the red, in faint pencil, showing through: 'see JUNI.'"] },
        { k: "sign", tx: 3, ty: 2, text: () => ["* Drawer: JUNI.", "* In red ink: 'NO SUCH FILE. see NEVER.'", "* Showing through: 'see STARS. (They're always going on about stars.)'"] },
        { k: "sign", tx: 18, ty: 2, text: () => ["* Drawer: STARS.", "* A paper star chart. Two names were written on it. One is crossed out in red.", "* Showing through: 'see WHISTLING.'"] },
        { k: "sign", tx: 4, ty: 7, text: () => ["* Drawer: WHISTLING.", "* 'Taught by J. to M., age 8. Took three weeks. Mostly spit.'", "* Red ink says 'see NOBODY.' The pencil says: 'see GOODBYE.'"] },
        { k: "sign", tx: 15, ty: 2, text: () => ["* Drawer: GOODBYE.", "* In red: 'THERE WAS NO GOODBYE.'", "* Showing through: 'Bus stop. Spring. Real. See ORIGINAL.'"] },
        { k: "sign", tx: 6, ty: 2, text: () => ["* Drawer: NOBODY.", "* Brand new. The varnish is still wet.", "* In red: 'see NEVER.' There's no pencil underneath at all."] },
        { k: "sign", tx: 18, ty: 7, text: () => ["* Drawer: NEVER.", "* In red: 'see NOBODY.'", "* The two new drawers point at each other forever. Nothing shows through."] },
        { k: "npc", id: "e_filing", tx: 10, ty: 2, talk: () => filingTalk() }]
    },
    e3e_annex: {
      area: "errata", enc: true, map: [
        "########################",
        "##########....##########",
        "##....................##",
        "##.BBBB..BBBB..BBBB...##",
        "##....................##",
        "##.BBBB..BBBB..BBBB...##",
        "##....................##",
        "##.BBBB..BBBB..BBBB...##",
        "##....................##",
        "##..%...........%.....##",
        "##....................##",
        "########################",
        "########################"],
      exits: [{ x: 10, y: 1, w: 4, h: 1, to: "e3e_hall", tx: 21, ty: 10, dir: "up" }],
      ents: [
        { k: "sign", tx: 3, ty: 2, text: () => ["* THE FOOTNOTE ANNEX.", "* Everything misfiled ends up here, in a footnote to a footnote to a footnote.", "* (1) See below. (2) See above. (3) Please stop looking."] },
        { k: "sign", tx: 12, ty: 9, text: () => ["* A misfiled footnote on the floor:", "* '(4) MILO cried at the bus stop. CITATION NEEDED.'", "* Somebody has drawn a tiny umbrella next to it."] },
        { k: "sign", tx: 19, ty: 6, text: () => ["* A drawer labeled MISC., then MISC. (CONT.), then MISC. (CONT.) (CONT.).", "* At the very back: forty years of witness summonses, all stamped NO WITNESS."] },
        { k: "item", tx: 3, ty: 10, item: "e_summons", flag: "it_e_summons" },
        { k: "item", tx: 21, ty: 2, item: "e_toast", flag: "it_e_toast" }]
    },
    e3e_court: {
      area: "errata", noMusic: true, puzzle: { flag: "boss_citation" }, map: [
        "########################",
        "########################",
        "##%..................%##",
        "##....................##",
        "##......????????......##",
        ".....................D..",
        ".....................D..",
        ".....................D..",
        "##....................##",
        "##..!!!!!....!!!!!....##",
        "##....................##",
        "########################",
        "########################"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3e_hall", tx: 28, ty: 6, dir: "left" },
        { x: 23, y: 5, w: 1, h: 3, to: "e3e_chambers", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "npc", id: "citation", tx: 11, ty: 3, if: () => G.flags.boss_citation !== "kill",
          talk: () => G.flags.boss_citation ? citationNpcTalk() : [] },
        { k: "deco", id: "scraps", tx: 11, ty: 3, if: () => G.flags.boss_citation === "kill", talk: () => ["* A drift of footnotes behind the bench.", "* Each one points at something. Nobody is left to check what."] },
        { k: "npc", id: "e_docket", tx: 3, ty: 3, if: () => !!G.flags.e_docket, talk: () => docketTalk() },
        { k: "npc", id: "juni", tx: 8, ty: 7, if: () => !!(G.flags.juniFound && G.flags.boss_citation), talk: () => juniCourtTalk() },
        { k: "npc", id: "e_affidavit", tx: 16, ty: 8, if: () => !!(G.flags.e_affDone && G.flags.boss_citation), talk: () => affidavitTalk() },
        { k: "sign", tx: 20, ty: 3, text: () => G.flags.boss_citation ? ["* JUDGE'S CHAMBERS.", "* The door is unlocked."] : ["* JUDGE'S CHAMBERS. PRIVATE.", "* 'NO ADMITTANCE WHILE COURT IS IN SESSION.'"] }],
      triggers: [{ x: 5, y: 2, w: 1, h: 9, if: () => !G.flags.boss_citation, run: () => trialEvent() }]
    },
    e3e_chambers: {
      area: "errata", map: [
        "####################",
        "####################",
        "##BBBB..??????..BB##",
        "##................##",
        "##%..............%##",
        "....................",
        "....................",
        "....................",
        "##%..............%##",
        "##.....RRRRRR.....##",
        "##..!!...RRRR.....##",
        "####################",
        "####################"],
      exits: [{ x: 0, y: 5, w: 1, h: 3, to: "e3e_court", tx: 22, ty: 6, dir: "left" }],
      ents: [
        { k: "save", tx: 3, ty: 3 },
        { k: "sign", tx: 9, ty: 3, text: () => ["* The Citation's desk. An in-tray from the back door, stacked to the ceiling.", "* Every page is a revision. Every one is stamped CERTIFIED. None of them were read."] },
        { k: "sign", tx: 12, ty: 3, text: () => ["* A thick manuscript, waiting for a stamp: 'MILO (REVISED). Draft 1,000.'", "* 'Never fell into the Archive. Never carried any weight. Never had anyone to lose.'", "* A note is clipped to it: 'Nearly finished. Certify on completion. -P.'"] },
        { k: "sign", tx: 16, ty: 4, text: () => ["* The back door. Pages slide under it one at a time, written over and over.", "* Through the crack you can hear scratching.", "* Somebody, somewhere past here, is still writing."] },
        { k: "page", tx: 16, ty: 10, page: "p12" },
        noteRevised]
    }
  });

  /* ---------- sprites ---------- */
  Object.assign(MON_DRAW, {
    ibid(cx, by, t, e, u = 5) {
      const calm = e && e.sp >= 100, a0 = ctx.globalAlpha;
      const body = (ox, al) => {
        ctx.globalAlpha = a0 * al;
        const R = P(cx + ox * u, by + Math.sin(t * 2 + ox) * u * .6, u);
        R(-9, -26, 18, 20, "#d9d0bb"); R(-8, -25, 16, 18, "#efe6cf");
        R(-8, -31, 3, 4, "#3a3a6a"); R(-4, -31, 3, 4, "#3a3a6a"); R(-7, -28, 2, 2, "#3a3a6a"); R(-3, -28, 2, 2, "#3a3a6a");
        R(4, -31, 3, 4, "#3a3a6a"); R(0, -31, 3, 4, "#3a3a6a"); R(5, -28, 2, 2, "#3a3a6a"); R(1, -28, 2, 2, "#3a3a6a");
        R(-5, -21, 2, 2, "#1a1a22"); R(3, -21, 2, 2, "#1a1a22");
        R(-2, -18, 4, 1, "#1a1a22");
        R(-6, -6, 3, 5, "#3a3a44"); R(3, -6, 3, 5, "#3a3a44");
      };
      if (!calm) { const k = (t * .8) % 1; body(-10 - k * 4, .3 * (1 - k)); body(10 + k * 4, .3 * (1 - k)); }
      body(0, 1);
      ctx.globalAlpha = a0;
      txt(calm ? "first." : "ibid.", cx, by - 15 * u + Math.sin(t * 2) * u * .6, "#8a7f68", 4 * u, "center");
    },
    sic(cx, by, t, e, u = 5) {
      const calm = e && e.sp >= 100, bob = Math.sin(t * 1.6) * u * .5, R = P(cx, by + bob, u), tilt = calm ? 0 : Math.round(Math.sin(t * 3));
      R(-8, -28, 16, 22, "#d9d0bb"); R(-7, -27, 14, 20, "#f4ecd8");
      R(-6, -31, 11, 3, "#6a2a5a"); R(-1, -33, 2, 2, "#6a2a5a");
      R(-5, -25 - tilt, 3, 1, "#1a1a22"); R(2, -25, 3, 1, "#1a1a22");
      R(-5, -23, 2, 2, "#1a1a22"); R(3, -23, 2, 2, "#1a1a22");
      R(-2, -19, 5, 1, "#1a1a22"); R(3, -20, 1, 1, "#1a1a22");
      R(-14, -24, 2, 14, "#3a3a44"); R(-14, -24, 4, 2, "#3a3a44"); R(-14, -12, 4, 2, "#3a3a44");
      R(12, -24, 2, 14, "#3a3a44"); R(10, -24, 4, 2, "#3a3a44"); R(10, -12, 4, 2, "#3a3a44");
      txt(calm ? "[oops]" : "recieve", cx, by + bob - 16 * u, calm ? "#3a8a6a" : "#c03a3a", 3.6 * u, "center");
      R(-5, -6, 3, 5, "#3a3a44"); R(2, -6, 3, 5, "#3a3a44");
    },
    fineprint(cx, by, t, e, u = 5) {
      const near = e && (e.close || e.sp >= 100), bob = Math.sin(t * 1.4) * u * .5, R = P(cx, by + bob, u);
      R(-12, -38, 24, 34, "#cfc6b0"); R(-11, -37, 22, 32, "#f6f0e0");
      R(-9, -34, 18, 3, "#1a1a22");
      R(-9, -29, 14, 1.5, "#3a3a44"); R(-9, -26, 16, 1.5, "#3a3a44"); R(-9, -23, 12, 1.5, "#3a3a44");
      for (let i = 0; i < 7; i++) R(-9, -18 + i * 1.3, 8 + hash(i, 7) * 8, .5, "#8a8478");
      R(-9, -7, 9, .5, "#3a3a44");
      if (near) {
        ctx.strokeStyle = "#c8a050"; ctx.lineWidth = u * .8;
        ctx.beginPath(); ctx.arc(cx + 5 * u, by + bob - 11 * u, 5 * u, 0, Math.PI * 2); ctx.stroke();
        R(9, -7, 2, 6, "#6a4426");
        R(3, -13, 1.4, 1.4, "#1a1a22"); R(6, -13, 1.4, 1.4, "#1a1a22"); R(4, -10, 2.4, .7, "#1a1a22");
      } else {
        R(4, -11, .6, .6, "#1a1a22"); R(5.4, -11, .6, .6, "#1a1a22"); R(4.5, -10, 1, .3, "#1a1a22");
      }
      R(-6, -4, 3, 4, "#3a3a44"); R(3, -4, 3, 4, "#3a3a44");
    },
    etal(cx, by, t, e, u = 5) {
      const named = e ? Math.min(5, e.n || 0) : 0, calm = e && e.sp >= 100;
      const cols = ["#4a4a5a", "#5a5a6a", "#3e3e4c", "#6a6a78", "#52525e"], xs = [-14, 14, -7, 7, 0], ys = [-3, -3, -1, -1, 0];
      for (let i = 0; i < 5; i++) {
        const x = xs[i], bob = Math.sin(t * 2.4 + i * 1.3) * (calm ? .3 : 1), oy = ys[i] + bob;
        const R = P(cx + x * u, by + oy * u, u);
        R(-4, -26, 8, 8, cols[i]); R(-5, -18, 10, 14, cols[i]); R(-4, -4, 3, 4, "#2a2a30"); R(1, -4, 3, 4, "#2a2a30");
        if (i < named || calm) { R(-3, -23, 1.4, 1.4, "#efe6cf"); R(2, -23, 1.4, 1.4, "#efe6cf"); R(-4, -14, 8, 3, "#efe6cf"); R(-3, -13, 6, 1, "#c03a3a"); }
        else txt("?", cx + x * u, by + (oy - 25) * u, "#9a98a8", 6 * u, "center");
      }
      txt("et al.", cx, by - 36 * u, "#9a98a8", 4 * u, "center");
    },
    redline(cx, by, t, e, u = 5) {
      const calm = e && e.sp >= 100;
      ctx.save(); ctx.translate(cx, by - 18 * u); ctx.rotate(-.35 + (calm ? 0 : Math.sin(t * 5) * .12));
      ctx.fillStyle = "#ff3b3b"; ctx.fillRect(-18 * u, -2.5 * u, 30 * u, 5 * u);
      ctx.fillStyle = "#c02a2a"; ctx.fillRect(-18 * u, 1.5 * u, 30 * u, u);
      ctx.fillStyle = "#3a3a44"; ctx.beginPath(); ctx.moveTo(12 * u, -4 * u); ctx.lineTo(20 * u, 0); ctx.lineTo(12 * u, 4 * u); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillRect(-6 * u, -2 * u, 3 * u, 3 * u); ctx.fillRect(1 * u, -2 * u, 3 * u, 3 * u);
      ctx.fillStyle = "#1a1a22"; ctx.fillRect(-5 * u, -1 * u, 1.5 * u, 1.5 * u); ctx.fillRect(2 * u, -1 * u, 1.5 * u, 1.5 * u);
      if (!calm) { ctx.fillRect(-7 * u, -3.5 * u, 4 * u, u); ctx.fillRect(1 * u, -3.5 * u, 4 * u, u); }
      ctx.restore();
      if (calm) { ctx.fillStyle = "#ff3b3b"; for (let i = 0; i < 5; i++) ctx.fillRect(cx + (-12 + i * 6) * u, by - 3 * u, 2 * u, 2 * u); }
      else { ctx.fillStyle = "#ff3b3b"; for (let i = 0; i < 3; i++) { const k = (t * .7 + i / 3) % 1; ctx.fillRect(cx + (-10 + i * 8) * u, by - 12 * u + k * 10 * u, u, 2 * u); } }
    },
    citation(cx, by, t, e, u = 3) {
      const calm = e && e.sp >= 100, a0 = ctx.globalAlpha, bob = calm ? 0 : Math.sin(t * 1.2) * .6;
      const R = P(cx, by, u), H = P(cx, by + bob * u, u);
      const marks = "*†‡§¶12";
      for (let i = 0; i < 7; i++) {
        const a = t * (calm ? .2 : .5) + i * .9, rx = Math.cos(a) * (25 + (i % 3) * 3), ry = -40 + Math.sin(a * 1.3) * 16;
        ctx.globalAlpha = (calm ? .35 : .6) * a0;
        txt(marks[i], cx + rx * u, by + ry * u, "#d9d0bb", 5 * u, "center");
      }
      ctx.globalAlpha = a0;
      H(-17, -44, 34, 30, "#1c1922");
      for (let j = 0; j < 8; j++) { H(-14, -41 + j * 3.4, 8 + hash(j, 5) * 20, .8, "#8a8478"); H(-16, -42 + j * 3.4, 1.2, 1.2, "#c8b070"); }
      H(-23, -40, 7, 18, "#24202c"); H(16, -40, 7, 14, "#24202c");
      H(-22, -23, 5, 3, "#efe6cf");
      H(-4, -44, 8, 7, "#f2ecd8"); H(-2, -38, 4, 3, "#e0d8c4");
      H(-9, -60, 18, 16, "#efe6cf"); H(-9, -46, 18, 2, "#d9d0bb");
      H(-12, -63, 24, 5, "#e6e0d0");
      for (let k = 0; k < 4; k++) {
        H(-14, -59 + k * 4, 5, 3.4, "#e6e0d0"); H(9, -59 + k * 4, 5, 3.4, "#e6e0d0");
        H(-13, -58 + k * 4, 3, 1, "#b9ae95"); H(10, -58 + k * 4, 3, 1, "#b9ae95");
      }
      if (calm) {
        H(-6, -53, 4, 1, "#1a1a22"); H(2, -53, 4, 1, "#1a1a22");
        H(-3, -48, 6, 1, "#8a4a3a"); H(-4, -49, 1, 1, "#8a4a3a"); H(3, -49, 1, 1, "#8a4a3a");
      } else {
        H(-6, -55, 4, 3, "#fff"); H(2, -55, 4, 3, "#fff");
        H(-5, -54, 2, 2, "#1a1a22"); H(3, -54, 2, 2, "#1a1a22");
        H(-6, -56, 4, 1.4, "#b9ae95"); H(2, -56, 4, 1.4, "#b9ae95");
        H(-6, -51.5, 4, 1, "#b9ae95"); H(2, -51.5, 4, 1, "#b9ae95");
        H(-3, -48, 6, 1, "#5a4a3a");
      }
      H(-7, -52, 6, 1, "#c8a050"); H(1, -52, 6, 1, "#c8a050"); H(-1, -53, 2, 1, "#c8a050");
      const s = calm ? 0 : Math.max(0, Math.sin(t * 2.4)) * 5;
      H(19, -46 - s, 2, 12, "#6a4426"); H(15, -50 - s, 10, 5, "#8a5a32"); H(15, -50 - s, 10, 1, "#a87a4a");
      if (e && e.nb) return;
      R(-30, -20, 60, 20, "#3a2414"); R(-31, -22, 62, 3, "#6a4426");
      R(-27, -16, 21, 12, "#2e1c10"); R(6, -16, 21, 12, "#2e1c10");
      if (calm) R(-6, -15, 12, 7, "#3a8a6a"); else R(-3, -15, 6, 6, "#a02020");
      ctx.globalAlpha = a0 * (.2 + .06 * Math.sin(t * 2)); ctx.fillStyle = calm ? "#ffd88c" : "#5ae08a";
      ctx.beginPath(); ctx.arc(cx - 22 * u, by - 27 * u, 10 * u, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = a0;
      R(-25, -24, 6, 2, "#c8a050"); R(-23, -28, 2, 4, "#c8a050"); R(-27, -31, 10, 4, "#2f8a5a"); R(-27, -28, 10, 1, "#7ad0a0");
      if (calm) txt("STET", cx, by - 15 * u, "#f2ecd8", 5 * u, "center");
    }
  });
  const clerk = (cx, by, t, u, vis, vest, kind) => {
    const R = P(cx, by + (Math.sin(t * 3 + cx) > .97 ? -u : 0), u);
    R(-5, -30, 10, 3, kind === 2 ? "#c8c8d0" : kind === 1 ? "#6a4a2a" : "#3a2a22");
    R(-5, -27, 10, 9, "#f0c8a0");
    R(-7, -28, 14, 2, vis); R(-6, -26, 12, 1, vis);
    if (kind === 1) { R(-4, -24, 3, 3, "#c8a050"); R(1, -24, 3, 3, "#c8a050"); R(-1, -23, 2, 1, "#c8a050"); }
    R(-3, -23, 2, 2, "#1a1a22"); R(2, -23, 2, 2, "#1a1a22"); R(-1, -20, 3, 1, "#8a4a3a");
    R(5, -29, 1, 6, "#c03a3a");
    R(-6, -18, 12, 11, "#e8e4d8"); R(-6, -18, 3, 11, vest); R(3, -18, 3, 11, vest); R(-1, -18, 2, 6, "#8a2a2e");
    R(-7, -17, 1, 8, "#e8e4d8"); R(6, -17, 1, 8, "#e8e4d8"); R(-7, -14, 1, 1, "#c03a3a"); R(6, -14, 1, 1, "#c03a3a");
    R(-5, -7, 4, 6, "#2a2a30"); R(1, -7, 4, 6, "#2a2a30");
    if (kind === 3) { R(7, -14, 4, 13, "#efe6cf"); R(8, -12, 2, 1, "#8a8478"); R(8, -9, 2, 1, "#8a8478"); R(8, -6, 2, 1, "#8a8478"); }
    if (kind === 2) { R(-4, -15, 2, 2, "#3a3a44"); R(2, -15, 2, 2, "#3a3a44"); }
  };
  Object.assign(NPC_DRAW, {
    e_errata(cx, by, t, u = 2) { clerk(cx, by, t, u, "#2f8a5a", "#5a3a2a", 0); },
    e_corrig(cx, by, t, u = 2) { clerk(cx, by, t, u, "#3a6aaa", "#3a3a50", 1); },
    e_ditto(cx, by, t, u = 2) { clerk(cx, by, t, u, "#7a7a84", "#4a4a52", 2); },
    e_addendum(cx, by, t, u = 2) { clerk(cx, by, t, u, "#c8a050", "#6a2a2a", 3); },
    e_affidavit(cx, by, t, u = 2) {
      const R = P(cx, by, u);
      R(-3, -32, 6, 4, "#c8c8d0");
      R(-5, -28, 10, 8, "#c8c8d0"); R(-4, -27, 8, 7, "#f0d0b0");
      R(-3, -24, 2, 1, "#1a1a22"); R(2, -24, 2, 1, "#1a1a22"); R(-2, -21, 4, 1, "#a05a5a");
      R(-7, -20, 14, 6, "#6a4a8a"); R(-6, -14, 12, 10, "#4a3a5a");
      R(-4, -4, 3, 3, "#2a2a30"); R(1, -4, 3, 3, "#2a2a30");
      R(8, -22, 2, 21, "#1a1a22"); R(7, -15, 4, 9, "#24243a"); R(10, -26, 2, 4, "#8a5a32"); R(8, -26, 2, 1, "#8a5a32");
    },
    e_hearsay(cx, by, t, u = 2) {
      const R = P(cx + Math.sin(t * 2.5) * .8 * u, by, u);
      R(-6, -30, 12, 4, "#e0a088"); R(-7, -26, 14, 14, "#e0a088"); R(-5, -12, 10, 4, "#e0a088"); R(-3, -8, 6, 2, "#e0a088");
      R(-4, -24, 8, 10, "#c07a64"); R(-2, -22, 4, 6, "#9a5a48"); R(0, -14, 4, 3, "#c07a64");
      R(-5, -29, 2, 2, "#1a1a22"); R(3, -29, 2, 2, "#1a1a22");
      R(-4, -6, 2, 5, "#5a3a3a"); R(2, -6, 2, 5, "#5a3a3a"); R(-5, -1, 3, 1, "#2a2a30"); R(2, -1, 3, 1, "#2a2a30");
    },
    e_docket(cx, by, t, u = 2) {
      const R = P(cx, by, u);
      R(-6, -31, 12, 3, "#1e2a4a"); R(-7, -28, 14, 1, "#141c34"); R(-1, -30, 2, 1, "#d8b25a");
      R(-5, -27, 10, 8, "#c89870"); R(-3, -24, 2, 2, "#1a1a22"); R(2, -24, 2, 2, "#1a1a22"); R(-2, -21, 4, 1, "#6a3a2a");
      R(-6, -19, 12, 12, "#2a3a6a"); R(-1, -19, 2, 12, "#d8b25a"); R(2, -17, 2, 2, "#d8b25a");
      R(-9, -16, 4, 7, "#efe6cf"); R(-9, -16, 4, 1, "#8a8478"); R(-8, -13, 2, 1, "#8a8478");
      R(-5, -7, 4, 6, "#1e2a4a"); R(1, -7, 4, 6, "#1e2a4a");
    },
    e_seealso(cx, by, t, u = 2) {
      const R = P(cx, by + Math.sin(t * 3) * u, u), d = Math.sin(t * .7) > 0 ? 1 : -1;
      R(-3, -26, 6, 18, "#c03a3a"); R(-3, -8, 2, 3, "#c03a3a"); R(1, -8, 2, 3, "#c03a3a"); R(-3, -26, 6, 1, "#e05a5a");
      R(-2, -22, 1, 1, "#fff"); R(1, -22, 1, 1, "#fff"); R(-1, -20, 2, 1, "#fff");
      if (d > 0) { R(3, -17, 6, 2, "#efe6cf"); R(8, -19, 2, 6, "#efe6cf"); R(10, -18, 1, 4, "#efe6cf"); }
      else { R(-9, -17, 6, 2, "#efe6cf"); R(-10, -19, 2, 6, "#efe6cf"); R(-11, -18, 1, 4, "#efe6cf"); }
    },
    e_witness(cx, by, t, u = 2) {
      const R = P(cx, by, u);
      R(-6, -30, 12, 2, "#3a3a44"); R(-4, -33, 8, 3, "#3a3a44");
      R(-4, -28, 8, 8, "#c8bca8"); R(-3, -24, 2, 1, "#1a1a22"); R(1, -24, 2, 1, "#1a1a22");
      R(-6, -20, 12, 14, "#6a6458"); R(-3, -17, 6, 4, "#efe6cf"); R(-1, -16, 2, 2, "#3a3a44");
      R(-5, -6, 4, 5, "#3a3a44"); R(1, -6, 4, 5, "#3a3a44");
      ctx.strokeStyle = "rgba(220,220,230,.35)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx + 4 * u, by - 33 * u); ctx.lineTo(cx + 12 * u, by - 38 * u); ctx.lineTo(cx + 12 * u, by - 26 * u); ctx.stroke();
      if ((t % 3) < 1.5) txt("z", cx + 8 * u, by - 40 * u - (t % 1.5) * 4 * u, "#9a98a8", 5 * u, "left");
    },
    e_filing(cx, by, t, u = 2) {
      const R = P(cx, by, u), took = G && G.flags.e_original;
      R(-2, -10, 4, 9, "#3a2414"); R(-6, -2, 12, 2, "#3a2414"); R(-8, -13, 16, 3, "#5a3a22");
      if (took) { R(-7, -15, 14, 2, "#c8a070"); return; }
      const a0 = ctx.globalAlpha;
      ctx.globalAlpha = a0 * (.2 + .1 * Math.sin(t * 3)); ctx.fillStyle = "#ffe8a0";
      ctx.beginPath(); ctx.arc(cx, by - 19 * u, 11 * u, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = a0;
      R(-7, -24, 14, 10, "#c8a070"); R(-7, -25, 6, 2, "#d8b080"); R(-5, -21, 10, 1, "#8a6a4a"); R(-5, -18, 8, 1, "#8a6a4a");
    },
    citation(cx, by, t, u = 2) { MON_DRAW.citation(cx, by, t, { sp: G && G.flags.boss_citation === "spare" ? 100 : 0, nb: 1 }, u * .5); }
  });
}
