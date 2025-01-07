// Author: Mario Rodriguez

import React from 'react';
import { Bar } from 'react-chartjs-2';
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
  // Prepare data for chart
  const monthOrder = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];
  
  const sortedMonths = Object.keys(data.applicationsByMonth).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
  
    if (yearA === yearB) {
      return monthA - monthB;
    } else {
      return yearA - yearB;
    }
  });
  
  const applicationsByMonthData = {
    labels: sortedMonths.map(date => {
      const [year, month] = date.split('-');
      return `${monthOrder[parseInt(month, 10) - 1]} ${year}`;
    }),
    datasets: [
      {
        label: 'Applications by Month',
        data: sortedMonths.map(month => data.applicationsByMonth[month]),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
          color: '#e0e0e0',
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 10,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, '#4CAF50');
          gradient.addColorStop(1, '#1E90FF');
          return gradient;
        },
      },
    },
  };

  const tableData = [
    { label: 'Total Applications', value: data.totalApplications },
    { label: 'Pending Status', value: data.pendingApplications },
    { label: 'No Longer Available Status', value: data.notAvailableApplications },
    { label: 'Rejected Status', value: data.rejectedApplications },
    { label: 'Remote Positions', value: data.remoteApplications },
    { label: 'Onsite Positions', value: data.onsiteApplications },
  ];

  const roleTitleTableData = Object.keys(data.applicationsByRoleTitle)
    .sort((a, b) => data.applicationsByRoleTitle[b] - data.applicationsByRoleTitle[a])
    .slice(0, 10)
    .map((roleTitle, index) => (
      <tr key={index}>
        <td>{roleTitle}</td>
        <td>{data.applicationsByRoleTitle[roleTitle]}</td>
      </tr>
  ));

  return (
    <div className="results-container">
      <div className='table-container'>
        <div>
          <table className="results-table" style={{
              '--header-bg-color': headerBgColor,
              '--header-text-color': headerTextColor,
              '--row-bg-color': rowBgColor,
              '--row-text-color': rowTextColor
            }}
          >
            <thead>
              <tr>
                <th>Insight</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bar-container">
          <h3>Applications by Month</h3>
          <Bar data={applicationsByMonthData} options={barChartOptions} />
        </div>
      </div>

      <h2 className="results-title">Applications by Role Title (Top 10)</h2>
      <table className="results-table" style= {{
          '--header-bg-color': headerBgColor,
          '--header-text-color': headerTextColor,
          '--row-bg-color': rowBgColor,
          '--row-text-color': rowTextColor
        }}
      >
        <thead>
          <tr>
            <th>Role Title</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {roleTitleTableData}
        </tbody>
      </table>
    </div>
  );
};

export default Results;