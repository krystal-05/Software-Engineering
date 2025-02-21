let pitcher, batter, ball, bases, fielders, runners = [];
let lineup, currentBatter = 0;
let score = { home: 0, away: 0 }, outs = 0, inning = 1, topInning = true;
let ballMoving = false, ballHit = false, pitchAnimation = false;

let initialFielderPositions = [];
const catchingRadius = 100;

let bgImage, batterGif;

function preload() {
  bgImage = loadImage('bg_baseball.jpg');
  batterGif = loadImage('BATTER.gif');
}

function setup() {
  createCanvas(800, 600);
  
  bases = [
    { x: 400, y: 470 },
    { x: 690, y: 315 },
    { x: 400, y: 290 },
    { x: 100, y: 310 }
  ];

  pitcher = { x: 400, y: 290, armAngle: 0 };
  batter = { x: 400, y: 540, running: false, speed: 3, base: 0 };

  fielders = [
    { x: 690, y: 315 },
    { x: 400, y: 290 },
    { x: 100, y: 310 },
  ];

  for (let i = 3; i < 9; i++) {
    fielders.push({
      x: random(90, 700),
      y: random(300, 350)
    });
  }

  initialFielderPositions = fielders.map(fielder => ({ x: fielder.x, y: fielder.y }));

  lineup = [batter];
  resetBall();
}

function draw() {
  background(50, 168, 82);
  image(bgImage, 0, 0, width, height);
  drawField();
  drawPlayers();
  drawScoreboard();

  if (pitchAnimation) {
    pitcher.armAngle += 0.05;
    if (pitcher.armAngle > PI / 2) {
      pitchAnimation = false;
      ballMoving = true; 
    }
  }

  if (ballMoving && !ballHit) {
    ball.y += ball.speedY;
    if (ball.y >= batter.y - 20 && abs(ball.x - batter.x) < 20) {
      ballHit = true;
      ball.speedX = random(-6, 6);
      ball.speedY = random(-10, -14);
      batter.running = true;
      runners.push(batter);
    }
  }

  if (ballHit) {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    ball.speedY += 0.2;
    moveFieldersTowardsBall();
    checkFielderCatch();
  }

  moveRunners();
}

function resetFieldersPosition() {
  fielders.forEach((fielder, index) => {
    fielder.x = initialFielderPositions[index].x;
    fielder.y = initialFielderPositions[index].y;
  });
}

function checkFielderCatch() {
  let ballCaught = false;
  for (let fielder of fielders) {
    if (dist(ball.x, ball.y, fielder.x, fielder.y) < 15) {
      outs++;
      resetFieldersPosition();
      if (outs >= 3) {
        nextInning();
      } else {
        resetBatter();
      }
      ballCaught = true;
      break;
    }
  }
}

function resetBall() {
  ball = { x: pitcher.x, y: pitcher.y, speedY: 3, speedX: 0 };
  ballMoving = false;
  ballHit = false;
}

function drawField() {
  fill(255);
  bases.forEach(base => {
    rect(base.x - 10, base.y - 10, 20, 20);
  });
  
  stroke(255);
  noFill();
  beginShape();
  bases.forEach(base => vertex(base.x, base.y));
  vertex(bases[0].x, bases[0].y);
  endShape();
}

function drawPlayers() {
  drawPlayer(pitcher, 'red');
  lineup.forEach(player => drawPlayer(player, 'blue'));
  fielders.forEach(fielder => drawPlayer(fielder, 'green'));
  fill(255);
  ellipse(ball.x, ball.y, 10, 10);
}

function drawPlayer(player, color) {
  if (player === batter) {
    image(batterGif, player.x - 40, player.y - 80, 80, 120);
  } else {
    fill(color);
    ellipse(player.x, player.y - 15, 20, 20);
    fill(0);
    rect(player.x - 5, player.y, 10 , 20);
  }
}


function drawScoreboard() {
  fill(0);
  rect(20, 20, 150, 80);
  fill(255);
  textSize(14);
  text(`Inning: ${inning} ${topInning ? '▲' : '▼'}`, 30, 40);
  text(`Score - Home: ${score.home}  Away: ${score.away}`, 30, 60);
  text(`Outs: ${outs}`, 30, 80);
}

function moveRunners() {
  runners.forEach(runner => {
    if (runner.running) {
      let targetBase = bases[(runner.base + 1) % 4];
      if (runner.x < targetBase.x) runner.x += runner.speed;
      if (runner.x > targetBase.x) runner.x -= runner.speed;
      if (runner.y < targetBase.y) runner.y += runner.speed;
      if (runner.y > targetBase.y) runner.y -= runner.speed;

      if (dist(runner.x, runner.y, targetBase.x, targetBase.y) < 5) {
        runner.base++;
        if (runner.base === 4) {
          score[topInning ? 'away' : 'home']++;
          runners = runners.filter(r => r !== runner);
          resetBatter();
        }
      }
    }
  });
}

function moveFieldersTowardsBall() {
  fielders.forEach(fielder => {
    if (isWithinCatchingArea(fielder)) {
      let angleToBall = atan2(ball.y - fielder.y, ball.x - fielder.x);
      let speed = 2;
      fielder.x += cos(angleToBall) * speed;
      fielder.y += sin(angleToBall) * speed;
    }
  });
}

function isWithinCatchingArea(fielder) {
  return dist(fielder.x, fielder.y, ball.x, ball.y) < catchingRadius;
}

function checkFielderCatch() {
  let ballCaught = false;
  for (let fielder of fielders) {
    if (dist(ball.x, ball.y, fielder.x, fielder.y) < 15) {
      outs++;
      resetFieldersPosition();
      if (outs >= 3) {
        nextInning();
      } else {
        resetBatter();
      }
      ballCaught = true;
      break;
    }
  }
  
  if (!ballCaught && (ball.x > 600 || ball.speedX > 4)) {
    score[topInning ? 'away' : 'home']++;
  }
}

function resetFieldersPosition() {
  fielders.forEach((fielder, index) => {
    fielder.x = initialFielderPositions[index].x;
    fielder.y = initialFielderPositions[index].y;
  });
}

function nextInning() {
  outs = 0;
  runners = [];
  topInning = !topInning;
  if (!topInning) inning++;
  resetBatter();
}

function keyPressed() {
  if (key === ' ' && !ballMoving) {
    pitchAnimation = true;
  }
}

function resetBall() {
  ball = { x: pitcher.x, y: pitcher.y, speedY: 5, speedX: 0 };
  ballMoving = false;
  ballHit = false;
}

function resetBatter() {
  currentBatter++;
  batter = { x: 400, y: 540, running: false, speed: 3, base: 0 };
  lineup[currentBatter % lineup.length] = batter;
  resetBall();
}
