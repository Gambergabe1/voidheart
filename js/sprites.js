"use strict";
/* ============================================================
   VOIDHEART — sprites (procedural pixel art)
   ============================================================ */
function P(ox, oy, u) {
  return (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(ox + x * u), Math.round(oy + y * u), Math.ceil(w * u), Math.ceil(h * u)); };
}

/* ---------- MILO ---------- */
const MILO_PAL = { h: "#3b2a22", s: "#f0c8a0", e: "#1a1a22", c: "#3d3a5c", p: "#be6cff", l: "#24242e", b: "#0f0f12" };
const MILO = {
  down: ["...hhhhhh...", "..hhhhhhhh..", ".hhhhhhhhhh.", ".hhssshsshh.", ".hssssssssh.", ".hsessssesh.", "..ssssssss..", "...ssssss...",
    "..cccppccc..", ".ccccppcccc.", "scccppppcccs", ".cccccccccc.", "..llllllll.."],
  up: ["...hhhhhh...", "..hhhhhhhh..", ".hhhhhhhhhh.", ".hhhhhhhhhh.", ".hhhhhhhhhh.", ".shhhhhhhhs.", "..hhhhhhhh..", "...ssssss...",
    "..cccccccc..", ".cccccccccc.", "scccccccccc s".replace(" ", ""), ".cccccccccc.", "..llllllll.."],
  right: ["...hhhhhh...", "..hhhhhhhh..", ".hhhhhhhhhh.", ".hhhhhsssh..", ".hhhhsssss..", ".hhhssssess.", "..hhssssss..", "...sssss....",
    "...ccppcc...", "..cccppccc..", "..ccppsscc..", "..cccccccc..", "...llllll..."],
  legsV: [["..lll..lll..", "..lll..lll..", "..bbb..bbb.."], ["..lll..lll..", "..bbb..lll..", ".......bbb.."], ["..lll..lll..", "..lll..bbb..", "..bbb......."]],
  legsH: [["...ll..ll...", "...ll..ll...", "...bb..bb..."], ["....llll....", "....llll....", "....bbbb...."], ["..ll....ll..", "..ll....ll..", ".bb.....bb.."]]
};
function drawMilo(x, y, dir, frame, alpha = 1) {
  const side = dir === "left" || dir === "right";
  const body = MILO[side ? "right" : dir];
  const legs = side ? MILO.legsH[frame] : MILO.legsV[frame];
  const bob = frame ? 1 : 0;
  ctx.globalAlpha = .35 * alpha; ctx.fillStyle = "#000";
  ctx.beginPath(); ctx.ellipse(x, y - 1, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = alpha;
  const ox = Math.round(x - 12), oy = Math.round(y - 32);
  bmp(body, MILO_PAL, ox, oy - bob, 2, dir === "left");
  bmp(legs, MILO_PAL, ox, oy + 26, 2, dir === "left");
  ctx.globalAlpha = 1;
}

/* ---------- NPCs (overworld + portraits) ---------- */
const NPC_DRAW = {
  quill(cx, by, t, u = 2) {
    const b = Math.round(Math.sin(t * 2.5) * 1);
    const R = P(cx, by - b * u, u);
    R(1, -24, 3, 1, "#f6f6f2"); R(0, -23, 4, 1, "#f6f6f2"); R(-1, -22, 4, 1, "#e8e2f2"); R(-1, -21, 3, 1, "#e8e2f2"); R(0, -20, 2, 1, "#cfc8de");
    R(0, -19, 1, 3, "#9a9aa4");
    R(-2, -17, 5, 2, "#8a6a4a");
    R(-6, -15, 13, 14, "#9fc4d8"); R(-5, -14, 11, 12, "#1b1530");
    R(-5, -14, 1, 6, "#d8f0ff"); R(-4, -14, 9, 2, "#2b2350");
    R(-4, -7, 9, 3, "#efe6cf"); R(-3, -6, 7, 1, "#b9ae95");
    const blink = (t % 4) < .12;
    R(-4, -12, 3, blink ? 1 : 3, "#fff"); R(2, -12, 3, blink ? 1 : 3, "#fff");
    if (!blink) { R(-3, -11, 1, 1, "#000"); R(3, -11, 1, 1, "#000"); }
    R(-4, -1, 3, 1, "#1b1530"); R(2, -1, 3, 1, "#1b1530");
  },
  lint(cx, by, t, u = 2) {
    const R = P(cx, by, u), w = Math.sin(t * 3) * .6;
    R(-6, -14 + w, 2, 6, "#8f8a99"); R(4, -14 - w, 2, 6, "#8f8a99");
    R(-7, -9, 14, 8, "#b3adbf"); R(-8, -7, 16, 5, "#b3adbf"); R(-6, -10, 12, 2, "#c9c4d4");
    for (let i = 0; i < 6; i++) R(-7 + i * 2.5, -1, 1, 1, "#8f8a99");
    R(-4, -7, 2, 2, "#1a1a22"); R(2, -7, 2, 2, "#1a1a22"); R(-1, -5, 2, 1, "#e8a0b0");
    R(-8, -3, 16, 2, "#5b2f3a");
  },
  margin(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -26, 16, 25, "#4a1e22"); R(-7, -25, 14, 23, "#6b2a2a");
    R(-8, -22, 16, 1, "#d8b25a"); R(-8, -6, 16, 1, "#d8b25a");
    R(-5, -18, 4, 3, "#d8b25a"); R(1, -18, 4, 3, "#d8b25a"); R(-1, -17, 2, 1, "#d8b25a");
    R(-4, -17, 2, 1, "#1a1a22"); R(2, -17, 2, 1, "#1a1a22");
    R(-4, -12, 8, 2, "#e8e2d0"); R(-5, -11, 2, 2, "#e8e2d0"); R(3, -11, 2, 2, "#e8e2d0");
    R(-2, -3, 4, 1, "#d8b25a");
    R(8, -25, 2, 23, "#efe6cf");
  },
  signal(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(0, -27, 1, 6, "#9a9aa4"); R(-1, -28, 3, 2, (t % 1) < .5 ? "#ff2b45" : "#5a1a22");
    R(-5, -21, 11, 9, "#d6dce8"); R(-4, -20, 9, 7, "#22303a");
    R(-3, -18, 2, 2, "#57dbff"); R(2, -18, 2, 2, "#57dbff"); R(-1, -15, 3, 1, "#57dbff");
    R(-5, -12, 11, 8, "#2f7f8f"); R(-6, -11, 1, 5, "#f0c8a0"); R(6, -11, 1, 5, "#f0c8a0");
    R(-4, -4, 3, 3, "#24242e"); R(2, -4, 3, 3, "#24242e");
  },
  gears(cx, by, t, u = 2) {
    const R = P(cx, by, u);
    R(-8, -4, 6, 3, "#5c4520"); R(-3, -6, 7, 5, "#8a6a30"); R(3, -3, 6, 2, "#b08a3e"); R(-1, -8, 3, 2, "#6b5228");
    R(-2, -5, 2, 2, "#2a2010"); R(5, -3, 1, 1, "#2a2010");
  },
  brasswick(cx, by, t, u = 2) { MON_DRAW.brasswick(cx, by, t, { hp: 1, maxhp: 1 }, u * .5); },
  vanta(cx, by, t, u = 2) {
    ctx.save(); ctx.translate(cx, by); ctx.scale(.42, .42); ctx.translate(-165, -217);
    drawVanta(t * 1000, { hp: 1, maxhp: 1, mood: 0 }); ctx.restore();
  },
  voice() {}
};

