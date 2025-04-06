let map;
let cityOneLocation;
let cityTwoLocation;
let cityThreeLocation;
let citySecretLocation;
let nextPos = [];
let levels = [];
let lvlIndx = {};
let levelOneImg, levelTwoImg, levelThreeImg, secretLevelImg;
let idleAnimation, runningAnimation;
let charMoveSpeed = 7;
let settingMenu = false;
let audioSelectionMenu = false;
let animFinished = true;
let char;

function preload() {
    map = loadImage('assets/map.png');
    idleAnimation = loadImage('assets/temp_assets/IDLE1.gif');
    runningAnimation = loadImage('assets/temp_assets/LRUNGIF.gif');
    soundEffects["buttonSound"] = loadSound('sounds/buttonClick.mp3');
    levelOneImg = loadImage('assets/level1.png');
    levelTwoImg = loadImage('assets/level2.png');
    levelThreeImg = loadImage('assets/level3.png');
    secretLevelImg = loadImage('assets/secretlevel.png');
    levelOneHover = loadImage('assets/level1Hover.png');
    levelTwoHover= loadImage('assets/level2Hover.png');
    levelThreeHover= loadImage('assets/level3Hover.png');
    secretLevelHover = loadImage('assets/secretlevelhover.png');
}

function cityOne() {
    localStorage.setItem("lastSelectedLevel", '1');
    window.location.href = "game.html";
}
function cityTwo() {
    localStorage.setItem("lastSelectedLevel", '2');
    window.location.href = "game.html";
}
function cityThree() {
    localStorage.setItem("lastSelectedLevel", '3');
    window.location.href = "game.html";
}

function dawgs() {
    localStorage.setItem("lastSelectedLevel", '1s');
    window.open('https://www.youtube.com/watch?v=RQmEERvqq70&ab_channel=Generuu')
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

class level {
    constructor(img, x, y, width = 80, height = 100) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    drawLevel(){
        image(this.img, this.x, this.y, this.width, this.height);
    }
}

function setup(){
    createCanvas(windowWidth, windowHeight);

    cityOneLocation = [windowWidth / 2 + 150, windowHeight / 2 - 150];
    cityTwoLocation = [windowWidth / 2 - 200, windowHeight / 2 - 150];
    cityThreeLocation = [windowWidth / 2 - 150, windowHeight / 2 + 150];
    citySecretLocation = [windowWidth / 2 - 450, windowHeight / 2 - 190];

    char = new character;

    levels.push(new level(levelOneImg, cityOneLocation[0], cityOneLocation[1]));
    levels.push(new level(levelTwoImg, cityTwoLocation[0], cityTwoLocation[1]));
    levels.push(new level(levelThreeImg, cityThreeLocation[0], cityThreeLocation[1]));
    levels.push(new level(secretLevelImg, citySecretLocation[0], citySecretLocation[1]));

    lvlIndx['1'] = [levels[0], levelOneImg, levelOneHover, cityOne];
    lvlIndx['2'] = [levels[1], levelTwoImg, levelTwoHover, cityTwo];
    lvlIndx['3'] = [levels[2], levelThreeImg, levelThreeHover, cityThree];
    lvlIndx['1s'] = [levels[3], secretLevelImg, secretLevelHover, dawgs];

    lvlIndx[char.levelPosition][0].img = lvlIndx[char.levelPosition][2]; 
    
    loadVolumeSetting();
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
                this.y = cityTwoLocation[1];
                break;
            }
            case '3': {
                this.levelPosition = '3';
                this.x = cityThreeLocation[0];
                this.y = cityThreeLocation[1];
                break;
            }
            case '1s': {
                this.levelPosition = '1s';
                this.x = citySecretLocation[0];
                this.y = citySecretLocation[1];
                break;
            }
            default: {
                this.levelPosition = '1';
                this.x = cityOneLocation[0];
                this.y = cityOneLocation[1];
            }
        }
        this.width = 100;
        this.height = 100;
    }
    
    // returns location of city to be moved to if a move can be made
    move(input) {
        switch(this.levelPosition) {
            case '1': {
                if(input === 'a') {
                    return cityTwoLocation.concat(['2']);
                }
                break;
            } 
            case '2': {
                if(input === 'a') {
                    return citySecretLocation.concat(['1s']);
                } else if(input === 's') {
                    return cityThreeLocation.concat(['3']);
                } else if(input === 'd') {
                    return cityOneLocation.concat(['1']);
                }
                break;
            }
            case '3': {
                if(input === 'w') {
                    return cityTwoLocation.concat(['2']);
                }
                break;
            }
            case '1s': {
                if(input === 'd') {
                    return cityTwoLocation.concat(['2']);
                }
                break;
            }
        }
        return false;
    }

    drawChar() {
        image(char.img, char.x, char.y, char.width, char.height);
    }
}
    
function keyPressed() {
    
    let tmp = char.move(key);
    if(tmp && animFinished) {
        lvlIndx[char.levelPosition][0].img = lvlIndx[char.levelPosition][1];
        nextPos = tmp;
        char.img = runningAnimation;
        if(nextPos[0] - char.x > 0) {
            char.width = 0 - char.width;
        }
        animFinished = false;
    } else if (keyCode === ENTER) {
        playSoundEffect("buttonSound");
        lvlIndx[char.levelPosition][3]();
    }
    
    return false;
}

function draw() {
    background(0);
    image(map, 0, 0, windowWidth, windowHeight);

    imageMode(CENTER);
    for (let lvl of levels) {
        lvl.drawLevel();
    }
    imageMode(CORNER);

    // Draws character
    char.drawChar();

    // Animates character
    if(!animFinished) {
        if(nextPos[0] - char.x > 0) {
            char.x = char.x + charMoveSpeed;
        } else if (nextPos[0] - char.x < 0) {
            char.x = char.x - charMoveSpeed;
        }

        if(nextPos[1] - char.y > 0) {
            char.y = char.y + charMoveSpeed;
        } else if (nextPos[1] - char.y < 0) {
            char.y = char.y - charMoveSpeed;
        }

        if(abs(nextPos[0] - char.x) < charMoveSpeed) {
            char.x = nextPos[0];
        }

        if(abs(nextPos[1] - char.y) < charMoveSpeed) {
            char.y = nextPos[1];
        }

        if(nextPos[0] - char.x === 0 && nextPos[1] - char.y === 0) {
            animFinished = true;
            char.levelPosition = nextPos[2];
            lvlIndx[char.levelPosition][0].img = lvlIndx[char.levelPosition][2]; 
            char.img = idleAnimation;
        }
    }
}
