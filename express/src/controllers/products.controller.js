const db = require("../database");

// get all products by category
exports.all = async (req, res) => {
  try {
    console.log(JSON.stringify(req.body));
    const products = await db.products.findAll(
      {
        where: {
          category: req.body.category
        }
      }
    );

    res.json(products);
  }
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
// get one product by id for product detail page
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