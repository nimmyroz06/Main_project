const mongoose = require("mongoose");

const hksUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const HKSUser = mongoose.model("HKSUser", hksUserSchema);
module.exports = HKSUser;
