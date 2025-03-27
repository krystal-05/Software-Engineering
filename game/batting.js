function playerHit() {
    ballHit = true;
    ball.inAir = true;
    playSoundEffect("hitBall");

    let xPower = windowWidth / 200;
    let yPower = windowHeight / 200;
    ball.speedX = random(-xPower * 2, xPower * 2) * 60;
    ball.speedY = random(-yPower * 5, -yPower * 5.6) * 60;
    ball.initialSpeedY = ball.speedY;

    batter.running = true;
    runners.forEach(runner => {
        runner.running = true;
    });
    runners.push(batter);
    ball.advancingRunner = batter;
    batter = null;
}

function playerMiss() {
    ball.strikePitch = true;
    strikes++;
    handleStrikeCall();
    if (DEBUG) console.log("Swing missed! Strike " + strikes);
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
        playerMiss();
    }
    swingAttempt = true;
}