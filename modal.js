let modal;
let volumeSlider;
let isMuted = false;
let currVolume = 1.0;
let muteButton;


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
        <label for="volumeSlider">Volume</label>
        <input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.01" value="1">
        </div>
        <button id="muteToggle" class="modal-button">Mute</button>
        <button id="backSettings" class="modal-button">Back</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Get modal elements
  const closeButton = modal.querySelector(".close-button");
  volumeSlider = modal.querySelector("#volumeSlider");
  muteButton = modal.querySelector("#muteToggle");
  const backButton = modal.querySelector("#backSettings");

  // Event listeners for modal
  closeButton.addEventListener("click", hideSettings);
  volumeSlider.addEventListener("input", updateVolume);
  muteButton.addEventListener("click", toggleMute);
  backButton.addEventListener("click", hideSettings);

  const savedVolume = localStorage.getItem("volume");
  if (savedVolume !== null) {
    currVolume = parseFloat(savedVolume);
    volumeSlider.value = currVolume;
    if (gameSong) gameSong.setVolume(currVolume);
  }

}

function showSettings() {
  modal.style.display = "flex";
}

function hideSettings() {
  settingMenu = false;
  modal.style.display = "none";
}

function toggleMute() {
  if (!gameSong) return;
  
  if (isMuted) {
    gameSong.setVolume(currVolume);
    muteButton.textContent = "Mute";
  } else {
    currVolume = parseFloat(volumeSlider.value);
    gameSong.setVolume(0);
    muteButton.textContent = "Unmute";
  }
  isMuted = !isMuted;
  localStorage.setItem("volume", currVolume);
}

function updateVolume() {
  if (!isMuted) {
    let volume = parseFloat(volumeSlider.value);
    gameSong.setVolume(volume);
    localStorage.setItem("volume", volume);
  }
}

function goBack() {
  gameState = "menu";
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    goBack();
  }
}