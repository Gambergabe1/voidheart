"use strict";
/* ============================================================
   VOIDHEART — Episode 1 expansion:
   three new residents, Signal's Radio quest, the secret tower
   and its optional boss, DEAD AIR
   (loaded before episode2.js so Smudges exist for the newcomers)
   ============================================================ */
POOLS.margins.push("scribble");
POOLS.stacks.push("overdue");
POOLS.static.push("feedback");

Object.assign(ITEMS, {
  radio_dial: { name: "Tuning Dial", type: "key", desc: "A radio dial that only turns to stations nobody listens to." },
  radio_coil: { name: "Copper Coil", type: "key", desc: "A spring of copper wire. Hums when you hold it near your ear." },
  radio_mic: { name: "Old Microphone", type: "key", desc: "Someone's last words are still warm in it." },
  encore: { name: "Encore", type: "heal", heal: 99, desc: "A standing ovation, saved in a jar. Full heal." }
});
Object.assign(SPEAKERS, { deadair: { name: "DEAD AIR", voice: 150 } });
SONGS.deadair = { bpm: 72, tracks: [
  { w: "triangle", v: .05, n: "A4 - - - C5 - E5 - D5 - - - B4 - G4 - A4 - - - - - - - . . . . . . . ." },
  { w: "sine", v: .065, n: "A2 - - - - - - - F2 - - - - - - - D2 - - - - - - - E2 - - - - - - -" },
  { w: "square", v: .006, n: "E7 . . . . . . . . . . . . . . . . . . . . . . . E7 . . . . . . ." }] };

