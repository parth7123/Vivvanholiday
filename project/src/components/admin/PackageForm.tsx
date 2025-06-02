import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tour } from '../../types';
import { addTour, updateTour } from '../../services/tourService';
import toast from 'react-hot-toast';

interface PackageFormProps {
  tour?: Tour;
  onClose: () => void;
  onSuccess: () => void;
}

const PackageForm: React.FC<PackageFormProps> = ({ tour, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [places, setPlaces] = useState('');
  const [type, setType] = useState<'domestic' | 'international'>('domestic');
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<string[]>(['', '', '', '']); // Array of 4 image URLs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tour) {
      setTitle(tour.title);
      setDescription(tour.description);
      setDuration(tour.duration);
      setPlaces(tour.places.join(', '));
      setType(tour.type);
      setFeatured(tour.featured || false);
      // Fill the images array with existing images or empty strings
      setImages(tour.images || ['', '', '', '']);
    }
  }, [tour]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!duration.trim()) {
      newErrors.duration = 'Duration is required';
    }
    
    if (!places.trim()) {
      newErrors.places = 'Places are required';
    }
    
    // Validate at least one image URL
    if (!images[0].trim()) {
      newErrors.images = 'At least one image URL is required';
    }

    // Validate all provided image URLs
    images.forEach((url, index) => {
      if (url.trim() && !isValidUrl(url)) {
        newErrors[`image${index + 1}`] = 'Please enter a valid image URL';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const placesList = places.split(',').map(place => place.trim());
      
      const tourData = {
        title,
        description,
        duration,
        places: placesList,
        type,
        featured,
        images: images.filter(url => url.trim() !== ''), // Only include non-empty image URLs
        createdAt: Date.now()
      };
      
      if (tour) {
        await updateTour(tour.id, tourData);
        toast.success('Tour package updated successfully');
      } else {
        await addTour(tourData);
        toast.success('Tour package added successfully');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Failed to save tour package');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {tour ? 'Edit Tour Package' : 'Add New Tour Package'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`input ${errors.title ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`input h-24 resize-none ${errors.description ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Days / 2 Nights"
                    className={`input ${errors.duration ? 'border-red-500' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tour Type *
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'domestic' | 'international')}
                    className="input"
                    disabled={isSubmitting}
                  >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="places" className="block text-sm font-medium text-gray-700 mb-1">
                  Places (comma separated) *
                </label>
                <input
                  type="text"
                  id="places"
                  value={places}
                  onChange={(e) => setPlaces(e.target.value)}
                  placeholder="e.g. Delhi, Agra, Jaipur"
                  className={`input ${errors.places ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.places && <p className="text-red-500 text-xs mt-1">{errors.places}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (At least one image required) *
                </label>
                <div className="space-y-2">
                  {images.map((url, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder={`Image URL ${index + 1}`}
                        className={`input ${errors[`image${index + 1}`] ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors[`image${index + 1}`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`image${index + 1}`]}</p>
                      )}
                    </div>
                  ))}
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured Package
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : tour ? 'Update Package' : 'Add Package'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PackageForm;