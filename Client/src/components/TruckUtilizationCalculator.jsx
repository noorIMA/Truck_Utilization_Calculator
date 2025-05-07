import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Truck, PlusCircle, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';


const TruckUtilizationCalculator = () => {
  const [skus, setSkus] = useState([]);
  const [destination, setDestination] = useState('');
  const [truckType, setTruckType] = useState('');
  const [truckTypes, setTruckTypes] = useState([]);
  const [calculation, setCalculation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newSku, setNewSku] = useState({
    name: '',
    quantity: 1,
    length: '',
    width: '',
    height: '',
    weight: '',
    stackable: false
  });
  
  useEffect(() => {
    const fetchTruckTypes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/trucks');
        const data = await response.json();
        setTruckTypes(data);
      } catch (err) {
        console.error('Failed to fetch truck types:', err);
      }finally {
      setLoading(false);
    }
    };

    fetchTruckTypes();
  }, []);

  const saveSKUToDatabase = async (skuData) => {
    try {
      const response = await fetch('http://localhost:3000/api/skus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skuData),
      });

      if (!response.ok) {
        throw new Error('Failed to save SKU to database');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving SKU:', error);
      throw error;
    }
  };


  const handleAddSKU = async () => {
    if (!newSku.name || !newSku.length || !newSku.width || !newSku.height || !newSku.weight) {
      setError('Please fill in all required SKU fields');
      return;
    }

    setSkus([
      ...skus,
      {
        id: crypto.randomUUID(),
        name: newSku.name,
        quantity: Number(newSku.quantity) || 1,
        length: Number(newSku.length),
        width: Number(newSku.width),
        height: Number(newSku.height),
        weight: Number(newSku.weight),
        stackable: newSku.stackable,
      },
    ]);

    try {
      setLoading(true);
      // Save to database first
      // eslint-disable-next-line no-undef
      const savedSKU = await saveSKUToDatabase(skuData);
      
      // Then add to local state with the database ID
      setSkus([
        ...skus,
        {
          id: savedSKU._id || crypto.randomUUID(),
          // eslint-disable-next-line no-undef
          ...skuData
        },
      ]);

    // Reset the form
    setNewSku({
      name: '',
      quantity: 1,
      length: '',
      width: '',
      height: '',
      weight: '',
      stackable: false
    });
    setError(null);
  } catch (err) {
    setError('Failed to save SKU. Please try again.');
    console.error('Error adding SKU:', err);
  } finally {
    setLoading(false);
  }
  };

  const handleUpdateSKU = (id, updates) => {
    setSkus(skus.map((sku) => (sku.id === id ? { ...sku, ...updates } : sku)));
  };

  const handleDeleteSKU = (id) => {
    setSkus(skus.filter((sku) => sku.id !== id));
  };

  const handleNewSkuChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSku({
      ...newSku,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCalculate = async () => {
    if (!destination || !truckType || skus.length === 0) {
      setError('Please fill in all fields and add at least one SKU.');
      return;
    }
  
    for (const sku of skus) {
      if (
        !sku.name ||
        sku.quantity <= 0 ||
        sku.length <= 0 ||
        sku.width <= 0 ||
        sku.height <= 0 ||
        sku.weight <= 0
      ) {
        setError('Please fill in all SKU fields with valid values.');
        return;
      }
    }
  
    setError(null);
    setLoading(true);
  
    try {
      const selectedTruck = truckTypes.find((t) => t._id === truckType);
      if (!selectedTruck) {
        throw new Error('Selected truck type not found');
      }
  
      let totalVolume = 0;
      let totalWeight = 0;
      
      skus.forEach(sku => {
        const skuVolume = (sku.length / 100) * (sku.width / 100) * (sku.height / 100);
        totalVolume += skuVolume * sku.quantity * 10; 
        totalWeight += sku.weight * sku.quantity * 10; 
      });
  
      const volumeUtilization = (totalVolume / selectedTruck.maxVolume) * 100;
      const weightUtilization = (totalWeight / selectedTruck.maxWeight) * 100;
  
      const limitingFactor = volumeUtilization > weightUtilization ? 'volume' : 'weight';
  
      let trucksNeeded = 1;
      if (limitingFactor === 'volume') {
        trucksNeeded = Math.ceil(totalVolume / selectedTruck.maxVolume);
      } else {
        trucksNeeded = Math.ceil(totalWeight / selectedTruck.maxWeight);
      }
  
      const utilizationPerTruck = (limitingFactor === 'volume' 
        ? volumeUtilization / trucksNeeded 
        : weightUtilization / trucksNeeded) *10;

        const volumePerTruck =( totalVolume / trucksNeeded);
      const weightPerTruck = (totalWeight / trucksNeeded);
  
      const recResponse = await fetch('http://localhost:3000/api/calculate/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          skus: skus.map((sku) => ({
            skuName: sku.name,
            quantity: sku.quantity,
            length: sku.length / 100,
            width: sku.width / 100,
            height: sku.height / 100,
            weight: sku.weight,
            stackable: sku.stackable,
          })),
          truck: selectedTruck,
        }),
      });
  
      const recommendedSKUs = await recResponse.json();
  
      let utilizationStatus;
      if (utilizationPerTruck < 50) {
        utilizationStatus = 'severely-underutilized';
      } else if (utilizationPerTruck < 70) {
        utilizationStatus = 'underutilized';
      } else if (utilizationPerTruck >= 95) {
        utilizationStatus = 'fully-utilized';
      } else {
        utilizationStatus = 'adequately-utilized';
      }
  
      setCalculation({
        trucksNeeded,
        utilization: utilizationPerTruck,
        totalVolumeUsed: totalVolume ,
        totalWeightUsed: totalWeight ,
        volumeUtilization,
        weightUtilization,
        limitingFactor,
        volumePerTruck,
        weightPerTruck,
        recommendedSKUs: recommendedSKUs.map((sku) => ({
          id: crypto.randomUUID(),
          name: sku.skuName,
          quantity: 1,
          length: sku.length * 100,
          width: sku.width * 100,
          height: sku.height * 100,
          weight: sku.weight,
          stackable: sku.stackable,
        })),
        utilizationStatus
      });
    } catch (err) {
      setError(err.message || 'An error occurred during calculation.');
    } finally {
      setLoading(false);
    }
  };


  
  const getTruckVisualization = (utilization) => {
    const filledBlocks = Math.round((utilization / 100) * 10);
    const blocks = [];

    for (let i = 0; i < 10; i++) {
      blocks.push(
        <div
          key={i}
          className={cn(
            'w-full h-2 rounded',
            i < filledBlocks ? 'bg-blue-500' : 'bg-gray-200'
          )}
        />
      );
    }

    return <div className="w-full h-5 flex gap-1">{blocks}</div>;
  };

  // Update the calculateVolume function to handle unit conversion
