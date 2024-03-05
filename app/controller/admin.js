const { manageResponse } = require("../helper/controllerHelper.js");
const { APIError } = require ("../middleware/error/APIError.js");
const { adminDatamapper } = require('../datamapper');
const jwt = require ("../middleware/jwt.js");

const adminController = {

    async getAdmin(req, res, next) {
        const { error, result } = await adminDatamapper.getAdmin();
        manageResponse(res, result, error, next);
    }
   
};

module.exports = adminController;

