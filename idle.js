/* Airflux Hub : déconnexion automatique après 30 minutes d'inactivité */
(function () {
  'use strict';
  var MS = window.AIRFLUX_IDLE_MS || 30 * 60 * 1000;
  var KEY = 'airflux_last_act';
  var HUB = '/airflux-hub/';
  var shown = false, lastWrite = 0;

  function get() { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } }
  function set(t) { try { localStorage.setItem(KEY, String(t)); } catch (e) {} }

  function activity() {
    if (shown) return;
    var t = Date.now();
    if (t - lastWrite > Math.min(5000, MS / 10)) { lastWrite = t; set(t); }
  }

  function clearSession() {
    ['staticrypt_passphrase', 'staticrypt_expiration'].forEach(function (k) {
      try { sessionStorage.removeItem(k); } catch (e) {}
      try { localStorage.removeItem(k); } catch (e) {}
    });
  }

  function show() {
    if (shown) return;
    shown = true;
    clearSession();
    var o = document.createElement('div');
    o.setAttribute('role', 'alertdialog');
    o.setAttribute('aria-modal', 'true');
    o.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,28,52,.72);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);font-family:Montserrat,system-ui,-apple-system,Segoe UI,Arial,sans-serif';
    o.innerHTML =
      '<div style="background:#fff;border-radius:18px;max-width:400px;width:100%;padding:30px 26px 26px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.35)">' +
        '<div style="width:56px;height:56px;border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;background:#fdecea">' +
          '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e8332a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>' +
        '</div>' +
        '<div style="font-size:19px;font-weight:800;color:#1e3560;margin-bottom:8px">Vous avez été déconnecté pour inactivité</div>' +
        '<div style="font-size:14px;line-height:1.55;color:#5b6b85;margin-bottom:22px">Pour protéger les données Airflux, la session se ferme après 30 minutes sans activité.</div>' +
        '<a href="' + HUB + '" style="display:block;background:#e8332a;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 16px;border-radius:12px">Se reconnecter</a>' +
      '</div>';
    document.body.appendChild(o);
    try { document.documentElement.style.overflow = 'hidden'; } catch (e) {}
    var b = o.querySelector('a'); if (b) b.focus();
  }

  function check() {
    if (shown) return;
    var last = get();
    if (last && Date.now() - last > MS) show();
  }

  // ouverture de la page = activité
  set(Date.now()); lastWrite = Date.now();
  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel', 'input', 'focus'].forEach(function (e) {
    window.addEventListener(e, activity, { passive: true, capture: true });
  });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') check(); });
  window.addEventListener('pageshow', check);
  setInterval(check, Math.min(15000, MS / 4));
})();
