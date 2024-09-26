// ==UserScript==
// @name         Not Pixel AutoFarm
// @namespace    KittenWoof
// @match        *://*notpx.app/*
// @version      1.2
// @grant        none
// @icon         https://notpx.app/favicon.ico
// @downloadURL  https://github.com/ilfae/Script-Not-Pixel/raw/main/Not-Pixel-AutoFarm.user.js
// @updateURL    https://github.com/ilfae/Script-Not-Pixel/raw/main/Not-Pixel-AutoFarm.user.js
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
    controlsContainer.style.right = '0';
    controlsContainer.style.zIndex = '9999';
    controlsContainer.style.backgroundColor = 'black';
    controlsContainer.style.padding = '10px 20px';
    controlsContainer.style.borderRadius = '10px';
    controlsContainer.style.cursor = 'move';
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

    console.log = function(message) {
        updateLogDisplay(message);
    };

    OutGamePausedTrue();

    // Перемещение меню
    let isDragging = false;
    let offsetX, offsetY;

    controlsContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - controlsContainer.getBoundingClientRect().left;
        offsetY = e.clientY - controlsContainer.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newRight = window.innerWidth - (e.clientX - offsetX);
            controlsContainer.style.right = `${newRight}px`;
            controlsContainer.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = ''; // Включение выделения текста после завершения перетаскивания
    });
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
    });
}

function randomClick() {
    if (GAME_SETTINGS.isPaused) {
        setTimeout(randomClick, 1000);
        return;
    }

    const paintButton = document.evaluate('//*[@id="root"]/div/div[5]/div/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (paintButton) {
        const buttonText = paintButton.querySelector('span[class^="_button_text_"]').textContent;

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
            const randomPause = Math.floor(Math.random() * 120000) + 60000;
            console.log(`Нет энергии. Рандомная пауза: ${randomPause} мс.`);
            setTimeout(randomClick, randomPause);
        } else {
            const nextClickDelay = Math.floor(Math.random() * 1000) + 1000;
            setTimeout(randomClick, nextClickDelay);
        }
    } else {
        openPaintWindow();
        setTimeout(randomClick, 2000);
    }
}

function checkGameCrash() {
    if (GAME_SETTINGS.isPaused) return;

    const crashElement = document.querySelector('div._container_ieygs_8');
    if (crashElement) {
        console.log('Игра вылетела. Обновление страницы.');
        location.reload();
    } else {
        setTimeout(checkGameCrash, 2000);
    }
}

function startScript() {
    openPaintWindow();
    setTimeout(randomClick, 2000);
    checkGameCrash();
}

function OutGamePausedTrue() {
    const GamePausedTrue = atob('VEc6IEtpdHRlbldvZg==');
    const GamePausedFalse = atob('aHR0cHM6Ly90Lm1lL2tpdHRlbndvZg==');
    document.getElementById('logDisplay').innerHTML = `<a href="${GamePausedFalse}" target="_blank" style="color: white; text-decoration: none;">${GamePausedTrue}</a>`;
}

startScript();
