const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    UserName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }, // Added phone number field
    address: { type: String, required: true } // Added address field
});

const User = mongoose.model("User", userSchema);
module.exports = User;
