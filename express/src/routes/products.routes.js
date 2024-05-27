module.exports = (express, app) => {
  const controller = require("../controllers/products.controller.js");
  const router = express.Router();

  // get all products.
  router.post("/", controller.all);
  router.post("/one", controller.one);

  // Add routes to server.
  app.use("/api/products", router);
};
