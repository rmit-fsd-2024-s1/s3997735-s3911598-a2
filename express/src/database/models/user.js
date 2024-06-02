module.exports = (sequelize, DataTypes) =>
    sequelize.define("user", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: true // not a PK, but has to be unique
            },
            password_hash: {
                type: DataTypes.STRING(128),
                allowNull: false
            },
            first_name: {
                type: DataTypes.STRING(40),
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING(40),
                allowNull: false
            },
            isBlocked: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
        }, {
            // Add the timestamp attributes (updatedAt, createdAt).
            timestamps: true
        }
    );