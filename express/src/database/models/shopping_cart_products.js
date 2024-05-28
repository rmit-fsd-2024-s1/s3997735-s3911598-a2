module.exports = (sequelize, DataTypes) =>
  sequelize.define("shopping_cart_products", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  }, {
    tableName: 'shopping_cart_products' 
  }, {
    freezeTableName: true, 
  });
