let mainScreenSound;

function preload() {
  mainScreenSound = loadSound('sounds/mainScreenSound.mp3');
}

function setup() {
  mainScreenSound.play();
}
