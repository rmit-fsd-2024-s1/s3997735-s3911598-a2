module.exports = (express, app) => {
  const controller = require("../controllers/shopping_cart.controller.js");
  const router = express.Router();

  
  router.post("/", controller.all);
  router.put("/add", controller.add);
  router.post("/update", controller.update);
  router.delete("/delete", controller.delete);
  router.delete("/deleteAll", controller.deleteAll);



  // Add routes to server.
  app.use("/api/shopping_cart", router);
};
