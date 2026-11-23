/* Airflux Hub : bouton « Valeurs par défaut » dans chaque outil */
(function () {
  'use strict';
  var P = location.pathname.replace(/index\.html$/, '');
  // clés remises à zéro par outil (les listes enregistrées ne sont jamais effacées)
  var CFG = {
    '/airflux-hub/emails/': ['airflux_emails_v1'],
    '/airflux-hub/convertisseur/': ['airflux_conv_v1', 'airflux_conv_v2'],
    '/airflux-hub/economies/': ['airflux_eco_v1'],
    '/airflux-hub/reservoirs/': ['airflux_cuve_v1', 'airflux_cuve_v2'],
    '/airflux-hub/tuyauterie/': ['airflux_tuyau_v1'],
    '/airflux-hub/froid/': ['airflux_froid_v1'],
    '/airflux-hub/tournee/': ['airflux_tournee_v1'],
    '/airflux-hub/questions/': ['airflux_questions_v1'],
    '/airflux-hub/rdv/': [],
    '/airflux-hub/entreprise/': [],
    '/airflux-hub/trame/': [],
    '/airflux-hub/objections/': [],
    '/airflux-hub/detecteur/': ['airflux_detect_v1'],
    '/airflux-hub/compte-rendu/': ['airflux_cr_draft_v1']
  };
  if (!(P in CFG)) return;
  var KEYS = CFG[P];
  var FLAG = 'airflux_reset_done';

  function toast(m) {
    var t = document.createElement('div');
    t.textContent = m;
    t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#14213a;color:#fff;padding:11px 18px;border-radius:12px;font:600 13.5px Montserrat,system-ui,sans-serif;z-index:3000;box-shadow:0 10px 30px rgba(0,0,0,.25);transition:opacity .25s';
    document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = 0; }, 2400);
    setTimeout(function () { t.remove(); }, 2800);
  }

  function init() {
    var back = document.getElementById('backHub');
    if (!back || document.getElementById('rstBtn')) return;
    var st = document.createElement('style');
    st.textContent =
      '.rstw{display:inline-flex;align-items:center;gap:8px}' +
      '.rstw #backHub{margin:0!important;order:0!important}' +
      '#rstBtn{display:inline-flex;align-items:center;justify-content:center;height:34px;padding:0 9px;border-radius:10px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;font:700 13px Montserrat,system-ui,sans-serif;cursor:pointer}' +
      '#rstBtn:hover{background:rgba(255,255,255,.2)}' +
      '#rstBtn svg{flex:none;transition:transform .45s}' +
      '#rstBtn:hover svg{transform:rotate(-200deg)}' +
      '#rstBtn .rl{display:inline-block;max-width:0;opacity:0;overflow:hidden;white-space:nowrap;margin-left:0;transition:max-width .3s ease,opacity .2s ease,margin .3s ease}' +
      '#rstBtn:hover .rl,#rstBtn:focus-visible .rl,#rstBtn.arm .rl{max-width:190px;opacity:1;margin-left:7px}' +
      '#rstBtn.arm{background:#e8332a;border-color:#e8332a}' +
      '@media (hover:none){#rstBtn:hover .rl{max-width:0;opacity:0;margin-left:0}#rstBtn.arm .rl{max-width:190px;opacity:1;margin-left:7px}}';
    document.head.appendChild(st);
    var cs = getComputedStyle(back);
    var w = document.createElement('span');
    w.className = 'rstw';
    w.style.order = cs.order;
    if (cs.marginLeft && cs.marginLeft !== '0px') w.style.marginLeft = 'auto';
    back.parentNode.insertBefore(w, back);
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'rstBtn';
    b.setAttribute('aria-label', 'Valeurs par défaut');
    b.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg><span class="rl">Valeurs par défaut</span>';
    w.appendChild(b);
    w.appendChild(back);
    var armed = 0, tm = null, lab = b.querySelector('.rl');
    b.addEventListener('click', function () {
      if (!armed) {
        armed = 1; b.classList.add('arm'); lab.textContent = 'Cliquer pour confirmer';
        clearTimeout(tm);
        tm = setTimeout(function () { armed = 0; b.classList.remove('arm'); lab.textContent = 'Valeurs par défaut'; }, 3500);
        return;
      }
      KEYS.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
      try { sessionStorage.setItem(FLAG, '1'); } catch (e) {}
      location.href = location.pathname + location.hash;
    });
  }

  function done() {
    var f = null;
    try { f = sessionStorage.getItem(FLAG); sessionStorage.removeItem(FLAG); } catch (e) {}
    if (f) toast('Valeurs par défaut remises');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); done(); });
  else { init(); done(); }
})();
