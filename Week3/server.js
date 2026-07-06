import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/generate", async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) return res.status(400).json({ error: "No goal provided." });

        const prompt = `I want to achieve this goal: "${goal}". Break this down into a step-by-step plan.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        tasks: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    task_name: { type: "STRING" },
                                    priority: { type: "STRING" },
                                    estimated_time: { type: "STRING" }
                                }
                            }
                        }
                    }
                }
            }
        });

        res.json(JSON.parse(response.text));
    } catch (err) {
        console.error("Gemini API error:", err);
        res.status(500).json({ error: "Something went wrong talking to the AI." });
    }
});

app.listen(PORT, () => {
    console.log(`Week3 running at http://localhost:${PORT}`);
});