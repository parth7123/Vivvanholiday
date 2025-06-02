import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Pencil, Trash2, Search, Filter, 
  RefreshCw, Globe2, MapPin, ChevronDown, ChevronUp
} from 'lucide-react';
import { Tour } from '../../types';
import { getAllTours, deleteTour } from '../../services/tourService';
import { useAuth } from '../../context/AuthContext';
import PackageForm from './PackageForm';
import toast from 'react-hot-toast';

const AdminPanel: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Tour>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }

    fetchTours();
  }, [currentUser, navigate]);

  useEffect(() => {
    filterAndSortTours();
  }, [tours, searchTerm, filterType, sortField, sortDirection]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const fetchedTours = await getAllTours();
      setTours(Array.isArray(fetchedTours) ? fetchedTours : []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Failed to load tour packages');
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTours = () => {
    if (!Array.isArray(tours)) {
      setFilteredTours([]);
      return;
    }
    
    let result = [...tours];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(tour => 
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.places.some(place => place.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(tour => tour.type === filterType);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortDirection === 'asc' 
          ? a[sortField] - b[sortField] 
          : b[sortField] - a[sortField];
      }
      
      const aValue = a[sortField]?.toString().toLowerCase() || '';
      const bValue = b[sortField]?.toString().toLowerCase() || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    
    setFilteredTours(result);
  };

  const handleSort = (field: keyof Tour) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    setLoading(true);
    try {
      await deleteTour(id);
      setTours(tours.filter(tour => tour.id !== id));
      toast.success('Tour package deleted successfully');
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour package');
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  const handleEditClick = (tour: Tour) => {
    setEditTour(tour);
  };

  const handleFormSuccess = () => {
    fetchTours();
    setShowAddForm(false);
    setEditTour(null);
  };

  const renderSortIcon = (field: keyof Tour) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              Tour Package Management
            </h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add New Package
            </button>
          </div>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
            
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input pl-10"
              >
                <option value="all">All Types</option>
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
              <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
            
            <button
              onClick={fetchTours}
              className="btn btn-outline flex items-center justify-center"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2 text-5xl">🏝️</div>
              <h3 className="text-lg font-medium text-gray-600 mb-1">No packages found</h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Add your first tour package'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        <span>Package</span>
                        {renderSortIcon('title')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center">
                        <span>Type</span>
                        {renderSortIcon('type')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('duration')}
                    >
                      <div className="flex items-center">
                        <span>Duration</span>
                        {renderSortIcon('duration')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Places
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTours.map((tour) => (
                    <tr key={tour.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover"
                              src={tour.images[0]}
                              alt={tour.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {tour.title}
                            </div>
                            {tour.featured && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {tour.type === 'domestic' ? (
                            <>
                              <MapPin size={16} className="text-primary-500 mr-1" />
                              <span className="text-sm text-gray-900">Domestic</span>
                            </>
                          ) : (
                            <>
                              <Globe2 size={16} className="text-accent-500 mr-1" />
                              <span className="text-sm text-gray-900">International</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tour.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {tour.places.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(tour)}
                            className="text-primary-600 hover:text-primary-800 p-1"
                          >
                            <Pencil size={18} />
                          </button>
                          {confirmDelete === tour.id ? (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleDeleteConfirm(tour.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-gray-600 hover:text-gray-800 p-1"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(tour.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <PackageForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {editTour && (
        <PackageForm
          tour={editTour}
          onClose={() => setEditTour(null)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default AdminPanel;