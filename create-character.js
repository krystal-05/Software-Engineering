let buttons = [], confirmButton;
let bgImage, characterImage, characterImage1;
let settingMenu = false;
let audioSelectionMenu = false;

function preload() {
    bgImage = loadImage('assets/roughititlescreen4.png');
    characterImage = loadImage('assets/tempCharacter.png');
    characterImage1 = loadImage('/assets/tempCharacter1.png');  // Load option 2's character
    soundEffects["buttonSound"] = loadSound('sounds/buttonClick.mp3');
    currSong = loadSound('sounds/stadiumSound.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    textSize(32);

    if (!currSong.isPlaying()) {
        currSong.loop();
        loadVolumeSetting();
        currSong.play();
    }

    // Set default character to Character 1 if none selected
    if (localStorage.getItem("characterTag") === null || localStorage.getItem("characterTag") === "null") {
        localStorage.setItem("characterTag", "Character 1");
    }

    buttons.push(new Button("Back", 175, height - 50, 200, 50, null, null, () => goBack()));
    buttons.push(new Button("<", width / 2 - 250, height / 2, 50, 50, null, null, () => selectedCharacter("Character 1")));
    buttons.push(new Button(">", width / 2 + 250, height / 2, 50, 50, null, null, () => selectedCharacter("Character 2")));

    confirmButton = new Button("Confirm Character", width - 645, height - 50, 200, 50, null, null, () => confirmCharacter());
}

function draw() {
    background(bgImage);
    fill(255, 215, 0);
    textSize(64);
    textStyle(BOLD);
    fill('black');
    text("Select Character", width / 2, 45);
    
    fill('rgba(100, 100, 100, 0.8)');
    rect(width / 2, height / 2 + 50, 400, 450, 20);

    textSize(32);
    fill('black');

    let characterTag = localStorage.getItem("characterTag");

    if (characterTag === "Character 1") {
        text("Character 1", width / 2, height / 2 - 200);
        image(characterImage, width / 2 - 200, height / 2 - 175, 400, 400);
    } else if (characterTag === "Character 2") {
        text("Character 2", width / 2, height / 2 - 200);
        image(characterImage1, width / 2 - 200, height / 2 - 175, 400, 400); // ✅ Show new image
    } else {
        text("Select a Preset", width / 2, height / 2 - 200);
    }

    for (let btn of buttons) {
        btn.display();
    }

    if (characterTag !== "null") {
        confirmButton.display();
    }
}

function mousePressed() {
    for (let btn of buttons) {
        if (btn.isHovered() && btn.action) {
            buttonClick();
            setTimeout(() => btn.action(), 200);
        }
    }

    if (confirmButton.isHovered() && localStorage.getItem("characterTag") !== "null") {
        buttonClick();
        setTimeout(() => confirmButton.action(), 200);
    }

    if (!currSong.isPlaying()) {
        currSong.loop();
    }
}

function selectedCharacter(characterTag) {
    localStorage.setItem("characterTag", characterTag);
    console.log("selected character ", characterTag);
}

function confirmCharacter() {
    let characterTag = localStorage.getItem("characterTag");
    localStorage.setItem("confirmedPreset", characterTag);
    localStorage.setItem("isLoad1", "true");
    localStorage.setItem("characterTag", null);
    window.location.href = "map.html";
}

function buttonClick() {
    playSoundEffect("buttonSound");
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

function goBack() {
    localStorage.setItem("gameState", "loadGame");
    window.location.href = "index.html";
}
