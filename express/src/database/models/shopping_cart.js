const { Description, Category } = require("@mui/icons-material");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("shopping_cart", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  }, {
    tableName: 'shopping_cart' 
  }, {
    freezeTableName: true, 
  });
