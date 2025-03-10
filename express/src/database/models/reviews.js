module.exports = (sequelize, DataTypes) =>
    sequelize.define("reviews", {
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
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            // for hd part
            flagged: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            parentId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
        }, {
            timestamps: true
        }, {
            tableName: 'reviews'
        }
    );
