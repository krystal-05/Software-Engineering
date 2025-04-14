let botHitScheduled = false;

function botAttemptHit(pitchMultiplier) {
    let hitChance = Math.random(); // gets number between 0 and 1
    
    // changed to check ball location in draw
    // let travelDistance = (batter.y - hitZoneHeight) - ball.y;
    // let delay = (travelDistance / pitchSpeed) * 1000; // gets delay for ball to reach hitting zone

    let baseAntiChance;
    if(pitchMultiplier == 1) { // 50% chance to hit
        baseAntiChance = .5;
    } else if(pitchMultiplier == 1.3) { // 25% chance to hit
        baseAntiChance = .75;  
    } else if(pitchMultiplier == 1.7) { // 10% chance
        baseAntiChance = .9;
    } else {
        if(DEBUG) console.log("bot missed STRIKE", strikes);
    }
    if (ball.curveInitialized || ball.changeUpInitialized) baseAntiChance += 0.09;

    let difficultyModifier = (generalDifficultyScale - 1) * 0.1;
    let adjustedAntiChance = baseAntiChance - difficultyModifier;
    
    if (hitChance >= adjustedAntiChance) {
        botHitScheduled = true;
    }
}

function botHitBall() {
    ballHit = true;
    ball.inAir = true;
    playSoundEffect("hitBall");

    let botPowerChance = Math.random();
    let difficultyModifier = (generalDifficultyScale - 1) * 0.1;
    let adjustedBotPowerChance = botPowerChance + difficultyModifier;

    let basePower;
    if (adjustedBotPowerChance > 0.80) {
        basePower = 5;
    } 
    else if (adjustedBotPowerChance > 0.50) {
        basePower = 4.2;
    } 
    else {
        basePower = 3.5;
    }

    const isFoul = Math.random() < 0.25; // 25% chance to hit a foul ball

    if (isFoul) {
        handleFoul();
        powerXSaveVal = xPower * 4;
        ball.speedX = powerXSaveVal * 60;
        ball.speedY = (-yPower * basePower) * 60;
        ball.foul = true;
        ball.foulSince = millis();
        if (strikes < 2) strikes++;
        return;
    }

    powerXSaveVal = random(-xPower * 2, xPower * 2);
    ball.speedX = powerXSaveVal * 60;

    homeRunScale = generalDifficultyScale * 0.8;
    const homeRunChance = 0.1 + 0.10 * (generalDifficultyScale - 1);
    let chance = Math.random();
    if (chance < homeRunChance) {
        homeRunHit = true;
        basePower = 8.0;
        ball.speedY = (-yPower * basePower) * 60;
    }

    ball.speedY = (-yPower * basePower) * 60;
    ball.initialSpeedY = ball.speedY;
    batter.running = true;
    runners.forEach(runner => runner.running = true);
    setTimeout(() => {
        batter.x = batter.x - width * 0.05;
        batter.relativeX = batter.x / width;
        batter.relativeY = batter.y / height;
        runners.push(batter);
        ball.advancingRunner = batter;
        batter = null;
    }, 75);
}


function botPitch() {
    let pitchChance = Math.random();
    let botPitchMultiplier;

    if (generalDifficultyScale > 1) {
        let randomPitch = Math.random();
        if (randomPitch <= .5) {
            setPitchType('fastball');
        } else if (randomPitch > .5 && randomPitch <= .25) {
            setPitchType('curveball');
        } else {
            setPitchType('changeup');
        }
    }

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

    if(DEBUG) console.log("BOT PITCH MULTIPLIER", finalMultiplier);
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