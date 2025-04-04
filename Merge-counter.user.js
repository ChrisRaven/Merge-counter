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
  'use strict'

  const CONTAINER_ID = 'neuroglancer-status-container'
  const HEADER_CLASS = 'neuroglancer-tool-status-header'
  const TARGET_ITEM_CLASS = 'graphene-merge-segments-submission'
  const ORIGINAL_TEXT_DATA_ATTR = 'data-original-status-text'

  let debounceTimeout;
  const DEBOUNCE_DELAY = 50

  function updateCount() {
    clearTimeout(debounceTimeout)

    debounceTimeout = setTimeout(() => {
      const container = document.getElementById(CONTAINER_ID)
      if (!container) return

      const header = container.querySelector('.' + HEADER_CLASS)
      if (!header) return

      let originalText = header.getAttribute(ORIGINAL_TEXT_DATA_ATTR)
      if (originalText === null) {
        originalText = header.textContent.replace(/\s*\(\d+\)\s*$/, '').trim()
        header.setAttribute(ORIGINAL_TEXT_DATA_ATTR, originalText)
      }

      const count = container.querySelectorAll('.' + TARGET_ITEM_CLASS).length
      const newText = `${originalText || ''} (${count})`

      if (header.textContent !== newText) {
        header.textContent = newText;
      } else {
      }
    }, DEBOUNCE_DELAY)
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    updateCount()
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  updateCount()

})()