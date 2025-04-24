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
let charMoveSpeed = 10;
let charOffset;
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
                this.x = cityTwoLocation[0];
                this.y = cityTwoLocation[1] - charOffset;
                break;
            }
            case '7': {
                this.levelPosition = '7';
                this.x = cityThreeLocation[0];
                this.y = cityThreeLocation[1] - charOffset;
                break;
            }
            case '8': {
                this.levelPosition = '8';
                this.x = cityFourLocation[0];
                this.y = cityFourLocation[1] - charOffset;
            }
            default: {
                this.levelPosition = '5';
                this.x = cityOneLocation[0];
                this.y = cityOneLocation[1] - charOffset;
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
                this.x = cityOneLocation[0];
                this.y = cityOneLocation[1] - charOffset;
                break;
            }
            case '6': {
                this.x = cityTwoLocation[0];
                this.y = cityTwoLocation[1] - charOffset;
                break;
            }
            case '7': {
                this.x = cityThreeLocation[0];
                this.y = cityThreeLocation[1] - charOffset;
                break;
            }
            case '8': {
                this.x = cityFourLocation[0];
                this.y = cityFourLocation[1] - charOffset;
                break;
            }
        }
    }

    drawChar() {
        image(char.img, char.x, char.y, char.width, char.height);
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

    charOffset = windowHeight / 12;
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
    if(nextPos[0] === char.x && nextPos[1] - charOffset === char.y) {
        animFinished = true;
        animCounter = 0;
        char.levelPosition = nextPos[2];
        char.img = idleAnimation;
    }

    if(abs(nextPos[0] - char.x) < charMoveSpeed) {
        char.x = nextPos[0];
    }

    if(abs(nextPos[1] - charOffset - char.y) < charMoveSpeed) {
        char.y = nextPos[1] - charOffset;
    }

    if (nextPos[0] < char.x) {
        char.x -= charMoveSpeed;
    } else if (nextPos[0] > char.x) {
        char.x += charMoveSpeed;
    }

    if (nextPos[1] - charOffset < char.y) {
        char.y -= charMoveSpeed;
    } else if (nextPos[1] - charOffset > char.y){
        char.y += charMoveSpeed;
    }
}

function fivetosix() {
    if(char.x > windowWidth / 2.4) {
        char.x -= charMoveSpeed;
    } else {
        generalAnimAlgo();
    }
}

function sixtofive() {
    if(char.x < windowWidth / 2.1) {
        char.x += charMoveSpeed;
    } else {
        generalAnimAlgo();
    }
}

function fivetoseven() {
    if(char.x > windowWidth / 1.5) {
        char.x -= charMoveSpeed;
        ++animCounter;
    } else if(char.y < windowHeight / 1.7) {
        char.y += charMoveSpeed;
        ++animCounter;
    } else if(animCounter < 34) {
        char.x -= charMoveSpeed;
        ++animCounter
    } else if(animCounter < 45) {
        char.y += charMoveSpeed;
        ++animCounter
    } else {
        generalAnimAlgo();
    }
}

function seventofive() {
    if(animCounter < 5) {
        char.x -= charMoveSpeed;
        ++animCounter;
    } else if (animCounter < 24) {
        char.y -= charMoveSpeed;
        ++animCounter;
    } else if (animCounter < 38) {
        char.x += charMoveSpeed;
        ++animCounter;
    } else {
        generalAnimAlgo();
    }
}

function seventoeight() {
    if (animCounter < 33) {
        char.x -= charMoveSpeed;
        ++animCounter;
    } else if (animCounter < 45) {
        char.y -= charMoveSpeed;
        ++animCounter;
    } else if (animCounter < 85) {
        char.x -= charMoveSpeed;
        ++animCounter;
    } else {
        generalAnimAlgo();
    }
}

function eighttoseven() {
    if(animCounter < 3) {
        char.x += charMoveSpeed;
        ++animCounter;
    } else if (animCounter < 10) {
        char.y += charMoveSpeed;
        ++animCounter;
    } else if (animCounter < 56) {
        char.x += charMoveSpeed;
        ++animCounter;
    } else if (animCounter < 68) {
        char.y += charMoveSpeed;
        ++animCounter;
    } else {
        generalAnimAlgo();
    }
}

function eighttosix() {
    if(animCounter < 22) {
        char.x += charMoveSpeed;
        ++animCounter;
    } else if (animCounter < 44) {
        char.y -= charMoveSpeed;
        ++animCounter;
    } else {
        generalAnimAlgo();
    }
}

function sixtoeight() {
    if(animCounter < 19) {
        char.x -= charMoveSpeed;
        ++animCounter;
    } else if(animCounter < 41) {
        char.y += charMoveSpeed;
        ++animCounter;
    } else {
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