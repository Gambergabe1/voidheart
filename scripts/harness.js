#!/usr/bin/env node
/* VOIDHEART headless harness — loads the game in a Node vm with stubbed browser APIs.
   Usage:
     node scripts/harness.js validate [roomPrefix]      check rooms, exits, reachability, monsters, assets
     node scripts/harness.js battle <monsterId> [spare|kill]
     node scripts/harness.js smoke [prefix]             every monster (spare) + every pattern, report errors
     node scripts/harness.js trigger <roomId> [i]       run a room trigger/event end to end (spare policy)
     node scripts/harness.js estimate <ep>              scripted playthrough → content metrics + playtime estimate
     node scripts/harness.js tour <ep>                  room graph reachability for an episode
*/
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");

function makeCtx() {
  const noop = () => {};
  const grad = { addColorStop: noop };
  const store = {};
  return new Proxy(store, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === "measureText") return s => ({ width: String(s).length * 8 });
      if (k === "createLinearGradient" || k === "createRadialGradient") return () => grad;
      if (k === "getImageData") return () => ({ data: new Uint8ClampedArray(4) });
      return noop;
    },
    set(t, k, v) { t[k] = v; return true; }
  });
}
function boot() {
  const ls = {};
  const canvas = { getContext: () => makeCtx(), style: {}, addEventListener() {}, focus() {}, tabIndex: 0 };
  const sandbox = {
    console, Math, Date, JSON, Set, Map, Object, Array, String, Number, Boolean, Promise, Proxy, Uint8ClampedArray, Float32Array,
    setTimeout, clearTimeout, setInterval, clearInterval,
    performance: { now: () => Date.now() },
    requestAnimationFrame: () => 0,
    innerWidth: 1280, innerHeight: 960,
    addEventListener() {}, matchMedia: () => ({ matches: false }), focus() {},
    localStorage: { getItem: k => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: k => { delete ls[k]; } },
    document: {
      getElementById: () => canvas, querySelectorAll: () => [], body: { classList: { add() {} } },
      hasFocus: () => true, fonts: null, documentElement: { requestFullscreen() {} }
    }
  };
  sandbox.window = sandbox; sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  for (const s of srcs) {
    const code = fs.readFileSync(path.join(ROOT, s), "utf8");
    vm.runInContext(code, ctx, { filename: s });
  }
  // helpers living inside the game context
  vm.runInContext(`
    var H = {
      errors: [], chars: 0, turns: 0,
      step(n = 1) { for (let i = 0; i < n; i++) { const dt = 1 / 60; Timers.update(dt); Fade.update(dt); SCENES[Scene.cur].update(dt); if (typeof Ach !== 'undefined') Ach.update(dt); Input.endFrame(); } },
      tap(c) { Input.press(c); H.step(1); Input.release(c); H.step(1); },
      drawNow() { try { SCENES[Scene.cur].draw(1); } catch (e) { H.errors.push('draw ' + Scene.cur + ': ' + e.message); } },
      actStats: {},
      sparePolicy() {
        const B = Battle, e = B.e, d = B.d;
        if (B.canSpare() && !(d.mercyLocked && d.mercyLocked(e))) { B.choose(3); B.sel = 0; B.pickList(); return; }
        B.choose(1);
        const names = B.list.slice(1), key = B.id;
        const st = H.actStats[key] || (H.actStats[key] = { bad: new Set(), i: 0 });
        let pickName = null;
        for (let k = 0; k < names.length; k++) { const n = names[(st.i + k) % names.length]; if (!st.bad.has(n)) { pickName = n; st.i = (st.i + k + 1) % names.length; break; } }
        if (!pickName) pickName = names[0];
        const before = e.sp; B.sel = B.list.indexOf(pickName); B.pickList();
        if (e.sp < before) st.bad.add(pickName);
      },
      killPolicy() { Battle.state = 'fight'; Battle.meter = { x: .5, t: .6 }; Battle.doFight(1); },
      pump(policy, maxFrames = 60000) {
        let f = 0;
        for (; f < maxFrames; f++) {
          if (Scene.cur === 'ending' || Scene.cur === 'epend' || Scene.cur === 'gameover') break;
          if (Scene.cur === 'world' && !Dialog.active && !Shop.active && !Menu.active && !World.busy && Fade.a === 0 && !Timers.list.length) break;
          if (Scene.cur === 'battle') {
            G.hp = Math.max(G.hp, 999);
            const s = Battle.state;
            if (s === 'menu') { H.turns++; (policy === 'kill' ? H.killPolicy : H.sparePolicy)(); }
            else if (s === 'text' || s === 'talk') H.tap('KeyZ');
            else if (s === 'dodge' && Battle.pat.t < Battle.pat.dur - .3) Battle.pat.t = Battle.pat.dur - .3;
            if (Battle.e && Battle.e.turn > 60 && policy !== 'kill') { H.errors.push('could not spare ' + Battle.id + ' in 60 turns'); policy = 'kill'; }
          }
          if (Shop.active) H.tap('KeyX');
          if (Dialog.active) { if (Dialog.cur && Dialog.cur.ch) { Dialog.typer.skip(); } H.tap('KeyZ'); }
          try { H.step(1); if (f % 211 === 0) H.drawNow(); } catch (e) { H.errors.push(Scene.cur + ': ' + (e.stack || e.message).split('\\n').slice(0, 2).join(' | ')); break; }
        }
        return f;
      }
    };
    { const o = Dialog.open.bind(Dialog); Dialog.open = function (lines, done) { for (const l of lines || []) H.chars += (typeof l === 'string' ? l : (l && l.t) || '').length; return o(lines, done); }; }
    var _oe = console.error; console.error = (e) => H.errors.push('console.error: ' + String(e && e.stack || e).split('\\n').slice(0, 2).join(' | '));
  `, ctx);
  return ctx;
}
const run = (ctx, code) => vm.runInContext(code, ctx);

