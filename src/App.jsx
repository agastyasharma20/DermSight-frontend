import React, { useState } from "react";
import { analyzeCase } from "./api";
import "./App.css";

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------
  // Handle Image Upload
  // ---------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ---------------------------
  // Submit Analysis
  // ---------------------------
  const handleSubmit = async () => {
    if (!image || symptoms.trim().length < 5) {
      setError("Please upload an image and describe symptoms properly.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);
    setShowDetails(false);

    try {
      const data = await analyzeCase(symptoms, image);
      setResult(data);
    } catch (err) {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  // ---------------------------
  // Urgency Color Map
  // ---------------------------
  const getUrgencyColor = (color) => {
    const map = {
      RED: "#e53935",
      ORANGE: "#fb8c00",
      YELLOW: "#fdd835",
      GREEN: "#43a047",
    };
    return map[color] || "#90a4ae";
  };

  // Normalize risk percentage for UI
  const riskPercentage = result
    ? Math.min(result.risk_score * 15, 100)
    : 0;

  return (
    <div className="container">
      <h1 className="logo">🩺 DermSight</h1>
      <p className="subtitle">
        AI-Powered Multimodal Clinical Triage System
      </p>

      {/* ---------------- INPUT CARD ---------------- */}
      <div className="input-card">
        <textarea
          placeholder="Describe symptoms in detail..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <div className="preview-card">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "🔍 Running Clinical Analysis..." : "🚀 Analyze Case"}
        </button>

        {error && <div className="error-box">{error}</div>}
      </div>

      {/* ---------------- LOADING ---------------- */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Performing multimodal AI assessment...</p>
        </div>
      )}

      {/* ---------------- RESULT CARD ---------------- */}
      {result && (
        <div className="result-card fade-in">
          <h2>{result.prediction}</h2>

          {/* Urgency Badge */}
          <div
            className="urgency-badge"
            style={{ backgroundColor: getUrgencyColor(result.urgency_color) }}
          >
            {result.urgency}
          </div>

          {/* Risk Progress Bar */}
          <div className="risk-bar">
            <div
              className="risk-fill"
              style={{
                width: `${riskPercentage}%`,
                backgroundColor: getUrgencyColor(result.urgency_color),
              }}
            ></div>
          </div>

          <p>
            <strong>Confidence:</strong>{" "}
            {(result.confidence * 100).toFixed(0)}%
          </p>

          <p>
            <strong>Risk Score:</strong> {result.risk_score}
          </p>

          {/* Clinical Reasoning */}
          <h3>Clinical Reasoning</h3>
          <ul>
            {result.clinical_reasoning?.map((item, index) => (
              <li key={index}>✓ {item}</li>
            ))}
          </ul>

          {/* Emergency Alert */}
          {result.emergency_action && (
            <div className="emergency-box">
              🚨 {result.emergency_action}
            </div>
          )}

          {/* Expandable AI Explanation */}
          <button
            className="details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide AI Explanation" : "View AI Explanation"}
          </button>

          {showDetails && (
            <div className="ai-details">
              <h3>AI Summary</h3>
              <p>{result.ai_explanation?.summary}</p>

              <h4>Differential Diagnoses</h4>
              <ul>
                {result.ai_explanation?.differentials?.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>

              <h4>Warning Signs</h4>
              <ul>
                {result.ai_explanation?.warning_signs?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="disclaimer">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
