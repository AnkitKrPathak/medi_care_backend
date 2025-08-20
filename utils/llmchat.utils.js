const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiMedicalAssistance(query, conversationHistory) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

 const initialPrompt = {
    role: "user", // Gemini doesn’t have strict "system" role, so use "user"
    parts: [
      {
        text: `You are a helpful AI medical assistant. 
        Always act like a medical assistant chatbot: 
        - Provide appropriate response to medical queries.
        - Keep responses concise (max 100 words, unless explanation requires more).
        - Use simple and easy-to-understand language.
        - Give general health advice, but remind patients to consult doctors for serious issues.`
      }
    ]
  };

  const fullConversation = [initialPrompt, ...conversationHistory];

  const chat = model.startChat({
    history: fullConversation,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  // const chat = model.startChat({
  //     conversationHistory, // formatted history passed here
  //     generationConfig: {
  //       maxOutputTokens: 500,
  //     },
  //   });

  const result = await chat.sendMessage(query);
  return result.response.text();
}

module.exports = { getGeminiMedicalAssistance };
