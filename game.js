let pitcher, batter, ball, bases, fielders, runners = [], lineup, currentBatter = 0;
let score = { home: 0, away: 0 }, outs = 0, inning = 1, topInning = true;
let ballMoving = false, ballHit = false, pitchAnimation = false, gamePaused = false;
let characterModel;
let settingButton, returnButton;
let settingMenu = false;

// Zoom effect variables
let zoomFactor = 1;          // Default zoom level
const maxZoom = 2;           // Maximum zoom level
let zoomState = 'none';      // Zoom states: 'none', 'batter', 'pitch', 'ball'

// Save the initial positions of the fielders
let initialFielderPositions = [];
const catchingRadius = 1000; // Radius around the ball's path where fielders can move towards it

function preload(){
  currSong = loadSound('sounds/gamesong.mp3');
  buttonSound = loadSound('sounds/buttonClick.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (currSong.isLoaded() && !currSong.isPlaying()) {
    loadVolumeSetting();
    currSong.loop();
  }

  characterModel = localStorage.getItem("confirmedPreset");

  let centerX = width / 2, centerY = height / 2;
  let baseOffset = min(width, height) / 4;

  // Bases: Home, 1st, 2nd, 3rd
  bases = [
    { x: centerX, y: centerY + baseOffset }, // Home Plate
    { x: centerX + baseOffset, y: centerY }, // 1st Base
    { x: centerX, y: centerY - baseOffset }, // 2nd Base
    { x: centerX - baseOffset, y: centerY }  // 3rd Base
  ];

  // Pitcher & Batter
  pitcher = { x: centerX, y: centerY, armAngle: 0 };
  batter = { x: centerX, y: centerY + baseOffset + 50, running: false, speed: 3, base: 0 };

  // Fielders
  fielders = [
    { x: centerX, y: centerY - baseOffset - 50 },
    { x: centerX + baseOffset, y: centerY - 50 },
    { x: centerX - baseOffset, y: centerY - 50 },
    { x: centerX + baseOffset, y: centerY + baseOffset },
    { x: centerX - baseOffset, y: centerY + baseOffset }
  ];

  // Save the initial positions of the fielders
  initialFielderPositions = fielders.map(fielder => ({ x: fielder.x, y: fielder.y }));

  // Lineup
  lineup = [batter];
  resetBall();

  settingButton = new Button("Settings", width - 80, 40, 120, 40, null, null, () => settingsClick());
  returnButton = new Button("Menu", width - 80, 40 + 40 + 10, 120, 40, null, null, () => goBack());
  createModal();
}

function draw() {
  background(50, 168, 82);

  push();
    if (zoomState === 'batter') {
      zoomOnBatter();
    } else if (zoomState === 'pitch') {
      zoomOnBatter();
    } else if (zoomState === 'ball') {
      zoomOnBall();
    } else {
      resetZoom();
    }

    drawField();
    drawPlayers();
  pop();

  push();
    // Draw scoreboard seperate from game
    drawScoreboard();
    settingButton.display();
    returnButton.display();
  pop();

  if (pitchAnimation) {
    pitcher.armAngle += 0.2;
    if (pitcher.armAngle > PI / 2) {
      pitchAnimation = false;
      ballMoving = true;
      zoomState = 'pitch'; // Keep zoom on batter during pitch
    }
  }

  if (ballMoving && !ballHit) {
    ball.y += ball.speedY;
    if (ball.y >= batter.y - 20 && abs(ball.x - batter.x) < 20) {
      ballHit = true;
      ball.speedX = random(-4, 4);
      ball.speedY = -7;
      batter.running = true;
      runners.push(batter);
      zoomState = 'ball'; // Zoom in on the ball after hit
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

  // temporary
  push();
    fill('black');
    textSize(64);
    if (characterModel) {
      textAlign(CENTER, TOP);
      text(characterModel, width / 2, 100);
    } else {
      text("Error", width / 2, 100);
    }
  pop();
  
  if (settingMenu) {
    showSettings();
  }
}


function drawField() {
  fill(255);
  bases.forEach(base => rect(base.x - 10, base.y - 10, 20, 20));
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
  fill(color);
  ellipse(player.x, player.y - 15, 20, 20);
  fill(0);
  rect(player.x - 5, player.y, 10, 20);
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
    for (let fielder of fielders) {
      if (dist(ball.x, ball.y, fielder.x, fielder.y) < 15) {
        outs++;
        resetFieldersPosition();
        if (outs >= 3) {
          nextInning();
        } else {
          resetBatter();
        }
        break;
      }
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
      zoomState = 'batter'; // Zoom in on batter when space is pressed
    }
    // Added currently for demo purposes
    if (keyCode === ESCAPE) {
      goBack();
    }
  }
  
  function resetBall() {
    ball = { x: pitcher.x, y: pitcher.y, speedY: 5, speedX: 0 };
    ballMoving = false;
    ballHit = false;
  }
  
  function resetBatter() {
    currentBatter++;
    // Recalculate dynamic positions using current window dimensions
    let centerX = width / 2;
    let centerY = height / 2;
    let baseOffset = min(width, height) / 4;
    batter = { 
      x: centerX, 
      y: centerY + baseOffset + 50, 
      running: false, 
      speed: 3, 
      base: 0 
    };
    lineup[currentBatter % lineup.length] = batter;
    
    resetBall();
    zoomState = 'none';
    zoomFactor = 1;
  }
  
  // Zoom functions
  function zoomOnBatter() {
    if (zoomFactor < maxZoom) {
      zoomFactor += 0.02;
    }
    applyZoom(batter.x, batter.y);
  }
  
  function zoomOnBall() {
    if (zoomFactor < maxZoom) {
      zoomFactor += 0.02;
    }
    applyZoom(ball.x, ball.y);
  }
  
  function applyZoom(targetX, targetY) {
    translate(width / 2, height / 2);
    scale(zoomFactor);
    translate(-targetX, -targetY);
  }
  
  function resetZoom() {
    if (zoomFactor > 1) {
      zoomFactor -= 0.05;
    }
    applyZoom(width / 2, height / 2);
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
