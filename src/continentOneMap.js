let map;
let unlocked;
let backButton;
let buttonImg, buttonImgHover;
let idleAnimation;
let runningAnimation;
let levelOneImg, levelTwoImg, levelThreeImg, levelFourImg;
let levelLockImg;
let cityOneLocation;
let cityTwoLocation;
let cityThreeLocation;
let cityFourLocation;
let charMoveSpeed = 10;
let charXOffset, charYOffset;
let nextPos = [];
let levels = [];
let lvlIndx = {};
let settingMenu = false;
let audioSelectionMenu = false;
let howToMenu = false;
let animFinished = true;
let animLock = true;
let animLock2 = true;
gamestate = "continent1map";

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

function cityOne() {
    localStorage.setItem("lastSelectedLevel", '1');
    window.location.href = "game.html";
}
function cityTwo() {
    localStorage.setItem('lastSelectedLevel', '2');
    window.location.href = "game.html";
}
function cityThree() {
    localStorage.setItem('lastSelectedLevel', '3');
    window.location.href = "game.html";
}
function cityFour() {
    localStorage.setItem('lastSelectedLevel', '4');
    window.location.href = "game.html";
}
function goBack() {
    window.location.href = "worldMap.html";
}

class character {
    constructor() {
        // Change this to change the character sprite I didn't know what quite to use for it
        this.img = idleAnimation;
        
        // Uses locally stored "lastSelectedLevel" to set char starting position
        let lastSelected = localStorage.getItem("lastSelectedLevel");
        switch(lastSelected) {
            case '2': {
                this.levelPosition = '2';
                this.x = cityTwoLocation[0] + charXOffset;
                this.y = cityTwoLocation[1] - charYOffset;
                break;
            }
            case '3': {
                this.levelPosition = '3';
                this.x = cityThreeLocation[0] + charXOffset;
                this.y = cityThreeLocation[1] - charYOffset;
                break;
            }
            case '4': {
                this.levelPosition = '4';
                this.x = cityFourLocation[0] + charXOffset;
                this.y = cityFourLocation[1] - charYOffset;
                break;
            }
            default: {
                this.levelPosition = '1';
                this.x = cityOneLocation[0] + charXOffset;
                this.y = cityOneLocation[1] - charYOffset;
            }
        }
        this.width = 108;
        this.height = 50;
    }
    
    // returns location of city to be moved to if a move can be made
    move(input) {
        switch(this.levelPosition) {
            case '1': {
                if((input === 'a' || input === 'LeftArrow') && unlocked >= 2) {
                    return cityTwoLocation.concat(['2']);
                } 
                break;
            } 
            case '2': {
                if((input === 's' || input === 'DownArrow') && unlocked >= 4) {
                    return cityFourLocation.concat(['4']);
                } else if((input === 'a' || input === 'LeftArrow') && unlocked >= 3) {
                    return cityThreeLocation.concat(['3']);
                } else if(input === 'd' || input === 'RightArrow') {
                    return cityOneLocation.concat(['1']);
                }
                break;
            }
            case '3': {
                if(input === 'd' || input === 'RightArrow') {
                    return cityTwoLocation.concat(['2']);
                } 
                break;
            }
            case '4': {
                if(input === 'w' || input === 'UpArrow') {
                    return cityTwoLocation.concat(['2']);
                }
            }
        }
        return false;
    }

    updatePos() {
        switch(this.levelPosition) {
            case '1': {
                this.x = cityOneLocation[0] + charXOffset;
                this.y = cityOneLocation[1] - charYOffset;
                break;
            }
            case '2': {
                this.x = cityTwoLocation[0] + charXOffset;
                this.y = cityTwoLocation[1] - charYOffset;
                break;
            }
            case '3': {
                this.x = cityThreeLocation[0] + charXOffset;
                this.y = cityThreeLocation[1] - charYOffset;
                break;
            }
            case '4': {
                this.x = cityFourLocation[0] + charXOffset;
                this.y = cityFourLocation[1] - charYOffset;
                break;
            }
        }
    }

    drawChar() {
        imageMode(CENTER);
        image(char.img, char.x, char.y, char.width, char.height);
        imageMode(CORNER);
    }
}

class level {
    constructor(img, x, y, lock = true, width = 60, height = 60) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.lock = lock;
        this.width = width;
        this.height = height;
    }

    drawLevel(){
        image(this.img, this.x, this.y, this.width, this.height);

        if(this.lock) {
            image(levelLockImg, this.x + 20, this.y + 20, 25, 29);
        }
    }
}

function preload() {
    map = loadImage('assets/final_design/MapStuff/Island_1.png');
    levelLockImg = loadImage('assets/final_design/MapStuff/levelMarkers/Fancy_Lock_Closed.png');
    levelOneImg = loadImage('assets/final_design/MapStuff/levelMarkers/1.png');
    levelTwoImg = loadImage('assets/final_design/MapStuff/levelMarkers/2.png');
    levelThreeImg = loadImage('assets/final_design/MapStuff/levelMarkers/3.png');
    levelFourImg = loadImage('assets/final_design/MapStuff/levelMarkers/4.png');
    buttonImg = loadImage('assets/final_design/MapStuff/backbuttonMap.png');
    buttonImgHover = loadImage('assets/final_design/MapStuff/backbuttonMapHover.png');


    idleAnimation = loadImage('assets/final_design/MapStuff/Team_Bus.gif');
    runningAnimation = idleAnimation;
    unlocked = parseInt(localStorage.getItem("unlockedLevel"));
}

