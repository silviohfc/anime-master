const Sequelize = require("sequelize");
const { database } = require("./config");

const sequelize = new Sequelize(
  database.name,
  database.username,
  database.password,
  {
    host: database.host,
    dialect: "sqlite",
    logging: false,
    storage: "animes.sqlite",
  }
);

module.exports = sequelize;
