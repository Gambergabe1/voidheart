"use strict";
/* ============================================================
   VOIDHEART — overworld
   ============================================================ */
const PAL = {
  margins: { floor: "#2e2824", alt: "#332c27", spec: "#4a4038", wall: "#15110f", face: "#4b4036", line: "#2a221d", rug: "#5b2f3a", rug2: "#7a3e4c", shelf: "#3a2a1e" },
  stacks: { floor: "#1c1830", alt: "#201b36", spec: "#2c2650", wall: "#0e0b1a", face: "#3b2a55", line: "#241a36", rug: "#2e3b6b", rug2: "#3e4f8a", shelf: "#3a2a1e" },
  static: { floor: "#0c171c", alt: "#0f1b21", spec: "#173039", wall: "#050b0e", face: "#16404a", line: "#0a2329", grass: "#1f6b78", grass2: "#57dbff" },
  bridge: { floor: "#dfe6ff" },
  last: { floor: "#cfcbe0", alt: "#c8c4da", spec: "#b5b0cc", wall: "#3a3550", face: "#8d86a8", line: "#6d6688" },
  well: { floor: "#101824", alt: "#121b28", spec: "#1d2a3c", wall: "#05080d", face: "#1f3046", line: "#0d1622" },
  under: { floor: "#d8d6e0", alt: "#d0cedb", spec: "#9a98a8", wall: "#0a0a0c", face: "#2a2a30", line: "#141418" },
  office: { floor: "#3a3830", alt: "#363429", spec: "#4a4838", wall: "#14130f", face: "#5a5848", line: "#2e2c24", shelf: "#6a6a70" },
  carbon: { floor: "#2a2a30", alt: "#2e2e35", spec: "#44444c", wall: "#121216", face: "#4a4a54", line: "#26262c", rug: "#3a3a48", rug2: "#5a5a6a" },
  garden: { floor: "#e6e4ec", alt: "#dedce6", spec: "#a8a6b8", wall: "#1a1a20", face: "#3a3a44", line: "#24242a", grass: "#8a88a0", grass2: "#2a2a34" }
};
const BOOK_COLS = ["#7a3a3a", "#3a5a7a", "#5a7a3a", "#7a6a3a", "#5a3a7a", "#3a7a6a", "#8a8070", "#6a2a4a"];

