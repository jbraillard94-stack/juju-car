/* ============================================================
   JujuCar — Bandeau cookies partagé (toutes les pages)
   Mémorisé en localStorage — affiché une seule fois.
   ============================================================ */
(function () {
  if (document.getElementById('cookie-banner')) return; // déjà présent (catalogue inline)

  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.style.cssText = [
    'position:fixed',
    'bottom:0',
    'left:0',
    'right:0',
    'background:#1a1a1a',
    'border-top:1px solid #2a2a2a',
    'padding:16px 32px',
    'z-index:9000',
    'align-items:center',
    'justify-content:space-between',
    'flex-wrap:wrap',
    'gap:12px',
    'display:none'
  ].join(';');

  banner.innerHTML =
    '<p style="font-size:14px;color:#aaa;margin:0;flex:1;min-width:200px;">' +
    '🍪 Ce site utilise des cookies pour améliorer votre expérience. En continuant à naviguer, ' +
    'vous acceptez notre politique de confidentialité. Vous pouvez demander la suppression de vos ' +
    'données à <a href="mailto:contact@juju-car.ch" style="color:#C9A24B;">contact@juju-car.ch</a>.' +
    '</p>' +
    '<button onclick="acceptCookies()" style="background:#C9A24B;color:#111;border:none;' +
    'padding:10px 24px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;' +
    'white-space:nowrap;">J’accepte</button>';

  document.body.appendChild(banner);

  if (!localStorage.getItem('cookiesOK_v2')) {
    banner.style.display = 'flex';
  }
})();

function acceptCookies() {
  localStorage.setItem('cookiesOK_v2', '1');
  var b = document.getElementById('cookie-banner');
  if (b) b.style.display = 'none';
}
