// vc20.1 fix: icons pack rewrote hintButton.innerHTML, orphaning the payload's captured
// #hintButtonCount span - re-sync the live span after every updateHUD.
(function () {
  if (typeof window.updateHUD !== "function") return;
  var orig = window.updateHUD;
  window.updateHUD = function () {
    orig();
    try {
      var live = document.querySelector("#hintButton #hintButtonCount");
      if (live && typeof hintButtonCount !== "undefined" && live !== hintButtonCount) {
        live.textContent = hintButtonCount.textContent;
      }
    } catch (e) {}
  };
  // one immediate sync for the already-rendered HUD
  try { window.updateHUD(); } catch (e) {}
})();
