import React from 'react';
import { useGetAvailableRoadmaps } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import RoadmapTimeline from '../components/RoadmapTimeline';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Telescope,
  BarChart3,
  BookOpen,
  Layers,
  Star,
  CheckCircle2,
} from 'lucide-react';

// Static job data store
const JOB_DATA: Record<
  string,
  {
    role: string;
    sector: string;
    sectorId: bigint;
    description: string;
    marketGrowth: string;
    futureScope: string;
    averageSalary: string;
    salaryRange: string;
    keySkills: string[];
    roadmapSteps: string[];
    beginnerSkills: string[];
    intermediateSkills: string[];
    advancedSkills: string[];
    education: string;
    jobOutlook: string;
  }
> = {
  'software-engineer': {
    role: 'Software Engineer',
    sector: 'Technology',
    sectorId: BigInt(1),
    description:
      'Software Engineers design, develop, test, and maintain software applications and systems. They work across the full software development lifecycle — from requirements gathering and architecture design to coding, testing, deployment, and ongoing maintenance. They collaborate with product managers, designers, and other engineers to build scalable, reliable software solutions.',
    marketGrowth:
      'The software engineering field is growing at 25% annually, significantly faster than the average for all occupations. Demand is driven by digital transformation across all industries, cloud computing adoption, AI/ML integration, and the continued expansion of mobile and web applications.',
    futureScope:
      'Software engineering will remain one of the most in-demand careers for the foreseeable future. Emerging areas like AI/ML engineering, cloud-native development, Web3, and edge computing are creating new specializations. Remote work has also expanded the global talent market, offering engineers more flexibility and opportunities.',
    averageSalary: '$120,000',
    salaryRange: '$90,000 – $160,000',
    keySkills: ['Programming (Python, JavaScript, Java)', 'Data Structures & Algorithms', 'System Design', 'Version Control (Git)', 'Agile/Scrum', 'Cloud Platforms (AWS/GCP/Azure)', 'Testing & Debugging', 'API Design'],
    roadmapSteps: [
      'Learn programming fundamentals (Python or JavaScript)',
      'Master data structures and algorithms',
      'Build projects and contribute to open source',
      'Learn web development or backend frameworks',
      'Study system design and architecture patterns',
      'Get cloud certifications (AWS/GCP/Azure)',
      'Apply for internships or junior roles',
      'Advance to senior/lead engineer positions',
    ],
    beginnerSkills: ['Basic programming syntax', 'HTML/CSS fundamentals', 'Git version control', 'Simple algorithms', 'Command line basics'],
    intermediateSkills: ['Framework proficiency (React, Node.js, Django)', 'Database design (SQL/NoSQL)', 'REST API development', 'Testing methodologies', 'CI/CD pipelines'],
    advancedSkills: ['Distributed systems design', 'Microservices architecture', 'Performance optimization', 'Security best practices', 'Technical leadership'],
    education: "Bachelor's in Computer Science or related field (or equivalent bootcamp/self-taught)",
    jobOutlook: 'Excellent — 25% growth projected over next 10 years',
  },
  'data-scientist': {
    role: 'Data Scientist',
    sector: 'Technology',
    sectorId: BigInt(1),
    description:
      'Data Scientists collect, analyze, and interpret large datasets to help organizations make data-driven decisions. They apply statistical analysis, machine learning, and data visualization techniques to uncover patterns and insights. They work closely with business stakeholders to translate complex findings into actionable recommendations.',
    marketGrowth:
      'Data science is one of the fastest-growing fields with 35% annual growth. The explosion of big data, AI adoption, and the need for evidence-based decision-making across industries is driving unprecedented demand for skilled data scientists.',
    futureScope:
      'As AI and machine learning become central to business strategy, data scientists will play an increasingly critical role. Specializations in NLP, computer vision, and MLOps are emerging. The field is evolving toward more automated ML pipelines, requiring data scientists to focus on higher-level problem framing and model governance.',
    averageSalary: '$125,000',
    salaryRange: '$95,000 – $155,000',
    keySkills: ['Python/R Programming', 'Machine Learning', 'Statistical Analysis', 'SQL & Databases', 'Data Visualization', 'Deep Learning', 'Feature Engineering', 'Business Communication'],
    roadmapSteps: [
      'Learn Python and statistics fundamentals',
      'Master SQL and data manipulation with Pandas',
      'Study machine learning algorithms',
      'Practice with real datasets on Kaggle',
      'Learn deep learning frameworks (TensorFlow/PyTorch)',
      'Build a portfolio of data science projects',
      'Get certified (Google Data Analytics, AWS ML)',
      'Apply for data analyst or junior data scientist roles',
    ],
    beginnerSkills: ['Python basics', 'Excel/spreadsheet analysis', 'Basic statistics', 'SQL queries', 'Data cleaning'],
    intermediateSkills: ['Machine learning models', 'Data visualization (Tableau/Power BI)', 'Feature engineering', 'A/B testing', 'Big data tools (Spark)'],
    advancedSkills: ['Deep learning & neural networks', 'MLOps and model deployment', 'Advanced NLP/Computer Vision', 'Causal inference', 'Research & publication'],
    education: "Bachelor's/Master's in Statistics, Mathematics, Computer Science, or related field",
    jobOutlook: 'Outstanding — 35% growth, ranked #1 best job in multiple surveys',
  },
  'product-manager': {
    role: 'Product Manager',
    sector: 'Technology',
    sectorId: BigInt(1),
    description:
      'Product Managers define the vision, strategy, and roadmap for a product. They act as the bridge between business, technology, and design teams, prioritizing features based on user needs and business goals. They are responsible for the product lifecycle from ideation to launch and iteration.',
    marketGrowth:
      'Product management is growing at 20% annually as companies increasingly recognize the need for dedicated product leadership. The rise of SaaS, mobile apps, and digital platforms has created massive demand for skilled PMs who can balance user needs with business objectives.',
    futureScope:
      'Product management will continue to evolve with AI-assisted product development, data-driven decision making, and platform thinking. Specializations in AI product management, growth product management, and platform PM roles are emerging as high-value career paths.',
    averageSalary: '$135,000',
    salaryRange: '$100,000 – $170,000',
    keySkills: ['Product Strategy', 'User Research', 'Data Analysis', 'Roadmap Planning', 'Stakeholder Management', 'Agile/Scrum', 'A/B Testing', 'Communication'],
    roadmapSteps: [
      'Develop strong analytical and communication skills',
      'Learn product frameworks (Jobs-to-be-Done, OKRs)',
      'Gain experience in a related role (engineering, design, or business)',
      'Build product intuition through side projects',
      'Get certified (AIPMM, Pragmatic Institute)',
      'Transition to Associate PM or PM role',
      'Build a track record of successful product launches',
      'Advance to Senior PM or Director of Product',
    ],
    beginnerSkills: ['User story writing', 'Basic wireframing', 'Market research', 'Stakeholder communication', 'Agile basics'],
    intermediateSkills: ['Product metrics & KPIs', 'A/B testing design', 'Competitive analysis', 'Roadmap prioritization', 'Cross-functional leadership'],
    advancedSkills: ['Product strategy & vision', 'Platform thinking', 'P&L ownership', 'Organizational influence', 'Go-to-market strategy'],
    education: "Bachelor's in Business, Engineering, or related field; MBA often preferred for senior roles",
    jobOutlook: 'Strong — 20% growth with high compensation and career advancement opportunities',
  },
  'doctor': {
    role: 'Doctor/Physician',
    sector: 'Healthcare',
    sectorId: BigInt(2),
    description:
      'Physicians diagnose and treat illnesses, injuries, and medical conditions. They examine patients, order and interpret diagnostic tests, prescribe medications, and develop treatment plans. Physicians may work in primary care or specialize in areas such as cardiology, oncology, pediatrics, or surgery.',
    marketGrowth:
      'Physician demand is growing at 3% annually, driven by an aging population, increased chronic disease prevalence, and healthcare access expansion. While growth is moderate, the field offers exceptional job security and compensation.',
    futureScope:
      'Medicine is being transformed by AI diagnostics, telemedicine, precision medicine, and genomics. Physicians who embrace technology and data-driven care will be at the forefront of healthcare innovation. Specialties in geriatrics, mental health, and preventive medicine are expected to see the highest demand.',
    averageSalary: '$275,000',
    salaryRange: '$200,000 – $350,000+',
    keySkills: ['Clinical diagnosis', 'Patient communication', 'Medical knowledge', 'Critical thinking', 'Procedural skills', 'Electronic health records', 'Evidence-based medicine', 'Team collaboration'],
    roadmapSteps: [
      'Complete pre-med undergraduate degree (Biology, Chemistry)',
      'Pass MCAT and apply to medical school',
      'Complete 4 years of medical school (MD/DO)',
      'Match into residency program (3–7 years)',
      'Obtain medical license (USMLE/COMLEX)',
      'Complete fellowship for specialization (optional)',
      'Obtain board certification in specialty',
      'Begin practice in hospital, clinic, or private practice',
    ],
    beginnerSkills: ['Basic anatomy & physiology', 'Medical terminology', 'Patient history taking', 'Physical examination', 'Clinical reasoning basics'],
    intermediateSkills: ['Differential diagnosis', 'Procedural skills', 'Pharmacology', 'Interpreting lab/imaging results', 'Emergency management'],
    advancedSkills: ['Complex case management', 'Surgical/procedural expertise', 'Research & publication', 'Medical leadership', 'Subspecialty expertise'],
    education: 'MD or DO degree + Residency (10–15 years total training)',
    jobOutlook: 'Stable — consistent demand with excellent compensation and job security',
  },
  'business-analyst': {
    role: 'Business Analyst',
    sector: 'Business',
    sectorId: BigInt(3),
    description:
      'Business Analysts bridge the gap between business needs and technology solutions. They gather and document requirements, analyze processes, identify inefficiencies, and recommend improvements. They work with stakeholders across departments to ensure projects deliver measurable business value.',
    marketGrowth:
      'Business analysis is growing at 11% annually as organizations increasingly rely on data-driven decision making and digital transformation initiatives. The role is evolving to include more data analytics and technology skills.',
    futureScope:
      'Business analysts are becoming more technical, with growing demand for skills in data analytics, process automation, and AI implementation. Specializations in digital transformation, agile business analysis, and data-driven BA roles are emerging as high-value career paths.',
    averageSalary: '$90,000',
    salaryRange: '$70,000 – $110,000',
    keySkills: ['Requirements gathering', 'Process modeling', 'Data analysis', 'Stakeholder management', 'SQL', 'Business process improvement', 'Documentation', 'Agile methodology'],
    roadmapSteps: [
      'Build strong analytical and communication skills',
      'Learn business process modeling (BPMN)',
      'Master Excel, SQL, and data visualization tools',
      'Get CBAP or PMI-PBA certification',
      'Gain experience in a business or IT role',
      'Develop domain expertise (finance, healthcare, tech)',
      'Build a portfolio of process improvement projects',
      'Advance to Senior BA or Product Owner roles',
    ],
    beginnerSkills: ['Requirements documentation', 'Process flowcharts', 'Excel analysis', 'Stakeholder interviews', 'Use case writing'],
    intermediateSkills: ['SQL queries', 'Data visualization', 'Agile/Scrum', 'Gap analysis', 'Business case development'],
    advancedSkills: ['Enterprise architecture', 'Change management', 'Strategic analysis', 'Digital transformation', 'Leadership & mentoring'],
    education: "Bachelor's in Business, IT, or related field; CBAP certification recommended",
    jobOutlook: 'Good — 11% growth with strong demand across all industries',
  },
  'graphic-designer': {
    role: 'Graphic Designer',
    sector: 'Arts',
    sectorId: BigInt(4),
    description:
      'Graphic Designers create visual content to communicate messages and ideas. They design logos, marketing materials, websites, packaging, and digital content using typography, color, and imagery. They work with clients and marketing teams to produce compelling visual solutions that meet brand and communication objectives.',
    marketGrowth:
      'Graphic design is growing at 3% annually. While traditional print design is declining, digital design, UX/UI, motion graphics, and brand identity work are expanding rapidly, creating new opportunities for designers who adapt to digital-first workflows.',
    futureScope:
      'The future of graphic design is increasingly digital and interactive. Motion design, 3D visualization, AR/VR experiences, and AI-assisted design tools are reshaping the field. Designers who combine traditional design principles with digital skills and AI tool proficiency will be most competitive.',
    averageSalary: '$65,000',
    salaryRange: '$45,000 – $85,000',
    keySkills: ['Adobe Creative Suite', 'Typography', 'Color theory', 'Brand identity', 'Layout design', 'Digital illustration', 'UI/UX basics', 'Client communication'],
    roadmapSteps: [
      'Learn design fundamentals (color, typography, composition)',
      'Master Adobe Photoshop, Illustrator, and InDesign',
      'Build a diverse design portfolio',
      'Learn Figma for UI/UX design',
      'Study branding and visual identity principles',
      'Freelance or intern to gain real-world experience',
      'Specialize in a niche (branding, motion, UX)',
      'Build client relationships and grow your practice',
    ],
    beginnerSkills: ['Basic Adobe tools', 'Color theory', 'Typography basics', 'Simple layouts', 'Image editing'],
    intermediateSkills: ['Brand identity design', 'Print production', 'Digital design', 'Illustration', 'Presentation design'],
    advancedSkills: ['Motion graphics', 'Art direction', 'Brand strategy', '3D design', 'Creative leadership'],
    education: "Bachelor's in Graphic Design, Visual Arts, or related field; strong portfolio is essential",
    jobOutlook: 'Moderate — 3% growth, but strong demand for digital and UX-focused designers',
  },
  'financial-analyst': {
    role: 'Financial Analyst',
    sector: 'Finance',
    sectorId: BigInt(3),
    description:
      'Financial Analysts evaluate investment opportunities, analyze financial data, and provide recommendations to help businesses and individuals make informed financial decisions. They prepare financial models, reports, and forecasts, and monitor economic trends and market conditions.',
    marketGrowth:
      'Financial analysis is growing at 9% annually, driven by increasing complexity in global financial markets, regulatory requirements, and the need for data-driven financial decision making across all industries.',
    futureScope:
      'Financial analysts are increasingly using AI and machine learning tools for predictive modeling and risk assessment. Specializations in ESG (Environmental, Social, Governance) investing, fintech, and quantitative analysis are growing rapidly. Data literacy is becoming as important as traditional financial skills.',
    averageSalary: '$102,000',
    salaryRange: '$75,000 – $130,000',
    keySkills: ['Financial modeling', 'Excel/VBA', 'Valuation techniques', 'Financial statement analysis', 'Bloomberg/Reuters', 'SQL', 'Presentation skills', 'Industry research'],
    roadmapSteps: [
      "Earn a Bachelor's in Finance, Accounting, or Economics",
      'Master Excel and financial modeling',
      'Learn financial statement analysis',
      'Pursue CFA Level 1 certification',
      'Gain experience through internships',
      'Develop industry expertise (tech, healthcare, energy)',
      'Complete CFA Level 2 and 3',
      'Advance to Senior Analyst or Portfolio Manager',
    ],
    beginnerSkills: ['Basic accounting', 'Excel fundamentals', 'Financial statement reading', 'Economic concepts', 'Research skills'],
    intermediateSkills: ['DCF modeling', 'Comparable company analysis', 'Industry analysis', 'Bloomberg terminal', 'Presentation of findings'],
    advancedSkills: ['Complex financial modeling', 'Portfolio management', 'Risk assessment', 'M&A analysis', 'Quantitative methods'],
    education: "Bachelor's in Finance/Accounting; CFA designation highly valued",
    jobOutlook: 'Good — 9% growth with strong compensation in investment banking and asset management',
  },
  'civil-engineer': {
    role: 'Civil Engineer',
    sector: 'Engineering',
    sectorId: BigInt(6),
    description:
      'Civil Engineers design, build, and maintain infrastructure including roads, bridges, buildings, water systems, and transportation networks. They apply engineering principles to solve complex infrastructure challenges while ensuring safety, sustainability, and cost-effectiveness.',
    marketGrowth:
      'Civil engineering is growing at 5% annually, driven by aging infrastructure replacement, urbanization, and increased investment in sustainable infrastructure and climate resilience projects.',
    futureScope:
      'Civil engineering is being transformed by smart infrastructure, sustainable design, and digital twin technology. Engineers who specialize in green infrastructure, resilient design, and smart city systems will be in high demand as governments invest in climate adaptation and modernization.',
    averageSalary: '$95,000',
    salaryRange: '$70,000 – $120,000',
    keySkills: ['Structural analysis', 'AutoCAD/BIM software', 'Project management', 'Environmental regulations', 'Geotechnical engineering', 'Construction management', 'Technical writing', 'Problem solving'],
    roadmapSteps: [
      "Earn a Bachelor's in Civil Engineering (ABET accredited)",
      'Gain internship experience during studies',
      'Pass the Fundamentals of Engineering (FE) exam',
      'Work as an Engineer-in-Training (EIT)',
      'Accumulate 4 years of professional experience',
      'Pass the Professional Engineering (PE) exam',
      'Specialize in structural, transportation, or environmental engineering',
      'Advance to project manager or principal engineer',
    ],
    beginnerSkills: ['Engineering mathematics', 'AutoCAD basics', 'Material properties', 'Technical drawing', 'Basic surveying'],
    intermediateSkills: ['Structural design', 'Project scheduling', 'Cost estimation', 'Environmental compliance', 'BIM software'],
    advancedSkills: ['Complex structural analysis', 'Project leadership', 'Sustainable design', 'Risk management', 'Expert testimony'],
    education: "Bachelor's in Civil Engineering; PE license required for independent practice",
    jobOutlook: 'Steady — 5% growth with strong demand for infrastructure and sustainability projects',
  },
};

