module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define("reviews", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false
    });

    Review.associate = (models) => {
        Review.belongsTo(models.products, { foreignKey: 'productId', as: 'product' });
    };

    return Review;
};
