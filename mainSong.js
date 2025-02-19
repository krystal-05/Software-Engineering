let mainScreenSound;

function preload() {
  mainScreenSound = loadSound('mainScreenSound.mp3');
}

function setup() {
  mainScreenSound.play();
}
