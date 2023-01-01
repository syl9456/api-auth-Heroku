const mongoose = require("mongoose");

// On crée le schéma de données pour le role des utilisateurs
const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    name: String
  })
);

module.exports = Role;