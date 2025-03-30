let homeRunHit = false;
let powerXSaveVal;

function playerHit() {
    let softHitPower = 5;
    let hardHitPower = 5.6;
    let homeRunPower = 8;

    ballHit = true;
    ball.inAir = true;
    playSoundEffect("hitBall");

    // x-value left/right power
    powerXSaveVal = random(-xPower * 2, xPower * 2)
    ball.speedX = powerXSaveVal * 60;

    // determine homerun or normal
    let temp = floor(random(1,10));
    if (temp === 1) {
        if (DEBUG) console.log("HOME RUN AT POWER");
        homeRunHit = true;
    }

    // y-value up power
    if (homeRunHit) {
        ball.speedY = (-yPower * homeRunPower) * 60;
    } else {
        ball.speedY = random(-yPower * softHitPower, -yPower * hardHitPower) * 60;
    }
    ball.initialSpeedY = ball.speedY;

    batter.running = true;
    runners.forEach(runner => {
        runner.running = true;
    });
    setTimeout(() => {
        batter.x = batter.x - width * .05;
        runners.push(batter);
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