const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const templateRoutes = require('./routes/templateRoutes');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3003; // Use the PORT from .env or default to 3003

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', templateRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
