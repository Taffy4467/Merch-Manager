const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Define the user schema
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
  },
  email: {
    type: String,
    require: [true, "Please enter an email"],
    unique: true, // Email should be unique
    trim: true,
    lowercase: true,
    // Regular expression to validate email format
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Submit a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Password must be at least 8 characters"],
    //maxlength: [23, "Password must be less than 23 characters"],
  },
  phone: {
    type: String,
    required: [true, "Please enter a phone number"],
    minlength: [10, "Phone number must be at least 10 characters"],
    default: "+270000000", // Default phone number
  },
  address: {
    type: String,
    required: [true, "Please enter your address"],
    maxlength: [50, "Address must be less than 50 characters"],
    default: "Address not provided", // Default address
  },
  photo: {
    type: String,
    required: [true, "Please enter a photo"],
    default: "https://res.cloudinary.com/dx6tl6aa2/image/upload/v1623346219/Project%203%20-%20Ironhack%20-%20MERN%20-%20Backend/default-user-image.png.png",
    // Default photo URL
  },
}, { timestamps: true });

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});

// Create a User model using the schema
const User = mongoose.model("User", userSchema);

module.exports = User; // Export the User model