Object.assign(MONSTERS, {
  scribble: {
    name: "Scribble", area: "margins", hp: 38, atk: 4, def: 1, exp: 6, gold: 8, voice: 300,
    check: "SCRIBBLE - ATK 4 DEF 1\n* It was supposed to be a drawing.\n* Nobody could tell of what.",
    intro: "* Scribble scrawls into view!",
    flavor: ["* Scribble keeps redrawing itself. It isn't helping.", "* Smells like crayon.", "* Scribble's lines go everywhere at once."],
    spareFlavor: "* Scribble is holding still, proud of what it is.",
    talk: ["GUESS WHAT I AM.", "...you don't know either?", "i'm SOMETHING. i'm sure of it."],
    spareTalk: "A HORSE. i was a HORSE all along!",
    acts: {
      "Guess": e => {
        e.g = (e.g || 0) + 1;
        if (e.g === 1) { e.sp += 10; e.reply = "NO!! guess again!"; return "* You guess: 'A cloud?'\n* Scribble is offended. Wrong."; }
        if (e.g === 2) { e.sp += 60; e.reply = "YES!!! A HORSE!!!"; return "* You guess: 'A horse!'\n* Scribble explodes with joy. You got it."; }
        return "* You already guessed it. It's a horse. Definitely a horse.";
      },
      "Connect Lines": e => { e.sp += 30; e.reply = "...oh. there's my LEG."; return "* You connect a few of Scribble's loose lines.\n* Something like a shape appears."; },
      "Praise Effort": e => { e.sp += 30; e.reply = "...i tried SO hard."; return "* You tell Scribble you can tell it tried really hard.\n* Scribble wiggles."; }
    },
    pats: [{ id: "snake", col: "#9a9aa4" }, { id: "rain", col: "#9a9aa4", d: .8 }]
  },
  overdue: {
    name: "Overdue", area: "stacks", hp: 64, atk: 5, def: 2, exp: 13, gold: 12, voice: 260,
    check: "OVERDUE - ATK 5 DEF 2\n* A library book, nine hundred years late.\n* Terrified of the fine.",
    intro: "* Overdue tries to hide behind a shelf. You see it.",
    flavor: ["* Overdue is sweating ink.", "* Overdue keeps checking its due date. Still late.", "* A faint stamp reads: PLEASE RETURN."],
    spareFlavor: "* Overdue has finally been returned.",
    talk: ["I CAN'T AFFORD THE FINE.", "nine hundred years... that's... how much is that?", "don't tell the librarian. PLEASE."],
    spareTalk: "...returned. i'm RETURNED.",
    acts: {
      "Waive Fine": e => { e.sp += 50; e.reply = "...you can DO that?"; return "* You tell Overdue the fine is waived.\n* You have no authority to do this. It doesn't matter."; },
      "Stamp Returned": e => { e.sp += 50; e.reply = "*THUNK* ...oh. oh wow."; return "* You stamp Overdue: RETURNED.\n* Nine hundred years of worry drain out of it."; },
      "Read Due Date": e => { e.sp += 10; e.reply = "DON'T READ IT OUT LOUD."; return "* You read the due date.\n* It's from before there were calendars."; }
    },
    pats: [{ id: "letters", word: "OVERDUEFINEFINE", col: "#d8a85a" }, { id: "walls", col: "#d8a85a" }]
  },
  feedback: {
    name: "Feedback", area: "static", hp: 80, atk: 6, def: 2, exp: 30, gold: 20, voice: 880,
    check: "FEEDBACK - ATK 6 DEF 2\n* A microphone that shrieks whenever anyone speaks.\n* It's not being rude. It's too close to the speaker.",
    intro: "* SKREEEEEEEE! Feedback squeals into view!",
    flavor: ["* Feedback is humming at a frequency only dogs enjoy.", "* Your ears ring a little.", "* Feedback is trying very hard to whisper. EEEEE."],
    spareFlavor: "* Feedback is perfectly, beautifully quiet.",
    talk: ["SKREEEEE.", "sorry. SKREE. sorry.", "everyone covers their ears around me."],
    spareTalk: "...testing. testing. it WORKS.",
    acts: {
      "Step Back": e => { e.sp += 40; e.reply = "...hm? that's... better."; return "* You step away from the speaker.\n* The shriek drops to a hum."; },
      "Lower Voice": e => { e.sp += 40; e.reply = "...i can HEAR you. clearly."; return "* You speak softly.\n* For the first time, Feedback just... listens."; },
      "Unplug": e => { e.sp += 25; e.reply = "...ahhh. silence."; return "* You unplug Feedback for a second.\n* It sighs with relief. Then plugs itself back in."; }
    },
    pats: [{ id: "ringwave", col: "#ff9d3f" }, { id: "lasers", col: "#ff9d3f" }]
  },
  deadair: {
    name: "DEAD AIR", area: "static", hp: 220, atk: 6, def: 2, exp: 70, gold: 60, voice: 150, boss: true, bar: true,
    title: "DEAD AIR // THE LAST BROADCAST", music: "deadair", noFlee: true,
    check: "DEAD AIR - ATK 6 DEF 2\n* A radio host whose show was cancelled mid-sentence.\n* It has been broadcasting silence ever since.",
    intro: "* The ON AIR light flickers on.",
    flavor: ["* DEAD AIR adjusts a microphone nobody is listening to.", "* The silence has a sound. It's this.", "* Somewhere, a record keeps skipping."],
    spareFlavor: "* DEAD AIR is ready to say its last line.",
    talk: ["...and now, a word from... from...", "...we'll be right back. we'll be right back.", "IS ANYONE STILL LISTENING?", "...they cut me off. mid-sentence. nine thousand nights ago."],
    spareTalk: "...i think i remember how it ends.",
    acts: {
      "Tune In": e => { if (e.tuned) return "* You're already tuned in. Every word."; e.tuned = 1; e.sp += 25; e.reply = "...a LISTENER?"; return "* You tune in to DEAD AIR's frequency.\n* For the first time in years, someone is listening."; },
      "Request a Song": e => { if (e.song) return "* The song is still playing, softly."; e.song = 1; e.sp += 25; e.reply = "...a REQUEST. i haven't had a request in..."; Sound.sfx("save"); return "* You call in a request: 'Something Signal would like.'\n* A crackly old song begins to play."; },
      "Call In": e => { if (e.call) return "* You're still on the line."; e.call = 1; e.sp += 25; e.reply = "caller, you're ON THE AIR."; return "* You call in to the show.\n* You tell DEAD AIR you're glad it's still broadcasting."; },
      "Let It Sign Off": e => {
        if (e.sp < 75) { e.reply = "...NOT YET. there's no one to say goodnight TO."; return "* You tell DEAD AIR it can finish its show.\n* It isn't sure anyone would hear."; }
        e.sp = 100; e.reply = "...";
        return "* You tell DEAD AIR you'll stay until the end.\n* It takes a long breath of static.";
      }
    },
    pattern(e) {
      const ph = e.hp / e.maxhp < .5 ? 1 : 0;
      const L = [[{ id: "scan", col: "#cfe8ff" }, { id: "ringwave", col: "#57dbff" }, { id: "lasers", col: "#cfe8ff" }],
        [{ id: "scan", col: "#cfe8ff", d: 1.3 }, { id: "mixed", col: "#57dbff" }, { id: "ringwave", col: "#57dbff", d: 1.3 }]][ph];
      return Object.assign({}, L[e.turn % L.length]);
    },
    deathLines: () => ["...and that's... the...", "...", "(static)"],
    spareLines: () => ["...and that's the show, folks.", "Thank you for listening. Really listening.", "Goodnight, everybody."]
  }
});

