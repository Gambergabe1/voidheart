"use strict";
/* ============================================================
   VOIDHEART — Episode 3 finale: the heart of the Palimpsest,
   the final boss PALIMPSEST, three endings, credits.
   Loaded after every region file; applies the region links last.
   ============================================================ */
E3.EVIDENCE_TOTAL = 5;
Object.assign(ENDING_INFO, {
  truestory: { ep: 3, n: 1, name: "TRUE STORY", col: "#ffd84a" },
  revised: { ep: 3, n: 2, name: "REVISED", col: "#57dbff" },
  fiction: { ep: 3, n: 3, name: "FICTION", col: "#ff2b45" }
});
SONGS.palimpsest = { bpm: 128, tracks: [
  { w: "square", v: .022, n: "D5 - F5 - A5 - D6 - C6 - A5 - Bb5 - - - A5 - G5 - F5 - E5 - F5 - G5 - A5 - - -" },
  { w: "triangle", v: .075, n: "D3 D3 D2 D3 D3 D2 D3 D2 Bb2 Bb2 Bb1 Bb2 Bb2 Bb1 Bb2 Bb1 G2 G2 G1 G2 G2 G1 G2 G1 A2 A2 A1 A2 A2 A1 C#2 E2" },
  { w: "sawtooth", v: .01, n: "A4 - - - - - - - F4 - - - - - - - G4 - - - - - - - E4 - - - - - - -" }] };
SONGS.palimvoid = { bpm: 150, tracks: [
  { w: "sawtooth", v: .02, n: "D5 D5 Eb5 D5 . D5 A4 . D5 D5 Eb5 D5 . F5 Eb5 . D5 D5 Eb5 D5 . D5 A4 . Bb4 . A4 . G#4 . A4 ." },
  { w: "triangle", v: .08, n: "D2 D2 D3 D2 D2 D3 D2 D3 D2 D2 D3 D2 Eb2 Eb3 Eb2 Eb3 D2 D2 D3 D2 D2 D3 D2 D3 Bb1 Bb2 Bb1 Bb2 A1 A2 A1 A2" }] };
SONGS.e3ending = { bpm: 84, tracks: [
  { w: "triangle", v: .05, n: "G4 - B4 - D5 - G5 - F#5 - D5 - E5 - - - D5 - B4 - G4 - A4 - B4 - D5 - - - G4 - B4 - D5 - E5 - G5 - E5 - D5 - - - C5 - B4 - A4 - B4 - G4 - - - - - - -" },
  { w: "sine", v: .065, n: "G2 - - - D3 - - - C3 - - - G2 - - - E2 - - - C3 - - - D3 - - - D3 - - - G2 - - - D3 - - - C3 - - - E2 - - - C3 - - - D3 - - - G2 - - - - - - -" }] };

/* the void check for Episode 3: every writer erased */
E3.fullVoid = () => EP_AREAS[3].every(a => areaVoid(a)) && E3.BOSSES.every(b => G.flags["boss_" + b] === "kill");

