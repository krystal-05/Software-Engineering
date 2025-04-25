let dotCount = 0;
let lastUpdateTime = 0;

function startLoadingAnimation() {
    const dotsEl = document.getElementById("dots");
    if (!dotsEl) return;

    function animateDots(timestamp) {
        if (!lastUpdateTime || timestamp - lastUpdateTime > 100) {
            dotCount = (dotCount + 1) % 4;
            dotsEl.textContent = '.'.repeat(dotCount);
            lastUpdateTime = timestamp;
        }
        requestAnimationFrame(animateDots);
    }

    requestAnimationFrame(animateDots);
}

function hideLoadingScreen() {
    const loadingDiv = document.getElementById("loadingScreen");
    if (loadingDiv) {
        setTimeout(() => {
            loadingDiv.style.display = "none";
        }, 100);  
    }
}

window.addEventListener("DOMContentLoaded", startLoadingAnimation);