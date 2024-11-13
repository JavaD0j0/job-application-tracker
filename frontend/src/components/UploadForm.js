// Author: Mario Rodriguez

import React, { useState } from 'react';
import axios from 'axios';
import Results from './Results';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select an Excel file to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message); // Logging the error
      setError('Error uploading file. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Job Application Analysis Tool</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit">Upload and Analyze</button>
      </form>

      {loading && <p>Processing your file...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {analysis && <Results data={analysis} />}
    </div>
  );
};

export default UploadForm;