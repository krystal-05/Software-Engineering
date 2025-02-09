let buttons = [];
let loadButtons = [];
let gameState = "menu";
let settingMenu = false;
let bgImage, titleIcon;
let menuSong, buttonSound;

function preload() {
  bgImage = loadImage('assets/roughititlescreen.png'); 
  titleIcon = loadImage('assets/Title_Logo_2.png');
  menuSong = loadSound('sounds/gamesong.mp3');
  buttonSound = loadSound('sounds/buttonClick.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  
  /*if (menuSong.isLoaded() && !menuSong.isPlaying()) {
    menuSong.loop();
  }*/

  buttons.push(new Button("Start Game", width / 2, 260, false, () => gameState = "loadGame"));
  buttons.push(new Button("S", width - 75, height - 35, true, () => settingMenu = true));
  buttons.push(new Button("C", width - 150, height - 35, true, () => loadCredits()));
  
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
  image(titleIcon, (width / 2) - 128, 0, 256, 256);

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
      new Button("Game 1", width / 2, 200, false, () => loadGame()),
      new Button("Game 2", width / 2, 270, false, () => loadGame()),
      new Button("Game 3", width / 2, 340, false, () => loadGame()),
      new Button("B", 100, height - 50, true, () => goBack())
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
        btn.action();
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

function loadCredits() {
  window.location.href = "credits.html";
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    goBack();
  }
}