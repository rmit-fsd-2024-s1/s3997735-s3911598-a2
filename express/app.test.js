'use strict'

const { test } = require('tap');
const build = require('./app');
const db = require("./src/database");


test('requests the "/reviews" route', async t => {
    const app = build();
    // clear the database for testing due to the lose of testing database
    // we won't clear the database at production environment
    await db.sequelize.sync({force: true});
    await db.sync();

    const response = await app.inject({
        method: 'POST',
        url: '/reviews',
        payload: {
            product_id: 1,
        }
    });

    const responseBody = JSON.parse(response.body);
    // function done if the response status code is 200
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    // the response data is not empty due to initial data in the database
    t.ok(responseBody.data.length > 0, 'response data is not empty');
});


test('requests the "/shoppingCartRecord/update" route', async t => {
    const app = build();
    const response = await app.inject({
        method: 'PUT',
        url: '/shoppingCartRecord/update',
        payload: {
            id: 2,
            quantity: 3
        }
    });
    const responseBody = JSON.parse(response.body);
    // function done if the response status code is 200
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    // check the response data is success, preventing the error
    t.equal(responseBody.success, true, 'add successfully');
});

test('requests the "/shoppingCart" route', async t => {
    const app = build();

    const response = await app.inject({
        method: 'GET',
        url: '/shoppingCart',
        query: {
            user_id: 1,
        }
    });

    const responseBody = JSON.parse(response.body);
    // function done if the response status code is 200
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    // we will get shopping cart because we have add one record in the database
    t.equal(responseBody.length, 1, 'get successfully');
});

test('requests the "/shoppingCartRecord/delete" route', async t => {
    const app = build();

    const response = await app.inject({
        method: 'DELETE',
        url: '/shoppingCartRecord/delete',
        query: {
            id: 1,
        }
    });

    const responseBody = JSON.parse(response.body);
    // function done if the response status code is 200
    t.equal(response.statusCode, 200, 'returns a status code of 200');
    // check the response data is success, preventing the error
    t.equal(responseBody.success, true, 'delete successfully');
});

