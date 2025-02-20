let mainScreenSound;

function preload() {
  mainScreenSound = loadSound('sounds/mainScreenSound.mp3');
}

function mouseClicked() {
    mainScreenSound.play();
  }

