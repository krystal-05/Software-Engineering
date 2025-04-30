let modal;
let howToModal;
let volumeSlider;
let effectsVolumeSlider;
let isMuted = false;
let currVolume = 0.5;
let muteButton;
let currSong, buttonSound;
let currEffectsVolume = 0.5;
let soundEffects = {};
let DEBUG = false;
let popupDisableInput = false, settingsDisableInput = false, inputEnabled = true;
let levelUnlockIncrement;
let currentHowToSlide = 0;

const MAX_LEVEL = 12;

if (typeof gameState === 'undefined') {
    var gameState = "preMenu"; 
}
const howToSlides = [
    {
        title: "Game Controls",
        content: `
          <p><b>Spacebar</b> – Start skill check / swing bat</p>
          <p><b>1, 2, 3</b> – Select pitch or run bases</p>
          <p><b>E</b> – Toggle camera perspective</p>
          <p><b>Escape</b> – Open settings menu</p>
        `
    },
    {
        title: "How to Navigate",
        content: `
        <ul style="text-align: left; padding-left: 20px;">
          <li>Use the world map to access levels</li>
          <li>Character selection is saved across sessions</li>
          <li>Levels unlock as you progress</li>
          <li>Settings allow volume and debug adjustments</li>
        </ul>
        `
    }
];


