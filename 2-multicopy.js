// MULTI-COPY DEMO OVERRIDE (demo stage only; live levels use the original tray)
// Groups tray entries by object type with a found/total count badge.
(function () {
  if (typeof window.renderTargets !== "function") return;
  const origRenderTargets = window.renderTargets;

  const css = document.createElement("style");
  css.textContent = `
    .target.mc-card{flex-direction:row;align-items:center;gap:8px;padding:6px 10px;min-width:118px}
    .target.mc-card img.obj-icon{width:42px;height:42px;border-radius:10px;flex:none;margin:0}
    .target.mc-card .mc-name{font-size:12px;font-weight:700;color:#2c2015;white-space:nowrap}
    .target.mc-card .mc-badge{background:#ff3b30;color:#fff;font-weight:800;font-size:13px;border-radius:12px;padding:2px 9px;margin-left:auto;white-space:nowrap}
    .target.mc-card.mc-done{opacity:.55}
    .target.mc-card.mc-done .mc-badge{background:#2fbf71}
    .target.mc-card .mc-check{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;background:#2fbf71;color:#fff;font-size:12px;font-weight:900;display:none;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.35)}
    .target.mc-card.mc-done .mc-check{display:flex}
  `;
  document.head.appendChild(css);

  window.renderTargets = function () {
    if (!level || !level.multi) { origRenderTargets(); return; }
    targetsEl.innerHTML = "";
    const groups = new Map();
    level.objects.forEach((o, i) => {
      if (!groups.has(o.type)) groups.set(o.type, { name: o.name, ko: o.ko, img: o.img, icon: o.icon, total: 0, found: 0 });
      const g = groups.get(o.type);
      g.total++;
      if (found.has(i)) g.found++;
    });
    groups.forEach((g) => {
      const done = g.found === g.total;
      const el = document.createElement("div");
      el.className = "target mc-card" + (done ? " mc-done" : "");
      el.innerHTML = `
        ${g.img ? '<img class="obj-icon" src="' + g.img + '" alt="">' : '<span class="emoji">' + g.icon + '</span>'}
        <span class="mc-name">${g.ko}</span>
        <span class="mc-badge">${g.found}/${g.total}</span>
        <span class="mc-check">\u2713</span>
      `;
      el.setAttribute("aria-label", `${g.name}: ${g.found} of ${g.total} found`);
      targetsEl.appendChild(el);
    });
  };
})();
