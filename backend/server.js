const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const seedAdmin = require('./utils/adminSeed');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  seedAdmin();
});

// Route files
const auth = require('./routes/authRoutes');
const materials = require('./routes/materialRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/materials', materials);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
