const express = require('express');
const router = express.Router();
const  Truck  = require('../models/Trucks'); // ✅ Destructure to get the actual model

// Route to fetch all trucks
router.get('/', async (req, res) => {
  try {
    const trucks = await Truck.find(); // ✅ This now matches the import above
    res.json(trucks);
  } catch (error) {
    console.error('Error fetching trucks:', error); // ✅ Log full error
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
