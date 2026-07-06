async function askAI(prompt) {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "AI request failed.");
    return data.text;
  } catch (err) {
    console.error(err);
    return "Sorry, the AI assistant is unavailable right now. Make sure the server is running with npm start.";
  }
}
