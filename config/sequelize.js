var Sequelize = require('sequelize')
    ,sequelize = new Sequelize('market', 'postgres', '123456', {
      dialect: "postgres",
      port: 5432
    })
module.exports = sequelize;
