import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanySessionMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const sessionStats = [
    { label: "Total Candidates", value: "12", icon: "👥" },
    { label: "Completed", value: "8", icon: "✅" },
    { label: "In Progress", value: "3", icon: "🔄" },
    { label: "Average Score", value: "87%", icon: "📊" },
  ];

  const candidates = [
    { name: "John Smith", status: "Completed", score: "92%", time: "2 hours ago", role: "Frontend Developer" },
    { name: "Sarah Johnson", status: "In Progress", score: "78%", time: "1 hour ago", role: "Backend Developer" },
    { name: "Mike Davis", status: "Completed", score: "89%", time: "3 hours ago", role: "Full Stack Developer" },
    { name: "Emily Wilson", status: "Scheduled", score: "-", time: "Tomorrow", role: "Data Scientist" },
    { name: "Alex Brown", status: "Completed", score: "85%", time: "4 hours ago", role: "DevOps Engineer" },
    { name: "Lisa Chen", status: "In Progress", score: "65%", time: "30 min ago", role: "UI/UX Designer" },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      {/* Minimal Floating Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gray-100 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gray-50 rounded-full blur-3xl animate-pulse-slow float-delay-1"></div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="animate-fade-in-up">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Session Monitor</h1>
              <p className="text-gray-500">Real-time monitoring of interview session: Frontend Development</p>
            </div>
            <button
              onClick={() => navigate("/company/dashboard")}
              className="bg-gray-100 text-gray-900 font-medium px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {sessionStats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="border-b border-gray-100">
              <nav className="flex">
                {["overview", "candidates", "analytics"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? "text-gray-900 border-b-2 border-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Session Progress</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Completion Rate</span>
                            <span>67%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-900 h-2 rounded-full" style={{ width: "67%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Average Score</span>
                            <span>87%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-900 h-2 rounded-full" style={{ width: "87%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          John Smith completed interview (92%)
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Sarah Johnson started interview
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Mike Davis completed interview (89%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "candidates" && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Candidate</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Score</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Time</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {candidates.map((candidate, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{candidate.name}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{candidate.role}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              candidate.status === "Completed" ? "bg-green-100 text-green-800" :
                              candidate.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {candidate.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-medium">{candidate.score}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{candidate.time}</td>
                          <td className="px-6 py-4">
                            <button className="text-gray-900 hover:text-gray-700 font-medium text-sm">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-500">Detailed analytics and insights will be available here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySessionMonitor; 