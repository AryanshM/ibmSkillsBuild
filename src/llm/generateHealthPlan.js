import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const generateHealthPlan = async (userObjective, questions, answers) => {
  try {
    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.6,
    });

    const formattedQA = questions.map((q, i) => {
      return `Q${i + 1}: ${q.question}\nA${i + 1}: ${answers[i]}`;
    }).join('\n');

    const prompt = PromptTemplate.fromTemplate(
      `You are a professional health and wellness planner.

The user has the following health objective:
"{userObjective}"

They answered the following questions:

{formattedQA}

Based on the objective and the answers, generate a personalized health plan in JSON format only, with these 3 sections:

{{
  "diet": ["Plan option 1", "Plan option 2", "Plan option 3"],
  "sleep": ["Schedule option 1", "Schedule option 2", "Schedule option 3"],
  "exercise": ["Workout option 1", "Workout option 2", "Workout option 3"]
}}

Return ONLY the JSON object, no explanation or markdown formatting.
`
    );

    const chain = prompt.pipe(chatModel);
    await delay(2000); // Optional throttling

    const result = await chain.invoke({
      userObjective,
      formattedQA,
    });

    let output = result?.content?.trim();

    if (output.startsWith("```json") && output.endsWith("```")) {
      output = output.slice(7, -3).trim();
    } else if (output.startsWith("```") && output.endsWith("```")) {
      output = output.slice(3, -3).trim();
    }

    const parsed = JSON.parse(output);

    const isValid =
      parsed &&
      ["diet", "sleep", "exercise"].every((key) =>
        Array.isArray(parsed[key]) &&
        parsed[key].length >= 3 &&
        parsed[key].every((item) => typeof item === "string")
      );

    if (!isValid) {
      console.error("Invalid health plan format:", parsed);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Error generating health plan:", error);
    return null;
  }
};

export { generateHealthPlan };
