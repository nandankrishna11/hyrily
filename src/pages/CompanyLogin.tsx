import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Sparkles, Building2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const CompanyLogin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/company/dashboard");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/company/dashboard");
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden flex items-center justify-center">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      
      {/* Subtle Geometric Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.02)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.02)_0%,transparent_50%)]"></div>
      
      {/* Refined Floating Elements */}
      <div className="absolute top-16 left-16 w-96 h-96 bg-gradient-to-br from-gray-200/30 to-gray-100/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-16 right-16 w-80 h-80 bg-gradient-to-br from-gray-100/40 to-gray-50/40 rounded-full blur-3xl animate-pulse-slow float-delay-1"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-gray-150/20 to-gray-100/20 rounded-full blur-3xl animate-pulse-slow float-delay-2"></div>
      
      {/* Subtle Corporate Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(0,0,0,0.008)_50%,transparent_60%)] bg-[size:200px_200px] animate-pulse-slow"></div>
      
      {/* Professional Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 relative overflow-hidden border border-gray-100/50">
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/95 to-gray-50/90"></div>
          
          {/* Professional Border Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-100/50 via-white/50 to-gray-100/50 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative">
                <Building2 className="w-10 h-10 text-white" />
                {/* Subtle Icon Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-gray-700/20 rounded-2xl blur-sm"></div>
              </div>
              <h2 className="text-3xl font-light text-gray-900 mb-2">Company Portal</h2>
              <p className="text-gray-500 text-sm">Access your hiring dashboard</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 mb-8 border border-gray-200/50">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign Up
              </button>
            </div>
            
            {activeTab === "login" ? (
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your company name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 transition-all duration-300 hover:bg-white hover:border-gray-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 transition-all duration-300 hover:bg-white hover:border-gray-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 transition-all duration-300 hover:bg-white hover:border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/25 transform hover:-translate-y-0.5"
                >
                  Sign In
                </Button>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleSignup}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your company name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 transition-all duration-300 hover:bg-white hover:border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 transition-all duration-300 hover:bg-white hover:border-gray-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 transition-all duration-300 hover:bg-white hover:border-gray-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 transition-all duration-300 hover:bg-white hover:border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 transition-all duration-300 hover:bg-white hover:border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/25 transform hover:-translate-y-0.5"
                >
                  Create Account
                </Button>
              </form>
            )}
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-xs">Enterprise-grade security & analytics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogin; 