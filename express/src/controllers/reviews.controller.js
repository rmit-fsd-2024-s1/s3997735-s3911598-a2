const db = require("../database");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const {QueryTypes} = require("sequelize");
// const { PubSub } = require("graphql-subscriptions");
const {pubsub, REVIEW_ADDED_TRIGGER, REVIEW_FLAGGED_TRIGGER} = require("../graphql");
// const REVIEW_ADDED_TRIGGER = "REVIEW_ADDED";
const shouldFlagReview = (content) => {
    const offensiveLanguage = [/trash/i, /idiots/i];
    const irrelevantContent = [/The weather is great today/i];
    const privacyViolations = [/address is \d+ \S+/i];
    const obsceneOrViolentContent = [/fuck/i, /smash it/i];

    for (let pattern of offensiveLanguage) {
        if (pattern.test(content)) return true;
    }

    for (let pattern of irrelevantContent) {
        if (pattern.test(content)) return true;
    }

    for (let pattern of privacyViolations) {
        if (pattern.test(content)) return true;
    }

    for (let pattern of obsceneOrViolentContent) {
        if (pattern.test(content)) return true;
    }

    return false;
};



exports.all = async (req, res) => {
    try {

        // use raw query to get the nested comments and join users table to get the author name
        console.log(JSON.stringify(req.body));
        const reviews = await db.sequelize.query(`WITH RECURSIVE comment_tree AS (SELECT r.id,
                                                                                         r.rating,
                                                                                         CASE
                                                                                             WHEN r.isDeleted
                                                                                                 THEN '[**** This review has been deleted by the admin ***]'
                                                                                             ELSE r.content END                        AS content,
                                                                                         r.parentId,
                                                                                         0                                             AS level,
                                                                                         CONCAT(u.first_name, ' ', u.last_name)        AS author,
                                                                                         u.id                                          as userId,
                                                                                         DATE_FORMAT(r.createdAt, '%Y-%m-%d %H:%i:%s') as createdAt
                                                                                  FROM reviews r
                                                                                           JOIN users u ON r.userId = u.id
                                                                                  WHERE r.productId = :productId
                                                                                    AND r.parentId IS NULL
                                                                                  UNION ALL
                                                                                  SELECT c.id,
                                                                                         c.rating,
                                                                                         CASE
                                                                                             WHEN c.isDeleted
                                                                                                 THEN '[**** This review has been deleted by the admin ***]'
                                                                                             ELSE c.content END                 AS content,
                                                                                         c.parentId,
                                                                                         ct.level + 1,
                                                                                         CONCAT(u.first_name, ' ', u.last_name) AS author,
                                                                                         c.userId,
                                                                                         c.createdAt
                                                                                  FROM reviews c
                                                                                           JOIN users u ON c.userId = u.id
                                                                                           INNER JOIN comment_tree ct ON c.parentId = ct.id)
                                                  SELECT *
                                                  FROM comment_tree
                                                  ORDER BY level, createdAt`, {
            type: QueryTypes.SELECT,
            replacements: {productId: req.body.product_id},
        });
        result = buildNestedReviews(reviews);
        res.json({result: result});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
};


exports.add = async (req, res) => {
    try {
//--------implement flag review ---
        const flag = shouldFlagReview(req.body.content);
        const review = await db.reviews.create({
            userId: req.body.user_id,
            content: req.body.content,
            productId: req.body.product_id,
            parentId: req.body.parent_id,
            rating: req.body.rating,
            flagged: flag
        });

        res.json(review);

        const user = await db.user.findByPk(review.userId);
        const product = await db.products.findByPk(review.productId);
        const notifyReview = {
            id: review.id,
            content: review.content,
            rating: review.rating,
            flagged: review.flagged,
            user: {
                id: user.id,
                email: user.email
            },
            product: {
                name: product.name,
            }
        };


        //pubsub to notify the socket....
        try {
           
            if (flag) 
                await pubsub.publish(REVIEW_FLAGGED_TRIGGER, {reviewFlagged: notifyReview});
            else
                console.log("good review added")
                await pubsub.publish(REVIEW_ADDED_TRIGGER, {reviewAdded: notifyReview});
        } catch (pubsubError) {
            console.error("Error publishing reviewAdded event:", pubsubError);
        }
    } catch (error) {
        res.status(500).json({error: JSON.stringify(error)});
    }
}

exports.update = async (req, res) => {
    try {
        const review = await db.reviews.findByPk(req.body.id);
        if (!review) {
            return res.status(404).json({error: 'Review not found'});
        }

        review.rating = req.body.rating || review.rating;
        review.content = req.body.content || review.content;

        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
}

exports.delete = async (req, res) => {
    try {
        const review = await db.reviews.findByPk(req.query.id);
        if (!review) {
            return res.status(404).json({error: 'Review not found'});
        }

        //review.isDeleted = true;
       // await review.save();
        await review.destroy();

        res.json({message: 'Review marked as deleted successfully'});
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
}

// Get average rating of a product
exports.getTotalRating = async (req, res) => {
    try {
        const totalRating = await db.sequelize.query(`SELECT AVG(rating) as totalRating
                                                      FROM reviews
                                                      WHERE productId = :productId
                                                        and rating != 0`, {
            type: QueryTypes.SELECT,
            replacements: {productId: req.query.product_id},
        });
        res.json(totalRating);
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
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



