const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  messages: [chatMessageSchema],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
