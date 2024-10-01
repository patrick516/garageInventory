import React, { useEffect, useState } from 'react';
import { Chart, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, LineElement, PointElement, RadarController, RadialLinearScale } from 'chart.js';
import { Pie, Bar, Line, Radar } from 'react-chartjs-2';
import './DashboardList.css';
import axios from 'axios'; // Import axios for fetching inventory data

// Register the required elements and controllers
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale
);

const AdminDashboard = () => {
  // State to hold totals
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState(0);

  // Fetch inventory data to calculate totals
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/inventory/list');
        const inventoryItems = response.data;

        // Calculate totals
        const costs = inventoryItems.reduce((acc, item) => {
          const costPricePerUnit = Number(item.costPricePerUnit) || 0;
          const quantity = Number(item.quantity) || 0;
          const anyCostIncurred = Number(item.anyCostIncurred) || 0;
          return acc + (costPricePerUnit * quantity + anyCostIncurred);
        }, 0);

        const sales = inventoryItems.reduce((acc, item) => {
          const salePricePerUnit = Number(item.salePricePerUnit) || 0;
          const quantity = Number(item.quantity) || 0;
          return acc + (salePricePerUnit * quantity);
        }, 0);

        const profit = sales - costs;

        // Set state values
        setTotalCosts(costs);
        setTotalSales(sales);
        setProfitOrLoss(profit);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventoryData();
  }, []);

  // Update the pie chart data with totals
  const pieData = {
    labels: ['Total Costs', 'Total Sales', 'Profit'],
    datasets: [
      {
        label: 'Financial Overview',
        data: [
          totalCosts,
          totalSales,
          profitOrLoss > 0 ? profitOrLoss : 0, // Only show profit if it's positive
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  // Mock data for other charts (replace with your actual data)
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Profit',
        data: [2, 3, 20, 5, 1],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const radarData = {
    labels: ['Sales', 'Costs', 'Profit', 'Inventory'],
    datasets: [
      {
        label: '2024',
        data: [20, 10, 15, 30],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for charts
  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-grid">
        <div className="grid-item">
          <h3>INVENTORY SUMMARY</h3>
          <div className="chart-container">
            <Pie data={pieData} options={options} />
          </div>
        </div>

        <div className="grid-item">
          <h3>Bar Chart</h3>
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
