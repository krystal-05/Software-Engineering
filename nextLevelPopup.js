let winPopup;
let losePopup;
let donePopup;
let restartButton;
let nextLevelButton;
let menuButton;

function createWinPopup() {
    const style = document.createElement("style")
    style.textContent= `
    .winPopup {
        position: fixed;
        display: none;
        align-items: center;
        justify-content: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .winPopup-content {
        border: 1px solid #000000;
        background: #FFFFFF;
        padding: 20px 40px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        width: 300px;
        max-width: 80%;
    }
    .winPopup-button {
        background: #DCDCDC;
        border: 1px solid #000000;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
        margin-top: 10px;
        font-weight: bold;
        color: #000000; 
        width: 100%;

    }
    .winPopup-button:hover {
        background-color: #6495FF;
        color: #000000;
    }    
    .buttons {
        display: flex;
        flex-direction: column; 
        align-items: center; 
        gap: 10px; 
        width: 100%; 
    }
    .win {
        color: green;
        font-size: 48px;
    }
    `;
    document.head.appendChild(style);

    //structure of popup
    winPopup = document.createElement("div");
    winPopup.classList.add("winPopup")
    winPopup.innerHTML = `
    <div class = "winPopup-content">
    <p class="win"><b>You Win!</b></p>
        <div class="buttons">
            <button id="nextLevelButton" class="winPopup-button"> Next Level</button>
            <button id="restartButton"  class="winPopup-button"> Restart Level</button>
        </div>
    </div>
    `;
    document.body.appendChild(winPopup);

    //get winPopup elements 
    restartButton = winPopup.querySelector("#restartButton");
    nextLevelButton = winPopup.querySelector("#nextLevelButton");

    //events- on button click
    restartButton.addEventListener("click", () => {
        buttonClick();
        restart();
        hideWinPopup();
    });
    nextLevelButton.addEventListener("click", () => {
        buttonClick();
        advance();
    });
}

function restart() {
    inning = 1;
    score.home = 0;
    score.away = 0;
    outs = 0;
    strikes = 0;
    topInning = true;
}
function advance() {
    if(lastSelectedLevel < 4) {
        window.location.href = "continentOneMap.html";
    } else if(lastSelectedLevel === 4) {
        window.location.href = "worldMap.html";
    } else if(lastSelectedLevel < 8) {
        window.location.href = "continentTwoMap.html";
    } else if(lastSelectedLevel === 8) {
        window.location.href = "worldMap.html";
    } else if(lastSelectedLevel < 12) {
        window.location.href = "continentThreeMap.html";
    }
}
function showWinPopup() {
    winPopup.style.display = "flex";
}
function hideWinPopup(){
    winPopup.style.display = "none";
}

function createLosePopup() {
    const style = document.createElement("style")
    style.textContent= `
    .losePopup {
        position: fixed;
        display: none;
        align-items: center;
        justify-content: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .losePopup-content {
        border: 1px solid #000000;
        background: #FFFFFF;
        padding: 20px 40px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        width: 300px;
        max-width: 80%;
    }
    .losePopup-button {
        background: #DCDCDC;
        border: 1px solid #000000;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
        margin-top: 10px;
        font-weight: bold;
        color: #000000; 
        width: 100%;

    }
    .losePopup-button:hover {
        background-color: #6495FF;
        color: #000000;
    }    
    .buttons {
        display: flex;
        flex-direction: column; 
        align-items: center; 
        gap: 10px; 
        width: 100%; 
    }
    .lose {
        color: red;
        font-size: 48px;
    }
    `;
    document.head.appendChild(style);

    //structure of popup
    losePopup = document.createElement("div");
    losePopup.classList.add("losePopup")
    losePopup.innerHTML = `
    <div class = "losePopup-content">
        <p class="lose"><b>You Lose!</b></p>
        <div class="buttons">
            <button id="restartButton"  class="losePopup-button"> Restart Level</button>
        </div>
    </div>
    `;
    document.body.appendChild(losePopup);

    //get losePopup elements 
    restartButton = losePopup.querySelector("#restartButton");

    //events- on button click
    restartButton.addEventListener("click", () => {
        buttonClick();
        restart();
        hideLosePopup();
    });
}
function showLosePopup() {
    losePopup.style.display = "flex";
}
function hideLosePopup(){
    losePopup.style.display = "none";
}



function createDonePopup(){ //for last level
    const style = document.createElement("style")
    style.textContent= `
    .donePopup {
        position: fixed;
        display: none;
        align-items: center;
        justify-content: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .donePopup-content {
        border: 1px solid #000000;
        background: #FFFFFF;
        padding: 20px 40px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        width: 300px;
        max-width: 80%;
    }
    .donePopup-button {
        background: #DCDCDC;
        border: 1px solid #000000;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
        margin-top: 10px;
        font-weight: bold;
        color: #000000; 
        width: 100%;

    }
    .donePopup-button:hover {
        background-color: #6495FF;
        color: #000000;
    }    
    .buttons {
        display: flex;
        flex-direction: column; 
        align-items: center; 
        gap: 10px; 
        width: 100%; 
    }
    .win {
        color: green;
        font-size: 48px;
    }
    `;
    document.head.appendChild(style);

    //structure of popup
    donePopup = document.createElement("div");
    donePopup.classList.add("donePopup")
    donePopup.innerHTML = `
    <div class = "donePopup-content">
        <p class="win"><b>You Win!</b></p>
        <div class="buttons">
            <button id="restartButton"  class="donePopup-button"> Restart Level</button>
            <button id="menuButton" class="donePopup-button"> Menu </button>
        </div>
    </div>
    `;
    document.body.appendChild(donePopup);

    //get donePopup elements 
    restartButton = donePopup.querySelector("#restartButton");
    menuButton = donePopup.querySelector("#menuButton");

    //events- on button click
    restartButton.addEventListener("click", () => {
        buttonClick();
        restart();
        hideDonePopup();
    });

    menuButton.addEventListener("click", () => {
        buttonClick();
        window.location.href = "index.html"
    });
}

function showDonePopup() {
    donePopup.style.display = "flex";
}
function hideDonePopup(){
    donePopup.style.display = "none";
}
