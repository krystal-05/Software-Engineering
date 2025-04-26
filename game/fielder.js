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
        position: "first",
        fielderBaseIndex: 1,
        attemptingForceOut: null,
        prevX: bases[1].x * 1.01
    });
    
    // Second Baseman
    newFielders.push({ 
        x: bases[2].x * 1.05, 
        y: bases[2].y * .975, 
        isInfielder: true,  
        position: "second",
        fielderBaseIndex: 2,
        attemptingForceOut: null,
        prevX: bases[2].x * 1.05
    });

    // Third Baseman
    newFielders.push({ 
        x: bases[3].x * 1.15,
        y: bases[3].y * .95, 
        isInfielder: true,  
        position: "third",
        fielderBaseIndex: 3,
        attemptingForceOut: null,
        prevX: bases[3].x * 1.15
    });
    
    // Shortstop
    newFielders.push({ 
        x: (bases[2].x + bases[3].x) / 2 * 1.15, 
        y: (bases[2].y + bases[3].y) / 2 * .85,
        isInfielder: false,  
        position: "short",
        prevX: (bases[2].x + bases[3].x) / 2 * 1.15
    });
  
    // Outfielders
    // Left Field
    newFielders.push({
        x: width * 0.15,
        y: height * 0.35,
        isInfielder: false,
        position: "left field",
        prevX: width * 0.15
    });
    
    // Center Field
    newFielders.push({
        x: width * 0.5,
        y: height * 0.25,
        isInfielder: false,
        position: "center field",
        prevX: width * 0.5
    });
    
    // Right Field
    newFielders.push({
        x: width * 0.85,
        y: height * 0.35,
        isInfielder: false,
        position: "right field",
        prevX: width * 0.85
    });

    newFielders.forEach(fielder => {
        let scale = getScaleFactor(fielder.y);
        fielder.catchRadius = catchDistance * scale;
    });

    initialFielderPositions = newFielders.map(fielder => ({ x: fielder.x, y: fielder.y }));
    return newFielders;
}
// Scale speed based on y-value 
function getFielderSpeedScale(y) {
    return map(y, height * 0.4, height * 0.9, 0.75, 1.5);
}

// reset necessary variables to resume play
function infielderChaseHelper(fielder) {
    fielder.state = "idle";
    ball.y += height * .025;
    fielder.chasing = null;
    fielder.attemptingForceOut = null;
    ball.isChasing = false;
}

// Runner movement logic to something trying to out a runner
function moveFielderToObject(fielder, toObject, dt) {
    let angleToObj = atan2(toObject.y - fielder.y, toObject.x - fielder.x);
    let speed = 250;
        
    let newX = fielder.x + cos(angleToObj) * speed * dt;
    let newY = fielder.y + sin(angleToObj) * speed * dt;
    fielder.x = newX; ball.x = newX;
    fielder.y = newY; ball.y = newY - height * .025;
}

// make infielder chase a runner to tag out
function moveInfieldersToRunner(dt) {
    fielders.forEach(fielder => {
        let tagRadius = fielder.catchRadius * 1.25;
        // Infielder will go for force out on runner
        if (fielder.attemptingForceOut) {
            nextRunner = fielder.chasing;
            let fielderTargetBase = bases[(nextRunner.base + 1) % 4];
            let fielderToBaseDist = dist(fielder.x, fielder.y, fielderTargetBase.x, fielderTargetBase.y);
            if (fielderToBaseDist > tagRadius && !nextRunner.safe) {
                moveFielderToObject(fielder, fielderTargetBase, dt);
            } else if (!nextRunner.safe) {
                outs++;
                infielderChaseHelper(fielder);
                fielderTargetBase.occupied = false;
                fielderTargetBase.tryToOccupy = false;
                if (DEBUG) console.log("FORCED RUNNER OUT, outs now", outs);
                runners = runners.filter(r => r !== nextRunner);
                if (outs >= 3) {
                    nextInning();
                    return;
                }
            } else {
                infielderChaseHelper(fielder);
            }
        // Infielder will go for tag out on runner
        } else if (fielder.chasing && fielder.attemptingForceOut === null) {
            nextRunner = fielder.chasing;
            fielderTargetBase = bases[(nextRunner.base + 1) % 4];
            let fielderToRunnerDist = dist(fielder.x, fielder.y, nextRunner.x, nextRunner.y);
            if (fielderToRunnerDist > tagRadius && !nextRunner.safe) {
                moveFielderToObject(fielder, nextRunner, dt);
            } else if (!nextRunner.safe) {
                outs++;
                fielderTargetBase.occupied = false;
                fielderTargetBase.tryToOccupy = false;
                infielderChaseHelper(fielder);
                if (DEBUG) console.log("RAN TO AND TAGGED RUNNER, outs now", outs);
                runners = runners.filter(r => r !== nextRunner);
                if (outs >= 3) {
                    nextInning();
                    return;
                }
            } else {
                infielderChaseHelper(fielder);
            }
        }
    });
}
// Will move fielder when they are off base
function moveInfieldersToBase(dt) {
    if (!ballHit) return;
    let closestFielder = null;
    let minDistance = Infinity;

    for (let fielder of fielders) {
        let d = dist(fielder.x, fielder.y, ball.x, ball.y);
        if (!ball.throwing && d < minDistance) {
            minDistance = d;
            closestFielder = fielder;
            lastClosestFielder = closestFielder;
        }
    }
    fielders.forEach(fielder => {
        // if the fielder is the one running for the ball or is currently catching
        // return
        if (fielder === closestFielder) return;
        if (fielder.isRecieving) {
            fielder.state = "idle"; 
            return;
        }
        // move fielder to original position if they moved
        if (fielder.isInfielder && fielder.offBase) {
            let initialPos = getInitialInfielderPosition(fielder);
            fielder.state = "running";
            let angleToBase = atan2(initialPos.y - fielder.y, initialPos.x - fielder.x);
            let speed = 225;

            let newX = fielder.x + cos(angleToBase) * speed * dt;
            let newY = fielder.y + sin(angleToBase) * speed * dt;

            fielder.x = newX;
            fielder.y = newY;
            if (dist(fielder.x, fielder.y, initialPos.x, initialPos.y) <= 12) {
                    snapInfielderPosition(fielder);
            } 
        } else {
            fielder.state = "idle";
        }
    });
}

