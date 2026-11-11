"use strict";
/* ============================================================
   VOIDHEART — UI: dialogue box, pause menu, shop
   ============================================================ */
const Dialog = {
  active: false, queue: [], cur: null, typer: null, done: null, ch: 0, top: false,
  open(lines, done) {
    this.queue = lines.slice(); this.done = done || null; this.active = true;
    this.next();
  },
  next() {
    if (!this.queue.length) {
      this.active = false; this.cur = null;
      const d = this.done; this.done = null;
      if (d) d();
      return;
    }
    let l = this.queue.shift();
    if (typeof l === "string") l = { t: l };
    this.cur = l; this.ch = 0;
    const sp = l.who && SPEAKERS[l.who];
    this.typer = new Typer(l.t, { voice: sp ? sp.voice : 200, speed: 46 });
  },
  update(dt) {
    if (!this.active) return;
    this.typer.update(dt);
    const l = this.cur;
    if (this.typer.done && l.ch) {
      if (Input.hit("left") || Input.hit("up")) { this.ch = (this.ch + l.ch.length - 1) % l.ch.length; Sound.sfx("move"); }
      if (Input.hit("right") || Input.hit("down")) { this.ch = (this.ch + 1) % l.ch.length; Sound.sfx("move"); }
    }
    if (Input.hit("cancel") && !this.typer.done) this.typer.skip();
    if (Input.hit("ok")) {
      if (!this.typer.done) { this.typer.skip(); return; }
      Sound.sfx("select");
      if (l.ch && l.on) { const extra = l.on(this.ch); if (extra) this.queue.unshift(...extra); }
      if (l.give) { if (addItem(l.give)) { Toast.show("GOT: " + ITEMS[l.give].name.toUpperCase()); Sound.sfx("item"); } }
      if (l.after) { const a = l.after; this.queue = []; this.active = false; const d = this.done; this.done = null; a(); if (d) d(); return; }
      this.next();
    }
  },
  draw(t) {
    if (!this.active || !this.cur) return;
    const l = this.cur, sp = l.who && SPEAKERS[l.who];
    const y = this.top ? 12 : CH - 162, h = 150;
    frame(16, y, CW - 32, h);
    let tx = 36;
    if (sp && NPC_DRAW[l.who] && l.who !== "voice") {
      ctx.save(); ctx.beginPath(); ctx.rect(24, y + 8, 110, h - 16); ctx.clip();
      NPC_DRAW[l.who](79, y + h - 18, t, 4);
      ctx.restore();
      tx = 146;
    }
    if (sp) txt(sp.name, tx, y + 10, l.who === "vanta" || l.who === "voice" ? "#be6cff" : "#ffd84a", 22);
    drawTyped(l.t, this.typer.n, tx, y + (sp ? 34 : 18), CW - 32 - (tx - 16) - 24, 28);
    if (this.typer.done && l.ch) {
      l.ch.forEach((c, i) => {
        const cx = tx + 30 + i * 200, cy = y + h - 38;
        if (i === this.ch) drawHeart(cx - 16, cy + 12, "#ff2b45", 2);
        txt(c, cx, cy, i === this.ch ? "#ffd84a" : "#fff", 28);
      });
    } else if (this.typer.done && Math.floor(t * 3) % 2) {
      txt("▼", CW - 46, y + h - 34, "#fff", 22);
    }
  }
};