function createModal() {
    const style = document.createElement("style");
    style.textContent = `
    .modal {
        position: fixed;
        display: none;
        align-items: center;
        justify-content: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .modal-content {
        border: 1px solid #000000;
        background: #FFFFFF;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        width: 300px;
        max-width: 80%;
    }
    .modal-button {
        background: #DCDCDC;
        border: 1px solid #000000;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
        margin-top: 10px;
        font-weight: bold;
        color: #000000; 

    }
    .modal-button:hover {
        background-color: #6495FF;
        color: #000000;
    }
    .close-button {
        cursor: pointer;
        color: #000000;
        font-size: 20px;
        float: right;
    }
    .volume_slider {
        margin-top: 15px;
        width: 100%;
    }
  `;
    document.head.appendChild(style);

    // Create modal structure
    modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
    <div class="modal-content">
        <span class="close-button">&times;</span>
        <p><b>Settings</b></p>
        <div>
        <label for="volumeSlider">Music</label>
        <input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.01" value="1">
        </div>
        <div>
        <label for="effectsVolumeSlider">Effects</label>
        <input type="range" id="effectsVolumeSlider" class="volume-slider" min="0" max="1" step="0.01" value="1">
        </div>
        <button id="muteToggle" class="modal-button">Mute</button>
        <button id="menuSettingsButton" class="modal-button">Main Menu</button>
        <div>
            <label for="debugMode">Debug Mode</label>
            <input type="checkbox" id="debugMode"></input>
        </div>
    </div>
  `;
    document.body.appendChild(modal);

    // Get modal elements
    const closeButton = modal.querySelector(".close-button");
    volumeSlider = modal.querySelector("#volumeSlider");
    effectsVolumeSlider = modal.querySelector("#effectsVolumeSlider");
    muteButton = modal.querySelector("#muteToggle");
   // const menuSettingsButton = modal.querySelector("#menuSettingsButton");
    debugButton = modal.querySelector("#debugMode");

    // Event listeners for modal
    closeButton.addEventListener("click", () => {
        buttonClick();
        settingsClick();
    });
    volumeSlider.addEventListener("input", updateVolume);
    effectsVolumeSlider.addEventListener("input", updateEffectsVolume);
    muteButton.addEventListener("click", () => {
        toggleMute();
        buttonClick();
    });
    menuSettingsButton.addEventListener("click", () => {
        buttonClick();
        backToMenu();
    });

    debugButton.addEventListener("change", (event) => {
        DEBUG = event.target.checked;
        localStorage.setItem("debugMode", DEBUG.toString());
        console.log("debug mode: ", DEBUG);
    });

    const savedVolume = localStorage.getItem("volume");
    const savedEffectsVolume = localStorage.getItem("effectsVolume");
    const savedMute = localStorage.getItem("isMuted");
    const savedDebug = localStorage.getItem("debugMode");

    if (savedVolume !== null) {
        currVolume = parseFloat(savedVolume);
        volumeSlider.value = currVolume;
    }
    if (savedEffectsVolume !== null) {
        currEffectsVolume = parseFloat(savedEffectsVolume);
        effectsVolumeSlider.value = currEffectsVolume;
    }
    if (savedMute !== null) {
        isMuted = savedMute === "true";
        muteButton.textContent = isMuted ? "Unmute" : "Mute";
        if (currSong) {
            currSong.amp(isMuted ? 0 : currVolume);
        }
        if (buttonSound) {
            buttonSound.amp(isMuted ? 0 : currVolume);
        }
    }
    if(savedDebug !== null) {
        DEBUG = savedDebug === "true";
        debugButton.checked = DEBUG;
    }
    else {
        DEBUG = false;
        debugButton.checked = false;
    }
}


function createHowToModal() {
    const style = document.createElement("style");
    style.textContent = `
    .how-to-modal {
        position: fixed;
        display: none;
        align-items: center;
        justify-content: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }
    .how-to-modal-content {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        border: 1px solid #000000;
        background: #FFFFFF;
        padding: 20px 40px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        width: 300px;
        max-width: 80%;
    }
    .how-to-modal-button {
        background: #DCDCDC;
        border: 1px solid #000000;
        padding: 20px 10px;
        font-size: 20px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: bold;
        color: #000000;
        height: 100px;
        width: 40px;
    }
    .modal-button:hover {
        background-color: #6495FF;
        color: #000000;
    }
    .how-to-modal-slide-content {
        flex: 1;
        margin: 0 20px;
    }
  `;
    document.head.appendChild(style);

    // Create how-to modal
    howToModal = document.createElement("div");
    howToModal.classList.add("modal");
    howToModal.innerHTML = `
    <div class="how-to-modal-content" id="howToModalContent">
      <button id="prevSlide" class="how-to-modal-button">&#8592;</button>
      <div class="how-to-modal-slide-content">
        <span class="close-button" id="closeHowTo">&times;</span>
        <h2 id="howToTitle">...</h2>
        <div id="howToContent" style="margin-top: 10px; font-size: 14px;"></div>
      </div>
      <button id="nextSlide" class="how-to-modal-button">&#8594;</button>
    </div>
    `;
    document.body.appendChild(howToModal);

    document.getElementById("closeHowTo").addEventListener("click", () => {
        buttonClick();
        howToClick();
    });
    document.getElementById("prevSlide").addEventListener("click", () => {
        buttonClick();
        changeHowToSlide(-1)
    });
    document.getElementById("nextSlide").addEventListener("click", () => {
        buttonClick();
        changeHowToSlide(1)
    });

    updateHowToSlide();
}

function changeHowToSlide(direction) {
    currentHowToSlide = (currentHowToSlide + direction + howToSlides.length) % howToSlides.length;
    updateHowToSlide();
}
  
function updateHowToSlide() {
    const slide = howToSlides[currentHowToSlide];
    document.getElementById("howToTitle").textContent = slide.title;
    document.getElementById("howToContent").innerHTML = slide.content;
}


function showSettings() {
    settingsDisableInput = true;
    updateEnabledInput();
    const menuSettingsButton = modal.querySelector("#menuSettingsButton");
    if (menuSettingsButton) {
        menuSettingsButton.style.display = (gameState === "menu") ? "none" : "inline-block";
    }
    modal.style.display = "flex";
}

// Handle opening settings
function settingsClick() {
    settingMenu ? hideSettings() : showSettings();
    settingMenu = !settingMenu;
}

function hideSettings() {
    popupDisableInput = false;
    updateEnabledInput();
    modal.style.display = "none";
}

function showHowTo() {
    popupDisableInput = true;
    updateEnabledInput();
    howToModal.style.display = "flex";
}
  
  function hideHowTo() {
    settingsDisableInput = false; 
    updateEnabledInput();
    howToModal.style.display = "none";
}

function howToClick() {
    howToMenu ? hideHowTo() : showHowTo();
    howToMenu = !howToMenu;
}

function backToMenu() {
    localStorage.setItem("gameState", "menu");
    window.location.href = "index.html";
}

function toggleMute() {
    if (DEBUG) console.log("toggle mute");
    isMuted = !isMuted;
    muteButton.textContent = isMuted ? "Unmute" : "Mute";

    if (currSong) {
        currSong.amp(isMuted ? 0 : currVolume);
    }
    localStorage.setItem("volume", currVolume);
    localStorage.setItem("isMuted", isMuted.toString());
}


function updateVolume() {
    currVolume = parseFloat(volumeSlider.value);
    localStorage.setItem("volume", currVolume);
    if (!isMuted && currSong) {
        currSong.amp(currVolume);
    }
}

function buttonClick() {
    playSoundEffect("buttonSound");
}

function createUnlockIncrement(unlocked) {
    console.log(unlocked);
    if (!(unlocked >= 0)) unlocked = 0;
    let startLabel = `increment level from: ${unlocked}`;
    if (unlocked >= MAX_LEVEL) startLabel = `max level, reset levels?`;
    levelUnlockIncrement = new Button(startLabel, width * .925, height * .5, width * .12, height * .05, null, null, () => incrementLevel(unlocked));
}
function incrementLevel(unlocked) {
    unlocked = (unlocked + 1) % (MAX_LEVEL + 1);
    localStorage.setItem("unlockedLevel", unlocked);
    if (DEBUG) console.log("updated to", localStorage.getItem("unlockedLevel"));

    levelUnlockIncrement.label = `increment level from: ${unlocked}`;
    if (unlocked == MAX_LEVEL) levelUnlockIncrement.label = `max level, reset levels?`;
    levelUnlockIncrement.action = () => incrementLevel(unlocked);
}

function playSoundEffect(effect) {
    if (soundEffects[effect]) {
        soundEffects[effect].amp(isMuted ? 0 : currEffectsVolume);
        soundEffects[effect].play();
    }
}

function updateEnabledInput() {
    inputEnabled = !(settingsDisableInput || popupDisableInput);
}

function updateEffectsVolume() {
    currEffectsVolume = parseFloat(effectsVolumeSlider.value);
    localStorage.setItem("effectsVolume", currEffectsVolume);

    if (!isMuted) {
        Object.values(soundEffects).forEach((sound) => {
            sound.amp(currEffectsVolume);
        });
    }
}