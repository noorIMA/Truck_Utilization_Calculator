const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const skuRoutes = require('./routes/skuRoutes');
const truckRoutes = require('./routes/truckRoutes');
const calculationRoutes = require('./routes/calculationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection - CORRECT (no deprecated options)
mongoose.connect('mongodb+srv://noorakraa8:A0Hzrf1rtgxpmv6I@truckutilizationcalcula.o2za3o2.mongodb.net/?retryWrites=true&w=majority&appName=TruckUtilizationCalculator')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/skus', skuRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/calculate', calculationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));