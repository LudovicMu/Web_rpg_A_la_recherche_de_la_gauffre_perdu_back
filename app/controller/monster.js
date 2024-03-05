const { manageResponse } = require("../helper/controllerHelper.js");
const { APIError } = require("../middleware/error/APIError.js");
const { monsterDatamapper } = require('../datamapper');
const jwt = require("../middleware/jwt.js");

/**
 * Contrôleur pour la gestion des monstres --
 * Controller for handling monsters
 * 
 * @namespace MonsterController
 */
const monsterController = {
    /**
     * Récupère tous les monstres --
     * Get all monsters
     *
     * @async
     * @function getAllMonsters
     * @memberof MonsterController
     */
    async getAllMonsters(req, res, next) {
        const { error, result } = await monsterDatamapper.getAllMonsters();
        manageResponse(res, result, error, next);
    },

    /**
     * Récupère un monstre par identifiant --
     * Get a monster by his id
     *
     * @async
     * @function getMonsterById
     * @memberof MonsterController
     */
    async getMonsterById(req, res, next) {
        const monsterId = parseInt(req.params.id);
        const { error, result } = await monsterDatamapper.getMonsterById(monsterId);
        manageResponse(res, result, error, next);
    },

     /**
     * Récupère un monstre aléatoire --
     * Get a random monster
     *
     * @async
     * @function getRandomMonster
     * @memberof MonsterController
     */
     async getRandomMonster(req, res, next) {
        const { error, result } = await monsterDatamapper.getRandomMonster();
        manageResponse(res, result, error, next);
    },

    /**
     * Récupère aléatoirement une réplique de monstre
     * Gets a random replica of a monster.
     * @date 23/02/2024 - 21:40:15
     *
     * @async
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @param {Function} next - The next middleware function.
     */
    async getRandomReplicaOfMonster(req, res, next) {
        const { error, result } = await monsterDatamapper.getReplicaOfMonster();
        manageResponse(res, result, error, next)
    },

    /**
     * Met à jour un monstre par identifiant --
     * Update a monster by his id
     *
     * @async
     * @function updateMonster
     * @memberof MonsterController
     */
    async updateMonster(req, res, next) {
        const monster = req.body;

        const { error, result } = await monsterDatamapper.updateMonster(monster);
        manageResponse(res, result, error, next);
    },

    /**
     * Supprime un monstre par son identifiant --
     * Delete a monster by his id
     *
     * @async
     * @function deleteMonster
     * @memberof MonsterController
     */
    async deleteMonster(req, res, next) {
        const id = parseInt(req.params.id);
        
        const { error, result } = await monsterDatamapper.deleteMonster(id);
        manageResponse(res, result, error, next);
    },
};

module.exports = monsterController;