const db = require("../database");
const argon2 = require("argon2");

// Get all users from the database
exports.all = async (req, res) => {
    const users = await db.user.findAll();
    res.json(users);
};

// Get a single user by ID from the database
exports.one = async (req, res) => {
    const user = await db.user.findByPk(req.params.id);
    res.json(user);
};

// Authenticate user by email and password
exports.login = async (req, res) => {
    const user = await db.user.findOne({ where: { email: req.body.email } });

    if (user === null || await argon2.verify(user.password_hash, req.body.password) === false) {
        // Login failed
        res.json(null);
    } else {
        res.json({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name });
    }
};

// Create a new user in the database
exports.create = async (req, res) => {
    const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

    const user = await db.user.create({
        email: req.body.email,
        password_hash: hash,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    });

    res.json(user);
};

// Update user details by ID in the database
exports.update = async (req, res) => {
    try {
        const { email, first_name, last_name, password } = req.body;
        const user = await db.user.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user fields
        user.email = email || user.email;
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        if (password) {
            user.password_hash = await argon2.hash(password, { type: argon2.argon2id });
        }

        await user.save();
        res.json({ message: 'User updated successfully', user: { email: user.email, first_name: user.first_name, last_name: user.last_name } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get current user profile by ID from the database
exports.getUser = async (req, res) => {
    try {
        const user = await db.user.findByPk(req.params.id);
        if (user) {
            res.json({
                id: user.id,
                username: `${user.first_name} ${user.last_name}`,
                email: user.email,
                joinDate: user.createdAt
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching user data" });
    }
};

// Update current user profile by ID in the database
exports.updateCurrentUser = async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        const user = await db.user.findByPk(req.params.id);
        if (user) {
            user.first_name = first_name || user.first_name;
            user.last_name = last_name || user.last_name;
            user.email = email || user.email;
            await user.save();
            res.json({ message: "Profile updated successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating user data" });
    }
};
