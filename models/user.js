const mongoose = require('mongoose');

// Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    jobTitle: String,
    gender: { type: String, required: true },
    profileImage: { type: String }, // Store the file path or URL
  }, {timestamps: true}
);

const User = mongoose.model("User", userSchema);


module.exports = User;