function validate(ctx, prefix) {
  return run(ctx, `(() => {
    const out = [], P = ${JSON.stringify(prefix || "")};
    const ids = Object.keys(ROOMS).filter(k => k.startsWith(P));
    const sol = (m, x, y) => y < 0 || y >= m.length || x < 0 || x >= m[0].length || SOLID.has(m[y][x]);
    for (const id of ids) {
      const r = ROOMS[id], m = r.map;
      if (!r.area) out.push(id + ': no area');
      if (!PAL[r.area]) out.push(id + ': no PAL for area ' + r.area);
      if (!AREAS[r.area]) out.push(id + ': no AREAS entry for ' + r.area);
      if (new Set(m.map(s => s.length)).size > 1) out.push(id + ': rows differ in width');
      if (m.length > 30 || m[0].length > 60) out.push(id + ': map very large ' + m[0].length + 'x' + m.length);
      for (const ex of r.exits || []) {
        const t = ROOMS[ex.to];
        if (!t) { out.push(id + ': exit to missing room ' + ex.to); continue; }
        const c = t.map[ex.ty] && t.map[ex.ty][ex.tx];
        if (!c || SOLID.has(c)) out.push(id + ' -> ' + ex.to + ': spawn tile ' + ex.tx + ',' + ex.ty + ' is solid/outside (' + c + ')');
        for (const e2 of t.exits || []) if (ex.tx >= e2.x && ex.tx < e2.x + e2.w && ex.ty >= e2.y && ex.ty < e2.y + e2.h) out.push(id + ' -> ' + ex.to + ': spawn lands inside an exit (instant bounce)');
        for (let y = ex.y; y < ex.y + ex.h; y++) for (let x = ex.x; x < ex.x + ex.w; x++) if (sol(m, x, y) && m[y] && m[y][x] !== 'D') out.push(id + ': exit tile ' + x + ',' + y + ' is solid');
      }
      const entSolid = new Set((r.ents || []).filter(e => e.k !== 'item' && e.k !== 'page').map(e => e.tx + ',' + e.ty));
      const starts = [];
      for (const r2 of Object.values(ROOMS)) for (const ex of r2.exits || []) if (ex.to === id) starts.push([ex.tx, ex.ty]);
      if (r.start) starts.push([r.start.tx, r.start.ty]);
      if (!starts.length) { out.push(id + ': nothing leads here (orphan room)'); starts.push([2, 2]); }
      const seen = new Set([starts[0].join(',')]), q = [starts[0]];
      while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen.has(k) || (sol(m, nx, ny) && !(m[ny] && m[ny][nx] === 'D')) || entSolid.has(k)) continue; seen.add(k); q.push([nx, ny]); } }
      for (const ex of r.exits || []) { let ok = false; for (let y = ex.y; y < ex.y + ex.h; y++) for (let x = ex.x; x < ex.x + ex.w; x++) if (seen.has(x + ',' + y)) ok = true; if (!ok) out.push(id + ': exit -> ' + ex.to + ' unreachable on foot'); }
      for (const e of r.ents || []) {
        const c = m[e.ty] && m[e.ty][e.tx];
        if (!c || SOLID.has(c)) out.push(id + ': ent ' + (e.id || e.item || e.page || e.k) + ' sits on solid tile ' + e.tx + ',' + e.ty);
        if (![[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => seen.has((e.tx + dx) + ',' + (e.ty + dy)))) out.push(id + ': ent ' + (e.id || e.item || e.page || e.k) + ' unreachable');
        if (e.k === 'npc' || e.k === 'deco') { const sp = e.sprite || e.id; if (!NPC_DRAW[sp]) out.push(id + ': no NPC_DRAW for sprite ' + sp); }
        if (e.k === 'item' && !ITEMS[e.item]) out.push(id + ': unknown item ' + e.item);
        if (e.k === 'item' && !e.flag) out.push(id + ': item ' + e.item + ' has no flag');
        if (e.k === 'page' && !LOST_PAGES[e.page]) out.push(id + ': unknown page ' + e.page);
        if ((e.k === 'npc' || e.k === 'deco') && typeof e.talk !== 'function') out.push(id + ': npc ' + e.id + ' has no talk()');
        if (e.k === 'sign' && typeof e.text !== 'function') out.push(id + ': sign has no text()');
      }
      if (r.puzzle && r.puzzle.order) for (const k of r.puzzle.order) { const [x, y] = k.split(',').map(Number); if (m[y][x] !== 'o') out.push(id + ': puzzle rune ' + k + ' is not an o tile'); }
      if (m.some(s => s.includes('D')) && !r.puzzle && id !== 'm_puzzle') out.push(id + ': has D door tiles but no room.puzzle flag');
      const music = r.noMusic ? null : (AREAS[r.area] && AREAS[r.area].music);
      if (music && !SONGS[music]) out.push(id + ': area music ' + music + ' not in SONGS');
    }
    for (const [a, list] of Object.entries(POOLS)) for (const mid of list) if (!MONSTERS[mid]) out.push('POOLS.' + a + ': missing monster ' + mid);
    for (const [mid, d] of Object.entries(MONSTERS)) {
      if (P && !(d.area && ids.some(id => ROOMS[id].area === d.area))) continue;
      if (!MON_DRAW[d.draw || mid]) out.push('monster ' + mid + ': no MON_DRAW');
      if (!d.pattern) for (const p of d.pats || []) if (!PAT[p.id]) out.push('monster ' + mid + ': unknown pattern ' + p.id);
      if (!d.pattern && !(d.pats || []).length) out.push('monster ' + mid + ': no patterns');
      if (d.music && !SONGS[d.music]) out.push('monster ' + mid + ': music ' + d.music + ' missing');
      for (const [n, f] of Object.entries(d.acts || {})) if (typeof f !== 'function') out.push('monster ' + mid + ': act ' + n + ' not a function');
      if (!d.check && !d.checkFn) out.push('monster ' + mid + ': no check text');
    }
    for (const [k, s] of Object.entries(SONGS)) {
      const lens = [];
      for (const tr of s.tracks) {
        const toks = tr.n.trim().split(/\\s+/); lens.push(toks.length);
        for (const tok of toks) {
          if (tok === '-' || tok === '.') continue;
          if (tr.w === 'drums') { if (!'ksh'.includes(tok)) out.push('song ' + k + ': bad drum ' + tok); continue; }
          for (const n of tok.split('+')) if (!noteFreq(n)) out.push('song ' + k + ': bad note ' + tok);
        }
      }
      const mx = Math.max(...lens);
      for (const l of lens) if (mx % l) out.push('song ' + k + ': track of ' + l + ' steps does not fit the longest (' + mx + ')');
    }
    return { rooms: ids.length, problems: out };
  })()`);
}

