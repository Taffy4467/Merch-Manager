const mongoose = require("mongoose");

// Define the schema for tokens
const tokenSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user associated with this token
    required: true, // This field is required
    ref: "User", // Refers to the User model
  },
  token: {
    type: String,
    required: true, // This field is required
  },
  createdAt: {
    type: Date,
    required: true, // This field is required
  },
  expiresAt: {
    type: Date,
    required: true, // This field is required
  },
});

const Token = mongoose.model("Token", tokenSchema); // Create a Token model
module.exports = Token; // Export the Token model
