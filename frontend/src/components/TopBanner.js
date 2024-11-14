// Author: Mario Rodriguez

import React from 'react';
import './css/TopBanner.css';

const TopBanner = () => {
  return (
    <div className="top-banner">
      <a href="https://docs.google.com/spreadsheets/d/14X_44OptxAmfQLgiw2VXzwA8g25uiGaRYZPvLg-ZIpQ/edit?usp=sharing" 
      target="_blank" rel="noopener noreferrer" className="banner-link">
        Download Excel Template
      </a>
      <a href="https://github.com/JavaD0j0/job-application-tracker" target="_blank" rel="noopener noreferrer" className="banner-link">
        GitHub Repository
      </a>
      {/* Add more links as needed */}
    </div>
  );
};

export default TopBanner;