/* ---------- the final room ---------- */
ROOMS.e3_heart = {
  area: "palim", noMusic: true, map: [
    "####################",
    "####################",
    "##................##",
    "##.&............&.##",
    "##................##",
    "..................##",
    "..................##",
    "..................##",
    "##................##",
    "##.&............&.##",
    "##................##",
    "####################",
    "####################"],
  exits: [],
  ents: [
    { k: "npc", id: "palimpsest", tx: 13, ty: 6, if: () => !G.flags.e3final, talk: () => [] },
    { k: "npc", id: "quill", tx: 4, ty: 3, if: () => !G.flags.e3final && !E3.fullVoid(), talk: () => [L("quill", "Whatever it says... you know what's true. I'm right here.")] },
    { k: "npc", id: "juni", tx: 4, ty: 9, if: () => !G.flags.e3final && G.flags.juniFound && !E3.fullVoid(), talk: () => [L("juni", "I'm not going anywhere. Well. I did, once. But not right now.")] }],
  triggers: [{ x: 6, y: 2, w: 1, h: 9, if: () => !G.flags.e3final, run: () => E3.finalEvent() }]
};
// make sure '&' exists even if r5 has not defined it yet
if (!TILE_DRAW["&"]) {
  TILE_DRAW["&"] = (x, y, tx, ty, pal, t) => {
    ctx.fillStyle = "rgba(90,60,30,.35)";
    for (let i = 0; i < 4; i++) ctx.fillRect(x + 4, y + 6 + i * 6, 18 + hash(tx + i, ty) * 6, 2);
  };
}
if (!PAL.palim) PAL.palim = { floor: "#d8c9a8", alt: "#d2c2a0", spec: "#a89878", wall: "#3a2e22", face: "#6a5a44", line: "#4a3c2c" };
if (!AREAS.palim) AREAS.palim = { name: "THE PALIMPSEST", music: "palimpsest", sub: "every draft, written over" };

E3.finalEvent = function () {
  World.busy = true;
  const v = E3.fullVoid(), lines = [];
  if (v) {
    lines.push(
      L("palimpsest", "..."),
      L("palimpsest", "You came the whole way and wrote nothing true. You erased every writer I had."),
      L("palimpsest", "The Rumor Mill. The Doodler. Happily Ever. The Citation. Even the kinder you."),
      L("palimpsest", "I was trying to make the world hurt less. You are trying to make it stop."),
      L("palimpsest", "Then let us see whose ink is darker."));
  } else {
    lines.push(
      L("palimpsest", "There you are. The original draft."),
      L("palimpsest", "I am PALIMPSEST. I am every page that was ever written over, and I believe the last thing written on me."),
      L("palimpsest", "I have been making the world kinder. You must have noticed."),
      L("palimpsest", "No bakery ever closed for good. No Tuesday ever rained. No friend ever moved away."),
      L("palimpsest", "Do you know how much a goodbye weighs, MILO? I do. I have carried every one ever written."));
    if (G.flags.juniFound) lines.push(L("juni", "It wasn't yours to carry. It was ours. And we'd like it back."));
    lines.push(L("quill", "MILO... read underneath. The first words always show through."),
      L("palimpsest", "Then read. But I will keep writing while you do."));
  }
  Dialog.open(lines, () => {
    G.flags.e3final = true;
    startEncounter("palimpsest", {
      void: v,
      onEnd: res => {
        const vk = res === "kill";
        if (vk) { G.kills++; G.killed.push("palimpsest"); } else { G.spares++; G.spared.push("palimpsest"); }
        let end;
        if (!vk && G.kills === 0) end = "truestory";
        else if (vk && v) end = "fiction";
        else end = "revised";
        Ending.start(end, { palimKilled: vk });
      }
    });
  });
};

