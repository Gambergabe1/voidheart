# VOIDHEART — Episode 3: THE MARGINALIA — build spec

This is the contract every Episode 3 region file is built against. Read it fully before writing. Read the existing code it points to as well: the engine is small and the existing episodes are the best examples (`js/data.js`, `js/episode1b.js`, `js/episode2.js`, `js/episode2b.js`).

## 1. The game in one paragraph
VOIDHEART is an original story RPG for the browser in the vein of classic "spare or fight" RPGs. You walk a top-down world. Random encounters and scripted bosses happen in a bullet-box battle with four buttons: FIGHT, ACT, ITEM and MERCY. Every creature can be **spared** by ACTing to give it what it needs, until its spare meter reaches 100. Killing ("erasing") gives EXP and raises **WT (Weight)**. Tone: gentle, funny, a little melancholy. The writing is specific and warm, with puns on paper, writing, libraries and broadcasting. There is no gore. Keep everything **original**: no names, characters, lines or jokes from any existing game.

## 2. The story so far
- **Episode 1, The Last Page.** MILO, a kid, falls into **the Archive**, where every forgotten thing goes. Its keeper **VANTA** (a masked, cloaked archivist; the first thing ever forgotten) guards the exit. Quill (a kind ink bottle with a feather) guides MILO.
- **Episode 2, The Underprint.** Below the Archive is the **Underprint**, where *erased* things go. **REDACT**, a clerk with a black bar over its face, was erasing the Archive. It turned out to be **SOL**, the name VANTA erased long ago. In the RESTORED ending SOL remembers itself. Erased things that someone remembers can come back as "Smudges". Mayor **STET** of Carbon Town ("stet" means "let it stand").
- **Recurring cast you may use** (sprites already exist in `NPC_DRAW`): `quill`, `vanta`, `sol` (REDACT restored, glowing), `lint`, `margin` (Old Margin, encyclopedia), `signal` (antenna kid), `ledger`, `copy` (Carbon Town copy), `gardener`, `vol13`, `juni` (new, see below), `falsenote`. Monster sprites exist for every earlier monster in `MON_DRAW`.

## 3. Episode 3 story bible
**Premise.** A month after Episode 2, MILO wakes in their bedroom in the town of **Hollowmere** on the Surface. The world is slightly wrong. There are notes in the margins of everything, in small neat handwriting, and everyone believes them: "The bakery was always closed." "It never rained on Tuesdays." And on MILO's mirror: **"MILO NEVER HAD A BEST FRIEND."**

**Juni.** MILO's best friend, **JUNI** (they/them), has been written out of existence. Nobody remembers Juni except a torn photo on MILO's desk. Finding Juni is the emotional spine of the episode:
- In Hollowmere (r1), MILO learns Juni existed.
- In the Fiction Quarter (r3), Juni is found rewritten into a storybook ("the one in the tower, with a happy ending that never included MILO"). Freeing Juni sets `G.flags.juniFound = true`.
- After that, Juni appears as a companion voice: a witness at the trial (r4), a friend to call on in the finale.

Juni is kind, stubborn, funny, loves astronomy and bad puns, and once taught MILO to whistle. Juni's sprite is `juni`, speaker key `juni`.

**The antagonist: PALIMPSEST.** When REDACT stopped erasing, it left thousands of blank pages behind. Blank pages invite writing. Rumors, wishes and unchecked stories were written on them, over and over, until the writing grew a will of its own. PALIMPSEST is a manuscript written over itself a thousand times. It now writes upward into the Surface, laying "kinder drafts" over true memories, because it learned that sad memories hurt. It isn't evil. It is a well-meaning liar. It wrote Juni out because Juni moved away last year and the goodbye hurt MILO. **That is the truth MILO must accept: Juni moved away, the goodbye was real, and the friendship was still real.** (Reveal this gradually. r1 can hint, r3 lets Juni say it, the finale confirms it.)

**The Marginalia.** PALIMPSEST's writers, four Annotators, each rule a region and are its boss. A fifth, MILO (REVISED), waits at the end:

