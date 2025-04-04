// ==UserScript==
// @name         Merge Counter
// @author       Krzysztof Kruk + gemini-2.5-pro-exp-03-25
// @namespace    Eyewire II
// @version      0.1
// @description  Shows number of merge pairs in the header
// @match        https://spelunker.cave-explorer.org/*
// @match        https://play.eyewire.ai/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ChrisRaven/Merge-counter/main/Merge-counter.user.js
// @downloadURL  https://raw.githubusercontent.com/ChrisRaven/Merge-counter/main/Merge-counter.user.js
// ==/UserScript==

(function() {
  'use strict';

  const CONTAINER_ID = 'neuroglancer-status-container';
  const HEADER_CLASS = 'neuroglancer-tool-status-header';
  const TARGET_ITEM_CLASS = 'graphene-merge-segments-submission';
  const ORIGINAL_TEXT_DATA_ATTR = 'data-original-status-text'; // Custom data attribute

  // --- Debounce updateCount slightly ---
  // Although the check below prevents infinite loops, debouncing can
  // slightly improve performance if many mutations happen in quick succession.
  // Adjust the delay (in ms) as needed, or remove if not desired.
  let debounceTimeout;
  const DEBOUNCE_DELAY = 50; // milliseconds

  function updateCount() {
    // Clear any pending timeout to prevent multiple updates close together
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      const container = document.getElementById(CONTAINER_ID);
      if (!container) {
        return;
      }

      const header = container.querySelector('.' + HEADER_CLASS);
      if (!header) {
        return;
      }

      let originalText = header.getAttribute(ORIGINAL_TEXT_DATA_ATTR);
      if (originalText === null) {
        originalText = header.textContent.replace(/\s*\(\d+\)\s*$/, '').trim();
        header.setAttribute(ORIGINAL_TEXT_DATA_ATTR, originalText);
      }

      const count = container.querySelectorAll('.' + TARGET_ITEM_CLASS).length;
      const newText = `${originalText || ''} (${count})`;

      // *** THE CRITICAL CHECK TO PREVENT INFINITE LOOPS ***
      // Only update the text if it's actually different from the current text.
      if (header.textContent !== newText) {
        // console.log(`Updating header text to: "${newText}"`); // Optional: for debugging
        header.textContent = newText;
      } else {
        // console.log(`Header text already correct: "${header.textContent}"`); // Optional: for debugging
      }
    }, DEBOUNCE_DELAY);
  }

  // --- MutationObserver Setup ---
  const observer = new MutationObserver((mutationsList, observer) => {
    // Call the debounced update function on any relevant DOM change.
    updateCount();
  });

  // Start observing the document body
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // --- Initial Check ---
  updateCount();

  console.log('Neuroglancer Submission Counter script loaded (v1.2 - loop prevention).');

})();