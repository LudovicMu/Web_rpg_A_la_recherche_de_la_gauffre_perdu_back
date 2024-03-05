const { Router } = require('express');
const { monsterController, eventController } = require('../controller');

const { isAdmin, isMember } = require('../middleware/security.js'); // import des fonctions vérification de rôles

const router = Router();

router.get('/', isMember, monsterController.getAllMonsters);
router.post('/:id',isMember, monsterController.getMonsterById);

router.get('/random', monsterController.getRandomMonster); // Récupérer un monstre aléatoirement
router.get('/replica', monsterController.getRandomReplicaOfMonster); // Récupérer une réplique aléatoire de monster

router.patch('/', isAdmin, monsterController.updateMonster);
router.delete('/:id', isAdmin, monsterController.deleteMonster);

module.exports = router;
