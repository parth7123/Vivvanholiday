import React, { useState } from 'react';
import { Calendar, MapPin, Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tour } from '../../types';
import InterestForm from './InterestForm';

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const [showForm, setShowForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleInterestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForm(true);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % tour.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
  };

  return (
    <>
      <motion.div 
        className="card group h-full flex flex-col"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative overflow-hidden h-64">
          <img 
            src={tour.images[currentImageIndex]} 
            alt={`${tour.title} - Image ${currentImageIndex + 1}`}
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
          <button 
            onClick={handleLikeClick}
            className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full transition-all hover:bg-opacity-100"
          >
            <Heart 
              size={18} 
              className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
            />
          </button>
        </div>
        
        {/* Thumbnail Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1">
          {tour.images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setCurrentImageIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">
            {tour.title}
          </h3>
          <div className="flex items-center text-gray-500 mb-2 text-sm">
            <Calendar size={14} className="mr-2" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center text-gray-500 mb-3 text-sm">
            <MapPin size={14} className="mr-2" />
            <span className="truncate">{tour.places.join(', ')}</span>
          </div>
          <p className="text-gray-600 mb-4 text-sm line-clamp-2 flex-grow">
            {tour.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <button 
              onClick={handleInterestClick}
              className="btn btn-primary text-sm py-2"
            >
              I'm Interested
            </button>
            <Link 
              to={`/tour/${tour.id}`}
              className="flex items-center text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
            >
              <Eye size={16} className="mr-1" />
              Details
            </Link>
          </div>
        </div>
      </motion.div>

      {showForm && (
        <InterestForm 
          tour={tour} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </>
  );
};

export default TourCard;