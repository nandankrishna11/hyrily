import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuestionSelectorProps {
  onQuestionsSelected: (questions: any[]) => void;
  onStartInterview: () => void;
}

interface Question {
  id: string;
  question_text: string;
  industry: string;
  difficulty_level: number;
  question_type: string;
  tags: string[];
  expected_answer_framework: string;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({ onQuestionsSelected, onStartInterview }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    type: 'all',
    industry: 'all',
    tags: [] as string[]
  });
  const { toast } = useToast();

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, filters]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .order('difficulty_level');

      if (error) throw error;

      setQuestions(data || []);
      setFilteredQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Error",
        description: "Failed to load interview questions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = questions;

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty_level === parseInt(filters.difficulty));
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(q => q.question_type === filters.type);
    }

    if (filters.industry !== 'all') {
      filtered = filtered.filter(q => q.industry === filters.industry);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(q => 
        q.tags && q.tags.some(tag => filters.tags.includes(tag))
      );
    }

    setFilteredQuestions(filtered);
  };

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredQuestions.map(q => q.id);
    setSelectedQuestions(visibleIds);
  };

  const clearSelection = () => {
    setSelectedQuestions([]);
  };

  const handleStartInterview = () => {
    if (selectedQuestions.length === 0) {
      toast({
        title: "No Questions Selected",
        description: "Please select at least one question to start the interview.",
        variant: "destructive",
      });
      return;
    }

    const selectedQuestionsData = questions.filter(q => selectedQuestions.includes(q.id));
    onQuestionsSelected(selectedQuestionsData);
    onStartInterview();
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'behavioral': return 'bg-indigo-100 text-indigo-800';
      case 'situational': return 'bg-pink-100 text-pink-800';
      case 'system-design': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-medium-gray">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Customize Your Interview</CardTitle>
            <p className="text-medium-gray">Select questions based on your preferences and skill level</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="1">Beginner (1)</SelectItem>
                    <SelectItem value="2">Intermediate (2)</SelectItem>
                    <SelectItem value="3">Advanced (3)</SelectItem>
                    <SelectItem value="4">Expert (4)</SelectItem>
                    <SelectItem value="5">Leadership (5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Question Type</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="situational">Situational</SelectItem>
                    <SelectItem value="system-design">System Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry Focus</Label>
                <Select value={filters.industry} onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="frontend">Frontend Engineering</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={selectAllVisible} size="sm">
                    Select All
                  </Button>
                  <Button variant="outline" onClick={clearSelection} size="sm">
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-medium-gray">
                Showing {filteredQuestions.length} questions ({selectedQuestions.length} selected)
              </p>
              <Button 
                onClick={handleStartInterview}
                disabled={selectedQuestions.length === 0}
                className="bg-accent hover:bg-accent/90"
              >
                Start Interview with {selectedQuestions.length} Questions
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredQuestions.map((question) => (
            <Card 
              key={question.id} 
              className={`cursor-pointer transition-all ${
                selectedQuestions.includes(question.id) 
                  ? 'ring-2 ring-accent bg-accent/5' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => toggleQuestion(question.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    checked={selectedQuestions.includes(question.id)}
                    onChange={() => toggleQuestion(question.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getDifficultyColor(question.difficulty_level)}>
                        Level {question.difficulty_level}
                      </Badge>
                      <Badge className={getTypeColor(question.question_type)}>
                        {question.question_type}
                      </Badge>
                      {question.industry !== 'general' && (
                        <Badge variant="outline">
                          {question.industry}
                        </Badge>
                      )}
                    </div>
                    <p className="text-dark-gray mb-2">{question.question_text}</p>
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {question.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {question.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{question.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-medium-gray">No questions match your current filters. Try adjusting your selection criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionSelector; 