var Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('market_seller', {
    update_time:{
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    } ,
    source:{
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    } ,
    market_id:{
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    } ,
    data:{
      type: DataTypes.TEXT,
      allowNull: false,
      //json NOT NULL
    } ,
    id:{
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    }

  }, {
    // don't add the timestamp attributes (updateAt, createdAt)
    timestamps: false,

    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are not disabled
    // paranoid: true,

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    // underscored: true,

    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true
  });
};