function createLevelButtons() {
    cityOneLocation = [windowWidth / 1.56, windowHeight / 2.28];
    cityTwoLocation = [windowWidth / 2.95, windowHeight / 2.13];
    cityThreeLocation = [windowWidth / 7.7, windowHeight / 4.4];
    cityFourLocation = [windowWidth / 2.5, windowHeight / 1.21];

    levels = [];

    levels.push(new level(levelOneImg, cityOneLocation[0], cityOneLocation[1], false));
    levels.push(new level(levelTwoImg, cityTwoLocation[0], cityTwoLocation[1]));
    levels.push(new level(levelThreeImg, cityThreeLocation[0], cityThreeLocation[1]));
    levels.push(new level(levelFourImg, cityFourLocation[0], cityFourLocation[1]));
    if(unlocked >= 2) {
        levels[1].lock = false;
    }
    if(unlocked >= 3) {
        levels[2].lock = false;
    }
    if(unlocked >= 4) {
        levels[3].lock = false;
    }

    backButton = new Button('', windowWidth * .1, windowHeight * .9, 258.3, 100, buttonImg, buttonImgHover, goBack);

    charXOffset = windowWidth / 25;
    charYOffset = windowHeight / 17;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    createLevelButtons();
    
    lvlIndx['1'] = [levels[0], cityOne];
    lvlIndx['2'] = [levels[1], cityTwo];
    lvlIndx['3'] = [levels[2], cityThree];
    lvlIndx['4'] = [levels[3], cityFour];

    char = new character;

    createUnlockIncrement(unlocked);
    loadVolumeSetting();
    createModal();
    hideLoadingScreen();
}

function mousePressed() {
    if(inputEnabled) {
        if(backButton.isHovered() && backButton.action) {
            buttonClick();
                setTimeout(() => backButton.action(), 200);
        }
        if(levelUnlockIncrement.isHovered() && levelUnlockIncrement.action) {
            levelUnlockIncrement.action();
        }
    }
}

function keyPressed() {
    if(DEBUG) console.log(`Key pressed: ${key}, KeyCode: ${keyCode}`);

    if (key === 'Escape') {
        settingsClick();
    }

    if (inputEnabled) {
        let inputKey;
        switch (keyCode) {
            case LEFT_ARROW:
                inputKey = 'LeftArrow';
                break;
            case RIGHT_ARROW:
                inputKey = 'RightArrow';
                break;
            case UP_ARROW:
                inputKey = 'UpArrow';
                break;
            case DOWN_ARROW:
                inputKey = 'DownArrow';
                break;
            default:
                inputKey = key; // For other keys like 'a', 's', etc.
        }

        if(DEBUG) console.log(`Mapped inputKey: ${inputKey}`);

        let tmp = char.move(inputKey);
        if (tmp && animFinished) {
            nextPos = tmp;
            char.img = runningAnimation;
            animFinished = false;
        } else if (keyCode === ENTER) {
            playSoundEffect("buttonSound");
            lvlIndx[char.levelPosition][1]();
        }

        return false;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    createLevelButtons();
    createUnlockIncrement(unlocked);
    char.updatePos();
}

function generalAnimAlgo() {
    if(nextPos[0] + charXOffset === char.x && nextPos[1] - charYOffset === char.y) {
        animFinished = true;
        char.levelPosition = nextPos[2];
        char.img = idleAnimation;
        animLock = true;
        animLock2 = true;
    }

    if(abs(nextPos[0] + charXOffset - char.x) < charMoveSpeed) {
        char.x = nextPos[0] + charXOffset;
    }

    if(abs(nextPos[1] - charYOffset - char.y) < charMoveSpeed) {
        char.y = nextPos[1] - charYOffset;
    }

    if (nextPos[0] + charXOffset < char.x) {
        char.x -= charMoveSpeed;
    } else if (nextPos[0] + charXOffset > char.x) {
        char.x += charMoveSpeed;
    }

    if (nextPos[1] - charYOffset < char.y) {
        char.y -= charMoveSpeed;
    } else if (nextPos[1] - charYOffset > char.y){
        char.y += charMoveSpeed;
    }
}

function onetotwo() {
    firstStop = windowWidth * .46;

    if(char.x > firstStop && animLock) { 
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function twotoone() {
    firstStop = windowWidth * .46;

    if(char.x < firstStop && animLock) { 
        char.x += charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function twotofour() {
    firstStop = windowWidth * .41;
    secondStop = windowHeight * .73;

    if(char.x < firstStop && animLock) {
        char.x += charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else if (char.y < secondStop && animLock) { 
        char.y += charMoveSpeed;
        if(abs(char.y - secondStop) < charMoveSpeed) char.y = secondStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function fourtotwo() {
    firstStop = windowWidth * .41;
    secondStop = (windowHeight / 2.13) - charYOffset

    if(char.x > firstStop && animLock) {
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else if (char.y > secondStop && animLock) {
        char.y -= charMoveSpeed;
        if(abs(char.y - secondStop) < charMoveSpeed) char.y = secondStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function draw() {
    background(0);
    image(map, 0, 0, windowWidth, windowHeight);
    cursor('default');

    backButton.display();
    if (DEBUG) {
        levelUnlockIncrement.display();
    }
    imageMode(CENTER);
    for (let lvl of levels) {
        lvl.drawLevel();
    }
    imageMode(CORNER);

    char.drawChar();

    if(!animFinished) {
        if(char.levelPosition === '1' && nextPos[2] === '2') {
            onetotwo();
        } else if (char.levelPosition === '2' && nextPos[2] === '1'){
            twotoone()
        } else if (char.levelPosition === '2' && nextPos[2] === '4') {
            twotofour()
        } else if(char.levelPosition === '4' && nextPos[2] === '2') {
            fourtotwo();
        } else {
            generalAnimAlgo();
        }
    }
}