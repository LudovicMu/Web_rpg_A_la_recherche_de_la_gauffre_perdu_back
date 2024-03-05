const { Router } = require('express');
const { shopController } = require('../controller');
const { isMember } = require('../middleware/security.js'); // import des fonctions vérification de rôles

const router = Router();

router.post('/', isMember, shopController.getRandomEquipment); // Accueil SHOP ARME & ARMURE

router.post('/refresh', isMember, shopController.getRandomEquipment);

router.patch('/buy/equipment', isMember, shopController.buyEquipement); //UPDATE weapon_id || armor_id + stat
router.patch('/buy/stat', isMember, shopController.buyStat); // UPDATE stat personnage

module.exports = router;