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

    app.put('/shoppingCartRecord/update', async function (request, reply) {

        // find the shopping cart product by id from test data
        const shopping_cart_product = await db.shopping_cart_products.findOne({
            where: {
                id: request.body.id
            }
        });
        if (shopping_cart_product === null)
            return { success: false };
        else {
            shopping_cart_product.quantity = request.body.quantity;
            await shopping_cart_product.save();
            // if the shopping cart product is updated successfully, return success
            return { success: true };
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
        // we will get the result because we have add one test record in the database
        return result;
    });

    app.delete('/shoppingCartRecord/delete', async function (request, reply) {

        //find the shopping cart product by id from test data
        const shopping_cart_product = await db.shopping_cart_products.findByPk(request.query.id);

        if (shopping_cart_product === null)
            return { success: false };
        else {
            await shopping_cart_product.destroy();

        }
        // if the shopping cart record is deleted successfully, return success
        return { success: true };

    })

    return app;
}

module.exports = build;