| Boss id | Region | Who |
| --- | --- | --- |
| `rumormill` | r1 Hollowmere | **THE RUMOR MILL**, a windmill of whispers in the town square. Each sail is a rumor. Wants to be believed |
| `doodler` | r2 The Marginalia | **THE DOODLER**, a huge restless doodle that draws things into being but never finishes any of them |
| `happilyever` | r3 Fiction Quarter | **HAPPILY EVER**, a storybook royal who enforces happy endings, and keeps Juni in a tower so no story ends sadly |
| `citation` | r4 The Errata | **THE CITATION**, a judge who demands proof for every truth. It runs the trial of "MILO vs. the Record" |
| `milorevised` | r5 The Palimpsest | **MILO (REVISED)**, a kinder draft of MILO: never fell, never carried weight, never lost a friend. Says "I'm who you'd be if nothing sad had happened." |

The final boss, **PALIMPSEST**, its room `e3_heart`, the three endings and the credits are written in `js/ep3/finale.js`. Do not write them.

**The mechanic: the Pen of STET.** At the start Quill gives MILO the `stetpen` key item. **False notes** float in the world and block tiles. When MILO knows the truth (a quest done, an item found, a conversation had), they can strike the note through. Use `E3.falseNote(...)` (section 6). Every region has **2–4 false notes** used as gates, shortcuts or optional secrets. Each one must state a specific, funny or poignant lie, with a truth discovered nearby.

**Evidence.** For the trial in r4, each region awards evidence with `E3.addEvidence(key, label)`:
- r1: `photo`, "Juni's torn photo"
- r2: `firstnote`, "The first note ever written"
- r3: `juni`, "Juni's own testimony"
- r4: `record`, "The original record"
- r5: `draft`, "Every draft, layered"

That makes 5 in total. r4's Citation boss gets stronger spare progress from more evidence. Award evidence through real play (a quest, puzzle or conversation), never just lying on the floor.

**Allies and carry-over** (helpers in `E3`, section 6): `E3.vantaAlive()`, `E3.solAlly()`, `E3.stet()`, `E3.shredderSpared()`, `E3.ep1Void()`, `E3.restoredNames()`. Use them for small variations: an extra line, a cameo, a discount. Never gate required progress on them.

**Endings** (finale.js): TRUE STORY (no one erased in Episode 3, PALIMPSEST spared), REVISED (anything mixed), FICTION (everyone erased). So **every boss and monster must be spareable, and also killable.**

## 4. Your region, and the room-ID contract
Each region is one file, `js/ep3/rN_name.js`. It owns:
- its area key
- every room id with its prefix
- its monsters, NPCs, items, songs, palette and custom tiles

**Fixed link rooms.** `E3.link` connects regions with this rule:
- The **last room's right edge**, rows 5–7 (column `width-1`), must be open floor, and `(width-2, 6)` must be walkable.
- The **first room's left edge**, rows 5–7 (column 0), must be open floor, and `(1, 6)` must be walkable.
- **Do not write those two boundary exits yourself.** `E3.applyLinks()` creates them.

| Region | File | Area key | Room prefix | First room | Last room |
| --- | --- | --- | --- | --- | --- |
| r1 Hollowmere | `r1_hollowmere.js` | `hollow` | `e3h_` | `e3h_bedroom` (start; also set `E3.start`) | `e3h_gate` |
| r2 The Marginalia | `r2_marginalia.js` | `marg` | `e3m_` | `e3m_gutter` | `e3m_spine` |
| r3 Fiction Quarter | `r3_fiction.js` | `fiction` | `e3f_` | `e3f_gate` | `e3f_epilogue` |
| r4 The Errata | `r4_errata.js` | `errata` | `e3e_` | `e3e_lobby` | `e3e_chambers` |
| r5 The Palimpsest | `r5_palimpsest.js` | `palim` | `e3p_` | `e3p_scraped` | `e3p_spine` |

