"use strict";
/* ============================================================
   VOIDHEART — Episode 3: THE MARGINALIA — core
   Story spine, shared helpers, carry-over, the false-note mechanic,
   region linking. Region content lives in js/ep3/r*.js; the finale,
   final boss and endings live in js/ep3/finale.js.
   See docs/EP3_SPEC.md.
   ============================================================ */
EPISODES[2].playable = true;
EPISODES[2].sub = "Someone is writing things that never happened.";
EPISODES[2].music = "hollow";
EPISODES.push({ n: 4, title: "???", sub: "Coming soon.", playable: false,
  tease: "Every story has a reader. Somewhere, someone has been reading MILO's the whole time." });
EP_AREAS[3] = ["hollow", "marg", "fiction", "errata", "palim"];

const E3 = {
  start: null,            // set by r1: { room, tx, ty, dir }
  links: [],              // [fromRoom, toRoom] pairs, applied by finale.js
  notes: {},              // flag -> region, every false note registered
  BOSSES: ["rumormill", "doodler", "happilyever", "citation", "milorevised"],

  /* ---- carry-over from earlier episodes ---- */
  ep1() { return (G && G.carry && G.carry.ep1) || Memory.data.eps[1] || {}; },
  ep2() { return (G && G.carry && G.carry.ep2) || Memory.data.eps[2] || {}; },
  vantaAlive() { const a = this.ep2(), b = this.ep1(); return a.vantaAlive !== undefined ? !!a.vantaAlive : !!b.vantaAlive; },
  solAlly() { const a = this.ep2(); return a.ending === "restored" && !!a.named; },
  redactAlive() { return this.ep2().ending === "restored"; },
  stet() { return !!this.ep2().stet; },
  shredderSpared() { return this.ep2().shredder === "spare"; },
  ep1Void() { return this.ep1().ending === "void"; },
  restoredNames() { return (this.ep2().restored || []).map(nameOf); },

  /* ---- progress ---- */
  evidence() { return (G && G.flags.e3evidence) || []; },
  addEvidence(key, label) {
    const ev = G.flags.e3evidence || (G.flags.e3evidence = []);
    if (ev.some(e => e.key === key)) return false;
    ev.push({ key, label }); Sound.sfx("bell"); Toast.show("EVIDENCE: " + label.toUpperCase());
    return true;
  },
  notesStruck() { return Object.keys(this.notes).filter(f => G.flags[f]).length; },
  bossDone(id) { return !!G.flags["boss_" + id]; },
  /* onEnd handler for a region boss: records the result, counts it, returns to the world */
  bossEnd(id, after) {
    return res => {
      G.flags["boss_" + id] = res;
      if (res === "kill") { G.kills++; G.killed.push(id); } else { G.spares++; G.spared.push(id); }
      returnToWorld();
      if (after) Timers.after(.8, () => after(res));
    };
  },
  allies() {
    const a = [{ who: "quill", name: "Quill" }];
    if (G.flags.juniFound) a.push({ who: "juni", name: "Juni" });
    if (this.vantaAlive()) a.push({ who: "vanta", name: "VANTA" });
    if (this.solAlly()) a.push({ who: "sol", name: "SOL" });
    return a;
  },

  /* ---- the false-note mechanic ----
     A false note is a solid, floating handwritten lie that blocks a tile.
     With the Pen of STET and the truth (need() === true) you can strike it through. */
  falseNote(o) {
    const id = "note_" + o.flag;
    this.notes[o.flag] = o.region || "?";
    return {
      k: "npc", id, sprite: "falsenote", tx: o.tx, ty: o.ty,
      if: () => !G.flags[o.flag],
      talk: () => {
        const lie = [`* A note, in small, neat handwriting:`, `* "${o.lie}"`];
        if (!G.inv.includes("stetpen")) return [...lie, "* You can't do anything about it. Not yet."];
        if (o.need && !o.need()) return [...lie, ...(o.hint || ["* It's a lie. But you don't know the truth yet."])];
        return [...lie, {
          t: "* You know the truth. Strike it through?", ch: ["Strike it", "Leave it"],
          on: i => {
            if (i !== 0) return ["* You leave the note where it is."];
            G.flags[o.flag] = true; World.fadeEnt(id); Sound.sfx("slash");
            G.flags.e3notes = (G.flags.e3notes || 0) + 1;
            if (o.onStrike) Timers.after(.4, o.onStrike);
            return ["* You draw a line through the lie and write STET beside the truth.", ...(o.truth || ["* The note curls up and blows away."])];
          }
        }];
      }
    };
  },
  link(from, to) { this.links.push([from, to]); },
  /* standard links: right edge rows 5-7 of `from` <-> left edge rows 5-7 of `to` */
  applyLinks() {
    for (const [from, to] of this.links) {
      const A = ROOMS[from], B = ROOMS[to];
      if (!A || !B) continue;
      const wa = A.map[0].length;
      A.exits = (A.exits || []).filter(e => e.to !== to);
      B.exits = (B.exits || []).filter(e => e.to !== from);
      A.exits.push({ x: wa - 1, y: 5, w: 1, h: 3, to, tx: 1, ty: 6, dir: "right" });
      B.exits.push({ x: 0, y: 5, w: 1, h: 3, to: from, tx: wa - 2, ty: 6, dir: "left" });
    }
  }
};
E3.link("e3h_gate", "e3m_gutter");
E3.link("e3m_spine", "e3f_gate");
E3.link("e3f_epilogue", "e3e_lobby");
E3.link("e3e_chambers", "e3p_scraped");
E3.link("e3p_spine", "e3_heart");

