// src/llm/screening.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

// Function to introduce a delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const analyzeResponses = async (formattedResponses) => {
  try {
      const chatModel = new ChatGoogleGenerativeAI({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        model: "gemini-2.5-flash", // or "gemini-1.5-pro" if available
        temperature: 0.3,
      });

    const prompt = PromptTemplate.fromTemplate(
      `You are a helpful mental health assistant. Analyze the following questionnaire responses and provide a possible diagnosis or insight. Return a JSON object with "diagnosis" and "recommendation", and "treatment_required" ("treatment_required" with a yes or no) fields.\n\nResponses:\n{responses} Keep under 100 words and without markdown`
    );

    const chain = prompt.pipe(chatModel);

    // Introduce a delay before making the API call
    await delay(5000); // Delay for 1 second (adjust as needed)

    const result = await chain.invoke({ responses: formattedResponses });

    const geminiOutput = result?.content?.trim();
    console.log("Gemini Output:", geminiOutput);

    try {
      const diagnosisObject = JSON.parse(geminiOutput);
      return diagnosisObject;
    } catch (error) {
      console.error("Error parsing Gemini output:", error);
      console.log("Gemini Output (unparsed):", geminiOutput);
      return { diagnosis: "No diagnosis generated", recommendation: "Could not parse Gemini output" };
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    return { diagnosis: "Error analyzing responses", recommendation: "An error occurred during analysis." };
  }
};

export default analyzeResponses;
