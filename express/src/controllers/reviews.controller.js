const db = require("../database");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");

exports.all = async (req, res) => {
    try {
        console.log(JSON.stringify(req.body));
        const reviews = await db.sequelize.query(`WITH RECURSIVE comment_tree AS (
            SELECT 
                r.id, 
                r.rating,
                r.content, 
                r.parentId, 
                0 AS level, 
                CONCAT(u.first_name, ' ', u.last_name) AS author,
                u.id as userId
            FROM reviews r
            JOIN users u ON r.userId = u.id
            WHERE r.productId = :productId 
            AND r.parentId IS NULL
            UNION ALL
            SELECT 
                c.id, 
                c.rating,
                c.content, 
                c.parentId, 
                ct.level + 1, 
                CONCAT(u.first_name, ' ', u.last_name) AS author,
                c.userId
            FROM reviews c
            JOIN users u ON c.userId = u.id
            INNER JOIN comment_tree ct ON c.parentId = ct.id
        )
        SELECT * FROM comment_tree
        ORDER BY level`, {
            type: QueryTypes.SELECT,
            replacements: { productId: req.body.product_id },
        });
        result = buildNestedReviews(reviews);
        res.json({ result: result });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.add = async (req, res) => {
    try {
        const review = await db.reviews.create({
            userId: req.body.user_id,
            content: req.body.content,
            productId: req.body.product_id,
            parentId: req.body.parent_id,
            rating: req.body.rating
        });
        
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: JSON.stringify(error) });
    }
}

exports.update = async (req, res) => {
    try {
        const review = await db.reviews.findByPk(req.body.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        review.rating = req.body.rating || review.rating;
        review.content = req.body.content || review.content;

        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.delete = async (req, res) => {
    try {
        const review = await db.reviews.findByPk(req.query.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        await review.destroy();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


function buildNestedReviews(reviews) {
    const reviewMap = {};
    reviews.forEach(review => {
        review.children = [];
        reviewMap[review.id] = review;
    });

    const nestedReviews = [];

    reviews.forEach(review => {
        if (review.parentId === null) {
            nestedReviews.push(review);
        } else {
            const parentReview = reviewMap[review.parentId];
            if (parentReview) {
                parentReview.children.push(review);
            }
        }
    });

    return nestedReviews;
}