function calculateUtilization(skus, truck) {
  let totalVolume = 0, 
      totalWeight = 0;

  skus.forEach(sku => {
    // Convert cm to m for each dimension before calculation
    const skuVolume = 
      (sku.length / 100) *  // Convert cm to m
      (sku.width / 100) *   // Convert cm to m
      (sku.height / 100);   // Convert cm to m
    
    // Volume is per unit, multiplied by quantity
    totalVolume += skuVolume * sku.quantity;
    
    // Weight is per unit, multiplied by quantity
    totalWeight += sku.weight * sku.quantity;
  });

  // Calculate utilizations (0-100%)
  const volumeUtil = (totalVolume / truck.maxVolume) * 100;
  const weightUtil = (totalWeight / truck.maxWeight) * 100;

  // Return both utilizations and decide based on which constraint is hit first
  return {
    totalVolumeUsed: totalVolume,
    totalWeightUsed: totalWeight,
    volumeUtilization: volumeUtil,
    weightUtilization: weightUtil,
    limitingFactor: volumeUtil > weightUtil ? 'weight' : 'volume',
    overallUtilization: Math.min(volumeUtil, weightUtil)
  };
}

function recommendSKUs(remainingSpace, currentSkus, truck) {
  // Calculate remaining capacity
  const remainingVolume = truck.maxVolume - remainingSpace.totalVolumeUsed;
  const remainingWeight = truck.maxWeight - remainingSpace.totalWeightUsed;

  return currentSkus
    .map(sku => {
      // Convert to meters and calculate per-unit volume
      const unitVolume = 
        (sku.length / 100) * 
        (sku.width / 100) * 
        (sku.height / 100);
      
      return {
        ...sku,
        unitVolume,
        maxPossible: Math.min(
          Math.floor(remainingVolume / unitVolume),
          Math.floor(remainingWeight / sku.weight)
        )
      };
    })
    .filter(sku => 
      sku.unitVolume <= remainingVolume && 
      sku.weight <= remainingWeight &&
      sku.maxPossible > 0
    )
    .sort((a, b) => b.unitVolume - a.unitVolume); // Prioritize larger SKUs
}

module.exports = { calculateUtilization, recommendSKUs };