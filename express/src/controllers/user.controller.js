const db = require("../database");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

//Select all suers from database
exports.all = async (req,res) => {
    try {
        const users = await db.user.findAll({
            attributes: { exclude: ['password_hash']} //here we exclude password hash from the response
            
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error'});
    }
};

//Select one uesr from the database
exports.one = async (req, res) => {
    try {
        const user = await db.user.findByPK(req.params.id, {
            attributes: { exclude: ['password_hash']} //same here exclude password hash
        });
        if (!user){
            return res.status(404).json({ error: 'User not found'});
        }
        res.json(user);
    }catch (error) {
        res.status(500).json({ error:'Internal server error'});
    }
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
    try {
        const user = await db.user.findOne({ where: { username: req.body.username } });
        if (!user || !(await argon2.verify(user.password_hash, req.body.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ message: `Welcome ${user.username}`, token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a user in the database.
exports.create = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;

        // Check if username or email already exists
        const existingUser = await db.user.findOne({ where: { username } });
        const existingEmail = await db.user.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hash = await argon2.hash(password, { type: argon2.argon2id });

        const user = await db.user.create({
            username,
            email,
            password_hash: hash,
            first_name,
            last_name
        });

        res.status(201).json({ message: 'User created successfully', user: { username: user.username, email: user.email, first_name: user.first_name, last_name: user.last_name } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Update a user in the database.
exports.update = async (req,res) => {
    try {
        const {username,email,first_name,last_name,password} =req.body;
        const user = await  db.user.findByPk(req.params.id);
        if(!user){
            return res.status(404).json({ error:'User not found'});
        }
        
        //Update user fields
        user.username = username || user.username;
        user.eamil = email || user.eamil;
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        if (password) {
            user.password_hash =await argon2.hash(password,{type:argon2.argon2id});
        }
        
        await user.save();
        res.json({message:'User updated successfully', user: { username: user.username, email:user.eamil, first_name:user.first_name,last_name:user.last_name}});
        
    }catch (error){
        res.status(500).json({error: 'Internal server error'});
    }
};

// Delete a user from the database
exports.delete = async (req,res) => {
    try {
        const user = await db.user.findByPk(req.params.id);
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        await user.destory();
        res.json({message: 'user deleted successfully'});
        
    }catch (error){
        res.status(500).json({ error:'Internal server error'});
    }
};