**Your region boss must be resolved before the player can reach your last room's right edge.** Use a corridor trigger like `ROOMS.s_clock`, or a `D` door gated on `room.puzzle = { flag: "boss_<id>" }`. The `boss_<id>` flag is truthy once resolved. A puzzle with no `order` and no runes simply opens when the flag is set.

r1 only: set `E3.start = { room: "e3h_bedroom", tx, ty, dir: "down" }`. The core's arrival scene (Quill, the Pen of STET) plays in the bedroom automatically on a new game. Don't duplicate it. r1 should start right after it.

## 5. Content targets (per region). The episode must play for a little over 2 hours
Measured with `node scripts/harness.js estimate 3`. For reference, Episode 1 estimates about 40 minutes.

- **7–9 rooms**: at least 3 with `enc: true`, at least 2 save points, 1 Lost Page, and at least 4 named NPCs.
- **5 regular monsters** in `POOLS[area]`, each with:
  - 3 ACTs of distinct personality, at least one that needs ordering or setup, and one that backfires (lowers `sp`)
  - 2 attack patterns
  - talk lines, a `spareTalk`, flavor text and a check text
  - stats: hp 90–150, atk 6–9 (r1 lower: atk 5–7), def 1–4, exp 30–60, gold 18–40
- **1 region boss** with the boss id from section 3:
  - `boss: true, bar: true, noFlee: true`, a `title`, its own `music`
  - 4+ ACTs; sparing should take about 8–12 turns, with at least one act unlocked by your region's quest or by carry-over
  - phase-based `pattern(e)`, `deathLines`, `spareLines`
  - hp 300–450, atk 7–10
- **1 puzzle** (an ordered rune puzzle via `room.puzzle`, or something cleverer built from triggers, NPCs and flags).
- **1 side quest** with 2+ steps, a reward, and a payoff line somewhere.
- **2–4 false notes** (`E3.falseNote`).
- **Dialogue: at least 6,000 characters per region** across NPCs, signs, events and the boss. Make it good:
  - short lines, each paragraph one beat
  - jokes that land; every NPC with a distinct voice
  - callbacks to Episodes 1–2 where natural
- **Music**: 1–2 `SONGS` entries.
- **Palette**: a `PAL[area]` entry plus `AREAS[area] = { name, music, sub }`.
- **Custom tiles**: optional, using your reserved characters.

## 6. Engine API reference (what you can use)
Everything is global, in plain scripts with no modules. Your file loads after the whole engine and `ep3/core.js`, and before `finale.js` and `main.js`. **Only write in your own file.** Never edit shared files. If you truly need an engine change, describe it in your final report instead.

**Dialogue.** `L(who, text, extra)` makes a line spoken by `who`. `who` must be a `SPEAKERS` key, and its portrait comes from `NPC_DRAW[who]`. Plain strings are narration and conventionally start with `"* "`. `\n` is a line break. A line can carry:
- `ch: ["Yes","No"], on: i => [...more lines]` for a choice
- `give: "itemId"` to give an item when the line is dismissed
- `after: () => {...}` to run code when it is dismissed (this ends the dialogue)

Use `Dialog.open(lines, done)` to show lines. Text box width is about 45 characters per line at 28px. Keep each line ≤ 3 visual lines, roughly ≤ 130 characters.

**Rooms.** `ROOMS.id = { area, map: [...], exits: [...], ents: [...], triggers: [...], enc?, puzzle?, noMusic? }`.
- `map` is an array of equal-length strings, 1 char = 32px tile. Usually 20–34 wide and 11–13 tall; rows 5–7 are the conventional doorway rows.
- Built-in tiles:
  - solid: `' '` void, `#` wall, `B` shelf (cabinets in office/carbon), `~` ink/hole, `T` antenna, `L` lamp
  - walkable: `.` `,` floor, `P` paper pile, `R` rug, `*` grass/doodle tufts (uses `pal.grass`, `pal.grass2`), `o` rune, `=` bridge
  - `D` door: solid until `G.flags[room.puzzle.flag]`