const World = {
  roomId: null, def: null, map: null, mw: 0, mh: 0,
  p: { x: 0, y: 0, dir: "down", walk: 0, moving: false },
  cam: { x: 0, y: 0 }, ents: [], encDist: 0, encNext: 500, busy: false, card: null, emote: 0,

  enter(id, tx, ty, dir, px, py) {
    this.roomId = id; this.def = ROOMS[id]; this.map = this.def.map;
    this.mh = this.map.length; this.mw = this.map[0].length;
    this.p.x = px !== undefined ? px : tx * TILE + 16;
    this.p.y = py !== undefined ? py : ty * TILE + 28;
    if (dir) this.p.dir = dir;
    G.room = id;
    this.buildEnts();
    this.encDist = 0; this.encNext = this.rollEnc();
    Music.play(this.musicFor());
    const a = this.def.area;
    if (!G.seenAreas[a] && AREAS[a]) { G.seenAreas[a] = true; this.card = { a, t: 3.2 }; }
    this.updateCam();
    if (this.def.enc && POOLS[a] && areaVoid(a) && !G.flags["quiet_" + a]) {
      G.flags["quiet_" + a] = true;
      Timers.after(.6, () => Dialog.open(["* ...", "* It's quiet here now.", "* There is nothing left to forget."]));
    }
  },
  rollEnc() { return G.kills > 0 && G.spares === 0 ? rand(260, 460) : rand(420, 760); },
  musicFor() {
    if (this.def.noMusic) return null;
    const a = this.def.area;
    if (POOLS[a] && areaVoid(a)) return "void";
    if (a === "last" && fullVoid()) return "void";
    return AREAS[a].music;
  },
  buildEnts() {
    this.ents = (this.def.ents || [])
      .filter(e => !e.if || e.if())
      .filter(e => !(e.k === "item" && G.flags[e.flag]))
      .filter(e => !(e.k === "page" && Memory.hasPage(e.page)))
      .map(e => Object.assign({}, e, { x: e.tx * TILE + 16, y: e.ty * TILE + 28, alpha: 1 }));
  },
  spawn(e) { this.ents.push(Object.assign({}, e, { x: e.tx * TILE + 16, y: e.ty * TILE + 28, alpha: e.alpha === undefined ? 1 : e.alpha })); },
  fadeEnt(id) { this.ents.forEach(e => { if (e.id === id) e.fading = true; }); },
  tile(tx, ty) { return (ty < 0 || ty >= this.mh || tx < 0 || tx >= this.mw) ? "#" : this.map[ty][tx]; },
  solidTile(tx, ty) {
    const c = this.tile(tx, ty);
    if (c === "D") return !G.flags[roomPuzzle(this.def).flag];
    return SOLID.has(c);
  },
  blocked(x, y) {
    const pts = [[x - 9, y - 8], [x + 9, y - 8], [x - 9, y - 1], [x + 9, y - 1]];
    for (const [px, py] of pts) if (this.solidTile(Math.floor(px / TILE), Math.floor(py / TILE))) return true;
    for (const e of this.ents) {
      if (e.k === "item" || e.k === "page" || e.alpha < .5) continue;
      if (x + 9 > e.x - 13 && x - 9 < e.x + 13 && y > e.y - 10 && y - 8 < e.y + 2) return true;
    }
    return false;
  },
  screenPos() { return { x: this.p.x - this.cam.x, y: this.p.y - this.cam.y }; },
  updateCam() {
    const W = this.mw * TILE, H = this.mh * TILE;
    this.cam.x = W <= CW ? -(CW - W) / 2 : clamp(this.p.x - CW / 2, 0, W - CW);
    this.cam.y = H <= CH ? -(CH - H) / 2 : clamp(this.p.y - CH / 2, 0, H - CH);
  },

  update(dt) {
    for (const e of this.ents) {
      if (e.fading) e.alpha = Math.max(0, e.alpha - dt * 1.4);
      else if (e.appearing) { e.alpha = Math.min(1, e.alpha + dt * 1.5); if (e.alpha >= 1) e.appearing = false; }
    }
    this.ents = this.ents.filter(e => !(e.fading && e.alpha <= 0));
    if (this.card) { this.card.t -= dt; if (this.card.t <= 0) this.card = null; }
    if (this.emote > 0) this.emote -= dt;
    if (Dialog.active) { Dialog.top = this.screenPos().y > 300; Dialog.update(dt); return; }
    if (Shop.active) { Shop.update(dt); return; }
    if (Menu.active) { Menu.update(dt); return; }
    if (this.busy) { this.p.moving = false; return; }

    let mx = 0, my = 0;
    if (Input.held("left")) mx--;
    if (Input.held("right")) mx++;
    if (Input.held("up")) my--;
    if (Input.held("down")) my++;
    const p = this.p;
    p.moving = !!(mx || my);
    if (p.moving) {
      if (my < 0) p.dir = "up"; else if (my > 0) p.dir = "down";
      if (mx && !my) p.dir = mx < 0 ? "left" : "right";
      if (mx && my && (p.dir === "up" || p.dir === "down") && false) p.dir = mx < 0 ? "left" : "right";
      const sp = (Input.held("cancel") ? 175 : 125) * dt;
      const nx = p.x + mx * sp, ny = p.y + my * sp;
      const ox = p.x, oy = p.y;
      if (!this.blocked(nx, p.y)) p.x = nx;
      if (!this.blocked(p.x, ny)) p.y = ny;
      const moved = Math.hypot(p.x - ox, p.y - oy);
      p.walk += moved;
      if (moved > 0) this.afterStep(moved);
    } else p.walk = 0;
    this.updateCam();
    if (this.busy) return;
    if (Input.hit("ok")) this.interact();
    else if (Input.hit("menu")) Menu.open();
  },
  afterStep(moved) {
    const p = this.p, tx = Math.floor(p.x / TILE), ty = Math.floor((p.y - 4) / TILE);
    // runes
    const pz = roomPuzzle(this.def);
    if (this.tile(tx, ty) === "o" && !G.flags[pz.flag]) {
      const k = tx + "," + ty, list = G.flags[pz.key] || (G.flags[pz.key] = []);
      if (!list.includes(k)) {
        if (pz.order && pz.order[list.length] !== k) {
          G.flags[pz.key] = []; Sound.sfx("buzz");
          if (list.length) Dialog.open([pz.wrong || "* The outline smudges. Start again."]);
        } else {
          list.push(k); Sound.sfx("item");
          if (list.length >= (pz.order ? pz.order.length : 3)) {
            G.flags[pz.flag] = true;
            Timers.after(.3, () => { Sound.sfx("bell"); Dialog.open(pz.done || ["* The three forgotten thoughts glow.", "* Somewhere, a door forgets how to stay shut."]); });
          }
        }
      }
    }
    // exits
    for (const ex of this.def.exits || []) {
      if (tx >= ex.x && tx < ex.x + ex.w && ty >= ex.y && ty < ex.y + ex.h) {
        this.busy = true; Sound.sfx("door");
        Fade.out(() => { this.enter(ex.to, ex.tx, ex.ty, ex.dir); Fade.in(() => { this.busy = false; }, 5); }, 6);
        return;
      }
    }
    // triggers
    for (const tr of this.def.triggers || []) {
      if (tx >= tr.x && tx < tr.x + tr.w && ty >= tr.y && ty < tr.y + tr.h && (!tr.if || tr.if())) { tr.run(); return; }
    }
    // random encounters
    const a = this.def.area;
    if (this.def.enc && G.pools[a] && G.pools[a].length) {
      this.encDist += moved;
      if (this.encDist >= this.encNext) { this.encDist = 0; this.encNext = this.rollEnc(); startEncounter(pick(G.pools[a])); }
    }
  },
  interact() {
    const p = this.p;
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.dir];
    const fx = p.x + d[0] * 22, fy = p.y - 6 + d[1] * 22;
    let best = null, bd = 1e9;
    for (const e of this.ents) {
      if (e.alpha < .5) continue;
      const dist = Math.hypot(e.x - fx, (e.y - 8) - fy);
      if (dist < 26 && dist < bd) { bd = dist; best = e; }
    }
    if (!best) return;
    if (best.k === "sign") Dialog.open(best.text());
    else if (best.k === "save") doSave();
    else if (best.k === "item") {
      const it = ITEMS[best.item];
      if (!addItem(best.item)) { Dialog.open(["* There's something here, but your pockets are full."]); return; }
      G.flags[best.flag] = true; Sound.sfx("item");
      this.ents = this.ents.filter(e => e !== best);
      Dialog.open([`* You found the ${it.name}.`, `* ${it.desc}`]);
    } else if (best.k === "page") {
      Memory.addPage(best.page); Sound.sfx("bell");
      this.ents = this.ents.filter(e => e !== best);
      const pg = LOST_PAGES[best.page];
      Dialog.open([`* You found a LOST PAGE. (${Memory.data.pages.length}/${Object.keys(LOST_PAGES).length})`, `* ${pg.title}`, ...pg.text.map(s => `"${s}"`), "* (Read it again any time from the C menu.)"]);
    } else if (best.talk) {
      const lines = best.talk();
      if (lines && lines.length) Dialog.open(lines);
    }
  },

  draw(t) {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    const area = this.def.area, pal = PAL[area];
    const cx = Math.round(this.cam.x), cy = Math.round(this.cam.y);
    const x0 = Math.max(0, Math.floor(cx / TILE)), y0 = Math.max(0, Math.floor(cy / TILE));
    const x1 = Math.min(this.mw - 1, Math.floor((cx + CW) / TILE)), y1 = Math.min(this.mh - 1, Math.floor((cy + CH) / TILE));
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++)
      drawTile(this.map[ty][tx], tx * TILE - cx, ty * TILE - cy, tx, ty, pal, t, area, this);
    // sprites sorted by y
    const list = this.ents.map(e => ({ y: e.y, e }));
    list.push({ y: this.p.y, me: true });
    list.sort((a, b) => a.y - b.y);
    for (const it of list) {
      if (it.me) {
        const fr = this.p.moving ? (Math.floor(this.p.walk / 14) % 4 === 1 ? 1 : Math.floor(this.p.walk / 14) % 4 === 3 ? 2 : 0) : 0;
        drawMilo(Math.round(this.p.x - cx), Math.round(this.p.y - cy), this.p.dir, fr);
        continue;
      }
      const e = it.e, ex = Math.round(e.x - cx), ey = Math.round(e.y - cy);
      ctx.globalAlpha = e.alpha;
      if (e.k === "save") drawSavePoint(ex, ey, t);
      else if (e.k === "item") drawItemGlint(ex, ey - 4, t);
      else if (e.k === "page") drawLostPage(ex, ey, t);
      else if (e.k === "sign") drawSign(ex, ey);
      else if (NPC_DRAW[e.sprite || e.id]) NPC_DRAW[e.sprite || e.id](ex, ey, t, 2);
      ctx.globalAlpha = 1;
    }
    // grey out voided areas
    if ((POOLS[area] && areaVoid(area)) || (area === "last" && fullVoid())) {
      ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, CW, CH); ctx.restore();
    }
    if (this.emote > 0) {
      const s = this.screenPos();
      frame(s.x - 9, s.y - 64, 18, 22, "#fff", 2);
      txt("!", s.x, s.y - 64, "#ff2b45", 26, "center");
    }
    if (this.card) {
      const k = this.card.t, al = Math.min(1, k, 3.2 - k);
      ctx.globalAlpha = Math.max(0, al);
      ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fillRect(0, 196, CW, 74);
      txt(AREAS[this.card.a].name, CW / 2, 202, "#fff", 40, "center");
      txt(AREAS[this.card.a].sub, CW / 2, 240, "#aaa", 22, "center");
      ctx.globalAlpha = 1;
    }
    Dialog.draw(t); Menu.draw(t); Shop.draw(t);
  }
};

