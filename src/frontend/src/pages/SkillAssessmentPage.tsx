import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, CheckCircle2, Clock, Sparkles } from "lucide-react";
import React from "react";
import { AssessmentStatus } from "../backend";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { ALL_ASSESSMENT_CATEGORIES } from "../hooks/useQueries";

export default function SkillAssessmentPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  const completedIds = new Set(
    (userProfile?.completedAssessments || [])
      .filter((a) => a.status === AssessmentStatus.completed)
      .map((a) => a.id),
  );

  const completedCount = completedIds.size;
  const totalCount = ALL_ASSESSMENT_CATEGORIES.length;

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-3">
                <Award className="w-4 h-4" />
                Skill Assessments
              </div>
              <h1 className="font-display font-bold text-3xl text-foreground mb-2">
                Validate Your{" "}
                <span style={{ color: "oklch(60% 0.22 285)" }}>Skills</span>
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Take assessments to discover your strengths, identify areas for
                growth, and get more accurate career recommendations tailored to
                your abilities.
              </p>
            </div>
            {completedCount > 0 && (
              <div className="bg-card border border-border rounded-xl p-4 text-center shadow-xs shrink-0">
                <p
                  className="font-display font-bold text-2xl"
                  style={{ color: "oklch(38% 0.22 278)" }}
                >
                  {completedCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {totalCount} completed
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {completedCount > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 mb-8 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Overall Progress
              </span>
              <span className="text-sm font-semibold text-primary">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-purple rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Info banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              How assessments improve your recommendations
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Each completed assessment helps our AI better understand your
              strengths and match you with careers where you'll excel. You can
              take assessments in any order and retake them anytime.
            </p>
          </div>
        </div>

        {/* Assessment grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_ASSESSMENT_CATEGORIES.map((category) => {
            const isCompleted = completedIds.has(category.id);

            return (
              <Card
                key={category.id}
                className={`border-2 card-hover cursor-pointer transition-all ${
                  isCompleted
                    ? "border-green-200 bg-green-50/50"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="text-2xl">{category.icon}</div>
                    {isCompleted ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 border-0 text-xs shrink-0"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Done
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground border-0 text-xs shrink-0"
                      >
                        <Clock className="w-3 h-3 mr-1" />5 min
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  <Button
                    asChild
                    size="sm"
                    className={`w-full ${
                      isCompleted
                        ? "bg-green-100 text-green-700 hover:bg-green-200 border-0"
                        : "bg-primary text-primary-foreground shadow-purple hover:shadow-purple-lg hover:opacity-90"
                    } transition-all`}
                  >
                    <a
                      href={`/skill-assessment/${category.id}`}
                      className="flex items-center justify-center gap-1.5"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Retake
                        </>
                      ) : (
                        <>
                          Start Assessment
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back to dashboard */}
        <div className="mt-8 text-center">
          <Button variant="ghost" asChild className="text-muted-foreground">
            <a href="/dashboard">← Back to Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
