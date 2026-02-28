import React from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles,
  ArrowRight,
  Map,
  Brain,
  Target,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function CareerKickStartPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const firstName = userProfile?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 gradient-purple-light opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Career Guidance
              </div>
              <h1 className="font-display font-bold text-4xl lg:text-5xl xl:text-6xl text-foreground leading-tight">
                Career{' '}
                <span className="text-gradient-purple">Kick Start</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Welcome back, <span className="font-semibold text-foreground">{firstName}</span>!{' '}
                Ready to explore your career path? Choose how you'd like to begin your journey today.
              </p>

              {/* Stats */}
              <div className="flex gap-6 pt-2">
                {[
                  { value: '50+', label: 'Career Paths' },
                  { value: '15', label: 'Quiz Questions' },
                  { value: '12', label: 'Skill Tests' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="font-display font-bold text-2xl text-primary">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 gradient-purple rounded-3xl opacity-10 blur-3xl scale-110" />
                <img
                  src="/assets/generated/hero-kickstart.dim_1200x480.png"
                  alt="Career Journey"
                  className="relative w-full rounded-2xl shadow-purple-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-foreground mb-3">
            How would you like to start?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose your path — take our interest quiz for personalized recommendations, or search directly for any career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Begin Your Journey */}
          <Card className="group border-2 border-border hover:border-primary/40 card-hover cursor-pointer overflow-hidden">
            <CardContent className="p-0">
              <a href="/quiz/sector-selection" className="block p-8">
                <div className="space-y-5">
                  <div className="w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center shadow-purple group-hover:scale-110 transition-all">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground mb-2">
                      Begin Your Journey
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Take our AI-powered interest quiz to discover careers perfectly matched to your personality, interests, and goals.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {['Select your sector', '15 interest questions', 'Get AI recommendations'].map((step) => (
                      <div key={step} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    Start Quiz
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>

          {/* View Roadmap */}
          <Card className="group border-2 border-border hover:border-primary/40 card-hover cursor-pointer overflow-hidden">
            <CardContent className="p-0">
              <a href="/job-search" className="block p-8">
                <div className="space-y-5">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <Map className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground mb-2">
                      View Roadmap
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Already know what you want? Search for any job role and get a detailed career roadmap, salary info, and skill requirements.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {['Search any job role', 'Detailed job descriptions', 'Step-by-step roadmaps'].map((step) => (
                      <div key={step} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    Search Jobs
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl text-center text-foreground mb-10">
            Everything you need to plan your career
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'Interest Analysis', desc: 'AI-powered quiz to understand your passions' },
              { icon: Target, title: 'Job Matching', desc: 'Personalized recommendations based on your profile' },
              { icon: TrendingUp, title: 'Market Insights', desc: 'Real salary data and job growth trends' },
              { icon: Award, title: 'Skill Assessment', desc: 'Test and validate your skills across domains' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-5 border border-border shadow-xs text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
