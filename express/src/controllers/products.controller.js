const { where } = require("sequelize");
const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
  console.log(JSON.stringify(req.body));
  const products = await db.products.findAll(
    {
      where: {
        category: req.body.category
      }
    }
  );

  res.json(products);
};

exports.one = async (req, res) => {
  try {
    const product = await db.products.findByPk(req.body.product_id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}