const { Sequelize } = require("sequelize");
const sequelize = require("../database");

const Animes = sequelize.define("animes", {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  status: Sequelize.TEXT,
});

module.exports = Animes;
