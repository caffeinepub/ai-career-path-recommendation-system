import React, { useState } from 'react';
import { useGetCallerUserProfile, useGetRecommendedJobRoles, useGetAvailableSectors } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LayoutDashboard,
  Briefcase,
  Brain,
  Award,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';

// Static job data enrichment for display
const JOB_ENRICHMENT: Record<string, { salary: string; growth: string; icon: string }> = {
  default: { salary: '$60k–$120k', growth: '15%', icon: '💼' },
  'Software Engineer': { salary: '$90k–$160k', growth: '25%', icon: '💻' },
  'Data Scientist': { salary: '$95k–$155k', growth: '35%', icon: '📊' },
  'Product Manager': { salary: '$100k–$170k', growth: '20%', icon: '🎯' },
  'UX Designer': { salary: '$75k–$130k', growth: '18%', icon: '🎨' },
  'DevOps Engineer': { salary: '$95k–$155k', growth: '22%', icon: '⚙️' },
};

// Fallback recommended jobs per sector
const FALLBACK_JOBS: Record<string, { role: string; description: string; jobId: string }[]> = {
  '1': [
    { jobId: 'software-engineer', role: 'Software Engineer', description: 'Design and build software applications and systems' },
    { jobId: 'data-scientist', role: 'Data Scientist', description: 'Analyze complex data to drive business decisions' },
    { jobId: 'product-manager', role: 'Product Manager', description: 'Lead product strategy and development lifecycle' },
    { jobId: 'ux-designer', role: 'UX Designer', description: 'Create intuitive and engaging user experiences' },
    { jobId: 'devops-engineer', role: 'DevOps Engineer', description: 'Bridge development and operations for faster delivery' },
  ],
  '2': [
    { jobId: 'doctor', role: 'Doctor/Physician', description: 'Diagnose and treat medical conditions' },
    { jobId: 'nurse', role: 'Registered Nurse', description: 'Provide patient care and medical support' },
    { jobId: 'health-admin', role: 'Healthcare Administrator', description: 'Manage healthcare facilities and operations' },
    { jobId: 'pharmacist', role: 'Pharmacist', description: 'Dispense medications and advise on drug therapy' },
    { jobId: 'medical-researcher', role: 'Medical Researcher', description: 'Conduct research to advance medical knowledge' },
  ],
  '3': [
    { jobId: 'business-analyst', role: 'Business Analyst', description: 'Analyze business processes and recommend improvements' },
    { jobId: 'sales-manager', role: 'Sales Manager', description: 'Lead sales teams and drive revenue growth' },
    { jobId: 'supply-chain', role: 'Supply Chain Manager', description: 'Optimize logistics and supply chain operations' },
    { jobId: 'retail-manager', role: 'Retail Manager', description: 'Oversee retail operations and customer experience' },
    { jobId: 'ecommerce-specialist', role: 'E-Commerce Specialist', description: 'Manage online sales channels and digital storefronts' },
  ],
  default: [
    { jobId: 'consultant', role: 'Management Consultant', description: 'Advise organizations on strategy and operations' },
    { jobId: 'entrepreneur', role: 'Entrepreneur', description: 'Build and grow your own business ventures' },
    { jobId: 'project-manager', role: 'Project Manager', description: 'Plan and execute projects across industries' },
    { jobId: 'analyst', role: 'Business Analyst', description: 'Analyze data and processes to improve performance' },
    { jobId: 'hr-manager', role: 'HR Manager', description: 'Manage talent acquisition and employee relations' },
  ],
};

