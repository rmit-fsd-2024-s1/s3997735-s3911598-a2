// Using Apollo server express
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require('path');

// Added for subscription support.
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

// GraphQL schema and resolvers
const { typeDefs, resolvers } = require("./src/graphql");

// Database will be sync'ed in the background.
const db = require("./src/database");
db.sync();

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Parse requests of content-type - application/json.
  app.use(express.json());
  app.use(cors());
  
  // Simple Hello World route.
  app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
  });
  // Setup GraphQL subscription server.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Passing in an instance of a GraphQLSchema and
  // telling the WebSocketServer to start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  // Setup Apollo server.
  // Include plugin code to ensure all HTTP and subscription connections closed when the server is shutting down.
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }]
  });

  await server.start();
  server.applyMiddleware({ app });



  // Add user routes.
  require("./src/routes/user.routes.js")(express, app);
  require("./src/routes/products.routes.js")(express, app);
  require("./src/routes/shopping_cart.routes.js")(express, app);
  require("./src/routes/reviews.routes.js")(express, app);
  require("./src/routes/follows.routes.js")(express, app);

  // Set port, listen for requests.
  const PORT = process.env.PORT || 4000;
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`REST API running on port ${PORT}.`);
}

startApolloServer(typeDefs, resolvers);
