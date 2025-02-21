let pitcher, batter, ball, bases, fielders, runners = [];
let lineup, currentBatter = 0;
let score = { home: 0, away: 0 }, outs = 0, inning = 1, topInning = true;
let ballMoving = false, ballHit = false, pitchAnimation = false;
let settingMenu = false;

let initialFielderPositions = [];
const catchingRadius = 100;

let bgImage, batterGif;
let settingButton, returnButton;

function preload() {
  bgImage = loadImage('assets/gamebackg.jpg');
  batterGif = loadImage('assets/temp_assets/BATTER.gif');

  currSong = loadSound('sounds/gamesong.mp3');
  buttonSound = loadSound('sounds/buttonClick.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (currSong.isLoaded() && !currSong.isPlaying()) {
    loadVolumeSetting(); // Retrieve saved volume/mute settings
    currSong.loop();
  }

  // Calculate positions based on canvas size.
  bases = [
    { x: width * 0.5,    y: height * 0.78 },   // Home plate (approx.)
    { x: width * 0.86,   y: height * 0.525 },  // 1st base
    { x: width * 0.5,    y: height * 0.48 },   // 2nd base
    { x: width * 0.125,  y: height * 0.52 }    // 3rd base
  ];

  pitcher = { x: width * 0.5, y: height * 0.48, armAngle: 0 };
  batter = { x: width * 0.5, y: height * 0.90, running: false, speed: 3, base: 0 };

  // Fielders positioned at (or near) the bases.
  fielders = [
    { x: width * 0.86, y: height * 0.525 },
    { x: width * 0.5,  y: height * 0.48 },
    { x: width * 0.125, y: height * 0.52 }
  ];

  // Additional fielders with positions calculated relative to the canvas size.
  for (let i = 3; i < 9; i++) {
    fielders.push({
      x: random(width * 0.11, width * 0.88),
      y: random(height * 0.5, height * 0.58)
    });
  }

  initialFielderPositions = fielders.map(fielder => ({ x: fielder.x, y: fielder.y }));

  lineup = [batter];
  resetBall();
  
  // Create the buttons (using your Button class)
  settingButton = new Button("Settings", width - 80, 40, 120, 40, null, null, () => settingsClick());
  returnButton = new Button("Menu", width - 80, 90, 120, 40, null, null, () => goBack());
  createModal();
}

function draw() {
  background(50, 168, 82);
  image(bgImage, 0, 0, width, height);
  // Draw the game elements (field, players, ball)
  push();
    drawField();
    drawPlayers();
  pop();
  
  // Draw the HUD (scoreboard and buttons)
  push();
    drawScoreboard();
    settingButton.display();
    returnButton.display();
  pop();
  
  // Game logic: pitching, ball movement, etc.
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
  
  // Score if no catch and ball goes out of bounds or is hit hard.
  if (!ballCaught && (ball.x > width * 0.75 || abs(ball.speedX) > 4)) {
    score[topInning ? 'away' : 'home']++;
  }
}

function resetBall() {
  ball = { x: pitcher.x, y: pitcher.y, speedY: 5, speedX: 0 };
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
    rect(player.x - 5, player.y, 10, 20);
  }
}

function drawScoreboard() {
  fill(0);
  rect(20, 20, 190, 90);
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

function resetBatter() {
  currentBatter++;
  batter = { x: width * 0.5, y: height * 0.90, running: false, speed: 3, base: 0 };
  lineup[currentBatter % lineup.length] = batter;
  resetBall();
  resetFieldersPosition();
}

function loadVolumeSetting() {
  const savedVolume = localStorage.getItem("volume");
  const savedMute = localStorage.getItem("isMuted");

  if (savedVolume !== null) {
    currVolume = parseFloat(savedVolume);
  }
  if (savedMute !== null) {
    let isMuted = savedMute === "true";
    if (currSong) {
      currSong.setVolume(isMuted ? 0 : currVolume);
    }
  }
}

function mousePressed() {
  if (!settingMenu) {  
    if (settingButton.isHovered()) {
      buttonClick();
      setTimeout(() => settingButton.action(), 200);
    }
    if (returnButton.isHovered()) {
      buttonClick();
      setTimeout(() => returnButton.action(), 200);
    }
  }
}

function settingsClick() {
  settingMenu = true;
  showSettings();
}
function buttonClick() {
  buttonSound.play();
}

// Added currently for demo purposes
function goBack() {
  window.location.href = "index.html";
}