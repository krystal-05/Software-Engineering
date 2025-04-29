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
let charOffset;
gameState = "worldmap";

function preload() {
    map = loadImage('assets/final_design/MapStuff/Temp_Map.png');
    idleAnimation = loadImage('assets/final_design/MapStuff/Team_Plane_Idle.png');
    runningAnimation = loadImage('assets/final_design/MapStuff/Team_Plane.gif');
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
            image(levelLockImg, this.x + 20, this.y + 20, 25, 29);
        }
    }
}

function createLevelButtons() {
    continentOneLocation = [windowWidth / 4.2, windowHeight / 2.5];
    continentTwoLocation = [windowWidth / 5, windowHeight / 1.3];
    continentThreeLocation = [windowWidth / 1.25, windowHeight / 2.6];
    
    levels = [];
    levels.push(new level(levelOneImg, continentOneLocation[0], continentOneLocation[1], false));
    levels.push(new level(levelTwoImg, continentTwoLocation[0], continentTwoLocation[1]));
    levels.push(new level(levelThreeImg, continentThreeLocation[0], continentThreeLocation[1]));
    if(unlocked >= 5) {
        levels[1].lock = false;
    }
    if(unlocked >= 9) {
        levels[2].lock = false;
    }

    charOffset = windowHeight / 13;
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    
    createLevelButtons();

    char = new character;

    lvlIndx['1'] = [levels[0], continentOne];
    lvlIndx['2'] = [levels[1], continentTwo];
    lvlIndx['3'] = [levels[2], continentThree];
    
    createUnlockIncrement(unlocked);
    loadVolumeSetting();
    createModal();
    hideLoadingScreen();
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
                this.y = continentTwoLocation[1] - charOffset;
                break;
            }
            case '3': {
                this.levelPosition = '3';
                this.x = continentThreeLocation[0];
                this.y = continentThreeLocation[1] - charOffset;
                break;
            }
            default: {
                this.levelPosition = '1';
                this.x = continentOneLocation[0];
                this.y = continentOneLocation[1] - charOffset;
            }
        }
        this.width = 113;
        this.height = 50;
    }
    
    // returns location of city to be moved to if a move can be made
    move(input) {
        switch(this.levelPosition) {
            case '1': {
                if((input === 's' || input === 'DownArrow') && unlocked >= 5) {
                    return continentTwoLocation.concat(['2']);
                } else if ((input === 'd' || input === 'RightArrow') && unlocked >= 9) {
                    return continentThreeLocation.concat(['3']);
                }
                break;
            } 
            case '2': {
                if((input === 'd' || input === 'RightArrow') && unlocked >= 9) {
                    return continentThreeLocation.concat(['3']);
                } else if(input === 'w' || input === 'UpArrow' || input === 'a' || input === 'LeftArrow') {
                    return continentOneLocation.concat(['1']);
                }
                break;
            }
            case '3': {
                if(input === 's' || input === 'DownArrow') {
                    return continentTwoLocation.concat(['2']);
                } else if (input === 'a' || input === 'LeftArrow') {
                    return continentOneLocation.concat(['1'])
                }
                break;
            }
        }
        return false;
    }

    updatePos() {
        switch(this.levelPosition) {
            case '1': {
                this.x = continentOneLocation[0];
                this.y = continentOneLocation[1] - charOffset;
                break;
            }
            case '2': {
                this.x = continentTwoLocation[0];
                this.y = continentTwoLocation[1] - charOffset;
                break;
            }
            case '3': {
                this.x = continentThreeLocation[0];
                this.y = continentThreeLocation[1] - charOffset;
                break;
            }
        }
    }

    drawChar() {
        image(char.img, char.x, char.y, char.width, char.height);
    }
}

function mousePressed() {
    if(inputEnabled) {
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

function draw() {
    background(0);
    image(map, 0, 0, windowWidth, windowHeight);
    cursor('default');

    imageMode(CENTER);
    for (let lvl of levels) {
        lvl.drawLevel();
    }
    imageMode(CORNER);

    if (DEBUG) {
        levelUnlockIncrement.display();
    }

    // Draws character
    char.drawChar();

    // Animates character
    if(!animFinished) {
        if(nextPos[0] > char.x) {
            char.x = char.x + charMoveSpeed;
        } else if (nextPos[0] < char.x) {
            char.x = char.x - charMoveSpeed;
        }

        if(nextPos[1] - charOffset > char.y) {
            char.y = char.y + charMoveSpeed;
        } else if (nextPos[1] - charOffset < char.y) {
            char.y = char.y - charMoveSpeed;
        }

        if(abs(nextPos[0] - char.x) < charMoveSpeed) {
            char.x = nextPos[0];
        }

        if(abs(nextPos[1] - charOffset - char.y) < charMoveSpeed) {
            char.y = nextPos[1] - charOffset;
        }

        if(nextPos[0] === char.x && nextPos[1] - charOffset === char.y) {
            animFinished = true;
            char.levelPosition = nextPos[2];
            char.img = idleAnimation;
        }
    }
}
