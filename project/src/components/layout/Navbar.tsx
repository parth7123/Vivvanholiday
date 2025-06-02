import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Globe2, Star, MessageSquare, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import VivaanLogo from '../../../logo/VIVAAN HOLIDAYS (1).svg'; // Import the SVG logo

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className={`flex items-center text-2xl font-bold transition-colors ${
            scrolled || isOpen ? 'text-primary-700' : 'text-white'
          }`}
        >
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span className="flex items-center">
              <img src={VivaanLogo} alt="Vivvan Holidays Logo" className="h-16 w-auto" />
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/domestic" className={({ isActive }) => 
            `nav-link flex items-center ${
              scrolled || isOpen 
                ? `text-gray-700 hover:text-primary-600 ${isActive ? 'text-primary-600' : ''}`
                : `text-white hover:text-white ${isActive ? 'text-white' : ''}`
            }`
          }>
            <MapPin size={18} className="mr-1" />
            Domestic Tours
          </NavLink>
          <NavLink to="/international" className={({ isActive }) => 
            `nav-link flex items-center ${
              scrolled || isOpen 
                ? `text-gray-700 hover:text-primary-600 ${isActive ? 'text-primary-600' : ''}`
                : `text-white hover:text-white ${isActive ? 'text-white' : ''}`
            }`
          }>
            <Globe2 size={18} className="mr-1" />
            International Tours
          </NavLink>
          <NavLink to="/reviews" className={({ isActive }) => 
            `nav-link flex items-center ${
              scrolled || isOpen 
                ? `text-gray-700 hover:text-primary-600 ${isActive ? 'text-primary-600' : ''}`
                : `text-white hover:text-white ${isActive ? 'text-white' : ''}`
            }`
          }>
            <Star size={18} className="mr-1" />
            Reviews
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => 
            `nav-link flex items-center ${
              scrolled || isOpen 
                ? `text-gray-700 hover:text-primary-600 ${isActive ? 'text-primary-600' : ''}`
                : `text-white hover:text-white ${isActive ? 'text-white' : ''}`
            }`
          }>
            <MessageSquare size={18} className="mr-1" />
            Contact Us
          </NavLink>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="btn btn-primary py-2 flex items-center">
                <User size={18} className="mr-1" />
                Admin Panel
              </Link>
              <button 
                onClick={handleLogout}
                className={`transition-colors ${
                  scrolled || isOpen ? 'text-gray-600 hover:text-red-500' : 'text-white hover:text-red-300'
                }`}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="btn btn-primary py-2">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden transition-colors ${
            scrolled || isOpen ? 'text-gray-500 hover:text-primary-600' : 'text-white hover:text-white'
          }`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          className="md:hidden bg-white"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLink to="/domestic" className={({ isActive }) => 
              `nav-link flex items-center py-2 ${isActive ? 'text-primary-600' : 'text-gray-700'}`
            }>
              <MapPin size={18} className="mr-2" />
              Domestic Tours
            </NavLink>
            <NavLink to="/international" className={({ isActive }) => 
              `nav-link flex items-center py-2 ${isActive ? 'text-primary-600' : 'text-gray-700'}`
            }>
              <Globe2 size={18} className="mr-2" />
              International Tours
            </NavLink>
            <NavLink to="/reviews" className={({ isActive }) => 
              `nav-link flex items-center py-2 ${isActive ? 'text-primary-600' : 'text-gray-700'}`
            }>
              <Star size={18} className="mr-2" />
              Reviews
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => 
              `nav-link flex items-center py-2 ${isActive ? 'text-primary-600' : 'text-gray-700'}`
            }>
              <MessageSquare size={18} className="mr-2" />
              Contact Us
            </NavLink>
            
            {currentUser ? (
              <div className="flex flex-col space-y-3 pt-2 border-t border-gray-200">
                <Link to="/admin" className="btn btn-primary py-2 flex items-center justify-center">
                  <User size={18} className="mr-2" />
                  Admin Panel
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline py-2 flex items-center justify-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="btn btn-primary py-2 mt-2">
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;