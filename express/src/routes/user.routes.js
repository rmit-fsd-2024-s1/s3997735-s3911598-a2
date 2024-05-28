module.exports = (express, app) => {
    const controller = require("../controllers/user.controller.js");
    const router = express.Router();

    // get all user
    router.get("/", controller.all);

    // get single user
    router.get("/select/:id", controller.one);

    // user signin
    router.post("/login", controller.login);  

    // create new user
    router.post("/signup", controller.create);

    // update user
    router.put("/:id", controller.update);

    // delete user
    router.delete("/:id", controller.delete);

    // Add routes to server.
    app.use("/api/users", router);
};
