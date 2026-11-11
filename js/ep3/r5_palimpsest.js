"use strict";
/* ============================================================
   VOIDHEART — Episode 3, region 5: THE PALIMPSEST
   Inside the great manuscript. Every layer is a kinder rewrite of a
   place MILO knows, and the true version always shows through.
   Area "palim", rooms e3p_*, boss MILO (REVISED). See docs/EP3_SPEC.md
   ============================================================ */
{
  /* ---------- area, palette, songs ---------- */
  POOLS.palim = ["p_overwrite", "p_ghosttext", "p_vellum", "p_secondthought", "p_corrigendum"];
  AREAS.palim = { name: "THE PALIMPSEST", music: "palim", sub: "every draft, still underneath" };
  PAL.palim = {
    floor: "#e6dcc4", alt: "#e0d5ba", spec: "#b4a486", wall: "#2a2119", face: "#7a6650", line: "#544434",
    rug: "#b89a72", rug2: "#d8c098", shelf: "#5a4632", grass: "#a8b890", grass2: "#e8f0d8",
    scrape: "#f3ecda", scratch: "#cfc2a2", ink: "#3a2e24"
  };
  Object.assign(SONGS, {
    palim: { bpm: 72, tracks: [
      { w: "triangle", v: .05, n: "D5 - - - A4 - F#4 - G4 - - - A4 - - - B4 - A4 - G4 - F#4 - E4 - - - - - - -" },
      { w: "sine", v: .06, n: "D2 - - - - - - - B1 - - - - - - - G1 - - - - - - - A1 - - - - - - -" },
      { w: "square", v: .006, n: ". . D6 . . . . . . . A5 . . . . . . . B5 . . . . . . . F#5 . . . . ." }] },
    milorevised: { bpm: 132, tracks: [
      { w: "square", v: .02, n: "E5 . G#5 . B5 . A5 . G#5 . E5 . F#5 . E5 . . . E5 . G#5 . B5 . C#6 . B5 . A5 . G#5 ." },
      { w: "triangle", v: .07, n: "E2 E3 E2 E3 E2 E3 E2 E3 C#2 C#3 C#2 C#3 A1 A2 A1 A2 E2 E3 E2 E3 E2 E3 E2 E3 A1 A2 B1 B2 B1 B2 B1 B2" },
      { w: "sine", v: .014, n: "E4 - - - - - - - G4 - - - - - - - D4 - - - - - - - E4 - - - - - - -" }] }
  });

  /* ---------- items ---------- */
  Object.assign(ITEMS, {
    p_leaf1: { name: "Leaf: Margins", type: "key", desc: "A scraped leaf from the revised Margins. Hold it to the light: a kid, falling." },
    p_leaf2: { name: "Leaf: Underprint", type: "key", desc: "A scraped leaf from the revised Underprint. Outlines show through it." },
    p_leaf3: { name: "Leaf: Hollowmere", type: "key", desc: "A scraped leaf from revised Hollowmere. There's rain on it. Old rain." },
    p_inktea: { name: "Steeped Ink", type: "heal", heal: 35, desc: "Quill's recipe, revised. Tastes like a memory of tea." },
    p_draftcake: { name: "Draft Cake", type: "heal", heal: 40, desc: "Every layer a different recipe. The bottom one is the best." },
    p_candlestub: { name: "Tallow's Stub", type: "heal", heal: 60, desc: "A bit of Tallow's own candle. Warm all the way through." },
    p_vellumcloak: { name: "Vellum Cloak", type: "armor", def: 14, desc: "Scraped thin and written over a thousand times. Still holding. DEF +14." }
  });
  Object.assign(SPEAKERS, {
    p_tallow: { name: "TALLOW", voice: 260 },
    p_quillrev: { name: "QUILL (REVISED)", voice: 360 },
    p_ledgerrev: { name: "LEDGER (REVISED)", voice: 200 },
    p_postbox: { name: "POSTBOX", voice: 230 },
    p_draft47: { name: "DRAFT 47", voice: 470 },
    p_milorev: { name: "MILO (REVISED)", voice: 340 }
  });

  /* ---------- custom tiles: & show-through text, $ scraped vellum, ^ overwritten lines ---------- */
  const SHOW_LABELS = {
    "6,3": ["I FELL", 1], "11,3": ["NEVER FELL", 0], "16,3": ["WEIGHTLESS", 0], "21,3": ["SOMEONE LEFT", 1],
    "6,8": ["NO ONE LEFT", 0], "11,8": ["I KEPT GOING", 1], "16,8": ["I CARRIED IT", 1], "21,8": ["ALWAYS FINE", 0]
  };
  const showLabel = (x, y, tx, ty, t, W) => {
    if (W.roomId !== "e3p_show") return;
    const lb = SHOW_LABELS[tx + "," + ty];
    if (!lb) return;
    if (lb[1]) txt(lb[0], x - 16, y + 9, `rgba(122,84,190,${.5 + .25 * Math.sin(t * 1.6 + tx)})`, 15, "center");
    else txt(lb[0], x - 16, y + 9, "#1e1812", 15, "center");
  };
  TILE_DRAW["&"] = (x, y, tx, ty, pal, t, W, h) => {
    const a = .2 + .1 * Math.sin(t * .9 + h * 12);
    ctx.fillStyle = `rgba(122,96,170,${a})`;
    for (let i = 0; i < 3; i++) {
      const r = hash(tx * 3 + i, ty * 7), yy = y + 7 + i * 9;
      ctx.fillRect(x + 3 + r * 6, yy, 10 + r * 14, 2);
      if (r > .5) ctx.fillRect(x + 4 + r * 8, yy - 3, 2, 4);
    }
    showLabel(x, y, tx, ty, t, W);
  };
  TILE_DRAW["$"] = (x, y, tx, ty, pal, t, W, h) => {
    ctx.fillStyle = pal.scrape || "#f3ecda"; ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = pal.scratch || "#cfc2a2";
    for (let i = 0; i < 4; i++) { const r = hash(tx * 5 + i, ty * 11); ctx.fillRect(x + r * 24, y + ((r * 7) % 1) * 26, 6, 1); }
    if (W.tile(tx, ty - 1) !== "$") ctx.fillRect(x, y, TILE, 1);
    // the revised Margins: the paper pile MILO landed in shows through
    if (W.roomId === "e3p_margins") {
      ctx.globalAlpha = G && G.flags.p_lay1 ? .6 : .14;
      ctx.fillStyle = "#d9d0bb"; ctx.fillRect(x + 2 + h * 6, y + 6, 18, 12);
      ctx.fillStyle = "#b7ad96"; ctx.fillRect(x + 10, y + 14 + h * 4, 16, 12);
      ctx.globalAlpha = 1;
    }
    showLabel(x, y, tx, ty, t, W);
  };
  TILE_DRAW["^"] = (x, y, tx, ty, pal, t, W, h) => {
    ctx.fillStyle = pal.ink || "#3a2e24"; ctx.fillRect(x, y, TILE, TILE);
    const cols = ["#7a6a58", "#8a6ab0", "#a89070", "#5a4a3e"];
    for (let i = 0; i < 6; i++) {
      const r = hash(tx * 13 + i, ty * 3 + i);
      ctx.fillStyle = cols[i % 4]; ctx.fillRect(x + 1 + r * 6, y + 3 + i * 5, 14 + r * 14, 2);
    }
    ctx.fillStyle = "rgba(192,74,58,.7)"; ctx.fillRect(x, y + 14 + h * 4, TILE, 1);
    const below = W.tile(tx, ty + 1);
    if (below !== "^" && below !== "#") { ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(x, y + TILE - 5, TILE, 5); }
  };
  TILE_DRAW["^"].floor = false;
  SOLID.add("^");

  /* ---------- small helpers ---------- */
  const REV_PAL = { h: "#cdbba4", s: "#fff2e4", e: "#6a6a8a", c: "#eef2fa", p: "#e6d4ff", l: "#c4c8d6", b: "#9ea2b2" };
  const miloBmp = (x, y, s, pal) => { bmp(MILO.down, pal, x, y, s); bmp(MILO.legsV[0], pal, x, y + 13 * s, s); };
  const use = (e, k) => (e.u[k] = (e.u[k] || 0) + 1);
  const kills = () => (E3.ep1().killed || []).length + (E3.ep2().killed || []).length + (G.kills || 0);
  const leaves = ["p_leaf1", "p_leaf2", "p_leaf3"];
  /* a thin spot: read the true layer underneath, and peel off one scraped leaf */
  const thinSpot = (lay, leaf, truth) => () => {
    const first = !G.flags[lay];
    G.flags[lay] = true;
    const a = first
      ? ["* The vellum here has been scraped so many times it's thin as breath.", "* You hold it up to the light. Older writing shows through:", ...truth()]
      : ["* The old writing still shows through, as clear as you let it be.", truth()[truth().length - 1]];
    if (!G.flags[leaf + "_got"]) {
      if (G.inv.length >= 8) a.push("* The thinnest layer is coming loose. But your pockets are full.");
      else { G.flags[leaf + "_got"] = true; a.push({ t: "* The thinnest layer peels away in your fingers. A scraped leaf.", give: leaf }); }
    }
    return a;
  };

  /* ---------- monsters ---------- */
  Object.assign(MONSTERS, {
    p_overwrite: {
      name: "Overwrite", area: "palim", hp: 120, atk: 8, def: 2, exp: 44, gold: 28, voice: 330,
      check: "OVERWRITE - ATK 8 DEF 2\n* A page that writes each new sentence on top of the last.\n* It has never once let anything finish.",
      intro: "* Overwrite scrawls itself over the scenery!",
      flavor: ["* Overwrite is writing over its own last sentence.", "* The ink on Overwrite is still wet. It is always still wet.", "* You start to think something. Overwrite has already written over it."],
      spareFlavor: "* Overwrite has put its pen down. One sentence sits there, unrevised.",
      talk: ["NO, LET ME REPHRASE.", "WHAT I MEANT WAS. WHAT I MEANT WAS.", "NEWER IS BETTER. NEWER IS BETTER-ER."],
      spareTalk: "...i'll leave that one. it was fine the first time.",
      acts: {
        "Let It Finish": e => { e.fin = 1; e.sp += 25; e.reply = "...AND THAT'S THE WHOLE SENTENCE. huh. that felt weird."; return "* You wait. You don't interrupt.\n* For the first time, Overwrite reaches the end of a sentence."; },
        "Read First Line": e => {
          if (!e.fin) { e.reply = "STOP. THAT'S AN OLD VERSION."; return "* You try to read the first thing it wrote.\n* Overwrite scribbles over it. Maybe let it finish something first."; }
          e.sp += 45; e.reply = "...that was my FIRST line. you liked it?";
          return "* You read Overwrite's first line out loud: 'It was a nice day.'\n* It was good. It was always good.";
        },
        "Interrupt": e => { e.sp = Math.max(0, e.sp - 25); e.rage = 1; e.reply = "NO, LET ME REPHRASE THAT REPHRASING."; return "* You talk over Overwrite.\n* It writes over you, louder and smaller and faster."; }
      },
      pats: [{ id: "p_layers", col: "#e8dcc0" }, { id: "letters", word: "REPHRASEREPHRASE", col: "#d8c8a8" }]
    },
    p_ghosttext: {
      name: "Ghost Text", area: "palim", hp: 95, atk: 7, def: 1, exp: 40, gold: 24, voice: 520,
      check: "GHOST TEXT - ATK 7 DEF 1\n* The faint first line of a page, still showing through.\n* It was written first. Then everyone wrote over it.",
      intro: "* Faint writing drifts up off the page. It's Ghost Text.",
      flavor: ["* Ghost Text flickers between invisible and very slightly visible.", "* You can almost make out a word. 'Dear'?", "* Ghost Text wants to be read. It does not want to be stared at."],
      spareFlavor: "* Ghost Text is clear as day. It's a little embarrassed.",
      talk: ["...i was here first...", "(something illegible, but heartfelt)", "...under all of it. still me."],
      spareTalk: "...you READ me. all the way to the end.",
      acts: {
        "Lean Close": e => { e.close = 1; e.sp += 20; e.reply = "...closer. i'm very small print."; return "* You lean in until your nose almost touches the page.\n* The letters stop hiding. A little."; },
        "Finish Sentence": e => {
          if (!e.close) { e.reply = "...?"; return "* You guess at the sentence.\n* You can't see enough of it to guess. Get closer first."; }
          e.sp += 45; e.reply = "'...whoever finds this: i was happy here.' YES. that's it.";
          return "* You read the faint words and say the end of the line out loud.\n* It's a letter. It always was.";
        },
        "Ink Over It": e => { e.sp = Math.max(0, e.sp - 30); e.reply = "...gone again. it's fine. it's fine."; return "* You trace over Ghost Text in fresh, dark ink.\n* It vanishes under the new line. It's used to that."; }
      },
      pats: [{ id: "flutter", col: "#c8b8ff" }, { id: "ringwave", col: "#d8ccf0" }]
    },
    p_vellum: {
      name: "Scraped Vellum", area: "palim", hp: 140, atk: 7, def: 4, exp: 50, gold: 32, voice: 200,
      check: "SCRAPED VELLUM - ATK 7 DEF 4\n* A page scraped clean so it could be written on again.\n* Four hundred times. It's very thin-skinned.",
      intro: "* Scraped Vellum flinches into view. (You didn't even touch it.)",
      flavor: ["* Scraped Vellum is so thin you can see the room through it.", "* Scraped Vellum is bracing for the knife.", "* It smells like an old library and a brand-new apology."],
      spareFlavor: "* Scraped Vellum is resting. Something small and kind is written on it.",
      talk: ["don't. DON'T scrape.", "they always scrape before they write.", "...is it going to sting?"],
      spareTalk: "...you wrote something and didn't scrape first.",
      acts: {
        "Let It Rest": e => {
          e.rest = 1; e.sp += 20; e.nextPat = { id: "flutter", col: "#f4ecd8", d: .6, s: .8 };
          e.reply = "...a turn off? i've never had a turn off.";
          return "* You promise not to write anything this turn.\n* Scraped Vellum's next attack is half-hearted. It's resting.";
        },
        "Write Kindly": e => {
          if (!e.rest) { e.reply = "NO NO NO NOT YET."; return "* You raise your pencil.\n* Scraped Vellum flinches so hard it creases. Let it rest first."; }
          e.rest = 0; e.sp += 40; e.reply = "...'you're doing fine.' ...i'll keep that one.";
          return "* You write one small, kind sentence. No scraping first.\n* Scraped Vellum holds very still so the ink can dry.";
        },
        "Scrape Clean": e => { e.sp = Math.max(0, e.sp - 30); e.reply = "AAAH. there it goes. there it always goes."; return "* You scrape the old writing off to make room.\n* It's what everyone does. Scraped Vellum curls up tighter."; }
      },
      pats: [{ id: "rain", col: "#f4ecd8", d: 1.1 }, { id: "walls", col: "#e8dcc0" }]
    },
    p_secondthought: {
      name: "Second Thought", area: "palim", hp: 110, atk: 8, def: 2, exp: 46, gold: 30, voice: 440,
      check: "SECOND THOUGHT - ATK 8 DEF 2\n* A revision that keeps changing its mind.\n* Agree with it at the right moment. Its moments are short.",
      intro: "* Second Thought appears! (It's having second thoughts about it.)",
      init: () => ({ mind: 1 }),
      flavor: ["* Second Thought flips over. Then back. Then over."],
      spareFlavor: "* Second Thought has made up its mind. It's sticking with it.",
      flavorFn(e) {
        if (e.sp >= 100) return this.spareFlavor;
        return e.mind ? "* Second Thought has decided it likes you. (For now.)" : "* Second Thought has decided you're suspicious. (For now.)";
      },
      talk: ["yes. no. YES. ...no?"],
      talkFn(e) {
        if (e.sp >= 100 || e.reply) return null;
        return e.mind ? pick(["you seem NICE. i've decided.", "i like your shoes. final answer.", "let's be friends. firmly. for now."])
          : pick(["you're up to something. i've decided.", "i take back the shoes thing.", "hmm. HMM. hmmmmm."]);
      },
      spareTalk: "i'm going to keep liking you. on purpose.",
      acts: {
        "Agree": e => {
          if (e.mind) { e.sp += 40; e.reply = "YES. exactly. wait. no. YES."; return "* You agree with Second Thought.\n* At that moment it was being lovely. It's thrilled someone noticed."; }
          e.sp = Math.max(0, e.sp - 20); e.reply = "AH-HA. so you AGREE you're suspicious?";
          return "* You agree with Second Thought.\n* Unfortunately, right now it thinks you're a menace.";
        },
        "Hold That Thought": e => {
          e.held = 1; e.mind = 1; e.sp += 20; e.reply = "...hold it? like, KEEP it? a whole turn?";
          return "* You ask Second Thought to hold its nicest thought. Just one. Just for a turn.\n* It clutches the opinion very tightly.";
        },
        "Flip a Coin": e => { e.sp += 25; e.reply = "heads i spare you. tails i... spare you? huh."; return "* You flip a coin for Second Thought.\n* It's so relieved not to choose that it forgets which side it wanted."; }
      },
      afterTurn(e) { if (e.held) e.held = 0; else e.mind = 1 - e.mind; return null; },
      pats: [{ id: "p_revise", col: "#d8b88a" }, { id: "loop", col: "#c8b8ff" }]
    },
    p_corrigendum: {
      name: "Corrigendum", area: "palim", hp: 100, atk: 7, def: 3, exp: 42, gold: 26, voice: 600,
      check: "CORRIGENDUM - ATK 7 DEF 3\n* A slip of paper that says 'FOR X, READ Y.'\n* It has corrected itself so often it forgot what it said first.",
      intro: "* Corrigendum flutters in, apologizing for the previous Corrigendum.",
      flavor: ["* Corrigendum reads: 'FOR \"SCARY\" READ \"SLIGHTLY SCARY\".'", "* Corrigendum is correcting the spelling of its own name.", "* Somewhere, a footnote sighs."],
      spareFlavor: "* Corrigendum reads: 'FOR \"ENEMY\" READ \"ACQUAINTANCE\".'",
      talk: ["FOR 'HELLO' READ 'HALT'.", "CORRECTION: i meant to say that louder.", "i fix things. that's all i'm FOR."],
      spareTalk: "FOR 'FIGHT' READ 'FRIEND'. ...leave that one. it's right.",
      acts: {
        "Accept It": e => {
          e.acc = (e.acc || 0) + 1; e.sp += 25;
          const lines = [["FOR 'MILO' READ 'MILO'.", "* You accept Corrigendum's correction: 'For MILO, read MILO.'\n* It's exactly the same. Corrigendum is so pleased."],
            ["...you accepted ANOTHER one?", "* You accept another correction: 'For \"the\", read \"the\".'\n* Corrigendum is starting to trust you."],
            ["you're very easy to correct.", "* You accept one more. Corrigendum glows a little."]];
          const l = lines[Math.min(e.acc - 1, 2)]; e.reply = l[0]; return l[1];
        },
        "Read the Original": e => {
          if ((e.acc || 0) < 2) { e.reply = "ORIGINAL? there's no original. there's only ME."; return "* You try to read under the corrections.\n* Corrigendum covers it up. It doesn't trust you enough yet."; }
          e.sp += 40; e.reply = "'THE END.' ...i've been correcting THE END?";
          return "* Under ninety corrections, in tiny type, the original says: THE END.\n* Corrigendum is flabbergasted. And relieved.";
        },
        "Correct It": e => { e.sp = Math.max(0, e.sp - 25); e.reply = "FOR 'CORRECT IT' READ 'HOW DARE YOU'."; return "* You point out that Corrigendum has a typo.\n* It corrects your correction of its correction. It is furious."; }
      },
      pats: [{ id: "lasers", col: "#e8dcc0" }, { id: "stamp", col: "#f4ecd8" }]
    },

    /* ---------- the boss: MILO (REVISED) ---------- */
    milorevised: {
      name: "MILO (REVISED)", area: "palim", hp: 420, atk: 9, def: 3, exp: 0, gold: 0, voice: 340, boss: true, bar: true,
      title: "MILO (REVISED) // A KINDER DRAFT", music: "milorevised", noFlee: true,
      killText: "* The kinder draft is gone.\n* You earned nothing. You knew you would.",
      check: "MILO (REVISED) - ATK 9 DEF 3\n* You, if nothing sad had happened.\n* Polite. Cheerful. A little bit see-through.",
      intro: "* MILO (REVISED) waves hello. Its shoelaces are double-knotted.",
      init: () => ({ u: {} }),
      actNames() {
        const a = ["Remember the Fall", "Show the Weight", "Remember Goodbye"];
        if (G.flags.p_draft) a.push("Read First Draft");
        if (G.flags.juniFound) a.push("Whistle");
        a.push("Agree With It", "Let It Stay");
        return a;
      },
      acts: {
        "Remember the Fall": e => {
          const n = use(e, "fall");
          if (n === 1) {
            e.sp += 18; e.reply = "I never fell. I stayed in bed that day. It was a very safe Tuesday.";
            return E3.ep1Void()
              ? "* You tell it about the fall. And what you did after.\n* You erased everyone you met down there. That's yours too.\n* MILO (REVISED) has never held anything like that."
              : "* You tell it about the fall. The ceiling, the dark, a pile of paper.\n* An ink bottle running over, shouting 'oh oh oh, a PERSON!'";
          }
          if (n === 2) {
            e.sp += 12; e.reply = "...you went BACK? on purpose?";
            return E3.ep2().ending
              ? "* And then you went back. Under the Archive, into the Underprint.\n* Nobody made you. You went because they asked."
              : "* You tell it how the fall felt: the lurch, the dark, the landing.\n* It still makes your stomach drop. You wouldn't trade it.";
          }
          e.sp += 8; e.reply = "...you keep coming back to that part.";
          return "* You tell it about the fall again. A different detail every time.\n* It's yours. You can tell it as often as you like.";
        },
        "Show the Weight": e => {
          const n = use(e, "weight"), k = kills();
          if (n === 1) {
            e.sp += 18; e.reply = k ? "...that looks so heavy. why not just put it down?" : "...choosing sounds tiring. i've never had to choose anything.";
            return `* You show it your WEIGHT. WT ${G.wt}.\n` + (k
              ? `* ${k} name${k > 1 ? "s" : ""} you erased along the way. You carry every one.`
              : "* You never erased anyone. But every single time, you had to choose not to.");
          }
          if (n === 2) { e.sp += 12; e.reply = "...and it doesn't crush you?"; return "* You don't put it down.\n* The weight is what remembering costs. You can afford it."; }
          e.sp += 8; e.reply = "...you hold it like it's yours."; return "* You shift the weight to your other shoulder.\n* MILO (REVISED) watches how you do it. Carefully.";
        },
        "Remember Goodbye": e => {
          const n = use(e, "bye");
          if (n === 1) {
            e.sp += 18;
            if (G.flags.juniFound) { e.reply = "...Juni? there's a gap in me, right where that name goes."; return "* You tell it about Juni. The rain. The moving truck.\n* You watched from behind the curtain, and didn't go out. You wish you had."; }
            e.reply = "...a goodbye? i never had one of those.";
            return "* You tell it about the torn photo. Half of you, laughing at someone who isn't there.\n* There was a goodbye. You can't quite see it. It was real.";
          }
          if (n === 2) { e.sp += 12; e.reply = "...so the sad part is... proof?"; return "* The goodbye hurt. You say so, out loud.\n* It hurt BECAUSE the friendship was real. You won't scrape out one to lose the other."; }
          e.sp += 8; e.reply = "...it still hurts? and you still keep it?"; return "* You don't explain it this time. You just remember it.\n* MILO (REVISED) can see it on your face.";
        },
        "Read First Draft": e => {
          if (e.u.draft) { e.reply = "...i know. i read it too."; return "* You show it the first draft again.\n* It doesn't need to read it twice. Neither do you."; }
          e.u.draft = 1; e.sp += 25; e.reply = "...that's MY first draft too. isn't it.";
          return "* You remember Tallow holding every leaf to the light.\n* Underneath them all: I FELL. I CARRIED IT. SOMEONE LEFT. I KEPT GOING.";
        },
        "Whistle": e => {
          if (e.u.whistle) { e.reply = "...still can't. you're showing off now."; return "* You whistle again. It's getting better.\n* Juni would say it's still flat. Juni would be right."; }
          e.u.whistle = 1; e.sp += 20; e.reply = "...teach me? ...no. you can't. someone taught YOU.";
          return "* You whistle, the way Juni taught you. Badly. Then a little better.\n* MILO (REVISED) tries. Nothing comes out. Nobody taught it.";
        },
        "Agree With It": e => {
          e.sp = Math.max(0, e.sp - 15); e.reply = "SEE? we can both be me. you can stop now.";
          return "* You agree. It would be easier, if nothing sad had happened.\n* MILO (REVISED) beams. Something in you goes very quiet.";
        },
        "Let It Stay": e => {
          if (e.sp < 70) { e.reply = "...stay? but you're not done telling me why."; return "* You reach out to it.\n* It steps back, smiling politely. It doesn't understand what you're keeping. Not yet."; }
          e.sp = 100; e.reply = "...";
          return "* You tell MILO (REVISED) it doesn't have to go away.\n* It can stay. Not instead of you. As part of you.";
        }
      },
      canSpare: e => e.sp >= 100,
      talkFn(e) {
        if (e.sp >= 100) return ["...oh.", "that's what you were keeping, the whole time."];
        if (e.reply) { const r = e.reply; e.reply = null; return r; }
        const N = ["Isn't this nice? Nobody's sad here.", "I've never skinned a knee. Look. Perfect knees.",
          "You could rest! I'll do the rest. That's a pun. PALIMPSEST put it in.", "Why do you keep all of it? It's so heavy.",
          "My handwriting is very neat. Yours is all crossed out.", "...I'm trying to understand. I really am."];
        return N[Math.min(e.turn - 1, N.length - 1)];
      },
      flavorFn(e) {
        if (e.sp >= 100) return "* MILO (REVISED) holds out its hand. Not to fight. To be held.";
        if (e.sp >= 60) return "* MILO (REVISED)'s outline is going faint. Something older shows through it.";
        if (e.hp < e.maxhp * .3) return "* MILO (REVISED)'s neat handwriting is starting to smudge.";
        return pick(["* MILO (REVISED) waves politely. Again.", "* MILO (REVISED) smells like a brand-new notebook.", "* MILO (REVISED) smiles at you the way you smile in school photos."]);
      },
      pattern(e) {
        const r = e.hp / e.maxhp, ph = r < .45 ? 2 : e.sp >= 40 ? 1 : 0;
        const L = [
          [{ id: "flutter", col: "#f4ecd8" }, { id: "p_layers", col: "#e8dcc0" }, { id: "rain", col: "#d8ccf0", d: .9 }],
          [{ id: "p_revise", col: "#e8dcc0" }, { id: "letters", word: "NOTHINGSADEVERHAPPENED", col: "#d8ccf0" }, { id: "p_layers", col: "#c8b8ff", d: 1.15 }],
          [{ id: "mixed", col: "#e8dcc0" }, { id: "p_layers", col: "#ffffff", d: 1.3 }, { id: "collapse", col: "#d8ccf0" }]][ph];
        const p = Object.assign({}, L[e.turn % L.length]);
        p.d = (p.d || 1) * (1 - Math.min(.3, e.sp / 300));
        return p;
      },
      onHit(e) { e.reply = pick(["ow! ...is that what that feels like?", "you're allowed to be angry. i never am.", "that'll leave a mark. i don't HAVE marks."]); },
      deathLines: () => ["...oh.", "I was only trying to be the version that didn't hurt.", "...you can keep the hurt. I guess you always were going to."],
      spareLines: () => {
        const a = ["...you're keeping all of it? the fall, the weight, the goodbye?",
          "then I'm not who you'd be if nothing sad had happened.",
          "I'm who you are when you hope anyway.",
          "I'll be the part of you that hopes."];
        if (G.flags.juniFound) a.push("...and tell Juni i'd still like to learn to whistle.");
        return a;
      }
    }
  });

  /* ---------- patterns ---------- */
  Object.assign(PAT, {
    /* a faint line of older text shows through, then is written over in ink */
    p_layers: { box: [270, 170], dur: 5.5, def: { col: "#e8dcc0" }, fn(B, S, P, dt, b) {
      if (!tick(S, 1.0 / P.d, dt, "c", .2)) return;
      const y = B.y + 14 + rand(B.h - 28), gx = B.x + 22 + rand(B.w - 44), word = "ONCEUPONATIMENOTHINGHAPPENED";
      b.spawn({ x: B.x + B.w / 2, y, w: B.w, h: 18, shape: "warn", col: "#be6cff", life: .66,
        upd(o) {
          if (o.t > .6 && !o.fired) {
            o.fired = 1;
            for (let x = B.x + 8, i = 0; x < B.x + B.w; x += 14, i++) {
              if (Math.abs(x - gx) < 22) continue;
              b.spawn({ x, y, vx: 0, vy: 18 * P.s, r: 6, col: P.col, shape: "char", ch: word[i % word.length], life: 1.4 });
            }
          }
        } });
    } },
    /* a sentence that falls, stops, and changes its mind */
    p_revise: { box: [250, 180], dur: 5.5, def: { col: "#e8dcc0" }, fn(B, S, P, dt, b) {
      if (!tick(S, .42 / P.d, dt)) return;
      b.spawn({ x: B.x + 10 + rand(B.w - 20), y: B.y - 6, vx: 0, vy: 120 * P.s, r: 5, col: P.col, shape: "orb", life: 4,
        upd(o) {
          if (o.t > .55 && !o.st) { o.st = 1; o.vx = 0; o.vy = 0; }
          if (o.t > .85 && o.st === 1) {
            o.st = 2; o.col = "#be6cff";
            const v = aimAt(b, o.x, o.y, 140 * P.s);
            if (Math.random() < .5) { o.vx = v.vx; o.vy = v.vy; } else { o.vx = -v.vx * .6; o.vy = Math.abs(v.vy) * .4 + 40; }
          }
        } });
    } }
  });

  /* ---------- sprites: monsters ---------- */
  Object.assign(MON_DRAW, {
    p_overwrite(cx, by, t, e, u = 5) {
      const calm = e && e.sp >= 100, R = P(cx, by + Math.sin(t * 2) * 2, u);
      R(-10, -30, 20, 26, "#8a7a62"); R(-9, -29, 18, 24, "#efe4c8");
      const cols = ["#3a2e24", "#7a5aa8", "#a0603a", "#5a6a8a"];
      for (let i = 0; i < 8; i++) for (let k = 0; k < (calm ? 1 : 3); k++) {
        const w = 6 + ((i * 7 + k * 3 + Math.floor(t * (calm ? 0 : 6))) % 9);
        R(-7 + k, -27 + i * 2.6 + k * .6, w, .8, cols[(i + k) % 4]);
      }
      R(-6, -16, 12, 5, "#efe4c8");
      R(-5, -15, 2, calm ? 1 : 3, "#1a1a22"); R(3, -15, 2, calm ? 1 : 3, "#1a1a22");
      R(-2, -10, 4, 1, "#1a1a22");
      const pw = calm ? 0 : Math.sin(t * 14) * 2;
      R(10, -30 + pw, 2, 14, "#3a3a44"); R(10, -16 + pw, 2, 3, "#d8b25a");
      R(-5, -4, 3, 3, "#8a7a62"); R(2, -4, 3, 3, "#8a7a62");
    },
    p_ghosttext(cx, by, t, e, u = 5) {
      const k = e ? Math.min(1, (e.sp || 0) / 100) : 0, a0 = ctx.globalAlpha;
      ctx.globalAlpha = a0 * (.18 + .1 * Math.sin(t * 2));
      ctx.fillStyle = "#c8b8ff"; ctx.beginPath(); ctx.ellipse(cx, by - 18 * u, 17 * u, 13 * u, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = a0 * (.3 + .6 * k + .1 * Math.sin(t * 2.6));
      const L = ["dear whoever", "finds this:", "i was happy"];
      for (let i = 0; i < 3; i++) txt(L[i], cx + Math.sin(t + i) * u, by - (29 - i * 7) * u, "#e0d6ff", 6 * u, "center");
      ctx.globalAlpha = a0 * (.6 + .4 * k);
      const R = P(cx, by + Math.sin(t * 1.4) * 2, u);
      R(-6, -9, 3, 2, "#efe8ff"); R(3, -9, 3, 2, "#efe8ff");
      if (k >= 1) R(-2, -6, 4, 1, "#efe8ff");
      ctx.globalAlpha = a0;
    },
    p_vellum(cx, by, t, e, u = 5) {
      const calm = e && e.sp >= 100, sh = calm ? 0 : Math.sin(t * 20) * .4, a0 = ctx.globalAlpha;
      const R = P(cx + sh * u, by + Math.sin(t * 1.5) * 2, u);
      ctx.globalAlpha = a0 * .82;
      R(-11, -30, 22, 26, "#f6efdc");
      R(-11, -30, 4, 3, "#ddd0b2"); R(7, -7, 4, 3, "#ddd0b2");
      for (let i = 0; i < 7; i++) R(-9 + hash(i, 2) * 14, -28 + i * 3.4, 4 + hash(i, 5) * 5, .5, "#cbbd9c");
      ctx.globalAlpha = a0;
      R(-5, -19, 2, calm ? 1 : 2, "#3a2e24"); R(3, -19, 2, calm ? 1 : 2, "#3a2e24");
      if (calm) { R(-2, -14, 4, 1, "#3a2e24"); txt("you're fine", cx, by - 11 * u, "#7a5aa8", 3.6 * u, "center"); }
      else R(-1, -15, 2, 2, "#3a2e24");
    },
    p_secondthought(cx, by, t, e, u = 5) {
      const calm = e && e.sp >= 100, m = e ? e.mind : 1, f = calm ? 1 : Math.cos(t * 2.4);
      ctx.save(); ctx.translate(cx, by); ctx.scale(Math.max(.12, Math.abs(f)), 1);
      const R = P(0, Math.sin(t * 3) * 2, u), side = f > 0 ? m : 1 - m;
      R(-10, -31, 20, 25, "#c8b898"); R(-9, -30, 18, 23, side ? "#f4ecd8" : "#ecdcd0");
      R(-5, -25, 2, 2, "#1a1a22"); R(3, -25, 2, 2, "#1a1a22");
      if (side || calm) { R(-5, -16, 3, 3, "#4a9a5a"); R(-2, -13, 3, 3, "#4a9a5a"); R(1, -16, 3, 3, "#4a9a5a"); R(4, -19, 3, 3, "#4a9a5a"); }
      else { for (let i = 0; i < 4; i++) { R(-5 + i * 2.5, -19 + i * 2.5, 3, 3, "#c04a3a"); R(3 - i * 2.5, -19 + i * 2.5, 3, 3, "#c04a3a"); } }
      R(-6, -6, 3, 4, "#8a7a62"); R(3, -6, 3, 4, "#8a7a62");
      ctx.restore();
    },
    p_corrigendum(cx, by, t, e, u = 5) {
      const calm = e && e.sp >= 100, oy = Math.sin(t * 3) * 2, R = P(cx, by + oy, u), y0 = by + oy;
      R(-7, -32, 14, 28, "#c8b898"); R(-6, -31, 12, 26, "#fbf6e8");
      txt("FOR", cx, y0 - 30 * u, "#5a4a3a", 3.6 * u, "center");
      txt(calm ? "FIGHT" : "HELLO", cx, y0 - 26 * u, "#3a2e24", 3.6 * u, "center");
      R(-5, -24, 10, .6, "#c04a3a");
      txt("READ", cx, y0 - 22 * u, "#5a4a3a", 3.6 * u, "center");
      txt(calm ? "FRIEND" : "HALT", cx, y0 - 18 * u, calm ? "#4a9a5a" : "#c04a3a", 3.6 * u, "center");
      R(-3, -12, 2, 2, "#1a1a22"); R(2, -12, 2, 2, "#1a1a22");
      R(-2, -8, 4, calm ? 1 : .6, "#1a1a22");
      if (!calm) { ctx.strokeStyle = "rgba(192,74,58,.7)"; ctx.lineWidth = u * .5; ctx.beginPath(); ctx.arc(cx + 5 * u, y0 - 7 * u, 3 * u, 0, Math.PI * 2); ctx.stroke(); }
    },
    milorevised(cx, by, t, e, u = 5) {
      const k = e ? Math.min(1, (e.sp || 0) / 100) : 0, s = u * 1.5, a0 = ctx.globalAlpha;
      const bob = Math.sin(t * 2) * u * .6, x = Math.round(cx - 6 * s), y = Math.round(by - 16 * s + bob);
      ctx.globalAlpha = a0 * .35; ctx.fillStyle = "#000";
      ctx.beginPath(); ctx.ellipse(cx, by - u * .4, 6 * s, 1.6 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = a0 * .16; ctx.fillStyle = "#d8ccf0";
      for (let i = 0; i < 7; i++) ctx.fillRect(cx - 11 * s, by - 17 * s + i * 2.4 * s, 22 * s, Math.max(1, s * .15));
      // the real MILO, showing through the kinder draft
      ctx.globalAlpha = a0 * (.12 + .55 * k + .05 * Math.sin(t * 3));
      miloBmp(x + Math.round(Math.sin(t * 1.3) * s * .4), y, s, MILO_PAL);
      ctx.globalAlpha = a0 * (1 - .45 * k);
      miloBmp(x, y, s, REV_PAL);
      ctx.globalAlpha = a0;
      ctx.fillStyle = "#d89a9a"; ctx.fillRect(x + 5 * s, y + 6.5 * s, 2 * s, Math.max(1, .5 * s));
      ctx.globalAlpha = a0 * (1 - k);
      for (let i = 0; i < 4; i++) {
        const ph = (t * .8 + i / 4) % 1, sx = cx + Math.cos(i * 1.7) * 9 * s, sy = by - (6 + i * 3.2) * s, z = s * .5 * Math.sin(ph * Math.PI);
        ctx.fillStyle = "#fff"; ctx.fillRect(sx - z, sy - z * .2, z * 2, z * .4); ctx.fillRect(sx - z * .2, sy - z, z * .4, z * 2);
      }
      ctx.globalAlpha = a0;
    }
  });

  /* ---------- sprites: NPCs ---------- */
  Object.assign(NPC_DRAW, {
    p_tallow(cx, by, t, u = 2) {
      const R = P(cx, by, u), f = Math.sin(t * 9) * .5 + Math.sin(t * 13) * .3;
      ctx.save();
      ctx.globalAlpha *= .22 + .08 * Math.sin(t * 5); ctx.fillStyle = "#ffd84a";
      ctx.beginPath(); ctx.arc(cx, by - 19 * u, 7 * u, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      R(-7, -3, 14, 2, "#8a6a3a"); R(-6, -1, 12, 1, "#5a4428"); R(6, -6, 3, 1, "#8a6a3a"); R(8, -6, 1, 4, "#8a6a3a");
      R(-4, -14, 8, 11, "#efe4c8"); R(-4, -14, 8, 1, "#fff6e0");
      R(-4, -13, 1, 4, "#fff6e0"); R(2, -13, 1, 6, "#fff6e0"); R(3, -13, 1, 3, "#fff6e0");
      R(0, -16, 1, 2, "#2a2018");
      R(-1 + f * .3, -21, 3, 5, "#ff9d3f"); R(0 + f * .3, -20, 1, 3, "#fff2a0");
      R(-2, -10, 1, 2, "#2a2018"); R(1, -10, 1, 2, "#2a2018"); R(-1, -7, 2, 1, "#a0603a");
    },
    p_quillrev(cx, by, t, u = 2) {
      ctx.save();
      const a0 = ctx.globalAlpha;
      ctx.globalAlpha = a0 * .22; NPC_DRAW.quill(cx + 2 * u, by, t + .4, u);
      ctx.globalAlpha = a0; ctx.filter = "saturate(.25) brightness(1.35)";
      NPC_DRAW.quill(cx, by, t, u);
      ctx.restore();
    },
    p_ledgerrev(cx, by, t, u = 2) {
      ctx.save();
      const a0 = ctx.globalAlpha;
      ctx.globalAlpha = a0 * .22; NPC_DRAW.ledger(cx - 2 * u, by, t + .4, u);
      ctx.globalAlpha = a0; ctx.filter = "saturate(.2) brightness(1.5)";
      NPC_DRAW.ledger(cx, by, t, u);
      ctx.restore();
    },
    p_postbox(cx, by, t, u = 2) {
      const R = P(cx, by, u), up = G && G.flags.p_lay3;
      R(-1, -12, 3, 12, "#6a5a48"); R(-4, -1, 9, 1, "#5a4a38");
      R(-6, -23, 13, 11, "#a85a4a"); R(-6, -23, 13, 2, "#d07a6a"); R(-6, -13, 13, 1, "#7a3a30");
      R(-3, -19, 7, 1, "#2a1a18");
      R(-3, -17, 2, 2, "#fff4e8"); R(2, -17, 2, 2, "#fff4e8"); R(-2, -16, 1, 1, "#1a1a22"); R(3, -16, 1, 1, "#1a1a22");
      if (up) { R(7, -27, 1, 8, "#5a4a38"); R(8, -27, 4, 3, "#ffd84a"); } else { R(7, -21, 1, 6, "#5a4a38"); R(8, -17, 4, 2, "#c8a840"); }
    },
    p_draft47(cx, by, t, u = 2) {
      const R = P(cx, by + Math.abs(Math.sin(t * 2)) * -u * .5, u);
      R(-7, -13, 14, 11, "#e8dcc0"); R(-6, -15, 10, 3, "#f4ecd8"); R(-8, -10, 2, 6, "#d8ccb0"); R(6, -12, 2, 7, "#d8ccb0");
      R(-5, -12, 5, 1, "#b8a888"); R(1, -8, 5, 1, "#b8a888"); R(-3, -5, 4, 1, "#b8a888");
      R(-3, -10, 2, 2, "#2a2018"); R(2, -10, 2, 2, "#2a2018"); R(-1, -6, 3, 1, "#2a2018");
      R(4, -15 + ((t * 3) % 3), 1, 2, "#57a0db");
    },
    p_thinspot(cx, by, t, u = 2) {
      ctx.save();
      ctx.globalAlpha *= .35 + .2 * Math.sin(t * 2.2);
      ctx.fillStyle = "#fffbe8"; ctx.fillRect(cx - 10 * u, by - 13 * u, 20 * u, 12 * u);
      ctx.fillStyle = "#9a88c8";
      for (let i = 0; i < 3; i++) ctx.fillRect(cx - 7 * u, by - (11 - i * 3.5) * u, (8 + hash(i, 3) * 6) * u, u * .6);
      ctx.restore();
      if ((t * .7) % 1 < .5) { ctx.fillStyle = "#fff"; ctx.fillRect(cx + 7 * u, by - 15 * u, 2, 2); }
    },
    p_milorev(cx, by, t, u = 2) {
      const s = u, x = Math.round(cx - 6 * s), y = Math.round(by - 16 * s), a0 = ctx.globalAlpha;
      ctx.globalAlpha = a0 * .2; miloBmp(x + Math.round(Math.sin(t * 1.3) * s), y, s, MILO_PAL);
      ctx.globalAlpha = a0; miloBmp(x, y, s, REV_PAL);
      ctx.fillStyle = "#d89a9a"; ctx.fillRect(x + 5 * s, y + 6.5 * s, 2 * s, Math.max(1, .5 * s));
    }
  });

  /* ---------- dialogue ---------- */
  function tallowTalk() {
    if (G.flags.p_draft) return [L("p_tallow", pick([
      "The first draft's still glowing, if you look. I don't need to look. I have it memorized.",
      "If the revised one gives you trouble, read it the first line. Everyone's first line is the truest.",
      "I'm framing the leaves. Above the fireplace. I am the fireplace."]))];
    const have = leaves.filter(k => G.inv.includes(k));
    if (have.length === 3) {
      G.inv = G.inv.filter(k => !leaves.includes(k));
      G.flags.p_draft = true;
      return [
        L("p_tallow", "All three! Hold still. Hold VERY still. This part is delicate, and I am mostly fire."),
        "* Tallow lifts the three leaves, one on top of the other, and holds them up to its flame.",
        "* The newest writing goes pale. The middle writing goes pale. And then, through all three at once...",
        "* ...the first draft shows through. In your handwriting.",
        "* 'I FELL. I CARRIED IT. SOMEONE LEFT. I KEPT GOING.'",
        L("p_tallow", "There. That's the one underneath everything. PALIMPSEST can write over it forever. It stays."),
        L("p_tallow", "Notice it isn't happy. It isn't sad, either. It's just true. True holds up better in the light."),
        L("p_tallow", "Take this. A bit of me. It melts in your mouth, not in your hand.", { give: "p_candlestub" }),
        L("p_tallow", "And keep the reading. When you meet the kinder draft of you, show it what it's written on top of.",
          { after: () => E3.addEvidence("draft", "Every draft, layered") })];
    }
    if (!G.flags.p_q) {
      G.flags.p_q = true;
      return [
        L("p_tallow", "Oh! A reader. Careful, careful. You're standing on a very important sentence."),
        L("p_tallow", "I'm Tallow. Reading candle, retired. I'm a little short. Candles get that way. We call it experience."),
        L("p_tallow", "I've read this page by my own light for a long time. Every time PALIMPSEST writes over it, I read what was there before."),
        L("p_tallow", "That's the secret of vellum. Scrape it all you like. The first words soak in. They always show through."),
        L("p_tallow", "Ahead are three layers. Three places you know, written over kindly. Kindly, and wrong."),
        L("p_tallow", "In each one there's a thin spot, scraped so often the light comes through. Peel me a leaf from each?"),
        L("p_tallow", "I'd fetch them myself, but I'm stuck in my own wax. Occupational hazard."),
        L("p_tallow", `Bring all three and I'll hold them up together. Every draft at once.${have.length ? ` You've already got ${have.length}!` : ""}`)];
    }
    return [L("p_tallow", `${have.length} of 3 leaves! The Margins, the Underprint, Hollowmere. Look where the light comes through.`)];
  }
  function quillRevTalk() {
    if (G.flags.p_lay1) {
      G.flags.p_qrev = true;
      return [
        L("p_quillrev", "...A kid? Through the ceiling? Into my paper pile?"),
        L("p_quillrev", "That sounds like it hurt. That sounds like it would have been the best day of my whole life."),
        L("p_quillrev", "If you see the other me, the first-draft me... tell it to keep the kettle on. For both of us.")];
    }
    return [
      L("p_quillrev", "Hello! Welcome to the Margins, where nobody ever fell!"),
      L("p_quillrev", "I'm Quill. I look after the Margins. There's nothing to look after. Isn't that restful?"),
      L("p_quillrev", "I've had the kettle on for nine hundred years. Nobody's ever come for tea. Nobody's ever needed me."),
      L("p_quillrev", "...That's good. That's the kinder version. The note says so.")];
  }
  function ledgerRevTalk() {
    if (G.flags.p_lay2) {
      const a = [
        L("p_ledgerrev", "...Outlines? Under my clean white pages?"),
        L("p_ledgerrev", "Then things WERE erased down here. And some of them... came back? Filled in?")];
      if (E3.redactAlive()) a.push(L("p_ledgerrev", "And here, along the bottom. Three letters, written back over a black bar. In gold."));
      a.push(L("p_ledgerrev", "CREDIT. Credit! Do you know how long I've waited to write that word in a ledger?"));
      return a;
    }
    return [
      L("p_ledgerrev", "Name? Ah, no need. Nobody's name is in my book. Nothing was ever erased."),
      L("p_ledgerrev", "Every page balanced. No debits. No credits. Nothing happened down here, and I have the paperwork to prove it."),
      L("p_ledgerrev", "Very tidy. Very white. I have never been so bored in my life.")];
  }
  function postboxTalk() {
    if (G.flags.p_lay3) {
      if (G.flags.p_card) return [L("p_postbox", pick(["Flag's up! First time ever. I may never put it down.", "One change-of-address card. I'm going to forward it every day, forever.", "Somebody wanted letters. Do you know how much that means to a box?"]))];
      G.flags.p_card = true;
      return [
        L("p_postbox", "...Hold on. Something's stuck in my slot. Something OLD. From under the new paint."),
        "* Postbox coughs up a faded card. A change of address, for the house at the end of the street.",
        G.flags.juniFound ? "* At the bottom, in round handwriting: 'Write back, MILO. I'll know if you don't. -J'"
          : "* At the bottom, a signature too faded to read. One letter, maybe. A J.",
        L("p_postbox", "Somebody DID leave. And somebody wanted letters. That's my whole job. That's the best thing I've ever had in me.")];
    }
    return [
      L("p_postbox", "Afternoon! Postbox. I forward the mail for Hollowmere. That is, I would. If anybody ever moved away."),
      L("p_postbox", "Nobody on this street has ever moved away. It says so on the gate. No forwarding addresses. Ever."),
      L("p_postbox", "I'm very efficient. I'm VERY bored. I've started reading my own flap.")];
  }
  function draft47Talk() {
    if (G.flags.p_d47) return [L("p_draft47", pick(["Still crumpled. Still damp. Still here.", "If you see Draft 46, tell it I'm sorry about the umbrella thing.", "The final draft is waiting at the spine. Very neat. Never trust anyone that neat."]))];
    G.flags.p_d47 = true;
    return [
      L("p_draft47", "Psst. Down here. No, lower. I'm the crumpled one."),
      L("p_draft47", "Draft 47. I had a rainy day in me. A real downpour. A kid jumped in a puddle with both feet."),
      L("p_draft47", "PALIMPSEST read me, said 'too sad,' and crumpled me up. Too SAD! It was the best puddle in the whole book!"),
      L("p_draft47", "It says it throws the old drafts away. It doesn't. It can't. It just writes over us."),
      L("p_draft47", "We're all still here. Every draft. Underneath. You can tell that to the notice by the alcove.")];
  }

  /* the quiet room: Quill, and whoever else came along */
  function restScene() {
    World.busy = true;
    const J = G.flags.juniFound, V = E3.vantaAlive(), S = E3.solAlly();
    const a = [
      "* Between the last layer and the spine of the book, there's a fold where nothing is written.",
      "* It's quiet. The good kind of quiet.",
      L("quill", "MILO! Of course. Of COURSE you'd find the one quiet spot in the whole manuscript."),
      L("quill", "I came through the ink. I always do. There's a kettle on in your inkwell. Don't tell your parents.")];
    if (J) a.push(
      L("juni", "Hey. You look like you just walked through three versions of your own life."),
      L("juni", "I saw the street. The one where I never left. The lights were on in my old room."),
      L("juni", "It was nice. It was also wrong. I DID leave. I'm still your friend. Both of those fit in one sentence."));
    if (V) a.push(
      L("vanta", "I have kept every forgotten thing for longer than there have been words for time."),
      L("vanta", "Do you know which ones people come back for? The sad ones. Always the sad ones."));
    if (S) a.push(
      L("sol", "I was erased because remembering me hurt someone."),
      L("sol", "It did not make the hurt go. It only made the light go. Do not let it do that to you."));
    if (V && S) a.push(L("vanta", "...It hurts to remember you. I do it every day. On purpose."), L("sol", "I know. I can feel it. It's warm."));
    a.push(
      L("quill", "Up ahead is the last draft. PALIMPSEST has written a MILO who never fell, never carried anything, never lost anyone."),
      L("quill", "It'll be nice to you. That's what makes it hard."),
      L("quill", "Can I ask you something?", {
        ch: ["Why keep them?", "I know why"],
        on: i => i === 0
          ? [L("quill", "The sad parts? Because they're load-bearing. Take them out and the whole page folds."),
            L("quill", "The day you fell is the day we met. You can't scrape out one and keep the other."),
            ...(J ? [L("juni", "The goodbye's sad because the friendship was good. That's how you can tell.")] : [])]
          : [L("quill", "...Of course you do. You've been carrying the answer the whole way down.")]
      }));
    if (G.flags.p_draft) a.push(L("quill", "And Tallow showed you the first draft? Then you've already read how this chapter ends."));
    if (G.flags.p_qrev) a.push(L("quill", "...There was a version of me with nobody to worry about? Poor thing. Worrying about you is my favorite hobby."));
    a.push(L("quill", "Rest. Save. Then go and meet yourself. Be kind. It's you."));
    Dialog.open(a, () => { G.flags.p_rest = true; World.busy = false; });
  }
  const restTalk = {
    quill: () => [L("quill", pick([
      "The kettle's on. Even here. It doesn't have an off, remember?",
      "Whatever it says up there, you're not a rough draft. You're the real one.",
      "I'm not worried. I'm a little worried. I'm the right amount of worried."]))],
    juni: () => [L("juni", pick([
      "You know starlight is ages old? Every night we're looking at the sky's first draft.",
      "Why did the page get written over? It had issues. ...I'll see myself out.",
      "Hey. Whatever happens, I'm here. Well. Here-ish. I'm good at here-ish now."]))],
    vanta: () => [L("vanta", pick([
      "I kept the sad things longest. Not because they were heavy. Because people came back for them.",
      "This place is a great deal like my Archive. Only more confident."]))],
    sol: () => [L("sol", pick([
      "Remembering me hurt VANTA. VANTA remembers me anyway. That is the bravest thing I know.",
      "Go on. I'll keep a light on in the gutter."]))]
  };

  function arriveScene() {
    World.busy = true;
    const a = [
      "* You step off the last page of the Errata, and onto something older.",
      "* The floor is vellum: skin-thin, scraped smooth, written on again.",
      "* Under your feet, faint brown letters show through. Older ones under those. Older ones under THOSE.",
      "* This is the Palimpsest. A page written over itself a thousand times.",
      "* Somewhere ahead is the newest draft of everything. Somewhere under it, the first."];
    if (G.flags.juniFound) a.push(L("juni", "...MILO? I can hear you through the page. Weird. Keep going. I'll catch up."));
    Dialog.open(a, () => { G.flags.p_arrive = true; World.busy = false; });
  }

  function bossEvent() {
    World.busy = true;
    const a = [
      "* At the spine of the book, where every page is stitched together, someone is waiting.",
      "* They look exactly like you. Neater. Hair combed. Shoes double-knotted.",
      L("p_milorev", "Oh! Hi! You must be me. The first draft, I mean."),
      L("p_milorev", "I'm MILO. The revised one. PALIMPSEST wrote me very carefully. Look, no smudges."),
      L("p_milorev", "I never fell into anything. I never carried anything. I never had to say goodbye to anybody."),
      L("p_milorev", "I'm who you'd be if nothing sad had happened.")];
    if (E3.ep1Void()) a.push(L("p_milorev", "PALIMPSEST worked extra hard on your first time down there. It said that part was too heavy for anyone."));
    else if (kills()) a.push(L("p_milorev", "You've got names on you. Heavy ones. I don't have any. Want to see? Nothing. Totally light."));
    a.push(
      L("p_milorev", "It's really nice, honestly. You could stop here. You could let me be the one who goes on."),
      L("p_milorev", "...No? Oh. Okay. Then I'll have to be very politely in your way."));
    Dialog.open(a, () => startEncounter("milorevised", {
      onEnd: E3.bossEnd("milorevised", res => Dialog.open(res === "kill"
        ? ["* The kinder draft crumples. There's no dust. Just a blank where a hopeful kid stood.",
          "* Nothing about you changes. That's the part that stays with you.",
          "* Ahead, the spine opens onto the heart of the Palimpsest."]
        : ["* MILO (REVISED) steps forward and, very politely, folds into you like a page closing in a book.",
          "* You don't feel lighter. You feel the same weight, held differently.",
          "* Somewhere in there, a small, neat voice is humming. It's slightly out of tune. It's trying.",
          "* Ahead, the spine opens onto the heart of the Palimpsest."]))
    }));
  }

  /* ---------- truths underneath each layer ---------- */
  const truthMargins = () => [
    "* 'A kid fell through the ceiling and landed in a pile of paper, right here. It hurt.'",
    "* 'An ink bottle came running, shouting: oh oh oh, a PERSON!'"];
  const truthUnder = () => [
    "* Outlines. Hundreds of them, under the clean white. The shapes of things that were erased.",
    E3.redactAlive() ? "* And some outlines filled back in: smudges that someone remembered. A name over a black bar: SOL."
      : "* Some outlines are filling in, faintly. Smudges, waiting for someone to remember them."];
  const truthHollow = () => [
    "* The same street. But it's raining, and there's a moving truck at the end of it.",
    "* A kid with orange hair in the passenger window, waving at a house. At your house. Your window.",
    "* You can see yourself behind the curtain. Not going out. Not waving back. The truck turns the corner."];

  /* ---------- rooms ---------- */
  Object.assign(ROOMS, {
    e3p_scraped: {
      area: "palim", map: [
        "####################",
        "####################",
        "##$$$....&&....$$$##",
        "##$..............$##",
        "##..&..........&..##",
        "....................",
        "....................",
        "....................",
        "##..&...$$$....&..##",
        "##$.....$$$......$##",
        "##$$$..........$$$##",
        "####################",
        "####################"],
      exits: [{ x: 19, y: 5, w: 1, h: 3, to: "e3p_margins", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "save", tx: 5, ty: 3 },
        { k: "npc", id: "p_tallow", tx: 13, ty: 3, talk: tallowTalk },
        { k: "sign", tx: 9, ty: 4, text: () => [
          "* THE SCRAPED PAGE.", "* Someone scraped this page clean and wrote a new first line: 'EVERYTHING WAS ALWAYS FINE.'",
          "* Under it, showing through, the old first line won't quite go away. You can't read it yet."] }],
      triggers: [{ x: 3, y: 2, w: 1, h: 9, if: () => !G.flags.p_arrive, run: arriveScene }]
    },
    e3p_margins: {
      area: "palim", enc: true, puzzle: { flag: "p_note_fell", key: "p_k_margins" }, map: [
        "##########################",
        "####BBBB####BBBB##########",
        "##...............L..^...##",
        "##..$$$...RRRRRR....^...##",
        "##..$$$...RRRRRR....^^D^##",
        "..........RRRRRR..........",
        "..........................",
        "..........................",
        "##..&..............&....##",
        "##..........,...........##",
        "##......................##",
        "##########################",
        "##########################"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3p_scraped", tx: 18, ty: 6, dir: "left" },
        { x: 25, y: 5, w: 1, h: 3, to: "e3p_under", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "npc", id: "p_quillrev", tx: 12, ty: 2, talk: quillRevTalk },
        { k: "deco", id: "p_thinspot", tx: 5, ty: 3, talk: thinSpot("p_lay1", "p_leaf1", truthMargins) },
        { k: "sign", tx: 7, ty: 8, text: () => [
          "* LAYER I: THE MARGINS. (REVISED.)", "* 'Where everything fits, and nobody ever fell.'",
          "* Underneath, showing through in someone else's scrawl: 'be kind. we're all leftovers.'"] },
        { k: "sign", tx: 7, ty: 2, text: () => ["* A shelf of Quill's books, revised.", "* 'How to Be Remembered' is now 'You Don't Need To Be.' 'Kettles: A Warning' is just 'Kettles.'"] },
        { k: "item", tx: 22, ty: 2, item: "p_inktea", flag: "p_it_tea" },
        E3.falseNote({
          flag: "p_note_fell", region: "r5", tx: 21, ty: 5, lie: "NOBODY HAS EVER FALLEN INTO THE ARCHIVE.",
          need: () => !!G.flags.p_lay1,
          hint: ["* You KNOW it's a lie. You were the one who fell.", "* But the pen won't take your word for it. Find where the old page shows through."],
          truth: ["* Somebody fell. You did. It hurt, and it mattered, and it's where everything started.", "* The gate of overwritten lines beside the note unravels."],
          onStrike: () => Sound.sfx("door")
        })]
    },
    e3p_under: {
      area: "palim", enc: true, puzzle: { flag: "p_note_erased", key: "p_k_under" }, map: [
        "##########################",
        "##########################",
        "##....^^.......^^.......##",
        "##....^^..&&...^^.......##",
        "##.........&............##",
        "..........................",
        "..........................",
        "..........................",
        "##..........^^.....^^D^^##",
        "##...&......^^.....^...$##",
        "##.................^...$##",
        "##########################",
        "##########################"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3p_margins", tx: 24, ty: 6, dir: "left" },
        { x: 25, y: 5, w: 1, h: 3, to: "e3p_hollow", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "npc", id: "p_ledgerrev", tx: 9, ty: 2, talk: ledgerRevTalk },
        { k: "deco", id: "p_thinspot", tx: 8, ty: 4, talk: thinSpot("p_lay2", "p_leaf2", truthUnder) },
        { k: "sign", tx: 4, ty: 2, text: () => [
          "* LAYER II: THE UNDERPRINT. (REVISED.)", "* 'Nothing here was ever erased. Please enjoy the whiteness.'",
          "* The sign is spotless. A little too spotless. Like it's been scrubbed."] },
        { k: "item", tx: 22, ty: 10, item: "p_vellumcloak", flag: "p_it_cloak" },
        E3.falseNote({
          flag: "p_note_erased", region: "r5", tx: 20, ty: 7, lie: "NOTHING DOWN HERE WAS EVER ERASED.",
          need: () => !!G.flags.p_lay2,
          hint: ["* Everything down here is white and smooth and very sure of itself.", "* But the Underprint always kept its marks. Look for a thin spot."],
          truth: ["* Things were erased. Some of them came back. Both of those are true, and neither cancels out.", "* The gate of overwritten lines unravels."],
          onStrike: () => Sound.sfx("door")
        })]
    },
    e3p_hollow: {
      area: "palim", enc: true, puzzle: { flag: "p_note_moved", key: "p_k_hollow" }, map: [
        "############################",
        "##.####..####..####..####.##",
        "##.####..####..####..####.##",
        "##**..****..**..****..**.*##",
        "##..L......L......L.....&.##",
        "...........&&&...........D..",
        ".........................D..",
        ".........................D..",
        "##..L......L......L......###",
        "##**..****..**..****..***.##",
        "##..####..####..####..######",
        "##..####..####..####..######",
        "############################"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3p_under", tx: 24, ty: 6, dir: "left" },
        { x: 27, y: 5, w: 1, h: 3, to: "e3p_show", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "npc", id: "p_postbox", tx: 8, ty: 4, talk: postboxTalk },
        { k: "deco", id: "p_thinspot", tx: 12, ty: 4, talk: thinSpot("p_lay3", "p_leaf3", truthHollow) },
        { k: "sign", tx: 3, ty: 4, text: () => [
          "* LAYER III: HOLLOWMERE. (REVISED.)", "* 'Population: everyone. Nobody ever moved away.'",
          "* It never rains here, either. The puddles are painted on."] },
        { k: "sign", tx: 22, ty: 4, text: () => G.flags.p_lay3
          ? ["* The house at the end of the street. The lights are on.", "* If you look at it sideways, the windows are empty. Under the new paint, faintly: SOLD."]
          : ["* The house at the end of the street. The curtains are open. The lights are on.", "* A note in the window says 'WE NEVER LEFT.' It's in somebody else's handwriting."] },
        E3.falseNote({
          flag: "p_note_moved", region: "r5", tx: 25, ty: 4, lie: "NOBODY ON THIS STREET EVER MOVED AWAY.",
          need: () => !!G.flags.p_lay3,
          hint: ["* You don't believe it. But the street looks so sure of itself.", "* Somewhere on this street the page must be thin enough to see what was there before."],
          truth: ["* Somebody moved away. It rained. You didn't go out to say goodbye, and you wish you had.", "* That's true. It's allowed to be true. The garden gate swings open."],
          onStrike: () => Sound.sfx("door")
        })]
    },
    e3p_show: {
      area: "palim",
      puzzle: { flag: "p_showthrough", key: "p_runes", order: ["5,4", "15,9", "20,4", "10,9"],
        wrong: "* The neat new writing smears over everything. The old words sink out of sight. Start again.",
        done: ["* The old words glow through every layer at once.", "* I FELL. I CARRIED IT. SOMEONE LEFT. I KEPT GOING.", "* The fence of overwritten lines unravels, one stroke at a time."] },
      map: [
        "############################",
        "############################",
        "##.....................^..##",
        "##..&&&..$$$..$$$..&&&.^..##",
        "##...o....o....o....o..^..##",
        ".......................D....",
        ".......................D....",
        ".......................D....",
        "##..$$$..&&&..&&&..$$$.^..##",
        "##...o....o....o....o..^..##",
        "##.....................^..##",
        "############################",
        "############################"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3p_hollow", tx: 26, ty: 6, dir: "left" },
        { x: 27, y: 5, w: 1, h: 3, to: "e3p_stack", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "sign", tx: 12, ty: 2, text: () => G.flags.p_showthrough
          ? ["* Every old word is lit. The page here is translucent, like a window."]
          : ["* THE SHOW-THROUGH.", "* 'The newest writing is the neatest. It is also the least true.'",
            "* 'Step only where the old words show through. Read them in the order they happened.'"] },
        { k: "page", tx: 25, ty: 9, page: "p13" }]
    },
    e3p_stack: {
      area: "palim", enc: true, puzzle: { flag: "p_note_final", key: "p_k_stack" }, map: [
        "##########################",
        "##########################",
        "##.^^..^^..^^..^^..^^...##",
        "##.^^..^^..^^..^^..^^...##",
        "##......................##",
        "..........................",
        "..........................",
        "..........................",
        "##..................^D^^##",
        "##.^^..^^..^^..^^...^...##",
        "##.^^..^^..^^..^^...^...##",
        "##########################",
        "##########################"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3p_show", tx: 26, ty: 6, dir: "left" },
        { x: 25, y: 5, w: 1, h: 3, to: "e3p_rest", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "sign", tx: 5, ty: 2, text: () => ["* A draft, pinned up to dry.", "* 'DRAFT 3: MILO never fell. MILO stayed in bed. It was a very safe Tuesday.'"] },
        { k: "sign", tx: 9, ty: 2, text: () => ["* 'DRAFT 88: MILO never carried anything heavier than a backpack.'", "* In the margin, small: 'lighter = kinder?'"] },
        { k: "sign", tx: 13, ty: 2, text: () => ["* 'DRAFT 512: MILO never had a best friend, so MILO never had to say goodbye.'", "* The word 'kinder' is written beside it, then crossed out, then written again."] },
        { k: "sign", tx: 17, ty: 2, text: () => ["* 'DRAFT 999: MILO (REVISED). FINAL. Approved by PALIMPSEST.'", "* It's very neat. Under it, faint as breath: 'are you sure?'"] },
        { k: "sign", tx: 9, ty: 10, text: () => ["* 'DRAFT 701.'", "* The goodbye in this one has been crossed out so many times the paper has worn right through."] },
        { k: "npc", id: "p_draft47", tx: 22, ty: 4, talk: draft47Talk },
        { k: "item", tx: 22, ty: 10, item: "p_draftcake", flag: "p_it_cake" },
        E3.falseNote({
          flag: "p_note_final", region: "r5", tx: 20, ty: 7, lie: "THIS IS THE FINAL DRAFT. ALL EARLIER DRAFTS HAVE BEEN THROWN AWAY.",
          need: () => !!G.flags.p_d47,
          hint: ["* It's probably a lie. Most things written this neatly are, down here.", "* But you'd want to hear it from an earlier draft. Is anyone crumpled around here?"],
          truth: ["* Nothing was thrown away. Every draft is still here, under the newest one.", "* The gate of overwritten lines unravels."],
          onStrike: () => Sound.sfx("door")
        })]
    },
    e3p_rest: {
      area: "palim", map: [
        "####################",
        "####################",
        "##................##",
        "##..L.........L...##",
        "##.....RRRRRR.....##",
        ".......RRRRRR.......",
        ".......RRRRRR.......",
        ".......RRRRRR.......",
        "##.....RRRRRR.....##",
        "##..L.........L...##",
        "##................##",
        "####################",
        "####################"],
      exits: [
        { x: 0, y: 5, w: 1, h: 3, to: "e3p_stack", tx: 24, ty: 6, dir: "left" },
        { x: 19, y: 5, w: 1, h: 3, to: "e3p_spine", tx: 1, ty: 6, dir: "right" }],
      ents: [
        { k: "save", tx: 16, ty: 2 },
        { k: "npc", id: "quill", tx: 8, ty: 3, talk: restTalk.quill },
        { k: "npc", id: "juni", tx: 10, ty: 3, if: () => !!G.flags.juniFound, talk: restTalk.juni },
        { k: "npc", id: "vanta", tx: 8, ty: 9, if: () => E3.vantaAlive(), talk: restTalk.vanta },
        { k: "npc", id: "sol", tx: 11, ty: 9, if: () => E3.solAlly(), talk: restTalk.sol },
        { k: "sign", tx: 2, ty: 2, text: () => ["* THE GUTTER.", "* The fold between two pages, where nothing is ever written.", "* Somebody has left a cushion here. And a kettle."] }],
      triggers: [{ x: 3, y: 2, w: 1, h: 9, if: () => !G.flags.p_rest, run: restScene }]
    },
    e3p_spine: {
      area: "palim", noMusic: true, map: [
        "########################",
        "########################",
        "##....^^........^^....##",
        "##....^^........^^....##",
        "##..&..............&..##",
        "........................",
        "........................",
        "........................",
        "##..&..............&..##",
        "##....^^........^^....##",
        "##....^^........^^....##",
        "########################",
        "########################"],
      exits: [{ x: 0, y: 5, w: 1, h: 3, to: "e3p_rest", tx: 18, ty: 6, dir: "left" }],
      ents: [
        { k: "npc", id: "p_milorev", tx: 15, ty: 6, if: () => !G.flags.boss_milorevised, talk: () => [] },
        { k: "sign", tx: 4, ty: 2, text: () => G.flags.boss_milorevised
          ? ["* THE SPINE.", "* Every page of the Palimpsest is stitched together here.", "* Beyond it: the heart. The page underneath every page."]
          : ["* THE SPINE.", "* Every page of the Palimpsest is stitched together here.", "* Someone very neat is standing in the middle of it."] }],
      triggers: [{ x: 9, y: 2, w: 1, h: 9, if: () => !G.flags.boss_milorevised, run: bossEvent }]
    }
  });
}
