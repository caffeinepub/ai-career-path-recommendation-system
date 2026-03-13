import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Loader2,
  Trophy,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  ALL_ASSESSMENT_CATEGORIES,
  ASSESSMENT_QUESTIONS,
  useUpdateAssessmentResult,
} from "../hooks/useQueries";

type TestState = "intro" | "testing" | "results";

export default function AssessmentTestPage() {
  const pathParts = window.location.pathname.split("/");
  const assessmentId = decodeURIComponent(
    pathParts[pathParts.length - 1] || "",
  );

  const category = ALL_ASSESSMENT_CATEGORIES.find((c) => c.id === assessmentId);
  const questions =
    ASSESSMENT_QUESTIONS[assessmentId] || ASSESSMENT_QUESTIONS.programming;

  const [testState, setTestState] = useState<TestState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  const { mutateAsync: saveResult, isPending: isSaving } =
    useUpdateAssessmentResult();

  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const selectedAnswer = answers[currentIndex];

  const handleAnswer = (idx: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: idx }));
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
    // Calculate score
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const finalScore = Math.round((correct / totalQuestions) * 100);
    setScore(finalScore);

    try {
      await saveResult({
        assessmentId,
        assessmentName: category?.name || assessmentId,
        score: finalScore,
      });
      setTestState("results");
    } catch {
      toast.error("Failed to save results. Please try again.");
    }
  };

  const getScoreLevel = (
    s: number,
  ): { label: string; color: string; bg: string } => {
    if (s >= 80)
      return { label: "Expert", color: "text-green-700", bg: "bg-green-100" };
    if (s >= 60)
      return { label: "Proficient", color: "text-blue-700", bg: "bg-blue-100" };
    if (s >= 40)
      return {
        label: "Developing",
        color: "text-yellow-700",
        bg: "bg-yellow-100",
      };
    return { label: "Beginner", color: "text-orange-700", bg: "bg-orange-100" };
  };

  const scoreLevel = getScoreLevel(score);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Intro screen
  if (testState === "intro") {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <Button
            variant="ghost"
            onClick={() => {
              window.location.href = "/skill-assessment";
            }}
            className="mb-6 flex items-center gap-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assessments
          </Button>

          <Card className="border-2 border-border shadow-sm animate-fade-in">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center mx-auto shadow-purple text-3xl">
                {category?.icon || "📝"}
              </div>

              <div>
                <h1 className="font-display font-bold text-2xl text-foreground mb-2">
                  {category?.name || "Skill Assessment"}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {category?.description ||
                    "Test your knowledge and skills in this area."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <p className="font-bold text-lg text-foreground">
                    {totalQuestions}
                  </p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-foreground">~5 min</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-foreground">MCQ</p>
                  <p className="text-xs text-muted-foreground">Format</p>
                </div>
              </div>

              <div className="text-left bg-muted/50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Instructions:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Each question has one correct answer</li>
                  <li>• You can navigate back to change answers</li>
                  <li>• Your score will be saved to your profile</li>
                  <li>• Results help improve your job recommendations</li>
                </ul>
              </div>

              <Button
                onClick={() => setTestState("testing")}
                className="w-full h-12 bg-primary text-primary-foreground font-semibold shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all rounded-xl"
              >
                <Award className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results screen
  if (testState === "results") {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <Card className="border-2 border-border shadow-sm animate-fade-in">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 gradient-purple rounded-full flex items-center justify-center mx-auto shadow-purple">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <div>
                <h2 className="font-display font-bold text-2xl text-foreground mb-1">
                  <span style={{ color: "oklch(60% 0.22 285)" }}>
                    Assessment
                  </span>{" "}
                  Complete!
                </h2>
                <p className="text-muted-foreground text-sm">
                  {category?.name} — Your results have been saved
                </p>
              </div>

              {/* Score display */}
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                <p
                  className="text-5xl font-display font-bold mb-2"
                  style={{ color: "oklch(38% 0.22 278)" }}
                >
                  {score}%
                </p>
                <Badge
                  variant="secondary"
                  className={`${scoreLevel.bg} ${scoreLevel.color} border-0 text-sm px-4 py-1`}
                >
                  {scoreLevel.label}
                </Badge>
                <p className="text-xs text-muted-foreground mt-3">
                  You answered {Math.round((score / 100) * totalQuestions)} out
                  of {totalQuestions} questions correctly
                </p>
              </div>

              {/* Score breakdown */}
              <div className="text-left space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Score Breakdown:
                </p>
                {[
                  {
                    label: "Expert (80–100%)",
                    range: [80, 100],
                    color: "bg-green-500",
                  },
                  {
                    label: "Proficient (60–79%)",
                    range: [60, 79],
                    color: "bg-blue-500",
                  },
                  {
                    label: "Developing (40–59%)",
                    range: [40, 59],
                    color: "bg-yellow-500",
                  },
                  {
                    label: "Beginner (0–39%)",
                    range: [0, 39],
                    color: "bg-orange-500",
                  },
                ].map(({ label, range, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color} shrink-0`} />
                    <span
                      className={`text-xs ${
                        score >= range[0] && score <= range[1]
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {label}
                      {score >= range[0] &&
                        score <= range[1] &&
                        " ← Your level"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="bg-primary text-primary-foreground font-semibold shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all"
                >
                  <a href="/dashboard">View Dashboard</a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-primary/30 text-primary hover:bg-primary/5"
                >
                  <a href="/skill-assessment">Take Another Assessment</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Test screen
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{category?.icon || "📝"}</span>
              <span className="font-medium text-sm text-foreground">
                {category?.name}
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Question */}
        <Card
          className="border-2 border-border shadow-sm mb-6 animate-fade-in"
          key={currentIndex}
        >
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(60% 0.22 285)" }}
              >
                Question {currentIndex + 1}
              </span>
              <h2 className="font-display font-bold text-xl text-foreground mt-2 leading-relaxed">
                {questions[currentIndex].text}
              </h2>
            </div>

            <div className="space-y-3">
              {questions[currentIndex].answers.map((answer, idx) => (
                <button
                  type="button"
                  key={answer}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-3 ${
                    selectedAnswer === idx
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-accent/50"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      selectedAnswer === idx
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {selectedAnswer === idx && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      selectedAnswer === idx
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {answer}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

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
              disabled={selectedAnswer === undefined || isSaving}
              className="bg-primary text-primary-foreground font-semibold px-8 h-11 shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all rounded-xl"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === undefined}
              className="bg-primary text-primary-foreground font-semibold px-8 h-11 shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all rounded-xl"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
          {questions.map((q, i) => (
            <button
              type="button"
              key={q.text}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-primary scale-125"
                  : answers[i] !== undefined
                    ? "bg-primary/40"
                    : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