/* ---------- the Palimpsest's history (Lost Pages IX-XIII) ---------- */
Object.assign(LOST_PAGES, {
  p9: { ep: 3, title: "Lost Page IX: Blank", text: ["When REDACT stopped erasing, it left the blank pages where they lay. Thousands of them.", "Blank pages are patient. They wait to be written on."] },
  p10: { ep: 3, title: "Lost Page X: The First Note", text: ["Someone did write on them. A rumor first. Then a wish. Then every story nobody ever checked.", "The ink soaked down through every layer, and then it began to soak up."] },
  p11: { ep: 3, title: "Lost Page XI: Every Draft", text: ["The pages were written over so many times that the writing grew a will of its own.", "It called itself PALIMPSEST: the page that keeps every draft, but believes only the last one."] },
  p12: { ep: 3, title: "Lost Page XII: A Kinder Draft", text: ["PALIMPSEST learned one simple thing about people: sad memories hurt.", "So it began to write kinder ones over the top. A town with no goodbyes. A kid who never fell."] },
  p13: { ep: 3, title: "Lost Page XIII: Show-Through", text: ["But a page that has been written over still holds what was there first.", "Hold it up to the light, and the first words show through. They always do."] }
});

/* ---------- items, speakers, songs shared by the whole episode ---------- */
Object.assign(ITEMS, {
  stetpen: { name: "Pen of STET", type: "key", desc: "Strike a lie through, and write STET beside the truth: let it stand." },
  juniphoto: { name: "Torn Photo", type: "key", desc: "Half a photo of MILO laughing. The other half is someone who isn't there." }
});
Object.assign(SPEAKERS, {
  juni: { name: "JUNI", voice: 300 },
  sol: { name: "SOL", voice: 190 },
  narrator: { name: "???", voice: 140 },
  palimpsest: { name: "PALIMPSEST", voice: 100 }
});
Object.assign(SONGS, {
  hollow: { bpm: 88, tracks: [
    { w: "triangle", v: .05, n: "G4 - B4 - D5 - B4 - C5 - A4 - - - B4 - G4 - E4 - G4 - A4 - - - - - - -" },
    { w: "sine", v: .065, n: "G2 - - - D3 - - - C3 - - - D3 - - - E2 - - - C3 - - - D3 - - - D3 - - -" },
    { w: "square", v: .008, n: ". . G5 . . . B5 . . . A5 . . . F#5 ." }] },
  e3intro: { bpm: 70, tracks: [
    { w: "triangle", v: .05, n: "E5 - - - D5 - C5 - B4 - - - A4 - - - G4 - - - A4 - B4 - C5 - - - - - - -" },
    { w: "sine", v: .06, n: "A2 - - - - - - - F2 - - - - - - - C3 - - - - - - - G2 - - - - - - -" }] }
});

