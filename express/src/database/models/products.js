module.exports = (sequelize, DataTypes) =>
  sequelize.define("products", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
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
    category: {
      type: DataTypes.STRING(20),
    },
    originalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    validFrom: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    validTo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  }, {
    tableName: 'products'
  }
);
