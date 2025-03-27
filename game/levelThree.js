function preload() {
    bgSideImage = loadImage('assets/field3.png');
    bgTopImage = loadImage('assets/flat_field1.png');
    batterGif = loadImage('assets/temp_assets/BATTER.gif');
    fielderIdleGif = loadImage('assets/temp_assets/IDLE1.gif');
    runnerRunningGif = loadImage('assets/temp_assets/RRUNGIF.gif');
    fielderRunningGif = loadImage('assets/temp_assets/LRUNGIF.gif');
    runnerIdle = loadImage('assets/temp_assets/sprites/01_idle2.png');
    catcherImg = loadImage('assets/temp_assets/sprites/01_Catch.png');
    ballImg = loadImage('assets/Baseball1.png');

    currSong = loadSound('sounds/gamesong.mp3');
    soundEffects["buttonSound"] = loadSound('sounds/buttonClick.mp3');
    soundEffects["hitBall"] = loadSound('sounds/baseballBatHitBall.mp3'); 
    audio1 = loadSound('sounds/gamesong.mp3');
    audio2 = loadSound('sounds/audio2.mp3');
    audio3 = loadSound('sounds/audio3.mp3');
    audio4 = loadSound('sounds/audio4.mp3');
    audio5 = loadSound('sounds/audio5.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    hitZoneWidth = windowWidth * 0.05;
    hitZoneHeight = windowHeight * 0.04;
    catchDistance = windowWidth * 0.015;
    groundDistance = windowWidth * 0.005;
    runnerProximity = windowWidth * 0.01;
    strikeCatchThreshold = windowWidth * 0.01;

    canvas.getContext('2d', { willReadFrequently: true });

    loadVolumeSetting();
    if (!currSong.isPlaying()) {
        currSong.play();
        currSong.loop();
    }

    // Calculate positions based on canvas size
    bases = [
        { x: width * 0.5, y: height * 0.88 },   // Home plate
        { x: width * 0.91, y: height * 0.52 },  // 1st base
        { x: width * 0.5, y: height * 0.45 },   // 2nd base
        { x: width * 0.09, y: height * 0.52 }    // 3rd base
    ];

    pitcher = { x: width * 0.5, y: height * 0.50, armAngle: 0 };
    let transformedPitcher = sideToTopDown(pitcher.x, pitcher.y);
    topDownCamera = {
        worldAnchor: { x: transformedPitcher.x, y: transformedPitcher.y },
        screenAnchor: { x: width * 0.5, y: height * 0.73 },
        scaleX: .275,
        scaleY: .85
    };

    ball = {
        x: pitcher.x,
        y: pitcher.y,
        speedY: 430,
        speedX: 0,
        throwing: false,
        inAir: false,
        advancingRunner: null,
        strikePitch: false,
        initialSpeedY: 0,
        crossedGround: false
    };

    batter = {
        x: width * 0.5,
        y: height * 0.90,
        running: false,
        speed: 300,
        base: 0,
        safe: false,
        backtracking: false
    };

    umpire = { 
      x: width * 0.20, 
      y: height * 0.70, 
      armRaised: false, 
      armTimer: 0
    };

    catcherPlayer = { x: width * 0.5, y: height * 0.95, state: "idle", isCatcher: true };

    // Fielders positioned at (or near) the bases
    fielders = generateFielders();


    initialFielderPositions = fielders.map(fielder => ({ x: fielder.x, y: fielder.y }));

    lineup = [batter];
    resetBall();

    fielders.forEach(fielder => {
        fielder.state = "idle";
    });

    settingButton = new Button("Settings", width - 80, 40, 120, 40, null, null, () => settingsClick());
    returnButton = new Button("Menu", width - 80, 90, 120, 40, null, null, () => returnToMenu());
    tempSwapPerspective = new Button("Perspective", width - 80, 140, 120, 40, null, null, () => togglePerspective());
    audioButton = new Button("Audio", width - 80, 190, 120, 40, null, null, () => audioClick());
    createModal();
    createAudioMenu();
    inputEnabled = true;
}

function draw() {
    updateUmpire();
    ballCaughtThisFrame = false;
    let dt = deltaTime / 1000;
    dt = min(dt, 0.05);
    accumulator += dt;

    push();
    if (currentPerspective === "topDown") {
        image(bgTopImage, 0, 0, width, height);
        drawTopDownField();
        drawTopDownPlayers();
    }
    else {
        // batter-view
        image(bgSideImage, 0, 0, width, height);
        drawField();
        drawPlayers();
        // draw hitzone
        if (batter) {
            stroke(255, 0, 0);
            strokeWeight(2);
            noFill();
            rectMode(CENTER);
            rect(batter.x, batter.y - 15, 30, 20);
        }
    }
    
    pop();

    // pitch skill-ckeck
    if (pitchSkillCheckActive) {
        drawSkillCheckBar(dt);
    }

    // Draw the HUD
    push();
    drawScoreboard();
    settingButton.display();
    returnButton.display();
    tempSwapPerspective.display();
     if (DEBUG === true){
        audioButton.display();
         }
    pop();

    push();
    if (showOutPopup) {
        drawOutPopup();
    }
    pop();
    if (DEBUG) {
        push();
        stroke(255, 0, 0);  // red, for visibility
        strokeWeight(2);
        line(10, height * 0.4, width, height * 0.4);
        pop();
    }
    
    drawPopup();

    // Game logic
    while (accumulator >= fixedDt) {
        if (pitchAnimation) {
            pitcher.armAngle += 0.1 * 60 * fixedDt;
            if (pitcher.armAngle > PI / 2) {
                pitchAnimation = false;
                ballMoving = true;
            }
        }

        if (ballMoving && !ballHit && !ball.throwing) {
            ball.y += ball.speedY * fixedDt;
            if (ball.y >= batter.y && abs(ball.x - batter.x) < hitZoneWidth && !swingAttempt) {
                ball.strikePitch = true;
                swingAttempt = true;

                strikes++;
                handleStrikeCall();
                if (DEBUG) console.log("No swing! Strike " + strikes);
            }
        }

        if (ballMoving && !ball.throwing) {
            if (ballHit) {
                ball.x += ball.speedX * fixedDt;
                ball.y += ball.speedY * fixedDt;

                let gravity = windowHeight * 1.2;
                if (ball.speedY < 0) {
                    ball.speedY += gravity * fixedDt;
                } else {
                    let timeOfFlight = (2 * abs(ball.initialSpeedY)) / gravity;
                    let maxDistance = windowWidth * 0.6;
                    let horizontalDistance = horizontalTravel = ball.speedX * timeOfFlight;
                    let t = horizontalDistance / maxDistance;

                    let targetY = lerp(windowHeight * 0.42, windowHeight * 0.3, constrain(t, 0, 1)); 
                    if (t > 1) {
                        targetY = windowHeight * 0.3 - (t - 1) * (windowHeight * 0.1); 
                    }
                    targetY = constrain(targetY, windowHeight * 0.1, windowHeight * 0.25);

                    if (ball.y < targetY) {
                        ball.speedY += gravity * fixedDt;
                    } else {
                        ball.y = lerp(ball.y, targetY, 0.1);
                        ball.speedY *= 0.9;

                        if (abs(ball.y - targetY) < catchDistance) {
                            ball.inAir = false;
                        }
                    }
                }

                ball.speedX *= 0.98;
                // if (!ball.inAir && ball.y <= height * 0.4) {
                //     ball.speedX = 0;
                //     ball.speedY = 0;
                //     ball.y = height * 0.4;
                // }

                if (abs(ball.speedX) < 0.3 && abs(ball.speedY) < 0.3) {
                    ball.speedX = 0;
                    ball.speedY = 0;
                }

                moveFieldersTowardsBall(fixedDt);
            }
            checkFielderCatch();
        }

        if (ball.throwing) {
            ball.x += ball.speedX * fixedDt;
            ball.y += ball.speedY * fixedDt;
           
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
                resetBatter();
                return;
            }

            if (targetFielder && dist(ball.x, ball.y, targetFielder.x, targetFielder.y) < catchDistance) {
                if (DEBUG) console.log(`Fielder targeting base ${chosenRunner.base + 1} catches the ball`);
                ball.throwing = false;


                if (targetFielder.isInfielder) {
                    let runnerAtFielderBase = runners.find(runner => runner.base === chosenRunner.base);
                    let baseVal = chosenRunner.base;

                    let backtrackFielder = getFielderForBase(baseVal);

                    if (runnerAtFielderBase && !runnerAtFielderBase.safe) {
                        if (runnerAtFielderBase.backtracking && backtrackFielder === targetFielder) {
                            outs++;
                            ball.throwing = false;
                            ball.caught = true;
                            resetBatter();
                            if (DEBUG) console.log("outs to", outs);
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
                    if (DEBUG) console.log(`Throwing to next unsafe runner to base ${targetRunner.base + 1}`);
                    handleGroundThrow(targetFielder);
                } else {
                    resetBatter();
                }
            }
        }
        moveRunners(fixedDt);
        accumulator -= fixedDt;
    }
}
