let map;
let levelOneImg, levelTwoImg, levelThreeImg, secretLevelImg;
let settingMenu = false;
let audioSelectionMenu = false;
let levelOneButton;
let levelTwoButton;
let levelThreeButton;
let secretLevelButton;

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

   
    function setup(){
        createCanvas(windowWidth, windowHeight);
        levelOneButton = new Button("", windowWidth / 2 + 150, windowHeight /2 - 150 , 80, 100, levelOneImg, levelOneHover, cityOne);
        levelTwoButton = new Button("", windowWidth / 2 - 200, windowHeight /2 - 150, 80, 100, levelTwoImg, levelTwoHover, cityTwo);
        levelThreeButton = new Button("", windowWidth / 2 - 150, windowHeight /2 + 150 , 80, 100, levelThreeImg, levelThreeHover, cityThree);
        secretLevelButton = new Button("", windowWidth / 2 - 450 , windowHeight /2 - 190 , 80, 100, secretLevelImg, secretLevelHover, dawgs);
        loadVolumeSetting();
        
    }

    function draw(){
        background(0);
        image(map, 0, 0, windowWidth, windowHeight);
        levelOneButton.display();
        levelTwoButton.display();
        levelThreeButton.display();

     }

     function cityOne() {
        localStorage.setItem("level", 1);
        window.location.href = "game.html";
    }
    function cityTwo() {
        localStorage.setItem("level", 2);
        window.location.href = "game.html";
    }
    function cityThree() {
        localStorage.setItem("level", 3);
        window.location.href = "game.html";
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
    function mousePressed() {
        if (levelOneButton.isHovered()) {
                buttonClick();
                setTimeout(() => levelOneButton.action(), 200);
            }
        if (levelTwoButton.isHovered()) {
                buttonClick();
                setTimeout(() => levelTwoButton.action(), 200);
            }
         if (levelThreeButton.isHovered()) {
                buttonClick();
                setTimeout(() => levelThreeButton.action(), 200);
            }
        }
   
    