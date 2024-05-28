const db = require("../database");
const argon2 = require("argon2");

// Select all products with user_id
exports.all = async (req, res) => {
  try {
    console.log(req.body);
    const result = await db.shopping_cart.findAll(
      {
        where: {
          userId: req.body.user_id,
        },
        include: {
          model: db.products,
        },
      },

    );
    // format the result passing to the front
    const products = result[0].products.map(product => ({
      id: product.shopping_cart_products.id,
      product_id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: product.shopping_cart_products.quantity
    }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.add = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.body.user_id);
    let shopping_cart = await db.shopping_cart.findOne({
      where: {
        userId: req.body.user_id
      }
    });
    if (shopping_cart === null) {
      shopping_cart = await db.shopping_cart.create({
        userId: req.body.user_id
      });
    }
    const record = await db.shopping_cart_products.findOne({
      where: {
        productId: req.body.product_id,
        shoppingCartId: shopping_cart.id
      }
    });
    if (record !== null) {
      res.status(400).json({ error: 'Product already exists in shopping cart' });
      return;
    }
    const shopping_cart_product = await db.shopping_cart_products.create({
      productId: req.body.product_id,
      shoppingCartId: shopping_cart.id,
      quantity: req.body.quantity
    });
    if (shopping_cart_product === null)
      res.status(500).json({ error: 'Internal server error' });
    else
      res.json({ message: 'Product added to shopping cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  };
}

exports.delete = async (req, res) => {
  try {
    console.log("delete", req.query);
    const shopping_cart_product = await db.shopping_cart_products.findByPk(req.query.id);
    if (shopping_cart_product === null)
      res.status(404).json({ error: 'Shopping cart product not found' });
    else {
      await shopping_cart_product.destroy();
      res.json({ message: 'Shopping cart product deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.update = async (req, res) => {
  try {
    const shopping_cart_product = await db.shopping_cart_products.findOne({
      where: {
        id: req.body.id
      }
    });
    if (shopping_cart_product === null)
      res.status(404).json({ error: 'Shopping cart product not found' });
    else {
      shopping_cart_product.quantity = req.body.quantity;
      await shopping_cart_product.save();
      res.json({ message: 'Shopping cart product updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.deleteAll = async (req, res) => {
  try {
    const shopping_cart = await db.shopping_cart.findByPk(req.query.user_id);

    await db.shopping_cart_products.destroy({
      where: {
        shoppingCartId: shopping_cart.id
      }
    })
    res.json({ message: 'All shopping cart products deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
