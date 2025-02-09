let buttons = [];
let gameState = "menu";
let settingMenu = false;
let bgImage;
let titleIcon;
let gameSong;

function preload() {
  bgImage = loadImage('assets/baseball_bg.jpg'); 
  titleIcon = loadImage('assets/Title_Logo_2.png');
  gameSong = loadSound('sounds/gamesong.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  
  if (gameSong.isLoaded() && !gameSong.isPlaying()) {
    gameSong.loop();
  }

  buttons.push(new Button("Start Game", width / 2, 260, false, () => gameState = "loadGame"));
  buttons.push(new Button("S", width - 75, height - 35, true, () => settingMenu = true));
  buttons.push(new Button("C", width - 150, height - 35, true, () => alert("Credits Screen Placeholder")));
  
  createModal();
}

function draw() {
  background(0);
  
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

  let loadButtons = [
      new Button("Game 1", width / 2, 200),
      new Button("Game 2", width / 2, 270),
      new Button("Game 3", width / 2, 340),
      new Button("B", 100, height - 50, true, goBack)
  ];

  for (let btn of loadButtons) {
      btn.display();
  }
}

function mousePressed() {
    if (!settingMenu) {
        for (let btn of buttons) {
            if (btn.isHovered() && btn.action) {
                btn.action();
            }
        }
    }
}