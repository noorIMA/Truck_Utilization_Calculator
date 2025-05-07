// models/SKU.js
const mongoose = require('mongoose');

const SKUSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  weight: { type: Number, required: true },
  stackable: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SKU', SKUSchema);


// Example usage
// const skuExamples = [
//   {
//     name: "Small boxes",
//     dimensions: { length: 30, width: 20, height: 15 },
//     weight: 2.5,
//     stackable: true
//   },
//   {
//     name: "Fabric bales",
//     dimensions: { length: 80, width: 60, height: 40 },
//     weight: 15,
//     stackable: false
//   },
//   {
//     name: "Electrical materials",
//     dimensions: { length: 40, width: 30, height: 20 },
//     weight: 8,
//     stackable: true
//   }
// ];