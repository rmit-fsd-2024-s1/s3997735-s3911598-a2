const { gql } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const db = require('../database');

const pubsub = new PubSub();

const REVIEW_ADDED_TRIGGER = 'REVIEW_ADDED';
const REVIEW_FLAGGED_TRIGGER = 'REVIEW_FLAGGED';

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
    validFrom: String
    validTo: String
  }

  type Query {
    users: [User!]!
    products: [Product!]!
    reviews: [Review!]!
    flaggedReviews: [Review!]!
    product(id: ID!): Product
  }

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

const shouldFlagReview = (content) => {
    const offensiveLanguage = ['trash', 'idiots'];
    const spamPatterns = [/http:\/\/\S+/i, /https:\/\/\S+/i, /www\.\S+/i];
    const irrelevantContent = ['The weather is great today'];
    const privacyViolations = [/address is \d+ \S+/i];
    const obsceneOrViolentContent = ['fuck', 'smash it'];

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

const resolvers = {
    Query: {
        users: async () => await db.user.findAll(),
        products: async () => await db.products.findAll(),
        reviews: async () => await db.reviews.findAll({
            where: { isDeleted: false },
            include: [db.user, db.products]
        }),
        flaggedReviews: async () => await db.reviews.findAll({
            where: { flagged: true, isDeleted: false },
            include: [db.user, db.products]
        }),
        product: async (_, { id }) => {
            return await db.products.findByPk(id);
        }
    },
    Mutation: {
        toggleBlockUser: async (_, { id }) => {
            const user = await db.user.findByPk(id);
            if (!user) throw new Error('User not found');
            user.isBlocked = !user.isBlocked;
            await user.save();
            return user;
        },

        addProduct: async (_, { input }) => {
            try {
                console.log("Adding product with input:", input); // 调试用
                return await db.products.create(input);
            } catch (error) {
                console.error("Error adding product:", error); // 调试用
                throw new Error('Error adding product');
            }
        },

        updateProduct: async (_, { id, input }) => {
            try {
                console.log("Received id:", id); // 调试用
                console.log("Received input:", input); // 调试用
                const product = await db.products.findByPk(id);
                if (!product) throw new Error('Product not found');
                return await product.update(input);
            } catch (error) {
                console.error("Error updating product:", error); // 调试用
                throw new Error('Error updating product');
            }
        },

        deleteProduct: async (_, { id }) => {
            try {
                const product = await db.products.findByPk(id);
                if (!product) throw new Error('Product not found');
                await product.destroy();
                return product;
            } catch (error) {
                throw new Error('Error deleting product');
            }
        },

        deleteReview: async (_, { id }) => {
            try {
                const review = await db.reviews.findByPk(id);
                if (!review) throw new Error('Review not found');
                review.isDeleted = true;
                await review.save();
                pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: review });
                pubsub.publish(REVIEW_FLAGGED_TRIGGER, { reviewFlagged: review });
                return review;
            } catch (error) {
                throw new Error('Error deleting review');
            }
        },

        addReview: async (_, { content, userId, productId }) => {
            try {
                const user = await db.user.findByPk(userId);
                if (!user) throw new Error('User not found');
                const product = await db.products.findByPk(productId);
                if (!product) throw new Error('Product not found');

                const flagged = shouldFlagReview(content);
                const review = await db.reviews.create({ content, userId, productId, flagged });
                pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: review });
                if (flagged) {
                    pubsub.publish(REVIEW_FLAGGED_TRIGGER, { reviewFlagged: review });
                }
                return review;
            } catch (error) {
                throw new Error('Error adding review');
            }
        },

        flagReview: async (_, { id }) => {
            try {
                const review = await db.reviews.findByPk(id);
                if (!review) throw new Error('Review not found');
                review.flagged = true;
                await review.save();
                pubsub.publish(REVIEW_FLAGGED_TRIGGER, { reviewFlagged: review });
                return review;
            } catch (error) {
                throw new Error('Error flagging review');
            }
        }
    },
    Subscription: {
        reviewAdded: {
            subscribe: () => pubsub.asyncIterator(REVIEW_ADDED_TRIGGER)
        },
        reviewFlagged: {
            subscribe: () => pubsub.asyncIterator(REVIEW_FLAGGED_TRIGGER)
        }
    }
};

module.exports = {
    typeDefs,
    resolvers
};
