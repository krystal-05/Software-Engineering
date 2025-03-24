function botAttemptHit(pitchSpeed) {
    let hitChance = Math.random(); // gets number between 0 and 1
    let travelDistance = (batter.y - hitZoneHeight) - ball.y;
    let delay = (travelDistance / pitchSpeed) * 1000; // gets delay for ball to reach hitting zone

    if(DEBUG) console.log("HITCHANCE", hitChance);
    if(DEBUG) console.log("PITCH SPEED", pitchSpeed);
    if(pitchSpeed <= 430) { // 50% chance to hit
        if(hitChance >= 0.50) {
            setTimeout(() => {
                botHitBall();
            }, delay);
        }
    }
    else if(pitchSpeed <= 559) { // 25% chance to hit
        if(hitChance >= 0.75)
            setTimeout(() => {
                botHitBall();
            }, delay);    }
    else if(pitchSpeed <= 731) { // 10% chance
        if(hitChance >= 0.90) {
            setTimeout(() => {
                botHitBall();
            }, delay);
        }
    }
    else {
        if(DEBUG) console.log("bot missed STRIKE", strikes);
    }
}


function botHitBall() {
    //console.log("bot hit the ball");
    ballHit = true;
    ball.inAir = true;
    playSoundEffect("hitBall");

    let xPower = windowWidth / 200;
    let yPower = windowHeight / 200;
    ball.speedX = random(-xPower * 2, xPower * 2) * 60;
    ball.speedY = random(-yPower * 5, -yPower * 5.6) * 60;
    ball.initialSpeedY = ball.speedY;

    batter.running = true;
    runners.forEach(runner => runner.running = true);
    runners.push(batter);
    ball.advancingRunner = batter;
    batter = null;
}


function botPitch() {
    let pitchChance = Math.random();
    let botPitchMultiplier;

    if(pitchChance >= 0.60) { // 40% chance to get 1.3 multiplier
        botPitchMultiplier = 1.3;
    }
    else if(pitchChance >= 0.80) { // 20% chance to get 1.3 multiplier
        botPitchMultiplier = 1.7;
    }
    else {
        botPitchMultiplier = 1.0;
    }
    console.log("BOT PITCH MULTIPLIER", botPitchMultiplier);
    ball.speedY *= botPitchMultiplier;
    pitchAnimation = true;    
}