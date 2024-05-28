const { gql } = require("apollo-server-express");
const { PubSub } = require("graphql-subscriptions");
const db = require("../database");
const {user: User, Product, Review} = require("../database");

// Create and track a GraphQL PubSub.
const pubsub = new PubSub();

const REVIEW_ADDED_TRIGGER = "REVIEW_ADDED";

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
    price: Float!
    isSpecial: Boolean!
  }

  type Review {
    id: ID!
    content: String!
    user: User!
    product: Product!
    isDeleted: Boolean!
  }

  # Queries (read-only operations)
  type Query {
    users: [User!]!
    products: [Product!]!
    reviews: [Review!]!
  }

  # Mutation (modify data in the underlying data-source, ---database)
  type Mutation {
    toggleBlockUser(id: ID!): User!
    addProduct(name: String!, price: Float!, isSpecial: Boolean!): Product!
    updateProduct(id: ID!, name: String, price: Float, isSpecial: Boolean): Product!
    deleteProduct(id: ID!): Product!
    deleteReview(id: ID!): Review!
    addReview(content: String!): Review!
  }

  type Subscription {
    reviewAdded: User!
  }
`;

//Resolvers
const resolvers = {
    // Queries
    Query: {
        users: () => User.findAll(),
        products: () => Product.findAll(),
        reviews: () => Review.findAll({
            include: [User, Product],
            where: { isDeleted: false },
        }),
    },
    // Mutations
    Mutation: {
        toggleBlockUser: async (_, { id }) => {
            const user = await User.findByPk(id);
            user.isBlocked = !user.isBlocked;
            await user.save();
            pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: user}); // review controller
            return user;
        },
        addProduct: (_, { name, price, isSpecial }) => Product.create({ name, price, isSpecial }),
        updateProduct: async (_, { id, name, price, isSpecial }) => {
            const product = await Product.findByPk(id);
            if (name) product.name = name;
            if (price) product.price = price;
            if (isSpecial !== undefined) product.isSpecial = isSpecial;
            await product.save();
            return product;
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
            pubsub.publish('REVIEW_ADDED', { reviewAdded: review });
            return review;
        },
        addReview: async (_, { content }) => {
            // const user = await User.findByPk(userId);
            // if (user.isBlocked) {
            //     throw new Error('User is blocked and cannot add reviews');
            // }
            // const review = await Review.create({ content, userId, productId });
            // pubsub.publish('REVIEW_ADDED', { reviewAdded: content});
            // return review;
        }
    },
    Subscription: {
        reviewAdded: {
            subscribe: () => pubsub.asyncIterator(REVIEW_ADDED_TRIGGER),
        },
    },
};

module.exports = {
    typeDefs, resolvers
};