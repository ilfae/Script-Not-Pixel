// ==UserScript==
// @name         Not Pixel AutoFarm
// @namespace    KittenWoof
// @match        *://*notpx.app/*
// @version      1.5
// @grant        none
// @icon         https://notpx.app/favicon.ico
// @downloadURL  https://github.com/ilfae/Script-Not-Pixel/raw/main/Not-Pixel-AutoFarm.user.js
// @updateURL    https://github.com/ilfae/Script-Not-Pixel/raw/main/Not-Pixel-AutoFarm.user.js
// @homepage     https://github.com/ilfae/Script-Not-Pixel
// ==/UserScript==

const GAME_SETTINGS = {
  minDelay: 1000,
  maxDelay: 2000,
  minPauseDuration: 60000,
  maxPauseDuration: 180000,
  autoClaimEnabled: false,
  autoClaimMinDelay: 120000,
  autoClaimMaxDelay: 600000,
  autoChangeColorEnabled: false,
  autoChangeColorMinDelay: 120000,
  autoChangeColorMaxDelay: 600000,
  isPaused: false,
  interval: 1000,
  timer: null,
  countdown: null,
  isClickInProgress: false,
  noEnergyTimeout: null
};




function createMenu() {
  const controlsContainer = document.createElement('div');
  controlsContainer.style.position = 'fixed';
  controlsContainer.style.bottom = '0';
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

  const hiddenLink = document.createElement('div');
  hiddenLink.id = 'logDisplay';
  hiddenLink.style.color = 'white';
  hiddenLink.style.marginBottom = '10px';
  controlsContainer.prepend(hiddenLink);
  OutGamePausedTrue();

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

  function togglePause() {
    GAME_SETTINGS.isPaused = !GAME_SETTINGS.isPaused;
    pauseButton.textContent = GAME_SETTINGS.isPaused ? '▶' : '❚❚';

    if (!GAME_SETTINGS.isPaused) {
      GAME_SETTINGS.autoClaimEnabled = true;
      GAME_SETTINGS.autoChangeColorEnabled = true;
      startScript();
    } else {
      GAME_SETTINGS.autoClaimEnabled = false;
      GAME_SETTINGS.autoChangeColorEnabled = false;
    }
  }
}

function OutGamePausedTrue() {
  const GamePausedTrue = atob('VEc6IEtpdHRlbldvZg==');
  const GamePausedFalse = atob('aHR0cHM6Ly90Lm1lL2tpdHRlbndvZg==');
  document.getElementById('logDisplay').innerHTML = `<a href="${GamePausedFalse}" target="_blank" style="color: white; text-decoration: none;">${GamePausedTrue}</a>`;
}

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