/* ---------- the quest items, the new door, the tower ---------- */
ROOMS.m_hall.ents.push({ k: "item", tx: 25, ty: 3, item: "radio_dial", flag: "it_dial" });
ROOMS.s_reading.ents.push({ k: "item", tx: 16, ty: 9, item: "radio_coil", flag: "it_coil" });
ROOMS.t_field.ents.push({ k: "item", tx: 21, ty: 5, item: "radio_mic", flag: "it_mic" });

ROOMS.t_entry.map[0] = "##########DD############";
ROOMS.t_entry.map[1] = "##########DD############";
ROOMS.t_entry.puzzle = { flag: "radioFixed", key: "_radio" };
ROOMS.t_entry.exits.push({ x: 10, y: 0, w: 2, h: 1, to: "t_tower", tx: 10, ty: 10, dir: "up" });
ROOMS.t_entry.ents.push({ k: "sign", tx: 9, ty: 2, text: () => G.flags.radioFixed
  ? ["* The old tower door stands open.", "* Faint static drifts down the stairs."]
  : ["* A rusted door marked: BROADCAST TOWER.", "* 'OFF AIR. NO SIGNAL.'"] });

ROOMS.t_tower = {
  area: "static", noMusic: true, map: [
    "####################",
    "##T..............T##",
    "##................##",
    "##...L........L...##",
    "##................##",
    "##................##",
    "##................##",
    "##................##",
    "##................##",
    "##................##",
    "##................##",
    "#########..#########",
    "#########..#########"],
  exits: [{ x: 9, y: 12, w: 2, h: 1, to: "t_entry", tx: 10, ty: 2, dir: "down" }],
  ents: [
    { k: "npc", id: "deadair", tx: 9, ty: 4, if: () => G.flags.deadair !== "kill", talk: () => G.flags.deadair === "spare"
      ? [L("deadair", "...you're still here? The show's over, friend."), L("deadair", "But the light's still on. I think I'll leave it on.")] : [] },
    { k: "deco", id: "gears", tx: 9, ty: 4, if: () => G.flags.deadair === "kill", talk: () => ["* A broken radio. The ON AIR light is dark."] }],
  triggers: [{ x: 2, y: 7, w: 16, h: 1, if: () => !G.flags.deadair, run: () => deadAirEvent() }]
};

