const ChatHistory = require("../models/ChatHistory");
const { getGeminiMedicalAssistance } = require("../utils/llmchat.utils");

exports.medicalAssistance = async (req, res) => {
  const { query } = req.body;
  const patientId = req.user.id;

   if (!query) {
    return res.status(400).json({ message: "Query is required." });
  }

  try {
    let chatHistory = await ChatHistory.findOne({ patient: patientId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ patient: patientId, messages: [] });
    }

    chatHistory.messages.push({ role: "user", content: query });

    const formattedHistory = chatHistory.messages.map(h => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }]
    }));

    const response = await getGeminiMedicalAssistance(query, formattedHistory);

    chatHistory.messages.push({ role: "assistant", content: response });
    chatHistory.lastUpdated = new Date();
    await chatHistory.save();

    res.status(200).json({ message: "Query analysed successfully", response });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ message: "AI service error", error: err.message });
  }
};


exports.getChatHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const history = await ChatHistory.findOne({ patient: patientId });

    if (!history) {
      return res.status(404).json({ message: "No chat history found" });
    }

    return res.status(200).json({
      message: "Chat history fetched successfully",
      history: history.messages, // return only chats array
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat history", error: error.message });
  }
};
