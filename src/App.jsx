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

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image || symptoms.trim().length < 5) {
      alert("Please upload an image and describe symptoms properly.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeCase(symptoms, image);
      setResult(data);
    } catch (error) {
      alert("Error analyzing case.");
    }

    setLoading(false);
  };

  const getUrgencyColor = (color) => {
    switch (color) {
      case "RED":
        return "#e53935";
      case "ORANGE":
        return "#fb8c00";
      case "YELLOW":
        return "#fdd835";
      case "GREEN":
        return "#43a047";
      default:
        return "#90a4ae";
    }
  };

  const riskPercentage = result ? result.risk_score * 15 : 0;

  return (
    <div className="container">
      <h1 className="logo">🩺 DermSight</h1>
      <p className="subtitle">
        AI-Powered Multimodal Clinical Triage System
      </p>

      {/* Input Section */}
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
          {loading ? "🔍 Analyzing..." : "🚀 Analyze Case"}
        </button>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Running multimodal clinical assessment...</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="result-card">
          <h2>{result.prediction}</h2>

          <div
            className="urgency-badge"
            style={{ backgroundColor: getUrgencyColor(result.urgency_color) }}
          >
            {result.urgency}
          </div>

          {/* Risk Bar */}
          <div className="risk-bar">
            <div
              className="risk-fill"
              style={{
                width: `${riskPercentage}%`,
                backgroundColor: getUrgencyColor(result.urgency_color),
              }}
            ></div>
          </div>

          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(0)}%</p>
          <p><strong>Risk Score:</strong> {result.risk_score}</p>

          <h3>Clinical Reasoning</h3>
          <ul>
            {result.clinical_reasoning?.map((item, index) => (
              <li key={index}>✓ {item}</li>
            ))}
          </ul>

          {result.emergency_action && (
            <div className="emergency-box">
              🚨 {result.emergency_action}
            </div>
          )}

          <button
            className="details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide AI Details" : "View AI Explanation"}
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
