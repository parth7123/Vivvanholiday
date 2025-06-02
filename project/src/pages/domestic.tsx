import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import TourCard from '../components/tours/TourCard';
import { Tour } from '../types';
import { getToursByType } from '../services/tourService';
import { Toaster } from 'react-hot-toast';

const DomesticTours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const fetchedTours = await getToursByType('domestic');
        setTours(fetchedTours);
        setFilteredTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = tours.filter(tour => 
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.places.some(place => place.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTours(filtered);
    } else {
      setFilteredTours(tours);
    }
  }, [searchTerm, tours]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <MapPin size={24} className="mr-2" />
            <h1 className="text-3xl md:text-4xl font-bold">Domestic Tours</h1>
          </div>
          <p className="max-w-2xl mx-auto">
            Explore the diverse beauty and rich culture of India with our curated domestic tour packages.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>
          
          <div className="flex items-center">
            
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No tours found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredTours.map((tour) => (
              <motion.div key={tour.id} variants={item}>
                <TourCard tour={tour} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DomesticTours;