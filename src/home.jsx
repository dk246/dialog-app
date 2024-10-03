import React, { useState } from "react";

const API_KEY =
  "c2ef0a380a7c0e699aeef83ce6e3e66e4e054445d0c43f1feb27bb15b60ba5600ef56853ecad13cb5ab9fc5b85412c80"; // Replace with your API key

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputText, setInputText] = useState("");
  const [imageType, setImageType] = useState("");
  const [sketch, setSketch] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleImageTypeChange = (type) => {
    setImageType(type);
  };

  const handleGenerate = () => {
    if (!selectedFile || !inputText || !imageType) {
      alert("Please upload a photo, enter text, and select an image type.");
      return;
    }
    // Logic for image generation
    console.log("Generating Image with:", {
      selectedFile,
      inputText,
      imageType,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sketch) {
      setError("Please upload a sketch.");
      return;
    }

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("sketch_file", sketch);
    formData.append("prompt", prompt);

    try {
      const response = await fetch(
        "https://clipdrop-api.co/sketch-to-image/v1/sketch-to-image",
        {
          method: "POST",
          headers: {
            "x-api-key": API_KEY,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const blob = new Blob([buffer], { type: "image/jpeg" });
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
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <header className="app-header">
          <h1>Image to Image Generator</h1>
        </header>

        <div className="upload-section">
          <div className="upload-box">
            {sketch ? (
              <img
                src={URL.createObjectURL(sketch)}
                alt="Uploaded"
                className="uploaded-image"
              />
            ) : (
              <p>Upload a Sketch</p>
            )}
            <label htmlFor="sketch">Sketch (PNG, JPEG, WebP):</label>
            <input
              id="sketch"
              type="file"
              accept=".png, .jpeg, .jpg, .webp"
              onChange={(e) => setSketch(e.target.files[0])}
              required
            />
          </div>
        </div>

        <div className="input-section">
          <label htmlFor="prompt">Prompt:</label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={5000}
            required
          />
        </div>

        {/* <div className="options-section">
        <button
          className={`option-button ${imageType === "Anime" ? "active" : ""}`}
          onClick={() => handleImageTypeChange("Anime")}
        >
          Anime
        </button>
        <button
          className={`option-button ${
            imageType === "Portrait" ? "active" : ""
          }`}
          onClick={() => handleImageTypeChange("Portrait")}
        >
          Portrait
        </button>
        <button
          className={`option-button ${
            imageType === "Realistic" ? "active" : ""
          }`}
          onClick={() => handleImageTypeChange("Realistic")}
        >
          Realistic
        </button>
        <button
          className={`option-button ${
            imageType === "Imagine VI" ? "active" : ""
          }`}
          onClick={() => handleImageTypeChange("Imagine VI")}
        >
          Imagine VI
        </button>
      </div> */}

        <div className="generate-section">
          <button type="submit" className="generate-button">
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
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

export default Home;