/* ---------- Save point (bookmark ribbon) ---------- */
function drawSavePoint(x, y, t) {
  const R = P(x, y - 20 + Math.sin(t * 2) * 2, 2);
  ctx.globalAlpha = .3 + .2 * Math.sin(t * 3);
  ctx.fillStyle = "#ffd84a"; ctx.beginPath(); ctx.arc(x, y - 12, 13, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  R(-3, -6, 6, 10, "#ff2b45"); R(-3, 4, 2, 2, "#ff2b45"); R(1, 4, 2, 2, "#ff2b45"); R(-1, 4, 2, 1, "#a0102a");
  R(-2, -5, 1, 8, "#ff7a8a");
  const s = (t * 2) % 1;
  ctx.fillStyle = "#fff"; ctx.globalAlpha = 1 - s;
  ctx.fillRect(x + 10, y - 26 - s * 10, 2, 2); ctx.fillRect(x - 12, y - 14 - s * 8, 2, 2);
  ctx.globalAlpha = 1;
}
function drawItemGlint(x, y, t) {
  const a = (Math.sin(t * 4) + 1) / 2;
  ctx.fillStyle = `rgba(255,216,74,${.4 + a * .6})`;
  ctx.fillRect(x - 1, y - 9, 2, 10); ctx.fillRect(x - 5, y - 5, 10, 2);
  ctx.fillStyle = "#fff"; ctx.fillRect(x - 1, y - 5, 2, 2);
}
function drawSign(x, y) {
  const R = P(x, y, 2);
  R(-1, -8, 2, 8, "#4a3424"); R(-7, -16, 14, 9, "#6b4a30"); R(-6, -15, 12, 7, "#d9d0bb");
  R(-4, -13, 8, 1, "#8a7f68"); R(-4, -11, 6, 1, "#8a7f68");
}

/* ---------- MONSTERS (battle) ---------- */
const MON_DRAW = {
  dogear(cx, by, t, e, u = 5) {
    const R = P(cx, by + Math.sin(t * 3) * 3, u);
    R(-8, -21, 16, 19, "#8a7f68"); R(-7, -20, 14, 17, "#efe6cf");
    for (let i = 0; i < 5; i++) { R(2 + i, -20 + i, 6 - i, 1, "#000"); R(2 + i, -20 + i, 1, 1, "#cfc3a5"); }
    R(2, -20, 1, 5, "#cfc3a5"); R(2, -16, 5, 1, "#cfc3a5");
    R(-5, -11, 8, 1, "#b9ae95"); R(-5, -9, 10, 1, "#b9ae95"); R(-5, -7, 6, 1, "#b9ae95");
    const bl = (t % 3.5) < .12;
    R(-4, -16, 2, bl ? 1 : 2, "#222"); R(0, -16, 2, bl ? 1 : 2, "#222");
    R(-6, -14, 2, 1, "#e8a0a0"); R(2, -14, 2, 1, "#e8a0a0");
    R(-5, -3, 3, 2, "#8a7f68"); R(2, -3, 3, 2, "#8a7f68");
  },
  inkling(cx, by, t, e, u = 5) {
    const R = P(cx, by, u);
    for (let y = 0; y < 16; y++) {
      const ny = (y - 9) / 9;
      const w = Math.round(Math.sqrt(Math.max(0, 1 - ny * ny)) * 9 + Math.sin(t * 4 + y * .7));
      R(-w, -19 + y, w * 2, 1, "#141020");
    }
    R(-7, -3, 14, 2, "#141020");
    R(-6, -1, 2, 2 + Math.sin(t * 2) * 1, "#141020"); R(4, -1, 2, 3 + Math.cos(t * 2), "#141020");
    R(-5, -16, 3, 2, "#6b5fa8"); R(-6, -14, 1, 2, "#6b5fa8");
    const lx = Math.round(Math.sin(t * 1.3));
    R(-5, -12, 4, 4, "#fff"); R(1, -12, 4, 4, "#fff");
    R(-4 + lx, -11, 2, 2, "#000"); R(2 + lx, -11, 2, 2, "#000");
  },
  paperweight(cx, by, t, e, u = 5) {
    const R = P(cx, by, u);
    R(-11, -4, 22, 4, "#3b434c"); R(-10, -3, 20, 2, "#4a5560");
    const rows = [6, 8, 9, 10, 10, 11, 11, 11, 11, 11, 11];
    rows.forEach((w, i) => R(-w, -15 + i, w * 2, 1, "#8fb0c4"));
    R(-8, -14, 3, 3, "#d8f0ff");
    R(-1, -10, 2, 6, "#3e7a4a"); R(-3, -12, 6, 3, "#e86a9a"); R(-1, -13, 2, 1, "#ffd84a");
    R(-6, -9, 3, 1, "#1a1a22"); R(4, -9, 3, 1, "#1a1a22");
    R(-7, -11, 4, 1, "#3b434c"); R(4, -11, 4, 1, "#3b434c");
    R(-2, -6, 4, 1, "#3b434c");
  },
  bookwyrm(cx, by, t, e, u = 5) {
    const R = P(cx, by, u);
    const cols = ["#7a3a3a", "#3a5a7a", "#5a7a3a", "#7a6a3a", "#5a3a7a", "#3a7a6a"];
    for (let i = 5; i >= 0; i--) {
      const x = -14 + i * 5, y = -8 + Math.sin(t * 3 + i * .9) * 3 - (i === 5 ? 6 : 0);
      R(x, y, 5, 7, cols[i]); R(x, y + 1, 5, 1, "#d8b25a"); R(x + 1, y + 2, 3, 4, "#efe6cf");
    }
    const hy = -14 + Math.sin(t * 3 + 4.5) * 3;
    R(12, hy - 2, 9, 9, "#c08850"); R(13, hy - 1, 7, 7, "#d8a85a");
    R(14, hy + 1, 2, 2, "#fff"); R(17, hy + 1, 2, 2, "#fff"); R(14, hy + 2, 1, 1, "#000"); R(18, hy + 2, 1, 1, "#000");
    R(13, hy + 1, 7, 1, "#333"); R(14, hy + 5, 4, 1, "#7a3a3a");
  },
  shushling(cx, by, t, e, u = 5) {
    const R = P(cx, by + Math.sin(t * 1.6) * 5, u);
    ctx.globalAlpha *= .9;
    R(-7, -26, 14, 3, "#cfe0ff"); R(-9, -23, 18, 18, "#cfe0ff");
    for (let i = 0; i < 6; i++) R(-9 + i * 3, -5, 3, 2 + ((i + Math.floor(t * 4)) % 2) * 2, "#cfe0ff");
    R(-3, -30, 6, 4, "#8a7f98"); R(-2, -31, 4, 1, "#8a7f98");
    R(-6, -19, 4, 3, "#333"); R(2, -19, 4, 3, "#333"); R(-5, -18, 2, 1, "#cfe0ff"); R(3, -18, 2, 1, "#cfe0ff"); R(-2, -18, 4, 1, "#333");
    R(-1, -14, 2, 1, "#6a7aa0");
    R(-1, -16, 1, 5, "#e8eeff"); R(-2, -12, 3, 2, "#e8eeff");
    ctx.globalAlpha = 1;
  },
  footnote(cx, by, t, e, u = 3) {
    const j = Math.sin(t * 9) * 1;
    const R = P(cx + j, by - 8, u);
    R(-1, -8, 2, 8, "#f2ecd8"); R(-4, -5, 8, 2, "#f2ecd8");
    R(-3, -7, 1, 1, "#f2ecd8"); R(2, -7, 1, 1, "#f2ecd8"); R(-3, -2, 1, 1, "#f2ecd8"); R(2, -2, 1, 1, "#f2ecd8");
    R(-1, -5, 1, 1, "#000"); R(1, -5, 1, 1, "#000");
    txt("1", cx + 16 + j, by - 50, "#ffd84a", 22);
  },
  brasswick(cx, by, t, e, u = 4) {
    const R = P(cx, by, u);
    const ph = e && e.hp / e.maxhp < .5;
    R(-10, -7, 6, 7, "#5c4520"); R(4, -7, 6, 7, "#5c4520");
    R(-12, -30, 24, 24, "#5c4520"); R(-11, -29, 22, 22, "#b08a3e");
    R(-9, -27, 18, 1, "#d8b25a");
    ctx.fillStyle = "#efe6cf"; ctx.beginPath(); ctx.arc(cx, by - 18 * u, 7 * u, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#1a1a22"; ctx.lineWidth = Math.max(1, u * .8);
    const a1 = t * (ph ? 3 : 1.4), a2 = t * .2;
    ctx.beginPath(); ctx.moveTo(cx, by - 18 * u); ctx.lineTo(cx + Math.cos(a1) * 6 * u, by - 18 * u + Math.sin(a1) * 6 * u); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, by - 18 * u); ctx.lineTo(cx + Math.cos(a2) * 4 * u, by - 18 * u + Math.sin(a2) * 4 * u); ctx.stroke();
    R(-9, -44, 18, 14, "#5c4520"); R(-8, -43, 16, 12, "#b08a3e");
    R(-6, -38, 12, 2, "#1a1a22"); R(-5 + Math.round(Math.sin(t * 2) * 4), -38, 3, 2, ph ? "#ff2b45" : "#ffd84a");
    R(-2, -48, 4, 4, "#8a6a30");
    R(-20, -28, 8, 5, "#8a6a30"); R(12, -28, 8, 5, "#8a6a30");
    R(-21, -24 + Math.sin(t * 2) * 2, 5, 12, "#5c4520"); R(16, -24 - Math.sin(t * 2) * 2, 5, 12, "#5c4520");
    const k = Math.sin(t * 3);
    R(12, -40, 2, 6, "#d8b25a"); R(13 - Math.round(k * 2), -43, 3 + Math.round(Math.abs(k) * 2), 3, "#d8b25a");
  },
  rerun(cx, by, t, e, u = 5) {
    const R = P(cx, by, u);
    R(-6, -34, 1, 6, "#9a9aa4"); R(5, -34, 1, 6, "#9a9aa4"); R(-7, -35, 2, 1, "#9a9aa4"); R(5, -35, 2, 1, "#9a9aa4");
    R(-12, -28, 24, 18, "#3a3540"); R(-10, -26, 20, 14, "#9ab8c8");
    for (let i = 0; i < 7; i++) R(-10, -26 + i * 2, 20, 1, (Math.floor(t * 10) + i) % 3 ? "#7a98a8" : "#bcd8e8");
    const face = e && e.sp >= 100;
    R(-6, -22, 3, 3, "#1a1a22"); R(3, -22, 3, 3, "#1a1a22");
    if (face) R(-4, -16, 8, 1, "#1a1a22"); else R(-4, -17, 8, 2, "#1a1a22");
    R(-12, -10, 24, 2, "#2a2530"); R(-4, -8, 8, 6, "#2a2530"); R(-8, -2, 16, 2, "#2a2530");
    R(8, -14, 2, 2, "#ff2b45");
  },
  glitchmoth(cx, by, t, e, u = 5) {
    const flap = Math.abs(Math.sin(t * 6));
    const R = P(cx, by + Math.sin(t * 2) * 4, u);
    for (let i = 0; i < 6; i++) {
      const off = (Math.random() < .08) ? rint(-3, 3) : 0;
      const w = Math.round((10 - i) * (.5 + flap * .5));
      R(-2 - w + off, -24 + i * 2, w, 2, i % 2 ? "#57dbff" : "#be6cff");
      R(2 - off, -24 + i * 2, w, 2, i % 2 ? "#57dbff" : "#be6cff");
    }
    R(-2, -26, 4, 16, "#2a2238"); R(-1, -28, 2, 2, "#2a2238");
    R(-3, -31, 1, 3, "#9a9aa4"); R(2, -31, 1, 3, "#9a9aa4");
    R(-2, -25, 1, 1, "#ffd84a"); R(1, -25, 1, 1, "#ffd84a");
  },
  dialtone(cx, by, t, e, u = 5) {
    const ringing = !e || !e.ans;
    const sh = ringing ? Math.sin(t * 40) * 1.2 : 0;
    const R = P(cx + sh, by, u);
    R(-11, -16, 22, 14, "#8a2430"); R(-10, -15, 20, 12, "#b0303a"); R(-12, -3, 24, 3, "#6a1a24");
    ctx.fillStyle = "#efe6cf"; ctx.beginPath(); ctx.arc(cx + sh, by - 9 * u, 5 * u, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + (ringing ? 0 : t);
      ctx.fillStyle = "#6a1a24"; ctx.fillRect(cx + sh + Math.cos(a) * 3.4 * u - 3, by - 9 * u + Math.sin(a) * 3.4 * u - 3, 6, 6);
    }
    const lift = ringing ? Math.abs(Math.sin(t * 20)) * 2 : 0;
    R(-13, -21 - lift, 26, 4, "#6a1a24"); R(-14, -23 - lift, 6, 5, "#6a1a24"); R(8, -23 - lift, 6, 5, "#6a1a24");
    R(-6, -14, 2, 2, "#fff"); R(4, -14, 2, 2, "#fff");
    for (let i = 0; i < 5; i++) R(12 + i * 2, -6 + (i % 2) * 2, 2, 2, "#6a1a24");
  },
  vanta(cx, by, t, e) {
    ctx.save(); ctx.translate(cx - 165, by - 217);
    drawVanta(t * 1000, e);
    ctx.restore();
  }
};

/* VANTA — adapted from the original boss-fight file */
function drawVanta(t, e) {
  const damaged = e ? 1 - e.hp / e.maxhp : 0;
  const mood = e ? (e.mood || 0) : 0;
  const isVoid = e && e.void;
  ctx.save();
  const bob = Math.sin(t / 430) * 2;
  const jitter = (damaged > .65 || isVoid) ? (Math.random() - .5) * (isVoid ? 3 : 1.8) : 0;
  ctx.translate(jitter, bob);
  const a0 = ctx.globalAlpha;
  ctx.globalAlpha = a0 * (.16 + .05 * Math.sin(t / 280));
  ctx.fillStyle = isVoid ? "#aa2040" : "#7440aa";
  ctx.beginPath(); ctx.ellipse(165, 118, 84, 99, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = a0;
  ctx.fillStyle = "#15131c";
  ctx.beginPath(); ctx.moveTo(118, 88); ctx.lineTo(212, 88); ctx.lineTo(247, 217); ctx.lineTo(83, 217); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#282336";
  ctx.beginPath(); ctx.moveTo(138, 104); ctx.lineTo(192, 104); ctx.lineTo(212, 212); ctx.lineTo(118, 212); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#d9d3e8"; ctx.fillRect(132, 34, 66, 65);
  ctx.fillStyle = "#050507"; ctx.fillRect(138, 40, 54, 51);
  ctx.fillStyle = "#d9d3e8";
  ctx.fillRect(132, 42, 7, 27); ctx.fillRect(191, 58, 7, 31); ctx.fillRect(146, 91, 39, 8);
  const eye = (e && e.sp >= 100) || mood >= 3 ? "#57dbff" : (damaged > .55 || isVoid) ? "#ff2b45" : "#be6cff";
  ctx.fillStyle = eye; ctx.fillRect(147, 57, 10, 5); ctx.fillRect(174, 57, 10, 5);
  if (Math.sin(t / 140) > .82) { ctx.fillRect(142, 72, 46, 2); ctx.fillRect(151, 50, 35, 2); }
  ctx.fillStyle = "#5a3c78"; ctx.fillRect(122, 101, 86, 9);
  ctx.fillStyle = "#b77bff"; ctx.fillRect(152, 103, 26, 4);
  ctx.fillStyle = "#1a1722";
  const sw = Math.sin(t / 520) * 3;
  ctx.fillRect(77, 113 + sw, 38, 15); ctx.fillRect(215, 113 - sw, 38, 15);
  ctx.fillStyle = "#d9d3e8"; ctx.fillRect(67, 113 + sw, 12, 15); ctx.fillRect(251, 113 - sw, 12, 15);
  ctx.strokeStyle = "#be6cff"; ctx.lineWidth = 3; ctx.strokeRect(151, 137, 28, 28);
  ctx.beginPath(); ctx.moveTo(157, 151); ctx.lineTo(173, 151); ctx.moveTo(165, 143); ctx.lineTo(165, 159); ctx.stroke();
  if (damaged > .35) { ctx.strokeStyle = "#7a7189"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(165, 34); ctx.lineTo(158, 47); ctx.lineTo(165, 55); ctx.lineTo(159, 66); ctx.stroke(); }
  if (damaged > .7) { ctx.strokeStyle = "#ff2b45"; ctx.beginPath(); ctx.moveTo(194, 75); ctx.lineTo(184, 82); ctx.lineTo(190, 94); ctx.stroke(); }
  if (damaged > .5 || isVoid) {
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? "#be6cff" : "#d9d3e8";
      ctx.fillRect(95 + Math.random() * 140, 45 + Math.random() * 135, 3 + Math.random() * 5, 2 + Math.random() * 3);
    }
  }
  ctx.restore();
}

/* sprite box sizes for particle effects (approx, relative to center-bottom) */
function monsterBounds(id) {
  if (id === "vanta") return { w: 200, h: 200 };
  if (id === "footnote") return { w: 40, h: 40 };
  if (id === "brasswick") return { w: 170, h: 200 };
  return { w: 120, h: 130 };
}
