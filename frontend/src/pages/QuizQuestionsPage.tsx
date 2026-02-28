import React, { useState } from 'react';
import { useGetRandomQuestions, useSubmitQuizAnswers } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Brain } from 'lucide-react';
import { toast } from 'sonner';
import type { Sector } from '../backend';

// Comprehensive question bank per sector
const SECTOR_QUESTIONS: Record<string, { text: string; answers: string[] }[]> = {
  '1': [
    { text: 'How comfortable are you with learning new programming languages?', answers: ['Very comfortable', 'Somewhat comfortable', 'Neutral', 'Not comfortable'] },
    { text: 'Do you enjoy solving complex logical puzzles?', answers: ['Love it', 'Enjoy it', "It's okay", 'Not really'] },
    { text: 'How interested are you in building software applications?', answers: ['Extremely interested', 'Very interested', 'Somewhat interested', 'Not interested'] },
    { text: 'Do you prefer working with data and analytics?', answers: ['Yes, love data', 'Somewhat', 'Neutral', 'Prefer other areas'] },
    { text: 'How do you feel about cybersecurity and protecting systems?', answers: ['Passionate about it', 'Interested', 'Neutral', 'Not my area'] },
    { text: 'Are you interested in artificial intelligence and machine learning?', answers: ['Extremely', 'Very much', 'Somewhat', 'Not really'] },
    { text: 'Do you enjoy designing user interfaces and experiences?', answers: ['Love design', 'Enjoy it', "It's okay", 'Prefer backend'] },
    { text: 'How interested are you in cloud computing and infrastructure?', answers: ['Very interested', 'Interested', 'Neutral', 'Not interested'] },
    { text: 'Do you like working on mobile app development?', answers: ['Yes, love it', 'Interested', 'Neutral', 'Prefer web'] },
    { text: 'How do you feel about working in agile/scrum teams?', answers: ['Love teamwork', 'Enjoy it', 'Neutral', 'Prefer solo'] },
    { text: 'Are you interested in blockchain and Web3 technologies?', answers: ['Very interested', 'Somewhat', 'Neutral', 'Not interested'] },
    { text: 'Do you enjoy automating repetitive tasks?', answers: ['Love automation', 'Yes', 'Sometimes', 'Not really'] },
    { text: 'How comfortable are you with mathematics and algorithms?', answers: ['Very comfortable', 'Comfortable', 'Neutral', 'Challenging'] },
    { text: 'Are you interested in game development?', answers: ['Passionate', 'Interested', 'Neutral', 'Not my thing'] },
    { text: 'Do you prefer frontend, backend, or full-stack development?', answers: ['Frontend', 'Backend', 'Full-stack', 'DevOps/Infrastructure'] },
  ],
  '2': [
    { text: 'How passionate are you about helping people with their health?', answers: ['Extremely passionate', 'Very passionate', 'Somewhat', 'Not sure'] },
    { text: 'Are you comfortable working in high-pressure medical environments?', answers: ['Very comfortable', 'Comfortable', 'Somewhat', 'Not comfortable'] },
    { text: 'Do you have interest in medical research and innovation?', answers: ['Very interested', 'Interested', 'Neutral', 'Not interested'] },
    { text: 'How do you feel about patient care and bedside manner?', answers: ['Love patient interaction', 'Enjoy it', 'Neutral', 'Prefer lab work'] },
    { text: 'Are you interested in mental health and psychology?', answers: ['Very interested', 'Interested', 'Somewhat', 'Not my area'] },
    { text: 'Do you prefer clinical work or administrative healthcare roles?', answers: ['Clinical', 'Administrative', 'Both', 'Research'] },
    { text: 'How interested are you in public health and epidemiology?', answers: ['Very interested', 'Interested', 'Neutral', 'Not interested'] },
    { text: 'Are you drawn to surgical or procedural specialties?', answers: ['Very drawn', 'Somewhat', 'Neutral', 'Prefer non-surgical'] },
    { text: 'Do you enjoy working with medical technology and devices?', answers: ['Love it', 'Enjoy it', 'Neutral', 'Prefer direct care'] },
    { text: 'How do you feel about long shifts and irregular hours?', answers: ['Fine with it', 'Can manage', 'Prefer regular hours', 'Not ideal'] },
    { text: 'Are you interested in nutrition and preventive medicine?', answers: ['Very interested', 'Interested', 'Neutral', 'Not interested'] },
    { text: 'Do you want to specialize in pediatrics or geriatrics?', answers: ['Pediatrics', 'Geriatrics', 'Both', 'Neither'] },
    { text: 'How comfortable are you with continuous learning and certifications?', answers: ['Love learning', 'Comfortable', 'Neutral', 'Challenging'] },
    { text: 'Are you interested in telemedicine and digital health?', answers: ['Very interested', 'Interested', 'Neutral', 'Prefer in-person'] },
    { text: 'Do you prefer working in hospitals, clinics, or community health?', answers: ['Hospitals', 'Clinics', 'Community', 'Research institutions'] },
  ],
  default: [
    { text: 'What type of work environment do you prefer?', answers: ['Office/Corporate', 'Remote/Flexible', 'Field/Outdoor', 'Creative Studio'] },
    { text: 'How do you prefer to work?', answers: ['Independently', 'In a team', 'Mix of both', 'Leading a team'] },
    { text: 'What motivates you most in a career?', answers: ['Financial reward', 'Making an impact', 'Creative expression', 'Intellectual challenge'] },
    { text: 'How important is work-life balance to you?', answers: ['Extremely important', 'Very important', 'Somewhat important', 'Career comes first'] },
    { text: 'What type of problems do you enjoy solving?', answers: ['Technical problems', 'People problems', 'Creative challenges', 'Strategic challenges'] },
    { text: 'How do you feel about continuous learning?', answers: ['Love it', 'Enjoy it', "It's necessary", 'Prefer stability'] },
    { text: 'What is your preferred communication style?', answers: ['Written', 'Verbal/Presentations', 'Visual/Design', 'Data/Analytics'] },
    { text: 'How do you handle ambiguity and uncertainty?', answers: ['Thrive in it', 'Manage well', 'Prefer structure', 'Need clear direction'] },
    { text: 'What type of impact do you want to make?', answers: ['Social impact', 'Economic impact', 'Technological impact', 'Cultural impact'] },
    { text: 'How important is job security to you?', answers: ['Very important', 'Important', 'Somewhat', 'Willing to take risks'] },
    { text: 'Do you prefer working with people, data, or things?', answers: ['People', 'Data', 'Things/Objects', 'Ideas/Concepts'] },
    { text: 'What is your ideal career growth path?', answers: ['Technical expert', 'Management/Leadership', 'Entrepreneurship', 'Research/Academia'] },
    { text: 'How do you feel about travel for work?', answers: ['Love to travel', 'Occasional travel is fine', 'Prefer local', 'No travel'] },
    { text: 'What industry excites you most?', answers: ['Technology', 'Healthcare', 'Finance', 'Creative/Media'] },
    { text: 'How do you prefer to measure success?', answers: ['Revenue/Profit', 'Lives impacted', 'Innovation created', 'Knowledge gained'] },
  ],
};