// Default job data for unknown job IDs
const DEFAULT_JOB = {
  role: 'Career Professional',
  sector: 'General',
  sectorId: BigInt(1),
  description:
    'This career path offers diverse opportunities for growth and development. Professionals in this field apply specialized knowledge and skills to solve complex problems and create value for organizations and society.',
  marketGrowth: 'This field is experiencing steady growth driven by industry demand and technological advancement.',
  futureScope: 'Strong future prospects with emerging specializations and evolving skill requirements.',
  averageSalary: '$75,000',
  salaryRange: '$55,000 – $100,000',
  keySkills: ['Communication', 'Problem solving', 'Analytical thinking', 'Teamwork', 'Continuous learning'],
  roadmapSteps: [
    'Build foundational knowledge and skills',
    'Gain practical experience through internships',
    'Obtain relevant certifications',
    'Build a professional network',
    'Advance to senior roles',
  ],
  beginnerSkills: ['Core fundamentals', 'Basic tools', 'Communication', 'Time management', 'Research skills'],
  intermediateSkills: ['Advanced techniques', 'Project management', 'Specialization', 'Leadership basics', 'Industry knowledge'],
  advancedSkills: ['Expert-level skills', 'Strategic thinking', 'Mentoring', 'Innovation', 'Executive presence'],
  education: "Bachelor's degree in relevant field; professional certifications recommended",
  jobOutlook: 'Positive — steady demand with opportunities for advancement',
};

