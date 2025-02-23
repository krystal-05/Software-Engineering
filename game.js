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

  fielders.forEach(fielder => {
    fielder.state = "idle";
  });
  
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
  
  if (ballMoving && !ballHit && !ball.throwing) {
    ball.y += ball.speedY;
    if (ball.y >= batter.y - 20 && abs(ball.x - batter.x) < 20) {
      ballHit = true;
      ball.inAir = true;
      let xPower = windowWidth / 200;
      let yPower = windowHeight / 200;
      ball.speedX = random(-xPower * 0.8, xPower * 0.8);
      ball.speedY = random(-yPower * 4.5, -yPower * 4.0);
      batter.running = true;

      runners.push(batter);
      ball.advancingRunner = batter;
      batter = null;
    }
  }

  if (ballHit && !ball.throwing) {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    let gravity = windowHeight / 3000;  // base gravity value
    
    if (ball.speedY < 0) {
      ball.speedY += gravity;
    } else {
      
      let horizontalDistance = ball.x - pitcher.x;
      let maxDistance = windowWidth * 0.6; 
    
      let targetY = lerp(windowHeight * 0.5, windowHeight * 0.3, horizontalDistance / maxDistance);
      targetY = constrain(targetY, windowHeight * 0.3, windowHeight * 0.5);
      
      if (ball.y < targetY) {
        ball.speedY += gravity;
      } else {
        ball.y = lerp(ball.y, targetY, 0.1);
        ball.speedY *= 0.9;

        if (abs(ball.y - targetY) < 5) {
          ball.inAir = false;
        }  
      }
    }
    
    ball.speedX *= 0.98;
    
    if (abs(ball.speedX) < 0.5 && abs(ball.speedY) < 0.5) {
      ball.speedX = 0;
      ball.speedY = 0;
    }
    
    moveFieldersTowardsBall();
    checkFielderCatch();
  }

  if (ball.throwing) {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    let targetFielder = ball.targetFielder;
    let advancingRunner = ball.advancingRunner;
    if (!advancingRunner) {
      console.error("No advancing runner found! line 156");
      return;
    }
    let targetBase = bases[(advancingRunner.base + 1) % 4];
    
    let safeThreshold = 30;  // adjust as needed for your game scale
    if (targetFielder && dist(ball.x, ball.y, targetFielder.x, targetFielder.y) < 15) {
      // Only record an out if the advancing runner is still far from the locked-in target base.
      if (advancingRunner.safe || dist(advancingRunner.x, advancingRunner.y, targetBase.x, targetBase.y) <= safeThreshold) {
        console.log("Ball hit base " + ((advancingRunner.base + 1) % 4) + " - Runner is safe!");
      } else {
        outs++;
        console.log("Ball hit base " + ((advancingRunner.base + 1) % 4) + " - Runner is out! Total outs: " + outs);
        runners = runners.filter(runner => runner !== advancingRunner);
      }
      resetFieldersPosition();
      ball.throwing = false;
      resetBall();
      if (outs >= 3) {
        nextInning();
      } else {
        resetBatter();
      }
    }
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
  for (let fielder of fielders) {
    if ((fielder.state === "idle" || fielder.state === "running") && 
         dist(ball.x, ball.y, fielder.x, fielder.y) < 15) {
      // Fielder catches the ball:
      fielder.state = "hasBall";
      
      if (ball.inAir) {
        // In-air catch
        handleThrow(fielder);
      } else {
        // Ground catch
        let advancingRunner = ball.advancingRunner; 
        if (!advancingRunner) {
          console.error("No advancing runner found for ground catch");
          return;
        }
        let targetFielder = getClosestFielderToBase(advancingRunner);
        if (targetFielder) {
          handleGroundThrow(fielder, targetFielder);
        }
      }
      return;
    }
  }
  
  if (ball.x > width * 0.75 || abs(ball.speedX) > 4) {
    score[topInning ? 'away' : 'home']++;
  }
}

function resetBall() {
  ball = { 
    x: pitcher.x, 
    y: pitcher.y, 
    speedY: 5, 
    speedX: 0, 
    throwing: false,
    inAir: false,
    advancingRunner: null 
  };
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

  runners.forEach(runner => {
    image(batterGif, runner.x - 40, runner.y - 80, 80, 120);
  });

  if (batter) {
    image(batterGif, batter.x - 40, batter.y - 80, 80, 120);
  }

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
        console.log("Runner safe at base " + ((runner.base + 1) % 4));
        runner.base++;
        if (runner === ball.advancingRunner) {
          runner.safe = true;
        }
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
    if (fielder.state === "idle" || fielder.state === "running") {
      if (isWithinCatchingArea(fielder)) {
        // Set state to running if not already
        fielder.state = "running";
        let angleToBall = atan2(ball.y - fielder.y, ball.x - fielder.x);
        let speed = 2;
        fielder.x += cos(angleToBall) * speed;
        fielder.y += sin(angleToBall) * speed;
      }
    }
  });
}

function isWithinCatchingArea(fielder) {
  return dist(fielder.x, fielder.y, ball.x, ball.y) < catchingRadius;
}

function getClosestFielderToBase(runner) {
  if (!runner) {
    console.error("getClosestFielderToBase received a null runner");
    return null;
  }
  let targetBase = bases[(runner.base + 1) % 4];
  let closest = null;
  let minDist = Infinity;
  for (let fielder of fielders) {
    let d = dist(fielder.x, fielder.y, targetBase.x, targetBase.y);
    if (d < minDist) {
      minDist = d;
      closest = fielder;
    }
  }
  return closest;
}

function handleGroundThrow(catcher, targetFielder) {
  let advancingRunner = ball.advancingRunner;
  if (!advancingRunner) {
    console.error("No advancing runner found in handleGroundThrow");
    return;
  }
  let targetBase = bases[(advancingRunner.base + 1) % 4];
  
  ball.x = catcher.x;
  ball.y = catcher.y;
  
  let dx = targetFielder.x - catcher.x;
  let dy = targetFielder.y - catcher.y;
  let magnitude = sqrt(dx * dx + dy * dy);
  
  ball.speedX = (dx / magnitude) * 10;
  ball.speedY = (dy / magnitude) * 10;

  ball.targetFielder = targetFielder;
  ball.targetBase = targetBase;

  catcher.state = "throwing";
  ball.throwing = true;
}


function handleThrow(catcher) {
  let advancingRunner = ball.advancingRunner;
  if (!advancingRunner) {
    console.error("No advancing runner found in handleThrow");
    return;
  }
  let targetBase = bases[(advancingRunner.base + 1) % 4];
  let targetFielder = getClosestFielderToBase(advancingRunner);
  if (!targetFielder) return;
  
  ball.x = catcher.x;
  ball.y = catcher.y;
  
  let dx = targetFielder.x - catcher.x;
  let dy = targetFielder.y - catcher.y;
  let magnitude = sqrt(dx * dx + dy * dy);
  
  ball.speedX = (dx / magnitude) * 10;
  ball.speedY = (dy / magnitude) * 10;
  
  ball.targetFielder = targetFielder;
  ball.targetBase = targetBase;

  catcher.state = "throwing";
  ball.throwing = true;
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
  if (!batter) {
    batter = { x: width * 0.5, y: height * 0.90, running: false, speed: 3, base: 0 };
    lineup[currentBatter % lineup.length] = batter;
    currentBatter++; // advance to the next batter if desired
  }
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