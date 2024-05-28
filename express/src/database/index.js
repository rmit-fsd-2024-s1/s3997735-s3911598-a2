const { Sequelize, DataTypes } = require("sequelize");
const config = require("../database/config.js");

const db = {
    Op: Sequelize.Op,
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DIALECT,
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.products = require("./models/products.js")(db.sequelize, DataTypes);
db.shopping_cart = require("./models/shopping_cart.js")(db.sequelize, DataTypes);
db.shopping_cart_products = require("./models/shopping_cart_products.js")(db.sequelize, DataTypes);
db.reviews = require("./models/reviews.js")(db.sequelize, DataTypes);

// Relate models.
db.user.hasOne(db.shopping_cart);
db.shopping_cart.belongsTo(db.user);

db.shopping_cart.belongsToMany(db.products, {
    through: db.shopping_cart_products,
});
db.products.belongsToMany(db.shopping_cart, {
    through: db.shopping_cart_products,
});

db.reviews.belongsTo(db.products);
db.reviews.belongsTo(db.user);

// Include a sync option with seed data logic included.
db.sync = async () => {
    // Sync schema.
    // await db.sequelize.sync({ alter: true });
    await db.sequelize.sync();
    // Seed data if necessary.
    await seedData();
};

async function seedData() {
    const count = await db.user.count();

    // Only seed data if necessary.
    if (count > 0) return;

    const argon2 = require("argon2");

    let hash = await argon2.hash("abc123", { type: argon2.argon2id });
    await db.user.create({
        email: "xxx.com",
        password_hash: hash,
        first_name: "Matthew",
        last_name: "Bolger",
       
    });

    await db.products.create({
        name: "Apple",
        price: 1.0,
        description: "A delicious apple",
        image: "apple.jpg",
        isSpecial : true
    });
    await db.products.create({
        name: "Banana",
        price: 0.5,
        description: "A delicious banana",
        image: "banana.jpg",
        isSpecial : false
    });
    await db.shopping_cart.create({
        userId: 1,
    });
    await db.shopping_cart_products.create({
        shoppingCartId: 1,
        productId: 1,
        quantity: 2,
    });
    await db.shopping_cart_products.create({
        shoppingCartId: 1,
        productId: 2,
        quantity: 3,
    });
    await db.reviews.create({
        productId: 1,
        userId: 1,
        rating: 5,
        content: "Delicious!",
    });
    await db.reviews.create({
        productId: 2,
        userId: 1,
        rating: 4,
        content: "Yummy!",
    });
}

module.exports = db;