/* custom tiles: TILE_DRAW[ch] = (x, y, tx, ty, pal, t, W, h) => {...}; set .floor = false to skip the floor under it.
   Make a custom tile solid with SOLID.add(ch). */
const TILE_DRAW = {};
function roomPuzzle(def) { return (def && def.puzzle) || { flag: "puzzle1", key: "runes" }; }
function drawTile(ch, x, y, tx, ty, pal, t, area, W) {
  const h = hash(tx, ty);
  const floor = () => {
    ctx.fillStyle = ((tx + ty) & 1) ? pal.floor : (pal.alt || pal.floor);
    ctx.fillRect(x, y, TILE, TILE);
  };
  const hook = TILE_DRAW[ch];
  if (hook) {
    if (hook.floor !== false) floor();
    hook(x, y, tx, ty, pal, t, W, h);
    return;
  }
  if (ch === " ") {
    if (area === "bridge" && h < .09) {
      ctx.fillStyle = `rgba(255,255,255,${.25 + .75 * Math.abs(Math.sin(t * .8 + h * 60))})`;
      ctx.fillRect(x + ((h * 997) % 1) * 28, y + ((h * 331) % 1) * 28, 2, 2);
    }
    return;
  }
  if (ch === "=") {
    ctx.fillStyle = "#e9eeff"; ctx.fillRect(x, y, TILE, TILE);
    const below = W.tile(tx, ty + 1), above = W.tile(tx, ty - 1);
    ctx.fillStyle = "#b8c4ff";
    if (above !== "=") ctx.fillRect(x, y, TILE, 3);
    if (below !== "=") { ctx.fillRect(x, y + TILE - 3, TILE, 3); ctx.fillStyle = "rgba(180,196,255,.25)"; ctx.fillRect(x, y + TILE, TILE, 10); }
    ctx.fillStyle = `rgba(190,108,255,${.12 + .1 * Math.sin(t * 2 + tx * .5)})`; ctx.fillRect(x, y, TILE, TILE);
    return;
  }
  if (ch === "#") {
    ctx.fillStyle = pal.wall; ctx.fillRect(x, y, TILE, TILE);
    const below = W.tile(tx, ty + 1);
    if (below !== "#" && below !== " " && below !== "B") {
      ctx.fillStyle = pal.face; ctx.fillRect(x, y + 6, TILE, TILE - 6);
      ctx.fillStyle = pal.line;
      ctx.fillRect(x, y + 6, TILE, 2); ctx.fillRect(x, y + 18, TILE, 2);
      ctx.fillRect(x + ((tx & 1) ? 8 : 22), y + 8, 2, 10); ctx.fillRect(x + ((tx & 1) ? 20 : 6), y + 20, 2, 12);
      if (area === "static" && h < .3) { ctx.fillStyle = `rgba(87,219,255,${.2 + .2 * Math.sin(t * 5 + h * 40)})`; ctx.fillRect(x + h * 28, y + 10, 3, 3); }
    }
    return;
  }
  if (ch === "~") {
    if (area === "under") {
      ctx.fillStyle = "#fbfbff"; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = "#b0aec0";
      if (W.tile(tx, ty - 1) !== "~") for (let i = 0; i < 4; i++) ctx.fillRect(x + i * 8, y, 5, 2 + hash(tx + i, ty) * 4);
      if (h < .4) ctx.fillRect(x + h * 24, y + 14, 3, 2);
    } else {
      ctx.fillStyle = "#03060c"; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = `rgba(70,110,170,${.25 + .2 * Math.sin(t * 1.5 + tx + ty)})`;
      ctx.fillRect(x + 4 + Math.sin(t + h * 9) * 3, y + 12 + h * 8, 12, 2);
    }
    return;
  }
  if (ch === "B" && (area === "office" || area === "carbon")) {
    const below = W.tile(tx, ty + 1);
    ctx.fillStyle = "#2a2a2e"; ctx.fillRect(x, y, TILE, TILE);
    if (below !== "B" && below !== "#") {
      ctx.fillStyle = "#6a6a70"; ctx.fillRect(x + 1, y + 2, TILE - 2, TILE - 2);
      ctx.fillStyle = "#4a4a50"; ctx.fillRect(x + 1, y + 16, TILE - 2, 2);
      ctx.fillStyle = "#c8c8cc"; ctx.fillRect(x + 12, y + 7, 8, 3); ctx.fillRect(x + 12, y + 22, 8, 3);
      ctx.fillStyle = "#efe6cf"; if (h < .35) ctx.fillRect(x + 4, y, 10, 4);
    }
    return;
  }
  if (ch === "B") {
    const below = W.tile(tx, ty + 1);
    if (below === "B" || below === "#" || below === " ") {
      ctx.fillStyle = "#1a120c"; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = "#2a1c12"; ctx.fillRect(x, y + (ty & 1) * 16, TILE, 2);
      return;
    }
    ctx.fillStyle = "#2a1c12"; ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = pal.shelf || "#3a2a1e"; ctx.fillRect(x, y + 14, TILE, 3); ctx.fillRect(x, y + 29, TILE, 3);
    for (let row = 0; row < 2; row++) {
      let bx = x + 1, i = 0;
      while (bx < x + TILE - 2) {
        const r = hash(tx * 7 + i, ty * 13 + row * 5);
        const bw = 3 + Math.floor(r * 4), bh = 9 + Math.floor(r * 4);
        ctx.fillStyle = BOOK_COLS[Math.floor(r * BOOK_COLS.length)];
        ctx.fillRect(bx, y + row * 15 + 14 - bh, Math.min(bw, x + TILE - 1 - bx), bh);
        bx += bw + 1; i++;
      }
    }
    return;
  }
  floor();
  switch (ch) {
    case ",":
      ctx.fillStyle = pal.spec; ctx.fillRect(x + h * 24, y + ((h * 7) % 1) * 24, 3, 2); ctx.fillRect(x + ((h * 3) % 1) * 26, y + ((h * 11) % 1) * 26, 2, 2);
      break;
    case "P":
      ctx.fillStyle = "#d9d0bb"; ctx.fillRect(x + 2 + h * 6, y + 6, 18, 12); ctx.fillStyle = "#b7ad96"; ctx.fillRect(x + 10, y + 14 + h * 4, 16, 12);
      ctx.fillStyle = "#efe6cf"; ctx.fillRect(x + 4 + ((h * 5) % 1) * 10, y + 18, 12, 9);
      ctx.fillStyle = "#8a7f68"; ctx.fillRect(x + 6, y + 9, 10, 1); ctx.fillRect(x + 12, y + 18, 10, 1);
      break;
    case "R": {
      ctx.fillStyle = pal.rug || "#5b2f3a"; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = pal.rug2 || "#7a3e4c";
      if (W.tile(tx - 1, ty) !== "R") ctx.fillRect(x, y, 3, TILE);
      if (W.tile(tx + 1, ty) !== "R") ctx.fillRect(x + TILE - 3, y, 3, TILE);
      if (W.tile(tx, ty - 1) !== "R") ctx.fillRect(x, y, TILE, 3);
      if (W.tile(tx, ty + 1) !== "R") ctx.fillRect(x, y + TILE - 3, TILE, 3);
      if ((tx + ty) % 2 === 0) ctx.fillRect(x + 14, y + 14, 4, 4);
      break;
    }
    case "o": {
      const pz = roomPuzzle(W.def), lit = G.flags[pz.flag] || (G.flags[pz.key] || []).includes(tx + "," + ty);
      ctx.strokeStyle = lit ? "#ffd84a" : "#5a4a7a"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x + 16, y + 16, 11, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = lit ? `rgba(255,216,74,${.5 + .3 * Math.sin(t * 4)})` : "#3a2e52";
      ctx.fillRect(x + 12, y + 12, 8, 8);
      break;
    }
    case "*": {
      for (let i = 0; i < 5; i++) {
        const r = hash(tx * 5 + i, ty * 3);
        const flick = Math.sin(t * 6 + r * 30) > .7;
        ctx.fillStyle = flick ? pal.grass2 : pal.grass;
        ctx.fillRect(x + r * 28, y + 10 + ((r * 7) % 1) * 14, 2, 6 + r * 4);
      }
      break;
    }
    case "D":
      if (G.flags[roomPuzzle(W.def).flag]) { ctx.fillStyle = "#5a4a3a"; ctx.fillRect(x + 2, y, 3, 6); ctx.fillRect(x + 26, y + 26, 3, 6); }
      else {
        ctx.fillStyle = "#1a1612"; ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = "#6b5f52"; for (let i = 0; i < 4; i++) ctx.fillRect(x + 3 + i * 8, y, 3, TILE);
        ctx.fillRect(x, y + 10, TILE, 3);
      }
      break;
    case "T":
      ctx.fillStyle = "#3a4a52"; ctx.fillRect(x + 14, y - 26, 4, 54); ctx.fillRect(x + 6, y - 14, 20, 3); ctx.fillRect(x + 9, y - 22, 14, 2);
      ctx.fillStyle = (t + h * 3) % 1.2 < .6 ? "#ff2b45" : "#4a1218"; ctx.fillRect(x + 13, y - 30, 6, 5);
      break;
    case "L": {
      ctx.fillStyle = "#2a2a30"; ctx.fillRect(x + 14, y - 8, 4, 36); ctx.fillRect(x + 9, y + 26, 14, 4);
      const g = ctx.createRadialGradient(x + 16, y - 12, 2, x + 16, y - 12, 34);
      g.addColorStop(0, "rgba(255,216,140,.45)"); g.addColorStop(1, "rgba(255,216,140,0)");
      ctx.fillStyle = g; ctx.fillRect(x - 20, y - 48, 72, 72);
      ctx.fillStyle = "#ffd88c"; ctx.fillRect(x + 10, y - 18, 12, 10);
      break;
    }
  }
}