/* ---------- pause menu (C) ---------- */
const Menu = {
  active: false, state: "main", idx: 0, item: 0, act: 0,
  open() { this.active = true; this.state = "main"; this.idx = 0; Sound.sfx("select"); },
  close() { this.active = false; },
  update() {
    const up = Input.hit("up"), dn = Input.hit("down"), lf = Input.hit("left"), rt = Input.hit("right");
    const ok = Input.hit("ok"), no = Input.hit("cancel") || Input.hit("menu");
    if (this.state === "main") {
      if (up) { this.idx = (this.idx + 2) % 3; Sound.sfx("move"); }
      if (dn) { this.idx = (this.idx + 1) % 3; Sound.sfx("move"); }
      if (ok) {
        if (this.idx === 0) { if (G.inv.length) { this.state = "items"; this.item = 0; Sound.sfx("select"); } else Sound.sfx("back"); }
        else if (this.idx === 1) { this.state = "stat"; Sound.sfx("select"); }
        else { if (Memory.data.pages.length) { this.state = "pages"; this.item = 0; Sound.sfx("select"); } else Sound.sfx("back"); }
      }
      if (no) { this.close(); Sound.sfx("back"); }
    } else if (this.state === "pages") {
      const ids = Object.keys(LOST_PAGES);
      if (up) { this.item = (this.item + ids.length - 1) % ids.length; Sound.sfx("move"); }
      if (dn) { this.item = (this.item + 1) % ids.length; Sound.sfx("move"); }
      if (no) { this.state = "main"; Sound.sfx("back"); }
      else if (ok) {
        const id = ids[this.item];
        if (!Memory.hasPage(id)) { Sound.sfx("back"); return; }
        const pg = LOST_PAGES[id];
        this.close(); Dialog.open([`* ${pg.title}`, ...pg.text.map(s => `"${s}"`)]);
      }
    } else if (this.state === "items") {
      if (up) { this.item = (this.item + G.inv.length - 1) % G.inv.length; Sound.sfx("move"); }
      if (dn) { this.item = (this.item + 1) % G.inv.length; Sound.sfx("move"); }
      if (ok) { this.state = "itemAct"; this.act = 0; Sound.sfx("select"); }
      if (no) { this.state = "main"; Sound.sfx("back"); }
    } else if (this.state === "itemAct") {
      if (lf) { this.act = (this.act + 2) % 3; Sound.sfx("move"); }
      if (rt) { this.act = (this.act + 1) % 3; Sound.sfx("move"); }
      if (no) { this.state = "items"; Sound.sfx("back"); }
      if (ok) {
        const i = this.item, it = ITEMS[G.inv[i]];
        this.close();
        if (this.act === 0) Dialog.open([useItem(i)]);
        else if (this.act === 1) Dialog.open([`* "${it.name}"`, ...it.desc.split("\n").map(s => s.startsWith("*") || s.startsWith("\"") ? s : "* " + s)]);
        else {
          if (it.type === "key") { Dialog.open(["* You can't bring yourself to drop it."]); }
          else { G.inv.splice(i, 1); Dialog.open([`* The ${it.name} was left behind.`, "* Something down here will find it."]); }
        }
      }
    } else if (this.state === "stat") {
      if (ok || no) { this.state = "main"; Sound.sfx("back"); }
    }
  },
  draw() {
    if (!this.active) return;
    frame(24, 24, 170, 120);
    txt("MILO", 40, 34, "#fff", 30);
    txt(`WT  ${G.wt}`, 40, 64, "#ddd", 22);
    txt(`HP  ${G.hp}/${maxHP()}`, 40, 84, "#ddd", 22);
    txt(`$   ${G.gold}`, 40, 104, "#ddd", 22);
    frame(24, 152, 170, 136);
    ["ITEM", "STAT", "PAGES"].forEach((s, i) => {
      const c = this.state === "main" && i === this.idx;
      if (c) drawHeart(50, 182 + i * 36, "#ff2b45", 2);
      const dim = (i === 0 && !G.inv.length) || (i === 2 && !Memory.data.pages.length);
      txt(s, 70, 168 + i * 36, dim ? "#666" : "#fff", 30);
    });
    if (this.state === "pages") {
      const ids = Object.keys(LOST_PAGES);
      frame(206, 24, 410, 380);
      txt(`LOST PAGES  ${Memory.data.pages.length}/${ids.length}`, 230, 36, "#be6cff", 26);
      const rh = ids.length > 9 ? 24 : 36, fs = ids.length > 9 ? 22 : 26;
      const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI"];
      ids.forEach((id, i) => {
        const got = Memory.hasPage(id), y = 70 + i * rh;
        if (i === this.item) drawHeart(232, y + fs / 2, "#ff2b45", 2);
        txt(got ? LOST_PAGES[id].title.replace("Lost Page ", "") : `${roman.at(i)}: ???  (Episode ${LOST_PAGES[id].ep})`, 252, y, got ? "#fff" : "#555", fs);
      });
    }
    if (this.state === "items" || this.state === "itemAct") {
      frame(206, 24, 410, 380);
      G.inv.forEach((id, i) => {
        if (i === this.item && this.state === "items") drawHeart(232, 56 + i * 36, "#ff2b45", 2);
        txt(ITEMS[id].name, 252, 42 + i * 36, "#fff", 28);
      });
      ["USE", "INFO", "DROP"].forEach((s, i) => {
        const x = 252 + i * 120;
        if (this.state === "itemAct" && i === this.act) drawHeart(x - 18, 370, "#ff2b45", 2);
        txt(s, x, 356, this.state === "itemAct" && i === this.act ? "#ffd84a" : "#fff", 28);
      });
    }
    if (this.state === "stat") {
      frame(206, 24, 410, 420);
      txt('"MILO"', 230, 40, "#fff", 30);
      txt(`WT  ${G.wt}`, 230, 90, "#fff", 28);
      txt(`HP  ${G.hp} / ${maxHP()}`, 230, 122, "#fff", 28);
      txt(`AT  ${atkStat()} (${ITEMS[G.weapon].atk || 0})`, 230, 170, "#fff", 28);
      txt(`DF  ${defStat()} (${ITEMS[G.armor].def || 0})`, 230, 202, "#fff", 28);
      txt(`EXP: ${G.exp}`, 430, 170, "#fff", 28);
      txt(`NEXT: ${Math.max(0, WT_TABLE[G.wt] - G.exp)}`, 430, 202, "#fff", 28);
      txt(`WEAPON: ${ITEMS[G.weapon].name}`, 230, 260, "#fff", 28);
      txt(`ARMOR:  ${ITEMS[G.armor].name}`, 230, 292, "#fff", 28);
      txt(`SCRAPS: ${G.gold}`, 230, 340, "#fff", 28);
      txt(`SPARED: ${G.spares}`, 230, 372, "#ffd84a", 26);
      if (G.kills > 0) txt(`ERASED: ${G.kills}`, 430, 372, "#ff2b45", 26);
      txt("WT = WEIGHT. what you carry.", 230, 408, "#777", 20);
    }
  }
};

