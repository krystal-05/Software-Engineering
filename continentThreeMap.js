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

function cityNine() {
    localStorage.setItem("lastSelectedLevel", '9');
    window.location.href = "game.html";
}
function cityTen() {
    localStorage.setItem('lastSelectedLevel', '10');
    window.location.href = "game.html";
}
function cityEleven() {
    localStorage.setItem('lastSelectedLevel', '11');
    window.location.href = "game.html";
}
function cityTwelve() {
    localStorage.setItem('lastSelectedLevel', '12');
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
            case '10': {
                this.levelPosition = '10';
                this.x = cityTwoLocation[0] + charXOffset;
                this.y = cityTwoLocation[1] - charYOffset;
                break;
            }
            case '11': {
                this.levelPosition = '11';
                this.x = cityThreeLocation[0] + charXOffset;
                this.y = cityThreeLocation[1] - charYOffset;
                break;
            }
            case '12': {
                this.levelPosition = '12';
                this.x = cityFourLocation[0] + charXOffset;
                this.y = cityFourLocation[1] - charYOffset;
                break;
            }
            default: {
                this.levelPosition = '9';
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
            case '9': {
                if((input === 'a' || input === 'LeftArrow') && unlocked >= 10) {
                    return cityTwoLocation.concat(['10']);
                } if((input === 's' || input === 'DownArrow') && unlocked >= 11) {
                    return cityThreeLocation.concat(['11']);
                }
                break;
            } 
            case '10': {
                if((input === 'a' || input === 'LeftArrow') && unlocked >= 12) {
                    return cityFourLocation.concat(['12']);
                } else if(input === 'd' || input === 'RightArrow') {
                    return cityOneLocation.concat(['9']);
                }
                break;
            }
            case '11': {
                if(input === 'w' || input === 'UpArrow') {
                    return cityOneLocation.concat(['9']);
                } else if((input === 'a' || input === ' LeftArrow') && unlocked >= 12) {
                    return cityFourLocation.concat(['12']);
                }
                break;
            }
            case '12': {
                if(input === 'w' || input === 'UpArrow' || input === 'd' || input === 'RightArrow') {
                    return cityTwoLocation.concat(['10']);
                } else if(input === 's') {
                    return cityThreeLocation.concat(['11']);
                }
            }
        }
        return false;
    }

    updatePos() {
        switch(this.levelPosition) {
            case '9': {
                this.x = cityOneLocation[0] + charXOffset;
                this.y = cityOneLocation[1] - charYOffset;
                break;
            }
            case '10': {
                this.x = cityTwoLocation[0] + charXOffset;
                this.y = cityTwoLocation[1] - charYOffset;
                break;
            }
            case '11': {
                this.x = cityThreeLocation[0] + charXOffset;
                this.y = cityThreeLocation[1] - charYOffset;
                break;
            }
            case '12': {
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
    map = loadImage('assets/final_design/MapStuff/Island_3.png');
    levelLockImg = loadImage('assets/final_design/MapStuff/levelMarkers/Fancy_Lock_Closed.png');
    levelOneImg = loadImage('assets/final_design/MapStuff/levelMarkers/9.png');
    levelTwoImg = loadImage('assets/final_design/MapStuff/levelMarkers/10.png');
    levelThreeImg = loadImage('assets/final_design/MapStuff/levelMarkers/11.png');
    levelFourImg = loadImage('assets/final_design/MapStuff/levelMarkers/12.png');
    buttonImg = loadImage('assets/final_design/MapStuff/backbuttonMap.png');
    buttonImgHover = loadImage('assets/final_design/MapStuff/backbuttonMapHover.png');

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
    if(unlocked >= 10) {
        levels[1].lock = false;
    }
    if(unlocked >= 11) {
        levels[2].lock = false;
    }
    if(unlocked >= 12) {
        levels[3].lock = false;
    }

    backButton = new Button('', windowWidth * .1, windowHeight * .9, 258.3, 100, buttonImg, buttonImgHover, goBack);

    charXOffset = windowWidth / 25;
    charYOffset = windowHeight / 17;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    createLevelButtons();
    

    lvlIndx['9'] = [levels[0], cityNine];
    lvlIndx['10'] = [levels[1], cityTen];
    lvlIndx['11'] = [levels[2], cityEleven];
    lvlIndx['12'] = [levels[3], cityTwelve];

    char = new character;

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
    }
}

function keyPressed() {
    if (key === 'Escape') {
        settingsClick();
    }

    if (inputEnabled) {
        let inputKey;
        switch (keyCode) {
            case LEFT_ARROW:
                inputKey = 'a'; // Map left arrow to 'a'
                break;
            case RIGHT_ARROW:
                inputKey = 'd'; // Map right arrow to 'd'
                break;
            case UP_ARROW:
                inputKey = 'w'; // Map up arrow to 'w'
                break;
            case DOWN_ARROW:
                inputKey = 's'; // Map down arrow to 's'
                break;
            default:
                inputKey = key; // Use the key directly for other inputs
        }

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

function ninetoten() {
    firstStop = windowWidth * .59;

    if(char.x > firstStop && animLock) {
        char.x -= charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        animLock = false;
        generalAnimAlgo();
    }
}

function tentonine() {
    let firstStop = windowWidth * .5;
    if(char.x < firstStop) {
        char.x += charMoveSpeed;
        if(abs(char.x - firstStop) < charMoveSpeed) char.x = firstStop;
    } else {
        generalAnimAlgo();
    }
}

function ninetoeleven() {
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

function eleventonine() {
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

function eleventotwelve() {
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

function twelvetoeleven() {
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

function twelvetoten() {
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

function tentotwelve() {
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

    backButton.display();

    imageMode(CENTER);
    for (let lvl of levels) {
        lvl.drawLevel();
    }
    imageMode(CORNER);

    char.drawChar();

    if(!animFinished) {
        
        if(char.levelPosition === '9' && nextPos[2] === '10') {
            ninetoten();
        } else if (char.levelPosition === '10' && nextPos[2] === '9') {
            tentonine();
        } else if (char.levelPosition === '9' && nextPos[2] === '11') {
            ninetoeleven();
        } else if (char.levelPosition === '11' && nextPos[2] === '9') {
            eleventonine();
        } else if (char.levelPosition === '11' && nextPos[2] === '12') {
            eleventotwelve();
        } else if (char.levelPosition === '12' && nextPos[2] === '11') {
            twelvetoeleven();
        } else if (char.levelPosition === '12' && nextPos[2] === '10') {
            twelvetoten();
        } else if (char.levelPosition === '10' && nextPos[2] === '12') {
            tentotwelve();
        } else {
            generalAnimAlgo();
        }
    }
}