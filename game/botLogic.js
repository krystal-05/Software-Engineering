function botAttemptHit(pitchSpeed) {
    let hitChance = Math.random(); // gets number between 0 and 1
    let travelDistance = (batter.y - hitZoneHeight) - ball.y;
    let delay = (travelDistance / pitchSpeed) * 1000; // gets delay for ball to reach hitting zone

    let baseAntiChance;
    if(pitchSpeed <= 430) { // 50% chance to hit
        baseAntiChance = .5;
    } else if(pitchSpeed <= 559) { // 25% chance to hit
        baseAntiChance = .75;  
    } else if(pitchSpeed <= 731) { // 10% chance
        baseAntiChance = .9;
    } else {
        if(DEBUG) console.log("bot missed STRIKE", strikes);
    }

    let difficultyModifier = (generalDifficultyScale - 1) * 0.1;
    let adjustedAntiChance = baseAntiChance - difficultyModifier;
    
    if (hitChance >= adjustedAntiChance) {
        setTimeout(() => {
            botHitBall();
        }, delay);
    }
}


function botHitBall() {
    let softHitPower = 5;
    let hardHitPower = 5.6;
    let homeRunPower = 8;

    ballHit = true;
    ball.inAir = true;
    playSoundEffect("hitBall");

    powerXSaveVal = random(-xPower * 2, xPower * 2)
    ball.speedX = powerXSaveVal * 60;

    homeRunScale = generalDifficultyScale * .8;
    let baseHomeRunChance = .1;
    let modHomeRunChance = 0.10 * (generalDifficultyScale - 1);
    let homeRunChance = baseHomeRunChance + modHomeRunChance;

    if (Math.random() < homeRunChance) {
        if (DEBUG) console.log("HOME RUN AT POWER");
        homeRunHit = true;
    }

    if (homeRunHit) {
        ball.speedY = (-yPower * homeRunPower) * 60;
    } else {
        ball.speedY = random(-yPower * softHitPower, -yPower * hardHitPower) * 60;
    }
    ball.initialSpeedY = ball.speedY;

    batter.running = true;
    runners.forEach(runner => runner.running = true);
    setTimeout(() => {
        batter.x = batter.x - width * .05;
        runners.push(batter);
        ball.advancingRunner = batter;
        batter = null;
    }, 75);
}


function botPitch() {
    let pitchChance = Math.random();
    let botPitchMultiplier;

    if(pitchChance >= 0.60) { // 40% chance to get 1.3 multiplier
        botPitchMultiplier = 1.3;
    }
    else if(pitchChance >= 0.80) { // 20% chance to get 1.7 multiplier
        botPitchMultiplier = 1.7;
    }
    else {
        botPitchMultiplier = 1.0;
    }

    difficultyModifier = (generalDifficultyScale - 1) * 0.2;
    let finalMultiplier = botPitchMultiplier + difficultyModifier;

    console.log("BOT PITCH MULTIPLIER", finalMultiplier);
    ball.speedY *= finalMultiplier;
    pitchAnimation = true;    
}

function changeDifficulty(difficultyValue) {
    if (difficultyValue < 1 || difficultyValue > 3){
        generalDifficultyScale = 1;
        if (DEBUG) console.log("generalDifficultyScale: ", generalDifficultyScale);
        return;
    }
    generalDifficultyScale = difficultyValue;
    if (DEBUG) console.log("generalDifficultyScale: ", generalDifficultyScale);
}