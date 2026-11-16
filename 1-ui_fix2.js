/* vc29: entry fix - with 70+ stages the start dialog grew taller than a phone
   screen; .overlay had no scroll and centered the dialog, so START was clipped
   and unreachable ("can't enter the game", only a wall of locks visible).
   Fix: overlay scrolls, dialog stays inside the viewport, the chip grid scrolls
   internally so START stays pinned at the bottom. */
(function () {
  var st = document.createElement('style');
  st.textContent =
    '.overlay{overflow-y:auto;align-items:flex-start !important;}' +
    '.overlay .dialog{margin:auto;}' +
    '#introOverlay .dialog{display:flex;flex-direction:column;' +
      'max-height:calc(100vh - 40px);max-height:calc(100dvh - 40px);}' +
    '#levelChips{max-height:38vh;overflow-y:auto;' +
      '-webkit-overflow-scrolling:touch;min-height:0;}' +
    '#introOverlay #startButton{flex:0 0 auto;}';
  document.head.appendChild(st);
})();
