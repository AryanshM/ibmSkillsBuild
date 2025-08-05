import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

// Optional delay utility
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const generatePlannerQuestions = async (objective) => {
  try {
    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.5,
    });

    const prompt = PromptTemplate.fromTemplate(
      `You are a helpful health planning assistant.

A user has the following objective: "{objective}"

Based on this, generate a list of 15 follow-up questions to better understand the user's current habits, constraints, preferences, and needs.

Each question should include exactly 4 multiple choice options that are realistic and relevant.

Return only a valid JSON object in the format:

{{
  "questions": [
    {{
      "question": "Your question here?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    }},
    ...
  ]
}}

Do not include any explanations or formatting outside the JSON.
`
    );

    const chain = prompt.pipe(chatModel);
    await delay(2000); // Optional: throttle to prevent rate limit

    const result = await chain.invoke({ objective });
    let output = result?.content?.trim();

    // Strip potential code block wrappers
    if (output.startsWith("```json") && output.endsWith("```")) {
      output = output.slice(7, -3).trim();
    } else if (output.startsWith("```") && output.endsWith("```")) {
      output = output.slice(3, -3).trim();
    }

    const parsed = JSON.parse(output);
    const questions = parsed.questions;

    const isValid = Array.isArray(questions) && questions.every(q =>
      typeof q === "object" &&
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.every(opt => typeof opt === "string")
    );

    if (!isValid) {
      console.error("Invalid planner question format:", questions);
      return [];
    }

    return questions;
  } catch (err) {
    console.error("Error generating planner questions:", err);
    return [];
  }
};

export { generatePlannerQuestions };
