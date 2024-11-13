// Author: Mario Rodriguez

import React from 'react';
import './css/Results.css';

const Results = ({ data }) => {
  return (
    <div className="results-container">
      <h2 className="results-title">Analysis Results</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Insight</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Applications</td>
            <td>{data.totalApplications}</td>
          </tr>
          <tr>
            <td>Pending Status</td>
            <td>{data.pendingApplications}</td>
          </tr>
          <tr>
            <td>Rejected Status</td>
            <td>{data.rejectedApplications}</td>
          </tr>
          <tr>
            <td>Remote Positions</td>
            <td>{data.remoteApplications}</td>
          </tr>
          <tr>
            <td>Onsite Positions</td>
            <td>{data.onsiteApplications}</td>
          </tr>
        </tbody>
      </table>
      {/* <a href={`http://localhost:5000/download/${data.filename}`} download className="download-link">
        Download Detailed Report
      </a> */}
    </div>
  );
};

export default Results;