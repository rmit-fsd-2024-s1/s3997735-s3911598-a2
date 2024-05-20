module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        username: {
            type: DataTypes.STRING(32),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING(96),
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(40),
            allowNull: false
        }
    }, {
        // Add the timestamp attributes (updatedAt, createdAt).
        timestamps: true
    });
};
