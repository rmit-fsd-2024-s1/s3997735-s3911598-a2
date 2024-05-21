const { Description, Category } = require("@mui/icons-material");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("products", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    Category: {
      type: DataTypes.STRING(20),
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  }, {
    tableName: 'products' // 明确指定表名
  }
);
