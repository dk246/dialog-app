import React, { useState } from "react";
import "./App.css"; // For external styles (optional)

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputText, setInputText] = useState("");
  const [imageType, setImageType] = useState("");

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Image to Image Generator</h1>
      </header>

      <div className="upload-section">
        <div className="upload-box">
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded"
              className="uploaded-image"
            />
          ) : (
            <p>Upload a Photo</p>
          )}
          <input type="file" onChange={handleFileChange} />
        </div>
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter the Text"
          value={inputText}
          onChange={handleTextChange}
        />
      </div>

      <div className="options-section">
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
      </div>

      <div className="generate-section">
        <button className="generate-button" onClick={handleGenerate}>
          Generate
        </button>
      </div>
    </div>
  );
}

export default App;