- **Custom tiles:** reserved characters per region:
  - r1: `1 2 3`
  - r2: `4 5 6`
  - r3: `7 8 9`
  - r4: `! ? %`
  - r5: `& $ ^`
- Define a custom tile with `TILE_DRAW[ch] = (x, y, tx, ty, pal, t, W, h) => {...}`. `h` is a stable 0–1 hash, `W.tile(tx,ty)` reads neighbours, and the floor is drawn first unless you set `TILE_DRAW[ch].floor = false`. Make it solid with `SOLID.add(ch)`.
- Exits: `{ x, y, w, h, to, tx, ty, dir }`, in tile coords. The trigger rect must be walkable tiles at an edge. The spawn `(tx,ty)` in the target must be walkable and **not inside** the target's own exit rect.
- Ents (tile coords; NPC, save, sign and deco ents are solid, items and pages are not):
  - `{k:"npc", id, sprite?, tx, ty, if?:()=>bool, talk:()=>lines}`
  - `{k:"sign", tx, ty, text:()=>lines}`
  - `{k:"save", tx, ty}`
  - `{k:"item", tx, ty, item, flag}` (`flag` is unique and marks it collected)
  - `{k:"page", tx, ty, page:"p9"}`
  - `{k:"deco", id, tx, ty, talk}`
  - `sprite` defaults to `id` and must be an `NPC_DRAW` key
- Triggers: `{ x, y, w, h, if: () => bool, run: () => {...} }`. They fire when the player's tile enters the rect. Set `World.busy = true` while a scripted scene runs, and clear it at the end.
- `room.puzzle = { flag, key, order: ["x,y", ...], wrong, done }` makes an ordered rune puzzle on `o` tiles that opens `D` tiles. See `ROOMS.e2_garden2` in `js/episode2b.js`.

**World helpers:**
- `World.fadeEnt(id)` fades out an entity.
- `World.spawn({k,id,tx,ty,alpha:0,appearing:true,talk})` spawns one.
- `World.buildEnts()` re-evaluates `if`s.
- `saveGame()`, `Toast.show(msg)`, `Sound.sfx(name)`. Names: move, select, back, hit, hurt, heal, save, dust, spare, flee, encounter, bell, item, shatter, levelup, boom, buzz, ring, warn, door, slash.

**Encounters.**
- `startEncounter(monsterId, { onEnd: res => {...} })` runs a scripted fight. `res` is `"spare" | "kill" | "flee"`.
- For a region boss use `onEnd: E3.bossEnd("rumormill", res => {...optional follow-up...})`. It records `G.flags.boss_<id>`, counts kills and spares, and returns to the world. Random encounters come from `POOLS[area]` automatically in `enc` rooms.

**Monsters.** `MONSTERS.id = {...}`. Study `js/episode2b.js` and `js/episode1b.js`, and the bosses `brasswick` (`js/data.js`), `shredder` and `redact` (`js/episode2.js`). Fields:
- `name, area, hp, atk, def, exp, gold, voice` (talk blip pitch, 100–900)
- `check`
- `intro`
- `flavor: []`, `spareFlavor`
- `talk: []`, `spareTalk`
- `acts: { "Name": e => { e.sp += N; e.reply = "bubble line"; return "* narration\n* narration"; } }`
- `pats: [{ id, col, d?, s?, word? }]`, or `pattern(e)` for phases
- optional: `talkFn(e)`, `flavorFn(e)`, `afterTurn(e, {moved})`, `canSpare(e)`, `actNames(e)` (dynamic act list), `checkFn(e)`, `onHit(e)`, `deathLines(e)`, `spareLines(e)`, `init(opts)`, `killText`

How acts work:
- `e.sp` is clamped to 0..100, and the creature is spareable at 100.
- `e.turn` counts enemy turns.
- `e.reply` overrides the next speech bubble.
- `e.nextPat` forces the next pattern.

