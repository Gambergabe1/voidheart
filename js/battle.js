"use strict";
/* ============================================================
   VOIDHEART — battle system
   ============================================================ */
const BTN = { x: [30, 185, 340, 495], y: 426, w: 125, h: 44, labels: ["FIGHT", "ACT", "ITEM", "MERCY"], icons: ["⚔", "✦", "▣", "✕"] };
const BOX_BOTTOM = 390;

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1);
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

const Battle = {
  start(id, opts = {}) {
    const d = MONSTERS[id];
    this.id = id; this.d = d; this.opts = opts;
    this.e = Object.assign({ hp: d.hp, maxhp: d.hp, sp: 0, turn: 0, shake: 0 }, d.init ? d.init(opts) : {});
    this.state = "menu"; this.menu = 0; this.sel = 0; this.list = []; this.kind = "";
    this.bullets = []; this.parts = []; this.pop = null; this.slash = -1; this.bubble = null; this.bq = [];
    this.shake = 0; this.inv = 0; this.t = 0; this.moved = 0; this.meter = null;
    this.box = { x: 32, y: BOX_BOTTOM - 140, w: 576, h: 140 }; this.bt = { w: 576, h: 140 };
    this.ibox = { x: 36, y: BOX_BOTTOM - 136, w: 568, h: 132 };
    this.soul = { x: 320, y: 320 };
    this.flavor = new Typer(d.intro || `* ${d.name} drew near!`);
    Music.play(this.e.void ? "vantavoid" : (d.music || "battle"));
    Scene.set("battle");
    Fade.a = 0; Fade.target = 0;
  },
  canSpare() { return this.d.canSpare ? this.d.canSpare(this.e) : this.e.sp >= 100; },
  setBox(w, h, instant) { this.bt.w = w; this.bt.h = h; if (instant) { this.box.w = w; this.box.h = h; } },
  say(text, cb) { this.state = "text"; this.typer = new Typer(text); this.cb = cb; },
  talkSeq(lines, cb) { this.bq = lines.filter(Boolean); this.afterTalk = cb; this.state = "talk"; this.nextBubble(); },
  nextBubble() {
    if (!this.bq.length) { this.bubble = null; this.state = "wait"; const c = this.afterTalk; this.afterTalk = null; if (c) c(); return; }
    this.bubble = new Typer(this.bq.shift(), { voice: this.d.voice || 200, speed: 40 }); this.bubbleHold = 0;
  },
  flavorText() {
    const d = this.d, e = this.e;
    if (d.flavorFn) return d.flavorFn(e);
    if (this.canSpare()) return d.spareFlavor || `* ${d.name} doesn't want to fight anymore.`;
    if (e.hp < e.maxhp * .3) return `* ${d.name} is barely holding together.`;
    return pick(d.flavor);
  },

  /* ----- menu actions ----- */
  choose(m) {
    const d = this.d, e = this.e;
    if (m === 0) { this.state = "fight"; this.meter = { x: 0, t: 0 }; return; }
    if (m === 1) { this.kind = "act"; this.list = ["Check", ...(d.actNames ? d.actNames(e) : Object.keys(d.acts))]; }
    if (m === 2) { if (!G.inv.length) { Sound.sfx("back"); return; } this.kind = "item"; this.list = G.inv.map(id => ITEMS[id].name); }
    if (m === 3) { this.kind = "mercy"; this.list = d.noFlee ? ["Spare"] : ["Spare", "Flee"]; }
    this.sel = 0; this.state = "list";
  },
  pickList() {
    const d = this.d, e = this.e, name = this.list[this.sel];
    if (this.kind === "act") {
      const text = name === "Check" ? (d.checkFn ? d.checkFn(e) : d.check) : d.acts[name](e);
      e.sp = clamp(e.sp, 0, 100);
      this.say(text, () => this.enemyTurn());
    } else if (this.kind === "item") {
      this.say(useItem(this.sel), () => this.enemyTurn());
    } else if (name === "Spare") {
      if (d.mercyLocked && d.mercyLocked(e)) this.say(`* You offer mercy.\n* ${d.name} will not accept it. Not from you.`, () => this.enemyTurn());
      else if (this.canSpare()) this.doSpare();
      else this.say(`* You offer mercy.\n* ...But ${d.name} isn't ready to stop.`, () => this.enemyTurn());
    } else {
      if (Math.random() < .6) { Sound.sfx("flee"); this.fleeing = 0; this.say(pick(["* You slipped away, quietly.", "* You remembered you had somewhere else to be.", "* You backed away. Nobody followed."]), () => this.finish("flee")); }
      else this.say("* You tried to slip away...\n* ...but tripped on a footnote.", () => this.enemyTurn());
    }
  },
  doFight(score) {
    const d = this.d, e = this.e;
    this.state = "wait"; this.slash = 0; Sound.sfx("slash");
    Timers.after(.45, () => {
      let dmg = Math.max(1, Math.round(atkStat() * (.25 + 1.75 * score) * rand(.92, 1.08) - (d.def + (e.defB || 0)) * 1.5));
      if (score > .96) dmg = Math.round(dmg * 1.2);
      const from = e.hp; e.hp = Math.max(0, e.hp - dmg);
      e.shake = 1; Sound.sfx("hit");
      this.pop = { v: dmg, t: 0, from, to: e.hp };
      if (d.onHit && e.hp > 0) d.onHit(e, dmg);
      Timers.after(1.1, () => { this.pop = null; if (e.hp <= 0) this.kill(); else this.enemyTurn(); });
    });
  },
  miss() {
    this.state = "wait"; this.pop = { v: "MISS", t: 0 };
    Timers.after(.8, () => { this.pop = null; this.enemyTurn(); });
  },
  kill() {
    const d = this.d, e = this.e;
    this.state = "wait";
    const go = () => {
      e.dying = .001; Sound.sfx("dust"); this.burst("#ddd", 70);
      Timers.after(1.5, () => {
        if (this.id === "vanta") { this.finish("kill"); return; }
        const up = gainExp(d.exp); G.gold += d.gold;
        let s = d.killText || `* YOU WON!\n* You earned ${d.exp} EXP and ${d.gold} scraps.`;
        if (up) { s += "\n* Your WEIGHT increased."; Sound.sfx("levelup"); }
        this.say(s, () => this.finish("kill"));
      });
    };
    if (d.deathLines) this.talkSeq(d.deathLines(e), go); else go();
  },
  doSpare() {
    const d = this.d, e = this.e;
    const go = () => {
      e.spared = true; Sound.sfx("spare"); this.burst("#fff", 30, true);
      if (this.id === "vanta") { this.state = "wait"; Timers.after(1.4, () => this.finish("spare")); return; }
      G.gold += d.gold;
      this.say(`* YOU WON!\n* You spared ${d.name}.\n* You earned 0 EXP and ${d.gold} scraps.`, () => this.finish("spare"));
    };
    if (d.spareLines) this.talkSeq(d.spareLines(e), go); else go();
  },
  finish(res) {
    this.state = "done";
    Fade.out(() => { this.bullets = []; this.opts.onEnd(res); }, 3);
  },
  burst(col, n, soft) {
    const bd = monsterBounds(this.id);
    for (let i = 0; i < n; i++) this.parts.push({
      x: 320 + rand(-bd.w / 2, bd.w / 2), y: 236 - rand(bd.h), vx: rand(-30, 30) + (soft ? 0 : rand(10, 60)),
      vy: rand(-80, -20), life: rand(.8, 1.6), col, s: rand(2, 4)
    });
  },

  /* ----- enemy turn ----- */
  enemyTurn() {
    const d = this.d, e = this.e;
    e.turn++;
    let line = d.talkFn ? d.talkFn(e) : null;
    if (line == null) {
      if (this.canSpare()) line = d.spareTalk;
      else if (e.reply) { line = e.reply; e.reply = null; }
      else line = pick(d.talk || ["..."]);
    }
    this.talkSeq(Array.isArray(line) ? line : [line], () => this.startDodge());
  },
  startDodge() {
    const d = this.d, e = this.e;
    let spec;
    if (e.nextPat) { spec = e.nextPat; e.nextPat = null; }
    else if (d.pattern) spec = d.pattern(e);
    else spec = d.pats[(e.turn - 1) % d.pats.length];
    const base = PAT[spec.id];
    const P = Object.assign({ s: 1, d: 1 }, base.def || {}, spec);
    if (e.rage) { P.s *= 1.2; P.d *= 1.2; e.rage = 0; }
    const [bw, bh] = spec.box || base.box;
    this.setBox(bw, bh);
    const ib = { x: 320 - bw / 2 + 4, y: BOX_BOTTOM - bh + 4, w: bw - 8, h: bh - 8 };
    const cx = ib.x + ib.w / 2, cy = ib.y + ib.h / 2;
    if (P.start === "bottom") this.soul = { x: cx, y: ib.y + ib.h - 16 };
    else if (P.start === "corner") this.soul = { x: ib.x + 18, y: ib.y + ib.h - 18 };
    else this.soul = { x: cx, y: cy };
    this.pat = { fn: base.fn, P, S: { t: 0 }, dur: spec.dur || base.dur, t: -.5 };
    this.bullets = []; this.moved = 0; this.state = "dodge";
  },
  spawn(o) { o.t = 0; o.vx = o.vx || 0; o.vy = o.vy || 0; if (o.life === undefined) o.life = 8; this.bullets.push(o); },
  hurtBy(b) {
    const d = this.d, e = this.e;
    if (b.heal) { G.hp = Math.min(maxHP(), G.hp + 2); Sound.sfx("heal"); b.dead = true; return; }
    if (this.inv > 0) return;
    const dmg = Math.max(1, Math.round((d.atk + (e.atkB || 0)) * .8) - Math.floor(defStat() / 2));
    G.hp -= dmg; this.inv = d.boss ? .9 : .8; this.shake = 5; Sound.sfx("hurt");
    if (G.hp <= 0) { G.hp = 0; this.state = "dead"; Music.stop(); Timers.after(.2, () => GameOver.start(this.soul.x, this.soul.y)); }
  },
  hitTest(b) {
    const s = this.soul, sr = 4.5;
    switch (b.shape) {
      case "warn": return false;
      case "laser":
        if (b.t < b.warn || b.t > b.warn + b.act) return false;
        return b.ori === "h" ? Math.abs(s.y - b.pos) < b.th / 2 + 2 : Math.abs(s.x - b.pos) < b.th / 2 + 2;
      case "bar": return Math.abs(s.x - b.x) < b.w / 2 + 3 && Math.abs(s.y - b.y) < b.h / 2 + 3;
      case "line": return segDist(s.x, s.y, b.x, b.y, b.x + Math.cos(b.ang) * b.len, b.y + Math.sin(b.ang) * b.len) < b.th / 2 + 3;
      default: return Math.hypot(s.x - b.x, s.y - b.y) < b.r + sr;
    }
  },
  endDodge() {
    const d = this.d, e = this.e;
    this.bullets = []; this.setBox(576, 140);
    const extra = d.afterTurn ? d.afterTurn(e, { moved: this.moved }) : null;
    e.sp = clamp(e.sp, 0, 100);
    this.state = "menu";
    this.flavor = new Typer(extra || this.flavorText());
  },

  /* ----- update ----- */
  update(dt) {
    this.t += dt;
    const b = this.box, k = Math.min(1, dt * 10);
    b.w = Math.abs(b.w - this.bt.w) < 1 ? this.bt.w : lerp(b.w, this.bt.w, k);
    b.h = Math.abs(b.h - this.bt.h) < 1 ? this.bt.h : lerp(b.h, this.bt.h, k);
    b.x = 320 - b.w / 2; b.y = BOX_BOTTOM - b.h;
    this.ibox = { x: b.x + 4, y: b.y + 4, w: b.w - 8, h: b.h - 8 };
    this.shake = Math.max(0, this.shake - dt * 25);
    this.e.shake = Math.max(0, this.e.shake - dt * 1.6);
    if (this.e.dying) this.e.dying = Math.min(1, this.e.dying + dt * .8);
    for (const p of this.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
    this.parts = this.parts.filter(p => p.life > 0);
    if (this.pop) this.pop.t += dt;
    if (this.slash >= 0) { this.slash += dt; if (this.slash > .5) this.slash = -1; }
    this.inv = Math.max(0, this.inv - dt);

    switch (this.state) {
      case "menu": {
        this.flavor.update(dt);
        if (Input.hit("left")) { this.menu = (this.menu + 3) % 4; Sound.sfx("move"); }
        if (Input.hit("right")) { this.menu = (this.menu + 1) % 4; Sound.sfx("move"); }
        if (Input.hit("ok")) { Sound.sfx("select"); this.choose(this.menu); }
        break;
      }
      case "list": {
        const n = this.list.length;
        if (Input.hit("up") && this.sel - 2 >= 0) { this.sel -= 2; Sound.sfx("move"); }
        if (Input.hit("down") && this.sel + 2 < n) { this.sel += 2; Sound.sfx("move"); }
        if (Input.hit("left") && this.sel % 2 === 1) { this.sel--; Sound.sfx("move"); }
        if (Input.hit("right") && this.sel % 2 === 0 && this.sel + 1 < n) { this.sel++; Sound.sfx("move"); }
        if (Input.hit("cancel")) { this.state = "menu"; Sound.sfx("back"); }
        else if (Input.hit("ok")) { Sound.sfx("select"); this.pickList(); }
        break;
      }
      case "text": {
        this.typer.update(dt);
        if (Input.hit("ok") || Input.hit("cancel")) {
          if (!this.typer.done) this.typer.skip();
          else if (Input.hit("ok")) { const c = this.cb; this.cb = null; this.state = "wait"; if (c) c(); }
        }
        break;
      }
      case "fight": {
        const m = this.meter; m.t += dt;
        m.x = m.t / 1.3;
        if (Input.hit("cancel") && m.t < .12) { this.state = "menu"; break; }
        if (Input.hit("ok") && m.t > .05) { m.stop = true; this.doFight(1 - Math.min(1, Math.abs(m.x - .5) / .5)); }
        else if (m.x >= 1) this.miss();
        break;
      }
      case "talk": {
        if (!this.bubble) break;
        this.bubble.update(dt);
        if (this.bubble.done) this.bubbleHold += dt;
        if (Input.hit("ok")) { if (!this.bubble.done) this.bubble.skip(); else this.nextBubble(); }
        else if (this.bubbleHold > 2.6) this.nextBubble();
        break;
      }
      case "dodge": this.updateDodge(dt); break;
    }
  },
  updateDodge(dt) {
    const p = this.pat, s = this.soul, I = this.ibox;
    p.t += dt;
    let mx = 0, my = 0;
    if (Input.held("left")) mx--;
    if (Input.held("right")) mx++;
    if (Input.held("up")) my--;
    if (Input.held("down")) my++;
    if (mx && my) { mx *= .7071; my *= .7071; }
    const sp = (Input.held("cancel") ? 90 : 150) * dt;
    const ox = s.x, oy = s.y;
    s.x = clamp(s.x + mx * sp, I.x + 9, I.x + I.w - 9);
    s.y = clamp(s.y + my * sp, I.y + 8, I.y + I.h - 8);
    if (p.t >= 0) {
      this.moved += Math.hypot(s.x - ox, s.y - oy);
      p.S.t += dt;
      p.fn(I, p.S, p.P, dt, this);
    }
    for (const b of this.bullets) {
      b.t += dt;
      if (b.upd) b.upd(b, dt, this);
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.vr) b.rot += b.vr * dt;
      if (!b.dead && this.state === "dodge" && this.hitTest(b)) this.hurtBy(b);
    }
    this.bullets = this.bullets.filter(b => !b.dead && b.t < b.life &&
      (b.shape === "laser" || b.shape === "line" || (b.x > I.x - 140 && b.x < I.x + I.w + 140 && b.y > I.y - 140 && b.y < I.y + I.h + 140)));
    if (this.state === "dodge" && p.t >= p.dur) this.endDodge();
  },

  /* ----- draw ----- */
  draw(t) {
    const d = this.d, e = this.e;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, CW, CH);
    ctx.fillStyle = e.void ? "rgba(255,43,69,.035)" : "rgba(190,108,255,.04)";
    for (let x = 0; x < CW; x += 16) ctx.fillRect(x, 0, 1, 244);
    for (let y = 0; y < 244; y += 16) ctx.fillRect(0, y, CW, 1);
    ctx.save();
    if (this.shake > 0) ctx.translate(rand(-this.shake, this.shake), rand(-this.shake, this.shake));

    // enemy
    const ex = 320 + (e.shake > 0 ? Math.sin(this.t * 60) * e.shake * 10 : 0);
    ctx.globalAlpha = e.spared ? .4 : e.dying ? Math.max(0, 1 - e.dying) : 1;
    (MON_DRAW[d.draw || this.id])(ex, 236, this.t, e);
    ctx.globalAlpha = 1;
    if (d.title) txt(d.title, 320, 2, e.void ? "#ff2b45" : "#bcbcc7", 22, "center");
    if (d.bar) {
      ctx.fillStyle = "#15151a"; ctx.fillRect(170, 26, 300, 8);
      ctx.fillStyle = e.void ? "#ff2b45" : this.id === "brasswick" ? "#d8b25a" : "#be6cff";
      ctx.fillRect(170, 26, 300 * e.hp / e.maxhp, 8);
    }
    for (const p of this.parts) { ctx.globalAlpha = Math.min(1, p.life); ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, p.s, p.s); }
    ctx.globalAlpha = 1;
    if (this.slash >= 0) {
      const k = Math.min(1, this.slash / .3);
      ctx.strokeStyle = "#ff2b45"; ctx.lineWidth = 5;
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(270 + i * 22, 70); ctx.lineTo(270 + i * 22 + 100 * k, 70 + 120 * k); ctx.stroke(); }
    }
    if (this.pop) {
      const pp = this.pop, bounce = Math.max(0, Math.sin(Math.min(1, pp.t * 2.5) * Math.PI)) * 14;
      txt(String(pp.v), 320, 56 - bounce, pp.v === "MISS" ? "#aaa" : "#ff2b45", 44, "center");
      if (pp.v !== "MISS" && !d.bar) {
        const k = Math.min(1, pp.t / .6), hp = lerp(pp.from, pp.to, k);
        ctx.fillStyle = "#3a3a3a"; ctx.fillRect(220, 104, 200, 12);
        ctx.fillStyle = "#4dff8e"; ctx.fillRect(220, 104, 200 * hp / e.maxhp, 12);
      }
    }
    if (this.state === "talk" && this.bubble) this.drawBubble();

    // box
    const b = this.box;
    frame(Math.round(b.x), Math.round(b.y), Math.round(b.w), Math.round(b.h));
    const tx = b.x + 24, ty = b.y + 16, tw = b.w - 48;
    if (this.state === "menu") drawTyped(this.flavor.full, this.flavor.n, tx, ty, tw, 28);
    else if (this.state === "text") drawTyped(this.typer.full, this.typer.n, tx, ty, tw, 28);
    else if (this.state === "list") this.drawList();
    else if (this.state === "fight" || (this.meter && this.meter.stop && this.slash >= 0)) this.drawMeter();
    else if (this.state === "dodge" || this.state === "dead") this.drawDodge();
    ctx.restore();
    this.drawHUD();
  },
  drawBubble() {
    const x = this.id === "vanta" ? 448 : 420, y = 36, w = this.id === "vanta" ? 182 : 200;
    const lines = wrapText(this.bubble.full, w - 24, 22);
    const h = Math.max(48, lines.length * 22 + 24);
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x - 16, y + 28); ctx.lineTo(x, y + 34); ctx.fill();
    ctx.fillRect(x, y, w, h);
    drawTyped(this.bubble.full, this.bubble.n, x + 12, y + 10, w - 24, 22, "#000", 1);
  },
  drawList() {
    const b = this.box;
    this.list.forEach((s, i) => {
      const x = b.x + 70 + (i % 2) * 270, y = b.y + 14 + Math.floor(i / 2) * 30;
      if (i === this.sel) drawHeart(x - 22, y + 13, "#ff2b45", 2);
      let col = "#fff";
      if (this.kind === "mercy" && s === "Spare") col = (this.d.mercyLocked && this.d.mercyLocked(this.e)) ? "#555" : this.canSpare() ? "#ffd84a" : "#fff";
      txt("* " + s, x, y, col, 28);
    });
  },
  drawMeter() {
    const b = this.box, x0 = b.x + 14, w = b.w - 28, y0 = b.y + 14, h = b.h - 28;
    const bands = ["#2a1414", "#4a2a14", "#5a5a1a", "#d6d64a", "#5a5a1a", "#4a2a14", "#2a1414"];
    const stops = [0, .12, .28, .42, .58, .72, .88, 1];
    for (let i = 0; i < 7; i++) {
      const a = stops[i], c = stops[i + 1];
      const shrink = Math.abs((a + c) / 2 - .5) * 2;
      ctx.fillStyle = bands[i];
      ctx.fillRect(x0 + a * w, y0 + h * shrink * .3, (c - a) * w, h * (1 - shrink * .6));
    }
    ctx.fillStyle = "#fff"; ctx.fillRect(x0 + w / 2 - 2, y0, 4, h);
    const m = this.meter, lx = x0 + clamp(m.x, 0, 1) * w;
    const flash = m.stop && Math.floor(this.t * 16) % 2;
    ctx.fillStyle = "#000"; ctx.fillRect(lx - 6, y0 - 4, 12, h + 8);
    ctx.fillStyle = flash ? "#ffd84a" : "#fff"; ctx.fillRect(lx - 4, y0 - 2, 8, h + 4);
  },
  drawDodge() {
    const I = this.ibox;
    ctx.save(); ctx.beginPath(); ctx.rect(I.x, I.y, I.w, I.h); ctx.clip();
    for (const o of this.bullets) drawBullet(o, this.t);
    ctx.restore();
    if (this.state === "dodge" && (this.inv <= 0 || Math.floor(this.inv * 16) % 2 === 0)) drawHeart(this.soul.x, this.soul.y, "#ff2b45", 2);
  },
  drawHUD() {
    const y = 396;
    txt("MILO", 32, y, "#fff", 28);
    txt(`WT ${G.wt}`, 110, y, "#fff", 28);
    txt("HP", 210, y + 4, "#fff", 20);
    const mh = maxHP(), bw = Math.round(mh * 2.2);
    ctx.fillStyle = "#a01a2a"; ctx.fillRect(238, y + 3, bw, 20);
    ctx.fillStyle = "#ffd84a"; ctx.fillRect(238, y + 3, Math.round(bw * Math.max(0, G.hp) / mh), 20);
    txt(`${Math.max(0, G.hp)} / ${mh}`, 250 + bw, y, "#fff", 28);
    const locked = this.d.mercyLocked && this.d.mercyLocked(this.e);
    for (let i = 0; i < 4; i++) {
      const x = BTN.x[i], sel = i === this.menu && (this.state === "menu" || this.state === "list");
      let col = sel ? "#ffd84a" : "#ff9d3f";
      if (i === 3 && locked) col = "#555";
      frame(x, BTN.y, BTN.w, BTN.h, col, 3);
      if (sel && this.state === "menu") drawHeart(x + 20, BTN.y + 22, "#ff2b45", 2);
      else txt(BTN.icons[i], x + 20, BTN.y + 9, col, 24, "center");
      txt(BTN.labels[i], x + 76, BTN.y + 8, col, 30, "center");
    }
  }
};

