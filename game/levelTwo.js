function preload() {
    bgSideImage = loadImage('assets/field2.png');
    bgTopImage = loadImage('assets/flat_field1.png');
    batterGif = loadImage('assets/temp_assets/BATTER.gif');
    fielderIdleGif = loadImage('assets/temp_assets/IDLE1.gif');
    runnerRunningGif = loadImage('assets/temp_assets/RRUNGIF.gif');
    fielderRunningGif = loadImage('assets/temp_assets/LRUNGIF.gif');
    runnerIdle = loadImage('assets/temp_assets/sprites/01_idle2.png');
    catcherImg = loadImage('assets/temp_assets/sprites/01_Catch.png');
    ballImg = loadImage('assets/Baseball1.png');

    currSong = loadSound('sounds/gamesong.mp3');
    soundEffects["buttonSound"] = loadSound('sounds/buttonClick.mp3');
    soundEffects["hitBall"] = loadSound('sounds/baseballBatHitBall.mp3'); 
    audio1 = loadSound('sounds/gamesong.mp3');
    audio2 = loadSound('sounds/audio2.mp3');
    audio3 = loadSound('sounds/audio3.mp3');
    audio4 = loadSound('sounds/audio4.mp3');
    audio5 = loadSound('sounds/audio5.mp3');
}

// Set field up for next inning
function nextInning() {
    inputEnabled = false;
    outs = 0;
    runners = [];
    resetFieldersPosition()
    if (!topInning) inning++;
    topInning = !topInning;

    showOutPopup = true;
    resetBatter();
    runners = [];

    setTimeout(() => {
        showOutPopup = false;
        inputEnabled = true;
    }, 1500);

    if (inning === 2){
        window.location.href = "gameThree.html";
    }
}