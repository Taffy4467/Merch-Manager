const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware"); // Import the protect middleware
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController"); // Import product controller functions
const { upload } = require("../utils/fileUpload"); // Import file upload middleware

// Define routes for creating, updating, getting, and deleting products
router.post("/", protect, upload.single("image"), createProduct); // Create a new product
router.patch("/:id", protect, upload.single("image"), updateProduct); // Update an existing product
router.get("/", protect, getProducts); // Get a list of all products
router.get("/:id", protect, getProduct); // Get a single product by ID
router.delete("/:id", protect, deleteProduct); // Delete a product by ID

module.exports = router; // Export the router for use in other parts of your application
