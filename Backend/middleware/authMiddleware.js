const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Middleware to protect routes that require authentication
const protect = asyncHandler(async (req, res, next) => {
  try {
    let token;

    // Check if a token exists in the cookies
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // If no token is found, return a 401 Unauthorized error
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the decoded token
    const user = await User.findById(decoded.id);

    // If no user is found, return a 404 Not Found error
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Attach the user object to the request for use in subsequent route handlers
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.log(error);

    // Handle authentication failures by returning a 401 Unauthorized error
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

module.exports = protect;
