module.exports = (express, app) => {
    const controller = require("../controllers/follows.controller.js");
    const router = express.Router();

    // get all products.
    router.post("/", controller.all);
    router.put("/add", controller.add);
    router.delete("/delete", controller.delete);

    // Add routes to server.
    app.use("/api/follows", router);
};
