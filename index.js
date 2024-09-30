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
// app.use(cors());
const corsOptions = {
  origin: [
    "http://localhost:3003", // Local development URL
    "https://template-api-peach.vercel.app", // Your live API URL
    // "https://etimeflow-project-y194.vercel.app" // Your frontend URL
  ],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  exposedHeaders: ["X-Auth-Token"], // Expose custom headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  preflightContinue: false,
  optionsSuccessStatus: 204, // For older browsers
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', templateRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
