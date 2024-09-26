// AdminDashboard.js
import React from 'react';
import { Chart, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, LineElement, PointElement, RadarController, RadialLinearScale } from 'chart.js';
import { Pie, Bar, Line, Radar } from 'react-chartjs-2';
import './DashboardList.css';

// Register the required elements and controllers
Chart.register(
  ArcElement, // For Pie chart
  Tooltip,
  Legend,
  Title,
  BarElement, // For Bar chart
  CategoryScale, // For X-axis of Bar chart
  LinearScale, // For Y-axis of Bar chart
  LineElement, // For Line chart
  PointElement, // For points in Line and Scatter charts
  RadarController, // For Radar chart
  RadialLinearScale // For Radar chart scales
);

const AdminDashboard = () => {
  const pieData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Pie Chart Dataset',
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Bar Chart Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Line Chart Dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const radarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding'],
    datasets: [
      {
        label: 'Radar Chart Dataset',
        data: [65, 59, 90, 81, 56],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="admin-dashboard">

      <div className="dashboard-grid">
        <div className="grid-item">
          <h3>Pie Chart</h3>
          <div className="chart-container">
            <Pie data={pieData} options={options} />
          </div>
        </div>
        <div className="grid-item">
          <h3>Bar Graph</h3>
          <div className="chart-container">
            <Bar data={barData} options={options} />
          </div>
        </div>
        <div className="grid-item">
          <h3>Line Chart</h3>
          <div className="chart-container">
            <Line data={lineData} options={options} />
          </div>
        </div>
        <div className="grid-item">
          <h3>Radar Chart</h3>
          <div className="chart-container">
            <Radar data={radarData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
