// Pitching mechanics

let pitchSkillCheckActive = false;
let sliderX = 0;
let sliderSpeed = 400;
const barWidth = 175;
const barHeight = 15;
let barX, barY;
const perfectZoneWidth = 10;
const goodZoneWidth = 40;

function preload() {
    ballImg = loadImage('assets/Baseball1.png');}

function startPitch() {
    pitchSkillCheckActive = true;
    sliderX = random(0, barWidth);

    barX = width / 2 - barWidth / 2;
    barY = height - 100;
}

function evaluatePitchMultiplier() {
    if (!pitchSkillCheckActive) return 1.0;
    
    let sliderPos = barX + sliderX;
    let perfectZoneCenter = barX + (barWidth / 2);
    let diff = abs(sliderPos - perfectZoneCenter);
    
    let multiplier;
    if (diff <= perfectZoneWidth / 2) {
        multiplier = 1.7; // perfect pitch
    } else if (diff <= goodZoneWidth / 2) {
        multiplier = 1.3; // good pitch
    } else {
        multiplier = 1.0;
    }
    pitchSkillCheckActive = false;
    return multiplier;
}

function drawSkillCheckBar(dt) {
    fill(100);
    rect(barX, barY, barWidth, barHeight);
    
    let goodZoneX = barX + (barWidth - goodZoneWidth) / 2;
    fill('yellow');
    rect(goodZoneX, barY, goodZoneWidth, barHeight);

    let perfectZoneX = barX + (barWidth - perfectZoneWidth) / 2;
    fill('green');
    rect(perfectZoneX, barY, perfectZoneWidth, barHeight);
    
    sliderX += sliderSpeed * dt;
    if (sliderX < 0 || sliderX > barWidth) {
        sliderSpeed = -sliderSpeed;
        sliderX += sliderSpeed * dt;
    }
    
    fill('red');
    image(ballImg, barX + sliderX - barHeight/2, barY, barHeight, barHeight);
}

function userPitch() {
    if (pitchSkillCheckActive) {
        let pitchMultiplier = evaluatePitchMultiplier();
        if (DEBUG) console.log("Pitch multiplier:", pitchMultiplier);

        ball.speedY *= pitchMultiplier;
        pitchSkillCheckActive = false;
        pitchAnimation = true;
        botAttemptHit(ball.speedY);
        return;
    }
    if (!ballMoving && inputEnabled && !pitchSkillCheckActive) {
        startPitch();
        return;
    }
    if (!ballMoving && inputEnabled) {
        pitchAnimation = true;
        swingAttempt = false;
    }
}