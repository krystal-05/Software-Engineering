let backButton;
let settingMenu = false;
let audioSelectionMenu = false;
gameState = "credits";
let boyImage, girlImage;
let audio7;

let teammates = [
    { name: "Oscar \nArtistic Director/Designer", gender: "boy", x: 0, y: 0 },
    { name: "Vidhi \nLead Programmer", gender: "girl", x: 0, y: 0 },
    { name: "Keegan \nLead Programmer", gender: "boy", x: 0, y: 0 },
    { name: "Trevor \nLead Programmer", gender: "boy", x: 0, y: 0 },
    { name: "Krystal \nDesigner/Programmer", gender: "girl", x: 0, y: 0 },
    { name: "Isra \nProgrammer", gender: "girl", x: 0, y: 0 },
    { name: "Antonio \nMap Programmer", gender: "boy", x: 0, y: 0 },
    { name: "Tristian \nMap Programmer", gender: "boy", x: 0, y: 0 },
    { name: "Josh \nMap Designer", gender: "boy", x: 0, y: 0 }
];

let currentTeammateIndex = 0;
let teammateTimer = 0;
let isStopped = false;
let nameVisible = false;

function preload() {
    audio7 = loadSound('sounds/credits.mp3');

    soundEffects["buttonSound"] = loadSound("sounds/buttonClick.mp3");
    boyImage = loadImage('assets/final_design/Clarke/ClarkeBatRunLft.gif');
    girlImage = loadImage('assets/final_design/Claira/ClairaBatRunLft.gif');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(20);
    loadVolumeSetting();

    if (audio7) {
        audio7.play();
    }

    backButton = new Button("Back", 175, height - 50, 200, 50, null, null, () => backToMenu());
    createModal();
    hideLoadingScreen();

    teammates.forEach(teammate => {
        teammate.x = width + 100;
        teammate.y = height - 150;
    });
}

function draw() {
    background(252, 157, 154);
    drawSkyElements();
    drawGrass();

    if (gameState === "credits") {
        let currentTeammate = teammates[currentTeammateIndex];
        moveTeammate(currentTeammate);
        displayTeammate(currentTeammate);

        if (isStopped) {
            teammateTimer += deltaTime / 1000;
            if (teammateTimer >= 2) { 
                isStopped = false;
                nameVisible = false;
            }
        }

        if (!isStopped && currentTeammate.x < -100) {
            teammateTimer = 0;
            currentTeammateIndex++;
            if (currentTeammateIndex >= teammates.length) {
                currentTeammateIndex = 0;
            }
            resetTeammatePosition(teammates[currentTeammateIndex]);
        }
    }

    backButton.display();
}

function moveTeammate(teammate) {
    if (!isStopped) {
        teammate.x -= 6;

        if (teammate.x <= width / 2 && !nameVisible) {
            isStopped = true;
            nameVisible = true;
        }
    }
}

function drawGrass() {
    fill(34, 139, 34);
    rect(0, height - 300, width, 300);

    stroke(0, 100, 0);
    for (let i = 0; i < width; i += 8) {
        let bladeHeight = random(20, 40);
        line(i, height - 300, i + random(-5, 5), height - 300 - bladeHeight);
    }
    noStroke();
}


function drawSkyElements() {
    fill(255, 94, 77);
    noStroke();
    ellipse(width - 150, height - 300, 100, 100);

    
    fill(255, 200);
    drawCloud(250, 150);
    drawCloud(500, 200);
    drawCloud(750, 120);

    stroke(80);
    strokeWeight(2);
    noFill();
    drawBird(350, 250);
    drawBird(600, 300);
    drawBird(700, 230);
    noStroke();
}

function drawCloud(x, y) {
    ellipse(x, y, 60, 60);
    ellipse(x + 30, y + 10, 50, 50);
    ellipse(x - 30, y + 10, 50, 50);
}

function drawBird(x, y) {
    beginShape();
    vertex(x, y);
    vertex(x + 10, y - 10);
    vertex(x + 20, y);
    endShape();
}

function displayTeammate(teammate) {
    let img = (teammate.gender === "boy") ? boyImage : girlImage;
    imageMode(CENTER);
    image(img, teammate.x, teammate.y, 200, 200);

    if (nameVisible) {
        textAlign(CENTER, BOTTOM);
        textSize(24);
        fill(0);
        text(teammate.name, teammate.x, teammate.y - 90);
    }
}

function resetTeammatePosition(teammate) {
    teammate.x = width + 100;
    teammate.y = height - 150;
}

function drawGrass() {
    fill(34, 139, 34); // Grass green
    rect(0, height - 100, width, 100);
}

function mousePressed() {
    if (settingMenu) return;
    if (backButton.isHovered()) {
        if (soundEffects["buttonSound"] && soundEffects["buttonSound"] !== null) {
            buttonClick();
        }
        setTimeout(() => backButton.action(), 200);
    }
    if (currSong && !currSong.isPlaying()) {
        currSong.play();
        currSong.loop();
    }
}

function loadVolumeSetting() {
    const savedVolume = localStorage.getItem("volume");
    const savedMute = localStorage.getItem("isMuted");
    const savedEffectsVolume = localStorage.getItem("effectsVolume");

    if (savedVolume !== null) {
        currVolume = parseFloat(savedVolume);
    }
    if (savedEffectsVolume !== null) {
        currEffectsVolume = parseFloat(savedEffectsVolume);
    }
    isMuted = savedMute !== null ? (savedMute === "true") : false;

    if (currSong) {
        currSong.amp(isMuted ? 0 : currVolume);
    }
    Object.values(soundEffects).forEach((sound) => {
        sound.amp(isMuted ? 0 : currEffectsVolume);
    });
}

function keyPressed() {
    if (key == 'Escape') {
        settingsClick();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resetCreditButtonLocation();
}
