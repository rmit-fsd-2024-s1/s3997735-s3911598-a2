const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
    Op: Sequelize.Op
};

// 创建 Sequelize 实例
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DIALECT
});

// 引入模型
db.user = require("./models/user.js")(db.sequelize, DataTypes);
//db.post = require("./models/post.js")(db.sequelize, DataTypes);

// 建立模型关联
db.post.belongsTo(db.user, { foreignKey: { name: "username", allowNull: false } });
db.user.hasMany(db.post, { foreignKey: "username" });  // 添加这行确保关联是双向的

// ：https://sequelize.org/master/manual/assocs.html

// 包含一个同步选项以及种子数据逻辑
db.sync = async () => {
    try {
        // 同步数据库架构
        await db.sequelize.sync();

        await seedData();
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

// 种子数据逻辑
async function seedData() {
    try {
        const count = await db.user.count();

        // 只有在必要时种子数据
        if (count > 0) return;

        const argon2 = require("argon2");

        let hash = await argon2.hash("abc123", { type: argon2.argon2id });
        await db.user.create({ username: "mbolger", email: "mbolger@example.com", password_hash: hash, first_name: "Matthew", last_name: "Bolger" });

        hash = await argon2.hash("def456", { type: argon2.argon2id });
        await db.user.create({ username: "shekhar", email: "shekhar@example.com", password_hash: hash, first_name: "Shekhar", last_name: "Kalra" });
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

module.exports = db;
