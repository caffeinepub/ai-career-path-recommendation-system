import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Award,
  Brain,
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useState } from "react";
import {
  useGetAvailableSectors,
  useGetCallerUserProfile,
  useGetRecommendedJobRoles,
} from "../hooks/useQueries";

// Static job data enrichment for display
const JOB_ENRICHMENT: Record<
  string,
  { salary: string; growth: string; icon: string }
> = {
  default: { salary: "$60k–$120k", growth: "15%", icon: "💼" },
  // Technology
  "Software Engineer": { salary: "$90k–$160k", growth: "25%", icon: "💻" },
  "Data Scientist": { salary: "$95k–$155k", growth: "35%", icon: "📊" },
  "Product Manager": { salary: "$100k–$170k", growth: "20%", icon: "🎯" },
  "UX Designer": { salary: "$75k–$130k", growth: "18%", icon: "🎨" },
  "DevOps Engineer": { salary: "$95k–$155k", growth: "22%", icon: "⚙️" },
  // Arts
  "Graphic Designer": { salary: "$50k–$90k", growth: "16%", icon: "🎨" },
  "Art Director": { salary: "$70k–$120k", growth: "14%", icon: "🖼️" },
  Animator: { salary: "$55k–$100k", growth: "18%", icon: "🎬" },
  Photographer: { salary: "$40k–$80k", growth: "12%", icon: "📷" },
  "Creative Writer": { salary: "$45k–$85k", growth: "10%", icon: "✍️" },
  // Business
  "Management Consultant": { salary: "$80k–$150k", growth: "14%", icon: "📋" },
  Entrepreneur: { salary: "$60k–$200k+", growth: "20%", icon: "🚀" },
  "Operations Manager": { salary: "$70k–$120k", growth: "16%", icon: "⚙️" },
  "Business Development Manager": {
    salary: "$75k–$130k",
    growth: "18%",
    icon: "🤝",
  },
  "Strategy Analyst": { salary: "$65k–$110k", growth: "15%", icon: "📊" },
  // Engineering
  "Civil Engineer": { salary: "$75k–$130k", growth: "20%", icon: "🏗️" },
  "Mechanical Engineer": { salary: "$80k–$140k", growth: "22%", icon: "⚙️" },
  "Electrical Engineer": { salary: "$85k–$145k", growth: "24%", icon: "⚡" },
  "Chemical Engineer": { salary: "$80k–$140k", growth: "18%", icon: "🧪" },
  "Structural Engineer": { salary: "$75k–$130k", growth: "19%", icon: "🔧" },
  // Finance
  "Financial Analyst": { salary: "$70k–$120k", growth: "20%", icon: "📈" },
  "Investment Banker": { salary: "$100k–$200k", growth: "15%", icon: "🏦" },
  Accountant: { salary: "$55k–$95k", growth: "12%", icon: "📒" },
  "Financial Planner": { salary: "$65k–$110k", growth: "16%", icon: "💰" },
  "Risk Analyst": { salary: "$70k–$115k", growth: "18%", icon: "🛡️" },
  // Education
  Teacher: { salary: "$40k–$75k", growth: "10%", icon: "📚" },
  "Curriculum Designer": { salary: "$55k–$90k", growth: "12%", icon: "📝" },
  "Education Administrator": {
    salary: "$60k–$100k",
    growth: "14%",
    icon: "🏫",
  },
  "Corporate Trainer": { salary: "$60k–$100k", growth: "16%", icon: "🎓" },
  "Education Researcher": { salary: "$55k–$90k", growth: "12%", icon: "🔬" },
  // Marketing
  "Digital Marketer": { salary: "$55k–$95k", growth: "22%", icon: "📱" },
  "Brand Manager": { salary: "$70k–$120k", growth: "18%", icon: "🏷️" },
  "Content Strategist": { salary: "$60k–$100k", growth: "20%", icon: "📣" },
  "SEO Specialist": { salary: "$55k–$90k", growth: "24%", icon: "🔍" },
  "Social Media Manager": { salary: "$50k–$85k", growth: "26%", icon: "💬" },
  // Science
  "Research Scientist": { salary: "$70k–$120k", growth: "18%", icon: "🔬" },
  Biologist: { salary: "$60k–$100k", growth: "14%", icon: "🧬" },
  Chemist: { salary: "$65k–$110k", growth: "15%", icon: "⚗️" },
  "Environmental Scientist": {
    salary: "$60k–$100k",
    growth: "20%",
    icon: "🌿",
  },
  "Scientific Data Analyst": {
    salary: "$70k–$115k",
    growth: "22%",
    icon: "📊",
  },
};

// Fallback recommended jobs per sector
const FALLBACK_JOBS: Record<
  string,
  { role: string; description: string; jobId: string }[]
