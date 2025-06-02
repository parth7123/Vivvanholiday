import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  tour: string;
  date: string;
  content: string;
  image: string;
}

const ReviewCarousel: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + reviews.length) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        paginate(1);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isPaused, paginate]);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="relative min-h-[400px] md:h-[500px] overflow-hidden bg-gray-50 rounded-xl shadow-lg">
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 flex items-center justify-center p-4 md:p-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4 md:mb-6">
                  <img 
                    src={reviews[currentIndex].image} 
                    alt={reviews[currentIndex].name}
                    className="w-20 h-20 md:w-16 md:h-16 rounded-full object-cover mx-auto md:mx-0"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold text-gray-800">{reviews[currentIndex].name}</h3>
                    <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 mb-2">
                      <MapPin size={14} className="mr-1" />
                      <span>{reviews[currentIndex].location}</span>
                    </div>
                    <div className="flex space-x-1 justify-center md:justify-start">
                      {renderStars(reviews[currentIndex].rating)}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 md:mb-6">
                  <Quote size={24} className="text-primary-500 mb-2 mx-auto md:mx-0" />
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed max-h-[150px] md:max-h-[200px] overflow-y-auto">
                    {reviews[currentIndex].content}
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-2">
                  <p className="font-medium text-gray-700 text-center md:text-left">{reviews[currentIndex].tour}</p>
                  <p className="text-gray-500">{reviews[currentIndex].date}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons - Hide on very small screens */}
      <div className="hidden sm:block">
        <button
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all z-10"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all z-10"
          onClick={() => paginate(1)}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary-500 w-3 md:w-4' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ReviewsPage: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      rating: 5,
      tour: 'Majestic Rajasthan Heritage Tour',
      date: 'May 15, 2023',
      content: 'Our Rajasthan tour was absolutely magnificent! The accommodations were luxurious, the guide was knowledgeable, and the itinerary perfectly balanced historical sites with cultural experiences. Vivvan Holidays took care of every detail, making our family vacation truly memorable.',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    {
      id: 2,
      name: 'Rahul Mehta',
      location: 'Delhi, India',
      rating: 5,
      tour: 'Enchanting Kerala Backwaters',
      date: 'June 3, 2023',
      content: 'The Kerala tour exceeded all our expectations! From the serene backwaters to the lush tea plantations, everything was perfectly organized. Our guide was fantastic and accommodated all our requests. The houseboat experience was the highlight of our trip. Highly recommend Vivvan Holidays!',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    {
      id: 3,
      name: 'Anil & Sunita Patel',
      location: 'Ahmedabad, India',
      rating: 4,
      tour: 'Singapore & Malaysia Adventure',
      date: 'April 22, 2023',
      content: 'We had a wonderful time in Singapore and Malaysia. The hotels were excellent and centrally located. Our tour manager was very helpful and made sure we were comfortable throughout the trip. The only minor issue was a slight delay at the airport pickup, but everything else was perfect.',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    {
      id: 4,
      name: 'Neha Reddy',
      location: 'Hyderabad, India',
      rating: 5,
      tour: 'Himalayan Adventure - Shimla & Manali',
      date: 'March 12, 2023',
      content: 'The Shimla-Manali tour was breathtaking! Despite traveling with elderly parents, Vivvan Holidays made sure everyone was comfortable. The mountain views were spectacular, and the hotels had excellent heating systems for the cold weather. Our guide was knowledgeable about local culture and took us to some hidden gems away from tourist crowds.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      location: 'Jaipur, India',
      rating: 5,
      tour: 'Dubai Extravaganza',
      date: 'February 18, 2023',
      content: 'Dubai was amazing! The desert safari, Burj Khalifa, and shopping experiences were all top-notch. Vivvan Holidays arranged everything perfectly, and our tour guide spoke excellent Hindi and English. The hotel was luxurious and the food options were great. Will definitely book with Vivvan again for our next international trip!',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    {
      id: 6,
      name: 'Meera & Karthik',
      location: 'Bangalore, India',
      rating: 4,
      tour: 'Golden Triangle Tour',
      date: 'January 7, 2023',
      content: 'As a newly married couple, we wanted our first trip to be special, and Vivvan Holidays delivered! The Golden Triangle tour was well-organized with comfortable transportation between cities. The Taj Mahal was obviously the highlight, but we also loved exploring the markets in Jaipur. Our only suggestion would be to include more local food experiences in the package.',
      image: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=1600'
    }
  ];

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

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Customer Reviews</h1>
          <p className="max-w-2xl mx-auto">
            Don't just take our word for it. See what our happy customers have to say about their
            experiences traveling with Vivvan Holidays.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-1 mb-2">
              {renderStars(5)}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">4.8 out of 5</h2>
            <p className="text-gray-600">Based on 156 reviews</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex justify-center space-x-1 mb-2">
                {renderStars(5)}
              </div>
              <p className="font-medium">5 Stars</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">85%</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex justify-center space-x-1 mb-2">
                {renderStars(4)}
              </div>
              <p className="font-medium">4 Stars</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '12%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">12%</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex justify-center space-x-1 mb-2">
                {renderStars(3)}
              </div>
              <p className="font-medium">3 Stars</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '3%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">3%</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex justify-center space-x-1 mb-2">
                {renderStars(2)}
              </div>
              <p className="font-medium">1-2 Stars</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">0%</p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <ReviewCarousel reviews={reviews} />
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">All Reviews</h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {reviews.map((review) => (
              <motion.div 
                key={review.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                variants={item}
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <img 
                      src={review.image} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{review.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-1" />
                        <span>{review.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex space-x-1 mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-700">{review.tour}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-4">{review.content}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;