// Detect environment automatically
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://dermsight-backend.onrender.com";

// ==============================
// Analyze Case (Primary + Follow-up)
// ==============================

export async function analyzeCase(symptoms, imageFile, followUpCaseId = null) {
  const formData = new FormData();
  formData.append("symptoms", symptoms);
  formData.append("image", imageFile);

  if (followUpCaseId) {
    formData.append("follow_up_case_id", followUpCaseId);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 sec safety

    const response = await fetch(`${BASE_URL}/analyze/`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Analysis failed");
    }

    return await response.json();

  } catch (error) {
    console.error("API Error:", error);
    throw new Error(
      error.name === "AbortError"
        ? "Request timed out. Please try again."
        : "Server error occurred."
    );
  }
}
