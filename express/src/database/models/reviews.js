module.exports = (sequelize, DataTypes) =>
  sequelize.define("reviews", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  }, {
    tableName: 'reviews' 
  }
);