const calculateVolume = (length, width, height) => {
  // Convert cm to m for each dimension before calculation
  return (length / 100) * (width / 100) * (height / 100);
};

const TruckSpaceVisualization = ({ truck, usedVolume, recommendedSkus }) => {
  const remainingVolume = truck.maxVolume - usedVolume;
  const truckVolume = truck.maxVolume;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Truck Capacity</span>
        <span className="text-sm text-gray-600">
          {usedVolume.toFixed(2)}m³ / {truckVolume.toFixed(2)}m³
        </span>
      </div>
      
      {/* Main truck visualization */}
      <div className="relative h-8 w-full bg-gray-200 rounded-md overflow-hidden">
        {/* Used space */}
        <div 
          className="absolute h-full bg-blue-500"
          style={{ width: `${(usedVolume / truckVolume) * 100}%` }}
        />
        
        {/* Recommended SKUs */}
        {recommendedSkus.map((sku, index) => {
          const skuVolume = (sku.length/100) * (sku.width/100) * (sku.height/100);
          const widthPercent = (skuVolume / remainingVolume) * 100;
          
          return (
            <div
              key={`rec-${index}`}
              className="absolute h-full bg-green-500 border-r border-green-700"
              style={{
                left: `${(usedVolume / truckVolume) * 100}%`,
                width: `${widthPercent}%`,
                zIndex: 10 + index,
              }}
              title={`${sku.name}: ${skuVolume.toFixed(2)}m³`}
            />
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-sm" />
          <span>Used Space</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm" />
          <span>Recommended SKUs</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-200 rounded-sm" />
          <span>Remaining Space</span>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
          <Truck className="w-6 h-6 md:w-8 md:h-8" />
          Truck Utilization Calculator
        </h1>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">SKU Input</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">SKU Name</label>
              <Input
                name="name"
                placeholder="SKU Name"
                value={newSku.name}
                onChange={handleNewSkuChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Qty</label>
              <Input
                name="quantity"
                type="number"
                min="1"
                value={newSku.quantity}
                onChange={handleNewSkuChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Length (cm)</label>
              <Input
                name="length"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={newSku.length}
                onChange={handleNewSkuChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Width (cm)</label>
              <Input
                name="width"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={newSku.width}
                onChange={handleNewSkuChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Height (cm)</label>
              <Input
                name="height"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={newSku.height}
                onChange={handleNewSkuChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
              <Input
                name="weight"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={newSku.weight}
                onChange={handleNewSkuChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="stackable"
                checked={newSku.stackable}
                onChange={handleNewSkuChange}
                className="h-4 w-4"
              />
              <label className="text-sm">Stackable</label>
              <Button
                onClick={handleAddSKU}
                className="ml-auto"
              >
                <PlusCircle className="mr-2 w-4 h-4" /> Add
              </Button>
            </div>
          </div>

          {/* Current SKUs Table */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-700 mb-2">Current SKUs:</h3>
            {skus.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Dimensions (L×W×H)</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Stackable</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skus.map((sku) => (
                      <TableRow key={sku.id}>
                        <TableCell>{sku.name}</TableCell>
                        <TableCell>{sku.quantity}</TableCell>
                        <TableCell>{sku.length}cm × {sku.width}cm × {sku.height}cm</TableCell>
                        <TableCell>{sku.weight} kg</TableCell>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={sku.stackable}
                            onChange={(e) => handleUpdateSKU(sku.id, { stackable: e.target.checked })}
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteSKU(sku.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500">No SKUs added yet. Add SKUs using the form above.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Destination</label>
              <Input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Truck Type</label>
              <Select onValueChange={setTruckType} value={truckType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Truck Type" />
                </SelectTrigger>
                <SelectContent>
                  {truckTypes.map((truck) => (
                    <SelectItem key={truck._id} value={truck._id}>
                      {truck.name} (Vol: {truck.maxVolume}m³, Wt: {truck.maxWeight}kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCalculate} disabled={loading} className="w-full">
            {loading ? 'Calculating...' : 'Calculate Truck Needs'} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {calculation && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-4"
  >
    <h2 className="text-xl font-semibold text-gray-700">Calculation Results</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-800">Truck Requirements</h3>
          <p className="text-lg">
            Trucks Needed: <span className="font-bold">{calculation.trucksNeeded}</span>
          </p>
          {calculation.trucksNeeded > 1 && (
            <p className="text-sm text-blue-600 mt-1">
              (Due to {calculation.limitingFactor} constraints)
            </p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-2">Utilization Per Truck</h4>
          <p>
            <span className="font-medium">Volume:</span> {calculation.volumePerTruck.toFixed(2)}m³ / {truckTypes.find(t => t._id === truckType)?.maxVolume.toFixed(2)}m³
            {' '}({calculation.volumeUtilization.toFixed(0)}%)
          </p>
          <p>
            <span className="font-medium">Weight:</span> {calculation.weightPerTruck.toFixed(2)}kg / {truckTypes.find(t => t._id === truckType)?.maxWeight.toFixed(2)}kg
            {' '}({calculation.weightUtilization.toFixed(0)}%)
          </p>
          <div className="mt-3">
            {getTruckVisualization(calculation.utilization)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-2">Total Load</h4>
          <p>
            <span className="font-medium">Total Volume:</span> {calculation.totalVolumeUsed.toFixed(2)}m³
          </p>
          <p>
            <span className="font-medium">Total Weight:</span> {calculation.totalWeightUsed.toFixed(2)}kg
          </p>
        </div>
              </div>
              <div className="space-y-4">
  <h3 className="font-medium text-gray-700 mb-2">Recommended SKUs:</h3>
  
  {calculation.recommendedSKUs.length > 0 ? (
    <>
      {/* Add the visualization above the table */}
      <TruckSpaceVisualization
        truck={truckTypes.find(t => t._id === truckType)}
        usedVolume={calculation.totalVolumeUsed}
        recommendedSkus={calculation.recommendedSKUs}
      />
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Add to Shipment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculation.recommendedSKUs.map((sku) => {
              const skuVolume = calculateVolume(sku.length, sku.width, sku.height);
              const volumePercentage = (skuVolume / calculation.totalVolumeUsed * 100).toFixed(1);
              
              return (
                <TableRow key={sku.id}>
                  <TableCell className="font-medium">{sku.name}</TableCell>
                  <TableCell>
                    {sku.length}cm × {sku.width}cm × {sku.height}cm
                    <br />
                    <span className="text-gray-500 text-sm">
                      ({sku.length/100}m × {sku.width/100}m × {sku.height/100}m)
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {skuVolume.toFixed(2)} m³
                      <div 
                        className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden"
                        title={`${volumePercentage}% of used space`}
                      >
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${Math.min(volumePercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{sku.weight} kg</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSkus([...skus, { ...sku, id: crypto.randomUUID() }])}
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  ) : (
    <p className="text-gray-500">No additional SKUs recommended for optimal utilization.</p>
  )}
</div>
            </div>
            {calculation.utilizationStatus === 'severely-underutilized' && (
      <Alert variant="warning" className="border-yellow-600 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle>Severely Underutilized Truck ({calculation.utilization.toFixed(0)}%)</AlertTitle>
        <AlertDescription>
          The truck is less than 50% utilized. Consider using a smaller truck or adding more items.
        </AlertDescription>
      </Alert>
    )}

    {calculation.utilizationStatus === 'underutilized' && (
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Underutilized Truck ({calculation.utilization.toFixed(0)}%)</AlertTitle>
        <AlertDescription>
          The truck is between 50-70% utilized. Consider optimizing your load.
        </AlertDescription>
      </Alert>
    )}

    {calculation.utilizationStatus === 'fully-utilized' && (
      <Alert variant="success">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Optimal Utilization ({calculation.utilization.toFixed(0)}%)</AlertTitle>
        <AlertDescription>
          The truck is fully utilized (95%+). Great job optimizing the load!
        </AlertDescription>
      </Alert>
    )}

    {calculation.utilizationStatus === 'adequately-utilized' && (
      <Alert variant="info">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Good Utilization ({calculation.utilization.toFixed(0)}%)</AlertTitle>
        <AlertDescription>
          The truck is between 70-95% utilized. This is a good load configuration.
        </AlertDescription>
      </Alert>
    )}
          </motion.div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default TruckUtilizationCalculator;