require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffer
const upload = multer({ storage });

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', upload.array('images', 10), carRoutes);

// Root Route
app.get('/', (req, res) => res.send('Welcome to the Car Management API'));

// Start Server
const PORT = process.env.PORT || 6868;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));