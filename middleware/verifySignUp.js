const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

//Vérifie si l'utilisateur existe déjà dans la base de données
checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
    User.findOne({ username: req.body.username }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        //Si l'utilisateur existe déjà, nous renvoyons un message d'erreur
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }

        // Email
        User.findOne({ email: req.body.email }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            //Si l'utilisateur existe déjà, nous renvoyons un message d'erreur
            if (user) {
                res.status(400).send({ message: "Failed! Email is already in use!" });
                return;
            }
            next();
        });
    });
};

//Vérifie si le rôle existe dans la base de données
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
        //Si le rôle n'existe pas dans la base de données, nous renvoyons un message d'erreur
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;