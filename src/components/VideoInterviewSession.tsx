import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import InterviewFeedbackReport from './InterviewFeedbackReport';

interface VideoInterviewSessionProps {
  sessionId: string;
  onEndSession: () => void;
}

interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
}

const VideoInterviewSession = ({ sessionId, onEndSession }: VideoInterviewSessionProps) => {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{[key: number]: {response: string, score: number}}>({});
  const [sessionTime, setSessionTime] = useState(0);
  const [showFeedbackReport, setShowFeedbackReport] = useState(false);
  
  // Camera and audio states
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isListeningContinuously, setIsListeningContinuously] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  
  // Speech recognition
  const { transcript, finalTranscript, interimTranscript, resetTranscript, isSupported, startListening, stopListening } = useSpeechRecognition();
  const { toast } = useToast();
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const speechProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Interview questions
  const interviewQuestions: InterviewQuestion[] = [
    {
      id: 1,
      question: "Tell me about a challenging frontend project you worked on and how you overcame technical obstacles.",
      category: "Experience"
    },
    {
      id: 2,
      question: "How do you approach performance optimization in React applications?",
      category: "Technical"
    },
    {
      id: 3,
      question: "Describe your experience with state management in large applications.",
      category: "Architecture"
    },
    {
      id: 4,
      question: "How do you ensure accessibility in your frontend applications?",
      category: "Best Practices"
    },
    {
      id: 5,
      question: "What's your approach to testing frontend components?",
      category: "Testing"
    }
  ];

  // Handle speech input
  const handleSpeechInput = async (speechText: string) => {
    if (!speechText.trim()) return;
    
    setIsProcessingAudio(true);
    setIsListeningContinuously(false);
    stopListening();
    
    try {
      const score = await generateScore(interviewQuestions[currentQuestionIndex].question, speechText);
      
      setResponses(prev => ({
        ...prev,
        [currentQuestionIndex]: {
          response: speechText,
          score: score
        }
      }));
      
      toast({
        title: "Response Recorded",
        description: `Score: ${score}/5 - ${score >= 4 ? 'Excellent!' : score >= 3 ? 'Good!' : 'Keep practicing!'}`,
      });
      
      // Move to next question or end interview
      if (currentQuestionIndex < interviewQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsWaitingForResponse(false);
        setIsProcessingAudio(false);
      } else {
        // End interview
        endInterviewAndShowReport();
      }
    } catch (error) {
      console.error('Error processing speech:', error);
      setIsProcessingAudio(false);
      toast({
        title: "Error",
        description: "Failed to process your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  // End interview and show report
  const endInterviewAndShowReport = async () => {
    try {
      await supabase
        .from('user_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          responses: responses,
          scores: Object.fromEntries(
            Object.entries(responses).map(([key, value]) => [key, value.score])
          )
        })
        .eq('id', sessionId);
      
      setShowFeedbackReport(true);
    } catch (error) {
      console.error('Error ending interview:', error);
      toast({
        title: "Error",
        description: "Failed to save interview results.",
        variant: "destructive",
      });
    }
  };

  // Start camera
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
        title: "Camera & Microphone Ready",
        description: "Your camera and microphone are now active. Speech recognition is ready.",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera/microphone. Please check permissions and try again.",
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

  const speakQuestion = async (questionText: string) => {
    setIsAISpeaking(true);
    setIsWaitingForResponse(false);
    
    try {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(questionText);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          setIsAISpeaking(false);
          setIsWaitingForResponse(true);
          console.log('AI finished speaking, candidate can now respond');
        };

        utterance.onerror = () => {
          setIsAISpeaking(false);
          setIsWaitingForResponse(true);
          console.log('Speech synthesis error, candidate can now respond');
        };

        speechSynthesis.speak(utterance);
      } else {
        setIsAISpeaking(false);
        setIsWaitingForResponse(true);
      }
    } catch (error) {
      console.error('Error speaking question:', error);
      setIsAISpeaking(false);
      setIsWaitingForResponse(true);
    }
  };

  const startRecording = () => {
    if (!isSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (!isMicOn) {
      toast({
        title: "Microphone Required",
        description: "Please enable your microphone first.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting recording...');
    resetTranscript();
    setIsRecording(true);
    setIsProcessingAudio(false);
    startListening();
    
    toast({
      title: "Recording Started",
      description: "Hyrily is now listening to your response. Speak clearly.",
    });
  };

  const stopRecording = async () => {
    setIsRecording(false);
    stopListening();
    
    if (transcript.trim()) {
      await handleSpeechInput(transcript.trim());
    }
  };

  // Generate score for response
  const generateScore = async (question: string, response: string): Promise<number> => {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          question: question,
          response: response,
          task: 'score_response'
        }
      });

      if (error) throw error;
      
      // Parse score from response (assuming it returns a number 1-5)
      const score = parseInt(data?.score || '3');
      return Math.max(1, Math.min(5, score)); // Ensure score is between 1-5
    } catch (error) {
      console.error('Error generating score:', error);
      return 3; // Default score
    }
  };

  // Generate next question based on previous response
  const generateNextQuestion = async (previousResponse: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          previousResponse: previousResponse,
          task: 'generate_next_question'
        }
      });

      if (error) throw error;
      
      return data?.question || interviewQuestions[currentQuestionIndex + 1]?.question || "Thank you for your response.";
    } catch (error) {
      console.error('Error generating next question:', error);
      return interviewQuestions[currentQuestionIndex + 1]?.question || "Thank you for your response.";
    }
  };

  const submitResponse = async (responseText: string) => {
    if (!responseText.trim()) return;
    
    setIsProcessingAudio(true);
    setIsWaitingForResponse(false);
    
    try {
      const score = await generateScore(interviewQuestions[currentQuestionIndex].question, responseText);
      
      setResponses(prev => ({
        ...prev,
        [currentQuestionIndex]: {
          response: responseText,
          score: score
        }
      }));
      
      toast({
        title: "Response Submitted",
        description: `Score: ${score}/5 - ${score >= 4 ? 'Excellent!' : score >= 3 ? 'Good!' : 'Keep practicing!'}`,
      });
      
      // Move to next question or end interview
      if (currentQuestionIndex < interviewQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsWaitingForResponse(false);
        setIsProcessingAudio(false);
      } else {
        // End interview
        endInterviewAndShowReport();
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      setIsProcessingAudio(false);
      toast({
        title: "Error",
        description: "Failed to submit your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startContinuousListening = () => {
    if (!isSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (!isMicOn) {
      toast({
        title: "Microphone Required",
        description: "Please enable your microphone first.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting continuous listening for Hyrily...');
    resetTranscript();
    setIsListeningContinuously(true);
    setIsRecording(false);
    setIsProcessingAudio(false);
    startListening();
    
    toast({
      title: "Hyrily is Listening",
      description: "Speak naturally - Hyrily will process your responses in real-time.",
    });
  };

  const stopContinuousListening = () => {
    console.log('Stopping continuous listening...');
    setIsListeningContinuously(false);
    stopListening();
    
    if (speechProcessingTimeoutRef.current) {
      clearTimeout(speechProcessingTimeoutRef.current);
    }
    
    toast({
      title: "Listening Stopped",
      description: "Hyrily has stopped real-time listening.",
    });
  };

  // Auto-start interview when component mounts
  useEffect(() => {
    const initializeInterview = async () => {
      await startCamera();
      setInterviewStarted(true);
      setTimeout(() => {
        speakQuestion(interviewQuestions[0].question);
        // Auto-start continuous listening after AI speaks
        setTimeout(() => {
          startContinuousListening();
        }, 2000);
      }, 1000);
    };
    
    initializeInterview();
  }, []);

  useEffect(() => {
    if (interviewStarted && currentQuestionIndex > 0 && currentQuestionIndex < interviewQuestions.length) {
      setTimeout(() => {
        speakQuestion(interviewQuestions[currentQuestionIndex].question);
      }, 1000);
    }
  }, [currentQuestionIndex, interviewStarted]);

  // Session timer
  useEffect(() => {
    if (interviewStarted && !showFeedbackReport) {
      const timer = setInterval(() => {
        setSessionTime(prev => {
          if (prev >= 120) { // 2 minutes
            endInterviewAndShowReport();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [interviewStarted, showFeedbackReport]);

  // Process continuous speech input
  useEffect(() => {
    if (isListeningContinuously && finalTranscript && finalTranscript !== transcript) {
      if (speechProcessingTimeoutRef.current) {
        clearTimeout(speechProcessingTimeoutRef.current);
      }
      
      speechProcessingTimeoutRef.current = setTimeout(() => {
        handleSpeechInput(finalTranscript);
      }, 2000); // Wait 2 seconds after user stops speaking
    }
  }, [finalTranscript, isListeningContinuously]);

  // Show feedback report
  if (showFeedbackReport) {
    return (
      <InterviewFeedbackReport 
        sessionId={sessionId}
        responses={responses}
        onBackToHome={onEndSession}
      />
    );
  }

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(responses).length;
  const averageScore = answeredCount > 0 
    ? Object.values(responses).reduce((sum, r) => sum + r.score, 0) / answeredCount 
    : 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current transcript to display
  const displayTranscript = () => {
    if (isListeningContinuously || isListening) {
      if (interimTranscript) {
        return finalTranscript + ' ' + interimTranscript;
      }
      return finalTranscript || transcript || 'Listening for your voice...';
    }
    return finalTranscript || transcript || '';
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-animated-slow opacity-5"></div>
      {/* Floating Particles */}
      <div className="absolute inset-0 particles"></div>
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse-slow float-delay-1"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl animate-pulse-slow float-delay-2"></div>

      <div className="relative z-10 grid lg:grid-cols-2 h-screen">
        {/* Left Side - AI Interviewer */}
        <div className="bg-white flex flex-col items-center justify-center p-8 relative">
          <div className="text-center space-y-6">
            {/* AI Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 mx-auto flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">H</span>
                </div>
              </div>
              {/* Audio waveform effect */}
              {isAISpeaking && (
                <div className="absolute -left-8 -right-8 top-1/2 transform -translate-y-1/2 flex items-center justify-center space-x-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-orange-400 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 40 + 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">Hyrily AI Interviewer</h2>
              <Badge className="mt-2 bg-orange-100 text-orange-800">{currentQuestion.category}</Badge>
            </div>

            {/* Current Question */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-lg max-w-md border border-gray-200">
              <p className="text-gray-700 leading-relaxed font-medium">
                {currentQuestion.question}
              </p>
            </div>

            {/* Session Timer */}
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-lg font-bold text-gray-800">
                {formatTime(sessionTime)} / 02:00
              </span>
            </div>

            {/* Enhanced Status */}
            <div className="flex items-center justify-center space-x-2">
              <div className="flex items-center space-x-2">
                {isAISpeaking ? (
                  <>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-gray-600">Hyrily is Speaking</span>
                  </>
                ) : isListeningContinuously ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-gray-600">Hyrily is listening continuously...</span>
                  </>
                ) : isRecording ? (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-gray-600">Recording specific response...</span>
                  </>
                ) : isListening ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-gray-600">Processing speech...</span>
                  </>
                ) : isWaitingForResponse ? (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-gray-600">Ready for your response</span>
                  </>
                ) : isProcessingAudio ? (
                  <>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-gray-600">Analyzing your response...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span className="text-gray-500">Waiting...</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Candidate Video */}
        <div className="bg-[#1f1e35] flex flex-col relative overflow-hidden">
          {/* Holographic Effect */}
          <div className="absolute inset-0 holographic"></div>
          
          {/* Top Stats Bar */}
          <div className="bg-black/50 p-4 flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{Math.floor(sessionTime / 60)}</div>
                <div className="text-xs text-gray-400">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{answeredCount}</div>
                <div className="text-xs text-gray-400">ANSWERED</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{averageScore.toFixed(1)}</div>
                <div className="text-xs text-gray-400">AVG SCORE</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={endInterviewAndShowReport} 
              className="border-white/20 text-white hover:bg-white/10"
            >
              End Interview
            </Button>
          </div>

          {/* Video Area */}
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {!isCameraOn && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Camera is off</p>
                </div>
              </div>
            )}

            {/* Enhanced live transcript overlay */}
            {(isListeningContinuously || isRecording || isListening) && (
              <div className="absolute bottom-20 left-4 right-4 bg-black/90 rounded-lg p-4 max-h-32 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 font-semibold text-sm">
                    {isListeningContinuously ? '🎤 Live Transcript (Hyrily is listening):' 
                     : isRecording ? '🔴 Recording Transcript:' 
                     : '🔄 Processing...'}
                  </span>
                  {isListeningContinuously && (
                    <span className="text-xs text-gray-400">Real-time mode</span>
                  )}
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {displayTranscript() || "Speak clearly into your microphone..."}
                </p>
                {interimTranscript && (
                  <p className="text-yellow-300 text-xs mt-1 italic">
                    Interim: {interimTranscript}
                  </p>
                )}
              </div>
            )}

            {/* Control Buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* Continuous Listen Button */}
                <Button
                  onClick={isListeningContinuously ? stopContinuousListening : startContinuousListening}
                  disabled={isAISpeaking || !isMicOn || isRecording}
                  className={`rounded-full px-4 py-2 ${
                    isListeningContinuously 
                      ? 'bg-green-600 hover:bg-green-700 animate-pulse' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                  size="sm"
                >
                  {isListeningContinuously ? 'Stop Listening' : 'Start Listening'}
                </Button>

                {/* Record Button */}
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!isWaitingForResponse || isAISpeaking || !isMicOn || isProcessingAudio}
                  className={`rounded-full px-6 py-3 ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                  size="lg"
                >
                  {isRecording ? 'Stop Recording' : 'Record Answer'}
                </Button>
              </div>

              {/* Camera Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (isCameraOn) {
                    stopCamera();
                  } else {
                    startCamera();
                  }
                }}
                className={`rounded-full w-12 h-12 ${isCameraOn ? 'bg-white text-black' : 'bg-red-500 text-white'}`}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoInterviewSession;
