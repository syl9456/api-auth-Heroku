const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./models");
const dbConfig = require("./config/db.config.js");
const Role = db.role;


var corsOptions = {
  origin: "http://localhost:4200"
};

// On autorise les connexions cross-domain (CORS)
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const uri = `mongodb+srv://${dbConfig.HOST}:${dbConfig.PASS}${dbConfig.PORT}/${dbConfig.DB}`;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};


// On se connecte à la base de données
db.mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB users dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez avec http://localhost:8020/ que cela fonctionne");
  })
  .catch(err => {
    console.error("Erreur de connexion", err);
  });

//route simples pour tester l'application
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue dans l'application d'authentification users." });
});


// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

// initialisation des ports et du serveur
const port = process.env.port || 8020;
app.listen(port, () => {
  console.log('Serveur démarré sur http://localhost:' + port);
});

// Pour creer les 3 différents roles
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    // Si il n'y a pas de roles dans la base de données
    if (!err && count === 0) {

        // On crée les 3 roles
        // On crée le role user
        new Role({ name: "user" }).save(err => {
            if (err) {
                console.log("error", err);
            }
            console.log("User a été ajouté à la collection des roles");
        });

        // On crée le role modérateur
        new Role({ name: "moderator" }).save(err => {
            if (err) {
                console.log("error", err);
            }
            console.log("Moderator a été ajouté à la collection des roles");
        });

        // On crée le role admin
        new Role({ name: "admin" }).save(err => {
            if (err) {
                console.log("error", err);
            }
            console.log("admin a été ajouté à la collection des roles");
        });
    }
  });
}


module.exports = app;
