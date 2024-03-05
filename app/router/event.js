const { Router } = require('express');
const { eventController } = require('../controller');
const monsterRouter = require('./monster.js');
const npcRouter = require('./npc.js');

const { isMember } = require('../middleware/security.js'); // import des fonctions vérification de rôles

const router = Router();

router.get('/', isMember, eventController.getRandomEvent);

router.use('/monster', isMember, monsterRouter); // Chemin vers monster.js
router.use('/npc', isMember, npcRouter); // Chemin vers npc.js

router.patch('/reward', isMember, eventController.getBattleReward); // UPDATE purse avec réussite (ou non) de l'event

module.exports = router;
