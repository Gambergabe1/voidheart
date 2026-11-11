"use strict";
/* ============================================================
   VOIDHEART — bullet patterns
   fn(B, S, P, dt, b):  B = inner box, S = pattern state, P = params, b = Battle
   ============================================================ */
function tick(S, interval, dt, key = "c", first = .3) {
  if (S[key] === undefined) S[key] = first;
  S[key] -= dt;
  if (S[key] <= 0) { S[key] += interval; return true; }
  return false;
}
function edgePoint(B, pad = 10) {
  const side = rint(0, 3);
  if (side === 0) return { x: B.x + rand(B.w), y: B.y - pad };
  if (side === 1) return { x: B.x + B.w + pad, y: B.y + rand(B.h) };
  if (side === 2) return { x: B.x + rand(B.w), y: B.y + B.h + pad };
  return { x: B.x - pad, y: B.y + rand(B.h) };
}
function aimAt(b, x, y, sp) {
  const dx = b.soul.x - x, dy = b.soul.y - y, l = Math.hypot(dx, dy) || 1;
  return { vx: dx / l * sp, vy: dy / l * sp };
}
function sub(S, k, dt) { const s = S[k] || (S[k] = { t: 0 }); s.t += dt; return s; }

const PAT = {
  rain: { box: [260, 150], dur: 5.5, def: { col: "#f6f6f2" }, fn(B, S, P, dt, b) {
    if (tick(S, .15 / P.d, dt)) b.spawn({ x: B.x + rand(B.w), y: B.y - 8, vx: rand(-15, 15), vy: rand(90, 150) * P.s, r: 5, col: P.col, shape: "page", rot: rand(6), vr: rand(-3, 3) });
  } },
  flutter: { box: [260, 150], dur: 5.5, def: { col: "#efe6cf" }, fn(B, S, P, dt, b) {
    if (tick(S, .32 / P.d, dt)) b.spawn({ x: B.x + rand(B.w), y: B.y - 8, vx: 0, vy: 55 * P.s, r: 6, col: P.col, shape: "page", rot: 0, vr: 2, ph: rand(6),
      upd(o) { o.vx = Math.sin(o.t * 3 + o.ph) * 75 * P.s; } });
  } },
  side: { box: [300, 150], dur: 5.5, def: { col: "#57dbff" }, fn(B, S, P, dt, b) {
    if (!tick(S, .34 / P.d, dt)) return;
    const left = Math.random() < .5, y = B.y + 12 + rand(B.h - 24), s = rand(125, 180) * P.s;
    b.spawn({ x: left ? B.x - 8 : B.x + B.w + 8, y, vx: left ? s : -s, vy: rand(-14, 14), r: 6, col: P.col, shape: "diamond" });
    if (Math.random() < .45) b.spawn({ x: left ? B.x - 20 : B.x + B.w + 20, y: B.y + B.h - (y - B.y), vx: left ? s * .9 : -s * .9, vy: rand(-10, 10), r: 5, col: P.col, shape: "diamond" });
  } },
  aimed: { box: [240, 180], dur: 5.5, def: { col: "#be6cff" }, fn(B, S, P, dt, b) {
    if (!tick(S, .6 / P.d, dt)) return;
    const o = edgePoint(B), v = aimAt(b, o.x, o.y, 150 * P.s), a0 = Math.atan2(v.vy, v.vx), sp = 150 * P.s;
    for (const da of [-.17, 0, .17]) b.spawn({ x: o.x, y: o.y, vx: Math.cos(a0 + da) * sp, vy: Math.sin(a0 + da) * sp, r: 5, col: P.col, shape: "orb" });
  } },
  ring: { box: [260, 180], dur: 5.5, def: { col: "#ff9d3f" }, fn(B, S, P, dt, b) {
    if (!tick(S, .95 / P.d, dt)) return;
    const ox = B.x + B.w / 2 + Math.sin(S.t * 1.3) * B.w * .35, oy = B.y + 6, n = 12, off = rand(6);
    for (let i = 0; i < n; i++) { const a = off + i * Math.PI * 2 / n; b.spawn({ x: ox, y: oy, vx: Math.cos(a) * 95 * P.s, vy: Math.sin(a) * 95 * P.s, r: 5, col: P.col, shape: "spark" }); }
  } },
  spark: { box: [240, 200], dur: 5.5, def: { col: "#ff9d3f", start: "bottom" }, fn(B, S, P, dt, b) {
    if (!tick(S, .9 / P.d, dt, "c", .5)) return;
    const n = 10, off = S.t * 1.8, cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    for (let i = 0; i < n; i++) { const a = off + i * Math.PI * 2 / n; b.spawn({ x: cx, y: cy, vx: Math.cos(a) * 105 * P.s, vy: Math.sin(a) * 105 * P.s, r: 4.5, col: P.col, shape: "spark" }); }
  } },
  walls: { box: [280, 160], dur: 5.5, def: { col: "#f6f6f2" }, fn(B, S, P, dt, b) {
    if (!tick(S, .75 / P.d, dt)) return;
    const gap = B.x + 40 + rand(B.w - 80);
    for (let x = B.x + 8; x < B.x + B.w; x += 22) {
      if (Math.abs(x - gap) < 40) continue;
      b.spawn({ x, y: B.y - 12, vx: 0, vy: 125 * P.s, w: 14, h: 24, col: P.col, shape: "bar" });
    }
  } },
  stomp: { box: [280, 160], dur: 5.5, def: { col: "#8fb0c4" }, fn(B, S, P, dt, b) {
    if (!tick(S, .85 / P.d, dt)) return;
    const x = B.x + 25 + rand(B.w - 50);
    b.spawn({ x, y: B.y + B.h / 2, w: 44, h: B.h, shape: "warn", harmless: true, col: "#ff2b45", life: .6,
      upd(o) { if (o.t > .55 && !o.fired) { o.fired = 1; Sound.sfx("boom"); b.shake = 4; b.spawn({ x, y: B.y - 16, vx: 0, vy: 430 * P.s, w: 44, h: 30, col: P.col, shape: "bar" }); } } });
  } },
  blot: { box: [240, 180], dur: 5.5, def: { col: "#7a6ad8" }, fn(B, S, P, dt, b) {
    if (!tick(S, 1.1 / P.d, dt)) return;
    const left = Math.random() < .5;
    b.spawn({ x: left ? B.x - 6 : B.x + B.w + 6, y: B.y - 6, vx: 0, vy: 30, r: 8, col: P.col, shape: "orb", life: 4.2,
      upd(o, dt) {
        const dx = b.soul.x - o.x, dy = b.soul.y - o.y, l = Math.hypot(dx, dy) || 1;
        o.vx += dx / l * 150 * dt; o.vy += dy / l * 150 * dt;
        const sp = Math.hypot(o.vx, o.vy), mx = 85 * P.s;
        if (sp > mx) { o.vx *= mx / sp; o.vy *= mx / sp; }
      } });
  } },
  snake: { box: [300, 170], dur: 6, def: { col: "#d8a85a" }, fn(B, S, P, dt, b) {
    if (!tick(S, 1.5 / P.d, dt)) return;
    const base = B.y + 24 + rand(B.h - 48), ph = rand(6), dir = Math.random() < .5 ? 1 : -1;
    for (let i = 0; i < 10; i++) {
      b.spawn({ x: dir > 0 ? B.x - 10 - i * 16 : B.x + B.w + 10 + i * 16, y: base, vx: 110 * dir * P.s, vy: 0, r: 6, col: i === 0 ? "#c08850" : P.col, shape: "orb", life: 7,
        upd(o) { o.y = base + Math.sin(o.x * .045 + ph) * 28; } });
    }
  } },
  letters: { box: [280, 160], dur: 5.5, def: { col: "#f2ecd8", word: "ONCEUPONATIME" }, fn(B, S, P, dt, b) {
    if (!tick(S, .3 / P.d, dt)) return;
    S.i = (S.i || 0) + 1;
    b.spawn({ x: B.x + 10 + rand(B.w - 20), y: B.y - 10, vx: 0, vy: 105 * P.s, r: 8, col: P.col, shape: "char", ch: P.word[S.i % P.word.length] });
  } },
  lasers: { box: [260, 180], dur: 5.5, def: { col: "#ff6b7a" }, fn(B, S, P, dt, b) {
    if (!tick(S, .95 / P.d, dt)) return;
    const h = Math.random() < .5;
    b.spawn({ shape: "laser", ori: h ? "h" : "v", pos: h ? B.y + 16 + rand(B.h - 32) : B.x + 16 + rand(B.w - 32), th: 18, warn: .7, act: .3, life: 1.05, col: P.col, x: 0, y: 0, vx: 0, vy: 0, harmlessUntil: .7 });
    Sound.sfx("warn");
  } },
  hush: { box: [220, 180], dur: 6, def: { col: "#cfe0ff" }, fn(B, S, P, dt, b) {
    if (!tick(S, 1.15 / P.d, dt, "c", .6)) return;
    S.k = !S.k;
    const cx = B.x + B.w / 2, cy = B.y + B.h / 2, sp = 85 * P.s;
    if (S.k) for (let y = B.y + 8; y < B.y + B.h - 4; y += 18) {
      if (Math.abs(y - cy) < 26) continue;
      b.spawn({ x: B.x - 6, y, vx: sp, vy: 0, r: 5, col: P.col, shape: "orb" });
      b.spawn({ x: B.x + B.w + 6, y, vx: -sp, vy: 0, r: 5, col: P.col, shape: "orb" });
    } else for (let x = B.x + 8; x < B.x + B.w - 4; x += 18) {
      if (Math.abs(x - cx) < 26) continue;
      b.spawn({ x, y: B.y - 6, vx: 0, vy: sp, r: 5, col: P.col, shape: "orb" });
      b.spawn({ x, y: B.y + B.h + 6, vx: 0, vy: -sp, r: 5, col: P.col, shape: "orb" });
    }
  } },
  tiny: { box: [220, 150], dur: 5, def: { col: "#f2ecd8" }, fn(B, S, P, dt, b) {
    if (tick(S, .12 / P.d, dt)) b.spawn({ x: B.x + rand(B.w), y: B.y - 6, vx: rand(-20, 20), vy: rand(100, 140) * P.s, r: 3, col: P.col, shape: "orb" });
    if (tick(S, 1.4, dt, "h", .8)) b.spawn({ x: B.x + 20 + rand(B.w - 40), y: B.y - 8, vx: 0, vy: 55, r: 7, shape: "heal", heal: true, col: "#4dff8e" });
  } },
  clock: { box: [220, 220], dur: 6.5, def: { col: "#d8b25a", start: "corner" }, fn(B, S, P, dt, b) {
    if (!S.init) {
      S.init = 1;
      const L = Math.min(B.w, B.h) / 2 - 6;
      [[1.15, 0, L, "#efe6cf"], [-.62, Math.PI, L * .7, "#d8b25a"]].forEach(([w, a, len, col]) =>
        b.spawn({ shape: "line", ang: a, len, th: 8, col, life: 99, x: 0, y: 0, vx: 0, vy: 0,
          upd(o, dt) { o.x = b.ibox.x + b.ibox.w / 2; o.y = b.ibox.y + b.ibox.h / 2; o.ang += w * P.s * dt; } }));
    }
    if (tick(S, 1.0 / P.d, dt, "c", 1)) { const o = edgePoint(B), v = aimAt(b, o.x, o.y, 110 * P.s); b.spawn({ x: o.x, y: o.y, vx: v.vx, vy: v.vy, r: 4, col: P.col, shape: "orb" }); }
  } },
  gears: { box: [260, 200], dur: 6, def: { col: "#b08a3e" }, fn(B, S, P, dt, b) {
    const add = () => {
      const a = rand(.3, 2.8), sp = 115 * P.s;
      b.spawn({ x: B.x + 20 + rand(B.w - 40), y: B.y + 18, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 11, col: P.col, shape: "gear", life: 99,
        upd(o) {
          const I = b.ibox;
          if (o.x < I.x + o.r) { o.x = I.x + o.r; o.vx = Math.abs(o.vx); }
          if (o.x > I.x + I.w - o.r) { o.x = I.x + I.w - o.r; o.vx = -Math.abs(o.vx); }
          if (o.y < I.y + o.r) { o.y = I.y + o.r; o.vy = Math.abs(o.vy); }
          if (o.y > I.y + I.h - o.r) { o.y = I.y + I.h - o.r; o.vy = -Math.abs(o.vy); }
        } });
    };
    if (!S.init) { S.init = 1; add(); add(); if (P.d > .9) add(); }
    if (S.t > 3 && !S.more) { S.more = 1; add(); }
  } },
  tickrain: { box: [260, 170], dur: 5.5, def: { col: "#d8b25a" }, fn(B, S, P, dt, b) {
    if (!tick(S, .5 / P.d, dt)) return;
    S.k = !S.k; Sound.tone(1800, .02, "square", .015);
    for (let x = B.x + 12 + (S.k ? 20 : 0); x < B.x + B.w; x += 40) b.spawn({ x, y: B.y - 6, vx: 0, vy: 140 * P.s, r: 5, col: P.col, shape: "orb" });
  } },
  scan: { box: [260, 180], dur: 5.5, def: { col: "#cfe8ff" }, fn(B, S, P, dt, b) {
    if (!tick(S, 1.25 / P.d, dt)) return;
    S.k = !S.k;
    const sp = 95 * P.s;
    if (S.k) {
      const gx = B.x + 30 + rand(B.w - 60), g = 28;
      const w1 = gx - g - B.x, w2 = B.x + B.w - (gx + g);
      if (w1 > 0) b.spawn({ x: B.x + w1 / 2, y: B.y - 6, vx: 0, vy: sp, w: w1, h: 8, col: P.col, shape: "bar" });
      if (w2 > 0) b.spawn({ x: gx + g + w2 / 2, y: B.y - 6, vx: 0, vy: sp, w: w2, h: 8, col: P.col, shape: "bar" });
    } else {
      const gy = B.y + 30 + rand(B.h - 60), g = 28;
      const h1 = gy - g - B.y, h2 = B.y + B.h - (gy + g);
      const left = Math.random() < .5, x = left ? B.x - 6 : B.x + B.w + 6, vx = left ? sp : -sp;
      if (h1 > 0) b.spawn({ x, y: B.y + h1 / 2, vx, vy: 0, w: 8, h: h1, col: P.col, shape: "bar" });
      if (h2 > 0) b.spawn({ x, y: gy + g + h2 / 2, vx, vy: 0, w: 8, h: h2, col: P.col, shape: "bar" });
    }
  } },
  moths: { box: [240, 190], dur: 5.5, def: { col: "#be6cff" }, fn(B, S, P, dt, b) {
    if (!tick(S, .45 / P.d, dt)) return;
    const o = edgePoint(B, 6);
    b.spawn({ x: o.x, y: o.y, vx: 0, vy: 0, ang: Math.atan2(b.soul.y - o.y, b.soul.x - o.x), r: 5, col: Math.random() < .5 ? "#be6cff" : "#57dbff", shape: "moth", life: 3.4,
      upd(m, dt) {
        const want = Math.atan2(b.soul.y - m.y, b.soul.x - m.x);
        let d = want - m.ang; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
        m.ang += clamp(d, -2.3 * dt, 2.3 * dt);
        const sp = 85 * P.s; m.vx = Math.cos(m.ang) * sp; m.vy = Math.sin(m.ang) * sp;
      } });
  } },
  ringwave: { box: [260, 190], dur: 5.5, def: { col: "#ff6b7a" }, fn(B, S, P, dt, b) {
    if (!tick(S, 1.3 / P.d, dt)) return;
    const ox = B.x + 30 + rand(B.w - 60), oy = B.y - 4, n = 24, gap = rand(Math.PI * .3, Math.PI * .7);
    Sound.sfx("ring");
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      let dd = Math.abs(a - gap); dd = Math.min(dd, Math.PI * 2 - dd);
      if (dd < .3) continue;
      b.spawn({ x: ox, y: oy, vx: Math.cos(a) * 80 * P.s, vy: Math.sin(a) * 80 * P.s, r: 5, col: P.col, shape: "orb" });
    }
  } },
  mixed: { box: [280, 180], dur: 6, def: { col: "#ff2b45" }, fn(B, S, P, dt, b) {
    if (!tick(S, .26 / P.d, dt)) return;
    if (Math.random() < .55) {
      const y = B.y + 10 + rand(B.h - 20), left = Math.random() < .5;
      b.spawn({ x: left ? B.x - 8 : B.x + B.w + 8, y, vx: (left ? 175 : -175) * P.s, vy: Math.sin(S.t * 3) * 35, r: 5, col: P.col, shape: "diamond" });
    } else {
      const o = edgePoint(B, 14), v = aimAt(b, o.x, o.y, 160 * P.s);
      b.spawn({ x: o.x, y: o.y, vx: v.vx, vy: v.vy, r: 5, col: "#be6cff", shape: "orb" });
    }
  } },
  loop: { box: [260, 190], dur: 6, def: { col: "#be6cff" }, fn(B, S, P, dt, b) {
    if (!tick(S, .5 / P.d, dt)) return;
    const o = edgePoint(B, 12), v = aimAt(b, o.x, o.y, 160 * P.s);
    b.spawn({ x: o.x, y: o.y, vx: v.vx, vy: v.vy, r: 6, col: P.col, shape: "diamond", life: 4.5,
      upd(q) {
        if (q.t > .8 && !q.st) { q.st = 1; q.sx = q.vx; q.sy = q.vy; q.vx = 0; q.vy = 0; }
        if (q.t > 1.1 && q.st === 1) { q.st = 2; q.vx = -q.sx * 1.3; q.vy = -q.sy * 1.3; q.col = "#57dbff"; }
      } });
  } },
  collapse: { box: [320, 210], dur: 7, def: { col: "#be6cff" }, fn(B, S, P, dt, b) {
    const k = clamp(S.t / 6, 0, 1);
    b.setBox(lerp(320, 130, k), lerp(210, 110, k), true);
    if (tick(S, .55 / P.d, dt)) { const o = edgePoint(B, 10), v = aimAt(b, o.x, o.y, 130 * P.s); b.spawn({ x: o.x, y: o.y, vx: v.vx, vy: v.vy, r: 5, col: P.col, shape: "orb" }); }
    if (tick(S, .4 / P.d, dt, "r")) b.spawn({ x: B.x + rand(B.w), y: B.y - 6, vx: 0, vy: 110 * P.s, r: 4, col: "#d9d3e8", shape: "page", rot: 0, vr: 3 });
  } },
  archive: { box: [280, 200], dur: 6.5, def: { col: "#be6cff" }, fn(B, S, P, dt, b) {
    PAT.lasers.fn(B, sub(S, "a", dt), Object.assign({}, P, { d: P.d * 1.3, col: "#d9d3e8" }), dt, b);
    PAT.loop.fn(B, sub(S, "b", dt), Object.assign({}, P, { d: P.d * .6 }), dt, b);
  } },
  stamp: { box: [260, 200], dur: 6, def: { col: "#f6f6f2" }, fn(B, S, P, dt, b) {
    if (!tick(S, .95 / P.d, dt, "c", .4)) return;
    b.spawn({ x: b.soul.x, y: b.soul.y, w: 44, h: 44, shape: "warn", col: "#ff2b45", life: .95,
      upd(o) {
        if (o.t < .5) { o.x = b.soul.x; o.y = b.soul.y; }
        if (o.t > .72 / P.s && !o.fired) {
          o.fired = 1; o.dead = true; Sound.sfx("boom"); b.shake = 3;
          b.spawn({ x: o.x, y: o.y, vx: 0, vy: 0, w: 44, h: 44, col: P.col, shape: "bar", life: .28 });
          for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; b.spawn({ x: o.x, y: o.y, vx: Math.cos(a) * 120 * P.s, vy: Math.sin(a) * 120 * P.s, r: 4, col: P.col, shape: "orb" }); }
        }
      } });
  } },
  shred: { box: [280, 180], dur: 6, def: { col: "#f2ecd8" }, fn(B, S, P, dt, b) {
    if (!tick(S, .55 / P.d, dt)) return;
    S.g = (S.g === undefined ? B.x + B.w / 2 : S.g) + rand(-60, 60);
    S.g = clamp(S.g, B.x + 30, B.x + B.w - 30);
    for (let x = B.x + 6; x < B.x + B.w; x += 11) {
      if (Math.abs(x - S.g) < 26) continue;
      b.spawn({ x, y: B.y - 16, vx: 0, vy: 150 * P.s, w: 5, h: 26, col: P.col, shape: "bar" });
    }
  } },
  final: { box: [280, 200], dur: 10, def: { col: "#be6cff" }, fn(B, S, P, dt, b) {
    if (S.t < 3.3) PAT.loop.fn(B, sub(S, "a", dt), Object.assign({}, P, { d: 1.2 }), dt, b);
    else if (S.t < 6.6) {
      PAT.lasers.fn(B, sub(S, "b", dt), Object.assign({}, P, { d: 1.2, col: "#d9d3e8" }), dt, b);
      PAT.rain.fn(B, sub(S, "c", dt), Object.assign({}, P, { d: .6, col: "#be6cff" }), dt, b);
    } else {
      PAT.spark.fn(B, sub(S, "d", dt), Object.assign({}, P, { d: 1.1, col: "#57dbff" }), dt, b);
      PAT.side.fn(B, sub(S, "e", dt), Object.assign({}, P, { d: .6 }), dt, b);
    }
  } }
};
