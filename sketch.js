let buttons = [];
let loadButtons = [];
let isLoad1 = "false";
let settingMenu = false;
let bgImage, titleIcon;
let settingsImg, settingsImgHover, creditsImg, creditsImgHover, howToImg, howToImgHover;
let audioSelectionMenu = false;
let loadButtonWidth, loadButtonHeight;

function preload() {
    bgImage = loadImage('assets/final_design/start_screen.png');
    titleIcon = loadImage('assets/OREDTitle.png');
    settingsImg = loadImage('assets/OSettings_1.png');
    settingsImgHover = loadImage('assets/OSettings_2.png');
    creditsImg = loadImage('assets/OCredits_1.png');
    creditsImgHover = loadImage('assets/OCredits_2.png');
    howToImg = loadImage('assets/OHowTo_1.png');
    howToImgHover = loadImage('assets/OHowTo_2.png');
    currSong = loadSound('sounds/mainScreenSound.mp3');
    soundEffects["buttonSound"] = loadSound('sounds/buttonClick.mp3');
    premenuImage = loadImage('assets/green.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    textSize(32);

    isLoad1 = localStorage.getItem("isLoad1");
    loadVolumeSetting();

    let storedState = localStorage.getItem("gameState");
    if (storedState) {
        gameState = storedState;
        localStorage.removeItem("gameState");
    }
    
    startMenuButtons();
    loadMenuButtons();
    createModal();
    createInitialPopup();
}

function draw() {
    background(bgImage);

    switch (gameState) {
        case "preMenu":
            drawInitialPopup();
            break;
        case "menu":
            drawMainMenu();
            break;
        case "loadGame":
            drawLoadScreen();
            break;
        default:
    }
}
function drawInitialPopup(){
    background(premenuImage);
    let scaleFactor = Math.max(width / premenuImage.width, height / premenuImage.height);
    let drawWidth = premenuImage.width * scaleFactor;
    let drawHeight = premenuImage.height * scaleFactor;
    image(premenuImage, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    showInitialPopup();
}

function drawMainMenu() {
    background(bgImage);

    let scaleFactor = Math.max(width / bgImage.width, height / bgImage.height);
    let drawWidth = bgImage.width * scaleFactor;
    let drawHeight = bgImage.height * scaleFactor;
    image(bgImage, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

    let rawIconWidth  = width * 0.4;
    let baseIconWidth = constrain(rawIconWidth, 500, width);
    let iconScale = baseIconWidth / titleIcon.width;
    let baseIconHeight = titleIcon.height * iconScale;
    image(titleIcon, (width - baseIconWidth) / 2, height * 0.01, baseIconWidth, baseIconHeight);

    fill(255, 215, 0);
    textSize(60);
    textStyle(BOLD);
    textStyle(NORMAL);
    
    cursor('default');
    for (let btn of buttons) {
        btn.display();
    }
}

function drawLoadScreen() {
    background(bgImage);
    let scaleFactor = Math.max(width / bgImage.width, height / bgImage.height);
    let drawWidth = bgImage.width * scaleFactor;
    let drawHeight = bgImage.height * scaleFactor;
    image(bgImage, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

    fill(255, 215, 0);
    textSize(60);
    textStyle(BOLD);

    let rawIconWidth  = width * 0.4;
    let baseIconWidth = constrain(rawIconWidth, 500, width);
    let iconScale = baseIconWidth / titleIcon.width;
    let baseIconHeight = titleIcon.height * iconScale;
    image(titleIcon, (width - baseIconWidth) / 2, height * 0.01, baseIconWidth, baseIconHeight);

    cursor('default');
    for (let btn of loadButtons) {
        btn.display();
    }
    if (isLoad1 === "true") {
        resetButton.display();
    }
}

function mousePressed() {
    if (gameState === "preMenu") {
        initialPopup.style.display = "none";
        gameState = "menu";
        return;
    }

    if (settingMenu) { return; }

    let activeButtons = (gameState === "menu") ? buttons : loadButtons;
    for (let btn of activeButtons) {
        if (btn.isHovered() && btn.action && gameState !== "preMenu") {
            buttonClick();
            setTimeout(() => btn.action(), 200);
        }
    }
    if (gameState === "loadGame" && resetButton.isHovered() && localStorage.getItem("isLoad1") !== "false") {
        buttonClick();
        setTimeout(() => resetButton.action(), 200);
    }
    if (currSong && !currSong.isPlaying()) {
        currSong.amp(isMuted ? 0 : currVolume);
        currSong.play();
        currSong.loop();
    }
}

function goBack() {
    gameState = "menu";
}

function loadCharacterSelect() {
    window.location.href = "create-character.html";
}
function loadGame() {
    if (isLoad1 === "true") {
        window.location.href = "map.html";
    } else {
        loadCharacterSelect();
    }
}
function loadlogin() {
    window.location.href = "login.html";
}
function loadCredits() {
    window.location.href = "credits.html";
}
function loadHowTo(){
    window.location.href = "how-to.html";
}
function deleteSave() {
    localStorage.removeItem("unlockedLevel");
    localStorage.removeItem("lastSelectedLevel");

    localStorage.setItem("isLoad1", false);
    isLoad1 = localStorage.getItem("isLoad1");
}

function startMenuButtons() {
    buttons = [];
    let baseStartWidth = width * 0.15;
    let baseStartHeight = baseStartWidth / 4;
    let minStartWidth = 120;
    let minStartHeight = 40;
    let startButtonWidth = Math.max(baseStartWidth, minStartWidth);
    let startButtonHeight = Math.max(baseStartHeight, minStartHeight);

    let buttonSize = min(width * 0.15, height * 0.15);
    let gap = buttonSize * 0.1;
    let marginRight = buttonSize * .2;
    let totalButtonsWidth = buttonSize * 2 + gap;
    let startX = width - totalButtonsWidth - marginRight;
    let buttonY = height - buttonSize - (buttonSize * 0.2);

    buttons.push(new Button("Start Game", width / 2, height * 0.75, startButtonWidth, startButtonHeight, null, null, () => gameState = "loadGame"));
    buttons.push(new Button("Settings", startX + buttonSize + gap + buttonSize / 2, buttonY + buttonSize / 2, buttonSize, buttonSize, settingsImg, settingsImgHover, () => settingsClick()));
    buttons.push(new Button("Credits", startX + buttonSize / 2, buttonY + buttonSize / 2, buttonSize, buttonSize, creditsImg, creditsImgHover, () => loadCredits()));
    buttons.push(new Button(
        "How To",
        buttonSize * 0.6,                             // X: small offset from left
        height - buttonSize * 0.6,                    // Y: near bottom
        buttonSize,
        buttonSize,
        howToImg,
        howToImgHover,
        () => loadHowTo(),
        false,
        false,
        true // This sets isHowToButton true
    ));
    
}

function loadMenuButtons() {
    loadButtons = [];
    let baseLoadWidth = width * 0.15;
    let baseLoadHeight = baseLoadWidth / 4;
    let minLoadWidth = 120;
    let minLoadResetWidth = 140;
    let minLoadHeight = 40;
    let loadButtonWidth = Math.max(baseLoadWidth, minLoadWidth);
    let loadResetButtonWidth = Math.max(baseLoadWidth, minLoadResetWidth);
    let loadButtonHeight = Math.max(baseLoadHeight, minLoadHeight);

    loadButtons = [
        new Button("Game 1", width / 2, height * .45, loadButtonWidth, loadButtonHeight, null, null, () => loadGame()),
        new Button("Back", width * .1, height * .925, loadButtonWidth, loadButtonHeight, null, null, () => goBack())
    ];
    resetButton = new Button("Reset Game Save", width / 2, height * .55, loadResetButtonWidth, loadButtonHeight, null, null, () => deleteSave());
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
    if(key === 'Escape' && gameState == "menu") {
        settingsClick();
    }
    else if (key === 'Escape' && !(gameState == "menu")) {
        goBack();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    buttons = [];
    loadButtons = [];
    startMenuButtons();
    loadMenuButtons();
}