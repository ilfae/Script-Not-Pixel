// ==UserScript==
// @name         Not Pixel Restart
// @version      1.2
// @match        *://*notpx.app/*
// @match        https://web.telegram.org/*
// @icon         https://notpx.app/favicon.ico
// @downloadURL  https://github.com/ilfae/Script-Not-Pixel/raw/main/Not-Pixel-Restart.user.js
// @updateURL    https://github.com/ilfae/Script-Not-Pixel/raw/main/Not-Pixel-Restart.user.js
// @homepage     https://github.com/ilfae/Script-Not-Pixel
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const telegramCloseSelector = '.btn-icon._BrowserHeaderButton_m63td_65';
    const telegramStartCommandSelector = '.new-message-bot-commands-view';

    function clickElement(selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.click();
      }
    }

    function restartProcess() {
      if (window.location.hostname.includes('web.telegram.org')) {
        clickElement(telegramCloseSelector);
        setTimeout(() => {
          clickElement(telegramStartCommandSelector);
        }, 3000);
      }
    }

    setInterval(restartProcess, 800000);
})();
