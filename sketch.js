let buttons = [];
let gameStarted = false;
let settingMenu = false;
let bgImage;
let titleIcon;

function preload() {
  bgImage = loadImage('assets/baseball_bg.jpg'); 
  titleIcon = loadImage('assets/Title_Logo_2.png')
}

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(32);
  
  buttons.push(new Button("Start Game", width / 2, 260)); 
  buttons.push(new Button("Settings", width - 75, height - 35, true)); 
  buttons.push(new Button("Credits", width - 150, height - 35, true));
  
  createModal(settingMenu);
}

function draw() {
  background(bgImage);
  
  if (gameStarted) {
    text("Game started", width / 2, height / 2);
  } else {
    textStyle(BOLD);
  
    fill(255);
    textSize(64);
    stroke(0);
    image(titleIcon, (width / 2) - 128, 0, 256, 256);
    
    textStyle(NORMAL);
    for (let btn of buttons) {
      btn.display();
    }
  }
  
  if (settingMenu) {
    showSettings();
  }
}

function mousePressed() {
  if (!settingMenu) {
    for (let btn of buttons) {
      if (btn.isHovered()) {
        console.log(btn.label + " clicked");
        switch(btn.label) {
          case "Start Game":
            gameStarted = true;
            break;
          case "Settings":
            settingMenu = true;
        }
      }
    }
  }
}