// Scale speed based on y-value
function getRunnerSpeedScale(y) {
    return map(y, height * 0.4, height * 0.9, 0.9, 1.5);
}
// Logic for moving runners on the field
function moveRunners(dt) {
    runners = runners.filter(runner => {
        if (runner.running) {
            let targetIndex = runner.base + 1;
            let speedScale = getRunnerSpeedScale(runner.y);
            // If runner is turning back from running to the next base,
            // reset their target
            if (runner.backtracking) {
                targetIndex = runner.base;
            }
            let targetBase = bases[targetIndex % 4];

            let dx = targetBase.x - runner.x;
            let dy = targetBase.y - runner.y;
            let distance = sqrt(dx * dx + dy * dy);

            // Calculate each step as distance per time and once the step is larger than 
            // the distance to the base, assign them their target base
            let step = runner.speed * dt * speedScale;
            if (step >= distance) {
                runner.x = targetBase.x;
                runner.y = targetBase.y;
            } else {
                runner.x += (dx / distance) * step;
                runner.y += (dy / distance) * step;
            }

            // Lock runner in position relative to base
            if (dist(runner.x, runner.y, targetBase.x, targetBase.y) < 12) {
                let baseScale;
                switch(targetBase) {
                    case bases[1]:
                        baseScale = 0.975;
                        break;
                    case bases[2]:
                        baseScale = 0.975;
                        break;
                    case bases[3]:
                        baseScale = 1.025;
                        break;
                    default:
                        baseScale = 1;
                }
                runner.x = targetBase.x * baseScale;
                runner.y = targetBase.y;

                // Mark runner safe/not running when reaching their target
                if (runner.backtracking) {
                    runner.running = false;
                    runner.backtracking = false;
                    runner.safe = true;
                } else {
                    runner.base = (runner.base + 1) % 4;
                    if (runner.base == 0) {
                        score[topInning ? 'away' : 'home']++;
                        
                        popupMessage = "RUN SCORED!";
                        showRunPopup = true;
                        popupTimer = millis();

                        if (DEBUG) console.log(`Runner scored! Updated Score - Home: ${score.home}, Away: ${score.away}`);
                        return false;
                    } else {
                        if (!ball.homeRun) runner.running = false;
                        runner.safe = true;
                        if (DEBUG) console.log(`Runner reached base ${runner.base} and is holding.`);
                    }
                }
            }
        }
        return true;
    });
}

// If runner is more than halfway to target base, don't run back
function shouldBacktrack(runner) {
    let currentBase = bases[runner.base];
    let nextBase = bases[(runner.base + 1) % bases.length];
    let totalDistance = dist(currentBase.x, currentBase.y, nextBase.x, nextBase.y);
    let runnerDistance = dist(currentBase.x, currentBase.y, runner.x, runner.y);
    return runnerDistance < totalDistance / 2;
}