/* ---------- shared sprites ---------- */
Object.assign(NPC_DRAW, {
  falsenote(cx, by, t, u = 2) {
    const b = Math.sin(t * 2.2 + cx * .1) * 2;
    ctx.save(); ctx.translate(cx, by - 18 + b); ctx.rotate(Math.sin(t + cx) * .08);
    ctx.globalAlpha *= .25; ctx.fillStyle = "#ff2b45"; ctx.fillRect(-14, -16, 28, 32); ctx.globalAlpha = 1;
    ctx.fillStyle = "#fffbe8"; ctx.fillRect(-11, -13, 22, 26);
    ctx.fillStyle = "#d9d0bb"; ctx.fillRect(-11, -13, 22, 3);
    ctx.fillStyle = "#3a3a6a";
    for (let i = 0; i < 5; i++) ctx.fillRect(-8, -7 + i * 4, 6 + hash(i, cx | 0) * 10, 1.5);
    ctx.restore();
  },
  juni(cx, by, t, u = 2) {
    const R = P(cx, by + (Math.sin(t * 2.6) > .97 ? -u : 0), u);
    R(-6, -31, 12, 4, "#e8a040"); R(-7, -28, 14, 4, "#e8a040"); R(5, -27, 4, 9, "#e8a040");
    R(-5, -27, 10, 9, "#8a5a3a"); R(-4, -27, 8, 2, "#e8a040");
    R(-3, -23, 2, 2, "#1a1a22"); R(2, -23, 2, 2, "#1a1a22"); R(-1, -20, 3, 1, "#5a2a2a");
    R(-6, -18, 12, 10, "#3a8a6a"); R(-2, -18, 4, 2, "#ffd84a");
    R(-7, -17, 1, 6, "#8a5a3a"); R(6, -17, 1, 6, "#8a5a3a");
    R(-5, -8, 4, 5, "#24242e"); R(1, -8, 4, 5, "#24242e"); R(-5, -3, 4, 2, "#e8e8f0"); R(1, -3, 4, 2, "#e8e8f0");
  },
  sol(cx, by, t, u = 2) {
    ctx.save(); MON_DRAW.redact(cx, by, t, { sp: 100, named: 1 }, u * .55);
    ctx.globalAlpha *= .25 + .1 * Math.sin(t * 3); ctx.fillStyle = "#ffd84a";
    ctx.beginPath(); ctx.arc(cx, by - 30 * u * .55, 12 * u * .55 * 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
});

/* ---------- starting a loop of Episode 3 ---------- */
{
  const fg = freshGame;
  freshGame = function (ep = 1, carry = null) {
    if (ep !== 3) return fg(ep, carry);
    const g = fg(1, null);
    const c2 = Memory.data.eps[2] || {}, c1 = Memory.data.eps[1] || {};
    Object.assign(g, {
      ep: 3, carry: { ep1: c1, ep2: c2 }, room: "e3h_bedroom",
      inv: ["mosstea", "staticpop"], pools: {}, poolSize: {}, areaKills: {}, flags: { runes: [] }
    });
    g.wt = c2.wt || c1.wt || 1; g.exp = c2.exp || c1.exp || 0; g.gold = (c2.gold || c1.gold || 0) + 30; g.hp = 16 + g.wt * 4;
    for (const a of EP_AREAS[3]) { g.pools[a] = [...(POOLS[a] || [])]; g.areaKills[a] = 0; g.poolSize[a] = g.pools[a].length; }
    return g;
  };
  const bl = beginLoop;
  beginLoop = function (ep = 1) {
    if (ep !== 3) return bl(ep);
    G = freshGame(3); delSave(3); Timers.clear();
    Scene.set("world"); World.busy = true;
    const s = E3.start || { room: "e3h_bedroom", tx: 5, ty: 6, dir: "down" };
    World.enter(s.room, s.tx, s.ty, s.dir || "down");
    Fade.a = 1;
    Fade.in(() => Timers.after(2.4, () => E3.arrival()), 1);
  };
  const is = Intro.start.bind(Intro);
  Intro.start = function (ep = 1) {
    is(ep);
    if (ep !== 3) return;
    this.slides = E3.introSlides();
    this.typer = new Typer(this.slides[0].t, { speed: 30, voice: 160 });
    Music.play("e3intro");
  };
}
E3.introSlides = function () {
  const e2 = Memory.data.eps[2] || {};
  const s = [{ t: "", art: "epcard" }, { t: "A month after the Underprint.", art: "black" }];
  if (e2.ending === "restored") s.push({ t: "The way between the Archive and the world stays open now. Some nights, Quill visits through the ink in MILO's pen.", art: "alone" });
  else s.push({ t: "Half the Archive is still white. MILO tries not to think about it, and mostly succeeds.", art: "white" });
  s.push(
    { t: "Then, one morning, MILO wakes up and the world is a little bit wrong.", art: "alone" },
    { t: "There are notes in the margins of everything. Small, neat handwriting. Corrections.", art: "book" },
    { t: "'The bakery was always closed.' 'It never rained on Tuesdays.' 'Nobody on this street ever moved away.'", art: "book" },
    { t: "And taped to the bedroom mirror, in the same handwriting: MILO NEVER HAD A BEST FRIEND.", art: "white" });
  return s;
};
E3.arrival = function () {
  const done = () => { G.flags.e3arrived = true; World.busy = false; saveGame(); };
  const lines = [
    "* The inkwell on MILO's desk wobbles.",
    "* Then it wobbles harder.",
    L("quill", "MILO! Oh thank the margins, it's you, and you're you."),
    L("quill", "Something's wrong up here. Something is WRITING on your world. Little notes, everywhere, and everyone believes them."),
    L("quill", "Down in the Archive, we can feel it. Things that never happened are being filed as true."),
    L("quill", "It started where REDACT left the blank pages. Blank pages invite writing. Somebody accepted the invitation.")];
  if (E3.stet()) lines.push(L("quill", "The copies in Carbon Town made you something. They said you'd know what it means.", { give: "stetpen" }));
  else lines.push(L("quill", "I made you something. Out of my very best, very stubborn feather.", { give: "stetpen" }));
  lines.push(
    L("quill", "The Pen of STET. When you find a lie and you KNOW the truth, strike it through and write STET beside the truth."),
    L("quill", "It means 'let it stand.' Not the lie. The truth."),
    L("quill", "But you have to actually know the truth first. The pen can't guess. Neither can you."),
    L("quill", "...Who's Juni? There's a photo on your desk, torn in half. It keeps trying to get my attention."));
  if (E3.ep1Void()) lines.push(L("quill", "...And MILO? Some of what's written out there is about you. About what you did, once. Not all of it is a lie."));
  Dialog.open(lines, done);
};

/* ---------- achievements for Episode 3 ---------- */
ACHIEVEMENTS.push(
  { id: "e3_strike", name: "Strike Through", desc: "Strike your first lie through with the Pen of STET.", ep: 3 },
  { id: "e3_factcheck", name: "Fact-Checker", desc: "Strike through every false note in Episode 3.", ep: 3 },
  { id: "e3_juni", name: "Best Friend", desc: "Find Juni.", ep: 3 },
  { id: "e3_mill", name: "Stop the Mill", desc: "Spare the Rumor Mill.", ep: 3 },
  { id: "e3_doodle", name: "Finish the Drawing", desc: "Spare the Doodler.", ep: 3 },
  { id: "e3_unhappy", name: "A True Ending", desc: "Spare Happily Ever.", ep: 3 },
  { id: "e3_case", name: "Case Closed", desc: "Spare the Citation.", ep: 3 },
  { id: "e3_self", name: "The Real MILO", desc: "Spare MILO (REVISED).", ep: 3, secret: true },
  { id: "e3_evidence", name: "Beyond Reasonable Doubt", desc: "Collect every piece of evidence.", ep: 3 },
  { id: "e3_pages", name: "Show-Through", desc: "Find all five Episode 3 Lost Pages.", ep: 3 },
  { id: "truestory", name: "TRUE STORY", desc: "Reach Episode 3's True Story ending.", ep: 3 },
  { id: "revised", name: "REVISED", desc: "Reach Episode 3's Revised ending.", ep: 3 },
  { id: "fiction", name: "FICTION", desc: "Reach Episode 3's Fiction ending.", ep: 3, secret: true }
);
for (const a of ACHIEVEMENTS) ACH_BY_ID[a.id] = a;
{
  const sc = Ach.scan.bind(Ach), bt = Ach.battle.bind(Ach);
  Ach.scan = function () {
    sc();
    if (!G || G.ep !== 3) return;
    if ((G.flags.e3notes || 0) > 0) this.unlock("e3_strike");
    const all = Object.keys(E3.notes);
    if (all.length && all.every(f => G.flags[f])) this.unlock("e3_factcheck");
    if (G.flags.juniFound) this.unlock("e3_juni");
    if (E3.evidence().length >= (E3.EVIDENCE_TOTAL || 99)) this.unlock("e3_evidence");
    if (["p9", "p10", "p11", "p12", "p13"].every(k => Memory.data.pages.includes(k))) this.unlock("e3_pages");
  };
  Ach.battle = function (id, res, hits, d) {
    bt(id, res, hits, d);
    if (res !== "spare") return;
    const m = { rumormill: "e3_mill", doodler: "e3_doodle", happilyever: "e3_unhappy", citation: "e3_case", milorevised: "e3_self" }[id];
    if (m) this.unlock(m);
  };
}