/* ---------- PALIMPSEST ---------- */
MONSTERS.palimpsest = {
  name: "PALIMPSEST", area: "palim", hp: 540, atk: 9, def: 3, exp: 0, gold: 0, voice: 100, boss: true, bar: true,
  title: "PALIMPSEST // EVERY DRAFT", music: "palimpsest", noFlee: true,
  init(o) {
    const e = { layers: 0, friends: {} };
    if (o.void) Object.assign(e, { void: true, hp: 720, maxhp: 720, atkB: 2, defB: 1 });
    return e;
  },
  checkFn: e => e.void
    ? "PALIMPSEST - ATK 11 DEF 4\n* Every lie ever told, and nothing underneath anymore."
    : "PALIMPSEST - ATK 9 DEF 3\n* A manuscript written over a thousand times.\n* The first words still show through, if you look.",
  intro: "* PALIMPSEST turns to a fresh page.",
  actNames(e) {
    const a = ["Read the Bottom Layer"];
    if (E3.evidence().length || (G.flags.e3notes || 0)) a.push("Present the Truth");
    for (const f of E3.allies()) a.push("Call " + f.name);
    if (e.layers >= 2) a.push("Accept the Goodbye");
    return a;
  },
  acts: (() => {
    const A = {
      "Read the Bottom Layer": e => {
        if (e.void) return "* You try to read underneath.\n* There's nothing left underneath.";
        e.layers++;
        if (e.layers > 3) { e.sp += 5; e.reply = "...You keep reading it."; return "* You read the first words again, slowly.\n* They don't change. That's the point."; }
        e.sp += 12;
        if (e.layers === 1) { e.reply = "DON'T. That draft was worse."; return "* You hold the top page up to the light.\n* Underneath: 'The bakery closed on Sunday. It reopened on Monday.'"; }
        if (e.layers === 2) { e.reply = "...It was raining. Everyone was sad."; return "* Another layer down: 'It rained the day Juni's family drove away.'"; }
        e.reply = "Stop reading. Please."; return "* The bottom layer, in the shakiest writing of all:\n* 'MILO didn't go to say goodbye. MILO wishes they had.'";
      },
      "Present the Truth": e => {
        if (e.void) return "* You hold up the truth.\n* PALIMPSEST writes over it before you finish.";
        if (e.presented) return "* You've already laid every truth you have on the page.";
        e.presented = 1;
        const ev = E3.evidence(), n = ev.length, notes = G.flags.e3notes || 0;
        e.sp += Math.min(36, n * 6 + Math.min(12, notes * 2));
        e.reply = n >= 4 ? "...That is a great deal of proof." : "Proof can be rewritten.";
        return `* You lay out what you've gathered:\n* ${n ? ev.map(x => x.label).join(", ") : "no evidence"}, and ${notes} lie${notes === 1 ? "" : "s"} struck through.`;
      },
      "Accept the Goodbye": e => {
        if (e.void) return "* There's no goodbye left to accept.";
        if (e.accepted) return "* You've already said it. You don't need to say it twice.";
        e.accepted = 1; e.sp += 25; e.reply = "...You would keep it? Even that?";
        return G.flags.juniFound
          ? "* You say it out loud: Juni moved away, and it hurt, and you'd keep every second of the friendship anyway.\n* Juni squeezes your hand."
          : "* You say it out loud: someone you loved moved away, and it hurt.\n* You'd still rather remember them.";
      }
    };
    const callLines = {
      Quill: ["* You call for Quill.\n* QUILL: 'I've been forgotten. It's awful. I'd still rather be real.'", "...the ink bottle?"],
      Juni: ["* You call for Juni.\n* JUNI: 'You wrote me out so MILO wouldn't miss me. But missing someone is just love with nowhere to go.'", "..."],
      VANTA: ["* You call for VANTA.\n* VANTA: 'I erased something once, to stop the hurt. It came back as a clerk with a stamp. Don't.'", "THE ARCHIVIST?"],
      SOL: ["* You call for SOL.\n* SOL: 'I was the thing that got written over. I'm still here. You can't kind someone out of existing.'", "...you. the light."]
    };
    for (const [name, [txt1, rep]] of Object.entries(callLines)) {
      A["Call " + name] = e => {
        if (e.void) return `* You call for ${name}.\n* Nobody answers.`;
        if (e.friends[name]) return `* ${name} is still here, right beside you.`;
        e.friends[name] = 1; e.sp += 12; e.reply = rep; return txt1;
      };
    }
    return A;
  })(),
  canSpare: e => !e.void && e.sp >= 100,
  mercyLocked: e => !!e.void,
  talkFn(e) {
    if (e.void) {
      const V = ["Then I will write you out too.", "MILO NEVER FELL. MILO NEVER CARRIED ANYTHING.", "Do you even remember Juni's face?", "I am the last page left.", "Erase me, and the pen is yours.", "...it was supposed to be kinder."];
      return V[Math.min(e.turn - 1, V.length - 1)];
    }
    if (!e.finalDone && e.sp >= 80) { e.finalReady = true; return ["...Then here is every draft at once.", "Hold on to what's true through all of it,", "and I will believe you."]; }
    if (e.sp >= 100) return "...I'm listening. Finish the sentence.";
    if (e.reply) { const r = e.reply; e.reply = null; return r; }
    const N = ["Every sad thing can be rewritten.", "I gave your town a better morning.", "Why keep a goodbye? It only hurts.", "The last draft is always the true one.", "You are holding on to the worse version.", "...why does it show through? It always shows through."];
    return N[Math.min(e.turn - 1, N.length - 1)];
  },
  flavorFn(e) {
    if (e.void) return pick(["* PALIMPSEST writes faster and faster.", "* The page is almost black with ink.", "* Nothing shows through anymore."]);
    if (e.sp >= 100) return "* PALIMPSEST's pen has stopped moving.";
    if (e.sp >= 60) return "* Older words are showing through PALIMPSEST's pages.";
    return pick(["* PALIMPSEST revises the air around you.", "* A sentence about you is being rewritten.", "* The page turns by itself."]);
  },
  pattern(e) {
    if (e.finalReady) { e.finalReady = false; e.finalDone = true; e.finalNow = true; return { id: "final", col: "#d8c9a8" }; }
    const r = e.hp / e.maxhp, ph = r < .35 ? 2 : r < .7 ? 1 : 0;
    const L = [
      [{ id: "letters", word: "ITWASFINEITWASFINE", col: "#d8c9a8" }, { id: "scan", col: "#d8c9a8" }, { id: "aimed", col: "#be6cff" }],
      [{ id: "stamp", col: "#d8c9a8" }, { id: "loop", col: "#be6cff" }, { id: "shred", col: "#d8c9a8" }, { id: "lasers", col: "#d8c9a8" }],
      [{ id: "archive" }, { id: "collapse", col: "#d8c9a8" }, { id: "mixed", col: "#be6cff" }, { id: "walls", col: "#d8c9a8", s: 1.15 }]
    ][ph];
    const p = Object.assign({}, L[e.turn % L.length]);
    p.d = (p.d || 1) * (e.void ? 1.3 : 1 - Math.min(.3, e.sp / 300));
    p.s = (p.s || 1) * (e.void ? 1.2 : 1);
    return p;
  },
  afterTurn(e) {
    if (e.finalNow) { e.finalNow = false; e.sp = 100; return "* Every draft goes quiet at once.\n* Underneath them all, the first words are still there."; }
    return null;
  },
  onHit(e) { if (!e.void) e.reply = pick(["Revised.", "That page was already torn.", "I can write over that, too."]); },
  deathLines: e => e.void
    ? ["...then the pen is yours.", "Write whatever you like.", "...it will all be true."]
    : ["...the first words...", "...they still show through...", "...don't let them..."],
  spareLines: () => [
    "...I only wanted the sad parts gone.",
    "But when I wrote over the goodbye, I wrote over the friendship too.",
    "...You're right. Let it stand."]
};

