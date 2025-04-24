let map;
let continentOneLocation;
let continentTwoLocation;
let continentThreeLocation;
let nextPos = [];
let levels = [];
let lvlIndx = {};
let levelOneImg, levelTwoImg, levelThreeImg;
let levelLockImg;
let unlocked;
let idleAnimation, runningAnimation;
let charMoveSpeed = 10;
let settingMenu = false;
let audioSelectionMenu = false;
let animFinished = true;
let char;
gameState = "worldmap";

function preload() {
    map = loadImage('assets/final_design/MapStuff/Temp_Map.png');
    idleAnimation = loadImage('assets/temp_assets/IDLE1.gif');
    runningAnimation = loadImage('assets/temp_assets/LRUNGIF.gif');
    soundEffects["buttonSound"] = loadSound('sounds/buttonClick.mp3');
    levelOneImg = loadImage('assets/final_design/MapStuff/levelMarkers/1.png');
    levelTwoImg = loadImage('assets/final_design/MapStuff/levelMarkers/2.png');
    levelThreeImg = loadImage('assets/final_design/MapStuff/levelMarkers/3.png');
    levelLockImg = loadImage('assets/final_design/MapStuff/levelMarkers/Fancy_Lock_Closed.png')
    unlocked = parseInt(localStorage.getItem("unlockedLevel"));
}

function continentOne() {
    localStorage.setItem("lastSelectedContinent", '1');
    window.location.href = "continentOneMap.html";
}
function continentTwo() {
    localStorage.setItem("lastSelectedContinent", '2');
    window.location.href = "continentTwoMap.html";
}
function continentThree() {
    localStorage.setItem("lastSelectedContinent", '3');
    window.location.href = "continentThreeMap.html";
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

function setup(){
    createCanvas(windowWidth, windowHeight);

    continentOneLocation = [(windowWidth / 3) - (windowWidth / 6), (windowHeight / 2) - (windowHeight / 10)];
    continentTwoLocation = [(windowWidth / 2) - (windowWidth / 5), (windowHeight / 2) + (windowHeight / 5)];
    continentThreeLocation = [(windowWidth / 2) + (windowWidth / 5), (windowHeight / 2) - (windowHeight / 5)];

    char = new character;

    levels.push(new level(levelOneImg, continentOneLocation[0], continentOneLocation[1], false));
    levels.push(new level(levelTwoImg, continentTwoLocation[0], continentTwoLocation[1]));
    if(unlocked >= 5) {
        levels[1].lock = false;
    }
    levels.push(new level(levelThreeImg, continentThreeLocation[0], continentThreeLocation[1]));
    if(unlocked >= 9) {
        levels[2].lock = false;
    }

    lvlIndx['1'] = [levels[0], continentOne];
    lvlIndx['2'] = [levels[1], continentTwo];
    lvlIndx['3'] = [levels[2], continentThree];
    
    loadVolumeSetting();
    createModal();
}

class character {
    constructor() {
        this.img = idleAnimation;
        
        // Uses locally stored "lastSelectedLevel" to set char starting position
        let lastSelected = localStorage.getItem("lastSelectedContinent");
        switch(lastSelected) {
            case '2': {
                this.levelPosition = '2';
                this.x = continentTwoLocation[0];
                this.y = continentTwoLocation[1] - (windowHeight / 7.5);
                break;
            }
            case '3': {
                this.levelPosition = '3';
                this.x = continentThreeLocation[0];
                this.y = continentThreeLocation[1] - (windowHeight / 7.5);
                break;
            }
            default: {
                this.levelPosition = '1';
                this.x = continentOneLocation[0];
                this.y = continentOneLocation[1] - (windowHeight / 7.5);
            }
        }
        this.width = 100;
        this.height = 100;
    }
    
    // returns location of city to be moved to if a move can be made
    move(input) {
        switch(this.levelPosition) {
            case '1': {
                if(input === 's' && unlocked >= 5) {
                    return continentTwoLocation.concat(['2']);
                } else if (input === 'd' && unlocked === 3) {
                    return continentThreeLocation.concat(['3']);
                }
                break;
            } 
            case '2': {
                if(input === 'd' && unlocked >= 9) {
                    return continentThreeLocation.concat(['3']);
                } else if(input === 'w') {
                    return continentOneLocation.concat(['1']);
                }
                break;
            }
            case '3': {
                if(input === 's') {
                    return continentTwoLocation.concat(['2']);
                } else if (input === 'a') {
                    return continentOneLocation.concat(['1'])
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

    // Draws character
    char.drawChar();

    // Animates character
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
