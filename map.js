let map;
let char;
let buttons= [];
let levelOneImg, levelTwoImg, levelThreeImg, secretLevelImg;
let settingMenu = false;
let audioSelectionMenu = false;

    class character {
        constructor() {
            // Change this to change the character sprite I didn't know what quite to use for it
            this.img = loadImage('assets/temp_assets/sprites/02_idle.png');
            this.x = windowWidth / 2 + 150;
            this.y = windowHeight / 2 - 150; 
            this.width = 100;
            this.height = 100;
            this.levelPosition = '1';
        }

        // contains logic for how character can move depending on where they are currently
        move(input) {
            switch(this.levelPosition) {
                case '1': {
                    if(input === 'a') {
                        this.x = windowWidth / 2 - 200;
                        this.y = windowHeight / 2 - 150;
                        this.levelPosition = '2';
                    }
                    break;
                } 
                case '2': {
                    if(input === 'a') {
                        this.x = windowWidth / 2 - 450;
                        this.y = windowHeight /2 - 190;
                        this.levelPosition = '1s';
                    } else if(input === 's') {
                        this.x = windowWidth / 2 - 150;
                        this.y = windowHeight / 2 + 150;
                        this.levelPosition = '3'; 
                    } else if(input === 'd') {
                        this.x = windowWidth / 2 + 150;
                        this.y = windowHeight / 2 - 150;
                        this.levelPosition = '1';
                    }
                    break;
                }
                case '3': {
                    if(input === 'w') {
                        this.x = windowWidth / 2 - 200;
                        this.y = windowHeight / 2 - 150;
                        this.levelPosition = '2';
                    }
                    break;
                }
                case '1s': {
                    if(input === 'd') {
                        this.x = windowWidth / 2 - 200;
                        this.y = windowHeight / 2 - 150;
                        this.levelPosition = '2';
                    }
                    break;
                }
            }
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
        buttons.push(new Button("", windowWidth / 2 + 150, windowHeight /2 - 150 , 80, 100, levelOneImg, levelOneHover, cityOne));
        buttons.push(new Button("", windowWidth / 2 - 200, windowHeight /2 - 150, 80, 100, levelTwoImg, levelTwoHover, cityTwo));
        buttons.push(new Button("", windowWidth / 2 - 150, windowHeight /2 + 150 , 80, 100, levelThreeImg, levelThreeHover, cityThree));
        buttons.push(new Button("", windowWidth / 2 - 450 , windowHeight /2 - 190, 80, 100, secretLevelImg, secretLevelHover, dawgs));
        loadVolumeSetting();
    }

    function draw(){
        background(0);
        image(map, 0, 0, windowWidth, windowHeight);
        for (let btn of buttons) {
            btn.display();
        }
        image(char.img, char.x, char.y, char.width, char.height);

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
        window.open('https://www.youtube.com/watch?v=RQmEERvqq70&ab_channel=Generuu')
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
        switch(keyCode) {
            // 'w'
            case 87: {
                char.move('w');
            break;
            }
            // 'a'
            case 65: {
                char.move('a');
            break;
            }
            // 's'
            case 83: {
                char.move('s');
            break;
            } 
            // 'd'
            case 68: {
                char.move('d');
            break;
            }
            // 'enter'
            case 13: {
                for(let btn of buttons) {
                    if(btn.isHovered() && btn.action) {
                        buttonClick();
                        setTimeout(() => btn.action(), 200);
                    }
                }
            break;
            }
        }

        return false;
    }