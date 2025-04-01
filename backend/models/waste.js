const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  amount: { type: String, required: true },
  status: { type: String, default: "Pending", required: true },
  collectedDate: { type: Date },
});

const Waste = mongoose.model("Waste", wasteSchema);
module.exports = Waste;
