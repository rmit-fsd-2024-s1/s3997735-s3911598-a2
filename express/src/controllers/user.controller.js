const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
    const users = await db.user.findAll();

    res.json(users);
};

// Select one user from the database.
exports.one = async (req, res) => {
    const user = await db.user.findByPk(req.params.id);

    res.json(user);
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
    const user = await db.user.findByPk(req.query.id); // after query, it have to be the some name of front-end

    if(user === null || await argon2.verify(user.password_hash, req.query.password) === false)
        // Login failed.
        res.json(null);
    else
        res.json(user);
};

// Create a user in the database.
exports.create = async (req, res) => {
    console.log(req.body);
    const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

    // console.log(hash);
    // await db.user.create({
    //
    //     email: "xxxxxxxxxxx.com",
    //     password_hash: hash,
    //     first_name: "Matthew",
    //     last_name: "Bolger",
    // });
    const user = await db.user.create({
        email: req.body.email,
        password_hash: hash,
        first_name: req.body.first_name,
        last_name: req.body.last_name

    });
    
    const output = {
        email : user.email,
        first_name : user.first_name,
        last_name : user.last_name,
        id : user.id
        
        
    };

    res.json(output);
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
        user.email = email || user.email;
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
        await user.destroy();
        res.json({message: 'user deleted successfully'});
        
    }catch (error){
        res.status(500).json({ error:'Internal server error'});
    }
};