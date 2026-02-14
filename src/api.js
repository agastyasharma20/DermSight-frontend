// Detect environment automatically
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://dermsight-backend.onrender.com";

// ==============================
// Analyze Case (Primary + Follow-up)
// ==============================

const API_URL = import.meta.env.VITE_API_URL;

export async function analyzeCase(symptoms, imageFile) {
  const formData = new FormData();
  formData.append("symptoms", symptoms);
  formData.append("image", imageFile);

  const response = await fetch(`${API_URL}/analyze/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("API error:", text);
    throw new Error("Analysis failed");
  }

  return await response.json();
}



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
