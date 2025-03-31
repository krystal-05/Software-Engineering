let map;
let char;
let buttons= [];
let levelOneImg, levelTwoImg, levelThreeImg, secretLevelImg;
let cityOneLocation = [windowWidth / 2 + 150, windowHeight / 2 - 150];
let cityTwoLocation = [windowWidth / 2 - 200, windowHeight / 2 - 150];
let cityThreeLocation = [windowWidth / 2 - 150, windowHeight /2 + 150];
let citySecretLocation = [windowWidth / 2 - 450, windowHeight /2 - 190];
let settingMenu = false;
let audioSelectionMenu = false;
let animFinished = true;
let wasd = [87, 65, 83, 68];

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
                        let cityTwoLocationLocal = cityTwoLocation.concat(['1']);
                        return cityTwoLocationLocal;
                    }
                    break;
                } 
                case '2': {
                    if(input === 'a') {
                        let citySecretLocationLocal = citySecretLocation.concat(['1s']);
                        return citySecretLocationLocal;
                    } else if(input === 's') {
                        let cityThreeLocationLocal = cityThreeLocation.concat(['3']);
                        return cityThreeLocationLocal;
                    } else if(input === 'd') {
                        let cityOneLocationLocal = cityOneLocation.concat(['1']);
                        return cityOneLocationLocal;
                    }
                    break;
                }
                case '3': {
                    if(input === 'w') {
                        let cityTwoLocationLocal = cityTwoLocation.concat(['1']); 
                        return cityTwoLocationLocal;
                    }
                    break;
                }
                case '1s': {
                    if(input === 'd') {
                        let cityTwoLocationLocal = cityTwoLocation.concat(['2']);
                        return cityTwoLocationLocal;
                    }
                    break;
                }
            }
            return false;
        }
    }


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
      char = new character();
    }

    function setup(){
        createCanvas(windowWidth, windowHeight);
        buttons.push(new Button("", cityOneLocation[0], cityOneLocation[1], 80, 100, levelOneImg, levelOneHover, cityOne));
        buttons.push(new Button("", cityTwoLocation[0], cityTwoLocation[1], 80, 100, levelTwoImg, levelTwoHover, cityTwo));
        buttons.push(new Button("", cityThreeLocation[0], cityThreeLocation[1], 80, 100, levelThreeImg, levelThreeHover, cityThree));
        buttons.push(new Button("", citySecretLocation[0], citySecretLocation[1], 80, 100, secretLevelImg, secretLevelHover, dawgs));
        loadVolumeSetting();
    }

    function draw(){
        background(0);
        image(map, 0, 0, windowWidth, windowHeight);
        for (let btn of buttons) {
            btn.display();
        }
        // Draws character
        image(char.img, char.x, char.y, char.width, char.height);


        // Animates character
        if(!animFinished) {
            let pos = char.move(keyCode);
            if(pos[0] - char.x > 0) {
                ++char.x;
            } else if (pos[0] - char.x < 0) {
                --char.x;
            }

            if(pos[1] - char.y > 0) {
                ++char.y;
            } else if (pos[1] - char.y < 0) {
                --char.y;
            }

            if(pos[0] - char.x === 0 && pos[1] - char.y === 0) {
                animFinished = true;
                char.levelPosition = pos[2];
            }
        }
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

    function buttonClick() {
        playSoundEffect("buttonSound");
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


    function keyPressed() {

        if(wasd.includes(keyCode) && char.move(keyCode)) {
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