let mainScreenSound;

function preload() {
  mainScreenSound = loadSound('sounds/mainScreenSound.mp3');
}

function setup() {
  createCanvas(400,200);
  if(mousePressed()){
    mainScreenSound.play();
  }
}
