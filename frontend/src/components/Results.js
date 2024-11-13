// Author: Mario Rodriguez

import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './css/Results.css';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Results = ({
  data,
  headerBgColor = '#333',
  headerTextColor = '#f1f1f1',
  rowBgColor = '#f5f5f5',
  rowTextColor = '#333',
}) => {
  // Prepare data for charts
  const barChartData = {
    labels: ['Total', 'Pending', 'Rejected', 'Remote', 'Onsite'],
    datasets: [
      {
        label: 'Applications Counts',
        data: [
          data.totalApplications,
          data.pendingApplications,
          data.rejectedApplications,
          data.remoteApplications,
          data.onsiteApplications
        ],
        backgroundColor: [
          '#4CAF50', // Green for Total
          '#FF8C00', // Orange for Pending
          '#DC143C', // Red for Rejected
          '#1E90FF', // Blue for Remote
          '#FFD700', // Yellow for Onsite
        ],
      },
    ],
  };

  const pieChartData = {
    labels: ['Remote', 'Onsite'],
    datasets: [
      {
        label: 'Application Types',
        data: [data.remoteApplications, data.onsiteApplications],
        backgroundColor: ['#1E90FF', '#FFD700'],
      },
    ],
  };

  return (
    <div className="results-container">
      <h2 className="results-title">Analysis Results</h2>

      {/* Display Table */}
      <table 
        className="results-table"
        style={{
          '--header-bg-color': headerBgColor,
          '--header-text-color': headerTextColor,
          '--row-bg-color': rowBgColor,
          '--row-text-color': rowTextColor
        }}
      >
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

      {/* Display Bar Chart */}
      <div className="chart-container">
        <h3>Application Distribution</h3>
        <Bar data={barChartData} options={{ responsive: true }} />
      </div>

      {/* Display Pie Chart */}
      <div className="chart-container">
        <h3>Remote vs. Onsite Applications</h3>
        <Pie data={pieChartData} options={{ responsive: true }} />
      </div>

      {/* <a href={`http://localhost:5000/download/${data.filename}`} download className="download-link">
        Download Detailed Report
      </a> */}
    </div>
  );
};

export default Results;