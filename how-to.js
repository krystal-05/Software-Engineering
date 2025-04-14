let howToSlides = [];
let siteImages = [];
let slideImages = []; // Corresponding images for image slides
let currentSlide = 0;
let leftArrow, rightArrow;
let titleImage;

function preload() {
    titleImage = loadImage('assets/OREDTitle.png', () => console.log('Title image loaded'), () => console.error('Failed to load title image'));
    slideImages.push(loadImage('assets/game-start.png', () => console.log('Game start image loaded'), () => console.error('Failed to load game start image')));
    slideImages.push(loadImage('assets/log-in.png', () => console.log('Log in image loaded'), () => console.error('Failed to load log in image')));
    slideImages.push(loadImage('assets/home-page.png', () => console.log('Home page image loaded'), () => console.error('Failed to load home page image')));
    slideImages.push(loadImage('assets/character-select.png', () => console.log('Character select image loaded'), () => console.error('Failed to load character select image')));
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
            ]
        },
        {
            title: "How to Start the Game",
            content: [
                "• Click 'Start Game' on the main menu.",
                "• Select your character or load an existing one.",
                "• Follow on-screen prompts to begin the game."
            ]
        },
        {
            title: "Navigating the Website",
            content: [
                "• Use the Settings gear for volume & preferences.",
                "• Click Credits to see the dev team.",
                "• Log in or save progress under 'Load Game'."
            ]
        }
        
    ];
}
howToSlides.push(
    {
        title: "The Home Page",
        content: ["• This is where you begin!", "• Choose to log in, play a game, or go to How-To."],
        imageIndex: 2
    },
    {
        title: "Character Select",
        content: ["• Pick your player here.", "• Load a saved character or create a new one."],
        imageIndex: 3
    },
    {
        title: "Start Game",
        content: ["• Hit 'Game 1' to dive in!", "• Make sure you’re logged in to save progress."],
        imageIndex: 0
    },
    {
        title: "Log In",
        content: ["• Enter your credentials.", "• Or sign up if you're new!"],
        imageIndex: 1
    }
);

function draw() {
    background(30);
    fill(255);

    // Display Title Image
    if (titleImage) {
        const iconWidth = width * 0.3;
        const scale = iconWidth / titleImage.width;
        const iconHeight = titleImage.height * scale;
        image(titleImage, width / 2 - iconWidth / 2, -20, iconWidth, iconHeight);
    } else {
        console.error('Title image not loaded');
    }

    // Display Slide Title
    textSize(36);
    textStyle(BOLD);
    fill(255, 215, 0);
    text(howToSlides[currentSlide].title, width / 2, height * 0.25);

    // Display Slide Content
    textSize(24);
    textStyle(NORMAL);
    fill(255);
    for (let i = 0; i < howToSlides[currentSlide].content.length; i++) {
        text(howToSlides[currentSlide].content[i], width / 2, height * 0.50 + i * 40);
    }

    // Display Slide Image (if available)
    if (howToSlides[currentSlide].imageIndex !== undefined) {
        const img = slideImages[howToSlides[currentSlide].imageIndex];
        if (img) {
            const imgWidth = width * 0.4;
            const scale = imgWidth / img.width;
            const imgHeight = img.height * scale;
            image(img, width / 2 - imgWidth / 2, height * 0.65, imgWidth, imgHeight);
        } else {
            console.error(`Image for slide ${currentSlide} not loaded`);
        }
    }

    // Draw Arrows
    fill(255);
    textSize(32);
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

