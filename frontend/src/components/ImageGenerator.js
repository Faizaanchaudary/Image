import React, { useState } from 'react';
import axios from 'axios';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-image', {
        prompt,
      });
      setImage(`data:image/png;base64,${response.data.image}`);
    } catch (error) {
      console.error('Error generating image', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Image Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={handleInputChange}
        placeholder="Enter prompt"
      />
      <button onClick={generateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {image && <img src={image} alt="Generated" />}
    </div>
  );
}

export default ImageGenerator;
