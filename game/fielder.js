let lastNearestRunner;
let lastClosestFielder;

function generateFielders() {
    let newFielders = [];
    
    // Infielders
    // First Baseman 
    newFielders.push({ 
        x: bases[1].x * 1.01, 
        y: bases[1].y * .95,    
        isInfielder: true,  
        position: "first"
    });
    
    // Second Baseman
    newFielders.push({ 
        x: bases[2].x * 1.05, 
        y: bases[2].y * .975, 
        isInfielder: true,  
        position: "second"
    });

    // Third Baseman
    newFielders.push({ 
        x: bases[3].x * 1.15,
        y: bases[3].y * .95, 
        isInfielder: true,  
        position: "third"
    });
    
    // Shortstop
    newFielders.push({ 
        x: (bases[2].x + bases[3].x) / 2 * 1.15, 
        y: (bases[2].y + bases[3].y) / 2 * .85,
        isInfielder: false,  
        position: "short"
    });
  
    // Outfielders
    // Left Field
    newFielders.push({
        x: width * 0.15,
        y: height * 0.35,
        isInfielder: false,
        position: "left field"
    });
    
    // Center Field
    newFielders.push({
        x: width * 0.5,
        y: height * 0.25,
        isInfielder: false,
        position: "center field"
    });
    
    // Right Field
    newFielders.push({
        x: width * 0.85,
        y: height * 0.35,
        isInfielder: false,
        position: "right field"
    });

    newFielders.forEach(fielder => {
        let scale = getScaleFactor(fielder.y);
        fielder.catchRadius = catchDistance * scale;
    });
    
    return newFielders;
}
// Scale speed based on y-value 
function getFielderSpeedScale(y) {
    return map(y, height * 0.4, height * 0.9, 0.75, 1.5);
}
// Logic for moving fielders
function moveFieldersTowardsBall(dt) {
    if (ball.homeRun) {
        fielders.forEach(fielder => {
            if (fielder === lastClosestFielder) {
                fielder.state = "idle";
            }
        });
        return;
    }

    if (ball.foul) {
        fielders.forEach(fielder => {
            if (fielder === lastClosestFielder) {
                fielder.state = "idle";
            }
        });
        return;
    }
    
    let closestFielder = null;
    let minDistance = Infinity;

    // Find current closest fielder to the ball
    for (let fielder of fielders) {
        let d = dist(fielder.x, fielder.y, ball.x, ball.y);
        if (d < minDistance) {
            minDistance = d;
            closestFielder = fielder;
            lastClosestFielder = closestFielder;
        }
    }
    // Move that closest fielder to the ball
    if (closestFielder) {
        let angleToBall = atan2(ball.y - closestFielder.y, ball.x - closestFielder.x);
        let speed = 180;

        let newX = closestFielder.x + cos(angleToBall) * speed * dt;
        let newY = closestFielder.y + sin(angleToBall) * speed * dt;

        closestFielder.x = newX;
        closestFielder.y = newY;

        if (dist(closestFielder.x, closestFielder.y, ball.x, ball.y) > catchDistance) {
            closestFielder.state = "running";
        } else {
            closestFielder.state = "idle";
        }
    }
    
    // todo
    fielders.forEach(fielder => {
        if (fielder !== closestFielder) {
            let d = dist(fielder.x, fielder.y, ball.x, ball.y);
            if (d > catchDistance) {
                fielder.state = "idle";
            }
        }
    });
}

// Logic for throwing when not air catch
function handleGroundThrow(catcher) {
    ball.throwingFielder = catcher;

    // Check for any remaining unsafe runners
    let unsafeRunners = runners.filter(runner => !runner.safe);
    // Throw if any unsafe runners
    console.log("Unsafe runners length", unsafeRunners.length);
    if (unsafeRunners.length > 0) {
        throwToNextRunner(catcher);
        return;
    }

    if (DEBUG) console.log("No unsafe runners left, resetting the play.");
    resetBatter();
}

// Logic for throwing when air catch
function handleThrow(catcher) {
    ball.throwingFielder = catcher;
    ball.caught = true;

    let batterOut = ball.advancingRunner;
    if (batterOut) {
        if (DEBUG) console.log("Air catch");
        runners = runners.filter(runner => runner !== batterOut);
        if (!showOutPopup) {
            outs++;
        }
        if (DEBUG) console.log(`outs to ${outs}`);
        if (outs >= 3) {
            setTimeout(() => {
                nextInning();
            }, 50);
        }
    } else {
        console.error("No advancing runner found for air catch!");
        return;
    }

    // If air catch runner from first base will decide if they should run to back to first
    let runnerFirstToSecond = runners.find(r => r.base === 1 && r.running);
    if (runnerFirstToSecond && shouldBacktrack(runnerFirstToSecond)) {
        runnerFirstToSecond.backtracking = true;
    }

    // Check for any remaining unsafe runners
    let unsafeRunners = runners.filter(runner => !runner.safe);
    // Throw if any unsafe runners
    if (unsafeRunners.length > 0) {
        throwToNextRunner(catcher);
        return;
    }

    // If no unsafe runners left, reset the play
    if (DEBUG) console.log("No unsafe runners left, resetting the play.");
    resetBatter();
}

