let modal;
let volumeSlider;
let effectsVolumeSlider;
let isMuted = false;
let currVolume = 0.5;
let muteButton;
let currSong, buttonSound;
let currEffectsVolume = 0.5;
let soundEffects = {};
let DEBUG = false;

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
        <button id="backSettings" class="modal-button">Back</button>
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
    const backButton = modal.querySelector("#backSettings");
    debugButton = modal.querySelector("#debugMode");

    // Event listeners for modal
    closeButton.addEventListener("click", hideSettings);
    volumeSlider.addEventListener("input", updateVolume);
    effectsVolumeSlider.addEventListener("input", updateEffectsVolume);
    muteButton.addEventListener("click", () => {
        toggleMute();
        buttonClick();
    });
    backButton.addEventListener("click", () => {
        buttonClick();
        hideSettings();
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

function showSettings() {
    modal.style.display = "flex";
}

// Handle opening settings
function settingsClick() {
    settingMenu ? hideSettings() : showSettings();
    settingMenu = !settingMenu;
}

function hideSettings() {
    modal.style.display = "none";
}

function toggleMute() {
    console.log("toggle mute");
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


function playSoundEffect(effect) {
    if (soundEffects[effect]) {
        soundEffects[effect].amp(isMuted ? 0 : currEffectsVolume);
        soundEffects[effect].play();
    }
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