/* ---------- saving ---------- */
const saveKey = ep => "vh_save_ep" + ep;
function saveGame() {
  Store.set(saveKey(G.ep || 1), { g: G, room: World.roomId, x: World.p.x, y: World.p.y, dir: World.p.dir });
  Store.set("vh_last", G.ep || 1);
}
function getSave(ep) {
  if (ep === undefined) ep = Store.get("vh_last", 1);
  let s = Store.get(saveKey(ep), null);
  if (!s && ep === 1) s = Store.get("vh_save", null); // older single-slot saves
  return s;
}
function hasSave(ep) { return !!getSave(ep); }
function delSave(ep) { Store.del(saveKey(ep)); if (ep === 1) Store.del("vh_save"); }
function loadGame(ep) {
  if (ep === undefined && G && G.ep) ep = G.ep;
  const s = getSave(ep);
  if (!s) return false;
  G = s.g;
  if (!G.ep) G.ep = 1;
  if (!G.restored) G.restored = [];
  if (!G.poolSize) { G.poolSize = {}; for (const a of Object.keys(G.pools)) G.poolSize[a] = POOLS[a].length; }
  Scene.set("world");
  World.busy = false;
  World.enter(s.room, 0, 0, s.dir, s.x, s.y);
  Fade.a = 1; Fade.in();
  return true;
}
function doSave() {
  G.hp = Math.max(G.hp, maxHP());
  Sound.sfx("save"); saveGame();
  const a = World.def.area;
  const flav = (POOLS[a] && areaVoid(a)) || (a === "last" && fullVoid())
    ? "* A bookmark. There is nothing else here."
    : {
      margins: "* A bookmark hangs in the air, holding your place.", stacks: "* A bookmark rests between two very old pages.",
      static: "* The bookmark flickers, but it holds.", last: "* The last bookmark. It's holding on very tightly.",
      well: "* A bookmark floats on the ink. It doesn't sink.", under: "* A bookmark, outlined in pencil. Someone tried to erase it. It refused.",
      office: "* A bookmark, stamped APPROVED. It looks pleased about it.",
      carbon: "* A bookmark. Then another one, a little blurrier. And another.",
      garden: "* A bookmark, drawn in outline. It holds your place anyway."
    }[a] || "* A bookmark holds your place.";
  const lines = [flav, "* HP fully restored. Your place is saved."];
  if (G.kills > 0 && G.spares === 0 && POOLS[a] && G.pools[a].length) lines.push(`* (${G.pools[a].length} left.)`);
  Dialog.open(lines);
}

