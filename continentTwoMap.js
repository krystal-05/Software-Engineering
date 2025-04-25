let map;
let unlocked;
let idleAnimation;
let runningAnimation;
let levelOneImg, levelTwoImg, levelThreeImg, levelFourImg;
let levelLockImg;
let cityOneLocation;
let cityTwoLocation;
let cityThreeLocation;
let cityFourLocation;
let firstStop, secondStop, thirdStop, fourthStop;
let animLock = true;
let animLock2 = true;
let charMoveSpeed = 10;
let charXOffset, charYOffset;
let nextPos = [];
let levels = [];
let lvlIndx = {};
let settingMenu = false;
let audioSelectionMenu = false;
let animFinished = true;
let animCounter = 0;
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
                if(input === 'a' && unlocked >= 6) {
                    return cityTwoLocation.concat(['6']);
                } if(input === 's' && unlocked >= 7) {
                    return cityThreeLocation.concat(['7']);
                }
                break;
            } 
            case '6': {
                if(input === 'a' && unlocked >= 8) {
                    return cityFourLocation.concat(['8']);
                } else if(input === 'd') {
                    return cityOneLocation.concat(['5']);
                }
                break;
            }
            case '7': {
                if(input === 'w') {
                    return cityOneLocation.concat(['5']);
                } else if(input === 'a') {
                    return cityFourLocation.concat(['8']);
                }
                break;
            }
            case '8': {
                if(input === 'w' || input === 'd') {
                    return cityTwoLocation.concat(['6']);
                } else if(input === 's') {
                    return cityThreeLocation.concat(['7']);
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

    idleAnimation = loadImage('assets/final_design/MapStuff/Team_Bus.gif');
    runningAnimation = idleAnimation;
    unlocked = parseInt(localStorage.getItem("unlockedLevel"));
}

function createLevelButtons() {
    cityOneLocation = [windowWidth / 1.37, windowHeight / 2.23];
    cityTwoLocation = [windowWidth / 2.25, windowHeight / 3.2];
    cityThreeLocation = [windowWidth / 1.54, windowHeight / 1.3];
    cityFourLocation = [windowWidth / 4.5, windowHeight / 1.8];

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

    charXOffset = windowWidth / 25;
    charYOffset = windowHeight / 17;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    createLevelButtons();
    

    lvlIndx['5'] = [levels[0], cityFive];
    lvlIndx['6'] = [levels[1], citySix];
    lvlIndx['7'] = [levels[2], citySeven];
    lvlIndx['8'] = [levels[3], cityEight];

    char = new character;

    loadVolumeSetting();
    createModal();
    hideLoadingScreen();
}

function keyPressed() {
    if(key === 'Escape') {
        settingsClick();
    }
    
    if(inputEnabled) {
        let tmp = char.move(key);
        if(tmp && animFinished) {
            nextPos = tmp;
            char.img = runningAnimation;
            animFinished = false;
        } else if (keyCode === ENTER) {
            playSoundEffect("buttonSound");
            localStorage.setItem("thisLevel", char.levelPosition);
            lvlIndx[char.levelPosition][1]();
        }
        
        return false;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    createLevelButtons();
    char.updatePos();
}

function generalAnimAlgo() {
    if(nextPos[0] + charXOffset === char.x && nextPos[1] - charYOffset === char.y) {
        animFinished = true;
        animCounter = 0;
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

function fivetosix() {
    firstStop = windowWidth * .59;
    if(char.x > firstStop && animLock) {
        char.x -= charMoveSpeed;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function sixtofive() {
    let firstStop = windowWidth * .5;
    if(char.x < firstStop) {
        char.x += charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        generalAnimAlgo();
    }
}

function fivetoseven() {
    firstStop = windowWidth * .73;
    secondStop = windowHeight * .52;
    thirdStop = windowWidth * .65;
    fourthStop = (windowHeight / 1.3) - charYOffset;

    if(char.x > firstStop && animLock) {
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else if (char.y < secondStop && animLock) { 
        char.y += charMoveSpeed;
        if(abs(char.y - secondStop) < charMoveSpeed) char.y = secondStop;
    } else if (char.x > thirdStop && animLock) {
        char.x -= charMoveSpeed;
        if(abs(char.x - thirdStop) < charMoveSpeed) char.x = thirdStop;
    } else if (char.y < fourthStop && animLock) {
        char.y += charMoveSpeed;
        if(abs(char.y - fourthStop) < charMoveSpeed) char.y = fourthStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function seventofive() {
    firstStop = windowWidth * .65;
    secondStop = windowHeight * .52;
    thirdStop = windowWidth * .73;
    fourthStop = (windowHeight / 2.23) - charYOffset;

    if(char.x > firstStop && animLock && animLock2) {
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else if(char.y > secondStop && animLock && animLock2) {
        char.y -= charMoveSpeed;
        if(abs(char.y - secondStop) < charMoveSpeed) char.y = secondStop;
    } else if(char.x < thirdStop && animLock) {
        animLock2 = false;
        char.x += charMoveSpeed;
        if(abs(char.x - thirdStop) < charMoveSpeed) char.x = thirdStop;
    } else if(char.y > fourthStop && animLock) {
        char.y -= charMoveSpeed;
        if(abs(char.y - fourthStop) < charMoveSpeed) char.y = fourthStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function seventoeight() {
    firstStop = windowWidth * .51;
    secondStop = windowHeight * .58;
    thirdStop = windowWidth * .27;

    if(char.x > firstStop && animLock) {
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else if(char.y > secondStop && animLock) { 
        char.y -= charMoveSpeed;
        if(abs(char.y - secondStop) < charMoveSpeed) char.y = secondStop;
    } else if(char.x > thirdStop && animLock) {
        char.x -= charMoveSpeed;
        if(abs(char.x - thirdStop) < charMoveSpeed) char.x = thirdStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function eighttoseven() {
    firstStop = windowHeight * .58;
    secondStop = windowWidth * .51;
    thirdStop = (windowHeight / 1.3) - charYOffset;

    if(char.y < firstStop && animLock) {
        char.y += charMoveSpeed;
        if(abs(char.y - firstStop) < charMoveSpeed) char.y = firstStop;
    } else if (char.x < secondStop && animLock) {
        char.x += charMoveSpeed;
        if(abs(char.x - secondStop) < charMoveSpeed) char.x = secondStop;
    } else if (char.y < thirdStop && animLock) {
        char.y += charMoveSpeed;
        if(abs(char.y - thirdStop) < charMoveSpeed) char.y = thirdStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function eighttosix() {
    firstStop = windowWidth * .37;
    secondStop = (windowHeight / 3.2) - charYOffset;

    if(char.x < firstStop && animLock) {
        char.x += charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else if(char.y > secondStop && animLock) { 
        char.y -= charMoveSpeed;
        if(abs(char.y - secondStop) < charMoveSpeed) char.y = secondStop
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function sixtoeight() {
    firstStop = windowWidth * .37;
    secondStop = (windowHeight / 1.8) - charYOffset;

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

    imageMode(CENTER);
    for (let lvl of levels) {
        lvl.drawLevel();
    }
    imageMode(CORNER);

    char.drawChar();

    if(!animFinished) {
        
        if(char.levelPosition === '5' && nextPos[2] === '6') {
            fivetosix();
        } else if (char.levelPosition === '6' && nextPos[2] === '5') {
            sixtofive();
        } else if (char.levelPosition === '5' && nextPos[2] === '7') {
            fivetoseven();
        } else if (char.levelPosition === '7' && nextPos[2] === '5') {
            seventofive();
        } else if (char.levelPosition === '7' && nextPos[2] === '8') {
            seventoeight();
        } else if (char.levelPosition === '8' && nextPos[2] === '7') {
            eighttoseven();
        } else if (char.levelPosition === '8' && nextPos[2] === '6') {
            eighttosix();
        } else if (char.levelPosition === '6' && nextPos[2] === '8') {
            sixtoeight();
        } else {
            generalAnimAlgo();
        }
    }
}