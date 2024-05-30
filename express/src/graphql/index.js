const { gql } = require("apollo-server-express");
const { PubSub } = require("graphql-subscriptions");
const db = require("../database");
// const {user: User, Product, Review} = require("../database");

// Create and track a GraphQL PubSub.
const pubsub = new PubSub();

const REVIEW_ADDED_TRIGGER = "REVIEW_ADDED";
const REVIEW_FLAGGED_TRIGGER = "REVIEW_FLAGGED";

//Schema
const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    isBlocked: Boolean!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    originalPrice: Float
    imageUrl: String
    validFrom: String
    validTo: String
  }

  type Review {
    id: ID!
    content: String!
    user: User!
    product: Product!
    isDeleted: Boolean!
    flagged: Boolean!
  }
  
  input ProductInput {
    name: String!
    description: String!
    price: Float!
    category: String!
    originalPrice: Float
    imageUrl: String
    validFrom: String
    validTo: String
  }

  # Queries (read-only operations)
  type Query {
    users: [User!]!
    products: [Product!]!
    reviews: [Review!]!
    flaggedReviews: [Review!]!
  }

  # Mutation (modify data in the underlying data-source, ---database)
  type Mutation {
    toggleBlockUser(id: ID!): User!
    addProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Product!
    deleteReview(id: ID!): Review!
    addReview(content: String!, userId: ID!, productId: ID!): Review!
    flagReview(id: ID!): Review!
  }

  type Subscription {
    reviewAdded: Review!
    reviewFlagged: Review!
  }
`;

// Function to check if a review should be flaggged
const shouldFlagReview = (content) => {
    const offensiveLanguage = ["trash", "idiots",];
    const spamPatterns = [/http:\/\/\S+/i, /https:\/\/\S+/i, /www\.\S+/i];
    const irrelevantContent = ["The weather is great today"];
    const privacyViolations = [/address is \d+ \S+/i];
    const obsceneOrViolentContent = ["Fuck", "smash it"];

    for (let word of offensiveLanguage) {
        if (content.includes(word)) return true;
    }

    for (let pattern of spamPatterns) {
        if (pattern.test(content)) return true;
    }

    for (let word of irrelevantContent) {
        if (content.includes(word)) return true;
    }

    for (let pattern of privacyViolations) {
        if (pattern.test(content)) return true;
    }

    for (let word of obsceneOrViolentContent) {
        if (content.includes(word)) return true;
    }

    return false;
};


//Define the resolvers for the schema
const resolvers = {
    // Queries
    Query: {
        users:async () => await db.user.findAll(),
        // Fetch all users
        products: () => db.products.findAll(), 
        // Fetch all product
        reviews: async () => {
            return await db.reviews.findAll({
                where: { isDeleted: false },
                include: [
                    { model: db.user, as: 'user' },
                    { model: db.products, as: 'product' }
                ]
            });
        },// Fetch all non-deleted reviews
        flaggedReviews: () => Review.findAll({
            include: [User, Product],
            where: { flagged: true, isDeleted: false },
        }) // Fetch all flagged and non_deleted reviews
    },
    // Mutations
    Mutation: {
        toggleBlockUser: async (_, { id }) => {
            const user = await User.findByPk(id);
            user.isBlocked = !user.isBlocked;
            await user.save();
            //pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: user}); // review controller
            return user;
        },
        addProduct: (_, { input }) => Product.create(input), // Create a new product
        
        updateProduct: async (_, { id, input }) => {
            const product = await Product.findByPk(id);
            return product.update(input); // Update an existing product
        },
        
        
        
        deleteProduct: async (_, { id }) => {
            const product = await Product.findByPk(id);
            await product.destroy();
            return product;
        },
        
        deleteReview: async (_, { id }) => {
            const review = await Review.findByPk(id);
            review.isDeleted = true;
            await review.save();
            await pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: review });
            return review;
        },
        addReview: async (_, { content, userId, productId }) => {
            const flagged = shouldFlagReview(content); // Check if the review should be flagged
            const review = await Review.create({ content, userId, productId, flagged });
            pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: review }); // Publish the review addition event
            if (flagged) {
                pubsub.publish(REVIEW_FLAGGED_TRIGGER, { reviewFlagged: review }); // Publish the review flagged event if flagged
            }
            return review;
        },
        flagReview: async (_, { id }) => {
            const review = await Review.findByPk(id);
            review.flagged = true;
            await review.save();
            pubsub.publish(REVIEW_FLAGGED_TRIGGER, { reviewFlagged: review }); // Publish the review flagged event
            return review;
        }
    },
    Subscription: {
        reviewAdded: {
            subscribe: () => pubsub.asyncIterator(REVIEW_ADDED_TRIGGER),
        },
        reviewFlagged: {
            subscribe: () => pubsub.asyncIterator(REVIEW_FLAGGED_TRIGGER),
        }
    }
};

module.exports = {
    typeDefs, 
    resolvers
};


//pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: user}); // review controller