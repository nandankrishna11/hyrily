import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Plus, X, Monitor, Users, TrendingUp, Clock, Eye, Trophy, CheckCircle, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Session {
  id: string;
  technologyStack: string;
  candidateCount: number;
  status: 'active' | 'completed';
  createdAt: string;
  candidates: Candidate[];
  selectedCandidates: Candidate[];
  questions: Question[];
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'interviewing' | 'completed' | 'selected' | 'rejected';
  score: number;
  loginTime?: string;
  interviewDuration?: number;
}

interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  answer?: string;
}

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [selectedStack, setSelectedStack] = useState<string>("");
  const [candidateCount, setCandidateCount] = useState<number>(1);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('companySessions');
    if (savedSessions) {
      const parsedSessions: Session[] = JSON.parse(savedSessions);
      setSessions(parsedSessions);
      setActiveSessions(parsedSessions.filter(s => s.status === 'active'));
      setCompletedSessions(parsedSessions.filter(s => s.status === 'completed'));
    }
  }, []);

  // Update stats based on real data
  const getStats = () => {
    const totalInterviews = sessions.reduce((sum, session) => sum + session.candidates.length, 0);
    const activeSessionsCount = activeSessions.length;
    const completedToday = completedSessions.filter(session => {
      const today = new Date().toDateString();
      const sessionDate = new Date(session.createdAt).toDateString();
      return sessionDate === today;
    }).length;
    
    const totalCompleted = sessions.reduce((sum, session) => 
      sum + session.candidates.filter(c => c.status === 'completed').length, 0
    );
    const totalSelected = sessions.reduce((sum, session) => 
      sum + session.candidates.filter(c => c.status === 'selected').length, 0
    );
    const successRate = totalCompleted > 0 ? Math.round((totalSelected / totalCompleted) * 100) : 0;

    return [
      { 
        label: "Total Interviews", 
        value: totalInterviews.toString(), 
        change: "+12%", 
        icon: <TrendingUp className="w-6 h-6" /> 
      },
      { 
        label: "Active Sessions", 
        value: activeSessionsCount.toString(), 
        change: activeSessionsCount > 0 ? "Live" : "None", 
        icon: <Monitor className="w-6 h-6" /> 
      },
      { 
        label: "Completed Today", 
        value: completedToday.toString(), 
        change: "+3", 
        icon: <Clock className="w-6 h-6" /> 
      },
      { 
        label: "Success Rate", 
        value: `${successRate}%`, 
        change: "+5%", 
        icon: <Users className="w-6 h-6" /> 
      },
    ];
  };

  const techStacks = [
    { id: "frontend", name: "Frontend Development", icon: "🎨", description: "React, Vue, Angular" },
    { id: "backend", name: "Backend Development", icon: "⚙️", description: "Node.js, Python, Java" },
    { id: "fullstack", name: "Full Stack Development", icon: "🔄", description: "Complete web development" },
    { id: "mobile", name: "Mobile Development", icon: "📱", description: "React Native, Flutter" },
    { id: "data", name: "Data Science", icon: "📊", description: "Python, R, Machine Learning" },
    { id: "devops", name: "DevOps", icon: "🚀", description: "Docker, Kubernetes, AWS" },
  ];

  // Add a shuffle function
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleCreateSession = async () => {
    if (selectedStack && candidateCount > 0) {
      // Try to fetch questions, fallback if fails
      let questions = [];
      try {
        const response = await fetch('/api/generate-company-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ technologyStack: selectedStack, questionCount: 12 })
        });
        if (response.ok) {
          const data = await response.json();
          questions = data.questions || [];
        }
      } catch (e) {
        // fallback
        questions = [
          { id: 'q1', text: 'What is your experience with this stack?', type: 'technical' },
          { id: 'q2', text: 'Describe a challenging project.', type: 'behavioral' },
        ];
      }
      if (questions.length > 0) {
        questions = shuffleArray(questions);
      }
      const newSession: Session = {
        id: `session-${Date.now()}`,
        technologyStack: selectedStack,
        candidateCount: candidateCount,
        status: 'active',
        createdAt: new Date().toISOString(),
        candidates: [],
        selectedCandidates: [],
        questions,
      };
      const updatedSessions = [...sessions, newSession];
      setSessions(updatedSessions);
      setActiveSessions(updatedSessions.filter(s => s.status === 'active'));
      setCompletedSessions(updatedSessions.filter(s => s.status === 'completed'));
      localStorage.setItem('companySessions', JSON.stringify(updatedSessions));
      setShowNewSessionModal(false);
      setSelectedStack("");
      setCandidateCount(1);
      toast({
        title: "Session Created",
        description: `New interview session created for ${candidateCount} candidates`,
      });
      navigate("/company/interview-session", {
        state: {
          technologyStack: selectedStack,
          candidateCount: candidateCount,
          sessionId: newSession.id
        }
      });
    }
  };

  const getRecentInterviews = () => {
    const allCandidates = sessions.flatMap(session => 
      session.candidates.map(candidate => ({
        ...candidate,
        sessionId: session.id,
        technologyStack: session.technologyStack,
      }))
    );

    return allCandidates
      .filter(candidate => candidate.status === 'completed' || candidate.status === 'selected')
      .sort((a, b) => new Date(b.loginTime || '').getTime() - new Date(a.loginTime || '').getTime())
      .slice(0, 5)
      .map(candidate => ({
        name: candidate.name,
        role: candidate.technologyStack,
        status: candidate.status === 'selected' ? 'Selected' : 'Completed',
        score: `${candidate.score}%`,
        time: candidate.loginTime ? getTimeAgo(new Date(candidate.loginTime)) : 'Unknown',
        sessionId: candidate.sessionId,
      }));
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleViewSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      navigate("/company/interview-session", {
        state: {
          technologyStack: session.technologyStack,
          candidateCount: session.candidateCount,
          sessionId: session.id
        }
      });
    }
  };

  const handleViewCandidate = (candidate: any) => {
    // Navigate to candidate details or session monitor
    navigate(`/company/session/${candidate.sessionId}`);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    const allSessions = JSON.parse(localStorage.getItem('companySessions') || '[]');
    const updatedSessions = allSessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    setActiveSessions(updatedSessions.filter(s => s.status === 'active'));
    setCompletedSessions(updatedSessions.filter(s => s.status === 'completed'));
    localStorage.setItem('companySessions', JSON.stringify(updatedSessions));
  };

  const selectTopCandidates = (session: Session) => {
    if (!session.candidates || session.candidates.length === 0) return session;
    const sorted = [...session.candidates].sort((a, b) => (b.score || 0) - (a.score || 0));
    const topN = sorted.slice(0, session.candidateCount);
    const updatedCandidates = session.candidates.map(c =>
      topN.find(tc => tc.id === c.id)
        ? { ...c, status: 'selected' as Candidate['status'] }
        : { ...c, status: (c.status === 'completed' ? 'completed' : c.status) as Candidate['status'] }
    );
    return { ...session, candidates: updatedCandidates, selectedCandidates: topN };
  };

  // After loading sessions, update selected candidates for each session
  useEffect(() => {
    const updated = sessions.map(selectTopCandidates);
    setSessions(updated);
    setActiveSessions(updated.filter(s => s.status === 'active'));
    setCompletedSessions(updated.filter(s => s.status === 'completed'));
    localStorage.setItem('companySessions', JSON.stringify(updated));
  }, [sessions.length]);

  // Add a function to reload sessions from localStorage
  const reloadSessions = () => {
    const savedSessions = localStorage.getItem('companySessions');
    if (savedSessions) {
      const parsedSessions: Session[] = JSON.parse(savedSessions);
      setSessions(parsedSessions);
      setActiveSessions(parsedSessions.filter(s => s.status === 'active'));
      setCompletedSessions(parsedSessions.filter(s => s.status === 'completed'));
    }
  };

  // After navigating to a session or after a candidate joins/completes, call reloadSessions()
  useEffect(() => {
    window.addEventListener('storage', reloadSessions);
    return () => window.removeEventListener('storage', reloadSessions);
  }, []);

  const stats = getStats();
  const recentInterviews = getRecentInterviews();

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
              <h1 className="text-3xl font-light text-gray-900 mb-2">Company Dashboard</h1>
              <p className="text-gray-500">Monitor your interview sessions and candidate progress</p>
            </div>
            <Button
              onClick={() => setShowNewSessionModal(true)}
              className="bg-gray-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/25 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Session
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-600">{stat.icon}</div>
                  <span className={`text-sm font-medium ${
                    stat.label === "Active Sessions" && stat.value !== "0" 
                      ? "text-green-600" 
                      : "text-green-600"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Active Sessions */}
          {activeSessions.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-green-600" />
                  Active Sessions
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{session.technologyStack}</h3>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Candidates: {session.candidates.length}</div>
                        <div>Created: {new Date(session.createdAt).toLocaleDateString()}</div>
                      </div>
                      {session.candidates.length === 0 && (
                        <div className="text-gray-400 text-sm mt-2">No candidates have joined this session yet.</div>
                      )}
                      <div className="flex items-center justify-between">
                        <Button
                          onClick={() => handleViewSession(session.id)}
                          className="w-full mt-3 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-800"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Session
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSession(session.id)} title="Delete Session">
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      {session.selectedCandidates && session.selectedCandidates.length > 0 && (
                        <div className="mt-2 text-green-700 text-sm">Selected: {session.selectedCandidates.map(c => c.name).join(', ')}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Interviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium text-gray-900">Recent Interviews</h2>
            </div>
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
                  {recentInterviews.length > 0 ? (
                    recentInterviews.map((interview, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{interview.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{interview.role}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            interview.status === "Selected" ? "bg-yellow-100 text-yellow-800" :
                            interview.status === "Completed" ? "bg-green-100 text-green-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {interview.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium">{interview.score}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{interview.time}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleViewCandidate(interview)}
                            className="text-gray-900 hover:text-gray-700 font-medium text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No interviews completed yet. Create a session and have candidates join to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* New Session Modal */}
      {showNewSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-light text-gray-900">Create New Interview Session</h2>
                <button
                  onClick={() => setShowNewSessionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Select Technology Stack</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {techStacks.map((stack) => (
                      <div
                        key={stack.id}
                        onClick={() => setSelectedStack(stack.id)}
                        className={`relative group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                          selectedStack === stack.id
                            ? "scale-105 shadow-xl"
                            : "hover:shadow-lg"
                        }`}
                      >
                        <div className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 ${
                          selectedStack === stack.id
                            ? "border-gray-900 shadow-xl"
                            : "border-gray-100 hover:border-gray-200"
                        }`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                            selectedStack === stack.id
                              ? "bg-gray-900 text-white"
                              : "bg-gray-50 text-gray-600 group-hover:bg-gray-100"
                          }`}>
                            <span className="text-xl">{stack.icon}</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{stack.name}</h3>
                          <p className="text-gray-500 text-sm">{stack.description}</p>
                          
                          {selectedStack === stack.id && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Number of Candidates</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={candidateCount}
                      onChange={(e) => setCandidateCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 bg-white text-gray-900 transition-all duration-300 hover:border-gray-300"
                      placeholder="Enter number of candidates"
                    />
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Specify how many candidates will participate in this interview session</p>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={() => setShowNewSessionModal(false)}
                    variant="outline"
                    className="flex-1 bg-gray-100 text-gray-900 font-medium py-3 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSession}
                    disabled={!selectedStack || candidateCount < 1}
                    className={`flex-1 font-medium py-3 rounded-xl transition-all duration-300 ${
                      selectedStack && candidateCount > 0
                        ? "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/25"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Create Session
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CompanyDashboard; 