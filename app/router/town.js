const { Router } = require('express');

const characterRouter = require('./character.js');
const shopRouter = require('./shop.js');
const eventRouter = require('./event.js');

const { isMember } = require('../middleware/security.js'); // import des fonctions vérification de rôles

const router = Router();

// Chemins vers d'autres routes
router.use('/character', isMember, characterRouter); // chemin vers character.js
router.use('/shop', isMember, shopRouter); // chemin vers shop.js
router.use('/event', isMember, eventRouter); // chemin vers event.js

module.exports = router;