> = {
  "1": [
    {
      jobId: "software-engineer",
      role: "Software Engineer",
      description: "Design and build software applications and systems",
    },
    {
      jobId: "data-scientist",
      role: "Data Scientist",
      description: "Analyze complex data to drive business decisions",
    },
    {
      jobId: "product-manager",
      role: "Product Manager",
      description: "Lead product strategy and development lifecycle",
    },
    {
      jobId: "ux-designer",
      role: "UX Designer",
      description: "Create intuitive and engaging user experiences",
    },
    {
      jobId: "devops-engineer",
      role: "DevOps Engineer",
      description: "Bridge development and operations for faster delivery",
    },
  ],
  "2": [
    {
      jobId: "doctor",
      role: "Doctor/Physician",
      description: "Diagnose and treat medical conditions",
    },
    {
      jobId: "nurse",
      role: "Registered Nurse",
      description: "Provide patient care and medical support",
    },
    {
      jobId: "health-admin",
      role: "Healthcare Administrator",
      description: "Manage healthcare facilities and operations",
    },
    {
      jobId: "pharmacist",
      role: "Pharmacist",
      description: "Dispense medications and advise on drug therapy",
    },
    {
      jobId: "medical-researcher",
      role: "Medical Researcher",
      description: "Conduct research to advance medical knowledge",
    },
  ],
  "3": [
    {
      jobId: "business-analyst",
      role: "Business Analyst",
      description: "Analyze business processes and recommend improvements",
    },
    {
      jobId: "sales-manager",
      role: "Sales Manager",
      description: "Lead sales teams and drive revenue growth",
    },
    {
      jobId: "supply-chain",
      role: "Supply Chain Manager",
      description: "Optimize logistics and supply chain operations",
    },
    {
      jobId: "retail-manager",
      role: "Retail Manager",
      description: "Oversee retail operations and customer experience",
    },
    {
      jobId: "ecommerce-specialist",
      role: "E-Commerce Specialist",
      description: "Manage online sales channels and digital storefronts",
    },
  ],
  "4": [
    {
      jobId: "graphic-designer",
      role: "Graphic Designer",
      description: "Create visual content for brands and media",
    },
    {
      jobId: "art-director",
      role: "Art Director",
      description: "Lead creative direction for campaigns and projects",
    },
    {
      jobId: "animator",
      role: "Animator",
      description: "Produce animations for film, TV, and digital media",
    },
    {
      jobId: "photographer",
      role: "Photographer",
      description: "Capture and edit professional photography",
    },
    {
      jobId: "creative-writer",
      role: "Creative Writer",
      description: "Write content for books, scripts, and digital media",
    },
  ],
  "5": [
    {
      jobId: "management-consultant",
      role: "Management Consultant",
      description: "Advise organizations on strategy and operations",
    },
    {
      jobId: "entrepreneur",
      role: "Entrepreneur",
      description: "Build and grow your own business ventures",
    },
    {
      jobId: "operations-manager",
      role: "Operations Manager",
      description: "Oversee daily business operations and processes",
    },
    {
      jobId: "business-development",
      role: "Business Development Manager",
      description: "Identify growth opportunities and partnerships",
    },
    {
      jobId: "strategy-analyst",
      role: "Strategy Analyst",
      description: "Research and develop business strategies",
    },
  ],
  "6": [
    {
      jobId: "civil-engineer",
      role: "Civil Engineer",
      description: "Design and oversee infrastructure construction",
    },
    {
      jobId: "mechanical-engineer",
      role: "Mechanical Engineer",
      description: "Design and develop mechanical systems",
    },
    {
      jobId: "electrical-engineer",
      role: "Electrical Engineer",
      description: "Design electrical systems and circuits",
    },
    {
      jobId: "chemical-engineer",
      role: "Chemical Engineer",
      description: "Develop chemical processes and products",
    },
    {
      jobId: "structural-engineer",
      role: "Structural Engineer",
      description:
        "Ensure structural integrity of buildings and infrastructure",
    },
  ],
  "7": [
    {
      jobId: "financial-analyst",
      role: "Financial Analyst",
      description: "Analyze financial data and investment opportunities",
    },
    {
      jobId: "investment-banker",
      role: "Investment Banker",
      description: "Facilitate capital raising and M&A transactions",
    },
    {
      jobId: "accountant",
      role: "Accountant",
      description: "Manage financial records and tax compliance",
    },
    {
      jobId: "financial-planner",
      role: "Financial Planner",
      description: "Help clients achieve their financial goals",
    },
    {
      jobId: "risk-analyst",
      role: "Risk Analyst",
      description: "Assess and mitigate financial risks",
    },
  ],
  "8": [
    {
      jobId: "teacher",
      role: "Teacher",
      description: "Educate and mentor students in a classroom setting",
    },
    {
      jobId: "curriculum-designer",
      role: "Curriculum Designer",
      description: "Develop educational programs and materials",
    },
    {
      jobId: "education-admin",
      role: "Education Administrator",
      description: "Manage school or institution operations",
    },
    {
      jobId: "corporate-trainer",
      role: "Corporate Trainer",
      description: "Deliver professional training to employees",
    },
    {
      jobId: "education-researcher",
      role: "Education Researcher",
      description: "Study and improve teaching methods",
    },
  ],
  "9": [
    {
      jobId: "digital-marketer",
      role: "Digital Marketer",
      description: "Plan and execute online marketing campaigns",
    },
    {
      jobId: "brand-manager",
      role: "Brand Manager",
      description: "Build and maintain brand identity and awareness",
    },
    {
      jobId: "content-strategist",
      role: "Content Strategist",
      description: "Plan and manage content for target audiences",
    },
    {
      jobId: "seo-specialist",
      role: "SEO Specialist",
      description: "Optimize websites for search engine rankings",
    },
    {
      jobId: "social-media-manager",
      role: "Social Media Manager",
      description: "Manage brand presence across social platforms",
    },
  ],
  "10": [
    {
      jobId: "research-scientist",
      role: "Research Scientist",
      description: "Conduct experiments and publish scientific findings",
    },
    {
      jobId: "biologist",
      role: "Biologist",
      description: "Study living organisms and ecosystems",
    },
    {
      jobId: "chemist",
      role: "Chemist",
      description: "Research and develop chemical compounds",
    },
    {
      jobId: "environmental-scientist",
      role: "Environmental Scientist",
      description: "Study and address environmental challenges",
    },
    {
      jobId: "data-analyst-science",
      role: "Scientific Data Analyst",
      description: "Analyze experimental data for research insights",
    },
  ],
  default: [
    {
      jobId: "consultant",
      role: "Management Consultant",
      description: "Advise organizations on strategy and operations",
    },
    {
      jobId: "entrepreneur",
      role: "Entrepreneur",
      description: "Build and grow your own business ventures",
    },
    {
      jobId: "project-manager",
      role: "Project Manager",
      description: "Plan and execute projects across industries",
    },
    {
      jobId: "analyst",
      role: "Business Analyst",
      description: "Analyze data and processes to improve performance",
    },
    {
      jobId: "hr-manager",
      role: "HR Manager",
      description: "Manage talent acquisition and employee relations",
    },
  ],
};

