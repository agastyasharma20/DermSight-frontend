// Detect environment automatically
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://dermsight-backend.onrender.com";

// ==============================
// Analyze Case
// ==============================

export async function analyzeCase(symptoms, imageFile) {
  const formData = new FormData();
  formData.append("symptoms", symptoms);
  formData.append("image", imageFile);

  const response = await fetch(`${BASE_URL}/analyze/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error:", errorText);
    throw new Error("Analysis failed");
  }

  return await response.json();
}
