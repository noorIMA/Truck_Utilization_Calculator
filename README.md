# Truck_Utilization_Calculator
## Project Overview
This application helps optimize truck space utilization by calculating the number of trucks needed for a shipment based on the truck's dimensions, weight, and specifications. It also provides recommendations for additional storage units that can be added to maximize the truck's utilization.

## Setup Instructions

### Backend Setup
1. Navigate to the backend folder
2. Install the dependencies:
```bash
npm install
```
3. Set up environment variables (create a `.env` file):
```
MONGODB_URI=mongodb+srv://noorakraa8:A0Hzrf1rtgxpmv6I@truckutilizationcalcula.o2za3o2.mongodb.net/?retryWrites=true&w=majority&appName=TruckUtilizationCalculator
PORT=3000
```
4. Start the server:
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend folder
2. Install the dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Solution Assumptions

1. **Unit Consistency**:
- All dimensions are converted to meters for calculations.
- Weight is calculated consistently in kilograms.

 2. **Truck Specifications**:
- Each truck type has a fixed maximum size and weight.
- No partial truck loads - Always rounds up to full trucks.

  ## Visual Design Description

The interface features a sleek, modern design, with:

1. **Input Section**:
- Clearly labeled form fields.
- Responsive grid design that adapts to screen size.
- Validation and error handling.

2. **Storage Units Table**:
- Tabular view of current storage units.
- Interactive elements for editing and deleting.
- Visual indicators for stackable items.

3. **Results Display**:
- Animated calculation entry. Results
- Visual truck capacity meter
- Color-coded usage indicators
- Interactive recommendations section

4. **Visual Hierarchy**:
- Highlighting important information
- Consistent spacing and typography
- Mobile-responsive design

-The color scheme uses blue as the primary color for important actions and information, green for positive recommendations, and red for errors/warnings. The design prioritizes clarity and ease of use for logistics professionals.
