module.exports = (express, app) => {
  const controller = require("../controllers/reviews.controller.js");
  const router = express.Router();

  // get all products.
  router.post("/", controller.all);
  router.put("/add", controller.add);
  router.post("/update", controller.update);
  router.delete("/delete", controller.delete);

  // Add routes to server.
  app.use("/api/reviews", router);
};
