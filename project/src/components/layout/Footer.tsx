import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Globe2 } from 'lucide-react';
import FooterBg from '../../../logo/fotterimg.svg';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="relative text-gray-800 pt-16 pb-8"
      style={{
        backgroundImage: `url(${FooterBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30" />
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Globe2 className="mr-2" size={28} />
              Vivvan Holidays
            </Link>
            <p className="text-gray-700 mb-4">
              We value Your happiness. Explore the world with our carefully curated domestic and international tour packages.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/vivaan_holidays?igsh=MzQ0YTVvdGk2eXZo" className="text-gray-700 hover:text-gray-900 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/domestic" className="text-gray-700 hover:text-gray-900 transition-colors">Domestic Tours</Link>
              </li>
              <li>
                <Link to="/international" className="text-gray-700 hover:text-gray-900 transition-colors">International Tours</Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-700 hover:text-gray-900 transition-colors">Reviews</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="mr-2 flex-shrink-0 text-gray-700" size={18} />
                <a href="tel:+919023484480" className="text-gray-700 hover:text-gray-900 transition-colors">
                  +91 9023484480
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 flex-shrink-0 text-gray-700" size={18} />
                <a href="tel:+917984826609" className="text-gray-700 hover:text-gray-900 transition-colors">
                  +91 7984826609
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 flex-shrink-0 text-gray-700" size={18} />
                <a href="mailto:Vivaanholidays6@gmail.com" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Vivaanholidays6@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="mr-2 mt-1 flex-shrink-0 text-gray-700" size={18} />
                <span className="text-gray-700">
                  3rd Floor Shop Number - 345, AR Mall, Opp Panvel Point,
                  Near Shell Petrol Pump,Mota Varachha,
                  Sudama Chowk, Surat, Gujarat,394101,India.
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-12 pt-8 text-center text-gray-600">
          <p>&copy; {currentYear} Vivvan Holidays. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;