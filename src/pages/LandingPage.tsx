import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Sparkles, Play, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const landingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = landingRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={landingRef} className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-animated-slow opacity-5"></div>
      {/* Floating Particles */}
      <div className="absolute inset-0 particles"></div>
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse-slow float-delay-1"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl animate-pulse-slow float-delay-2"></div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-20 lg:py-32 text-center space-y-10 animate-on-scroll">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 border border-orange-500/30 animate-slide-in-left">
          <div className="premium-icon">
            <Sparkles className="w-4 h-4 text-orange-500" />
          </div>
          <span>AI-Powered Interview Platform</span>
        </div>
        {/* Heading */}
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-on-scroll">
          Welcome to <span className="text-orange-500">Hyrily</span>
        </h1>
        {/* Subtitle */}
        <p className="text-lg lg:text-xl text-gray-600 max-w-xl mx-auto font-medium leading-relaxed animate-on-scroll stagger-1">
          Experience the future of interview preparation. Practice, get feedback, and master your skills with our advanced AI platform.
        </p>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll stagger-2">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg h-auto px-8 py-4 transition-all duration-300"
            onClick={() => navigate("/home", { replace: true })}
          >
            <span className="flex items-center gap-2">
              <div className="premium-icon">
                <Zap className="w-5 h-5" />
              </div>
              Student
            </span>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-4 text-lg h-auto transition-all duration-300"
            onClick={() => navigate("/company")}
          >
            <div className="premium-icon">
              <Play className="w-5 h-5 mr-2" />
            </div>
            Company
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LandingPage; 