// Determine which fielder to throw to 
function throwToNextRunner(currentFielder) {
    let nextRunner = getNearestUnsafeRunner(currentFielder);
    if (!nextRunner) {
        if (DEBUG) console.log("No more unsafe runners left.");
        resetBatter();
        return;
    }
    if (nextRunner.backtracking) {
        nextRunner.safe = true;
        handleGroundThrow(currentFielder);
        return;
    }
    if (DEBUG) console.log("nextRunner's base from throwToNextRunner: ", nextRunner.base);
    // target runner's target base at time of call
    let targetBaseIndex = (nextRunner.targetBase !== undefined) 
        ? nextRunner.targetBase 
        : ((nextRunner.base + 1) % bases.length);
    if (DEBUG) console.log("Thrower's target is base", targetBaseIndex);

    let targetBase = bases[targetBaseIndex];
    let targetFielder = getFielderForBase(targetBaseIndex);
    // When infielder of target runner's target base has the ball - out
    if (!nextRunner.safe && targetFielder === currentFielder && !ball.throwing) {
        let freedBaseIndex = (nextRunner.targetBase !== undefined)
            ? nextRunner.targetBase
            : (nextRunner.base + 1) % bases.length;
        bases[freedBaseIndex].occupied = false;
        outs++;
        if (DEBUG) console.log("outs is now", outs);
        runners = runners.filter(r => r !== nextRunner);
        if (outs >= 3) {
            nextInning();
            return;
        }
        handleGroundThrow(currentFielder);
        if (DEBUG) console.log("throwing now");
        return;
    }
    if (!targetFielder) {
        if (DEBUG) console.log("targetfielder returned null");
        targetFielder = getClosestFielderToBase(nextRunner);
    }

    // Set ball trajectory to throw to the next fielder
    ball.x = currentFielder.x;
    ball.y = currentFielder.y;

    let dx = targetFielder.x - currentFielder.x;
    let dy = targetFielder.y - currentFielder.y;
    let magnitude = sqrt(dx * dx + dy * dy);

    ball.speedX = (dx / magnitude) * 600;
    ball.speedY = (dy / magnitude) * 600;

    ball.advancingRunner = nextRunner;
    ball.targetFielder = targetFielder;
    ball.targetBase = targetBase;
    ball.throwing = true;
    currentFielder.state = "throwing";
}

function handleCatch(currentFielder) {
    ball.throwing = false;
    ball.caught = true;

    let targetRunner = getNearestUnsafeRunner(currentFielder);
    if (!targetRunner) {
        if (DEBUG) console.log("No unsafe runners");
        handleGroundThrow(currentFielder);
        return;
    }

    // if the ball is caught by the catcher, call ground-throw function
    if (dist(ball.x, ball.y, catcherPlayer.x, catcherPlayer.y) < catcherPlayer.catchRadius) {
        catcherPlayer.state = "hasBall";
        handleGroundThrow(currentFielder);
        ballCaughtThisFrame = true;
        return;
    }

    let intendedBase = (targetRunner.targetBase !== undefined)
        ? targetRunner.targetBase
        : (targetRunner.base + 1) % bases.length;

    // current fielder is an infielder to out runner
    if (currentFielder.isInfielder && !targetRunner.safe) {
        let backtrackFielder = getFielderForBase(intendedBase);
        if ((targetRunner.backtracking && backtrackFielder === currentFielder) || (!targetRunner.backtracking)) {
            // only if the ball is near the base for outing runner
            let baseCoords = bases[intendedBase];
            if (dist(ball.x, ball.y, baseCoords.x, baseCoords.y) < catcherPlayer.catchRadius) {
                outs++;
                if (DEBUG) console.log("Tagging out runner at base", intendedBase, "outs now", outs);
                bases[intendedBase].occupied = false;
                runners = runners.filter(r => r !== targetRunner);
                if (outs >= 3) {
                    nextInning();
                    return;
                }
                // next unsafe runner
                throwToNextRunner(currentFielder);
                return;
            }
        }
    }

    if (outs >= 3) {
        nextInning();
        return;
    }

    // got no out, throw to the next unsafe runner
    let targetFielder = getFielderForBase(intendedBase);
    ball.targetFielder = targetFielder;
    if (DEBUG) console.log(`Throwing to next unsafe runner to base ${intendedBase}`);
    handleGroundThrow(currentFielder);
}