export default function DashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: sectors } = useGetAvailableSectors();
  const [showAssessmentBanner, setShowAssessmentBanner] = useState(true);

  const storedSectorId = sessionStorage.getItem("selectedSectorId") || "1";
  const sectorId = BigInt(storedSectorId);

  const { data: backendJobs, isLoading: jobsLoading } =
    useGetRecommendedJobRoles(sectorId);

  const currentSector = sectors?.find((s) => s.id === sectorId);
  const sectorName = currentSector?.name || "Technology";

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
                Welcome back,{" "}
                <span style={{ color: "oklch(60% 0.22 285)" }}>
                  {userProfile?.name?.split(" ")[0] || "there"}
                </span>{" "}
                👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's your personalized career dashboard
              </p>
            </div>
            <Button
              asChild
              className="hidden sm:flex bg-primary text-primary-foreground shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all"
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
            {
              label: "Selected Sector",
              value: sectorName,
              icon: Target,
              color: "text-primary",
            },
            {
              label: "Job Matches",
              value: jobs.length.toString(),
              icon: Briefcase,
              color: "text-primary",
            },
            {
              label: "Assessments Done",
              value: completedAssessments.toString(),
              icon: Award,
              color: "text-primary",
            },
            {
              label: "Profile Complete",
              value: userProfile ? "80%" : "20%",
              icon: LayoutDashboard,
              color: "text-primary",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border border-border shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p
                      className="font-display font-bold text-lg leading-none"
                      style={{ color: "oklch(38% 0.22 278)" }}
                    >
                      {value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {label}
                    </p>
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
                      Validate your skills and get more accurate job
                      recommendations. Choose from 12 assessment categories
                      including Programming, Communication, Data Analysis, and
                      more.
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Button
                        asChild
                        size="sm"
                        className="bg-primary text-primary-foreground shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all"
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
                  type="button"
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
                  Recommended for{" "}
                  <span style={{ color: "oklch(60% 0.22 285)" }}>You</span>
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
                {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map(
                  (key) => (
                    <Skeleton key={key} className="h-24 rounded-xl" />
                  ),
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job, index) => {
                  const enrichment =
                    JOB_ENRICHMENT[job.role] || JOB_ENRICHMENT.default;
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
                              <h3 className="font-semibold text-foreground text-sm">
                                {job.role}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-green-600 font-medium shrink-0">
                                <TrendingUp className="w-3 h-3" />
                                {enrichment.growth}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {job.description}
                            </p>
                            <p className="text-xs font-medium text-primary mt-1">
                              {enrichment.salary}
                            </p>
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
                <CardTitle className="text-base font-display">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {[
                  { href: "/job-search", icon: "🔍", label: "Search Jobs" },
                  {
                    href: "/skill-assessment",
                    icon: "📝",
                    label: "Take Assessment",
                  },
                  {
                    href: "/quiz/sector-selection",
                    icon: "🧠",
                    label: "Retake Quiz",
                  },
                  { href: "/profile", icon: "👤", label: "Update Profile" },
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
                  <CardTitle className="text-base font-display">
                    Completed Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {userProfile?.completedAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <span className="text-sm text-foreground">
                        {assessment.name}
                      </span>
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
                  <p className="font-semibold text-sm text-foreground">
                    Complete Your Profile
                  </p>
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
