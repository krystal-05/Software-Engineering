let homeRunHit = false;
let powerXSaveVal;
let hitDirectionSlider = false;
let hitPowerSlider = false;
let hitSkillCheckComplete = false;
let hitSliderX = 0;
let powerSliderFinalX = 0;
let directionSliderFinalX = 0;
let powerSliderSpeed = 300;
let directionSliderSpeed = 400; // will be modified
let powerBarX, powerBarY;
let directionBarX, directionBarY;
let directionValue = 0.0;
let powerMultiplier = 1.0;
let powerZoneLevel = "low";
let targetImage;

function playerHit() {
    ballHit = true;
    ball.inAir = true;
    playSoundEffect("hitBall");

    // x-value left/right power
    powerXSaveVal = directionValue * xPower * 4;
    ball.speedX = powerXSaveVal * 60;

    const ballVector = {
        x: powerXSaveVal,
        y: -yPower * powerMultiplier
    };
    
    let isFoul = checkFoulByAngle(ballVector);
    let isPerfectPower = false;
    let sliderPos = powerBarX + powerSliderFinalX;
    let perfectZoneCenter = powerBarX + (barWidth / 2);
    let diff = abs(sliderPos - perfectZoneCenter);
    isPerfectPower = diff <= perfectZoneWidth / 2;
    let basePower = powerMultiplier;
    let homeRunChance = Math.random();

    // 50% chance to get homerun when landing on the middle
    if(isPerfectPower && !isFoul && homeRunChance < 0.5) { 
        basePower = 8.0;
        homeRunHit = true;
    }

    ball.speedY = (-yPower * basePower * 60);
    ball.initialSpeedY = ball.speedY;

    if(isFoul) {
        handleFoul();
        ball.foulSince = millis();
        showFoulPopup = true;
        popupMessage = "FOUL BALL";
        popupTimer = millis();
        if(strikes < 2) strikes++; // only get a strike when less than 2 strikes
        ball.foul = true;
        return;
    }

    batter.running = true;
    runners.forEach(runner => {
        if (bases[runner.base - 1].occupied) {
            runner.running = true;
            bases[runner.base].occupied = false;
        }
    });
    setTimeout(() => {
        batter.x = batter.x - width * .05;
        runners.push(batter);
        bases[0].occupied = false;
        ball.advancingRunner = batter;
        batter = null;
    }, 75);
}

function playerStrike() {
    ball.strikePitch = true;
    strikes++;
    handleStrikeCall();
    if (DEBUG) console.log("Swing missed! Strike " + strikes);
}

function userBatting() {
    if (ball.y >= batter.y - hitZoneHeight && ball.y <= batter.y && abs(ball.x - batter.x) < hitZoneWidth * 0.5) {
        // Successful swing/hit.
        playerHit()
    } else {
        playerStrike();
    }
    swingAttempt = true;
}


function startDirectionSlider() {
    hitSliderX = random(0, barWidth);
    directionBarX = width / 2 - barWidth / 2;
    directionBarY = height - 100;
    hitDirectionSlider = true;
    hitPowerSlider = false;
}


function startPowerSlider() {
    hitSliderX = random(0, barWidth);
    if(DEBUG) powerSliderSpeed = 100; // for demo and debugging
    //directionSliderSpeed = 400;

    powerBarX = width / 2 - barWidth / 2;
    powerBarY = height - 100;
    hitPowerSlider = true;
    hitDirectionSlider = false;
}


function startHitSkillCheck() {
    hitSkillCheckComplete = false;
    startPowerSlider();
}


function finishHitSkillCheck() {
    hitSkillCheckComplete = true;
    if(topInning) {
        botPitch();
    }
    else {
        userPitch();
    }
}


function evaluatePowerMultiplier() {
    let sliderPos = powerBarX + hitSliderX;
    let perfectZoneCenter = powerBarX + (barWidth / 2);
    let diff = abs(sliderPos - perfectZoneCenter);
    
    let multiplier;
    if (diff <= perfectZoneWidth / 2) {
        powerZoneLevel = "high";
        multiplier = 5; // perfect power
    } else if (diff <= goodZoneWidth / 2) {
        powerZoneLevel = "medium";
        multiplier = 4.2; // good power
    } else {
        powerZoneLevel = "low";
        multiplier = 3.5; 
    }
    return multiplier;
}


function evaluateDirectionValue() {
    let normalized = hitSliderX / barWidth;
    return normalized * 2 - 1;
}


function updateHitSkillBar(dt) {
    if(hitPowerSlider) {
        hitSliderX += powerSliderSpeed * dt;
        if (hitSliderX < 0 || hitSliderX > barWidth) {
            powerSliderSpeed *= -1;
            hitSliderX += powerSliderSpeed * dt;
        }
    } else if (hitDirectionSlider) {
        hitSliderX += directionSliderSpeed * dt;
        if (hitSliderX < 0 || hitSliderX > barWidth) {
            directionSliderSpeed *= -1;
            hitSliderX += directionSliderSpeed * dt;
        }
    }
}


function checkFoulByAngle(ballVec) {
    const home = bases[0];
    const first = bases[1];
    const third = bases[3];

    const vFirst = createVector(first.x - home.x, first.y - home.y).normalize();
    const vThird = createVector(third.x - home.x, third.y - home.y).normalize();
    const hitVec = createVector(ballVec.x, ballVec.y).normalize();

    const angleToFirst = vFirst.heading();
    const angleToThird = vThird.heading();
    const hitAngle = hitVec.heading();

    const leftLine = angleToThird;
    const rightLine = angleToFirst;
    let isFoul = hitAngle < leftLine || hitAngle > rightLine;

    if(DEBUG){
        console.log("hitAngle:", degrees(hitAngle));
        console.log("angleToFirst:", degrees(rightLine));
        console.log("angleToThird:", degrees(leftLine));
        console.log("isFoul:", isFoul);
    }
    return isFoul;
}



function drawSkillCheckBar(dt) {
    let hitBarX = hitPowerSlider ? powerBarX : directionBarX;
    let hitBarY = hitPowerSlider ? powerBarY : directionBarY;
    fill(100);
    rect(hitBarX, hitBarY, barWidth, barHeight);
    
    let goodZoneX = hitBarX + (barWidth - goodZoneWidth) / 2;
    fill('yellow');
    rect(goodZoneX, hitBarY, goodZoneWidth, barHeight);

    let perfectZoneX = hitBarX + (barWidth - perfectZoneWidth) / 2;
    fill('green');
    rect(perfectZoneX, hitBarY, perfectZoneWidth, barHeight);
    
    fill('red');
    image(targetImage, hitBarX + hitSliderX - barHeight/2, hitBarY, barHeight, barHeight);
}
