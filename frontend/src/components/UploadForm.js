// Author: Mario Rodriguez

import React, { useState } from 'react';
import axios from 'axios';
import Results from './Results';
import './css/UploadForm.css';

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
      // Need to set an env variable to detect if its local or production
      const response = await axios.post('https://job-application-tracker-3mct.onrender.com/upload', formData, {
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
    <div className='upload-form-container'>
      <h1>Job Application Analysis Tool</h1>
      <form onSubmit={handleSubmit} className='upload-form'>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className='upload-input'/>
        <button type="submit" className='upload-button'>Upload and Analyze</button>
      </form>

      {loading && <p>Processing your file...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {analysis && <Results data={analysis} />}
    </div>
  );
};

export default UploadForm;