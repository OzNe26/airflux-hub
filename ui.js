/* Airflux Hub : bouton « retour au hub » en simple flèche qui se déroule au survol */
(function () {
  'use strict';
  function init() {
    var b = document.getElementById('backHub');
    if (!b || b.dataset.ui) return;
    b.dataset.ui = '1';
    // on retire le texte existant (« Hub ») et on le remplace par une étiquette qui se déroule
    Array.prototype.slice.call(b.childNodes).forEach(function (n) {
      if (n.nodeType === 3 || (n.nodeType === 1 && n.tagName !== 'svg' && n.tagName !== 'SVG')) b.removeChild(n);
    });
    var old = b.querySelector('svg');
    var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '16'); svg.setAttribute('height', '16'); svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2.4');
    svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
    svg.innerHTML = '<path d="M19 12H5M11 6l-6 6 6 6"/>';
    if (old) b.replaceChild(svg, old); else b.insertBefore(svg, b.firstChild);
    var s = document.createElement('span');
    s.className = 'bkl';
    s.textContent = 'Retour au hub';
    b.appendChild(s);
    b.setAttribute('aria-label', 'Retour au hub');
    b.removeAttribute('title');
    var st = document.createElement('style');
    st.textContent =
      '#backHub{display:inline-flex!important;align-items:center;justify-content:center;gap:0!important;height:34px;padding:0 9px!important;box-sizing:border-box}' +
      '#backHub svg{flex:none;transition:transform .3s ease}' +
      '#backHub:hover svg{transform:translateX(-3px)}' +
      '#backHub .bkl{display:inline-block!important;max-width:0;opacity:0;overflow:hidden;white-space:nowrap;margin-left:0;transition:max-width .3s ease,opacity .2s ease,margin .3s ease}' +
      '#backHub:hover .bkl,#backHub:focus-visible .bkl{max-width:130px;opacity:1;margin-left:7px}' +
      '@media (hover:none){#backHub:hover .bkl{max-width:0;opacity:0;margin-left:0}#backHub:hover svg{transform:none}}';
    document.head.appendChild(st);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