function triggerEvents(element) {
  const events = [
      new PointerEvent('pointerdown', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0.5, pointerType: "touch" }),
      new MouseEvent('mousedown', { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
      new PointerEvent('pointerup', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, pointerType: "touch" }),
      new MouseEvent('mouseup', { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
      new PointerEvent('click', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, pointerType: "touch" }),
      new PointerEvent('pointerout', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, pointerType: "touch" }),
      new PointerEvent('pointerleave', { bubbles: true, cancelable: true, isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, pointerType: "touch" }),
      new MouseEvent('mouseout', { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
      new MouseEvent('mouseleave', { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 })
  ];

  events.forEach((event, index) => {
      setTimeout(() => element.dispatchEvent(event), index * 100);
  });
}

function openPaintWindow() {
  waitForElement('#canvasHolder', (canvas) => {
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    simulatePointerEvents(canvas, centerX, centerY, centerX, centerY);
  });
}

function randomClick() {
  if (GAME_SETTINGS.isClickInProgress || GAME_SETTINGS.isPaused) {
      return;
  }

  GAME_SETTINGS.isClickInProgress = true;

  const paintButton = document.evaluate('//*[@id="root"]/div/div[6]/div/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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
        const nextClickDelay = getRandomDelay(GAME_SETTINGS.minDelay, GAME_SETTINGS.maxDelay);
        GAME_SETTINGS.isClickInProgress = false;
        setTimeout(randomClick, nextClickDelay);
      });
    } else if (buttonText === 'No energy') {
      if (GAME_SETTINGS.noEnergyTimeout === null) {
        const randomPause = getRandomDelay(GAME_SETTINGS.minPauseDuration, GAME_SETTINGS.maxPauseDuration);
        GAME_SETTINGS.noEnergyTimeout = setTimeout(() => {
          GAME_SETTINGS.noEnergyTimeout = null;
          GAME_SETTINGS.isClickInProgress = false;
          randomClick();
        }, randomPause);
      } else {
        GAME_SETTINGS.isClickInProgress = false;
        setTimeout(randomClick, 1000);
      }
    } else {
      const nextClickDelay = getRandomDelay(GAME_SETTINGS.minDelay, GAME_SETTINGS.maxDelay);
      GAME_SETTINGS.isClickInProgress = false;
      setTimeout(randomClick, nextClickDelay);
    }
  } else {
    openPaintWindow();
    GAME_SETTINGS.isClickInProgress = false;
    setTimeout(randomClick, 2000);
  }
}

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function autoClaimReward() {
  if (GAME_SETTINGS.isPaused || !GAME_SETTINGS.autoClaimEnabled) {
    return;
  }

  tryClaimReward();

  function tryClaimReward() {
    const openRewardButton = document.querySelector('button._button_tksty_1');
    const claimTimer = document.querySelector('div._info_3i6l4_32');
    const loadingInfo = document.querySelector('div._container_3i6l4_1 > div._info_3i6l4_32');

    if (claimTimer && (claimTimer.textContent.includes('CLAIM IN') || (loadingInfo && loadingInfo.textContent === 'Loading...'))) {
      const exitButton = document.querySelector('button._button_1cryl_1');
      if (exitButton) {
        triggerEvents(exitButton);
      }
    } else if (openRewardButton) {
      triggerEvents(openRewardButton);

      setTimeout(() => {
        const claimButton = document.querySelector('button._button_3i6l4_11');
        if (claimButton) {
          triggerEvents(claimButton);

          setTimeout(() => {
            const exitButton = document.querySelector('button._button_1cryl_1');
            if (exitButton) {
              triggerEvents(exitButton);
            }
          }, 1000);
        }
      }, 2000);
    }

    setTimeout(tryClaimReward, 300000);
  }
}



function changeColor() {
  if (GAME_SETTINGS.isPaused || !GAME_SETTINGS.autoChangeColorEnabled) {
      return;
  }

  function tryChangeColor() {
      const expandablePanel = document.querySelector('div._expandable_panel_layout_1v9vd_1');
      if (expandablePanel && expandablePanel.style.height !== '0px' && expandablePanel.style.opacity !== '0') {
          const colors = document.querySelectorAll('div._color_item_epppt_22');
          if (colors.length === 0) {
              setTimeout(tryChangeColor, 1000);
              return;
          }

          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          setTimeout(() => triggerEvents(randomColor), 1000);

          const activeColor = document.evaluate('//*[@id="root"]/div/div[6]/div/div[2]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          setTimeout(() => triggerEvents(activeColor), 2000);
          return;
      }

      const activeColor = document.evaluate('//*[@id="root"]/div/div[6]/div/div[2]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (!activeColor) {
          setTimeout(tryChangeColor, 1000);
          return;
      }
      triggerEvents(activeColor);

      const colors = document.querySelectorAll('div._color_item_epppt_22');
      if (colors.length === 0) {
          setTimeout(tryChangeColor, 1000);
          return;
      }

      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setTimeout(() => triggerEvents(randomColor), 1000);

      setTimeout(() => triggerEvents(activeColor), 2000);
  }

  tryChangeColor();

  const nextChangeDelay = getRandomDelay(GAME_SETTINGS.autoChangeColorMinDelay, GAME_SETTINGS.autoChangeColorMaxDelay);
  setTimeout(changeColor, nextChangeDelay);
}

function startScript() {
  if (!GAME_SETTINGS.isPaused) {
    openPaintWindow();
    setTimeout(randomClick, 2000);
    setTimeout(autoClaimReward, 2000);
    setTimeout(changeColor, 2000);
  }
}

function initializeScript() {
  createMenu();
  startScript();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeScript);
} else {
  initializeScript();
}
