import React, { useEffect, useState } from 'react';
import { Chart, BarElement, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, LineElement, PointElement, RadarController, RadialLinearScale } from 'chart.js';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
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
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState(0);
  const [inventoryData, setInventoryData] = useState([]);

  // Fetch inventory data to calculate totals and inventory metrics
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

        setTotalCosts(costs);
        setTotalSales(sales);
        setProfitOrLoss(profit);

        // Set inventory data for bar charts
        setInventoryData(inventoryItems);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventoryData();
  }, []);

  // Prepare the data for stacked bar chart (Total and Remaining Quantity)
  const barData = {
    labels: inventoryData.map(item => item.name), // Item names as labels
    datasets: [
      {
        label: 'Total Quantity',
        data: inventoryData.map(item => Number(item.quantity) || 0), // Total quantity (purchased)
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Parent bar color
        stack: 'Stack 0',
      },
      {
        label: 'Remaining Quantity',
        data: inventoryData.map(item => {
          const quantity = Number(item.quantity) || 0;
          const sales = Number(item.sales) || 0;
          const remaining = Math.max(0, quantity - sales); // Ensure no negative values
          return remaining;
        }),
        backgroundColor: 'rgba(255, 159, 64, 0.6)', // Child bar color (remaining quantity)
        stack: 'Stack 0',
      },
    ],
  };

  // Prepare data for pie chart (Costs, Sales, Profit)
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

  // Line chart data (for future profitability trends)
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'], // Placeholder for now
    datasets: [
      {
        label: 'Profit',
        data: [2, 3, 20, 5, 1], // Placeholder for now
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  // Radar chart data (comparison between metrics)
  const radarData = {
    labels: ['Sales', 'Costs', 'Profit', 'Inventory'],
    datasets: [
      {
        label: '2024',
        data: [20, 10, 15, 30], // Placeholder for now
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Show legend for Total and Remaining quantity
      },
      title: {
        display: true,
        text: 'Inventory Total vs Remaining Quantity', // Title for the chart
      },
    },
    scales: {
      x: {
        stacked: true, // Enable stacking on the x-axis (vertical bars)
        title: {
          display: true,
          text: 'Inventory Items', // Label for x-axis
        },
      },
      y: {
        stacked: true, // Enable stacking on the y-axis
        title: {
          display: true,
          text: 'Quantity', // Label for y-axis
        },
      },
    },
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-grid">
        <div className="grid-item">
          <h3>INVENTORY RECORDS SUMMARY</h3>
          <div className="chart-container">
            <Pie data={pieData} options={options} />
          </div>
        </div>

        <div className="grid-item">
          <h3>Inventory Total vs Remaining Quantity</h3>
          <div className="chart-container">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="grid-item">
          <h3>Profit Trends (Line Chart)</h3>
          <div className="chart-container">
            <Line data={lineData} options={options} />
          </div>
        </div>

        <div className="grid-item">
          <h3>Metrics Overview (Radar Chart)</h3>
          <div className="chart-container">
            <Radar data={radarData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