MON_DRAW.palimpsest = function (cx, by, t, e, u = 4) {
  const calm = e && (e.sp >= 100), vd = e && e.void, k = e ? Math.min(1, (e.sp || 0) / 100) : 0;
  const a0 = ctx.globalAlpha;
  // stacked, slightly offset pages
  for (let i = 4; i >= 0; i--) {
    const ox = Math.sin(t * .7 + i) * (calm ? .5 : 2) + (i - 2) * 3 * u * .3, oy = -i * 2 * u * .4;
    ctx.globalAlpha = a0 * (i === 0 ? 1 : .55);
    const R = P(cx + ox, by + oy, u);
    R(-22, -50, 44, 48, i === 0 ? (vd ? "#2a1a1a" : "#e8dcc0") : "#c8b898");
    R(-22, -50, 44, 2, "#a89878");
  }
  ctx.globalAlpha = a0;
  const R = P(cx, by, u);
  // show-through text (old words) under the new ink
  for (let i = 0; i < 9; i++) {
    const r = hash(i, 5), w = 14 + r * 22;
    R(-18, -44 + i * 4.4, w, .8, vd ? "#5a1a1a" : `rgba(120,90,60,${.35 + .4 * k})`);
    if (!calm) R(-18 + ((t * 18 + i * 7) % 30), -44 + i * 4.4 - .6, 6, 1.4, vd ? "#ff2b45" : "#3a2a6a");
  }
  // the face: two ink eyes and a mouth that keeps being rewritten
  const eye = calm ? "#57dbff" : vd ? "#ff2b45" : "#be6cff";
  R(-10, -34, 5, 3, eye); R(5, -34, 5, 3, eye);
  if (calm) { R(-6, -24, 12, 1.5, "#3a2a1a"); R(-7, -25, 1.5, 1.5, "#3a2a1a"); R(5.5, -25, 1.5, 1.5, "#3a2a1a"); }
  else { R(-7 + Math.sin(t * 4) * 2, -25, 14, 1.5, "#3a2a1a"); R(-7, -22, 10 + Math.sin(t * 3) * 3, 1.2, "#3a2a1a"); }
  // the writing arm: a huge quill
  const sw = Math.sin(t * (calm ? .8 : 3)) * (calm ? 2 : 6);
  ctx.save(); ctx.translate(cx + 24 * u, by - 40 * u + sw); ctx.rotate(.5 + sw * .02);
  ctx.fillStyle = vd ? "#5a1a1a" : "#f6f6f2"; ctx.beginPath(); ctx.moveTo(0, -18 * u); ctx.quadraticCurveTo(7 * u, -6 * u, 1 * u, 10 * u); ctx.quadraticCurveTo(-4 * u, -4 * u, 0, -18 * u); ctx.fill();
  ctx.fillStyle = "#2a2a30"; ctx.fillRect(-.6 * u, 8 * u, 1.6 * u, 6 * u);
  ctx.restore();
  if (!calm && !vd) { ctx.globalAlpha = a0 * (.2 + .1 * Math.sin(t * 3)); R(-26, -54, 52, 56, "#be6cff"); ctx.globalAlpha = a0; }
  if (calm) { ctx.globalAlpha = a0 * (.25 + .1 * Math.sin(t * 2)); R(-28, -56, 56, 58, "#ffd84a"); ctx.globalAlpha = a0; }
};
NPC_DRAW.palimpsest = (cx, by, t, u = 2) => MON_DRAW.palimpsest(cx, by, t, { sp: G && G.flags.e3final ? 100 : 0 }, u * .5);

