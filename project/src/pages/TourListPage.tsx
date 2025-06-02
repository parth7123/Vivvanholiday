import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Globe2 } from 'lucide-react';
import TourCard from '../components/tours/TourCard';
import { Tour } from '../types';
import { getToursByType, getAllTours } from '../services/tourService';
import { Toaster } from 'react-hot-toast';

const TourListPage: React.FC = () => {
  const { type } = useParams<{ type?: string }>();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const tourType = type === 'international' ? 'international' : 'domestic';
  const title = tourType === 'domestic' ? 'Domestic Tours' : 'International Tours';
  const icon = tourType === 'domestic' ? <MapPin size={24} className="mr-2" /> : <Globe2 size={24} className="mr-2" />;

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        let fetchedTours;
        if (type) {
          fetchedTours = await getToursByType(tourType);
        } else {
          fetchedTours = await getAllTours();
        }
        setTours(fetchedTours);
        setFilteredTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
        // IMPORTANT: Do NOT set dummy data here. If the API fails, tours should be empty.
        setTours([]);
        setFilteredTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [type, tourType]);

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

  // REMOVE THE ENTIRE getDummyTours FUNCTION
  // In case Firebase is not set up, use these fallback tours
  // const getDummyTours = (): Tour[] => {
  //   if (tourType === 'domestic') {
  //     return [
  //       {
  //         id: '1',
  //         title: 'Majestic Rajasthan Heritage Tour',
  //         description: 'Explore the royal heritage of Rajasthan with this comprehensive tour package.',
  //         imageUrl: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1600',
  //         duration: '7 Days / 6 Nights',
  //         places: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
  //         type: 'domestic',
  //         createdAt: Date.now()
  //       },
  //       {
  //         id: '2',
  //         title: 'Enchanting Kerala Backwaters',
  //         description: 'Experience the serene backwaters and lush landscapes of God\'s own country.',
  //         imageUrl: 'https://images.pexels.com/photos/695779/pexels-photo-695779.jpeg?auto=compress&cs=tinysrgb&w=1600',
  //         duration: '5 Days / 4 Nights',
  //         places: ['Kochi', 'Munnar', 'Alleppey', 'Kovalam'],
  //         type: 'domestic',
  //         createdAt: Date.now()
  //       },
  //       {
  //         id: '3',
  //         title: 'Golden Triangle Tour',
  //         description: 'Discover the cultural heritage of India\'s most iconic cities.',
  //         imageUrl: 'https://images.pexels.com/photos/5208388/pexels-photo-5208388.jpeg?auto=compress&cs=tinysrgb&w=1600',
  //         duration: '6 Days / 5 Nights',
  //         places: ['Delhi', 'Agra', 'Jaipur'],
  //         type: 'domestic',
  //         createdAt: Date.now()
  //       },
  //       {
  //         id: '4',
  //         title: 'Himalayan Adventure - Shimla & Manali',
  //         description: 'Experience the magic of the mountains with this exciting tour package.',
  //         imageUrl: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1600',
  //         duration: '7 Days / 6 Nights',
  //         places: ['Shimla', 'Kufri', 'Manali', 'Rohtang Pass'],
  //         type: 'domestic',
  //         createdAt: Date.now()
  //       }
  //     ];
  //   } else {
  //     return [
  //       {
  //         id: '5',
  //         title: 'Magical Singapore & Malaysia',
  //         description: 'Discover the perfect blend of culture, cuisine and modernity in Singapore and Malaysia.',
  //         imageUrl: 'https://images.pexels.com/photos/3386008/pexels-photo-3386008.jpeg?auto=compress&cs=tinysrgb&w=1600',
  //         duration: '6 Days / 5 Nights',
  //         places: ['Singapore', 'Kuala Lumpur', 'Genting Highlands'],
  //         type: 'international',
  //         createdAt: Date.now()
  //       },
  //       {
  //         id: '6',
  //         title: 'Dubai Extravaganza',
  //         description: 'Experience the luxury and excitement of Dubai with this complete tour package.',
  //         imageUrl: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=1600',
  //         duration: '5 Days / 4 Nights',
  //         places: ['Dubai', 'Abu Dhabi'],
  //         type: 'international',
  //         createdAt: Date.now()
  //       },
  //       {
  //         id: '7',
  //         title: 'Scenic Switzerland',
  //         description: 'Explore the breathtaking landscapes and charming cities of Switzerland.',
  //         imageUrl: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=1600',
  //         duration: '8 Days / 7 Nights',
  //         places: ['Zurich', 'Lucerne', 'Interlaken', 'Geneva'],
  //         type: 'international',
  //         createdAt: Date.now()
  //       },
  //       {
  //         id: '8',
  //         title: 'Thailand Discovery',
  //         description: 'Experience the perfect mix of culture, beaches, and adventure in Thailand.',
  //         imageUrl: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1600',
  //         duration: '7 Days / 6 Nights',
  //         places: ['Bangkok', 'Pattaya', 'Phuket'],
  //         type: 'international',
  //         createdAt: Date.now()
  //       }
  //     ];
  //   }
  // };

  const displayTours = filteredTours; // This line is correct, it should only display filteredTours

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
            {icon}
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          </div>
          <p className="max-w-2xl mx-auto">
            {tourType === 'domestic' 
              ? 'Explore the diverse beauty and rich culture of India with our curated domestic tour packages.'
              : 'Discover fascinating destinations around the world with our exclusive international tour packages.'}
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
            <span className="text-gray-500 mr-2">Filter by:</span>
            <button className="btn btn-outline py-2 flex items-center">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : displayTours.length === 0 ? (
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
            {displayTours.map((tour) => (
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

export default TourListPage;