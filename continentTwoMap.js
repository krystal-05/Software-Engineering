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
let intermediateLocation;
let firstStop, secondStop;
let animLock = true;
let charMoveSpeed = 10;
let charXOffset, charYOffset;
let nextPos = [];
let levels = [];
let lvlIndx = {};
let settingMenu = false;
let audioSelectionMenu = false;
let animFinished = true;
gamestate = "continent2map";


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

function cityFive() {
    localStorage.setItem("lastSelectedLevel", '5');
    window.location.href = "game.html";
}
function citySix() {
    localStorage.setItem('lastSelectedLevel', '6');
    window.location.href = "game.html";
}
function citySeven() {
    localStorage.setItem('lastSelectedLevel', '7');
    window.location.href = "game.html";
}
function cityEight() {
    localStorage.setItem('lastSelectedLevel', '8');
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
            case '6': {
                this.levelPosition = '6';
                this.x = cityTwoLocation[0] + charXOffset;
                this.y = cityTwoLocation[1] - charYOffset;
                break;
            }
            case '7': {
                this.levelPosition = '7';
                this.x = cityThreeLocation[0] + charXOffset;
                this.y = cityThreeLocation[1] - charYOffset;
                break;
            }
            case '8': {
                this.levelPosition = '8';
                this.x = cityFourLocation[0] + charXOffset;
                this.y = cityFourLocation[1] - charYOffset;
                break;
            }
            default: {
                this.levelPosition = '5';
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
            case '5': {
                if((input === 'd' || input === 'RightArrow') && unlocked >= 6) {
                    return cityTwoLocation.concat(['6']);
                }
                break;
            } 
            case '6': {
                if(input === 'w' || input === 'UpArrow') {
                    return intermediateLocation.concat(['il']);
                } else if (input === 'a' || input === 'LeftArrow') { 
                    return cityOneLocation.concat(['5']);
                }
                break;
            }
            case 'il': {
                if((input === 'd' || input === 'RightArrow') && unlocked >= 7) { 
                    return cityThreeLocation.concat(['7']);
                } else if ((input === 'a' || input === 'LeftArrow') && unlocked >= 8) {
                    return cityFourLocation.concat(['8']);
                } else if (input === 's' || input === 'DownArrow') {
                    return cityTwoLocation.concat(['6']);
                }
                break;
            }
            case '7': {
                if(input === 'a' || input === 'LeftArrow') {
                    return intermediateLocation.concat(['il']);
                }
                break;
            }
            case '8': {
                if(input === 's' || input === 'DownArrow') {
                    return intermediateLocation.concat(['il']);
                }
            }
        }
        return false;
    }

    updatePos() {
        switch(this.levelPosition) {
            case '5': {
                this.x = cityOneLocation[0] + charXOffset;
                this.y = cityOneLocation[1] - charYOffset;
                break;
            }
            case '6': {
                this.x = cityTwoLocation[0] + charXOffset;
                this.y = cityTwoLocation[1] - charYOffset;
                break;
            }
            case 'il': {
                this.x = intermediateLocation[0] + charXOffset;
                this.y = intermediateLocation[1] - charYOffset;
            }
            case '7': {
                this.x = cityThreeLocation[0] + charXOffset;
                this.y = cityThreeLocation[1] - charYOffset;
                break;
            }
            case '8': {
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
    map = loadImage('assets/final_design/MapStuff/Island_2.png');
    levelLockImg = loadImage('assets/final_design/MapStuff/levelMarkers/Fancy_Lock_Closed.png');
    levelOneImg = loadImage('assets/final_design/MapStuff/levelMarkers/5.png');
    levelTwoImg = loadImage('assets/final_design/MapStuff/levelMarkers/6.png');
    levelThreeImg = loadImage('assets/final_design/MapStuff/levelMarkers/7.png');
    levelFourImg = loadImage('assets/final_design/MapStuff/levelMarkers/8.png');
    buttonImg = loadImage('assets/final_design/MapStuff/backbuttonMap.png');
    buttonImgHover = loadImage('assets/final_design/MapStuff/backbuttonMapHover.png');

    idleAnimation = loadImage('assets/final_design/MapStuff/Team_Bus.gif');
    runningAnimation = idleAnimation;
    unlocked = parseInt(localStorage.getItem("unlockedLevel"));
}

function createLevelButtons() {
    cityOneLocation = [windowWidth * .25, windowHeight * .625];
    cityTwoLocation = [windowWidth * .55, windowHeight * .605];
    cityThreeLocation = [windowWidth * .78, windowHeight * 0.4];
    cityFourLocation = [windowWidth * .45, windowHeight * .259];

    
    levels = [];
    
    levels.push(new level(levelOneImg, cityOneLocation[0], cityOneLocation[1], false));
    levels.push(new level(levelTwoImg, cityTwoLocation[0], cityTwoLocation[1]));
    levels.push(new level(levelThreeImg, cityThreeLocation[0], cityThreeLocation[1]));
    levels.push(new level(levelFourImg, cityFourLocation[0], cityFourLocation[1]));
    if(unlocked >= 6) {
        levels[1].lock = false;
    }
    if(unlocked >= 7) {
        levels[2].lock = false;
    }
    if(unlocked >= 8) {
        levels[3].lock = false;
    }
    
    backButton = new Button('', windowWidth * .1, windowHeight * .9, 258.3, 100, buttonImg, buttonImgHover, goBack);
    
    charXOffset = windowWidth / 25;
    charYOffset = windowHeight / 17;

    intermediateLocation = [(windowWidth * .55) - charXOffset, (windowHeight * .38) + charYOffset];
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    createLevelButtons();
    

    lvlIndx['5'] = [levels[0], cityFive];
    lvlIndx['6'] = [levels[1], citySix];
    lvlIndx['7'] = [levels[2], citySeven];
    lvlIndx['8'] = [levels[3], cityEight];

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

    
    if(inputEnabled) {
        let tmp = char.move(key);
        if(tmp && animFinished) {
            nextPos = tmp;
            char.img = runningAnimation;
            animFinished = false;
        } else if (keyCode === ENTER) {
            playSoundEffect("buttonSound");
            if(char.levelPosition != 'il') {
                lvlIndx[char.levelPosition][1]();
            }
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

function fivetosix() {
    firstStop = windowWidth * .4;

    if(char.x < firstStop && animLock) {
        char.x += charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function sixtofive() {
    firstStop = windowWidth * .42;

    if(char.x > firstStop && animLock) {
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function sixtoil() {
    firstStop = windowWidth * .55;

    if(char.x > firstStop && animLock) { 
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function iltosix() {
    firstStop = (windowHeight * .605) - charYOffset;

    if(char.y < firstStop && animLock) {
        char.y += charMoveSpeed;
        if(abs(char.y - firstStop) < charMoveSpeed) char.y = firstStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function iltoseven() {
    firstStop = windowWidth * .62;

    if(char.x < firstStop && animLock) {
        char.x += charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function seventoil() {
    firstStop = windowWidth * .64;

    if(char.x > firstStop && animLock) { 
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function iltoeight() {
    firstStop = windowWidth * .47;
    secondStop = (windowHeight * .259) - charYOffset;

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

function eighttoil() {
    firstStop = windowWidth * .47;
    secondStop = windowHeight * .38;

    if(char.x > firstStop && animLock) {
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else if (char.y < secondStop && animLock) { 
        char.y += charMoveSpeed;
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
        if(char.levelPosition === '5' && nextPos[2] === '6') {
            fivetosix();
        } else if(char.levelPosition === '6' && nextPos[2] === '5') {
            sixtofive();
        } else if(char.levelPosition === '6' && nextPos[2] === 'il') {
            sixtoil();
        } else if(char.levelPosition === 'il' && nextPos[2] === '6') {
            iltosix();
        } else if(char.levelPosition === 'il' && nextPos[2] === '7') {
            iltoseven();
        } else if(char.levelPosition === '7' && nextPos[2] === 'il') {
            seventoil();
        } else if(char.levelPosition === 'il' && nextPos[2] === '8') {
            iltoeight();
        } else if(char.levelPosition === '8' && nextPos[2] === 'il') {
            eighttoil();
        } else {
            generalAnimAlgo();
        }
    }
}