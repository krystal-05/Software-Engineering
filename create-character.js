let buttons = [], confirmButton;
let bgImage, characterImage, characterImage1;
let settingMenu = false;
let audioSelectionMenu = false;
gameState = "createCharacter";

function preload() {
    bgImage = loadImage('assets/final_design/start_screen.png');
    characterImage = loadImage('assets/final_design/Clarke/ClarkeBaseIdle.gif');
    characterImage1 = loadImage('/assets/final_design/Claira/ClairaBaseIdle.gif');  // Load option 2's character
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

    // Set default character to Clarke if none selected
    if (localStorage.getItem("characterTag") === null || localStorage.getItem("characterTag") === "null") {
        localStorage.setItem("characterTag", "Clarke");
    }

    createCharacterButtons();
    createModal();
    hideLoadingScreen();
}

function draw() {
    let imgWidth = width * .25;
    let imgHeight = imgWidth;

    background(bgImage);
    fill(255, 215, 0);
    let dynamicSize = width * 0.05;
    textSize(dynamicSize);
    textStyle(BOLD);
    //fill('black');
    //text("Select Character", width / 2, height * .05);
    
    fill('rgba(100, 100, 100, 0.8)');
    rect(width / 2, height * .55, imgWidth * 1.1, imgHeight * 1.2, 20);

    textSize(32);
    fill('black');

    let characterTag = localStorage.getItem("characterTag");
    cursor('default');

    if (characterTag === "Clarke") {
        let scopedDynamicSize = width * 0.025;
        textSize(scopedDynamicSize);
        text("Clarke", width / 2, height * .2);
        image(characterImage, width / 2 - imgWidth / 2, height / 1.83 - imgHeight / 2, imgWidth, imgHeight);
    } else if (characterTag === "Claira") {
        let scopedDynamicSize = width * 0.025;
        textSize(scopedDynamicSize);
        text("Claira", width / 2, height * .2);
        image(characterImage1, width / 2 - imgWidth / 2, height / 1.83 - imgHeight / 2, imgWidth, imgHeight);
    } else {
        let scopedDynamicSize = width * 0.025;
        textSize(scopedDynamicSize);
        text("Select a Preset", width / 2, height * .2);
    }

    for (let btn of buttons) {
        btn.display();
    }

    if (characterTag !== "null") {
        confirmButton.display();
    }
}

function mousePressed() {
    if(inputEnabled) {
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
}

function selectedCharacter(characterTag) {
    localStorage.setItem("characterTag", characterTag);
    if (DEBUG) console.log("selected character ", characterTag);
}

function confirmCharacter() {
    let characterTag = localStorage.getItem("characterTag");
    localStorage.setItem("confirmedPreset", characterTag);
    localStorage.setItem("isLoad1", "true");
    localStorage.setItem("characterTag", null);
    window.location.href = "map.html";
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

function createCharacterButtons() {
    buttons = [];
    let buttonHeight = windowHeight * 0.05;
    let baseDefWidth = width * 0.125;
    let baseDefHeight = baseDefWidth / 4;
    let minDefConfirmWidth = 140;
    let minDefWidth = 120;
    let minDefHeight = 30;
    let defConfirmButtonWidth = Math.max(baseDefWidth, minDefConfirmWidth);
    let defButtonWidth = Math.max(baseDefWidth, minDefWidth);
    let defButtonHeight = Math.max(baseDefHeight, minDefHeight);

    buttons.push(new Button("Back", width * .15, height * .925, defButtonWidth, defButtonHeight, null, null, () => backToMenu()));
    buttons.push(new Button("<", width * .325, height * .55, buttonHeight, buttonHeight, null, null, () => selectedCharacter("Clarke")));
    buttons.push(new Button(">", width * .675, height * .55, buttonHeight, buttonHeight, null, null, () => selectedCharacter("Claira")));

    confirmButton = new Button("Confirm Character", width / 2, height * .925, defConfirmButtonWidth, defButtonHeight, null, null, () => confirmCharacter());
}

function keyPressed() {
    if(key == 'Escape') {
        settingsClick();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    createCharacterButtons();
}