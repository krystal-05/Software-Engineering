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
let nextPos = [];
let levels = [];
let lvlIndx = {};
let settingMenu = false;
let audioSelectionMenu = false;
let animFinished = true;
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

class character {
    constructor() {
        // Change this to change the character sprite I didn't know what quite to use for it
        this.img = idleAnimation;
        
        // Uses locally stored "lastSelectedLevel" to set char starting position
        let lastSelected = localStorage.getItem("lastSelectedLevel");
        switch(lastSelected) {
            case '2': {
                this.levelPosition = '2';
                this.x = cityTwoLocation[0];
                this.y = cityTwoLocation[1] - (windowHeight / 7.5);
                break;
            }
            case '3': {
                this.levelPosition = '3';
                this.x = cityThreeLocation[0];
                this.y = cityThreeLocation[1] - (windowHeight / 7.5);
                break;
            }
            case '4': {
                this.levelPosition = '4';
                this.x = cityFourLocation[0];
                this.y = cityFourLocation[1] - (windowHeight / 7.5);
            }
            default: {
                this.levelPosition = '1';
                this.x = cityOneLocation[0];
                this.y = cityOneLocation[1] - (windowHeight / 7.5);
            }
        }
        this.width = 100;
        this.height = 100;
    }
    
    // returns location of city to be moved to if a move can be made
    move(input) {
        switch(this.levelPosition) {
            case '1': {
                if(input === 'a' && unlocked >= 2) {
                    return cityTwoLocation.concat(['2']);
                } 
                break;
            } 
            case '2': {
                if(input === 's' && unlocked >= 4) {
                    return cityFourLocation.concat(['4']);
                } else if(input === 'a' && unlocked >= 3) {
                    return cityThreeLocation.concat(['3']);
                }
                break;
            }
            case '3': {
                if(input === 'd') {
                    return cityTwoLocation.concat(['2']);
                } 
                break;
            }
            case '4': {
                if(input === 'w') {
                    return cityTwoLocation.concat(['2']);
                }
            }
        }
        return false;
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
            image(levelLockImg, this.x + 20, this.y + 20, 25, 30);
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

    idleAnimation = loadImage('assets/temp_assets/IDLE1.gif');
    runningAnimation = loadImage('assets/temp_assets/LRUNGIF.gif');
    unlocked = parseInt(localStorage.getItem("unlockedLevel"));
}

function setup() {
    createCanvas(windowWidth, windowHeight);


    cityOneLocation = [windowWidth / 1.56, windowHeight / 2.3];
    cityTwoLocation = [windowWidth / 2.95, windowHeight / 2.2];
    cityThreeLocation = [windowWidth / 7.7, windowHeight / 4.4];
    cityFourLocation = [windowWidth / 2.5, windowHeight / 1.22];

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

    lvlIndx['1'] = [levels[0], cityOne];
    lvlIndx['2'] = [levels[1], cityTwo];
    lvlIndx['3'] = [levels[2], cityThree];
    lvlIndx['4'] = [levels[3], cityFour];

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
        if(nextPos[0] > char.x) {
            char.x = char.x + charMoveSpeed;
        } else if (nextPos[0] < char.x) {
            char.x = char.x - charMoveSpeed;
        }

        if(nextPos[1] > char.y) {
            char.y = char.y + charMoveSpeed;
        } else if (nextPos[1] < char.y) {
            char.y = char.y - charMoveSpeed;
        }

        if(abs(nextPos[0] - char.x) < charMoveSpeed) {
            char.x = nextPos[0];
        }

        if(abs(nextPos[1] - char.y) < charMoveSpeed) {
            char.y = nextPos[1];
        }

        if(nextPos[0] === char.x && nextPos[1] === char.y) {
            animFinished = true;
            char.levelPosition = nextPos[2];
            char.img = idleAnimation;
        }
    }
}