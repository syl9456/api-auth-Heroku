const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

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
  app.post(
    "/api_auth/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  
  // On définit la route pour l'authentification des utilisateurs (login)
  app.post("/api_auth/auth/signin", controller.signin);
};