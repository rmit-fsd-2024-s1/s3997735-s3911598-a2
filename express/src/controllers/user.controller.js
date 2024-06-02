const db = require("../database");
const argon2 = require("argon2");
const moment = require('moment');

// Get all users from the database
exports.all = async (req, res) => {
    try {
        const users = await db.user.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Authenticate user by email and password
exports.login = async (req, res) => {
    try {
        const user = await db.user.findOne({ where: { email: req.body.email } });

        if (user === null || await argon2.verify(user.password_hash, req.body.password) === false) {
            // Login failed
            res.json(null);
        } else if (user.isBlocked) {
            // User is blocked
            res.status(403).json({ message: 'You have been blocked by the admin.' });
        } else {
            res.json({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new user in the database
exports.create = async (req, res) => {
    try {
        if (!req.body.first_name && !req.body.last_name && !req.body.email && !req.body.password && !validateEmail(req.body.email) && !validatePassword(req.body.password)) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        console.log(req.body);
        let user = await db.user.findOne({ where: { email: req.body.email } });
        if (user) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

        user = await db.user.create({
            email: req.body.email,
            password_hash: hash,
            first_name: req.body.first_name,
            last_name: req.body.last_name
        });

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get current user profile by ID from the database
exports.getUser = async (req, res) => {
    try {
        let user = await db.user.findByPk(req.body.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const formattedUser = { ...user.toJSON() };
        formattedUser.createdAt = moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss');
        console.log(formattedUser);
        res.json(formattedUser);
        
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching user data" });
    }
};

// Update current user profile by ID in the database
exports.updateCurrentUser = async (req, res) => {
    try {
        const { first_name, last_name } = req.body;
        const user = await db.user.findByPk(req.body.id);
        if (user) {
            user.first_name = first_name || user.first_name;
            user.last_name = last_name || user.last_name;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating user data" });
    }
};
// delete user by ID from the database
exports.delete = async (req, res) => {
    try {
        console.log(req.query.id);
        const user = await db.user.findByPk(req.query.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const validateEmail = (email) => {
    var emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};