const mongoose = require("mongoose");

// Define the schema for products
const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who added the product
      required: true,
      ref: "User", // Refers to the User model
    },
    name: {
      type: String,
      required: [true, "Please add a name"], // Validation for required field
      trim: true, // Trims whitespace from the beginning and end of the string
    },
    sku: {
      type: String,
      required: true,
      default: "SKU", // Default value if not provided
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, "Please add a quantity"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Please add a price"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    image: {
      type: Object,
      default: {}, // Default empty object for image
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields to the document
  }
);

const Product = mongoose.model("Product", productSchema); // Create a Product model
module.exports = Product; // Export the Product model
