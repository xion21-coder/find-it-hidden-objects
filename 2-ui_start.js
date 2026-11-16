/* vc30: proper start screen (Hoin 11/17) + chip-grid staleness fix.
   - Replaces the bare intro dialog with a real start screen: logo, progress
     summary, big PLAY/CONTINUE button, scrollable stage select, settings entry.
   - Fixes chips rendering before stage packs execute (grid showed only 63 of
     74 stages until a level was completed).
   Pure override: no payload edits, keeps #levelChips / #startButton ids. */
(function () {
  var isKo = (typeof T !== 'undefined' && T.start === '시작하기');

  var css = document.createElement('style');
  css.textContent =
    '#introOverlay .dialog{width:min(390px,100%);padding:24px 20px;}' +
    '.ss-logo{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:4px;}' +
    '.ss-logo-icon{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;' +
      'font-size:28px;background:linear-gradient(135deg,#f0c66d,#d89b48);box-shadow:0 6px 18px rgba(216,155,72,.35);}' +
    '.ss-logo-text{text-align:left;}' +
    '.ss-logo-title{font-size:30px;font-weight:900;letter-spacing:3px;color:#f0c66d;line-height:1.05;}' +
    '.ss-logo-sub{font-size:12px;letter-spacing:2px;color:#9db8c4;font-weight:700;}' +
    '.ss-tagline{color:#9db8c4;font-size:12.5px;line-height:1.55;margin:10px 0 14px;}' +
    '.ss-progress{display:flex;gap:8px;margin:0 0 14px;}' +
    '.ss-stat{flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);' +
      'border-radius:14px;padding:9px 6px;}' +
    '.ss-stat b{display:block;font-size:18px;color:#f5ecd7;}' +
    '.ss-stat span{font-size:10.5px;color:#9db8c4;letter-spacing:.5px;}' +
    '#startButton{font-size:17px;letter-spacing:1px;padding:15px;}' +
    '.ss-section{display:flex;align-items:baseline;justify-content:space-between;margin:16px 2px 6px;}' +
    '.ss-section h2{margin:0;font-size:13px;letter-spacing:1.5px;color:#f0c66d;}' +
    '.ss-section span{font-size:11px;color:#9db8c4;}' +
    '#levelChips{max-height:34vh;overflow-y:auto;-webkit-overflow-scrolling:touch;' +
      'padding:2px;scrollbar-width:thin;}' +
    '#levelChips::-webkit-scrollbar{width:6px;}' +
    '#levelChips::-webkit-scrollbar-thumb{background:rgba(240,198,109,.35);border-radius:3px;}' +
    '.ss-footer{display:flex;justify-content:center;gap:18px;margin-top:12px;}' +
    '.ss-link{background:none;border:none;color:#9db8c4;font:600 13px system-ui,sans-serif;' +
      'cursor:pointer;padding:6px 4px;}' +
    '.ss-link:active{color:#f0c66d;}';
  document.head.appendChild(css);

  function starsTotal() {
    var s = (typeof save !== 'undefined' && save.stars) || {};
    var t = 0; for (var k in s) t += s[k] || 0; return t;
  }
  function clearedCount() {
    var b = (typeof save !== 'undefined' && save.best) || {};
    var n = 0; for (var k in b) n++; return n;
  }
  function resumeIndex() {
    return Math.max(0, Math.min(save.unlocked, LEVELS.length) - 1);
  }

  function buildStartScreen() {
    var dialog = document.querySelector('#introOverlay .dialog');
    if (!dialog) return;
    var cleared = clearedCount();
    var nextStage = resumeIndex() + 1;
    dialog.innerHTML =
      '<div class="ss-logo">' +
        '<div class="ss-logo-icon">🧭</div>' +
        '<div class="ss-logo-text">' +
          '<div class="ss-logo-title">FIND IT</div>' +
          '<div class="ss-logo-sub">' + (isKo ? '숨은그림찾기' : 'HIDDEN OBJECTS') + '</div>' +
        '</div>' +
      '</div>' +
      '<p class="ss-tagline">' + (isKo
        ? '커다란 그림 속에 숨은 물건을 모두 찾아보세요. 두 손가락으로 확대하고, 막히면 힌트를 써보세요!'
        : 'Explore a big beautiful picture, pinch to zoom in, and tap every hidden object on the list.') + '</p>' +
      '<div class="ss-progress">' +
        '<div class="ss-stat"><b>' + cleared + ' / ' + LEVELS.length + '</b><span>' + (isKo ? '클리어' : 'CLEARED') + '</span></div>' +
        '<div class="ss-stat"><b>⭐ ' + starsTotal() + '</b><span>' + (isKo ? '모은 별' : 'STARS') + '</span></div>' +
        '<div class="ss-stat"><b>' + nextStage + '</b><span>' + (isKo ? '다음 스테이지' : 'NEXT STAGE') + '</span></div>' +
      '</div>' +
      '<button class="primary-btn" id="startButton">' + (cleared > 0
        ? (isKo ? '▶ 이어하기 · 스테이지 ' + nextStage : '▶ CONTINUE · STAGE ' + nextStage)
        : (isKo ? '▶ 게임 시작' : '▶ START')) + '</button>' +
      '<div class="ss-section"><h2>' + (isKo ? '스테이지 선택' : 'STAGE SELECT') + '</h2>' +
        '<span>' + save.unlocked + ' / ' + LEVELS.length + (isKo ? ' 오픈' : ' OPEN') + '</span></div>' +
      '<div id="levelChips" class="chips"></div>' +
      '<div class="ss-footer">' +
        '<button class="ss-link" id="ssSettings">⚙ ' + (isKo ? '설정' : 'Settings') + '</button>' +
      '</div>';

    document.getElementById('startButton').addEventListener('click', function () {
      initAudio();
      loadLevel(resumeIndex());
      started = true;
      introOverlay.classList.add('hidden');
      calculateBaseScale();
      resetView();
    });
    document.getElementById('ssSettings').addEventListener('click', function () {
      openSettings();
    });
  }

  buildStartScreen();
  // Packs pushed more levels after the payload's first render: draw the full grid.
  renderLevelChips();

  // Keep the start screen fresh whenever it is shown again (exit button path).
  var _origExit = document.getElementById('exitButton');
  if (_origExit) {
    _origExit.addEventListener('click', function () {
      buildStartScreen();
      renderLevelChips();
    });
  }
})();
