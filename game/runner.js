// Scale speed based on y-value
function getRunnerSpeedScale(y) {
    return map(y, height * 0.4, height * 0.9, 0.9, 1.5);
}
// Logic for moving runners on the field
function moveRunners(dt) {
    runners = runners.filter(runner => {
        if (runner.running) {
            let targetIndex;
            if (runner.backtracking) {
                targetIndex = runner.base;
            } else if (runner.targetBase !== undefined) {
                targetIndex = runner.targetBase;
            } else {
                targetIndex = (runner.base + 1) % bases.length;
            }
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
                // occupied used in playerHit()
                let prevBase = runner.base;
                targetBase.occupied = true;

                // Mark runner safe/not running when reaching their target
                if (runner.backtracking) {
                    runner.running = false;
                    runner.backtracking = false;
                    runner.safe = true;
                } else {
                    runner.base = targetIndex;
                    runner.targetBase = undefined;
                    if (runner.base == 0) {
                        score[topInning ? 'away' : 'home']++;
                        bases[0].occupied = false;
                        bases[prevBase].occupied = false;

                        popupMessage = "RUN SCORED!";
                        showRunPopup = true;
                        popupTimer = millis();

                        if (DEBUG) console.log(`Runner scored! Updated Score - Home: ${score.home}, Away: ${score.away}`);
                        return false;
                    } else {
                        if (!ball.homeRun) runner.running = false;
                        else bases[prevBase].occupied = false;
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

function setBasedRunners() {
    bases.forEach((base, index) => {
        base.occupied = (index === 0);
        if (DEBUG) console.log("set base ", base.number, base.occupied);
    });
}
// will run the runner manually if the runner is allowed
function runBase(baseStr) {
    let attempted;
    switch (baseStr) {
        case '1':
            attempted = 3;
            break;
        case '2':
            attempted = 2;
            break;
        case '3':
            attempted = 1;
            break;
        default:
            break;
    }
    if (!bases[attempted].occupied) {
        return;
    }
    let nextBaseIndex = (attempted + 1) % 4;
    if (bases[nextBaseIndex].occupied) {
        if (DEBUG) console.log("Cannot run because next base", nextBaseIndex, "is occupied");
        return;
    }

    for (let runner of runners) {
        if (runner.base === attempted && !runner.running) {
            if (runner.safe) runner.safe = false;
            runner.targetBase = nextBaseIndex;
            runner.running = true;
            bases[attempted].occupied = false;
            bases[nextBaseIndex].occupied = true;
        }
    }
}
// show user which runners can be manually ran during a play
function displayRunHint() {
    textAlign(CENTER, BOTTOM);
    textSize(16);
    fill(0);
    textStyle(BOLD);

    for (let i = 1; i < bases.length; i++) {
        let nextIndex = (i + 1) % bases.length;
        if (bases[i].occupied && !bases[i-1].occupied && !bases[nextIndex].occupied && !homeRunHit) {
            let label = (i === 1 || i === 3) ? 4 - i : i;
            text(`Press ${label} to Run!`, bases[i].x, bases[i].y + height * .05);
        }
    }
}