export default function QuizQuestionsPage() {
  const params = new URLSearchParams(window.location.search);
  const sectorIdStr = params.get('sectorId') || '1';
  const sectorName = params.get('sectorName') || 'Technology';
  const sectorDescription = params.get('sectorDescription') || 'Interest in technology and computers';

  const sectorId = BigInt(sectorIdStr);

  // Build the full Sector object required by the backend
  const sector: Sector = {
    id: sectorId,
    name: sectorName,
    description: sectorDescription,
  };

  const { data: backendQuestions, isLoading } = useGetRandomQuestions(15);
  const { mutateAsync: submitQuiz, isPending: isSubmitting } = useSubmitQuizAnswers();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Use sector-specific questions or default
  const localQuestions = SECTOR_QUESTIONS[sectorIdStr] || SECTOR_QUESTIONS.default;

  // Merge backend questions with local ones — prefer local for richer content
  const allQuestions = React.useMemo(() => {
    void backendQuestions;
    return localQuestions.slice(0, 15);
  }, [backendQuestions, localQuestions]);

  const totalQuestions = allQuestions.length;
  const currentQuestion = allQuestions[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const selectedAnswer = answers[currentIndex];

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: answerIndex }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const answersBigInt = allQuestions.map((_, i) => BigInt(answers[i] ?? 0));
    try {
      const result = await submitQuiz({ sector, answers: answersBigInt });
      // Store result for dashboard
      sessionStorage.setItem(
        'lastQuizResult',
        JSON.stringify({
          userId: result.userId,
          sector: { ...result.sector, id: result.sector.id.toString() },
          answers: result.answers.map((a) => a.toString()),
          timestamp: result.timestamp.toString(),
        })
      );
      sessionStorage.setItem('selectedSectorId', sectorIdStr);
      toast.success('Quiz submitted! Generating your recommendations...');
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      // Show a meaningful error — strip verbose canister trap prefix if present
      const displayMessage = message.includes('Unauthorized')
        ? 'You must be logged in to submit the quiz.'
        : 'Failed to submit quiz. Please try again.';
      toast.error(displayMessage);
    }
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Skeleton className="h-4 w-full mb-8 rounded-full" />
          <Skeleton className="h-48 w-full rounded-2xl mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-sm text-foreground">Interest Quiz</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}% complete</p>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="border-2 border-border shadow-sm mb-6 animate-fade-in" key={currentIndex}>
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Question {currentIndex + 1}
                </span>
                <h2 className="font-display font-bold text-xl text-foreground mt-2 leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.answers.map((answer, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 ${
                      selectedAnswer === idx
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/40 hover:bg-accent/50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedAnswer === idx
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/40'
                      }`}
                    >
                      {selectedAnswer === idx && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        selectedAnswer === idx ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {answer}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === undefined || isSubmitting}
              className="gradient-purple text-white font-semibold px-8 h-11 shadow-purple hover:shadow-purple-lg transition-all rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === undefined}
              className="gradient-purple text-white font-semibold px-8 h-11 shadow-purple hover:shadow-purple-lg transition-all rounded-xl"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Answer progress dots */}
        <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
          {allQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-primary scale-125'
                  : answers[i] !== undefined
                  ? 'bg-primary/40'
                  : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