// Find closest unsafe runner to current holder of the ball
function getNearestUnsafeRunner(catcher) {
    let targetRunner = null;
    let minDistance = Infinity;
    for (let runner of runners) {
        if (runner.safe || !runner.running || !runners.includes(runner)) { 
            continue;
        }

        let targetBaseIndex;
        if (runner.backtracking) {
            targetBaseIndex = runner.base;
        } else if (runner.targetBase !== undefined) {
            targetBaseIndex = runner.targetBase;
        } else {
            targetBaseIndex = (runner.base + 1) % bases.length;
        }
        
        let targetBase = bases[targetBaseIndex];
        let d = dist(catcher.x, catcher.y, targetBase.x, targetBase.y);
        if (d < minDistance) {
            minDistance = d;
            lastNearestRunner = runner;
            targetRunner = runner;
        }
    }
    return targetRunner;
}

// Return fielder object relative to base index
function getFielderForBase(baseIndex) {
    // Map: base 1 → fielders[0], base 2 → fielders[1], base 3 → fielders[2]
    if (baseIndex === 0) return catcherPlayer;
    if (baseIndex === 1) return fielders[0];
    if (baseIndex === 2) return fielders[1];
    if (baseIndex === 3) return fielders[2];
    return null;
}

// Find the fielder closest to the closest unsafe runner's target base
function getClosestFielderToBase(runner) {
    if (!runner) {
        console.error("getClosestFielderToBase received a null runner");
        return null;
    }
    let targetBase = bases[(runner.base + 1) % 4];
    let closest = null;
    let minDist = Infinity;
    for (let fielder of fielders) {
        let d = dist(fielder.x, fielder.y, targetBase.x, targetBase.y);
        if (d < minDist) {
            minDist = d;
            closest = fielder;
        }
    }
    return closest;
}

function resetFieldersPosition() {
    fielders.forEach((fielder, index) => {
        fielder.x = initialFielderPositions[index].x;
        fielder.y = initialFielderPositions[index].y;
        fielder.state = "idle";
    });
}

function resetInfielders() {
    for (let i = 0; i < fielders.length; i++) {
        if (fielders[i].isInfielder) {
            fielders[i].x = initialFielderPositions[i].x;
            fielders[i].y = initialFielderPositions[i].y;
            fielders[i].state = "idle";
        }
    }
}

function checkFielderCatch() {
    if (ball.homeRun) return;
    if (ballCaughtThisFrame) return;
    if (ball.caught) return;

    // Catcher catches ball off of a pitch
    if (ball.strikePitch && dist(ball.x, ball.y, catcherPlayer.x, catcherPlayer.y) < strikeCatchThreshold) {
        catcherPlayer.state = "hasBall";
        handleStrikeCatch(catcherPlayer);
        ballCaughtThisFrame = true;
        return;
    }

    // Catcher catches ball in attempt to out runner
    if (!ball.strikePitch && dist(ball.x, ball.y, catcherPlayer.x, catcherPlayer.y) < catcherPlayer.catchRadius) {
        catcherPlayer.state = "hasBall";
        if (ball.inAir) {
            handleThrow(catcherPlayer);
        } else {
            handleGroundThrow(catcherPlayer);
        }
        ballCaughtThisFrame = true;
        return;
    }

    if (!ballHit) return;

    // Any fielder catches the ball
    for (let fielder of fielders) {
        if ((fielder.state === "idle" || fielder.state === "running") &&
                dist(ball.x, ball.y, fielder.x, fielder.y) < fielder.catchRadius) {
            // Fielder catches the ball:
            fielder.state = "hasBall";
            resetInfielders();
            if (ball.inAir) {
                // In-air catch
                handleThrow(fielder);
            } else {
                // Ground catch
                handleGroundThrow(fielder);
            }
            ballCaughtThisFrame = true;
            return;
        }
    }
}
// Catcher catches strike
function handleStrikeCatch(catcher) {
    ball.x = catcher.x;
    ball.y = catcher.y;
    ball.speedY = 0;
    ball.speedX = 0;

    setTimeout(() => {
        resetBall();
        if (strikes >= 3) {
            outs++;
            resetBatter();
            if (DEBUG) console.log("Strikeout! Batter is out.");
            if (outs >= 3) {
                nextInning();
                return;
            }
        }
    }, 500);
}