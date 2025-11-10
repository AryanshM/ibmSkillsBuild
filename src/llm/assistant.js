import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

// Optional delay for realistic typing or throttling
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Generates a natural wellness-oriented response using Gemini.
 * @param {string} userMessage - The user's text input.
 * @returns {Promise<string>} - AI's empathetic and concise reply.
 */
export const generateWellnessReply = async (userMessage) => {
  try {
    if (!userMessage || userMessage.trim() === "") {
      return "I’m here whenever you’d like to share how you’re feeling. 🌱";
    }

    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.7,
    });

    const prompt = PromptTemplate.fromTemplate(`
You are a compassionate AI wellness companion in a holistic health app.
Your tone is warm, concise, and human-like.
Each response should:
- Be 1–2 sentences max
- Offer emotional support or practical wellness advice
- Avoid medical diagnosis
- Encourage mindfulness and small positive actions
- NEVER use markdown, emojis (except subtle ones like 🌿, 🌸, 🌞), or lists

User message: "{userMessage}"

Respond as the Wellness Assistant:
`);

    const chain = prompt.pipe(chatModel);

    await delay(1000); // optional natural delay

    const result = await chain.invoke({ userMessage });
    const reply = result?.content?.trim();

    if (!reply) {
      return "I'm here for you — take a deep breath and let's refocus on your well-being. 🌿";
    }

    console.log("🧘 Wellness Assistant Reply:", reply);

    // Optionally store conversation history in localStorage
    try {
      let chatHistory = JSON.parse(localStorage.getItem("wellnessChat")) || [];
      chatHistory.push({
        sender: "assistant",
        text: reply,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("wellnessChat", JSON.stringify(chatHistory));
    } catch (err) {
      console.warn("⚠️ Could not save chat history:", err);
    }

    return reply;
  } catch (error) {
    console.error("💬 Error generating AI reply:", error);
    return "I'm having a bit of trouble responding right now, but remember — your wellness matters.";
  }
};
