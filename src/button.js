class Button {
    constructor(label, x, y, width, height, img = null, imgHover = null, action = null, isSettingsButton = false, isAudioMenuButton = false, isHowToButton = false) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = img;
        this.imgHover = imgHover;
        this.action = action;
        this.isSettingsButton = isSettingsButton;
        this.isAudioMenuButton = isAudioMenuButton;
        this.isHowToButton = isHowToButton;
    }
  
    display() {
        push();
            let showHover = this.isHovered();
            let canHover = (!settingMenu || this.isSettingsButton) && 
                           (!audioSelectionMenu || this.isAudioMenuButton) && 
                           (!howToMenu || this.isHowToButton);
            if(showHover && canHover) {
                cursor('pointer');
            }
            if (this.img && this.imgHover) {
                image(
                    (showHover && canHover) ? this.imgHover : this.img, 
                    this.x - this.width / 2, 
                    this.y - this.height / 2, 
                    this.width, 
                    this.height
                );
            } else {
                rectMode(CENTER);
                fill((showHover && canHover) ? color(100, 150, 255) : color(200));
                rect(this.x, this.y, this.width, this.height, 10);
                fill(0);
                textSize(16);
                textAlign(CENTER, CENTER);
                text(this.label, this.x, this.y);
            }
        pop();
    }
    
  
    isHovered() {
        return (
            mouseX > this.x - this.width / 2 &&
            mouseX < this.x + this.width / 2 &&
            mouseY > this.y - this.height / 2 &&
            mouseY < this.y + this.height / 2
        );
    }
}

function resetCreditButtonLocation() {
    let buttonSize = min(width * 0.1, height * 0.1);
    let baseDefWidth = buttonSize * 1.4;
    let baseDefHeight = buttonSize * 0.45;
    let minDefWidth = 120;
    let minDefHeight = 30;
    let defButtonWidth = Math.max(baseDefWidth, minDefWidth);
    let defButtonHeight = Math.max(baseDefHeight, minDefHeight);

    backButton.x = width * .1;
    backButton.y = height * .925;
    backButton.width = defButtonWidth;
    backButton.height = defButtonHeight;
}

function resetGameButtonLocation() {
    let buttonSize = min(width * 0.1, height * 0.1);
    let baseDefWidth = buttonSize * 1.4;
    let baseDefHeight = buttonSize * 0.45;
    let minDefWidth = 120;
    let minDefHeight = 30;
    let defButtonWidth = Math.max(baseDefWidth, minDefWidth);
    let defButtonHeight = Math.max(baseDefHeight, minDefHeight);
    
    const widthGap = width * 0.07;
    const heightGap = height * 0.1;
    let settingsButtonX = width - widthGap / 2;
    let settingsButtonY = heightGap / 2;

    settingButton.x = settingsButtonX;
    settingButton.y = settingsButtonY;
    settingButton.width = buttonSize;
    settingButton.height = buttonSize;

    howToButton.x = settingsButtonX - widthGap;
    howToButton.y = settingsButtonY;
    howToButton.width = buttonSize;
    howToButton.height = buttonSize;

    audioButton.x = settingsButtonX * 0.995;
    audioButton.y = settingsButtonY * 5;
    audioButton.width = defButtonWidth;
    audioButton.height = defButtonHeight;

    nextHalfInning.x = settingsButtonX * 0.995;
    nextHalfInning.y = settingsButtonY * 6;
    nextHalfInning.width = defButtonWidth;
    nextHalfInning.height = defButtonHeight;

    AddScore.x = settingsButtonX * 0.995;
    AddScore.y = settingsButtonY * 7;
    AddScore.width = defButtonWidth
    AddScore.height = defButtonHeight;

    loseDemo.x = settingsButtonX * 0.995;
    loseDemo.y = settingsButtonY * 10;
    loseDemo.width = defButtonWidth;
    loseDemo.height = defButtonHeight;

    winDemo.x = settingsButtonX * 0.995;
    winDemo.y = settingsButtonY * 11;
    winDemo.width = defButtonWidth;
    winDemo.height = defButtonHeight;
}