function deadAirEvent() {
  World.busy = true;
  Dialog.open([
    "* The ON AIR light blinks on.",
    L("deadair", "...good evening, and welcome back to the show."),
    L("deadair", "...we were cut off. Mid-sentence. They switched off the tower and forgot about us."),
    L("deadair", "I've been broadcasting the silence ever since. Nine thousand nights of it."),
    L("deadair", "...and now, a listener. Stay right there. Don't touch that dial.")], () => {
    startEncounter("deadair", {
      onEnd: res => {
        G.flags.deadair = res;
        if (res === "kill") { G.kills++; G.killed.push("deadair"); }
        else {
          G.spares++; G.spared.push("deadair");
          Timers.after(1.2, () => { if (addItem("encore")) Toast.show("GOT: ENCORE"); Dialog.open(["* DEAD AIR left something by the microphone.", "* An Encore. A standing ovation in a jar."]); });
        }
        returnToWorld();
      }
    });
  });
}

/* Signal now has a quest */
function signalTalk() {
  if (areaVoid("static")) return ["* Only static plays here now.", "* Signal is nowhere to be found."];
  if (G.flags.deadair === "spare") return [L("signal", "I HEARD IT! The whole show! 'Goodnight, everybody!' bzzzt!"), L("signal", "Best broadcast I've ever picked up.")];
  if (G.flags.deadair === "kill") return [L("signal", "...the tower went quiet. Really quiet."), L("signal", "I don't think I'll pick up anything from up there again.")];
  if (G.flags.radioFixed) return [L("signal", "The tower door's open, up past the sign! Somebody's broadcasting up there. Will you go see?")];
  const parts = ["radio_dial", "radio_coil", "radio_mic"], have = parts.filter(k => G.inv.includes(k));
  if (have.length === 3) {
    G.inv = G.inv.filter(k => !parts.includes(k));
    G.flags.radioFixed = true;
    Timers.after(.2, () => Sound.sfx("bell"));
    return [L("signal", "The dial! The coil! The mic! bzzt bzzt BZZT!"), "* Signal snaps the parts into its antenna.",
      L("signal", "It WORKS! I can hear... wait. There's a station up in the old tower. It's been broadcasting nothing for years."),
      L("signal", "...and the tower door just opened. By itself."),
      L("signal", "I'm too scared to go. Will you go see who's on the air?")];
  }
  if (!G.flags.radioQuest) {
    G.flags.radioQuest = true;
    return [L("signal", "bzzt! Hi! I'm Signal! I pick up old broadcasts with my head!"),
      L("signal", "Hey, wanna help? I'm building a radio strong enough to pick up EVERYTHING."),
      L("signal", "I need three parts: a tuning dial, a copper coil and a microphone. Things fall in here all the time, so they're around somewhere!"),
      L("signal", "Check the Margins, the reading room in the Stacks, and out in the fields.")];
  }
  return [L("signal", `You've found ${have.length} of 3 parts! The dial was last seen in the Margins hall, the coil in the reading room, the mic out in the fields.`)];
}

