// Pitching mechanics

let pitchSkillCheckActive = false;
let sliderX = 0;
let sliderSpeed = 400;
const barWidth = 175;
const barHeight = 15;
let barX, barY;
const perfectZoneWidth = 10;
const goodZoneWidth = 40;

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
    fill(200);
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
    
    fill('white');
    ellipse(barX + sliderX, barY + barHeight / 2, barHeight, barHeight);
}