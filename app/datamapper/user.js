const { executeRequestWithSingleResult, executeRequest } = require("../helper/pgHelper.js");

/**
 * Datamapper pour la gestion des utilisateurs --
 * Datamapper handling users
 * 
 * @namespace UserDatamapper
 */
const userDatamapper = {
    
    /**
     * Récupère tous les utilisateurs --
     * Get all users
     *
     * @async
     * @function getAllUsers
     * @memberof UserDatamapper
     * @returns {Promise<Array<Object>>} - Résultat de la requête
     */
    async getAllUsers() {
        const sqlQuery = `SELECT * FROM "user";`;
        return executeRequest(sqlQuery);
    },

    /**
     * Ajoute un utilisateur --
     * Get a user
     *
     * @async
     * @function addUser
     * @memberof UserDatamapper
     * @param {Object} user - Informations de l'utilisateur
     * @returns {Promise<Object>} - Résultat de la requête
     */
    async addUser(user) {
        const sqlQuery = "SELECT * FROM add_user($1);";
        const values = [user];
        return executeRequestWithSingleResult(sqlQuery, values);
    },

    /**
     * Vérifie l'utilisateur --
     * Verify user
     *
     * @async
     * @function verifyUser
     * @memberof UserDatamapper
     * @param {Object} user - Informations de l'utilisateur à vérifier
     * @returns {Promise<Object>} - Résultat de la requête
     */
    async verifyUser(user) {
        const sqlQuery = "SELECT * FROM verify_user($1);";
        const values = [user];
        return executeRequestWithSingleResult(sqlQuery, values);
    },

    /**
     * Récupère un utilisateur par son ID --
     * Get a user by his id
     *
     * @async
     * @function getUser
     * @memberof UserDatamapper
     * @param {number} id - ID de l'utilisateur
     * @returns {Promise<Object>} - Résultat de la requête
     */
    async getUser(id) {
        const sqlQuery = `SELECT * FROM "user" WHERE id = $1;`;
        const values = [id];
        return executeRequestWithSingleResult(sqlQuery, values);
    },

    /**
     * Met à jour les informations de l'utilisateur --
     * Update infos on a user
     *
     * @async
     * @function updateUser
     * @memberof UserDatamapper
     * @param {number} id - ID de l'utilisateur
     * @param {Object} body - Informations à mettre à jour
     * @returns {Promise<Object>} - Résultat de la requête
     */
    async updateUser(user) {
        const sqlQuery = `SELECT * FROM update_user($1);`;
        const values = [user];
        return executeRequestWithSingleResult(sqlQuery, values);
    },

    /**
     * Supprime un utilisateur --
     * Delete a user
     *
     * @async
     * @function deleteUser
     * @memberof UserDatamapper
     * @param {number} id - ID de l'utilisateur à supprimer
     * @returns {Promise<Object>} - Résultat de la requête
     */
    async deleteUser(id) {
        const sqlQuery = { 
            text: `
                DELETE FROM "user"
                WHERE id = $1
                RETURNING*;`,
            values: [id]
        }
        const result = await client.query(sqlQuery);
        return result.rows[0];
    },
};

module.exports = userDatamapper;
