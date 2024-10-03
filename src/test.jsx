import React, { useState } from "react";

const API_KEY =
  "c2ef0a380a7c0e699aeef83ce6e3e66e4e054445d0c43f1feb27bb15b60ba5600ef56853ecad13cb5ab9fc5b85412c80"; // Replace with your API key

const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("prompt", prompt);

    try {
      const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
        },
        body: formData,
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const blob = new Blob([buffer], { type: "image/png" });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        setImageSrc(null);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setImageSrc(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="prompt">Prompt:</label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
        <button type="submit">Generate Image</button>
      </form>

      {error && <p>Error: {error}</p>}
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Generated"
          style={{ marginTop: "20px", maxWidth: "100%" }}
        />
      )}
    </div>
  );
};

export default TextToImage;
