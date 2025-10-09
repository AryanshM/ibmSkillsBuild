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

      // 🧩 Save results to localStorage.userProfile (create if missing)
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

      existingProfile.mentalHealthProfile = {
        lastUpdated: new Date().toISOString(),
        diagnosis: diagnosisObject.diagnosis || "Unknown",
        recommendation: diagnosisObject.recommendation || "No recommendation provided",
        treatmentRequired: diagnosisObject.treatment_required || "Unknown",
      };

      localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
      console.log("✅ Saved mental health data to userProfile.json (localStorage):", existingProfile);

      return diagnosisObject;
    } catch (error) {
      console.error("Error parsing Gemini output:", error);
      console.log("Gemini Output (unparsed):", geminiOutput);

      // 🧩 Even when parse fails, save a fallback profile
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

      existingProfile.mentalHealthProfile = {
        lastUpdated: new Date().toISOString(),
        diagnosis: "No diagnosis generated",
        recommendation: "Could not parse Gemini output",
        treatmentRequired: "Unknown",
      };

      localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
      console.log("⚠️ Saved fallback mental health data to userProfile.json (localStorage):", existingProfile);

      return { diagnosis: "No diagnosis generated", recommendation: "Could not parse Gemini output" };
    }
  } catch (error) {
    console.error("Gemini Error:", error);

    // 🧩 Also persist an error state if the AI call fails entirely
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

      existingProfile.mentalHealthProfile = {
        lastUpdated: new Date().toISOString(),
        diagnosis: "Error analyzing responses",
        recommendation: "An error occurred during analysis.",
        treatmentRequired: "Unknown",
      };

      localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
      console.log("❌ Saved AI error state to userProfile.json (localStorage)");
    } catch (storageError) {
      console.error("Failed to update local userProfile after Gemini error:", storageError);
    }

    return { diagnosis: "Error analyzing responses", recommendation: "An error occurred during analysis." };
  }
};

export default analyzeResponses;
