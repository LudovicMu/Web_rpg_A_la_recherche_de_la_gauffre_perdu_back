const { manageResponse } = require("../helper/controllerHelper.js");
const { APIError } = require("../middleware/error/APIError.js");
const jwt = require("../middleware/jwt.js");
const { encodePassword, passwordMatch} = require("../middleware/security.js");
const { userDatamapper, characterDatamapper, shopDatamapper } = require("../datamapper");

/**
 * Contrôleur pour la gestion des utilisateurs --
 * Controller for handling users
 *
 * @namespace UserController
 */
const userController = {
  /**
   * Récupère tous les utilisateurs --
   * Get all users
   *
   * @async
   * @function getAllUsers
   * @memberof UserController
   */
  async getAllUsers(req, res, next) {
    const { error, result } = await userDatamapper.getAllUsers();
    manageResponse(res, result, error, next);
  },

  /**
   * Inscription d'un nouvel utilisateur --
   * Registration of new user
   *
   * @async
   * @function signup
   * @memberof UserController
   */
  async signup(req, res, next) {
    const user = req.body;
    const role = "member";
    user.role = role;
    const token = jwt.encode(user);

    // Chiffrement du mot de passe
    user.password = await encodePassword(user.password);
    const { error, result } = await userDatamapper.addUser(user);
    result.token = token;
    manageResponse(res, result, error, next);
  },

  /**
   * Connexion de l'utilisateur --
   * User's connection
   *
   * @async
   * @function signin
   * @memberof UserController
   */
  async signin(req, res, next) {
    const login = req.body;
    let { error, result } = await userDatamapper.verifyUser(login);

    if (result) {
      const user = result.verify_user;

      if (user && (await passwordMatch(login.password, user.password))) {
        const token = jwt.encode(user);
        user.token = token;
        let { error: characterError, result: characterResult } =
          await characterDatamapper.getCharacterByUserId(user.id);
        if (characterResult) {
          const characters = characterResult;
          user.characters = characters;
          let { error: weaponError, result: weaponResult } =
            await shopDatamapper.getWeaponById(characters.weapon_id);
          let { error: armorError, result: armorResult } =
            await shopDatamapper.getArmorById(characters.armor_id);

          user.characters.weapon = weaponResult;
          user.characters.armor = armorResult;
          manageResponse(res, user, weaponError, armorError, error, characterError, next);
        } else {
          manageResponse(res, user, error, next);
        }
      } else {
        // Gérer le cas où result est undefined
        error = new APIError(
          "Erreur lors de la vérification de l'utilisateur",
          500
        );
        manageResponse(res, null, error, next);
      }
    } else {
      error = new APIError("Les identifiants ne sont pas corrects", 401);
      next(error);
    }
  },

  async loginToken(req, res, next) {
    const userId = req.body.user_id;

    let { error: userError, result: userResult } = await userDatamapper.getUser(
      userId
    );

    let { error, result } = await userDatamapper.verifyUser(userResult);

    if (result) {
      if (userResult) {
        const user = userResult;
        const tokenBearer = req.get("Authorization");
        // Vérification du token

        if (tokenBearer && tokenBearer.startsWith("Bearer ")) {
          const token = tokenBearer.slice(7);
          const { result, error } = jwt.decode(token);
          user.token = token;
        if (error) {
            next(error);
          } else {
            // l'utilisateur a-t-il le rôle 'member' ou 'admin' ?
            if (result.role == "member" || result.role == "admin") {
            } else {
              next(new APIError("Vous n'avez pas le droit", 401));
            }
          }
        }
        let { error: characterError, result: characterResult } =
          await characterDatamapper.getCharacterByUserId(user.id);
        const characters = characterResult;
        console.log('character :', characters);
        user.characters = characters;
        let { error: weaponError, result: weaponResult } =
          await shopDatamapper.getWeaponById(characters.weapon_id);
        let { error: armorError, result: armorResult } =
          await shopDatamapper.getArmorById(characters.armor_id);

        user.characters.weapon = weaponResult;
        user.characters.armor = armorResult;
        manageResponse(res, user, weaponError, armorError, error, userError, next);
      } else {
        manageResponse(res, user, error, next);
      }
    } else {
      // Gérer le cas où result est undefined
      error = new APIError(
        "Erreur lors de la vérification de l'utilisateur",
        500
      );
      manageResponse(res, null, error, next);
    }
  },

  /**
   * Récupère l'utilisateur actuellement connecté --
   * Get user currently connected
   *
   * @async
   * @function getCurrentUser
   * @memberof UserController
   */
  async getCurrentUser(req, res, next) {
    const user = req.body;
    const { error, result } = await userDatamapper.getUser(user.id);
    const userBDD = result.get_user;
    manageResponse(res, userBDD, error, next);
  },

  /**
   * Met à jour les informations de l'utilisateur --
   * Update user's informations
   *
   * @async
   * @function updateUser
   * @memberof UserController
   */
  async updateUser(req, res, next) {
    const user = req.body;
    const { error, result } = await userDatamapper.updateUser(user);
    manageResponse(res, result, error, next);
  },

  /**
   * Supprime l'utilisateur --
   * Delete user
   *
   * @async
   * @function deleteUser
   * @memberof UserController
   */
  async deleteUser(req, res, next) {
    const id = parseInt(req.params.id);
    const { error, result } = await userDatamapper.deleteUser(id);
    manageResponse(res, result, error, next);
  },
};

module.exports = userController;
