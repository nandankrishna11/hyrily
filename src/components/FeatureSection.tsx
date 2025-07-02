import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Mic, 
  Video, 
  MessageSquare, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  Target,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

const FeatureSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your responses in real-time, providing detailed feedback on communication, technical knowledge, and problem-solving skills.",
      color: "orange-500",
      gradient: "from-orange-500 to-orange-600",
      stats: "99.9% Accuracy",
      delay: "stagger-1"
    },
    {
      icon: Mic,
      title: "Voice Recognition",
      description: "State-of-the-art speech recognition technology captures your responses naturally, just like a real interview conversation.",
      color: "orange-400",
      gradient: "from-orange-400 to-orange-500",
      stats: "Real-time Processing",
      delay: "stagger-2"
    },
    {
      icon: Video,
      title: "Video Interviews",
      description: "Practice with video interviews that simulate real-world scenarios, complete with AI interviewer and facial expression analysis.",
      color: "orange-600",
      gradient: "from-orange-600 to-orange-700",
      stats: "HD Quality",
      delay: "stagger-3"
    },
    {
      icon: MessageSquare,
      title: "Chat Interviews",
      description: "Text-based interview practice with instant feedback and follow-up questions based on your responses.",
      color: "orange-500",
      gradient: "from-orange-500 to-orange-600",
      stats: "Instant Feedback",
      delay: "stagger-4"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Comprehensive analytics dashboard showing your progress, strengths, and areas for improvement over time.",
      color: "orange-400",
      gradient: "from-orange-400 to-orange-500",
      stats: "Detailed Insights",
      delay: "stagger-5"
    },
    {
      icon: Zap,
      title: "Smart Recommendations",
      description: "Personalized recommendations for improvement based on your performance patterns and industry best practices.",
      color: "orange-600",
      gradient: "from-orange-600 to-orange-700",
      stats: "AI-Driven",
      delay: "stagger-6"
    }
  ];

  const stats = [
    { icon: Target, value: "10K+", label: "Interviews Completed", color: "orange-500", gradient: "from-orange-500 to-orange-600", delay: "stagger-1" },
    { icon: TrendingUp, value: "95%", label: "Success Rate", color: "orange-400", gradient: "from-orange-400 to-orange-500", delay: "stagger-2" },
    { icon: Users, value: "5K+", label: "Active Users", color: "orange-600", gradient: "from-orange-600 to-orange-700", delay: "stagger-3" },
    { icon: Award, value: "24/7", label: "AI Available", color: "orange-500", gradient: "from-orange-500 to-orange-600", delay: "stagger-4" }
  ];

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-32 bg-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-animated opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl animate-float float-delay-1"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <Badge className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 mb-6 border border-orange-500/30">
            <Shield className="w-4 h-4 mr-2 text-orange-500" />
            Advanced AI Technology
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Experience the Future of{' '}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Interview Preparation
            </span>
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Our cutting-edge AI platform combines advanced machine learning with industry expertise 
            to provide you with the most realistic and effective interview practice experience.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`text-center animate-on-scroll ${stat.delay || `stagger-${index + 1}`}`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <div className="premium-icon">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className={`text-3xl font-bold text-${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className={`animate-on-scroll ${feature.delay} border-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}
              style={{ backgroundColor: '#1f1e35' }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                    <div className="premium-icon">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <Badge className={`bg-orange-500/20 text-orange-400 border-orange-500/50 font-semibold`}>
                    {feature.stats}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-white font-bold transition-colors duration-300 hover:text-orange-400">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed font-medium">
                  {feature.description}
                </p>
                
                {/* Feature Details */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">Real-time processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-on-scroll stagger-7">
          <div className="bg-gray-50 p-8 rounded-2xl max-w-2xl mx-auto border border-gray-200 shadow-lg">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Interview Skills?
            </h3>
            <p className="text-gray-600 mb-6 text-lg font-medium">
              Join thousands of professionals who have already improved their interview performance 
              with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300">
                <Zap className="w-5 h-5 mr-2 inline" />
                Start Free Trial
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
