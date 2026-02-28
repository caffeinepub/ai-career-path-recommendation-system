import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, ChevronRight, Briefcase, X } from 'lucide-react';

// Comprehensive job database for search
const ALL_JOBS = [
  // Technology
  { jobId: 'software-engineer', role: 'Software Engineer', sector: 'Technology', description: 'Design, develop, and maintain software applications and systems', salary: '$90k–$160k', growth: '25%' },
  { jobId: 'data-scientist', role: 'Data Scientist', sector: 'Technology', description: 'Analyze complex datasets to extract insights and build predictive models', salary: '$95k–$155k', growth: '35%' },
  { jobId: 'product-manager', role: 'Product Manager', sector: 'Technology', description: 'Define product vision and lead cross-functional teams to deliver value', salary: '$100k–$170k', growth: '20%' },
  { jobId: 'ux-designer', role: 'UX Designer', sector: 'Technology', description: 'Create intuitive user experiences through research and design', salary: '$75k–$130k', growth: '18%' },
  { jobId: 'devops-engineer', role: 'DevOps Engineer', sector: 'Technology', description: 'Bridge development and operations for continuous delivery', salary: '$95k–$155k', growth: '22%' },
  { jobId: 'cybersecurity-analyst', role: 'Cybersecurity Analyst', sector: 'Technology', description: 'Protect systems and networks from cyber threats and vulnerabilities', salary: '$85k–$145k', growth: '33%' },
  { jobId: 'ml-engineer', role: 'Machine Learning Engineer', sector: 'Technology', description: 'Build and deploy machine learning models at scale', salary: '$110k–$180k', growth: '40%' },
  { jobId: 'cloud-architect', role: 'Cloud Architect', sector: 'Technology', description: 'Design and manage cloud infrastructure and solutions', salary: '$120k–$190k', growth: '28%' },
  { jobId: 'frontend-developer', role: 'Frontend Developer', sector: 'Technology', description: 'Build responsive and interactive web interfaces', salary: '$80k–$140k', growth: '20%' },
  { jobId: 'backend-developer', role: 'Backend Developer', sector: 'Technology', description: 'Develop server-side logic and APIs', salary: '$85k–$150k', growth: '22%' },
  // Healthcare
  { jobId: 'doctor', role: 'Doctor/Physician', sector: 'Healthcare', description: 'Diagnose and treat medical conditions and diseases', salary: '$200k–$350k', growth: '3%' },
  { jobId: 'nurse', role: 'Registered Nurse', sector: 'Healthcare', description: 'Provide patient care and coordinate medical treatments', salary: '$65k–$100k', growth: '6%' },
  { jobId: 'pharmacist', role: 'Pharmacist', sector: 'Healthcare', description: 'Dispense medications and advise on drug therapy', salary: '$120k–$150k', growth: '2%' },
  { jobId: 'health-admin', role: 'Healthcare Administrator', sector: 'Healthcare', description: 'Manage healthcare facilities and administrative operations', salary: '$70k–$120k', growth: '28%' },
  { jobId: 'medical-researcher', role: 'Medical Researcher', sector: 'Healthcare', description: 'Conduct research to advance medical knowledge and treatments', salary: '$75k–$130k', growth: '8%' },
  { jobId: 'physical-therapist', role: 'Physical Therapist', sector: 'Healthcare', description: 'Help patients recover from injuries and improve mobility', salary: '$75k–$100k', growth: '17%' },
  // Business & Commerce
  { jobId: 'business-analyst', role: 'Business Analyst', sector: 'Business', description: 'Analyze business processes and recommend improvements', salary: '$70k–$110k', growth: '11%' },
  { jobId: 'marketing-manager', role: 'Marketing Manager', sector: 'Business', description: 'Develop and execute marketing strategies to drive growth', salary: '$80k–$140k', growth: '10%' },
  { jobId: 'financial-analyst', role: 'Financial Analyst', sector: 'Finance', description: 'Analyze financial data and provide investment recommendations', salary: '$75k–$130k', growth: '9%' },
  { jobId: 'hr-manager', role: 'HR Manager', sector: 'Business', description: 'Manage talent acquisition and employee relations', salary: '$65k–$110k', growth: '7%' },
  { jobId: 'supply-chain', role: 'Supply Chain Manager', sector: 'Commerce', description: 'Optimize logistics and supply chain operations', salary: '$80k–$130k', growth: '7%' },
  { jobId: 'entrepreneur', role: 'Entrepreneur', sector: 'Business', description: 'Build and grow innovative business ventures', salary: 'Variable', growth: 'High' },
  { jobId: 'accountant', role: 'Accountant/CPA', sector: 'Finance', description: 'Manage financial records and ensure regulatory compliance', salary: '$60k–$100k', growth: '4%' },
  { jobId: 'investment-banker', role: 'Investment Banker', sector: 'Finance', description: 'Facilitate mergers, acquisitions, and capital raising', salary: '$100k–$250k', growth: '10%' },
  // Engineering
  { jobId: 'civil-engineer', role: 'Civil Engineer', sector: 'Engineering', description: 'Design and oversee construction of infrastructure projects', salary: '$70k–$120k', growth: '5%' },
  { jobId: 'mechanical-engineer', role: 'Mechanical Engineer', sector: 'Engineering', description: 'Design and develop mechanical systems and devices', salary: '$75k–$125k', growth: '2%' },
  { jobId: 'electrical-engineer', role: 'Electrical Engineer', sector: 'Engineering', description: 'Design electrical systems and electronic components', salary: '$80k–$130k', growth: '3%' },
  { jobId: 'aerospace-engineer', role: 'Aerospace Engineer', sector: 'Engineering', description: 'Design aircraft, spacecraft, and related systems', salary: '$90k–$150k', growth: '6%' },
  // Arts & Design
  { jobId: 'graphic-designer', role: 'Graphic Designer', sector: 'Arts', description: 'Create visual content for print and digital media', salary: '$45k–$85k', growth: '3%' },
  { jobId: 'animator', role: '3D Animator', sector: 'Arts', description: 'Create animated content for film, games, and media', salary: '$55k–$100k', growth: '5%' },
  { jobId: 'content-creator', role: 'Content Creator', sector: 'Arts', description: 'Produce engaging digital content across platforms', salary: '$40k–$120k', growth: '15%' },
  { jobId: 'architect', role: 'Architect', sector: 'Arts', description: 'Design buildings and oversee construction projects', salary: '$75k–$130k', growth: '3%' },
];

