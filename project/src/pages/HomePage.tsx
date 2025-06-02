import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedTours from '../components/home/FeaturedTours';
import AboutSection from '../components/home/AboutSection';
import { Toaster } from 'react-hot-toast';

const HomePage: React.FC = () => {
  return (
    <main>
      <Toaster position="top-right" />
      <Hero />
      <FeaturedTours />
      <AboutSection />
    </main>
  );
};

export default HomePage;