const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");
const { Category } = require("@mui/icons-material");

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
db.shopping_cart = require("./models/shopping_cart.js")(
    db.sequelize,
    DataTypes
);
db.shopping_cart_products = require("./models/shopping_cart_products.js")(
    db.sequelize,
    DataTypes
);
db.reviews = require("./models/reviews.js")(db.sequelize, DataTypes);

// Relate post and user.
// db.post.belongsTo(db.user, {
//   foreignKey: { name: "username", allowNull: false },
// });

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

db.reviews.belongsTo(db.user);
db.reviews.belongsTo(db.products);

// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
    // Sync schema.
    await db.sequelize.sync();

    // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
    // await db.sequelize.sync({ force: true });

    await seedData();
};

async function seedData() {
    const count = await db.user.count();

    // Only seed data if necessary.
    if (count > 0) return;

    const argon2 = require("argon2");

    let hash = await argon2.hash("abc123", { type: argon2.argon2id });
    await db.user.create({
        username: "mbolger",
        email: "xxx.com",
        password_hash: hash,
        first_name: "Matthew",
        last_name: "Bolger",
    });

    hash = await argon2.hash("def456", { type: argon2.argon2id });
    await db.user.create({
        username: "shekhar",
        email: "xxxx.com",
        password_hash: hash,
        first_name: "Shekhar",
        last_name: "Kalra",
    });
    await db.products.create({
        name: "organic Apple",
        price: 1.0,
        description: "A delicious apple",
        category: "special",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1423565369.jpg',
    });
    await db.products.create({
        name: "organic Banana",
        price: 0.5,
        category: "special",
        description: "A delicious banana",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394418.jpg',
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
        parentId: null,
    });
    await db.reviews.create({
        productId: 1,
        userId: 2,
        rating: 3,
        content: "Meh",
        parentId: 1,
    });
    await db.reviews.create({
        productId: 2,
        userId: 1,
        rating: 4,
        content: "Yummy!",
    });
}

module.exports = db;
