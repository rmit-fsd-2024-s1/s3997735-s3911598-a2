module.exports = (express, app) => {
    const controller = require("../controllers/user.controller.js");
    const router = express.Router();

    // get all user
    router.get("/", controller.all);

    // get single user
    router.get("/select/:id", controller.one);

    // user signin
    router.post("/login", controller.login);  // 将GET方法改为POST

    // create new user
    router.post("/", controller.create);

    // update user
    router.put("/:id", controller.update);

    // deletle user
    router.delete("/:id", controller.delete);

    // Add routes to server.
    app.use("/api/users", router);
};
