const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoute');
const inventoryRoutes = require('./routes/inventoryRoute');
const customerRoutes = require('./routes/customerRoute');
const employeeRoutes = require('./routes/employeeRoute');
const salaryRoutes = require('./routes/salaryRoute'); // Import salary routes 
const sendReminderEmails = require('./services/reminderScheduler'); // Import the scheduler
require('dotenv').config(); // Load environment variables
const db = require('./config/tests'); // Import db from index.js (models)

const WebSocket = require('ws'); // Import the WebSocket library

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
}));

app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logger

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes); 
app.use('/api/salaries', salaryRoutes); // Use salary routes

// WebSocket setup
const wss = new WebSocket.Server({ port: 3002 }); // Create a WebSocket server on port 8080

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Listen for messages from the client
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Handle the barcode message or any other functionality here

    // Send a response back to the client (optional)
    ws.send(`Beep! Barcode scanned: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:3002'); // Log the WebSocket server URL

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server only after successful database synchronization
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return db.sequelize.sync({ alter: true, force: false }); // Synchronize models with the database
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
    sendReminderEmails(); // Start the scheduler
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
