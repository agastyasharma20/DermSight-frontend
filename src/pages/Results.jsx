import React from "react";
import { useLocation } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const data = location.state?.result;

  if (!data) {
    return <div className="p-10 text-center">No result available.</div>;
  }

  const urgencyColorMap = {
    Emergency: "bg-red-600",
    Urgent: "bg-orange-500",
    Monitor: "bg-yellow-500",
    Routine: "bg-green-600",
  };

  const urgencyColor = urgencyColorMap[data.urgency] || "bg-gray-500";

  const riskPercentage = Math.min((data.risk_score / 6) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
        DermSight Analysis Report
      </h1>

      {/* Urgency Banner */}
      <div className={`${urgencyColor} text-white text-center py-4 rounded-lg text-xl font-semibold shadow-lg mb-6`}>
        {data.urgency === "Emergency" && "⚠ SEEK IMMEDIATE MEDICAL ATTENTION"}
        {data.urgency === "Urgent" && "🕒 See a doctor within 24 hours"}
        {data.urgency === "Monitor" && "📋 Monitor symptoms carefully"}
        {data.urgency === "Routine" && "✅ Low risk — routine care"}
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-3xl mx-auto">

        {/* Prediction */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {data.prediction}
        </h2>

        <p className="text-gray-600 mb-6">
          Confidence: {(data.confidence * 100).toFixed(0)}%
        </p>

        {/* Risk Score Meter */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Risk Score</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 rounded-full bg-blue-600 transition-all duration-700"
              style={{ width: `${riskPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Score: {data.risk_score} / 6
          </p>
        </div>

        {/* Clinical Reasoning */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">
            Clinical Indicators Detected
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {data.reasoning.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-gray-700">
          ⚕ This system provides preliminary triage assistance only.  
          It does not replace professional medical evaluation.
        </div>

      </div>
    </div>
  );
}
