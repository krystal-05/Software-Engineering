let howToSlides = [];
let siteImages = [];
let slideImages = []; // Corresponding images for image slides
let currentSlide = 0;
let leftArrow, rightArrow;
let titleImage;
let bgImages = [];

function preload() {
    // Title + slide images already loaded...
    slideImages.push(loadImage('assets/game-start.png'));
    slideImages.push(loadImage('assets/log-in.png'));
    slideImages.push(loadImage('assets/home-page.png'));

    // Backgrounds for specific slides
    bgImages.push(loadImage('assets/baseball-game.png'));      // bgImages[0] = Baseball rules
    bgImages.push(loadImage('assets/start-screen.png'));       // bgImages[1] = Navigating website
    bgImages.push(loadImage('assets/character-select.png')); // bgImages[2] = Character select
    bgImages.push(loadImage('assets/map-screen.png')); // bgImages[3] = Map navigation

}


function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    textSize(28);

    howToSlides = [
        {
            title: "How to Play Baseball",
            content: [
                "• 2 teams take turns batting and fielding.",
                "• The goal is to score runs by hitting the ball and running bases.",
                "• 3 strikes = out, 3 outs = switch sides.",
                "• 9 innings in a full game."
            ],
            bgIndex: 0 // baseball-game.png
        },
        {
            title: "How to Start the Game",
            content: [
                "• Click 'Start Game' on the main menu.",
                "• Select your character or load an existing one.",
                "• Select an open level to play.",
                "• You can only move on to the next level once the initial one has been completed."
            ],
            bgIndex:2 // character-select.png
        },
        {
            title: "Map Navigation",
            content: [
                "• Select a level to play.",
                "• You can only move on to the next level after beating the previous one.",
                "• Click the 'Secret Level' button to unlock a special level.",
            ],
            bgIndex:3 // character-select.png
        },
     
                {
            title: "Navigating the Website",
            content: [
                "• Use the Settings gear for volume & preferences.",
                "• Click Credits to see the dev team.",
                "• Log in or save progress under 'Load Game'."
            ],
            bgIndex: 1 // start-screen.png
        }
        
    ];
}

function draw() {
    background(30); // fallback base

    // Custom background if defined
    let bgIndex = howToSlides[currentSlide].bgIndex;
    if (bgIndex !== undefined && bgImages[bgIndex]) {
        image(bgImages[bgIndex], 0, 0, width, height);
    }

    fill(255,215, 0);

    // Display Title Image
    if (titleImage) {
        const iconWidth = width * 0.3;
        const scale = iconWidth / titleImage.width;
        const iconHeight = titleImage.height * scale;
        image(titleImage, width / 2 - iconWidth / 2, -20, iconWidth, iconHeight);
    }

    // Slide Title
    textSize(36);
    textStyle(BOLD);
    fill(0);
    text(howToSlides[currentSlide].title, width / 2, height * 0.25);

    // Slide Content
    textSize(24);
    textStyle(NORMAL);
    fill(0);
    for (let i = 0; i < howToSlides[currentSlide].content.length; i++) {
        text(howToSlides[currentSlide].content[i], width / 2, height * 0.50 + i * 40);
    }

    // Slide image (in-canvas image, optional)
    if (howToSlides[currentSlide].imageIndex !== undefined) {
        const img = slideImages[howToSlides[currentSlide].imageIndex];
        if (img) {
            const imgWidth = width * 0.4;
            const scale = imgWidth / img.width;
            const imgHeight = img.height * scale;
            image(img, width / 2 - imgWidth / 2, height * 0.65, imgWidth, imgHeight);
        }
    }
}


function mousePressed() {
    // Check if left arrow is clicked
    if (mouseX < width * 0.2 && mouseY > height * 0.85) {
        currentSlide = (currentSlide - 1 + howToSlides.length) % howToSlides.length;
    }
    // Check if right arrow is clicked
    if (mouseX > width * 0.8 && mouseY > height * 0.85) {
        currentSlide = (currentSlide + 1) % howToSlides.length;
    }
}

