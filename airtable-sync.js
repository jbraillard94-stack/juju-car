/* ============================================================
   airtable-sync.js — JujuCar
   ------------------------------------------------------------
   Configuration CENTRALE de la connexion Airtable.

   ⚠️ SÉCURITÉ DU TOKEN
   Le token n'est JAMAIS écrit en clair dans le code source.
   Le placeholder « __AIRTABLE_TOKEN__ » ci-dessous est remplacé
   automatiquement au moment du déploiement par le secret GitHub
   « AIRTABLE_TOKEN » (voir .github/workflows/deploy.yml).
   Ce token est en LECTURE SEULE (permission data.records:read) :
   il ne permet que d'afficher les véhicules, jamais de les modifier.

   Toutes les pages qui lisent Airtable (catalogue, aperçu accueil)
   récupèrent la config ici via window.JUJUCAR_AT — il n'y a donc
   qu'un seul endroit à maintenir.
   ============================================================ */

(function (w) {
  var AT = {
    token:   '__AIRTABLE_TOKEN__',           // injecté au déploiement (lecture seule)
    baseId:  'app0yutHVptAUcSrk',
    tableId: 'tbl7dEkvmCxFRAcG2'             // table v2 (alimentée par l'agent Traiteur)
  };
  AT.endpoint = 'https://api.airtable.com/v0/' + AT.baseId + '/' + AT.tableId;

  /* Petit utilitaire : récupère TOUS les enregistrements (pagination 100/100).
     Renvoie une Promise résolue avec le tableau brut des records Airtable. */
  AT.fetchAll = function () {
    var all = [];
    function page(offset) {
      var url = AT.endpoint + '?pageSize=100';
      if (offset) url += '&offset=' + encodeURIComponent(offset);
      return fetch(url, { headers: { Authorization: 'Bearer ' + AT.token } })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          (data.records || []).forEach(function (r) { all.push(r); });
          if (data.offset) return page(data.offset);
          return all;
        });
    }
    return page(null);
  };

  w.JUJUCAR_AT = AT;
})(window);
