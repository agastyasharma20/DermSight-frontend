import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return (
      <div style={{ padding: "40px" }}>
        <p>No results found.</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const getUrgencyColor = () => {
    switch (data.urgency_level) {
      case "Emergency":
        return "red";
      case "Urgent":
        return "orange";
      case "Self-care":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Analysis Result</h1>

      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <h2>{data.primary_condition}</h2>
        <p>Confidence: {data.confidence}</p>

        <p style={{ color: getUrgencyColor(), fontWeight: "bold" }}>
          Urgency: {data.urgency_level}
        </p>

        <p><strong>Reasoning:</strong> {data.reasoning}</p>

        <h3>Recommendations</h3>
        <ul>
          {data.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>

        <h3>Warning Signs</h3>
        <ul>
          {data.warning_signs.map((warn, index) => (
            <li key={index}>{warn}</li>
          ))}
        </ul>

        <p style={{ marginTop: "20px", fontStyle: "italic" }}>
          {data.disclaimer}
        </p>
      </div>

      <button style={{ marginTop: "20px" }} onClick={() => navigate("/")}>
        Analyze Another Case
      </button>
    </div>
  );
}

export default Results;
