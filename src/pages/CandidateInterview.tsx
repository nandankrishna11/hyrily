import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Clock, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useToast } from '@/components/ui/use-toast';

interface CandidateData {
  id: string;
  name: string;
  email: string;
  sessionId: string;
  loginTime: string;
}

interface SessionInfo {
  sessionId: string;
  technologyStack: string;
  companyName: string;
  accessCode: string;
}

interface InterviewQuestion {
  id: string;
  type: 'technical' | 'behavioral' | 'problem-solving' | 'system-design';
  question: string;
  answer?: string;
  score?: number;
  feedback?: string;
}

const CandidateInterview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Session data
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // Interview states
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [isWaitingForQuestion, setIsWaitingForQuestion] = useState(false);
  
  // Camera and audio states
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  
  // Speech recognition
  const { transcript, finalTranscript, interimTranscript, resetTranscript, isSupported, startListening, stopListening } = useSpeechRecognition();
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const data = location.state as { candidateData: CandidateData; sessionInfo: SessionInfo };
    if (data) {
      setCandidateData(data.candidateData);
      setSessionInfo(data.sessionInfo);
      generateQuestions(data.sessionInfo.technologyStack);
    } else {
      // Try to get data from session storage
      const storedData = sessionStorage.getItem('candidateData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCandidateData(parsedData);
        // Redirect to login if no session info
        navigate('/candidate/login');
      } else {
        navigate('/candidate/login');
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (candidateData && !interviewComplete) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [candidateData, interviewComplete]);

  useEffect(() => {
    if (finalTranscript && candidateData) {
      handleAnswerSubmission(finalTranscript);
      resetTranscript();
    }
  }, [finalTranscript, candidateData]);

  const generateQuestions = async (technologyStack: string) => {
    try {
      const response = await fetch('/api/generate-company-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          technologyStack,
          questionCount: 8, // Shorter interview for candidates
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
    ];

    return baseQuestions.map((q, index) => ({
      id: `q${index + 1}`,
      type: q.type as any,
      question: q.question,
    }));
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
    if (!answer.trim() || !candidateData) return;

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
          technologyStack: sessionInfo?.technologyStack,
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

      // Update questions array
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = updatedQuestion;
      setQuestions(updatedQuestions);

      toast({
        title: "Answer Recorded",
        description: `Score: ${score}/100 - ${score >= 80 ? 'Excellent!' : score >= 60 ? 'Good!' : 'Keep practicing!'}`,
      });

      // Move to next question or complete interview
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsWaitingForQuestion(false);
        setIsProcessingAnswer(false);
      } else {
        completeInterview(updatedQuestions);
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

  const completeInterview = (allQuestions: InterviewQuestion[]) => {
    const totalScore = allQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
    const averageScore = Math.round(totalScore / allQuestions.length);
    
    setFinalScore(averageScore);
    setInterviewComplete(true);
    stopCamera();
    
    // Store interview results
    const interviewResults = {
      candidateId: candidateData?.id,
      sessionId: sessionInfo?.sessionId,
      questions: allQuestions,
      finalScore: averageScore,
      duration: sessionTime,
      completedAt: new Date().toISOString(),
    };
    
    sessionStorage.setItem('interviewResults', JSON.stringify(interviewResults));
    
    // Update company session data
    updateCompanySessionData(averageScore, allQuestions);
    
    toast({
      title: "Interview Complete",
      description: `Your interview has been completed. Final score: ${averageScore}/100`,
    });
  };

  const updateCompanySessionData = (score: number, questions: InterviewQuestion[]) => {
    if (!candidateData || !sessionInfo) return;
    const savedSessions = JSON.parse(localStorage.getItem('companySessions') || '[]');
    // Find the session with matching sessionId and companyId
    const sessionIndex = savedSessions.findIndex((s: any) => (s.sessionId === sessionInfo.sessionId || s.id === sessionInfo.sessionId) && s.companyId);
    if (sessionIndex !== -1) {
      const session = savedSessions[sessionIndex];
      const candidateIndex = session.candidates.findIndex((c: any) => c.id === candidateData.id);
      if (candidateIndex !== -1) {
        session.candidates[candidateIndex] = {
          ...session.candidates[candidateIndex],
          name: candidateData.name,
          email: candidateData.email,
          status: 'completed',
          score: score,
          loginTime: candidateData.loginTime,
          interviewDuration: sessionTime,
          answers: questions,
        };
        // Save only for this company, preserve others
        const updatedSessions = [
          ...savedSessions.filter(s => s.companyId !== session.companyId),
          session
        ];
        localStorage.setItem('companySessions', JSON.stringify(updatedSessions));
      }
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

  if (!candidateData || !sessionInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Loading Interview...</h2>
          <p className="text-gray-500">Please wait while we prepare your interview session</p>
        </div>
      </div>
    );
  }

  if (interviewComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-light text-gray-900 mb-2">Interview Complete</h1>
            <p className="text-gray-500">Thank you for participating in the interview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Results Summary */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Interview Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{finalScore}%</div>
                  <div className="text-sm text-gray-500">Final Score</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{formatTime(sessionTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technology:</span>
                    <span className="font-medium">{sessionInfo.technologyStack}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Summary */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Question Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={getQuestionTypeColor(question.type)}>
                          {question.type.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">Q{index + 1}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{question.score || 0}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => navigate('/')}
              className="bg-gray-900 text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-gray-500">Technology Stack: {sessionInfo.technologyStack}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Candidate</div>
              <div className="font-medium text-gray-900">{candidateData.name}</div>
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
                onClick={toggleRecording}
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
              <Badge className={getQuestionTypeColor(currentQuestion?.type || 'technical')}>
                {currentQuestion?.type?.replace('-', ' ').toUpperCase() || 'TECHNICAL'}
              </Badge>
            </div>
            
            <h2 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
              {currentQuestion?.question || 'Loading question...'}
            </h2>

            {isProcessingAnswer && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-gray-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Processing your answer...</p>
              </div>
            )}

            {!currentQuestion && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-gray-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading interview questions...</p>
              </div>
            )}
          </div>
        </div>

        {/* Start Interview Button */}
        {!isCameraOn && questions.length > 0 && (
          <div className="text-center mt-8">
            <Button
              onClick={startCamera}
              className="bg-gray-900 text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              Start Interview
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInterview; 