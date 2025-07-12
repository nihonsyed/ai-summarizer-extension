// Replace with your Gemini API key
const GEMINI_API_KEY = "AIzaSyB9KRFocGJOGKII8y0up93yMrCHk--vVHk";

export async function summarizeWithGemini(text) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{
      parts: [{ text: `Summarize the following:\n\n${text}` }]
    }]
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No summary returned.";
  } catch (err) {
    console.error(err);
    return "❌ Error calling Gemini API.";
  }
}
