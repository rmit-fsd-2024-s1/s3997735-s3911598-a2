module.exports = (express, app) => {
  const controller = require("../controllers/products.controller.js");
  const router = express.Router();

  // get all products.
  router.get("/", controller.all);

  // Add routes to server.
  app.use("/api/products", router);
};
