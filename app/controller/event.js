const { manageResponse } = require("../helper/controllerHelper.js");
const { eventDatamapper, monsterDatamapper, npcDatamapper, characterDatamapper, shopDatamapper } = require("../datamapper");

/**
 * Contrôleur pour la gestion des événements --
 * Controller for handling events
 * 
 * @namespace EventController
 */
const eventController = {
    /**
     * Récupère un événement aléatoire et gère les réponses en fonction de son type --
     * Get a random event and handle answers depending on his type
     *
     * @async
     * @function getRandomEvent
     * @memberof EventController
     */
    async getRandomEvent(req, res, next) {
        let { error, result } = await eventDatamapper.getRandomEvent();

        const event = result[0];

        if (event.type === 'battle') {
            let { error: errorMonster, result: resultMonster } = await monsterDatamapper.getMonsterById(event.monster_id);
            event.monster = resultMonster;
            manageResponse(res, event, errorMonster, next);
        } else if (event.type === 'encounter') {
            let { error: errorEncounter, result: resultEncounter } = await npcDatamapper.getNpcById(event.npc_id);
            event.npc = resultEncounter;
            manageResponse(res, event, errorEncounter, next);
        } else {
            console.log('aucun événement trouvé !');
        }
    },

    async getBattleReward(req, res, next) {
        //const monsterId = parseInt(req.body.monster_id);
        const userId = parseInt(req.body.user_id);
        const { error: characterError, result: characterResult } = await characterDatamapper.getCharacterByUserId(userId);
        //const { error: monsterError, result: monsterResult } = await monsterDatamapper.getMonsterById(monsterId);

        const reward = parseInt(req.body.reward);
        if(reward === 0) {
            0 != null;
        }
        characterResult.weapon = await shopDatamapper.getWeaponById(characterResult.weapon_id);
        characterResult.armor = await shopDatamapper.getArmorById(characterResult.armor_id);

        characterResult.purse = characterResult.purse + reward;

        let { error, result } = await characterDatamapper.updateCharacter(characterResult);
        manageResponse(res, result, error, next);
    }
};

module.exports = eventController;