## Full Stack Programming/COSC2758/Assignment 2
### Postgraduate/Jian LI/Yahui WANG
### githubURL: https://github.com/rmit-fsd-2024-s1/s3997735-s3911598-a2

## Project Structure





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

### Implementation Details

#### Backend

- **GraphQL Schema and Resolvers**:
 - The `Review` type includes fields for `isDeleted` and `flagged`.
 - Queries include `reviews` and `flaggedReviews` to fetch all reviews and flagged reviews, respectively.
 - Mutations include `deleteReview` and `flagReview` for deleting and flagging reviews.
 - Subscriptions include `reviewAdded` and `reviewFlagged` for real-time updates when reviews are added or flagged.

#### Frontend

- **React Components**:
 - The `ReviewModeration` component uses Apollo Client to query, mutate, and subscribe to review data.
 - Reviews are displayed in lists, with flagged reviews highlighted for easy identification by the admin.
 - Review statistics are displayed using bar and pie charts.

### How to Run

1. **Backend**:
 - Start the GraphQL server with the appropriate configurations.
 - Ensure the database models and associations are correctly set up.

2. **Frontend**:
 - Use `npm start` to run the React application.
 - The admin dashboard can be accessed to manage reviews and view real-time updates and statistics.

## Example Usage

- When a user adds a review containing the word "inappropriate", it is automatically flagged.
- The admin dashboard displays this review under flagged reviews.
- The admin can then delete this review, and it will show a placeholder message in the user interface.

## Conclusion

This feature enhances the ability of administrators to manage user-generated content effectively, 
ensuring that inappropriate reviews are promptly flagged and addressed.




## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the application using `npm start`.




### References 
week7
week8





