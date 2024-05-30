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
db.shopping_cart = require("./models/shopping_cart.js")(
    db.sequelize,
    DataTypes
);
db.shopping_cart_products = require("./models/shopping_cart_products.js")(
    db.sequelize,
    DataTypes
);
db.reviews = require("./models/reviews.js")(db.sequelize, DataTypes);
db.follows = require("./models/follows.js")(db.sequelize, DataTypes);



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
        email: "xxx.com",
        password_hash: hash,
        first_name: "Matthew",
        last_name: "Bolger",

    });
    await db.user.create({
        email: "xxxx.com",
        password_hash: hash,
        first_name: "jian",
        last_name: "li",

    });
    await db.products.create({
        name: "organic Apple",
        price: 2.99,
        category: "special",
        originalPrice: 3.99,
        description: "A delicious organic Apple",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1423565369.jpg',
    });

    await db.products.create({
        name: "organic Bananas",
        price: 3.79,
        category: "special",
        originalPrice: 3.99,
        description: "A delicious organic Bananas",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394418.jpg',
    });

    await db.products.create({
        name: "organic Blueberries",
        price: 6.95,
        category: "standard",
        description: "A delicious organic Blueberries",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1424074560.jpg',
    });

    await db.products.create({
        name: "organic Strawberries",
        price: 5.95,
        category: "standard",
        description: "A delicious organic Strawberries",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1445482087.jpg',
    });

    await db.products.create({
        name: "organic Grapes Green",
        price: 5.95,
        category: "standard",
        description: "A delicious organic Grapes Green",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394873.jpg',
    });

    await db.products.create({
        name: "organic Avocados",
        price: 1.25,
        category: "special",
        originalPrice: 3.99,
        description: "A delicious organic Avocados",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1444081936.jpg',
    });

    await db.products.create({
        name: "organic Cabbage – Red Whole",
        price: 5.95,
        category: "standard",
        description: "A delicious organic Cabbage – Red Whole",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394558.jpg',
    });

    await db.products.create({
        name: "organic Chinese / Wombok",
        price: 7.95,
        category: "standard",
        description: "A delicious organic Chinese / Wombok",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1444188751.jpg',
    });

    await db.products.create({
        name: "organic Capsicum Red",
        price: 4.25,
        category: "standard",
        description: "A delicious organic Capsicum Red",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394588.jpg',
    });

    await db.products.create({
        name: "Eggs – Free Range",
        price: 9.99,
        category: "standard",
        description: "A delicious Eggs – Free Range",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394783.jpg',
    });

    await db.products.create({
        name: "organic Carrots med",
        price: 1.49,
        category: "special",
        originalPrice: 3.99,
        description: "A delicious organic Carrots med",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388394618.jpg',
    });

    await db.products.create({
        name: "organic Turmeric Fresh",
        price: 9.49,
        category: "special",
        originalPrice: 13.99,
        description: "A delicious organic Turmeric Fresh",
        imageUrl: 'https://www.greenlandsgrocer.com.au/wp-content/uploads/2020/09/1388408648.jpg',
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