/* ---------- Lint's shop ---------- */
const Shop = {
  active: false, idx: 0, msg: "", stock: [], who: "lint",
  open(stock, who = "lint", msg, bye) {
    this.active = true; this.idx = 0; this.who = who; this.bye = bye || null;
    this.stock = stock || ["starcandy", "mosstea", "patchkit", "letteropener", "hardcover"];
    this.msg = msg || "Take your time, kid. Nothing here's going anywhere. That's kind of the point.";
  },
  owned(id) { return G.weapon === id || G.armor === id || G.inv.includes(id); },
  update() {
    const n = this.stock.length + 1;
    if (Input.hit("up")) { this.idx = (this.idx + n - 1) % n; Sound.sfx("move"); }
    if (Input.hit("down")) { this.idx = (this.idx + 1) % n; Sound.sfx("move"); }
    if (Input.hit("cancel") || (Input.hit("ok") && this.idx === this.stock.length)) {
      this.active = false; Sound.sfx("back");
      Dialog.open([L(this.who, this.bye ? this.bye : this.who === "lint" ?"Come back if you lose anything! Or find anything! Same thing, really." : this.who === "lintcopy" ? "Come back soon! Or a copy of you can. Either's fine." : "Thanks for stopping by. Come back any time.")]);
      return;
    }
    if (Input.hit("ok")) {
      const id = this.stock[this.idx], it = ITEMS[id];
      const unique = it.type !== "heal";
      if (unique && this.owned(id)) { this.msg = this.who === "lint" ? "You've already got one of those. I only had the one." : "You've already got one of those."; Sound.sfx("back"); }
      else if (G.gold < it.price) { this.msg = this.who === "lint" ? "Ah... not enough scraps. I'd give it to you, but I'm a lint. I have bills." : "You don't have enough scraps for that one."; Sound.sfx("back"); }
      else if (G.inv.length >= 8) { this.msg = this.who === "lint" ? "Your pockets are full! Even I can't fit in there." : "Your pockets are full. Use or drop something first."; Sound.sfx("back"); }
      else { G.gold -= it.price; G.inv.push(id); Sound.sfx("item"); this.msg = this.who === "lint" || this.who === "lintcopy" ? pick(["Thanks! It was lost, now it's found.", "Good choice. Previous owner barely used it. Probably.", "Sold! Don't tell me if you lose it. I'll find out."]) : pick(["Thank you!", "Good choice.", "It's yours."]); }
    }
  },
  draw(t) {
    if (!this.active) return;
    ctx.fillStyle = "rgba(0,0,0,.75)"; ctx.fillRect(0, 0, CW, CH);
    frame(16, 16, CW - 32, 150);
    NPC_DRAW[this.who](90, 150, t, 5);
    drawTyped(this.msg, this.msg.length, 180, 34, 420, 26, "#fff");
    frame(16, 176, 380, 288);
    this.stock.forEach((id, i) => {
      const it = ITEMS[id], y = 196 + i * 40, sold = it.type !== "heal" && this.owned(id);
      if (i === this.idx) drawHeart(42, y + 14, "#ff2b45", 2);
      txt(`${it.price}$ - ${it.name}`, 62, y, sold ? "#666" : "#fff", 28);
    });
    if (this.idx === this.stock.length) drawHeart(42, 196 + this.stock.length * 40 + 14, "#ff2b45", 2);
    txt("Leave", 62, 196 + this.stock.length * 40, "#fff", 28);
    frame(404, 176, 220, 288);
    txt(`$ ${G.gold}`, 424, 192, "#ffd84a", 30);
    txt(`${G.inv.length}/8 items`, 424, 226, "#aaa", 24);
    if (this.idx < this.stock.length) {
      const it = ITEMS[this.stock[this.idx]];
      const d = it.type === "heal" ? `Heals ${it.heal >= 99 ? "ALL" : it.heal} HP.\n${it.desc}` : it.desc;
      drawTyped(d, d.length, 424, 270, 186, 24, "#ddd");
    }
  }
};
