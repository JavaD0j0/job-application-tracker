// Author: Mario Rodriguez

import React, { useState } from 'react';
import axios from 'axios';
import Results from './Results';
import './css/UploadForm.css';

const UploadForm = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleAuthenticate = (e) => {
    try {
      // Need to set an env variable to detect if its local or production
      const baseURL = process.env.NODE_ENV === 'production'
      ? 'https://job-application-tracker-3mct.onrender.com'
      : 'http://localhost:8000';

      console.log("Base URL:", baseURL);
      window.location.href = `${baseURL}/authenticate`;
    } catch (err) {
      console.error(err.response ? err.response.data : err.message); // Logging the error
      setError('Error authenticating with Google. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Need to set an env variable to detect if its local or production
      const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://job-application-tracker-3mct.onrender.com'
        : 'http://localhost:8000';

      console.log("Base URL:", baseURL);
      const response = await axios.post(`${baseURL}/analyze-sheet`);
      
      setAnalysis(response.data);
      setSuccess('Analysis completed successfully!');
      setLoading(false);
      
    } catch (err) {
      console.error(err.response ? err.response.data : err.message); // Logging the error
      setError('Error analyzing the linked Google Sheet. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className='upload-form-container'>
      <h1>Job Application Analysis Tool</h1>

      <p className="instructions">
        Ensure you have authenticated with Google and linked the correct Google
        Sheet before running the analysis.
      </p>

      <div className="button-group">
        {/* Button for Google Authentication */}
        <button onClick={handleAuthenticate} className='auth-button'>
          Authenticate with Google
        </button>

        {/* Button for Analyzing the Linked Google Sheet */}
        <button onClick={handleSubmit} className='upload-button'>
          Analyze Linked Google Sheet
        </button>
      </div>

      {loading && <p>Processing your Google Sheet...</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {analysis && <Results data={analysis} />}
    </div>
  );
};

export default UploadForm;