let initialPopup;

function createInitialPopup() {
    const style = document.createElement("style")
    style.textContent= `
    .initialPopup {
        position: fixed;
        display: none;
        align-items: center;
        justify-content: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .initialPopup-content {
        border: 1px solid black;
        background: url('assets/premenu.png');
        background-size: cover;
        padding: 100px 100px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        width: 800px;
        height: 600px;
        max-width: 100%;
    }

    `;
    document.head.appendChild(style);

    //structure of popup
    initialPopup = document.createElement("div");
    initialPopup.classList.add("initialPopup");
    initialPopup.innerHTML = `
   <div class="initialPopup-content">
    </div>
`;

document.body.appendChild(initialPopup);
}
function hideInitialPopup() {
    initialPopup.style.display = "none";
    gameState = "menu";  
    currSong.play();

}

function showInitialPopup() {
    initialPopup.style.display = "flex";
    document.addEventListener('click', hideInitialPopup, { once: true });
    //set once: true so the sound doesn't repeatedly start when clicking on main menu
}