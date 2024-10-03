import React, { useState } from "react";
import axios from "axios";

const ImageGenerator = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate",
        {
          prompt: "beautiful girl",
        },
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Create a URL for the image blob
      const imageUrl = URL.createObjectURL(new Blob([response.data]));
      setImageSrc(imageUrl);
    } catch (err) {
      setError("Failed to generate image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateImage}>Generate Image</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {imageSrc && <img src={imageSrc} alt="Generated" />}
    </div>
  );
};

export default ImageGenerator;
