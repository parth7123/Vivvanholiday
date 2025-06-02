import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tour } from '../types';
import { getTourById } from '../services/tourService';
import InterestForm from '../components/tours/InterestForm';
import { Toaster } from 'react-hot-toast';

const ImageLightbox: React.FC<{
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
      >
        <X size={24} />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 text-white hover:text-gray-300 p-2"
      >
        <ChevronLeft size={32} />
      </button>
      
      <motion.img
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 text-white hover:text-gray-300 p-2"
      >
        <ChevronRight size={32} />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
};

const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedTour = await getTourById(id);
        setTour(fetchedTour);
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  // Fallback for when Firebase is not set up
  // useEffect(() => {
  //   if (!loading && !tour) {
  //     // Create a dummy tour for demo purposes
  //     const dummyTour: Tour = {
  //       id: id || '1',
  //       title: 'Majestic Rajasthan Heritage Tour',
  //       description: 'Explore the royal heritage of Rajasthan with this comprehensive tour package. Experience the rich culture, magnificent palaces, and vibrant traditions of this colorful state. From the pink city of Jaipur to the blue hues of Jodhpur, the golden sands of Jaisalmer to the romantic lakes of Udaipur, this tour offers a complete Rajasthan experience.',
  //       imageUrl: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1600',
  //       duration: '7 Days / 6 Nights',
  //       places: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
  //       type: 'domestic',
  //       featured: true,
  //       createdAt: Date.now()
  //     };
  //     setTour(dummyTour);
  //   }
  // }, [id, loading, tour]);

  const handleNextImage = () => {
    if (!tour) return;
    setSelectedImageIndex((prev) => (prev + 1) % tour.images.length);
  };

  const handlePrevImage = () => {
    if (!tour) return;
    setSelectedImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Tour Not Found</h2>
          <p className="text-gray-500 mb-6">The tour you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gray-900">
        {/* Main Image */}
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={tour.images[selectedImageIndex]}
            alt={`${tour.title} - Image ${selectedImageIndex + 1}`}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevImage();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextImage();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
        >
          <ChevronRight size={24} />
        </button>

        {/* Back Button and Title */}
        <div className="absolute top-0 left-0 right-0 p-6 z-10">
          <div className="container mx-auto">
            <Link 
              to={tour.type === 'domestic' ? '/domestic' : '/international'} 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to {tour.type === 'domestic' ? 'Domestic' : 'International'} Tours
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">{tour.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={18} className="mr-2" />
                <span>{tour.places.join(', ')}</span>
              </div>
              <div className="flex items-center">
                <Clock size={18} className="mr-2" />
                <span>Best time to visit: Year-round</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 px-2 py-1 bg-white rounded-lg shadow-lg z-20">
          {tour.images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(index);
              }}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index ? 'border-primary-500 scale-110' : 'border-transparent'
              }`}
            >
              <img 
                src={image} 
                alt={`${tour.title} - Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Tour Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                {tour.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>
              <div className="space-y-4">
                {tour.places.map((place, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                    <h3 className="font-semibold text-lg">Day {index + 1}: {place}</h3>
                    <p className="text-gray-600">
                      Explore the beautiful sights and attractions of {place}.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Inclusions</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Accommodation in handpicked hotels</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Daily breakfast and dinner</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All transportation within the tour</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Experienced local guide</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Exclusions</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Airfare to and from the destination</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Personal expenses and gratuities</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Travel insurance</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Optional activities and entrance fees</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Interested in this tour?</h3>
              <p className="text-gray-600 mb-6">
                Fill out the form and our travel expert will get back to you with more details and pricing.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary w-full"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {showLightbox && tour && (
          <ImageLightbox
            images={tour.images}
            currentIndex={selectedImageIndex}
            onClose={() => setShowLightbox(false)}
            onNext={handleNextImage}
            onPrev={handlePrevImage}
          />
        )}
      </AnimatePresence>

      {/* Interest Form Modal */}
      {showForm && (
        <InterestForm 
          tour={tour} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default TourDetailPage;