let buttons = [];
let gameStarted = false;
let settingMenu = false;
let bgImage;
let titleIcon;

function preload() {
  bgImage = loadImage('assets/baseball_bg.jpg'); 
  titleIcon = createImg('assets/Title_Logo_2.png','Title_Icon');
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
    
    titleIcon.size(256,256);
    titleIcon.position(160 ,-25);
    //text("Batterground", width / 2, 130); <- Batterground text
    
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