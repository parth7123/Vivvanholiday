import { Tour } from '../types';

const API_URL = import.meta.env.VITE_APP_API_URL + '/package';

export const getAllTours = async (): Promise<Tour[]> => {
  const response = await fetch(`${API_URL}/getallpackages`);
  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(tour => ({
    ...tour,
    id: tour._id // Map MongoDB _id to id
  }));
};

// Renamed to avoid duplicate declaration
export const fetchTourById = async (id: string): Promise<Tour | null> => {
  // This function will now use the updated getTourById
  return getTourById(id);
};

export const addTour = async (tourData: Omit<Tour, 'id'>): Promise<string> => {
  const response = await fetch(`${API_URL}/createpackage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tourData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add tour');
  }
  const data = await response.json();
  return data._id; // Return MongoDB _id
};

// ... existing code ...

export const getToursByType = async (type: 'domestic' | 'international'): Promise<Tour[]> => {
  const response = await fetch(`${API_URL}/getallpackages`);
  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter(tour => tour.type === type).map(tour => ({ ...tour, id: tour._id })).sort((a, b) => b.createdAt - a.createdAt);
};

// ... existing code ...

export const getFeaturedTours = async (): Promise<Tour[]> => {
  const response = await fetch(`${API_URL}/getallpackages`);
  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter(tour => tour.featured)
             .map(tour => ({ ...tour, id: tour._id })) // Add this line to map _id to id
             .sort((a, b) => b.createdAt - a.createdAt);
};

export const getTourById = async (id: string): Promise<Tour | null> => {
  const response = await fetch(`${API_URL}/getpackagebyid/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Tour not found
    }
    throw new Error(`Failed to fetch tour: ${response.statusText}`);
  }
  const data = await response.json();
  return { ...data, id: data._id }; // Map MongoDB _id to id
};

export const updateTour = async (id: string, tourData: Partial<Tour>): Promise<void> => {
  await fetch(`${API_URL}/updatepackage/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tourData),
  });
};

export const deleteTour = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/deletpackage/${id}`, {
    method: 'DELETE',
  });
};
