let mainScreenSound;

function preload() {
  mainScreenSound = loadSound('mainScreenSound.mp3');
}

function playSound() {
  mainScreenSound.play();
}
