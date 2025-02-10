let backButton;

function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas size
  background(20); // Dark background color

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

function mousePressed() {
  if (backButton.isHovered()) {
    backButton.action();
  }
}

function goBack() {
  window.location.href = "index.html";
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    goBack();
  }
}