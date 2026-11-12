"use strict";
/* ============================================================
   VOIDHEART — main loop
   ============================================================ */
const SCENES = {
  title: Title, ach: AchScene, journal: Journal, epstats: EpStats, extras: Extras, soundtest: SoundTest, rush: Rush, episodes: Episodes, epend: EpisodeEnd, intro: Intro, world: World, battle: Battle, trans: Trans, gameover: GameOver, ending: Ending
};
let last = performance.now(), clock = 0;
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000 || 0);
  last = now; clock += dt;
  if (G) G.time += dt;
  Timers.update(dt);
  Fade.update(dt);
  Toast.update(dt);
  Music.update();
  const s = SCENES[Scene.cur];
  try {
    s.update(dt);
    s.draw(clock);
  } catch (err) {
    console.error(err);
  }
  Fade.draw();
  try { Ach.update(dt); Ach.draw(); } catch (err) { console.error(err); }
  Toast.draw();
  Input.endFrame();
  requestAnimationFrame(loop);
}
Title.start();
requestAnimationFrame(loop);