/* ---------- endings ---------- */
{
  const art = drawArt;
  drawArt = function (kind, cx, cy, t) {
    if (kind === "palimCalm" || kind === "palimBreak") {
      ctx.fillStyle = "#1a140e"; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      if (kind === "palimBreak") ctx.globalAlpha = Math.max(0, 1 - t * .25);
      MON_DRAW.palimpsest(cx, cy + 110, t, { sp: kind === "palimCalm" ? 100 : 0, void: kind === "palimBreak" && Ending.type === "fiction" }, 3.4);
      ctx.globalAlpha = 1;
      if (kind === "palimBreak") for (let i = 0; i < 40; i++) {
        const r = hash(i, 11), y = cy + 80 - ((t * 40 + r * 300) % 260);
        ctx.fillStyle = i % 2 ? "#e8dcc0" : "#3a2a1a"; ctx.fillRect(cx - 150 + r * 300, y, 5, 3);
      }
      return;
    }
    if (kind === "hollowMorning") {
      const g = ctx.createLinearGradient(0, cy - 120, 0, cy + 120); g.addColorStop(0, "#ffe2a8"); g.addColorStop(1, "#8ab0d8");
      ctx.fillStyle = g; ctx.fillRect(cx - 200, cy - 120, 400, 240);
      ctx.fillStyle = "#fff4c0"; ctx.beginPath(); ctx.arc(cx - 120, cy - 60, 26, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 6; i++) { const hx = cx - 190 + i * 66, hh = 50 + hash(i, 2) * 30; ctx.fillStyle = ["#a86a4a", "#6a8aa8", "#c8a06a", "#7a9a6a"][i % 4]; ctx.fillRect(hx, cy + 60 - hh, 56, hh); ctx.fillStyle = "#5a3a2a"; ctx.beginPath(); ctx.moveTo(hx - 4, cy + 60 - hh); ctx.lineTo(hx + 28, cy + 36 - hh); ctx.lineTo(hx + 60, cy + 60 - hh); ctx.fill(); }
      ctx.fillStyle = "#4a6a3a"; ctx.fillRect(cx - 200, cy + 60, 400, 60);
      for (let i = 0; i < 8; i++) { const r = hash(i, 6); ctx.save(); ctx.translate(cx - 180 + r * 360, cy - 100 + ((t * 30 + i * 40) % 200)); ctx.rotate(t + i); ctx.fillStyle = "rgba(255,251,232,.8)"; ctx.fillRect(-5, -6, 10, 12); ctx.restore(); }
      drawMilo(cx - 20, cy + 104, "right", 0);
      if (G && G.flags.juniFound && Ending.type === "truestory") NPC_DRAW.juni(cx + 20, cy + 104, t, 2);
      return;
    }
    return art(kind, cx, cy, t);
  };
  const build = Ending.build, credits = Ending.buildCredits;
  Ending.build = function () {
    if (this.ep !== 3) return build.call(this);
    const P = (t, a) => ({ t, art: a }), J = !!G.flags.juniFound;
    if (this.type === "truestory") {
      const a = [
        P("* PALIMPSEST lifts its pen off the page. For the first time, it doesn't put it back down.", "palimCalm"),
        P("PALIMPSEST: \"I only wanted the sad parts gone.\"", "palimCalm"),
        P("PALIMPSEST: \"But when I wrote over the goodbye, I wrote over the whole friendship too.\"", "palimCalm")];
      if (J) a.push(P("JUNI: \"...Hi, MILO. I'm sorry about the goodbye. Mine was bad. Yours was missing.\"", "palimCalm"),
        P("* You don't know what to say. So you whistle, the way Juni taught you. Juni laughs so hard they snort.", "palimCalm"));
      a.push(P("* One by one, the notes in the margins of the world curl up and blow away.", "hollowMorning"),
        P("* The bakery is open. It always was. The mirror is just a mirror again.", "hollowMorning"));
      if (E3.vantaAlive() || E3.solAlly()) a.push(P(`* Down in the Archive, ${[E3.vantaAlive() && "VANTA", E3.solAlly() && "SOL"].filter(Boolean).join(" and ")} file the true version carefully, under T.`, "book"));
      a.push(P("PALIMPSEST: \"...May I stay? I could keep the stories that are only stories. Clearly labeled.\"", "palimCalm"),
        P("QUILL: \"We have a place for exactly that. It's called the Marginalia. You'll love it. Bring a pen.\"", "crowd"),
        P(J ? "* That evening, a letter arrives from very far away. It's from Juni. It's three pages long and mostly puns." : "* That evening, MILO tapes the torn photo back together. The other half isn't blank anymore.", "hollowMorning"),
        P("* Somewhere in the Archive, a new page is written. It says: TRUE STORY.", "book"));
      return a;
    }
    if (this.type === "revised") {
      const a = [this.info.palimKilled
        ? P("* PALIMPSEST tears along every layer at once. The pages scatter like leaves.", "palimBreak")
        : P("* PALIMPSEST's pen falls still. It doesn't say anything for a long time.", "palimCalm"),
        P("* Most of the notes in the margins of the world curl up and blow away. Not all of them.", "hollowMorning"),
        P("* Some mornings, MILO isn't sure which memories are the real ones.", "alone")];
      a.push(J ? P("* A letter comes from Juni. MILO reads it twice. The second time, one sentence is different.", "book")
        : P("* MILO keeps the torn photo on the desk. The other half is still blank.", "book"));
      if (G.kills > 0) a.push(P(`* ${G.kills} writer${G.kills > 1 ? "s were" : " was"} erased to get here. Their notes are gone. So are the true things they kept by accident.`, "white"));
      a.push(P("* Something was revised. Maybe next loop, the whole story can stand.", "book"));
      return a;
    }
    return [
      P("PALIMPSEST: \"You erased every writer I had. Then you erased me.\"", "palimBreak"),
      P("PALIMPSEST: \"...the pen is yours now.\"", "palimBreak"),
      P("* MILO holds it over the first page and writes: MILO NEVER FELL. MILO NEVER CARRIED ANYTHING.", "white"),
      P("* The ink takes. It always takes.", "white"),
      P("* In Hollowmere, a kid wakes up who has never heard of the Archive. Everyone agrees they're very nice.", "black"),
      P("* Nobody remembers Juni. Nobody remembers anything that ever hurt.", "black"),
      P("* It's a lovely story. None of it is true.", "black")];
  };
  Ending.buildCredits = function () {
    if (this.ep !== 3) return credits.call(this);
    const c = [{ t: "VOIDHEART", size: 64 }, { t: "Episode 3: The Marginalia", size: 26, col: "#9a9aa4" }, { gap: 40 }, { t: "- THE MARGINS OF THE WORLD -", size: 28, col: "#be6cff" }, { gap: 16 }];
    const ids = [];
    for (const a of EP_AREAS[3]) for (const m of POOLS[a] || []) ids.push(m);
    ids.push(...E3.BOSSES.filter(b => MONSTERS[b]), "palimpsest");
    for (const id of ids) {
      if (!MON_DRAW[MONSTERS[id].draw || id]) continue;
      const st = G.spared.includes(id) ? ["REMEMBERED", "#ffd84a"] : G.killed.includes(id) ? ["ERASED", "#ff2b45"] : ["never met", "#555"];
      c.push({ mon: MONSTERS[id].draw || id, t: nameOf(id), st: st[0], col: st[1] });
    }
    c.push({ gap: 30 }, { t: G.flags.juniFound ? "JUNI ........ found, and real" : "JUNI ........ still out there", size: 26, col: G.flags.juniFound ? "#ffd84a" : "#777" },
      { t: "QUILL ........ kettle on, on the Surface now", size: 26 },
      { t: `evidence gathered: ${E3.evidence().length} / ${E3.EVIDENCE_TOTAL}`, size: 24, col: "#57dbff" },
      { t: `lies struck through: ${G.flags.e3notes || 0}`, size: 24, col: "#57dbff" },
      { t: `lost pages found: ${Memory.data.pages.length} / ${Object.keys(LOST_PAGES).length}`, size: 24, col: "#be6cff" }, { gap: 40 },
      { t: "built from VOIDHEART // Original Boss Fight", size: 22, col: "#9a9aa4" }, { gap: 30 }, { t: "Thank you for playing.", size: 34 });
    return c;
  };
  const es = Ending.start;
  Ending.start = function (type, info) {
    es.call(this, type, info);
    if (this.ep === 3) Music.play(type === "fiction" ? "void" : type === "revised" ? "sad" : "e3ending");
  };
}

/* link every region together last */
E3.applyLinks();
/* Episode 3 only opens once every region is present */
EPISODES[2].playable = ["e3h_bedroom", "e3m_gutter", "e3f_gate", "e3e_lobby", "e3p_scraped", "e3_heart"].every(r => ROOMS[r]);
if (!EPISODES[2].playable) EPISODES[2].sub = "In development. Coming soon.";
