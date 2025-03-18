let audioMenu;
let exitButton;
let audio1Button;
let audio2Button;
let audio3Button;
let audio4Button;
let audio5Button;

function createAudioMenu(){
const style = document.createElement("style")
style.textContent= `
.audioMenu {
 position: fixed;
        display: none;
        align-items: center;
        justify-content: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
}
.audioMenu-content {
        border: 1px solid #000000;
        background: #FFFFFF;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        width: 300px;
        max-width: 80%;
}
.audioMenu-button:hover {
        background-color: #6495FF;
        color: #000000;
    }    
.exit-button {
        cursor: pointer;
        color: #000000;
        font-size: 20px;
        float: right;
    }   
`;
document.head.appendChild(style);

//structure of the audio menu 
audioMenu = document.createElement("div");
audioMenu.classList.add("audioMenu");
audioMenu.innerHTML = `
<div class = "audioMenu-content">
<span class= "close-button">&times;</span>
<p><b>Audio Selection</b></p>
<button id="Audio 1" class = "audioMenu-button"> audio1 </button>
<button id="Audio 2" class = "audioMenu-button"> audio2 </button>
<button id="Audio 3" class = "audioMenu-button"> audio3 </button>
<button id="Audio 4" class = "audioMenu-button"> audio4 </button>
<button id="Audio 5" class = "audioMenu-button"> audio5 </button>
</div>
`;
document.body.appendChild(audioMenu);
}

//get audioMenu elements 
exitButton = audioMenu.querySelector(".exit-button");
audio1Button = audioMenu.querySelector("#audio1");
audio2Button = audioMenu.querySelector("#audio2");
audio3Button = audioMenu.querySelector("#audio3");
audio4Button = audioMenu.querySelector("#audio4");
audio5Button = audioMenu.querySelector("#audio5");

//events- on button click
closeButton.addEventListener("click", hideAudioMenu);
audio1Button.addEventListener("click", updateAudio);
audio2Button.addEventListener("click", updateAudio);
audio3Button.addEventListener("click", updateAudio);
audio4Button.addEventListener("click", updateAudio);
audio5Button.addEventListener("click", updateAudio);

function showAudioMenu() {
    audioMenu.style.display = "flex";
}

function hideAudioMenu(){
    audioMenu.style.display = "none";
}
function updateAudio(event){
        let action = event.target.id;
     switch (action){
        case "Audio 1":
            currSong.src = "sounds/gamesong.mp3";
            break;
        case "Audio 2":
            currSong.src = "sounds/audio2.mp3";
            break;
        case "Audio 3":
            currSong.src = "sounds/audio3.mp3";
            break;
        case "Audio 4":
            currSong.src = "sounds/audio4.mp3";
            break;
        case "Audio 5":
            currSong.src = "sounds/audio5.mp3";
            break;
        default:
            console.log("Unknown selection");
            return;
    }

    currSong.play();
}
