const db = require("../database");

// get all follows by user_id 
exports.all = async (req, res) => {
    try {
        console.log(JSON.stringify(req.body));
    const result = await db.follows.findAll(
        {
            where: {
                userId: req.body.user_id
            }
        }
    );
    res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.add = async (req, res) => {
    try {
        const follow = await db.follows.create({
            userId: req.body.user_id,
            followedUserId: req.body.followed_user_id
        });
        res.json(follow);
    } catch (error) {
        res.status(500).json({ error: JSON.stringify(error) });
    }
}

exports.delete = async (req, res) => {
    try {
        const follow = await db.follows.findOne({
            where: {
                userId: req.query.user_id,
                followedUserId: req.query.followed_user_id
            }
        });

        if (!follow) {
            return res.status(404).json({ error: 'Follow not found' });
        }

        await follow.destroy();
        res.json({ message: 'Follow deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
