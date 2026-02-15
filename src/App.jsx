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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image || symptoms.trim().length < 5) {
      alert("Please provide detailed symptoms and upload an image.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeCase(symptoms, image);
      setResult(data);
    } catch (error) {
      alert("Server error. Please try again.");
    }

    setLoading(false);
  };

  const getUrgencyColor = (color) => {
    const map = {
      RED: "#ff4d4d",
      ORANGE: "#ff9f1c",
      YELLOW: "#ffd60a",
      GREEN: "#2ec4b6",
    };
    return map[color] || "#94a3b8";
  };

  const riskPercentage = result ? Math.min(result.risk_score * 15, 100) : 0;

  return (
    <div className="main-wrapper">
      <div className="container">
        <header className="header">
          <h1>🩺 DermSight</h1>
          <p>AI-Powered Multimodal Clinical Triage System</p>
        </header>

        {/* INPUT CARD */}
        <div className="card input-card">
          <textarea
            placeholder="Describe symptoms clearly (location, duration, severity)..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button
            className="analyze-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Case"}
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="loading-section">
            <div className="spinner"></div>
            <p>Running multimodal clinical assessment...</p>
          </div>
        )}

        {/* RESULT CARD */}
        {result && (
          <div className="card result-card">

            <div className="result-header">
              <h2>{result.prediction}</h2>
              <span
                className="urgency-badge"
                style={{ background: getUrgencyColor(result.urgency_color) }}
              >
                {result.urgency}
              </span>
            </div>

            {/* Risk Bar */}
            <div className="risk-container">
              <div
                className="risk-fill"
                style={{
                  width: `${riskPercentage}%`,
                  background: getUrgencyColor(result.urgency_color),
                }}
              />
            </div>

            <div className="metrics">
              <div>
                <span>Confidence</span>
                <strong>{(result.confidence * 100).toFixed(0)}%</strong>
              </div>
              <div>
                <span>Risk Score</span>
                <strong>{result.risk_score}</strong>
              </div>
              <div>
                <span>Redness Index</span>
                <strong>{result.image_redness_score.toFixed(1)}</strong>
              </div>
            </div>

            <h3>Clinical Reasoning</h3>
            <ul className="reasoning-list">
              {result.clinical_reasoning?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            {result.emergency_action && (
              <div className="emergency-alert">
                🚨 {result.emergency_action}
              </div>
            )}

            <button
              className="details-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide AI Explanation" : "View AI Explanation"}
            </button>

            {showDetails && (
              <div className="ai-box">
                <h4>AI Summary</h4>
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
    </div>
  );
}

export default App;