// Logic for moving fielders
function moveFieldersTowardsBall(dt) {
    if (ball.isChasing) return;
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
        closestFielder.offBase = true;

        if (dist(closestFielder.x, closestFielder.y, ball.x, ball.y) > closestFielder.catchRadius) {
            closestFielder.state = "running";
        } else {
            closestFielder.state = "idle";
        }
    }
}
// return original position object
function getInitialInfielderPosition(fielder) {
    fielderIndex = fielder.fielderBaseIndex - 1;
    return initialFielderPositions[fielderIndex];
}
// snap infielder to original position
function snapInfielderPosition(fielder) {
    fielder.offBase = false;
    fielder.state = "idle";
    let initialPos = getInitialInfielderPosition(fielder);
    fielder.x = initialPos.x;
    fielder.y = initialPos.y;
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
        bases[1].tryToOccupy = false;
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

    runners.forEach(runner => {
        runner.backtracking = true;
        runner.running     = true;
        runner.targetBase  = undefined;
    });

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
// fielder runs to targetfielder as last effort to get them out
// also will try to force out by running to base
// comments incase of bug
function attemptTagRunner(nextRunner, currentFielder) {
    if (DEBUG) console.log("attemptTagRunner CALLED, chasing set to", nextRunner.base);
    currentFielder.state = "running";
    currentFielder.chasing = nextRunner;
    ball.isChasing = true;
    
    let prevBase = nextRunner.base - 1;
    if (prevBase>= 0 && !bases[prevBase].wasOccupied) {
        return;
    }
    //let baseBehindRunner = bases[nextRunner.base - 1];
    
    let currentBase = bases[(nextRunner.base + 1) % 4]
    let baseDistance = dist(currentFielder.x, currentFielder.y, currentBase.x, currentBase.y);
    let nextRunnerDistance = dist(currentFielder.x, currentFielder.y, nextRunner.x, nextRunner.y);
    let closerToBase = baseDistance < nextRunnerDistance;
    if (/*(prevBase < 0 || baseBehindRunner.wasOccupied) &&*/ closerToBase) {
        currentFielder.attemptingForceOut = currentBase;
    }
}

// Determine which fielder to throw to 
function throwToNextRunner(currentFielder) {
    // fielder is chasing a runner
    if (currentFielder.chasing) {
        if (DEBUG) console.log("Fielder still chasing; aborting throwToNextRunner");
        return;
    }
    
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
    targetFielder.isRecieving = true;
    ball.caught = false;
    // When infielder of target runner's target base has the ball - out
    if (!nextRunner.safe && targetFielder === currentFielder && !ball.throwing) {
        let freedBaseIndex = (nextRunner.targetBase !== undefined)
            ? nextRunner.targetBase
            : (nextRunner.base + 1) % bases.length;
        bases[freedBaseIndex].occupied = false;
        if (!currentFielder.offBase) {
            outs++;
            bases[freedBaseIndex].tryToOccupy = false;
            if (DEBUG) console.log("outs is now", outs);
            runners = runners.filter(r => r !== nextRunner);
            if (outs >= 3) {
                nextInning();
                return;
            }
        // infielder will need to tag the runner to get them out
        } else {
            attemptTagRunner(nextRunner, currentFielder);
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
    currentFielder.isRecieving = false;

    let targetRunner = getNearestUnsafeRunner(currentFielder);
    if (!targetRunner) {
        if (DEBUG) console.log("No unsafe runners");
        handleGroundThrow(currentFielder);
        return;
    }

    // if the ball is caught by the catcher, call ground-throw function
    if (dist(ball.x, ball.y, catcherPlayer.x, catcherPlayer.y) < catchDistance) {
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
            if (dist(ball.x, ball.y, baseCoords.x, baseCoords.y) < currentFielder.catchRadius) {
                outs++;
                if (DEBUG) console.log("Tagging out runner at base", intendedBase, "outs now", outs);
                baseCoords.tryToOccupy = false;
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

function checkFielderCatch(dt) {
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
    if (!ball.strikePitch && dist(ball.x, ball.y, catcherPlayer.x, catcherPlayer.y) < catchDistance) {
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
            fielder.isRecieving = false;
            // currently removed, commented in-case of unexpected disaster
            //resetInfielders();
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
                handleSideSwitchStrikeout();
                nextInning();
                return;
            }
        }
    }, 500);
}

function handleSideSwitchStrikeout() {
    if (playerSideBatting) {
        totalStrikeoutsPlayer++;
    } else {
        totalStrikeoutsOpponent++;
    }
}
