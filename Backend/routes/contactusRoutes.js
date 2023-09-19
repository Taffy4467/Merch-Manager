const express = require("express");
const { contactUs } = require("../controllers/contactController"); // Import the contactUs controller function
const router = express.Router();
const protect = require("../middleware/authMiddleware"); // Import the protect middleware

// Define a POST route for handling contact form submissions
router.post("/", protect, contactUs);

module.exports = router; // Export the router for use in other parts of your application
