let map;
let cityOneLocation;
let cityTwoLocation;
let cityThreeLocation;
let citySecretLocation;
let nextPos = [];
let buttons = [];
let levelOneImg, levelTwoImg, levelThreeImg, secretLevelImg;
let settingMenu = false;
let audioSelectionMenu = false;
let animFinished = true;
let char;

function preload() {
    map = loadImage('assets/map.png');
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
    window.location.href = "gameOne.html";
}
function cityTwo() {
    window.location.href = "gameTwo.html";
}
function cityThree() {
    window.location.href = "gameThree.html";
}

function dawgs() {
    window.open('https://www.youtube.com/watch?v=RQmEERvqq70&ab_channel=Generuu');
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

function setup(){
    createCanvas(windowWidth, windowHeight);

    cityOneLocation = [windowWidth / 2 + 150, windowHeight / 2 - 150];
    cityTwoLocation = [windowWidth / 2 - 200, windowHeight / 2 - 150];
    cityThreeLocation = [windowWidth / 2 - 150, windowHeight / 2 + 150];
    citySecretLocation = [windowWidth / 2 - 450, windowHeight / 2 - 190];

    char = new character();

    buttons.push(new Button("", cityOneLocation[0], cityOneLocation[1], 80, 100, levelOneImg, levelOneHover, cityOne));
    buttons.push(new Button("", cityTwoLocation[0], cityTwoLocation[1], 80, 100, levelTwoImg, levelTwoHover, cityTwo));
    buttons.push(new Button("", cityThreeLocation[0], cityThreeLocation[1], 80, 100, levelThreeImg, levelThreeHover, cityThree));
    buttons.push(new Button("", citySecretLocation[0], citySecretLocation[1], 80, 100, secretLevelImg, secretLevelHover, dawgs));
    loadVolumeSetting();
}

class character {
    constructor() {
        // Change this to change the character sprite I didn't know what quite to use for it
        this.img = loadImage('assets/temp_assets/sprites/02_idle.png');
        this.x = cityOneLocation[0];
        this.y = cityOneLocation[1]; 
        this.width = 100;
        this.height = 100;
        this.levelPosition = '1';
    }
    
    // returns location of city to be moved to if a move can be made
    move(input) {
        switch(this.levelPosition) {
            case '1': {
                if(input === 'a') {
                    return cityTwoLocation.concat(['1']);
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
                    return cityTwoLocation.concat(['1']);
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
}
    function buttonClick() {
        playSoundEffect("buttonSound");
    }
    
    function keyPressed() {
        
        let tmp = char.move(keyCode);
        if(tmp && animFinished) {
            nextPos = tmp;
            animFinished = false;
        } else if (keyCode === ENTER) {
            for(let btn of buttons) {
                if(btn.isHovered() && btn.action) {
                    buttonClick();
                    setTimeout(() => btn.action(), 200);
                }
            }
        }
        
        return false;
    }

    function draw() {
        background(0);
        image(map, 0, 0, windowWidth, windowHeight);
        for (let btn of buttons) {
            btn.display();
        }
        // Draws character
        image(char.img, char.x, char.y, char.width, char.height);

        // Animates character
        if(!animFinished) {
            if(nextPos[0] - char.x > 0) {
                ++char.x;
            } else if (nextPos[0] - char.x < 0) {
                --char.x;
            }

            if(nextPos[1] - char.y > 0) {
                ++char.y;
            } else if (nextPos[1] - char.y < 0) {
                --char.y;
            }

            if(nextPos[0] - char.x === 0 && nextPos[1] - char.y === 0) {
                animFinished = true;
                char.levelPosition = nextPos[2];
            }
        }
    }