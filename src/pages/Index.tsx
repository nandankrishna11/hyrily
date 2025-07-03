import React from "react";
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import DashboardPreview from '@/components/DashboardPreview';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeatureSection />
      <DashboardPreview />
      <Footer />
    </div>
  );
};

export default Index;
