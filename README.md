# VOIDHEART

A story-driven RPG for the browser about what happens to the things the world forgets.

MILO falls into **the Archive**, a vast library under reality where every forgotten thing ends up. Every creature there can be fought, or understood and spared. Your choices carry from episode to episode, and the Archive remembers you between playthroughs.

**Play it:** https://gambergabe1.github.io/voidheart/

## Episodes
| Episode | Title | Status |
| --- | --- | --- |
| 1 | The Last Page | Playable · 3 endings |
| 2 | The Underprint | Playable · 2 endings |
| 3 | The Marginalia | Playable · 3 endings · about 2.5–3.5 hours |

## Episode 3 at a glance
- Five regions: Hollowmere, The Marginalia, The Fiction Quarter, The Errata and The Palimpsest, plus the finale
- 43 rooms, 25 new creatures, 6 bosses, 5 puzzles, 5 side quests
- The Pen of STET: strike lies through once you know the truth
- Evidence for a courtroom trial, and a search for MILO's best friend, Juni
- Carries over your choices from Episodes 1 and 2

## Testing
`scripts/harness.js` runs the game headlessly in Node:

```bash
node scripts/harness.js validate      # rooms, exits, reachability, sprites, songs
node scripts/harness.js smoke         # every battle, spared automatically
node scripts/harness.js estimate 3    # scripted playthrough and playtime estimate
```

## Controls
| Key | Action |
| --- | --- |
| Arrows / WASD | Move |
| Z / Enter | Confirm, interact |
| X / Shift | Cancel (hold to walk faster, or move the soul slowly in battle) |
| C | Menu |
| M | Mute |
| F | Fullscreen |

Touch controls appear automatically on phones and tablets.

## Running locally
No build step. Serve the folder with any static server, for example:

```bash
python -m http.server 8765
```

then open http://localhost:8765.
