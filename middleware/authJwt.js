const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

// Vérifie si le token est valide
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    //Si le token n'est pas fourni, on renvoie une erreur
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }
    //On vérifie si le token est valide
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

//verifie si l'utilisateur est admin
isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        //On récupère les rôles de l'utilisateur grace a son ID
        Role.find({ _id: { $in: user.roles } }, (err, roles) => {
            //Si l'utilisateur n'a pas de rôle, on renvoie un message d'erreur
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            //Si l'utilisateur est admin, on passe à la fonction suivante
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            //Si l'utilisateur n'est pas admin, on renvoie un message d'erreur
            res.status(403).send({ message: "Require Admin Role!" });
            return;
        }
        );
    });
};

//verifie si l'utilisateur est modérateur
isModerator = (req, res, next) => {
    //On récupère l'utilisateur à partir de son id
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        //On récupère les rôles de l'utilisateur grace a son ID 
        Role.find({ id: { $in: user.roles } }, (err, roles) => {
            //Si l'utilisateur n'a pas de rôle, on renvoie un message d'erreur
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            //Si l'utilisateur est modérateur, on passe à la fonction suivante
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }
            }
            //Si l'utilisateur n'est pas modérateur, on renvoie un message d'erreur
            res.status(403).send({ message: "Require Moderator Role!" });
            return;
        }
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};

module.exports = authJwt;