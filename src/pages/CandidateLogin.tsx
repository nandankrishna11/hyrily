import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Lock, ArrowRight, Users, Clock, Code2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SessionInfo {
  sessionId: string;
  technologyStack: string;
  companyName: string;
  accessCode: string;
}

const CandidateLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const sessionInfo = location.state as SessionInfo;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !accessCode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Validate access code
      if (accessCode !== sessionInfo?.accessCode) {
        toast({
          title: "Invalid Access Code",
          description: "Please check your access code and try again.",
          variant: "destructive",
        });
        return;
      }

      // Store candidate info in session storage
      const candidateData = {
        id: `candidate-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        sessionId: sessionInfo?.sessionId,
        loginTime: new Date().toISOString(),
      };
      
      sessionStorage.setItem('candidateData', JSON.stringify(candidateData));

      toast({
        title: "Login Successful",
        description: "Welcome to the interview session!",
      });

      // Navigate to candidate interview page
      navigate('/candidate/interview', { 
        state: { 
          candidateData,
          sessionInfo 
        } 
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Session Info Card */}
        {sessionInfo && (
          <Card className="mb-6 border-gray-200 shadow-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg font-medium text-gray-900">Interview Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Technology:</span>
                <Badge variant="outline" className="text-xs">
                  {sessionInfo.technologyStack}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium text-gray-900">{sessionInfo.companyName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Access Code:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {sessionInfo.accessCode}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login Form */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg font-medium text-gray-900">Candidate Login</CardTitle>
            <p className="text-sm text-gray-500">Enter your details to join the interview</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10 border-gray-200 focus:border-gray-900 focus:ring-gray-900/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 border-gray-200 focus:border-gray-900 focus:ring-gray-900/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessCode" className="text-sm font-medium text-gray-700">
                  Access Code
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="accessCode"
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter access code"
                    className="pl-10 border-gray-200 focus:border-gray-900 focus:ring-gray-900/20"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Joining Session...
                  </>
                ) : (
                  <>
                    Join Interview Session
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Make sure you have a working camera and microphone ready for the interview
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidateLogin; 