import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

// Optional delay to avoid rapid API hits
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Generates environment-based AI recommendations.
 * @param {Object} envData - Object containing environmental parameters.
 * Example:
 * {
 *   aqi: 120,
 *   temperature: 35,
 *   humidity: 80,
 *   windSpeed: 10,
 *   location: "New Delhi, India"
 * }
 */
const generateEnvironmentGuidelines = async (envData) => {
  try {
    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.6,
    });

    const prompt = PromptTemplate.fromTemplate(
      `You are an AI environmental advisor in a digital health platform.

Analyze the following real-time environmental parameters and provide concise, actionable health and lifestyle guidelines. 
The tone should be professional yet approachable, like a smart wellness assistant.

Use the following JSON format for your response only — no markdown or explanations:

{{
  "location": "{location}",
  "environment_summary": "Short summary of the current environment and its overall impact.",
  "guidelines": [
    "Guideline 1 (clear, practical advice)",
    "Guideline 2",
    "Guideline 3",
    ...
  ],
  "risk_level": "Low | Moderate | High | Severe"
}}

Environmental Data:
- AQI: {aqi}
- Temperature: {temperature} °C
- Humidity: {humidity} %
- Wind Speed: {windSpeed} km/h`
    );

    const chain = prompt.pipe(chatModel);

    // Optional delay (for throttling)
    await delay(2000);

    const result = await chain.invoke({
      location: envData.location || "Unknown",
      aqi: envData.aqi,
      temperature: envData.temperature,
      humidity: envData.humidity,
      windSpeed: envData.windSpeed,
    });

    let output = result?.content?.trim();
    console.log("Gemini Output (Environment Guidelines):\n", output);

    // Clean JSON if wrapped in code blocks
    if (output.startsWith("```json") && output.endsWith("```")) {
      output = output.slice(7, -3).trim();
    } else if (output.startsWith("```") && output.endsWith("```")) {
      output = output.slice(3, -3).trim();
    }

    // Parse the JSON safely
    const parsed = JSON.parse(output);

    // Validate the structure
    const isValid =
      typeof parsed.location === "string" &&
      typeof parsed.environment_summary === "string" &&
      Array.isArray(parsed.guidelines) &&
      parsed.guidelines.every((g) => typeof g === "string") &&
      typeof parsed.risk_level === "string";

    if (!isValid) {
      console.error("Invalid response format:", parsed);
      return {
        error: true,
        message: "Invalid AI response structure.",
      };
    }

    // 🧩 Save results to userProfile.json (localStorage)
    try {
      let existingProfile = localStorage.getItem("userProfile");
      if (!existingProfile) {
        console.log("🆕 Creating new userProfile.json in localStorage");
        existingProfile = {
          healthProfile: {},
          mentalHealthProfile: {},
          environmentProfile: {},
        };
      } else {
        existingProfile = JSON.parse(existingProfile);
      }

      existingProfile.environmentProfile = {
        lastUpdated: new Date().toISOString(),
        location: parsed.location,
        environmentSummary: parsed.environment_summary,
        riskLevel: parsed.risk_level,
        guidelines: parsed.guidelines,
        parameters: envData, // store actual sensor data too
      };

      localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
      console.log("✅ Saved environment profile to userProfile.json (localStorage):", existingProfile);
    } catch (storageError) {
      console.error("⚠️ Failed to save environment profile locally:", storageError);
    }

    return parsed;
  } catch (error) {
    console.error("Gemini Error generating environment guidelines:", error);

    // 🧩 Save error state to userProfile.json
    try {
      let existingProfile = localStorage.getItem("userProfile");
      if (!existingProfile) {
        existingProfile = {
          healthProfile: {},
          mentalHealthProfile: {},
          environmentProfile: {},
        };
      } else {
        existingProfile = JSON.parse(existingProfile);
      }

      existingProfile.environmentProfile = {
        lastUpdated: new Date().toISOString(),
        error: true,
        message: "An error occurred while generating environment guidelines.",
      };

      localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
      console.log("❌ Saved environment error state to userProfile.json (localStorage)");
    } catch (storageError) {
      console.error("⚠️ Failed to update local userProfile after Gemini error:", storageError);
    }

    return {
      error: true,
      message: "An error occurred while generating environment guidelines.",
    };
  }
};

export { generateEnvironmentGuidelines };
