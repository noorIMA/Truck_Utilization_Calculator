const express = require('express');
const router = express.Router();
const SKU = require('../models/SKU');

// Route to fetch all SKUs
router.get('/', async (req, res) => {
  try {
    const skus = await SKU.find();
    res.json(skus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new SKU
router.post('/', async (req, res) => {
  try {
    const { name, quantity, length, width, height, weight, stackable } = req.body;
    
    const newSKU = new SKU({
      name,
      quantity,
      dimensions: { length, width, height },
      weight,
      stackable
    });

    const savedSKU = await newSKU.save();
    res.status(201).json(savedSKU);
  } catch (error) {
    console.error('Error saving SKU:', error);
    res.status(500).json({ message: 'Error saving SKU' });
  }
});

module.exports = router;