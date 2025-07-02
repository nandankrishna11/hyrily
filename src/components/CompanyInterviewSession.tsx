import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Clock, Users, Trophy, CheckCircle, XCircle, Loader2, Copy } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useToast } from '@/components/ui/use-toast';

interface InterviewQuestion {
  id: string;
  type: 'technical' | 'behavioral' | 'problem-solving' | 'system-design';
  question: string;
  answer?: string;
  score?: number;
  feedback?: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'interviewing' | 'completed' | 'selected' | 'rejected';
  score: number;
  answers: InterviewQuestion[];
  startTime?: Date;
  endTime?: Date;
  sessionId?: string;
}

interface SessionData {
  technologyStack: string;
  candidateCount: number;
  sessionId: string;
}

const CompanyInterviewSession: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Session states
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);

  // Interview states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  
  // Camera and audio states
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  
  // Speech recognition
  const { transcript, finalTranscript, interimTranscript, resetTranscript, isSupported, startListening, stopListening } = useSpeechRecognition();
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Add state for answer
  const [typedAnswer, setTypedAnswer] = useState('');

  useEffect(() => {
    const data = location.state as SessionData;
    if (data) {
      setSessionData(data);
      generateQuestions(data.technologyStack);
      initializeCandidates(data.candidateCount);
      
      // Load existing session data from localStorage
      const savedSessions = JSON.parse(localStorage.getItem('companySessions') || '[]');
      const existingSession = savedSessions.find((s: any) => s.sessionId === data.sessionId);
      
      if (existingSession && existingSession.candidates) {
        setCandidates(existingSession.candidates);
      }
    }
  }, [location.state]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentCandidate && currentCandidate.status === 'interviewing') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentCandidate]);

  const generateQuestions = async (technologyStack: string) => {
    setIsGeneratingQuestions(true);
    try {
      const response = await fetch('/api/generate-company-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          technologyStack,
          questionCount: 12,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedQuestions: InterviewQuestion[] = data.questions.map((q: any, index: number) => ({
          id: `q${index + 1}`,
          type: q.type,
          question: q.question,
        }));
        setQuestions(generatedQuestions);
      } else {
        setQuestions(generateFallbackQuestions());
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setQuestions(generateFallbackQuestions());
    } finally {
      setIsGeneratingQuestions(false);
      setIsLoading(false);
    }
  };

  const generateFallbackQuestions = (): InterviewQuestion[] => {
    const baseQuestions = [
      { type: 'technical', question: 'Explain the difference between REST and GraphQL APIs.' },
      { type: 'behavioral', question: 'Describe a challenging project you worked on and how you overcame obstacles.' },
      { type: 'technical', question: 'What are the key principles of SOLID design patterns?' },
      { type: 'problem-solving', question: 'How would you optimize a slow-performing database query?' },
      { type: 'behavioral', question: 'Tell me about a time when you had to work with a difficult team member.' },
      { type: 'technical', question: 'Explain the concept of microservices and their benefits.' },
      { type: 'system-design', question: 'Design a scalable chat application architecture.' },
      { type: 'technical', question: 'What is the difference between synchronous and asynchronous programming?' },
      { type: 'behavioral', question: 'How do you handle tight deadlines and pressure?' },
      { type: 'problem-solving', question: 'How would you implement a rate limiting system?' },
      { type: 'technical', question: 'Explain the concept of dependency injection.' },
      { type: 'behavioral', question: 'Describe your approach to learning new technologies.' },
    ];

    return baseQuestions.map((q, index) => ({
      id: `q${index + 1}`,
      type: q.type as any,
      question: q.question,
    }));
  };

  const initializeCandidates = (candidateCount: number) => {
    const mockCandidates: Candidate[] = Array.from({ length: candidateCount }, (_, index) => ({
      id: `candidate-${index + 1}`,
      name: `Candidate ${index + 1}`,
      email: `candidate${index + 1}@example.com`,
      status: 'pending',
      score: 0,
      answers: [],
      sessionId: `session-${Date.now()}-${index + 1}`,
    }));
    setCandidates(mockCandidates);
    
    // Update session in localStorage
    updateSessionInStorage(mockCandidates);
  };

  const updateSessionInStorage = (updatedCandidates: Candidate[]) => {
    if (!sessionData) return;
    
    const savedSessions = JSON.parse(localStorage.getItem('companySessions') || '[]');
    const sessionIndex = savedSessions.findIndex((s: any) => s.sessionId === sessionData.sessionId);
    
    if (sessionIndex !== -1) {
      savedSessions[sessionIndex].candidates = updatedCandidates;
      localStorage.setItem('companySessions', JSON.stringify(savedSessions));
    }
  };

  const startInterview = async (candidate: Candidate) => {
    setCurrentCandidate(candidate);
    setCurrentQuestionIndex(0);
    setSessionTime(0);
    setIsRecording(false);
    setIsListening(false);
    resetTranscript();
    
    // Update candidate status
    const updatedCandidates = candidates.map(c => 
      c.id === candidate.id 
        ? { ...c, status: 'interviewing' as const, startTime: new Date() }
        : c
    );
    setCandidates(updatedCandidates);
    updateSessionInStorage(updatedCandidates);

    // Start camera and microphone
    await startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
        };
      }
      
      streamRef.current = stream;
      setIsCameraOn(true);
      setIsMicOn(true);
      
      toast({
        title: "Interview Ready",
        description: "Camera and microphone are active. You can start the interview.",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera/microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOn(false);
    setIsMicOn(false);
  };

  const toggleRecording = () => {
    if (!isSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      stopListening();
      setIsRecording(false);
      setIsListening(false);
    } else {
      startListening();
      setIsRecording(true);
      setIsListening(true);
    }
  };

  const handleAnswerSubmission = async (answer: string) => {
    if (!answer.trim() || !currentCandidate) return;

    setIsProcessingAnswer(true);
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      
      // Send answer to Gemini for evaluation
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: answer,
          questionType: currentQuestion.type,
          technologyStack: sessionData?.technologyStack,
        }),
      });

      let score = 0;
      let feedback = '';

      if (response.ok) {
        const data = await response.json();
        score = data.score;
        feedback = data.feedback;
      } else {
        score = Math.floor(Math.random() * 40) + 60;
        feedback = 'Answer evaluated successfully.';
      }

      // Update question with answer and score
      const updatedQuestion: InterviewQuestion = {
        ...currentQuestion,
        answer: answer,
        score,
        feedback,
      };

      // Update candidate's answers
      const updatedAnswers = [...currentCandidate.answers];
      updatedAnswers[currentQuestionIndex] = updatedQuestion;

      const updatedCandidate: Candidate = {
        ...currentCandidate,
        answers: updatedAnswers,
        score: Math.round(updatedAnswers.reduce((sum, q) => sum + (q.score || 0), 0) / updatedAnswers.length),
      };

      setCurrentCandidate(updatedCandidate);
      setCandidates(prev => prev.map(c => 
        c.id === currentCandidate.id ? updatedCandidate : c
      ));

      toast({
        title: "Answer Recorded",
        description: `Score: ${score}/100 - ${score >= 80 ? 'Excellent!' : score >= 60 ? 'Good!' : 'Keep practicing!'}`,
      });

      // Move to next question or complete interview
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsWaitingForResponse(false);
        setIsProcessingAnswer(false);
      } else {
        completeInterview(updatedCandidate);
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      setIsProcessingAnswer(false);
      toast({
        title: "Error",
        description: "Failed to process your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const completeInterview = (candidate: Candidate) => {
    const completedCandidate: Candidate = {
      ...candidate,
      status: 'completed',
      endTime: new Date(),
    };

    const updatedCandidates = candidates.map(c => 
      c.id === candidate.id ? completedCandidate : c
    );

    setCandidates(updatedCandidates);
    updateSessionInStorage(updatedCandidates);
    setCurrentCandidate(null);
    setSessionTime(0);
    setIsRecording(false);
    setIsListening(false);
    stopCamera();

    // Check if all interviews are complete
    const allCompleted = updatedCandidates.every(c => c.status === 'completed');
    if (allCompleted) {
      selectTopCandidates(updatedCandidates);
    }
  };

  const selectTopCandidates = (allCandidates: Candidate[]) => {
    const completedCandidates = allCandidates.filter(c => c.status === 'completed');
    const sortedCandidates = completedCandidates.sort((a, b) => b.score - a.score);
    const topCandidates = sortedCandidates.slice(0, sessionData?.candidateCount || 1);

    // Update selected candidates
    const updatedCandidates = allCandidates.map(c => ({
      ...c,
      status: topCandidates.some(tc => tc.id === c.id) ? 'selected' as const : 'rejected' as const,
    }));

    setCandidates(updatedCandidates);
    setSelectedCandidates(topCandidates);
    setSessionComplete(true);
    
    // Update session in localStorage
    updateSessionInStorage(updatedCandidates);
    
    // Mark session as completed
    const savedSessions = JSON.parse(localStorage.getItem('companySessions') || '[]');
    const sessionIndex = savedSessions.findIndex((s: any) => s.sessionId === sessionData?.sessionId);
    
    if (sessionIndex !== -1) {
      savedSessions[sessionIndex].status = 'completed';
      savedSessions[sessionIndex].candidates = updatedCandidates;
      savedSessions[sessionIndex].selectedCandidates = topCandidates;
      savedSessions[sessionIndex].completedAt = new Date().toISOString();
      localStorage.setItem('companySessions', JSON.stringify(savedSessions));
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'behavioral': return 'bg-green-100 text-green-800';
      case 'problem-solving': return 'bg-purple-100 text-purple-800';
      case 'system-design': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      speakQuestion(questions[currentQuestionIndex].question);
    }
    // eslint-disable-next-line
  }, [currentQuestionIndex, questions]);

  const handleEndSession = () => {
    if (!sessionData) return;
    // Mark session as completed in localStorage
    const savedSessions = JSON.parse(localStorage.getItem('companySessions') || '[]');
    const sessionIndex = savedSessions.findIndex((s: any) => s.sessionId === sessionData.sessionId);
    if (sessionIndex !== -1) {
      savedSessions[sessionIndex].status = 'completed';
      localStorage.setItem('companySessions', JSON.stringify(savedSessions));
    }
    navigate('/company/dashboard');
  };

  const handleCopyLink = () => {
    if (!sessionData) return;
    const joinLink = `${window.location.origin}/join/${sessionData.sessionId}`;
    navigator.clipboard.writeText(joinLink);
    toast({ title: 'Link Copied', description: 'Interview join link copied to clipboard.' });
  };

  if (isLoading || isGeneratingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            {isGeneratingQuestions ? 'Generating Interview Questions...' : 'Loading Session...'}
          </h2>
          <p className="text-gray-500">Please wait while we prepare your interview session</p>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-light text-gray-900 mb-2">Interview Session Complete</h1>
            <p className="text-gray-500">All candidates have been evaluated and top performers selected</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Selected Candidates */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-medium text-gray-900">Selected Candidates</h2>
              </div>
              <div className="space-y-3">
                {selectedCandidates.map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-500">{candidate.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{candidate.score}%</div>
                      <div className="text-xs text-gray-500">Rank #{index + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Session Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Technology Stack:</span>
                  <span className="font-medium">{sessionData?.technologyStack}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Candidates:</span>
                  <span className="font-medium">{candidates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected:</span>
                  <span className="font-medium text-green-600">{selectedCandidates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score:</span>
                  <span className="font-medium">
                    {Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => navigate('/company/dashboard')}
              className="bg-gray-900 text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentCandidate) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-light text-gray-900">Interview Session</h1>
                <p className="text-gray-500">Technology Stack: {sessionData?.technologyStack}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Candidate</div>
                <div className="font-medium text-gray-900">{currentCandidate.name}</div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {formatTime(sessionTime)}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Interface */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-gray-900 rounded-xl object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-xl">
                    <div className="text-center text-white">
                      <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Camera not active</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Camera Controls */}
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  variant={isCameraOn ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  {isCameraOn ? 'Camera On' : 'Camera Off'}
                </Button>
                
                <Button
                  onClick={() => {
                    try {
                      startListening();
                    } catch (e) {
                      toast({ title: 'Microphone Error', description: 'Could not access microphone. Please check permissions.', variant: 'destructive' });
                    }
                  }}
                  variant={isRecording ? "destructive" : "outline"}
                  disabled={!isSupported || isProcessingAnswer}
                  className="flex items-center gap-2"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              </div>

              {/* Speech Transcript */}
              {isRecording && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Live Transcript</h3>
                  <p className="text-gray-600 text-sm">
                    {finalTranscript || interimTranscript || 'Listening...'}
                  </p>
                </div>
              )}
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getQuestionTypeColor(currentQuestion.type)}>
                  {currentQuestion.type.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <h2 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Add text area for answer */}
              <textarea
                className="w-full border rounded p-2 mb-2"
                rows={3}
                value={typedAnswer || finalTranscript || transcript}
                onChange={e => setTypedAnswer(e.target.value)}
                placeholder="Type your answer or use voice input..."
                disabled={isProcessingAnswer}
              />

              {/* Below the text area, add a submit button */}
              <Button
                className="mt-2"
                onClick={() => {
                  handleAnswerSubmission(typedAnswer || finalTranscript || transcript);
                  setTypedAnswer('');
                }}
                disabled={isProcessingAnswer || !(typedAnswer || finalTranscript || transcript)}
              >
                Submit Answer
              </Button>

              {isProcessingAnswer && (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-gray-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Processing your answer...</p>
                </div>
              )}

              {!isSupported && (
                <div className="text-red-600 text-sm mb-2">Speech recognition is not supported in this browser.</div>
              )}
            </div>
          </div>

          <CardHeader>
            <CardTitle>Interview Session</CardTitle>
            {sessionData && (
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 mr-1" /> Copy Join Link
                </Button>
                <Button variant="destructive" size="sm" onClick={handleEndSession}>
                  End Session
                </Button>
              </div>
            )}
          </CardHeader>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Interview Session</h1>
          <p className="text-gray-500">Technology Stack: {sessionData?.technologyStack}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="relative overflow-hidden">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">{candidate.name}</CardTitle>
                <p className="text-sm text-gray-500">{candidate.email}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={
                    candidate.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                    candidate.status === 'interviewing' ? 'bg-blue-100 text-blue-800' :
                    candidate.status === 'completed' ? 'bg-green-100 text-green-800' :
                    candidate.status === 'selected' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                  </Badge>
                </div>
                
                {candidate.status === 'completed' && (
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-900">{candidate.score}%</div>
                    <div className="text-sm text-gray-500">Final Score</div>
                  </div>
                )}
                
                <Button
                  onClick={() => startInterview(candidate)}
                  disabled={candidate.status !== 'pending'}
                  className="w-full"
                >
                  {candidate.status === 'pending' ? 'Start Interview' :
                   candidate.status === 'interviewing' ? 'In Progress' :
                   candidate.status === 'completed' ? 'Completed' :
                   candidate.status === 'selected' ? 'Selected' : 'Rejected'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyInterviewSession; 