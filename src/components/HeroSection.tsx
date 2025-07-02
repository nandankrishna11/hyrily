import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

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

    const elements = heroRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen bg-white overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 border border-orange-500/30 animate-slide-in-left">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>AI-Powered Interview Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight animate-on-scroll">
                Master Your Interview Skills with{' '}
                <span className="text-orange-500">
                  AI
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg lg:text-xl text-gray-600 max-w-2xl font-medium leading-relaxed animate-on-scroll stagger-1">
                Experience the future of interview preparation with our advanced AI interviewer. 
                Get personalized feedback, practice with realistic scenarios, and build confidence 
                with intelligent coaching tailored to your career goals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll stagger-2">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg h-auto px-8 py-4 transition-all duration-300"
                onClick={() => navigate('/interview')}
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Start Free Trial
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-4 text-lg h-auto transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="lg:col-span-2 animate-on-scroll stagger-5">
            <div className="relative">
              {/* Main AI Interview Interface */}
              <div className="p-8 relative overflow-hidden border-0 shadow-lg rounded-2xl" style={{ backgroundColor: '#1f1e35' }}>
                {/* Holographic Effect */}
                <div className="absolute inset-0 holographic"></div>
                
                <div className="relative z-10 space-y-6">
                  {/* AI Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full animate-pulse-fast"></div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Hyrily AI</div>
                      <div className="text-gray-300 text-sm font-medium">Professional Interview Coach</div>
                    </div>
                  </div>

                  {/* Question Display */}
                  <div className="bg-gray-800/50 rounded-lg p-6 relative border border-gray-700">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <p className="text-white text-body leading-relaxed font-medium">
                      "Tell me about a challenging frontend project you worked on and how you overcame technical obstacles."
                    </p>
                  </div>

                  {/* Response Indicators */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 text-sm font-medium">Listening for your response...</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-full w-3/4 rounded-full animate-pulse-slow"></div>
                      </div>
                      <span className="text-gray-300 text-xs font-medium">75%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Analytics Cards */}
              <div className="absolute -top-4 -right-4 p-4 rounded-lg animate-float border-0 shadow-lg" style={{ backgroundColor: '#1f1e35' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Confidence</div>
                    <div className="text-lg text-orange-400 font-bold">92%</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 p-4 rounded-lg animate-float float-delay-1 border-0 shadow-lg" style={{ backgroundColor: '#1f1e35' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Sessions</div>
                    <div className="text-lg text-orange-500 font-bold">24</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute top-6 left-6 z-50 pointer-events-auto">
        <Link
          to="/"
          className="premium-icon flex items-center gap-2 text-primary border border-primary rounded-md px-4 py-2 hover:bg-primary/10 transition-colors font-semibold"
        >
          Back
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
