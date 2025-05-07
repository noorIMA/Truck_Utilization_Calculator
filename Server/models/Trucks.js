// models/Truck.js
const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  name: String,
  maxVolume: Number,
  maxWeight: Number
});

module.exports = mongoose.model('Truck', truckSchema); // ✅ Default export
