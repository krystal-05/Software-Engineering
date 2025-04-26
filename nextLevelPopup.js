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
    .stats-table {
        width: 100%;
        margin: 20px 0;
        border-collapse: collapse;
    }
    .stats-table th, .stats-table td {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
        font-size: 14px;
    }
    .stats-table th {
        background-color: #f2f2f2;
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

    winPopup = document.createElement("div");
    winPopup.classList.add("winPopup")
    winPopup.innerHTML = `
    <div class="winPopup-content">
        <p class="win"><b>You Win!</b></p>

        <table class="stats-table">
            <thead>
                <tr>
                    <th>Stat</th>
                    <th>Your Team</th>
                    <th>Opposing Team</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Score</td><td id="stat-your-score">0</td><td id="stat-opponent-score">0</td></tr>
                <tr><td>Hits</td><td id="stat-your-hits">0</td><td id="stat-opponent-hits">0</td></tr>
                <tr><td>Strikes</td><td id="stat-your-strikes">0</td><td id="stat-opponent-strikes">0</td></tr>
                <tr><td>Strikeouts</td><td id="stat-your-strikeouts">0</td><td id="stat-opponent-strikeouts">0</td></tr>
                <tr><td>Home Runs</td><td id="stat-your-homeruns">0</td><td id="stat-opponent-homeruns">0</td></tr>
                <tr><td>Fouls</td><td id="stat-your-fouls">0</td><td id="stat-opponent-fouls">0</td></tr>
            </tbody>
        </table>
        <div class="buttons">
            <button id="nextLevelButton" class="winPopup-button"> Next Level</button>
            <button id="restartButton"  class="winPopup-button"> Restart Level</button>
        </div>
    </div>
    `;
    document.body.appendChild(winPopup);

    // get popup elements 
    restartButton = winPopup.querySelector("#restartButton");
    nextLevelButton = winPopup.querySelector("#nextLevelButton");

    // events - on button click
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

function updateStatsTableSingleSide(stats, isPlayerBatting, popupType = "win") {
    const prefix = popupType === "win" ? "" : "lose-";

    if (isPlayerBatting) {
        document.getElementById(`${prefix}stat-your-score`).textContent = stats.score;
        document.getElementById(`${prefix}stat-your-hits`).textContent = stats.hits;
        document.getElementById(`${prefix}stat-your-strikes`).textContent = stats.strikes;
        document.getElementById(`${prefix}stat-your-strikeouts`).textContent = stats.strikeouts;
        document.getElementById(`${prefix}stat-your-homeruns`).textContent = stats.homeruns;
        document.getElementById(`${prefix}stat-your-fouls`).textContent = stats.fouls;
    } else {
        document.getElementById(`${prefix}stat-opponent-score`).textContent = stats.score;
        document.getElementById(`${prefix}stat-opponent-hits`).textContent = stats.hits;
        document.getElementById(`${prefix}stat-your-strikes`).textContent = stats.strikes;
        document.getElementById(`${prefix}stat-opponent-strikeouts`).textContent = stats.strikeouts;
        document.getElementById(`${prefix}stat-opponent-homeruns`).textContent = stats.homeruns;
        document.getElementById(`${prefix}stat-opponent-fouls`).textContent = stats.fouls;
    }
}

function restart() {
    inning = 1;
    score.home = 0;
    score.away = 0;
    outs = 0;
    strikes = 0;
    strikeouts = 0;
    topInning = true;
    totalHomeRunsPlayer = 0;
    totalHomeRunsOpponent = 0;
    totalFoulsPlayer = 0;
    totalFoulsOpponent = 0;
    totalHitsPlayer = 0;
    totalHitsOpponent = 0;
    totalSwingsPlayer = 0;
    totalSwingsOpponent = 0;
    totalStrikeoutsPlayer = 0;
    totalStrikeoutsOpponent = 0;
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
    let playerHitAverage = (totalSwingsPlayer > 0) ? (totalHitsPlayer / totalSwingsPlayer) : 0;
    let opponentHitAverage = (totalSwingsOpponent > 0) ? (totalHitsOpponent / totalSwingsOpponent) : 0;
    updateStatsTableSingleSide(
        {
            score: score.away,
            hits: totalHitsPlayer,
            strikes: strikes,
            strikeouts: totalStrikeoutsPlayer,
            homeruns: totalHomeRunsPlayer ,
            fouls: totalFoulsPlayer,
        },
        true,
        "win"
    );

    updateStatsTableSingleSide(
        {
            score: score.home,
            hits: totalHitsOpponent,
            strikes: strikes,
            strikeouts: totalStrikeoutsOpponent,
            homeruns: totalHomeRunsOpponent,
            fouls: totalFoulsOpponent,
        },
        false, 
        "win"
    );
    winPopup.style.display = "flex";
}

function hideWinPopup(){
    winPopup.style.display = "none";
}

function createLosePopup() {

    const style = document.createElement("style");
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
    .stats-table {
        width: 100%;
        margin: 20px 0;
        border-collapse: collapse;
    }
    .stats-table th, .stats-table td {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
        font-size: 14px;
    }
    .stats-table th {
        background-color: #f2f2f2;
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

    // structure of popup
    losePopup = document.createElement("div");
    losePopup.classList.add("losePopup");
    losePopup.innerHTML = `
    <div class="losePopup-content">
        <p class="lose"><b>You Lose!</b></p>

        <table class="stats-table">
            <thead>
                <tr>
                    <th>Stat</th>
                    <th>Your Team</th>
                    <th>Opposing Team</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Score</td><td id="lose-stat-your-score">0</td><td id="lose-stat-opponent-score">0</td></tr>
                <tr><td>Hits</td><td id="lose-stat-your-hits">0</td><td id="lose-stat-opponent-hits">0</td></tr>
                <tr><td>Strikes</td><td id="lose-stat-your-strikes">0</td><td id="lose-stat-opponent-strikes">0</td></tr>
                <tr><td>Strikeouts</td><td id="lose-stat-your-strikeouts">0</td><td id="lose-stat-opponent-strikeouts">0</td></tr>
                <tr><td>Home Runs</td><td id="lose-stat-your-homeruns">0</td><td id="lose-stat-opponent-homeruns">0</td></tr>
                <tr><td>Fouls</td><td id="lose-stat-your-fouls">0</td><td id="lose-stat-opponent-fouls">0</td></tr>
            </tbody>
        </table>

        <div class="buttons">
            <button id="restartButton" class="losePopup-button"> Restart Level</button>
        </div>
    </div>
    `;
    document.body.appendChild(losePopup);

    // get losePopup elements 
    restartButton = losePopup.querySelector("#restartButton");

    // events - on button click
    restartButton.addEventListener("click", () => {
        buttonClick();
        restart();
        hideLosePopup();
    });
}
function showLosePopup() {
    let playerHitAverage = (totalSwingsPlayer > 0) ? (totalHitsPlayer / totalSwingsPlayer) : 0;
    let opponentHitAverage = (totalSwingsOpponent > 0) ? (totalHitsOpponent / totalSwingsOpponent) : 0;
    updateStatsTableSingleSide(
        {
            score: score.away,
            hits: totalHitsPlayer,
            strikes: strikes,
            strikeouts: totalStrikeoutsPlayer,
            homeruns: totalHomeRunsPlayer ,
            fouls: totalFoulsPlayer,
        },
        true,
        "lose"
    );

    updateStatsTableSingleSide(
        {
            score: score.home,
            hits: totalHitsOpponent,
            strikes: strikes,
            strikeouts: totalStrikeoutsOpponent,
            homeruns: totalHomeRunsOpponent,
            fouls: totalFoulsOpponent,
        },
        false, 
        "lose"
    );
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
