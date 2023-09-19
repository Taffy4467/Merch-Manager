// Import required modules and models
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../UTILS/sendEmail");

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register user route
const registeruser = asyncHandler(async (req, res) => {
  // Extract data from the request body
  const { name, email, password, address, phone, photo } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password || !address || !phone) {
    res.status(400);
    throw new Error("Please fill in all the fields");
  }

  // Check if the password meets the length requirement
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long");
  }

  // Check if the email is valid
  if (!email.includes("@")) {
    res.status(400);
    throw new Error("Invalid Email");
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user
  const user = await User.create({
    username: name,
    email,
    password,
    address,
    phone,
    photo,
  });

  // Generate a JWT token
  const token = generateToken(user._id);

  // Set the token as a cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    sameSite: "none",
    secure: true,
  });

  // Send a response with user data and token
  if (user) {
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      photo: user.photo,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login user route
const loginuser = asyncHandler(async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  // Find the user by email
  const user = await User.findOne({ email });

  // Check if the user exists
  if (!user) {
    res.status(400);
    throw new Error("User not found. Please sign in");
  }

  // Check if the provided password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // If user and password are correct, generate a token and set it as a cookie
  if (user && passwordIsCorrect) {
    const token = generateToken(user._id);

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: "none",
      secure: true,
    });

    // Send a response with user data and token
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      photo: user.photo,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Logout user route
const logoutuser = asyncHandler(async (req, res) => {
  // Clear the token cookie to log the user out
  res.cookie("token", null, {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Get user route
const getuser = asyncHandler(async (req, res) => {
  // Find the user by their ID and exclude the password field
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      photo: user.photo,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Logged status route
const loggedstatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

// Update user route
const updateuser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, email, address, phone } = user;
    user.username = req.body.name || user.username;
    user.email = email;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;
    user.photo = req.body.photo || user.photo;

    const updatedUser = await user.save();
    res.status(200).json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: email,
      address: updatedUser.address,
      phone: updatedUser.phone,
      photo: updatedUser.photo,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Change password route
const changepassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const passwordIsCorrect = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!passwordIsCorrect) {
      res.status(400);
      throw new Error("Invalid Old Password");
    }

    if (req.body.newPassword.length < 8) {
      res.status(400);
      throw new Error("New Password must be at least 8 characters long");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    user.password = hashedPassword;

    const updatedUser = await user.save();
    res.status(200).send({ message: "Password changed successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Forgot password route
const forgotpassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const token = await Token.findOne({ user_id: user._id });

  if (token) {
    await token.deleteOne();
  }

  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  await Token.create({
    user_id: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p> Regards......</p>
    <p> Team Merch Manager</p>
    `;
  const send_from = process.env.EMAIL_USERNAME;
  const send_to = email;
  const subject = "Password Reset Request";
  const send_replyTo = process.env.EMAIL_USERNAME;
  try {
    // Send an email with the reset password link
    await sendEmail({ subject, send_from, send_to, send_replyTo, message });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500);
    console.log('Error sending email: ', err);
  }
});

// Reset password route
const resetpassword = asyncHandler(async (req, res) => {
  const Password = req.body.password;
  const resetToken = req.body.token;

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const userToken = await Token.findOne({ token: hashedToken, expiresAt: { $gt: Date.now() } });
  if (!userToken) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  const user = await User.findById(userToken.user_id);
  user.password = Password;
  await user.save();
  res.status(200).json({ message: "Password reset successfully" });
});

// Export all the controller functions
module.exports = {
  registeruser,
  loginuser,
  logoutuser,
  getuser,
  loggedstatus,
  updateuser,
  changepassword,
  forgotpassword,
  resetpassword,
};

