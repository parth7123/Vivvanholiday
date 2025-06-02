import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tour, FormData } from '../../types';
import { sendEmailToAdmin} from '../../services/emailService';
import toast from 'react-hot-toast';

interface InterestFormProps {
  tour: Tour;
  onClose: () => void;
}

const InterestForm: React.FC<InterestFormProps> = ({ tour, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    numAdults: '1',
    numChildren1to5: '0',
    numChildren6to13: '0',
    tourId: tour.id,
    tourTitle: tour.title
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.numAdults || parseInt(formData.numAdults) < 1) {
      newErrors.numAdults = 'At least 1 adult is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send email to admin with tour title and traveler details
      await sendEmailToAdmin({
        ...formData,
        tourTitle: tour.title
      });
      
      toast.success('Thank you for your interest! We will contact you soon.');
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-1">Interested in This Tour</h3>
          <p className="text-gray-600 mb-4 text-sm">{tour.title}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="numAdults" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Adults *
                </label>
                <input
                  type="number"
                  id="numAdults"
                  name="numAdults"
                  value={formData.numAdults}
                  onChange={handleChange}
                  min="1"
                  className={`input ${errors.numAdults ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.numAdults && <p className="text-red-500 text-xs mt-1">{errors.numAdults}</p>}
              </div>
              
              <div>
                <label htmlFor="numChildren6to13" className="block text-sm font-medium text-gray-700 mb-1">
                  Children (6-12 years)
                </label>
                <input
                  type="number"
                  id="numChildren6to13"
                  name="numChildren6to13"
                  value={formData.numChildren6to13}
                  onChange={handleChange}
                  min="0"
                  className="input"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="numChildren1to5" className="block text-sm font-medium text-gray-700 mb-1">
                  Children (1-5 years)
                </label>
                <input
                  type="number"
                  id="numChildren1to5"
                  name="numChildren1to5"
                  value={formData.numChildren1to5}
                  onChange={handleChange}
                  min="0"
                  className="input"
                  disabled={isSubmitting}
                />
              </div>

              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input ${errors.phone ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Interest'
                  )}
                </button>
              </div>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 mt-4">
            By submitting this form, you agree to be contacted by our team regarding this tour package.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default InterestForm;