function drawBullet(o, t) {
  ctx.fillStyle = o.col; ctx.strokeStyle = o.col;
  switch (o.shape) {
    case "diamond":
      ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(Math.PI / 4); ctx.fillRect(-o.r, -o.r, o.r * 2, o.r * 2); ctx.restore(); break;
    case "page":
      ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot || 0); ctx.fillRect(-5, -6, 10, 12);
      ctx.fillStyle = "#8a7f68"; ctx.fillRect(-3, -3, 6, 1); ctx.fillRect(-3, 0, 5, 1); ctx.restore(); break;
    case "spark":
      ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(t * 4);
      ctx.fillRect(-o.r * .6, -o.r * 1.7, o.r * 1.2, o.r * 3.4); ctx.fillRect(-o.r * 1.7, -o.r * .6, o.r * 3.4, o.r * 1.2); ctx.restore(); break;
    case "bar": ctx.fillRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h); break;
    case "warn":
      ctx.globalAlpha = .18 + .12 * Math.sin(o.t * 40);
      ctx.fillRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h); ctx.globalAlpha = 1; break;
    case "laser": {
      const B = Battle.ibox, active = o.t >= o.warn;
      if (!active) {
        ctx.globalAlpha = .4 + .4 * Math.sin(o.t * 50);
        if (o.ori === "h") ctx.fillRect(B.x, o.pos - 1, B.w, 2); else ctx.fillRect(o.pos - 1, B.y, 2, B.h);
        ctx.globalAlpha = 1;
      } else {
        const k = 1 - Math.max(0, (o.t - o.warn) / o.act) * .5, th = o.th * k;
        if (o.ori === "h") { ctx.fillRect(B.x, o.pos - th / 2, B.w, th); ctx.fillStyle = "#fff"; ctx.fillRect(B.x, o.pos - th / 4, B.w, th / 2); }
        else { ctx.fillRect(o.pos - th / 2, B.y, th, B.h); ctx.fillStyle = "#fff"; ctx.fillRect(o.pos - th / 4, B.y, th / 2, B.h); }
      }
      break;
    }
    case "line":
      ctx.lineWidth = o.th; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x + Math.cos(o.ang) * o.len, o.y + Math.sin(o.ang) * o.len); ctx.stroke();
      ctx.fillStyle = "#1a1a22"; ctx.beginPath(); ctx.arc(o.x, o.y, 5, 0, Math.PI * 2); ctx.fill(); break;
    case "char": txt(o.ch, o.x, o.y - 14, o.col, 30, "center"); break;
    case "heal":
      ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillRect(o.x - 1, o.y - 4, 2, 8); ctx.fillRect(o.x - 4, o.y - 1, 8, 2); break;
    case "moth": {
      const f = Math.abs(Math.sin(o.t * 18)) * 5 + 2;
      ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.ang || 0);
      ctx.fillRect(-2, -f, 5, f * 2); ctx.fillStyle = "#fff"; ctx.fillRect(2, -1, 3, 2); ctx.restore(); break;
    }
    case "gear":
      ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.t * 3);
      for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); ctx.fillRect(-2.5, -o.r - 3, 5, 6); }
      ctx.beginPath(); ctx.arc(0, 0, o.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(0, 0, o.r * .35, 0, Math.PI * 2); ctx.fill(); ctx.restore(); break;
    default:
      ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
  }
}
