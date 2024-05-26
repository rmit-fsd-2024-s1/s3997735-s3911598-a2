module.exports = (express, app) => {
  const controller = require("../controllers/reviews.controller.js");
  const router = express.Router();

  // get all products.
  router.post("/", controller.all);

  // Add routes to server.
  app.use("/api/reviews", router);
};
