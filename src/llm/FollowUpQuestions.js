import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

// Utility to delay requests (optional throttling)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const generateFollowUpQuestions = async (symptoms) => {
  try {
    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.5,
    });

    const prompt = PromptTemplate.fromTemplate(
      `You are a helpful medical assistant. Based on the following symptoms, generate a list of 5 concise follow-up questions to gather more information for a potential diagnosis.

Each question must include exactly 4 multiple-choice options that are medically relevant.

Return only a valid JSON object with the following structure:

{{
  "questions": [
    {{
      "question": "Question text here",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    }},
    ...
  ]
}}

Do not include any explanation, markdown, or text outside the JSON object.

Symptoms: {symptoms}`
    );

    const chain = prompt.pipe(chatModel);

    await delay(3000);

    const result = await chain.invoke({ symptoms: symptoms.join(', ') });

    let geminiOutput = result?.content?.trim();
    console.log("Gemini Output (Follow-up Questions):\n", geminiOutput);

    // Remove code block markers if they exist
    if (geminiOutput.startsWith("```json") && geminiOutput.endsWith("```")) {
      geminiOutput = geminiOutput.slice(7, -3).trim();
    } else if (geminiOutput.startsWith("```") && geminiOutput.endsWith("```")) {
      geminiOutput = geminiOutput.slice(3, -3).trim();
    }

    const parsed = JSON.parse(geminiOutput);
    const questions = parsed.questions;

    // Validate: questions is an array of objects with question:string and options: [string, string, string, string]
    const isValid = Array.isArray(questions) && questions.every(q =>
      typeof q === "object" &&
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.every(opt => typeof opt === "string")
    );

    if (!isValid) {
      console.error("Invalid question format:", questions);
      return ["Failed to generate valid multiple-choice questions."];
    }

    return questions;
  } catch (error) {
    console.error("Gemini Error generating follow-up questions:", error);
    return ["An error occurred while generating follow-up questions."];
  }
};

export { generateFollowUpQuestions };
