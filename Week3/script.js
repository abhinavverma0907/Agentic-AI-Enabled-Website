import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const generateBtn = document.getElementById("generate-btn");
const goalInput = document.getElementById("goal-input");
const taskContainer = document.getElementById("task-container");
const loadingState = document.getElementById("loading-state");

generateBtn.addEventListener("click", async () => {
    const goal = goalInput.value.trim();

    if (!goal) {
        alert("Please enter a goal first!");
        return;
    }

    loadingState.classList.remove("hidden");
    taskContainer.innerHTML = "";

    try {
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

        const data = JSON.parse(response.text);

        loadingState.classList.add("hidden");

        if (data.tasks && data.tasks.length > 0) {
            data.tasks.forEach(task => {
                let priorityClass = "priority-medium";
                if (task.priority.toLowerCase().includes("high")) priorityClass = "priority-high";
                if (task.priority.toLowerCase().includes("low")) priorityClass = "priority-low";

                const taskHTML = `
                    <div class="task-card">
                        <h3>✅ ${task.task_name}</h3>
                        <div class="task-details">
                            <span><strong>Priority:</strong> <span class="${priorityClass}">${task.priority}</span></span>
                            <span><strong>Estimated Time:</strong> ${task.estimated_time}</span>
                        </div>
                    </div>
                `;
                taskContainer.innerHTML += taskHTML;
            });
        } else {
            taskContainer.innerHTML = "<p>No tasks were generated. Try being more specific with your goal.</p>";
        }

    } catch (error) {
        console.error("Error generating tasks:", error);
        loadingState.classList.add("hidden");
        taskContainer.innerHTML = `
            <div class="error-message">
                <strong>Oops! Something went wrong.</strong><br>
                Failed to fetch the plan from the AI. Check your API key and connection, then try again.<br>
                <small>${error.message}</small>
            </div>
        `;
    }
});