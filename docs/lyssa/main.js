let debugMode = false;

title = "GROWTH WITH LASERS ";

description = `
[Hold] Growth
`;

characters = [];

options = {
  theme: "pixel",
  viewSize: { x: 200, y: 70 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 3,
};

/** {{x: number, vx: number, size: number}} */
let player;
/** {{x: number, size: number}[]} */
let enemies;
let laser;  // ADDING LASER THING
const d12 = () => Math.ceil(Math.random() * 12);
let nextEnemyDist;
const floorY = 60;

function update() {
  // initalize the game start state
  if (!ticks) {
    player = { x: 9, vx: 1, size: 5 };
    enemies = [];
    nextEnemyDist = 0;
    laser = {
      height: laserHeight(),
      counter: 0,
      flickerCounter: 0,
      colliding: false,
    }
  }
  let scr = player.x > 9 ? (player.x - 9) * 0.5 : 0; // screen scroll speed
  // debug('scr', scr);

  color("light_blue");
  rect(0, floorY, 200, 10);
  if (input.isJustPressed) {
    play("laser");
  }

  // player growth
  player.size +=
    ((input.isPressed ? 50 : 5) - player.size) *
    clamp(player.vx, 1, 999) *
    0.01;
  player.vx += (15 / player.size - 1) * 0.02 * sqrt(difficulty);
  player.x += player.vx - scr;
  if (player.x + player.size / 2 < 1) {
    end();
  }

  // draw player
  color("yellow");
  rect(0, floorY, player.x + player.size / 2, -player.size);

  nextEnemyDist -= scr;  // rightmost enemy distance away from right of screen
  if (nextEnemyDist < 0) {
    debug("new enemy");
    // enemy size
    let size = rnd() < 0.8 ? 3 : rnd(5) * rnd(5) + 3;

    if (size < 7) {
      size = 3;
    }
    enemies.push({ x: 400, size });
    // spawn new enemy every 30-50 pixels, varies on size
    nextEnemyDist += rnd(30, 50);
  }

  // laser flicker
  // counting flickers
  if (laser.counter > 60 && laser.counter % 60 === 0) {
    laser.flickerCounter += 1;
  }
  laser.counter += 1;
  
  // don't mind the magic numbers ty :')
  if (laser.flickerCounter > 3) {
    color("cyan");
    const c = rect(0, laser.height, 200, 2).isColliding.rect;
    if (c.yellow) {
      play("explosion");
      end();
    }
  } else if (laser.counter < 60 || laser.counter % 60 < 30) {  // flicker
    color("red");
    const c = rect(0, laser.height, 200, 2).isColliding.rect;
    if (c.yellow && !laser.colliding) {  // +1500 points for collision, only once
      laser.colliding = true;
      play("coin");
      addScore(1500, player.vx+player.size, laser.height);
    }
  }
  
  // next laser
  if (laser.flickerCounter > 4) {
    laser.flickerCounter = 0;
    laser.counter = 0;
    laser.colliding = false;
    laser.height = laserHeight();
  }

  // seemingly called every tick
  remove(enemies, (e) => {
    debug('remove');
    e.x -= scr;
    color(e.size > player.size ? "red" : "cyan");
    const sc = e.x > 100 ? (e.x - 100) / 300 + 1 : 1;
    const sz = e.size / sc;
    const c = rect(e.x / sc, floorY, sz, -sz).isColliding.rect;
    if (c.yellow) {
      // if collision with player
      debug('c is yellow');
      if (e.size > player.size) {
        play("explosion");
        end();
      } else {
        play(e.size < 5 ? "hit" : "powerUp");
        const ss = sqrt(e.size);
        particle(e.x, floorY - e.size / 2, ss, ss, 0, PI / 2);
        addScore(
          ceil(clamp(player.vx, 1, 999) * e.size),
          e.x,
          floorY - player.size
        );
      }
      return true;
    }
  });

  function laserHeight() {
    let height = 0;
    for (let i = 0; i < 4; ++i) {  // 4d12 anydice.com
      height += d12();
      debug('y', height);
    }
    return height;
  }
}

function debug(...text) {
  if (debugMode) {
    console.log(...text);
  }
}
