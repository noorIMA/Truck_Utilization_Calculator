const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  destination: String,
  skus: [{
    skuName: String,
    quantity: Number
  }],
  truck: {
    name: String,
    maxVolume: Number,
    maxWeight: Number
  },
  totalVolumeUsed: Number,
  totalWeightUsed: Number,
  utilization: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Calculation', calculationSchema);
// Example usage with destination needs
// const exampleCalculation = new mongoose.model('Calculation', calculationSchema)({
//   destination: "Jeddah",
//   skus: [
//     { skuName: "Small boxes", quantity: 400 },
//     { skuName: "Fabric bales", quantity: 600 }
//   ],
//   truck: {
//     name: "Medium Box Truck",
//     maxVolume: 30,
//     maxWeight: 5000
//   },
//   totalVolumeUsed: 20, // Example value
//   totalWeightUsed: 4500, // Example value
//   utilization: 0.75 // Example value (75%)
// });

// Export the Calculation model
