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
  }

  # Mutation (modify data in the underlying data-source, ---database)
  type Mutation {
    toggleBlockUser(id: ID!): User!
    addProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Product!
    deleteReview(id: ID!): Review!
    addReview(content: String!, userId: ID!, productId: ID!): Review!
  }

  type Subscription {
    reviewAdded: Review!
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
            //pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: user}); // review controller
            return user;
        },
        addProduct: (_, { input }) => Product.create({
            name: input.name,
            description: input.description,
            price: input.price,
            category: input.category,
            originalPrice: input.originalPrice,
            imageUrl: input.imageUrl,
            validFrom: input.validFrom,
            validTo: input.validTo
        }),
        updateProduct: async (_, { id, input }) => {
            const product = await Product.findByPk(id);
            if (input.name) product.name = input.name;
            if (input.description) product.description = input.description;
            if (input.price) product.price = input.price;
            if (input.category) product.category = input.category;
            if (input.originalPrice !== undefined) product.originalPrice = input.originalPrice;
            if (input.imageUrl !== undefined) product.imageUrl = input.imageUrl;
            if (input.validFrom !== undefined) product.validFrom = input.validFrom;
            if (input.validTo !== undefined) product.validTo = input.validTo;
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
            pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: review });
            return review;
        },
        addReview: async (_, { content, userId, productId }) => {
            const user = await User.findByPk(userId);
            if (user.isBlocked) {
                throw new Error('User is blocked and cannot add reviews');
            }
            const review = await Review.create({ content, userId, productId });
            pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: review });
            return review;
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


//pubsub.publish(REVIEW_ADDED_TRIGGER, { reviewAdded: user}); // review controller