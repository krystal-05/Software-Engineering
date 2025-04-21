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
        max-width: 100%;
        max-height: 100%;
    }
    .initialPopup-content {
        background: url('assets/premenu.png');
        background-size: cover;
        padding: 30px 45px;
        text-align: center;
        width: 100vh;
        height: 100vh;
       
    }
    .initialPopup-content p {
      color: white;
      text-align: center;
      padding-left: 20px;
      margin: 200px 0;             
    }
    .initialPopup-content .first_message {
      font-size: 72px;
    }
    .initialPopup-content .second_message {
      font-size: 32px;
    }
    `;
    document.head.appendChild(style);

    //structure of popup
    initialPopup = document.createElement("div");
    initialPopup.classList.add("initialPopup");
    initialPopup.innerHTML = `
   <div class="initialPopup-content">
            <p class="first_message"><b>Welcome to Batterground!</b></p>
            <p class="second_message"><b>Click anywhere to continue</b></p>
    </div>
`;

document.body.appendChild(initialPopup);
document.addEventListener("click", () => {
    hideInitialPopup();
});
}

function hideInitialPopup(){
    initialPopup.style.display = "none";
    gameState = "menu";  // Set game state to menu after popup closes
}

function showInitialPopup(){
    initialPopup.style.display = "flex"; 
}