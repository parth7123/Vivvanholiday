import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tour } from '../../types';
import { getFeaturedTours } from '../../services/tourService';

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
};

interface TourCardProps {
  tour: Tour;
  variants: typeof animations.item;
}

const TourCard: React.FC<TourCardProps> = ({ tour, variants }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % tour.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
  };

  return (
    <motion.div 
      className="card group"
      variants={variants}
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={tour.images[currentImageIndex]} 
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Navigation Buttons */}
        <button 
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
          {currentImageIndex + 1} / {tour.images.length}
        </div>

        <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {tour.type === 'domestic' ? 'Domestic' : 'International'}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1">
        {tour.images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentImageIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
          {tour.title}
        </h3>
        <div className="flex items-center text-gray-500 mb-2">
          <Calendar size={16} className="mr-2" />
          <span>{tour.duration}</span>
        </div>
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin size={16} className="mr-2" />
          <span>{tour.places.join(', ')}</span>
        </div>
        <p className="text-gray-600 mb-6 line-clamp-2">
          {tour.description}
        </p>
        <Link 
          to={`/tour/${tour.id}`}
          className="flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          <span>View Details</span>
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

const FeaturedTours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTours = async () => {
      try {
        const featuredTours = await getFeaturedTours();
        setTours(Array.isArray(featuredTours) ? featuredTours : []);
      } catch (error) {
        console.error('Error loading featured tours:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  const displayTours = tours.length > 0 ? tours : fallbackTours;

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Tour Packages</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of popular destinations. These carefully curated packages offer unforgettable experiences for every traveler.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={animations.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {displayTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} variants={animations.item} />
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Link to="/domestic" className="btn btn-outline">
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;

const fallbackTours: Tour[] = [
  {
    id: '1',
    title: 'Majestic Rajasthan Heritage Tour',
    description: 'Explore the royal heritage of Rajasthan with this comprehensive tour package.',
    images: ['https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1600'],
    duration: '7 Days / 6 Nights',
    places: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
    type: 'domestic',
    featured: true,
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Enchanting Kerala Backwaters',
    description: 'Experience the serene backwaters and lush landscapes of God\'s own country.',
    images: ['https://images.pexels.com/photos/695779/pexels-photo-695779.jpeg?auto=compress&cs=tinysrgb&w=1600'],
    duration: '5 Days / 4 Nights',
    places: ['Kochi', 'Munnar', 'Alleppey', 'Kovalam'],
    type: 'domestic',
    featured: true,
    createdAt: Date.now()
  },
  {
    id: '3',
    title: 'Magical Singapore & Malaysia',
    description: 'Discover the perfect blend of culture, cuisine and modernity in Singapore and Malaysia.',
    images: ['https://images.pexels.com/photos/3386008/pexels-photo-3386008.jpeg?auto=compress&cs=tinysrgb&w=1600'],
    duration: '6 Days / 5 Nights',
    places: ['Singapore', 'Kuala Lumpur', 'Genting Highlands'],
    type: 'international',
    featured: true,
    createdAt: Date.now()
  }
];