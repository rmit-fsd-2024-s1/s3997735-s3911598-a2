'use strict'
const db = require("./src/database");
const fastify = require('fastify');
const { QueryTypes } = require("sequelize");


function build(opts = {}) {
    
    
    const app = fastify(opts);

    app.post('/reviews', async function (request, reply) {
        // call the main function of reviews to test database connection and database attributes
        const reviews = await db.sequelize.query(`WITH RECURSIVE comment_tree AS (
            SELECT 
                r.id, 
                r.rating,
                r.content, 
                r.parentId, 
                0 AS level, 
                CONCAT(u.first_name, ' ', u.last_name) AS author,
                u.id as userId,
                DATE_FORMAT(r.createdAt, '%Y-%m-%d %H:%i:%s') as createdAt
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
                c.userId,
                c.createdAt
            FROM reviews c
            JOIN users u ON c.userId = u.id
            INNER JOIN comment_tree ct ON c.parentId = ct.id
        )
        SELECT * FROM comment_tree
        ORDER BY level, createdAt`, {
            type: QueryTypes.SELECT,
            replacements: { productId: request.body.product_id },
        });
        return { data: reviews };
    });

    app.put('/shoppingCart/add', async function (request, reply) {
        try {
            const result = await db.shopping_cart.create({
                userId: request.body.user_id
            });
            // it maybe exist same shopping cart with same user_id
            // so we just need to catch the error and return the success
            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    });

    app.get('/shoppingCart', async function (request, reply) {
        const result = await db.shopping_cart.findAll(
            {
                where: {
                    userId: request.query.user_id,
                },
                include: {
                    model: db.products,
                },
            },
        );
        // we will get the result using the same user id
        return result;
    });

    app.delete('/shoppingCart/deleteAll', async function (request, reply) {
        try {
            await db.shopping_cart.destroy({
                where: {
                    userId: request.query.user_id
                }
            })
            // if the shopping cart is deleted successfully, return success
            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    })

    return app;
}

module.exports = build;
