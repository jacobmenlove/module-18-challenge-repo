import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from 'apollo-server-express'; // Import ApolloServer
import { typeDefs, resolvers } from './schemas'; // Import your GraphQL schemas
import { authMiddleware } from './auth'; // Import your authentication middleware

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Apollo Server
const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({ req }) => {
    // Use the authMiddleware to get user data
    const user = authMiddleware({ req });
    return { user }; // Pass user data to resolvers
  }
});

// Apply Apollo middleware to the Express server
server.applyMiddleware({ app });

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Use your existing routes
app.use(routes);

// Start the database connection and server
db.once('open', () => {
  app.listen(PORT, () => 
    console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`)
  );
});
