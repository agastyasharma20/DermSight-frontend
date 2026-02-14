import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [image, setImage] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !symptoms) {
      alert("Please upload image and enter symptoms.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("symptoms_text", symptoms);

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/analyze/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/results", { state: response.data });

    } catch (error) {
      alert("Error analyzing case.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>DermSight AI Triage</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <textarea
            rows="4"
            placeholder="Describe symptoms..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            style={{ width: "300px" }}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Home;
