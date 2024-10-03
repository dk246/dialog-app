import React, { useState } from "react";

const Imagine = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reference for the hidden file input
  const fileInputRef = React.createRef();

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    const headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer vk-75N19Yfhn43VzbY091YpMIyGgsQmPSl8sgjkDp47ltEjf"
    );

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("style_id", "29"); // Set your style ID here
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

      // The API is returning binary image data, so we use `response.blob()` instead of `response.json()`
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error("Error:", err); // Log any network or fetch errors
      setError("Error generating image");
    } finally {
      setLoading(false);
    }
  };

  // Trigger the file input click event when the "Upload Image" button is clicked
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="App">
      <h1>Image Variation API Tester</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Prompt:</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            required
          />
        </div>
        <div>
          <label>Upload Image:</label>
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleImageChange}
            required
          />
          <button type="button" onClick={handleUploadClick}>
            Upload Image
          </button>
          {selectedImage && <p>Selected Image: {selectedImage.name}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Variation"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {generatedImage && (
        <div>
          <h2>Generated Image:</h2>
          <img src={generatedImage} alt="Generated" />
        </div>
      )}
    </div>
  );
};

export default Imagine;
