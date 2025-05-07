const express = require('express');
const router = express.Router();
const Calculation = require('../models/Calculation');
const { calculateUtilization, recommendSKUs } = require('../utils/helpers');

// Route to create a new calculation
router.post('/', async (req, res) => {
  const { destination, skus, truck } = req.body; // Include destination

  // Calculate utilization
  const { totalVolumeUsed, totalWeightUsed, utilization } = calculateUtilization(skus, truck);

  // Create a new calculation entry
  try {
    const result = await Calculation.create({
      destination, // Add destination to the calculation
      skus,
      truck,
      totalVolumeUsed,
      totalWeightUsed,
      utilization
    });

    res.status(201).json(result); // Return created calculation
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle errors
  }
});

// Route to recommend SKUs
router.post('/recommend', (req, res) => {
  const { skus, truck } = req.body;
  const recommendations = recommendSKUs(skus, truck);
  res.json(recommendations);
});

module.exports = router;