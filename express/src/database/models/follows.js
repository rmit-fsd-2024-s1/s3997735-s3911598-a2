module.exports = (sequelize, DataTypes) =>
    sequelize.define("follows", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            followedUserId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            
        }, {
            // Add the timestamp attributes (updatedAt, createdAt).
            timestamps: true
        }
    );