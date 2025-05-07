// src/lib/api.js

export const fetchTruckTypes = async () => {
  const response = await fetch('/api/trucks');
  if (!response.ok) {
    throw new Error('Failed to fetch truck types');
  }
  return response.json();
};

export const calculateTruckNeeds = async (data) => {
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate truck needs');
  }

  return response.json();
};

export const getRecommendedSKUs = async (data) => {
  const response = await fetch('/api/calculate/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recommended SKUs');
  }

  return response.json();
};
