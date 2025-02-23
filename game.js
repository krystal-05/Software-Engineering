let pitcher, batter, ball, bases, fielders, runners = [];
let lineup, currentBatter = 0;
let score = { home: 0, away: 0 }, outs = 0, inning = 1, topInning = true;
let ballMoving = false, ballHit = false, pitchAnimation = false;
let settingMenu = false;
let showOutPopup = false, ballCaughtThisFrame = false;
let outPopupTime = 0;

let initialFielderPositions = [];
const catchingRadius = 100;

let bgImage, batterGif;
let settingButton, returnButton;

function preload() {
  bgImage = loadImage('assets/gamebackg.jpg');
  batterGif = loadImage('assets/temp_assets/BATTER.gif');
  fielderIdleGif = loadImage('assets/temp_assets/IDLE1.gif');
  runnerRunningGif = loadImage('assets/temp_assets/RRUNGIF.gif');
  fielderRunningGif = loadImage('assets/temp_assets/LRUNGIF.gif');
  runnerIdle = loadImage('assets/temp_assets/sprites/01_idle2.png');
  catcherImg = loadImage('assets/temp_assets/sprites/01_Catch.png');

  currSong = loadSound('sounds/gamesong.mp3');
  buttonSound = loadSound('sounds/buttonClick.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  canvas.getContext('2d', { willReadFrequently: true });

  if (currSong.isLoaded() && !currSong.isPlaying()) {
    loadVolumeSetting();
    currSong.loop();
  }

  // Calculate positions based on canvas size
  bases = [
    { x: width * 0.5,    y: height * 0.78 },   // Home plate
    { x: width * 0.86,   y: height * 0.525 },  // 1st base
    { x: width * 0.5,    y: height * 0.48 },   // 2nd base
    { x: width * 0.125,  y: height * 0.52 }    // 3rd base
  ];

  pitcher = { x: width * 0.5, y: height * 0.50, armAngle: 0 };
  batter = {
    x: width * 0.5,
    y: height * 0.80,
    running: false,
    speed: 4,
    base: 0,
    safe: false,
    backtracking: false
  };
  catcherPlayer = { x: width * 0.5, y: height * 0.85, state: "idle", isCatcher: true };

  // Fielders positioned at (or near) the bases
  fielders = [
    { x: width * 0.86, y: height * 0.525, isInfielder: true },
    { x: width * 0.5,  y: height * 0.48,  isInfielder: true },
    { x: width * 0.125, y: height * 0.52,  isInfielder: true }
  ];
  
  // Additional fielders (non-infielders)
  for (let i = 3; i < 9; i++) {
    fielders.push({
      x: random(width * 0.11, width * 0.88),
      y: random(height * 0.5, height * 0.58),
      isInfielder: false
    });
  }
  

  initialFielderPositions = fielders.map(fielder => ({ x: fielder.x, y: fielder.y }));

  lineup = [batter];
  resetBall();

  fielders.forEach(fielder => {
    fielder.state = "idle";
  });
  
  settingButton = new Button("Settings", width - 80, 40, 120, 40, null, null, () => settingsClick());
  returnButton = new Button("Menu", width - 80, 90, 120, 40, null, null, () => goBack());
  createModal();
}

function draw() {
  background(50, 168, 82);
  image(bgImage, 0, 0, width, height);
  ballCaughtThisFrame = false;

  // Draw the game elements (field, players, ball)
  push();
    drawField();
    drawPlayers();
  pop();
  
  // Draw the HUD
  push();
    drawScoreboard();
    settingButton.display();
    returnButton.display();
  pop();

  push();
  if (showOutPopup) {
    drawOutPopup();
  }
  pop();
  // Game logic
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

    runners.forEach(runner => {
      runner.running = true;
    });
    runners.push(batter);
    ball.advancingRunner = batter;
    batter = null;
    }
  }

  if (ballHit && !ball.throwing) {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    let gravity = windowHeight / 3000;
    
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

        if (abs(ball.y - targetY) < 15) {
          ball.inAir = false;
        }  
      }
    }
    
    ball.speedX *= 0.98;
    
    if (abs(ball.speedX) < 0.3 && abs(ball.speedY) < 0.3) {
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
    let targetRunner = getNearestUnsafedRunner(targetFielder);

    let chosenRunner = targetRunner || advancingRunner;

    if (!advancingRunner) {
      advancingRunner = targetRunner;
    }

    if (!chosenRunner) {
      console.error("No valid runner found! Stopping play.");
      ball.throwing = false;
      resetBall();
      resetBatter();
      resetFieldersPosition();
      return;
    }
    
    if (targetFielder && dist(ball.x, ball.y, targetFielder.x, targetFielder.y) < 15) {
      console.log(`Fielder targeting base ${chosenRunner.base + 1} catches the ball`);
      ball.throwing = false;
  

      if (targetFielder.isInfielder) {
        let runnerAtFielderBase = runners.find(runner => runner.base === chosenRunner.base);
        let baseVal = chosenRunner.base;

        let forwardFielder = getFielderForBase(baseVal + 1);
        let backtrackFielder = getFielderForBase(baseVal);

        if (runnerAtFielderBase && !runnerAtFielderBase.safe) {
          if (!runnerAtFielderBase.backtracking && forwardFielder === targetFielder) {
            outs++;
            console.log("outs to", outs);
            runners = runners.filter(r => r !== runnerAtFielderBase);
            if (outs >= 3) {
              nextInning();
              return;
            }
            return;
          } else if (runnerAtFielderBase.backtracking && backtrackFielder === targetFielder) {
            outs++;
            console.log("outs to", outs);
            runners = runners.filter(r => r !== runnerAtFielderBase);
            if (outs >= 3) {
              nextInning();
              return;
            }
            return;
          }
        }
      }

      if (outs >= 3) {
          nextInning();
          return;
      }
  
      let targetRunner = getNearestUnsafedRunner(targetFielder);
      if (targetRunner) {
          console.log(`Throwing to next unsafe runner to base ${targetRunner.base + 1}`);
          handleGroundThrow(targetFielder);
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
    fielder.state = "idle";
  });
}

