import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyStackSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStack, setSelectedStack] = useState<string>("");

  const techStacks = [
    { id: "frontend", name: "Frontend Development", icon: "🎨", description: "React, Vue, Angular" },
    { id: "backend", name: "Backend Development", icon: "⚙️", description: "Node.js, Python, Java" },
    { id: "fullstack", name: "Full Stack Development", icon: "🔄", description: "Complete web development" },
    { id: "mobile", name: "Mobile Development", icon: "📱", description: "React Native, Flutter" },
    { id: "data", name: "Data Science", icon: "📊", description: "Python, R, Machine Learning" },
    { id: "devops", name: "DevOps", icon: "🚀", description: "Docker, Kubernetes, AWS" },
  ];

  const handleStackSelect = (stackId: string) => {
    setSelectedStack(stackId);
  };

  const handleContinue = () => {
    if (selectedStack) {
      navigate("/company/session-link");
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      {/* Minimal Floating Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gray-100 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gray-50 rounded-full blur-3xl animate-pulse-slow float-delay-1"></div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-light text-gray-900 mb-4">Select Technology Stack</h1>
            <p className="text-gray-500 text-lg">Choose the technology stack for your interview candidates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {techStacks.map((stack, index) => (
              <div
                key={stack.id}
                onClick={() => handleStackSelect(stack.id)}
                className={`relative group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedStack === stack.id
                    ? "scale-105 shadow-xl"
                    : "hover:shadow-lg"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                  selectedStack === stack.id
                    ? "border-gray-900 shadow-xl"
                    : "border-gray-100 hover:border-gray-200"
                }`}>
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    selectedStack === stack.id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-600 group-hover:bg-gray-100"
                  }`}>
                    <span className="text-2xl">{stack.icon}</span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{stack.name}</h3>
                  <p className="text-gray-500 text-sm">{stack.description}</p>
                  
                  {selectedStack === stack.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedStack}
              className={`px-12 py-4 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                selectedStack
                  ? "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/25"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStackSelection; 