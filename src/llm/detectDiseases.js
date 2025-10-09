import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const detectDisease = async (symptoms, questions, answers) => {
  try {
    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      model: "gemini-2.5-flash",
      temperature: 0.5,
    });

    const prompt = PromptTemplate.fromTemplate(
      `You are a medical diagnosis assistant.

A user has reported the following symptoms:
{symptoms}

They have also answered the following follow-up questions:
{formattedQuestions}

Based on this information, return a JSON object with your diagnosis and a short explanation like this:

{{
  "diagnosis": "Possible Disease Name",
  "explanation": "A brief reason based on symptoms and answers"
}}

Do not include any markdown, code block markers, or extra text. Only return the JSON object.`
    );

    // Format the question/answer pairs for the prompt
    const formattedQuestions = questions
      .map((q, i) => `Q: ${q.question}\nA: ${answers[i]}`)
      .join("\n");

    const chain = prompt.pipe(chatModel);

    await delay(2000); // Optional throttling

    const result = await chain.invoke({
      symptoms: symptoms.join(", "),
      formattedQuestions,
    });

    let output = result?.content?.trim();
    console.log("Gemini Output (Disease Detection):\n", output);

    // Remove code block markers if present
    if (output.startsWith("```json") && output.endsWith("```")) {
      output = output.slice(7, -3).trim();
    } else if (output.startsWith("```") && output.endsWith("```")) {
      output = output.slice(3, -3).trim();
    }

    const parsed = JSON.parse(output);

    // ✅ Validate AI output
    if (
      typeof parsed === "object" &&
      typeof parsed.diagnosis === "string" &&
      typeof parsed.explanation === "string"
    ) {
      // 🧩 Save to userProfile.json (localStorage)
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

        existingProfile.healthProfile = {
          lastUpdated: new Date().toISOString(),
          symptoms,
          questions,
          answers,
          diagnosis: parsed.diagnosis,
          explanation: parsed.explanation,
        };

        localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
        console.log("✅ Saved health profile to userProfile.json (localStorage):", existingProfile);
      } catch (storageError) {
        console.error("⚠️ Failed to save health data locally:", storageError);
      }

      return parsed;
    } else {
      console.error("Invalid diagnosis format:", parsed);

      // 🧩 Save fallback state
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

        existingProfile.healthProfile = {
          lastUpdated: new Date().toISOString(),
          symptoms,
          diagnosis: "Unknown",
          explanation: "Invalid format received from the model.",
        };

        localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
        console.log("⚠️ Saved fallback health profile to userProfile.json (localStorage):", existingProfile);
      } catch (storageError) {
        console.error("⚠️ Failed to save fallback health data:", storageError);
      }

      return { diagnosis: "Unknown", explanation: "Invalid format received from the model." };
    }
  } catch (error) {
    console.error("Error generating diagnosis:", error);

    // 🧩 Save AI error state
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

      existingProfile.healthProfile = {
        lastUpdated: new Date().toISOString(),
        diagnosis: "Error",
        explanation: "An error occurred while generating the diagnosis.",
      };

      localStorage.setItem("userProfile", JSON.stringify(existingProfile, null, 2));
      console.log("❌ Saved health error state to userProfile.json (localStorage)");
    } catch (storageError) {
      console.error("⚠️ Failed to update userProfile after Gemini error:", storageError);
    }

    return {
      diagnosis: "Error",
      explanation: "An error occurred while generating the diagnosis.",
    };
  }
};

export { detectDisease };
