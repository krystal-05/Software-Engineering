let bgImage;

function preload() {
  bgImage = loadImage('assets/roughititlescreen.png');
  titleIcon = loadImage('assets/OREDTitle.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  createLoginForm();
}

function draw() {
  background(bgImage);
  textSize(64);
  textAlign(CENTER, CENTER);

  // Black border
  stroke(0);
  strokeWeight(4);
  fill(255);
  image(titleIcon, (width / 2) - 320, -20, 640, 320);

  noStroke();
}

function createLoginForm() {
  let usernameInput = createInput();
  usernameInput.position(width / 2 - 100, height / 2 - 40);
  usernameInput.size(200);
  usernameInput.attribute('placeholder', 'Username');

  let passwordInput = createInput('', 'password');
  passwordInput.position(width / 2 - 100, height / 2);
  passwordInput.size(200);
  passwordInput.attribute('placeholder', 'Password');

  let loginButton = createButton('Login');
  loginButton.position(width / 2 - 50, height / 2 + 50);
  loginButton.mousePressed(() => login(usernameInput.value(), passwordInput.value()));
}

function login(username, password) {
  if (username && password) {
    let userData = {
      username: username,
      progress: localStorage.getItem(username) || 'No progress yet'
    };
    alert(`Welcome, ${userData.username}! Your progress: ${userData.progress}`);
  } else {
    alert('Please enter both username and password.');
  }
}

function saveProgress(username, progress) {
  localStorage.setItem(username, progress);
}