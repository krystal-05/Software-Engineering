let backButton;
let buttonSound, currVolume = 0.5;
let settingMenu = false;

function preload() {
  buttonSound = loadSound("sounds/buttonClick.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas size
  background(20); // Dark background color
  loadVolumeSetting();

  backButton = new Button("Back", 175, height - 50, 200, 50, null, null, () => goBack());
}

function draw() {
  background(20); // Keep background consistent

  // Text styling
  textAlign(CENTER, CENTER);
  fill(255); // White text
  textSize(32);
  
  // Title
  text("Game Credits", width / 2, height / 5);

  // Credits list
  textSize(24);
  text("Developed by:", width / 2, height / 3);
  text("Antonio" , width / 2, height / 3 + 35);
  text("Keegan" , width / 2, height / 3 + (35 * 2));
  text("Isra" , width / 2, height / 3 + (35 * 3));
  text("Josh" , width / 2, height / 3 + (35 * 4));
  text("Krystal" , width / 2, height / 3 + (35 * 5));
  text("Oscar" , width / 2, height / 3 + (35 * 6));
  text("Trevor" , width / 2, height / 3 + (35 * 7));
  text("Tristian" , width / 2, height / 3 + (35 * 8));
  text("Vidhi" , width / 2, height / 3 + (35 * 9));

  backButton.display();
}

function buttonClick() {
  buttonSound.play();
}

function mousePressed() {
  if (backButton.isHovered()) {
    buttonClick();
    setTimeout(() => backButton.action(), 200);
  }
  if(currSong && !currSong.isPlaying()) {
    currSong.loop();
  }
}

function loadVolumeSetting() {
  const savedVolume = localStorage.getItem("volume");
  const savedMute = localStorage.getItem("isMuted");

  if (savedVolume !== null) {
      currVolume = parseFloat(savedVolume);
  }
  if (savedMute !== null) {
      let isMuted = savedMute === "true";
      buttonSound.setVolume(isMuted ? 0 : currVolume);
  }
}

function goBack() {
  localStorage.setItem("gameState", "menu");
  window.location.href = "index.html";
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    goBack();
  }
}