let buttons = [];
let gameStarted = false;
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
}

function mousePressed() {
  for (let btn of buttons) {
    if (btn.isHovered()) {
      console.log(btn.label + " clicked");
      if (btn.label === "Start Game") {
        gameStarted = true;
      }
    }
  }
}

class Button {
  constructor(label, x, y, isCircle = false) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.diameter = 50; 
    this.isCircle = isCircle;
    this.fontSize = 16; 
  }
  
  display() {
    if (this.isHovered()) {
      fill(100, 150, 255);
    } else {
      fill(200);
    }
    
    if (this.isCircle) {
      ellipse(this.x, this.y, this.diameter); 
    } else {
      rectMode(CENTER);
      rect(this.x, this.y, 200, 50, 10); 
    }
    
    fill(0);
    textSize(this.fontSize); 
    text(this.label, this.x, this.y);
  }
  
  isHovered() {
    if (this.isCircle) {
      let distance = dist(mouseX, mouseY, this.x, this.y);
      return distance < this.diameter / 2;
    } else {
      return (
        mouseX > this.x - 100 &&
        mouseX < this.x + 100 &&
        mouseY > this.y - 25 &&
        mouseY < this.y + 25
      );
    }
  }
}