const SECTOR_COLORS: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700',
  Healthcare: 'bg-green-100 text-green-700',
  Business: 'bg-indigo-100 text-indigo-700',
  Finance: 'bg-yellow-100 text-yellow-700',
  Engineering: 'bg-gray-100 text-gray-700',
  Arts: 'bg-pink-100 text-pink-700',
  Commerce: 'bg-orange-100 text-orange-700',
};

const SECTOR_ICONS: Record<string, string> = {
  Technology: '💻',
  Healthcare: '🏥',
  Business: '💼',
  Finance: '💰',
  Engineering: '⚙️',
  Arts: '🎨',
  Commerce: '📈',
};

export default function JobSearchPage() {
  const [query, setQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const sectors = [...new Set(ALL_JOBS.map((j) => j.sector))];

  const filteredJobs = useMemo(() => {
    let results = ALL_JOBS;
    if (selectedSector) {
      results = results.filter((j) => j.sector === selectedSector);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (j) =>
          j.role.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.sector.toLowerCase().includes(q)
      );
    }
    return results;
  }, [query, selectedSector]);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">
            Explore Career Paths
          </h1>
          <p className="text-muted-foreground">
            Search for any job role to view detailed descriptions, roadmaps, and skill requirements.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search job roles, skills, or sectors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-10 h-13 text-base rounded-xl border-2 border-border focus:border-primary transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sector filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedSector === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSector(null)}
            className={
              selectedSector === null
                ? 'gradient-purple text-white shadow-purple'
                : 'border-border text-muted-foreground hover:border-primary/40'
            }
          >
            All Sectors
          </Button>
          {sectors.map((sector) => (
            <Button
              key={sector}
              variant={selectedSector === sector ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSector(selectedSector === sector ? null : sector)}
              className={
                selectedSector === sector
                  ? 'gradient-purple text-white shadow-purple'
                  : 'border-border text-muted-foreground hover:border-primary/40'
              }
            >
              {SECTOR_ICONS[sector] || '🌟'} {sector}
            </Button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredJobs.length}</span> job
            {filteredJobs.length !== 1 ? 's' : ''} found
            {query && (
              <span>
                {' '}
                for "<span className="text-primary font-medium">{query}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Job results */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Try a different search term or clear the sector filter to see all available roles.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery('');
                setSelectedSector(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <Card
                key={job.jobId}
                className="border border-border hover:border-primary/30 card-hover cursor-pointer"
              >
                <CardContent className="p-5">
                  <a
                    href={`/job/${encodeURIComponent(job.jobId)}`}
                    className="flex items-start gap-4"
                  >
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                      {SECTOR_ICONS[job.sector] || '💼'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm leading-snug">
                          {job.role}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${SECTOR_COLORS[job.sector] || 'bg-purple-100 text-purple-700'}`}
                        >
                          {job.sector}
                        </Badge>
                        <span className="text-xs font-medium text-primary">{job.salary}</span>
                        <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
                          <TrendingUp className="w-3 h-3" />
                          {job.growth}
                        </span>
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