/* ---------- encounters ---------- */
function startEncounter(id, opts = {}) {
  World.busy = true; World.emote = .5;
  Sound.sfx("encounter");
  if (!opts.onEnd) opts.onEnd = res => {
    const a = MONSTERS[id].area, pool = G.pools[a];
    if (res === "kill" || res === "spare") { const i = pool.indexOf(id); if (i >= 0) pool.splice(i, 1); }
    if (res === "kill") { G.kills++; G.killed.push(id); G.areaKills[a]++; }
    else if (res === "spare") {
      G.spares++; G.spared.push(id);
      if (MONSTERS[id].base) { G.restored.push(MONSTERS[id].base); Timers.after(1.2, () => Dialog.open([`* The smudge fills in. It remembers its shape.`, `* ${nameOf(MONSTERS[id].base)} is back.`])); }
    }
    returnToWorld();
  };
  Music.stop();
  Timers.after(.5, () => Trans.start(() => Battle.start(id, opts)));
}
function returnToWorld() {
  Scene.set("world");
  World.busy = false;
  World.buildEnts();
  World.encDist = 0; World.encNext = World.rollEnc();
  Music.play(World.musicFor());
  Fade.a = 1; Fade.in(null, 3);
  const a = World.def.area;
  if (World.def.enc && POOLS[a] && areaVoid(a) && !G.flags["quiet_" + a]) {
    G.flags["quiet_" + a] = true;
    Timers.after(.5, () => Dialog.open(["* ...", "* It's quiet now.", "* There is nothing left to forget here."]));
  }
}
const Trans = {
  t: 0, cb: null, hx: 0, hy: 0,
  start(cb) { this.t = 0; this.cb = cb; const s = World.screenPos(); this.hx = s.x; this.hy = s.y - 14; Scene.set("trans"); },
  update(dt) { this.t += dt; if (this.t >= .9 && this.cb) { const c = this.cb; this.cb = null; c(); } },
  draw() {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    if (this.t < .45) { if (Math.floor(this.t * 10) % 2 === 0) drawHeart(this.hx, this.hy, "#ff2b45", 2); }
    else { const k = Math.min(1, (this.t - .45) / .4); drawHeart(lerp(this.hx, 52, k), lerp(this.hy, 448, k), "#ff2b45", 2); }
  }
};
