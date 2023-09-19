// Load environment variables from .env file
const dotenv = require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Define the port number or use 5000 as a default
const port = process.env.PORT || 5000;

// Get MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Import cookie parsing middleware
const cookieParser = require('cookie-parser');

// Import custom error handling middleware
const errorhandler = require('./middleware/errorMiddleware');

// Import user routes
const userRoute = require('./routes/userroute');

// Create an Express application
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse JSON request bodies (again, body-parser is no longer required)
app.use(bodyParser.json());

// Use the user routes under the '/api/users' path
app.use('/api/users', userRoute);

// Define a basic route for the home page
app.get('/', (req, res) => {
  res.send('Home Page');
});

// Use the error handling middleware
app.use(errorhandler);

// Connect to MongoDB using the URI from environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Start the server and listen on the specified port
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
