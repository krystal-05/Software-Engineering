let buttons = [];
let gameStarted = false;
let settingMenu = false;
let bgImage;

function preload() {
  bgImage = loadImage('baseball_bg.jpg'); 
}

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(32);
  
  buttons.push(new Button("Start Game", width / 2, 250)); 
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
    
    text("Batterground", width / 2, 130);
    
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