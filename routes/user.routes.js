const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

// On exporte la fonction qui prend en paramètre l'application express
module.exports = function(app) {
  // On définit les headers pour les requêtes HTTP (CORS) et on passe à la fonction suivante (next)
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // On définit les routes pour les tests d'accès aux ressources protégées par des rôles (user, modérateur, admin) et pour l'authentification et l'inscription des utilisateurs
  app.get("/api_auth/users/all", controller.allAccess);

  // On définit la route pour l'authentification des utilisateurs (login) et pour l'accès aux ressources protégées par le rôle user (user) et par le rôle modérateur (mod) et par le rôle admin (admin)
  app.get("/api_auth/users/user", [authJwt.verifyToken], controller.userBoard);

  // On définit la route pour l'accès aux ressources protégées par le rôle modérateur (mod) et par le rôle admin (admin)
  app.get(
    "/api_auth/users/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  // On définit la route pour l'accès aux ressources protégées par le rôle admin (admin)
  app.get(
    "/api_auth/users/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};