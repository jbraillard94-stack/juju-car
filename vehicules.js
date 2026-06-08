/* ============================================================
   vehicules.js — Aperçu catalogue de la page d'accueil
   ------------------------------------------------------------
   Le catalogue complet (page catalogue.html) est alimenté en
   direct depuis Airtable. Ce fichier ne sert qu'à l'aperçu
   facultatif affiché sur la page d'accueil (#catalogue-preview).

   Laisser le tableau vide masque proprement la section aperçu.

   Forme d'un objet véhicule (si on veut remplir l'aperçu) :
   {
     marque:          'MG',
     modele:          'MG4 Electric',
     prix_jujucar:    15500,
     images:          ['url1.jpg', 'url2.jpg'],
     plusieursColoris: true,                 // champ Airtable « Plusieurs coloris »
     colorisDispo:    'Noir, Blanc, Gris'    // champ Airtable « Coloris disponibles »
   }
   Si plusieursColoris est vrai, l'aperçu affiche un badge
   « Plusieurs coloris disponibles » avec la liste colorisDispo.
   ============================================================ */
const vehicules = [];
