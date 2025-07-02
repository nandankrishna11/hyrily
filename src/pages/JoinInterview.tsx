import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Simple auth check (reuse logic from CandidateLogin)
const getStudent = () => {
  return JSON.parse(localStorage.getItem('studentUser') || 'null');
};

const JoinInterview: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const location = useLocation();
  const [student, setStudent] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const { transcript, finalTranscript, resetTranscript, startListening, stopListening, isSupported } = useSpeechRecognition();
  const [answers, setAnswers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState<number | null>(null);

  // Require login
  useEffect(() => {
    const user = getStudent();
    if (!user) {
      navigate('/candidate-login', { state: { from: location.pathname } });
    } else {
      setStudent(user);
    }
  }, [navigate, location.pathname]);

  // Fetch questions for the session
  useEffect(() => {
    if (sessionId) {
      // For demo, load from localStorage (should be from API in prod)
      const sessions = JSON.parse(localStorage.getItem('companySessions') || '[]');
      const session = sessions.find((s: any) => s.sessionId === sessionId || s.id === sessionId);
      if (session && session.questions) {
        setQuestions(session.questions);
      } else if (session && session.technologyStack) {
        // fallback: generate questions
        fetch('/api/generate-company-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ technologyStack: session.technologyStack, questionCount: 12 })
        })
          .then(res => res.json())
          .then(data => setQuestions(data.questions || []));
      }
    }
  }, [sessionId]);

  // Text-to-speech for question
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const text = questions[currentQuestionIndex].question || '';
      if ('speechSynthesis' in window) {
        const utterance = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
    }
    // eslint-disable-next-line
  }, [currentQuestionIndex, questions]);

  // Handle answer submission
  const handleSubmit = async () => {
    if (!questions.length) return;
    const currentQ = questions[currentQuestionIndex];
    const userAnswer = answer || transcript;
    if (!userAnswer) return;
    setIsSubmitting(true);
    setFeedback('');
    setScore(null);
    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question || currentQ.text,
          answer: userAnswer,
          questionType: currentQ.type,
          technologyStack: currentQ.technologyStack || (sessionId ? (JSON.parse(localStorage.getItem('companySessions')||'[]').find((s:any)=>s.sessionId===sessionId||s.id===sessionId)?.technologyStack) : '')
        })
      });
      const data = await res.json();
      setScore(data.score);
      setFeedback(data.feedback);
      setAnswers(prev => [...prev, { question: currentQ.question || currentQ.text, answer: userAnswer, score: data.score, feedback: data.feedback }]);
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(i => i + 1);
          setAnswer('');
          resetTranscript();
          setFeedback('');
          setScore(null);
        } else {
          setIsComplete(true);
          // Save answers to localStorage for company review
          const sessions = JSON.parse(localStorage.getItem('companySessions') || '[]');
          const sessionIdx = sessions.findIndex((s:any)=>s.sessionId===sessionId||s.id===sessionId);
          if (sessionIdx !== -1) {
            const candidateId = student?.id || `student-${Date.now()}`;
            if (!sessions[sessionIdx].candidates) sessions[sessionIdx].candidates = [];
            const existing = sessions[sessionIdx].candidates.find((c:any)=>c.id===candidateId);
            if (existing) {
              existing.answers = answers;
              existing.score = answers.reduce((sum,a)=>sum+a.score,0)/answers.length;
            } else {
              sessions[sessionIdx].candidates.push({
                id: candidateId,
                name: student?.name,
                email: student?.email,
                status: 'completed',
                answers,
                score: answers.reduce((sum,a)=>sum+a.score,0)/answers.length
              });
            }
            localStorage.setItem('companySessions', JSON.stringify(sessions));
          }
        }
        setIsSubmitting(false);
      }, 1200);
    } catch (e) {
      setFeedback('Error evaluating answer. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Voice input
  useEffect(() => {
    if (finalTranscript) {
      setAnswer(finalTranscript);
      resetTranscript();
    }
  }, [finalTranscript, resetTranscript]);

  if (!student) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle>Join Interview</CardTitle>
        </CardHeader>
        <CardContent>
          {isComplete ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Thank you for participating!</h2>
              <Button onClick={() => navigate('/')}>Go Home</Button>
            </div>
          ) : questions.length > 0 ? (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/public/avatar-interviewer.png" alt="AI Interviewer" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-700 font-medium">Interviewer</span>
                </div>
                <div className="text-lg font-medium mb-2">Question {currentQuestionIndex + 1} of {questions.length}</div>
                <div className="text-xl font-semibold mb-4">{questions[currentQuestionIndex].question}</div>
              </div>
              <textarea
                className="w-full border rounded p-2 mb-2"
                rows={3}
                value={answer || transcript}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer or use voice input..."
                disabled={isSubmitting}
              />
              {isSupported && (
                <Button variant="outline" className="mr-2" onClick={startListening} disabled={isSubmitting}>Start Voice</Button>
              )}
              <Button onClick={handleSubmit} className="ml-2" disabled={isSubmitting}>Submit</Button>
              {score !== null && (
                <div className="mt-2 text-green-700 font-semibold">Score: {score}</div>
              )}
              {feedback && (
                <div className="mt-1 text-gray-600 text-sm">Feedback: {feedback}</div>
              )}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">Progress: {currentQuestionIndex + 1}/{questions.length}</div>
                <Button variant="destructive" onClick={() => setIsComplete(true)}>End Interview</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">Loading questions...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinInterview; 