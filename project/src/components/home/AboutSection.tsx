import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Award, Heart, Plane, Train, BookOpen, FileCheck,
  UserCog, MapPin, PiggyBank, HeadphonesIcon, CreditCard, Building2
} from 'lucide-react';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <UserCog className="w-5 h-5 text-primary-600" />,
      text: 'Personalized travel experiences'
    },
    {
      icon: <PiggyBank className="w-5 h-5 text-primary-600" />,
      text: 'Best price guarantee'
    },
    {
      icon: <HeadphonesIcon className="w-5 h-5 text-primary-600" />,
      text: '24/7 customer support'
    },
    {
      icon: <CreditCard className="w-5 h-5 text-primary-600" />,
      text: 'Flexible payment options'
    },
    {
      icon: <Building2 className="w-5 h-5 text-primary-600" />,
      text: 'Curated quality accommodations'
    }
  ];

  const services = [
    {
      icon: <Plane size={32} className="mb-4 text-primary-600" />,
      title: 'Air Tickets',
      description: 'Book domestic and international flights at competitive prices.'
    },
    {
      icon: <Train size={32} className="mb-4 text-primary-600" />,
      title: 'Train Tickets',
      description: 'Hassle-free train ticket bookings across India.'
    },
    {
      icon: <BookOpen size={32} className="mb-4 text-primary-600" />,
      title: 'Passport Services',
      description: 'Assistance with passport application and renewal process.'
    },
    {
      icon: <FileCheck size={32} className="mb-4 text-primary-600" />,
      title: 'Traveling visa',
      description: 'Expert guidance for visa applications and documentation.'
    }
  ];

  const values = [
    {
      icon: <Users size={24} className="mb-4 text-primary-600" />,
      title: 'Customer First',
      description: 'We prioritize your needs and preferences to create the perfect travel experience.'
    },
    {
      icon: <Award size={24} className="mb-4 text-primary-600" />,
      title: 'Quality',
      description: 'We never compromise on the quality of accommodations, transportation, and experiences.'
    },
    {
      icon: <Heart size={24} className="mb-4 text-primary-600" />,
      title: 'Passion',
      description: 'Our team is passionate about travel and committed to creating unforgettable journeys.'
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                alt="About Vivvan Holidays" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-primary-600">10+</span>
                  <span className="ml-2 text-gray-600">Years of Experience</span>
                </div>
                <p className="text-sm text-gray-500">
                  Creating memorable travel experiences since 2015
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">About Vivvan Holidays</h2>
            <p className="text-gray-600 mb-6">
              Vivvan Holidays is a premier travel agency dedicated to creating unforgettable travel experiences. 
              With over a decade of expertise, we specialize in crafting personalized domestic and international 
              tour packages that cater to the unique preferences of our clients.
            </p>
            <p className="text-gray-600 mb-6">
              Our mission is simple: <span className="font-semibold text-primary-600">We value Your happiness</span>. 
              Every tour we design is aimed at providing not just a journey, but a collection of cherished memories 
              that last a lifetime.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-50 rounded-full p-1.5 mr-3">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-6">Our Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map((service, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {service.icon}
                    <h4 className="font-semibold mb-2">{service.title}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6">Our Core Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="text-center bg-gray-50 p-4 rounded-lg">
                    {value.icon}
                    <h4 className="font-semibold mb-2">{value.title}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;