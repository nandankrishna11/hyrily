import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Copy, Monitor, ArrowLeft, Users, Code2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SessionData {
  technologyStack: string;
  candidateCount: number;
  sessionId: string;
}

const CompanySessionLink: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [sessionLink, setSessionLink] = useState("");
  const [accessCode, setAccessCode] = useState("");

  useEffect(() => {
    const data = location.state as SessionData;
    if (data) {
      setSessionData(data);
      // Generate session link
      const baseUrl = window.location.origin;
      const candidateLoginUrl = `${baseUrl}/candidate/login`;
      setSessionLink(candidateLoginUrl);
      
      // Generate access code (simple 6-digit code)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setAccessCode(code);
      
      // Store session data with access code
      const sessionWithCode = {
        ...data,
        accessCode: code,
        candidateLoginUrl: candidateLoginUrl,
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage for later use
      const existingSessions = JSON.parse(localStorage.getItem('companySessions') || '[]');
      const updatedSessions = [...existingSessions, sessionWithCode];
      localStorage.setItem('companySessions', JSON.stringify(updatedSessions));
    } else {
      // Redirect to dashboard if no session data
      navigate('/company/dashboard');
    }
  }, [location.state, navigate]);

  const copyToClipboard = async (text: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: type === 'link' ? "Session link copied to clipboard" : "Access code copied to clipboard",
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleMonitorSession = () => {
    if (sessionData) {
      navigate("/company/interview-session", {
        state: sessionData
      });
    }
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Loading Session...</h2>
          <p className="text-gray-500">Please wait while we prepare your session link</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden flex items-center justify-center">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      {/* Minimal Floating Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gray-100 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gray-50 rounded-full blur-3xl animate-pulse-slow float-delay-1"></div>

      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden border border-gray-100">
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Code2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-900 mb-2">Session Link Generated</h2>
              <p className="text-gray-500 text-sm">Share this link with your candidates to start the interview</p>
            </div>
            
            <div className="space-y-6">
              {/* Session Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Session Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Technology:</span>
                    <div className="font-medium text-gray-900">{sessionData.technologyStack}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Candidates:</span>
                    <div className="font-medium text-gray-900">{sessionData.candidateCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Session ID:</span>
                    <div className="font-medium text-gray-900 font-mono text-xs">{sessionData.sessionId}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className="font-medium text-green-600">Active</div>
                  </div>
                </div>
              </div>

              {/* Candidate Login Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Candidate Interview Link</label>
                <div className="relative">
                  <input
                    type="text"
                    value={sessionLink}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 pr-24"
                  />
                  <Button
                    onClick={() => copyToClipboard(sessionLink, 'link')}
                    className="absolute right-2 top-2 px-4 py-1 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                </div>
              </div>

              {/* Access Code */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Access Code
                </h3>
                <p className="text-blue-700 text-sm mb-3">Provide this access code to your candidates:</p>
                <div className="bg-white rounded-lg p-3 border border-blue-200 flex items-center justify-between">
                  <code className="text-blue-900 font-mono text-lg">{accessCode}</code>
                  <Button
                    onClick={() => copyToClipboard(accessCode, 'code')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-all duration-300 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Instructions for Candidates</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Share the interview link with your candidates via email or messaging
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Provide them with the access code: <strong className="font-mono">{accessCode}</strong>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Candidates will need to enter their name, email, and access code to join
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    They can access the interview from any device with a browser and camera
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Monitor interview progress in real-time from your dashboard
                  </li>
                </ul>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={handleMonitorSession}
                  className="flex-1 bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/25 transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  Monitor Session
                </Button>
                <Button
                  onClick={() => navigate("/company/dashboard")}
                  className="flex-1 bg-gray-100 text-gray-900 font-medium py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySessionLink; 