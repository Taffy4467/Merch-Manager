const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;

  // Ensure the user is authenticated
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  // Validation: Check if subject and message are provided
  if (!subject || !message) {
    res.status(400);
    throw new Error("Please add subject and message");
  }

  // Define email parameters
  const send_to = EMAIL_USER;
  const sent_from = EMAIL_USER;
  const reply_to = user.email;

  try {
    // Use the sendEmail utility to send the email
    await sendEmail(subject, message, send_to, sent_from, reply_to);

    // Email sent successfully
    res.status(200).json({ success: true, message: "Email Sent" });
  } catch (error) {
    // Handle email sending errors
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

module.exports = {
  contactUs,
};
