import React, { useState, useRef } from "react";

const IMAGINE_API_KEY =
  "Bearer vk-XHkd3LpzULkFVDRZeEKhqsFyWx6MOIG2yvKqdvDxuNl7HZ";

const styleOptions = {
  21: "Anime",
  26: "Portrait",
  29: "Realistic", // Default
  27: "Imagine V1",
  28: "Imagine V3",
  30: "Imagine V4",
  31: "Imagine V4 (Creative)",
  32: "Imagine V4.1",
};

const Imagine = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviewImage, setReviewImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(29); // Default style ID is 29

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setReviewImage(URL.createObjectURL(file));
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    const headers = new Headers();
    headers.append("Authorization", IMAGINE_API_KEY);

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("style_id", selectedStyle); // Use selected style ID
    formData.append("image", selectedImage);

    try {
      const response = await fetch(
        "https://api.vyro.ai/v1/imagine/api/generations/variations",
        {
          method: "POST",
          headers: headers,
          body: formData,
        }
      );

      if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setGeneratedImage(imageUrl);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (err) {
      setError("Error generating image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Image Variation API Tester</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="input-section">
          <label>Prompt:</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            required
          />
        </div>
        <div className="input-section">
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleImageChange}
            required
          />
          <button
            type="button"
            className="Upload-Btn"
            onClick={handleUploadClick}
          >
            Upload Image
          </button>
          {reviewImage && (
            <div>
              <h2>Review Image:</h2>
              <img
                src={reviewImage}
                alt="Review"
                style={{
                  marginTop: "20px",
                  maxWidth: "100%",
                  maxHeight: "400px",
                }}
              />
            </div>
          )}
        </div>
        <div className="style-selection">
          <h2>Select Style:</h2>
          {Object.keys(styleOptions).map((styleId) => (
            <button
              key={styleId}
              type="button"
              onClick={() => setSelectedStyle(Number(styleId))}
              style={{
                backgroundColor:
                  selectedStyle === Number(styleId) ? "#ddd" : "#fff",
                marginRight: "5px",
              }}
            >
              {styleOptions[styleId]}
            </button>
          ))}
        </div>
        <div className="generate-section">
          <button type="submit" className="generate-button" disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {generatedImage && (
        <div>
          <h2>Generated Image:</h2>
          <img
            src={generatedImage}
            alt="Generated"
            style={{ marginTop: "20px", maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default Imagine;