export default function DashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: sectors } = useGetAvailableSectors();
  const [showAssessmentBanner, setShowAssessmentBanner] = useState(true);

  const storedSectorId = sessionStorage.getItem('selectedSectorId') || '1';
  const sectorId = BigInt(storedSectorId);

  const { data: backendJobs, isLoading: jobsLoading } = useGetRecommendedJobRoles(sectorId);

  const currentSector = sectors?.find((s) => s.id === sectorId);
  const sectorName = currentSector?.name || 'Technology';

  // Use backend jobs or fallback
  const jobs =
    backendJobs && backendJobs.length > 0
      ? backendJobs
      : FALLBACK_JOBS[storedSectorId] || FALLBACK_JOBS.default;

  const completedAssessments = userProfile?.completedAssessments?.length || 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome header */}
        <div className="animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">
                Welcome back, {userProfile?.name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's your personalized career dashboard
              </p>
            </div>
            <Button
              asChild
              className="hidden sm:flex gradient-purple text-white shadow-purple hover:shadow-purple-lg transition-all"
            >
              <a href="/quiz/sector-selection">
                <Brain className="w-4 h-4 mr-2" />
                Retake Quiz
              </a>
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Selected Sector', value: sectorName, icon: Target, color: 'text-primary' },
            { label: 'Job Matches', value: jobs.length.toString(), icon: Briefcase, color: 'text-primary' },
            { label: 'Assessments Done', value: completedAssessments.toString(), icon: Award, color: 'text-primary' },
            { label: 'Profile Complete', value: userProfile ? '80%' : '20%', icon: LayoutDashboard, color: 'text-primary' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border border-border shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg text-foreground leading-none">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skill Assessment Banner */}
        {showAssessmentBanner && (
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-100/50 animate-fade-in">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 gradient-purple rounded-xl flex items-center justify-center shadow-purple shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      Take a Skill Assessment
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-lg">
                      Validate your skills and get more accurate job recommendations. Choose from 12 assessment
                      categories including Programming, Communication, Data Analysis, and more.
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Button
                        asChild
                        size="sm"
                        className="gradient-purple text-white shadow-purple hover:shadow-purple-lg transition-all"
                      >
                        <a href="/skill-assessment">
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          Start Assessment
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAssessmentBanner(false)}
                        className="text-muted-foreground"
                      >
                        Skip for now
                      </Button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowAssessmentBanner(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recommended Jobs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground">
                  Recommended for You
                </h2>
                <p className="text-sm text-muted-foreground">
                  Based on your {sectorName} sector selection
                </p>
              </div>
              <Badge variant="secondary" className="text-primary bg-primary/10">
                {jobs.length} matches
              </Badge>
            </div>

            {jobsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job, index) => {
                  const enrichment = JOB_ENRICHMENT[job.role] || JOB_ENRICHMENT.default;
                  return (
                    <Card
                      key={job.jobId || index}
                      className="border border-border hover:border-primary/30 card-hover cursor-pointer"
                    >
                      <CardContent className="p-5">
                        <a
                          href={`/job/${encodeURIComponent(job.jobId || job.role)}`}
                          className="flex items-center gap-4"
                        >
                          <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                            {enrichment.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-foreground text-sm">{job.role}</h3>
                              <div className="flex items-center gap-1 text-xs text-green-600 font-medium shrink-0">
                                <TrendingUp className="w-3 h-3" />
                                {enrichment.growth}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {job.description}
                            </p>
                            <p className="text-xs font-medium text-primary mt-1">{enrichment.salary}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </a>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {[
                  { href: '/job-search', icon: '🔍', label: 'Search Jobs' },
                  { href: '/skill-assessment', icon: '📝', label: 'Take Assessment' },
                  { href: '/quiz/sector-selection', icon: '🧠', label: 'Retake Quiz' },
                  { href: '/profile', icon: '👤', label: 'Update Profile' },
                ].map(({ href, icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <span className="text-base">{icon}</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Completed Assessments */}
            {completedAssessments > 0 && (
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">Completed Assessments</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {userProfile?.completedAssessments.map((assessment) => (
                    <div key={assessment.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <span className="text-sm text-foreground">{assessment.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Done
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Profile completion */}
            <Card className="border border-border bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-semibold text-sm text-foreground">Complete Your Profile</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Add more details to get better job recommendations.
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary/5"
                >
                  <a href="/profile">Update Profile</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