function smoke(ctx, prefix) {
  return run(ctx, `(() => {
    const res = [];
    if (!G) G = freshGame(EPISODES.filter(e => e.playable).length);
    for (const id of Object.keys(PAT)) {
      try { Battle.start('dogear', { onEnd() {} }); G.hp = 99999; Battle.e.nextPat = { id }; Battle.startDodge();
        for (let i = 0; i < 900 && Battle.state === 'dodge'; i++) { Battle.update(1 / 60); if (i % 50 === 0) Battle.draw(i / 60); }
        if (Battle.state !== 'menu') res.push('pattern ' + id + ' never ended');
      } catch (e) { res.push('pattern ' + id + ': ' + e.message); }
    }
    const P = ${JSON.stringify(prefix || "")};
    for (const id of Object.keys(MONSTERS)) {
      const d = MONSTERS[id];
      if (P && !Object.keys(ROOMS).some(r => r.startsWith(P) && ROOMS[r].area === d.area)) continue;
      try {
        G.hp = 9999; H.errors = []; H.turns = 0;
        Battle.start(id, { onEnd(r) { H.result = r; }, void: false }); H.result = null; Scene.set('battle');
        H.pump('spare', 40000);
        res.push(id + ': ' + (H.result || 'no result') + ' in ' + H.turns + ' turns' + (H.errors.length ? ' ERR ' + H.errors.join(' / ') : ''));
      } catch (e) { res.push(id + ': CRASH ' + e.message); }
    }
    return res;
  })()`);
}

