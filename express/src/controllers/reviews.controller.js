const db = require("../database");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");

exports.all = async (req, res) => {
    try {
        console.log(JSON.stringify(req.body));
        console.log(await db.sequelize.query('SELECT * FROM reviews', { raw: true }));
        const reviews = await db.sequelize.query('WITH RECURSIVE comment_tree AS ( SELECT id, content, parentId, 0 AS level FROM reviews WHERE productId = :productId AND parentId IS NULL UNION ALL SELECT c.id, c.content, c.parentId, ct.level + 1 FROM reviews c INNER JOIN comment_tree ct ON c.parentId = ct.id ) SELECT * FROM comment_tree ORDER BY level', {
            type: QueryTypes.SELECT,
            replacements: { productId: 1 },
        });
        console.log(reviews);
        result = buildNestedReviews(reviews);
        res.json({ result: result });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

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