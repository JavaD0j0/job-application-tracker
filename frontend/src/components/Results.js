// Author: Mario Rodriguez

import React from 'react';

const Results = ({ data }) => {
  return (
    <div>
      <h2>Analysis Results</h2>
      <p>Total Applications: {data.totalApplications}</p>
      <p>Remote Applications: {data.remoteApplications}</p>
      <p>Onsite Applications: {data.onsiteApplications}</p>
      <p>Pending Applications: {data.pendingApplications}</p>
      <p>Rejected Applications: {data.rejectedApplications}</p>
      
      <a href={`http://localhost:8000/download/${data.filename}`} download>
        Download Detailed Report
      </a>
    </div>
  );
};

export default Results;