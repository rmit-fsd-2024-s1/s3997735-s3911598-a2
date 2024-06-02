## Full Stack Programming/COSC2758/Assignment 2
### Postgraduate/Jian LI/Yahui WANG
### githubURL: https://github.com/rmit-fsd-2024-s1/s3997735-s3911598-a2

## Project Structure
s3997735-s3911598-a2/
├── .git/
├── admin-dashboard/           # Admin Dashboard Frontend
│   ├── src/
│   │   ├── apollo/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── productDetail.js
│   │   │   ├── productManagement.js
│   │   │   ├── reviewModeration.js
│   │   │   └── userManagement.js
│   │   ├── data/
│   │   │   └── repository.js
│   │   ├── App.js
│   │   ├── index.js
│   └── package.json
├── express/                   # Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── follows.controller.js
│   │   │   ├── products.controller.js
│   │   │   ├── reviews.controller.js
│   │   │   ├── shopping_cart.controller.js
│   │   │   └── user.controller.js
│   │   ├── database/
│   │   │   └── models/
│   │   ├── graphql/
│   │   │   └── index.js
│   │   ├── routes.js
│   │   ├── server.js
│   └── package.json
├── SOIL_website/              # User Frontend
│   └── ... 
└── .README.md



## HD part

## Product Management 
This application allows users to manage products including adding, updating, and deleting products. 
It uses GraphQL for data operations and React for the user interface.

### Features
-View list of products
-Add a new product
-Update an existing product
-Delete a product

### Usage
1. **View Products**
    - Navigate to the main page to view the list of products.

2. **Add Product**
    - Fill in the product details in the form and click "Add Product".
    - **Note:** After adding a product, you need to refresh the page to see the new product in the list.

3. **Update Product**
    - Click the "Update" button next to the product you want to update, fill in the new details, and click "Update Product".

4. **Delete Product**
    - Click the "Delete" button next to the product you want to delete. A success message will be displayed upon successful deletion.


## Review Moderation 

### Overview

This feature allows administrators to manage user reviews in real-time. 
The functionality includes the ability to delete reviews, automatic flagging of potentially inappropriate reviews, 
and the display of review statistics.

### Functionality

1. **Real-time Review Updates**: Reviews are updated in real-time using GraphQL subscriptions.
2. **Deleting Reviews**: Administrators can delete reviews. Deleted reviews display a placeholder message indicating the deletion.
3. **Flagging Reviews**: Reviews containing certain keywords are automatically flagged for moderation.
4. **Review Statistics**: The dashboard displays statistics related to the number of reviews per product.


## Metrics Explanation
We have chosen the following metrics to enhance understanding and provide meaningful insights into the review moderation process:

1. Number of Reviews per Product:
Reason: This metric helps administrators understand which products are receiving the most feedback from users.
It can indicate product popularity and user engagement.

2. Review Length Distribution:
Reason: By categorizing reviews into short, medium, and long lengths, we can gain insights into the type of feedback users are providing.
Longer reviews might indicate detailed feedback or strong opinions, whereas shorter reviews might indicate quick comments or less engagement.

3. user EngagementData:
Reason: By extracting user information from the review data and counting the number of reviews for each user, we can visually understand the activity level of each user in the system.


## Implementation Details
- Frontend - React Components:
 - The `ReviewModeration` component uses Apollo Client to query, mutate, and subscribe to review data.
 - Reviews are displayed in lists, with flagged reviews highlighted for easy identification by the admin.
 - Review statistics are displayed using bar and pie charts.


## Example Usage

const shouldFlagReview = (content) => {
    const offensiveLanguage = [/trash/i, /idiots/i];
    const irrelevantContent = [/The weather is great today/i];
    const privacyViolations = [/address is \d+ \S+/i];
    const obsceneOrViolentContent = [/fuck/i, /smash it/i];

- When a user adds a review containing the word "trash/idiots/fuck/smash it/etc, it is automatically flagged.
- The admin dashboard displays this review under flagged reviews.
- The admin can then delete this review, and it will show a placeholder message in the user interface.


## How to Run

Backend:
Navigate to the express directory.
Run npm install to install dependencies.
Start the server with npm start.

Admin Dashboard:
Navigate to the admin-dashboard directory.
Run npm install to install dependencies.
Start the React application with npm start.

User Frontend (SOIL_website):
Navigate to the SOIL_website directory.
Run npm install to install dependencies.
Start the React application with npm start.

## **Unit test**:
 - Use `cd express` and `npm test`.
 - And then can see the result of unit test.


### References 
week7 Lectorial code/practical code
week8 Lectorial code
week11 practical code





