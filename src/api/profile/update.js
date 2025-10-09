import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const filePath = path.join(process.cwd(), "src/data/userProfile.json");
  const current = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const updates = req.body;

  // Merge per-section updates
  const updated = {
    healthProfile: { ...current.healthProfile, ...updates.healthProfile },
    mentalHealthProfile: { ...current.mentalHealthProfile, ...updates.mentalHealthProfile },
    environmentProfile: { ...current.environmentProfile, ...updates.environmentProfile },
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

  res.status(200).json({ message: "Profile updated successfully", data: updated });
}
