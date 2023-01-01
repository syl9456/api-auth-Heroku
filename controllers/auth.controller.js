const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


//Crée un nouvel utilisateur dans la base de données
exports.signup = (req, res) => {
  //Crée un nouvel utilisateur
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  //Le nouvel utilisateur est enregistré dans la base de données
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    //Si l'utilisateur a été enregistré avec succès, nous lui attribuons un rôle
    console.log("roles du nouveau :" + req.body.roles);
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          //Si l'utilisateur n'a pas de rôle, nous lui attribuons le rôle "user"
          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
    //Si l'utilisateur n'a pas de rôle, nous lui attribuons le rôle "user"
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        //L'utilisateur est enregistré dans la base de données
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};


//Cherche l'utilisateur dans la base de données et vérifie le mot de passe
exports.signin = (req, res) => {
    //Cherche l'utilisateur dans la base de données
    User.findOne({ username: req.body.username })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
     //Si l'utilisateur n'est pas trouvé, nous renvoyons un message d'erreur
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      //Vérifie le mot de passe
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      //Si le mot de passe est incorrect, nous renvoyons un message d'erreur
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      //Si le mot de passe est correct, nous renvoyons un token
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 heures
      });

      console.log("roles de l'utilisateur :" + req.body.roles);
      var authorities = [];
      //Nous renvoyons les rôles de l'utilisateur
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      //Nous renvoyons les informations de l'utilisateur
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};