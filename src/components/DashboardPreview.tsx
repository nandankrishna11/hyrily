import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Play, 
  ChartBar, 
  Settings, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  Award,
  Activity,
  BarChart3,
  Users,
  Calendar,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';

const DashboardPreview = () => {
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

  const stats = [
    { 
      label: 'Sessions Completed', 
      value: '24', 
      change: '+3 this week',
      icon: Target,
      color: '#e6771b',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      label: 'Average Score', 
      value: '8.7/10', 
      change: '+0.5 improvement',
      icon: TrendingUp,
      color: '#f97316',
      gradient: 'from-orange-400 to-orange-500'
    },
    { 
      label: 'Time Practiced', 
      value: '12.5h', 
      change: '+2h this week',
      icon: Clock,
      color: '#ea580c',
      gradient: 'from-orange-600 to-orange-700'
    },
  ];

  const recentSessions = [
    { 
      type: 'Technical Interview', 
      score: 9.2, 
      date: '2 hours ago',
      category: 'Frontend',
      status: 'completed'
    },
    { 
      type: 'Behavioral Questions', 
      score: 8.5, 
      date: 'Yesterday',
      category: 'Leadership',
      status: 'completed'
    },
    { 
      type: 'System Design', 
      score: 7.8, 
      date: '3 days ago',
      category: 'Architecture',
      status: 'completed'
    },
  ];

  const navigationItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Play, label: 'Practice Sessions', active: false },
    { icon: ChartBar, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
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
            <div className="premium-icon"><Zap className="w-4 h-4 mr-2 text-orange-500" /></div>
            Advanced Analytics Dashboard
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal Interview{' '}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Command Center
            </span>
          </h2>
          
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Track your progress, analyze performance, and access personalized coaching 
            recommendations all from one intuitive dashboard powered by advanced AI analytics.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="bg-gray-50 p-6 lg:p-8 rounded-3xl relative overflow-hidden animate-on-scroll stagger-1 shadow-lg">
          <div className="relative z-10 flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-72 bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <div className="premium-icon"><span className="text-white font-bold text-lg">JD</span></div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">John Doe</div>
                    <div className="text-gray-600 text-sm font-medium">Senior Frontend Engineer</div>
                    <Badge className="mt-1 bg-orange-100 text-orange-700 border-orange-200 font-semibold">
                      Pro Member
                    </Badge>
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                        item.active 
                          ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                          : 'text-gray-600'
                      }`}
                    >
                      <div className="premium-icon"><item.icon className={`w-5 h-5 ${item.active ? 'text-orange-600' : 'text-gray-500'}`} /></div>
                      <span className="font-semibold">{item.label}</span>
                      {item.active && (
                        <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">This Week</span>
                      <span className="text-orange-600 font-bold">+15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full w-3/4 animate-pulse-slow"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, <span className="text-orange-600">John</span>! 👋
                  </h3>
                  <p className="text-gray-600 text-lg font-medium">Ready for your next practice session?</p>
                </div>
                <Button className="text-lg px-8 py-4 font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  <span className="flex items-center gap-2">
                    <div className="premium-icon"><Play className="w-5 h-5" /></div>
                    Start New Session
                  </span>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <Card 
                    key={index} 
                    className="animate-on-scroll border-0 shadow-lg"
                    style={{ 
                      animationDelay: `${(index + 2) * 0.1}s`,
                      backgroundColor: '#1f1e35'
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}>
                          <div className="premium-icon"><stat.icon className="w-6 h-6 text-white" /></div>
                        </div>
                        <div className="premium-icon"><ArrowUpRight className="w-5 h-5 text-gray-400" /></div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-300 text-sm font-semibold">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <div className="flex items-center gap-2">
                          <div className="premium-icon"><TrendingUp className="w-4 h-4 text-orange-400" /></div>
                          <p className="text-orange-400 text-sm font-bold">{stat.change}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card className="animate-on-scroll stagger-5 border-0 shadow-lg" style={{ backgroundColor: '#1f1e35' }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-white flex items-center gap-2 font-bold">
                      <div className="premium-icon"><Activity className="w-5 h-5 text-orange-400" /></div>
                      Recent Sessions
                    </CardTitle>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 font-semibold">
                      View All
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <div className="premium-icon"><CheckCircle className="w-5 h-5 text-white" /></div>
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg">
                              {session.type}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/30 font-semibold">
                                {session.category}
                              </Badge>
                              <span className="text-gray-300 text-sm font-medium">{session.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                            <p className="font-bold text-orange-400 text-xl">{session.score}/10</p>
                          </div>
                          <p className="text-gray-300 text-sm font-medium">Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart Preview */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="animate-on-scroll stagger-6 border-0 shadow-lg" style={{ backgroundColor: '#1f1e35' }}>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 font-bold text-xl">
                      <div className="premium-icon"><BarChart3 className="w-5 h-5 text-orange-400" /></div>
                      Weekly Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-semibold">Technical Skills</span>
                        <span className="text-orange-400 font-bold text-lg">92%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full w-[92%] animate-pulse-slow"></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-semibold">Communication</span>
                        <span className="text-orange-400 font-bold text-lg">88%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full w-[88%] animate-pulse-slow"></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 font-semibold">Problem Solving</span>
                        <span className="text-orange-400 font-bold text-lg">85%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-orange-600 to-orange-700 h-3 rounded-full w-[85%] animate-pulse-slow"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-on-scroll stagger-7 border-0 shadow-lg" style={{ backgroundColor: '#1f1e35' }}>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 font-bold text-xl">
                      <div className="premium-icon"><Award className="w-5 h-5 text-orange-400" /></div>
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                          <div className="premium-icon"><Target className="w-4 h-4 text-white" /></div>
                        </div>
                        <div>
                          <p className="text-white font-bold">Perfect Score</p>
                          <p className="text-gray-300 text-sm font-medium">10/10 in Technical Interview</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <div className="premium-icon"><Users className="w-4 h-4 text-white" /></div>
                        </div>
                        <div>
                          <p className="text-white font-bold">Consistent Practice</p>
                          <p className="text-gray-300 text-sm font-medium">7 days in a row</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center">
                          <div className="premium-icon"><Calendar className="w-4 h-4 text-white" /></div>
                        </div>
                        <div>
                          <p className="text-white font-bold">Quick Learner</p>
                          <p className="text-gray-300 text-sm font-medium">Improved 15% this week</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
