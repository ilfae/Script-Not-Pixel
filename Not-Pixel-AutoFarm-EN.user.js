// ==UserScript==
// @name         Not-Pixel-AutoFarm-EN
// @namespace    KittenWoof
// @match        *://*notpx.app/*
// @version      1.1
// @grant        KittenWoof
// @icon         https://notpx.app/favicon.ico
// @downloadURL  https://github.com/ilfae/Script-Not-Pixel/raw/main/Not-Pixel-AutoFarmr-EN.use.js
// @updateURL    https://github.com/ilfae/Script-Not-Pixel/raw/main/Not-Pixel-AutoFarmr-EN.user.js
// @homepage     https://github.com/ilfae/Script-Not-Pixel
// ==/UserScript==

const GAME_SETTINGS = {
    isPaused: true,
    interval: 1000,
    timer: null,
    countdown: null
};

function createMenu() {
    const controlsContainer = document.createElement('div');
    controlsContainer.style.position = 'fixed';
    controlsContainer.style.top = '0';
    controlsContainer.style.left = '50%';
    controlsContainer.style.transform = 'translateX(-50%)';
    controlsContainer.style.zIndex = '9999';
    controlsContainer.style.backgroundColor = 'black';
    controlsContainer.style.padding = '10px 20px';
    controlsContainer.style.borderRadius = '10px';
    document.body.appendChild(controlsContainer);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'center';
    controlsContainer.appendChild(buttonsContainer);

    const pauseButton = document.createElement('button');
    pauseButton.textContent = GAME_SETTINGS.isPaused ? '▶' : '❚❚';
    pauseButton.style.padding = '4px 8px';
    pauseButton.style.backgroundColor = '#5d2a8f';
    pauseButton.style.color = 'white';
    pauseButton.style.border = 'none';
    pauseButton.style.borderRadius = '10px';
    pauseButton.style.cursor = 'pointer';
    pauseButton.style.marginRight = '5px';
    pauseButton.onclick = togglePause;
    buttonsContainer.appendChild(pauseButton);

    const logDisplay = document.createElement('div');
    logDisplay.id = 'logDisplay';
    logDisplay.style.color = 'white';
    logDisplay.style.marginTop = '10px';
    controlsContainer.appendChild(logDisplay);

    function togglePause() {
        GAME_SETTINGS.isPaused = !GAME_SETTINGS.isPaused;
        pauseButton.textContent = GAME_SETTINGS.isPaused ? '▶' : '❚❚';
        if (!GAME_SETTINGS.isPaused) {
            startScript();
        } else {
            clearTimeout(GAME_SETTINGS.timer);
            clearInterval(GAME_SETTINGS.countdown);
            showTelegramLink();
        }
    }

    function updateLogDisplay(message) {
        if (!GAME_SETTINGS.isPaused) {
            logDisplay.textContent = message;
        }
    }

    function OutGamePausedTrue() {
        const GamePausedTrue = atob('VEc6IEtpdHRlbldvZg==');
        const GamePausedFalse = atob('aHR0cHM6Ly90Lm1lL2tpdHRlbndvZg==');
        logDisplay.innerHTML = <a href="${GamePausedFalse}" target="_blank" style="color: white; text-decoration: none;">${GamePausedTrue}</a>;
    }

    console.log = function(message) {
        updateLogDisplay(message);
    };

    OutGamePausedTrue();
}

createMenu();

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 500);
    }
}

function simulatePointerEvents(element, startX, startY, endX, endY) {
    const events = [
        new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true }),
        new PointerEvent('pointermove', { clientX: startX, clientY: startY, bubbles: true }),
        new PointerEvent('pointermove', { clientX: endX, clientY: endY, bubbles: true }),
        new PointerEvent('pointerup', { clientX: endX, clientY: endY, bubbles: true })
    ];

    events.forEach(event => element.dispatchEvent(event));
}

function openPaintWindow() {
    waitForElement('#canvasHolder', (canvas) => {
        const centerX = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);
        simulatePointerEvents(canvas, centerX, centerY, centerX, centerY);
        console.log('Attempting to open the painting window');
    });
}

function randomClick() {
    if (GAME_SETTINGS.isPaused) return;

    const paintButton = document.querySelector('#root > div > div._order_panel_9t9ju_1 > div > button');
    if (paintButton) {
        const buttonText = paintButton.querySelector('#root > div > div._order_panel_9t9ju_1 > div > button > span').textContent;

        if (buttonText === 'Paint') {
            waitForElement('#canvasHolder', (canvas) => {
                const moveX = Math.floor(Math.random() * 200) - 100;
                const moveY = Math.floor(Math.random() * 200) - 100;
                simulatePointerEvents(canvas, canvas.width / 2, canvas.height / 2, canvas.width / 2 + moveX, canvas.height / 2 + moveY);

                const x = Math.floor(Math.random() * canvas.width);
                const y = Math.floor(Math.random() * canvas.height);
                simulatePointerEvents(canvas, x, y, x, y);

                simulatePointerEvents(paintButton, 0, 0, 0, 0);
                const nextClickDelay = Math.floor(Math.random() * 1000) + 1000;
                setTimeout(randomClick, nextClickDelay);
            });
        } else if (buttonText === 'No energy') {
            console.log('No energy. Pausing for 1 minute.');
            setTimeout(randomClick, 60000);
        } else {
            const nextClickDelay = Math.floor(Math.random() * 1000) + 1000;
            setTimeout(randomClick, nextClickDelay);
        }
    } else {
        console.log('Painting window not found. Attempting to open.');
        openPaintWindow();
        setTimeout(randomClick, 2000);
    }
}

function checkGameCrash() {
    if (GAME_SETTINGS.isPaused) return;

    const crashElement = document.querySelector('div._container_ieygs_8');
    if (crashElement) {
        console.log('Game crashed. Reloading the page.');
        location.reload();
    } else {
        setTimeout(checkGameCrash, 2000);
    }
}

function startScript() {
    openPaintWindow();
    setTimeout(randomClick, 2000);
}

checkGameCrash();