export default function JobDescriptionPage() {
  const pathParts = window.location.pathname.split('/');
  const jobId = decodeURIComponent(pathParts[pathParts.length - 1] || '');

  const job = JOB_DATA[jobId] || { ...DEFAULT_JOB, role: jobId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) };

  const { data: roadmaps } = useGetAvailableRoadmaps(job.sectorId);

  // Merge backend roadmap steps with local data
  const roadmapSteps =
    roadmaps && roadmaps.length > 0 && roadmaps[0].steps.length > 0
      ? roadmaps[0].steps
      : job.roadmapSteps;

  const sectorColors: Record<string, string> = {
    Technology: 'bg-blue-100 text-blue-700',
    Healthcare: 'bg-green-100 text-green-700',
    Business: 'bg-indigo-100 text-indigo-700',
    Finance: 'bg-yellow-100 text-yellow-700',
    Engineering: 'bg-gray-100 text-gray-700',
    Arts: 'bg-pink-100 text-pink-700',
    Commerce: 'bg-orange-100 text-orange-700',
    General: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Job Header */}
        <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 mb-6 shadow-xs animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center shadow-purple shrink-0">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-1">
                    {job.role}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={sectorColors[job.sector] || 'bg-purple-100 text-purple-700'}
                    >
                      {job.sector}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{job.education}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-bold text-2xl text-primary">{job.averageSalary}</p>
                  <p className="text-xs text-muted-foreground">avg. salary/year</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-lg">
                <TrendingUp className="w-4 h-4" />
                {job.jobOutlook.split('—')[0].trim()}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Job Outlook</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">{job.salaryRange}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Salary Range</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-primary">{job.sector}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Industry</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Job Description */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">{job.description}</p>
            </CardContent>
          </Card>

          {/* 2. Market Growth */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
                Job Growth in Market
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">{job.marketGrowth}</p>
            </CardContent>
          </Card>

          {/* 3. Future Scope */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Telescope className="w-4 h-4 text-blue-600" />
                </div>
                Future Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">{job.futureScope}</p>
            </CardContent>
          </Card>

          {/* 4. Average Salary */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                </div>
                Average Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <p className="font-display font-bold text-3xl text-primary">{job.averageSalary}</p>
                  <p className="text-xs text-muted-foreground mt-1">Average annual salary</p>
                </div>
                <div className="h-12 w-px bg-border hidden sm:block" />
                <div>
                  <p className="font-semibold text-foreground">{job.salaryRange}</p>
                  <p className="text-xs text-muted-foreground mt-1">Typical salary range</p>
                </div>
                <div className="h-12 w-px bg-border hidden sm:block" />
                <div>
                  <p className="font-semibold text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {job.jobOutlook.split('—')[0].trim()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Job outlook</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Roadmap */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                Career Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RoadmapTimeline steps={roadmapSteps} />
            </CardContent>
          </Card>

          {/* 6. Key Skills */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                Key Skills Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.keySkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-0 text-xs py-1 px-3"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 7. Skill Levels */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                </div>
                Skills by Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Beginner */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <h4 className="font-semibold text-sm text-green-700">Beginner</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {job.beginnerSkills.map((skill) => (
                      <li key={skill} className="flex items-start gap-1.5 text-xs text-green-800">
                        <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Intermediate */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h4 className="font-semibold text-sm text-blue-700">Intermediate</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {job.intermediateSkills.map((skill) => (
                      <li key={skill} className="flex items-start gap-1.5 text-xs text-blue-800">
                        <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Advanced */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h4 className="font-semibold text-sm text-primary">Advanced</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {job.advancedSkills.map((skill) => (
                      <li key={skill} className="flex items-start gap-1.5 text-xs text-purple-800">
                        <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="gradient-purple text-white font-semibold shadow-purple hover:shadow-purple-lg transition-all"
          >
            <a href="/skill-assessment">Take Skill Assessment</a>
          </Button>
          <Button variant="outline" asChild className="border-primary/30 text-primary hover:bg-primary/5">
            <a href="/job-search">Explore More Jobs</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