const [cmd, a1, a2] = process.argv.slice(2);
const ctx = boot();
if (cmd === "validate") {
  const r = validate(ctx, a1);
  console.log(`rooms checked: ${r.rooms}`);
  console.log(r.problems.length ? r.problems.join("\n") : "no problems");
  process.exitCode = r.problems.length ? 1 : 0;
} else if (cmd === "battle") {
  const r = run(ctx, `(() => { G = freshGame(${a1 && a1.startsWith("e3") ? 3 : 2}); G.hp = 9999; H.turns = 0; H.result = null;
    Battle.start(${JSON.stringify(a1)}, { onEnd(r) { H.result = r; } }); H.pump(${JSON.stringify(a2 || "spare")}, 60000);
    return { result: H.result, turns: H.turns, errors: H.errors, acts: H.actStats[${JSON.stringify(a1)}] ? [...H.actStats[${JSON.stringify(a1)}].bad] : [] }; })()`);
  console.log(JSON.stringify(r, null, 1));
} else if (cmd === "smoke") {
  console.log(smoke(ctx, a1).join("\n"));
} else if (cmd === "trigger") {
  const r = run(ctx, `(() => { G = freshGame(${a1 && a1.startsWith("e3") ? 3 : 2}); Scene.set('world'); Fade.a = 0; Fade.target = 0; World.busy = false;
    const room = ROOMS[${JSON.stringify(a1)}]; World.enter(${JSON.stringify(a1)}, 2, 6, 'right');
    const tr = (room.triggers || [])[${Number(a2 || 0)}]; if (!tr) return 'no trigger';
    H.chars = 0; tr.run(); H.pump('spare', 120000);
    return { scene: Scene.cur, flags: G.flags, chars: H.chars, errors: H.errors }; })()`);
  console.log(JSON.stringify(r, null, 1));
} else if (cmd === "tour") {
  const r = run(ctx, `(() => { const ep = ${Number(a1 || 3)}; const pre = ep === 1 ? ['m_','s_','t_','v_'] : ep === 2 ? ['e2_'] : ['e3'];
    const ids = Object.keys(ROOMS).filter(k => pre.some(p => k.startsWith(p)));
    const start = ep === 1 ? 'm_fall' : ep === 2 ? 'e2_well' : (typeof E3 !== 'undefined' && E3.start ? E3.start.room : ids[0]);
    const seen = new Set([start]), q = [start]; while (q.length) { const id = q.shift(); for (const ex of ROOMS[id].exits || []) if (!seen.has(ex.to)) { seen.add(ex.to); q.push(ex.to); } }
    return { rooms: ids.length, reachable: seen.size, unreachable: ids.filter(k => !seen.has(k)) }; })()`);
  console.log(JSON.stringify(r, null, 1));
} else if (cmd === "estimate") {
  const ep = Number(a1 || 3);
  const r = run(ctx, `(() => {
    const ep = ${ep}, pre = ep === 1 ? ['m_','s_','t_','v_'] : ep === 2 ? ['e2_'] : ['e3'];
    const carry1 = { ending: 'pacifist', killed: [], spared: ['brasswick'], wt: 1, exp: 0, gold: 40, vantaAlive: true };
    Memory.data.eps[1] = carry1; Memory.data.eps[2] = { ending: 'restored', restored: [], named: true, spared: [], killed: [], wt: 1, exp: 0, gold: 80, vantaAlive: true, stet: true, shredder: 'spare' };
    beginLoop(ep); H.pump('spare', 3000);
    const ids = Object.keys(ROOMS).filter(k => pre.some(p => k.startsWith(p)));
    let walkTiles = 0, talks = 0, signs = 0, items = 0, encounters = 0, bossTurns = 0, normTurns = 0, triggers = 0, puzzles = 0;
    const sol = (m, x, y) => y < 0 || y >= m.length || x < 0 || x >= m[0].length || (SOLID.has(m[y][x]) && m[y][x] !== 'D');
    H.chars = 0;
    for (const id of ids) {
      const r = ROOMS[id], m = r.map;
      Scene.set('world'); Fade.a = 0; Fade.target = 0; World.busy = false;
      const st = (Object.values(ROOMS).flatMap(r2 => (r2.exits || []).filter(ex => ex.to === id))[0]) || (r.start ? { tx: r.start.tx, ty: r.start.ty } : { tx: 2, ty: 6 });
      World.enter(id, st.tx, st.ty, 'right');
      H.pump('spare', 4000);
      const dist = new Map([[st.tx + ',' + st.ty, 0]]), q = [[st.tx, st.ty]];
      while (q.length) { const [x, y] = q.shift(), d0 = dist.get(x + ',' + y); for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (dist.has(k) || sol(m, nx, ny)) continue; dist.set(k, d0 + 1); q.push([nx, ny]); } }
      const near = (tx, ty) => Math.min(...[[0,0],[1,0],[-1,0],[0,1],[0,-1]].map(([dx, dy]) => dist.get((tx + dx) + ',' + (ty + dy)) ?? 99));
      for (const ex of r.exits || []) walkTiles += near(ex.x, ex.y + ((ex.h || 1) >> 1));
      for (const e of World.ents) {
        walkTiles += Math.min(30, near(e.tx, e.ty)) * 0.6;
        try {
          if (e.k === 'sign') { Dialog.open(e.text()); signs++; }
          else if ((e.k === 'npc' || e.k === 'deco') && e.talk) { const l = e.talk(); if (l && l.length) { Dialog.open(l); talks++; } }
          else if (e.k === 'item') { items++; H.chars += (ITEMS[e.item].desc || '').length + 20; if (!G.inv.includes(e.item) && G.inv.length < 8) G.inv.push(e.item); G.flags[e.flag] = true; }
          else if (e.k === 'page') { const pg = LOST_PAGES[e.page]; H.chars += pg.text.join(' ').length + 40; }
          H.pump('spare', 20000);
        } catch (err) { H.errors.push(id + ' ent ' + (e.id || e.k) + ': ' + err.message); }
      }
      if (r.puzzle && r.puzzle.order) puzzles++;
      for (const tr of r.triggers || []) {
        try { if (!tr.if || tr.if()) { triggers++; const t0 = H.turns; tr.run(); H.pump('spare', 120000); bossTurns += H.turns - t0; } } catch (err) { H.errors.push(id + ' trigger: ' + err.message); }
        if (Scene.cur === 'ending') break;
      }
      if (Scene.cur === 'ending') break;
      if (r.enc && G.pools[r.area]) {
        for (const mid of [...G.pools[r.area]]) {
          encounters++; const t0 = H.turns; Scene.set('world'); World.busy = false; Fade.a = 0; Fade.target = 0;
          startEncounter(mid); H.pump('spare', 60000); normTurns += H.turns - t0;
        }
      }
    }
    return { rooms: ids.length, walkTiles: Math.round(walkTiles), talks, signs, items, encounters, normTurns, triggers, bossTurns, puzzles, dialogueChars: H.chars, errors: H.errors.slice(0, 30), scene: Scene.cur };
  })()`);
  // playtime model (minutes). Calibrated as an estimate, not a measurement.
  const min = {
    reading: r.dialogueChars / 14 / 60,                   // ~14 chars/sec reading + pressing Z
    walking: (r.walkTiles * 32 / 125) * 1.6 / 60,          // walk speed 125px/s, ×1.6 for wandering/backtracking
    battles: r.normTurns * 22 / 60,                        // menu + text + bubble + ~6s dodge per turn
    bosses: r.bossTurns * 26 / 60,
    encounterOverhead: r.encounters * 12 / 60,             // transitions, victory text
    puzzles: r.puzzles * 2,
    exploration: r.rooms * 0.6                             // looking around, menus, saves
  };
  const total = Object.values(min).reduce((a, b) => a + b, 0);
  console.log(JSON.stringify(r, null, 1));
  console.log("estimated minutes:", Object.fromEntries(Object.entries(min).map(([k, v]) => [k, Math.round(v * 10) / 10])));
  console.log("ESTIMATED PLAYTIME (one route, first time):", Math.round(total), "minutes");
} else {
  console.log(fs.readFileSync(__filename, "utf8").split("\n").slice(1, 10).join("\n"));
}
