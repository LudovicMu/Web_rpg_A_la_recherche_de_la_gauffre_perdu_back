const { executeRequest, executeRequestWithSingleResult } = require('../helper/pgHelper');

const adminDatamapper = {
    async getAdmin() {

        // A refaire et terminer
        const sqlQueryMonsters = `SELECT * FROM "monster";`;
        const sqlQueryUsers = `SELECT * FROM "user";`;
        const sqlQueryNpc = `SELECT * FROM "npc";`;
        const sqlQuery =[sqlQueryMonsters, sqlQueryUsers, sqlQueryNpc]; // Dommage ce n'est pas aussi facile
        return executeRequest(sqlQuery);
    }
};

module.exports = adminDatamapper;

