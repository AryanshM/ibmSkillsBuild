import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

// Optional delay to avoid rapid API hits
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Analyzes a food item using Gemini and returns nutrition + health recommendations.
 * @param {string} foodName - The name of the food item (e.g., "Avocado", "Pizza", "Banana")
 */
const analyzeFoodItem = async (foodName) => {
  try {
    if (!foodName || foodName.trim() === "") {
      throw new Error("Food name cannot be empty.");
    }

    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.7,
    });

    const prompt = PromptTemplate.fromTemplate(`
You are a professional AI nutritionist in a digital wellness platform.

Analyze the given food item and respond with accurate, easy-to-understand nutritional information.
Your tone should be friendly, concise, and helpful — like a personal diet coach.

Your response **must strictly be in JSON** format, as shown below:

{{
  "food_name": "{foodName}",
  "summary": "Brief overview of the food (nutritional qualities, benefits, or warnings).",
  "nutrition": {{
    "calories": "in kcal (per 100g or per serving)",
    "protein": "in grams",
    "carbs": "in grams",
    "fiber": "in grams (if applicable)",
    "fat": "in grams (if applicable)",
    "vitamins": "list major vitamins if known"
  }},
  "recommendation": "One-paragraph personalized recommendation — whether it is healthy, when to eat, and who should avoid it."
}}

Now analyze this food:
- Food Item: {foodName}
`);

    const chain = prompt.pipe(chatModel);

    // Optional delay to prevent spam calls
    await delay(1500);

    const result = await chain.invoke({ foodName });
    let output = result?.content?.trim();

    console.log("🍎 Gemini Output (Food Analysis):\n", output);

    // Remove markdown wrappers if present
    if (output.startsWith("```json") && output.endsWith("```")) {
      output = output.slice(7, -3).trim();
    } else if (output.startsWith("```") && output.endsWith("```")) {
      output = output.slice(3, -3).trim();
    }

    // Parse JSON safely
    const parsed = JSON.parse(output);

    // Validate structure
    const isValid =
      typeof parsed.food_name === "string" &&
      typeof parsed.summary === "string" &&
      typeof parsed.recommendation === "string" &&
      typeof parsed.nutrition === "object";

    if (!isValid) {
      console.error("Invalid AI response structure:", parsed);
      return { error: true, message: "Invalid AI response format." };
    }

    // 🧩 Save to userProfile.json (localStorage)
    try {
      let existingProfile = localStorage.getItem("userProfile");
      if (!existingProfile) {
        existingProfile = {
          healthProfile: {},
          mentalHealthProfile: {},
          environmentProfile: {},
          nutritionProfile: {},
        };
      } else {
        existingProfile = JSON.parse(existingProfile);
      }

      existingProfile.nutritionProfile = {
        lastAnalyzed: new Date().toISOString(),
        foodName: parsed.food_name,
        summary: parsed.summary,
        nutrition: parsed.nutrition,
        recommendation: parsed.recommendation,
      };

      localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
      console.log("✅ Saved nutrition profile to userProfile.json:", existingProfile);
    } catch (storageError) {
      console.error("⚠️ Failed to save nutrition profile:", storageError);
    }

    return parsed;
  } catch (error) {
    console.error("Gemini Error analyzing food:", error);

    // 🧩 Save error to userProfile
    try {
      let existingProfile = localStorage.getItem("userProfile");
      if (!existingProfile) {
        existingProfile = {
          healthProfile: {},
          mentalHealthProfile: {},
          environmentProfile: {},
          nutritionProfile: {},
        };
      } else {
        existingProfile = JSON.parse(existingProfile);
      }

      existingProfile.nutritionProfile = {
        lastAnalyzed: new Date().toISOString(),
        error: true,
        message: "An error occurred while analyzing food.",
      };

      localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
      console.log("❌ Saved food error state to userProfile.json");
    } catch (storageError) {
      console.error("⚠️ Failed to update local userProfile after Gemini error:", storageError);
    }

    return { error: true, message: "An error occurred while analyzing the food item." };
  }
};

export { analyzeFoodItem };
