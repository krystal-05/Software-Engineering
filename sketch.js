let buttons = [];
let loadButtons = [];
let gameState = "menu";
let settingMenu = false;
let bgImage, titleIcon;
let menuSong, buttonSound;
let settingsImg, settingsImgHover, creditsImg, creditsImgHover;
let mainScreenSound; //added 


function preload() {
  bgImage = loadImage('assets/roughititlescreen.png'); 
  titleIcon = loadImage('assets/OREDTitle.png');
  menuSong = loadSound('sounds/gamesong.mp3');
  buttonSound = loadSound('sounds/buttonClick.mp3');
  settingsImg = loadImage('assets/OSettings_1.png');
  settingsImgHover = loadImage('assets/OSettings_2.png');
  creditsImg = loadImage('assets/OCredits_1.png');
  creditsImgHover = loadImage('assets/OCredits_2.png');
  mainScreenSound = loadSound('sounds/mainScreenSound.mp3'); //added 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);

  buttons.push(new Button("Start Game", width / 2, 300, 300, 80, null, null, () => gameState = "loadGame"));
  buttons.push(new Button("Settings", width - 100, height - 100, 120, 120, settingsImg, settingsImgHover, () => settingMenu = true));
  buttons.push(new Button("Credits", width - 250, height - 100, 120, 120, creditsImg, creditsImgHover, () => loadCredits()));

  createModal();
}

function draw() {
  background(20);

  if (gameState === "menu") {
    drawMainMenu();
  } else if (gameState === "loadGame") {
    drawLoadScreen();
  }

  if (settingMenu) {
    showSettings();
  }
}

function drawMainMenu() {
  background(bgImage);
  fill(255, 215, 0);
  textSize(60);
  textStyle(BOLD);
  image(titleIcon, (width / 2) - 320, -20, 640, 320);

  textStyle(NORMAL);
  for (let btn of buttons) {
    btn.display();
  }
}

function drawLoadScreen() {
  fill(255, 215, 0);
  textSize(60);
  textStyle(BOLD);
  text("Load Game", width / 2, height * 0.2);

  loadButtons = [
      new Button("Game 1", width / 2, 240, 300, 75, null, null, () => loadGame()),
      new Button("Game 2", width / 2, 330, 300, 75, null, null, () => loadGame()),
      new Button("Game 3", width / 2, 420, 300, 75, null, null, () => loadGame()),
      new Button("Back", 175, height - 50, 200, 50, null, null, () => goBack()),
      new Button("Login Test", 500, height - 50, 100, 50, null, null, () => loadlogin())
  ];

  for (let btn of loadButtons) {
      btn.display();
  }
}

function mousePressed() {
  if (!settingMenu) {
    let activeButtons = (gameState === "menu") ? buttons : loadButtons;
    for (let btn of activeButtons) {
      if (btn.isHovered() && btn.action) {
        buttonClick();
        setTimeout(() => btn.action(), 200);
      }
    }
  }
}

function goBack() {
  gameState = "menu";
}

function buttonClick() {
  buttonSound.play();
}

function loadGame() {
  //menuSong.loop();
  window.location.href = "game.html";
}
function loadlogin() {
  //menuSong.loop();
  window.location.href = "login.html";
}

function loadCredits() {
  window.location.href = "credits.html";
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    goBack();
  }
}
//added 
function playMainSong(){
  if (mainScreenSound.isLoaded() && !mainScreenSong.isPlaying()){
    mainScreenSound.loop();
  }
}