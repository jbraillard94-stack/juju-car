/* ============================================================
   airtable-sync.js — JujuCar Catalogue
   ============================================================ */

const _t1 = 'patEd9f0ln5qyWZgf';
const _t2 = '78b848375e2cbfd71992abe85709effe98a3d3f790c424d833513d96b6c9602b';
const AIRTABLE_TOKEN   = _t1 + '.' + _t2;
const BASE_ID          = 'app0yutHVptAUcSrk';
const TABLE_ID         = 'tblWbsM0Xf60k3DGi';
const REFRESH_INTERVAL = 10000;

function formatNumber(n) {
  if (!n && n !== 0) return '—';
  return Math.round(n).toLocaleString('fr-CH');
}

function buildCard(record) {
  const f = record.fields;
  const marque    = f['Marque']         || '';
  const modele    = f['Modèle']         || '';
  const annee     = f['Année']          || '';
  const couleur   = f['Couleur']        || '';
  const km        = f['Kilométrage']    ? formatNumber(f['Kilométrage']) + ' km' : '—';
  const carburant = f['Carburant']      || '';
  const boite     = f['Transmission']   || '';
  const puissance = f['Puissance (CV)'] ? f['Puissance (CV)'] + ' CV' : '—';
  const portes    = f['Portes']         ? f['Portes'] + ' portes' : '';
  const prixJuju  = f['Prix JujuCar (CHF)'];
  const prixCons  = f['Prix concessionnaire (CHF)'] || null;
  const prixFour  = f['Prix fournisseur (CHF)']     || null;
  const options   = f['Options / Descriptif']       || '';
  const statut    = f['Statut']         || 'En vente';
  const images    = f['Images']         || [];
  const plusieursColoris = f['Plusieurs coloris'] === true;
  const colorisDispo     = f['Coloris disponibles'] || '';

  if (!prixJuju || prixJuju <= 0) return '';

  const imgUrl = images.length > 0 ? images[0].url : 'images/placeholder.jpg';
  const badgeClass = statut === 'En vente' ? 'badge-vente'
                   : statut === 'Réservé'  ? 'badge-reserve'
                   : 'badge-vendu';

  const economie     = prixCons && prixCons > prixJuju ? prixCons - prixJuju : null;
  const economieHtml = economie
    ? `<div class="vehicule-economie">Économie : <strong>CHF ${formatNumber(economie)}.-</strong> vs concessionnaire</div>`
    : '';
  const prixConsHtml = prixCons
    ? `<span class="prix-barre">CHF ${formatNumber(prixCons)}.-</span>`
    : '';

  /* Badge « Plusieurs coloris disponibles » (affiché seulement si la case
     Airtable « Plusieurs coloris » est cochée). */
  const colorisHtml = plusieursColoris
    ? `<div class="vehicule-coloris">🎨 Plusieurs coloris disponibles${colorisDispo ? ` : <strong>${colorisDispo}</strong>` : ''}</div>`
    : '';

  return `
    <div class="vehicule-card" data-id="${record.id}" data-statut="${statut}">
      <div class="vehicule-img-wrap">
        <img src="${imgUrl}" alt="${marque} ${modele}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
        <span class="badge ${badgeClass}">${statut}</span>
      </div>
      <div class="vehicule-body">
        <h3 class="vehicule-titre">${marque} ${modele} <span class="vehicule-annee">${annee}</span></h3>
        <ul class="vehicule-specs">
          <li><span class="spec-icon">📍</span>${km}</li>
          <li><span class="spec-icon">⛽</span>${carburant}</li>
          <li><span class="spec-icon">⚙️</span>${boite}</li>
          <li><span class="spec-icon">💡</span>${puissance}</li>
          ${couleur ? `<li><span class="spec-icon">🎨</span>${couleur}</li>` : ''}
          ${portes  ? `<li><span class="spec-icon">🚪</span>${portes}</li>`  : ''}
        </ul>
        ${options ? `<p class="vehicule-options">${options}</p>` : ''}
        ${colorisHtml}
        <div class="vehicule-prix">
          ${prixConsHtml}
          <span class="prix-juju">CHF ${formatNumber(prixJuju)}.-</span>
        </div>
        ${economieHtml}
      </div>
    </div>
  `;
}

let lastEtag = null;

async function loadCatalogue() {
  const container = document.getElementById('vehicles-container');
  if (!container) return;
  const filter = encodeURIComponent('AND({Statut}!="Vendu",{Prix JujuCar (CHF)}>0)');
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${filter}&sort[0][field]=Statut&sort[0][direction]=asc`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } });
    if (!res.ok) { console.error('[JujuCar] Erreur Airtable :', res.status); return; }
    const etag = res.headers.get('etag');
    if (etag && etag === lastEtag) return;
    lastEtag = etag;
    const data    = await res.json();
    const records = data.records || [];
    const cards   = records.map(buildCard).filter(Boolean);
    container.innerHTML = cards.length === 0
      ? '<p class="catalogue-vide">Aucun véhicule disponible pour le moment.</p>'
      : cards.join('');
  } catch (err) {
    console.error('[JujuCar] Erreur réseau :', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadCatalogue();
  setInterval(loadCatalogue, REFRESH_INTERVAL);
});