function resetInfielders() {
  for (let i = 0; i < fielders.length; i++) {
    if (fielders[i].isInfielder) {
      fielders[i].x = initialFielderPositions[i].x;
      fielders[i].y = initialFielderPositions[i].y;
      fielders[i].state = "idle";
    }
  }
}


function checkFielderCatch() {
  if (ballCaughtThisFrame) return;
  if (ball.caught) return;

  if (catcherPlayer && dist(ball.x, ball.y, catcherPlayer.x, catcherPlayer.y) < 15) {
    catcherPlayer.state = "hasBall";
    
    if (ball.inAir) {
      handleThrow(catcherPlayer);
    } else {
      handleGroundThrow(catcherPlayer);
    }
    ballCaughtThisFrame = true;
    return;
  }

  for (let fielder of fielders) {
    if ((fielder.state === "idle" || fielder.state === "running") && 
         dist(ball.x, ball.y, fielder.x, fielder.y) < 15) {
      // Fielder catches the ball:
      fielder.state = "hasBall";
      resetInfielders();
      if (ball.inAir) {
        // In-air catch
        handleThrow(fielder);
      } else {
        // Ground catch
        handleGroundThrow(fielder);
      }
      ballCaughtThisFrame = true;
      return;
    }
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
  runners.forEach(runner => {
    runner.safe = false;
  });
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
  fielders.forEach(fielder => {
    if (fielder.state === "running") {
      image(fielderRunningGif, fielder.x - 40, fielder.y - 80, 80, 120);
    } else {
      image(fielderIdleGif, fielder.x - 40, fielder.y - 80, 80, 120);
    }
  });

  runners.forEach(runner => {
    if (runner.running) {
      image(runnerRunningGif, runner.x - 40, runner.y - 80, 80, 120);
    } else {
      image(runnerIdle, runner.x - 40, runner.y - 80, 80, 120);
    }
  });

  drawPlayer(pitcher, 'red');

  if (batter) {
    image(batterGif, batter.x - 40, batter.y - 80, 80, 120);
  }
  
  drawPlayer(catcherPlayer, 'blue');

  fill(255);
  ellipse(ball.x, ball.y, 10, 10);
}

function drawPlayer(player, color) {
   
  if (player === pitcher) {
    image(fielderIdleGif, player.x - 40, player.y - 80, 80, 120);
    return;
  }
  if (player === batter) {
    image(batterGif, player.x - 40, player.y - 80, 80, 120);
    return;
  }
  if (player === catcherPlayer) {
    image(catcherImg, player.x - 40, player.y - 80, 80, 120);
    return;
  }
  fill(color);
  ellipse(player.x, player.y - 15, 20, 20);
  fill(0);
  rect(player.x - 5, player.y, 10, 20);
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
  runners = runners.filter(runner => {
    if (runner.running) {
      let targetIndex = runner.base + 1;
      if (runner.backtracking) {
        targetIndex = runner.base; 
      }
      let targetBase = bases[targetIndex % 4];

      if (runner.x < targetBase.x) runner.x += runner.speed;
      if (runner.x > targetBase.x) runner.x -= runner.speed;
      if (runner.y < targetBase.y) runner.y += runner.speed;
      if (runner.y > targetBase.y) runner.y -= runner.speed;

      if (dist(runner.x, runner.y, targetBase.x, targetBase.y) < 5) {
        runner.x = targetBase.x;
        runner.y = targetBase.y;

        if (runner.backtracking) {
          runner.running = false;
          runner.backtracking = false;
          runner.safe = true;
        } else {
          runner.base++;
          if (runner.base >= 4) {
            score[topInning ? 'away' : 'home']++;
            console.log(`Runner scored! Updated Score - Home: ${score.home}, Away: ${score.away}`);
            return false;
          } else {
            runner.running = false;
            runner.safe = true;
            console.log(`Runner reached base ${runner.base} and is holding.`);
          }
        }
      }
    }
    return true;
  });
}

function moveFieldersTowardsBall() {
  let closestFielder = null;
  let minDistance = Infinity;

  for (let fielder of fielders) {
    let d = dist(fielder.x, fielder.y, ball.x, ball.y);
    if (d < minDistance) {
      minDistance = d;
      closestFielder = fielder;
    }
  }

  if (closestFielder) {
    let angleToBall = atan2(ball.y - closestFielder.y, ball.x - closestFielder.x);
    let speed = 2;

    let newX = closestFielder.x + cos(angleToBall) * speed;
    let newY = closestFielder.y + sin(angleToBall) * speed;

    if ((closestFielder.y <= height * 0.42) && (ball.y <= height * 0.42)) { 
      newY = closestFielder.y; // Stop moving up/down
    }

    closestFielder.x = newX;
    closestFielder.y = newY;

    if (dist(closestFielder.x, closestFielder.y, ball.x, ball.y) > 15) {
      closestFielder.state = "running";
    } else {
      closestFielder.state = "idle";
    }
  }

  fielders.forEach(fielder => {
    if (fielder !== closestFielder) {
      let d = dist(fielder.x, fielder.y, ball.x, ball.y);
      if (d > catchingRadius) {
        fielder.state = "idle";
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

function handleGroundThrow(catcher) {
  ball.throwingFielder = catcher;
  ball.wasAirCatch = false;

  let advancingRunner = ball.advancingRunner;
  if (!advancingRunner) {
      console.error("No advancing runner found for ground throw!");
      return;
  }

  let unsafeRunners = runners.filter(runner => !runner.safe);

  if (unsafeRunners.length > 0) {
    throwToNextRunner(catcher);
    return;
  }

  console.log("No unsafe runners left, resetting the play.");
  resetBall();
  resetBatter();
  resetFieldersPosition();
}


function handleThrow(catcher) {
  ball.throwingFielder = catcher;
  ball.wasAirCatch = true;
  ball.caught = true;

  let batterOut = ball.advancingRunner;
  if (batterOut) {
      console.log("Air catch");
      runners = runners.filter(runner => runner !== batterOut);
      if (!showOutPopup) {
        outs++;
      }
      console.log(`outs to ${outs}`);
      if (outs >= 3) {
      setTimeout(() => {
        nextInning();
      }, 50);
      }
  } else {
      console.error("No advancing runner found for air catch!");
      return;
  }

  let runnerFirstToSecond = runners.find(r => r.base === 1 && r.running);
  if (runnerFirstToSecond) {
    runnerFirstToSecond.backtracking = true;
  }

  // Check for any remaining unsafe runners
  let unsafeRunners = runners.filter(runner => !runner.safe);

  if (unsafeRunners.length > 0) {
    throwToNextRunner(catcher);
    return;
  }

  // If no unsafe runners left, reset the play
  console.log("No unsafe runners left, resetting the play.");
  resetBall();
  resetBatter();
  resetFieldersPosition();
}

function throwToNextRunner(currentFielder) {
  let nextRunner = getNearestUnsafedRunner(currentFielder);
  if (!nextRunner) {
      console.log("No more unsafe runners left.");
      resetBatter();
      return;
  }

  let tBase = nextRunner.base;
  const targetBaseIndex = nextRunner.backtracking ? tBase : (tBase + 1) % 4;

  let targetBase = bases[targetBaseIndex];
  let targetFielder = getFielderForBase(targetBaseIndex);
   
  if (!nextRunner.safe && targetFielder === currentFielder && !nextRunner.backtracking) {
    outs++;
    console.log("outs is now", outs);
    runners = runners.filter(r => r !== nextRunner);
    if (outs >= 3) {
      nextInning();
      return;
    }
    handleGroundThrow(targetFielder);
    return;
  }

  nextRunner = getNearestUnsafedRunner(currentFielder);
  if (!nextRunner) {
      console.log("No more unsafe runners left.");
      resetBatter();
      return;
  }
  if (!targetFielder) {
      console.log("targetfielder returned null");
      targetFielder = getClosestFielderToBase(nextRunner);
  }

  // Set ball trajectory to throw to the next fielder
  ball.x = currentFielder.x;
  ball.y = currentFielder.y;

  let dx = targetFielder.x - currentFielder.x;
  let dy = targetFielder.y - currentFielder.y;
  let magnitude = sqrt(dx * dx + dy * dy);

  ball.speedX = (dx / magnitude) * 10;
  ball.speedY = (dy / magnitude) * 10;

  ball.targetFielder = targetFielder;
  ball.targetBase = targetBase;
  ball.throwing = true;
  currentFielder.state = "throwing";
}

function getNearestUnsafedRunner(catcher) {
    let targetRunner = null;
    let minDistance = Infinity;
    for (let runner of runners) {

        if (runner.safe || !runner.running) {
            continue;
        }
        if (!runners.includes(runner)) { continue; }
      
        let targetBaseIndex = (runner.base + 1) % bases.length;
        let targetBase = bases[targetBaseIndex];
        let d = dist(catcher.x, catcher.y, targetBase.x, targetBase.y);
        if (d < minDistance) {
            minDistance = d;
            targetRunner = runner;
        }
    }
    return targetRunner;
}


function getFielderForBase(baseIndex) {
  // Map: base 1 → fielders[0], base 2 → fielders[1], base 3 → fielders[2]
  if (baseIndex === 0 || baseIndex === 4) return catcherPlayer;
  if (baseIndex === 1) return fielders[0];
  if (baseIndex === 2) return fielders[1];
  if (baseIndex === 3) return fielders[2];
  return null;
}

function nextInning() {
  outs = 0;
  runners = [];
  resetFieldersPosition()
  if (!topInning) inning++;
  topInning = !topInning;
  

  showOutPopup = true;
  outPopupTime = millis();

  setTimeout(() => {
    showOutPopup = false;
    runners = [];
    resetBatter();
  }, 1500);
}

function keyPressed() {
  if (key === ' ' && !ballMoving) {
    pitchAnimation = true;
  }
}

function resetBatter() {
  if (!batter) {
    batter = {
      x: width * 0.5,
      y: height * 0.80,
      running: false,
      speed: 4,
      base: 0,
      safe: false,
      backtracking: false
    };
    lineup[currentBatter % lineup.length] = batter;
    currentBatter++;
  }
  resetBall();
  resetFieldersPosition();
}

function drawOutPopup() {
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(64);
  text("3 Outs!\nSwitching Sides", width / 2, height * 0.2);
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