**Patterns** (`PAT` ids): `rain flutter side aimed ring spark walls stomp blot snake letters lasers hush tiny clock gears tickrain scan moths ringwave mixed loop collapse archive stamp shred final`.
- Params: `col` (colour), `d` (density multiplier), `s` (speed multiplier), `word` (for `letters`), `start: "bottom"|"corner"`.
- You may add **new** patterns, `PAT.myname = { box:[w,h], dur, def:{col}, fn(B,S,P,dt,b){...} }`, prefixed with your region (`h_`, `m_`, `f_`, `e_`, `p_`). Copy the style of `js/patterns.js`. Bullets come from `b.spawn({x,y,vx,vy,r,col,shape})`, with shapes `orb diamond page spark bar warn laser line char heal moth gear`.

**Sprites.**
- `MON_DRAW[id] = (cx, by, t, e, u = 5) => {...}` draws a monster centered at x=`cx` with its feet at y=`by`. It must fit in about 200×200px at the default `u`, and must also look fine at small `u` (credits use `u ≈ 1.7`).
- `NPC_DRAW[key] = (cx, by, t, u = 2) => {...}` draws an overworld NPC about 24×32px at `u=2`; portraits use `u=4`.
- Use `P(cx, by, u)` (a rect painter: `R(x, y, w, h, color)` in unit coords relative to the feet), plus `txt`, `ctx`, `hash`.
- Keep sprites expressive and readable. Let `e.sp >= 100` change the look (calmer, happier).

**Items.** `ITEMS.id = { name, type: "heal"|"weapon"|"armor"|"key", heal?, atk?, def?, price?, desc }`. For a shop, use `Shop.open(stockIds, speakerKey, "opening line")` from an NPC line's `after`. Episode 3 gear progression:
- r1: weapon ATK +10, armor DEF +6
- r3: weapon ATK +14, armor DEF +10
- r5: something ATK +18 or DEF +14 as a found item

Heal items heal 20–60.

**State.** `G.flags` holds your flags; prefix them with your region (`h_`, `m_`, `f_`, `e_`, `p_`), except the shared ones (`juniFound`, `boss_<id>`). Other state: `G.inv` (max 8), `G.gold`, `G.kills`, `G.spared`, `G.killed`, `G.wt`. Use `addItem(id)` (returns false if full) and `nameOf(monsterId)`.

**Episode helpers** (`js/ep3/core.js`):
- `E3.falseNote({ flag, region, tx, ty, lie, need: () => bool, hint: [lines], truth: [lines], onStrike })` returns an ent to put in `ents`. `flag` must be unique, prefixed by region. The note only appears while `!G.flags[flag]`. It needs the `stetpen` plus `need()` to strike.
- `E3.addEvidence(key, label)`, `E3.evidence()`
- `E3.bossEnd(id, after)`
- `E3.allies()`
- `E3.vantaAlive()`, `E3.solAlly()`, `E3.stet()`, `E3.shredderSpared()`, `E3.ep1Void()`, `E3.restoredNames()`

## 7. Testing (do all of these before you report back)
```bash
node --check js/ep3/<your file>.js
node scripts/harness.js validate e3<x>_      # your prefix; must print "no problems"
node scripts/harness.js smoke e3<x>_         # every monster of yours must end "spare"
node scripts/harness.js battle <bossId>      # result "spare", note the turn count
node scripts/harness.js battle <bossId> kill # result "kill"
node scripts/harness.js trigger <roomId> 0   # run your boss/event trigger end to end
node scripts/harness.js tour 3               # your rooms reachable once neighbours exist
node scripts/harness.js estimate 3           # whole-episode estimate (others may still be stubs)
```
`validate` checks room geometry, exits, reachability, sprites, items, songs and patterns. `smoke` drives every battle with an automatic spare policy that cycles your ACTs. If one of your monsters can't be spared that way within 60 turns, an ACT probably needs a precondition hint or the logic is broken. Fix it.

Spot-check your sprites in a real browser if you can (`python -m http.server 8765`, then `http://localhost:8765`). Otherwise make sure the drawing math is simple and stays within bounds.