/* ---------- sprites ---------- */
Object.assign(MON_DRAW, {
  scribble(cx, by, t, e, u = 5) {
    const calm = e && e.sp >= 100;
    ctx.save(); ctx.strokeStyle = "#cfcfd8"; ctx.lineWidth = u * .7; ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < 26; i++) {
      const r = hash(i, 3), q = hash(i, 8), wob = calm ? 0 : Math.sin(t * 5 + i) * u * .8;
      const x = cx + (r - .5) * 26 * u + wob, y = by - (4 + q * 22) * u + wob;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.restore();
    ctx.fillStyle = "#fff"; ctx.fillRect(cx - 4 * u, by - 18 * u, 3 * u, 3 * u); ctx.fillRect(cx + 2 * u, by - 18 * u, 3 * u, 3 * u);
    ctx.fillStyle = "#1a1a22"; ctx.fillRect(cx - 3 * u, by - 17 * u, u, u); ctx.fillRect(cx + 3 * u, by - 17 * u, u, u);
  },
  overdue(cx, by, t, e, u = 5) {
    const sweat = !(e && e.sp >= 100), R = P(cx + (sweat ? Math.sin(t * 18) * .4 : 0), by, u);
    R(-9, -26, 18, 23, "#4a2a5a"); R(-8, -25, 16, 21, "#6a3a7a");
    R(-9, -22, 18, 1, "#d8b25a"); R(-9, -7, 18, 1, "#d8b25a");
    R(-5, -19, 3, 2, "#fff"); R(2, -19, 3, 2, "#fff"); R(-4, -19, 1, 1, "#1a1a22"); R(3, -19, 1, 1, "#1a1a22");
    R(-2, -14, 4, 1, "#1a1a22");
    if (sweat) { R(-11, -20 + ((t * 12) % 6), 1, 2, "#57dbff"); R(10, -16 + ((t * 10) % 6), 1, 2, "#57dbff"); }
    ctx.save(); ctx.translate(cx + 1 * u, by - 10 * u); ctx.rotate(-.25);
    ctx.strokeStyle = sweat ? "#ff2b45" : "#4dff8e"; ctx.lineWidth = u * .5; ctx.strokeRect(-7 * u, -2 * u, 14 * u, 4 * u);
    txt(sweat ? "OVERDUE" : "RETURNED", 0, -1.8 * u, sweat ? "#ff2b45" : "#4dff8e", 3.4 * u, "center"); ctx.restore();
  },
  feedback(cx, by, t, e, u = 5) {
    const R = P(cx, by, u), loud = !(e && e.sp >= 100);
    R(-1, -16, 2, 14, "#5a5a66"); R(-6, -3, 12, 3, "#3a3a44");
    R(-4, -26, 8, 10, "#9a9aa8"); R(-3, -25, 6, 8, "#c8c8d4");
    for (let i = 0; i < 3; i++) R(-3, -24 + i * 2, 6, .6, "#5a5a66");
    R(-2, -19, 1, 1, "#1a1a22"); R(1, -19, 1, 1, "#1a1a22");
    if (loud) for (let i = 1; i <= 3; i++) {
      ctx.strokeStyle = `rgba(255,157,63,${.8 - i * .2})`; ctx.lineWidth = u * .6;
      const rr = (i * 5 + (t * 20) % 5) * u;
      ctx.beginPath(); ctx.arc(cx, by - 21 * u, rr, -.6, .6); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, by - 21 * u, rr, Math.PI - .6, Math.PI + .6); ctx.stroke();
    }
  },
  deadair(cx, by, t, e, u = 4) {
    const R = P(cx, by + Math.sin(t * 1.2) * 3, u), on = Math.sin(t * 3) > 0 || (e && e.sp >= 100);
    ctx.globalAlpha *= .92;
    R(-16, -40, 32, 26, "#5a3a24"); R(-15, -39, 30, 24, "#7a5232");
    R(-12, -36, 14, 16, "#3a2a1a");
    for (let i = 0; i < 5; i++) R(-11, -34 + i * 3, 12, 1, "#5a4030");
    R(5, -34, 7, 7, "#d8c8a0"); R(8, -34, 1, 4, "#1a1a22");
    R(5, -25, 3, 3, "#d8b25a"); R(9, -25, 3, 3, "#d8b25a");
    R(-6, -48, 12, 6, on ? "#ff2b45" : "#4a1218");
    txt("ON AIR", cx, by - 47.5 * u + Math.sin(t * 1.2) * 3, on ? "#fff" : "#7a3a40", 3.6 * u, "center");
    R(-12, -14, 24, 10, "#cfe0ff"); R(-14, -10, 28, 8, "#cfe0ff");
    for (let i = 0; i < 7; i++) R(-14 + i * 4, -3, 3, 2 + ((i + Math.floor(t * 3)) % 2) * 2, "#cfe0ff");
    R(-6, -11, 2, 2, "#1a1a22"); R(4, -11, 2, 2, "#1a1a22"); R(-2, -7, 4, 1, "#6a7aa0");
    ctx.globalAlpha = 1;
  }
});
NPC_DRAW.deadair = (cx, by, t, u = 2) => MON_DRAW.deadair(cx, by, t, { sp: G && G.flags.deadair === "spare" ? 100 : 0 }, u * .5);
