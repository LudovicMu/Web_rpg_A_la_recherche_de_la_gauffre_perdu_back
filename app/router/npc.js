const { Router } = require('express');
const { npcController } = require('../controller');

const { isMember } = require('../middleware/security.js'); // import des fonctions vérification de rôles

const router = Router();

router.get('/', isMember, npcController.getAllNpc); // afficher tous les Personnage non joueur
router.post('/:id', isMember, npcController.getNpcById); // afficher en détail un personnage non joueur sélectionné

router.get('/random', npcController.getRandomNpc); // Obtenir un personnage non joueur aléatoirement
router.get('/replica/:id', npcController.getReplicaOfNpc); // Obtenir la réplique du personnage non joueur

module.exports = router;