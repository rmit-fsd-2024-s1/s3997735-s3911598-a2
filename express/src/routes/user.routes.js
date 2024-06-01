module.exports = (express, app) => {
    const controller = require("../controllers/user.controller.js");
    const router = express.Router();

    // get all user
    router.get("/", controller.all);

    // user login
    router.post("/login", controller.login);  

    // create new user
    router.post("/signup", controller.create);

    
    //get current user details
    router.post("/profile/get", controller.getUser);
    
    //update user details
    router.post("/profile/update", controller.updateCurrentUser);

    router.delete("/delete", controller.delete);

    // Add routes to server.
    app.use("/api/users", router);
};
